# Jerome's Dental Front-Office Agent

<p align="center">
  <strong>AI-driven "Morning Huddle" automation platform for dental practices</strong><br/>
  <em>HIPAA-compliant hybrid architecture with LangGraph agent orchestration</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/LangGraph-AI_Agents-blue?style=for-the-badge" alt="LangGraph" />
  <img src="https://img.shields.io/badge/HIPAA-Compliant-green?style=for-the-badge" alt="HIPAA" />
</p>

---

## Overview

Jerome's Dental Front-Office Agent is an AI-powered platform that automates the daily "Morning Huddle" for dental practices. It acts as an intelligence layer on top of legacy Practice Management Systems (PMS) like Dentrix and Eaglesoft, using a hybrid on-premises/cloud architecture to ensure HIPAA compliance while delivering powerful AI-driven insights.

### Core Value Proposition

- **Automated Morning Huddle**: Generates concise daily briefs tailored for each team role
- **Zero-Integration Data Capture**: On-premises agent extracts data via screen-scraping, ODBC, or CSV without requiring PMS API cooperation
- **Proactive Risk Flagging**: Identifies medical risks (allergies, blood thinners), financial risks (unpaid balances), and scheduling gaps
- **Revenue Optimization**: Surfaces unscheduled treatment opportunities with talking points

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DENTAL OFFICE (On-Premises)                        │
│  ┌─────────────────┐    ┌─────────────────────────────────────────────────┐ │
│  │  Dentrix/       │    │            Local Agent (Python)                 │ │
│  │  Eaglesoft      │───▶│  • PMS Data Extraction (ODBC/Playwright/CSV)    │ │
│  │  (PMS)          │    │  • PHI Sanitization (SHA-256 hashing)           │ │
│  └─────────────────┘    │  • Secure Upload (TLS 1.3)                      │ │
│                         └──────────────────────┬──────────────────────────┘ │
└────────────────────────────────────────────────┼────────────────────────────┘
                                                 │ Sanitized JSON
                                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLOUD (SaaS Platform)                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                         FastAPI Backend                                  ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    ││
│  │  │ /schedule   │  │ /huddle     │  │ /chat       │  │ /auth       │    ││
│  │  │ ingest      │  │ retrieve    │  │ Q&A         │  │ JWT/RBAC    │    ││
│  │  └──────┬──────┘  └──────▲──────┘  └──────▲──────┘  └─────────────┘    ││
│  │         │                │                │                              ││
│  │         ▼                │                │                              ││
│  │  ┌──────────────────────────────────────────────────────────────────┐   ││
│  │  │                    LangGraph Agent Orchestration                  │   ││
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │   ││
│  │  │  │ Ingestion    │─▶│ RiskScanner  │─▶│ Revenue      │            │   ││
│  │  │  │ Agent        │  │ Agent        │  │ Agent        │            │   ││
│  │  │  └──────────────┘  └──────────────┘  └──────┬───────┘            │   ││
│  │  │                                             │                     │   ││
│  │  │                                             ▼                     │   ││
│  │  │                                      ┌──────────────┐            │   ││
│  │  │                      HuddleSupervisor│ Writer       │            │   ││
│  │  │                                      │ Agent        │            │   ││
│  │  │                                      └──────────────┘            │   ││
│  │  └──────────────────────────────────────────────────────────────────┘   ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │  PostgreSQL     │  │  Azure OpenAI   │  │  Next.js Dashboard          │  │
│  │  (Audit Logs)   │  │  GPT-4 (HIPAA)  │  │  (Role-based views)         │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
jerome-dental/
├── CLAUDE.md                    # 🤖 AI operating manual (read first every session)
├── progress.txt                 # 📝 Session state tracker
├── package.json                 # npm workspaces configuration
├── README.md                    # This file
├── .gitignore                   # Git ignore rules
│
├── docs/                        # 📚 Canonical Documentation
│   ├── PRD.md                   # Product requirements (full spec)
│   ├── APP_FLOW.md              # Screen inventory & user flows
│   ├── TECH_STACK.md            # Locked dependency versions
│   ├── FRONTEND_GUIDELINES.md   # Design system (colors, typography, spacing)
│   ├── BACKEND_STRUCTURE.md     # Database schema & API contracts
│   ├── IMPLEMENTATION_PLAN.md   # Step-by-step build sequence
│   └── context/                 # Original source context files
│       ├── 1_product_vision.md
│       ├── 2_technical_architecture.md
│       └── 3_agent_workflow.md
│
├── apps/
│   ├── web/                     # 🖥️  Next.js 16 Dashboard
│   │   ├── src/
│   │   │   └── app/             # App Router pages
│   │   ├── package.json
│   │   ├── tailwind.config.ts
│   │   └── tsconfig.json
│   │
│   ├── api/                     # ⚡ FastAPI Cloud Backend
│   │   ├── app/
│   │   │   ├── main.py          # FastAPI entry point
│   │   │   ├── core/
│   │   │   │   └── config.py    # Settings & environment
│   │   │   ├── routers/
│   │   │   │   ├── auth.py      # JWT authentication
│   │   │   │   ├── schedule.py  # Schedule ingestion
│   │   │   │   ├── huddle.py    # Morning huddle retrieval
│   │   │   │   └── chat.py      # Q&A interface
│   │   │   ├── agents/
│   │   │   │   └── graph.py     # LangGraph HuddleSupervisor
│   │   │   ├── models/          # SQLAlchemy models (TODO)
│   │   │   ├── schemas/         # Pydantic request/response
│   │   │   └── services/        # Business logic
│   │   ├── tests/
│   │   └── pyproject.toml
│   │
│   └── local-agent/             # 🏥 On-Premises Python Agent
│       ├── src/
│       │   ├── main.py          # Entry point
│       │   ├── config.py        # Agent settings
│       │   ├── extractors/      # PMS data extraction
│       │   │   └── __init__.py  # Dentrix, Eaglesoft, CSV
│       │   ├── sanitizers/      # PHI sanitization
│       │   │   └── __init__.py  # SHA-256 hashing
│       │   └── uploader/        # Cloud API client
│       │       └── __init__.py  # Retry logic, compression
│       ├── tests/
│       └── pyproject.toml
│
└── packages/
    └── shared/                  # 📦 Shared Pydantic Models
        ├── schemas/
        │   ├── patient.py       # PatientAppt, SchedulePayload
        │   ├── risk.py          # RiskFlag, RiskLevel, RiskCategory
        │   └── huddle.py        # MorningHuddle, RevenueOpportunity
        └── pyproject.toml
```

---

## Documentation

This project follows the **Vibe Coding System** with canonical documentation files that AI reads before coding:

| Document | Purpose |
|----------|---------|
| [`CLAUDE.md`](./CLAUDE.md) | AI operating manual - rules, patterns, HIPAA constraints |
| [`progress.txt`](./progress.txt) | Session state - what's done, in progress, next |
| [`.env.example`](./.env.example) | Environment variables reference for all apps |
| [`docs/PRD.md`](./docs/PRD.md) | Product requirements reference |
| [`docs/APP_FLOW.md`](./docs/APP_FLOW.md) | Screen inventory, navigation paths, user flows, error handling |
| [`docs/TECH_STACK.md`](./docs/TECH_STACK.md) | Locked dependency versions (exact versions) |
| [`docs/FRONTEND_GUIDELINES.md`](./docs/FRONTEND_GUIDELINES.md) | Design system - colors, typography, components, accessibility |
| [`docs/BACKEND_STRUCTURE.md`](./docs/BACKEND_STRUCTURE.md) | Database schema, API contracts, error formats, risk rules |
| [`docs/IMPLEMENTATION_PLAN.md`](./docs/IMPLEMENTATION_PLAN.md) | Step-by-step build sequence (7 phases) |
| [`docs/DEPLOYMENT_CHECKLIST.md`](./docs/DEPLOYMENT_CHECKLIST.md) | Pre-flight verification, HIPAA compliance, rollback |
| [`docs/TESTING_STRATEGY.md`](./docs/TESTING_STRATEGY.md) | Unit, integration, E2E testing guidelines |

> **For AI Agents**: Read `CLAUDE.md` and `progress.txt` at the start of every session.

---

## User Personas

| Role | Name | Needs |
|------|------|-------|
| **Dentist** | Dr. David | Clinical context, revenue opportunities (unscheduled crowns), medical alerts |
| **Hygienist** | Haley | X-ray due dates, perio charting gaps, anxiety alerts |
| **Front Desk** | Rachel | Prioritized task list, payment collection alerts, schedule gap filling |
| **Manager** | Michael | Production vs. goal metrics, staff coverage assurance |

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React, TypeScript, Tailwind CSS, Shadcn/UI |
| **Backend (Cloud)** | Python 3.11+, FastAPI, SQLAlchemy, Alembic |
| **Backend (Local)** | Python 3.11+, Playwright, PyInstaller |
| **Database** | PostgreSQL (Supabase/AWS RDS), SQLite (local cache) |
| **AI Orchestration** | LangGraph (stateful agent flows) |
| **LLM** | Azure OpenAI GPT-4 (HIPAA BAA compliant) |
| **Security** | JWT auth, RBAC, AES-256, TLS 1.3 |

---

## Quick Start

### Prerequisites

- Node.js 20+
- Python 3.11+
- PostgreSQL 14+

### Installation

```bash
# Clone the repository
git clone https://github.com/jaydubya818/Dental_Agent.git
cd Dental_Agent

# Install Node.js dependencies
npm install

# Install Python dependencies for API
cd apps/api
pip install -e ".[dev]"
cd ../..

# Install Python dependencies for Local Agent
cd apps/local-agent
pip install -e ".[dev]"
cd ../..
```

### Development

```bash
# Start the Next.js dashboard (http://localhost:3000)
npm run dev

# Start the FastAPI backend (http://localhost:8000)
npm run dev:api

# Run the local agent (on-premises machine)
npm run dev:agent
```

---

## LangGraph Agent Workflow

The HuddleSupervisor orchestrates four specialized agents:

```
┌─────────────────┐
│ IngestionAgent  │  Normalizes messy OCR/CSV data into ScheduleSchema
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│RiskScannerAgent │  Checks patients against risk rules (medical, financial, scheduling)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  RevenueAgent   │  Identifies unscheduled treatment opportunities
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  WriterAgent    │  Generates role-specific summaries (Clinical, Hygiene, Admin)
└─────────────────┘
```

### Risk Rules Examples

```python
RISK_RULES = [
    {"id": "MED-001", "name": "Blood Thinner Alert",
     "condition": "age > 60 AND procedure_type IN ['extraction', 'surgery']",
     "severity": "CRITICAL"},
    
    {"id": "FIN-001", "name": "Outstanding Balance",
     "condition": "balance > 500",
     "severity": "WARN"},
    
    {"id": "SCH-001", "name": "No-Show Risk",
     "condition": "no_show_count > 2 in last_12_months",
     "severity": "WARN"}
]
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/login` | User authentication |
| `POST` | `/api/v1/auth/refresh` | Token refresh |
| `POST` | `/api/v1/schedule/ingest` | Receive schedule from local agent |
| `GET` | `/api/v1/huddle/{date}` | Get morning huddle for date |
| `GET` | `/api/v1/huddle/{date}/summary/{role}` | Get role-specific summary |
| `POST` | `/api/v1/chat/query` | Chat Q&A about schedule |
| `GET` | `/health` | Health check |

---

## Security & HIPAA Compliance

### Data Flow Security

1. **On-Premises Processing**: All PHI is processed locally before cloud transmission
2. **PII Hashing**: SSN, insurance IDs hashed with SHA-256 + practice-specific salt
3. **Name Tokenization**: Patient names replaced with anonymous tokens
4. **Encrypted Transit**: TLS 1.3 for all API communications
5. **Encrypted Storage**: AES-256 for database at rest

### Access Control

- **RBAC**: Four roles (Provider, Hygienist, Admin, Manager)
- **JWT**: 15-minute access tokens, 7-day refresh tokens
- **MFA**: Required for Manager role (TOTP)
- **Audit Logs**: Immutable, append-only logging of all data access

---

## Development Roadmap

### Phase 1: Foundation ✅
- [x] Monorepo structure with npm workspaces
- [x] Next.js dashboard scaffold
- [x] FastAPI backend scaffold
- [x] Local agent scaffold
- [x] Shared Pydantic schemas

### Phase 2: Database & Auth (Current)
- [ ] PostgreSQL schema design
- [ ] SQLAlchemy models
- [ ] Alembic migrations
- [ ] JWT authentication
- [ ] RBAC implementation

### Phase 3: Local Agent
- [ ] Dentrix ODBC integration
- [ ] Playwright screen scraping
- [ ] PHI sanitization pipeline
- [ ] Windows service packaging

### Phase 4: LangGraph Agents
- [ ] HuddleSupervisor implementation
- [ ] IngestionAgent
- [ ] RiskScannerAgent
- [ ] RevenueAgent
- [ ] WriterAgent

### Phase 5: Dashboard
- [ ] Role-based login
- [ ] Morning huddle views
- [ ] Chat interface
- [ ] Mobile responsive design

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

UNLICENSED - Proprietary

---

## Acknowledgments

- [LangGraph](https://github.com/langchain-ai/langgraph) - AI agent orchestration
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [Next.js](https://nextjs.org/) - React framework
- [Shadcn/UI](https://ui.shadcn.com/) - UI components
