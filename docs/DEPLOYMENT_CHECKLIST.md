# Deployment Checklist

> Pre-flight verification for deploying the Jerome Dental Front-Office Agent to production.

---

## Overview

This checklist covers all critical items that must be verified before each deployment. Items are organized by component and priority.

**Legend:**
- 🔴 **CRITICAL** - Deployment blocker if not complete
- 🟡 **IMPORTANT** - Should be complete; proceed with caution if not
- 🟢 **RECOMMENDED** - Best practice; can defer if needed

---

## 1. Pre-Deployment Verification

### 1.1 Code Quality

| Status | Priority | Item |
|--------|----------|------|
| ☐ | 🔴 | All tests pass locally: `npm run test` / `pytest` |
| ☐ | 🔴 | E2E tests pass: `npm run test:e2e` |
| ☐ | 🔴 | Linting passes: `npm run lint` |
| ☐ | 🔴 | Type checking passes: `npm run typecheck` |
| ☐ | 🔴 | Build succeeds: `npm run build` |
| ☐ | 🟡 | No console errors in Chrome DevTools |
| ☐ | 🟢 | Bundle size within budget (< 500KB initial JS) |

### 1.2 Security Review

| Status | Priority | Item |
|--------|----------|------|
| ☐ | 🔴 | No secrets in codebase (`git grep -i "password\|secret\|api_key"`) |
| ☐ | 🔴 | All environment variables documented in `.env.example` |
| ☐ | 🔴 | HIPAA-sensitive data handling reviewed |
| ☐ | 🔴 | JWT private key securely stored (not in repo) |
| ☐ | 🟡 | Dependency audit clean: `npm audit --audit-level=high` |
| ☐ | 🟡 | Python dependencies audited: `pip-audit` |
| ☐ | 🟢 | CSP headers configured correctly |

### 1.3 Database

| Status | Priority | Item |
|--------|----------|------|
| ☐ | 🔴 | Database migrations tested on staging |
| ☐ | 🔴 | Migration is reversible (has down migration) |
| ☐ | 🔴 | No destructive changes without explicit approval |
| ☐ | 🟡 | Database backup taken before migration |
| ☐ | 🟢 | Query performance validated (no new slow queries) |

---

## 2. Environment Configuration

### 2.1 Cloud API (apps/api)

| Status | Variable | Production Value Required |
|--------|----------|---------------------------|
| ☐ | `SECRET_KEY` | Unique 32+ character random string |
| ☐ | `DATABASE_URL` | Production PostgreSQL connection string |
| ☐ | `JWT_PRIVATE_KEY_PATH` | Path to RSA private key |
| ☐ | `JWT_PUBLIC_KEY_PATH` | Path to RSA public key |
| ☐ | `AZURE_OPENAI_API_KEY` | Azure OpenAI key (HIPAA BAA required) |
| ☐ | `AZURE_OPENAI_ENDPOINT` | Azure OpenAI endpoint URL |
| ☐ | `CORS_ORIGINS` | Production frontend URL only |
| ☐ | `SENTRY_DSN` | Error tracking DSN (optional but recommended) |

### 2.2 Frontend (apps/web)

| Status | Variable | Production Value Required |
|--------|----------|---------------------------|
| ☐ | `NEXT_PUBLIC_API_URL` | Production API URL |
| ☐ | `NEXT_PUBLIC_APP_URL` | Production app URL |

### 2.3 Local Agent (apps/local-agent)

| Status | Variable | Per-Practice Configuration |
|--------|----------|---------------------------|
| ☐ | `CLOUD_API_URL` | Production API URL |
| ☐ | `AGENT_API_KEY` | Practice-specific API key |
| ☐ | `PRACTICE_ID` | Practice UUID from cloud registration |
| ☐ | `PRACTICE_SALT` | Unique salt for PHI tokenization |
| ☐ | `PMS_TYPE` | Appropriate connector type |

---

## 3. Infrastructure Verification

### 3.1 Cloud Infrastructure

| Status | Priority | Item |
|--------|----------|------|
| ☐ | 🔴 | Database connection verified from API server |
| ☐ | 🔴 | Azure OpenAI API reachable and configured |
| ☐ | 🔴 | SSL/TLS certificates valid and not expiring soon |
| ☐ | 🟡 | CDN cache purged (if applicable) |
| ☐ | 🟡 | Rate limiting configured |
| ☐ | 🟢 | Monitoring dashboards updated |

### 3.2 DNS & Routing

| Status | Priority | Item |
|--------|----------|------|
| ☐ | 🔴 | API domain resolves correctly |
| ☐ | 🔴 | Frontend domain resolves correctly |
| ☐ | 🟡 | CORS origins match actual domains |

---

## 4. HIPAA Compliance Verification

### 4.1 Data Handling

| Status | Priority | Item |
|--------|----------|------|
| ☐ | 🔴 | No PHI logged to console or error tracking |
| ☐ | 🔴 | PHI sanitized before leaving practice network |
| ☐ | 🔴 | Azure OpenAI BAA in place |
| ☐ | 🔴 | Data encryption at rest confirmed |
| ☐ | 🔴 | Data encryption in transit (TLS 1.2+) confirmed |
| ☐ | 🟡 | Audit logging enabled |

### 4.2 Access Control

| Status | Priority | Item |
|--------|----------|------|
| ☐ | 🔴 | Authentication required for all API endpoints |
| ☐ | 🔴 | Role-based access control enforced |
| ☐ | 🔴 | Practice isolation verified (no cross-practice data access) |
| ☐ | 🟡 | MFA enabled for admin accounts |

---

## 5. Deployment Steps

### 5.1 Cloud API Deployment

```bash
# 1. Run final tests
cd apps/api
pytest --cov=app tests/

# 2. Build container
docker build -t jerome-api:v$VERSION .

# 3. Push to registry
docker push your-registry/jerome-api:v$VERSION

# 4. Run database migrations (if any)
alembic upgrade head

# 5. Deploy new version
# (platform-specific: Kubernetes, ECS, Cloud Run, etc.)

# 6. Verify health check
curl https://api.yourdomain.com/health
```

### 5.2 Frontend Deployment

```bash
# 1. Build production bundle
cd apps/web
npm run build

# 2. Verify build output
npx next info

# 3. Deploy to Vercel (or other platform)
vercel --prod

# 4. Verify deployment
curl -I https://yourdomain.com
```

### 5.3 Local Agent Update (Per Practice)

```bash
# 1. Download new agent version
# (mechanism TBD: auto-update, manual download, etc.)

# 2. Stop existing agent
systemctl stop jerome-agent  # or equivalent

# 3. Backup existing configuration
cp config.json config.json.backup

# 4. Install new version
# (platform-specific)

# 5. Start agent
systemctl start jerome-agent

# 6. Verify connection to cloud
tail -f /var/log/jerome-agent/agent.log
```

---

## 6. Post-Deployment Verification

### 6.1 Smoke Tests

| Status | Priority | Test |
|--------|----------|------|
| ☐ | 🔴 | Login works (email/password) |
| ☐ | 🔴 | Dashboard loads with data |
| ☐ | 🔴 | Schedule ingestion works (test practice) |
| ☐ | 🔴 | Morning huddle generates successfully |
| ☐ | 🟡 | Risk flags display correctly |
| ☐ | 🟡 | Revenue opportunities display correctly |
| ☐ | 🟢 | Settings page loads and saves |

### 6.2 Monitoring Check

| Status | Priority | Item |
|--------|----------|------|
| ☐ | 🔴 | No new errors in Sentry |
| ☐ | 🔴 | API response times normal |
| ☐ | 🔴 | Database CPU/memory normal |
| ☐ | 🟡 | Azure OpenAI API quota sufficient |
| ☐ | 🟢 | All health check endpoints passing |

---

## 7. Rollback Plan

### 7.1 Triggers for Rollback

- Authentication completely broken
- Data corruption detected
- HIPAA violation discovered
- Error rate > 5% on critical paths
- API latency > 5 seconds (p95)

### 7.2 Rollback Steps

```bash
# Cloud API
# 1. Point load balancer to previous version
# 2. If database migration applied:
alembic downgrade -1
# 3. Verify rollback successful

# Frontend (Vercel)
vercel rollback

# Local Agent
systemctl stop jerome-agent
cp config.json.backup config.json
# Install previous version
systemctl start jerome-agent
```

### 7.3 Communication

- [ ] Notify practice managers if service disruption expected
- [ ] Update status page (if applicable)
- [ ] Document incident in post-mortem

---

## 8. Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Developer | | | |
| QA | | | |
| Security (HIPAA deployments) | | | |
| Product Owner | | | |

---

## Appendix: Quick Reference Commands

```bash
# Run all checks
npm run lint && npm run typecheck && npm run test && npm run build

# Check for secrets
git grep -i "password\|secret\|api_key\|private" -- '*.ts' '*.py' '*.json'

# Dependency audit
npm audit --audit-level=high
pip-audit

# Database migration status
alembic current
alembic history

# Health check
curl -s https://api.yourdomain.com/health | jq
```

---

## Cross-References

- **Technical architecture**: See [TECH_STACK.md](./TECH_STACK.md)
- **Backend structure**: See [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md)
- **Environment variables**: See [.env.example](../.env.example)
- **Testing strategy**: See [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)
