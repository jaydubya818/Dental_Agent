# /sellerfi:audit-trail

---
title: Audit Trail Generation
description: Generate comprehensive audit documentation and compliance trails
category: financial-workflow
allowed_tools: [Read, Grep, Bash, mcp__vercel__*, mcp__ide__getDiagnostics]
permissions: [database-queries, file-analysis, compliance-checking]
---

## Purpose

Generates comprehensive audit trails and compliance documentation for financial marketplace operations:

- Transaction audit trails for regulatory compliance
- User activity documentation for security audits
- Financial calculation validation records
- Change management and approval workflows

## Usage

```
/sellerfi:audit-trail [scope] [time-period]
```

### Scope Options
- `transactions` - Financial transaction audit trail
- `users` - User activity and access audit
- `compliance` - Regulatory compliance documentation
- `security` - Security event audit trail
- `changes` - Code/config change audit
- `all` - Comprehensive audit documentation (default)

### Time Period
- `daily` - Last 24 hours
- `weekly` - Last 7 days
- `monthly` - Last 30 days (default)
- `quarterly` - Last 90 days
- `annual` - Last 365 days
- `custom:YYYY-MM-DD:YYYY-MM-DD` - Custom date range

## What It Does

1. **Transaction Audit Trail**
   - All financial transactions with timestamps
   - User authorization and approval chains
   - Payment processing and settlement records
   - Escrow and fund movement documentation
   - Currency conversion and fee calculations

2. **User Activity Audit**
   - Login/logout events with IP addresses
   - Permission changes and role modifications
   - Sensitive data access (PII, financial info)
   - Failed authentication attempts
   - Administrative actions and approvals

3. **Compliance Documentation**
   - Regulatory requirement adherence records
   - Policy compliance verification logs
   - Exception handling and approvals
   - Training completion and certification
   - Third-party audit evidence

4. **Security Event Trail**
   - Security incidents and responses
   - Vulnerability scan results and remediation
   - Access control changes and reviews
   - Data encryption and key management
   - Penetration test results

5. **Change Management Audit**
   - Code deployments and rollbacks
   - Configuration changes
   - Database schema modifications
   - Infrastructure changes
   - Emergency change procedures

## Audit Categories

### 🏦 **Financial Transactions**
- Payment processing (Stripe events)
- Seller financing transactions
- Escrow deposits and releases
- Commission calculations and payouts
- Currency conversions and fees

### 👥 **User Management**
- Account creation and verification
- KYC/AML compliance checks
- Permission escalations
- Data access and downloads
- Account suspensions/closures

### ⚖️ **Regulatory Compliance**
- GDPR consent and data processing
- Financial services regulations
- Securities law compliance
- Consumer protection adherence
- International trade compliance

### 🔒 **Security Operations**
- Authentication and authorization
- Data encryption and decryption
- Backup and recovery operations
- Incident response activities
- Vulnerability management

### 🛠️ **System Changes**
- Application deployments
- Database migrations
- Configuration updates
- Third-party integrations
- Emergency patches

## Output

Generates structured audit reports:

```
SELLERFI AUDIT TRAIL REPORT
===========================

Report Period: 2024-01-01 to 2024-01-31
Generated: 2024-02-01 10:30:00 UTC
Report Type: Comprehensive Audit Trail

EXECUTIVE SUMMARY
================
• Total Events Audited: 15,247
• Security Incidents: 0 (critical), 3 (low)
• Compliance Violations: 0
• User Actions: 12,890
• Financial Transactions: 2,357
• System Changes: 47

FINANCIAL TRANSACTIONS
=====================
Total Transaction Volume: $12.4M
Average Transaction: $5,250
Largest Transaction: $2.1M

Transaction Breakdown:
• Seller Financing: 156 transactions ($8.2M)
• Marketplace Fees: 2,201 transactions ($412K)
• Escrow Operations: 89 transactions ($3.8M)
• Refunds/Chargebacks: 12 transactions ($24K)

HIGH-VALUE TRANSACTIONS (>$100K)
Transaction ID | Amount | Type | User | Status | Approver
TXN-2024-0045 | $2.1M | Seller Finance | user_789 | Complete | admin_001
TXN-2024-0076 | $850K | Escrow Release | user_234 | Complete | admin_002
TXN-2024-0123 | $650K | Seller Finance | user_567 | Complete | admin_001

USER ACTIVITY SUMMARY
=====================
Total Active Users: 1,247
New Registrations: 89
Account Suspensions: 2
Admin Actions: 156

Privileged Access Events:
• Admin Console Access: 23 events
• Database Queries: 145 events (automated)
• User Data Export: 7 events (with justification)
• Permission Changes: 12 events

COMPLIANCE STATUS
================
✅ GDPR Compliance: 100% (2,456 consent events)
✅ Financial Regulations: 100% (no violations)
✅ AML/KYC: 100% (89 new verifications)
✅ Data Retention: 100% (automated cleanup)

Policy Violations: 0
Exception Approvals: 3 (all documented)

SECURITY EVENTS
===============
Authentication Events: 8,234 (success), 45 (failed)
IP Blocking Events: 12 (automated)
Rate Limiting: 234 requests blocked
Data Access Violations: 0

Low-Priority Security Events:
• 3 suspicious login patterns (auto-resolved)
• 1 outdated browser warning
• 2 VPN access notifications

SYSTEM CHANGES
==============
Production Deployments: 4
Database Migrations: 2
Configuration Changes: 15
Emergency Patches: 0

Change Approvals:
Date | Change | Approver | Risk Level
2024-01-15 | Payment API Update | tech_lead_001 | Medium
2024-01-22 | Security Patch | security_team | Low
2024-01-28 | Database Migration | dba_001 | High

RECOMMENDATIONS
===============
1. ✅ Excellent compliance record - maintain current practices
2. 🔍 Review VPN access patterns for remote work policy
3. 📊 Consider automated high-value transaction alerts
4. 🔄 Schedule quarterly security training refresh
5. 📋 Document emergency change procedures

AUDIT TRAIL INTEGRITY
=====================
✅ All events cryptographically signed
✅ No gaps in audit log continuity
✅ Backup verification successful
✅ Independent verification completed
```

## Export Formats

Audit trails can be exported in multiple formats:
- **PDF**: Executive summary and compliance reports
- **CSV**: Detailed transaction data for analysis
- **JSON**: Machine-readable format for integration
- **XML**: Regulatory submission format
- **Encrypted Archive**: Secure long-term storage

## Integration

Integrates with SellerFi audit infrastructure:
- Database audit log queries
- Stripe event history analysis
- Authentication log processing
- Compliance monitoring systems
- Security incident tracking

## Related Commands

- `/sellerfi:verify-compliance` - Active compliance checking
- `/sellerfi:security-scan` - Security audit focus
- `/sellerfi:validate-finances` - Financial audit trail
- `/sellerfi:deal-flow` - Transaction pipeline audit