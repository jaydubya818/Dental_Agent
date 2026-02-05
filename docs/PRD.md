# Jerome's Dental Front-Office Agent
## Product Requirements Document (PRD)

---

## Executive Summary

Jerome's Dental Front-Office Agent is an AI-driven "Morning Huddle" automation platform for dental practices. It acts as an intelligence layer on top of legacy Practice Management Systems (PMS) like Dentrix/Eaglesoft, using a hybrid on-premises/cloud architecture to ensure HIPAA compliance while delivering powerful AI-driven insights.

The system automatically generates role-specific daily briefs, identifies clinical and financial risks, and surfaces revenue opportunities—all while maintaining strict patient data privacy through on-premises PHI sanitization.

---

## 1. Product Vision

### 1.1 Core Concept

An AI-driven "Morning Huddle" automation platform for dental practices. It acts as an intelligence layer that sits on top of legacy Practice Management Systems (PMS) like Dentrix/Eaglesoft without requiring direct API cooperation (uses screen-scraping/OCR if needed).

### 1.2 Core Value Proposition

- **Automated Morning Huddle:** Generates a concise daily brief for the team (Dentists, Hygienists, Admin).
- **Zero-Integration Data Capture:** Capable of running a local "Agent" on-premise to screen-scrape or query local DBs, then send sanitized metadata to the cloud.
- **Risk Flagging:** Proactively identifies medical risks (allergies), financial risks (unpaid balances), and scheduling gaps.

### 1.3 User Personas

1. **Dr. David (Dentist):** Needs clinical context, revenue opportunities (e.g., unscheduled crowns), and medical alerts.
2. **Haley (Hygienist):** Needs X-ray due dates, perio charting gaps, and anxiety alerts.
3. **Rachel (Front Desk):** Needs prioritized tasks, payment collection alerts, and schedule hole filling.
4. **Michael (Manager):** Needs production vs. goal metrics and staff coverage assurance.

---

## 2. Technical Architecture

### 2.1 Hybrid Deployment Model

To satisfy HIPAA and legacy integration, the system uses a split architecture:

**On-Premises Agent (The "Hand"):**
- A lightweight Python/Docker service running on the dental office server
- Connects to PMS (Dentrix/Eaglesoft)
- Runs local screen scraping/OCR
- De-identifies PHI before sending to cloud
- Pushes sanitized JSON to Cloud API

**Cloud Control Plane (The "Brain"):**
- SaaS platform hosting the AI and dashboard
- LLM inference and business logic
- Web Dashboard delivery
- Authentication and authorization
- Aggregated reporting across practices

### 2.2 Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js (React), Tailwind CSS, Shadcn/UI |
| Backend (Cloud) | Python (FastAPI) |
| Backend (Local Agent) | Python, Selenium/Playwright, PyInstaller |
| Database (Cloud) | PostgreSQL (Supabase or AWS RDS) |
| Database (Local) | SQLite for caching |
| AI Orchestration | LangGraph (stateful agent flows) |
| LLMs | Azure OpenAI (GPT-4) for HIPAA BAA compliance |
| Local AI | Mistral for on-prem PII filtering |

### 2.3 Data Flow

1. **Trigger:** 6:00 AM Local Agent wakes up via scheduled task
2. **Extract:** Agent scrapes daily schedule from PMS
3. **Sanitize:** Agent hashes/tokenizes sensitive PII (SSN, etc.) locally
4. **Upload:** Agent sends sanitized JSON payload to Cloud API (TLS 1.3)
5. **Process:** Cloud HuddleAgent analyzes payload, generates summaries via LLM
6. **Display:** Staff logs into Next.js Dashboard to view "Morning Huddle"

### 2.4 Security & Compliance (HIPAA)

- **Audit Trails:** Every DB read/write and AI inference logged in immutable `audit_log` table
- **Encryption:** AES-256 at rest, TLS 1.3 in transit
- **Role-Based Access Control (RBAC):** Strict roles (Provider, Admin, Staff)
- **PHI Minimization:** All PHI processed on-premises; only de-identified data in cloud

---

## 3. Agent Workflow Design (LangGraph)

### 3.1 Master Agent: HuddleSupervisor

The HuddleSupervisor orchestrates the flow of creating the morning brief, coordinating four specialized sub-agents.

### 3.2 Sub-Agents

**IngestionAgent:**
- Input: Raw text/CSV/JSON from local agent
- Task: Normalizes data into ScheduleSchema, fixes messy OCR text
- Output: Clean, structured patient appointment list

**RiskScannerAgent:**
- Input: Normalized Patient List
- Task: Checks against Rules Engine (e.g., "If Age > 60 AND Procedure = Surgery -> Check for Blood Thinners")
- Output: List of RiskFlags with severity levels

**RevenueAgent:**
- Input: Patient History and current schedule
- Task: Identifies "Unscheduled Treatment" opportunities
- Output: List of revenue opportunities with estimated values

**WriterAgent:**
- Input: Schedule + RiskFlags + Opportunities
- Task: Generates 3 distinct summaries (Clinical, Hygiene, Admin)
- Output: Role-specific morning huddle briefs

### 3.3 Data Structures

```python
class PatientAppt(BaseModel):
    id: str
    time_slot: datetime
    patient_name: str  # Tokenized in cloud
    procedure_code: str
    provider_id: str
    notes: str

class RiskFlag(BaseModel):
    level: Literal["CRITICAL", "WARN", "INFO"]
    category: Literal["MEDICAL", "FINANCIAL", "SCHEDULING"]
    message: str

class RevenueOpportunity(BaseModel):
    patient_id: str
    treatment_type: str
    estimated_value: float
    priority: Literal["HIGH", "MEDIUM", "LOW"]

class MorningHuddle(BaseModel):
    date: date
    practice_id: str
    clinical_summary: str
    hygiene_summary: str
    admin_summary: str
    risk_flags: List[RiskFlag]
    opportunities: List[RevenueOpportunity]
```

---

## 4. MVP Functional Requirements (Phase 1)

### 4.1 Local Agent Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| LA-1 | Support CSV file upload for schedule data | High |
| LA-2 | Support direct Dentrix database query (ODBC) | High |
| LA-3 | Implement screen scraping fallback using Playwright | Medium |
| LA-4 | Hash/tokenize all PII before cloud transmission | High |
| LA-5 | Run as Windows service with 6 AM scheduled trigger | High |
| LA-6 | Cache last 7 days of data in local SQLite | Medium |
| LA-7 | Compile to standalone .exe using PyInstaller | Medium |
| LA-8 | Implement secure API key storage | High |

### 4.2 Cloud Backend Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| CB-1 | FastAPI endpoint for schedule data ingestion | High |
| CB-2 | JWT-based authentication with role claims | High |
| CB-3 | PostgreSQL schema for practices, users, schedules | High |
| CB-4 | Immutable audit log for all operations | High |
| CB-5 | LangGraph agent orchestration integration | High |
| CB-6 | Azure OpenAI GPT-4 integration | High |
| CB-7 | Rate limiting and request validation | Medium |
| CB-8 | Multi-tenant data isolation | High |

### 4.3 Frontend Dashboard Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FE-1 | Role-based login (Dentist, Hygienist, Admin, Manager) | High |
| FE-2 | Morning Huddle summary view per role | High |
| FE-3 | Risk flag display with severity indicators | High |
| FE-4 | Revenue opportunity cards with actions | Medium |
| FE-5 | Daily schedule timeline view | High |
| FE-6 | Chat interface for Q&A about today's schedule | Medium |
| FE-7 | Mobile-responsive design | Medium |
| FE-8 | Dark mode support | Low |
| FE-9 | Task inbox with prioritized list per role | High |
| FE-10 | Real-time notifications and alerts | Medium |
| FE-11 | Patient check-in/check-out status indicators | Medium |

### 4.4 Intelligent Task Routing Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| TR-1 | Task inbox per role with prioritized queue | High |
| TR-2 | AI-driven task prioritization based on deadlines/urgency | High |
| TR-3 | Auto-assignment of tasks to least-busy staff (configurable) | Medium |
| TR-4 | Task escalation when approaching deadline | Medium |
| TR-5 | Task types: appointment confirms, insurance verification, recalls | High |
| TR-6 | Task completion tracking with timestamps | High |
| TR-7 | Manager view of all outstanding tasks across staff | High |
| TR-8 | Integration with PMS for data lookup within tasks | Medium |

### 4.5 AI Agent Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| AI-1 | IngestionAgent: Normalize messy OCR/CSV data | High |
| AI-2 | RiskScannerAgent: Medical risk rule engine | High |
| AI-3 | RiskScannerAgent: Financial risk detection | High |
| AI-4 | RevenueAgent: Unscheduled treatment identification | Medium |
| AI-5 | WriterAgent: Generate role-specific summaries | High |
| AI-6 | HuddleSupervisor: Orchestrate agent flow | High |
| AI-7 | No-show prediction model (ML-based) | Low |
| AI-8 | Chat assistant with retrieval-augmented generation | Medium |

---

## 5. User Stories

### 5.1 Dr. David (Dentist) Stories

- **US-D1:** As a dentist, I want to see a clinical summary of today's patients so I can prepare for procedures.
- **US-D2:** As a dentist, I want to be alerted about patients with medical risks (allergies, blood thinners) before I see them.
- **US-D3:** As a dentist, I want to see unscheduled treatment opportunities to discuss with patients.
- **US-D4:** As a dentist, I want to ask questions about a specific patient's history through a chat interface.

### 5.2 Haley (Hygienist) Stories

- **US-H1:** As a hygienist, I want to see X-ray due dates for today's patients.
- **US-H2:** As a hygienist, I want to know which patients have anxiety flags.
- **US-H3:** As a hygienist, I want to see perio charting gaps that need follow-up.
- **US-H4:** As a hygienist, I want a quick summary of each patient before their appointment.

### 5.3 Rachel (Front Desk) Stories

- **US-R1:** As front desk, I want a prioritized task list for the day.
- **US-R2:** As front desk, I want to see patients with outstanding balances to collect.
- **US-R3:** As front desk, I want alerts about schedule gaps I can fill.
- **US-R4:** As front desk, I want to quickly confirm insurance eligibility status.

### 5.4 Michael (Manager) Stories

- **US-M1:** As a manager, I want to see production vs. goal metrics for the day.
- **US-M2:** As a manager, I want assurance that all staff positions are covered.
- **US-M3:** As a manager, I want historical trend data on practice performance.
- **US-M4:** As a manager, I want to configure risk rules and thresholds.

---

## 6. Project Structure

```
jerome-dental/
├── apps/
│   ├── web/                    # Next.js Frontend Dashboard
│   │   ├── app/
│   │   │   ├── (auth)/         # Login, Register
│   │   │   ├── (dashboard)/    # Role-based dashboards
│   │   │   └── api/            # API routes (if needed)
│   │   ├── components/
│   │   │   ├── ui/             # Shadcn/UI components
│   │   │   ├── huddle/         # Morning huddle components
│   │   │   └── chat/           # Chat interface
│   │   └── lib/
│   │       ├── api/            # API client
│   │       └── auth/           # Auth utilities
│   │
│   ├── api/                    # FastAPI Cloud Backend
│   │   ├── app/
│   │   │   ├── main.py         # FastAPI entry point
│   │   │   ├── routers/        # API route handlers
│   │   │   ├── models/         # SQLAlchemy models
│   │   │   ├── schemas/        # Pydantic schemas
│   │   │   ├── services/       # Business logic
│   │   │   └── agents/         # LangGraph agents
│   │   │       ├── graph.py    # HuddleSupervisor
│   │   │       ├── ingestion.py
│   │   │       ├── risk_scanner.py
│   │   │       ├── revenue.py
│   │   │       └── writer.py
│   │   └── tests/
│   │
│   └── local-agent/            # On-Premises Python Agent
│       ├── src/
│       │   ├── main.py         # Entry point
│       │   ├── extractors/     # PMS data extractors
│       │   ├── sanitizers/     # PHI sanitization
│       │   └── uploader/       # Cloud API client
│       └── tests/
│
└── packages/
    └── shared/                 # Shared Pydantic models
        ├── schemas/
        │   ├── patient.py
        │   ├── schedule.py
        │   ├── risk.py
        │   └── huddle.py
        └── utils/
```

---

## 7. Security & Compliance Requirements

### 7.1 HIPAA Compliance

- All PHI must be processed on-premises before cloud transmission
- PII hashing using SHA-256 with practice-specific salt
- Immutable audit logs for all data access
- Business Associate Agreement (BAA) with Azure OpenAI
- Annual security assessments and penetration testing

### 7.2 Data Encryption

- At rest: AES-256 encryption for all databases
- In transit: TLS 1.3 for all API communications
- Key management: AWS KMS or Azure Key Vault

### 7.3 Access Control

- Role-Based Access Control (RBAC) with four roles: Provider, Hygienist, Admin, Manager
- JWT tokens with role claims and 15-minute expiry
- Refresh tokens with 7-day expiry
- MFA required for Manager role
- IP allowlisting for on-premises agents

### 7.4 Audit Requirements

- Log all authentication events
- Log all data access events
- Log all AI inference requests and responses
- Retain logs for 7 years
- Logs must be immutable (append-only)

---

## 8. Success Criteria

### 8.1 MVP Launch Criteria

- [ ] Local agent successfully extracts schedule from Dentrix
- [ ] PHI properly sanitized before cloud transmission
- [ ] Morning huddle generated within 5 minutes of data ingestion
- [ ] Role-specific dashboards display correct information
- [ ] All HIPAA requirements documented and implemented
- [ ] Zero critical security vulnerabilities in penetration test

### 8.2 Performance Metrics

- Schedule extraction: < 30 seconds
- Cloud processing (ingestion to huddle): < 2 minutes
- Dashboard load time: < 2 seconds
- API response time: < 200ms (95th percentile)

### 8.3 User Adoption Metrics

- 80% of staff using dashboard within 30 days
- Morning huddle review rate > 90%
- User satisfaction score > 4.0/5.0

---

## 9. Milestones & Timeline

### Phase 1: Foundation (Weeks 1-4)
- Project structure and monorepo setup
- Database schema design
- Authentication system
- Basic FastAPI endpoints

### Phase 2: Local Agent (Weeks 5-8)
- Dentrix integration
- PHI sanitization pipeline
- Scheduled data extraction
- Cloud API communication

### Phase 3: AI Agents (Weeks 9-12)
- LangGraph setup
- IngestionAgent implementation
- RiskScannerAgent implementation
- WriterAgent implementation

### Phase 4: Dashboard (Weeks 13-16)
- Role-based authentication UI
- Morning huddle display
- Risk and opportunity views
- Chat interface

### Phase 5: Polish & Launch (Weeks 17-20)
- End-to-end testing
- Security audit
- Performance optimization
- Beta launch with 3 practices

---

## 10. Competitive Differentiators

### 10.1 Why Jerome's Dental Agent Wins

| Differentiator | Description | Competitor Gap |
|----------------|-------------|----------------|
| **Comprehensive Front-Office Focus** | Blends administrative automation with intelligent insights in one platform | Competitors offer analytics OR clinical AI, not both |
| **LLM-Powered Chat Interface** | Natural language Q&A dramatically lowers learning curve | Most dental software requires many clicks |
| **Hybrid Deployment** | Both cloud SaaS and on-prem options for data-sensitive practices | Many AI solutions are cloud-only |
| **Vendor-Agnostic Integration** | Works with any PMS via API, database, or screen scraping | Competitors require specific systems |
| **Proactive Task Orchestration** | Actively manages and prioritizes tasks, not just displays data | Dashboards are passive |
| **HIPAA-First Architecture** | Compliance baked in from day one with full audit trails | Many treat compliance as afterthought |

### 10.2 Competitive Landscape

| Competitor | Focus | Our Advantage |
|------------|-------|---------------|
| **Dental Intelligence** | Analytics dashboards, Morning Huddle reports | We add AI automation + task routing + chat |
| **Overjet** | X-ray analysis, clinical AI | We focus on front-office operations, not diagnostics |
| **Arini** | AI phone receptionist | We cover full daily operations, not just calls |
| **Practice by Numbers** | KPI dashboards | We provide actionable automation, not just metrics |

---

## 11. Future Features (Post-MVP)

### 11.1 Phase 2+ Roadmap

| Feature | Description | Target Phase |
|---------|-------------|--------------|
| **Automated Patient Outreach** | AI-drafted recall texts/emails for overdue patients | Phase 2 |
| **No-Show Prediction** | ML model predicts cancellation risk, suggests overbooking | Phase 2 |
| **Insurance Automation** | Auto-verify eligibility, pre-auth checks | Phase 3 |
| **Voice Interface** | Hands-free queries ("Hey Jerome, who's next?") | Phase 3 |
| **Multi-Site Analytics** | Centralized DSO dashboard across locations | Phase 2 |
| **Patient Portal Chat** | AI chatbot for patient-facing appointment Q&A | Phase 3 |
| **Treatment Plan Acceptance** | Track and nudge on unscheduled treatment | Phase 2 |

### 11.2 Adjacent Market Expansion

The platform architecture supports expansion to:
- **Medical Clinics**: Similar front-office coordination needs
- **Veterinary Offices**: Same scheduling/risk/revenue patterns
- **Optometry Clinics**: Appointment-heavy, similar workflows

Core platform remains the same; only connectors and terminology change.

---

## 12. Monetization Strategy Overview

### 12.1 Pricing Model

| Tier | Target | Approx. Price | Features |
|------|--------|---------------|----------|
| **Basic** | Solo practice | ~$200-300/mo | Morning huddle, basic task list, limited chat |
| **Professional** | Multi-provider | ~$400-500/mo | Full AI features, task routing, analytics |
| **Enterprise** | DSO (5+ sites) | Custom quote | Multi-site, on-prem option, dedicated support |

### 12.2 Value Proposition

- **ROI Example**: Capturing 1 extra crown/month (~$1,000+ revenue) pays for the platform
- **Time Savings**: 1-2 hours/day in morning prep and coordination
- **Risk Reduction**: Fewer missed allergies, payment issues, no-shows

### 12.3 Go-to-Market Phases

1. **Pilot (Month 1-3)**: 2-3 friendly practices, free/discounted, gather feedback
2. **Beta (Month 4-6)**: 10-15 practices, test pricing, refine onboarding
3. **Launch (Month 7+)**: General availability, paid subscriptions, sales outreach

---

## 13. Appendix

### A. Glossary

- **PMS:** Practice Management System (e.g., Dentrix, Eaglesoft)
- **PHI:** Protected Health Information
- **HIPAA:** Health Insurance Portability and Accountability Act
- **BAA:** Business Associate Agreement
- **RBAC:** Role-Based Access Control
- **LangGraph:** Framework for building stateful AI agent workflows

### B. Risk Rules Examples

```python
RISK_RULES = [
    {
        "id": "MED-001",
        "name": "Blood Thinner Alert",
        "condition": "age > 60 AND procedure_type IN ['extraction', 'surgery']",
        "action": "Check for blood thinner medications",
        "severity": "CRITICAL"
    },
    {
        "id": "MED-002", 
        "name": "Allergy Alert",
        "condition": "allergies IS NOT EMPTY",
        "action": "Display allergy list prominently",
        "severity": "CRITICAL"
    },
    {
        "id": "FIN-001",
        "name": "Outstanding Balance",
        "condition": "balance > 500",
        "action": "Flag for payment collection",
        "severity": "WARN"
    },
    {
        "id": "SCH-001",
        "name": "No-Show Risk",
        "condition": "no_show_count > 2 in last_12_months",
        "action": "Confirm appointment day before",
        "severity": "WARN"
    }
]
```

### C. API Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/login | User authentication |
| POST | /api/v1/auth/refresh | Token refresh |
| POST | /api/v1/schedule/ingest | Receive schedule from local agent |
| GET | /api/v1/huddle/{date} | Get morning huddle for date |
| GET | /api/v1/huddle/{date}/summary/{role} | Get role-specific summary |
| GET | /api/v1/patients/{id}/risks | Get patient risk flags |
| GET | /api/v1/opportunities | Get revenue opportunities |
| POST | /api/v1/chat/query | Chat Q&A endpoint |
| GET | /api/v1/audit/logs | Get audit logs (manager only) |

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [APP_FLOW.md](./APP_FLOW.md) | User navigation paths |
| [TECH_STACK.md](./TECH_STACK.md) | Locked dependency versions |
| [FRONTEND_GUIDELINES.md](./FRONTEND_GUIDELINES.md) | Design system |
| [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md) | DB schema & API contracts |
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | Build sequence |
