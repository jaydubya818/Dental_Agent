# /sellerfi:term-sheet-check

---
title: Term Sheet Validation
description: Validate seller financing term sheets for accuracy and market standards
category: financial-workflow
allowed_tools: [Read, Grep, Bash, WebFetch, mcp__ide__getDiagnostics]
permissions: [financial-calculations, market-research, validation-scripts]
---

## Purpose

Provides comprehensive validation of seller financing term sheets to ensure accuracy, market competitiveness, and regulatory compliance:

- Mathematical accuracy of all financial calculations
- Market benchmarking against industry standards
- Legal and regulatory compliance verification
- Risk assessment and mitigation recommendations

## Usage

```
/sellerfi:term-sheet-check [term-sheet-file]
```

## What It Does

1. **Financial Calculation Validation**
   - Payment schedule accuracy and amortization
   - Interest rate calculations and compounding
   - Present value and NPV computations
   - Balloon payment and final payment verification

2. **Market Benchmarking**
   - Interest rates vs. current market conditions
   - Down payment percentages for industry/size
   - Term length appropriateness for asset type
   - Security requirements and collateral standards

3. **Compliance Verification**
   - Usury law compliance across jurisdictions
   - Truth in Lending Act (TILA) requirements
   - Dodd-Frank qualified mortgage standards
   - State-specific seller financing regulations

4. **Risk Assessment**
   - Buyer creditworthiness requirements
   - Security package adequacy
   - Default probability analysis
   - Recovery scenario modeling

5. **Documentation Review**
   - Required disclosures and disclaimers
   - Legal language accuracy and completeness
   - Signature and execution requirements
   - Third-party approval conditions

## Validation Checklist

### ✅ **Financial Accuracy**
```
□ Payment calculations match amortization schedule
□ Interest rate properly applied (simple vs. compound)
□ Total payments equal principal + interest
□ Balloon payment calculation accurate
□ Default interest rate specified
□ Late fees and penalties defined
```

### 📊 **Market Standards**
```
□ Down payment: 15-30% (industry standard)
□ Interest rate: Prime + 2-5% (typical range)
□ Term length: 3-7 years (common for business sales)
□ Personal guarantee: Required for transactions >$500K
□ Life insurance: 2-3x outstanding balance
□ Financial reporting: Monthly/quarterly requirements
```

### 🔒 **Security Package**
```
□ UCC filing on business assets
□ Real estate security interest (if applicable)
□ Personal guarantee with liability cap
□ Key man life insurance required
□ Escrow account for working capital
□ Cross-default provisions
```

### ⚖️ **Legal Compliance**
```
□ Usury laws: Interest rate below state maximum
□ TILA: APR disclosure accurate
□ Right of rescission: 3-day period (if applicable)
□ Equal Credit Opportunity Act compliance
□ Fair Credit Reporting Act adherence
□ State licensing requirements met
```

## Output

Generates detailed term sheet validation report:

```
TERM SHEET VALIDATION REPORT
=============================

Overall Score: 87/100 (Good)
Risk Rating: Medium-Low

FINANCIAL VALIDATION
===================
✅ Payment Schedule: Accurate
✅ Interest Calculations: Correct
✅ NPV Analysis: $X.XX million (seller perspective)
⚠️ Balloon Payment: Large (XX% of total) - Consider amortization

MARKET BENCHMARKING
==================
✅ Down Payment: XX% (within range: 15-30%)
✅ Interest Rate: X.X% (market range: X.X-X.X%)
⚠️ Term Length: X years (recommend X-X years for this asset)
✅ Security Package: Adequate for transaction size

COMPLIANCE STATUS
================
✅ Federal Regulations: Compliant
✅ State Usury Laws: Compliant
⚠️ TILA Disclosure: Minor formatting issue
✅ Equal Opportunity: Compliant

RISK ASSESSMENT
==============
□ Buyer Credit Score: XXX (requirement: >XXX)
□ Debt-to-Income: XX% (recommendation: <XX%)
□ Industry Risk: Medium (consider additional security)
□ Geographic Risk: Low
□ Economic Cycle: Favorable timing

RECOMMENDATIONS
==============
1. Reduce balloon payment to <50% of original principal
2. Add covenant requiring monthly financial statements
3. Include acceleration clause for material adverse change
4. Consider shorter term (X years) given asset type
5. Add cross-default provision with other borrower debts

ACTION ITEMS
============
🔧 REQUIRED FIXES:
• Correct TILA disclosure formatting
• Add missing late fee provision

⚡ RECOMMENDED IMPROVEMENTS:
• Restructure balloon payment
• Add financial covenants
• Include insurance requirements

✅ READY FOR EXECUTION:
• All calculations verified
• Security package adequate
• Compliance requirements met
```

## Integration

Works with existing SellerFi financial infrastructure:
- Database term validation queries
- Market rate API integration
- Compliance rule engine
- Risk scoring algorithms

## Related Commands

- `/sellerfi:validate-finances` - Broader financial validation
- `/sellerfi:verify-compliance` - Regulatory focus
- `/sellerfi:deal-maker` - Deal structuring optimization
- `/sellerfi:financial-analyst` - Investment analysis perspective