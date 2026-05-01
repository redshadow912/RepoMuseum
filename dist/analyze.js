"use strict";
/**
 * analyze.ts
 * Transforms raw CommitData arrays into a structured ReportData object.
 *
 * This module contains:
 *  - Era partitioning (by commit count)
 *  - Hotspot computation (by churn and by touches)
 *  - Ownership analysis (top authors per file)
 *  - Artifacts / fun facts
 *  - Co-change pair computation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildReport = buildReport;
const tokenize_1 = require("./utils/tokenize");
const pathUtils_1 = require("./utils/pathUtils");
// ---------------------------------------------------------------------------
// Era partitioning
// ---------------------------------------------------------------------------
/**
 * Partition commits evenly by count into `numEras` buckets.
 * Returns an array of Era objects with top files/dirs/keywords.
 */
function partitionIntoEras(commits, numEras) {
    if (commits.length === 0)
        return [];
    // Sort commits chronologically (oldest first)
    const sorted = [...commits].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const chunkSize = Math.ceil(sorted.length / numEras);
    const eras = [];
    for (let i = 0; i < numEras; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, sorted.length);
        if (start >= sorted.length)
            break;
        const chunk = sorted.slice(start, end);
        // Aggregate file churn within this era
        const fileChurn = new Map();
        const dirChurn = new Map();
        for (const commit of chunk) {
            for (const stat of commit.numStats) {
                const churn = stat.added + stat.deleted;
                fileChurn.set(stat.path, (fileChurn.get(stat.path) ?? 0) + churn);
                const dir = (0, pathUtils_1.parentDir)(stat.path);
                dirChurn.set(dir, (dirChurn.get(dir) ?? 0) + churn);
            }
        }
        // Top 5 files by churn
        const topFiles = Array.from(fileChurn.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([p, churn]) => ({ path: p, churn }));
        // Top 5 dirs by churn
        const topDirs = Array.from(dirChurn.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([dir, churn]) => ({ dir, churn }));
        // Top 10 keywords from commit messages
        const messages = chunk.map((c) => c.subject);
        const keywords = (0, tokenize_1.topKeywords)(messages, 10);
        eras.push({
            index: i,
            startDate: chunk[0].date,
            endDate: chunk[chunk.length - 1].date,
            commits: chunk.length,
            topFiles,
            topDirs,
            keywords,
        });
    }
    return eras;
}
// ---------------------------------------------------------------------------
// File stats aggregation
// ---------------------------------------------------------------------------
/**
 * Build a map of all file stats from the commit dataset.
 * Tracks churn, touch count, per-author contributions, and first-seen date.
 */
function buildFileStatsMap(commits) {
    const statsMap = new Map();
    // Sort chronologically so firstSeen is correct
    const sorted = [...commits].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    for (const commit of sorted) {
        for (const stat of commit.numStats) {
            if (!stat.path)
                continue;
            let entry = statsMap.get(stat.path);
            if (!entry) {
                entry = {
                    path: stat.path,
                    added: 0,
                    deleted: 0,
                    touchCount: 0,
                    authorTouches: new Map(),
                    authorChurn: new Map(),
                    firstSeen: commit.date,
                    renames: 0,
                };
                statsMap.set(stat.path, entry);
            }
            const churn = stat.added + stat.deleted;
            entry.added += stat.added;
            entry.deleted += stat.deleted;
            entry.touchCount += 1;
            entry.authorTouches.set(commit.author, (entry.authorTouches.get(commit.author) ?? 0) + 1);
            entry.authorChurn.set(commit.author, (entry.authorChurn.get(commit.author) ?? 0) + churn);
        }
        // Count renames
        for (const rename of commit.renames) {
            const entry = statsMap.get(rename.newPath);
            if (entry)
                entry.renames += 1;
            // Also track the new path if not seen yet
            if (!statsMap.has(rename.newPath)) {
                statsMap.set(rename.newPath, {
                    path: rename.newPath,
                    added: 0,
                    deleted: 0,
                    touchCount: 0,
                    authorTouches: new Map(),
                    authorChurn: new Map(),
                    firstSeen: commit.date,
                    renames: 1,
                });
            }
            else {
                const e = statsMap.get(rename.newPath);
                e.renames += 1;
            }
        }
    }
    return statsMap;
}
/** Convert a FileStats entry into a FileChurn object. */
function toFileChurn(stats) {
    const topAuthor = Array.from(stats.authorTouches.entries())
        .sort((a, b) => b[1] - a[1])[0]?.[0] ?? "unknown";
    return {
        path: stats.path,
        added: stats.added,
        deleted: stats.deleted,
        churn: stats.added + stats.deleted,
        commits: stats.touchCount,
        topAuthor,
    };
}
// ---------------------------------------------------------------------------
// Hotspots
// ---------------------------------------------------------------------------
function computeHotspots(statsMap, topN = 20) {
    const all = Array.from(statsMap.values()).map(toFileChurn);
    const byChurn = [...all]
        .sort((a, b) => b.churn - a.churn)
        .slice(0, topN);
    const byTouches = [...all]
        .sort((a, b) => b.commits - a.commits)
        .slice(0, topN);
    return { byChurn, byTouches };
}
// ---------------------------------------------------------------------------
// Ownership
// ---------------------------------------------------------------------------
function computeOwnership(statsMap, hotspotFiles) {
    return hotspotFiles.map((filePath) => {
        const stats = statsMap.get(filePath);
        if (!stats) {
            return { file: filePath, totalChurn: 0, topAuthors: [], concentration: 0 };
        }
        const totalChurn = stats.added + stats.deleted;
        const authorEntries = Array.from(stats.authorChurn.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);
        const topAuthors = authorEntries.map(([author, churn]) => ({
            author,
            churn,
            commits: stats.authorTouches.get(author) ?? 0,
            pct: totalChurn > 0 ? Math.round((churn / totalChurn) * 100) : 0,
        }));
        const concentration = topAuthors.length > 0 ? topAuthors[0].pct : 0;
        return { file: filePath, totalChurn, topAuthors, concentration };
    });
}
// ---------------------------------------------------------------------------
// Artifacts / fun facts
// ---------------------------------------------------------------------------
function computeArtifacts(commits, statsMap, trackedFiles) {
    // 1. Oldest file still present
    let oldestFile = null;
    if (trackedFiles.length > 0) {
        let earliest = null;
        for (const f of trackedFiles) {
            const stats = statsMap.get(f);
            if (!stats)
                continue;
            if (!earliest || new Date(stats.firstSeen) < new Date(earliest.firstSeen)) {
                earliest = { path: f, firstSeen: stats.firstSeen };
            }
        }
        oldestFile = earliest;
    }
    // 2. Most renamed file
    let mostRenamedFile = null;
    let maxRenames = 0;
    for (const [filePath, stats] of statsMap) {
        if (stats.renames > maxRenames) {
            maxRenames = stats.renames;
            mostRenamedFile = { path: filePath, renames: stats.renames };
        }
    }
    // 3. Zombie module: dir with high historical churn but very low recent activity
    //    "Recent" = last 10% of commits by date
    const sorted = [...commits].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const recentThreshold = Math.max(0, sorted.length - Math.ceil(sorted.length * 0.1));
    const recentCommits = sorted.slice(recentThreshold);
    const recentDirs = new Set();
    const recentDirCount = new Map();
    for (const c of recentCommits) {
        for (const s of c.numStats) {
            const d = (0, pathUtils_1.topDir)(s.path);
            recentDirs.add(d);
            recentDirCount.set(d, (recentDirCount.get(d) ?? 0) + 1);
        }
    }
    // Compute total historical churn per dir
    const historicalDirChurn = new Map();
    for (const c of commits) {
        for (const s of c.numStats) {
            const d = (0, pathUtils_1.topDir)(s.path);
            historicalDirChurn.set(d, (historicalDirChurn.get(d) ?? 0) + s.added + s.deleted);
        }
    }
    let zombieDir = null;
    let maxZombieScore = 0;
    for (const [dir, historicalChurn] of historicalDirChurn) {
        if (historicalChurn < 100)
            continue; // ignore tiny dirs
        const recentActivity = recentDirCount.get(dir) ?? 0;
        const zombieScore = historicalChurn / (recentActivity + 1);
        if (zombieScore > maxZombieScore) {
            maxZombieScore = zombieScore;
            zombieDir = { dir, historicalChurn, recentCommits: recentActivity };
        }
    }
    // 4. Largest commit by lines changed
    let largestCommit = null;
    let maxChurn = 0;
    for (const commit of commits) {
        const churn = commit.numStats.reduce((sum, s) => sum + s.added + s.deleted, 0);
        if (churn > maxChurn) {
            maxChurn = churn;
            largestCommit = {
                sha: commit.sha,
                date: commit.date,
                author: commit.author,
                subject: commit.subject,
                churn,
            };
        }
    }
    return { oldestFile, mostRenamedFile, zombieDir, largestCommit };
}
// ---------------------------------------------------------------------------
// Co-change pairs
// ---------------------------------------------------------------------------
/**
 * Build co-change pairs from commits.
 * For each commit with N files, record all N*(N-1)/2 file pairs.
 * Cap files-per-commit at 30 to avoid O(n²) blow-up on massive commits.
 */
function computeCoChange(commits, topNFiles = 15, topNDirs = 10) {
    const filePairFreq = new Map();
    const dirPairFreq = new Map();
    for (const commit of commits) {
        const files = commit.numStats
            .map((s) => s.path)
            .filter(Boolean)
            .slice(0, 30); // cap to avoid combinatorial explosion
        const dirs = [...new Set(files.map(pathUtils_1.topDir))];
        // File pairs
        for (let i = 0; i < files.length; i++) {
            for (let j = i + 1; j < files.length; j++) {
                const key = [files[i], files[j]].sort().join("\0");
                filePairFreq.set(key, (filePairFreq.get(key) ?? 0) + 1);
            }
        }
        // Dir pairs
        for (let i = 0; i < dirs.length; i++) {
            for (let j = i + 1; j < dirs.length; j++) {
                const key = [dirs[i], dirs[j]].sort().join("\0");
                dirPairFreq.set(key, (dirPairFreq.get(key) ?? 0) + 1);
            }
        }
    }
    const filePairs = Array.from(filePairFreq.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, topNFiles)
        .map(([key, count]) => {
        const [fileA, fileB] = key.split("\0");
        return { fileA, fileB, count };
    });
    const dirPairs = Array.from(dirPairFreq.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, topNDirs)
        .map(([key, count]) => {
        const [dirA, dirB] = key.split("\0");
        return { dirA, dirB, count };
    });
    return { filePairs, dirPairs };
}
// ---------------------------------------------------------------------------
// Main build function
// ---------------------------------------------------------------------------
/**
 * Build the complete ReportData object from raw commit data.
 */
function buildReport(commits, trackedFiles, opts) {
    const statsMap = buildFileStatsMap(commits);
    // Authors from commit list
    const uniqueAuthors = new Set(commits.map((c) => c.author));
    // Date range
    const dates = commits.map((c) => c.date).sort();
    const since = opts.since ?? dates[0] ?? "";
    const until = dates[dates.length - 1] ?? "";
    // Eras
    const eras = partitionIntoEras(commits, opts.numEras);
    // Hotspots
    const { byChurn, byTouches } = computeHotspots(statsMap, 20);
    // Ownership (top 20 hotspot files by churn)
    const hotspotFilePaths = byChurn.map((f) => f.path);
    const ownership = computeOwnership(statsMap, hotspotFilePaths);
    // Artifacts
    const artifacts = computeArtifacts(commits, statsMap, trackedFiles);
    // Co-change
    const cochange = computeCoChange(commits);
    return {
        repo: {
            name: opts.repoName,
            path: opts.repoPath,
            generatedAt: new Date().toISOString(),
            gitVersion: opts.gitVersion,
        },
        summary: {
            since: since || null,
            until,
            commits: commits.length,
            authors: uniqueAuthors.size,
            filesTouched: statsMap.size,
        },
        eras,
        hotspots: { byChurn, byTouches },
        ownership,
        artifacts,
        cochange,
    };
}
//# sourceMappingURL=analyze.js.map