# Testing Strategy

> Comprehensive testing approach for the Jerome Dental Front-Office Agent, ensuring HIPAA compliance, reliability, and quality.

---

## Overview

Testing is critical for this healthcare application. All critical paths must have automated tests, and HIPAA-sensitive code requires extra scrutiny.

**Testing Principles:**
1. **Determinism First**: All calculations must be reproducible
2. **HIPAA Compliance**: No PHI in test logs or outputs
3. **Isolation**: Tests must not affect production data
4. **Coverage**: Critical paths require > 80% coverage

---

## 1. Test Types & Tools

### 1.1 Testing Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| **API Unit** | pytest + pytest-asyncio | FastAPI route/service testing |
| **API Integration** | pytest + httpx | Full API endpoint testing |
| **Frontend Unit** | Vitest + React Testing Library | Component testing |
| **Frontend E2E** | Playwright | Full user flow testing |
| **Local Agent** | pytest | Connector and scheduler testing |
| **Shared Schemas** | pytest + pydantic | Schema validation testing |

### 1.2 Test Directory Structure

```
apps/
├── api/
│   └── tests/
│       ├── unit/
│       │   ├── test_auth.py
│       │   ├── test_huddle_service.py
│       │   └── test_risk_rules.py
│       ├── integration/
│       │   ├── test_api_schedule.py
│       │   ├── test_api_huddle.py
│       │   └── test_api_settings.py
│       ├── conftest.py          # Fixtures
│       └── fixtures/
│           └── sample_schedule.json
│
├── web/
│   └── __tests__/
│       ├── components/
│       │   ├── Dashboard.test.tsx
│       │   └── HuddleCard.test.tsx
│       ├── pages/
│       │   └── login.test.tsx
│       └── e2e/
│           ├── auth.spec.ts
│           ├── huddle-view.spec.ts
│           └── settings.spec.ts
│
├── local-agent/
│   └── tests/
│       ├── test_csv_connector.py
│       ├── test_sanitizer.py
│       └── test_scheduler.py
│
└── packages/
    └── shared/
        └── tests/
            ├── test_schedule_schema.py
            └── test_risk_flag_schema.py
```

---

## 2. Unit Testing

### 2.1 Backend (FastAPI/Python)

**Configuration: `apps/api/pyproject.toml`**
```toml
[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["tests"]
python_files = ["test_*.py"]
python_functions = ["test_*"]
addopts = [
    "-v",
    "--cov=app",
    "--cov-report=term-missing",
    "--cov-fail-under=80"
]
```

**Example: Testing Risk Rules**
```python
# tests/unit/test_risk_rules.py
import pytest
from datetime import date
from app.services.risk_scanner import RiskScanner, RiskFlag

class TestRiskScanner:
    """Tests for the RiskScannerAgent."""
    
    @pytest.fixture
    def scanner(self):
        return RiskScanner(enabled_rules=["MED-001", "FIN-001"])
    
    @pytest.fixture
    def senior_patient_extraction(self):
        """Patient over 60 with extraction procedure."""
        return {
            "patient_id": "tok_abc123",  # Tokenized, not real PHI
            "age": 67,
            "procedure_code": "D7140",  # Simple extraction
            "allergies": [],
            "balance": 0.0
        }
    
    def test_blood_thinner_alert_for_senior_extraction(
        self, scanner, senior_patient_extraction
    ):
        """MED-001: Senior patients with surgical procedures should flag."""
        flags = scanner.evaluate(senior_patient_extraction)
        
        assert len(flags) == 1
        assert flags[0].rule_id == "MED-001"
        assert flags[0].severity == "CRITICAL"
        assert flags[0].category == "MEDICAL"
    
    def test_no_flag_for_young_patient(self, scanner):
        """Young patients should not trigger age-based rules."""
        patient = {
            "patient_id": "tok_def456",
            "age": 35,
            "procedure_code": "D7140",
            "allergies": [],
            "balance": 0.0
        }
        
        flags = scanner.evaluate(patient)
        
        assert len(flags) == 0
    
    def test_outstanding_balance_flag(self, scanner):
        """FIN-001: Patients with high balance should flag."""
        patient = {
            "patient_id": "tok_ghi789",
            "age": 45,
            "procedure_code": "D0150",
            "allergies": [],
            "balance": 750.0  # Above default threshold of 500
        }
        
        flags = scanner.evaluate(patient)
        
        assert any(f.rule_id == "FIN-001" for f in flags)
        assert any(f.severity == "WARN" for f in flags)
```

**Example: Testing Auth Service**
```python
# tests/unit/test_auth.py
import pytest
from datetime import datetime, timedelta
from app.services.auth import AuthService, TokenPayload
from app.models.user import User
from freezegun import freeze_time

class TestAuthService:
    """Tests for authentication service."""
    
    @pytest.fixture
    def auth_service(self, mock_db_session, mock_jwt_keys):
        return AuthService(db=mock_db_session, jwt_keys=mock_jwt_keys)
    
    async def test_password_verification_success(self, auth_service):
        """Correct password should verify."""
        hashed = auth_service.hash_password("secure123")
        assert auth_service.verify_password("secure123", hashed) is True
    
    async def test_password_verification_failure(self, auth_service):
        """Wrong password should not verify."""
        hashed = auth_service.hash_password("secure123")
        assert auth_service.verify_password("wrong", hashed) is False
    
    async def test_token_generation(self, auth_service):
        """Access token should contain user claims."""
        user = User(id="uuid", email="test@practice.com", role="staff")
        token = auth_service.create_access_token(user)
        
        payload = auth_service.decode_token(token)
        assert payload.sub == "uuid"
        assert payload.role == "staff"
    
    @freeze_time("2026-02-04 12:00:00")
    async def test_token_expiration(self, auth_service):
        """Expired token should raise error."""
        user = User(id="uuid", email="test@practice.com", role="staff")
        token = auth_service.create_access_token(user)
        
        # Move time forward past expiration
        with freeze_time("2026-02-04 13:00:00"):  # 1 hour later
            with pytest.raises(TokenExpiredError):
                auth_service.decode_token(token)
```

### 2.2 Frontend (React/Vitest)

**Configuration: `apps/web/vitest.config.ts`**
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', '**/*.d.ts']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

**Example: Testing HuddleCard Component**
```typescript
// __tests__/components/HuddleCard.test.tsx
import { render, screen } from '@testing-library/react'
import { HuddleCard } from '@/components/huddle/HuddleCard'
import { describe, it, expect } from 'vitest'

describe('HuddleCard', () => {
  const mockHuddle = {
    id: 'huddle-123',
    date: '2026-02-04',
    status: 'ready' as const,
    clinicalSummary: 'Today we have 15 patients...',
    patientCount: 15,
    criticalFlags: 2,
    warnFlags: 5
  }

  it('renders patient count correctly', () => {
    render(<HuddleCard huddle={mockHuddle} />)
    
    expect(screen.getByText('15 patients')).toBeInTheDocument()
  })

  it('displays critical flag badge when flags exist', () => {
    render(<HuddleCard huddle={mockHuddle} />)
    
    expect(screen.getByTestId('critical-badge')).toHaveTextContent('2')
  })

  it('shows ready status indicator', () => {
    render(<HuddleCard huddle={mockHuddle} />)
    
    expect(screen.getByRole('status')).toHaveClass('bg-green-500')
  })

  it('does not show flags badge when zero flags', () => {
    render(<HuddleCard huddle={{ ...mockHuddle, criticalFlags: 0 }} />)
    
    expect(screen.queryByTestId('critical-badge')).not.toBeInTheDocument()
  })
})
```

---

## 3. Integration Testing

### 3.1 API Integration Tests

**Example: Schedule Ingestion Flow**
```python
# tests/integration/test_api_schedule.py
import pytest
from httpx import AsyncClient
from datetime import date

class TestScheduleIngestion:
    """Integration tests for schedule ingestion API."""
    
    @pytest.fixture
    async def authenticated_client(self, test_client, test_user):
        """Client with valid auth token."""
        token = await get_test_token(test_user)
        test_client.headers["Authorization"] = f"Bearer {token}"
        return test_client
    
    @pytest.fixture
    def valid_schedule_payload(self):
        return {
            "schedule_date": str(date.today()),
            "appointments": [
                {
                    "time_slot": "09:00",
                    "patient_token": "tok_abc123",
                    "procedure_code": "D0150",
                    "provider_id": "dr-smith",
                    "notes": ""
                },
                {
                    "time_slot": "10:00",
                    "patient_token": "tok_def456",
                    "procedure_code": "D2750",
                    "provider_id": "dr-smith",
                    "notes": "Crown prep"
                }
            ]
        }
    
    async def test_ingest_schedule_success(
        self, authenticated_client, valid_schedule_payload
    ):
        """Valid schedule should be ingested successfully."""
        response = await authenticated_client.post(
            "/api/v1/schedule/ingest",
            json=valid_schedule_payload
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["appointments_count"] == 2
        assert data["ingestion_status"] == "complete"
    
    async def test_ingest_schedule_without_auth(
        self, test_client, valid_schedule_payload
    ):
        """Unauthenticated request should be rejected."""
        response = await test_client.post(
            "/api/v1/schedule/ingest",
            json=valid_schedule_payload
        )
        
        assert response.status_code == 401
        assert response.json()["error_code"] == "AUTH_002"
    
    async def test_ingest_schedule_invalid_procedure_code(
        self, authenticated_client
    ):
        """Invalid procedure code should return validation error."""
        payload = {
            "schedule_date": str(date.today()),
            "appointments": [
                {
                    "time_slot": "09:00",
                    "patient_token": "tok_abc123",
                    "procedure_code": "INVALID",
                    "provider_id": "dr-smith"
                }
            ]
        }
        
        response = await authenticated_client.post(
            "/api/v1/schedule/ingest",
            json=payload
        )
        
        assert response.status_code == 400
        errors = response.json()["errors"]
        assert any(e["field"] == "appointments[0].procedure_code" for e in errors)
```

---

## 4. End-to-End Testing

### 4.1 Playwright Configuration

**`apps/web/playwright.config.ts`**
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './__tests__/e2e',
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'playwright-report/results.json' }]
  ],
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    }
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI
  }
})
```

### 4.2 E2E Test Examples

**Example: Login Flow**
```typescript
// __tests__/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

// Fail on console errors (per project rules)
test.beforeEach(async ({ page }) => {
  const errors: string[] = []
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text())
    }
  })
  page.on('pageerror', err => {
    errors.push(err.message)
  })
  
  // Store errors for afterEach check
  (page as any).__consoleErrors = errors
})

test.afterEach(async ({ page }) => {
  const errors = (page as any).__consoleErrors || []
  // Whitelist: React DevTools, known third-party issues
  const realErrors = errors.filter(e => 
    !e.includes('DevTools') &&
    !e.includes('favicon.ico')
  )
  expect(realErrors).toHaveLength(0)
})

test.describe('Authentication', () => {
  test('user can log in with valid credentials', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('[data-testid="email-input"]', 'test@practice.com')
    await page.fill('[data-testid="password-input"]', 'testpassword123')
    await page.click('[data-testid="login-button"]')
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('[data-testid="welcome-message"]')).toContainText(
      'Welcome'
    )
  })

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('[data-testid="email-input"]', 'test@practice.com')
    await page.fill('[data-testid="password-input"]', 'wrongpassword')
    await page.click('[data-testid="login-button"]')
    
    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toContainText(
      'Invalid email or password'
    )
    await expect(page).toHaveURL('/login')
  })

  test('login button is disabled while submitting', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('[data-testid="email-input"]', 'test@practice.com')
    await page.fill('[data-testid="password-input"]', 'testpassword123')
    
    const loginButton = page.locator('[data-testid="login-button"]')
    await loginButton.click()
    
    // Button should be disabled during submission
    await expect(loginButton).toBeDisabled()
  })
})
```

**Example: Morning Huddle Flow**
```typescript
// __tests__/e2e/huddle-view.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Morning Huddle', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('[data-testid="email-input"]', 'test@practice.com')
    await page.fill('[data-testid="password-input"]', 'testpassword123')
    await page.click('[data-testid="login-button"]')
    await page.waitForURL('/dashboard')
  })

  test('displays todays huddle on dashboard', async ({ page }) => {
    // Check for today's huddle card
    await expect(page.locator('[data-testid="todays-huddle"]')).toBeVisible()
    await expect(page.locator('[data-testid="patient-count"]')).toBeVisible()
  })

  test('can view huddle details', async ({ page }) => {
    await page.click('[data-testid="todays-huddle"]')
    
    await expect(page).toHaveURL(/\/huddle\//)
    await expect(page.locator('[data-testid="clinical-summary"]')).toBeVisible()
    await expect(page.locator('[data-testid="risk-flags-section"]')).toBeVisible()
  })

  test('risk flags are sorted by severity', async ({ page }) => {
    await page.click('[data-testid="todays-huddle"]')
    
    const flagSeverities = await page.locator('[data-testid="flag-severity"]')
      .allTextContents()
    
    // CRITICAL should come before WARN, WARN before INFO
    const severityOrder = ['CRITICAL', 'WARN', 'INFO']
    const sorted = [...flagSeverities].sort((a, b) => 
      severityOrder.indexOf(a) - severityOrder.indexOf(b)
    )
    
    expect(flagSeverities).toEqual(sorted)
  })

  test('can toggle between summary views', async ({ page }) => {
    await page.click('[data-testid="todays-huddle"]')
    
    // Default: Clinical
    await expect(page.locator('[data-testid="clinical-summary"]')).toBeVisible()
    
    // Switch to Hygiene
    await page.click('[data-testid="hygiene-tab"]')
    await expect(page.locator('[data-testid="hygiene-summary"]')).toBeVisible()
    
    // Switch to Admin
    await page.click('[data-testid="admin-tab"]')
    await expect(page.locator('[data-testid="admin-summary"]')).toBeVisible()
  })
})
```

---

## 5. HIPAA-Specific Testing

### 5.1 PHI Sanitization Tests

```python
# tests/unit/test_sanitizer.py
import pytest
from app.services.sanitizer import PHISanitizer

class TestPHISanitizer:
    """Tests for PHI sanitization before cloud transmission."""
    
    @pytest.fixture
    def sanitizer(self):
        return PHISanitizer(salt="test-salt-12345")
    
    def test_patient_name_tokenized(self, sanitizer):
        """Real names should be replaced with tokens."""
        record = {"patient_name": "John Smith", "procedure": "D0150"}
        sanitized = sanitizer.sanitize(record)
        
        assert sanitized["patient_name"] != "John Smith"
        assert sanitized["patient_name"].startswith("tok_")
    
    def test_ssn_redacted(self, sanitizer):
        """SSN should be completely removed."""
        record = {"patient_name": "John", "ssn": "123-45-6789"}
        sanitized = sanitizer.sanitize(record)
        
        assert "ssn" not in sanitized
    
    def test_phone_tokenized(self, sanitizer):
        """Phone numbers should be tokenized."""
        record = {"patient_name": "John", "phone": "555-123-4567"}
        sanitized = sanitizer.sanitize(record)
        
        assert sanitized["phone"] != "555-123-4567"
        assert sanitized["phone"].startswith("tok_")
    
    def test_address_removed(self, sanitizer):
        """Street addresses should be removed."""
        record = {
            "patient_name": "John",
            "address": "123 Main St, Springfield, IL 62701"
        }
        sanitized = sanitizer.sanitize(record)
        
        assert "address" not in sanitized
    
    def test_tokenization_deterministic(self, sanitizer):
        """Same input should produce same token."""
        record1 = {"patient_name": "John Smith"}
        record2 = {"patient_name": "John Smith"}
        
        token1 = sanitizer.sanitize(record1)["patient_name"]
        token2 = sanitizer.sanitize(record2)["patient_name"]
        
        assert token1 == token2
    
    def test_dob_age_converted(self, sanitizer):
        """Date of birth should be converted to age only."""
        record = {"patient_name": "John", "dob": "1960-01-15"}
        sanitized = sanitizer.sanitize(record)
        
        assert "dob" not in sanitized
        assert "age" in sanitized
        assert sanitized["age"] == 66  # As of 2026
```

### 5.2 Audit Logging Tests

```python
# tests/unit/test_audit_logging.py
import pytest
from app.services.audit import AuditLogger, AuditEvent

class TestAuditLogging:
    """Tests for HIPAA audit trail."""
    
    @pytest.fixture
    def logger(self, mock_db):
        return AuditLogger(db=mock_db)
    
    async def test_phi_access_logged(self, logger):
        """Accessing PHI records should create audit entry."""
        await logger.log(
            event_type=AuditEvent.PHI_ACCESS,
            user_id="user-123",
            resource_type="patient",
            resource_id="patient-456",
            action="view"
        )
        
        entries = await logger.get_entries(user_id="user-123")
        assert len(entries) == 1
        assert entries[0].event_type == AuditEvent.PHI_ACCESS
    
    async def test_audit_entries_immutable(self, logger):
        """Audit entries cannot be modified."""
        entry = await logger.log(
            event_type=AuditEvent.PHI_ACCESS,
            user_id="user-123",
            resource_type="patient",
            resource_id="patient-456",
            action="view"
        )
        
        with pytest.raises(ImmutableRecordError):
            await logger.update(entry.id, action="delete")
    
    async def test_audit_contains_required_fields(self, logger):
        """Audit entries must have all required HIPAA fields."""
        entry = await logger.log(
            event_type=AuditEvent.PHI_ACCESS,
            user_id="user-123",
            resource_type="patient",
            resource_id="patient-456",
            action="view"
        )
        
        # Required fields per HIPAA
        assert entry.timestamp is not None
        assert entry.user_id is not None
        assert entry.event_type is not None
        assert entry.source_ip is not None
        assert entry.resource_type is not None
```

---

## 6. Test Fixtures & Mocking

### 6.1 Python Fixtures

```python
# tests/conftest.py
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from app.main import app
from app.db import get_db

@pytest.fixture
async def test_db():
    """Create test database session."""
    engine = create_async_engine(
        "sqlite+aiosqlite:///:memory:",
        echo=False
    )
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with AsyncSession(engine) as session:
        yield session
    
    await engine.dispose()

@pytest.fixture
async def test_client(test_db):
    """HTTP test client with test database."""
    async def override_get_db():
        yield test_db
    
    app.dependency_overrides[get_db] = override_get_db
    
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client
    
    app.dependency_overrides.clear()

@pytest.fixture
def test_user(test_db):
    """Create a test user."""
    user = User(
        id="test-user-123",
        email="test@practice.com",
        hashed_password=hash_password("testpassword123"),
        role="staff",
        practice_id="test-practice-456"
    )
    test_db.add(user)
    return user

@pytest.fixture
def mock_azure_openai(mocker):
    """Mock Azure OpenAI API calls."""
    return mocker.patch(
        "app.services.writer.AzureOpenAI",
        return_value=MockAzureOpenAI()
    )
```

---

## 7. CI/CD Integration

### 7.1 GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      
      - name: Install dependencies
        run: |
          cd apps/api
          pip install -e ".[dev]"
      
      - name: Run tests
        run: |
          cd apps/api
          pytest --cov=app --cov-report=xml
      
      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          files: apps/api/coverage.xml

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: |
          cd apps/web
          npm ci
      
      - name: Run unit tests
        run: |
          cd apps/web
          npm run test
      
      - name: Build
        run: |
          cd apps/web
          npm run build

  e2e-tests:
    runs-on: ubuntu-latest
    needs: [backend-tests, frontend-tests]
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Playwright
        run: |
          cd apps/web
          npm ci
          npx playwright install --with-deps chromium
      
      - name: Run E2E tests
        run: |
          cd apps/web
          npm run test:e2e
      
      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: apps/web/playwright-report
```

---

## 8. Coverage Requirements

### 8.1 Coverage Targets

| Component | Minimum | Target | Critical Paths |
|-----------|---------|--------|----------------|
| API Core | 70% | 85% | 100% |
| Risk Scanner | 80% | 95% | 100% |
| Auth Service | 80% | 95% | 100% |
| PHI Sanitizer | 90% | 100% | 100% |
| Frontend Components | 60% | 80% | N/A |
| E2E Flows | N/A | N/A | 100% |

### 8.2 Critical Paths (Must Have 100% Coverage)

1. **Authentication**: Login, logout, token refresh, MFA
2. **PHI Handling**: Sanitization, tokenization, transmission
3. **Risk Flagging**: All built-in rules evaluation
4. **Audit Logging**: All PHI access events
5. **Authorization**: Role-based access checks

---

## 9. Running Tests

### 9.1 Quick Reference Commands

```bash
# Backend unit tests
cd apps/api
pytest tests/unit

# Backend integration tests
cd apps/api
pytest tests/integration

# Frontend unit tests
cd apps/web
npm run test

# Frontend tests with coverage
cd apps/web
npm run test:coverage

# E2E tests (headed for debugging)
cd apps/web
npx playwright test --headed

# E2E tests (specific file)
cd apps/web
npx playwright test auth.spec.ts

# All tests
npm run test:all  # (root package.json script)
```

### 9.2 Pre-Commit Hook

```bash
#!/bin/sh
# .husky/pre-commit

# Run linting
npm run lint

# Run type checking
npm run typecheck

# Run affected tests
npm run test:affected
```

---

## Cross-References

- **Deployment checklist**: See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- **Backend structure**: See [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md)
- **Frontend guidelines**: See [FRONTEND_GUIDELINES.md](./FRONTEND_GUIDELINES.md)
- **Implementation plan**: See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
