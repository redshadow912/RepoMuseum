#!/usr/bin/env node
"use strict";
/**
 * cli.ts
 * Entry point for RepoMuseum. Parses arguments, orchestrates git extraction,
 * runs analysis, and triggers rendering.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const git_1 = require("./git");
const analyze_1 = require("./analyze");
const render_1 = require("./render");
const program = new commander_1.Command();
program
    .name("repomuseum")
    .description("Analyzes a local git repository and generates a beautiful HTML museum tour report.")
    .version("1.0.0");
program
    .command("tour")
    .description("Generate a museum tour for a repository")
    .argument("<path-to-repo>", "Path to the local git repository to analyze")
    .option("--out <dir>", "Output directory for the report", "./repomuseum-report")
    .option("--since <date>", "Analyze only commits after this date (YYYY-MM-DD)")
    .option("--max-commits <n>", "Limit the number of commits processed (for speed)", parseInt)
    .option("--eras <n>", "Number of eras to partition history into", parseInt, 6)
    .option("--include-merges", "Include merge commits", false)
    .option("--open", "Try to open the HTML report automatically after generation", false)
    .action((repoPath, options) => {
    try {
        console.log(`🏛️ Welcome to RepoMuseum.`);
        console.log(`Checking environment...`);
        const gitVersion = (0, git_1.checkGitInstalled)();
        const resolvedRepoPath = path.resolve(repoPath);
        (0, git_1.checkIsGitRepo)(resolvedRepoPath);
        const repoName = path.basename(resolvedRepoPath) || "repository";
        console.log(`Analyzing repository: ${repoName} (${resolvedRepoPath})`);
        // 1. Get raw commits
        console.log(`Fetching commit list...`);
        const rawCommits = (0, git_1.listCommits)(resolvedRepoPath, {
            since: options.since,
            maxCommits: options.maxCommits,
            includeMerges: options.includeMerges,
        });
        if (rawCommits.length === 0) {
            console.error("No commits found matching the criteria. Try a different --since date or check the repo.");
            process.exit(1);
        }
        console.log(`Found ${rawCommits.length} commits. Extracting detailed file changes...`);
        // 2. Fetch detailed stats for all commits
        const commitData = (0, git_1.fetchAllCommitData)(resolvedRepoPath, rawCommits, { progressEvery: 50 });
        // 3. Tracked files
        const trackedFiles = (0, git_1.listTrackedFiles)(resolvedRepoPath);
        // 4. Analysis
        console.log(`Building museum exhibits (analysis)...`);
        const reportData = (0, analyze_1.buildReport)(commitData, trackedFiles, {
            repoName,
            repoPath: resolvedRepoPath,
            gitVersion,
            since: options.since,
            numEras: options.eras,
        });
        // 5. Render HTML
        const outDir = path.resolve(options.out);
        console.log(`Writing report to ${outDir}...`);
        const { outHtmlPath } = (0, render_1.renderReport)(outDir, reportData);
        console.log(`\n🎉 Tour ready!`);
        console.log(`Report stats:`);
        console.log(` - Commits analyzed: ${reportData.summary.commits}`);
        console.log(` - Authors: ${reportData.summary.authors}`);
        console.log(` - Files Touched: ${reportData.summary.filesTouched}`);
        console.log(`\nOpen the report here:`);
        console.log(`file://${outHtmlPath}`);
        if (options.open) {
            openBrowser(outHtmlPath);
        }
        else {
            console.log(`\nTip: You can use the --open flag next time to auto-open the browser.`);
        }
    }
    catch (error) {
        console.error(`\n❌ Error: ${error.message}`);
        process.exit(1);
    }
});
function openBrowser(filePath) {
    let command;
    switch (process.platform) {
        case "darwin":
            command = `open "${filePath}"`;
            break;
        case "win32":
            command = `start "" "${filePath}"`;
            break;
        default:
            command = `xdg-open "${filePath}"`;
            break;
    }
    try {
        console.log(`Opening browser...`);
        (0, child_process_1.execSync)(command);
    }
    catch (err) {
        console.error(`Failed to open browser automatically. Please open the file manually.`);
    }
}
program.parse(process.argv);
//# sourceMappingURL=cli.js.map