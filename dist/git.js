"use strict";
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
exports.checkGitInstalled = checkGitInstalled;
exports.checkIsGitRepo = checkIsGitRepo;
exports.listCommits = listCommits;
exports.parseNumStat = parseNumStat;
exports.parseNameStatus = parseNameStatus;
exports.getCommitData = getCommitData;
exports.listTrackedFiles = listTrackedFiles;
exports.fetchAllCommitData = fetchAllCommitData;
const child_process_1 = require("child_process");
const path = __importStar(require("path"));
const pathUtils_1 = require("./utils/pathUtils");
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
/**
 * Run a git command synchronously. Returns stdout as a trimmed string.
 * Throws a readable error if the command fails.
 */
function runGit(args, repoPath) {
    const result = (0, child_process_1.spawnSync)("git", ["-C", repoPath, ...args], {
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
function checkGitInstalled() {
    try {
        const out = (0, child_process_1.execSync)("git --version", { encoding: "utf8" }).trim();
        return out.replace("git version ", "");
    }
    catch {
        throw new Error("git is not installed or not in PATH. Please install git: https://git-scm.com/");
    }
}
/** Verify the given directory is a git repository. */
function checkIsGitRepo(repoPath) {
    const result = (0, child_process_1.spawnSync)("git", ["-C", repoPath, "rev-parse", "--git-dir"], {
        encoding: "utf8",
    });
    if (result.status !== 0) {
        throw new Error(`Not a git repository (or any of the parent directories): ${path.resolve(repoPath)}`);
    }
}
// ---------------------------------------------------------------------------
// Commit listing
// ---------------------------------------------------------------------------
/**
 * Fetch a list of commits from git log.
 * Format: SHA \t ISO-date \t author \t subject
 */
function listCommits(repoPath, opts) {
    const args = [
        "log",
        "--date=iso-strict",
        "--pretty=format:%H\t%ad\t%an\t%s",
    ];
    if (!opts.includeMerges)
        args.push("--no-merges");
    if (opts.since)
        args.push(`--since=${opts.since}`);
    if (opts.maxCommits)
        args.push(`--max-count=${opts.maxCommits}`);
    const raw = runGit(args, repoPath);
    if (!raw)
        return [];
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
function parseNumStat(raw) {
    const stats = [];
    for (const line of raw.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed)
            continue;
        const parts = trimmed.split("\t");
        if (parts.length < 3)
            continue;
        const [addedRaw, deletedRaw, ...pathParts] = parts;
        const added = addedRaw === "-" ? 0 : parseInt(addedRaw, 10);
        const deleted = deletedRaw === "-" ? 0 : parseInt(deletedRaw, 10);
        const filePath = (0, pathUtils_1.resolveRenamePath)(pathParts.join("\t").trim());
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
function parseNameStatus(raw) {
    const renames = [];
    for (const line of raw.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("R"))
            continue;
        const parts = trimmed.split("\t");
        if (parts.length < 3)
            continue;
        const score = parseInt(parts[0].slice(1), 10) || 0;
        const oldPath = (0, pathUtils_1.resolveRenamePath)(parts[1].trim());
        const newPath = (0, pathUtils_1.resolveRenamePath)(parts[2].trim());
        renames.push({ oldPath, newPath, score });
    }
    return renames;
}
/**
 * Get full data for a single commit: numStats + renames.
 * Uses a single `git show` call with combined format.
 */
function getCommitData(repoPath, sha) {
    // --numstat for line counts
    const numStatRaw = runGit(["show", "--numstat", "--format=", sha], repoPath);
    // --name-status for renames
    const nameStatusRaw = runGit(["show", "--name-status", "--format=", sha], repoPath);
    return {
        sha,
        date: "", // filled in by caller from RawCommit
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
function listTrackedFiles(repoPath) {
    const raw = runGit(["ls-files"], repoPath);
    if (!raw)
        return [];
    return raw.split("\n").map((f) => f.trim()).filter(Boolean);
}
/**
 * Fetch per-commit numstat + name-status for a batch of commits.
 * Emits progress to stderr every `progressEvery` commits.
 */
function fetchAllCommitData(repoPath, commits, opts = {}) {
    const { progressEvery = 100 } = opts;
    const results = [];
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
        }
        catch {
            // Skip commits that fail (e.g., shallow clone gaps)
        }
    }
    if (commits.length > progressEvery) {
        process.stderr.write(`  → Processed ${commits.length}/${commits.length} commits.\n`);
    }
    return results;
}
//# sourceMappingURL=git.js.map