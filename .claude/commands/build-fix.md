---
description: Fix build and TypeScript errors quickly with minimal changes. No architectural modifications, just get the build green.
---

# Build Fix Command

This command invokes the **build-error-resolver** agent to fix TypeScript, compilation, and build errors with minimal diffs.

## What This Command Does

1. **Collect All Errors** - Run full type check and categorize errors
2. **Prioritize Fixes** - Focus on blocking errors first
3. **Minimal Diffs** - Make smallest possible changes to fix errors
4. **Verify Build** - Ensure build passes after fixes
5. **No Refactoring** - Only fix errors, don't change architecture

## When to Use

Use `/build-fix` when:
- `npm run build` fails
- TypeScript type errors blocking development
- Import/module resolution errors
- Configuration errors
- Dependency version conflicts
- Need to get build green quickly

## How It Works

The build-error-resolver agent will:

1. **Run diagnostics** - `npm run typecheck`, `npm run lint`, `npm run build`
2. **Categorize errors** - Type errors, import errors, config errors
3. **Fix errors one by one** - Minimal changes only
4. **Verify after each fix** - Ensure no new errors introduced
5. **Report results** - Summary of fixes applied

## SellerFi Build Requirements

**Zero-Error Gate:**
- ALL Chrome console output is a bug
- console.error = blocker
- Uncaught runtime errors = blocker
- Hydration mismatches = blocker
- Warnings are blockers unless explicitly whitelisted

**Build Commands:**
```bash
npm run typecheck  # TypeScript check
npm run lint       # ESLint check
npm run build      # Production build
```

## Example Usage

```
User: /build-fix The build is failing with TypeScript errors

Agent (build-error-resolver):
# Build Error Resolution Session

## Step 1: Collect Errors

Running diagnostics...

```bash
npm run typecheck
```

Found 5 TypeScript errors:

1. `app/listings/[id]/page.tsx:45` - Parameter 'listing' implicitly has 'any' type
2. `app/api/deals/route.ts:23` - Property 'id' does not exist on type 'Session'
3. `lib/calculations.ts:67` - Object is possibly 'undefined'
4. `components/DealCard.tsx:12` - Cannot find module '@/lib/utils'
5. `types/next-auth.d.ts:5` - Duplicate identifier 'Session'

## Step 2: Fix Errors (Minimal Diffs)

### Fix 1: Add type annotation
**File:** `app/listings/[id]/page.tsx:45`

```diff
- function formatListing(listing) {
+ function formatListing(listing: Listing) {
    return listing.title
  }
```

**Lines Changed:** 1

### Fix 2: Extend NextAuth types
**File:** `types/next-auth.d.ts`

```diff
  import { DefaultSession } from 'next-auth'

  declare module 'next-auth' {
    interface Session {
      user: {
+       id: string
+       role: string
+       tier: string
      } & DefaultSession['user']
    }
  }
```

**Lines Changed:** 3

### Fix 3: Add null check
**File:** `lib/calculations.ts:67`

```diff
- const total = deal.financials.revenue * 0.3
+ const total = deal.financials?.revenue ? deal.financials.revenue * 0.3 : 0
```

**Lines Changed:** 1

### Fix 4: Fix import path
**File:** `components/DealCard.tsx:12`

```diff
- import { formatCurrency } from '@/lib/utils'
+ import { formatCurrency } from '../lib/utils'
```

**Lines Changed:** 1

### Fix 5: Remove duplicate declaration
**File:** `types/next-auth.d.ts:5`

Removed duplicate `Session` interface declaration.

**Lines Changed:** 5 (removed)

## Step 3: Verify Build

```bash
npm run typecheck
✅ No type errors

npm run lint
✅ No linting errors

npm run build
✅ Build successful

npm run dev
✅ Dev server running without errors
```

## Summary

- **Total errors resolved:** 5
- **Total lines changed:** 11
- **Build status:** ✅ PASSING
- **Time to fix:** 3 minutes
- **Blocking issues:** 0 remaining

All builds now passing. Ready to continue development.
```

## Minimal Diff Strategy

**DO:**
- ✅ Add type annotations where missing
- ✅ Add null checks where needed
- ✅ Fix imports/exports
- ✅ Add missing dependencies
- ✅ Update type definitions
- ✅ Fix configuration files

**DON'T:**
- ❌ Refactor unrelated code
- ❌ Change architecture
- ❌ Rename variables/functions (unless causing error)
- ❌ Add new features
- ❌ Change logic flow (unless fixing error)
- ❌ Optimize performance
- ❌ Improve code style

## Common SellerFi Error Patterns

**1. React 19 Type Changes**
- Remove `FC` type, use direct props

**2. Prisma Client Types**
- Add explicit type annotations for Prisma queries

**3. NextAuth Session Types**
- Extend NextAuth types in `types/next-auth.d.ts`

**4. Server Actions**
- Ensure all server actions are async

**5. Null/Undefined**
- Use optional chaining or null checks

**6. Import Errors**
- Check tsconfig paths, use relative imports

**7. Stripe Types**
- Use official Stripe types for webhooks

**8. React Hooks**
- Move hooks to top level of component

## Integration with Other Commands

- Use `/build-fix` when build fails
- Use `/tdd` for test-driven development
- Use `/code-review` after fixes for quality check
- Use `/ship` for final pre-deployment checks

## Related Agents

This command invokes the `build-error-resolver` agent located at:
`.claude/agents/quality/build-error-resolver.md`

## Success Criteria

After `/build-fix`:
- ✅ `npm run typecheck` passes
- ✅ `npm run build` succeeds
- ✅ `npm run lint` passes
- ✅ No new errors introduced
- ✅ Minimal lines changed
- ✅ Development server runs
- ✅ Tests still passing
- ✅ No Chrome console errors

---

**Remember**: This command fixes errors ONLY. For refactoring, use `/refactor`. For new features, use `/plan` then `/tdd`. For security, use `/security-scan`. Keep fixes minimal and focused.
