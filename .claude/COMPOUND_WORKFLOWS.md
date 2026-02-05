# Compound Engineering Workflows for SellerFi

## 🔄 Enhanced Development Workflow

**Philosophy**: Each unit of engineering work should make subsequent units easier—not harder.

---

## 🎯 Core Workflow: Plan → Work → Review → Compound

### 1. PLAN Phase

**Use `/workflows:plan` for detailed implementation planning**

#### Example: AI Deal Scoring Feature
```
/workflows:plan "Add AI deal scoring with explainability

Requirements:
- Deterministic math for core scoring
- AI explanations for score components
- Missing data indicators
- Confidence scores
- Server-side enforcement"
```

**What Happens:**
1. Asks clarifying questions about the feature
2. Runs parallel research agents:
   - `repo-research-analyst` - Analyzes existing patterns in SellerFi
   - `best-practices-researcher` - Finds industry best practices
   - `framework-docs-researcher` - Searches Next.js/Prisma docs
3. Runs `spec-flow-analyzer` to identify edge cases
4. Creates detailed plan in `plans/feat-ai-deal-scoring.md`

**Integration with Taskmaster:**
```bash
# After plan is created, parse into Taskmaster tasks
task-master parse-prd plans/feat-ai-deal-scoring.md --tag=ai-scoring
```

---

### 2. WORK Phase

**Use `/workflows:work` for isolated implementation**

```
/workflows:work plans/feat-ai-deal-scoring.md
```

**What Happens:**
1. Creates git worktree for isolated work
2. Checks out feature branch
3. Implements plan systematically
4. Tracks progress in file-based todos

**Track Progress with Taskmaster:**
```bash
task-master show 1
task-master set-status --id=1.1 --status=in-progress
task-master update-subtask --id=1.1 --prompt="Implemented deterministic scoring algorithm"
task-master set-status --id=1.1 --status=done
```

---

### 3. REVIEW Phase

**Use `/workflows:review` for comprehensive multi-agent review**

```
gh pr create --title "feat: Add AI deal scoring" --body-file plans/feat-ai-deal-scoring.md
/workflows:review #123
```

**What Happens:**
1. Fetches PR metadata
2. Runs 13+ parallel review agents:
   - `security-sentinel` - Security audit (critical for SellerFi)
   - `data-integrity-guardian` - Database safety
   - `agent-native-reviewer` - AI accessibility
   - `kieran-rails-reviewer` - Rails conventions (if applicable)
   - `performance-oracle` - Performance analysis
   - `architecture-strategist` - Architecture review
   - `code-simplicity-reviewer` - Minimalism check
   - Plus conditional agents for migrations
3. Synthesizes findings into P1/P2/P3 priorities
4. Creates todo files in `todos/`
5. Offers browser testing

**SellerFi-Specific Checks:**
- ✅ Zero console errors (P1 if violations)
- ✅ Server-side entitlement enforcement
- ✅ Deterministic scoring logic
- ✅ AI explainability present
- ✅ No risky DB operations

**Address Findings:**
```bash
# Triage todos
/triage

# Resolve in parallel
/resolve_todo_parallel

# Browser test
/test-browser #123
```

---

### 4. COMPOUND Phase

**Use `/workflows:compound` to document learnings**

```
/workflows:compound "Implemented AI deal scoring with deterministic math + AI explanations

Key Learnings:
- Used deterministic formula for core score (0-100)
- AI only explains the score, doesn't calculate it
- Missing data lowers confidence, doesn't hallucinate
- Server-side validation prevents client manipulation"
```

**What Happens:**
1. Launches parallel subagents
2. Extracts problem and solution
3. Determines category (e.g., `logic-errors/`)
4. Creates markdown file in `docs/solutions/`
5. Auto-invokes specialized agents for enhancement

**Output:**
```
docs/solutions/logic-errors/ai-scoring-determinism.md
```

**Complete with Taskmaster:**
```bash
task-master set-status --id=1 --status=done
gh pr merge #123
```

---

## 🛡️ SellerFi-Specific Workflows

### Workflow 1: Payment/Entitlement Changes

**Always run these review agents:**
- `security-sentinel` - Security audit
- `data-integrity-guardian` - Database safety
- `agent-native-reviewer` - AI accessibility

**Example:**
```
/workflows:review #123

# Expected P1 findings if violations:
# - Missing server-side entitlement check
# - Client-only validation
# - Unauthenticated API access
```

**Always test:**
```
/test-browser #123  # Zero console errors required
```

---

### Workflow 2: Database Migrations

**Always run these review agents:**
- `data-migration-expert` - ID mapping validation
- `deployment-verification-agent` - Go/No-Go checklist
- `data-integrity-guardian` - Migration safety

**Example:**
```
/workflows:review #124

# Expected outputs:
# - Pre-deployment SQL verification queries
# - Rollback procedures
# - Data validation scripts
# - Go/No-Go checklist
```

---

### Workflow 3: AI Features

**Always run these review agents:**
- `agent-native-reviewer` - AI accessibility
- `security-sentinel` - No AI in critical paths
- `architecture-strategist` - Determinism enforcement

**Example:**
```
/workflows:review #125

# Expected P1 findings if violations:
# - AI making financial calculations
# - AI deciding entitlements
# - AI controlling state transitions
# - Missing explainability
```

---

## 📊 Priority System

### P1 (🔴 CRITICAL) - Blocks Merge

**SellerFi-Specific P1 Violations:**
- Console errors (any)
- Missing server-side entitlement checks
- Non-deterministic financial calculations
- AI making critical decisions
- Data loss risks in migrations
- Security vulnerabilities
- Breaking changes without migration path

### P2 (🟡 IMPORTANT) - Should Fix

- N+1 queries
- Missing error handling
- Performance issues
- Architectural concerns
- Code quality problems

### P3 (🔵 NICE-TO-HAVE) - Enhancements

- Code cleanup
- Optimization opportunities
- Documentation updates

---

## 🎯 Common SellerFi Use Cases

### Use Case 1: New Feature from Scratch

```bash
# 1. PLAN
/workflows:plan "Add buyer qualification calculator"
task-master parse-prd plans/feat-buyer-qualification.md

# 2. WORK
/workflows:work plans/feat-buyer-qualification.md
task-master set-status --id=1.1 --status=done

# 3. REVIEW
gh pr create
/workflows:review #126
/test-browser #126

# 4. COMPOUND
/workflows:compound "Built qualification calculator with real-time validation"
task-master set-status --id=1 --status=done
```

---

### Use Case 2: Performance Optimization

```bash
# 1. PLAN
/workflows:plan "Optimize deal listing page load time from 2.3s to <1s"

# 2. WORK
/workflows:work plans/refactor-deal-listing-performance.md

# 3. REVIEW
/workflows:review #127
Task performance-oracle("Analyze deal listing performance")

# 4. COMPOUND
/workflows:compound "Optimized deal listing with query batching and memoization"
```

---

### Use Case 3: Security Audit

```bash
# 1. PLAN
/workflows:plan "Audit and fix entitlement enforcement across API routes"

# 2. WORK
/workflows:work plans/fix-entitlement-enforcement.md

# 3. REVIEW
/workflows:review #128
Task security-sentinel("Audit all API routes for entitlement checks")
Task agent-native-reviewer("Verify AI agents can't bypass entitlements")

# 4. COMPOUND
/workflows:compound "Fixed 12 missing entitlement checks across API routes"
```

---

### Use Case 4: Database Migration

```bash
# 1. PLAN
/workflows:plan "Migrate deal status from enum to state machine"

# 2. WORK
/workflows:work plans/refactor-deal-status-migration.md

# 3. REVIEW
/workflows:review #129
Task data-migration-expert("Validate ID mappings and data integrity")
Task deployment-verification-agent("Create Go/No-Go checklist")

# Expected outputs:
# - Pre-deploy SQL queries
# - Rollback procedures
# - Data validation scripts

# 4. COMPOUND
/workflows:compound "Migrated deal status with zero downtime and rollback safety"
```

---

## 🚀 Advanced Workflows

### Parallel Feature Development

**Use git worktrees for multiple features simultaneously:**

```bash
# Feature 1: AI Scoring
/workflows:work plans/feat-ai-scoring.md

# Feature 2: Buyer Dashboard (in parallel)
/workflows:work plans/feat-buyer-dashboard.md

# Both work in isolated worktrees
# No conflicts, no branch switching
```

---

### Deepen Planning with Research

**For complex features, use `/deepen-plan`:**

```bash
# Create initial plan
/workflows:plan "Add deal negotiation workflow"

# Enhance with deep research
/deepen-plan plans/feat-deal-negotiation.md

# Each section gets parallel research:
# - Best practices
# - Performance considerations
# - UI/UX patterns
# - Security implications
```

---

### Multi-Agent Plan Review

**Get feedback before implementation:**

```bash
# Create plan
/workflows:plan "Refactor authentication system"

# Get multi-agent feedback
/plan_review plans/refactor-authentication.md

# Agents provide feedback:
# - dhh-rails-reviewer: Rails perspective
# - security-sentinel: Security concerns
# - architecture-strategist: Architecture review
# - code-simplicity-reviewer: Simplification suggestions
```

---

## 📚 Knowledge Compounding

### First Time vs Next Time

**Example: N+1 Query in Deal Listing**

**First Time (30 min):**
1. Identify N+1 query
2. Research solutions
3. Implement eager loading
4. Test performance

**Document (5 min):**
```
/workflows:compound "Fixed N+1 query in deal listing with eager loading"
```

**Next Time (2 min):**
```
# Search existing solutions
cat docs/solutions/performance-issues/n-plus-one-deal-listing.md

# Apply same pattern
# Done in minutes instead of hours
```

---

## 🎨 Integration with Existing Tools

### Taskmaster + Compound

**Taskmaster** = Project-level task management
- Break down PRDs into tasks
- Track overall progress
- Manage dependencies

**Compound** = Implementation-level workflows
- Detailed planning with research
- Multi-agent code review
- Knowledge documentation

**Use Both:**
```bash
# Taskmaster: Project tasks
task-master list
task-master next

# Compound: Implementation workflows
/workflows:plan
/workflows:review
/workflows:compound
```

---

## 🔧 Utility Commands

### `/deepen-plan` - Enhanced Research
```
/deepen-plan plans/feat-ai-scoring.md
```

### `/test-browser` - Browser Testing
```
/test-browser #123
```

### `/triage` - Interactive Todo Triage
```
/triage
```

### `/resolve_parallel` - Parallel Resolution
```
/resolve_todo_parallel
/resolve_pr_parallel
```

---

## 📖 Documentation

- **Full Guide**: [docs/COMPOUND_ENGINEERING_INTEGRATION.md](../docs/COMPOUND_ENGINEERING_INTEGRATION.md)
- **Quick Start**: [.claude/COMPOUND_QUICK_START.md](COMPOUND_QUICK_START.md)
- **Testing Guide**: [.claude/COMPOUND_PLUGIN_TESTING.md](COMPOUND_PLUGIN_TESTING.md)
- **Agent Index**: [.claude/agents/index.md](agents/index.md)

---

## 🎯 Quick Reference

### Before Starting Work
```
/workflows:plan "feature description"
```

### Before Merging PR
```
/workflows:review #PR_NUMBER
/test-browser #PR_NUMBER
```

### After Solving Problem
```
/workflows:compound "what I learned"
```

---

*Philosophy: Each unit of engineering work should make subsequent units easier—not harder.*
