# Ship

Prepare code for production deployment.

## Pre-Ship Checklist

### Code Quality
- [ ] Run linter: `npm run lint`
- [ ] Fix all linting errors
- [ ] Remove console.logs and debugging code
- [ ] Remove commented-out code
- [ ] Check for TODO comments

### Testing
- [ ] Run type check: `npx tsc --noEmit`
- [ ] Run unit tests: `npm run test`
- [ ] Run E2E tests: `npm run test:e2e`
- [ ] All tests must be passing (100%)
- [ ] Add tests for new features
- [ ] Manual smoke test in browser

### Security
- [ ] No hardcoded secrets
- [ ] Environment variables properly set
- [ ] No exposed API keys
- [ ] Authentication/authorization verified
- [ ] Input validation in place

### Performance
- [ ] Check bundle size: `npm run build`
- [ ] No performance regressions
- [ ] Images optimized
- [ ] No unnecessary dependencies

### Documentation
- [ ] Update README if needed
- [ ] Update API docs if endpoints changed
- [ ] Add migration notes if database changed
- [ ] Update CHANGELOG.md

### Git Operations
1. Check current branch: `git branch --show-current`
2. Ensure not on main branch
3. View changes: `git status` and `git diff`
4. Stage changes: `git add .`
5. Create commit with conventional commit message:
   ```
   type(scope): subject

   - Detail 1
   - Detail 2

   Breaking changes: [if any]
   ```
6. Push to remote: `git push origin [branch-name]`

### Create Pull Request
Use GitHub CLI to create PR:
```bash
gh pr create --title "Title" --body "$(cat <<'EOF'
## Summary
- Change 1
- Change 2

## Testing
- [ ] Manual testing completed
- [ ] All automated tests passing
- [ ] Reviewed by [reviewer]

## Screenshots
[if UI changes]

## Breaking Changes
[if any]
EOF
)"
```

### Deployment
- [ ] Deploy to staging: `npm run deploy:staging`
- [ ] Smoke test staging environment
- [ ] Check logs for errors
- [ ] Verify database migrations ran
- [ ] Test critical user flows

## Final Report

Provide deployment summary:

🚀 **Deployment Status**
- Branch: [branch-name]
- Commit: [short-sha]
- Environment: Staging
- URL: [staging-url]
- Status: ✅ Success / ❌ Failed

📊 **Changes**
- Files changed: X
- Lines added: +X
- Lines removed: -X

✅ **Checks Passed**
- Linting: Pass
- Type check: Pass
- Tests: X/X passing
- Build: Success

🔗 **Links**
- PR: [url]
- Staging: [url]
- Build logs: [url]

✨ **Ready for Production**
