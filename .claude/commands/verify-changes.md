# /sellerfi:verify-changes

---
title: "Multi-Agent Verification"
description: "Multi-agent verification system to validate changes across financial, security, and compliance domains before deployment"
category: "quality-assurance"
priority: "high"
keywords: ["verification", "validation", "multi-agent", "quality"]
allowed_tools: ["Read", "Bash", "Grep", "Task"]
permissions: ["code-analysis", "security-scan", "compliance-check", "financial-validation"]
---

**Usage**: `/sellerfi:verify-changes [scope] [--detailed]`

## What it does

1. **Multi-Agent Analysis**: Deploys specialized agents for comprehensive validation
2. **Financial Accuracy**: Verifies all financial calculations and logic
3. **Security Assessment**: Comprehensive security vulnerability analysis
4. **Compliance Check**: Ensures regulatory compliance across all changes
5. **Integration Testing**: Validates system integration integrity
6. **Risk Assessment**: Evaluates potential business and technical risks

## Verification Agents

### 🏦 Financial Verification Agent
- **Financial calculations**: Interest rates, amortization, DSCR
- **Market validation**: Pricing models, valuation multiples
- **Risk metrics**: Deal scoring, credit assessments
- **Compliance**: Financial regulatory requirements

### 🔒 Security Verification Agent
- **Vulnerability scanning**: SQL injection, XSS, financial data exposure
- **Authentication flows**: Multi-factor, session management
- **Data protection**: PII, financial data encryption
- **API security**: Rate limiting, input validation

### ⚖️ Compliance Verification Agent
- **Regulatory adherence**: SOX, GDPR, CCPA compliance
- **Audit requirements**: Documentation, trail completeness
- **Financial regulations**: Know Your Customer (KYC), AML
- **Data governance**: Retention, privacy, access controls

### 🔧 Technical Verification Agent
- **Code quality**: Performance, maintainability, patterns
- **Integration integrity**: API compatibility, data flow
- **Database changes**: Migration safety, performance impact
- **Infrastructure**: Scaling, reliability, monitoring

## Parameters

- `scope` (optional): Specific verification scope (financial|security|compliance|technical|all)
- `--detailed`: Provide comprehensive analysis with recommendations
- `--fast`: Quick validation for critical path items
- `--report`: Generate formal verification report

## Examples

```bash
# Full verification
/sellerfi:verify-changes

# Financial focus
/sellerfi:verify-changes financial --detailed

# Quick security check
/sellerfi:verify-changes security --fast

# Generate compliance report
/sellerfi:verify-changes compliance --report
```

## Verification Process

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Code Changes  │ → │ Multi-Agent     │ → │ Verification    │
│   Detected      │    │ Analysis        │    │ Report          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ Risk Assessment │
                    │ & Recommendations│
                    └─────────────────┘
```

## Risk Assessment Levels

### 🟢 **LOW RISK**
- Minor UI changes
- Documentation updates
- Non-critical bug fixes
- **Action**: Auto-approve with monitoring

### 🟡 **MEDIUM RISK**
- API modifications
- Database schema changes
- New feature additions
- **Action**: Requires review and manual approval

### 🟠 **HIGH RISK**
- Financial calculation changes
- Security system modifications
- Payment processing updates
- **Action**: Requires thorough testing and compliance review

### 🔴 **CRITICAL RISK**
- Core financial logic changes
- Authentication system updates
- Regulatory compliance modifications
- **Action**: Requires executive approval and audit

## Verification Report Format

```markdown
# SellerFi Change Verification Report

## Summary
- **Risk Level**: Medium
- **Financial Impact**: Low
- **Security Impact**: None
- **Compliance Status**: Compliant

## Agent Analysis

### Financial Verification ✅
- All calculations mathematically verified
- Market data within acceptable ranges
- Risk scoring algorithms functioning correctly

### Security Verification ⚠️
- Minor: Rate limiting could be enhanced
- No critical vulnerabilities detected
- Encryption standards maintained

### Compliance Verification ✅
- SOX requirements satisfied
- GDPR compliance maintained
- Audit trail complete

## Recommendations
1. Enhance API rate limiting
2. Add monitoring for new endpoints
3. Update documentation

## Approval Status
Ready for production deployment with monitoring
```

## Integration Points

- **CI/CD Pipeline**: Automatic verification on pull requests
- **Security Scanners**: Integrates with existing security tools
- **Audit System**: Feeds into compliance reporting
- **Monitoring**: Alerts on high-risk deployments

## Required Permissions

- `code-analysis`: Read and analyze code changes
- `security-scan`: Execute security validation
- `database-read`: Analyze schema changes
- `compliance-check`: Validate regulatory requirements
- `report-generation`: Create verification reports

## Error Handling

- **Agent Timeout**: Fallback to manual review
- **Conflicting Results**: Escalate to human oversight
- **Critical Findings**: Block deployment automatically
- **System Unavailable**: Graceful degradation with logging

## Performance

- **Standard Verification**: 2-5 minutes
- **Detailed Analysis**: 5-15 minutes
- **Fast Mode**: 30-60 seconds
- **Parallel Processing**: Multi-agent concurrent analysis

## Related Commands

- `/sellerfi:security-scan` - Focused security analysis
- `/sellerfi:validate-finances` - Financial calculation validation
- `/sellerfi:audit-trail` - Generate compliance documentation
- `/sellerfi:quick-commit` - Fast development workflow