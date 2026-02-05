#!/bin/bash
# 🧹 Clean Up Unnecessary TODO Comments
# Removes TODO comments from files that don't actually need transactions

echo "🧹 Cleaning up unnecessary TODO comments..."
echo ""

# Count before
before=$(grep -r "TODO.*DATABASE FIX" app/api/ 2>/dev/null | wc -l | tr -d ' ')
echo "TODOs before cleanup: $before"

# Remove TODOs from read-only files (files that only do SELECT operations)
read_only_files=(
    "app/api/dealrooms/[id]/qa/route.ts"
    "app/api/dealrooms/[id]/messages/stream/route.ts"
    "app/api/kb/analytics/route.ts"
    "app/api/test/dealroom/route.ts"
    "app/api/test/dealroom/[id]/route.ts"
)

# Remove TODOs from single-operation files (only one CREATE/UPDATE)
single_operation_files=(
    "app/api/auth/signup/route.ts"
    "app/api/auth/reset-password/route.ts"
    "app/api/listings/[id]/auto-renew/route.ts"
    "app/api/listings/[id]/matched-buyers/route.ts"
    "app/api/listings/[id]/route.ts"
    "app/api/listings/[id]/valuation/route.ts"
    "app/api/admin/audit-logs/route.ts"
    "app/api/admin/dealrooms/route.ts"
)

# Function to remove TODO comment from file
remove_todo() {
    local file="$1"
    if [[ -f "$file" ]]; then
        # Remove the TODO line
        sed -i.bak2 '/^\/\/ TODO: DATABASE FIX - Consider wrapping multiple operations in prisma\.\$transaction$/d' "$file"
        echo "   ✅ Cleaned: $file"
    fi
}

echo ""
echo "Removing TODOs from read-only files:"
for file in "${read_only_files[@]}"; do
    remove_todo "$file"
done

echo ""
echo "Removing TODOs from single-operation files:"
for file in "${single_operation_files[@]}"; do
    remove_todo "$file"
done

# Count after
after=$(grep -r "TODO.*DATABASE FIX" app/api/ 2>/dev/null | wc -l | tr -d ' ')
cleaned=$((before - after))

echo ""
echo "📊 CLEANUP RESULTS:"
echo "   TODOs before: $before"
echo "   TODOs after: $after"
echo "   TODOs removed: $cleaned"
echo ""

if [[ $after -gt 0 ]]; then
    echo "🎯 Remaining TODOs (worth reviewing):"
    grep -r "TODO.*DATABASE FIX" app/api/ 2>/dev/null | head -5
else
    echo "✅ All unnecessary TODOs cleaned up!"
fi

echo ""
echo "🧹 Cleanup complete! Your code is now optimally organized."