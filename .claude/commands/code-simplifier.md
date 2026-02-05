# /sellerfi:code-simplifier

---
title: "Code Simplification"
description: "Post-implementation code cleanup and simplification for financial modules with maintainability and compliance focus"
category: "quality-assurance"
priority: "medium"
keywords: ["simplify", "cleanup", "maintainability", "refactor"]
allowed_tools: ["Read", "Edit", "MultiEdit", "Bash"]
permissions: ["code-modification", "financial-validation", "test-generation"]
---

**Usage**: `/sellerfi:code-simplifier [target] [--scope=financial|security|ui|all]`

## What it does

1. **Code Complexity Reduction**: Simplifies complex financial calculations while maintaining accuracy
2. **Pattern Standardization**: Applies consistent patterns across financial modules
3. **Documentation Enhancement**: Adds clear documentation for financial logic
4. **Performance Optimization**: Optimizes without compromising calculation precision
5. **Maintainability Improvement**: Refactors for easier future modifications
6. **Compliance Alignment**: Ensures code meets financial regulatory standards

## Simplification Areas

### 🧮 Financial Calculations
- **Complex Interest Formulas**: Break down into readable components
- **Amortization Logic**: Simplify payment schedule calculations
- **Risk Scoring**: Clarify scoring algorithm implementations
- **Currency Handling**: Standardize decimal precision and rounding

### 🔧 API Endpoints
- **Request Validation**: Simplify input validation logic
- **Response Formatting**: Standardize financial data presentation
- **Error Handling**: Clarify financial error scenarios
- **Authentication**: Streamline security flow

### 📊 Database Operations
- **Query Optimization**: Simplify complex financial queries
- **Transaction Logic**: Clarify multi-step financial operations
- **Data Validation**: Streamline financial data constraints
- **Migration Scripts**: Simplify database schema changes

### 🎨 User Interface
- **Financial Forms**: Simplify complex input workflows
- **Data Visualization**: Clarify financial chart implementations
- **Responsive Design**: Streamline mobile financial interfaces
- **State Management**: Simplify deal and payment state logic

## Parameters

- `target` (optional): Specific file, directory, or module to simplify
- `--scope`: Focus area (financial|security|ui|api|database|all)
- `--preserve-accuracy`: Maintain calculation precision (default: true)
- `--add-tests`: Generate tests for simplified code
- `--documentation`: Enhanced documentation generation

## Examples

```bash
# Simplify all financial calculation modules
/sellerfi:code-simplifier --scope=financial

# Focus on specific component
/sellerfi:code-simplifier components/TermSheetBuilder.tsx --add-tests

# Simplify API with documentation
/sellerfi:code-simplifier app/api/billing --documentation

# Comprehensive cleanup
/sellerfi:code-simplifier --scope=all --add-tests --documentation
```

## Simplification Strategies

### 📐 **Mathematical Precision**
```typescript
// BEFORE: Complex nested calculation
const monthlyPayment = (principal * (rate * Math.pow(1 + rate, term))) / (Math.pow(1 + rate, term) - 1);

// AFTER: Simplified with clear steps
const rateCompound = Math.pow(1 + rate, term);
const numerator = principal * rate * rateCompound;
const denominator = rateCompound - 1;
const monthlyPayment = numerator / denominator;
```

### 🔄 **Control Flow Simplification**
```typescript
// BEFORE: Nested conditionals
if (dealroom.status === 'ACTIVE') {
  if (user.role === 'BUYER') {
    if (dealroom.buyerId === user.id) {
      // complex logic
    }
  }
}

// AFTER: Early returns and clear conditions
const canAccessDealroom = (
  dealroom.status === 'ACTIVE' &&
  user.role === 'BUYER' &&
  dealroom.buyerId === user.id
);

if (!canAccessDealroom) return null;
// simplified logic
```

### 📋 **Data Structure Simplification**
```typescript
// BEFORE: Complex nested object
const dealData = {
  financial: {
    terms: {
      principal: listing.askingPrice,
      rate: terms.interestRate,
      // ... complex nesting
    }
  }
};

// AFTER: Flat, clear structure
const dealCalculation = {
  principal: listing.askingPrice,
  interestRate: terms.interestRate,
  termMonths: terms.termMonths,
  downPayment: terms.downPayment
};
```

## Quality Metrics

### 📊 **Complexity Reduction**
- **Cyclomatic Complexity**: Reduce from 15+ to <10
- **Function Length**: Break functions >50 lines into smaller units
- **Nesting Depth**: Maximum 3 levels deep
- **Parameter Count**: Maximum 4 parameters per function

### 🎯 **Financial Accuracy**
- **Precision Validation**: Maintain calculation accuracy to 4 decimal places
- **Rounding Consistency**: Standardize financial rounding rules
- **Edge Case Handling**: Preserve all financial edge case logic
- **Compliance Requirements**: Maintain regulatory calculation standards

### 📚 **Documentation Standards**
- **Financial Logic**: Document calculation formulas and business rules
- **API Contracts**: Clear input/output specifications
- **Error Scenarios**: Document financial error conditions
- **Compliance Notes**: Reference relevant financial regulations

## Pre-Simplification Validation

```bash
# Financial accuracy tests
✅ Run comprehensive financial calculation tests
✅ Validate against known good results
✅ Check edge cases (zero values, maximum limits)
✅ Verify regulatory compliance requirements

# Code quality checks
✅ Ensure all tests pass before simplification
✅ Create backup of complex logic
✅ Document original business rules
✅ Validate with stakeholders if needed
```

## Post-Simplification Validation

```bash
# Regression testing
✅ All existing tests pass
✅ New simplified tests added
✅ Performance benchmarks maintained
✅ Security validation passes

# Code review
✅ Simplified code is more readable
✅ Business logic remains intact
✅ Documentation is comprehensive
✅ Maintenance burden reduced
```

## Integration Features

- **Test Generation**: Automatically creates tests for simplified code
- **Documentation**: Generates clear technical documentation
- **Performance Monitoring**: Ensures optimizations don't degrade performance
- **Security Validation**: Maintains security standards during simplification

## Required Permissions

- `code-analysis`: Read and analyze existing code
- `code-modification`: Write simplified implementations
- `test-generation`: Create validation tests
- `documentation-write`: Generate technical documentation
- `financial-validation`: Verify calculation accuracy

## Safety Features

- **Backup Creation**: Automatic backup before simplification
- **Rollback Capability**: Easy revert to original implementation
- **Validation Gates**: Multiple validation points during simplification
- **Stakeholder Review**: Optional review for critical financial components

## Output Example

```
🔍 Analyzing target: components/TermSheetBuilder.tsx

📊 Complexity Analysis:
- Cyclomatic complexity: 18 → 8 (✅ Simplified)
- Function length: 85 lines → 45 lines (✅ Reduced)
- Parameter count: 7 → 4 (✅ Simplified)

🧮 Financial Validation:
- Calculation accuracy: ✅ Maintained
- Edge cases: ✅ Preserved
- Compliance: ✅ SOX requirements met

📚 Documentation:
- ✅ Added 12 inline comments
- ✅ Generated API documentation
- ✅ Created usage examples

🧪 Testing:
- ✅ 8 new unit tests added
- ✅ All existing tests pass
- ✅ Performance benchmarks maintained

✨ Simplification complete! Code is 40% more maintainable.
```

## Related Commands

- `/sellerfi:validate-finances` - Verify financial calculation accuracy
- `/sellerfi:security-scan` - Ensure security standards maintained
- `/sellerfi:verify-changes` - Comprehensive change validation
- `/sellerfi:audit-trail` - Document simplification for compliance