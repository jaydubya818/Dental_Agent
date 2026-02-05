#!/bin/bash

# Test script to verify all hooks are working correctly

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 TESTING MAGICAL 10X SETUP"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
HOOKS_DIR="$PROJECT_DIR/.claude/hooks"
VALIDATORS_DIR="$HOOKS_DIR/validators"

pass_count=0
fail_count=0

# Test function
test_hook() {
    local name="$1"
    local file="$2"

    echo -n "Testing $name... "

    if [[ -f "$file" ]]; then
        if [[ -x "$file" ]]; then
            echo "✅ PASS"
            ((pass_count++))
        else
            echo "❌ FAIL (not executable)"
            ((fail_count++))
        fi
    else
        echo "❌ FAIL (file not found)"
        ((fail_count++))
    fi
}

echo "📋 Checking Hook Files"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test core hooks
test_hook "Skill Activation Prompt" "$HOOKS_DIR/skill-activation-prompt.sh"
test_hook "Post Tool Use Tracker" "$HOOKS_DIR/post-tool-use-tracker.sh"
test_hook "LSP Check" "$HOOKS_DIR/post-edit-lsp-check.sh"
test_hook "Context Optimizer" "$HOOKS_DIR/context-optimizer.sh"
test_hook "Context Summarizer" "$HOOKS_DIR/context-summarizer.ts"
test_hook "Ralph Wiggum Test Loop" "$HOOKS_DIR/ralph-wiggum-test-fix-loop.sh"
test_hook "Ralph Wiggum Validation Loop" "$HOOKS_DIR/ralph-wiggum-validation-loop.sh"

echo ""
echo "🛡️  Checking Validators"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

test_hook "Financial Validator" "$VALIDATORS_DIR/financial-calculation-validator.sh"
test_hook "Security Validator" "$VALIDATORS_DIR/security-validator.sh"
test_hook "Database Safety Validator" "$VALIDATORS_DIR/database-safety-validator.sh"

echo ""
echo "🔧 Checking Dependencies"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check for required tools
echo -n "Checking jq... "
if command -v jq &> /dev/null; then
    echo "✅ PASS"
    ((pass_count++))
else
    echo "❌ FAIL (not installed: brew install jq)"
    ((fail_count++))
fi

echo -n "Checking TypeScript... "
if command -v npx &> /dev/null && npx tsc --version &> /dev/null; then
    echo "✅ PASS ($(npx tsc --version))"
    ((pass_count++))
else
    echo "❌ FAIL (not installed)"
    ((fail_count++))
fi

echo -n "Checking typescript-language-server... "
if command -v typescript-language-server &> /dev/null; then
    echo "✅ PASS"
    ((pass_count++))
else
    echo "⚠️  WARNING (not installed: npm install -g typescript-language-server)"
    # Not critical, don't count as fail
fi

echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    echo "✅ PASS ($(node --version))"
    ((pass_count++))
else
    echo "❌ FAIL (not installed)"
    ((fail_count++))
fi

echo ""
echo "📁 Checking Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo -n "Checking .mcp.json... "
if [[ -f "$PROJECT_DIR/.mcp.json" ]]; then
    if jq -e '.mcpServers["typescript-lsp"]' "$PROJECT_DIR/.mcp.json" &> /dev/null; then
        echo "✅ PASS (LSP configured)"
        ((pass_count++))
    else
        echo "⚠️  WARNING (typescript-lsp not configured)"
    fi
else
    echo "❌ FAIL (file not found)"
    ((fail_count++))
fi

echo -n "Checking settings.local.json... "
if [[ -f "$PROJECT_DIR/.claude/settings.local.json" ]]; then
    if jq -e '.hooks.PostToolUse' "$PROJECT_DIR/.claude/settings.local.json" &> /dev/null; then
        echo "✅ PASS (hooks configured)"
        ((pass_count++))
    else
        echo "❌ FAIL (hooks not configured)"
        ((fail_count++))
    fi
else
    echo "❌ FAIL (file not found)"
    ((fail_count++))
fi

echo ""
echo "🎯 Functional Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test validator with sample input
echo -n "Testing security validator (hardcoded secret detection)... "
test_file="/tmp/test-secret-$$.ts"
cat > "$test_file" << 'EOF'
const API_KEY = "sk_live_abcdef123456789";
EOF

# Create mock hook input
mock_input=$(cat << EOS
{
  "tool_name": "Edit",
  "tool_input": {
    "file_path": "$test_file"
  }
}
EOS
)

if echo "$mock_input" | "$VALIDATORS_DIR/security-validator.sh" 2>&1 | grep -q "CRITICAL.*secret"; then
    echo "✅ PASS (detected hardcoded secret)"
    ((pass_count++))
else
    echo "❌ FAIL (did not detect secret)"
    ((fail_count++))
fi

rm -f "$test_file"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 TEST RESULTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Passed: $pass_count"
echo "❌ Failed: $fail_count"
echo ""

if [[ $fail_count -eq 0 ]]; then
    echo "🎉 ALL TESTS PASSED!"
    echo ""
    echo "Your magical 10x setup is ready! 🔥"
    echo ""
    echo "Next steps:"
    echo "  1. Read: .claude/MAGICAL_10X_SETUP.md"
    echo "  2. Quick reference: .claude/HOOKS_QUICK_REFERENCE.md"
    echo "  3. Start coding and watch the magic happen! ✨"
    exit 0
else
    echo "⚠️  SOME TESTS FAILED"
    echo ""
    echo "Please review the failures above and:"
    echo "  1. Install missing dependencies"
    echo "  2. Fix file permissions (chmod +x)"
    echo "  3. Re-run this test script"
    exit 1
fi
