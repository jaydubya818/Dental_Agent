#!/bin/bash
set -e

# Post-edit hook that runs LSP diagnostics on edited TypeScript/TSX files
# This provides real-time type checking and linting feedback

# Read tool information from stdin
tool_info=$(cat)

# Extract relevant data
tool_name=$(echo "$tool_info" | jq -r '.tool_name // empty')
file_path=$(echo "$tool_info" | jq -r '.tool_input.file_path // empty')

# Skip if not an edit tool or no file path
if [[ ! "$tool_name" =~ ^(Edit|MultiEdit|Write)$ ]] || [[ -z "$file_path" ]]; then
    exit 0
fi

# Only check TypeScript/TSX/JS/JSX files
if [[ ! "$file_path" =~ \.(ts|tsx|js|jsx)$ ]]; then
    exit 0
fi

# Skip node_modules and build artifacts
if [[ "$file_path" =~ node_modules|\.next|dist|build ]]; then
    exit 0
fi

# Determine project root (where tsconfig.json is)
project_root="$CLAUDE_PROJECT_DIR"
if [[ ! -f "$project_root/tsconfig.json" ]]; then
    # Try to find tsconfig.json in parent directories
    current_dir=$(dirname "$file_path")
    while [[ "$current_dir" != "/" && "$current_dir" != "." ]]; do
        if [[ -f "$current_dir/tsconfig.json" ]]; then
            project_root="$current_dir"
            break
        fi
        current_dir=$(dirname "$current_dir")
    done
fi

# Run TypeScript compiler check on the file
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 LSP TYPE CHECK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "File: $file_path"
echo ""

cd "$project_root"

# Check if we should use tsconfig.app.json (Vite projects)
tsc_config="tsconfig.json"
if [[ -f "tsconfig.app.json" ]] && [[ "$file_path" =~ ^src/ ]]; then
    tsc_config="tsconfig.app.json"
fi

# Run tsc on the specific file
tsc_output=$(npx tsc --project "$tsc_config" --noEmit --pretty false "$file_path" 2>&1 || true)

if [[ -n "$tsc_output" ]]; then
    # Filter for actual errors/warnings in this file
    file_errors=$(echo "$tsc_output" | grep "$file_path" || true)

    if [[ -n "$file_errors" ]]; then
        echo "⚠️  Type Issues Found:"
        echo "$file_errors"
        echo ""
        echo "💡 Fix these type errors before proceeding"
    else
        echo "✅ No type errors detected"
    fi
else
    echo "✅ No type errors detected"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

exit 0
