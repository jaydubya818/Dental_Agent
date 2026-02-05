# Refactor

Safely refactor code while maintaining functionality.

## Refactoring Process

### Step 1: Understand Current Code
1. Read the code to be refactored
2. Identify what it does
3. Find any tests that cover it
4. Note dependencies and usage

### Step 2: Analyze Issues

Look for:
- **Code smells**
  - Duplicated code
  - Long functions (>50 lines)
  - Large classes
  - Too many parameters
  - Deep nesting
  - Magic numbers/strings
  - Unclear names

- **Design issues**
  - Violation of SOLID principles
  - Tight coupling
  - Low cohesion
  - Missing abstractions
  - Wrong abstractions

- **Maintenance issues**
  - Hard to test
  - Hard to understand
  - Hard to modify
  - Brittle (breaks easily)

### Step 3: Plan Refactoring

**Safe refactoring strategy:**
1. Write tests FIRST if they don't exist
2. Make small changes
3. Test after each change
4. Commit frequently
5. Never change behavior and structure at same time

**Refactoring techniques:**
- Extract function/method
- Extract variable
- Rename for clarity
- Inline temporary variable
- Replace magic number with constant
- Split large function
- Remove dead code
- Simplify conditional
- Replace nested conditionals with guard clauses

### Step 4: Execute Refactoring

For each change:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Refactoring: [Technique Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Location: file.ts:line
🎯 Goal: [what we're improving]
✅ Safety: [tests exist? behavior preserved?]

Before:
```typescript
[original code]
```

After:
```typescript
[refactored code]
```

Improvement:
- [benefit 1]
- [benefit 2]

Tests: ✅ All passing
```

### Step 5: Verify

After each refactoring:
1. Run tests: `npm run test`
2. Run type check: `npx tsc --noEmit`
3. Run linter: `npm run lint`
4. Manual testing if UI affected
5. Commit: `git add . && git commit -m "refactor: [description]"`

### Step 6: Document

Add comments for:
- Complex logic that can't be simplified further
- Non-obvious design decisions
- Performance considerations
- Future improvement opportunities

## Refactoring Report

```
🔧 Refactoring Summary

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Files Modified: X
Lines changed: +X -Y
Functions refactored: X
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Improvements:
✅ [Improvement 1]
✅ [Improvement 2]
✅ [Improvement 3]

Metrics:
📊 Complexity: [before] → [after]
📏 Function length: [before] → [after]
🧪 Test coverage: [before] → [after]

Safety Checks:
✅ All tests passing
✅ No type errors
✅ Linting clean
✅ Manual testing complete

Commits:
- [commit 1]
- [commit 2]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Refactoring Guidelines

**DO:**
- Keep changes small and focused
- Test after every change
- Commit frequently
- Preserve existing behavior
- Improve readability
- Simplify logic

**DON'T:**
- Change behavior during refactoring
- Make large changes at once
- Refactor without tests
- Mix refactoring with features
- Over-engineer
- Prematurely optimize
