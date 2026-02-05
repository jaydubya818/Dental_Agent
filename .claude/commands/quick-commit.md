# /sellerfi:quick-commit

---
title: Smart Financial Platform Commit
description: Intelligent commit with financial platform context and validation
category: development-workflow
allowed_tools: [Bash, Read, Grep, mcp__ide__getDiagnostics]
permissions: [git-operations, file-analysis, validation-scripts]
---

## Purpose

Performs intelligent git commits specifically designed for financial marketplace platforms, with:

- Smart commit message generation based on financial domain changes
- Pre-commit financial calculation validation
- Automatic inclusion of related financial files
- Compliance and security checks before commit

## Usage

```
/sellerfi:quick-commit
```

## What It Does

1. **Change Analysis**
   - Analyzes modified files for financial impact
   - Identifies changes to payment processing, calculations, or compliance
   - Groups related changes by financial domain (listings, dealrooms, payments)

2. **Validation Pipeline**
   - Runs financial calculation validators
   - Executes security checks on sensitive financial data
   - Validates database migration safety for financial models
   - Checks TypeScript compilation for financial modules

3. **Smart Commit Messages**
   - Generates contextual commit messages like:
     - "feat(payments): enhance Stripe integration with SCA compliance"
     - "fix(calculations): correct term sheet NPV calculation precision"
     - "refactor(dealrooms): optimize financial document handling"

4. **Pre-commit Hooks**
   - Runs `.claude/hooks/validators/financial-calculation-validator.sh`
   - Executes security validator for PII and financial data
   - Performs database safety checks

5. **Auto-staging**
   - Intelligently stages related files (e.g., if API route changes, includes types)
   - Includes test files for modified financial modules
   - Stages documentation updates for API changes

## Output

Provides commit summary with:
- 📝 Generated commit message with rationale
- ✅ Validation results for all pre-commit checks
- 📁 List of staged files with categorization
- ⚠️ Any warnings or issues detected

## Configuration

Uses existing SellerFi hooks:
- `financial-calculation-validator.sh`
- `security-validator.sh`
- `database-safety-validator.sh`
- `post-tool-use-tracker.sh`

## Related Commands

- `/sellerfi:validate-build` - Full build validation
- `/sellerfi:security-scan` - Dedicated security scanning
- `/sellerfi:audit-trail` - Generate change documentation