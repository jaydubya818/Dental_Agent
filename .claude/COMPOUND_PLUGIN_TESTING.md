# Compound Engineering Plugin Testing Guide

## 🧪 Testing Status

**Date**: January 21, 2026  
**Status**: ⚠️ **Requires Claude Code IDE for Installation**  
**CLI Version**: 1.0.113 (Claude Code)

---

## ⚠️ Important Notes

### Plugin Installation Requirements

The Compound Engineering Plugin uses Claude Code's plugin system, which requires:
- **Claude Code IDE** (desktop or web interface)
- Plugin commands (`/plugin`) are **not available via CLI**
- Must be installed through the IDE interface

### CLI Limitations

```bash
# ❌ These commands don't work in terminal:
claude /plugin marketplace add https://...
claude /plugin install compound-engineering

# ✅ These must be run in Claude Code IDE:
# In the IDE chat interface, type:
/plugin marketplace add https://github.com/EveryInc/compound-engineering-plugin
/plugin install compound-engineering
```

---

## 🚀 Installation Steps (In Claude Code IDE)

### Step 1: Add Marketplace

In Claude Code IDE chat interface:
```
/plugin marketplace add https://github.com/EveryInc/compound-engineering-plugin
```

**Expected Output:**
```
✓ Marketplace added successfully
✓ Found 2 plugins: compound-engineering, coding-tutor
```

### Step 2: Install Plugin

```
/plugin install compound-engineering
```

**Expected Output:**
```
✓ Installing compound-engineering plugin...
✓ Loaded 27 agents
✓ Loaded 20 commands
✓ Loaded 14 skills
✓ Started 1 MCP server (context7)
✓ Plugin installed successfully
```

### Step 3: Verify Installation

```
/plugin list
```

**Expected Output:**
```
Installed Plugins:
- compound-engineering (v1.x.x)
  - 27 agents
  - 20 commands
  - 14 skills
```

---

## 🧪 Test Suite

### Test 1: Planning Workflow

**Command:**
```
/workflows:plan "Add test feature for plugin verification"
```

**Expected Behavior:**
1. Asks clarifying questions about the feature
2. Runs parallel research agents:
   - `repo-research-analyst`
   - `best-practices-researcher`
   - `framework-docs-researcher`
3. Runs `spec-flow-analyzer`
4. Creates plan file in `plans/feat-test-feature.md`
5. Offers post-generation options

**Success Criteria:**
- ✅ Plan file created
- ✅ Contains research findings
- ✅ Has proper markdown structure
- ✅ Includes acceptance criteria

### Test 2: Review Workflow

**Command:**
```
/workflows:review #latest
```

**Expected Behavior:**
1. Fetches latest PR metadata
2. Runs 13+ parallel review agents
3. Synthesizes findings into P1/P2/P3
4. Creates todo files in `todos/`
5. Offers browser testing

**Success Criteria:**
- ✅ Todo files created with proper naming
- ✅ P1/P2/P3 priorities assigned
- ✅ Findings include file paths and line numbers
- ✅ Summary report displayed

### Test 3: Compound Workflow

**Command:**
```
/workflows:compound "Test documentation of plugin installation"
```

**Expected Behavior:**
1. Launches parallel subagents
2. Extracts problem and solution
3. Determines category
4. Creates markdown file in `docs/solutions/`

**Success Criteria:**
- ✅ Documentation file created
- ✅ YAML frontmatter present
- ✅ Proper category assigned
- ✅ Searchable structure

### Test 4: Browser Testing

**Command:**
```
/test-browser #latest
```

**Expected Behavior:**
1. Identifies affected pages
2. Launches browser automation
3. Captures snapshots
4. Checks console errors
5. Creates P1 todos for failures

**Success Criteria:**
- ✅ Browser launches successfully
- ✅ Pages load without errors
- ✅ Console errors detected
- ✅ Todos created for issues

### Test 5: Parallel Resolution

**Command:**
```
/resolve_todo_parallel
```

**Expected Behavior:**
1. Lists pending todos
2. Launches subagents for each
3. Implements fixes in parallel
4. Updates work logs
5. Marks todos complete

**Success Criteria:**
- ✅ Multiple todos resolved simultaneously
- ✅ Work logs updated
- ✅ Files renamed to complete status

---

## 🔍 Agent Testing

### Test Individual Review Agents

#### Security Agent
```
# In PR review context:
Task security-sentinel("Review authentication flow in PR #123")
```

**Expected:** Security findings with severity levels

#### Rails Reviewer
```
Task kieran-rails-reviewer("Review Rails code in app/models/deal.rb")
```

**Expected:** Rails convention feedback

#### Performance Oracle
```
Task performance-oracle("Analyze query performance in deal listing")
```

**Expected:** Performance recommendations

---

## 📊 Integration Testing

### Test 1: Taskmaster + Compound Integration

**Scenario:** Create a feature from PRD to completion

```bash
# 1. Create plan with Compound
/workflows:plan "Add deal scoring feature"

# 2. Create Taskmaster tasks from plan
task-master parse-prd plans/feat-deal-scoring.md --tag=scoring

# 3. Start work with Compound
/workflows:work plans/feat-deal-scoring.md

# 4. Track progress with Taskmaster
task-master set-status --id=1.1 --status=in-progress
task-master update-subtask --id=1.1 --prompt="Implemented scoring algorithm"

# 5. Review with Compound
gh pr create
/workflows:review #latest

# 6. Complete with Taskmaster
task-master set-status --id=1 --status=done

# 7. Document with Compound
/workflows:compound "Implemented deterministic deal scoring"
```

**Success Criteria:**
- ✅ Plan created and parsed into tasks
- ✅ Work tracked in both systems
- ✅ Review findings documented
- ✅ Knowledge compounded

### Test 2: Multi-Agent Review

**Scenario:** Comprehensive PR review

```bash
# Run full review
/workflows:review #123

# Expected agents to run:
# - kieran-rails-reviewer
# - security-sentinel
# - performance-oracle
# - architecture-strategist
# - data-integrity-guardian
# - agent-native-reviewer
# - code-simplicity-reviewer
# Plus conditional agents for migrations
```

**Success Criteria:**
- ✅ All agents complete successfully
- ✅ Findings synthesized correctly
- ✅ P1 findings block merge
- ✅ Todos created with proper structure

---

## 🛠️ Troubleshooting Tests

### Issue: MCP Server Not Starting

**Test:**
```bash
# Check settings.json
cat .claude/settings.json | jq '.mcpServers'
```

**Fix:**
```json
{
  "mcpServers": {
    "context7": {
      "type": "http",
      "url": "https://mcp.context7.com/mcp"
    }
  }
}
```

### Issue: Browser Automation Failing

**Test:**
```bash
# Check agent-browser installation
which agent-browser
agent-browser --version
```

**Fix:**
```bash
npm install -g agent-browser
agent-browser install
```

### Issue: Todos Not Creating

**Test:**
```bash
# Check directory exists
ls -la todos/

# Check permissions
ls -ld todos/
```

**Fix:**
```bash
mkdir -p todos
chmod 755 todos
```

---

## 📋 Manual Testing Checklist

### Pre-Installation
- [ ] Claude Code IDE is running
- [ ] Project is open in IDE
- [ ] Chat interface is accessible

### Installation
- [ ] Run `/plugin marketplace add` command
- [ ] Verify marketplace added successfully
- [ ] Run `/plugin install compound-engineering`
- [ ] Verify 27 agents loaded
- [ ] Verify 20 commands loaded
- [ ] Verify 14 skills loaded
- [ ] Verify MCP server started

### Post-Installation
- [ ] Run `/plugin list` to confirm
- [ ] Test `/workflows:plan` with simple feature
- [ ] Verify plan file created in `plans/`
- [ ] Test `/workflows:review` on existing PR
- [ ] Verify todo files created in `todos/`
- [ ] Test `/workflows:compound` with simple problem
- [ ] Verify solution file created in `docs/solutions/`

### Integration
- [ ] Create plan with `/workflows:plan`
- [ ] Parse plan with Taskmaster
- [ ] Track work in both systems
- [ ] Review with `/workflows:review`
- [ ] Verify findings align with SellerFi rules
- [ ] Document with `/workflows:compound`

---

## 🎯 Expected Results

### Directory Structure After Testing

```
seller-financing-platform/
├── plans/
│   └── feat-test-feature.md           # From /workflows:plan
├── todos/
│   ├── 001-pending-p1-test.md         # From /workflows:review
│   └── 002-pending-p2-test.md
└── docs/
    └── solutions/
        └── [category]/
            └── test-documentation.md   # From /workflows:compound
```

### Agent Availability

After installation, these agents should be available:

**Review Agents (14):**
- kieran-rails-reviewer
- dhh-rails-reviewer
- security-sentinel
- performance-oracle
- architecture-strategist
- data-integrity-guardian
- data-migration-expert
- deployment-verification-agent
- agent-native-reviewer
- code-simplicity-reviewer
- pattern-recognition-specialist
- julik-frontend-races-reviewer
- kieran-python-reviewer
- kieran-typescript-reviewer

**Research Agents (4):**
- best-practices-researcher
- framework-docs-researcher
- git-history-analyzer
- repo-research-analyst

**Design Agents (3):**
- design-implementation-reviewer
- design-iterator
- figma-design-sync

**Workflow Agents (5):**
- bug-reproduction-validator
- every-style-editor
- lint
- pr-comment-resolver
- spec-flow-analyzer

**Docs Agent (1):**
- ankane-readme-writer

### Command Availability

After installation, these commands should be available:

**Core Workflows:**
- /workflows:plan
- /workflows:work
- /workflows:review
- /workflows:compound

**Utilities:**
- /deepen-plan
- /plan_review
- /test-browser
- /triage
- /resolve_parallel
- /resolve_pr_parallel
- /resolve_todo_parallel
- /changelog
- /create-agent-skill
- /generate_command
- /heal-skill
- /report-bug
- /reproduce-bug
- /xcode-test
- /feature-video
- /agent-native-audit
- /deploy-docs
- /release-docs
- /lfg

---

## 🚨 Known Limitations

### 1. CLI Plugin Commands Not Supported

**Issue:** Plugin commands require Claude Code IDE  
**Workaround:** Use IDE chat interface for all plugin operations

### 2. Browser Automation Requires Setup

**Issue:** `/test-browser` needs agent-browser CLI  
**Workaround:**
```bash
npm install -g agent-browser
agent-browser install
```

### 3. MCP Server May Not Auto-Load

**Issue:** Context7 MCP server may not start automatically  
**Workaround:** Manually add to `.claude/settings.json`

---

## ✅ Success Indicators

### Installation Successful If:
- ✅ `/plugin list` shows compound-engineering
- ✅ `/workflows:plan` command is recognized
- ✅ Agents are callable with `Task agent-name()`
- ✅ Skills are available with `skill: skill-name`

### Integration Successful If:
- ✅ Plans created in `plans/` directory
- ✅ Todos created in `todos/` directory
- ✅ Solutions documented in `docs/solutions/`
- ✅ Taskmaster tasks link to plan files
- ✅ Review findings align with SellerFi rules

### Workflow Successful If:
- ✅ `/workflows:plan` creates detailed plans
- ✅ `/workflows:review` runs multi-agent review
- ✅ `/workflows:compound` documents learnings
- ✅ Knowledge compounds over time

---

## 📝 Testing Notes

### To Be Tested in Claude Code IDE:

1. **Installation** (Must be done in IDE)
2. **Command Execution** (Must be done in IDE)
3. **Agent Invocation** (Can be done via Task() in IDE)
4. **Skill Loading** (Automatic in IDE)

### Can Be Tested via CLI:

1. **Directory Structure** ✅ (Verified)
2. **File Creation** ✅ (Verified)
3. **Documentation** ✅ (Created)
4. **Integration Points** ✅ (Documented)

---

## 🎯 Next Steps

### For User:

1. **Open Claude Code IDE**
2. **Run installation commands** in chat interface
3. **Test core workflows** with simple examples
4. **Verify integration** with Taskmaster
5. **Report results** for documentation update

### For Documentation:

1. Update this file with actual test results
2. Add screenshots of successful installation
3. Document any issues encountered
4. Update integration guide with learnings

---

## 📚 References

- **Plugin Repository**: https://github.com/EveryInc/compound-engineering-plugin
- **Installation Guide**: [docs/COMPOUND_ENGINEERING_INTEGRATION.md](../docs/COMPOUND_ENGINEERING_INTEGRATION.md)
- **Quick Start**: [.claude/COMPOUND_QUICK_START.md](COMPOUND_QUICK_START.md)
- **Agent Configuration**: [.claude/SELLERFI_AGENT_CONFIG.md](SELLERFI_AGENT_CONFIG.md)

---

*Last Updated: January 21, 2026*  
*Status: Awaiting IDE Testing*  
*CLI Version: 1.0.113 (Claude Code)*
