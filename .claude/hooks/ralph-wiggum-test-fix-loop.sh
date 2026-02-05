#!/bin/bash
set -e

# Ralph Wiggum Loop - Self-Healing Test Workflow
# Automatically detects test failures and generates fix prompts

tool_info=$(cat)
tool_name=$(echo "$tool_info" | jq -r '.tool_name // empty')
file_path=$(echo "$tool_info" | jq -r '.tool_input.file_path // empty')
session_id=$(echo "$tool_info" | jq -r '.session_id // empty')

# Only run on Edit/Write to source files
if [[ ! "$tool_name" =~ ^(Edit|MultiEdit|Write)$ ]] || [[ -z "$file_path" ]]; then
    exit 0
fi

# Skip non-source files
if [[ ! "$file_path" =~ \.(ts|tsx|js|jsx)$ ]] || [[ "$file_path" =~ (node_modules|\.next|dist|build) ]]; then
    exit 0
fi

# Skip test files themselves (we run tests, not test the tests)
if [[ "$file_path" =~ \.(test|spec)\.(ts|tsx|js|jsx)$ ]]; then
    exit 0
fi

# Create cache directory
cache_dir="$CLAUDE_PROJECT_DIR/.claude/ralph-wiggum/${session_id:-default}"
mkdir -p "$cache_dir"

# Track iteration count to prevent infinite loops
iteration_file="$cache_dir/iteration-count-$(basename "$file_path").txt"
if [[ -f "$iteration_file" ]]; then
    iteration_count=$(cat "$iteration_file")
else
    iteration_count=0
fi

# Max 3 iterations to prevent infinite loops
MAX_ITERATIONS=3
if [[ $iteration_count -ge $MAX_ITERATIONS ]]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔄 RALPH WIGGUM LOOP - Max Iterations Reached"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "File: $file_path"
    echo "Iterations: $iteration_count/$MAX_ITERATIONS"
    echo ""
    echo "⚠️  Auto-fix attempted $MAX_ITERATIONS times without success"
    echo "Manual intervention required."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    rm -f "$iteration_file"
    exit 0
fi

# Find related test file
test_file=""
if [[ "$file_path" =~ ^(.*)\.tsx?$ ]]; then
    base="${BASH_REMATCH[1]}"
    # Try different test file patterns
    for pattern in ".test.ts" ".test.tsx" ".spec.ts" ".spec.tsx"; do
        if [[ -f "${base}${pattern}" ]]; then
            test_file="${base}${pattern}"
            break
        fi
    done

    # Try __tests__ directory
    if [[ -z "$test_file" ]]; then
        filename=$(basename "$base")
        dirname=$(dirname "$file_path")
        for pattern in ".test.ts" ".test.tsx" ".spec.ts" ".spec.tsx"; do
            if [[ -f "$dirname/__tests__/${filename}${pattern}" ]]; then
                test_file="$dirname/__tests__/${filename}${pattern}"
                break
            fi
        done
    fi
fi

# Skip if no test file found
if [[ -z "$test_file" ]] || [[ ! -f "$test_file" ]]; then
    exit 0
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔄 RALPH WIGGUM LOOP - Auto Test & Fix"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Source: $file_path"
echo "Tests:  $test_file"
echo "Iteration: $((iteration_count + 1))/$MAX_ITERATIONS"
echo ""

# Run the test file
cd "$CLAUDE_PROJECT_DIR"

# Determine test command
test_cmd="npm run test:run"
if [[ -f "package.json" ]]; then
    if grep -q '"test:run"' package.json; then
        test_cmd="npm run test:run"
    elif grep -q '"test"' package.json; then
        test_cmd="npm test"
    else
        test_cmd="npx vitest run"
    fi
fi

echo "Running tests..."
test_output=$($test_cmd "$test_file" 2>&1 || true)

# Check if tests passed
if echo "$test_output" | grep -Ei "PASS|✓.*passed|All tests passed" > /dev/null 2>&1; then
    echo "✅ Tests passed!"
    echo ""
    # Reset iteration counter on success
    rm -f "$iteration_file"

    # Clear any pending fix prompts
    rm -f "$cache_dir/fix-prompt-$(basename "$file_path").txt"

    echo "Self-healing workflow complete."
else
    echo "❌ Tests failed"
    echo ""

    # Extract failure information
    failures=$(echo "$test_output" | grep -A 10 "FAIL\|✗\|Error:" || echo "Unknown test failure")

    # Increment iteration count
    echo $((iteration_count + 1)) > "$iteration_file"

    # Generate fix prompt
    fix_prompt_file="$cache_dir/fix-prompt-$(basename "$file_path").txt"

    cat > "$fix_prompt_file" << EOF
🔄 AUTO-GENERATED FIX REQUEST (Ralph Wiggum Loop)

Test file: $test_file
Source file: $file_path
Iteration: $((iteration_count + 1))/$MAX_ITERATIONS

Test failures:
$failures

TASK: Fix the failing tests by modifying $file_path

Requirements:
1. Read the test file to understand what's expected
2. Identify the root cause of the failure
3. Fix the implementation in $file_path
4. Ensure all tests pass

The test will automatically re-run after your fix.
EOF

    echo "Test Failures:"
    echo "$failures" | head -20
    echo ""
    echo "💡 FIX PROMPT GENERATED"
    echo "   Location: $fix_prompt_file"
    echo ""
    echo "NEXT STEP: Apply fix to $file_path"
    echo "   The test will automatically re-run after your changes."
    echo ""

    # Inject fix prompt into conversation (non-blocking suggestion)
    cat "$fix_prompt_file"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

exit 0
