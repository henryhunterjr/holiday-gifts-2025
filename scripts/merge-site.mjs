import { existsSync, cpSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const OUT = "site/out";
const DIST = "dist";
const COPY = ["gifts", "_next"];
const EXPECTED_ROUTES = 17; // /gifts plus 15 band/category/audience facets plus the under-50 price cap

function fail(msg) {
  console.error(`merge-site: ${msg}`);
  process.exit(1);
}

if (!existsSync(OUT)) fail(`${OUT} not found. Did the Next build run?`);
if (!existsSync(DIST)) fail(`${DIST} not found. Did the Vite build run?`);

// /gifts must contain index.html plus one directory per facet.
const giftsDir = join(OUT, "gifts");
if (!existsSync(join(giftsDir, "index.html"))) fail("site/out/gifts/index.html missing");
const facetDirs = readdirSync(giftsDir).filter((n) =>
  statSync(join(giftsDir, n)).isDirectory()
);
const routeCount = facetDirs.length + 1;
if (routeCount !== EXPECTED_ROUTES) {
  fail(`expected ${EXPECTED_ROUTES} routes, found ${routeCount}: ${facetDirs.join(", ")}`);
}

// Nothing we copy may overwrite a file the Vite build already produced.
function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

const collisions = [];
for (const top of COPY) {
  const src = join(OUT, top);
  if (!existsSync(src)) fail(`${src} missing`);
  for (const f of walk(src)) {
    const rel = relative(OUT, f);
    if (existsSync(join(DIST, rel))) collisions.push(rel);
  }
}
if (collisions.length) {
  fail(`would overwrite existing dist files:\n  ${collisions.join("\n  ")}`);
}

for (const top of COPY) {
  cpSync(join(OUT, top), join(DIST, top), { recursive: true });
}

console.log(
  `merge-site: copied ${COPY.join(", ")} into dist/; ` +
    `${routeCount} routes; dist/index.html untouched (SPA preserved)`
);
