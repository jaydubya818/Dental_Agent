# Claude Code Skills

> **51+ skills for accelerated development**

This directory contains project-specific skills that provide Claude with domain knowledge and best practices for this codebase.

## Skills Overview

| Category | Count | Status |
|----------|-------|--------|
| Custom SellerFin Skills | 45+ | Active |
| Superpowers Skills | 14 | Active |
| Continuous Learning | 1 | Active (with hook) |
| OpenSkills | CLI | Installed |

---

## Git Submodule Skills

Three skill repositories are installed as git submodules:

### Continuous Learning
- **Location:** `continuous-learning/`
- **Repository:** https://github.com/blader/claude-code-continuous-learning-skill
- **Purpose:** Autonomous knowledge extraction - creates new skills from non-obvious solutions
- **Hook:** Activated on every prompt via `hooks/continuous-learning-activator.sh`

### OpenSkills
- **Location:** `openskills/`
- **Repository:** https://github.com/numman-ali/openskills
- **Purpose:** Universal skills loader and CLI for managing skills across AI agents

### Superpowers
- **Location:** `superpowers/`
- **Repository:** https://github.com/obra/superpowers
- **Purpose:** 14 composable development workflow skills

---

## Superpowers Skills (14)

Located in `superpowers/skills/`:

### Process & Planning
| Skill | Description |
|-------|-------------|
| `brainstorming` | Initial ideation and approach planning |
| `writing-plans` | Creating structured implementation plans |
| `executing-plans` | Following plans systematically |

### Development
| Skill | Description |
|-------|-------------|
| `test-driven-development` | TDD workflow with tests-first approach |
| `subagent-driven-development` | Using specialized agents for complex tasks |
| `dispatching-parallel-agents` | Managing multiple agents simultaneously |

### Quality & Review
| Skill | Description |
|-------|-------------|
| `verification-before-completion` | Comprehensive pre-completion checks |
| `systematic-debugging` | Structured debugging methodology |
| `requesting-code-review` | Preparing and requesting code reviews |
| `receiving-code-review` | Handling feedback from code reviews |

### Git & Workflow
| Skill | Description |
|-------|-------------|
| `finishing-a-development-branch` | Branch completion checklist |
| `using-git-worktrees` | Working with multiple branches simultaneously |

### Meta
| Skill | Description |
|-------|-------------|
| `using-superpowers` | Core skill explaining how to use all skills |
| `writing-skills` | Guide for creating new skills |

---

## Custom SellerFin Skills (45+)

### Code Quality & Patterns
| Skill | Description |
|-------|-------------|
| testing-patterns | Jest testing, factory functions, mocking strategies, TDD workflow |
| systematic-debugging | Four-phase debugging methodology, root cause analysis |
| advanced-evaluation | Deep code evaluation techniques |
| evaluation | Code quality evaluation |

### React & UI
| Skill | Description |
|-------|-------------|
| react-ui-patterns | React patterns, loading states, error handling, GraphQL hooks |
| core-components | Design system components, tokens, component library |
| formik-patterns | Form handling, validation, submission patterns |
| ui-ux-designer | UI/UX design principles |
| canvas-design | Canvas design patterns |
| theme-factory | Theme generation and management |

### Context Engineering
| Skill | Description |
|-------|-------------|
| context-fundamentals | What context is and why it matters |
| context-optimization | Context optimization strategies |
| context-compression | Compression strategies |
| context-degradation | Patterns of context failure |
| multi-agent-patterns | Multi-agent architectures |
| memory-systems | Memory design patterns |
| tool-design | Tool design principles |

### Architecture
| Skill | Description |
|-------|-------------|
| nextjs-fullstack-architect | Next.js full-stack patterns |
| cloud-infrastructure-architect | Cloud architecture |
| design-system-architect | Design system patterns |
| fintech-developer | Fintech-specific patterns |

### Automation & Tools
| Skill | Description |
|-------|-------------|
| automation-engineer | Automation workflows |
| skill-creator | Creating new skills |
| changelog-generator | Generate changelogs |
| mcp-builder | MCP (Model Context Protocol) building |
| installing-skills-from-github | Installing skills from GitHub repositories |

---

## Skill Combinations for Common Tasks

### Building a New Feature
1. **writing-plans** - Create implementation plan
2. **react-ui-patterns** - Loading/error/empty states
3. **core-components** - UI implementation
4. **test-driven-development** - Write tests first
5. **verification-before-completion** - Final checks

### Debugging an Issue
1. **systematic-debugging** - Root cause analysis
2. **testing-patterns** - Write failing test first

### Code Review
1. **requesting-code-review** - Prepare your PR
2. **receiving-code-review** - Handle feedback

### Feature Branch Completion
1. **finishing-a-development-branch** - Completion checklist
2. **verification-before-completion** - Pre-merge checks

---

## How Skills Work

Skills are automatically invoked when Claude recognizes relevant context. Each skill provides:

- **When to Use** - Trigger conditions
- **Core Patterns** - Best practices and examples
- **Anti-Patterns** - What to avoid
- **Integration** - How skills connect

**Semantic Matching:** Claude uses the `description` field in each SKILL.md for matching.

---

## Adding New Skills

1. Create directory: `.claude/skills/skill-name/`
2. Add `SKILL.md` with YAML frontmatter
3. Include sections: When to Use, Core Patterns, Anti-Patterns
4. Add to this README

### Using Continuous Learning

Work normally - the continuous-learning skill evaluates each session and may prompt you to save solutions as new skills.

**Manual trigger:** Say `/retrospective` to evaluate the current session.

---

## Updating Submodule Skills

```bash
# Update all submodules
git submodule update --remote

# Update specific skill
cd .claude/skills/continuous-learning && git pull
cd .claude/skills/superpowers && git pull
```

---

**Last Updated:** 2026-01-18
**Total Skills:** 51+
**Status:** All systems operational
