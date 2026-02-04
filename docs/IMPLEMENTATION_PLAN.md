# Implementation Plan

> Step-by-step build sequence for Jerome's Dental Front-Office Agent.
> Each step references the relevant canonical documentation.

---

## Phase 1: Foundation ✅

### 1.1 Project Structure

- [x] **1.1.1** Create monorepo root with `package.json` and npm workspaces
- [x] **1.1.2** Initialize `apps/web` with Next.js 16 (App Router)
- [x] **1.1.3** Initialize `apps/api` with FastAPI scaffold
- [x] **1.1.4** Initialize `apps/local-agent` with Python scaffold
- [x] **1.1.5** Create `packages/shared` for Pydantic models
- [x] **1.1.6** Add `.gitignore` with Node, Python, and IDE ignores
- [x] **1.1.7** Create root `README.md` with architecture overview

### 1.2 Shared Schemas

- [x] **1.2.1** Create `packages/shared/schemas/patient.py` with `PatientAppt` and `SchedulePayload`
- [x] **1.2.2** Create `packages/shared/schemas/risk.py` with `RiskFlag`, `RiskLevel`, `RiskCategory`
- [x] **1.2.3** Create `packages/shared/schemas/huddle.py` with `MorningHuddle`, `RevenueOpportunity`
- [x] **1.2.4** Add `pyproject.toml` to shared package

### 1.3 Development Environment

- [x] **1.3.1** Configure Tailwind CSS 4 in `apps/web`
- [x] **1.3.2** Configure ESLint and TypeScript in `apps/web`
- [x] **1.3.3** Configure ruff and black in `apps/api`
- [x] **1.3.4** Add npm scripts for dev, build, lint, test

---

## Phase 2: Database & Authentication (Current)

### 2.1 PostgreSQL Schema Design

Reference: [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md#database-schema)

- [ ] **2.1.1** Create `alembic.ini` and migrations folder in `apps/api`
- [ ] **2.1.2** Create initial migration with core tables:
  - `practices` table with settings JSONB
  - `users` table with role enum
  - `schedules` table with status enum
  - `appointments` table
- [ ] **2.1.3** Create second migration with auxiliary tables:
  - `risk_flags` table with level/category enums
  - `opportunities` table
  - `huddles` table
  - `audit_logs` table (immutable)
  - `refresh_tokens` table
- [ ] **2.1.4** Add indexes per BACKEND_STRUCTURE.md
- [ ] **2.1.5** Add audit log immutability rules

### 2.2 SQLAlchemy Models

Reference: [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md#table-definitions)

- [ ] **2.2.1** Create `app/models/base.py` with declarative base and mixins
- [ ] **2.2.2** Create `app/models/practice.py` with Practice model
- [ ] **2.2.3** Create `app/models/user.py` with User model and role enum
- [ ] **2.2.4** Create `app/models/schedule.py` with Schedule and Appointment models
- [ ] **2.2.5** Create `app/models/risk.py` with RiskFlag and Opportunity models
- [ ] **2.2.6** Create `app/models/huddle.py` with Huddle model
- [ ] **2.2.7** Create `app/models/audit.py` with AuditLog model
- [ ] **2.2.8** Create `app/models/auth.py` with RefreshToken model

### 2.3 Database Connection

- [ ] **2.3.1** Configure async database connection in `app/core/database.py`
- [ ] **2.3.2** Add connection pooling settings
- [ ] **2.3.3** Create session dependency for FastAPI
- [ ] **2.3.4** Add database health check endpoint

### 2.4 Authentication Implementation

Reference: [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md#authentication-logic)

- [ ] **2.4.1** Create `app/core/security.py` with password hashing (bcrypt)
- [ ] **2.4.2** Create `app/core/jwt.py` with token generation/validation
- [ ] **2.4.3** Implement `POST /api/v1/auth/login` endpoint
- [ ] **2.4.4** Implement `POST /api/v1/auth/refresh` endpoint
- [ ] **2.4.5** Implement `POST /api/v1/auth/logout` endpoint
- [ ] **2.4.6** Create auth dependency with role checking
- [ ] **2.4.7** Add MFA verification for Manager role

### 2.5 RBAC Middleware

- [ ] **2.5.1** Create `app/middleware/auth.py` with JWT validation
- [ ] **2.5.2** Create role-based access decorators
- [ ] **2.5.3** Add route protection to existing endpoints
- [ ] **2.5.4** Create audit logging middleware

---

## Phase 3: Local Agent

### 3.1 Configuration

Reference: [TECH_STACK.md](./TECH_STACK.md#backend---local-agent)

- [ ] **3.1.1** Create `src/config.py` with pydantic-settings
- [ ] **3.1.2** Add environment variable validation
- [ ] **3.1.3** Create config for PMS connection type (csv/dentrix/eaglesoft)

### 3.2 Data Extractors

- [ ] **3.2.1** Create `src/extractors/base.py` with abstract extractor interface
- [ ] **3.2.2** Create `src/extractors/csv.py` for CSV file parsing
- [ ] **3.2.3** Create `src/extractors/dentrix.py` for Dentrix ODBC connection
- [ ] **3.2.4** Create `src/extractors/playwright.py` for screen scraping fallback
- [ ] **3.2.5** Add extractor factory based on config

### 3.3 PHI Sanitization

- [ ] **3.3.1** Create `src/sanitizers/hasher.py` with SHA-256 + practice salt
- [ ] **3.3.2** Create `src/sanitizers/tokenizer.py` for patient name tokenization
- [ ] **3.3.3** Create `src/sanitizers/pipeline.py` to chain sanitizers
- [ ] **3.3.4** Add tests for sanitization correctness

### 3.4 Cloud Uploader

- [ ] **3.4.1** Create `src/uploader/client.py` with httpx async client
- [ ] **3.4.2** Add retry logic with tenacity
- [ ] **3.4.3** Add request signing for API key auth
- [ ] **3.4.4** Create upload queue with local SQLite caching

### 3.5 Scheduling & Packaging

- [ ] **3.5.1** Create `src/scheduler.py` with schedule library
- [ ] **3.5.2** Configure 6 AM daily trigger
- [ ] **3.5.3** Create Windows service wrapper
- [ ] **3.5.4** Configure PyInstaller for .exe compilation
- [ ] **3.5.5** Create installer script

---

## Phase 4: LangGraph Agents

### 4.1 LangGraph Setup

Reference: [3_agent_workflow.md](./context/3_agent_workflow.md)

- [ ] **4.1.1** Configure LangGraph in `app/agents/__init__.py`
- [ ] **4.1.2** Set up Azure OpenAI client with HIPAA-compliant settings
- [ ] **4.1.3** Create state schema for agent workflow

### 4.2 IngestionAgent

- [ ] **4.2.1** Create `app/agents/ingestion.py`
- [ ] **4.2.2** Implement data normalization from raw JSON
- [ ] **4.2.3** Add OCR text cleanup logic
- [ ] **4.2.4** Output: Clean `ScheduleSchema` list

### 4.3 RiskScannerAgent

- [ ] **4.3.1** Create `app/agents/risk_scanner.py`
- [ ] **4.3.2** Implement rule engine with configurable rules
- [ ] **4.3.3** Add medical risk detection (blood thinners, allergies)
- [ ] **4.3.4** Add financial risk detection (outstanding balances)
- [ ] **4.3.5** Add scheduling risk detection (no-show patterns)
- [ ] **4.3.6** Output: List of `RiskFlag` objects

### 4.4 RevenueAgent

- [ ] **4.4.1** Create `app/agents/revenue.py`
- [ ] **4.4.2** Implement unscheduled treatment detection
- [ ] **4.4.3** Add talking points generation
- [ ] **4.4.4** Output: List of `RevenueOpportunity` objects

### 4.5 WriterAgent

- [ ] **4.5.1** Create `app/agents/writer.py`
- [ ] **4.5.2** Create prompt templates for each role
- [ ] **4.5.3** Implement clinical summary generation
- [ ] **4.5.4** Implement hygiene summary generation
- [ ] **4.5.5** Implement admin summary generation
- [ ] **4.5.6** Add tone/style consistency checks

### 4.6 HuddleSupervisor

- [ ] **4.6.1** Create `app/agents/graph.py` with LangGraph StateGraph
- [ ] **4.6.2** Define state transitions between agents
- [ ] **4.6.3** Add error handling and retries
- [ ] **4.6.4** Implement huddle generation endpoint trigger
- [ ] **4.6.5** Add caching for generated huddles

---

## Phase 5: Dashboard Frontend

### 5.1 Authentication UI

Reference: [FRONTEND_GUIDELINES.md](./FRONTEND_GUIDELINES.md), [APP_FLOW.md](./APP_FLOW.md)

- [ ] **5.1.1** Install Shadcn/UI components (button, card, input, label)
- [ ] **5.1.2** Create `app/(auth)/login/page.tsx`
- [ ] **5.1.3** Create `app/(auth)/forgot-password/page.tsx`
- [ ] **5.1.4** Implement JWT storage and refresh logic
- [ ] **5.1.5** Create auth context provider
- [ ] **5.1.6** Add protected route wrapper

### 5.2 Dashboard Layout

- [ ] **5.2.1** Create `app/(dashboard)/layout.tsx` with header and sidebar
- [ ] **5.2.2** Implement responsive navigation (desktop sidebar, mobile bottom nav)
- [ ] **5.2.3** Add user menu with role display
- [ ] **5.2.4** Create loading skeletons for dashboard

### 5.3 Morning Huddle View

- [ ] **5.3.1** Create `app/(dashboard)/page.tsx` as main dashboard
- [ ] **5.3.2** Implement role detection and summary display
- [ ] **5.3.3** Create `components/huddle/SummaryCard.tsx`
- [ ] **5.3.4** Create `components/huddle/RiskFlagList.tsx`
- [ ] **5.3.5** Create `components/huddle/OpportunityCard.tsx`
- [ ] **5.3.6** Add real-time data fetching with SWR/React Query

### 5.4 Schedule View

- [ ] **5.4.1** Create `app/(dashboard)/schedule/page.tsx`
- [ ] **5.4.2** Create `components/schedule/Timeline.tsx`
- [ ] **5.4.3** Create `components/schedule/AppointmentBlock.tsx`
- [ ] **5.4.4** Add appointment detail popover/modal
- [ ] **5.4.5** Implement provider column filtering

### 5.5 Chat Interface

- [ ] **5.5.1** Create `app/(dashboard)/chat/page.tsx`
- [ ] **5.5.2** Create `components/chat/ChatInput.tsx`
- [ ] **5.5.3** Create `components/chat/MessageBubble.tsx`
- [ ] **5.5.4** Implement streaming response display
- [ ] **5.5.5** Add suggested follow-up questions

### 5.6 Settings & Admin

- [ ] **5.6.1** Create `app/(dashboard)/settings/page.tsx`
- [ ] **5.6.2** Create `app/(dashboard)/settings/admin/page.tsx` (Manager only)
- [ ] **5.6.3** Create `app/(dashboard)/audit/page.tsx` (Manager only)
- [ ] **5.6.4** Implement risk rule configuration UI

---

## Phase 6: Integration & Testing

### 6.1 End-to-End Flow

- [ ] **6.1.1** Test local agent → cloud API ingestion
- [ ] **6.1.2** Test huddle generation after ingestion
- [ ] **6.1.3** Test dashboard data display
- [ ] **6.1.4** Test chat Q&A functionality

### 6.2 Security Testing

- [ ] **6.2.1** Verify PHI never reaches cloud (audit logs)
- [ ] **6.2.2** Test RBAC enforcement on all endpoints
- [ ] **6.2.3** Verify JWT expiration and refresh
- [ ] **6.2.4** Penetration test for common vulnerabilities

### 6.3 Performance Testing

- [ ] **6.3.1** Load test schedule ingestion endpoint
- [ ] **6.3.2** Measure huddle generation time (target: < 2 min)
- [ ] **6.3.3** Measure dashboard load time (target: < 2 sec)
- [ ] **6.3.4** Optimize slow queries

---

## Phase 7: Deployment

### 7.1 Infrastructure Setup

- [ ] **7.1.1** Configure Vercel for frontend deployment
- [ ] **7.1.2** Configure Railway/Render for API deployment
- [ ] **7.1.3** Set up Supabase/RDS for PostgreSQL
- [ ] **7.1.4** Configure Azure OpenAI with HIPAA BAA

### 7.2 Environment Configuration

- [ ] **7.2.1** Set up staging environment
- [ ] **7.2.2** Set up production environment
- [ ] **7.2.3** Configure secrets management (AWS KMS / Azure Key Vault)
- [ ] **7.2.4** Set up monitoring and alerting

### 7.3 Beta Launch

- [ ] **7.3.1** Deploy to staging for internal testing
- [ ] **7.3.2** Onboard 3 beta practices
- [ ] **7.3.3** Collect feedback and iterate
- [ ] **7.3.4** Prepare for general availability

---

## Progress Tracking

Update [progress.txt](../progress.txt) after completing each numbered step.

---

## Cross-References

- **Tech stack versions**: See [TECH_STACK.md](./TECH_STACK.md)
- **Database schema**: See [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md)
- **UI design**: See [FRONTEND_GUIDELINES.md](./FRONTEND_GUIDELINES.md)
- **User flows**: See [APP_FLOW.md](./APP_FLOW.md)
- **Feature requirements**: See [PRD.md](./PRD.md)
