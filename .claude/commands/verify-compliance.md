# /sellerfi:verify-compliance

---
title: Regulatory Compliance Verification
description: Comprehensive compliance checking for financial marketplace regulations
category: financial-workflow
allowed_tools: [Read, Grep, Bash, WebFetch, mcp__ide__getDiagnostics]
permissions: [compliance-checking, file-analysis, external-validation]
---

## Purpose

Performs comprehensive regulatory compliance verification for financial marketplace platforms:

- Securities regulations and broker-dealer requirements
- Consumer protection and lending regulations
- Anti-money laundering (AML) and KYC compliance
- Privacy regulations (GDPR, CCPA, SOX)

## Usage

```
/sellerfi:verify-compliance [regulation-type]
```

### Regulation Types
- `securities` - Securities and investment regulations
- `lending` - Lending and financing regulations
- `privacy` - Data privacy and protection regulations
- `aml` - Anti-money laundering compliance
- `all` - Complete compliance check (default)

## What It Does

1. **Securities Regulation Compliance**
   - Validates proper investment disclaimers
   - Checks accredited investor verification processes
   - Ensures proper risk disclosures for seller financing
   - Validates transaction reporting requirements

2. **Consumer Protection Compliance**
   - Truth in Lending Act (TILA) compliance for financing
   - Fair Credit Reporting Act (FCRA) adherence
   - Equal Credit Opportunity Act (ECOA) compliance
   - State-specific lending law compliance

3. **Anti-Money Laundering (AML)**
   - Customer identification program (CIP) validation
   - Suspicious activity reporting (SAR) procedures
   - Enhanced due diligence for high-risk customers
   - Transaction monitoring and reporting

4. **Privacy Regulation Compliance**
   - GDPR compliance for EU users
   - CCPA compliance for California residents
   - SOX compliance for financial reporting
   - Data retention and deletion policies

5. **Business Licensing**
   - Money transmitter license requirements
   - Broker-dealer registration compliance
   - State-specific business licensing
   - International compliance for cross-border transactions

## Compliance Checks

### 📋 **Required Disclosures**
```
✅ Investment Risk Disclosures
✅ Seller Financing Terms Disclosure
✅ Privacy Policy and Data Usage
⚠️ State-Specific Lending Disclosures (pending review)
```

### 🔍 **KYC/AML Compliance**
```
✅ Customer Identification Program
✅ Enhanced Due Diligence Procedures
✅ Transaction Monitoring Systems
✅ Suspicious Activity Reporting
```

### 🛡️ **Data Protection**
```
✅ GDPR Article 13/14 Compliance
✅ CCPA Consumer Rights Implementation
✅ Data Processing Lawful Basis
⚠️ Cross-border Data Transfer Safeguards (review needed)
```

### 💼 **Business Operations**
```
✅ Escrow Account Compliance
✅ Client Fund Segregation
⚠️ Multi-state Licensing (expansion pending)
✅ Insurance and Bonding Requirements
```

## Output

Provides comprehensive compliance report:

```
REGULATORY COMPLIANCE REPORT
============================

Overall Compliance Score: 92/100 (Excellent)

COMPLIANCE STATUS BY CATEGORY
=============================

Securities Regulations: ✅ COMPLIANT
• Proper investment disclaimers: ✅ Pass
• Accredited investor verification: ✅ Pass
• Risk disclosure adequacy: ✅ Pass
• Transaction reporting: ✅ Pass

Consumer Protection: ✅ COMPLIANT
• TILA compliance: ✅ Pass
• FCRA adherence: ✅ Pass
• ECOA compliance: ✅ Pass
• State lending laws: ⚠️ Review needed for TX, CA expansion

Privacy Regulations: ✅ COMPLIANT
• GDPR compliance: ✅ Pass
• CCPA compliance: ✅ Pass
• Data retention policies: ✅ Pass
• Cross-border transfers: ⚠️ Additional safeguards recommended

AML/KYC: ✅ COMPLIANT
• Customer identification: ✅ Pass
• Enhanced due diligence: ✅ Pass
• Transaction monitoring: ✅ Pass
• SAR reporting procedures: ✅ Pass

RECOMMENDATIONS
==============
1. Update state lending disclosures for planned expansion
2. Implement additional data transfer safeguards for EU users
3. Review multi-state licensing requirements
4. Update compliance training for new regulations
```

## Integration

Leverages existing compliance infrastructure:
- Database compliance audit queries
- Document compliance validation
- Automated compliance reporting
- Integration with legal document templates

## Related Commands

- `/sellerfi:security-scan` - Security compliance focus
- `/sellerfi:validate-finances` - Financial compliance
- `/sellerfi:audit-trail` - Compliance documentation
- `/sellerfi:validate-listing` - Listing compliance check