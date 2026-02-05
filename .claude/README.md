# .claude Directory

This directory contains Claude Code configuration, custom commands, and templates for the SellerFi project.

## Directory Structure

```
.claude/
├── README.md              # This file
├── settings.json          # Claude Code configuration (generated)
├── commands/              # Custom slash commands
│   ├── review.md         # /review - Code review
│   ├── debug.md          # /debug - Debugging assistant
│   ├── ship.md           # /ship - Production deployment
│   ├── test.md           # /test - Run test suite
│   ├── optimize.md       # /optimize - Performance optimization
│   └── refactor.md       # /refactor - Safe refactoring
├── templates/             # Document templates
│   ├── handoff.md        # Session handoff document
│   └── feature-spec.md   # Feature specification
└── examples/              # Example files
    └── GLOBAL_CLAUDE.md  # Example global configuration
```

## Custom Commands

### Available Commands

| Command | Purpose | Usage |
|---------|---------|-------|
| `/review` | Comprehensive code review | Run after making changes |
| `/debug` | Systematic debugging assistant | When troubleshooting issues |
| `/ship` | Prepare and deploy to production | Before deploying |
| `/test` | Run full test suite with reports | Check code quality |
| `/optimize` | Performance optimization analysis | Improve performance |
| `/refactor` | Safe code refactoring | Clean up code |

### How to Use Commands

Simply type the command name in your conversation with Claude:

```
/review
```

Claude will follow the structured process defined in the command file.

### Creating New Commands

1. Create a new markdown file in `.claude/commands/`
2. Name it `command-name.md`
3. Start with a level 1 heading: `# Command Name`
4. Write the instructions for Claude to follow
5. Use the command with `/command-name`

**Example:**
```markdown
# Deploy Staging

Deploy the current branch to staging environment:

1. Run tests
2. Build production bundle
3. Push to staging branch
4. Monitor deployment
5. Run smoke tests
```

## Templates

### handoff.md
Use this template to create session handoff documents for multi-day projects.

**Usage:**
```
"Create a handoff document using the handoff template"
```

### feature-spec.md
Use this template to spec out new features before implementation.

**Usage:**
```
"Create a feature spec for [feature name] using the template"
```

## Configuration

### settings.json

Claude Code will generate a `settings.json` file in this directory if you use the `/permissions` command or manually configure tool permissions.

**Example configuration:**
```json
{
  "permissions": {
    "alwaysAllow": {
      "Read": true,
      "Glob": true,
      "Grep": true,
      "Bash": false,
      "Edit": true,
      "Write": false
    }
  },
  "statusLine": {
    "enabled": true,
    "showModel": true,
    "showBranch": true,
    "showTokens": true
  }
}
```

## Global Configuration

### ~/.claude/CLAUDE.md

For personal preferences that apply across ALL projects, copy the example file:

```bash
cp .claude/examples/GLOBAL_CLAUDE.md ~/.claude/CLAUDE.md
```

Then edit it to match your preferences.

**How it works:**
1. Claude reads `~/.claude/CLAUDE.md` (your global preferences)
2. Claude reads `/project/CLAUDE.md` (project-specific rules)
3. Project rules override global rules when there's a conflict

## Best Practices

### 1. Keep Commands Focused
Each command should do one thing well. Don't create mega-commands that try to do everything.

### 2. Use Templates for Consistency
Templates ensure handoff docs and specs follow the same structure every time.

### 3. Version Control
Commit the `.claude/` directory (except `settings.json` which is personal).

### 4. Share with Team
Custom commands and templates can be shared with your team via git.

### 5. Iterate on Commands
If you find yourself giving Claude the same instructions repeatedly, turn it into a command.

## Examples

### Using /review

```
You: Make changes to auth.ts
Claude: [makes changes]

You: /review
Claude: [performs comprehensive review following checklist]

📋 Security Review:
✅ No SQL injection vulnerabilities found
✅ Authentication properly checked
⚠️  Consider rate limiting on login endpoint

📊 Performance Review:
✅ No N+1 queries
✅ Proper indexes in place

💡 Suggestions:
- Consider extracting validation logic to separate function
...
```

### Using /ship

```
You: /ship
Claude:
Running pre-flight checks...
✅ Tests passing (45/45)
✅ TypeScript clean
✅ Lint passing
✅ Build successful

Creating commit...
Pushing to origin/feature-auth...
Creating PR...

🚀 Deployed to staging
URL: https://staging.sellerfi.com
PR: https://github.com/org/repo/pull/123
```

### Creating a Handoff

```
You: Create a handoff document for this auth refactor work
Claude: [generates detailed handoff using template]

Saved to: docs/handoff-auth-refactor-2026-01-18.md
```

## Troubleshooting

### Commands Not Working
- Ensure the file is in `.claude/commands/`
- Check that filename is `command-name.md`
- Verify the file starts with `# Command Name` heading
- Try `/clear` and run the command again

### Settings Not Applied
- Check `.claude/settings.json` exists and is valid JSON
- Use `/permissions` to reconfigure
- Restart Claude Code if needed

### Global CLAUDE.md Not Loaded
- Verify file is at `~/.claude/CLAUDE.md` (note the tilde ~)
- Check file permissions (must be readable)
- Ensure it's valid markdown

## Resources

- **Main documentation:** `/docs/CLAUDE_CODE_WORKFLOW_GUIDE.md`
- **Project context:** `/CLAUDE.md`
- **API reference:** `/docs/API_REFERENCE.md`

## Contributing

To add new commands or improve templates:

1. Create or modify files in `.claude/`
2. Test the command/template
3. Update this README if needed
4. Commit and push

---

**Maintained by:** SellerFi Development Team
**Last updated:** 2026-01-18
