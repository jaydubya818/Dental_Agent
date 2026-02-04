# Technical Architecture & Stack

> **Version Reference**: See [TECH_STACK.md](../TECH_STACK.md) for exact locked versions.

## 1. Hybrid Deployment Model

To satisfy HIPAA and legacy integration, the system uses a split architecture:

- **On-Premises Agent (The "Hand"):** A lightweight Python/Docker service running on the dental office server.
  - *Responsibilities:* Connects to PMS (Dentrix/Eaglesoft), runs local screen scraping/OCR, de-identifies PHI, pushes sanitized JSON to Cloud.
- **Cloud Control Plane (The "Brain"):** SaaS platform.
  - *Responsibilities:* LLM inference, Logic, Web Dashboard, Auth, Aggregated Reporting.

## 2. Technology Stack (Cursor Target)

> **Exact versions locked in**: [TECH_STACK.md](../TECH_STACK.md)

| Component | Technology | Version |
|-----------|------------|---------|
| **Frontend** | Next.js (React), Tailwind CSS, Shadcn/UI | Next.js `16.1.6`, React `19.2.3`, Tailwind `^4` |
| **Backend (Cloud)** | Python (FastAPI) | Python `>=3.11`, FastAPI `>=0.109.0` |
| **Backend (Local Agent)** | Python, Playwright, PyInstaller | Playwright `>=1.41.0`, PyInstaller `>=6.3.0` |
| **Database** | PostgreSQL (Cloud), SQLite (Local) | PostgreSQL `14+` |
| **AI Orchestration** | LangGraph | `>=0.0.30` |
| **LLMs** | Azure OpenAI (GPT-4) | HIPAA BAA compliant |

## 3. Data Flow

1. **Trigger:** 6:00 AM Local Agent wakes up.
2. **Extract:** Agent scrapes schedule for "Today."
3. **Sanitize:** Agent hashes sensitive PII (SSN, etc.) locally.
4. **Upload:** Agent sends JSON payload to Cloud API (TLS 1.3).
5. **Process:** Cloud `HuddleAgent` analyzes payload, generates summaries via LLM.
6. **Display:** Staff logs into Next.js Dashboard to view "Morning Huddle."

## 4. Security & Compliance (HIPAA)

- **Audit Trails:** Every DB read/write and AI inference must be logged in an immutable `audit_log` table.
- **Encryption:** AES-256 at rest, TLS 1.3 in transit.
- **Role-Based Access Control (RBAC):** Strict roles (Provider, Admin, Staff).
