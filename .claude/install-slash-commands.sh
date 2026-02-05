#!/bin/bash

# SellerFi Slash Commands Installation Script
# Sets up the slash command system for the SellerFi platform

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMMANDS_DIR="$SCRIPT_DIR/commands"
HOOKS_DIR="$SCRIPT_DIR/hooks"

# Function to print colored output
print_status() {
    local color="$1"
    local message="$2"
    echo -e "${color}[$(date '+%H:%M:%S')] $message${NC}"
}

print_header() {
    echo ""
    echo -e "${BLUE}╔══════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║           SellerFi Slash Commands Installer          ║${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Function to validate prerequisites
check_prerequisites() {
    print_status "$YELLOW" "Checking prerequisites..."

    # Check if we're in a Claude Code project
    if [[ ! -f "$SCRIPT_DIR/config.json" ]]; then
        print_status "$RED" "ERROR: Not in a Claude Code project directory"
        exit 1
    fi

    # Check if commands directory exists
    if [[ ! -d "$COMMANDS_DIR" ]]; then
        print_status "$RED" "ERROR: Commands directory not found"
        exit 1
    fi

    print_status "$GREEN" "Prerequisites check passed ✓"
}

# Function to validate command files
validate_commands() {
    print_status "$YELLOW" "Validating command files..."

    local command_count=0
    local valid_count=0

    for command_file in "$COMMANDS_DIR"/*.md; do
        if [[ -f "$command_file" && "$(basename "$command_file")" != "README.md" ]]; then
            command_count=$((command_count + 1))

            # Check if file has required metadata
            if grep -q '^title:' "$command_file" && grep -q '^description:' "$command_file"; then
                valid_count=$((valid_count + 1))
                print_status "$GREEN" "  ✓ $(basename "$command_file" .md)"
            else
                print_status "$RED" "  ✗ $(basename "$command_file" .md) - Missing metadata"
            fi
        fi
    done

    print_status "$BLUE" "Found $valid_count valid commands out of $command_count total"

    if [[ $valid_count -eq 0 ]]; then
        print_status "$RED" "ERROR: No valid command files found"
        exit 1
    fi
}

# Function to set permissions
set_permissions() {
    print_status "$YELLOW" "Setting script permissions..."

    # Make command activation hook executable
    if [[ -f "$HOOKS_DIR/command-activation.sh" ]]; then
        chmod +x "$HOOKS_DIR/command-activation.sh"
        print_status "$GREEN" "  ✓ command-activation.sh"
    fi

    # Make any other executable scripts in hooks directory
    for script in "$HOOKS_DIR"/*.sh; do
        if [[ -f "$script" ]]; then
            chmod +x "$script"
        fi
    done
}

# Function to create command list
create_command_list() {
    print_status "$YELLOW" "Creating command reference..."

    local reference_file="$COMMANDS_DIR/COMMAND_REFERENCE.md"

    cat > "$reference_file" << 'EOF'
# SellerFi Slash Commands Reference

Quick reference for all available SellerFi slash commands.

## Financial Workflow Commands

### `/sellerfi:validate-finances`
**Purpose:** Validates financial calculations, term sheets, and seller financing structures
**Use Case:** Before finalizing any deal or financial modeling
**Example:** `Check the DCF calculation accuracy in this valuation`

### `/sellerfi:verify-compliance`
**Purpose:** Comprehensive regulatory compliance verification
**Use Case:** Before launching new features or entering new markets
**Example:** `Ensure our seller financing terms comply with federal regulations`

### `/sellerfi:term-sheet-check`
**Purpose:** Validate seller financing term sheets
**Use Case:** During deal structuring and negotiation
**Example:** `Review this term sheet for accuracy and market standards`

### `/sellerfi:audit-trail`
**Purpose:** Generate audit documentation and trails
**Use Case:** For compliance reporting and documentation
**Example:** `Create audit trail for this month's transactions`

## Development Workflow Commands

### `/sellerfi:quick-commit`
**Purpose:** Smart git commit with financial platform context
**Use Case:** When committing financial-related code changes
**Example:** `Commit the updated payment processing logic`

### `/sellerfi:test-payments`
**Purpose:** Payment integration and financial workflow testing
**Use Case:** Before deploying payment-related features
**Example:** `Run comprehensive payment testing for the new financing module`

### `/sellerfi:security-scan`
**Purpose:** Security scanning with fintech focus
**Use Case:** Regular security audits and before production deployments
**Example:** `Scan for financial data security vulnerabilities`

### `/sellerfi:validate-build`
**Purpose:** Build validation with financial checks
**Use Case:** As part of CI/CD pipeline for financial platform
**Example:** `Validate build includes all financial compliance checks`

## Marketplace Operations Commands

### `/sellerfi:validate-listing`
**Purpose:** Comprehensive business listing validation
**Use Case:** Quality control for new listings on the marketplace
**Example:** `Validate this SaaS business listing for completeness and accuracy`

### `/sellerfi:deal-flow`
**Purpose:** Deal flow management and analysis
**Use Case:** Pipeline management and deal tracking
**Example:** `Analyze current deal pipeline and identify bottlenecks`

### `/sellerfi:user-verification`
**Purpose:** User verification workflows
**Use Case:** KYC/AML compliance and user onboarding
**Example:** `Verify this high-value buyer's accreditation status`

### `/sellerfi:analytics-check`
**Purpose:** Validate analytics and metrics
**Use Case:** Data quality assurance and reporting
**Example:** `Validate marketplace performance metrics accuracy`

## Output Style Commands

### `/sellerfi:financial-analyst`
**Purpose:** Financial analyst output mode with expert analysis
**Use Case:** When you need professional financial analysis perspective
**Example:** `Analyze this deal from an investment banking perspective`

### `/sellerfi:deal-maker`
**Purpose:** Deal structuring expert persona
**Use Case:** For creative deal structuring and negotiation strategy
**Example:** `Structure an optimal seller financing deal for this business`

### `/sellerfi:compliance-officer`
**Purpose:** Compliance-focused output
**Use Case:** When regulatory compliance is the primary concern
**Example:** `Review these processes from a compliance perspective`

### `/sellerfi:developer`
**Purpose:** Technical development mode
**Use Case:** For technical implementation and architecture discussions
**Example:** `Design the API architecture for automated valuation`

## Usage Tips

1. **Combine Commands:** You can chain commands for comprehensive analysis
2. **Context Matters:** Commands work better with specific context about your task
3. **Validation First:** Always run validation commands before production changes
4. **Document Everything:** Use audit-trail command for important decisions

## Getting Started

1. Try `/sellerfi:financial-analyst` to see how output style commands work
2. Use `/sellerfi:validate-finances` to check any financial calculations
3. Run `/sellerfi:security-scan` before deploying new features
4. Use `/sellerfi:quick-commit` for smart git workflow automation

For detailed documentation on each command, see the individual `.md` files in this directory.
EOF

    print_status "$GREEN" "  ✓ Created command reference"
}

# Function to test installation
test_installation() {
    print_status "$YELLOW" "Testing installation..."

    # Test command discovery
    local test_commands=("validate-finances" "quick-commit" "financial-analyst")
    local test_count=0

    for cmd in "${test_commands[@]}"; do
        if [[ -f "$COMMANDS_DIR/$cmd.md" ]]; then
            test_count=$((test_count + 1))
            print_status "$GREEN" "  ✓ $cmd command available"
        else
            print_status "$RED" "  ✗ $cmd command missing"
        fi
    done

    # Test hook integration
    if [[ -f "$HOOKS_DIR/command-activation.sh" && -x "$HOOKS_DIR/command-activation.sh" ]]; then
        print_status "$GREEN" "  ✓ Command activation hook ready"
    else
        print_status "$RED" "  ✗ Command activation hook not executable"
    fi

    print_status "$BLUE" "Installation test: $test_count/3 core commands ready"
}

# Function to show completion message
show_completion() {
    echo ""
    echo -e "${GREEN}╔══════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║              Installation Complete! ✓                ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}SellerFi Slash Commands are now ready to use!${NC}"
    echo ""
    echo "Try these commands to get started:"
    echo ""
    echo -e "${YELLOW}  /sellerfi:financial-analyst${NC}"
    echo "    Switch to financial expert analysis mode"
    echo ""
    echo -e "${YELLOW}  /sellerfi:validate-finances${NC}"
    echo "    Validate financial calculations and terms"
    echo ""
    echo -e "${YELLOW}  /sellerfi:quick-commit${NC}"
    echo "    Smart git commit with financial context"
    echo ""
    echo "📖 See .claude/commands/COMMAND_REFERENCE.md for full documentation"
    echo ""
}

# Main installation function
main() {
    print_header

    check_prerequisites
    validate_commands
    set_permissions
    create_command_list
    test_installation

    show_completion
}

# Run installation
main "$@"