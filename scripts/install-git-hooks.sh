#!/bin/bash
# Install git hooks for security scanning

set -e

HOOK_DIR=".git/hooks"
HOOK_FILE="$HOOK_DIR/pre-commit"

echo "Installing pre-commit hook for secret detection..."

# Create hooks directory if it doesn't exist
mkdir -p "$HOOK_DIR"

# Create pre-commit hook
cat > "$HOOK_FILE" << 'EOF'
#!/bin/bash
# Pre-commit hook to detect potential secrets

RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Scanning for potential secrets..."

# Check for common secret patterns in staged files
SECRETS_FOUND=0

# Pattern 1: Hardcoded passwords in code
if git diff --cached --name-only | xargs grep -nE "(password|Password)\s*=\s*['\"][^'\"]{8,}['\"]" 2>/dev/null; then
  echo -e "${RED}❌ Potential hardcoded password detected!${NC}"
  SECRETS_FOUND=1
fi

# Pattern 2: API keys
if git diff --cached --name-only | xargs grep -nE "(api_key|apiKey|API_KEY)\s*=\s*['\"][^'\"]{20,}['\"]" 2>/dev/null; then
  echo -e "${RED}❌ Potential API key detected!${NC}"
  SECRETS_FOUND=1
fi

# Pattern 3: Email + password combinations in test files
if git diff --cached | grep -E "@(gmail|yahoo|outlook|hotmail)\.(com|net)" | grep -iE "(password|pwd)" 2>/dev/null; then
  echo -e "${YELLOW}⚠️  Email and password detected in same file${NC}"
  echo -e "${YELLOW}   Please verify these are test credentials, not production${NC}"
fi

# Pattern 4: AWS keys
if git diff --cached --name-only | xargs grep -nE "(AKIA[0-9A-Z]{16})" 2>/dev/null; then
  echo -e "${RED}❌ Potential AWS access key detected!${NC}"
  SECRETS_FOUND=1
fi

# Pattern 5: Private keys
if git diff --cached --name-only | xargs grep -nE "BEGIN (RSA|DSA|EC|OPENSSH) PRIVATE KEY" 2>/dev/null; then
  echo -e "${RED}❌ Private key detected!${NC}"
  SECRETS_FOUND=1
fi

# Pattern 6: Stripe keys
if git diff --cached --name-only | xargs grep -nE "(sk_live_|pk_live_|rk_live_)" 2>/dev/null; then
  echo -e "${RED}❌ Stripe production key detected!${NC}"
  SECRETS_FOUND=1
fi

if [ $SECRETS_FOUND -eq 1 ]; then
  echo -e "${RED}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  COMMIT BLOCKED: Potential secrets detected"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo -e "${NC}"
  echo "Please:"
  echo "  1. Remove hardcoded secrets from your code"
  echo "  2. Use environment variables instead"
  echo "  3. Add secrets to .env (which is in .gitignore)"
  echo ""
  echo "To bypass this check (NOT recommended):"
  echo "  git commit --no-verify"
  echo ""
  exit 1
fi

echo "✅ No secrets detected. Proceeding with commit."
exit 0
EOF

# Make the hook executable
chmod +x "$HOOK_FILE"

echo "✅ Pre-commit hook installed successfully!"
echo ""
echo "The hook will now scan for:"
echo "  • Hardcoded passwords"
echo "  • API keys"
echo "  • AWS credentials"
echo "  • Private keys"
echo "  • Stripe production keys"
echo ""
echo "To test it, try committing a file with a hardcoded password."
