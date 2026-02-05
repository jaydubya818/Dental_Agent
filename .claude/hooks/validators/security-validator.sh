#!/bin/bash
set -e

# Security Validator
# Scans for common security vulnerabilities, secrets, and PII leaks

tool_info=$(cat)
tool_name=$(echo "$tool_info" | jq -r '.tool_name // empty')
file_path=$(echo "$tool_info" | jq -r '.tool_input.file_path // empty')
new_content=$(echo "$tool_info" | jq -r '.tool_input.new_string // .tool_input.content // empty')

# Skip if not an edit tool
if [[ ! "$tool_name" =~ ^(Edit|MultiEdit|Write)$ ]] || [[ -z "$file_path" ]]; then
    exit 0
fi

# Skip certain files
if [[ "$file_path" =~ (\.md$|\.json$|\.lock$|node_modules|\.next|dist) ]]; then
    exit 0
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔒 SECURITY VALIDATOR"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "File: $file_path"
echo ""

content=$(cat "$file_path")
critical_issues=()
warnings=()

# Check 1: Hardcoded secrets/tokens
if echo "$content" | grep -Ei "(api_key|apikey|secret|token|password|private_key)\s*=\s*['\"][^'\"]{8,}" > /dev/null 2>&1; then
    critical_issues+=("🚨 CRITICAL: Potential hardcoded secret detected!")
    critical_issues+=("   Secrets must be stored in environment variables or secure vaults")
fi

# Check 2: AWS/Cloud credentials
if echo "$content" | grep -E "AKIA[0-9A-Z]{16}" > /dev/null 2>&1; then
    critical_issues+=("🚨 CRITICAL: AWS Access Key detected!")
fi

# Check 3: Private keys
if echo "$content" | grep -E "BEGIN (RSA |DSA |EC |OPENSSH )?PRIVATE KEY" > /dev/null 2>&1; then
    critical_issues+=("🚨 CRITICAL: Private key detected in code!")
fi

# Check 4: SQL Injection vulnerabilities
if echo "$content" | grep -E "SELECT.*\\\$\{|INSERT.*\\\$\{|UPDATE.*\\\$\{|DELETE.*\\\$\{" > /dev/null 2>&1; then
    critical_issues+=("🚨 CRITICAL: Potential SQL injection via template literals!")
    critical_issues+=("   Use parameterized queries or Prisma ORM")
fi

# Check 5: Command injection
if echo "$content" | grep -E "exec\(|execSync\(|spawn\(.*\\\$\{" > /dev/null 2>&1; then
    warnings+=("⚠️  WARNING: Potential command injection risk")
    warnings+=("   Validate/sanitize user input before shell execution")
fi

# Check 6: Sensitive PII without encryption
if echo "$content" | grep -Ei "(ssn|social_security|credit_card|card_number|cvv)" | grep -v "encrypt\|hash\|redact" > /dev/null 2>&1; then
    warnings+=("⚠️  WARNING: PII handling detected - ensure encryption at rest")
fi

# Check 7: Direct database credentials
if echo "$content" | grep -E "postgresql://.*:[^@]+@|mysql://.*:[^@]+@|mongodb://.*:[^@]+@" > /dev/null 2>&1; then
    critical_issues+=("🚨 CRITICAL: Database credentials in code!")
    critical_issues+=("   Use environment variables (DATABASE_URL from .env)")
fi

# Check 8: Unsafe eval usage
if echo "$content" | grep -E "eval\(|Function\(.*\)|new Function" > /dev/null 2>&1; then
    critical_issues+=("🚨 CRITICAL: eval() or Function() constructor detected!")
    critical_issues+=("   This is a severe security risk - find alternative approach")
fi

# Check 9: Insecure random for tokens/IDs
if echo "$content" | grep -E "Math\.random\(\)" | grep -Ei "(token|id|key|secret|session)" > /dev/null 2>&1; then
    warnings+=("⚠️  WARNING: Math.random() is not cryptographically secure")
    warnings+=("   Use crypto.randomBytes() or crypto.randomUUID()")
fi

# Check 10: CORS misconfiguration
if echo "$content" | grep -E "Access-Control-Allow-Origin.*\*|cors.*origin.*true" > /dev/null 2>&1; then
    warnings+=("⚠️  WARNING: Permissive CORS configuration detected")
    warnings+=("   Specify allowed origins explicitly")
fi

# Check 11: Missing authentication/authorization
if echo "$content" | grep -Ei "(DELETE|UPDATE).*(/api/|export.*async)" | grep -v "auth\|session\|user\|permission" > /dev/null 2>&1; then
    warnings+=("💡 INFO: Mutation endpoint detected - verify authentication required")
fi

# Check 12: Sensitive data in logs
if echo "$content" | grep -E "console\.log.*password|console\.log.*token|console\.log.*secret" > /dev/null 2>&1; then
    warnings+=("⚠️  WARNING: Logging sensitive data")
    warnings+=("   Remove or redact sensitive information from logs")
fi

# Check 13: XSS via dangerouslySetInnerHTML
if echo "$content" | grep "dangerouslySetInnerHTML" | grep -v "DOMPurify\|sanitize" > /dev/null 2>&1; then
    warnings+=("⚠️  WARNING: dangerouslySetInnerHTML without sanitization")
    warnings+=("   Use DOMPurify or similar to prevent XSS")
fi

# Display results
total_issues=$((${#critical_issues[@]} + ${#warnings[@]}))

if [ $total_issues -eq 0 ]; then
    echo "✅ Security validation passed - no issues detected"
else
    if [ ${#critical_issues[@]} -gt 0 ]; then
        echo "CRITICAL ISSUES (must fix):"
        echo ""
        for issue in "${critical_issues[@]}"; do
            echo "$issue"
        done
        echo ""
    fi

    if [ ${#warnings[@]} -gt 0 ]; then
        echo "Warnings:"
        echo ""
        for warning in "${warnings[@]}"; do
            echo "$warning"
        done
        echo ""
    fi

    echo "📋 Security Checklist:"
    echo "   • No secrets in code (use .env)"
    echo "   • All inputs validated/sanitized"
    echo "   • Authentication on all protected routes"
    echo "   • Sensitive data encrypted at rest"
    echo "   • Audit logs for sensitive operations"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Block commit if critical issues found
if [ ${#critical_issues[@]} -gt 0 ]; then
    exit 1
fi

exit 0
