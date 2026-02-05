# /sellerfi:validate-finances

---
title: Financial Validation Command
description: Validates financial calculations, term sheets, and seller financing structures
category: financial-workflow
allowed_tools: [Read, Grep, Bash, mcp__ide__getDiagnostics]
permissions: [financial-calculations, database-queries, validation-scripts]
---

## Purpose

This command provides comprehensive validation of financial calculations across the SellerFi platform, including:

- Seller financing term calculations
- Valuation models and DCF analysis
- Term sheet accuracy and completeness
- Payment schedule validation
- Interest rate and amortization checks

## Usage

```
/sellerfi:validate-finances
```

## What It Does

1. **Financial Model Validation**
   - Scans for financial calculation files in `/lib/financial/`
   - Validates term sheet calculation logic
   - Checks DCF and valuation model accuracy

2. **Database Integrity**
   - Verifies financial data consistency in Prisma models
   - Validates foreign key relationships for financial records
   - Checks for orphaned financial data

3. **Compliance Checks**
   - Ensures calculations meet regulatory requirements
   - Validates interest rate caps and minimums
   - Checks payment schedule compliance

4. **Error Detection**
   - Identifies floating point precision issues
   - Detects negative values where inappropriate
   - Flags missing required financial fields

## Output

Provides a detailed financial validation report including:
- ✅ Passed validations
- ❌ Failed validations with specific errors
- ⚠️ Warnings for potential issues
- 📊 Financial calculation accuracy metrics

## Related Commands

- `/sellerfi:verify-compliance` - Regulatory compliance checking
- `/sellerfi:term-sheet-check` - Specific term sheet validation
- `/sellerfi:audit-trail` - Generate financial audit documentation