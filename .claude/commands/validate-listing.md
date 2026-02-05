# /sellerfi:validate-listing

---
title: Listing Validation Command
description: Comprehensive validation of business listings for marketplace quality
category: marketplace-operations
allowed_tools: [Read, Grep, Bash, WebFetch, mcp__ide__getDiagnostics]
permissions: [database-queries, file-analysis, external-validation]
---

## Purpose

Provides comprehensive validation of business listings to ensure marketplace quality and compliance:

- Financial information completeness and accuracy
- Legal and regulatory compliance checking
- Document quality and authenticity verification
- Market positioning and competitive analysis

## Usage

```
/sellerfi:validate-listing [listing-id]
```

## What It Does

1. **Financial Data Validation**
   - Verifies financial statements consistency
   - Checks revenue and expense categorization
   - Validates EBITDA and cash flow calculations
   - Confirms debt obligations and liabilities accuracy

2. **Document Quality Check**
   - Scans uploaded financial documents for completeness
   - Validates document formats and readability
   - Checks for required signatures and dates
   - Verifies file integrity and security

3. **Compliance Verification**
   - Ensures required disclosures are present
   - Validates seller financing terms comply with regulations
   - Checks for necessary business licenses and permits
   - Verifies tax compliance documentation

4. **Market Analysis**
   - Compares valuation against market benchmarks
   - Validates industry classification and metrics
   - Checks competitive positioning claims
   - Analyzes pricing strategy reasonableness

5. **Technical Validation**
   - Verifies listing data integrity in database
   - Checks image and document uploads
   - Validates form completion and required fields
   - Tests listing display across different devices

## Output

Generates comprehensive listing quality report:

- **Quality Score** (0-100) with detailed breakdown
- **Compliance Status** with specific requirement checks
- **Financial Health** indicators and red flags
- **Market Competitiveness** analysis
- **Improvement Recommendations** with prioritized action items

## Quality Metrics

- ✅ **Excellent (90-100)**: Ready for premium placement
- ✅ **Good (80-89)**: Minor improvements needed
- ⚠️ **Fair (70-79)**: Moderate issues requiring attention
- ❌ **Poor (60-69)**: Significant problems, may need delisting
- ❌ **Unacceptable (<60)**: Critical issues, immediate action required

## Related Commands

- `/sellerfi:verify-compliance` - Dedicated compliance checking
- `/sellerfi:validate-finances` - Financial calculations focus
- `/sellerfi:deal-flow` - Deal progression analysis
- `/sellerfi:analytics-check` - Performance metrics validation