# Optimize

Analyze and optimize code for performance.

## Optimization Analysis

### 1. Identify Performance Bottlenecks

Check for:
- **Database queries**
  - N+1 query problems
  - Missing indexes
  - Inefficient joins
  - Unnecessary data fetching
  - Missing `select` statements

- **React/Frontend**
  - Unnecessary re-renders
  - Large bundle sizes
  - Unoptimized images
  - Missing lazy loading
  - No memoization where needed
  - Heavy computations in render

- **API/Backend**
  - Slow endpoint response times
  - No caching
  - Synchronous operations that could be async
  - Large payload sizes
  - Missing compression

- **Algorithm complexity**
  - O(n²) or worse algorithms
  - Nested loops
  - Redundant operations

### 2. Measure Current Performance

For each issue found, document:
- **Location:** `file.ts:line`
- **Current performance:** X ms / Y MB
- **Impact:** High / Medium / Low
- **Effort to fix:** Easy / Medium / Hard

### 3. Propose Optimizations

For each optimization:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Optimization #1: [Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Location: file.ts:line
⚡ Current: X ms
✨ Expected: Y ms (Z% improvement)
💪 Effort: [Easy/Medium/Hard]

Problem:
[Describe the issue]

Solution:
[Describe the fix]

Code:
```typescript
// Before
[current code]

// After
[optimized code]
```

Trade-offs:
- Pro: [benefit]
- Con: [drawback]
```

### 4. Priority Ranking

Sort optimizations by ROI:
1. 🔥 **Critical** - High impact, easy fix
2. ⚠️  **Important** - High impact, medium effort
3. 💡 **Nice-to-have** - Medium impact, easy fix
4. 📝 **Future** - Low impact or hard effort

### 5. Implementation Plan

For selected optimizations:
1. Implement the fix
2. Measure improvement (before/after)
3. Run tests to ensure no regressions
4. Document the optimization
5. Add performance test if critical

### 6. Performance Report

After implementation:
```
🎯 Performance Optimization Results

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Optimization 1: [Name]
Before: X ms
After: Y ms
Improvement: Z% faster
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall Results:
✅ Optimizations applied: X
📈 Average improvement: Y%
🚀 Critical fixes: X
⚡ Total time saved: X ms

Next Steps:
- Monitor production metrics
- Consider additional optimizations from "Future" list
```
