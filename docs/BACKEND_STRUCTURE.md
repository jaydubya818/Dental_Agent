# Backend Structure

> This document defines the complete database schema, authentication logic, API contracts,
> and storage rules for the Jerome Dental Front-Office Agent.

---

## 1. Database Schema (PostgreSQL)

### 1.1 Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    practices    │       │     users       │       │   schedules     │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │◄──────│ practice_id (FK)│       │ id (PK)         │
│ name            │       │ id (PK)         │◄──────│ practice_id (FK)│
│ timezone        │       │ email           │       │ date            │
│ settings        │       │ password_hash   │       │ raw_data        │
│ created_at      │       │ role            │       │ status          │
│ updated_at      │       │ mfa_enabled     │       │ created_at      │
└─────────────────┘       │ created_at      │       └────────┬────────┘
                          └─────────────────┘                │
                                                             │
                          ┌─────────────────┐       ┌────────▼────────┐
                          │   risk_flags    │       │  appointments   │
                          ├─────────────────┤       ├─────────────────┤
                          │ id (PK)         │◄──────│ id (PK)         │
                          │ appointment_id  │       │ schedule_id (FK)│
                          │ level           │       │ patient_token   │
                          │ category        │       │ time_slot       │
                          │ message         │       │ procedure_code  │
                          │ acknowledged    │       │ provider_id     │
                          │ acknowledged_by │       │ notes           │
                          │ created_at      │       │ created_at      │
                          └─────────────────┘       └─────────────────┘

                          ┌─────────────────┐       ┌─────────────────┐
                          │    huddles      │       │   audit_logs    │
                          ├─────────────────┤       ├─────────────────┤
                          │ id (PK)         │       │ id (PK)         │
                          │ practice_id (FK)│       │ practice_id (FK)│
                          │ date            │       │ user_id (FK)    │
                          │ clinical_summary│       │ action          │
                          │ hygiene_summary │       │ resource_type   │
                          │ admin_summary   │       │ resource_id     │
                          │ generated_at    │       │ details         │
                          │ created_at      │       │ ip_address      │
                          └─────────────────┘       │ created_at      │
                                                    └─────────────────┘
```

### 1.2 Table Definitions

#### `practices`

```sql
CREATE TABLE practices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    timezone VARCHAR(50) NOT NULL DEFAULT 'America/New_York',
    settings JSONB NOT NULL DEFAULT '{}',
    api_key_hash VARCHAR(255), -- Hashed API key for local agent
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_practices_api_key ON practices(api_key_hash);
```

#### `users`

```sql
CREATE TYPE user_role AS ENUM ('provider', 'hygienist', 'admin', 'manager');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    practice_id UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'admin',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    mfa_enabled BOOLEAN NOT NULL DEFAULT false,
    mfa_secret VARCHAR(255),
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_practice ON users(practice_id);
CREATE INDEX idx_users_email ON users(email);
```

#### `schedules`

```sql
CREATE TYPE schedule_status AS ENUM ('pending', 'processing', 'completed', 'failed');

CREATE TABLE schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    practice_id UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    raw_data JSONB NOT NULL, -- Sanitized schedule data from local agent
    status schedule_status NOT NULL DEFAULT 'pending',
    error_message TEXT,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_schedules_practice_date ON schedules(practice_id, date);
CREATE INDEX idx_schedules_status ON schedules(status);
```

#### `appointments`

```sql
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id UUID NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
    patient_token VARCHAR(255) NOT NULL, -- Anonymized patient identifier
    time_slot TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    procedure_code VARCHAR(50),
    procedure_name VARCHAR(255),
    provider_id VARCHAR(100),
    provider_name VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_appointments_schedule ON appointments(schedule_id);
CREATE INDEX idx_appointments_time ON appointments(time_slot);
CREATE INDEX idx_appointments_provider ON appointments(provider_id);
```

#### `risk_flags`

```sql
CREATE TYPE risk_level AS ENUM ('critical', 'warn', 'info');
CREATE TYPE risk_category AS ENUM ('medical', 'financial', 'scheduling');

CREATE TABLE risk_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    level risk_level NOT NULL,
    category risk_category NOT NULL,
    message TEXT NOT NULL,
    rule_id VARCHAR(50), -- Reference to rule that triggered this flag
    acknowledged BOOLEAN NOT NULL DEFAULT false,
    acknowledged_by UUID REFERENCES users(id),
    acknowledged_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_risk_flags_appointment ON risk_flags(appointment_id);
CREATE INDEX idx_risk_flags_level ON risk_flags(level);
CREATE INDEX idx_risk_flags_acknowledged ON risk_flags(acknowledged);
```

#### `opportunities`

```sql
CREATE TYPE opportunity_priority AS ENUM ('high', 'medium', 'low');

CREATE TABLE opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    treatment_type VARCHAR(255) NOT NULL,
    estimated_value DECIMAL(10, 2),
    priority opportunity_priority NOT NULL DEFAULT 'medium',
    talking_points TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_opportunities_appointment ON opportunities(appointment_id);
CREATE INDEX idx_opportunities_priority ON opportunities(priority);
```

#### `huddles`

```sql
CREATE TABLE huddles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    practice_id UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    clinical_summary TEXT,
    hygiene_summary TEXT,
    admin_summary TEXT,
    metadata JSONB NOT NULL DEFAULT '{}', -- Stats, counts, etc.
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_huddles_practice_date ON huddles(practice_id, date);
```

#### `audit_logs` (Immutable)

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    practice_id UUID NOT NULL REFERENCES practices(id),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL, -- 'login', 'view_patient', 'acknowledge_risk', etc.
    resource_type VARCHAR(100), -- 'appointment', 'risk_flag', 'huddle', etc.
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Partitioned by month for performance
-- In production, use pg_partman for automatic partition management

CREATE INDEX idx_audit_logs_practice ON audit_logs(practice_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- Prevent updates and deletes (immutable)
CREATE RULE audit_logs_no_update AS ON UPDATE TO audit_logs DO INSTEAD NOTHING;
CREATE RULE audit_logs_no_delete AS ON DELETE TO audit_logs DO INSTEAD NOTHING;
```

#### `refresh_tokens`

```sql
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT false,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);
```

---

## 2. Authentication Logic

### 2.1 JWT Token Structure

#### Access Token (15 min expiry)

```json
{
  "sub": "user-uuid",
  "practice_id": "practice-uuid",
  "role": "provider",
  "email": "dr.david@example.com",
  "iat": 1706745600,
  "exp": 1706746500,
  "type": "access"
}
```

#### Refresh Token (7 day expiry)

```json
{
  "sub": "user-uuid",
  "jti": "token-unique-id",
  "iat": 1706745600,
  "exp": 1707350400,
  "type": "refresh"
}
```

### 2.2 Authentication Flow

```
┌────────┐     ┌────────────┐     ┌──────────────┐     ┌────────────┐
│ Client │────▶│ POST /login│────▶│ Validate     │────▶│ Generate   │
└────────┘     └────────────┘     │ Credentials  │     │ Tokens     │
                                  └──────────────┘     └──────┬─────┘
                                         │                    │
                                         ▼                    │
                                  ┌──────────────┐            │
                                  │ MFA Required?│            │
                                  └──────┬───────┘            │
                                         │                    │
                    ┌────────────────────┼────────────────────┤
                    │ Yes                │ No                 │
                    ▼                    │                    │
             ┌──────────────┐            │                    │
             │ Return MFA   │            │                    │
             │ Challenge    │            │                    │
             └──────────────┘            │                    │
                    │                    │                    │
                    ▼                    ▼                    ▼
             ┌──────────────┐     ┌──────────────────────────────┐
             │ Verify TOTP  │────▶│ Return Access + Refresh Token│
             └──────────────┘     └──────────────────────────────┘
```

### 2.3 Token Refresh Flow

```python
# Pseudocode for token refresh
async def refresh_access_token(refresh_token: str) -> TokenPair:
    # 1. Decode and validate refresh token
    payload = decode_jwt(refresh_token)
    
    # 2. Check if token is revoked
    token_record = await db.get_refresh_token(payload["jti"])
    if token_record.revoked:
        raise TokenRevokedException()
    
    # 3. Check expiry
    if token_record.expires_at < now():
        raise TokenExpiredException()
    
    # 4. Get user
    user = await db.get_user(payload["sub"])
    
    # 5. Generate new access token
    access_token = generate_access_token(user)
    
    # 6. Optionally rotate refresh token (recommended)
    new_refresh_token = generate_refresh_token(user)
    await db.revoke_refresh_token(payload["jti"])
    await db.store_refresh_token(new_refresh_token)
    
    return TokenPair(access_token, new_refresh_token)
```

### 2.4 Password Requirements

- Minimum 12 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character
- Not in common password list
- bcrypt hash with cost factor 12

### 2.5 MFA (Manager Role Required)

- TOTP-based (RFC 6238)
- 6-digit codes
- 30-second validity window
- Allow 1 step tolerance (previous + current + next)
- Recovery codes: 10 single-use codes

---

## 3. API Endpoint Contracts

### 3.1 Authentication Endpoints

#### `POST /api/v1/auth/login`

```yaml
Request:
  Content-Type: application/json
  Body:
    email: string (required, email format)
    password: string (required, min 8 chars)

Response 200 (Success):
  {
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "token_type": "bearer",
    "expires_in": 900,
    "user": {
      "id": "uuid",
      "email": "string",
      "role": "provider|hygienist|admin|manager",
      "first_name": "string",
      "last_name": "string"
    }
  }

Response 200 (MFA Required):
  {
    "mfa_required": true,
    "mfa_token": "temporary-token"
  }

Response 401:
  {
    "detail": "Invalid email or password"
  }
```

#### `POST /api/v1/auth/mfa/verify`

```yaml
Request:
  Content-Type: application/json
  Body:
    mfa_token: string (required)
    code: string (required, 6 digits)

Response 200:
  {
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "token_type": "bearer",
    "expires_in": 900
  }

Response 401:
  {
    "detail": "Invalid verification code"
  }
```

#### `POST /api/v1/auth/refresh`

```yaml
Request:
  Content-Type: application/json
  Body:
    refresh_token: string (required)

Response 200:
  {
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "token_type": "bearer",
    "expires_in": 900
  }

Response 401:
  {
    "detail": "Invalid or expired refresh token"
  }
```

#### `POST /api/v1/auth/logout`

```yaml
Request:
  Authorization: Bearer <access_token>

Response 200:
  {
    "message": "Successfully logged out"
  }
```

### 3.2 Schedule Endpoints

#### `POST /api/v1/schedule/ingest`

```yaml
Request:
  Authorization: Bearer <local-agent-api-key>
  Content-Type: application/json
  Body:
    date: string (required, ISO date format YYYY-MM-DD)
    appointments: array (required)
      - patient_token: string (required, anonymized ID)
        time_slot: string (required, ISO datetime)
        duration_minutes: integer (default 60)
        procedure_code: string
        procedure_name: string
        provider_id: string
        provider_name: string
        notes: string

Response 202 (Accepted):
  {
    "schedule_id": "uuid",
    "status": "processing",
    "message": "Schedule received and processing"
  }

Response 400:
  {
    "detail": "Validation error",
    "errors": [
      {"field": "appointments[0].time_slot", "message": "Invalid datetime format"}
    ]
  }
```

#### `GET /api/v1/schedule/{date}`

```yaml
Request:
  Authorization: Bearer <access_token>
  Path Parameters:
    date: string (YYYY-MM-DD)

Response 200:
  {
    "date": "2026-02-04",
    "status": "completed",
    "appointments": [
      {
        "id": "uuid",
        "patient_token": "string",
        "time_slot": "2026-02-04T09:00:00Z",
        "duration_minutes": 60,
        "procedure_code": "D2750",
        "procedure_name": "Crown - Porcelain",
        "provider_id": "dr-david",
        "provider_name": "Dr. David Smith",
        "notes": "Anxious patient",
        "risk_flags": [
          {
            "id": "uuid",
            "level": "critical",
            "category": "medical",
            "message": "On blood thinners - verify medication status"
          }
        ],
        "opportunities": [
          {
            "id": "uuid",
            "treatment_type": "Teeth Whitening",
            "estimated_value": 350.00,
            "priority": "medium"
          }
        ]
      }
    ]
  }

Response 404:
  {
    "detail": "No schedule found for this date"
  }
```

### 3.3 Huddle Endpoints

#### `GET /api/v1/huddle/{date}`

```yaml
Request:
  Authorization: Bearer <access_token>
  Path Parameters:
    date: string (YYYY-MM-DD)

Response 200:
  {
    "date": "2026-02-04",
    "generated_at": "2026-02-04T06:15:00Z",
    "clinical_summary": "Today's schedule includes 8 patients with...",
    "hygiene_summary": "Focus areas: 3 patients due for X-rays...",
    "admin_summary": "Priority tasks: Collect payment from...",
    "stats": {
      "total_appointments": 24,
      "critical_flags": 2,
      "warn_flags": 5,
      "opportunities_value": 2450.00
    }
  }
```

#### `GET /api/v1/huddle/{date}/summary/{role}`

```yaml
Request:
  Authorization: Bearer <access_token>
  Path Parameters:
    date: string (YYYY-MM-DD)
    role: string (provider|hygienist|admin|manager)

Response 200:
  {
    "date": "2026-02-04",
    "role": "provider",
    "summary": "Good morning, Dr. David! Today you have 8 patients...",
    "highlights": [
      "2 CRITICAL medical alerts to review",
      "3 revenue opportunities totaling $2,450"
    ],
    "action_items": [
      {
        "priority": "high",
        "text": "Review blood thinner status for patient at 10:00 AM"
      }
    ]
  }
```

### 3.4 Risk Flag Endpoints

#### `GET /api/v1/risks`

```yaml
Request:
  Authorization: Bearer <access_token>
  Query Parameters:
    date: string (optional, defaults to today)
    level: string (optional, critical|warn|info)
    acknowledged: boolean (optional)

Response 200:
  {
    "total": 7,
    "critical": 2,
    "warn": 3,
    "info": 2,
    "flags": [
      {
        "id": "uuid",
        "appointment_id": "uuid",
        "patient_token": "string",
        "time_slot": "2026-02-04T10:00:00Z",
        "level": "critical",
        "category": "medical",
        "message": "Patient on blood thinners",
        "acknowledged": false
      }
    ]
  }
```

#### `POST /api/v1/risks/{id}/acknowledge`

```yaml
Request:
  Authorization: Bearer <access_token>
  Path Parameters:
    id: string (UUID)

Response 200:
  {
    "id": "uuid",
    "acknowledged": true,
    "acknowledged_by": "uuid",
    "acknowledged_at": "2026-02-04T07:45:00Z"
  }
```

### 3.5 Chat Endpoint

#### `POST /api/v1/chat/query`

```yaml
Request:
  Authorization: Bearer <access_token>
  Content-Type: application/json
  Body:
    query: string (required)
    context_date: string (optional, defaults to today)

Response 200:
  {
    "query": "Who has outstanding balances over $500?",
    "response": "There are 3 patients with outstanding balances over $500...",
    "sources": [
      {
        "type": "appointment",
        "id": "uuid",
        "patient_token": "string"
      }
    ],
    "suggested_followups": [
      "What are the total outstanding balances?",
      "Who should I call first?"
    ]
  }
```

### 3.6 Audit Endpoint

#### `GET /api/v1/audit/logs`

```yaml
Request:
  Authorization: Bearer <access_token> (Manager role required)
  Query Parameters:
    start_date: string (optional, ISO datetime)
    end_date: string (optional, ISO datetime)
    user_id: string (optional, UUID)
    action: string (optional)
    limit: integer (default 50, max 100)
    offset: integer (default 0)

Response 200:
  {
    "total": 1250,
    "limit": 50,
    "offset": 0,
    "logs": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "user_email": "dr.david@example.com",
        "action": "view_patient",
        "resource_type": "appointment",
        "resource_id": "uuid",
        "ip_address": "192.168.1.100",
        "created_at": "2026-02-04T07:32:15Z"
      }
    ]
  }
```

---

## 4. Storage Rules

### 4.1 Data Retention

| Data Type | Retention Period | Notes |
|-----------|-----------------|-------|
| Audit Logs | 7 years | HIPAA requirement |
| Schedules | 3 years | For historical analysis |
| Huddles | 1 year | Summaries only |
| Refresh Tokens | 30 days | Auto-cleanup |
| Risk Flags | 3 years | With schedule |

### 4.2 Cache TTLs

| Cache Key | TTL | Notes |
|-----------|-----|-------|
| `huddle:{practice_id}:{date}` | 1 hour | Regenerate on schedule update |
| `schedule:{practice_id}:{date}` | 30 minutes | Refresh from DB |
| `user:{id}` | 5 minutes | Auth data |
| `risks:{practice_id}:{date}` | 10 minutes | Risk flag list |

### 4.3 Backup Strategy

- **Full backup**: Daily at 2:00 AM UTC
- **Incremental backup**: Every 4 hours
- **Point-in-time recovery**: Enabled (14 days)
- **Backup location**: Separate region (cross-region replication)

---

## 5. Edge Cases

### 5.1 Concurrent Schedule Uploads

```python
# Use database-level locking to prevent race conditions
async def ingest_schedule(practice_id: str, date: str, data: dict):
    async with db.transaction():
        # Lock the row for this practice + date
        existing = await db.execute(
            "SELECT * FROM schedules WHERE practice_id = $1 AND date = $2 FOR UPDATE",
            [practice_id, date]
        )
        
        if existing:
            # Update existing schedule
            await db.update_schedule(existing.id, data)
        else:
            # Create new schedule
            await db.create_schedule(practice_id, date, data)
```

### 5.2 Missing PMS Data

- Log warning but don't fail entire ingestion
- Mark affected appointments with `incomplete_data` flag
- Show warning in dashboard: "Some data may be incomplete"

### 5.3 LLM Failure During Huddle Generation

- Retry up to 3 times with exponential backoff
- If all retries fail, generate basic summary from structured data only
- Mark huddle as `partial` and log failure for review

### 5.4 Token Rotation During Active Session

- Grace period: Old refresh token valid for 30 seconds after rotation
- If both old and new tokens are used, revoke all tokens for security

---

## 6. Standard API Error Response Format

All API errors follow a consistent structure for frontend handling.

### 6.1 Error Response Schema

```python
from pydantic import BaseModel
from typing import Optional, List

class FieldError(BaseModel):
    """Individual field validation error."""
    field: str        # e.g., "appointments[0].time_slot"
    message: str      # e.g., "Invalid datetime format"
    code: str         # e.g., "invalid_format"

class ErrorResponse(BaseModel):
    """Standard error response for all API endpoints."""
    detail: str                          # Human-readable message
    error_code: Optional[str] = None     # Machine-readable code (e.g., "AUTH_001")
    errors: Optional[List[FieldError]] = None  # For validation errors
    request_id: str                      # UUID for debugging/support

# Example error codes:
# AUTH_001: Invalid credentials
# AUTH_002: Token expired
# AUTH_003: Token revoked
# AUTH_004: MFA required
# AUTH_005: MFA verification failed
# AUTH_006: Account locked
# VAL_001: Validation error
# VAL_002: Missing required field
# RES_001: Resource not found
# RES_002: Resource already exists
# PERM_001: Permission denied
# PERM_002: Role not authorized
# RATE_001: Rate limit exceeded
# SRV_001: Internal server error
# SRV_002: Service unavailable
# SRV_003: LLM service error
```

### 6.2 HTTP Status Code Mapping

| Status | Error Code Prefix | Description |
|--------|-------------------|-------------|
| 400 | `VAL_*` | Validation errors |
| 401 | `AUTH_*` | Authentication errors |
| 403 | `PERM_*` | Permission/authorization errors |
| 404 | `RES_001` | Resource not found |
| 409 | `RES_002` | Conflict (duplicate resource) |
| 429 | `RATE_*` | Rate limiting |
| 500 | `SRV_*` | Server errors |
| 503 | `SRV_002` | Service unavailable |

### 6.3 Example Error Responses

```json
// 400 - Validation Error
{
  "detail": "Validation error in request body",
  "error_code": "VAL_001",
  "errors": [
    {
      "field": "appointments[0].time_slot",
      "message": "Invalid datetime format. Expected ISO 8601.",
      "code": "invalid_format"
    },
    {
      "field": "appointments[2].procedure_code",
      "message": "Unknown procedure code: X9999",
      "code": "invalid_value"
    }
  ],
  "request_id": "req_abc123def456"
}

// 401 - Authentication Error
{
  "detail": "Invalid email or password",
  "error_code": "AUTH_001",
  "request_id": "req_abc123def456"
}

// 403 - Permission Denied
{
  "detail": "You do not have permission to access audit logs",
  "error_code": "PERM_002",
  "request_id": "req_abc123def456"
}

// 500 - Server Error
{
  "detail": "An unexpected error occurred. Please try again.",
  "error_code": "SRV_001",
  "request_id": "req_abc123def456"
}
```

### 6.4 Error Response Implementation

```python
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
import uuid

class APIError(HTTPException):
    def __init__(
        self,
        status_code: int,
        detail: str,
        error_code: str = None,
        errors: List[FieldError] = None
    ):
        super().__init__(status_code=status_code, detail=detail)
        self.error_code = error_code
        self.errors = errors

@app.exception_handler(APIError)
async def api_error_handler(request: Request, exc: APIError):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "error_code": exc.error_code,
            "errors": [e.dict() for e in exc.errors] if exc.errors else None,
            "request_id": str(uuid.uuid4())
        }
    )
```

---

## 7. Practice Settings & Risk Rules Configuration

Practice-specific settings are stored in the `practices.settings` JSONB column.

### 7.1 Settings Schema

```python
from pydantic import BaseModel
from typing import Dict, List, Optional

class RiskRuleThresholds(BaseModel):
    """Configurable thresholds for built-in rules."""
    # Financial
    balance_threshold: float = 500.0  # FIN-001: Outstanding balance alert
    
    # Scheduling
    no_show_count: int = 2            # SCH-001: No-show risk threshold
    no_show_period_months: int = 12   # SCH-001: Lookback period
    
    # Medical (age-based)
    senior_age_threshold: int = 60    # MED-001: Age for blood thinner checks

class CustomRiskRule(BaseModel):
    """Practice-defined custom risk rule."""
    id: str                           # e.g., "CUSTOM-001"
    name: str                         # e.g., "VIP Patient Alert"
    condition: str                    # Simple condition string
    severity: str                     # "CRITICAL" | "WARN" | "INFO"
    category: str                     # "MEDICAL" | "FINANCIAL" | "SCHEDULING" | "CUSTOM"
    action: str                       # Description of action to take
    enabled: bool = True

class RiskRulesConfig(BaseModel):
    """Complete risk rules configuration."""
    enabled_rules: List[str] = [      # IDs of enabled built-in rules
        "MED-001", "MED-002", "FIN-001", "SCH-001"
    ]
    thresholds: RiskRuleThresholds = RiskRuleThresholds()
    custom_rules: List[CustomRiskRule] = []

class NotificationSettings(BaseModel):
    """Practice notification preferences."""
    huddle_ready_email: bool = True
    critical_flag_push: bool = True
    daily_summary_email: bool = False

class PracticeSettings(BaseModel):
    """Complete practice settings schema."""
    timezone: str = "America/New_York"
    huddle_generation_time: str = "06:00"  # 24-hour format
    risk_rules: RiskRulesConfig = RiskRulesConfig()
    notifications: NotificationSettings = NotificationSettings()
    
    # UI Preferences
    default_schedule_view: str = "day"  # "day" | "week"
    show_revenue_opportunities: bool = True
    
    # Data Retention (override defaults)
    schedule_retention_years: int = 3
    huddle_retention_years: int = 1
```

### 7.2 Built-in Risk Rules Reference

| Rule ID | Name | Default Condition | Severity | Category |
|---------|------|-------------------|----------|----------|
| MED-001 | Blood Thinner Alert | `age >= 60 AND procedure IN ('extraction', 'surgery', 'implant')` | CRITICAL | MEDICAL |
| MED-002 | Allergy Alert | `allergies IS NOT EMPTY` | CRITICAL | MEDICAL |
| MED-003 | Antibiotic Premedication | `premedication_required = true` | WARN | MEDICAL |
| MED-004 | Anxiety Flag | `anxiety_level >= 3` (scale 1-5) | INFO | MEDICAL |
| FIN-001 | Outstanding Balance | `balance >= threshold` | WARN | FINANCIAL |
| FIN-002 | Payment Plan Due | `payment_plan_overdue = true` | WARN | FINANCIAL |
| FIN-003 | Insurance Expired | `insurance_expiry < today` | INFO | FINANCIAL |
| SCH-001 | No-Show Risk | `no_show_count >= threshold in period` | WARN | SCHEDULING |
| SCH-002 | Late Arrival Pattern | `late_arrival_count >= 3 in 6 months` | INFO | SCHEDULING |
| SCH-003 | New Patient | `is_new_patient = true` | INFO | SCHEDULING |

### 7.3 Custom Rule Condition Syntax

Simple conditions supported for custom rules:

```python
# Field comparisons
"balance > 1000"
"age >= 65"
"procedure_code = 'D2750'"

# List membership
"procedure_code IN ('D2750', 'D2751', 'D2752')"

# Field existence
"notes CONTAINS 'anxious'"
"allergies IS NOT EMPTY"

# Boolean
"is_new_patient = true"
"premedication_required = true"

# Combinations (AND only for simplicity)
"age >= 60 AND procedure_code IN ('D7140', 'D7210')"
```

### 7.4 Example Practice Settings JSON

```json
{
  "timezone": "America/Los_Angeles",
  "huddle_generation_time": "05:30",
  "risk_rules": {
    "enabled_rules": ["MED-001", "MED-002", "FIN-001", "SCH-001", "SCH-003"],
    "thresholds": {
      "balance_threshold": 300,
      "no_show_count": 3,
      "no_show_period_months": 6,
      "senior_age_threshold": 55
    },
    "custom_rules": [
      {
        "id": "CUSTOM-001",
        "name": "VIP Patient",
        "condition": "notes CONTAINS 'VIP'",
        "severity": "INFO",
        "category": "CUSTOM",
        "action": "Ensure doctor personally greets patient",
        "enabled": true
      },
      {
        "id": "CUSTOM-002",
        "name": "Ortho Consultation",
        "condition": "procedure_code = 'D8660'",
        "severity": "INFO",
        "category": "SCHEDULING",
        "action": "Allow extra 15 minutes for consultation",
        "enabled": true
      }
    ]
  },
  "notifications": {
    "huddle_ready_email": true,
    "critical_flag_push": true,
    "daily_summary_email": true
  },
  "default_schedule_view": "day",
  "show_revenue_opportunities": true
}
```

### 7.5 Settings API Endpoints

#### `GET /api/v1/settings`

```yaml
Request:
  Authorization: Bearer <access_token>

Response 200:
  {
    "settings": { /* PracticeSettings object */ }
  }
```

#### `PATCH /api/v1/settings`

```yaml
Request:
  Authorization: Bearer <access_token> (Manager role required)
  Content-Type: application/json
  Body:
    {
      "risk_rules": {
        "thresholds": {
          "balance_threshold": 300
        }
      }
    }

Response 200:
  {
    "settings": { /* Updated PracticeSettings object */ },
    "message": "Settings updated successfully"
  }
```

#### `POST /api/v1/settings/risk-rules`

```yaml
Request:
  Authorization: Bearer <access_token> (Manager role required)
  Content-Type: application/json
  Body:
    {
      "id": "CUSTOM-003",
      "name": "High-Value Procedure",
      "condition": "procedure_value >= 5000",
      "severity": "INFO",
      "category": "FINANCIAL",
      "action": "Verify insurance pre-authorization"
    }

Response 201:
  {
    "rule": { /* CustomRiskRule object */ },
    "message": "Custom rule created successfully"
  }
```

---

## Cross-References

- **Tech stack versions**: See [TECH_STACK.md](./TECH_STACK.md)
- **User flows**: See [APP_FLOW.md](./APP_FLOW.md)
- **Feature requirements**: See [PRD.md](./PRD.md)
- **Agent workflow**: See [context/3_agent_workflow.md](./context/3_agent_workflow.md)