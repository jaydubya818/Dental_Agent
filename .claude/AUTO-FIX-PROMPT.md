# 🚀 AUTO-FIX EVERYTHING PROMPT

Copy this prompt to run comprehensive validation, debugging, and auto-fixing:

---

## **THE PROMPT**:

```
Run the auto-fix everything script - scan my entire codebase for security vulnerabilities, financial calculation bugs, database safety issues, and TypeScript errors. Auto-fix everything possible and generate a detailed report of what was fixed vs what needs manual review.
```

---

## **WHAT IT DOES**:

✅ **Scans your entire codebase** (50+ files automatically)
✅ **Detects 4 types of issues**:
   - 🔒 **Security**: Hardcoded secrets, API keys, credentials
   - 💰 **Financial**: Float arithmetic bugs, missing precision
   - 🗄️ **Database**: SQL injection, missing transactions
   - 🔷 **TypeScript**: Type errors, missing imports

✅ **Auto-fixes issues**:
   - Comments out hardcoded secrets with TODO
   - Adds proper money rounding (`Math.round(x * 100) / 100`)
   - Replaces hardcoded DATABASE_URL with env vars
   - Fixes common TypeScript import issues

✅ **Generates comprehensive report**:
   - Success rate percentage
   - Files modified (with .bak backups)
   - Manual review checklist
   - Next steps for deployment

---

## **ALTERNATIVE PROMPTS**:

### **Quick Single File Fix:**
```
Quick-fix this file: [filename] - run security, financial, and database validators then auto-repair any issues found
```

### **Security-Only Sweep:**
```
Security audit and auto-fix - scan for hardcoded secrets, API keys, and credentials, then automatically fix them
```

### **Financial Compliance Check:**
```
Financial validator sweep - check all payment/pricing code for float precision issues and auto-fix money calculations
```

### **Database Safety Audit:**
```
Database safety validation - scan for SQL injection risks, missing transactions, and auto-fix database operations
```

---

## **SCRIPT LOCATIONS**:

- **Full Auto-Fix**: `./.claude/auto-fix-everything.sh`
- **Quick Single File**: `./.claude/quick-fix.sh [filename]`

---

## **EXAMPLE USAGE**:

1. **Full Codebase Scan:**
   ```
   Run the auto-fix everything script
   ```

2. **Single File Quick Fix:**
   ```
   Quick-fix this file: app/api/payment/route.ts
   ```

3. **After Making Changes:**
   ```
   Re-run validation to confirm all issues are fixed
   ```

---

**🎯 RESULT**: Your code will be automatically validated, debugged, and fixed with enterprise-grade security, financial precision, and database safety! 🚀