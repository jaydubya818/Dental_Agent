# Claude Code Infrastructure Setup - SellerFi Platform

## Status: Phase 1 Complete ✅

This document tracks the implementation of the Claude Code infrastructure based on the [diet103/claude-code-infrastructure-showcase](https://github.com/diet103/claude-code-infrastructure-showcase) repository.

---

## Table of Contents

1. [Overview](#overview)
2. [What's Installed](#whats-installed)
3. [What's Configured](#whats-configured)
4. [Next Steps - Phased Implementation](#next-steps---phased-implementation)
5. [Usage Examples](#usage-examples)
6. [Architecture](#architecture)

---

## Overview

The Claude Code infrastructure provides:
- **Auto-skill activation** via UserPromptSubmit hooks
- **File tracking** via PostToolUse hooks
- **Modular skills** following the 500-line rule with progressive disclosure
- **Specialized agents** for complex multi-step tasks
- **Skill activation rules** tailored to your Next.js/Prisma stack

---

## What's Installed

### ✅ Phase 1: Core Hooks Infrastructure

| Component | Location | Status |
|-----------|----------|--------|
| **Hooks Directory** | `.claude/hooks/` | ✅ Installed |
| **UserPromptSubmit Hook** | `skill-activation-prompt.{sh,ts}` | ✅ Installed |
| **PostToolUse Hook** | `post-tool-use-tracker.sh` | ✅ Installed |
| **Hook Dependencies** | `package.json` + `node_modules/` | ✅ Installed |
| **Skill Rules Config** | `skills/skill-rules.json` | ✅ Created |
| **Hook Documentation** | `hooks/README.md` | ✅ Created |

---

## What's Configured

### Hook Configuration (settings.local.json)

```json
{
  "hooks": {
    "UserPromptSubmit": [{
      "hooks": [{
        "type": "command",
        "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/skill-activation-prompt.sh"
      }]
    }],
    "PostToolUse": [{
      "matcher": "Edit|MultiEdit|Write",
      "hooks": [{
        "type": "command",
        "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/post-tool-use-tracker.sh"
      }]
    }]
  }
}
```

### Skill Activation Rules (skill-rules.json)

Configured triggers for:
- **backend-dev-guidelines** - Next.js API routes, Prisma, NextAuth, middleware
- **frontend-dev-guidelines** - React 19, shadcn/ui, Tailwind, components
- **route-tester** - API testing and route verification
- **error-tracking** - Sentry integration, error boundaries
- **skill-developer** - Meta-skill for creating new skills
- **repo-archaeologist** - Codebase exploration and structure mapping
- **test-engineer** - Vitest/Playwright testing
- **security-reviewer** - Auth, permissions, input validation, injection prevention
- **performance-profiler** - Performance optimization, caching, N+1 detection
- **release-engineer** - Migrations, deployments, versioning

Each skill has:
- **Prompt triggers**: Keywords + intent patterns
- **File triggers**: Path patterns + content patterns
- **Priority levels**: Critical / High / Medium / Low
- **Enforcement**: Suggest (non-blocking) or Block (guardrails)

---

## Next Steps - Phased Implementation

### Phase 2: Core Skills Creation 🔄

**Status**: Ready to implement

**Skills to add** (in priority order):

1. **backend-dev-guidelines** (HIGH PRIORITY)
   - Main file: `SKILL.md` (~400 lines)
   - Resources:
     - `resources/nextjs-api-routes.md` - App Router API patterns
     - `resources/prisma-patterns.md` - Schema design, queries, migrations
     - `resources/nextauth-integration.md` - v5 patterns, session handling
     - `resources/error-handling.md` - Try/catch, error responses, logging
     - `resources/middleware.md` - Auth middleware, request validation
     - `resources/api-security.md` - Input validation, CSRF, rate limiting

2. **frontend-dev-guidelines** (HIGH PRIORITY)
   - Main file: `SKILL.md` (~400 lines)
   - Resources:
     - `resources/react-19-patterns.md` - Hooks, Server Components, suspense
     - `resources/shadcn-ui-usage.md` - Component patterns, theming
     - `resources/form-handling.md` - react-hook-form + Zod
     - `resources/client-vs-server.md` - When to use 'use client'
     - `resources/tailwind-patterns.md` - Styling conventions
     - `resources/accessibility.md` - ARIA, keyboard nav, screen readers

3. **test-engineer** (HIGH PRIORITY)
   - Main file: `SKILL.md` (~400 lines)
   - Resources:
     - `resources/vitest-setup.md` - Unit/integration test setup
     - `resources/playwright-setup.md` - E2E test patterns
     - `resources/test-strategy.md` - What to test, when, and how
     - `resources/mocking.md` - Prisma mocks, API mocks, module mocks
     - `resources/test-data.md` - Fixtures, factories, seeders

4. **security-reviewer** (CRITICAL PRIORITY)
   - Main file: `SKILL.md` (~400 lines)
   - Resources:
     - `resources/auth-patterns.md` - Session, JWT, permissions
     - `resources/input-validation.md` - Zod schemas, sanitization
     - `resources/injection-prevention.md` - SQL, XSS, command injection
     - `resources/csrf-protection.md` - Token patterns
     - `resources/rate-limiting.md` - Upstash Redis patterns

5. **route-tester** (MEDIUM PRIORITY)
6. **error-tracking** (MEDIUM PRIORITY)
7. **performance-profiler** (MEDIUM PRIORITY)
8. **repo-archaeologist** (MEDIUM PRIORITY)
9. **release-engineer** (HIGH PRIORITY)
10. **skill-developer** (MEDIUM PRIORITY)

**How to create skills**:
```bash
# Use the showcase repo as reference
# Structure:
# .claude/skills/{skill-name}/
#   ├── SKILL.md              # Main skill file (~400 lines)
#   └── resources/
#       ├── topic-1.md        # Deep-dive topic files
#       ├── topic-2.md
#       └── topic-3.md
```

**Recommended approach**:
Use a specialized agent to create each skill following the showcase patterns:
1. Load examples from diet103 showcase
2. Adapt for SellerFi's Next.js/Prisma stack
3. Keep SKILL.md under 500 lines
4. Put details in /resources/*.md files

### Phase 3: Specialized Agents 🔄

**Status**: Ready to implement

**Agents to add**:

1. **code-architecture-reviewer**
   - When: Evaluating structure, module boundaries, layering
   - Output: Issues + refactor plan + phased steps
   - Location: `.claude/agents/code-architecture-reviewer.md`

2. **refactor-planner**
   - When: Refactors > 3 files or risky changes
   - Output: Safe incremental plan + test strategy + checkpoints
   - Location: `.claude/agents/refactor-planner.md`

3. **documentation-generator**
   - When: Writing docs, READMEs, ADRs, onboarding
   - Output: Structured docs + "what changed" notes
   - Location: `.claude/agents/documentation-generator.md`

4. **debugger**
   - When: Flaky tests, runtime bugs, regressions
   - Output: Hypotheses → experiments → root cause → fix → regression test
   - Location: `.claude/agents/debugger.md`

5. **test-author**
   - When: Adding missing coverage, building harnesses
   - Output: Test plan + prioritized list + minimal scaffolding
   - Location: `.claude/agents/test-author.md`

6. **security-auditor**
   - When: Touching auth, permissions, tokens, sessions, uploads
   - Output: Threat checklist + concrete fixes + verification
   - Location: `.claude/agents/security-auditor.md`

7. **performance-auditor**
   - When: Slow endpoints, expensive renders, heavy queries
   - Output: Measurement plan + top offenders + quick wins + long-term fixes
   - Location: `.claude/agents/performance-auditor.md`

**Agent structure**:
```markdown
# {Agent Name}

## Role
[What this agent does]

## When to Use
- Trigger condition 1
- Trigger condition 2

## Tools Available
- Read, Grep, Glob
- Bash (for running tests/builds)
- [Other relevant tools]

## Output Format
[Expected deliverables]

## Process
1. Step 1
2. Step 2
3. ...

## Examples
[Usage examples]
```

### Phase 4: Advanced Configuration ⏳

**Optional enhancements**:

1. **Stop hooks** (tsc-check, trigger-build-resolver)
   - ⚠️ Only for multi-service monorepos
   - Requires customization for your project structure

2. **Custom commands** (`.claude/commands/`)
   - Slash commands for common workflows
   - Example: `/review-pr`, `/run-tests`, `/check-security`

3. **Additional skills**
   - Domain-specific skills for your business logic
   - Example: `deal-management`, `escrow-client`, `verification-workflow`

---

## Usage Examples

### Example 1: Skill Auto-Activation

**You type**:
```
Fix the authentication middleware to validate JWT tokens properly
```

**Hook triggers**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 SKILL ACTIVATION CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ CRITICAL SKILLS (REQUIRED):
  → security-reviewer

📚 RECOMMENDED SKILLS:
  → backend-dev-guidelines

ACTION: Use Skill tool BEFORE responding
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Example 2: File Tracking

**Claude edits**:
```
- components/deal-card.tsx
- app/api/deals/route.ts
- lib/prisma/deals.ts
```

**PostToolUse hook silently tracks**:
```
.claude/tsc-cache/{session}/edited-files.log:
1735392000:components/deal-card.tsx:components
1735392001:app/api/deals/route.ts:app
1735392002:lib/prisma/deals.ts:lib

.claude/tsc-cache/{session}/affected-repos.txt:
components
app
lib

.claude/tsc-cache/{session}/commands.txt:
components:tsc:npx tsc --noEmit
app:tsc:npx tsc --noEmit
lib:tsc:npx tsc --noEmit
```

### Example 3: Delegating to Agents

**You type**:
```
I need to refactor the deal state machine to support more transitions
```

**Claude responds**:
```
This is a complex refactor affecting multiple files. Let me delegate to
the refactor-planner agent to create a safe incremental plan.

[Uses Task tool with subagent_type='refactor-planner']

Agent output:
- Phase 1: Extract state definitions to separate file (safe, 1 file)
- Phase 2: Add new transition types (safe, 2 files)
- Phase 3: Update handlers (medium risk, 5 files, needs tests)
- Phase 4: Migrate existing data (high risk, needs backup)

Shall I proceed with Phase 1?
```

---

## Architecture

### Directory Structure

```
.claude/
├── hooks/                          # Executable hooks
│   ├── skill-activation-prompt.sh  # UserPromptSubmit hook
│   ├── skill-activation-prompt.ts  # Hook implementation
│   ├── post-tool-use-tracker.sh    # PostToolUse hook
│   ├── package.json                # Hook dependencies
│   ├── node_modules/               # tsx, TypeScript, @types/node
│   └── README.md                   # Hook documentation
│
├── skills/                         # Modular knowledge bases
│   ├── skill-rules.json            # ✅ Activation triggers
│   ├── backend-dev-guidelines/     # 🔄 To be created
│   ├── frontend-dev-guidelines/    # 🔄 To be created
│   ├── test-engineer/              # 🔄 To be created
│   ├── security-reviewer/          # 🔄 To be created
│   └── [other skills]/             # 🔄 To be created
│
├── agents/                         # Specialized subagents
│   ├── code-architecture-reviewer.md   # 🔄 To be created
│   ├── refactor-planner.md             # 🔄 To be created
│   ├── debugger.md                     # 🔄 To be created
│   └── [other agents]/                 # 🔄 To be created
│
├── commands/                       # ⏳ Optional slash commands
│   └── [to be added]
│
├── tsc-cache/                      # Generated by PostToolUse hook
│   └── {session-id}/
│       ├── edited-files.log
│       ├── affected-repos.txt
│       └── commands.txt
│
├── settings.local.json             # ✅ Hook configuration
├── CLAUDE_INFRASTRUCTURE_SETUP.md  # ✅ This file
└── hooks/README.md                 # ✅ Hook documentation
```

### Data Flow

```
User Prompt
    ↓
UserPromptSubmit Hook (skill-activation-prompt)
    ↓
Reads: skill-rules.json
    ↓
Matches: keywords, intentPatterns, fileTriggers
    ↓
Suggests: Relevant skills
    ↓
Claude loads skill via Skill tool
    ↓
Claude responds with skill knowledge
    ↓
Claude edits files
    ↓
PostToolUse Hook (post-tool-use-tracker)
    ↓
Tracks: Edited files, affected areas
    ↓
Generates: Build/tsc commands
    ↓
Context maintained for next interaction
```

### Tech Stack Alignment

| Technology | Skill | Trigger Keywords |
|------------|-------|------------------|
| **Next.js 16** | backend-dev-guidelines, frontend-dev-guidelines | api, route, endpoint, app router |
| **Prisma** | backend-dev-guidelines | prisma, database, schema, migration, model |
| **NextAuth v5** | backend-dev-guidelines, security-reviewer | auth, session, nextauth |
| **React 19** | frontend-dev-guidelines | component, react, hooks, server component |
| **shadcn/ui** | frontend-dev-guidelines | shadcn, radix, button, dialog, form |
| **Tailwind** | frontend-dev-guidelines | styling, tailwind, css |
| **Sentry** | error-tracking | sentry, error boundary, logging |
| **Vitest** | test-engineer | test, vitest, unit test |
| **Playwright** | test-engineer | test, playwright, e2e |

---

## Verification

### Test Hook Installation

```bash
# 1. Check permissions
ls -la .claude/hooks/*.sh
# Expected: -rwxr-xr-x (executable)

# 2. Test skill-activation hook manually
cd .claude/hooks
echo '{"prompt":"fix the api endpoint"}' | ./skill-activation-prompt.sh
# Expected: Skill activation output

# 3. Verify dependencies installed
ls -la .claude/hooks/node_modules/
# Expected: tsx, typescript, @types/node

# 4. Check jq is available (required for post-tool-use-tracker)
which jq
# Expected: /opt/homebrew/bin/jq or /usr/local/bin/jq
# If not: brew install jq
```

### Test Skill Activation

**Try these prompts** to verify hook triggers:

```
1. "Fix the Prisma schema for the Deal model"
   → Should suggest: backend-dev-guidelines

2. "Add a button component to the dashboard"
   → Should suggest: frontend-dev-guidelines

3. "Write tests for the authentication API"
   → Should suggest: test-engineer, backend-dev-guidelines

4. "Check for SQL injection vulnerabilities"
   → Should suggest: security-reviewer (critical priority)

5. "The dashboard is loading slowly"
   → Should suggest: performance-profiler
```

---

## References

- **Showcase Repository**: [diet103/claude-code-infrastructure-showcase](https://github.com/diet103/claude-code-infrastructure-showcase)
- **Skills README**: [showcase/.claude/skills/README.md](https://github.com/diet103/claude-code-infrastructure-showcase/blob/main/.claude/skills/README.md)
- **Hooks README**: [showcase/.claude/hooks/README.md](https://github.com/diet103/claude-code-infrastructure-showcase/blob/main/.claude/hooks/README.md)
- **Integration Guide**: [CLAUDE_INTEGRATION_GUIDE.md](https://github.com/diet103/claude-code-infrastructure-showcase/blob/main/CLAUDE_INTEGRATION_GUIDE.md)
- **Claude Code Docs**: [Claude Code Documentation](https://docs.anthropic.com/claude-code)

---

## Quick Commands

```bash
# View tracked file changes
cat .claude/tsc-cache/default/edited-files.log

# View affected areas
cat .claude/tsc-cache/default/affected-repos.txt

# View generated commands
cat .claude/tsc-cache/default/commands.txt

# Test hook manually
cd .claude/hooks && echo '{"prompt":"test"}' | ./skill-activation-prompt.sh

# Reinstall hook dependencies
cd .claude/hooks && npm install

# View skill activation rules
cat .claude/skills/skill-rules.json | jq
```

---

## Next Actions

1. **Verify installation** using the verification section above
2. **Test skill activation** with sample prompts
3. **Choose Phase 2 approach**:
   - Option A: Create skills manually following showcase patterns
   - Option B: Use specialized agent to generate skills
   - Option C: Incremental - add skills as needed during development
4. **Add specialized agents** (can be done in parallel with skills)
5. **Iterate and refine** based on actual usage patterns

---

**Status**: Phase 1 Complete ✅ | Ready for Phase 2 🚀

**Last Updated**: 2025-12-28
**Infrastructure Version**: 1.0.0
