-- ═══════════════════════════════════════════════════════════
-- SellerFi Production Health Check Queries
-- Phase 2: Verified Revenue + Trust Score Monitoring
-- ═══════════════════════════════════════════════════════════

-- Run these queries daily to monitor system health
-- Alert on anomalies (see thresholds in POST_DEPLOYMENT_EXECUTION.md)

-- ═══════════════════════════════════════════════════════════
-- VERIFIED METRICS HEALTH
-- ═══════════════════════════════════════════════════════════

-- Active integrations by provider
SELECT 
  provider,
  status,
  COUNT(*) as count
FROM "RevenueIntegrationAccount"
GROUP BY provider, status
ORDER BY provider, status;

-- Verified metrics by source and status
SELECT 
  source,
  status,
  COUNT(*) as count,
  AVG(confidence) as avg_confidence
FROM "VerifiedMetric"
WHERE type = 'REVENUE'
GROUP BY source, status
ORDER BY source, status;

-- Metrics expiring soon (next 7 days)
SELECT 
  COUNT(*) as expiring_soon,
  source
FROM "VerifiedMetric"
WHERE status = 'VERIFIED'
  AND "expiresAt" > NOW()
  AND "expiresAt" < NOW() + INTERVAL '7 days'
GROUP BY source;

-- Metrics already expired
SELECT 
  COUNT(*) as expired,
  source
FROM "VerifiedMetric"
WHERE status = 'VERIFIED'
  AND "expiresAt" < NOW()
GROUP BY source;

-- ═══════════════════════════════════════════════════════════
-- JOB QUEUE HEALTH
-- ═══════════════════════════════════════════════════════════

-- Job status breakdown (last 24 hours)
SELECT 
  type,
  status,
  COUNT(*) as count,
  AVG(EXTRACT(EPOCH FROM ("completedAt" - "createdAt"))) as avg_duration_seconds
FROM "IntegrationJob"
WHERE "createdAt" > NOW() - INTERVAL '24 hours'
GROUP BY type, status
ORDER BY type, status;

-- Job failure rate (last 24 hours)
SELECT 
  type,
  COUNT(*) as total,
  SUM(CASE WHEN status = 'FAILED' THEN 1 ELSE 0 END) as failed,
  ROUND(100.0 * SUM(CASE WHEN status = 'FAILED' THEN 1 ELSE 0 END) / COUNT(*), 2) as failure_rate_pct
FROM "IntegrationJob"
WHERE "createdAt" > NOW() - INTERVAL '24 hours'
GROUP BY type
HAVING COUNT(*) > 0
ORDER BY failure_rate_pct DESC;

-- Failed jobs (last 24 hours)
SELECT 
  id,
  type,
  "createdAt",
  error
FROM "IntegrationJob"
WHERE status = 'FAILED'
  AND "createdAt" > NOW() - INTERVAL '24 hours'
ORDER BY "createdAt" DESC
LIMIT 10;

-- Stuck jobs (running > 10 minutes)
SELECT 
  id,
  type,
  "createdAt",
  "startedAt",
  EXTRACT(EPOCH FROM (NOW() - "startedAt")) as running_seconds
FROM "IntegrationJob"
WHERE status = 'RUNNING'
  AND "startedAt" < NOW() - INTERVAL '10 minutes'
ORDER BY "startedAt" ASC;

-- Pending jobs (waiting to run)
SELECT 
  type,
  COUNT(*) as pending_count,
  MIN("createdAt") as oldest_pending
FROM "IntegrationJob"
WHERE status = 'PENDING'
GROUP BY type
ORDER BY pending_count DESC;

-- ═══════════════════════════════════════════════════════════
-- TRUST SCORE HEALTH
-- ═══════════════════════════════════════════════════════════

-- Trust score distribution
SELECT 
  FLOOR("trustScore"/10)*10 as score_bucket,
  COUNT(*) as count,
  AVG(confidence) as avg_confidence
FROM "ListingTrustSnapshot"
GROUP BY score_bucket
ORDER BY score_bucket;

-- Listings with verified revenue
SELECT 
  COUNT(DISTINCT l.id) as total_listings,
  COUNT(DISTINCT CASE WHEN vm.id IS NOT NULL THEN l.id END) as with_verified_revenue,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN vm.id IS NOT NULL THEN l.id END) / NULLIF(COUNT(DISTINCT l.id), 0), 2) as percentage
FROM "Listing" l
LEFT JOIN "VerifiedMetric" vm ON vm."listingId" = l.id 
  AND vm.type = 'REVENUE' 
  AND vm.status = 'VERIFIED'
  AND vm."expiresAt" > NOW();

-- Trust score recompute failures (last 24 hours)
SELECT 
  COUNT(*) as failed_recomputes
FROM "IntegrationJob"
WHERE type = 'TRUST_SCORE_RECOMPUTE'
  AND status = 'FAILED'
  AND "createdAt" > NOW() - INTERVAL '24 hours';

-- Listings without trust scores
SELECT 
  COUNT(DISTINCT l.id) as listings_without_trust_score
FROM "Listing" l
LEFT JOIN "ListingTrustSnapshot" lts ON lts."listingId" = l.id
WHERE lts.id IS NULL
  AND l.status = 'PUBLISHED';

-- ═══════════════════════════════════════════════════════════
-- USER ENGAGEMENT
-- ═══════════════════════════════════════════════════════════

-- Sellers with integrations
SELECT 
  COUNT(DISTINCT u.id) as total_sellers,
  COUNT(DISTINCT CASE WHEN ria.id IS NOT NULL THEN u.id END) as with_integrations,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN ria.id IS NOT NULL THEN u.id END) / NULLIF(COUNT(DISTINCT u.id), 0), 2) as percentage
FROM "User" u
LEFT JOIN "RevenueIntegrationAccount" ria ON ria."userId" = u.id AND ria.status = 'ACTIVE'
WHERE u.role = 'SELLER';

-- Integration adoption by provider
SELECT 
  provider,
  COUNT(DISTINCT "userId") as unique_users,
  COUNT(*) as total_connections
FROM "RevenueIntegrationAccount"
WHERE status = 'ACTIVE'
GROUP BY provider
ORDER BY unique_users DESC;

-- New integrations (last 7 days)
SELECT 
  DATE("createdAt") as date,
  provider,
  COUNT(*) as new_connections
FROM "RevenueIntegrationAccount"
WHERE "createdAt" > NOW() - INTERVAL '7 days'
GROUP BY DATE("createdAt"), provider
ORDER BY date DESC, provider;

-- ═══════════════════════════════════════════════════════════
-- SYSTEM PERFORMANCE
-- ═══════════════════════════════════════════════════════════

-- Average job duration by type (last 7 days)
SELECT 
  type,
  COUNT(*) as completed_jobs,
  AVG(EXTRACT(EPOCH FROM ("completedAt" - "createdAt"))) as avg_duration_seconds,
  MIN(EXTRACT(EPOCH FROM ("completedAt" - "createdAt"))) as min_duration_seconds,
  MAX(EXTRACT(EPOCH FROM ("completedAt" - "createdAt"))) as max_duration_seconds
FROM "IntegrationJob"
WHERE status = 'COMPLETED'
  AND "completedAt" IS NOT NULL
  AND "createdAt" > NOW() - INTERVAL '7 days'
GROUP BY type
ORDER BY avg_duration_seconds DESC;

-- Database table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 10;

-- ═══════════════════════════════════════════════════════════
-- ALERT THRESHOLDS
-- ═══════════════════════════════════════════════════════════

-- 🚨 CRITICAL ALERTS (investigate immediately)
-- - Job failure rate > 10% in last hour
-- - Stuck jobs > 5 running > 10 minutes
-- - Trust score recompute failures > 0
-- - Integration errors > 3 in last hour

-- ⚠️ WARNING ALERTS (monitor closely)
-- - Metrics expiring in next 7 days > 10
-- - Pending jobs > 20
-- - Listings without trust scores > 5%

-- ℹ️ INFO ALERTS (track trends)
-- - New integrations per day
-- - Average job duration trends
-- - Trust score distribution changes
