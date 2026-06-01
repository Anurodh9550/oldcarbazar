#!/usr/bin/env node
/**
 * Tiny zero-dependency Markdown -> printable HTML converter.
 * Usage:  node scripts/md-to-html.js <input.md> <output.html>
 *
 * Built specifically for docs/USE-CASES.md (handles: headings, tables,
 * fenced code, blockquotes, lists, bold/italic, inline code, links, hr).
 * Open the resulting .html in a browser and press Ctrl+P -> Save as PDF.
 */

const fs = require("fs");
const path = require("path");

const [, , inputArg, outputArg] = process.argv;
if (!inputArg) {
  console.error("Usage: node scripts/md-to-html.js <input.md> [output.html]");
  process.exit(1);
}

const inputPath = path.resolve(inputArg);
const outputPath = path.resolve(
  outputArg || inputArg.replace(/\.md$/i, ".html")
);

const md = fs.readFileSync(inputPath, "utf8");

// ---------- helpers ----------
function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inline(text) {
  // Pull out inline code first so we don't process markdown inside it.
  const codePlaceholders = [];
  text = text.replace(/`([^`]+)`/g, (_, c) => {
    codePlaceholders.push(`<code>${escapeHtml(c)}</code>`);
    return `\u0000CODE${codePlaceholders.length - 1}\u0000`;
  });

  text = escapeHtml(text);

  // Links: [label](url)
  text = text.replace(
    /\[([^\]]+)\]\(([^)\s]+)\)/g,
    (_, label, url) => `<a href="${url}">${label}</a>`
  );

  // Bold: **text**
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // Italic: *text* (avoid breaking already-bold)
  text = text.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");

  // Restore code placeholders
  text = text.replace(/\u0000CODE(\d+)\u0000/g, (_, i) => codePlaceholders[+i]);

  return text;
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// ---------- block parser ----------
const lines = md.split(/\r?\n/);
let html = "";
let i = 0;

while (i < lines.length) {
  const line = lines[i];

  // Fenced code block
  if (/^```/.test(line)) {
    const lang = line.replace(/^```/, "").trim();
    i++;
    const buf = [];
    while (i < lines.length && !/^```/.test(lines[i])) {
      buf.push(lines[i]);
      i++;
    }
    i++; // skip closing ```
    html += `<pre><code class="lang-${escapeHtml(lang)}">${escapeHtml(
      buf.join("\n")
    )}</code></pre>\n`;
    continue;
  }

  // Heading
  const headingMatch = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
  if (headingMatch) {
    const level = headingMatch[1].length;
    const text = headingMatch[2];
    const id = slugify(text);
    html += `<h${level} id="${id}">${inline(text)}</h${level}>\n`;
    i++;
    continue;
  }

  // Horizontal rule
  if (/^(-{3,}|_{3,}|\*{3,})\s*$/.test(line)) {
    html += "<hr/>\n";
    i++;
    continue;
  }

  // Table: header line | --- | --- |
  if (
    /^\s*\|.+\|\s*$/.test(line) &&
    i + 1 < lines.length &&
    /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$/.test(lines[i + 1])
  ) {
    const headerCells = line
      .trim()
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((c) => c.trim());
    i += 2; // skip header + separator
    const bodyRows = [];
    while (i < lines.length && /^\s*\|.+\|\s*$/.test(lines[i])) {
      bodyRows.push(
        lines[i]
          .trim()
          .replace(/^\||\|$/g, "")
          .split("|")
          .map((c) => c.trim())
      );
      i++;
    }
    html += "<table>\n<thead><tr>";
    headerCells.forEach((c) => (html += `<th>${inline(c)}</th>`));
    html += "</tr></thead>\n<tbody>\n";
    bodyRows.forEach((row) => {
      html += "<tr>";
      row.forEach((c) => (html += `<td>${inline(c)}</td>`));
      html += "</tr>\n";
    });
    html += "</tbody>\n</table>\n";
    continue;
  }

  // Blockquote (collect consecutive > lines)
  if (/^>\s?/.test(line)) {
    const buf = [];
    while (i < lines.length && /^>\s?/.test(lines[i])) {
      buf.push(lines[i].replace(/^>\s?/, ""));
      i++;
    }
    html += `<blockquote>${inline(buf.join(" "))}</blockquote>\n`;
    continue;
  }

  // Unordered list
  if (/^\s*[-*+]\s+/.test(line)) {
    const items = [];
    while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
      items.push(lines[i].replace(/^\s*[-*+]\s+/, ""));
      i++;
    }
    html += "<ul>\n";
    items.forEach((it) => (html += `  <li>${inline(it)}</li>\n`));
    html += "</ul>\n";
    continue;
  }

  // Ordered list
  if (/^\s*\d+\.\s+/.test(line)) {
    const items = [];
    while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
      items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
      i++;
    }
    html += "<ol>\n";
    items.forEach((it) => (html += `  <li>${inline(it)}</li>\n`));
    html += "</ol>\n";
    continue;
  }

  // Blank line
  if (/^\s*$/.test(line)) {
    i++;
    continue;
  }

  // Paragraph (collect until blank)
  const buf = [line];
  i++;
  while (
    i < lines.length &&
    !/^\s*$/.test(lines[i]) &&
    !/^#{1,6}\s/.test(lines[i]) &&
    !/^```/.test(lines[i]) &&
    !/^>\s?/.test(lines[i]) &&
    !/^\s*[-*+]\s+/.test(lines[i]) &&
    !/^\s*\d+\.\s+/.test(lines[i]) &&
    !/^\s*\|.+\|\s*$/.test(lines[i])
  ) {
    buf.push(lines[i]);
    i++;
  }
  html += `<p>${inline(buf.join(" "))}</p>\n`;
}

// ---------- HTML template ----------
const title = "Old Car Bazar — Use Case Document";
const template = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${title}</title>
<style>
  :root {
    --primary: #f75d34;
    --primary-dark: #c2410c;
    --text: #1f2937;
    --muted: #6b7280;
    --border: #e5e7eb;
    --bg-soft: #fff7ed;
    --bg-code: #f3f4f6;
  }
  * { box-sizing: border-box; }
  html, body {
    margin: 0;
    padding: 0;
    font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    color: var(--text);
    background: #fff;
    line-height: 1.65;
    font-size: 14px;
  }
  main {
    max-width: 920px;
    margin: 0 auto;
    padding: 48px 56px 80px;
  }
  h1, h2, h3, h4, h5, h6 {
    color: #111827;
    font-weight: 700;
    line-height: 1.25;
    margin: 1.8em 0 0.6em;
    page-break-after: avoid;
  }
  h1 {
    font-size: 2.1em;
    border-bottom: 3px solid var(--primary);
    padding-bottom: 0.3em;
    margin-top: 0;
  }
  h2 {
    font-size: 1.55em;
    border-bottom: 1px solid var(--border);
    padding-bottom: 0.25em;
    color: var(--primary-dark);
  }
  h3 { font-size: 1.2em; color: var(--primary-dark); }
  h4 { font-size: 1.05em; }
  p { margin: 0.7em 0; }
  a { color: var(--primary); text-decoration: none; }
  a:hover { text-decoration: underline; }
  strong { color: #111827; }
  em { color: #374151; }
  hr {
    border: 0;
    border-top: 1px solid var(--border);
    margin: 2em 0;
  }
  ul, ol { margin: 0.6em 0 0.6em 1.4em; padding: 0; }
  li { margin: 0.25em 0; }
  blockquote {
    margin: 1em 0;
    padding: 0.8em 1.2em;
    border-left: 4px solid var(--primary);
    background: var(--bg-soft);
    color: #374151;
    border-radius: 4px;
    font-style: italic;
  }
  blockquote strong { font-style: normal; }
  code {
    font-family: "Consolas", "Courier New", monospace;
    background: var(--bg-code);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.88em;
    color: #be185d;
  }
  pre {
    background: #0f172a;
    color: #e5e7eb;
    padding: 14px 18px;
    border-radius: 8px;
    overflow-x: auto;
    font-size: 0.82em;
    line-height: 1.5;
    page-break-inside: avoid;
  }
  pre code {
    background: transparent;
    color: inherit;
    padding: 0;
    border-radius: 0;
    font-size: inherit;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1em 0 1.4em;
    font-size: 0.92em;
    page-break-inside: avoid;
  }
  thead { background: var(--primary); color: #fff; }
  th, td {
    border: 1px solid var(--border);
    padding: 8px 12px;
    text-align: left;
    vertical-align: top;
  }
  th { font-weight: 600; }
  tbody tr:nth-child(even) { background: #fafafa; }

  /* Cover-page styling for the very first h1 */
  main > h1:first-child {
    text-align: center;
    font-size: 2.5em;
    border: none;
    margin-bottom: 0.2em;
    padding: 0;
  }
  main > h1:first-child + blockquote {
    border: 2px solid var(--primary);
    background: #fff;
    text-align: center;
    font-style: normal;
    margin: 0 auto 2.5em;
    max-width: 640px;
  }

  /* Print rules */
  @media print {
    @page { size: A4; margin: 18mm 16mm; }
    main { max-width: none; margin: 0; padding: 0; }
    h1, h2, h3 { page-break-after: avoid; }
    pre, table, blockquote { page-break-inside: avoid; }
    a { color: var(--text); text-decoration: none; }
    body { font-size: 11pt; }
  }

  /* Floating "Save as PDF" hint */
  .pdf-hint {
    position: fixed;
    bottom: 18px;
    right: 18px;
    background: var(--primary);
    color: #fff;
    padding: 10px 16px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 600;
    box-shadow: 0 6px 18px rgba(247, 93, 52, 0.4);
    cursor: pointer;
    border: none;
    z-index: 999;
  }
  @media print { .pdf-hint { display: none !important; } }
</style>
</head>
<body>
<main>
${html}
</main>
<button class="pdf-hint" onclick="window.print()">Press Ctrl+P → Save as PDF</button>
</body>
</html>
`;

fs.writeFileSync(outputPath, template, "utf8");
console.log(`✔ HTML written to: ${outputPath}`);
console.log(`  Open it in a browser and press Ctrl+P → "Save as PDF".`);
