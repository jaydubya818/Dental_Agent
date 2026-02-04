# Technology Stack

> **LOCKED VERSIONS** - This document is the single source of truth for all dependencies.
> Do not upgrade without updating this file first.

---

## Frontend (apps/web)

| Package | Version | Purpose |
|---------|---------|---------|
| **Next.js** | `16.1.6` | React framework with App Router |
| **React** | `19.2.3` | UI library |
| **React DOM** | `19.2.3` | React DOM renderer |
| **TypeScript** | `^5` | Type safety |
| **Tailwind CSS** | `^4` | Utility-first CSS |
| **@tailwindcss/postcss** | `^4` | PostCSS integration |
| **ESLint** | `^9` | Code linting |
| **eslint-config-next** | `16.1.6` | Next.js ESLint rules |

### Shadcn/UI Components (To Install)

| Component | Purpose |
|-----------|---------|
| `button` | Primary actions |
| `card` | Content containers |
| `badge` | Status indicators |
| `alert` | Risk flag display |
| `dialog` | Modals |
| `input` | Form inputs |
| `label` | Form labels |
| `tabs` | Role switching |
| `avatar` | User display |
| `dropdown-menu` | Navigation menus |
| `skeleton` | Loading states |
| `toast` | Notifications |
| `tooltip` | Hover info |

---

## Backend - Cloud API (apps/api)

| Package | Version | Purpose |
|---------|---------|---------|
| **Python** | `>=3.11` | Runtime |
| **FastAPI** | `>=0.109.0` | Web framework |
| **Uvicorn** | `>=0.27.0` | ASGI server |
| **Pydantic** | `>=2.5.0` | Data validation |
| **pydantic-settings** | `>=2.1.0` | Config management |
| **python-jose** | `>=3.3.0` | JWT handling |
| **passlib[bcrypt]** | `>=1.7.4` | Password hashing |
| **python-multipart** | `>=0.0.6` | Form data parsing |
| **SQLAlchemy** | `>=2.0.25` | ORM |
| **Alembic** | `>=1.13.0` | Database migrations |
| **asyncpg** | `>=0.29.0` | Async PostgreSQL driver |
| **psycopg2-binary** | `>=2.9.9` | Sync PostgreSQL driver |
| **LangGraph** | `>=0.0.30` | Agent orchestration |
| **langchain-core** | `>=0.1.20` | LangChain base |
| **langchain-openai** | `>=0.0.5` | OpenAI integration |
| **httpx** | `>=0.26.0` | HTTP client |
| **tenacity** | `>=8.2.0` | Retry logic |
| **structlog** | `>=24.1.0` | Structured logging |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| pytest | `>=7.4.0` | Testing |
| pytest-asyncio | `>=0.23.0` | Async test support |
| pytest-cov | `>=4.1.0` | Coverage reports |
| ruff | `>=0.1.0` | Fast linter |
| black | `>=24.1.0` | Code formatter |
| mypy | `>=1.8.0` | Static type checking |

---

## Backend - Local Agent (apps/local-agent)

| Package | Version | Purpose |
|---------|---------|---------|
| **Python** | `>=3.11` | Runtime |
| **Playwright** | `>=1.41.0` | Browser automation |
| **httpx** | `>=0.26.0` | HTTP client for cloud API |
| **Pydantic** | `>=2.5.0` | Data validation |
| **pydantic-settings** | `>=2.1.0` | Config management |
| **pyodbc** | `>=5.0.0` | ODBC database access (Dentrix) |
| **cryptography** | `>=41.0.0` | PHI hashing |
| **schedule** | `>=1.2.0` | Task scheduling |
| **structlog** | `>=24.1.0` | Structured logging |

### Development & Build Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| pytest | `>=7.4.0` | Testing |
| pytest-asyncio | `>=0.23.0` | Async test support |
| ruff | `>=0.1.0` | Fast linter |
| black | `>=24.1.0` | Code formatter |
| mypy | `>=1.8.0` | Static type checking |
| PyInstaller | `>=6.3.0` | Compile to .exe |
| pywin32 | `>=306` | Windows service (Windows only) |

---

## Shared Package (packages/shared)

| Package | Version | Purpose |
|---------|---------|---------|
| **Pydantic** | `>=2.5.0` | Shared schema definitions |

---

## Database

| Technology | Version | Purpose |
|------------|---------|---------|
| **PostgreSQL** | `14+` | Cloud database |
| **SQLite** | `3.x` | Local agent cache |

### PostgreSQL Extensions

| Extension | Purpose |
|-----------|---------|
| `uuid-ossp` | UUID generation |
| `pgcrypto` | Encryption functions |

---

## AI & LLM

| Service | Model | Purpose |
|---------|-------|---------|
| **Azure OpenAI** | `gpt-4` | Primary LLM (HIPAA BAA) |
| **Azure OpenAI** | `gpt-4-turbo` | Alternative (faster) |
| **Local Mistral** | `mistral-7b` | On-prem PII filtering (optional) |

### LangGraph Configuration

```python
# Target LangGraph version constraints
LANGGRAPH_VERSION = ">=0.0.30"
LANGCHAIN_CORE_VERSION = ">=0.1.20"
LANGCHAIN_OPENAI_VERSION = ">=0.0.5"
```

---

## Infrastructure

| Component | Technology | Version/Config |
|-----------|------------|----------------|
| **Node.js** | Runtime | `>=20.0.0` |
| **npm** | Package manager | `>=10.0.0` |
| **Docker** | Containerization | `24.x` |
| **Docker Compose** | Multi-container | `2.x` |

---

## Security

| Component | Technology | Notes |
|-----------|------------|-------|
| **Encryption at Rest** | AES-256 | PostgreSQL, SQLite |
| **Encryption in Transit** | TLS 1.3 | All API communications |
| **Password Hashing** | bcrypt | Cost factor 12 |
| **JWT Signing** | RS256 | Asymmetric keys |
| **Key Management** | AWS KMS / Azure Key Vault | Production |

---

## Deployment Targets

| Environment | Frontend | Backend | Database |
|-------------|----------|---------|----------|
| **Development** | `localhost:3000` | `localhost:8000` | `localhost:5432` |
| **Staging** | Vercel Preview | Railway/Render | Supabase |
| **Production** | Vercel | AWS ECS/GCP Run | AWS RDS / Supabase |

---

## Version Lock Rules

1. **NEVER** upgrade a major version without team review
2. **ALWAYS** update this file when changing any dependency
3. **TEST** all upgrades in staging before production
4. **DOCUMENT** breaking changes in CHANGELOG.md

---

## Cross-References

- **Installation**: See [README.md](../README.md#quick-start)
- **Backend structure**: See [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md)
- **Frontend guidelines**: See [FRONTEND_GUIDELINES.md](./FRONTEND_GUIDELINES.md)
