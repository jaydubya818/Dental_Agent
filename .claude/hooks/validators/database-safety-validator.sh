#!/bin/bash
set -e

# Database Safety Validator
# Prevents accidental production database operations and validates migrations

tool_info=$(cat)
tool_name=$(echo "$tool_info" | jq -r '.tool_name // empty')
file_path=$(echo "$tool_info" | jq -r '.tool_input.file_path // empty')

# Skip if not an edit tool
if [[ ! "$tool_name" =~ ^(Edit|MultiEdit|Write)$ ]] || [[ -z "$file_path" ]]; then
    exit 0
fi

# Only check database-related files
if [[ ! "$file_path" =~ (prisma|migration|schema|database|db) ]]; then
    exit 0
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🗄️  DATABASE SAFETY VALIDATOR"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "File: $file_path"
echo ""

content=$(cat "$file_path")
critical_issues=()
warnings=()

# Check 1: Production database URL in code
if echo "$content" | grep -E "neon\.tech|amazonaws\.com|planetscale\.com" | grep -v "example\|test\|staging" > /dev/null 2>&1; then
    critical_issues+=("🚨 CRITICAL: Production database URL detected in code!")
    critical_issues+=("   This must be in environment variables only")
fi

# Check 2: Dangerous Prisma operations
if echo "$content" | grep -E "prisma.*deleteMany\(\)|prisma.*updateMany\(\)" | grep -v "where" > /dev/null 2>&1; then
    warnings+=("⚠️  WARNING: Bulk delete/update without WHERE clause")
    warnings+=("   This can affect all records - ensure WHERE clause exists")
fi

# Check 3: DROP TABLE/DATABASE in migrations
if [[ "$file_path" =~ migration ]] && echo "$content" | grep -Ei "DROP (TABLE|DATABASE|SCHEMA)" > /dev/null 2>&1; then
    critical_issues+=("🚨 CRITICAL: DROP statement in migration!")
    critical_issues+=("   Verify this is intentional and backed up")
fi

# Check 4: Direct SQL execution with user input
if echo "$content" | grep -E "\\\$executeRaw|\\\$queryRaw" | grep -E "\\\$\{|String\(" > /dev/null 2>&1; then
    critical_issues+=("🚨 CRITICAL: Raw SQL with string interpolation!")
    critical_issues+=("   Use Prisma.sql tagged template or parameterized queries")
fi

# Check 5: Missing transaction for multi-step operations
if echo "$content" | grep -E "await.*prisma.*\.(create|update|delete)" | wc -l | awk '{if ($1 > 1) exit 0; else exit 1}'; then
    if ! echo "$content" | grep -E "prisma.\\\$transaction|prisma.\\\$executeRaw" > /dev/null 2>&1; then
        warnings+=("💡 INFO: Multiple database operations without transaction")
        warnings+=("   Consider wrapping in prisma.\$transaction for atomicity")
    fi
fi

# Check 6: Cascading deletes without confirmation
if [[ "$file_path" =~ schema\.prisma ]] && echo "$content" | grep -E "onDelete:\s*Cascade" > /dev/null 2>&1; then
    warnings+=("⚠️  WARNING: Cascade delete configured")
    warnings+=("   Ensure this won't accidentally delete critical data")
fi

# Check 7: Missing indexes on frequently queried fields
if [[ "$file_path" =~ schema\.prisma ]] && echo "$content" | grep -E "@unique|@@unique|@@index" > /dev/null 2>&1; then
    # Good - indexes exist
    :
else
    if [[ "$file_path" =~ schema\.prisma ]]; then
        warnings+=("💡 INFO: Consider adding indexes for query performance")
    fi
fi

# Check 8: Sensitive data without encryption
if [[ "$file_path" =~ schema\.prisma ]] && echo "$content" | grep -Ei "(ssn|social|credit|password|secret)" | grep -v "@encrypted\|@db\.Text\|String @default" > /dev/null 2>&1; then
    warnings+=("⚠️  WARNING: Sensitive field detected - ensure encryption")
fi

# Check 9: Missing createdAt/updatedAt for audit trail
if [[ "$file_path" =~ schema\.prisma ]] && echo "$content" | grep "model.*{" > /dev/null 2>&1; then
    if ! echo "$content" | grep -E "createdAt.*DateTime|updatedAt.*DateTime" > /dev/null 2>&1; then
        warnings+=("💡 INFO: Consider adding createdAt/updatedAt for audit trail")
    fi
fi

# Check 10: Production DATABASE_URL check
if echo "$content" | grep "DATABASE_URL" | grep -v "process\.env\|import.*env" > /dev/null 2>&1; then
    critical_issues+=("🚨 CRITICAL: DATABASE_URL not from environment!")
fi

# Display results
total_issues=$((${#critical_issues[@]} + ${#warnings[@]}))

if [ $total_issues -eq 0 ]; then
    echo "✅ Database safety validation passed"
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

    echo "🛡️  Database Safety Checklist:"
    echo "   • Use environment variables for DATABASE_URL"
    echo "   • Test migrations on staging first"
    echo "   • Use transactions for multi-step operations"
    echo "   • Always include WHERE clause in bulk operations"
    echo "   • Back up before destructive operations"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Block if critical issues found
if [ ${#critical_issues[@]} -gt 0 ]; then
    exit 1
fi

exit 0
