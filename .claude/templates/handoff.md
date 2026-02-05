# Handoff Document: [Feature/Task Name]

**Date:** [YYYY-MM-DD]
**Developer:** [Your Name]
**Session Duration:** [X hours]
**Branch:** [branch-name]

---

## 📋 Executive Summary

[1-2 sentence overview of what was accomplished]

---

## ✅ What I Did

### Completed Tasks
- [Task 1 - with file references]
- [Task 2 - with file references]
- [Task 3 - with file references]

### Files Created
- `path/to/new/file1.ts` - [Purpose]
- `path/to/new/file2.tsx` - [Purpose]

### Files Modified
- `path/to/existing/file1.ts` - [What changed]
- `path/to/existing/file2.tsx` - [What changed]

### Database Changes
- Added model: [ModelName]
- Added fields: [field1, field2]
- Created migration: [migration-name]

---

## 🎯 What Works

Current functionality:
- ✅ [Feature 1] - fully functional
- ✅ [Feature 2] - fully functional
- ✅ [Feature 3] - partially complete (see Known Issues)

**Testing Status:**
- Unit tests: [X/Y passing]
- E2E tests: [X/Y passing]
- Manual testing: [Completed / Not completed]

**Demo:**
[How to test/demo the feature]
```bash
npm run dev
# Navigate to: /path/to/feature
# Test: [steps to verify it works]
```

---

## 🚧 What's Left

### High Priority
- [ ] [Task 1] - Estimated: [time]
  - Reason: [why this is needed]
  - Approach: [how to do it]

- [ ] [Task 2] - Estimated: [time]
  - Reason: [why this is needed]
  - Approach: [how to do it]

### Medium Priority
- [ ] [Task 3]
- [ ] [Task 4]

### Nice-to-Have
- [ ] [Enhancement 1]
- [ ] [Enhancement 2]

---

## 🐛 Known Issues

### Issue #1: [Description]
- **Severity:** High / Medium / Low
- **Location:** `file.ts:line`
- **Symptoms:** [What happens]
- **Root cause:** [If known]
- **Workaround:** [If any]
- **Fix approach:** [Suggested solution]

### Issue #2: [Description]
[Same format]

---

## 💡 Key Decisions Made

### Decision 1: [Title]
**Context:** [Why we needed to decide]
**Options considered:**
- Option A: [pros/cons]
- Option B: [pros/cons]

**Decision:** Went with Option [A/B]
**Reasoning:** [Why]

### Decision 2: [Title]
[Same format]

---

## 🗺️ Next Steps

**Recommended order:**
1. [Next step 1] - Start here because [reason]
2. [Next step 2] - Then do this because [reason]
3. [Next step 3] - Finally [reason]

**Blockers:**
- [Blocker 1] - Waiting on [person/decision/dependency]
- [Blocker 2] - Need to [action item]

---

## 📚 Context for Next Session

### Technology Used
- [Framework/Library 1] - [Version] - [Purpose]
- [Framework/Library 2] - [Version] - [Purpose]

### Architecture Patterns
- Using [pattern name] for [purpose]
- State management via [approach]
- API structure follows [pattern]

### Important Files to Know
- `file1.ts` - [Purpose and key functions]
- `file2.ts` - [Purpose and key functions]
- `file3.ts` - [Purpose and key functions]

### External Dependencies
- API: [Name/URL] - [Purpose]
- Service: [Name] - [Purpose]
- Environment variables needed: [list]

### Gotchas / Things to Watch Out For
⚠️ [Gotcha 1 - what to be careful about]
⚠️ [Gotcha 2 - what to be careful about]

---

## 📖 Related Documentation

- Design doc: [link/path]
- API reference: [link/path]
- Figma mockups: [link]
- Related PR: [link]
- Related issues: [#123, #456]

---

## 🔍 How to Pick Up This Work

### Quick Start
```bash
# Pull latest
git checkout [branch-name]
git pull origin [branch-name]

# Install dependencies (if needed)
npm install

# Set up environment
# Copy .env.example to .env and fill in:
# - DATABASE_URL
# - [OTHER_VARS]

# Run migrations
npm run db:migrate

# Start dev server
npm run dev
```

### Read These Files First
1. `[key file 1]` - [Why it's important]
2. `[key file 2]` - [Why it's important]
3. `[key file 3]` - [Why it's important]

### Run These Commands
```bash
# See current state
npm run dev
# Open: http://localhost:3000/[path]

# Run tests
npm run test

# Check database
npm run db:studio
```

---

## 💬 Questions for Next Developer

- [ ] Should we [question about approach]?
- [ ] Do we need to [question about requirement]?
- [ ] How should we handle [edge case]?

---

## 📊 Stats

- **Commits:** [number]
- **Files changed:** [number]
- **Lines added:** +[number]
- **Lines removed:** -[number]
- **Tests added:** [number]

---

**End of Handoff**
