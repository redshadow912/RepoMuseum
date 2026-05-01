/**
 * pathUtils.ts
 * Helpers for normalizing file paths, extracting directory names,
 * and handling git rename path syntax.
 */
/**
 * Normalize a file path to use forward slashes and remove leading ./
 */
export declare function normalizePath(p: string): string;
/**
 * Extract the top-level directory from a normalized file path.
 * Returns "." for root-level files.
 */
export declare function topDir(filePath: string): string;
/**
 * Get the parent directory of a file path (normalized).
 * Returns "." for root-level files.
 */
export declare function parentDir(filePath: string): string;
/**
 * Parse a git rename path like "src/{old => new}/file.ts"
 * or simple "old/path => new/path" into the actual new path.
 */
export declare function resolveRenamePath(rawPath: string): string;
/**
 * Get the N most frequent items from an array using a key extractor.
 */
export declare function topNByFrequency<T>(items: T[], keyFn: (item: T) => string, n: number): Array<{
    key: string;
    count: number;
}>;
//# sourceMappingURL=pathUtils.d.ts.map