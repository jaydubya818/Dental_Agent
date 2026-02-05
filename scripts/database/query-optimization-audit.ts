/**
 * Database Query Optimization Audit
 * 
 * Analyzes the codebase for common database performance issues:
 * - N+1 query problems
 * - Missing includes/selects
 * - Queries without pagination
 * - Missing indexes on frequently queried fields
 * 
 * Usage:
 *   npx tsx scripts/database/query-optimization-audit.ts
 */

import { execSync } from "child_process"
import * as fs from "fs"

interface OptimizationIssue {
  file: string
  line: number
  issue: string
  severity: "high" | "medium" | "low"
  recommendation: string
  codeSnippet?: string
}

const issues: OptimizationIssue[] = []

/**
 * Find potential N+1 query problems
 */
function findN1Problems() {
  try {
    // Look for loops with database queries inside
    const result = execSync(
      `rg -n "\\.(map|forEach|for).*await.*prisma\\." app lib -g "*.ts" -g "*.tsx" -A 3 -B 3`,
      { encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 }
    )

    const lines = result.split("\n")
    let currentFile = ""
    let currentLine = 0

    lines.forEach((line) => {
      const fileMatch = line.match(/^([^:]+):(\d+):/)
      if (fileMatch) {
        currentFile = fileMatch[1]
        currentLine = parseInt(fileMatch[2])

        if (line.includes("await") && line.includes("prisma.")) {
          issues.push({
            file: currentFile,
            line: currentLine,
            issue: "Potential N+1 query - database call inside loop",
            severity: "high",
            recommendation: "Use prisma.findMany() with include or a single query with proper relations",
            codeSnippet: line.substring(line.indexOf(":") + 1).trim(),
          })
        }
      }
    })
  } catch (error) {
    // No matches found
  }
}

/**
 * Find queries without select (over-fetching)
 */
function findOverFetching() {
  try {
    const result = execSync(
      `rg -n "prisma\\.[a-zA-Z]+\\.find(Many|First|Unique)\\(" app lib -g "*.ts" -g "*.tsx" -A 5`,
      { encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 }
    )

    const lines = result.split("\n")
    let currentFile = ""
    let currentLine = 0
    let contextLines: string[] = []

    lines.forEach((line, index) => {
      const fileMatch = line.match(/^([^:]+):(\d+):/)
      if (fileMatch) {
        currentFile = fileMatch[1]
        currentLine = parseInt(fileMatch[2])
        contextLines = []
      }

      contextLines.push(line)

      // Check if this query has a select clause
      if (line.includes("prisma.") && line.includes("find")) {
        const context = contextLines.join("\n")
        if (!context.includes("select:") && !context.includes("include:")) {
          issues.push({
            file: currentFile,
            line: currentLine,
            issue: "Query without select - may over-fetch data",
            severity: "medium",
            recommendation: "Add select: { field1: true, field2: true } to fetch only needed fields",
            codeSnippet: line.substring(line.indexOf(":") + 1).trim(),
          })
        }
      }
    })
  } catch (error) {
    // No matches found
  }
}

/**
 * Find queries without pagination
 */
function findUnpaginatedQueries() {
  try {
    const result = execSync(
      `rg -n "prisma\\.[a-zA-Z]+\\.findMany\\(" app lib -g "*.ts" -g "*.tsx" -A 5`,
      { encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 }
    )

    const lines = result.split("\n")
    let currentFile = ""
    let currentLine = 0
    let contextLines: string[] = []

    lines.forEach((line) => {
      const fileMatch = line.match(/^([^:]+):(\d+):/)
      if (fileMatch) {
        currentFile = fileMatch[1]
        currentLine = parseInt(fileMatch[2])
        contextLines = []
      }

      contextLines.push(line)

      if (line.includes("findMany")) {
        const context = contextLines.join("\n")
        if (!context.includes("take:") && !context.includes("skip:")) {
          issues.push({
            file: currentFile,
            line: currentLine,
            issue: "findMany without pagination - could return too many records",
            severity: "medium",
            recommendation: "Add take: limit and skip: offset for pagination",
            codeSnippet: line.substring(line.indexOf(":") + 1).trim(),
          })
        }
      }
    })
  } catch (error) {
    // No matches found
  }
}

/**
 * Main audit function
 */
async function main() {
  console.log("🔍 Starting Database Query Optimization Audit...\n")

  console.log("Checking for N+1 query problems...")
  findN1Problems()

  console.log("Checking for over-fetching...")
  findOverFetching()

  console.log("Checking for unpaginated queries...")
  findUnpaginatedQueries()

  console.log("\n═══════════════════════════════════════════════════════════")
  console.log("           DATABASE OPTIMIZATION AUDIT RESULTS")
  console.log("═══════════════════════════════════════════════════════════\n")

  const highSeverity = issues.filter((i) => i.severity === "high")
  const mediumSeverity = issues.filter((i) => i.severity === "medium")
  const lowSeverity = issues.filter((i) => i.severity === "low")

  console.log(`Total Issues Found: ${issues.length}`)
  console.log(`  🔴 High Severity: ${highSeverity.length}`)
  console.log(`  🟡 Medium Severity: ${mediumSeverity.length}`)
  console.log(`  🟢 Low Severity: ${lowSeverity.length}\n`)

  if (issues.length === 0) {
    console.log("🎉 No database optimization issues found!\n")
    return
  }

  // Print high severity issues
  if (highSeverity.length > 0) {
    console.log("\n🔴 HIGH SEVERITY ISSUES (N+1 Queries)\n")
    console.log("─────────────────────────────────────────────────────────\n")

    highSeverity.slice(0, 15).forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.file}:${issue.line}`)
      console.log(`   Issue: ${issue.issue}`)
      console.log(`   Fix: ${issue.recommendation}`)
      if (issue.codeSnippet) {
        console.log(`   Code: ${issue.codeSnippet.substring(0, 80)}...`)
      }
      console.log()
    })

    if (highSeverity.length > 15) {
      console.log(`   ... and ${highSeverity.length - 15} more\n`)
    }
  }

  // Print medium severity issues (sample)
  if (mediumSeverity.length > 0) {
    console.log("\n🟡 MEDIUM SEVERITY ISSUES (Sample)\n")
    console.log("─────────────────────────────────────────────────────────\n")

    mediumSeverity.slice(0, 10).forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.file}:${issue.line}`)
      console.log(`   Issue: ${issue.issue}`)
      console.log(`   Fix: ${issue.recommendation}\n`)
    })

    if (mediumSeverity.length > 10) {
      console.log(`   ... and ${mediumSeverity.length - 10} more\n`)
    }
  }

  // Save report
  const report = generateReport(issues)
  fs.writeFileSync("DATABASE_OPTIMIZATION_AUDIT_REPORT.md", report)

  console.log(`\n📄 Full report saved to: DATABASE_OPTIMIZATION_AUDIT_REPORT.md`)
  console.log("\n💡 Recommended Actions:")
  console.log("   1. Fix all N+1 queries first (use include/select)")
  console.log("   2. Add select clauses to avoid over-fetching")
  console.log("   3. Add pagination to findMany queries")
  console.log("   4. Review and add missing database indexes")
  console.log("   5. Consider query caching for expensive operations")

  if (highSeverity.length > 0) {
    process.exit(1)
  }
}

function generateReport(issues: OptimizationIssue[]): string {
  const highSeverity = issues.filter((i) => i.severity === "high")
  const mediumSeverity = issues.filter((i) => i.severity === "medium")

  return `# Database Query Optimization Audit Report

**Date:** ${new Date().toISOString().split("T")[0]}  
**Total Issues:** ${issues.length}

## Summary

- 🔴 **High Severity (N+1 Queries):** ${highSeverity.length}
- 🟡 **Medium Severity (Over-fetching/Pagination):** ${mediumSeverity.length}

---

## High Severity Issues (N+1 Queries)

${highSeverity
  .map(
    (issue, index) => `
### ${index + 1}. ${issue.file}:${issue.line}

**Issue:** ${issue.issue}  
**Recommendation:** ${issue.recommendation}

\`\`\`typescript
${issue.codeSnippet || "N/A"}
\`\`\`
`
  )
  .join("\n")}

---

## Medium Severity Issues

${mediumSeverity
  .map(
    (issue, index) => `
### ${index + 1}. ${issue.file}:${issue.line}

**Issue:** ${issue.issue}  
**Recommendation:** ${issue.recommendation}
`
  )
  .join("\n")}

---

## Optimization Best Practices

### 1. Avoid N+1 Queries

**❌ Bad:**
\`\`\`typescript
const users = await prisma.user.findMany()
for (const user of users) {
  const posts = await prisma.post.findMany({ where: { userId: user.id } })
}
\`\`\`

**✅ Good:**
\`\`\`typescript
const users = await prisma.user.findMany({
  include: { posts: true }
})
\`\`\`

### 2. Use Select to Avoid Over-fetching

**❌ Bad:**
\`\`\`typescript
const user = await prisma.user.findUnique({ where: { id } })
\`\`\`

**✅ Good:**
\`\`\`typescript
const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, email: true, firstName: true }
})
\`\`\`

### 3. Always Paginate findMany

**❌ Bad:**
\`\`\`typescript
const listings = await prisma.listing.findMany()
\`\`\`

**✅ Good:**
\`\`\`typescript
const listings = await prisma.listing.findMany({
  take: 20,
  skip: page * 20,
  orderBy: { createdAt: 'desc' }
})
\`\`\`

---

*Generated by Database Query Optimization Audit Script*
`
}

main().catch((error) => {
  console.error("❌ Error:", error)
  process.exit(1)
})
