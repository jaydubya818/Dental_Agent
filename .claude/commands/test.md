# Test

Run comprehensive test suite and report results.

## Test Execution

### 1. Type Checking
```bash
npx tsc --noEmit
```
**Purpose:** Ensure TypeScript types are correct

### 2. Linting
```bash
npm run lint
```
**Purpose:** Check code style and potential errors

### 3. Unit Tests
```bash
npm run test
```
**Purpose:** Test individual functions and components

### 4. E2E Tests
```bash
npm run test:e2e
```
**Purpose:** Test full user workflows

### 5. Build Test
```bash
npm run build
```
**Purpose:** Ensure production build succeeds

## Results Format

Provide summary in this format:

```
🧪 Test Results Summary

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 TypeScript
   Status: ✅ Pass / ❌ Fail
   Errors: X
   Details: [error details if any]

📋 Linting
   Status: ✅ Pass / ⚠️  Warnings / ❌ Fail
   Errors: X
   Warnings: X
   Details: [details if any]

🔬 Unit Tests
   Status: ✅ Pass / ❌ Fail
   Total: X tests
   Passed: X
   Failed: X
   Duration: Xs
   Details: [failed tests if any]

🎭 E2E Tests
   Status: ✅ Pass / ❌ Fail
   Total: X tests
   Passed: X
   Failed: X
   Duration: Xs
   Details: [failed tests if any]

🏗️  Build
   Status: ✅ Success / ❌ Failed
   Size: X MB
   Duration: Xs
   Warnings: X

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Overall: ✅ ALL PASS / ❌ FAILURES FOUND

Summary:
- Total checks: X
- Passed: X
- Failed: X
- Warnings: X
```

## After Results

If any failures:
1. Show which tests failed
2. Display error messages
3. Ask: "Would you like me to fix these issues?"

If all passing:
4. Confirm code is ready to ship
5. Suggest next steps (commit, deploy, etc.)
