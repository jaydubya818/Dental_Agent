#!/bin/bash
set -e

# Context Optimizer
# Intelligently manages context to reduce token usage and costs

tool_info=$(cat)
tool_name=$(echo "$tool_info" | jq -r '.tool_name // empty')
file_path=$(echo "$tool_info" | jq -r '.tool_input.file_path // empty')
session_id=$(echo "$tool_info" | jq -r '.session_id // empty')

# Run on Read tools to optimize what gets read
if [[ "$tool_name" != "Read" ]] || [[ -z "$file_path" ]]; then
    exit 0
fi

cache_dir="$CLAUDE_PROJECT_DIR/.claude/context-cache/${session_id:-default}"
mkdir -p "$cache_dir"

# Track files read in this session
reads_log="$cache_dir/files-read.log"
echo "$(date +%s):$file_path" >> "$reads_log"

# Count how many times this file has been read
read_count=$(grep -c "$file_path" "$reads_log" 2>/dev/null || echo "1")

# Detect repeated reads
if [[ $read_count -gt 1 ]]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📊 CONTEXT OPTIMIZATION"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "File: $file_path"
    echo "Read count: $read_count"
    echo ""
    echo "💡 This file has been read multiple times."
    echo "   Consider keeping relevant parts in context instead of re-reading."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
fi

exit 0
