---
name: installing-skills-from-github
description: |
  Install Claude Code skills from GitHub repositories as git submodules. Use when:
  (1) installing skills from GitHub URLs like obra/superpowers or blader/continuous-learning,
  (2) git warns "adding embedded git repository", (3) need to track external skill repos
  in your project, (4) .claude/ directory in .gitignore blocks skill commits. Handles
  submodule setup, hook configuration, and .gitignore conflicts. Applies to Claude Code
  project-local skills installation.
author: Claude Code via continuous-learning
version: 1.0.0
date: 2026-01-18
---

# Installing Claude Code Skills from GitHub

## Problem

Installing Claude Code skills from GitHub repositories requires git submodules rather than
regular cloning. Simply cloning skill repos creates "embedded git repositories" that git
won't properly track, and the default .gitignore often blocks .claude/ from being committed.

## Context / Trigger Conditions

Use this skill when:
- Installing skills from GitHub URLs (e.g., `https://github.com/obra/superpowers`)
- Git warns: `adding embedded git repository: .claude/skills/[name]`
- Skills won't commit because `.claude/` is in `.gitignore`
- Need to track skill installations in your repository
- Setting up continuous-learning or other skills with hooks

**Symptoms:**
```
warning: adding embedded git repository: .claude/skills/continuous-learning
hint: You've added another git repository inside your current repository.
hint: If you meant to add a submodule, use:
hint:   git submodule add <url> .claude/skills/continuous-learning
```

## Solution

### Step 1: Create Skills Directory Structure

```bash
mkdir -p .claude/skills
mkdir -p .claude/hooks
```

### Step 2: Check .gitignore

Many projects ignore `.claude/` by default. Remove it if you want to track skills in git:

```bash
# Check if .claude/ is ignored
git check-ignore -v .claude/

# If ignored, edit .gitignore and remove the line:
# .claude/
```

**Decision point:** Project-specific skills should be committed (`.claude/skills/`).
Personal skills should use `~/.claude/skills/` and stay gitignored.

### Step 3: Install Skills as Submodules

Use `git submodule add` instead of `git clone`:

```bash
# For each skill repository:
git submodule add https://github.com/[org]/[repo].git .claude/skills/[skill-name]

# Example: Installing three popular skill repos
git submodule add https://github.com/blader/claude-code-continuous-learning-skill.git .claude/skills/continuous-learning
git submodule add https://github.com/numman-ali/openskills.git .claude/skills/openskills
git submodule add https://github.com/obra/superpowers.git .claude/skills/superpowers
```

**If you already cloned as regular repos:**

```bash
# Remove the embedded repos from git's tracking
git rm --cached -f .claude/skills/[skill-name]

# Delete the directories
rm -rf .claude/skills/*

# Then use git submodule add (see above)
```

### Step 4: Configure Hooks (If Needed)

Some skills like continuous-learning require hooks:

```bash
# Copy hook script to hooks directory
cp .claude/skills/continuous-learning/scripts/continuous-learning-activator.sh .claude/hooks/
chmod +x .claude/hooks/continuous-learning-activator.sh
```

Create or update `.claude/settings.json`:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "./.claude/hooks/continuous-learning-activator.sh"
          }
        ]
      }
    ]
  }
}
```

### Step 5: Verify Installation

```bash
# Check submodules are registered
cat .gitmodules

# Count available skill files
find .claude/skills -name "SKILL.md" | wc -l

# Verify hook is executable (if configured)
test -x .claude/hooks/continuous-learning-activator.sh && echo "✅ Hook ready"
```

### Step 6: Commit and Push

```bash
# Stage all changes
git add .claude/ .gitignore .gitmodules

# Commit with descriptive message
git commit -m "feat: install Claude Code skills as submodules

- continuous-learning: autonomous knowledge extraction
- openskills: universal skills loader
- superpowers: complete development workflow

Skills configured as git submodules in .claude/skills/
Hook activated for continuous-learning in .claude/settings.json"

# Push to your branch
git push -u origin your-branch-name
```

## Verification

After installation, verify:

1. **Submodules registered:** `cat .gitmodules` shows your skills
2. **Skills discovered:** `find .claude/skills -name "SKILL.md"` returns skill files
3. **Hooks working:** Submit a prompt and see hook output (for continuous-learning)
4. **Git tracking:** `git status` shows `.claude/` files staged/committed

## Cloning a Project with Skill Submodules

When others clone your project:

```bash
# Clone with submodules
git clone --recursive [repo-url]

# Or if already cloned without --recursive:
git submodule update --init --recursive
```

## Updating Skills

To update skill repositories to latest versions:

```bash
# Update specific submodule
cd .claude/skills/superpowers
git pull origin main

# Or update all submodules from parent repo
git submodule update --remote --merge

# Commit the updated submodule references
git add .claude/skills
git commit -m "chore: update Claude Code skills to latest versions"
```

## Notes

### Project vs Personal Skills

- **Project skills** (`.claude/skills/`): Team-shared, committed to git
- **Personal skills** (`~/.claude/skills/`): User-specific, stays local

### Skill Discovery

Claude Code uses semantic matching on skill descriptions. Skills activate automatically
when their description matches your task context. No manual invocation needed for most skills.

### Performance

Skills use progressive disclosure:
- Metadata loads first (~100 tokens)
- Full instructions load when relevant (<5k tokens)
- Resources load only when needed

Start with 5-10 skills and add more as needed—skills are lightweight.

### Security

Skills can execute arbitrary code. Inspect community skills before installation:

```bash
# Review skill contents before installing
curl https://raw.githubusercontent.com/[org]/[repo]/main/SKILL.md

# Check for hook scripts
find .claude/skills/[skill-name] -name "*.sh" -exec cat {} \;
```

### Alternative: NPM-based Installation

Some skills support `npx openskills install`:

```bash
# Install from Anthropic marketplace
npx openskills install anthropics/skills

# Install from GitHub
npx openskills install [org]/[repo]
```

This method still uses `.claude/skills/` but manages installation automatically.

### Common Issues

**Issue:** "Permission denied" when running hook
**Fix:** `chmod +x .claude/hooks/[hook-name].sh`

**Issue:** Skills not activating
**Fix:** Ensure SKILL.md has valid YAML frontmatter and descriptive `description` field

**Issue:** Submodule URL changed or repo deleted
**Fix:** Update `.gitmodules` with new URL or remove the submodule:

```bash
git submodule deinit .claude/skills/[skill-name]
git rm .claude/skills/[skill-name]
rm -rf .git/modules/.claude/skills/[skill-name]
```

## Example: Complete Installation Flow

```bash
# 1. Setup
mkdir -p .claude/skills .claude/hooks

# 2. Remove .claude/ from .gitignore if present
sed -i '/^\.claude\/$/d' .gitignore

# 3. Install skills as submodules
git submodule add https://github.com/obra/superpowers.git .claude/skills/superpowers
git submodule add https://github.com/blader/claude-code-continuous-learning-skill.git .claude/skills/continuous-learning

# 4. Configure hooks (for continuous-learning)
cp .claude/skills/continuous-learning/scripts/continuous-learning-activator.sh .claude/hooks/
chmod +x .claude/hooks/continuous-learning-activator.sh

cat > .claude/settings.json <<'EOF'
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "./.claude/hooks/continuous-learning-activator.sh"
          }
        ]
      }
    ]
  }
}
EOF

# 5. Verify
find .claude/skills -name "SKILL.md" | wc -l
cat .gitmodules

# 6. Commit
git add .claude/ .gitignore .gitmodules
git commit -m "feat: install Claude Code skills as submodules"
git push
```

## References

- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills)
- [Awesome Claude Skills](https://github.com/travisvn/awesome-claude-skills)
- [obra/superpowers Repository](https://github.com/obra/superpowers)
- [Git Submodules Best Practices](https://gist.github.com/slavafomin/08670ec0c0e75b500edbaa5d43a5c93c)
- [Git Submodules Official Docs](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [Atlassian Git Submodules Guide](https://www.atlassian.com/git/tutorials/git-submodule)
