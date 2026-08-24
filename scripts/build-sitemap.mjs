// Generates public/sitemap.xml from three sources, in order:
//   1. the site root /
//   2. the seven SPA content routes parsed from src/App.tsx (never /admin/*)
//   3. every route the Next app generates, derived from public/catalog.json
//      the same way site/lib/catalog.ts derives them
// Hosts come from site/lib/site.mjs so there is one place to change.
// No <lastmod> (no sourced dates), no <changefreq>/<priority> (nothing to
// justify a value with). A made-up value is worse than none.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { slugify } from "../site/lib/slugs.mjs";
import { BASE_URL } from "../site/lib/site.mjs";
import { PRICE_CAPS } from "../site/lib/price-caps.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const ORIGIN = new URL(BASE_URL).origin;

// Parse content routes out of src/App.tsx: every <Route path="..."> that
// starts with "/", excluding the bare root, /admin/* and the catch-all.
const appTsx = readFileSync(join(root, "src", "App.tsx"), "utf8");
const spaRoutes = [...appTsx.matchAll(/<Route path="([^"]+)"/g)]
  .map((m) => m[1])
  .filter((p) => p.startsWith("/") && p !== "/" && !p.startsWith("/admin") && !p.includes("*"));

if (spaRoutes.length === 0) {
  console.error("build-sitemap: no SPA content routes found in src/App.tsx — parsing broke");
  process.exit(1);
}

// Next app routes derived from the catalog.
const raw = JSON.parse(readFileSync(join(root, "public", "catalog.json"), "utf8"));
const arrays = ["products", "krustic", "amazon", "books", "free_resources"].flatMap((k) => raw[k] ?? []);
const categories = [...new Set(arrays.flatMap((p) => p.categories ?? []))].sort();
const audiences = [...new Set(arrays.flatMap((p) => p.audiences ?? []))].sort();
const bands = [...new Set(arrays.map((p) => p.priceBand).filter((b) => typeof b === "string"))].sort();

const locs = [
  `${ORIGIN}/`,
  ...spaRoutes.map((r) => `${ORIGIN}${r}/`),
  `${BASE_URL}/`,
  ...categories.map((c) => `${BASE_URL}/${slugify(c)}/`),
  ...audiences.map((a) => `${BASE_URL}/${slugify(a)}/`),
  ...bands.map((b) => `${BASE_URL}/${slugify(b)}/`),
  ...PRICE_CAPS.map((c) => `${BASE_URL}/${c.slug}/`),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${locs.map((l) => `  <url><loc>${l}</loc></url>`).join("\n")}
</urlset>
`;

const fsWait = await import("node:fs");
fsWait.writeFileSync(join(root, "public", "sitemap.xml"), xml);
const giftRouteCount = 1 + categories.length + audiences.length + bands.length + PRICE_CAPS.length;
console.log(`build-sitemap: ${locs.length} URLs (root + ${spaRoutes.length} SPA routes + ${giftRouteCount} gift routes)`);
