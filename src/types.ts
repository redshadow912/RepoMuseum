/**
 * types.ts
 * Shared TypeScript interfaces and types for the RepoMuseum project.
 * All data structures flow through these types from git extraction → analysis → rendering.
 */

// ---------------------------------------------------------------------------
// Raw git data types
// ---------------------------------------------------------------------------

/** A single parsed commit from `git log` */
export interface RawCommit {
  sha: string;
  date: string;        // ISO 8601
  author: string;
  subject: string;
}

/** Per-file line stats from `git show --numstat` */
export interface FileNumStat {
  added: number;
  deleted: number;
  path: string;        // may contain rename arrow "old => new"
}

/** A rename record from `git show --name-status` */
export interface RenameRecord {
  oldPath: string;
  newPath: string;
  score: number;       // similarity score 0-100
}

/** All data extracted for a single commit */
export interface CommitData {
  sha: string;
  date: string;
  author: string;
  subject: string;
  numStats: FileNumStat[];
  renames: RenameRecord[];
}

// ---------------------------------------------------------------------------
// Analysis / report types
// ---------------------------------------------------------------------------

/** Information about a single file's churn */
export interface FileChurn {
  path: string;
  added: number;
  deleted: number;
  churn: number;             // added + deleted
  commits: number;           // number of commits touching this file
  topAuthor: string;         // author with most touches
}

/** Per-era summary */
export interface Era {
  index: number;
  startDate: string;
  endDate: string;
  commits: number;
  topFiles: Array<{ path: string; churn: number }>;
  topDirs: Array<{ dir: string; churn: number }>;
  keywords: Array<{ word: string; count: number }>;
}

/** Author contribution to a single file */
export interface AuthorContribution {
  author: string;
  churn: number;
  commits: number;
  pct: number;              // percentage of total churn for this file
}

/** Ownership record for a single file */
export interface FileOwnership {
  file: string;
  totalChurn: number;
  topAuthors: AuthorContribution[];
  concentration: number;    // % of churn by top author
}

/** Fun facts / artifacts */
export interface Artifacts {
  oldestFile: { path: string; firstSeen: string } | null;
  mostRenamedFile: { path: string; renames: number } | null;
  zombieDir: { dir: string; historicalChurn: number; recentCommits: number } | null;
  largestCommit: { sha: string; date: string; author: string; subject: string; churn: number } | null;
  bugGraveyard: { path: string; bugCount: number }[];
}

/** File co-change pair */
export interface CoChangePair {
  fileA: string;
  fileB: string;
  count: number;
}

/** Directory co-change pair */
export interface DirCoChangePair {
  dirA: string;
  dirB: string;
  count: number;
}

/** The complete report data object */
export interface ReportData {
  repo: {
    name: string;
    path: string;
    generatedAt: string;
    gitVersion: string;
  };
  summary: {
    since: string | null;
    until: string;
    commits: number;
    authors: number;
    filesTouched: number;
  };
  eras: Era[];
  hotspots: {
    byChurn: FileChurn[];
    byTouches: FileChurn[];
  };
  ownership: FileOwnership[];
  artifacts: Artifacts;
  cochange: {
    filePairs: CoChangePair[];
    dirPairs: DirCoChangePair[];
  };
  confessional?: {
    midnightOil: number;
    weekendWarriors: number;
    swearCount: number;
    panicCount: number;
    cultureBadge: string;
  };
}

// ---------------------------------------------------------------------------
// CLI options
// ---------------------------------------------------------------------------

export interface CliOptions {
  out: string;
  since?: string;
  maxCommits?: number;
  eras: number;
  includeMerges: boolean;
  open: boolean;
}
