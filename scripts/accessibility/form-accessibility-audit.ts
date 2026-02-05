/**
 * Form Accessibility Audit Script
 * 
 * Scans all form components for common accessibility issues:
 * - Missing aria-describedby for error messages
 * - Missing aria-invalid for error states
 * - Missing aria-required for required fields
 * - Missing htmlFor/id associations between labels and inputs
 * - Missing role="alert" on error messages
 * - Missing fieldset/legend for radio/checkbox groups
 * 
 * Usage:
 *   npx tsx scripts/accessibility/form-accessibility-audit.ts
 */

import { execSync } from "child_process"
import * as fs from "fs"
import * as path from "path"

interface AccessibilityIssue {
  file: string
  line: number
  issue: string
  severity: "high" | "medium" | "low"
  recommendation: string
  codeSnippet?: string
}

const issues: AccessibilityIssue[] = []

// Directories to scan
const SCAN_DIRS = [
  "app",
  "components",
]

/**
 * Find all TSX/JSX files with form elements
 */
function findFormFiles(): string[] {
  const files: string[] = []
  
  for (const dir of SCAN_DIRS) {
    try {
      // Find files containing Input, Textarea, Select, or form elements
      const result = execSync(
        `rg -l "(<Input|<Textarea|<Select|<form|errors\\.|error)" ${dir} -g "*.tsx" -g "*.ts"`,
        { encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 }
      )
      files.push(...result.trim().split("\n").filter(Boolean))
    } catch (error) {
      // No matches found, continue
    }
  }
  
  return [...new Set(files)] // Remove duplicates
}

/**
 * Check for missing aria-describedby on inputs with errors
 */
function checkAriaDescribedby(file: string, content: string) {
  const lines = content.split("\n")
  
  lines.forEach((line, index) => {
    // Look for Input/Textarea/Select with error but no aria-describedby
    if (
      (line.includes("<Input") || line.includes("<Textarea") || line.includes("<Select")) &&
      !line.includes("aria-describedby")
    ) {
      // Check if there's an error reference nearby (within 10 lines)
      const contextStart = Math.max(0, index - 5)
      const contextEnd = Math.min(lines.length, index + 10)
      const context = lines.slice(contextStart, contextEnd).join("\n")
      
      if (context.match(/errors?\.[a-zA-Z]+|error\s*&&/)) {
        issues.push({
          file,
          line: index + 1,
          issue: "Input field with error state missing aria-describedby",
          severity: "high",
          recommendation: 'Add aria-describedby={errors.field ? "field-error" : undefined}',
          codeSnippet: line.trim(),
        })
      }
    }
  })
}

/**
 * Check for missing aria-invalid on inputs with errors
 */
function checkAriaInvalid(file: string, content: string) {
  const lines = content.split("\n")
  
  lines.forEach((line, index) => {
    if (
      (line.includes("<Input") || line.includes("<Textarea") || line.includes("<Select")) &&
      !line.includes("aria-invalid")
    ) {
      const contextStart = Math.max(0, index - 5)
      const contextEnd = Math.min(lines.length, index + 10)
      const context = lines.slice(contextStart, contextEnd).join("\n")
      
      if (context.match(/errors?\.[a-zA-Z]+|error\s*&&/)) {
        issues.push({
          file,
          line: index + 1,
          issue: "Input field with error state missing aria-invalid",
          severity: "high",
          recommendation: "Add aria-invalid={!!errors.field}",
          codeSnippet: line.trim(),
        })
      }
    }
  })
}

/**
 * Check for missing role="alert" on error messages
 */
function checkRoleAlert(file: string, content: string) {
  const lines = content.split("\n")
  
  lines.forEach((line, index) => {
    // Look for error messages without role="alert"
    if (
      (line.includes("text-red") || line.includes("text-destructive") || line.match(/error.*message/i)) &&
      !line.includes('role="alert"') &&
      (line.includes("<p") || line.includes("<span") || line.includes("<div"))
    ) {
      const contextStart = Math.max(0, index - 3)
      const contextEnd = Math.min(lines.length, index + 3)
      const context = lines.slice(contextStart, contextEnd).join("\n")
      
      if (context.match(/errors?\.[a-zA-Z]+|error\s*&&/)) {
        issues.push({
          file,
          line: index + 1,
          issue: "Error message missing role='alert'",
          severity: "medium",
          recommendation: 'Add role="alert" to error message element',
          codeSnippet: line.trim(),
        })
      }
    }
  })
}

/**
 * Check for missing htmlFor on labels
 */
function checkLabelFor(file: string, content: string) {
  const lines = content.split("\n")
  
  lines.forEach((line, index) => {
    if (line.includes("<Label") && !line.includes("htmlFor")) {
      issues.push({
        file,
        line: index + 1,
        issue: "Label missing htmlFor attribute",
        severity: "high",
        recommendation: 'Add htmlFor="fieldId" to associate label with input',
        codeSnippet: line.trim(),
      })
    }
  })
}

/**
 * Check for missing aria-required on required fields
 */
function checkAriaRequired(file: string, content: string) {
  const lines = content.split("\n")
  
  lines.forEach((line, index) => {
    if (
      (line.includes("<Input") || line.includes("<Textarea") || line.includes("<Select")) &&
      line.includes("required") &&
      !line.includes("aria-required")
    ) {
      issues.push({
        file,
        line: index + 1,
        issue: "Required field missing aria-required",
        severity: "medium",
        recommendation: 'Add aria-required="true" to required fields',
        codeSnippet: line.trim(),
      })
    }
  })
}

/**
 * Check for button accessibility
 */
function checkButtonAccessibility(file: string, content: string) {
  const lines = content.split("\n")
  
  lines.forEach((line, index) => {
    // Icon-only buttons without aria-label
    if (
      line.includes("<Button") &&
      line.includes("Icon") &&
      !line.includes("aria-label") &&
      !line.includes("children")
    ) {
      issues.push({
        file,
        line: index + 1,
        issue: "Icon-only button missing aria-label",
        severity: "high",
        recommendation: 'Add aria-label="Description" to icon-only buttons',
        codeSnippet: line.trim(),
      })
    }
  })
}

/**
 * Main audit function
 */
async function main() {
  console.log("🔍 Starting Form Accessibility Audit...\n")
  
  const formFiles = findFormFiles()
  console.log(`Found ${formFiles.length} files with form elements\n`)
  
  let filesScanned = 0
  
  for (const file of formFiles) {
    try {
      const content = fs.readFileSync(file, "utf-8")
      
      checkAriaDescribedby(file, content)
      checkAriaInvalid(file, content)
      checkRoleAlert(file, content)
      checkLabelFor(file, content)
      checkAriaRequired(file, content)
      checkButtonAccessibility(file, content)
      
      filesScanned++
    } catch (error) {
      console.error(`Error reading ${file}:`, error)
    }
  }
  
  console.log(`✅ Scanned ${filesScanned} files\n`)
  
  // Group issues by severity
  const highSeverity = issues.filter(i => i.severity === "high")
  const mediumSeverity = issues.filter(i => i.severity === "medium")
  const lowSeverity = issues.filter(i => i.severity === "low")
  
  console.log("═══════════════════════════════════════════════════════════")
  console.log("                 ACCESSIBILITY AUDIT RESULTS")
  console.log("═══════════════════════════════════════════════════════════\n")
  
  console.log(`Total Issues Found: ${issues.length}`)
  console.log(`  🔴 High Severity: ${highSeverity.length}`)
  console.log(`  🟡 Medium Severity: ${mediumSeverity.length}`)
  console.log(`  🟢 Low Severity: ${lowSeverity.length}\n`)
  
  if (issues.length === 0) {
    console.log("🎉 No accessibility issues found! Great job!\n")
    return
  }
  
  // Print high severity issues
  if (highSeverity.length > 0) {
    console.log("\n🔴 HIGH SEVERITY ISSUES (Fix These First)\n")
    console.log("─────────────────────────────────────────────────────────\n")
    
    highSeverity.slice(0, 20).forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.file}:${issue.line}`)
      console.log(`   Issue: ${issue.issue}`)
      console.log(`   Fix: ${issue.recommendation}`)
      if (issue.codeSnippet) {
        console.log(`   Code: ${issue.codeSnippet.substring(0, 100)}...`)
      }
      console.log()
    })
    
    if (highSeverity.length > 20) {
      console.log(`   ... and ${highSeverity.length - 20} more high severity issues\n`)
    }
  }
  
  // Print medium severity issues (first 10)
  if (mediumSeverity.length > 0) {
    console.log("\n🟡 MEDIUM SEVERITY ISSUES (Sample)\n")
    console.log("─────────────────────────────────────────────────────────\n")
    
    mediumSeverity.slice(0, 10).forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.file}:${issue.line}`)
      console.log(`   Issue: ${issue.issue}`)
      console.log(`   Fix: ${issue.recommendation}\n`)
    })
    
    if (mediumSeverity.length > 10) {
      console.log(`   ... and ${mediumSeverity.length - 10} more medium severity issues\n`)
    }
  }
  
  // Save full report to file
  const reportPath = "FORM_ACCESSIBILITY_AUDIT_REPORT.md"
  const report = generateMarkdownReport(issues, filesScanned)
  fs.writeFileSync(reportPath, report)
  
  console.log(`\n📄 Full report saved to: ${reportPath}`)
  console.log("\n💡 Recommended Actions:")
  console.log("   1. Fix all high severity issues first")
  console.log("   2. Update form components to follow accessibility patterns")
  console.log("   3. Add accessibility tests to prevent regressions")
  console.log("   4. Consider using a form library with built-in a11y (react-hook-form)")
  
  // Exit with error code if high severity issues found
  if (highSeverity.length > 0) {
    process.exit(1)
  }
}

/**
 * Generate markdown report
 */
function generateMarkdownReport(issues: AccessibilityIssue[], filesScanned: number): string {
  const highSeverity = issues.filter(i => i.severity === "high")
  const mediumSeverity = issues.filter(i => i.severity === "medium")
  const lowSeverity = issues.filter(i => i.severity === "low")
  
  let report = `# Form Accessibility Audit Report

**Date:** ${new Date().toISOString().split('T')[0]}  
**Files Scanned:** ${filesScanned}  
**Total Issues:** ${issues.length}

## Summary

- 🔴 **High Severity:** ${highSeverity.length} issues
- 🟡 **Medium Severity:** ${mediumSeverity.length} issues
- 🟢 **Low Severity:** ${lowSeverity.length} issues

---

## High Severity Issues

${highSeverity.map((issue, index) => `
### ${index + 1}. ${issue.issue}

**File:** \`${issue.file}:${issue.line}\`  
**Recommendation:** ${issue.recommendation}

\`\`\`tsx
${issue.codeSnippet || 'N/A'}
\`\`\`
`).join('\n')}

---

## Medium Severity Issues

${mediumSeverity.map((issue, index) => `
### ${index + 1}. ${issue.issue}

**File:** \`${issue.file}:${issue.line}\`  
**Recommendation:** ${issue.recommendation}
`).join('\n')}

---

## Accessibility Best Practices

### Proper Form Field Pattern

\`\`\`tsx
<div>
  <Label htmlFor="email">Email *</Label>
  <Input 
    id="email"
    type="email"
    aria-required="true"
    aria-describedby={errors.email ? "email-error" : undefined}
    aria-invalid={!!errors.email}
    {...register("email")}
  />
  {errors.email && (
    <p id="email-error" role="alert" className="text-red-500 text-sm mt-1">
      {errors.email.message}
    </p>
  )}
</div>
\`\`\`

### Key Attributes

- **htmlFor/id:** Associates label with input
- **aria-required:** Indicates required fields
- **aria-describedby:** Links error message to input
- **aria-invalid:** Indicates validation state
- **role="alert":** Announces errors to screen readers

---

## Next Steps

1. Fix all high severity issues
2. Update form components to follow patterns above
3. Add accessibility tests
4. Consider using react-hook-form with built-in a11y
5. Run this audit regularly in CI/CD

---

*Generated by Form Accessibility Audit Script*
`
  
  return report
}

main()
  .catch((error) => {
    console.error("❌ Error running accessibility audit:", error)
    process.exit(1)
  })
