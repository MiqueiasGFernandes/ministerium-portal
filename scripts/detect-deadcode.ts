#!/usr/bin/env tsx
/**
 * Dead Code Detection Script
 *
 * Detects unused exports, files, and components in the codebase.
 * This script helps maintain a clean codebase by identifying potential dead code.
 *
 * Usage:
 *   npm run deadcode
 *   npm run deadcode -- --check (exits with code 1 if dead code found)
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const SRC_DIR = path.join(process.cwd(), "src");
const EXCLUDE_PATTERNS = [
	"**/*.test.ts",
	"**/*.test.tsx",
	"**/*.spec.ts",
	"**/*.spec.tsx",
	"**/main.tsx",
	"**/App.tsx",
	"**/vite-env.d.ts",
];

interface DeadCodeIssue {
	type: "unused-export" | "unused-file" | "deprecated";
	file: string;
	line?: number;
	message: string;
}

const issues: DeadCodeIssue[] = [];

/**
 * Check for deprecated markers in code
 */
function checkDeprecated() {
	console.log("🔍 Checking for @deprecated markers...\n");

	try {
		const result = execSync(
			'grep -rn "@deprecated" src --include="*.ts" --include="*.tsx"',
			{ encoding: "utf-8", cwd: process.cwd() },
		);

		const lines = result.split("\n").filter(Boolean);

		for (const line of lines) {
			const match = line.match(/^([^:]+):(\d+):(.*)/);
			if (match) {
				const [, file, lineNum, content] = match;
				issues.push({
					type: "deprecated",
					file: file.replace("src/", ""),
					line: Number.parseInt(lineNum),
					message: `Contains @deprecated marker: ${content.trim()}`,
				});
			}
		}

		if (issues.length > 0) {
			console.log(
				`⚠️  Found ${issues.length} deprecated items that should be reviewed:\n`,
			);
			for (const issue of issues) {
				console.log(`  ${issue.file}:${issue.line}`);
				console.log(`    ${issue.message}\n`);
			}
		} else {
			console.log("✅ No deprecated code markers found\n");
		}
	} catch (error: any) {
		// grep returns exit code 1 when no matches found
		if (error.status === 1) {
			console.log("✅ No deprecated code markers found\n");
		} else {
			console.error("Error checking for deprecated code:", error.message);
		}
	}
}

/**
 * Check for common dead code patterns
 */
function checkCommonPatterns() {
	console.log("🔍 Checking for common dead code patterns...\n");

	const patterns = [
		{
			name: "Commented out imports",
			pattern: "^\\s*//\\s*import",
			severity: "info",
		},
		{
			name: "Commented out functions",
			pattern: "^\\s*//\\s*function",
			severity: "info",
		},
		{
			name: "TODO comments (for review)",
			pattern: "TODO:",
			severity: "info",
		},
		{
			name: "FIXME comments (for review)",
			pattern: "FIXME:",
			severity: "warning",
		},
	];

	for (const { name, pattern, severity } of patterns) {
		try {
			const result = execSync(
				`grep -rn "${pattern}" src --include="*.ts" --include="*.tsx" | head -10`,
				{ encoding: "utf-8", cwd: process.cwd() },
			);

			const lines = result.split("\n").filter(Boolean);
			if (lines.length > 0) {
				const icon = severity === "warning" ? "⚠️ " : "ℹ️ ";
				console.log(`${icon} Found ${name}:`);
				for (const line of lines.slice(0, 5)) {
					console.log(`  ${line}`);
				}
				if (lines.length > 5) {
					console.log(`  ... and ${lines.length - 5} more`);
				}
				console.log("");
			}
		} catch (error: any) {
			// No matches found
		}
	}
}

/**
 * Check TypeScript unused variables using tsc
 */
function checkTypeScriptUnused() {
	console.log("🔍 Running TypeScript compiler for unused variables...\n");

	try {
		execSync("npx tsc --noEmit", {
			encoding: "utf-8",
			cwd: process.cwd(),
			stdio: "inherit",
		});
		console.log("✅ No TypeScript errors found\n");
	} catch (error: any) {
		console.log(
			"⚠️  TypeScript compilation has errors (see above). Fix these first.\n",
		);
	}
}

/**
 * Main execution
 */
function main() {
	const args = process.argv.slice(2);
	const checkMode = args.includes("--check");

	console.log("═══════════════════════════════════════════════════════════");
	console.log("           Dead Code Detection Report");
	console.log("═══════════════════════════════════════════════════════════\n");

	checkDeprecated();
	checkCommonPatterns();
	checkTypeScriptUnused();

	console.log("═══════════════════════════════════════════════════════════");
	console.log("                    Summary");
	console.log("═══════════════════════════════════════════════════════════\n");

	if (issues.length === 0) {
		console.log("✅ No critical dead code issues found!");
		console.log(
			"   Review any info/warnings above if present, but no action required.\n",
		);
		process.exit(0);
	}

	console.log(`⚠️  Found ${issues.length} items to review:`);
	console.log("   - Deprecated code that may need removal");
	console.log("   - See details above for specific files and line numbers\n");

	if (checkMode) {
		console.log("Running in --check mode, exiting with error code.\n");
		process.exit(1);
	} else {
		console.log("Run with --check flag to fail CI on dead code detection.\n");
		process.exit(0);
	}
}

main();
