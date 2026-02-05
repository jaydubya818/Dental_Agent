# Review

Perform a comprehensive code review of the current changes or specified files.

## Review Checklist

### Security
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] Authentication properly checked
- [ ] Authorization verified
- [ ] Input validation present
- [ ] Sensitive data not logged
- [ ] Environment variables used correctly

### Performance
- [ ] No N+1 database queries
- [ ] Proper database indexes
- [ ] No unnecessary re-renders
- [ ] Efficient algorithms
- [ ] Appropriate caching
- [ ] Lazy loading where needed

### Code Quality
- [ ] TypeScript types (no `any`)
- [ ] Proper error handling
- [ ] Edge cases covered
- [ ] DRY principle followed
- [ ] Clear variable names
- [ ] Functions are single-purpose
- [ ] Comments for complex logic

### Project Standards (from CLAUDE.md)
- [ ] Follows project conventions
- [ ] Matches code style
- [ ] Uses correct patterns
- [ ] No banned practices

## Output Format

Provide findings in this format:

### ✅ Security
- **Finding 1:** [description]
  - Location: `file.ts:line`
  - Severity: High/Medium/Low
  - Fix: [suggested fix]

### ✅ Performance
[Same format]

### ✅ Code Quality
[Same format]

### 💡 Suggestions
- [Improvement 1 with code example]
- [Improvement 2 with code example]

### 📊 Summary
- Issues found: X
- Critical: X
- Needs attention: X
- Minor suggestions: X
- Overall: [Pass/Needs Work]
