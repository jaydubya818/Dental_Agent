# SellerFi Command Registry for Agent Integration

## Purpose
This file enables all Claude Code orchestration agents (supervisor-orchestrator, agent-organizer, context-manager, etc.) to discover and delegate to SellerFi's slash commands.

## Available Commands by Category

### 💰 Financial Workflow Commands
- **`/sellerfi:validate-finances`** - Validates financial calculations, term sheets, and seller financing structures
- **`/sellerfi:verify-compliance`** - Comprehensive regulatory compliance verification
- **`/sellerfi:term-sheet-check`** - Validate seller financing term sheets
- **`/sellerfi:audit-trail`** - Generate audit documentation and trails

### 🛠️ Development Workflow Commands
- **`/sellerfi:quick-commit`** - Smart git commit with financial platform context
- **`/sellerfi:commit-push-pr`** - Automated git workflow from commit to pull request
- **`/sellerfi:test-payments`** - Payment integration and financial workflow testing
- **`/sellerfi:security-scan`** - Security scanning with fintech focus
- **`/sellerfi:rapid`** - Accelerated development mode for time-sensitive financial features

### 🔍 Quality Assurance Commands
- **`/sellerfi:verify-changes`** - Multi-agent verification across financial, security, and compliance domains
- **`/sellerfi:code-simplifier`** - Post-implementation code cleanup for financial modules

### 🎓 Learning & Guidance Commands
- **`/sellerfi:mentor`** - Detailed explanations and guidance for complex financial concepts

### 🏪 Marketplace Operations Commands
- **`/sellerfi:validate-listing`** - Comprehensive business listing validation

### 🎭 Output Style Commands
- **`/sellerfi:financial-analyst`** - Financial analyst output mode with expert analysis
- **`/sellerfi:deal-maker`** - Deal structuring expert persona

## Agent Integration Patterns

### When to Use Slash Commands
Orchestration agents should recommend slash commands when:

1. **Financial Domain Tasks** - Use `/sellerfi:financial-analyst` or `/sellerfi:mentor`
2. **Development Workflows** - Use `/sellerfi:rapid` for urgent fixes
3. **Quality Gates** - Use `/sellerfi:verify-changes` before deployments
4. **Git Operations** - Use `/sellerfi:commit-push-pr` for complete workflows
5. **Compliance Tasks** - Use `/sellerfi:verify-compliance` or `/sellerfi:audit-trail`

### Command Discovery Protocol
```typescript
// Agents can check command availability
const commands = await loadCommands('.claude/commands/config.json');
const financialCommands = commands.filter(cmd => cmd.category === 'financial-workflow');
```

### Delegation Examples

#### Supervisor-Orchestrator Integration
```markdown
User request: "Fix the DSCR calculation and deploy it"

Supervisor analysis:
1. Financial calculation change detected
2. Deployment required
3. Recommend command sequence:
   - `/sellerfi:rapid financial-calc --priority=high` (fast implementation)
   - `/sellerfi:verify-changes financial` (validation)
   - `/sellerfi:commit-push-pr "Fix DSCR calculation accuracy"` (deployment)
```

#### Agent-Organizer Integration
```markdown
User request: "I need help understanding seller financing terms"

Agent analysis:
1. Learning/guidance request detected
2. Financial domain expertise needed
3. Delegate to: `/sellerfi:mentor seller-financing --level=intermediate`
```

## Command Metadata for Agent Decision-Making

Each command includes metadata for intelligent delegation:

```yaml
# Example: commit-push-pr.md
category: "development-workflow"
priority: "high"
keywords: ["git", "commit", "pr", "workflow", "automation"]
allowed_tools: ["Bash", "Read", "Edit", "Grep"]
permissions: ["git-operations", "financial-validation", "security-scanning"]
```

Agents can use this metadata to:
- **Match user intent** to appropriate commands
- **Check tool compatibility** before delegation
- **Prioritize urgent commands** (priority: "high")
- **Filter by domain** (financial vs development vs quality)

## Integration Hooks

### Pre-Command Hook
```bash
# .claude/hooks/command-activation.sh
# Automatically activated before command execution
# Provides context to orchestration agents
```

### Post-Command Hook
```bash
# .claude/hooks/post-command-summary.sh
# Feeds results back to orchestration agents
# Enables intelligent follow-up recommendations
```

## Command Chaining Patterns

Orchestration agents can recommend command sequences:

### Financial Analysis Workflow
```
1. /sellerfi:financial-analyst → Expert analysis mode
2. /sellerfi:validate-finances → Calculation validation
3. /sellerfi:audit-trail → Compliance documentation
```

### Development Workflow
```
1. /sellerfi:rapid → Fast implementation
2. /sellerfi:verify-changes → Multi-agent validation
3. /sellerfi:commit-push-pr → Automated deployment
```

### Learning Workflow
```
1. /sellerfi:mentor → Get explanation
2. /sellerfi:financial-analyst → Apply knowledge
3. /sellerfi:validate-finances → Verify understanding
```

## Agent Configuration Updates

Orchestration agents should be updated with command awareness:

### Supervisor-Orchestrator
- Add command registry scanning
- Include command options in task planning
- Recommend appropriate command sequences

### Agent-Organizer
- Consider commands when forming agent teams
- Suggest command-based workflows
- Balance human vs command execution

### Context-Manager
- Include command results in context tracking
- Maintain command execution history
- Provide command success/failure feedback

## Usage Statistics for Optimization

Track command usage patterns:
- Most frequently used commands
- Success rates by command type
- User satisfaction with command results
- Command execution performance

This data helps orchestration agents make better delegation decisions.

---

**Integration Status**: ✅ Active
**Last Updated**: 2026-01-04
**Commands Available**: 15/15
**Agent Compatibility**: All orchestration agents