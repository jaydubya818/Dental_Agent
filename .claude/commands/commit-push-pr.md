# /sellerfi:commit-push-pr

---
title: "Automated Git Workflow"
description: "Automate the complete git workflow from commit to pull request creation with financial context validation"
category: "development-workflow"
priority: "high"
keywords: ["git", "commit", "pr", "workflow", "automation"]
allowed_tools: ["Bash", "Read", "Edit", "Grep"]
permissions: ["git-operations", "financial-validation", "security-scanning"]
---

**Usage**: `/sellerfi:commit-push-pr [commit message] [PR title]`

## What it does

1. **Smart Staging**: Automatically stages relevant files with financial calculation validation
2. **Contextual Commits**: Creates commits with financial domain context
3. **Branch Management**: Creates feature branches following fintech naming conventions
4. **PR Creation**: Opens pull request with financial validation checklist
5. **Security Scan**: Runs pre-commit security validation for financial data

## Parameters

- `commit_message` (required): Descriptive commit message
- `pr_title` (optional): Pull request title (defaults to commit message)
- `--skip-tests` (optional): Skip automated test execution
- `--draft` (optional): Create draft PR

## Examples

```bash
# Basic usage
/sellerfi:commit-push-pr "Fix seller financing calculation accuracy"

# With custom PR title
/sellerfi:commit-push-pr "Update payment validation" "Enhanced Payment Processing Security"

# Create draft PR
/sellerfi:commit-push-pr "WIP: New deal workflow" --draft
```

## Security Features

- **Financial Data Scan**: Checks for exposed financial calculations or sensitive data
- **Regulatory Compliance**: Validates against fintech security requirements
- **Audit Trail**: Creates detailed audit logs for compliance tracking
- **Secret Detection**: Scans for API keys, database credentials, or financial tokens

## Integration

- Integrates with existing SellerFi security validators
- Uses financial calculation validation hooks
- Connects with audit trail generation system
- Leverages existing git workflow automation

## Required Permissions

- `git`: Read, write repository access
- `security-scan`: Execute security validation scripts
- `audit-trail`: Generate compliance documentation
- `financial-validation`: Run calculation accuracy checks

## Validation Checklist

✅ Financial calculations are mathematically accurate
✅ No sensitive financial data exposed
✅ Regulatory compliance maintained
✅ Security scan passes
✅ Tests pass (unless skipped)
✅ Code follows fintech security patterns

## Expected Output

```
🔒 Security scan: PASSED
📊 Financial validation: PASSED
✅ Commit created: feat/fix-seller-financing-calculation
🚀 PR created: #123 "Fix seller financing calculation accuracy"
📋 Audit trail updated
```

## Error Handling

- **Security Failure**: Blocks commit if security scan fails
- **Financial Validation Error**: Prevents commit with calculation errors
- **Test Failures**: Optionally blocks based on configuration
- **Compliance Issues**: Requires manual review for regulatory concerns

## Related Commands

- `/sellerfi:security-scan` - Run security validation only
- `/sellerfi:validate-finances` - Validate financial calculations
- `/sellerfi:audit-trail` - Generate compliance documentation