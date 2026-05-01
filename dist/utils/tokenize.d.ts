/**
 * tokenize.ts
 * Lightweight commit-message tokenizer.
 * Splits on non-alpha chars, lowercases, removes stopwords & short tokens.
 */
/**
 * Tokenize a commit message into meaningful keywords.
 * Returns an array of lowercase strings, filtered of stopwords & noise.
 */
export declare function tokenize(text: string): string[];
/**
 * Count word frequency across an array of messages.
 * Returns a sorted array of { word, count } pairs, descending by count.
 */
export declare function topKeywords(messages: string[], topN?: number): Array<{
    word: string;
    count: number;
}>;
//# sourceMappingURL=tokenize.d.ts.map