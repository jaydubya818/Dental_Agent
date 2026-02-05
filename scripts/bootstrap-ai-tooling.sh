#!/bin/bash
#
# Bootstrap AI Tooling for SellerFi
# Initializes and updates git submodules for claude-mem and agent-skills
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo ""
echo "🤖 SellerFi AI Tooling Bootstrap"
echo "================================="
echo ""

# Change to project root
cd "$PROJECT_ROOT"

# Initialize and update submodules
echo "📦 Initializing git submodules..."
git submodule update --init --recursive

echo ""
echo "✅ Submodules initialized successfully!"
echo ""

# Check submodule status
echo "📋 Submodule Status:"
echo "-------------------"
git submodule status
echo ""

# Print next steps
echo "🚀 Next Steps:"
echo "=============="
echo ""
echo "1. READ THE DOCS:"
echo "   → docs/AI_TOOLING.md           - Full setup and usage guide"
echo "   → .cursor/rules/ai-tooling.mdc - Cursor workflows and prompts"
echo ""
echo "2. FOR CLAUDE CODE USERS (claude-mem):"
echo "   In a Claude Code session, run:"
echo "   > /plugin marketplace add thedotmack/claude-mem"
echo "   > /plugin install claude-mem"
echo "   Then restart Claude Code."
echo ""
echo "3. FOR CURSOR USERS:"
echo "   Skills are available at: vendor/agent-skills-for-context-engineering/skills/"
echo "   Cursor rules loaded from: .cursor/rules/ai-tooling.mdc"
echo ""
echo "4. QUICK COMMANDS:"
echo "   npm run ai:help      - Show this help"
echo "   npm run ai:bootstrap - Re-run this bootstrap"
echo ""
echo "📚 Vendor Locations:"
echo "   → vendor/claude-mem/"
echo "   → vendor/agent-skills-for-context-engineering/"
echo ""
echo "⚠️  IMPORTANT: claude-mem is AGPL-3.0 licensed."
echo "   Use as a dev tool only. Do NOT bundle in production."
echo ""
echo "Happy coding! 🎉"
echo ""

