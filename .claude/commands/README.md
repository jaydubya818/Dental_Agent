# SellerFi Slash Commands

This directory contains slash command definitions for the SellerFi platform. Each command is defined as a markdown file with metadata headers.

## Command Categories

### Financial Workflow Commands
- `/sellerfi:validate-finances` - Validate financial calculations and terms
- `/sellerfi:verify-compliance` - Check regulatory compliance
- `/sellerfi:audit-trail` - Generate audit documentation
- `/sellerfi:term-sheet-check` - Validate seller financing terms

### Development Workflow Commands
- `/sellerfi:quick-commit` - Smart commit with financial context
- `/sellerfi:test-payments` - Run payment integration tests
- `/sellerfi:validate-build` - Build validation with financial checks
- `/sellerfi:security-scan` - Security scan with fintech focus

### Marketplace Operations
- `/sellerfi:validate-listing` - Comprehensive listing validation
- `/sellerfi:deal-flow` - Deal flow management assistance
- `/sellerfi:user-verification` - User verification workflows
- `/sellerfi:analytics-check` - Validate analytics and metrics

### Output Style Commands
- `/sellerfi:financial-analyst` - Financial analysis mode
- `/sellerfi:compliance-officer` - Compliance-focused output
- `/sellerfi:deal-maker` - Deal structuring mode
- `/sellerfi:developer` - Technical development mode

## Usage

Use any command by typing the command name in your prompt:

```
/sellerfi:validate-finances
Check the term sheet calculations in the current dealroom
```

## Command Structure

Each command file contains:
- Metadata header with command configuration
- Description and usage instructions
- Allowed tools and permissions
- Example use cases