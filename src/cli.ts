#!/usr/bin/env node

/**
 * cli.ts
 * Entry point for RepoMuseum. Parses arguments, orchestrates git extraction,
 * runs analysis, and triggers rendering.
 */

import { Command } from "commander";
import * as path from "path";
import * as fs from "fs";
import { execSync } from "child_process";

import {
  checkGitInstalled,
  checkIsGitRepo,
  listCommits,
  listTrackedFiles,
  fetchAllCommitData,
} from "./git";
import { buildReport } from "./analyze";
import { renderReport } from "./render";

const program = new Command();

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

      const gitVersion = checkGitInstalled();
      const resolvedRepoPath = path.resolve(repoPath);
      checkIsGitRepo(resolvedRepoPath);

      const repoName = path.basename(resolvedRepoPath) || "repository";
      console.log(`Analyzing repository: ${repoName} (${resolvedRepoPath})`);

      // 1. Get raw commits
      console.log(`Fetching commit list...`);
      const rawCommits = listCommits(resolvedRepoPath, {
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
      const commitData = fetchAllCommitData(resolvedRepoPath, rawCommits, { progressEvery: 50 });

      // 3. Tracked files
      const trackedFiles = listTrackedFiles(resolvedRepoPath);

      // 4. Analysis
      console.log(`Building museum exhibits (analysis)...`);
      const reportData = buildReport(commitData, trackedFiles, {
        repoName,
        repoPath: resolvedRepoPath,
        gitVersion,
        since: options.since,
        numEras: options.eras,
      });

      // 5. Render HTML
      const outDir = path.resolve(options.out);
      console.log(`Writing report to ${outDir}...`);
      const { outHtmlPath } = renderReport(outDir, reportData);

      console.log(`\n🎉 Tour ready!`);
      console.log(`Report stats:`);
      console.log(` - Commits analyzed: ${reportData.summary.commits}`);
      console.log(` - Authors: ${reportData.summary.authors}`);
      console.log(` - Files Touched: ${reportData.summary.filesTouched}`);
      
      console.log(`\nOpen the report here:`);
      console.log(`file://${outHtmlPath}`);

      if (options.open) {
        openBrowser(outHtmlPath);
      } else {
        console.log(`\nTip: You can use the --open flag next time to auto-open the browser.`);
      }

    } catch (error: any) {
      console.error(`\n❌ Error: ${error.message}`);
      process.exit(1);
    }
  });

function openBrowser(filePath: string) {
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
    execSync(command);
  } catch (err) {
    console.error(`Failed to open browser automatically. Please open the file manually.`);
  }
}

program.parse(process.argv);
