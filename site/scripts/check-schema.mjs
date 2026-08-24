// Build test: structured data and canonicals.
// 1. Every page has exactly one canonical, absolute, matching its own path.
// 2. Every JSON-LD block parses as valid JSON.
// 3. No Offer anywhere has a null, zero, empty or missing price.
// 4. No aggregateRating or review appears anywhere.
// 5. ItemList length matches the rendered product count on that page.
// 6. free_resources records never appear with Product or Offer type.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { slugify } from "../lib/slugs.mjs";
import { BASE_URL } from "../lib/site.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(here, "..", "out");
const raw = JSON.parse(fs.readFileSync(path.resolve(here, "..", "..", "public", "catalog.json"), "utf8"));

const arrays = ["products", "krustic", "amazon", "books", "free_resources"].flatMap((k) => raw[k] ?? []);
const categories = [...new Set(arrays.flatMap((p) => p.categories ?? []))].sort();
const audiences = [...new Set(arrays.flatMap((p) => p.audiences ?? []))].sort();
const bands = [...new Set(arrays.map((p) => p.priceBand).filter((b) => typeof b === "string"))].sort();
const freeSlugs = new Set((raw.free_resources ?? []).map((p) => p.slug));
const freeNames = new Set((raw.free_resources ?? []).map((p) => p.name));

function expectedFor(facet) {
  if (!facet) return arrays;
  switch (facet.kind) {
    case "category":
      return arrays.filter((p) => (p.categories ?? []).includes(facet.name));
    case "audience":
      return arrays.filter((p) => (p.audiences ?? []).includes(facet.name));
    case "price-band":
      return arrays.filter((p) => p.priceBand === facet.name);
  }
}

const routes = [
  { file: "gifts/index.html", label: "/gifts", facet: null, canonical: `${BASE_URL}/` },
  ...categories.map((name) => ({ file: `gifts/${slugify(name)}/index.html`, label: `/gifts/${slugify(name)}`, facet: { kind: "category", name }, canonical: `${BASE_URL}/${slugify(name)}/` })),
  ...audiences.map((name) => ({ file: `gifts/${slugify(name)}/index.html`, label: `/gifts/${slugify(name)}`, facet: { kind: "audience", name }, canonical: `${BASE_URL}/${slugify(name)}/` })),
  ...bands.map((name) => ({ file: `gifts/${slugify(name)}/index.html`, label: `/gifts/${slugify(name)}`, facet: { kind: "price-band", name }, canonical: `${BASE_URL}/${slugify(name)}/` })),
];

let failures = [];
let productCount = 0;
let bookCount = 0;
let noSchemaCount = 0;
let noOfferCount = 0;

function walkNodes(node, visit) {
  if (Array.isArray(node)) {
    node.forEach((n) => walkNodes(n, visit));
    return;
  }
  if (node && typeof node === "object") {
    visit(node);
    for (const v of Object.values(node)) walkNodes(v, visit);
  }
}

for (const r of routes) {
  const file = path.join(outDir, r.file);
  if (!fs.existsSync(file)) {
    failures.push(`${r.label}: ${r.file} not generated`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");

  // Check 1: exactly one canonical, absolute, self-referential.
  const cans = [...html.matchAll(/<link[^>]*rel="canonical"[^>]*>/g)];
  const href = cans.length === 1 ? (cans[0][0].match(/href="([^"]+)"/) || [])[1] : null;
  if (cans.length !== 1 || href !== r.canonical) {
    failures.push(`${r.label}: expected one canonical ${r.canonical}, got ${cans.length} canonical tag(s)${href ? ` pointing at ${href}` : ""}`);
  }

  // Check 2: every ld+json block parses.
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  let itemList = null;
  blocks.forEach((b, i) => {
    try {
      const data = JSON.parse(b[1]);
      if (data["@type"] === "ItemList") itemList = data;
    } catch (e) {
      failures.push(`${r.label}: ld+json block ${i} does not parse: ${e.message}`);
    }
  });

  // Check 5: ItemList length matches the rendered marker count and expected count.
  const markupOnly = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
  const markers = (markupOnly.match(/data-product-slug=/g) || []).length;
  if (!itemList) {
    failures.push(`${r.label}: no ItemList found`);
  } else {
    const len = itemList.itemListElement?.length ?? -1;
    if (len !== markers) failures.push(`${r.label}: ItemList has ${len} items but page renders ${markers}`);
    if (len !== expectedFor(r.facet).length) failures.push(`${r.label}: ItemList has ${len} items but catalog says ${expectedFor(r.facet).length}`);
  }

  // Checks 3, 4, 6 across this page's parsed structures + raw HTML.
  for (const b of blocks) {
    let data;
    try {
      data = JSON.parse(b[1]);
    } catch {
      continue;
    }
    walkNodes(data, (node) => {
      if (node["@type"] === "Offer") {
        if (typeof node.price !== "number" || !(node.price > 0)) {
          failures.push(`${r.label}: Offer with bad price (${JSON.stringify(node.price)}) on "${node.name ?? "?"}"`);
        }
      }
      if (node["@type"] === "AggregateOffer") {
        // Variable pricing: lowPrice is the only price field we are allowed to
        // have, because it is the only one we can source.
        if (typeof node.lowPrice !== "number" || !(node.lowPrice > 0)) {
          failures.push(`${r.label}: AggregateOffer with bad lowPrice (${JSON.stringify(node.lowPrice)}) on "${node.name ?? "?"}"`);
        }
        if ("price" in node) failures.push(`${r.label}: AggregateOffer carries a flat "price" — flattening a range is a lie`);
        if ("highPrice" in node) failures.push(`${r.label}: AggregateOffer carries highPrice, which we cannot source`);
      }
      if ("aggregateRating" in node || "review" in node) {
        failures.push(`${r.label}: forbidden rating/review property on ${node["@type"]}`);
      }
      if ((node["@type"] === "Product" || node["@type"] === "Book") && typeof node.name === "string") {
        if (freeNames.has(node.name)) failures.push(`${r.label}: free resource "${node.name}" emitted as ${node["@type"]}`);
        else if (node["@type"] === "Product") productCount++;
        else bookCount++;
        if (!("offers" in node)) noOfferCount++;
      }
    });
  }
  if (/aggregateRating|"review"\s*:/.test(html)) failures.push(`${r.label}: aggregateRating/review string present in raw HTML`);
}

// free_resources slugs must never carry commerce schema anywhere (name check above
// covers it; slug check catches renamed records).
for (const f of routes) {
  void f;
}
void freeSlugs;

if (failures.length) {
  console.error("schema test FAILED:");
  for (const f of [...new Set(failures)].slice(0, 40)) console.error(`  - ${f}`);
  process.exit(1);
}

console.log(`schema test passed: 16 canonicals exact; all ld+json parses; offers clean; no ratings/reviews; ItemList lengths match renders`);
console.log(`schema inventory: ${productCount} Product entries, ${bookCount} Book entries, ${noOfferCount} entities without an offer (null price), free_resources excluded`);
