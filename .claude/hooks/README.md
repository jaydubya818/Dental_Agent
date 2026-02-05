# Claude Code Hooks - SellerFi

## Overview

This directory contains Claude Code hooks that enable auto-skill activation and file tracking functionality. Hooks are scripts that execute at specific workflow points to enhance Claude's behavior with contextual awareness.

## Installed Hooks

### 1. UserPromptSubmit Hook: `skill-activation-prompt`

**Purpose**: Automatically suggests relevant skills based on user prompts and file context.

**How it works**:
1. Reads `skill-rules.json` configuration
2. Matches user input against trigger patterns (keywords + intent patterns)
3. Identifies active project files and matches against path patterns
4. Injects skill recommendations into Claude's processing context

**Files**:
- `skill-activation-prompt.sh` - Bash wrapper script
- `skill-activation-prompt.ts` - TypeScript implementation
- `package.json` - Node dependencies (tsx, TypeScript)

**Configuration**:
```json
{
  "hooks": {
    "UserPromptSubmit": [{
      "hooks": [{
        "type": "command",
        "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/skill-activation-prompt.sh"
      }]
    }]
  }
}
```

### 2. PostToolUse Hook: `post-tool-use-tracker`

**Purpose**: Maintains file change context across sessions through monitoring and caching.

**How it works**:
1. Monitors Edit/Write/MultiEdit tool operations
2. Logs modified file paths with timestamps
3. Creates context cache for continuity in `.claude/tsc-cache/`
4. Auto-detects project structure (app, components, lib, prisma, etc.)
5. Generates appropriate build/tsc commands for modified areas

**Files**:
- `post-tool-use-tracker.sh` - Bash implementation

**Configuration**:
```json
{
  "hooks": {
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

## Installation

### Prerequisites
- Node.js and npm installed
- jq installed (for JSON parsing in bash): `brew install jq`

### Setup Steps

1. **Install dependencies** (already done):
```bash
cd .claude/hooks
npm install
```

2. **Make scripts executable** (already done):
```bash
chmod +x *.sh
```

3. **Verify hook configuration** in `.claude/settings.local.json`:
- UserPromptSubmit hook configured
- PostToolUse hook configured

## How to Use

### Skill Activation Hook

When you type prompts like:
- "Fix the API endpoint for user registration"
- "Add a button component to the dashboard"
- "Update the Prisma schema"

The hook will automatically suggest relevant skills:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 SKILL ACTIVATION CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 RECOMMENDED SKILLS:
  → backend-dev-guidelines
  → route-tester

ACTION: Use Skill tool BEFORE responding
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### File Tracking Hook

The PostToolUse hook runs silently in the background after every file edit/write. It:
- Tracks which files were modified
- Detects which parts of the project are affected
- Prepares appropriate verification commands
- Helps Claude maintain context about recent changes

You can view tracked changes:
```bash
cat .claude/tsc-cache/default/edited-files.log
cat .claude/tsc-cache/default/affected-repos.txt
cat .claude/tsc-cache/default/commands.txt
```

## Customization

### Adding New Skill Triggers

Edit `.claude/skills/skill-rules.json` to add triggers for new skills:

```json
{
  "your-skill-name": {
    "type": "domain",
    "enforcement": "suggest",
    "priority": "high",
    "promptTriggers": {
      "keywords": ["keyword1", "keyword2"],
      "intentPatterns": ["pattern1.*", "pattern2.*"]
    },
    "fileTriggers": {
      "pathPatterns": ["path/**/*.{ts,tsx}"],
      "contentPatterns": ["import.*library"]
    }
  }
}
```

### Modifying Repository Detection

Edit `post-tool-use-tracker.sh` function `detect_repo()` to match your project structure.

Current patterns:
- `app/` - Next.js app directory
- `components/` - React components
- `lib/` - Library/utility code
- `prisma/` - Database schema and migrations
- `hooks/` - React hooks
- `__tests__/`, `tests/` - Test files

## Troubleshooting

### Hook not triggering

1. Check permissions:
```bash
ls -la .claude/hooks/*.sh
# Should show: -rwxr-xr-x (executable)
```

2. Verify hook configuration in settings.local.json

3. Check hook output manually:
```bash
cd .claude/hooks
echo '{"prompt":"test api endpoint"}' | ./skill-activation-prompt.sh
```

### Dependencies missing

```bash
cd .claude/hooks
npm install
```

### jq command not found

```bash
brew install jq
```

## Tech Stack Integration

These hooks are configured for:
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Frontend**: React 19, shadcn/ui, Radix UI, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (via Neon)
- **Auth**: NextAuth v5
- **Error Tracking**: Sentry
- **Testing**: Vitest (unit/integration), Playwright (e2e)

## Next Steps

See [CLAUDE_INFRASTRUCTURE_SETUP.md](../CLAUDE_INFRASTRUCTURE_SETUP.md) for:
1. Adding recommended skills
2. Creating specialized agents
3. Extending skill activation rules
4. Advanced hook configurations

## References

- [Claude Code Hooks Documentation](https://github.com/anthropics/claude-code/blob/main/docs/hooks.md)
- [Skill Architecture Guide](../skills/README.md)
- [Integration Guide](../CLAUDE_INTEGRATION_GUIDE.md)
