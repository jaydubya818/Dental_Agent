/**
 * Database Backup Script
 * 
 * Creates PostgreSQL backups and optionally uploads to S3/R2.
 * Run via cron or scheduled task for automated backups.
 * 
 * Usage:
 *   npx ts-node scripts/backup-database.ts
 *   npx ts-node scripts/backup-database.ts --upload
 */

import { exec } from "child_process"
import { promisify } from "util"
import * as fs from "fs"
import * as path from "path"

const execAsync = promisify(exec)

// Configuration
const config = {
  // Backup directory
  backupDir: process.env.BACKUP_DIR || "./backups",
  
  // Database URL (from environment)
  databaseUrl: process.env.DATABASE_URL || "",
  
  // S3/R2 Configuration (optional)
  s3Bucket: process.env.BACKUP_S3_BUCKET || "",
  s3Region: process.env.BACKUP_S3_REGION || "auto",
  s3Endpoint: process.env.BACKUP_S3_ENDPOINT || "", // For R2
  
  // Retention
  keepLocalBackups: parseInt(process.env.BACKUP_KEEP_LOCAL || "7"),
  keepRemoteBackups: parseInt(process.env.BACKUP_KEEP_REMOTE || "30"),
}

interface BackupResult {
  success: boolean
  filename: string
  path: string
  size: number
  duration: number
  uploaded?: boolean
  error?: string
}

async function createBackup(): Promise<BackupResult> {
  const startTime = Date.now()
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  const filename = `sellerfin-backup-${timestamp}.sql.gz`
  const backupPath = path.join(config.backupDir, filename)

  console.log(`[Backup] Starting database backup...`)
  console.log(`[Backup] Output: ${backupPath}`)

  try {
    // Ensure backup directory exists
    if (!fs.existsSync(config.backupDir)) {
      fs.mkdirSync(config.backupDir, { recursive: true })
    }

    // Parse database URL
    const dbUrl = new URL(config.databaseUrl)
    const host = dbUrl.hostname
    const port = dbUrl.port || "5432"
    const database = dbUrl.pathname.slice(1).split("?")[0]
    const username = dbUrl.username
    const password = dbUrl.password

    // Set password via environment variable for security
    process.env.PGPASSWORD = password

    // Run pg_dump with compression
    const command = `pg_dump -h ${host} -p ${port} -U ${username} -d ${database} --no-owner --no-acl | gzip > ${backupPath}`
    
    await execAsync(command, {
      env: { ...process.env, PGPASSWORD: password },
    })

    // Get file size
    const stats = fs.statSync(backupPath)
    const duration = Date.now() - startTime

    console.log(`[Backup] Completed in ${duration}ms`)
    console.log(`[Backup] Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`)

    return {
      success: true,
      filename,
      path: backupPath,
      size: stats.size,
      duration,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error(`[Backup] Failed:`, errorMessage)
    
    return {
      success: false,
      filename,
      path: backupPath,
      size: 0,
      duration: Date.now() - startTime,
      error: errorMessage,
    }
  }
}

async function uploadToS3(backupResult: BackupResult): Promise<boolean> {
  if (!config.s3Bucket) {
    console.log("[Backup] S3 upload skipped - no bucket configured")
    return false
  }

  console.log(`[Backup] Uploading to S3: ${config.s3Bucket}`)

  try {
    // Use AWS CLI for upload (requires aws cli installed)
    let command = `aws s3 cp ${backupResult.path} s3://${config.s3Bucket}/backups/${backupResult.filename}`
    
    // Add endpoint for R2
    if (config.s3Endpoint) {
      command += ` --endpoint-url ${config.s3Endpoint}`
    }

    await execAsync(command)
    console.log("[Backup] Upload complete")
    return true
  } catch (error) {
    console.error("[Backup] Upload failed:", error)
    return false
  }
}

async function cleanupOldBackups(): Promise<void> {
  console.log(`[Backup] Cleaning up old backups (keeping ${config.keepLocalBackups})...`)

  try {
    const files = fs.readdirSync(config.backupDir)
      .filter(f => f.startsWith("sellerfin-backup-") && f.endsWith(".sql.gz"))
      .map(f => ({
        name: f,
        path: path.join(config.backupDir, f),
        time: fs.statSync(path.join(config.backupDir, f)).mtime.getTime(),
      }))
      .sort((a, b) => b.time - a.time)

    // Keep only the most recent backups
    const toDelete = files.slice(config.keepLocalBackups)
    
    for (const file of toDelete) {
      fs.unlinkSync(file.path)
      console.log(`[Backup] Deleted old backup: ${file.name}`)
    }

    console.log(`[Backup] Cleanup complete. Removed ${toDelete.length} old backups.`)
  } catch (error) {
    console.error("[Backup] Cleanup failed:", error)
  }
}

async function main() {
  console.log("=".repeat(50))
  console.log("[Backup] SellerFin Database Backup")
  console.log(`[Backup] Started at: ${new Date().toISOString()}`)
  console.log("=".repeat(50))

  // Validate configuration
  if (!config.databaseUrl) {
    console.error("[Backup] ERROR: DATABASE_URL not set")
    process.exit(1)
  }

  // Create backup
  const result = await createBackup()

  if (!result.success) {
    console.error("[Backup] Backup failed!")
    process.exit(1)
  }

  // Upload if requested
  const shouldUpload = process.argv.includes("--upload")
  if (shouldUpload) {
    result.uploaded = await uploadToS3(result)
  }

  // Cleanup old backups
  await cleanupOldBackups()

  // Summary
  console.log("=".repeat(50))
  console.log("[Backup] Summary:")
  console.log(`  - File: ${result.filename}`)
  console.log(`  - Size: ${(result.size / 1024 / 1024).toFixed(2)} MB`)
  console.log(`  - Duration: ${result.duration}ms`)
  console.log(`  - Uploaded: ${result.uploaded ? "Yes" : "No"}`)
  console.log("=".repeat(50))

  // Write backup log
  const logEntry = {
    timestamp: new Date().toISOString(),
    ...result,
  }
  
  const logPath = path.join(config.backupDir, "backup-log.json")
  let logs: typeof logEntry[] = []
  
  if (fs.existsSync(logPath)) {
    logs = JSON.parse(fs.readFileSync(logPath, "utf-8"))
  }
  
  logs.push(logEntry)
  logs = logs.slice(-100) // Keep last 100 entries
  
  fs.writeFileSync(logPath, JSON.stringify(logs, null, 2))
}

main().catch(console.error)
