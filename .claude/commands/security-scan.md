# /sellerfi:security-scan

---
title: Financial Security Scanning
description: Comprehensive security scan with fintech focus and compliance checking
category: development-workflow
allowed_tools: [Bash, Read, Grep, mcp__ide__getDiagnostics]
permissions: [security-scanning, file-analysis, compliance-checking]
---

## Purpose

Performs comprehensive security scanning specifically designed for financial marketplace platforms:

- Financial data protection and PII security
- Payment processing security compliance
- API endpoint vulnerability assessment
- Database security and access control validation

## Usage

```
/sellerfi:security-scan [scope]
```

### Scan Scopes
- `payments` - Focus on payment processing security
- `data` - PII and financial data protection
- `api` - API security and authentication
- `database` - Database security and access control
- `full` - Complete security assessment (default)

## What It Does

1. **Financial Data Protection**
   - Scans for exposed PII in code and logs
   - Validates financial data encryption at rest and in transit
   - Checks for proper data masking in non-production environments
   - Verifies GDPR and CCPA compliance measures

2. **Payment Security Compliance**
   - Validates PCI DSS compliance requirements
   - Checks Stripe integration security best practices
   - Scans for payment data exposure in client-side code
   - Verifies secure handling of payment tokens and webhooks

3. **Authentication & Authorization**
   - Tests JWT token security and expiration
   - Validates role-based access control (RBAC)
   - Checks for privilege escalation vulnerabilities
   - Tests session management and logout flows

4. **API Security Assessment**
   - Rate limiting and DDoS protection validation
   - Input validation and SQL injection testing
   - CORS configuration security review
   - API authentication and authorization testing

5. **Infrastructure Security**
   - Environment variable security check
   - Database connection security validation
   - Third-party dependency vulnerability scanning
   - Server configuration security review

## Security Checks

### 🔒 **Critical Security Issues**
- Hardcoded secrets or API keys
- SQL injection vulnerabilities
- Exposed PII or financial data
- Broken authentication mechanisms

### ⚠️ **High Priority Issues**
- Weak encryption implementations
- Insufficient access controls
- Missing security headers
- Vulnerable dependencies

### 📋 **Medium Priority Issues**
- Logging sensitive information
- Weak password policies
- Missing rate limiting
- Outdated security configurations

### ✅ **Low Priority Issues**
- Security best practice improvements
- Enhanced monitoring recommendations
- Performance security optimizations
- Documentation updates

## Output

Generates comprehensive security report:

```
FINANCIAL SECURITY SCAN RESULTS
================================

Security Score: 85/100 (Good)

Critical Issues: 0
High Priority: 2
Medium Priority: 5
Low Priority: 8

CRITICAL ISSUES
===============
No critical security issues detected.

HIGH PRIORITY ISSUES
===================
1. Missing CSRF protection on financial form endpoints
2. Weak JWT secret configuration in staging environment

MEDIUM PRIORITY ISSUES
=====================
1. Missing security headers on API responses
2. Insufficient logging of financial transaction failures
3. Outdated bcrypt rounds for password hashing
4. Missing rate limiting on password reset endpoint
5. Exposed debug information in error responses

COMPLIANCE STATUS
================
✅ PCI DSS: Compliant
✅ GDPR: Compliant
⚠️ SOX: Partial compliance (audit logging gaps)
✅ CCPA: Compliant

RECOMMENDATIONS
==============
• Implement CSRF protection using NextAuth.js built-in features
• Rotate JWT secrets and increase entropy
• Add security headers via Next.js middleware
• Enhance financial transaction audit logging
```

## Integration

Uses existing SellerFi security validators:
- `.claude/hooks/validators/security-validator.sh`
- `.claude/hooks/validators/database-safety-validator.sh`
- Integration with ESLint security rules
- Automated dependency vulnerability scanning

## Related Commands

- `/sellerfi:verify-compliance` - Regulatory compliance focus
- `/sellerfi:validate-finances` - Financial calculation security
- `/sellerfi:test-payments` - Payment security testing
- `/sellerfi:audit-trail` - Security audit documentation