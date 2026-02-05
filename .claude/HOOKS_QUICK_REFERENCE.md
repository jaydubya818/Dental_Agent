# 🔧 Claude Code Hooks - Quick Reference

## 🎯 What Runs When

### When You Submit a Prompt:
✅ **Skill Activation Check** (`skill-activation-prompt.sh`)
- Matches keywords to skills
- Suggests relevant skills before execution

### When You Edit/Write a File:
1. ✅ **File Tracker** (`post-tool-use-tracker.sh`)
   - Logs edited files
   - Tracks affected repos
   - Stores build commands

2. 🔍 **LSP Type Check** (`post-edit-lsp-check.sh`)
   - Runs TypeScript compiler
   - Shows type errors immediately

3. 💰 **Financial Validator** (`financial-calculation-validator.sh`)
   - Checks for float arithmetic on money
   - Validates rounding precision
   - Ensures audit logging

4. 🔒 **Security Validator** (`security-validator.sh`)
   - Scans for hardcoded secrets
   - Detects SQL/command injection
   - Blocks critical security issues

5. 🗄️  **Database Safety** (`database-safety-validator.sh`)
   - Prevents prod DB URLs in code
   - Validates migrations
   - Checks for unsafe bulk operations

6. 🔄 **Validation Loop** (`ralph-wiggum-validation-loop.sh`)
   - Re-runs validators
   - Auto-generates fix prompts
   - Up to 2 iterations

7. 🔄 **Test-Fix Loop** (`ralph-wiggum-test-fix-loop.sh`)
   - Finds and runs tests
   - Generates fix prompts on failure
   - Up to 3 iterations

### When You Read a File:
1. 📊 **Context Optimizer** (`context-optimizer.sh`)
   - Tracks repeated reads
   - Warns about redundancy

2. 📝 **Context Summarizer** (`context-summarizer.ts`)
   - Generates file summaries after 3 reads
   - Auto-summarizes 500+ line files
   - Reduces token usage

---

## 🚦 Hook Flow Diagram

```
User Submits Prompt
    ↓
[Skill Activation Check]
    ↓
Claude Responds with Tool Calls
    ↓
┌─────────────────┬──────────────────┐
│   Edit/Write    │      Read        │
└─────────────────┴──────────────────┘
         ↓                  ↓
    File Tracker      Context Optimizer
         ↓                  ↓
    LSP Check         Context Summarizer
         ↓
    Financial Validator
         ↓
    Security Validator (BLOCKS IF CRITICAL)
         ↓
    Database Validator (BLOCKS IF CRITICAL)
         ↓
    Validation Loop
         ↓
    Test-Fix Loop
         ↓
    Done ✅
```

---

## 🎯 Common Scenarios

### Scenario 1: Edit Financial Code
```bash
You: [Edit lib/pricing/calculator.ts]

Hooks Run:
✅ File Tracker
✅ LSP Check - Type errors? ✓
💰 Financial Validator - Float arithmetic? ✓
🔒 Security Validator - Secrets? ✓
🗄️  Database Validator - Skipped (not DB file)
🔄 Validation Loop - Issues? Run again
🔄 Test-Fix Loop - Tests pass? ✓

Result: Safe to proceed
```

### Scenario 2: Security Issue Detected
```bash
You: [Edit lib/api/stripe.ts]
     const STRIPE_KEY = "sk_live_abc123"

Hooks Run:
🔒 Security Validator
🚨 CRITICAL: Hardcoded secret detected!

Result: BLOCKED - Must fix before commit
```

### Scenario 3: Test Failure Auto-Fix
```bash
You: [Edit lib/calculator.ts]

🔄 Test-Fix Loop - Iteration 1/3
❌ Tests failed
Expected: 100, Received: 99.99

💡 Fix prompt generated

You: [Apply suggested fix]

🔄 Test-Fix Loop - Iteration 2/3
✅ Tests passed!

Result: Self-healed ✨
```

### Scenario 4: Context Optimization
```bash
You: [Read lib/services/deal-state-machine.ts] (1st time)
     → File read (1247 lines)

You: [Read lib/services/deal-state-machine.ts] (2nd time)
     → File read again

You: [Read lib/services/deal-state-machine.ts] (3rd time)
     → File read + summary generated

📝 Summary available (saves ~2500 tokens)
💡 Use summary instead of re-reading

Result: 30-50% token reduction
```

---

## ⚙️ Configuration Files

### Main Config
`.claude/settings.local.json` - Hook registration

### MCP Servers
`.mcp.json` - LSP servers

### Hook Scripts
```
.claude/hooks/
├── skill-activation-prompt.sh
├── post-tool-use-tracker.sh
├── post-edit-lsp-check.sh
├── context-optimizer.sh
├── context-summarizer.ts
├── ralph-wiggum-test-fix-loop.sh
├── ralph-wiggum-validation-loop.sh
└── validators/
    ├── financial-calculation-validator.sh
    ├── security-validator.sh
    └── database-safety-validator.sh
```

---

## 🛑 When Hooks Block

### Security Validator Blocks When:
- 🚨 Hardcoded secrets/API keys
- 🚨 AWS credentials in code
- 🚨 Private keys
- 🚨 SQL injection vulnerabilities
- 🚨 DATABASE_URL not from env
- 🚨 Unsafe eval() usage

### Database Validator Blocks When:
- 🚨 Production DB URL in code
- 🚨 Raw SQL with string interpolation
- 🚨 DROP statements in migrations
- 🚨 DATABASE_URL hardcoded

**When blocked**: Fix the issue, then the edit will succeed automatically.

---

## 💡 Tips & Tricks

### Disable Individual Hooks Temporarily
Edit `.claude/settings.local.json` and comment out:
```json
// {
//   "type": "command",
//   "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/post-edit-lsp-check.sh"
// }
```

### View Hook Logs
```bash
# Session files
ls .claude/ralph-wiggum/<session-id>/
ls .claude/context-cache/<session-id>/

# Check what's been edited
cat .claude/tsc-cache/<session-id>/edited-files.log

# View file summaries
cat .claude/context-cache/<session-id>/file-summaries.json
```

### Adjust Thresholds
```bash
# Max auto-fix iterations
# Edit: ralph-wiggum-test-fix-loop.sh
MAX_ITERATIONS=3  # Change to 5

# Context summarization threshold
# Edit: context-summarizer.ts
SUMMARIZE_THRESHOLD = 3  # Change to 5
LARGE_FILE_LINES = 500   # Change to 1000
```

---

## 🎓 Understanding Hook Output

### ✅ Green = Passed
All checks passed, no action needed.

### ⚠️  Yellow = Warning
Issues detected but not blocking. Review and fix when convenient.

### 🚨 Red = Critical
Blocking issue. Must fix before proceeding.

### 💡 Blue = Info
Suggestions for improvement.

### 🔄 Loop = Auto-Retry
Self-healing workflow active. Fix will be auto-validated.

---

## 📊 Performance Metrics

Track your improvements:

```bash
# Token usage per session
cat .claude/context-cache/<session-id>/file-summaries.json | \
  jq '[.[] | .tokens] | add'

# Files edited per session
wc -l .claude/tsc-cache/<session-id>/edited-files.log

# Validation iterations
ls .claude/ralph-wiggum/<session-id>/*.txt | wc -l
```

---

## 🚀 Advanced Usage

### Chain Multiple Edits
Hooks run after each edit, providing immediate feedback.

### Parallel Work
Hooks are stateless - work on multiple files simultaneously.

### Session Isolation
Each session has separate tracking (use session_id in cache paths).

---

## 🔗 Related Docs

- [Full Setup Guide](MAGICAL_10X_SETUP.md)
- [Architecture Diagram](ARCHITECTURE_DIAGRAM.md)
- [Quick Start](QUICK_START.md)

---

**Remember**: Hooks are your AI pair programmer's safety net! 🛡️

They catch mistakes before they happen and help you maintain world-class code quality automatically.
