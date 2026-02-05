#!/bin/bash

# SellerFi Command Activation Hook
# Detects and activates slash commands in user prompts

set -euo pipefail

# Configuration
COMMANDS_DIR="$CLAUDE_PROJECT_DIR/.claude/commands"
COMMANDS_CONFIG="$COMMANDS_DIR/config.json"
LOG_FILE="$CLAUDE_PROJECT_DIR/.claude/hooks/command-activation.log"

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# Function to extract command from prompt
extract_command() {
    local prompt="$1"
    echo "$prompt" | grep -o '/sellerfi:[a-zA-Z0-9-]*' | head -1 | sed 's|/sellerfi:||' || echo ""
}

# Function to validate command exists
validate_command() {
    local command="$1"
    if [[ -f "$COMMANDS_DIR/$command.md" ]]; then
        return 0
    else
        return 1
    fi
}

# Function to activate command context
activate_command() {
    local command="$1"
    local command_file="$COMMANDS_DIR/$command.md"

    # Extract command metadata
    local category=$(grep -m1 '^category:' "$command_file" | sed 's/category: //')
    local description=$(grep -m1 '^description:' "$command_file" | sed 's/description: //')

    log_message "Activating command: $command (category: $category)"

    # Set command context environment variables
    export SELLERFI_ACTIVE_COMMAND="$command"
    export SELLERFI_COMMAND_CATEGORY="$category"
    export SELLERFI_COMMAND_DESCRIPTION="$description"

    # Run command-specific pre-hooks if they exist
    if [[ -f "$COMMANDS_DIR/hooks/pre-$command.sh" ]]; then
        log_message "Running pre-hook for command: $command"
        bash "$COMMANDS_DIR/hooks/pre-$command.sh"
    fi

    # Output command activation notice
    cat << EOF
🎯 **SellerFi Command Activated: \`/$command\`**

**Category:** $category
**Mode:** $description

*Command context is now active. All responses will be optimized for this workflow.*

---

EOF
}

# Main execution
main() {
    # Read user prompt from stdin if available
    if [[ -p /dev/stdin ]]; then
        user_prompt=$(cat)
    else
        # Try to read from environment variable or arguments
        user_prompt="${CLAUDE_USER_PROMPT:-$*}"
    fi

    # Skip if no prompt provided
    if [[ -z "$user_prompt" ]]; then
        exit 0
    fi

    log_message "Processing prompt for command detection"

    # Extract command from prompt
    command=$(extract_command "$user_prompt")

    # If command found, validate and activate
    if [[ -n "$command" ]]; then
        if validate_command "$command"; then
            activate_command "$command"
        else
            log_message "Invalid command: $command"
            echo "⚠️ **Unknown SellerFi command:** \`/sellerfi:$command\`"
            echo ""
            echo "Available commands:"
            echo ""
            # List available commands
            for cmd_file in "$COMMANDS_DIR"/*.md; do
                if [[ -f "$cmd_file" && "$(basename "$cmd_file")" != "README.md" ]]; then
                    cmd_name=$(basename "$cmd_file" .md)
                    cmd_desc=$(grep -m1 '^description:' "$cmd_file" | sed 's/description: //' || echo "")
                    echo "• \`/sellerfi:$cmd_name\` - $cmd_desc"
                fi
            done
            echo ""
        fi
    fi
}

# Create log file if it doesn't exist
mkdir -p "$(dirname "$LOG_FILE")"
touch "$LOG_FILE"

# Run main function
main "$@"