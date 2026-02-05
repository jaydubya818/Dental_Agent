# Agentic Workflow (LangGraph)

> This document defines the complete LangGraph agent orchestration for the Morning Huddle generation pipeline.

---

## Master Agent: "HuddleSupervisor"

Orchestrates the flow of creating the morning brief using LangGraph's StateGraph pattern.

---

## LangGraph State Schema

The shared state object that flows through all agents:

```python
from typing import TypedDict, List, Optional, Annotated
from datetime import date
from operator import add

class HuddleState(TypedDict):
    """
    Shared state for the HuddleSupervisor graph.
    Each agent reads from and writes to specific fields.
    """
    
    # ── Input (set at graph invocation) ──
    practice_id: str
    schedule_date: date
    raw_data: dict  # Sanitized JSON from local agent
    
    # ── IngestionAgent output ──
    appointments: List[dict]  # Normalized PatientAppt objects
    ingestion_errors: List[str]  # OCR/parsing issues
    
    # ── RiskScannerAgent output ──
    risk_flags: List[dict]  # RiskFlag objects
    rules_evaluated: int  # Count for telemetry
    
    # ── RevenueAgent output ──
    opportunities: List[dict]  # RevenueOpportunity objects
    total_opportunity_value: float
    
    # ── WriterAgent output ──
    clinical_summary: Optional[str]
    hygiene_summary: Optional[str]
    admin_summary: Optional[str]
    
    # ── Metadata ──
    current_step: str  # For debugging: "ingestion" | "risk" | "revenue" | "writer"
    errors: Annotated[List[str], add]  # Accumulated errors (uses reducer)
    started_at: str  # ISO timestamp
    completed_at: Optional[str]
```

---

## Sub-Agents (Nodes)

### 1. IngestionAgent

```python
async def ingestion_node(state: HuddleState) -> HuddleState:
    """
    Normalizes raw schedule data into structured appointments.
    
    Input:  state.raw_data (dict from local agent)
    Output: state.appointments (List[PatientAppt])
    """
    # - Parse raw JSON/CSV structure
    # - Fix OCR text issues (common typos, formatting)
    # - Validate procedure codes against known list
    # - Tokenize patient names if not already done
    # - Handle missing fields gracefully
```

**Error Handling:**
- Missing required fields → Add to `ingestion_errors`, continue with partial data
- Invalid procedure code → Flag as "UNKNOWN", add warning
- Date/time parsing failure → Use fallback or skip appointment

---

### 2. RiskScannerAgent

```python
async def risk_scanner_node(state: HuddleState) -> HuddleState:
    """
    Evaluates appointments against configurable risk rules.
    
    Input:  state.appointments
    Output: state.risk_flags (List[RiskFlag])
    """
    # - Load practice-specific rules from settings
    # - Evaluate each appointment against each enabled rule
    # - Generate RiskFlag objects with severity and category
    # - Sort by severity (CRITICAL first)
```

**Rule Categories:**
- `MEDICAL`: Blood thinners, allergies, age + procedure combinations
- `FINANCIAL`: Outstanding balances, payment history
- `SCHEDULING`: No-show patterns, late arrival history

---

### 3. RevenueAgent

```python
async def revenue_node(state: HuddleState) -> HuddleState:
    """
    Identifies revenue opportunities from patient context.
    
    Input:  state.appointments (with patient history context)
    Output: state.opportunities (List[RevenueOpportunity])
    """
    # - Check for unscheduled treatments in patient history
    # - Calculate estimated values
    # - Generate talking points for each opportunity
    # - Prioritize by value and likelihood
```

**Opportunity Types:**
- Unscheduled crowns, implants, whitening
- Overdue hygiene appointments
- Expired treatment plans

---

### 4. WriterAgent

```python
async def writer_node(state: HuddleState) -> HuddleState:
    """
    Generates role-specific summaries using Azure OpenAI.
    
    Input:  state.appointments, state.risk_flags, state.opportunities
    Output: state.clinical_summary, state.hygiene_summary, state.admin_summary
    """
    # - Build context from appointments + flags + opportunities
    # - Call Azure OpenAI with role-specific prompts
    # - Apply tone/length constraints
    # - Handle LLM failures gracefully
```

**Prompt Templates:**

```python
CLINICAL_PROMPT = """
You are a dental practice assistant preparing the morning huddle for Dr. {provider_name}.
Today's date: {date}
Total patients: {patient_count}

Appointments:
{appointments_context}

Risk Flags:
{risk_flags_context}

Revenue Opportunities:
{opportunities_context}

Generate a concise clinical summary (2-3 paragraphs) highlighting:
1. Key procedures and preparation needed
2. Critical medical alerts to review
3. Revenue opportunities to discuss with patients

Use professional, clinical language.
"""

HYGIENE_PROMPT = """..."""  # Focus on X-rays, perio, anxiety flags
ADMIN_PROMPT = """..."""    # Focus on collections, scheduling, tasks
```

---

## Graph Definition

```python
from langgraph.graph import StateGraph, END

def create_huddle_graph() -> StateGraph:
    """
    Creates the HuddleSupervisor state graph.
    """
    graph = StateGraph(HuddleState)
    
    # Add nodes
    graph.add_node("ingestion", ingestion_node)
    graph.add_node("risk_scanner", risk_scanner_node)
    graph.add_node("revenue", revenue_node)
    graph.add_node("writer", writer_node)
    
    # Define edges (linear flow)
    graph.set_entry_point("ingestion")
    graph.add_edge("ingestion", "risk_scanner")
    graph.add_edge("risk_scanner", "revenue")
    graph.add_edge("revenue", "writer")
    graph.add_edge("writer", END)
    
    return graph.compile()

# Invoke the graph
huddle_graph = create_huddle_graph()
result = await huddle_graph.ainvoke({
    "practice_id": "uuid",
    "schedule_date": date.today(),
    "raw_data": sanitized_schedule_json,
    "errors": [],
    "started_at": datetime.utcnow().isoformat(),
})
```

---

## State Graph Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    HuddleSupervisor                         │
│                                                             │
│  ┌─────────────────┐                                        │
│  │  IngestionAgent │ ─── Normalizes raw schedule data       │
│  └────────┬────────┘                                        │
│           │ appointments[]                                  │
│           ▼                                                 │
│  ┌─────────────────┐                                        │
│  │ RiskScannerAgent│ ─── Evaluates risk rules               │
│  └────────┬────────┘                                        │
│           │ risk_flags[]                                    │
│           ▼                                                 │
│  ┌─────────────────┐                                        │
│  │  RevenueAgent   │ ─── Finds upsell opportunities         │
│  └────────┬────────┘                                        │
│           │ opportunities[]                                 │
│           ▼                                                 │
│  ┌─────────────────┐                                        │
│  │   WriterAgent   │ ─── Generates role summaries           │
│  └────────┬────────┘                                        │
│           │ clinical_summary, hygiene_summary, admin_summary│
│           ▼                                                 │
│        [END]                                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Error Handling Strategy

| Agent | Error Type | Recovery |
|-------|------------|----------|
| IngestionAgent | Missing field | Add warning, use defaults |
| IngestionAgent | Parse failure | Log error, skip appointment |
| RiskScannerAgent | Rule evaluation error | Log, continue with other rules |
| RevenueAgent | History lookup failure | Skip opportunity detection |
| WriterAgent | LLM timeout | Retry 3x with backoff |
| WriterAgent | LLM error | Generate basic summary from data |

---

## Telemetry & Observability

Each node should log:
- Entry timestamp
- Input record count
- Output record count
- Duration (ms)
- Errors encountered

```python
import structlog
logger = structlog.get_logger()

async def ingestion_node(state: HuddleState) -> HuddleState:
    start = time.time()
    logger.info("ingestion_start", practice_id=state["practice_id"])
    
    # ... processing ...
    
    logger.info(
        "ingestion_complete",
        practice_id=state["practice_id"],
        appointments_count=len(state["appointments"]),
        errors_count=len(state["ingestion_errors"]),
        duration_ms=int((time.time() - start) * 1000)
    )
    return state
```

---

## Cross-References

- **Data structures**: See [PRD.md - Section 3.3](../PRD.md)
- **Risk rules config**: See [BACKEND_STRUCTURE.md - Practice Settings](../BACKEND_STRUCTURE.md)
- **API endpoint**: See [BACKEND_STRUCTURE.md - POST /schedule/ingest](../BACKEND_STRUCTURE.md)
