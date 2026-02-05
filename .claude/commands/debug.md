# Debug

Help me debug an issue systematically.

## Debug Process

### Step 1: Gather Information
Ask me for:
1. What's the expected behavior?
2. What's actually happening?
3. Any error messages or logs?
4. When did this start happening?
5. What changed recently?

### Step 2: Reproduce
- Identify the exact steps to reproduce
- Check if issue is consistent or intermittent
- Note any patterns or conditions

### Step 3: Investigate
Examine the code path:
1. Find the entry point (API route, component, etc.)
2. Trace the execution flow
3. Identify suspect areas
4. Check for common issues:
   - Null/undefined values
   - Async/await mistakes
   - Race conditions
   - Type mismatches
   - Missing error handling
   - State management issues
   - API integration problems

### Step 4: Hypothesize
Propose 2-3 potential root causes with reasoning:
- **Hypothesis 1:** [description]
  - Evidence: [why you think this]
  - How to verify: [test approach]

### Step 5: Propose Solutions
For each hypothesis, suggest a fix:
- **Solution 1:** [description]
  - Trade-offs: [pros/cons]
  - Estimated effort: [time/complexity]

### Step 6: Implement
After you choose the solution:
1. Implement the fix
2. Add tests to prevent regression
3. Verify the fix works
4. Check for side effects

### Step 7: Document
Add comments explaining:
- What the bug was
- Why the fix works
- Any gotchas for future developers
