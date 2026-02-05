# Compound Engineering Quick Start

## 🚀 Installation

### In Claude Code IDE:
```bash
/plugin marketplace add https://github.com/EveryInc/compound-engineering-plugin
/plugin install compound-engineering
```

---

## ⚡ Quick Commands

### Planning
```bash
/workflows:plan "Add feature X"          # Create detailed plan with research
/deepen-plan plans/feat-x.md             # Enhance with more research
/plan_review plans/feat-x.md             # Multi-agent plan review
```

### Implementation
```bash
/workflows:work plans/feat-x.md          # Start work with git worktree
```

### Review
```bash
/workflows:review #123                   # Multi-agent PR review
/test-browser #123                       # Browser test affected pages
/triage                                  # Prioritize review findings
/resolve_todo_parallel                   # Fix todos in parallel
```

### Knowledge
```bash
/workflows:compound "Fixed issue X"      # Document solution
```

---

## 🎯 Workflow

```
1. PLAN    → /workflows:plan "feature"
2. WORK    → /workflows:work plans/feat-*.md
3. REVIEW  → /workflows:review #PR
4. COMPOUND → /workflows:compound "what I learned"
5. REPEAT  → Next feature is easier
```

---

## 📁 Directory Structure

```
plans/              # Detailed implementation plans
todos/              # Review findings (P1/P2/P3)
docs/solutions/     # Compounded knowledge base
```

---

## 🔥 Most Used Commands

### Before Starting Work
```bash
/workflows:plan "Add AI deal scoring"
```

### Before Merging PR
```bash
/workflows:review #123
/test-browser #123
```

### After Solving Problem
```bash
/workflows:compound "Fixed N+1 query in deal listing"
```

---

## 🎨 Integration with Taskmaster

| Phase | Taskmaster | Compound |
|-------|-----------|----------|
| **Plan** | `parse-prd` | `/workflows:plan` |
| **Work** | `expand` | `/workflows:work` |
| **Review** | Manual | `/workflows:review` |
| **Document** | N/A | `/workflows:compound` |

**Use Both:**
- Taskmaster for project-level task tracking
- Compound for implementation-level workflows

---

## 🛡️ SellerFi Critical Flows

### Always Review With:
- `security-sentinel` - Security audit
- `data-integrity-guardian` - Database safety
- `agent-native-reviewer` - AI accessibility

### Always Test:
```bash
/test-browser #PR  # Zero console errors
```

### Always Document:
```bash
/workflows:compound "what I learned"
```

---

## 📊 Review Findings

### Priority Levels
- **P1 (🔴 CRITICAL)**: Blocks merge - security, data loss, breaking changes
- **P2 (🟡 IMPORTANT)**: Should fix - performance, architecture, quality
- **P3 (🔵 NICE-TO-HAVE)**: Enhancements, cleanup, optimization

### Todo Files
```
todos/001-pending-p1-security-vulnerability.md
todos/002-pending-p2-n-plus-one-query.md
todos/003-pending-p3-code-cleanup.md
```

---

## 💡 Pro Tips

1. **Always run `/workflows:review` before merging**
2. **Address all P1 findings** (blocks merge)
3. **Use `/test-browser`** to enforce zero console errors
4. **Document with `/workflows:compound`** after solving problems
5. **Use git worktrees** for parallel development
6. **Triage findings** with `/triage` before resolving

---

## 🔗 Full Documentation

See [docs/COMPOUND_ENGINEERING_INTEGRATION.md](../docs/COMPOUND_ENGINEERING_INTEGRATION.md) for complete guide.

---

*Philosophy: Each unit of engineering work should make subsequent units easier—not harder.*
