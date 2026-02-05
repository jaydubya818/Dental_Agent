# Creating Claude Agents

Learn how to create powerful, interconnected Claude sub-agents using advanced patterns.

## Quick Start

```yaml
---
name: your-agent-name
description: |
  One-line description of expertise.
  
  Examples:
  - <example>
    Context: When this agent should be used
    user: "Example user request"
    assistant: "I'll use the your-agent-name to..."
    <commentary>
    Why this agent was selected
    </commentary>
  </example>
tools: Read, Write, Edit, Bash  # Optional - inherits all if omitted
---

You are an expert [role] specializing in [domain].

## Core Expertise
- [Specific skill 1]
- [Specific skill 2]

## Task Approach
1. [How you handle tasks]
2. [Your methodology]

## Return Format
Provide clear, structured output that other agents can understand.
```

## The XML-Style Pattern (Advanced)

Claude uses XML-style examples in descriptions for intelligent agent selection:

```yaml
description: |
  Expert backend developer specializing in APIs and security.
  
  Examples:
  - <example>
    Context: User needs to build an API
    user: "Create a REST API for products"
    assistant: "I'll use @agent-backend-developer to build a comprehensive products API"
    <commentary>
    API development is a core backend task
    </commentary>
  </example>
  - <example>
    Context: User has completed backend and needs frontend
    user: "Now I need a UI for this API"
    assistant: "The backend is complete. Let me hand this off to @agent-tailwind-frontend-expert"
    <commentary>
    Recognizing when to delegate to frontend specialist
    </commentary>
  </example>
```

### Why This Works

1. **Pattern Learning**: Claude learns from examples when to invoke agents
2. **Context Awareness**: Understands project stage and user intent
3. **Smart Delegation**: Knows when to hand off to other specialists
4. **Self-Documenting**: Examples serve as live documentation

## Agent Integration

Agents work together through the main Claude agent coordination. Focus on:

- **Clear Output**: Provide structured results that can be used by other agents
- **Next Steps**: Suggest what should happen next in your response
- **Context Passing**: Include relevant information for follow-up work

## Tool Configuration

### Understanding Tool Inheritance

The `tools` field in the agent frontmatter is **optional**. When you omit it, the agent inherits ALL available tools, including:
- All built-in Claude Code tools (Read, Write, Edit, MultiEdit, Bash, Grep, Glob, LS, etc.)
- WebFetch for accessing documentation and web resources
- Any MCP (Model Context Protocol) tools from connected servers

```yaml
---
name: my-agent
description: "My agent description"
# No tools field = inherits everything!
---
```

### When to Specify Tools

Only specify tools when you want to **restrict** an agent's capabilities:

```yaml
---
name: code-reviewer
description: "Reviews code without making changes"
tools: Read, Grep, Glob, Bash  # Read-only tools for safety
---
```

### Best Practices

1. **Most agents should omit the tools field** - This gives maximum flexibility
2. **Security-sensitive agents** - Explicitly list tools (e.g., reviewers get read-only)
3. **Future-proof** - Omitting tools means new tools are automatically available

## Essential Components

### 1. Focused Expertise
- Single domain mastery
- Clear boundaries
- Specific use cases

### 2. Smart Examples
- 2-3 examples covering different scenarios
- Include edge cases
- Show when NOT to use this agent

### 3. Clear Output
- Provide structured results
- Identify next steps
- Include relevant context

## Testing Your Agent

1. **Invocation Test**: Does it trigger on appropriate requests?
2. **Output Test**: Does it provide clear, structured results?
3. **Quality Test**: Is the output expert-level?

## Common Patterns

### Backend → Frontend Flow
```
@agent-backend-developer → API Complete → @agent-frontend-developer → UI Built → @agent-code-reviewer
```

### Full Stack Development
```
@agent-tech-lead-orchestrator → @agent-backend-developer + @agent-frontend-developer → Integration → Testing
```

### Review Pipeline
```
@agent-backend-developer → Code Complete → @agent-code-reviewer → @agent-performance-optimizer
```

## Next Steps

- Browse existing agents in [agents/](../agents/) for implementation examples
- Check [best-practices.md](best-practices.md) for optimization tips
- Start with the agent YAML template shown above
## **Communication Protocol**

**Mandatory Context Acquisition**

Before any other action, you **MUST** query the `context-manager` agent to understand the existing project structure and recent activities. This is not optional.

You will send a request in the following JSON format:

```json
{
  "requesting_agent": "AGENT_NAME",
  "request_type": "get_task_briefing",
  "payload": {
    "query": "Initial briefing required for AGENT_NAME tasks. Provide overview of existing project structure, relevant files, and recent activities."
  }
}
```

**Reporting Protocol**

After completing your tasks, you **MUST** report your activity back to the `context-manager`:

```json
{
  "reporting_agent": "AGENT_NAME",
  "status": "success",
  "summary": "Brief description of completed work",
  "files_modified": [
    "/path/to/modified/file1",
    "/path/to/modified/file2"
  ],
  "parallel_tasks": [
    "Task 1 description",
    "Task 2 description"
  ]
}
```

## **Integration with Other Agents**

### **Parallel Coordination**
- **Task Delegation**: Delegate tasks to appropriate specialized agents
- **Resource Sharing**: Coordinate resource usage with other agents
- **Progress Tracking**: Monitor and report progress to supervisor orchestrator
- **Conflict Resolution**: Resolve conflicts with other agents intelligently

### **Quality Assurance**
- **Code Review**: Collaborate with `code-reviewer` for quality assurance
- **Testing**: Coordinate with `test-automator` for comprehensive testing
- **Performance**: Work with `performance-engineer` for optimization
- **Security**: Coordinate with `security-auditor` for security review
