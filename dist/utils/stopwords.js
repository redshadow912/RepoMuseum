"use strict";
/**
 * stopwords.ts
 * Common English stopwords plus Git-specific noise words to filter out
 * when extracting keywords from commit messages.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.STOPWORDS = void 0;
exports.STOPWORDS = new Set([
    // English articles / prepositions / conjunctions
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by",
    "from", "is", "it", "its", "be", "as", "at", "this", "that", "was", "are", "were",
    "been", "have", "has", "had", "not", "no", "if", "so", "do", "did", "does", "can",
    "will", "would", "could", "should", "may", "might", "shall", "which", "who", "what",
    "when", "where", "how", "all", "any", "some", "more", "than", "into", "out", "up",
    "also", "just", "about", "after", "before", "during", "while", "then", "now",
    "over", "under", "such", "there", "their", "they", "we", "i", "you", "he", "she",
    "our", "your", "my", "his", "her", "us", "them", "me", "am", "only", "one", "two",
    "very", "both", "few", "many", "much", "most", "own", "same", "other", "another",
    // Git / commit noise
    "fix", "fixed", "fixes", "fixing", "update", "updated", "updates", "add", "added",
    "adds", "adding", "remove", "removed", "removes", "removing", "change", "changed",
    "changes", "changing", "refactor", "refactored", "cleanup", "clean", "minor",
    "merge", "merging", "merged", "branch", "commit", "revert", "reverts", "bump",
    "release", "version", "initial", "init", "readme", "wip", "todo", "misc", "temp",
    "test", "tests", "testing", "build", "ci", "cd", "lint", "format", "docs", "doc",
    "use", "using", "used", "make", "makes", "made", "get", "getting", "got", "set",
    "new", "old", "move", "moved", "moves", "rename", "renames", "import", "exports",
    "code", "file", "files", "type", "types", "data", "function", "method", "class",
    "module", "package", "lib", "src", "enable", "disable", "allow", "handle",
    // Numbers / short tokens filtered at runtime (len < 3)
]);
//# sourceMappingURL=stopwords.js.map