# /sellerfi:test-payments

---
title: Payment Integration Testing
description: Comprehensive testing of Stripe payment integration and financial workflows
category: development-workflow
allowed_tools: [Bash, Read, Grep, mcp__vercel__*, mcp__ide__getDiagnostics]
permissions: [test-execution, api-testing, stripe-integration]
---

## Purpose

Executes comprehensive testing of payment integrations and financial transaction workflows:

- Stripe Connect and subscription testing
- Seller financing payment schedules
- Escrow and payout mechanisms
- Payment failure and retry scenarios

## Usage

```
/sellerfi:test-payments [test-type]
```

### Test Types
- `subscription` - Test subscription billing and upgrades
- `financing` - Test seller financing payment flows
- `escrow` - Test dealroom escrow functionality
- `payouts` - Test seller payout processing
- `all` - Run complete payment test suite (default)

## What It Does

1. **Stripe Integration Tests**
   - Tests subscription creation and modification
   - Validates webhook handling for payment events
   - Checks Stripe Connect onboarding flows
   - Tests payment method updates and failures

2. **Seller Financing Tests**
   - Validates payment schedule calculations
   - Tests automatic payment processing
   - Checks late payment handling and notifications
   - Validates interest calculations and compounding

3. **Escrow System Tests**
   - Tests dealroom deposit handling
   - Validates fund release mechanisms
   - Checks dispute resolution workflows
   - Tests refund processing

4. **Security & Compliance Tests**
   - Validates PCI DSS compliance measures
   - Tests payment data encryption
   - Checks access control for financial operations
   - Validates audit logging for transactions

5. **Error Handling Tests**
   - Tests payment failure scenarios
   - Validates retry mechanisms
   - Checks user notification systems
   - Tests graceful degradation

## Test Execution

Runs against multiple environments:
- 🧪 **Unit Tests**: `/payments/` module tests
- 🔄 **Integration Tests**: Full payment workflow tests
- 🌐 **E2E Tests**: Complete user journey testing
- 🔒 **Security Tests**: Payment vulnerability scanning

## Output

Provides detailed test results:

```
Payment Integration Test Results
===============================

✅ Stripe Subscriptions: 15/15 tests passed
✅ Seller Financing: 12/12 tests passed
⚠️ Escrow System: 8/10 tests passed (2 warnings)
❌ Payout Processing: 5/8 tests passed (3 failures)

Critical Issues:
• Payout webhook timeout in staging environment
• Currency conversion rounding error in EUR payments
• Rate limiting issues with high-volume seller payouts

Performance Metrics:
• Average payment processing time: 2.3s
• Webhook processing time: 145ms
• Database query performance: Acceptable

Security Scan Results:
✅ No critical vulnerabilities detected
✅ PCI DSS compliance checks passed
✅ Payment data encryption validated
```

## Related Commands

- `/sellerfi:validate-build` - Full build validation including payments
- `/sellerfi:security-scan` - Security-focused payment testing
- `/sellerfi:validate-finances` - Financial calculation validation
- `/sellerfi:verify-compliance` - Payment compliance checking