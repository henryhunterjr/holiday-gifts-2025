// Generates public/catalog.json — one clean, public endpoint with the full
// product catalog for external agents and integrations.
// Run: node scripts/build-catalog.mjs   (also runs automatically on `npm run build`)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

const SITE = "https://holiday-gifts-2025.lovable.app";
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
    name,
    category: get("category"),
    price: get("price"),
    rating: Number.isFinite(rating) ? rating : undefined,
    asin,
    url: asin ? `https://www.amazon.com/dp/${asin}?tag=${TAG}` : urlLiteral,
    source: "amazon",
    affiliate_tag: TAG,
  });
}

const abs = (u) => (u?.startsWith("/") ? SITE + u : u);

const catalog = {
  meta: {
    site: SITE,
    generated: new Date().toISOString(),
    description:
      "Consolidated product catalog for the Holiday Baking Gift Guide. Affiliate links included. Prices last verified on the site.",
    license: "Free to read. Keep affiliate links intact when republishing.",
  },
  promo_codes: data.promo_codes.map(([code, applies_to]) => ({ code, applies_to })),
  top_picks: data.top6,
  products: data.products
    .filter((p) => !disabled.has(p.slug))
    .map((p) => ({ ...p, img: abs(p.img), source: "main" })),
  krustic,
  amazon,
  books: (data.books || []).map((b) => ({ ...b, img: abs(b.img), source: "books" })),
  free_resources: (data.free || []).map((f) => ({ ...f, img: abs(f.img), source: "free" })),
};

const out = path.join(root, "public", "catalog.json");
fs.writeFileSync(out, JSON.stringify(catalog, null, 2));
console.log(
  `catalog.json written: ${catalog.products.length} products, ${krustic.length} krustic, ${amazon.length} amazon, ${catalog.books.length} books`
);
