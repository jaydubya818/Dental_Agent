-- SQL Script to Check for Unauthorized Access
-- Run this against your production database to review activity for the exposed account

-- ============================================
-- 1. Find the User ID for the Exposed Account
-- ============================================
SELECT 
  id,
  email,
  name,
  role,
  "createdAt",
  "lastLoginAt"
FROM "User"
WHERE email = 'jaydubya818a@yahoo.com';

-- ============================================
-- 2. Review All Activity Since Jan 1, 2026
-- ============================================
-- Replace 'USER_ID_HERE' with the actual ID from query above
SELECT 
  id,
  action,
  "userId",
  "entityType",
  "entityId",
  details,
  "ipAddress",
  "userAgent",
  "createdAt"
FROM "AuditLog"
WHERE "userId" = 'USER_ID_HERE'
  AND "createdAt" >= '2026-01-01'
ORDER BY "createdAt" DESC;

-- ============================================
-- 3. Check for Suspicious Login Patterns
-- ============================================
-- Look for logins from unusual locations or times
SELECT 
  "createdAt",
  "ipAddress",
  "userAgent",
  action,
  details
FROM "AuditLog"
WHERE "userId" = 'USER_ID_HERE'
  AND action IN ('USER_LOGIN', 'USER_LOGIN_FAILED', 'PASSWORD_CHANGED')
  AND "createdAt" >= '2026-01-01'
ORDER BY "createdAt" DESC;

-- ============================================
-- 4. Check for Data Export or Deletion
-- ============================================
-- Look for potentially malicious actions
SELECT 
  "createdAt",
  action,
  "entityType",
  "entityId",
  details,
  "ipAddress"
FROM "AuditLog"
WHERE "userId" = 'USER_ID_HERE'
  AND action IN (
    'USER_DELETED',
    'LISTING_DELETED',
    'DEALROOM_DELETED',
    'DATA_EXPORTED',
    'BULK_DELETE',
    'PERMISSION_CHANGED'
  )
  AND "createdAt" >= '2026-01-01'
ORDER BY "createdAt" DESC;

-- ============================================
-- 5. Review Recent Password Changes
-- ============================================
-- Check if password was changed recently (could indicate compromise)
SELECT 
  "createdAt",
  action,
  details,
  "ipAddress",
  "userAgent"
FROM "AuditLog"
WHERE "userId" = 'USER_ID_HERE'
  AND action = 'PASSWORD_CHANGED'
ORDER BY "createdAt" DESC
LIMIT 10;

-- ============================================
-- 6. Check for Failed Login Attempts
-- ============================================
-- Multiple failed attempts could indicate brute force
SELECT 
  "createdAt",
  "ipAddress",
  "userAgent",
  details
FROM "AuditLog"
WHERE "userId" = 'USER_ID_HERE'
  AND action = 'USER_LOGIN_FAILED'
  AND "createdAt" >= '2026-01-01'
ORDER BY "createdAt" DESC;

-- ============================================
-- 7. Summary Statistics
-- ============================================
-- Get a count of actions by type
SELECT 
  action,
  COUNT(*) as count,
  MIN("createdAt") as first_occurrence,
  MAX("createdAt") as last_occurrence
FROM "AuditLog"
WHERE "userId" = 'USER_ID_HERE'
  AND "createdAt" >= '2026-01-01'
GROUP BY action
ORDER BY count DESC;

-- ============================================
-- INSTRUCTIONS
-- ============================================
-- 1. Connect to your production database:
--    psql $DATABASE_URL
--
-- 2. Run query #1 to get the user ID
--
-- 3. Replace 'USER_ID_HERE' in queries 2-7 with the actual ID
--
-- 4. Run each query and review the results
--
-- 5. Look for:
--    - Logins from unfamiliar IP addresses
--    - Activity during unusual hours
--    - Bulk deletions or data exports
--    - Failed login attempts (potential brute force)
--    - Unexpected permission changes
--
-- 6. Document any suspicious activity in the incident report
--
-- 7. If unauthorized access is confirmed:
--    - Immediately disable the account
--    - Review what data was accessed
--    - Notify affected users if necessary
--    - Contact security team
