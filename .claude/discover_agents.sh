#!/bin/bash

echo "🔍 Discovering Claude Code Sub-Agents..."

# Find all agent files
AGENT_FILES=$(find .claude/agents -name "*.md" -type f | grep -v "index.md")

echo "📊 Found $(echo "$AGENT_FILES" | wc -l) agents:"
echo

# Display agents by category
for category in orchestration development design quality security data-ai devops documentation product marketing operations specialized; do
    if [ -d ".claude/agents/$category" ]; then
        count=$(ls -1 ".claude/agents/$category"/*.md 2>/dev/null | wc -l)
        echo "📁 $category: $count agents"
    fi
done

echo
echo "✅ Agent discovery complete!"
echo "🎯 Ready to use with Claude Code"
