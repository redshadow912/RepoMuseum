/**
 * tokenize.ts
 * Lightweight commit-message tokenizer.
 * Splits on non-alpha chars, lowercases, removes stopwords & short tokens.
 */

import { STOPWORDS } from "./stopwords";

/**
 * Tokenize a commit message into meaningful keywords.
 * Returns an array of lowercase strings, filtered of stopwords & noise.
 */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    // Replace everything that's not a letter with a space
    .replace(/[^a-z]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
}

/**
 * Count word frequency across an array of messages.
 * Returns a sorted array of { word, count } pairs, descending by count.
 */
export function topKeywords(
  messages: string[],
  topN = 10
): Array<{ word: string; count: number }> {
  const freq: Map<string, number> = new Map();

  for (const msg of messages) {
    for (const token of tokenize(msg)) {
      freq.set(token, (freq.get(token) ?? 0) + 1);
    }
  }

  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word, count]) => ({ word, count }));
}
