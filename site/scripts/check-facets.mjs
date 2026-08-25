// Build test: facets.json must line up with the generated routes and the
// catalog. Fails on: a copy entry with no matching route, a generated route
// with no copy, a pinnedPick that is not an exact catalog product name, or a
// pinnedPick that is not actually present on the facet it is pinned to.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { slugify } from "../lib/slugs.mjs";
import { PRICE_CAPS } from "../lib/price-caps.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const raw = JSON.parse(fs.readFileSync(path.resolve(here, "..", "..", "public", "catalog.json"), "utf8"));
const content = JSON.parse(fs.readFileSync(path.resolve(here, "..", "content", "facets.json"), "utf8"));

const arrays = ["products", "krustic", "amazon", "books", "free_resources"].flatMap((k) => raw[k] ?? []);
const allNames = new Set(arrays.map((p) => p.name));

const categories = [...new Set(arrays.flatMap((p) => p.categories ?? []))].sort();
const audiences = [...new Set(arrays.flatMap((p) => p.audiences ?? []))].sort();
const bands = [...new Set(arrays.map((p) => p.priceBand).filter((b) => typeof b === "string"))].sort();

function membersFor(facet) {
  switch (facet.kind) {
    case "category":
      return arrays.filter((p) => (p.categories ?? []).includes(facet.name));
    case "audience":
      return arrays.filter((p) => (p.audiences ?? []).includes(facet.name));
    case "price-band":
      return arrays.filter((p) => p.priceBand === facet.name);
    case "price-cap":
      // Strict less-than, matching productsForFacet. Null prices never qualify.
      return arrays.filter((p) => typeof p.price === "number" && p.price < facet.max);
  }
}

// Generated routes: index + one per facet.
const generated = new Set(["/gifts"]);
for (const name of categories) generated.add(`/gifts/${slugify(name)}`);
for (const name of audiences) generated.add(`/gifts/${slugify(name)}`);
for (const name of bands) generated.add(`/gifts/${slugify(name)}`);
for (const c of PRICE_CAPS) generated.add(`/gifts/${c.slug}`);

const failures = [];

// Route set equality, both directions.
for (const key of Object.keys(content.pages)) {
  if (!generated.has(key)) failures.push(`facets.json has "${key}" but no such route is generated`);
}
for (const r of generated) {
  if (!content.pages[r]) failures.push(`route "${r}" is generated but has no entry in facets.json`);
}

// Pinned picks: exact catalog name, present on its facet.
// Top picks: exact catalog names too.
for (const key of Object.keys(content.pages)) {
  const picks = content.pages[key].topPicks ?? [];
  for (const tp of picks) {
    if (!allNames.has(tp.name)) failures.push(`"${key}" topPick "${tp.name}" is not an exact catalog product name`);
  }
}
for (const [key, page] of Object.entries(content.pages)) {
  const pin = page.pinnedPick;
  if (pin === null || pin === undefined) continue;
  if (!allNames.has(pin)) {
    failures.push(`"${key}" pins "${pin}" which is not an exact catalog product name`);
    continue;
  }
  const slug = key.replace("/gifts/", "");
  const facetDefs = [
    ...categories.map((name) => ({ kind: "category", name, slug: slugify(name) })),
    ...audiences.map((name) => ({ kind: "audience", name, slug: slugify(name) })),
    ...bands.map((name) => ({ kind: "price-band", name, slug: slugify(name) })),
    ...PRICE_CAPS.map((c) => ({ kind: "price-cap", name: c.name, slug: c.slug, max: c.max })),
  ];
  const facet = facetDefs.find((f) => f.slug === slug);
  if (!facet) continue; // index has no facet membership; handled by route check above
  const members = membersFor(facet);
  if (!members.some((p) => p.name === pin)) {
    failures.push(`"${key}" pins "${pin}" but it does not belong to ${facet.kind} "${facet.name}"`);
  }
}

if (failures.length) {
  console.error("facets validation FAILED:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`facets validation passed: ${Object.keys(content.pages).length} pages match ${generated.size} generated routes; every pinnedPick is an exact catalog name present on its facet`);
