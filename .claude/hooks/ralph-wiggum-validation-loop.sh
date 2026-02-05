#!/bin/bash
set -e

# Ralph Wiggum Validation Loop
# Runs validators and auto-generates fix prompts for issues

tool_info=$(cat)
tool_name=$(echo "$tool_info" | jq -r '.tool_name // empty')
file_path=$(echo "$tool_info" | jq -r '.tool_input.file_path // empty')
session_id=$(echo "$tool_info" | jq -r '.session_id // empty')

# Only run on Edit/Write
if [[ ! "$tool_name" =~ ^(Edit|MultiEdit|Write)$ ]] || [[ -z "$file_path" ]]; then
    exit 0
fi

cache_dir="$CLAUDE_PROJECT_DIR/.claude/ralph-wiggum/${session_id:-default}"
mkdir -p "$cache_dir"

# Track validation iteration
validation_iteration_file="$cache_dir/validation-iteration-$(basename "$file_path").txt"
if [[ -f "$validation_iteration_file" ]]; then
    validation_count=$(cat "$validation_iteration_file")
else
    validation_count=0
fi

MAX_VALIDATION_ITERATIONS=2
if [[ $validation_count -ge $MAX_VALIDATION_ITERATIONS ]]; then
    rm -f "$validation_iteration_file"
    exit 0
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔄 RALPH WIGGUM VALIDATION LOOP"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "File: $file_path"
echo ""

validators_dir="$CLAUDE_PROJECT_DIR/.claude/hooks/validators"
all_passed=true
validation_output=""

# Run all validators
if [[ -d "$validators_dir" ]]; then
    for validator in "$validators_dir"/*.sh; do
        if [[ -x "$validator" ]]; then
            validator_name=$(basename "$validator" .sh)
            echo "Running $validator_name..."

            # Run validator and capture output
            validator_result=$(echo "$tool_info" | "$validator" 2>&1 || echo "VALIDATION_FAILED")

            if echo "$validator_result" | grep -E "CRITICAL|VALIDATION_FAILED" > /dev/null 2>&1; then
                all_passed=false
                validation_output+="[$validator_name]\n$validator_result\n\n"
            fi
        fi
    done
fi

if [[ "$all_passed" == false ]]; then
    echo "❌ Validation issues detected"
    echo ""

    # Increment validation iteration
    echo $((validation_count + 1)) > "$validation_iteration_file"

    # Generate fix prompt
    fix_prompt_file="$cache_dir/validation-fix-$(basename "$file_path").txt"

    cat > "$fix_prompt_file" << EOF
🔄 AUTO-GENERATED VALIDATION FIX REQUEST

File: $file_path
Validation Iteration: $((validation_count + 1))/$MAX_VALIDATION_ITERATIONS

VALIDATION FAILURES:
$(echo -e "$validation_output")

TASK: Fix the validation issues in $file_path

The validators will automatically re-run after your fix.
EOF

    echo "Validation Issues Found:"
    echo -e "$validation_output"
    echo ""
    echo "💡 FIX PROMPT GENERATED"
    echo "   Location: $fix_prompt_file"
    echo ""

    # Display the fix prompt
    cat "$fix_prompt_file"
else
    echo "✅ All validations passed"
    # Reset counter on success
    rm -f "$validation_iteration_file"
    rm -f "$cache_dir/validation-fix-$(basename "$file_path").txt"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

exit 0
