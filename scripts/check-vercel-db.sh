#!/bin/bash
# Check if DATABASE_URL is set on Vercel

echo "🔍 Checking Vercel Environment Variables..."
echo ""

if vercel env ls production 2>&1 | grep -q "DATABASE_URL"; then
  echo "✅ DATABASE_URL is set on Vercel"
else
  echo "❌ DATABASE_URL is NOT set on Vercel"
  echo ""
  echo "👉 Run this command to add it:"
  echo "   vercel env add DATABASE_URL production"
fi

echo ""
echo "📊 All production env vars:"
vercel env ls production 2>&1 | grep -E "^[A-Z_]+" || echo "None found"
