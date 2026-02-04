# Product Vision: Jerome's Dental Front-Office Agent

## 1. Core Concept

An AI-driven "Morning Huddle" automation platform for dental practices. It acts as an intelligence layer that sits on top of legacy Practice Management Systems (PMS) like Dentrix/Eaglesoft without requiring direct API cooperation (uses screen-scraping/OCR if needed).

## 2. Core Value Proposition

- **Automated Morning Huddle:** Generates a concise daily brief for the team (Dentists, Hygienists, Admin).
- **Zero-Integration Data Capture:** Capable of running a local "Agent" on-premise to screen-scrape or query local DBs, then send sanitized metadata to the cloud.
- **Risk Flagging:** Proactively identifies medical risks (allergies), financial risks (unpaid balances), and scheduling gaps.

## 3. User Personas

1. **Dr. David (Dentist):** Needs clinical context, revenue opportunities (e.g., unscheduled crowns), and medical alerts.
2. **Haley (Hygienist):** Needs X-ray due dates, perio charting gaps, and anxiety alerts.
3. **Rachel (Front Desk):** Needs prioritized tasks, payment collection alerts, and schedule hole filling.
4. **Michael (Manager):** Needs production vs. goal metrics and staff coverage assurance.

## 4. MVP Functional Scope (Phase 1)

1. **Ingestion:** Local agent ingests daily schedule (CSV upload or Local DB query).
2. **Processing:** Cloud AI analyzes patient list against "Risk Rules."
3. **Output:**
   - Role-specific Dashboard (Web).
   - Chat Interface (Q&A style).
4. **Compliance:** HIPAA strict. PHI (Patient Health Information) handling must be minimized in cloud; heavy lifting done on-prem or de-identified.
