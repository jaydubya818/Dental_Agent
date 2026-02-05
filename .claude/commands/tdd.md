---
description: Enforce test-driven development workflow. Scaffold interfaces, generate tests FIRST, then implement minimal code to pass. Ensure 80%+ coverage (100% for financial calculations).
---

# TDD Command

This command invokes the **tdd-guide** agent to enforce test-driven development methodology for SellerFi.

## What This Command Does

1. **Scaffold Interfaces** - Define types/interfaces first
2. **Generate Tests First** - Write failing tests (RED)
3. **Implement Minimal Code** - Write just enough to pass (GREEN)
4. **Refactor** - Improve code while keeping tests green (REFACTOR)
5. **Verify Coverage** - Ensure 80%+ test coverage (100% for financial code)

## When to Use

Use `/tdd` when:
- Implementing new features
- Adding new functions/components
- Fixing bugs (write test that reproduces bug first)
- Refactoring existing code
- Building critical business logic
- Writing financial calculations
- Implementing entitlement checks
- Adding payment processing logic

## How It Works

The tdd-guide agent will:

1. **Define interfaces** for inputs/outputs
2. **Write tests that will FAIL** (because code doesn't exist yet)
3. **Run tests** and verify they fail for the right reason
4. **Write minimal implementation** to make tests pass
5. **Run tests** and verify they pass
6. **Refactor** code while keeping tests green
7. **Check coverage** and add more tests if below 80% (or 100% for financial code)

## TDD Cycle

```
RED → GREEN → REFACTOR → REPEAT

RED:      Write a failing test
GREEN:    Write minimal code to pass
REFACTOR: Improve code, keep tests passing
REPEAT:   Next feature/scenario
```

## SellerFi Coverage Requirements

**100% Coverage Required For:**
- Financial calculations (amortization, payments, interest)
- Deal scoring logic
- Entitlement checks
- Payment processing (Stripe integration)
- Authentication logic (NextAuth)
- Money handling (no floating-point errors)

**80% Coverage Required For:**
- All other code
- API routes
- Server actions
- Components
- Utilities

## Example Usage

```
User: /tdd I need a function to calculate seller financing amortization schedule

Agent (tdd-guide):
# TDD Session: Seller Financing Amortization Calculator

## Step 1: Define Interface (SCAFFOLD)

```typescript
// lib/financing/amortization.ts
export interface AmortizationParams {
  principal: number // Loan amount in cents
  annualRate: number // Annual interest rate (0.08 = 8%)
  termYears: number // Loan term in years
  paymentFrequency: 'monthly' | 'quarterly'
}

export interface PaymentSchedule {
  period: number
  payment: number // In cents
  principal: number // In cents
  interest: number // In cents
  balance: number // In cents
}

export function calculateAmortizationSchedule(
  params: AmortizationParams
): PaymentSchedule[] {
  // TODO: Implementation
  throw new Error('Not implemented')
}
```

## Step 2: Write Failing Test (RED)

```typescript
// lib/financing/amortization.test.ts
import { calculateAmortizationSchedule } from './amortization'

describe('calculateAmortizationSchedule', () => {
  it('generates correct payment schedule for monthly payments', () => {
    const schedule = calculateAmortizationSchedule({
      principal: 10000000, // $100k in cents
      annualRate: 0.08, // 8%
      termYears: 5,
      paymentFrequency: 'monthly'
    })

    expect(schedule).toHaveLength(60) // 5 years * 12 months
    expect(schedule[0].payment).toBe(202764) // First payment in cents
    expect(schedule[0].principal).toBe(136097)
    expect(schedule[0].interest).toBe(66667)
    expect(schedule[59].balance).toBe(0) // Paid off
  })

  it('handles edge case: zero interest rate', () => {
    const schedule = calculateAmortizationSchedule({
      principal: 10000000,
      annualRate: 0,
      termYears: 5,
      paymentFrequency: 'monthly'
    })

    expect(schedule[0].interest).toBe(0)
    expect(schedule[0].payment).toBe(166667) // 10000000 / 60
  })

  it('validates input: negative principal throws error', () => {
    expect(() => {
      calculateAmortizationSchedule({
        principal: -10000000,
        annualRate: 0.08,
        termYears: 5,
        paymentFrequency: 'monthly'
      })
    }).toThrow('Principal must be positive')
  })
})
```

## Step 3: Run Tests - Verify FAIL

```bash
npm test lib/financing/amortization.test.ts

FAIL lib/financing/amortization.test.ts
  ✕ generates correct payment schedule for monthly payments (2 ms)
    Error: Not implemented

1 test failed, 0 passed
```

✅ Tests fail as expected. Ready to implement.

## Step 4: Implement Minimal Code (GREEN)

```typescript
// lib/financing/amortization.ts
export function calculateAmortizationSchedule(
  params: AmortizationParams
): PaymentSchedule[] {
  const { principal, annualRate, termYears, paymentFrequency } = params

  // Validate inputs
  if (principal <= 0) {
    throw new Error('Principal must be positive')
  }
  if (termYears <= 0) {
    throw new Error('Term must be positive')
  }

  const periods = termYears * 12 // Monthly payments
  const monthlyRate = annualRate / 12

  // Calculate monthly payment using amortization formula
  // PMT = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
  let payment: number
  if (monthlyRate === 0) {
    payment = principal / periods
  } else {
    payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, periods)) /
              (Math.pow(1 + monthlyRate, periods) - 1)
  }

  let balance = principal
  const schedule: PaymentSchedule[] = []

  for (let i = 0; i < periods; i++) {
    const interest = balance * monthlyRate
    const principalPayment = payment - interest
    balance -= principalPayment

    schedule.push({
      period: i + 1,
      payment: Math.round(payment),
      principal: Math.round(principalPayment),
      interest: Math.round(interest),
      balance: Math.round(Math.max(0, balance))
    })
  }

  return schedule
}
```

## Step 5: Run Tests - Verify PASS

```bash
npm test lib/financing/amortization.test.ts

PASS lib/financing/amortization.test.ts
  ✓ generates correct payment schedule for monthly payments (3 ms)
  ✓ handles edge case: zero interest rate (2 ms)
  ✓ validates input: negative principal throws error (1 ms)

3 tests passed
```

✅ All tests passing!

## Step 6: Refactor (IMPROVE)

```typescript
// lib/financing/amortization.ts - Refactored with constants
const MONTHS_PER_YEAR = 12

function validateParams(params: AmortizationParams): void {
  if (params.principal <= 0) {
    throw new Error('Principal must be positive')
  }
  if (params.termYears <= 0) {
    throw new Error('Term must be positive')
  }
  if (params.annualRate < 0) {
    throw new Error('Interest rate cannot be negative')
  }
}

function calculateMonthlyPayment(
  principal: number,
  monthlyRate: number,
  periods: number
): number {
  if (monthlyRate === 0) {
    return principal / periods
  }

  return principal * (monthlyRate * Math.pow(1 + monthlyRate, periods)) /
         (Math.pow(1 + monthlyRate, periods) - 1)
}

export function calculateAmortizationSchedule(
  params: AmortizationParams
): PaymentSchedule[] {
  validateParams(params)

  const { principal, annualRate, termYears } = params
  const periods = termYears * MONTHS_PER_YEAR
  const monthlyRate = annualRate / MONTHS_PER_YEAR
  const payment = calculateMonthlyPayment(principal, monthlyRate, periods)

  let balance = principal
  const schedule: PaymentSchedule[] = []

  for (let i = 0; i < periods; i++) {
    const interest = balance * monthlyRate
    const principalPayment = payment - interest
    balance -= principalPayment

    schedule.push({
      period: i + 1,
      payment: Math.round(payment),
      principal: Math.round(principalPayment),
      interest: Math.round(interest),
      balance: Math.round(Math.max(0, balance))
    })
  }

  return schedule
}
```

## Step 7: Verify Tests Still Pass

```bash
npm test lib/financing/amortization.test.ts

PASS lib/financing/amortization.test.ts
  ✓ generates correct payment schedule for monthly payments (3 ms)
  ✓ handles edge case: zero interest rate (2 ms)
  ✓ validates input: negative principal throws error (1 ms)

3 tests passed
```

✅ Refactoring complete, tests still passing!

## Step 8: Check Coverage

```bash
npm test -- --coverage lib/financing/amortization.test.ts

File                | % Stmts | % Branch | % Funcs | % Lines
--------------------|---------|----------|---------|--------
amortization.ts     |   100   |   100    |   100   |   100

Coverage: 100% ✅ (Target: 100% for financial code)
```

✅ TDD session complete!
```

## TDD Best Practices

**DO:**
- ✅ Write the test FIRST, before any implementation
- ✅ Run tests and verify they FAIL before implementing
- ✅ Write minimal code to make tests pass
- ✅ Refactor only after tests are green
- ✅ Add edge cases and error scenarios
- ✅ Aim for 80%+ coverage (100% for financial/entitlement code)
- ✅ Use integer cents for money calculations

**DON'T:**
- ❌ Write implementation before tests
- ❌ Skip running tests after each change
- ❌ Write too much code at once
- ❌ Ignore failing tests
- ❌ Test implementation details (test behavior)
- ❌ Mock everything (prefer integration tests)
- ❌ Use floating-point for money

## Test Types to Include

**Unit Tests** (Function-level):
- Happy path scenarios
- Edge cases (empty, null, max values)
- Error conditions
- Boundary values
- Financial calculation accuracy

**Integration Tests** (Component-level):
- API endpoints
- Database operations
- Stripe integration
- Server actions
- React components with hooks

**E2E Tests** (use `/e2e` command):
- Critical user flows
- Multi-step processes
- Full stack integration
- Payment flows
- Deal evaluation workflows

## Important Notes

**MANDATORY**: Tests must be written BEFORE implementation. The TDD cycle is:

1. **RED** - Write failing test
2. **GREEN** - Implement to pass
3. **REFACTOR** - Improve code

Never skip the RED phase. Never write code before tests.

## Integration with Other Commands

- Use `/plan` first to understand what to build
- Use `/tdd` to implement with tests
- Use `/build-fix` if build errors occur
- Use `/code-review` to review implementation
- Use `/test-coverage` to verify coverage

## Related Agents

This command invokes the `tdd-guide` agent located at:
`.claude/agents/quality/tdd-guide.md`
