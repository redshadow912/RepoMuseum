#!/usr/bin/env node

/**
 * cli.ts
 * Entry point for RepoMuseum. Parses arguments, orchestrates git extraction,
 * runs analysis, and triggers rendering.
 */

import { Command } from "commander";
import * as path from "path";
import { execSync } from "child_process";
import ora from "ora";
import pc from "picocolors";

import {
  checkGitInstalled,
  checkIsGitRepo,
  fetchGitHistoryStream,
  listTrackedFiles,
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
  .action(async (repoPath, options) => {
    console.log();
    console.log(pc.bold(pc.yellow("  🏛️  Welcome to RepoMuseum ")));
    console.log(pc.gray("  Curating your codebase history..."));
    console.log();

    const spinner = ora("Checking environment...").start();

    try {
      const gitVersion = checkGitInstalled();
      const resolvedRepoPath = path.resolve(repoPath);
      checkIsGitRepo(resolvedRepoPath);

      const repoName = path.basename(resolvedRepoPath) || "repository";
      
      // 1. Fetch all commit data in a single stream
      spinner.text = `Dusting off git history for ${pc.cyan(repoName)}...`;
      
      const commitData = await fetchGitHistoryStream(resolvedRepoPath, {
        since: options.since,
        maxCommits: options.maxCommits,
        includeMerges: options.includeMerges,
        onProgress: (count) => {
          spinner.text = `Dusting off git history... ${pc.yellow(count.toLocaleString())} commits discovered`;
        }
      });

      if (commitData.length === 0) {
        spinner.fail(pc.red("No commits found matching the criteria."));
        process.exit(1);
      }
      
      // 2. Tracked files
      spinner.text = "Cataloging current artifacts (tracked files)...";
      const trackedFiles = listTrackedFiles(resolvedRepoPath);

      // 3. Analysis
      spinner.text = "Analyzing strata and building exhibits...";
      const reportData = buildReport(commitData, trackedFiles, {
        repoName,
        repoPath: resolvedRepoPath,
        gitVersion,
        since: options.since,
        numEras: options.eras,
      });

      // 4. Render HTML
      spinner.text = "Painting the exhibits (rendering HTML)...";
      const outDir = path.resolve(options.out);
      const { outHtmlPath } = renderReport(outDir, reportData);

      spinner.succeed(pc.green("Exhibition built successfully!"));

      // Print Summary Box
      console.log();
      console.log(pc.bgWhite(pc.black(" SUMMARY ")));
      console.log(`  ${pc.bold("Repository:")}  ${pc.cyan(repoName)}`);
      console.log(`  ${pc.bold("Commits:")}     ${pc.yellow(reportData.summary.commits.toLocaleString())}`);
      console.log(`  ${pc.bold("Curators:")}    ${pc.magenta(reportData.summary.authors.toLocaleString())}`);
      console.log(`  ${pc.bold("Artifacts:")}   ${pc.blue(reportData.summary.filesTouched.toLocaleString())}`);
      console.log();
      console.log(`${pc.bold("🎟️  Your ticket:")} ${pc.underline(pc.cyan(`file://${outHtmlPath}`))}`);
      console.log();

      if (options.open) {
        openBrowser(outHtmlPath);
      } else {
        console.log(pc.gray(`  Tip: Use the ${pc.bold("--open")} flag next time to auto-open the browser.`));
      }

    } catch (error: any) {
      spinner.fail(pc.red(`Error: ${error.message}`));
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
    ora("Opening museum doors...").start().succeed();
    execSync(command);
  } catch (err) {
    console.error(pc.red(`Failed to open browser automatically. Please open the file manually.`));
  }
}

program.parse(process.argv);
