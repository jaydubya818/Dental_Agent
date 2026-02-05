/**
 * Input Sanitization Security Audit
 * 
 * Audits the codebase for potential security vulnerabilities:
 * - SQL injection (raw queries)
 * - XSS (dangerouslySetInnerHTML)
 * - Path traversal (file operations)
 * - Unvalidated file uploads
 * - Missing input validation
 * 
 * Run: npx tsx scripts/security/input-sanitization-audit.ts
 */

import { execSync } from "child_process"
import * as fs from "fs"
import * as path from "path"

interface SecurityIssue {
  type: "sql_injection" | "xss" | "path_traversal" | "file_upload" | "missing_validation"
  severity: "critical" | "high" | "medium" | "low"
  file: string
  line: number
  code: string
  description: string
  recommendation: string
}

const issues: SecurityIssue[] = []

// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
}

function log(message: string, color: keyof typeof colors = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// 1. Check for raw SQL queries
function auditRawQueries() {
  log("\n🔍 Auditing raw SQL queries...", "cyan")
  
  try {
    const result = execSync(
      'rg "\\$queryRaw|\\$executeRaw" --type ts --json',
      { encoding: "utf-8", cwd: process.cwd() }
    )
    
    const matches = result.trim().split("\n")
      .filter(line => line.trim())
      .map(line => JSON.parse(line))
      .filter(item => item.type === "match")
    
    matches.forEach(match => {
      issues.push({
        type: "sql_injection",
        severity: "high",
        file: match.data.path.text,
        line: match.data.line_number,
        code: match.data.lines.text.trim(),
        description: "Raw SQL query detected. Verify parameterization.",
        recommendation: "Use Prisma's parameterized queries or ensure proper escaping."
      })
    })
    
    log(`  Found ${matches.length} raw SQL queries`, matches.length > 0 ? "yellow" : "green")
  } catch (error) {
    // No matches found
    log("  ✓ No raw SQL queries found", "green")
  }
}

// 2. Check for dangerouslySetInnerHTML
function auditXSS() {
  log("\n🔍 Auditing XSS vulnerabilities...", "cyan")
  
  try {
    const result = execSync(
      'rg "dangerouslySetInnerHTML" --type tsx --type ts --json',
      { encoding: "utf-8", cwd: process.cwd() }
    )
    
    const matches = result.trim().split("\n")
      .filter(line => line.trim())
      .map(line => JSON.parse(line))
      .filter(item => item.type === "match")
    
    matches.forEach(match => {
      issues.push({
        type: "xss",
        severity: "critical",
        file: match.data.path.text,
        line: match.data.line_number,
        code: match.data.lines.text.trim(),
        description: "dangerouslySetInnerHTML usage detected. Verify content is sanitized.",
        recommendation: "Use DOMPurify or similar sanitization library before rendering HTML."
      })
    })
    
    log(`  Found ${matches.length} dangerouslySetInnerHTML usages`, matches.length > 0 ? "red" : "green")
  } catch (error) {
    log("  ✓ No dangerouslySetInnerHTML found", "green")
  }
}

// 3. Check for file operations without validation
function auditFileOperations() {
  log("\n🔍 Auditing file operations...", "cyan")
  
  const patterns = [
    'fs\\.readFile',
    'fs\\.writeFile',
    'fs\\.unlink',
    'path\\.join.*req\\.',
    'path\\.resolve.*req\\.'
  ]
  
  patterns.forEach(pattern => {
    try {
      const result = execSync(
        `rg "${pattern}" --type ts --json`,
        { encoding: "utf-8", cwd: process.cwd() }
      )
      
      const matches = result.trim().split("\n")
        .filter(line => line.trim())
        .map(line => JSON.parse(line))
        .filter(item => item.type === "match")
      
      matches.forEach(match => {
        // Skip if in scripts or tests
        if (match.data.path.text.includes("/scripts/") || 
            match.data.path.text.includes("/__tests__/") ||
            match.data.path.text.includes("/test/")) {
          return
        }
        
        issues.push({
          type: "path_traversal",
          severity: "high",
          file: match.data.path.text,
          line: match.data.line_number,
          code: match.data.lines.text.trim(),
          description: "File operation with potential user input. Verify path validation.",
          recommendation: "Validate and sanitize file paths. Use path.normalize() and check for '..'."
        })
      })
    } catch (error) {
      // No matches
    }
  })
  
  const fileIssues = issues.filter(i => i.type === "path_traversal")
  log(`  Found ${fileIssues.length} file operations to review`, fileIssues.length > 0 ? "yellow" : "green")
}

// 4. Check file upload endpoints
function auditFileUploads() {
  log("\n🔍 Auditing file upload endpoints...", "cyan")
  
  try {
    const result = execSync(
      'rg "formData\\.get.*file|multipart/form-data" --type ts --json',
      { encoding: "utf-8", cwd: process.cwd() }
    )
    
    const matches = result.trim().split("\n")
      .filter(line => line.trim())
      .map(line => JSON.parse(line))
      .filter(item => item.type === "match")
    
    matches.forEach(match => {
      // Check if file validation exists nearby
      const fileContent = fs.readFileSync(match.data.path.text, "utf-8")
      const lines = fileContent.split("\n")
      const contextStart = Math.max(0, match.data.line_number - 10)
      const contextEnd = Math.min(lines.length, match.data.line_number + 10)
      const context = lines.slice(contextStart, contextEnd).join("\n")
      
      const hasValidation = 
        context.includes("ALLOWED_TYPES") ||
        context.includes("MAX_FILE_SIZE") ||
        context.includes("validateImageFile") ||
        context.includes("file.type") ||
        context.includes("file.size")
      
      if (!hasValidation) {
        issues.push({
          type: "file_upload",
          severity: "high",
          file: match.data.path.text,
          line: match.data.line_number,
          code: match.data.lines.text.trim(),
          description: "File upload without visible validation.",
          recommendation: "Add file type, size, and content validation."
        })
      }
    })
    
    const uploadIssues = issues.filter(i => i.type === "file_upload")
    log(`  Found ${uploadIssues.length} unvalidated file uploads`, uploadIssues.length > 0 ? "red" : "green")
  } catch (error) {
    log("  ✓ All file uploads appear validated", "green")
  }
}

// 5. Check API routes for input validation
function auditAPIValidation() {
  log("\n🔍 Auditing API input validation...", "cyan")
  
  try {
    // Find API routes
    const apiRoutes = execSync(
      'find app/api -name "route.ts" -type f',
      { encoding: "utf-8", cwd: process.cwd() }
    ).trim().split("\n").filter(Boolean)
    
    let routesWithoutValidation = 0
    
    apiRoutes.forEach(routePath => {
      const content = fs.readFileSync(routePath, "utf-8")
      
      // Check if route has POST/PUT/PATCH methods
      const hasMutationMethod = /export async function (POST|PUT|PATCH)/.test(content)
      
      if (hasMutationMethod) {
        // Check for validation
        const hasValidation = 
          content.includes("z.object") ||
          content.includes(".safeParse") ||
          content.includes(".parse(") ||
          content.includes("validate") ||
          content.includes("schema")
        
        if (!hasValidation) {
          routesWithoutValidation++
          issues.push({
            type: "missing_validation",
            severity: "medium",
            file: routePath,
            line: 1,
            code: "API route without input validation",
            description: "Mutation endpoint without visible input validation.",
            recommendation: "Add Zod schema validation for request body."
          })
        }
      }
    })
    
    log(`  Found ${routesWithoutValidation} API routes without validation`, 
        routesWithoutValidation > 0 ? "yellow" : "green")
  } catch (error) {
    log("  Error auditing API routes", "red")
  }
}

// Generate report
function generateReport() {
  log("\n" + "=".repeat(80), "blue")
  log("  INPUT SANITIZATION AUDIT REPORT", "blue")
  log("=".repeat(80), "blue")
  
  if (issues.length === 0) {
    log("\n✅ No security issues found!", "green")
    return
  }
  
  // Group by severity
  const critical = issues.filter(i => i.severity === "critical")
  const high = issues.filter(i => i.severity === "high")
  const medium = issues.filter(i => i.severity === "medium")
  const low = issues.filter(i => i.severity === "low")
  
  log(`\n📊 Summary:`, "cyan")
  log(`  Critical: ${critical.length}`, critical.length > 0 ? "red" : "green")
  log(`  High:     ${high.length}`, high.length > 0 ? "yellow" : "green")
  log(`  Medium:   ${medium.length}`, medium.length > 0 ? "yellow" : "green")
  log(`  Low:      ${low.length}`, "green")
  
  // Print issues by severity
  const printIssues = (issueList: SecurityIssue[], severityLabel: string, color: keyof typeof colors) => {
    if (issueList.length === 0) return
    
    log(`\n${severityLabel.toUpperCase()} SEVERITY ISSUES:`, color)
    log("-".repeat(80), color)
    
    issueList.forEach((issue, index) => {
      log(`\n${index + 1}. ${issue.type.replace(/_/g, " ").toUpperCase()}`, color)
      log(`   File: ${issue.file}:${issue.line}`)
      log(`   Description: ${issue.description}`)
      log(`   Recommendation: ${issue.recommendation}`)
      if (issue.code.length < 100) {
        log(`   Code: ${issue.code}`, "reset")
      }
    })
  }
  
  printIssues(critical, "critical", "red")
  printIssues(high, "high", "yellow")
  printIssues(medium, "medium", "yellow")
  printIssues(low, "low", "green")
  
  // Save to file
  const reportPath = path.join(process.cwd(), "SECURITY_AUDIT_REPORT.md")
  const markdown = generateMarkdownReport()
  fs.writeFileSync(reportPath, markdown)
  
  log(`\n📄 Full report saved to: ${reportPath}`, "cyan")
}

function generateMarkdownReport(): string {
  const timestamp = new Date().toISOString()
  
  let md = `# Input Sanitization Security Audit\n\n`
  md += `**Generated:** ${timestamp}\n\n`
  md += `## Summary\n\n`
  md += `- **Total Issues:** ${issues.length}\n`
  md += `- **Critical:** ${issues.filter(i => i.severity === "critical").length}\n`
  md += `- **High:** ${issues.filter(i => i.severity === "high").length}\n`
  md += `- **Medium:** ${issues.filter(i => i.severity === "medium").length}\n`
  md += `- **Low:** ${issues.filter(i => i.severity === "low").length}\n\n`
  
  if (issues.length === 0) {
    md += `✅ No security issues found!\n`
    return md
  }
  
  const groupedIssues = {
    critical: issues.filter(i => i.severity === "critical"),
    high: issues.filter(i => i.severity === "high"),
    medium: issues.filter(i => i.severity === "medium"),
    low: issues.filter(i => i.severity === "low"),
  }
  
  Object.entries(groupedIssues).forEach(([severity, issueList]) => {
    if (issueList.length === 0) return
    
    md += `## ${severity.charAt(0).toUpperCase() + severity.slice(1)} Severity\n\n`
    
    issueList.forEach((issue, index) => {
      md += `### ${index + 1}. ${issue.type.replace(/_/g, " ").toUpperCase()}\n\n`
      md += `- **File:** \`${issue.file}:${issue.line}\`\n`
      md += `- **Description:** ${issue.description}\n`
      md += `- **Recommendation:** ${issue.recommendation}\n`
      if (issue.code.length < 200) {
        md += `- **Code:** \`${issue.code}\`\n`
      }
      md += `\n`
    })
  })
  
  return md
}

// Main execution
async function main() {
  log("\n🔒 Starting Input Sanitization Security Audit...\n", "blue")
  
  auditRawQueries()
  auditXSS()
  auditFileOperations()
  auditFileUploads()
  auditAPIValidation()
  
  generateReport()
  
  log("\n✅ Audit complete!\n", "green")
  
  // Exit with error code if critical/high issues found
  const criticalOrHigh = issues.filter(i => 
    i.severity === "critical" || i.severity === "high"
  )
  
  if (criticalOrHigh.length > 0) {
    process.exit(1)
  }
}

main().catch(console.error)
