import { existsSync, cpSync, readdirSync, statSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
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

// Ship an actual HTML entry for the printed-book URL. Vercel's trailingSlash
// and merged Next static output must not depend on the SPA fallback rewrite.
const companionDir = join(DIST, "sourdough-for-the-rest-of-us");
mkdirSync(companionDir, { recursive: true });
// The book path also lives on bakinggreatbread.com through a same-path
// reverse-proxy rewrite. Absolute asset URLs must keep JS/CSS on this origin.
const companionTitle = "Sourdough for the Rest of Us | Henry Hunter's Book Companion";
const companionDescription = "Explore all 24 chapters of the revised and expanded Sourdough for the Rest of Us: videos, Bread Authority lessons, a glossary, and the tools Henry uses.";
const companionHero = "https://bakinggreatbread.blog/wp-content/uploads/2026/11/sourdough-for-the-rest-of-us-companion-hero.png";
const companionUrl = "https://bakinggreatbread.com/sourdough-for-the-rest-of-us/";
const companionHtml = readFileSync(join(DIST, "index.html"), "utf8")
  .replaceAll('src="/assets/', 'src="https://gifts.bakinggreatbread.com/assets/')
  .replaceAll('href="/assets/', 'href="https://gifts.bakinggreatbread.com/assets/')
  .replace(/<title>[^<]*<[/]title>/i, `<title>${companionTitle}</title>`)
  .replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${companionDescription}">`)
  .replace(/<meta property="og:title"[^>]*>/i, `<meta property="og:title" content="${companionTitle}">`)
  .replace(/<meta property="og:description"[^>]*>/i, `<meta property="og:description" content="${companionDescription}">`)
  .replace(/<meta property="og:image"[^>]*>/i, `<meta property="og:image" content="${companionHero}">`)
  .replace(/<meta property="og:url"[^>]*>/i, `<meta property="og:url" content="${companionUrl}">`)
  .replace(/<meta name="twitter:image"[^>]*>/i, `<meta name="twitter:image" content="${companionHero}">`)
  .replace(/<meta name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${companionTitle}">`)
  .replace(/<meta name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${companionDescription}">`);
writeFileSync(join(companionDir, "index.html"), companionHtml);

console.log(
  `merge-site: wrote /sourdough-for-the-rest-of-us/index.html`
);

console.log(
  `merge-site: copied ${COPY.join(", ")} into dist/; ` +
    `${routeCount} routes; dist/index.html untouched (SPA preserved)`
);
