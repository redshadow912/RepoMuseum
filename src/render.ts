/**
 * render.ts
 * Takes ReportData, writes it to the output directory along with the HTML template.
 */

import * as fs from "fs";
import * as path from "path";
import { ReportData } from "./types";

export function renderReport(reportDir: string, data: ReportData) {
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const jsonPath = path.join(reportDir, "report.json");
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), "utf8");

  const templatePath = path.join(__dirname, "..", "templates", "index.html");
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Cannot find HTML template at ${templatePath}`);
  }
  
  let htmlContent = fs.readFileSync(templatePath, "utf8");
  htmlContent = htmlContent.replace(
    "/*__REPORT_DATA__*/ null",
    JSON.stringify(data)
  );

  const outHtmlPath = path.join(reportDir, "index.html");
  fs.writeFileSync(outHtmlPath, htmlContent, "utf8");

  return { outHtmlPath, jsonPath };
}
