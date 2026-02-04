# Product Requirements Document

> This is a reference file pointing to the canonical PRD.

The full Product Requirements Document for Jerome's Dental Front-Office Agent is located at:

**[../docs/context/JEROME_DENTAL_PRD.md](../../docs/context/JEROME_DENTAL_PRD.md)**

---

## Quick Reference

### Core Value Proposition

- **Automated Morning Huddle**: AI-generated daily briefs for dental teams
- **Zero-Integration Data Capture**: On-premises agent works with legacy PMS
- **Proactive Risk Flagging**: Medical, financial, and scheduling alerts
- **Revenue Optimization**: Surfaces unscheduled treatment opportunities

### User Personas

| Role | Name | Primary Needs |
|------|------|---------------|
| Dentist | Dr. David | Clinical context, revenue opportunities, medical alerts |
| Hygienist | Haley | X-ray due dates, perio gaps, anxiety alerts |
| Front Desk | Rachel | Task list, payment collection, schedule gaps |
| Manager | Michael | Metrics, staff coverage, risk configuration |

### MVP Scope

1. Local agent ingests daily schedule (CSV or ODBC)
2. Cloud AI analyzes against risk rules
3. Role-specific dashboards display summaries
4. Chat interface for Q&A

### HIPAA Compliance

- All PHI processed on-premises
- Only sanitized/tokenized data in cloud
- Immutable audit logs (7-year retention)
- AES-256 at rest, TLS 1.3 in transit

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [APP_FLOW.md](./APP_FLOW.md) | User navigation paths |
| [TECH_STACK.md](./TECH_STACK.md) | Locked dependency versions |
| [FRONTEND_GUIDELINES.md](./FRONTEND_GUIDELINES.md) | Design system |
| [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md) | DB schema & API contracts |
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | Build sequence |
