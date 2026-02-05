#!/bin/bash

echo "🔍 Validating Claude Code Sub-Agents..."

# Check if all required directories exist
REQUIRED_DIRS=("orchestration" "development" "design" "quality" "security" "data-ai" "devops" "documentation" "product" "marketing" "operations" "specialized")

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d ".claude/agents/$dir" ]; then
        count=$(ls -1 ".claude/agents/$dir"/*.md 2>/dev/null | wc -l)
        echo "✅ $dir: $count agents"
    else
        echo "❌ $dir: Missing directory"
    fi
done

# Check for required files
REQUIRED_FILES=("supervisor-orchestrator.md" "agent-organizer.md" "code-reviewer.md" "test-automator.md")

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f ".claude/agents/orchestration/$file" ] || [ -f ".claude/agents/quality/$file" ]; then
        echo "✅ $file: Found"
    else
        echo "❌ $file: Missing"
    fi
done

# Count total agents
TOTAL_AGENTS=$(find .claude/agents -name "*.md" -type f | grep -v "index.md" | wc -l)
echo
echo "📊 Total agents found: $TOTAL_AGENTS"
echo "🎯 Expected: 108"

if [ "$TOTAL_AGENTS" -eq 108 ]; then
    echo "✅ Validation successful!"
else
    echo "⚠️  Validation incomplete - some agents may be missing"
fi
