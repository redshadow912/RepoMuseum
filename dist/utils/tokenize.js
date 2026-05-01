"use strict";
/**
 * tokenize.ts
 * Lightweight commit-message tokenizer.
 * Splits on non-alpha chars, lowercases, removes stopwords & short tokens.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = tokenize;
exports.topKeywords = topKeywords;
const stopwords_1 = require("./stopwords");
/**
 * Tokenize a commit message into meaningful keywords.
 * Returns an array of lowercase strings, filtered of stopwords & noise.
 */
function tokenize(text) {
    return text
        .toLowerCase()
        // Replace everything that's not a letter with a space
        .replace(/[^a-z]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length >= 3 && !stopwords_1.STOPWORDS.has(w));
}
/**
 * Count word frequency across an array of messages.
 * Returns a sorted array of { word, count } pairs, descending by count.
 */
function topKeywords(messages, topN = 10) {
    const freq = new Map();
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
//# sourceMappingURL=tokenize.js.map