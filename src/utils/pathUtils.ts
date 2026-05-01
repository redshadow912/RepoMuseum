/**
 * pathUtils.ts
 * Helpers for normalizing file paths, extracting directory names,
 * and handling git rename path syntax.
 */

import * as path from "path";

/**
 * Normalize a file path to use forward slashes and remove leading ./
 */
export function normalizePath(p: string): string {
  return p.replace(/\\/g, "/").replace(/^\.\//, "");
}

/**
 * Extract the top-level directory from a normalized file path.
 * Returns "." for root-level files.
 */
export function topDir(filePath: string): string {
  const normalized = normalizePath(filePath);
  const parts = normalized.split("/");
  return parts.length > 1 ? parts[0] : ".";
}

/**
 * Get the parent directory of a file path (normalized).
 * Returns "." for root-level files.
 */
export function parentDir(filePath: string): string {
  const normalized = normalizePath(filePath);
  const dir = path.posix.dirname(normalized);
  return dir === "." || dir === "" ? "." : dir;
}

/**
 * Parse a git rename path like "src/{old => new}/file.ts"
 * or simple "old/path => new/path" into the actual new path.
 */
export function resolveRenamePath(rawPath: string): string {
  // Handle brace-based rename: "some/{old => new}/file"
  const braceMatch = rawPath.match(/^(.*?)\{(.*?) => (.*?)\}(.*)$/);
  if (braceMatch) {
    const [, prefix, , newPart, suffix] = braceMatch;
    return normalizePath(`${prefix}${newPart}${suffix}`);
  }

  // Handle simple rename: "old/path => new/path"
  const arrowMatch = rawPath.match(/^(.*?) => (.*)$/);
  if (arrowMatch) {
    return normalizePath(arrowMatch[2]);
  }

  return normalizePath(rawPath);
}

/**
 * Get the N most frequent items from an array using a key extractor.
 */
export function topNByFrequency<T>(
  items: T[],
  keyFn: (item: T) => string,
  n: number
): Array<{ key: string; count: number }> {
  const freq: Map<string, number> = new Map();
  for (const item of items) {
    const k = keyFn(item);
    freq.set(k, (freq.get(k) ?? 0) + 1);
  }
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([key, count]) => ({ key, count }));
}
