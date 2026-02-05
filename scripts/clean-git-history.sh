#!/bin/bash
# Script to clean sensitive data from git history
# ⚠️ WARNING: This rewrites git history and requires force-push
# ⚠️ Coordinate with your team before running this!

set -e

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${RED}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ⚠️  GIT HISTORY CLEANING SCRIPT ⚠️"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}"
echo ""
echo "This script will:"
echo "  • Rewrite git history to remove sensitive data"
echo "  • Require a force-push to remote"
echo "  • Potentially break other developers' local repos"
echo ""
echo -e "${YELLOW}BEFORE PROCEEDING:${NC}"
echo "  1. Notify your team (this affects everyone)"
echo "  2. Ensure all team members have pushed their work"
echo "  3. Create a backup of your repository"
echo "  4. Rotate the exposed credentials FIRST"
echo ""
echo -e "${RED}This operation CANNOT be undone!${NC}"
echo ""

# Prompt for confirmation
read -p "Have you completed all prerequisites? (type 'yes' to continue): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo "Aborting. Please complete prerequisites first."
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Step 1: Create Backup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

BACKUP_DIR="../seller-financing-platform-backup-$(date +%Y%m%d-%H%M%S)"
echo "Creating backup at: $BACKUP_DIR"
cp -r . "$BACKUP_DIR"
echo -e "${GREEN}✅ Backup created${NC}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Step 2: Install BFG Repo-Cleaner"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if ! command -v java &> /dev/null; then
  echo -e "${RED}❌ Java is not installed${NC}"
  echo "Please install Java first:"
  echo "  brew install openjdk"
  exit 1
fi

BFG_JAR="$HOME/.bfg/bfg.jar"
BFG_URL="https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar"

if [ ! -f "$BFG_JAR" ]; then
  echo "Downloading BFG Repo-Cleaner..."
  mkdir -p "$HOME/.bfg"
  curl -L "$BFG_URL" -o "$BFG_JAR"
  echo -e "${GREEN}✅ BFG downloaded${NC}"
else
  echo -e "${GREEN}✅ BFG already installed${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Step 3: Create Replacement File"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Create a file with strings to replace
cat > /tmp/passwords.txt << 'EOF'
Alan818west
jaydubya818a@yahoo.com
EOF

echo "Created replacement file with exposed credentials"
echo -e "${GREEN}✅ Replacement file ready${NC}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Step 4: Clean Git History"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Running BFG to replace sensitive strings..."
java -jar "$BFG_JAR" --replace-text /tmp/passwords.txt .

echo ""
echo "Running git reflog expire..."
git reflog expire --expire=now --all

echo ""
echo "Running git gc..."
git gc --prune=now --aggressive

echo -e "${GREEN}✅ Git history cleaned${NC}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Step 5: Verify Changes"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Searching for exposed credentials in history..."
if git log --all --source --full-history -S "Alan818west" | grep -q "Alan818west"; then
  echo -e "${RED}⚠️  Credentials still found in history!${NC}"
  echo "Manual review required."
else
  echo -e "${GREEN}✅ No exposed credentials found in history${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Step 6: Force Push (FINAL STEP)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo -e "${YELLOW}You must now force-push to all remotes:${NC}"
echo ""
echo "  git push origin --force --all"
echo "  git push origin --force --tags"
echo ""
echo -e "${RED}⚠️  This will rewrite history on the remote!${NC}"
echo ""
echo "After force-pushing, notify your team to:"
echo "  1. Backup their local changes"
echo "  2. Delete their local repo"
echo "  3. Re-clone from remote"
echo ""
echo -e "${GREEN}Backup location: $BACKUP_DIR${NC}"
echo ""

read -p "Push to remote now? (type 'yes' to continue): " PUSH_CONFIRM

if [ "$PUSH_CONFIRM" = "yes" ]; then
  echo ""
  echo "Force pushing to origin..."
  git push origin --force --all
  git push origin --force --tags
  echo -e "${GREEN}✅ Force push complete${NC}"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  ✅ Git History Cleaning Complete"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "Next steps:"
  echo "  1. Notify team to re-clone the repository"
  echo "  2. Verify credentials are rotated"
  echo "  3. Monitor for unauthorized access"
  echo "  4. Update incident report"
else
  echo ""
  echo "Skipping force push. You can push manually later with:"
  echo "  git push origin --force --all"
  echo "  git push origin --force --tags"
fi

# Cleanup
rm /tmp/passwords.txt

echo ""
echo -e "${GREEN}Script complete!${NC}"
