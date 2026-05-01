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
import { RawCommit, FileNumStat, RenameRecord, CommitData } from "./types";
/** Verify git is installed and reachable. Returns the version string. */
export declare function checkGitInstalled(): string;
/** Verify the given directory is a git repository. */
export declare function checkIsGitRepo(repoPath: string): void;
/**
 * Fetch a list of commits from git log.
 * Format: SHA \t ISO-date \t author \t subject
 */
export declare function listCommits(repoPath: string, opts: {
    since?: string;
    maxCommits?: number;
    includeMerges: boolean;
}): RawCommit[];
/**
 * Parse numstat output for a single commit.
 * Lines look like: <added>\t<deleted>\t<path>
 * Binary files show "-" for both counts → treated as 0.
 */
export declare function parseNumStat(raw: string): FileNumStat[];
/**
 * Parse name-status output to extract rename records.
 * Lines starting with R look like: R<score>\told\tnew
 */
export declare function parseNameStatus(raw: string): RenameRecord[];
/**
 * Get full data for a single commit: numStats + renames.
 * Uses a single `git show` call with combined format.
 */
export declare function getCommitData(repoPath: string, sha: string): CommitData;
/** Returns the list of files currently tracked in the repo. */
export declare function listTrackedFiles(repoPath: string): string[];
/**
 * Fetch per-commit numstat + name-status for a batch of commits.
 * Emits progress to stderr every `progressEvery` commits.
 */
export declare function fetchAllCommitData(repoPath: string, commits: RawCommit[], opts?: {
    progressEvery?: number;
}): CommitData[];
//# sourceMappingURL=git.d.ts.map