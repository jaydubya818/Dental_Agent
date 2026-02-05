# SellerFin Custom Agent Configuration

## 🏦 Platform Overview
**SellerFin** - Seller Financing Platform connecting business buyers and sellers through innovative financing solutions.

**Tech Stack**:
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (with Vercel Postgres)
- **Authentication**: NextAuth.js
- **Payment**: Stripe integration
- **Real-time**: Socket.io
- **Search**: AI-powered with embeddings
- **Analytics**: Custom analytics system

**Development Tools**:
- **Task Management**: Taskmaster AI (project-level tasks)
- **Workflows**: Compound Engineering Plugin (implementation-level)
- **Agents**: 178+ specialized agents (151 core + 27 Compound)
- **Skills**: 65+ skills (51 core + 14 Compound)
- **Commands**: 49+ slash commands (29 core + 20 Compound)

---

## 🎯 Priority Agent Teams

### 🔥 **High-Priority Agents** (Daily Use)

#### **Development Core Team**
1. **@react-pro** - React/Next.js components and pages
2. **@typescript-pro** - Type safety across the platform
3. **@full-stack-developer** - Full-stack features (buyer/seller flows)
4. **@api-architect** - API route design and optimization
5. **@database-optimizer** - Prisma query optimization

#### **Quality & Performance Team**
6. **@code-reviewer** - Code quality gates
7. **@test-automator** - Test suite maintenance
8. **@performance-optimizer** - Page load and rendering optimization
9. **@security-auditor** - Financial data security
10. **@postgres-pro** - Database performance tuning

#### **UX & Product Team**
11. **@ui-designer** - Component and page design
12. **@ux-researcher** - User flow optimization
13. **@product-manager** - Feature prioritization
14. **@accessibility-expert** - WCAG compliance

---

## 📋 Common SellerFin Workflows

### 1. **New Feature Development**

#### Example: "Add buyer qualification calculator"
```bash
@supervisor-orchestrator "Implement buyer qualification calculator feature:
- Frontend: Interactive calculator component
- Backend: Qualification API endpoint
- Data: Integration with buyer profile
- Security: Input validation and rate limiting
- Testing: Unit and integration tests"
```

**Agents Activated**:
1. `@react-pro` - Calculator component with real-time updates
2. `@api-architect` - POST /api/buyer/qualify endpoint
3. `@database-optimizer` - Efficient data queries
4. `@security-auditor` - Input validation, SQL injection prevention
5. `@test-automator` - Test coverage for all scenarios

---

### 2. **Performance Optimization**

#### Example: "Optimize buyer dashboard loading time"
```bash
@performance-optimizer "Analyze and optimize buyer dashboard:
1. Initial page load time (currently 2.3s)
2. Deal card rendering with 50+ listings
3. Image loading strategy
4. API call waterfall
5. Client-side hydration"
```

**Agents Activated**:
1. `@performance-optimizer` - Performance audit
2. `@react-pro` - Component optimization (memoization, lazy loading)
3. `@database-optimizer` - Query optimization
4. `@image-optimizer` - Next.js Image optimization

---

### 3. **Financial Calculations**

#### Example: "Implement amortization schedule calculator"
```bash
@python-pro "Create amortization calculator library:
1. Monthly payment calculations
2. Interest/principal breakdown
3. Early payoff scenarios
4. Balloon payment support
5. Comprehensive test suite"
```

**Additional Context**:
- Existing: `lib/financial/amortization-calculator.ts`
- Requirements: Accuracy to 2 decimal places
- Use cases: Term sheet generation, buyer analysis

---

### 4. **Security Audit**

#### Example: "Audit payment processing flow"
```bash
@security-auditor "Complete security audit of payment flow:
1. Stripe integration (subscription & one-time)
2. Webhook validation
3. PII handling (SSN, bank info)
4. Session management
5. Rate limiting on payment endpoints
6. CSRF protection"
```

**Critical Areas**:
- `/app/api/stripe/**` - Payment endpoints
- `/lib/stripe.ts` - Stripe client
- `/lib/actions/buyer-profile.ts` - Profile with financial data

---

### 5. **Database Schema Changes**

#### Example: "Add saved search alerts feature"
```bash
@postgres-pro "Design database schema for saved search alerts:
1. SavedSearch table structure
2. Alert notification table
3. Relationship with User/Buyer
4. Indexing strategy for query performance
5. Migration scripts"

@database-optimizer "Optimize queries for search alert system:
1. Daily batch job for matches
2. Real-time notification checks
3. Efficient listing comparison
4. Deduplication logic"
```

---

## 🎨 SellerFin-Specific Agent Combinations

### **Buyer Experience Optimization**
```bash
@ux-researcher + @ui-designer + @react-pro
```
**Use for**: Improving buyer dashboard, saved listings, deal discovery

### **Seller Onboarding Flow**
```bash
@product-manager + @full-stack-developer + @form-wizard-expert
```
**Use for**: Multi-step listing creation, document upload, verification

### **Financial Tool Development**
```bash
@python-pro + @typescript-pro + @test-automator
```
**Use for**: Calculators, financial modeling, term sheet generation

### **Search & Discovery**
```bash
@ai-ml-engineer + @database-optimizer + @search-expert
```
**Use for**: AI-powered search, recommendation engine, embeddings optimization

### **Payment & Monetization**
```bash
@security-auditor + @stripe-expert + @api-architect
```
**Use for**: Subscription management, payment processing, invoicing

---

## 📊 SellerFin-Specific Use Cases

### Use Case 1: Deal Score Algorithm Refinement
```bash
@data-scientist "Analyze and improve deal score algorithm:
1. Current scoring: lib/deal-score.ts
2. Factors: financial metrics, location, category, seller history
3. Goal: More accurate buyer-deal matching
4. Data: Historical deal performance, buyer preferences
5. Deliverable: Updated scoring model with A/B test framework"
```

### Use Case 2: Knowledge Base RAG System
```bash
@ai-ml-engineer "Optimize KB RAG system:
1. Document ingestion pipeline (lib/kb/document-ingestion.ts)
2. Embedding generation (lib/kb/embeddings-enhanced.ts)
3. Semantic search (lib/kb/search-enhanced.ts)
4. Chat integration (lib/kb/chat-enhanced.ts)
5. Performance: Sub-200ms response time"
```

### Use Case 3: Managed Sale Workflow
```bash
@product-manager "Design improved managed sale workflow:
1. Current: lib/managed-sale-utils.ts
2. Phases: Initial contact → Due diligence → Term sheet → Closing
3. Document management
4. Communication tracking
5. Milestone notifications"

@full-stack-developer "Implement workflow from product spec:
1. Backend: State machine for sale stages
2. Frontend: Progress tracker component
3. Notifications: Email + in-app alerts
4. Documents: S3 upload with encryption"
```

---

## 🚀 Quick Command Reference

### **Daily Development**
```bash
# Start feature development
@supervisor-orchestrator "Build [feature] for [buyer/seller] with [requirements]"

# Code review before commit
@code-reviewer "Review changes in [files] for best practices and security"

# Fix bugs
@debugger-expert "Debug [issue] in [component/page]"

# Optimize performance
@performance-optimizer "Improve [page/component] load time"
```

### **Weekly Planning**
```bash
# Sprint planning
@ai-scrum-master "Plan sprint based on: [feature list, priorities, team capacity]"

# Tech debt review
@tech-debt-reducer "Analyze codebase for technical debt and create prioritized backlog"

# Security audit
@security-auditor "Weekly security scan of recent changes"
```

### **Monthly Reviews**
```bash
# Performance audit
@performance-benchmarker "Monthly performance report: all pages, API endpoints, database queries"

# Analytics review
@analytics-reporter "Generate monthly analytics report: user engagement, conversion, performance"

# Dependency updates
@dependency-updater "Audit and update npm dependencies with breaking change analysis"
```

---

## 🎯 Agent Personalities for SellerFin Context

### **@supervisor-orchestrator** - Project Coordinator
- **When**: Complex multi-agent tasks
- **Best for**: New features, major refactors, cross-cutting concerns
- **Example**: "Build complete buyer qualification system"

### **@react-pro** - Frontend Specialist
- **When**: React/Next.js components and pages
- **Best for**: Component architecture, hooks, performance
- **Example**: "Optimize deal card rendering performance"

### **@postgres-pro** - Database Expert
- **When**: Database schema, queries, migrations
- **Best for**: Prisma optimization, indexing strategy
- **Example**: "Design schema for saved search alerts"

### **@security-auditor** - Security Specialist
- **When**: Financial data, payment processing, authentication
- **Best for**: PII protection, payment security, vulnerability scanning
- **Example**: "Audit Stripe integration for PCI compliance"

### **@product-manager** - Product Strategy
- **When**: Feature planning, user research, prioritization
- **Best for**: Product roadmap, user stories, A/B testing
- **Example**: "Prioritize Q1 2025 features based on user feedback"

---

## 📁 Key SellerFin Files & Responsible Agents

| File/Directory | Primary Agent | Secondary Agents |
|----------------|---------------|------------------|
| `components/**/*.tsx` | @react-pro | @ui-designer, @accessibility-expert |
| `app/**/*.tsx` | @full-stack-developer | @react-pro, @typescript-pro |
| `lib/actions/**/*.ts` | @api-architect | @security-auditor, @typescript-pro |
| `lib/kb/**/*.ts` | @ai-ml-engineer | @database-optimizer, @performance-optimizer |
| `lib/financial/**/*.ts` | @python-pro | @test-automator, @typescript-pro |
| `prisma/schema.prisma` | @postgres-pro | @database-optimizer |
| `app/api/**/*.ts` | @api-architect | @security-auditor, @rate-limiter-expert |
| `e2e/**/*.spec.ts` | @test-automator | @playwright-expert |
| `__tests__/**/*.test.ts` | @test-automator | @tdd-specialist |

---

## 🎨 Custom SellerFin Workflows

### **Complete Feature Development Lifecycle**

```bash
# Step 1: Planning (Day 1)
@product-manager "Analyze requirements for [feature]"
@architect-reviewer "Design technical approach for [feature]"

# Step 2: Development (Days 2-4)
@supervisor-orchestrator "Implement [feature] with full stack:
- Frontend components
- API endpoints
- Database changes
- Tests"

# Step 3: Review (Day 5)
@code-reviewer "Review [feature] implementation"
@security-auditor "Security review of [feature]"
@performance-optimizer "Performance test [feature]"

# Step 4: Testing (Day 6)
@test-automator "Create comprehensive test suite for [feature]"
@qa-expert "Manual QA checklist for [feature]"

# Step 5: Documentation (Day 7)
@documentation-expert "Document [feature] for developers and users"
@api-documenter "Generate API documentation for [feature]"

# Step 6: Deployment
@devops-automator "Deploy [feature] to staging, create deployment checklist"
```

---

## 🔍 Agent Discovery

### Find the Right Agent
```bash
# Discover relevant agents
./.claude/discover_agents.sh

# Validate setup
./.claude/validate_agents.sh

# View all agents
cat .claude/agents/index.md
```

### Agent Categories Available:
- **orchestration/** - Project coordination (5 agents)
- **development/** - Code development (24 agents)
- **design/** - UX/UI (7 agents)
- **quality/** - Testing & QA (15 agents)
- **security/** - Security & compliance (4 agents)
- **data-ai/** - ML & data science (4 agents)
- **devops/** - Infrastructure (13 agents)
- **documentation/** - Technical writing (6 agents)
- **product/** - Product management (9 agents)
- **marketing/** - Growth & marketing (7 agents)
- **operations/** - Business ops (5 agents)
- **specialized/** - Niche tools (9 agents)
- **business/** - Business analysis agents

---

## 💡 Pro Tips for SellerFin Development

### 1. **Always Use @context-manager**
All agents automatically query context-manager, but you can too:
```bash
@context-manager "What's the current state of buyer dashboard components?"
```

### 2. **Chain Agents for Complex Tasks**
```bash
@react-pro "Create component" → @test-automator "Test it" → @code-reviewer "Review it"
```

### 3. **Use Specialized Financial Agents**
For SellerFin's financial calculations, use domain experts:
```bash
@financial-modeler "Create SBA loan calculator with [specific terms]"
```

### 4. **Security First for Financial Platform**
Always include security review:
```bash
@security-auditor "Review [feature] for PII handling and financial data protection"
```

### 5. **Performance Matters for User Experience**
Regular performance audits:
```bash
@performance-optimizer "Weekly performance audit: dashboard, listings, search"
```

---

## 📈 Success Metrics

### Agent Effectiveness Tracking
- **Development Velocity**: 30% faster with agent assistance
- **Code Quality**: 50% fewer bugs with @code-reviewer
- **Security**: 100% coverage with @security-auditor
- **Performance**: 40% faster load times with @performance-optimizer
- **Test Coverage**: 90%+ with @test-automator

### Monthly Goals
- [ ] All new features reviewed by @code-reviewer
- [ ] All API endpoints audited by @security-auditor
- [ ] All components tested by @test-automator
- [ ] All database changes reviewed by @postgres-pro
- [ ] Weekly performance audit by @performance-optimizer

---

## 🎉 Get Started

### Immediate Actions:
1. ✅ Agents installed (147 agents in `.claude/agents/`)
2. ✅ Configuration customized for SellerFin
3. 📝 Review `SELLERFI_DEAL_CARD_AGENTS.md` for specific recommendations

### First Commands to Try:
```bash
# 1. Fix the deal card Tailwind issue
@tailwind-expert "Fix dynamic className issue in components/deal-card-enhanced.tsx line 85"

# 2. Audit buyer dashboard performance
@performance-optimizer "Analyze app/(main)/buyer/dashboard/page.tsx for performance bottlenecks"

# 3. Security review of payment flow
@security-auditor "Review all Stripe integration code for security best practices"

# 4. Optimize database queries
@postgres-pro "Analyze and optimize Prisma queries in lib/actions/"
```

---

## 🔌 Compound Engineering Plugin Integration

### Status
**🔄 Pending Installation** (Requires Claude Code IDE)

### Installation
```
# In Claude Code IDE:
/plugin marketplace add https://github.com/EveryInc/compound-engineering-plugin
/plugin install compound-engineering
```

### What It Adds
- **27 Specialized Agents**: Review, research, design, workflow
- **20 Slash Commands**: Planning, review, browser testing
- **14 Skills**: Architecture, development, automation
- **1 MCP Server**: Context7 for framework documentation

### Core Workflows

#### 1. Planning with Research
```
/workflows:plan "Add AI deal scoring feature"
```
**Runs**: `repo-research-analyst`, `best-practices-researcher`, `framework-docs-researcher`

#### 2. Multi-Agent Code Review
```
/workflows:review #123
```
**Runs**: `security-sentinel`, `data-integrity-guardian`, `agent-native-reviewer`, `performance-oracle`, and 9+ more

#### 3. Browser Testing
```
/test-browser #123
```
**Checks**: Zero console errors, page load, interactions

#### 4. Knowledge Documentation
```
/workflows:compound "Implemented AI scoring with deterministic math"
```
**Creates**: Searchable documentation in `docs/solutions/`

### SellerFi-Specific Benefits

**Zero-Error Gate Enforcement:**
- `/workflows:review` includes browser testing
- P1 findings for any console errors

**Security & Entitlements:**
- `security-sentinel` audits all changes
- `agent-native-reviewer` checks AI accessibility
- P1 findings for missing server-side checks

**Database Safety:**
- `data-integrity-guardian` reviews migrations
- `data-migration-expert` validates ID mappings
- `deployment-verification-agent` creates Go/No-Go checklists

**Knowledge Compounding:**
- First time solving a problem: 30 min research
- Document with `/workflows:compound`: 5 min
- Next time: 2 min lookup
- **Result**: Each problem solved makes future work easier

### Integration with Taskmaster

**Taskmaster** = Project-level task management  
**Compound** = Implementation-level workflows

**Use Both:**
```bash
# 1. Plan with Compound
/workflows:plan "Add feature X"

# 2. Parse into Taskmaster tasks
task-master parse-prd plans/feat-x.md

# 3. Track work in both systems
task-master set-status --id=1.1 --status=done

# 4. Review with Compound
/workflows:review #123

# 5. Document with Compound
/workflows:compound "what I learned"
```

### See Also
- **[Compound Workflows Guide](.claude/COMPOUND_WORKFLOWS.md)** - Detailed workflows
- **[Compound Quick Start](.claude/COMPOUND_QUICK_START.md)** - Quick reference
- **[Compound Testing Guide](.claude/COMPOUND_PLUGIN_TESTING.md)** - Testing instructions
- **[Full Integration Guide](../docs/COMPOUND_ENGINEERING_INTEGRATION.md)** - Complete documentation

---

*SellerFin Custom Agent Configuration*
*Platform: Seller Financing Platform*
*Last Updated: January 21, 2026*
*Core Agents: 151 | Compound Agents: 27 | Total: 178+*
*Skills: 65+ | Commands: 49+*
