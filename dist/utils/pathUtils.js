"use strict";
/**
 * pathUtils.ts
 * Helpers for normalizing file paths, extracting directory names,
 * and handling git rename path syntax.
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
exports.normalizePath = normalizePath;
exports.topDir = topDir;
exports.parentDir = parentDir;
exports.resolveRenamePath = resolveRenamePath;
exports.topNByFrequency = topNByFrequency;
const path = __importStar(require("path"));
/**
 * Normalize a file path to use forward slashes and remove leading ./
 */
function normalizePath(p) {
    return p.replace(/\\/g, "/").replace(/^\.\//, "");
}
/**
 * Extract the top-level directory from a normalized file path.
 * Returns "." for root-level files.
 */
function topDir(filePath) {
    const normalized = normalizePath(filePath);
    const parts = normalized.split("/");
    return parts.length > 1 ? parts[0] : ".";
}
/**
 * Get the parent directory of a file path (normalized).
 * Returns "." for root-level files.
 */
function parentDir(filePath) {
    const normalized = normalizePath(filePath);
    const dir = path.posix.dirname(normalized);
    return dir === "." || dir === "" ? "." : dir;
}
/**
 * Parse a git rename path like "src/{old => new}/file.ts"
 * or simple "old/path => new/path" into the actual new path.
 */
function resolveRenamePath(rawPath) {
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
function topNByFrequency(items, keyFn, n) {
    const freq = new Map();
    for (const item of items) {
        const k = keyFn(item);
        freq.set(k, (freq.get(k) ?? 0) + 1);
    }
    return Array.from(freq.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, n)
        .map(([key, count]) => ({ key, count }));
}
//# sourceMappingURL=pathUtils.js.map