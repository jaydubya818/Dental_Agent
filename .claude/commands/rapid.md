# /sellerfi:rapid

---
title: "Rapid Development"
description: "Accelerated development mode for time-sensitive financial features with streamlined workflow and automated quality checks"
category: "development-workflow"
priority: "high"
keywords: ["rapid", "accelerated", "urgent", "fast-track", "critical"]
allowed_tools: ["Write", "Read", "Edit", "Bash", "Task"]
permissions: ["rapid-deployment", "code-generation", "test-automation", "security-override"]
---

**Usage**: `/sellerfi:rapid [feature-type] [--priority=critical|high|medium]`

## What it does

1. **Fast-Track Development**: Streamlined workflow for urgent financial features
2. **Automated Scaffolding**: Rapid generation of financial module boilerplate
3. **Inline Validation**: Real-time financial calculation and security validation
4. **Express Testing**: Automated test generation with financial scenario coverage
5. **Quick Deployment**: Streamlined path to staging with minimal friction
6. **Risk Assessment**: Automatic risk evaluation for rapid deployments

## Rapid Development Modes

### 🚨 **Critical Priority** (Production Issues)
- **Timeline**: 1-4 hours
- **Use Case**: Security vulnerabilities, calculation errors, payment failures
- **Validation**: Automated testing + manual approval
- **Deployment**: Direct to staging with monitoring

### 🔥 **High Priority** (Business Critical)
- **Timeline**: 4-24 hours
- **Use Case**: New deal requirements, regulatory compliance, integration fixes
- **Validation**: Comprehensive automated testing
- **Deployment**: Standard pipeline with accelerated review

### ⚡ **Medium Priority** (Feature Acceleration)
- **Timeline**: 1-3 days
- **Use Case**: Market opportunities, competitive features, user experience
- **Validation**: Full test suite + security scan
- **Deployment**: Normal process with fast-track option

## Feature Types

### 💰 **Financial Calculations**
```bash
# Rapid financial calculation feature
/sellerfi:rapid financial-calc --priority=high

Generated:
✅ Calculation service with precision handling
✅ Input validation with financial constraints
✅ Unit tests with edge cases
✅ API endpoint with security middleware
✅ Frontend component with real-time validation
```

### 📊 **Deal Workflow**
```bash
# New deal stage or process
/sellerfi:rapid deal-workflow --priority=medium

Generated:
✅ Workflow state management
✅ Database migration (if needed)
✅ API endpoints for state transitions
✅ Frontend workflow components
✅ Integration with existing dealroom system
```

### 🔐 **Security Feature**
```bash
# Critical security implementation
/sellerfi:rapid security --priority=critical

Generated:
✅ Security middleware
✅ Authentication/authorization logic
✅ Audit logging implementation
✅ Security test coverage
✅ Compliance documentation
```

### 💳 **Payment Integration**
```bash
# Payment feature or fix
/sellerfi:rapid payment --priority=high

Generated:
✅ Stripe integration boilerplate
✅ Transaction validation logic
✅ Error handling and retry mechanisms
✅ Test payment scenarios
✅ Webhook handling
```

### 📋 **Compliance Feature**
```bash
# Regulatory or compliance requirement
/sellerfi:rapid compliance --priority=high

Generated:
✅ Compliance validation logic
✅ Audit trail implementation
✅ Reporting functionality
✅ Documentation templates
✅ Regulatory test scenarios
```

## Rapid Scaffolding Templates

### 🧮 **Financial Calculation Module**
```typescript
// Auto-generated structure
src/lib/calculations/
├── [feature-name].ts           # Core calculation logic
├── [feature-name].test.ts      # Comprehensive tests
├── [feature-name].schema.ts    # Zod validation schemas
└── [feature-name].types.ts     # TypeScript interfaces

app/api/calculations/[feature-name]/
└── route.ts                    # API endpoint with validation

components/calculators/
├── [FeatureName]Calculator.tsx # React component
└── [FeatureName]Results.tsx    # Results display
```

### 📈 **Deal Process Enhancement**
```typescript
// Auto-generated structure
src/lib/dealroom/
├── [feature-name].ts           # Business logic
├── [feature-name].test.ts      # Process tests
└── workflow-[feature-name].ts  # Workflow integration

app/api/dealrooms/[id]/[feature-name]/
└── route.ts                    # RESTful endpoints

components/dealrooms/
├── [FeatureName]Panel.tsx      # Main component
├── [FeatureName]Actions.tsx    # Action buttons
└── [FeatureName]Status.tsx     # Status indicators
```

## Quality Assurance Pipeline

### ⚡ **Rapid Validation Checks**
```bash
🔍 Code Quality (30 seconds)
├── TypeScript compilation
├── ESLint financial rule compliance
├── Financial calculation accuracy
└── Security vulnerability scan

🧪 Automated Testing (2 minutes)
├── Unit tests for core logic
├── Financial calculation edge cases
├── API endpoint validation
└── Integration test scenarios

🛡️ Security & Compliance (1 minute)
├── Financial data exposure check
├── Authentication/authorization validation
├── Audit trail generation
└── Regulatory compliance check
```

### 📊 **Risk Assessment Matrix**

| Priority | Testing Required | Manual Review | Deployment Speed |
|----------|------------------|---------------|------------------|
| Critical | Automated + Smoke | Security Lead | Immediate |
| High | Full Automated | Tech Lead | 1 hour |
| Medium | Comprehensive | Standard Review | 4 hours |

## Rapid Testing Strategies

### 🎯 **Financial Calculation Tests**
```typescript
// Auto-generated test scenarios
describe(`${featureName} Financial Calculations`, () => {
  test('handles standard scenarios', () => {
    // Common use cases
  });

  test('validates edge cases', () => {
    // Zero values, maximum limits, precision
  });

  test('maintains regulatory compliance', () => {
    // SOX, financial reporting requirements
  });
});
```

### 🔐 **Security Test Coverage**
```typescript
// Auto-generated security tests
describe(`${featureName} Security`, () => {
  test('validates authentication', () => {
    // Authentication requirements
  });

  test('prevents unauthorized access', () => {
    // Authorization checks
  });

  test('maintains audit trail', () => {
    // Compliance logging
  });
});
```

## Monitoring & Rollback

### 📱 **Real-Time Monitoring**
```bash
✅ Performance metrics dashboard
✅ Error rate monitoring
✅ Financial calculation accuracy tracking
✅ User behavior impact analysis
✅ Business metric tracking (conversion, adoption)
```

### 🔄 **Rapid Rollback Capability**
```bash
# Instant rollback if issues detected
/sellerfi:rapid rollback [deployment-id]

Features:
✅ One-click feature flag toggle
✅ Database migration rollback (if safe)
✅ Cache invalidation
✅ User notification (if needed)
✅ Incident documentation
```

## Integration Points

- **CI/CD Pipeline**: Bypasses standard review gates for critical issues
- **Monitoring**: Enhanced alerting for rapid deployments
- **Feature Flags**: Instant toggle capability for new features
- **Audit System**: Complete tracking of rapid deployment decisions

## Usage Examples

### 🚨 **Critical Payment Fix**
```bash
# Production payment processing failure
/sellerfi:rapid payment --priority=critical

Action Plan:
1. ⚡ Generate payment fix template (30 seconds)
2. 🔧 Implement Stripe webhook fix (15 minutes)
3. 🧪 Run payment test suite (2 minutes)
4. 🚀 Deploy to staging with monitoring (5 minutes)
5. 📊 Validate and deploy to production (10 minutes)

Total Time: ~35 minutes
```

### 🔥 **New Regulatory Requirement**
```bash
# Urgent compliance feature needed
/sellerfi:rapid compliance --priority=high

Action Plan:
1. 📋 Generate compliance module template (1 minute)
2. ⚖️ Implement KYC validation logic (2 hours)
3. 🧪 Run compliance test scenarios (5 minutes)
4. 📚 Generate audit documentation (10 minutes)
5. 🚀 Deploy through accelerated pipeline (30 minutes)

Total Time: ~3 hours
```

### ⚡ **Market Opportunity Feature**
```bash
# Competitive feature implementation
/sellerfi:rapid deal-workflow --priority=medium

Action Plan:
1. 📊 Generate deal workflow template (2 minutes)
2. 🔧 Implement new deal stage logic (4 hours)
3. 🎨 Create frontend components (2 hours)
4. 🧪 Run full test suite (10 minutes)
5. 🚀 Deploy through standard pipeline (1 hour)

Total Time: ~7.5 hours
```

## Required Permissions

- `rapid-deployment`: Access to fast-track deployment pipeline
- `code-generation`: Generate boilerplate templates
- `test-automation`: Execute automated test suites
- `security-override`: Bypass standard security gates (with approval)
- `monitoring-access`: Real-time deployment monitoring

## Safety Features

- **Automatic Rollback**: Triggers on error thresholds
- **Feature Flags**: Instant disable capability
- **Monitoring**: Enhanced alerting for rapid deployments
- **Audit Trail**: Complete documentation of decisions and changes
- **Approval Gates**: Maintained for critical system changes

## Related Commands

- `/sellerfi:verify-changes` - Comprehensive change validation
- `/sellerfi:security-scan` - Security vulnerability assessment
- `/sellerfi:validate-finances` - Financial calculation verification
- `/sellerfi:commit-push-pr` - Rapid git workflow