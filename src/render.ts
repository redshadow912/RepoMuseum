/**
 * render.ts
 * Takes ReportData, writes it to the output directory along with the HTML template.
 */

import * as fs from "fs";
import * as path from "path";
import { ReportData } from "./types";

export function renderReport(reportDir: string, data: ReportData) {
  // Ensure output dir exists
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  // Write JSON data
  const jsonPath = path.join(reportDir, "report.json");
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), "utf8");

  // Copy HTML template
  // We resolve relative to where this script is running from
  const templatePath = path.join(__dirname, "..", "templates", "index.html");
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Cannot find HTML template at ${templatePath}`);
  }
  
  const outHtmlPath = path.join(reportDir, "index.html");
  fs.copyFileSync(templatePath, outHtmlPath);

  return { outHtmlPath, jsonPath };
}
