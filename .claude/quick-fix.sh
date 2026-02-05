#!/bin/bash
# 🚀 Quick Fix Script - Fast validation and auto-repair
# Usage: ./.claude/quick-fix.sh [filename]

file_path="${1:-}"

if [[ -z "$file_path" ]]; then
    echo "Usage: $0 <file_path>"
    echo "Example: $0 app/api/payment/route.ts"
    exit 1
fi

if [[ ! -f "$file_path" ]]; then
    echo "❌ File not found: $file_path"
    exit 1
fi

echo "🔧 Quick-fixing $file_path..."

# Backup original
cp "$file_path" "$file_path.bak"

# Security fixes
sed -i 's/const\s\+\([A-Z_]*SECRET[A-Z_]*\)\s*=\s*["'"'"'].*["'"'"']/\/\/ TODO: Move to env - process.env.\1\n\/\/ \0/' "$file_path"

# Financial fixes
sed -i 's/return \([^;]*\(payment\|amount\|price\)[^;]*\);/return Math.round(\1 * 100) \/ 100;/' "$file_path"

# Database fixes
sed -i 's/DATABASE_URL\s*=\s*["'"'"'].*["'"'"']/DATABASE_URL = process.env.DATABASE_URL/' "$file_path"

# TypeScript check
if npx tsc --noEmit "$file_path" 2>/dev/null; then
    echo "✅ TypeScript validation passed"
else
    echo "🔷 TypeScript errors detected - run full auto-fix for details"
fi

echo "✅ Quick fixes applied to $file_path"
echo "📄 Original backed up as $file_path.bak"