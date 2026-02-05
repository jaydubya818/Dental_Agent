# SellerFin Quick Start Guide

## 🚀 Agent System Ready!

✅ **147 specialized agents** installed and configured for SellerFin
✅ **Custom workflows** tailored to seller financing platform
✅ **Immediate recommendations** for your current work

---

## ⚡ Quick Reference

### Most Used Agents

| Agent | Use When | Example |
|-------|----------|---------|
| `@supervisor-orchestrator` | Complex multi-step tasks | Building new features |
| `@react-pro` | React/Next.js work | Component optimization |
| `@typescript-pro` | Type issues | Adding strict types |
| `@code-reviewer` | Before committing | Code quality check |
| `@security-auditor` | Financial/payment code | Security review |
| `@performance-optimizer` | Slow pages/components | Performance audit |
| `@postgres-pro` | Database work | Query optimization |
| `@ui-designer` | UI/UX improvements | Design feedback |
| `@test-automator` | Testing | Test suite creation |
| `@api-architect` | API design | Endpoint structure |

---

## 🎯 Start Here - Fix Your Deal Card

### Issue 1: Tailwind Dynamic Classes (5 min fix)
**File**: `components/deal-card-enhanced.tsx` line 85

```bash
@tailwind-expert "Fix dynamic className issue on line 85 of deal-card-enhanced.tsx where w-${size/4} won't compile"
```

### Issue 2: Performance Optimization (30 min)
```bash
@performance-optimizer "Optimize deal-card-enhanced.tsx for rendering 100+ cards on buyer dashboard"
```

### Issue 3: Accessibility Audit (20 min)
```bash
@accessibility-expert "Add ARIA labels and keyboard navigation to deal-card-enhanced.tsx"
```

---

## 💻 Common Commands

### Daily Development
```bash
# Start new feature
@supervisor-orchestrator "Build [feature description]"

# Review before commit
@code-reviewer "Review recent changes in [files]"

# Fix bug
@debugger-expert "Debug [description of issue]"

# Optimize component
@react-pro "Optimize [component-name] for performance"
```

### Code Quality
```bash
# Type safety
@typescript-pro "Add strict types to [file]"

# Security check
@security-auditor "Audit [file/feature] for security issues"

# Performance
@performance-optimizer "Analyze [page/component] performance"

# Tests
@test-automator "Create tests for [component/feature]"
```

### Database Work
```bash
# Schema design
@postgres-pro "Design schema for [feature]"

# Query optimization
@database-optimizer "Optimize queries in [file]"

# Migration
@database-migrator "Create migration for [schema change]"
```

---

## 📁 Documentation

### Full Guides
- **[SELLERFI_AGENT_CONFIG.md](./SELLERFI_AGENT_CONFIG.md)** - Complete platform configuration
- **[SELLERFI_DEAL_CARD_AGENTS.md](./SELLERFI_DEAL_CARD_AGENTS.md)** - Deal card specific recommendations
- **[agents/index.md](./agents/index.md)** - All 147 agents organized by category
- **[examples.md](./examples.md)** - Usage examples
- **[AI_TOOLING.md](../docs/AI_TOOLING.md)** - Context engineering & memory tools

### Agent Categories
```bash
ls .claude/agents/
```
- orchestration/ - Project coordination
- development/ - Programming specialists
- design/ - UX/UI experts
- quality/ - Testing & QA
- security/ - Security auditing
- data-ai/ - ML & AI
- devops/ - Infrastructure
- documentation/ - Technical writing
- product/ - Product management
- marketing/ - Growth & marketing
- operations/ - Business ops
- specialized/ - Specialized tools

---

## 🎨 Your Current Work

### File: `components/deal-card-enhanced.tsx`

**Recommended Actions**:

1. **Immediate Fix** (5 min):
   ```bash
   @tailwind-expert "Fix line 85 dynamic Tailwind classes"
   ```

2. **Performance Boost** (30 min):
   ```bash
   @react-pro "Memoize DealScoreRing and FinancingBar components"
   @performance-optimizer "Optimize for 100+ card rendering"
   ```

3. **Type Safety** (20 min):
   ```bash
   @typescript-pro "Extract DealCardEnhancedProps to separate types file with stricter types"
   ```

4. **Accessibility** (30 min):
   ```bash
   @accessibility-expert "Add ARIA labels, keyboard nav, and screen reader support"
   ```

5. **Full Review** (2 hours):
   ```bash
   @supervisor-orchestrator "Complete optimization of deal-card-enhanced.tsx:
   - Fix Tailwind issues
   - Optimize performance
   - Add accessibility
   - Improve types
   - Add tests"
   ```

---

## 🔥 Power User Tips

### 1. Chain Multiple Agents
```bash
@supervisor-orchestrator "Build feature with:
- @react-pro: Frontend
- @api-architect: Backend API
- @security-auditor: Security review
- @test-automator: Tests"
```

### 2. Context Queries
```bash
@context-manager "What files relate to buyer dashboard?"
```

### 3. Quick Discovery
```bash
# Find agents by keyword
grep -r "React" .claude/agents/*/
grep -r "database" .claude/agents/*/
grep -r "security" .claude/agents/*/
```

### 4. Validate Setup
```bash
./.claude/validate_agents.sh
```

---

## 📊 Quick Wins

### Performance
- [ ] `@performance-optimizer` on buyer dashboard
- [ ] `@image-optimizer` for deal card images
- [ ] `@database-optimizer` for listing queries

### Security
- [ ] `@security-auditor` for payment flow
- [ ] `@security-auditor` for PII handling
- [ ] `@rate-limiter-expert` for API endpoints

### Code Quality
- [ ] `@code-reviewer` for recent changes
- [ ] `@typescript-pro` for strict mode
- [ ] `@test-automator` for test coverage

### UX
- [ ] `@ui-designer` for buyer dashboard
- [ ] `@ux-researcher` for user flows
- [ ] `@accessibility-expert` for WCAG compliance

---

## 🎯 Weekly Checklist

### Monday - Planning
- [ ] `@ai-scrum-master` - Sprint planning
- [ ] `@product-manager` - Feature prioritization

### Daily - Development
- [ ] `@supervisor-orchestrator` - Start features
- [ ] `@code-reviewer` - Review before commits

### Wednesday - Quality
- [ ] `@security-auditor` - Security scan
- [ ] `@test-automator` - Test coverage check

### Friday - Performance
- [ ] `@performance-optimizer` - Weekly audit
- [ ] `@database-optimizer` - Query analysis

---

## 🧠 AI Tooling (Context Engineering)

### Bootstrap AI Tools
```bash
# Initialize context engineering tools
npm run ai:bootstrap

# Show AI tooling help
npm run ai:help
```

### Context Engineering Skills
Located at `vendor/agent-skills-for-context-engineering/skills/`:
- `context-fundamentals` - What context is and why it matters
- `context-degradation` - Patterns of context failure
- `context-compression` - Compression strategies
- `multi-agent-patterns` - Multi-agent architectures
- `memory-systems` - Memory design patterns
- `tool-design` - Tool design principles

### When to Use
| Task | Load These Skills |
|------|-------------------|
| Building new agent systems | `context-fundamentals`, `multi-agent-patterns` |
| Debugging context issues | `context-degradation`, `evaluation` |
| Optimizing performance | `context-optimization`, `context-compression` |
| Designing tools | `tool-design` |

See **[docs/AI_TOOLING.md](../docs/AI_TOOLING.md)** for complete documentation.

---

## 💡 Pro Tips

1. **Always use @code-reviewer before commits**
2. **Include @security-auditor for financial features**
3. **Use @supervisor-orchestrator for complex tasks**
4. **Regular performance audits with @performance-optimizer**
5. **Test everything with @test-automator**
6. **Load context engineering skills for complex agent work**

---

## 🆘 Need Help?

### Find Agents
```bash
# View all agents
cat .claude/agents/index.md

# Discover agents for specific task
./.claude/discover_agents.sh

# Validate installation
./.claude/validate_agents.sh
```

### Documentation
- Read [SELLERFI_AGENT_CONFIG.md](./SELLERFI_AGENT_CONFIG.md) for full configuration
- Check [examples.md](./examples.md) for usage patterns
- Review [categories.json](./categories.json) for agent organization

---

## 🎉 You're Ready!

Your SellerFin project now has **147 specialized AI agents** ready to help with:
- ✅ Development (React, TypeScript, Next.js, APIs)
- ✅ Quality (Testing, Code Review, Performance)
- ✅ Security (Financial data, PII, Payment processing)
- ✅ Design (UX/UI, Accessibility)
- ✅ Database (PostgreSQL, Prisma, Optimization)
- ✅ Product (Planning, Analytics, User Research)

**Start with your deal card** - it has specific issues ready to fix! 🚀

---

*Last Updated: December 20, 2024*
*Status: Ready to use*
*Agents: 147 installed*
