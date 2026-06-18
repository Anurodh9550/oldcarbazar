const path = require("path");
const fs = require("fs");
const { execFileSync } = require("child_process");

const publicDir = path.join(__dirname, "..", "public");
const htmlPath = path.join(publicDir, "sales-brochure.html");
const pdfPath = path.join(publicDir, "Old-Car-Bazar-Sales-Brochure.pdf");

const chromePaths = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  process.env.CHROME_PATH,
].filter(Boolean);

const chrome = chromePaths.find((p) => fs.existsSync(p));

if (!fs.existsSync(htmlPath)) {
  console.error("Missing:", htmlPath);
  process.exit(1);
}

if (!chrome) {
  console.error(
    "Chrome not found. Open public/sales-brochure.html in browser → Ctrl+P → Save as PDF."
  );
  process.exit(1);
}

execFileSync(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    `--print-to-pdf=${pdfPath}`,
    htmlPath,
  ],
  { stdio: "inherit" }
);

console.log("PDF created:", pdfPath);
