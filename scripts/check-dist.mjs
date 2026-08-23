// Build gate against the finished dist/ — the thing that actually gets served.
// Catches the class of bug where every individual build passed but the merge
// lost or clobbered something.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";

function fail(msg) {
  console.error(`check-dist: ${msg}`);
  process.exit(1);
}

function readFile(p) {
  if (!existsSync(p)) fail(`${p} missing`);
  return readFileSync(p, "utf8");
}

// SPA survived.
if (!existsSync(`${DIST}/index.html`)) fail("dist/index.html missing");
const spaHtml = readFile(`${DIST}/index.html`);
if (!spaHtml.includes("/assets/")) fail("dist/index.html does not reference /assets/ — SPA looks broken");

// Gift guide survived the merge, as real text.
const giftsIndex = readFile(`${DIST}/gifts/index.html`)
  .replace(/<script[\s\S]*?<\/script>/gi, "")
  .replace(/<style[\s\S]*?<\/style>/gi, "");
if (!giftsIndex.includes("Challenger Bread Pan")) {
  fail('dist/gifts/index.html does not contain "Challenger Bread Pan" as visible text');
}

// Exactly 16 routes under dist/gifts/.
const giftsDir = `${DIST}/gifts`;
const facetDirs = readdirSync(giftsDir).filter((n) => statSync(join(giftsDir, n)).isDirectory());
const routeCount = facetDirs.length + (existsSync(join(giftsDir, "index.html")) ? 1 : 0);
if (routeCount !== 16) fail(`expected 16 routes under dist/gifts/, found ${routeCount}`);

// Next assets present and non-empty.
const staticDir = `${DIST}/_next/static`;
if (!existsSync(staticDir)) fail("dist/_next/static missing");
if (readdirSync(staticDir).length === 0) fail("dist/_next/static is empty");

// The catalog endpoint shipped with no sensitive fields.
const catalog = readFile(`${DIST}/catalog.json`);
if (catalog.includes("commissionRate") || catalog.includes("partnerStatus")) {
  fail("dist/catalog.json contains commissionRate or partnerStatus");
}

console.log(
  `check-dist passed: SPA at /, ${routeCount} gift routes with visible product text, _next/static populated, catalog.json clean`
);
