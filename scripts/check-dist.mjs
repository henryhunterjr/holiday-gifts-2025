// Build gate against the finished dist/ — the thing that actually gets served.
// Catches the class of bug where every individual build passed but the merge
// lost or clobbered something.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { BASE_URL } from "../site/lib/site.mjs";

const DIST = "dist";
const SITE_ORIGIN = new URL(BASE_URL).origin;

function fail(msg) {
  console.error(`check-dist: ${msg}`);
  process.exit(1);
}

function readFile(p) {
  if (!existsSync(p)) fail(`${p} missing`);
  return readFileSync(p, "utf8");
}

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
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
if (routeCount !== 17) fail(`expected 17 routes under dist/gifts/, found ${routeCount}`);

// Next assets present and non-empty.
const staticDir = `${DIST}/_next/static`;
if (!existsSync(staticDir)) fail("dist/_next/static missing");
if (readdirSync(staticDir).length === 0) fail("dist/_next/static is empty");

// The catalog endpoint shipped with no sensitive fields.
const catalog = readFile(`${DIST}/catalog.json`);
if (catalog.includes("commissionRate") || catalog.includes("partnerStatus")) {
  fail("dist/catalog.json contains commissionRate or partnerStatus");
}
const metaSite = JSON.parse(catalog).meta?.site;
if (metaSite !== SITE_ORIGIN) {
  fail(`dist/catalog.json meta.site is ${JSON.stringify(metaSite)}, expected ${JSON.stringify(SITE_ORIGIN)}`);
}

// Sitemap: exists, structurally valid, one <loc> per shipped gift route.
const sitemap = readFile(`${DIST}/sitemap.xml`);
if (!sitemap.startsWith("<?xml") || !sitemap.includes("<urlset") || !sitemap.includes("</urlset>")) {
  fail("dist/sitemap.xml does not look like a valid urlset");
}
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (locs.length === 0) fail("dist/sitemap.xml has no <loc> entries");
for (const want of [`${SITE_ORIGIN}/gifts/`, ...facetDirs.map((d) => `${SITE_ORIGIN}/gifts/${d}/`)]) {
  if (!locs.includes(want)) fail(`dist/sitemap.xml is missing <loc> ${want}`);
}

// The cheap catch-all: nothing that ships may LINK to the dead host.
// Match actual URLs (https://x.lovable.app/..., //lovable.app/...), not the
// bare string. The auto-generated preview-auth code (previewAuthStorage.ts)
// carries "lovable.app" in a hostname list that ends up in the JS bundle; it is
// inert on this site and not a dead link, so a plain-text search false-positives.
const LOVABLE_URL = /(?:https?:)?\/\/(?:[a-z0-9-]+\.)*lovable\.app(?![a-z0-9.-])/i;
const lovableFiles = walk(DIST).filter((f) => LOVABLE_URL.test(readFile(f)));
if (lovableFiles.length) {
  fail(
    `lovable.app URL found in ${lovableFiles.length} dist file(s):\n  ${lovableFiles.slice(0, 10).join("\n  ")}`

  );
}

console.log(
  `check-dist passed: SPA at /, ${routeCount} gift routes with visible product text, _next/static populated, catalog.json points at ${SITE_ORIGIN}, sitemap has ${locs.length} URLs, zero lovable.app references`
);
