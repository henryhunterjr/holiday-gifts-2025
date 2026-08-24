// Build test 1: slug collision across facets. Categories, audiences and price
// bands all share the /gifts/[facet] namespace, so two facets producing the
// same slug would silently overwrite each other's page.
// Derives facets straight from ../public/catalog.json and slugs them with the
// same lib/slugs.mjs the app imports, so the rule has one source of truth.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { slugify } from "../lib/slugs.mjs";
import { PRICE_CAPS } from "../lib/price-caps.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const raw = JSON.parse(fs.readFileSync(path.resolve(here, "..", "..", "public", "catalog.json"), "utf8"));

const arrays = ["products", "krustic", "amazon", "books", "free_resources"].flatMap((k) => raw[k] ?? []);
const categories = [...new Set(arrays.flatMap((p) => p.categories ?? []))].sort();
const audiences = [...new Set(arrays.flatMap((p) => p.audiences ?? []))].sort();
const bands = [...new Set(arrays.map((p) => p.priceBand).filter((b) => typeof b === "string"))].sort();

const facets = [
  ...categories.map((name) => ({ kind: "category", name, slug: slugify(name) })),
  ...audiences.map((name) => ({ kind: "audience", name, slug: slugify(name) })),
  ...bands.map((name) => ({ kind: "price-band", name, slug: slugify(name) })),
  ...PRICE_CAPS.map((c) => ({ kind: "price-cap", name: c.name, slug: c.slug })),
];

const seen = new Map();
const collisions = [];
for (const f of facets) {
  if (seen.has(f.slug)) {
    const other = seen.get(f.slug);
    collisions.push(`"${f.kind}:${f.name}" collides with "${other.kind}:${other.name}" on slug "${f.slug}"`);
  } else {
    seen.set(f.slug, f);
  }
}

if (collisions.length) {
  console.error("slug collision test FAILED:");
  for (const c of collisions) console.error(`  - ${c}`);
  process.exit(1);
}
console.log(`slug collision test passed: ${facets.length} facets (${categories.length} categories, ${audiences.length} audiences, ${bands.length} price bands), all ${seen.size} slugs unique`);
