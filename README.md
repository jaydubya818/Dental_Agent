# Jerome's Dental Front-Office Agent

AI-driven "Morning Huddle" automation platform for dental practices.

## Overview

This system acts as an intelligence layer on top of legacy Practice Management Systems (PMS) like Dentrix/Eaglesoft, using a hybrid on-premises/cloud architecture to ensure HIPAA compliance while delivering AI-driven insights.

## Architecture

```
jerome-dental/
├── apps/
│   ├── web/          # Next.js Dashboard (React, Tailwind, Shadcn/UI)
│   ├── api/          # FastAPI Cloud Backend (Python, LangGraph)
│   └── local-agent/  # On-Premises Agent (Python, Playwright)
└── packages/
    └── shared/       # Shared Pydantic models
```

## Quick Start

### Prerequisites

- Node.js 20+
- Python 3.11+
- PostgreSQL 14+

### Installation

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies for API
cd apps/api
pip install -e ".[dev]"

# Install Python dependencies for Local Agent
cd ../local-agent
pip install -e ".[dev]"
```

### Development

```bash
# Start the Next.js dashboard
npm run dev

# Start the FastAPI backend (in another terminal)
npm run dev:api

# Run the local agent (on-premises machine)
npm run dev:agent
```

## User Roles

1. **Dr. David (Dentist)** - Clinical context, revenue opportunities, medical alerts
2. **Haley (Hygienist)** - X-ray due dates, perio charting gaps, anxiety alerts
3. **Rachel (Front Desk)** - Task lists, payment collection, schedule gaps
4. **Michael (Manager)** - Production metrics, staff coverage

## Security & Compliance

- **HIPAA Compliant** - All PHI processed on-premises before cloud transmission
- **Encryption** - AES-256 at rest, TLS 1.3 in transit
- **RBAC** - Role-based access control with four roles
- **Audit Logs** - Immutable logging of all data access

## License

UNLICENSED - Proprietary
