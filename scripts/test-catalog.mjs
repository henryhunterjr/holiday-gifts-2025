// Build-time test: fails when any record carrying an affiliate link is missing
// rel="nofollow sponsored noopener" and target="_blank" in public/catalog.json.
// Run: node scripts/test-catalog.mjs   (also runs automatically on `npm run build`)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { isAffiliateUrl, REL_AFFILIATE, TARGET_AFFILIATE } from "./catalog-lib.mjs";

// Floor on how many affiliate records the detection rule must find. The count
// was 70 as of 2026-08-21. This floor is deliberately slack (60): set at the
// exact count it would false-alarm the first time a product legitimately
// retires. Raise it if the catalog grows a lot.
const MIN_AFFILIATE_RECORDS = 60;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(fs.readFileSync(path.join(root, "public", "catalog.json"), "utf8"));

const ARRAYS = ["products", "amazon", "books", "free_resources"];

const failures = [];
let affiliateCount = 0;

for (const key of ARRAYS) {
  const rows = catalog[key] || [];
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const label = `${key}[${i}] ${r.name || r.slug || "(no name)"}`;
    if (!isAffiliateUrl(r.url)) continue;
    affiliateCount++;
    try {
      assert.equal(r.rel, REL_AFFILIATE, `expected rel="${REL_AFFILIATE}"`);
      assert.equal(r.target, TARGET_AFFILIATE, `expected target="${TARGET_AFFILIATE}"`);
    } catch (e) {
      failures.push(`${label}: ${e.message} (got rel=${JSON.stringify(r.rel)}, target=${JSON.stringify(r.target)})`);
    }
  }
}

// Every record must carry a real category and audience assignment. An empty
// array means the enrichment merge missed it or a new product arrived without
// either being filled in.
let emptyTaxonomy = [];
let priceFieldFailures = [];
for (const key of ARRAYS) {
  for (const r of catalog[key] || []) {
    const label = `${key} :: ${r.name || r.slug || "(no name)"}`;
    if (!Array.isArray(r.categories) || r.categories.length === 0) emptyTaxonomy.push(`${label}: categories is empty`);
    if (!Array.isArray(r.audiences) || r.audiences.length === 0) emptyTaxonomy.push(`${label}: audiences is empty`);

    // Price provenance gates.
    if (typeof r.priceFrom !== "boolean") priceFieldFailures.push(`${label}: priceFrom is ${JSON.stringify(r.priceFrom)}, expected a boolean`);
    if (r.priceFrom === true && typeof r.price !== "number") priceFieldFailures.push(`${label}: priceFrom true but price is not a number`);
    if (r.priceCheckedAt != null && !/^\d{4}-\d{2}-\d{2}$/.test(r.priceCheckedAt)) {
      priceFieldFailures.push(`${label}: priceCheckedAt ${JSON.stringify(r.priceCheckedAt)} is not YYYY-MM-DD`);
    }
    if (typeof r.price !== "number" && r.priceCheckedAt != null) {
      priceFieldFailures.push(`${label}: has priceCheckedAt but no price — a date on an unpriced record is a claim about nothing`);
    }
  }
}
if (emptyTaxonomy.length) {
  console.error(`catalog taxonomy test FAILED (${emptyTaxonomy.length} records):`);
  for (const f of emptyTaxonomy) console.error(`  - ${f}`);
  process.exit(1);
}
if (priceFieldFailures.length) {
  console.error(`catalog price-provenance test FAILED (${priceFieldFailures.length} records):`);
  for (const f of priceFieldFailures) console.error(`  - ${f}`);
  process.exit(1);
}

// Commission rates and partner status are commercially sensitive. They must
// never appear in the published catalog, so the rule is enforced here by data,
// same as the rel test, not by anyone remembering.
const FORBIDDEN_FIELDS = ["commissionRate", "partnerStatus"];

let forbiddenHits = [];
for (const key of ARRAYS) {
  for (const r of catalog[key] || []) {
    for (const f of FORBIDDEN_FIELDS) {
      if (f in r) forbiddenHits.push(`${key} :: ${r.name || r.slug || "(no name)"} carries "${f}"`);
    }
  }
}
if (forbiddenHits.length) {
  console.error(`catalog sensitive-fields test FAILED (${forbiddenHits.length} records): partner commission data must never be published`);
  for (const f of forbiddenHits) console.error(`  - ${f}`);
  process.exit(1);
}

if (affiliateCount < MIN_AFFILIATE_RECORDS) {
  console.error(
    `catalog rel test FAILED: found ${affiliateCount} affiliate records, expected at least ${MIN_AFFILIATE_RECORDS}. ` +
      `The catalog may have changed, but more likely the affiliate detection rule in scripts/catalog-lib.mjs broke. ` +
      `Check AFFILIATE_PARAMS, AFFILIATE_REF_VALUES, KNOWN_AFFILIATE_PREFIXES and AFFILIATE_DISCOUNT_HOSTS before trusting this run.`
  );
  process.exit(1);
}

if (failures.length) {
  console.error(`catalog rel test FAILED (${failures.length} of ${affiliateCount} affiliate records):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log(
  `catalog tests passed: ${affiliateCount} affiliate records carry rel="${REL_AFFILIATE}" and target="${TARGET_AFFILIATE}"; every record has categories and audiences`
);


// Amazon pricing and ratings are intentionally withheld until an approved API
// supplies current data. A stale catalog must not silently reintroduce them.
for (const record of catalog.amazon || []) {
  assert.equal(record.price, null, `Amazon price must be omitted: ${record.name}`);
  assert.equal(record.currency, null, `Amazon currency must be omitted: ${record.name}`);
  assert.equal(record.priceBand, null, `Amazon price band must be omitted: ${record.name}`);
  assert.ok(!("rating" in record), `Amazon rating must be omitted: ${record.name}`);
}
console.log("Amazon catalog guard passed: no unsupported prices or ratings.");

const seasonalTools = JSON.parse(fs.readFileSync(path.join(root, "src/data/seasonalAmazon.json"), "utf8"));
for (const tool of Object.values(seasonalTools)) {
  const record = catalog.amazon.find(({ slug }) => slug === tool.slug);
  assert.equal(record?.url, tool.url, `Missing shopping link for ${tool.name}`);
  assert.equal(record.img, tool.img, `Missing photo for ${tool.name}`);
  assert.ok(fs.existsSync(path.join(root, "public", record.img)), `Missing photo file for ${tool.name}`);
}

const featured = catalog.products.find(product => product.slug === "sourdough-home");
assert.equal(new URL(featured.url).pathname, "/products/sourdough-home-and-starter-jar");
assert.equal(catalog.amazon.find(product => product.slug === "cambro-6qt-container").asin, "B07FC7L861");
const makerData = JSON.parse(fs.readFileSync(path.join(root, "src/data/makers.json"), "utf8"));
const listedPrices = new Map(catalog.products.filter(product => product.source === "main")
  .map(product => [product.url, product.price]));
for (const maker of makerData) {
  for (const item of maker.items) {
    if (!listedPrices.has(item.url)) continue;
    const price = Number(item.priceLabel.match(/\d[\d,]*(?:\.\d+)?/)?.[0].replaceAll(",", ""));
    assert.equal(listedPrices.get(item.url), price, `Conflicting prices for ${item.name}`);
  }
}

const storefront = new Map(catalog.products.map(item => [item.slug, item]));
for (const slug of ["vitale-starter", "spice-grinder", "sahara-shelves"]) {
  assert.ok(!storefront.has(slug), `Unavailable product in catalog: ${slug}`);
}
for (const [slug, price] of Object.entries({
  "bakers-scale": 24.95, "starter-jars": 23.95, "bench-knife": 18.95,
  "shell-batard": 164, "shell-steel-bundle": 164, "proof-container": 24.95,
})) assert.equal(storefront.get(slug)?.price, price, `Review audited price: ${slug}`);
const ceramics = catalog.products.filter(item => item.source === "emile-henry");
assert.equal(ceramics.length, 9);
for (const piece of ceramics) {
  assert.ok(new URL(piece.url).searchParams.has("variant"), `Missing glaze selection: ${piece.name}`);
  assert.ok(fs.existsSync(path.join(root, "public", piece.img)), `Missing ceramic photo: ${piece.name}`);
}
