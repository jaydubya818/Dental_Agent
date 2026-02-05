# Ralph Quick Start Guide

## One-Command Test
```bash
./scripts/ralph/ralph.sh --tool claude 1
```

## Full Workflow

### 1. Create a PRD
```bash
claude
# Then type: "Load the prd skill and create a PRD for [feature description]"
# Example: "Load the prd skill and create a PRD for adding user profile avatars"
```

### 2. Convert to Ralph Format
```bash
# In Claude Code:
"Load the ralph skill and convert tasks/prd-[name].md to prd.json"

# Move it to the right location:
mv prd.json scripts/ralph/prd.json
```

### 3. Edit PRD (Optional)
```bash
# Review and customize
vim scripts/ralph/prd.json

# Or use your editor to:
# - Break large stories into smaller ones
# - Adjust priorities
# - Add specific acceptance criteria
# - Set the branch name
```

### 4. Run Ralph
```bash
# Run with max 20 iterations
./scripts/ralph/ralph.sh --tool claude 20

# Run just 1 iteration (for testing)
./scripts/ralph/ralph.sh --tool claude 1

# Run with Amp (if installed)
./scripts/ralph/ralph.sh --tool amp 20
```

### 5. Monitor Progress
```bash
# Check which stories are complete
cat scripts/ralph/prd.json | jq '.userStories[] | {id, title, passes}'

# View detailed progress
cat scripts/ralph/progress.txt

# See commits
git log --oneline -10

# Check current branch
git branch --show-current
```

## PRD JSON Format

```json
{
  "project": "SellerFi",
  "branchName": "ralph/feature-name",
  "description": "Brief description of the feature set",
  "userStories": [
    {
      "id": "US-001",
      "title": "Short descriptive title",
      "description": "As a [role], I need [feature] so that [benefit].",
      "acceptanceCriteria": [
        "Specific, testable requirement 1",
        "Specific, testable requirement 2",
        "Tests pass (npm run test:run)",
        "Typecheck passes (npm run type-check)"
      ],
      "priority": 1,
      "passes": false,
      "notes": ""
    }
  ]
}
```

## Tips for Good PRDs

### ✅ Do This
- **Small stories:** One file or component at a time
- **Specific criteria:** "Add priority column to database with type 'high' | 'medium' | 'low'"
- **Testable:** Include test requirements in acceptance criteria
- **Sequential:** Order stories by dependencies

### ❌ Avoid This
- **Too large:** "Build entire authentication system"
- **Vague:** "Make it better" or "Improve performance"
- **No tests:** Forgetting to require test coverage
- **Dependencies:** Story 2 depends on Story 1 but has higher priority

## Common Commands

```bash
# Check story status
jq '.userStories[] | select(.passes == false) | {id, title}' scripts/ralph/prd.json

# Count completed stories
jq '[.userStories[] | select(.passes == true)] | length' scripts/ralph/prd.json

# View the current branch from PRD
jq -r '.branchName' scripts/ralph/prd.json

# Archive old run
ls scripts/ralph/archive/
```

## Troubleshooting

### Ralph doesn't create commits
- Check that acceptance criteria include quality checks
- Verify tests are actually passing
- Look at `scripts/ralph/progress.txt` for errors

### Spending cap errors
```
Spending cap reached resets 12pm
```
- This is a Claude API limit
- Wait until the reset time
- Or adjust your API limits in Claude settings

### Ralph keeps failing the same story
- Story might be too large - break it into smaller pieces
- Check acceptance criteria are achievable
- Review `scripts/ralph/progress.txt` for patterns
- Manually implement and mark as complete if needed

### Can't find branch
```bash
# Ralph creates the branch automatically from PRD branchName
git branch -a | grep ralph

# Checkout the branch
git checkout ralph/feature-name
```

## Quality Checks (SellerFi)

Ralph automatically runs these before committing:
- `npm run type-check` - TypeScript validation
- `npm run test:run` - Run all unit tests
- `npm run lint` - ESLint (if specified)

Add these to your acceptance criteria:
```json
"acceptanceCriteria": [
  "Your feature requirements...",
  "All tests pass (npm run test:run)",
  "Typecheck passes (npm run type-check)"
]
```

## Example: Real Feature

Let's add a "Last Login" timestamp:

```json
{
  "project": "SellerFi",
  "branchName": "ralph/last-login-timestamp",
  "description": "Track when users last logged in",
  "userStories": [
    {
      "id": "US-001",
      "title": "Add lastLoginAt to User model",
      "description": "As a developer, I need to store the last login timestamp.",
      "acceptanceCriteria": [
        "Add lastLoginAt DateTime field to User model in schema.prisma",
        "Create and run migration",
        "Typecheck passes"
      ],
      "priority": 1,
      "passes": false,
      "notes": ""
    },
    {
      "id": "US-002",
      "title": "Update login to record timestamp",
      "description": "As a system, I need to record login time when users authenticate.",
      "acceptanceCriteria": [
        "Update auth callback to set lastLoginAt on successful login",
        "Add test for timestamp update",
        "Tests pass",
        "Typecheck passes"
      ],
      "priority": 2,
      "passes": false,
      "notes": ""
    },
    {
      "id": "US-003",
      "title": "Display last login in admin dashboard",
      "description": "As an admin, I want to see when users last logged in.",
      "acceptanceCriteria": [
        "Add lastLoginAt column to admin users table",
        "Format timestamp as relative time (e.g., '2 hours ago')",
        "Show 'Never' if user hasn't logged in",
        "Tests pass",
        "Typecheck passes"
      ],
      "priority": 3,
      "passes": false,
      "notes": ""
    }
  ]
}
```

Save this to `scripts/ralph/prd.json` and run:
```bash
./scripts/ralph/ralph.sh --tool claude 10
```

Ralph will implement all 3 stories automatically!

## Advanced: Customizing Ralph

### Edit Prompts
Customize `scripts/ralph/CLAUDE.md` to add:
- Project-specific patterns
- Coding standards
- Additional quality checks
- Browser testing requirements

### Add Codebase Knowledge
Update `AGENTS.md` in repo root with:
- Common patterns ("Use X for Y")
- Known gotchas ("Don't forget to Z")
- Testing requirements
- Architecture decisions

### Configure Auto-Handoff (Amp Only)
Add to `~/.config/amp/settings.json`:
```json
{
  "amp.experimental.autoHandoff": {
    "context": 90
  }
}
```

## Getting Help

- **Ralph Issues:** https://github.com/snarktank/ralph/issues
- **SellerFi Docs:** See `RALPH_INTEGRATION_SUCCESS.md`
- **PRD Examples:** See `scripts/ralph/prd.json.example`

---

**Quick Test:** `./scripts/ralph/ralph.sh --tool claude 1`
