#!/usr/bin/env tsx

/**
 * Job Worker Startup Script
 * 
 * Starts the background job worker for processing integration jobs
 * 
 * Usage:
 *   npm run worker
 *   or
 *   tsx scripts/run-worker.ts
 */

import { startWorker, getWorkerStats } from '@/lib/jobs/worker';
import { registerAllHandlers } from '@/lib/jobs/handlers';
import { getQueueStats } from '@/lib/jobs/queue';

console.log('='.repeat(60));
console.log('SellerFi Job Worker');
console.log('='.repeat(60));

// Register all handlers
registerAllHandlers();

// Start worker
startWorker();

// Log stats every 30 seconds
setInterval(async () => {
  const workerStats = getWorkerStats();
  const queueStats = await getQueueStats();

  console.log('\n' + '-'.repeat(60));
  console.log('Worker Stats:');
  console.log(`  Running: ${workerStats.isRunning}`);
  console.log(`  Active Jobs: ${workerStats.activeJobs}/${workerStats.maxConcurrentJobs}`);
  console.log(`  Registered Handlers: ${workerStats.registeredHandlers.length}`);
  console.log('\nQueue Stats:');
  console.log(`  Pending: ${queueStats.pending}`);
  console.log(`  Running: ${queueStats.running}`);
  console.log(`  Completed: ${queueStats.completed}`);
  console.log(`  Failed: ${queueStats.failed}`);
  console.log(`  Stuck: ${queueStats.stuck}`);
  console.log('-'.repeat(60));
}, 30000);

// Keep process alive
process.stdin.resume();
