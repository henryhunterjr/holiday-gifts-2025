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
const arrays = ["products", "krustic", "amazon", "books", "free_resources"].flatMap((k) => raw[k] ?? []);
const all = arrays;

function expectedFor(facet) {
  if (!facet) return all;
  switch (facet.kind) {
    case "category":
      return all.filter((p) => (p.categories ?? []).includes(facet.name));
    case "audience":
      return all.filter((p) => (p.audiences ?? []).includes(facet.name));
    case "price-band":
      return all.filter((p) => p.priceBand === facet.name);
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
