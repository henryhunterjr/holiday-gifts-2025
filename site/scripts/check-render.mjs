// Build test 2: server render acceptance. After `next build`, the generated
// HTML for /gifts and /gifts/bake-day must contain "Challenger Bread Pan" as
// real text in the markup — not inside a <script> tag or a JSON blob.
// No browser needed.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(here, "..", "out");
const NEEDLE = "Challenger Bread Pan";

function visibleText(html) {
  // Remove script and style blocks entirely, then strip tags. What remains is
  // only what a non-JS client would actually read.
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "");
}

let failures = [];
for (const route of ["gifts/index.html", "gifts/bake-day/index.html"]) {
  const file = path.join(outDir, route);
  if (!fs.existsSync(file)) {
    failures.push(`${route}: file not generated (did static export run?)`);
    continue;
  }
  const text = visibleText(fs.readFileSync(file, "utf8"));
  if (!text.includes(NEEDLE)) failures.push(`${route}: "${NEEDLE}" not found as visible text`);
}

if (failures.length) {
  console.error("server-render test FAILED:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`server-render test passed: "${NEEDLE}" present as markup text on /gifts and /gifts/bake-day`);
