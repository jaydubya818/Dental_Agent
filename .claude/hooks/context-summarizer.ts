#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

/**
 * Context Summarizer
 * Creates compressed summaries of frequently accessed files to reduce token usage
 */

interface HookInput {
    session_id: string;
    transcript_path: string;
    cwd: string;
    tool_name?: string;
    tool_input?: {
        file_path?: string;
    };
}

interface FileSummary {
    path: string;
    lastModified: number;
    summary: string;
    tokens: number;
    accessCount: number;
}

async function main() {
    try {
        const input = readFileSync(0, 'utf-8');
        const data: HookInput = JSON.parse(input);

        // Only run on Read operations
        if (data.tool_name !== 'Read' || !data.tool_input?.file_path) {
            process.exit(0);
        }

        const filePath = data.tool_input.file_path;
        const sessionId = data.session_id || 'default';
        const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();

        // Cache directory
        const cacheDir = join(projectDir, '.claude', 'context-cache', sessionId);
        if (!existsSync(cacheDir)) {
            mkdirSync(cacheDir, { recursive: true });
        }

        const summariesFile = join(cacheDir, 'file-summaries.json');

        // Load existing summaries
        let summaries: Record<string, FileSummary> = {};
        if (existsSync(summariesFile)) {
            summaries = JSON.parse(readFileSync(summariesFile, 'utf-8'));
        }

        // Check if file should be summarized
        const SUMMARIZE_THRESHOLD = 3; // Summarize after 3 reads
        const LARGE_FILE_LINES = 500; // Files over 500 lines get auto-summarized

        // Track access
        if (!summaries[filePath]) {
            summaries[filePath] = {
                path: filePath,
                lastModified: 0,
                summary: '',
                tokens: 0,
                accessCount: 0,
            };
        }

        summaries[filePath].accessCount += 1;

        // Get file stats
        let fileContent = '';
        let lineCount = 0;

        try {
            fileContent = readFileSync(filePath, 'utf-8');
            lineCount = fileContent.split('\n').length;
        } catch (err) {
            // File not accessible, skip
            process.exit(0);
        }

        const shouldSummarize =
            summaries[filePath].accessCount >= SUMMARIZE_THRESHOLD ||
            lineCount > LARGE_FILE_LINES;

        if (shouldSummarize && !summaries[filePath].summary) {
            // Generate summary
            const summary = generateSummary(filePath, fileContent);

            summaries[filePath].summary = summary;
            summaries[filePath].tokens = estimateTokens(fileContent);

            console.log('');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📝 CONTEXT SUMMARY GENERATED');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`File: ${filePath}`);
            console.log(`Lines: ${lineCount}`);
            console.log(`Est. Tokens: ${summaries[filePath].tokens}`);
            console.log(`Access Count: ${summaries[filePath].accessCount}`);
            console.log('');
            console.log('Summary:');
            console.log(summary);
            console.log('');
            console.log('💡 Use this summary instead of re-reading the full file');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('');
        }

        // Save summaries
        writeFileSync(summariesFile, JSON.stringify(summaries, null, 2));

        process.exit(0);
    } catch (err) {
        console.error('Error in context-summarizer:', err);
        process.exit(1);
    }
}

function generateSummary(filePath: string, content: string): string {
    const lines = content.split('\n');
    const summary: string[] = [];

    // Detect file type
    const ext = filePath.split('.').pop()?.toLowerCase();

    if (ext === 'ts' || ext === 'tsx' || ext === 'js' || ext === 'jsx') {
        // Code file summary
        summary.push(`File: ${filePath}`);
        summary.push('');

        // Extract imports
        const imports = lines.filter(l => l.trim().startsWith('import'));
        if (imports.length > 0) {
            summary.push('Imports:');
            imports.slice(0, 5).forEach(imp => summary.push(`  ${imp.trim()}`));
            if (imports.length > 5) {
                summary.push(`  ... and ${imports.length - 5} more`);
            }
            summary.push('');
        }

        // Extract exports/functions
        const exports = lines.filter(
            l =>
                l.includes('export function') ||
                l.includes('export const') ||
                l.includes('export class') ||
                l.includes('export default')
        );

        if (exports.length > 0) {
            summary.push('Exports:');
            exports.forEach(exp => {
                const cleaned = exp.trim().replace(/\{[\s\S]*/, '').trim();
                summary.push(`  ${cleaned}`);
            });
            summary.push('');
        }

        // Extract interfaces/types
        const types = lines.filter(
            l =>
                l.includes('interface ') ||
                l.includes('type ') ||
                l.includes('enum ')
        );

        if (types.length > 0) {
            summary.push('Types/Interfaces:');
            types.slice(0, 5).forEach(type => {
                const cleaned = type.trim().replace(/\{[\s\S]*/, '').trim();
                summary.push(`  ${cleaned}`);
            });
            if (types.length > 5) {
                summary.push(`  ... and ${types.length - 5} more`);
            }
        }
    } else if (ext === 'prisma') {
        // Prisma schema summary
        summary.push(`Prisma Schema: ${filePath}`);
        summary.push('');

        const models = lines.filter(l => l.trim().startsWith('model '));
        if (models.length > 0) {
            summary.push('Models:');
            models.forEach(model => summary.push(`  ${model.trim()}`));
        }
    } else {
        // Generic summary - first 10 and last 5 lines
        summary.push(`File: ${filePath} (${lines.length} lines)`);
        summary.push('');
        summary.push('Preview:');
        lines.slice(0, 10).forEach((line, i) => {
            summary.push(`  ${i + 1}: ${line.substring(0, 80)}`);
        });

        if (lines.length > 15) {
            summary.push('  ...');
            lines.slice(-5).forEach((line, i) => {
                summary.push(`  ${lines.length - 5 + i + 1}: ${line.substring(0, 80)}`);
            });
        }
    }

    return summary.join('\n');
}

function estimateTokens(content: string): number {
    // Rough estimate: 4 characters ≈ 1 token
    return Math.ceil(content.length / 4);
}

main().catch(err => {
    console.error('Uncaught error:', err);
    process.exit(1);
});
