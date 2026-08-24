// Build test 2: server render acceptance + exact render counts.
// After `next build`, for /gifts and every facet route, the number of
// data-product-slug markers in the visible HTML must equal the count computed
// from the catalog. Exact counts catch a page that renders empty AND a page
// that renders 26 of 27 (off-by-one) or 30 (facet leaking products).
// The "Challenger Bread Pan" assertion stays as the named canary.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { slugify } from "../lib/slugs.mjs";
import { PRICE_CAPS } from "../lib/price-caps.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(here, "..", "out");
const catalogPath = path.resolve(here, "..", "..", "public", "catalog.json");
const NEEDLE = "Challenger Bread Pan";

function visibleMarkup(html) {
  // Remove script and style blocks entirely; what remains is markup a non-JS
  // client would actually see.
  return html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
}

const raw = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const content = JSON.parse(fs.readFileSync(path.resolve(here, "..", "content", "facets.json"), "utf8"));
const arrays = ["products", "krustic", "amazon", "books", "free_resources"].flatMap((k) => raw[k] ?? []);
const all = arrays;

function visibleText(html) {
  // Script/style stripped, tags stripped, then the handful of entities React
  // emits decoded, so needles with ampersands or apostrophes match.
  return visibleMarkup(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

function expectedFor(facet) {
  if (!facet) return all;
  switch (facet.kind) {
    case "category":
      return all.filter((p) => (p.categories ?? []).includes(facet.name));
    case "audience":
      return all.filter((p) => (p.audiences ?? []).includes(facet.name));
    case "price-band":
      return all.filter((p) => p.priceBand === facet.name);
    case "price-cap":
      // Strict less-than, matching productsForFacet. Null prices never qualify.
      return all.filter((p) => typeof p.price === "number" && p.price < facet.max);
  }
}

const categories = [...new Set(all.flatMap((p) => p.categories ?? []))].sort();
const audiences = [...new Set(all.flatMap((p) => p.audiences ?? []))].sort();
const bands = [...new Set(all.map((p) => p.priceBand).filter((b) => typeof b === "string"))].sort();

const routes = [
  { file: "gifts/index.html", label: "/gifts", facets: null },
  ...categories.map((name) => ({ file: `gifts/${slugify(name)}/index.html`, label: `/gifts/${slugify(name)}`, facets: [{ kind: "category", name }] })),
  ...audiences.map((name) => ({ file: `gifts/${slugify(name)}/index.html`, label: `/gifts/${slugify(name)}`, facets: [{ kind: "audience", name }] })),
  ...bands.map((name) => ({ file: `gifts/${slugify(name)}/index.html`, label: `/gifts/${slugify(name)}`, facets: [{ kind: "price-band", name }] })),
  ...PRICE_CAPS.map((c) => ({ file: `gifts/${c.slug}/index.html`, label: `/gifts/${c.slug}`, facets: [{ kind: "price-cap", name: c.name, slug: c.slug, max: c.max }] })),
];

let failures = [];
console.log("route                          expected  actual");
for (const r of routes) {
  const file = path.join(outDir, r.file);
  if (!fs.existsSync(file)) {
    failures.push(`${r.label}: ${r.file} not generated`);
    console.log(`${r.label.padEnd(30)} ${"?".padStart(8)}  missing`);
    continue;
  }
  const markup = visibleMarkup(fs.readFileSync(file, "utf8"));
  const actual = (markup.match(/data-product-slug=/g) || []).length;
  const expected = expectedFor(r.facets && r.facets[0]).length;
  const ok = actual === expected;
  console.log(`${r.label.padEnd(30)} ${String(expected).padStart(8)}  ${String(actual).padStart(6)}${ok ? "" : "   <-- MISMATCH"}`);
  if (!ok) failures.push(`${r.label}: expected ${expected} products, rendered ${actual}`);

  // Page copy assertions: intro and pinned pick must appear as visible text,
  // and the pinned product must be the first product rendered on the page.
  const page = content.pages[r.label];
  if (page) {
    const text = visibleText(fs.readFileSync(file, "utf8"));
    if (!text.includes(page.intro)) failures.push(`${r.label}: intro copy missing from visible text`);
    if (page.pinnedPick) {
      if (!text.includes(page.pinnedPick)) failures.push(`${r.label}: pinned pick "${page.pinnedPick}" missing from visible text`);
      const pinRecord = all.find((p) => p.name === page.pinnedPick);
      const firstMarker = (markup.match(/data-product-slug="([^"]+)"/) || [])[1];
      if (pinRecord && firstMarker !== pinRecord.slug) {
        failures.push(`${r.label}: pinned "${page.pinnedPick}" (slug ${pinRecord.slug}) is not first in render order (first is ${firstMarker})`);
      }
    }
  }
}

// Named canary: the acceptance needle must appear as real text on index and bake-day.
for (const route of ["gifts/index.html", "gifts/bake-day/index.html"]) {
  const text = visibleMarkup(fs.readFileSync(path.join(outDir, route), "utf8")).replace(/<[^>]+>/g, " ");
  if (!text.includes(NEEDLE)) failures.push(`${route}: "${NEEDLE}" not found as visible text`);
}

if (failures.length) {
  console.error("\nserver-render test FAILED:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`\nserver-render test passed: exact counts on all ${routes.length} routes; canary "${NEEDLE}" present on /gifts and /gifts/bake-day`);
