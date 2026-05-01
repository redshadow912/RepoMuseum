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
import { CommitData, ReportData } from "./types";
/**
 * Build the complete ReportData object from raw commit data.
 */
export declare function buildReport(commits: CommitData[], trackedFiles: string[], opts: {
    repoName: string;
    repoPath: string;
    gitVersion: string;
    since?: string;
    numEras: number;
}): ReportData;
//# sourceMappingURL=analyze.d.ts.map