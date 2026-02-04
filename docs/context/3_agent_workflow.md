# Agentic Workflow (LangGraph)

## Master Agent: "HuddleSupervisor"

Orchestrates the flow of creating the morning brief.

## Sub-Agents (Nodes):

1. **IngestionAgent:**
   - *Input:* Raw text/CSV/JSON from local agent.
   - *Task:* Normalizes data into `ScheduleSchema`. Fixes messy OCR text.

2. **RiskScannerAgent:**
   - *Input:* Normalized Patient List.
   - *Task:* Checks against Rules Engine (e.g., "If Age > 60 AND Procedure = Surgery -> Check for Blood Thinners").
   - *Output:* List of `RiskFlags`.

3. **RevenueAgent:**
   - *Input:* Patient History.
   - *Task:* Identifies "Unscheduled Treatment" opportunities.

4. **WriterAgent:**
   - *Input:* Schedule + RiskFlags + Opportunities.
   - *Task:* Generates 3 distinct summaries (Clinical, Hygiene, Admin) using concise, professional tone.

## Data Structures (Pydantic)

```python
class PatientAppt(BaseModel):
    id: str
    time_slot: datetime
    patient_name: str  # Tokenized in cloud
    procedure_code: str
    provider_id: str
    notes: str

class RiskFlag(BaseModel):
    level: Enum("CRITICAL", "WARN", "INFO")
    category: Enum("MEDICAL", "FINANCIAL", "SCHEDULING")
    message: str
```

## State Graph Flow

```
┌─────────────────┐
│  IngestionAgent │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ RiskScannerAgent│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  RevenueAgent   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   WriterAgent   │
└─────────────────┘
```
