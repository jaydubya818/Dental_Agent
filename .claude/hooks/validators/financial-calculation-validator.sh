#!/bin/bash
set -e

# Financial Calculation Validator
# Ensures financial calculations are safe, accurate, and auditable

tool_info=$(cat)
tool_name=$(echo "$tool_info" | jq -r '.tool_name // empty')
file_path=$(echo "$tool_info" | jq -r '.tool_input.file_path // empty')

# Skip if not an edit tool
if [[ ! "$tool_name" =~ ^(Edit|MultiEdit|Write)$ ]] || [[ -z "$file_path" ]]; then
    exit 0
fi

# Only check files that might contain financial logic
if [[ ! "$file_path" =~ (pricing|payment|calculation|finance|escrow|deal|transaction) ]]; then
    exit 0
fi

# Skip test files (we'll validate production code only)
if [[ "$file_path" =~ \.(test|spec)\.(ts|tsx|js|jsx)$ ]]; then
    exit 0
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💰 FINANCIAL CALCULATION VALIDATOR"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "File: $file_path"
echo ""

# Read the file content
content=$(cat "$file_path")

# Array to collect issues
issues=()

# Check 1: Floating point arithmetic (should use integer cents or Decimal library)
if echo "$content" | grep -E "(price|amount|total|fee|cost|payment).*[\*\/]" | grep -v "Decimal\|BigInt\|cents" | grep -v "\/\/" > /dev/null 2>&1; then
    issues+=("⚠️  CRITICAL: Floating-point arithmetic detected in financial calculations")
    issues+=("   Use integer cents (e.g., amountInCents) or Decimal.js library")
    issues+=("   Found in: $(echo "$content" | grep -En "(price|amount|total|fee|cost|payment).*[\*\/]" | grep -v "Decimal\|BigInt\|cents" | grep -v "\/\/" | head -3 | sed 's/^/   Line /')")
fi

# Check 2: Rounding without explicit precision
if echo "$content" | grep -E "Math\.round\(|\.toFixed\(" | grep -v "toFixed(2)" > /dev/null 2>&1; then
    issues+=("⚠️  WARNING: Rounding detected without explicit 2-decimal precision")
    issues+=("   Use .toFixed(2) for currency or specify precision explicitly")
fi

# Check 3: Division that might produce fractional cents
if echo "$content" | grep -E "(price|amount|total|fee).*/[^/]" | grep -v "Math\.floor\|Math\.ceil\|Math\.round" > /dev/null 2>&1; then
    issues+=("💡 INFO: Division detected - ensure proper rounding for fractional cents")
fi

# Check 4: Currency symbols hardcoded (should be configurable)
if echo "$content" | grep -E "\"\\$\"|'\\\$'" | grep -v "USD\|currency" > /dev/null 2>&1; then
    issues+=("💡 INFO: Hardcoded $ symbol detected - consider using currency configuration")
fi

# Check 5: Interest calculations without compound interest checks
if echo "$content" | grep -Ei "interest|apr|rate" | grep -v "compound\|simple" > /dev/null 2>&1; then
    issues+=("💡 INFO: Interest calculation detected - verify compound vs simple interest")
fi

# Check 6: Tax calculations without jurisdiction
if echo "$content" | grep -Ei "tax" | grep -v "jurisdiction\|state\|federal" > /dev/null 2>&1; then
    issues+=("💡 INFO: Tax calculation detected - ensure jurisdiction is considered")
fi

# Check 7: No negative amount guards
if echo "$content" | grep -E "(price|amount|total|fee|payment|cost).*=.*-" | grep -v "if\|check\|validate\|>=\s*0" > /dev/null 2>&1; then
    issues+=("⚠️  WARNING: Negative amounts detected without validation guards")
    issues+=("   Add checks to prevent negative financial values")
fi

# Check 8: Missing audit trail for financial operations
if echo "$content" | grep -Ei "(update|create|delete).*(payment|transaction|deal|escrow)" | grep -v "log\|audit\|track" > /dev/null 2>&1; then
    issues+=("⚠️  WARNING: Financial mutation without audit logging")
    issues+=("   Add audit trail for compliance (e.g., AuditLog.create())")
fi

# Display results
if [ ${#issues[@]} -eq 0 ]; then
    echo "✅ Financial calculation validation passed"
else
    echo "Issues found:"
    echo ""
    for issue in "${issues[@]}"; do
        echo "$issue"
    done
    echo ""
    echo "🔒 Security Reminder: Financial calculations must be:"
    echo "   • Precise (use integers/Decimal, not floats)"
    echo "   • Validated (no negative amounts, overflow checks)"
    echo "   • Audited (log all state changes)"
    echo "   • Tested (unit tests with edge cases)"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

exit 0
