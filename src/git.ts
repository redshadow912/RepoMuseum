/**
 * git.ts
 * Wrappers around git CLI commands using child_process.
 * All commands use `git -C <repo>` so we never need to `cd`.
 *
 * Error handling philosophy:
 *  - Check git is installed upfront (checkGitInstalled)
 *  - Check repo is valid upfront (checkIsGitRepo)
 *  - Parse defensively: skip malformed lines, treat binary as 0 lines
 */

import { execSync, spawnSync } from "child_process";
import * as path from "path";
import { RawCommit, FileNumStat, RenameRecord, CommitData } from "./types";
import { resolveRenamePath } from "./utils/pathUtils";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Run a git command synchronously. Returns stdout as a trimmed string.
 * Throws a readable error if the command fails.
 */
function runGit(args: string[], repoPath: string): string {
  const result = spawnSync("git", ["-C", repoPath, ...args], {
    encoding: "utf8",
    maxBuffer: 200 * 1024 * 1024, // 200 MB – large repos can produce huge output
  });

  if (result.error) {
    throw new Error(`git not found or failed to launch: ${result.error.message}`);
  }
  if (result.status !== 0) {
    const stderr = (result.stderr || "").trim();
    throw new Error(`git ${args[0]} failed (exit ${result.status}): ${stderr}`);
  }

  return (result.stdout || "").trim();
}

// ---------------------------------------------------------------------------
// Preflight checks
// ---------------------------------------------------------------------------

/** Verify git is installed and reachable. Returns the version string. */
export function checkGitInstalled(): string {
  try {
    const out = execSync("git --version", { encoding: "utf8" }).trim();
    return out.replace("git version ", "");
  } catch {
    throw new Error(
      "git is not installed or not in PATH. Please install git: https://git-scm.com/"
    );
  }
}

/** Verify the given directory is a git repository. */
export function checkIsGitRepo(repoPath: string): void {
  const result = spawnSync("git", ["-C", repoPath, "rev-parse", "--git-dir"], {
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(
      `Not a git repository (or any of the parent directories): ${path.resolve(repoPath)}`
    );
  }
}

// ---------------------------------------------------------------------------
// Commit listing
// ---------------------------------------------------------------------------

/**
 * Fetch a list of commits from git log.
 * Format: SHA \t ISO-date \t author \t subject
 */
export function listCommits(
  repoPath: string,
  opts: {
    since?: string;
    maxCommits?: number;
    includeMerges: boolean;
  }
): RawCommit[] {
  const args: string[] = [
    "log",
    "--date=iso-strict",
    "--pretty=format:%H\t%ad\t%an\t%s",
  ];

  if (!opts.includeMerges) args.push("--no-merges");
  if (opts.since) args.push(`--since=${opts.since}`);
  if (opts.maxCommits) args.push(`--max-count=${opts.maxCommits}`);

  const raw = runGit(args, repoPath);
  if (!raw) return [];

  return raw
    .split("\n")
    .map((line) => line.split("\t"))
    .filter((parts) => parts.length >= 4)
    .map(([sha, date, author, ...subjectParts]) => ({
      sha: sha.trim(),
      date: date.trim(),
      author: author.trim(),
      subject: subjectParts.join("\t").trim(),
    }));
}

// ---------------------------------------------------------------------------
// Per-commit stats
// ---------------------------------------------------------------------------

/**
 * Parse numstat output for a single commit.
 * Lines look like: <added>\t<deleted>\t<path>
 * Binary files show "-" for both counts → treated as 0.
 */
export function parseNumStat(raw: string): FileNumStat[] {
  const stats: FileNumStat[] = [];
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const parts = trimmed.split("\t");
    if (parts.length < 3) continue;

    const [addedRaw, deletedRaw, ...pathParts] = parts;
    const added = addedRaw === "-" ? 0 : parseInt(addedRaw, 10);
    const deleted = deletedRaw === "-" ? 0 : parseInt(deletedRaw, 10);
    const filePath = resolveRenamePath(pathParts.join("\t").trim());

    if (!isNaN(added) && !isNaN(deleted) && filePath) {
      stats.push({ added, deleted, path: filePath });
    }
  }
  return stats;
}

/**
 * Parse name-status output to extract rename records.
 * Lines starting with R look like: R<score>\told\tnew
 */
export function parseNameStatus(raw: string): RenameRecord[] {
  const renames: RenameRecord[] = [];
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("R")) continue;

    const parts = trimmed.split("\t");
    if (parts.length < 3) continue;

    const score = parseInt(parts[0].slice(1), 10) || 0;
    const oldPath = resolveRenamePath(parts[1].trim());
    const newPath = resolveRenamePath(parts[2].trim());
    renames.push({ oldPath, newPath, score });
  }
  return renames;
}

/**
 * Get full data for a single commit: numStats + renames.
 * Uses a single `git show` call with combined format.
 */
export function getCommitData(repoPath: string, sha: string): CommitData {
  // --numstat for line counts
  const numStatRaw = runGit(
    ["show", "--numstat", "--format=", sha],
    repoPath
  );
  // --name-status for renames
  const nameStatusRaw = runGit(
    ["show", "--name-status", "--format=", sha],
    repoPath
  );

  return {
    sha,
    date: "",  // filled in by caller from RawCommit
    author: "",
    subject: "",
    numStats: parseNumStat(numStatRaw),
    renames: parseNameStatus(nameStatusRaw),
  };
}

// ---------------------------------------------------------------------------
// Additional queries
// ---------------------------------------------------------------------------

/** Returns the list of files currently tracked in the repo. */
export function listTrackedFiles(repoPath: string): string[] {
  const raw = runGit(["ls-files"], repoPath);
  if (!raw) return [];
  return raw.split("\n").map((f) => f.trim()).filter(Boolean);
}

/**
 * Fetch per-commit numstat + name-status for a batch of commits.
 * Emits progress to stderr every `progressEvery` commits.
 */
export function fetchAllCommitData(
  repoPath: string,
  commits: RawCommit[],
  opts: { progressEvery?: number } = {}
): CommitData[] {
  const { progressEvery = 100 } = opts;
  const results: CommitData[] = [];

  for (let i = 0; i < commits.length; i++) {
    const raw = commits[i];

    if (progressEvery > 0 && i > 0 && i % progressEvery === 0) {
      process.stderr.write(`  → Processed ${i}/${commits.length} commits...\r`);
    }

    try {
      const data = getCommitData(repoPath, raw.sha);
      data.sha = raw.sha;
      data.date = raw.date;
      data.author = raw.author;
      data.subject = raw.subject;
      results.push(data);
    } catch {
      // Skip commits that fail (e.g., shallow clone gaps)
    }
  }

  if (commits.length > progressEvery) {
    process.stderr.write(`  → Processed ${commits.length}/${commits.length} commits.\n`);
  }

  return results;
}
