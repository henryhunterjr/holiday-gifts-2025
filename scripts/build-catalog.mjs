// Generates public/catalog.json — one clean, public endpoint with the full
// product catalog for external agents and integrations.
// Run: node scripts/build-catalog.mjs   (also runs automatically on `npm run build`)

import fs from "node:fs";
import path from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { enrichRecord, isAffiliateUrl, REL_AFFILIATE, TARGET_AFFILIATE, parsePrice, priceBandFor } from "./catalog-lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

const data = JSON.parse(read("src/data/products.json"));
const config = read("src/lib/guideConfig.ts");

// Pull the disabled-slug sets straight out of guideConfig.ts so the feed always
// matches what the live site renders.
const setFrom = (name) => {
  const block = config.split(`${name}: ReadonlySet<string> = new Set([`)[1] ?? "";
  const body = block.split("]);")[0] ?? "";
  return new Set([...body.matchAll(/"([^"]+)"/g)].map((m) => m[1]));
};
const disabled = setFrom("DISABLED_PRODUCT_SLUGS");
const disabledKrustic = setFrom("DISABLED_KRUSTIC_SLUGS");

// Parse the TS data modules without importing them (they import images).
const parseTsProducts = (src) => {
  const rows = [];
  for (const line of src.split("\n")) {
    const t = line.trim();
    if (!t.startsWith("{ ") || !t.includes("url:")) continue;
    const obj = {};
    for (const [, k, v] of t.matchAll(/(\w+):\s*(?:"([^"]*)"|`([^`]*)`|([\d.]+))/g)) {
      obj[k] = v;
    }
    for (const [, k, s, b, n] of t.matchAll(/(\w+):\s*(?:"([^"]*)"|`([^`]*)`|([\d.]+))/g)) {
      obj[k] = s ?? (b !== undefined ? b : Number(n));
    }
    if (obj.name && obj.url) rows.push(obj);
  }
  return rows;
};

const krusticSrc = read("src/data/krustic.ts");
const R = (krusticSrc.match(/const R = "([^"]+)"/) || [, ""])[1];
const krustic = parseTsProducts(krusticSrc)
  .map((p) => ({ ...p, url: p.url.replace("${R}", R) }))
  .filter((p) => !disabledKrustic.has(p.slug))
  .map(({ img, ...p }) => ({ ...p, source: "krustic" }));

const amazonSrc = read("src/data/amazon.ts");
const TAG = (amazonSrc.match(/const TAG = "([^"]+)"/) || [, ""])[1];
const amazon = [];
for (const line of amazonSrc.split("\n")) {
  const t = line.trim();
  if (!t.startsWith("{ ") || !t.includes("name:")) continue;
  const get = (k) => (t.match(new RegExp(`${k}:\\s*"([^"]*)"`)) || [])[1];
  const asin = (t.match(/link\("([^"]+)"\)/) || [])[1];
  const urlLiteral = (t.match(/url:\s*"([^"]*)"/) || [])[1];
  const rating = Number((t.match(/rating:\s*([\d.]+)/) || [])[1]);
  const name = get("name");
  if (!name) continue;
  amazon.push({
    // Amazon records arrive without slugs; derive one from the name so every
    // record in the catalog carries the same stable identifier (used by the
    // site's per-product markup markers and its render-count test).
    slug: name
      .toLowerCase()
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, ""),
    name,
    note: get("note"),
    category: get("category"),
    price: get("price"),
    rating: Number.isFinite(rating) ? rating : undefined,
    asin,
    url: asin ? `https://www.amazon.com/dp/${asin}?tag=${TAG}` : urlLiteral,
    source: "amazon",
    affiliate_tag: TAG,
  });
}

// Enrichment merge: catalog.enrichment.json is keyed by array then exact
// record name. It replaces categories, audiences and concierge.solves only.
// price, currency, priceBand, priceCheckedAt, rel, target, alt and cat are
// untouched. See RECONCILIATION.md.
const enrichmentData = JSON.parse(read("catalog.enrichment.json"));
const seedData = JSON.parse(read("catalog.seed.json"));

const enrichAll = (rows, key) =>
  rows.map(enrichRecord).map((r) => {
    const e = enrichmentData.enrichment[key]?.[r.name];
    if (!e) return r;
    return {
      ...r,
      categories: [...e.categories],
      audiences: [...e.audiences],
      concierge: { solves: [...(e.concierge?.solves ?? [])] },
    };
  });

// Drop records named in dropRecords (exact name match per array).
const dropNamesFor = (key) =>
  new Set((enrichmentData.dropRecords?.[key] ?? []).map((d) => d.name));

// Seed newProducts: map provisional categories to the real vocabulary.
// splurge-gifts is a price band, not a category, so it is dropped here.
const SEED_CATEGORY_MAP = {
  "grain-mills": "Milling & Flour",
  mixers: "Milling & Flour",
  grain: "Milling & Flour",
  flour: "Milling & Flour",
  pantry: "Milling & Flour",
  pizza: "Milling & Flour",
  "gluten-free": "Milling & Flour",
  "baking-vessels": "Bake Day",
  kits: "Starter Care",
  starter: "Starter Care",
  "gifts-for-beginners": "Starter Care",
  tools: "Scoring & Shaping", // per Henry, 2026-08-22 (Made With Loave Accessory Kit)
};

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const seedProducts = seedData.newProducts.map((p) => {
  const categories = [];
  for (const c of p.categories ?? []) {
    if (c === "splurge-gifts") continue;
    const mapped = SEED_CATEGORY_MAP[c];
    if (!mapped) throw new Error(`Unmapped provisional category "${c}" on seed product "${p.name}". Add it to SEED_CATEGORY_MAP instead of guessing.`);
    if (!categories.includes(mapped)) categories.push(mapped);
  }
  const affiliate = isAffiliateUrl(p.url);
  const price = parsePrice(p.price);
  // Seed products ship with photos in public/product-images/, named by slug.
  // If no file exists for a slug, no img field is emitted: never a broken path.
  const seedImg = `/product-images/${slugify(p.name)}.jpg`;
  const hasImg = existsSync(path.join(root, "public", seedImg));
  return {
    slug: slugify(p.name),
    name: p.name,
    brand: p.brand,
    source: "seed",
    url: p.url,
    ...(hasImg ? { img: seedImg } : {}),
    price,
    // USD wherever a price exists — same rule as enrichRecord. Without this
    // the schema layer drops the offer entirely (priceCurrency is required).
    currency: price === null ? null : "USD",
    rel: affiliate ? REL_AFFILIATE : null,
    target: affiliate ? TARGET_AFFILIATE : null,
    alt: typeof p.alt === "string" ? p.alt : null,
    ...(typeof p.note === "string" && p.note.trim() !== "" ? { note: p.note } : {}),
    categories,
    priceBand: priceBandFor(price),
    priceFrom: p.priceFrom ?? false,
    // Verified dates come from the seed; null stays null. Never backfilled.
    priceCheckedAt: p.priceCheckedAt ?? null,
    audiences: [...(p.audiences ?? [])],
    // commissionRate and partnerStatus are deliberately NOT copied here:
    // partner commission rates are commercially sensitive and must never be
    // published. They live in the gitignored catalog.partners.json instead,
    // and scripts/test-catalog.mjs fails the build if they ever leak out.
    ...(p.colorways ? { colorways: p.colorways } : {}),
    concierge: { solves: [...(p.concierge?.solves ?? [])] },
  };
});

// Guard against slug collisions between seed products and everything already
// in the catalog.
const seenSlugs = new Set([
  ...data.products.map((p) => p.slug),
  ...krustic.map((p) => p.slug),
]);
for (const s of seedProducts) {
  if (seenSlugs.has(s.slug)) throw new Error(`Seed product slug collision: "${s.slug}". Rename in the seed or adjust slugify.`);
  seenSlugs.add(s.slug);
}

const catalog = {
  meta: {
    site: "https://gifts.bakinggreatbread.blog",
    generated: new Date().toISOString(),
    description:
      "Consolidated product catalog for the Holiday Baking Gift Guide. Affiliate links included. Prices last verified on the site.",
    license: "Free to read. Keep affiliate links intact when republishing.",
  },
  promo_codes: data.promo_codes.map(([code, applies_to]) => ({ code, applies_to })),
  top_picks: data.top6,
  products: [
    ...enrichAll(
      data.products
        .filter((p) => !disabled.has(p.slug))
        .map((p) => ({ ...p, source: "main" })),
      "products"
    ),
    ...seedProducts,
  ],
  krustic: enrichAll(krustic, "krustic"),
  amazon: enrichAll(
    amazon.filter((a) => !dropNamesFor("amazon").has(a.name)),
    "amazon"
  ),
  books: enrichAll((data.books || []).map((b) => ({ ...b, source: "books" })), "books"),
  free_resources: enrichAll((data.free || []).map((f) => ({ ...f, source: "free" })), "free_resources"),
};

const out = path.join(root, "public", "catalog.json");
fs.writeFileSync(out, JSON.stringify(catalog, null, 2));
console.log(
  `catalog.json written: ${catalog.products.length} products (incl ${seedProducts.length} seed), ${krustic.length} krustic, ${catalog.amazon.length} amazon (after drops), ${catalog.books.length} books, ${catalog.free_resources.length} free`
);
