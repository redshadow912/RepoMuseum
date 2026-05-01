/**
 * git.ts
 * High-performance git extraction using stream parsing.
 */

import { spawn } from "child_process";
import * as readline from "readline";
import * as path from "path";
import { RawCommit, FileNumStat, RenameRecord, CommitData } from "./types";
import { resolveRenamePath } from "./utils/pathUtils";

/** Verify git is installed and reachable. */
export function checkGitInstalled(): string {
  const result = spawnSync("git", ["--version"], { encoding: "utf8" });
  if (result.error) throw new Error("git is not installed or not in PATH.");
  return (result.stdout || "").trim().replace("git version ", "");
}

/** Verify the given directory is a git repository. */
export function checkIsGitRepo(repoPath: string): void {
  const result = spawnSync("git", ["-C", repoPath, "rev-parse", "--git-dir"], { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`Not a git repository: ${path.resolve(repoPath)}`);
  }
}

import { spawnSync } from "child_process";

/** Returns the list of files currently tracked in the repo. */
export function listTrackedFiles(repoPath: string): string[] {
  const result = spawnSync("git", ["-C", repoPath, "ls-files"], { encoding: "utf8" });
  if (!result.stdout) return [];
  return result.stdout.split("\n").map(f => f.trim()).filter(Boolean);
}

/**
 * High-performance stream parser for git log.
 * Extracts all commits, numstats, and name-status in a single child process.
 */
export async function fetchGitHistoryStream(
  repoPath: string,
  opts: { since?: string; maxCommits?: number; includeMerges: boolean; onProgress?: (count: number) => void }
): Promise<CommitData[]> {
  return new Promise((resolve, reject) => {
    const args = [
      "log",
      "--numstat",
      "--format=COMMIT|%H|%ad|%an|%s",
      "--date=iso-strict"
    ];

    if (!opts.includeMerges) args.push("--no-merges");
    if (opts.since) args.push(`--since=${opts.since}`);
    if (opts.maxCommits) args.push(`--max-count=${opts.maxCommits}`);

    const child = spawn("git", ["-C", repoPath, ...args]);

    const commits: CommitData[] = [];
    let currentCommit: CommitData | null = null;

    const rl = readline.createInterface({
      input: child.stdout,
      crlfDelay: Infinity
    });

    rl.on("line", (line) => {
      line = line.trim();
      if (!line) return;

      if (line.startsWith("COMMIT|")) {
        const parts = line.split("|");
        const sha = parts[1];
        const date = parts[2];
        const author = parts[3];
        const subject = parts.slice(4).join("|");

        currentCommit = {
          sha,
          date,
          author,
          subject,
          numStats: [],
          renames: []
        };
        commits.push(currentCommit);
        
        if (commits.length % 500 === 0 && opts.onProgress) {
           opts.onProgress(commits.length);
        }
      } else {
        if (!currentCommit) return;

        const parts = line.split("\t");
        const part0 = parts[0];
        
        if (/^[\d-]+$/.test(part0) && parts.length >= 3) {
          const addedRaw = parts[0];
          const deletedRaw = parts[1];
          const added = addedRaw === "-" ? 0 : parseInt(addedRaw, 10);
          const deleted = deletedRaw === "-" ? 0 : parseInt(deletedRaw, 10);
          const rawPath = parts.slice(2).join("\t").trim();
          
          if (rawPath.includes("=>")) {
            currentCommit.renames.push({
              oldPath: rawPath,
              newPath: resolveRenamePath(rawPath),
              score: 100
            });
          }
          
          const filePath = resolveRenamePath(rawPath);
          
          if (!isNaN(added) && !isNaN(deleted) && filePath) {
            currentCommit.numStats.push({ added, deleted, path: filePath });
          }
        }
      }
    });

    let stderr = "";
    child.stderr.on("data", (d: any) => stderr += d.toString());

    child.on("close", (code: number | null) => {
      if (code !== 0) {
        reject(new Error(`git log failed: ${stderr}`));
      } else {
        resolve(commits);
      }
    });

    child.on("error", (err: Error) => {
      reject(err);
    });
  });
}
