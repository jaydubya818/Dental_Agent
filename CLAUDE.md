# Claude AI Operating Manual

> This file is read automatically by AI at the start of every session.
> It defines the rules, constraints, and patterns for this project.

---

## Project Overview

**Jerome's Dental Front-Office Agent** is an AI-driven "Morning Huddle" automation platform for dental practices. It uses a hybrid on-premises/cloud architecture to ensure HIPAA compliance while delivering AI-powered insights.

### Core Components

| Component | Location | Technology |
|-----------|----------|------------|
| Web Dashboard | `apps/web/` | Next.js 16, React 19, Tailwind 4 |
| Cloud API | `apps/api/` | Python 3.11+, FastAPI 0.109+ |
| Local Agent | `apps/local-agent/` | Python 3.11+, Playwright |
| Shared Schemas | `packages/shared/` | Pydantic 2.5+ |

---

## Tech Stack (Locked Versions)

### Frontend
- Next.js: `16.1.6`
- React: `19.2.3`
- TypeScript: `^5`
- Tailwind CSS: `^4`
- UI Library: Shadcn/UI

### Backend
- Python: `>=3.11`
- FastAPI: `>=0.109.0`
- SQLAlchemy: `>=2.0.25`
- LangGraph: `>=0.0.30`
- Database: PostgreSQL 14+

**Full version details**: See [docs/TECH_STACK.md](./docs/TECH_STACK.md)

---

## Code Conventions

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| React Components | PascalCase | `RiskFlagCard.tsx` |
| React Pages | lowercase with dashes | `page.tsx` in `app/(dashboard)/schedule/` |
| Python Modules | snake_case | `risk_scanner.py` |
| Python Classes | PascalCase | `RiskScannerAgent` |
| API Routes | snake_case | `/api/v1/schedule/ingest` |
| Database Tables | snake_case | `risk_flags` |

### Import Order

**TypeScript/React:**
```typescript
// 1. React/Next imports
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 2. Third-party libraries
import { motion } from 'framer-motion';

// 3. UI components (Shadcn)
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 4. Local components
import { RiskFlagCard } from '@/components/huddle/RiskFlagCard';

// 5. Utilities and types
import { cn } from '@/lib/utils';
import type { RiskFlag } from '@/types';
```

**Python:**
```python
# 1. Standard library
from datetime import datetime
from typing import List, Optional

# 2. Third-party
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

# 3. Local modules
from app.core.security import get_current_user
from app.models.risk import RiskFlag
from app.schemas.risk import RiskFlagResponse
```

---

## Component Patterns

### React Components

```tsx
// Always use named exports
// Props interface at top
// Destructure props
// Use Tailwind for styling

interface RiskFlagCardProps {
  flag: RiskFlag;
  onAcknowledge: (id: string) => void;
}

export function RiskFlagCard({ flag, onAcknowledge }: RiskFlagCardProps) {
  const levelColors = {
    critical: 'bg-red-100 border-red-500 text-red-800',
    warn: 'bg-amber-100 border-amber-500 text-amber-800',
    info: 'bg-blue-100 border-blue-500 text-blue-800',
  };

  return (
    <Card className={cn('border-l-4 p-4', levelColors[flag.level])}>
      <div className="flex justify-between items-start">
        <div>
          <Badge>{flag.level.toUpperCase()}</Badge>
          <p className="mt-2">{flag.message}</p>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onAcknowledge(flag.id)}
        >
          Acknowledge
        </Button>
      </div>
    </Card>
  );
}
```

### FastAPI Endpoints

```python
# Always include:
# - Type hints
# - Pydantic request/response models
# - Dependency injection for auth
# - Audit logging

@router.post("/risks/{id}/acknowledge", response_model=RiskFlagResponse)
async def acknowledge_risk(
    id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> RiskFlagResponse:
    """Acknowledge a risk flag."""
    flag = await crud.risk.get(db, id=id)
    if not flag:
        raise HTTPException(status_code=404, detail="Risk flag not found")
    
    flag = await crud.risk.acknowledge(db, flag=flag, user=current_user)
    
    # Audit log
    await audit.log(
        db,
        user=current_user,
        action="acknowledge_risk",
        resource_type="risk_flag",
        resource_id=id,
    )
    
    return flag
```

---

## What's Allowed ✅

- Use Shadcn/UI for all UI components
- Use Tailwind CSS for styling
- Use Pydantic for all data validation
- Use SQLAlchemy for database operations
- Use LangGraph for agent orchestration
- Use httpx for HTTP requests (Python)
- Use SWR or React Query for data fetching (React)

---

## What's Forbidden ❌

### Security (CRITICAL)

- **NEVER** send PHI (Protected Health Information) to the cloud
- **NEVER** log sensitive data (passwords, tokens, patient data)
- **NEVER** store API keys in code (use environment variables)
- **NEVER** disable HTTPS in production
- **NEVER** skip authentication on protected routes

### Code Quality

- **NO** inline styles in React (use Tailwind)
- **NO** `console.log` in production code (use structured logging)
- **NO** `any` types in TypeScript (be explicit)
- **NO** raw SQL queries (use SQLAlchemy ORM)
- **NO** synchronous database calls in FastAPI
- **NO** hardcoded values (use config/env vars)

### Architecture

- **NO** business logic in API route handlers (use services)
- **NO** direct database access from React (use API)
- **NO** circular imports between modules
- **NO** mixing sync and async code in FastAPI

---

## HIPAA Compliance Rules

### Data Handling

1. **Local Agent Only**: All PHI processing happens on-premises
2. **Tokenization**: Patient names replaced with tokens before cloud
3. **Hashing**: SSN, insurance IDs hashed with SHA-256 + practice salt
4. **Audit Logs**: Every data access must be logged
5. **Encryption**: AES-256 at rest, TLS 1.3 in transit

### What CAN go to cloud (sanitized):

- Patient tokens (anonymous IDs)
- Procedure codes
- Time slots
- Provider IDs
- Risk flags (no PHI in message)

### What CANNOT go to cloud:

- Patient names
- SSN / Tax ID
- Insurance member IDs
- Phone numbers
- Addresses
- Date of birth
- Medical record numbers

---

## Design Tokens

Reference: [docs/FRONTEND_GUIDELINES.md](./docs/FRONTEND_GUIDELINES.md)

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#2563EB` | Buttons, links |
| Success | `#10B981` | Completed states |
| Warning | `#F59E0B` | Caution alerts |
| Error | `#EF4444` | Errors, critical |

### Risk Badge Colors

| Level | Background | Text |
|-------|------------|------|
| CRITICAL | `bg-red-100` | `text-red-800` |
| WARN | `bg-amber-100` | `text-amber-800` |
| INFO | `bg-blue-100` | `text-blue-800` |

---

## Common Tasks

### Adding a New API Endpoint

1. Define Pydantic schemas in `app/schemas/`
2. Create route in `app/routers/`
3. Add business logic in `app/services/`
4. Register router in `app/main.py`
5. Add audit logging
6. Update API documentation

### Adding a New Dashboard Page

1. Create page in `app/(dashboard)/[route]/page.tsx`
2. Add to navigation in layout
3. Create components in `components/[feature]/`
4. Use Shadcn/UI for UI elements
5. Follow FRONTEND_GUIDELINES.md for styling

### Adding a New Agent

1. Create agent in `app/agents/`
2. Define input/output schemas
3. Add node to graph in `app/agents/graph.py`
4. Add error handling and retries
5. Write unit tests

---

## Debugging

### API Issues

```bash
# Check API logs
cd apps/api && uvicorn app.main:app --reload --log-level debug

# Test endpoint
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "test123"}'
```

### Database Issues

```bash
# Check migrations
cd apps/api && alembic current
cd apps/api && alembic history

# Reset database (development only!)
cd apps/api && alembic downgrade base && alembic upgrade head
```

### Frontend Issues

```bash
# Clear Next.js cache
rm -rf apps/web/.next

# Check TypeScript errors
npm run type-check

# Check lint errors
npm run lint
```

---

## Session Continuity

Before ending a session, update [progress.txt](./progress.txt) with:

1. What was completed
2. What is in progress
3. What's next
4. Any blockers or issues

This ensures the next session can pick up where you left off.

---

## Cross-References

| Document | Purpose |
|----------|---------|
| [docs/PRD.md](./docs/context/JEROME_DENTAL_PRD.md) | Feature requirements |
| [docs/APP_FLOW.md](./docs/APP_FLOW.md) | User navigation |
| [docs/TECH_STACK.md](./docs/TECH_STACK.md) | Locked versions |
| [docs/FRONTEND_GUIDELINES.md](./docs/FRONTEND_GUIDELINES.md) | Design system |
| [docs/BACKEND_STRUCTURE.md](./docs/BACKEND_STRUCTURE.md) | DB & API contracts |
| [docs/IMPLEMENTATION_PLAN.md](./docs/IMPLEMENTATION_PLAN.md) | Build sequence |
| [progress.txt](./progress.txt) | Session state |
