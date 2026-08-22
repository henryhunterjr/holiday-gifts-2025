# Holiday guide rebuild: handoff brief (v2, Aug 21 2026)

Self-contained. Nothing from any prior conversation is required reading.

---

## 1. Who and what

Henry Hunter runs **Baking Great Bread at Home**. This is the fifth iteration of his annual holiday gift guide.

- **Repo:** `https://github.com/henryhunterjr/holiday-gifts-2025.git`
- **Live:** `https://holiday-gifts-2025.lovable.app/` (aliased by `https://skoo.ly/holiday-guide`)
- **Catalog endpoint:** `https://holiday-gifts-2025.lovable.app/catalog.json` — regenerated every build
- **Also published:** `/llms.txt`, `/holiday-gift-guide-2025.csv`, `/pinterest-product-catalog.csv`
- **Built in:** Lovable, client-rendered React SPA
- **Target:** `bakinggreatbread.blog/gifts`, server-rendered
- **Full audit with evidence:** https://claude.ai/code/artifact/b6e08cb4-9c36-414b-852c-92fc8c388bd1

---

## 2. State of play

**Already done and good.** A build-time catalog endpoint exists at `/catalog.json` with 85 products across five arrays, live affiliate links, disabled items filtered out, and promo codes. Images are self-hosted WebP under `/assets/`. There's an `llms.txt` pointing at the catalog and two CSVs including a Pinterest feed.

That is Phase 1 of the original plan, done, and done better than the seed that shipped with the first version of this brief. **`catalog.json` is now the source of truth for product data.** The old `catalog.seed.json` in this folder is superseded and should only be mined for the enrichment fields listed in section 4.

**Still broken.** Fetched the root page as a non-JS client on August 21 and got meta tags and an empty body. No product names, no prices, no copy.

```
HTML source        app shell only, <div id="root"></div>
Body text          0 characters to a non-JS client
Rendered text      ~8,900 characters after JS runs
JSON-LD on page    none
canonical tag      none
```

A catalog endpoint is a data layer, not a rendering fix. `llms.txt` plus `catalog.json` genuinely helps AI crawlers that know to look for them, which closes part of the gap. But Google and Bing index **the page**, and the page is still blank to them. Nothing about ranking has changed yet.

---

## 3. Problems in the current catalog

Fix these while mapping, not after.

| Problem | Detail | Why it matters |
|---|---|---|
| Price types are inconsistent | `products` uses `89` (number). `amazon` uses `"$105"` (string). `krustic` uses `"$159.98"` (string). | Sorting, filtering, and price-band pages all break. Normalize to a number plus a separate currency field. |
| No `rel` field | Nothing in the catalog carries link rel. | Google requires `rel="sponsored"` on affiliate links. It must come from data and be enforced by a build test, not left to a component. |
| No `alt` text | `img` is a bare URL string. | Accessibility gap and lost descriptive text on every product image. |
| `cat` is a single string | One product, one category. | A scale belongs in Bake Day and in gifts for new bakers. Needs to be an array. |
| No audience tags | Nothing marks new-bakers / serious-bakers / market-sellers. | `/gifts/new-bakers` cannot be generated without it. |
| No price band | Bands exist in the UI, not the data. | `/gifts/under-25` cannot be generated without it. |
| No per-product price date | `meta.description` says "prices last verified on the site". | The page currently claims a hardcoded date that is 86 days in the future. Date must be data, rendered as the max across products. |
| No concierge mapping | Nothing links a product to the problem it solves. | Pantry Concierge cannot recommend gear in Phase 4. |
| Two URLs, wrong year | `llms.txt` lists `/` and `/bread-baker-holiday-gift-guide-2025` as the same guide. No canonical tag. Slug says 2025, guide says 2026. | Duplicate content, and the durable URL carries the wrong year. Pick one, drop the year, canonicalize. |

---

## 4. Enrichment already written

`catalog.seed.json` in this folder is **not** a product source any more. It does contain, for ~45 products matched by name, the four fields the live catalog lacks:

- `audiences` — new-bakers / serious-bakers / market-sellers
- `priceBand` — under-25 / 25-75 / 75-150 / splurge
- `concierge.solves` — plain-language problems each product addresses
- `rel` — `nofollow sponsored noopener`

Match by product name, merge those four fields into the live catalog, and hand back a list of any live product that got no match so Henry can fill the gaps.

It also contains NutriMill's mills and Bosch bundle, Fourneau, Farm2Flour, Fusek, Better Batter, Polselli, FarmSteady and Made With Loave with live Shopify Collabs affiliate URLs. Check whether those are in the live catalog. NutriMill in particular pays 15%, the best rate in Henry's account, and was absent from the guide as of the audit.

---

## 5. Phase 1b, the only task being assigned now

Do not build pages. Do not change the framework.

1. Pull `catalog.json` and read the generator that produces it in the repo.
2. Extend the generator so its output carries, for every record in every array: `rel`, `alt`, `categories` (array), `audiences`, `priceBand`, `priceCheckedAt`, `concierge.solves`, and a normalized numeric `price` plus `currency`.
3. Merge the four enrichment fields from `catalog.seed.json` by product name.
4. Confirm whether the NutriMill, Fourneau, Farm2Flour, Fusek, Better Batter, Polselli, FarmSteady and Made With Loave products are present. Add any that are missing, using the URLs in the seed.
5. Write `RECONCILIATION.md`: products matched, products with no enrichment match, products added, every field normalized, and anything you could not resolve.
6. The site should still build and deploy exactly as it does now.

Henry reviews the regenerated `catalog.json` and `RECONCILIATION.md` before Phase 2.

---

## 6. Phases 2 to 4, context only

**Phase 2, the actual fix.** Next.js App Router, static generation, deployed to `bakinggreatbread.blog/gifts`. Every category, audience, and price band generated from the catalog as its own server-rendered URL. Canonical tags. JSON-LD `ItemList` per collection and `Product` + `Offer` per item, generated from the catalog. 301 from the lovable.app address and from `/bread-baker-holiday-gift-guide-2025`. Keep `catalog.json`, `llms.txt` and both CSVs published at the new domain.

**Phase 3, images.** All images through `next/image`, AVIF with WebP fallback, responsive sizes. Budget: hero under 250 KB, product images under 120 KB, page under 1.5 MB. Alt text everywhere. The hero is currently AI-generated and gets replaced with Henry's own photograph.

**Phase 4, consolidation.** Fold Pantry Concierge into the same codebase at `/concierge`, wired to `concierge.solves`. Publish Henry's Kit at `/kit` as a second view of the same catalog. Cross-link all three.

---

## 7. Non-negotiables

- **Server-rendered HTML.** If view-source on the built page does not contain product names and prices as text, the build has failed regardless of how it looks in a browser.
- **`catalog.json` is the only source of product data.** No product hardcoded in a component, ever.
- **Every facet gets a URL.** Filters may update the view client-side, but every category, audience, and price band must also resolve as its own server-rendered page.
- **Every affiliate link carries `rel="nofollow sponsored noopener"` and `target="_blank"`,** enforced by a build-time test that fails the build.
- **Never invent a price, a date, or a product claim.** Null is correct. Guessing is not.
- **`priceCheckedAt` is data.** The page renders the max across the catalog. No date is ever hardcoded in copy.
- **Keep publishing `catalog.json`, `llms.txt` and the CSVs.** They are working and they are an advantage.

---

## 8. Acceptance test

Disable JavaScript and load the page. If you can read the guide, the build is right. If you see a blank screen, nothing else matters.

---

## 9. Voice, if you write or edit copy

Plain-spoken, warm, direct. A baker talking to another baker over the counter.

**No em dashes.** Commas, colons, or split the sentence.

**Never use:** delve, dive into, in today's world, fast-paced world, embark on, navigate the journey of, game changer, unlock your potential, ensure, crucial, tapestry, unveil.

Contractions preferred. Vary sentence length. Fragments are fine.

Closing line where it fits: *Perfection is not required. Progress is.*

---

## 10. Timing

August 21 today. The deadline is indexing, not Christmas: live, server-rendered and settled by early October to rank when gift searches climb in November.

- Phase 1b and Phase 2 by August 31
- Phase 3 by September 7
- Phase 4 by September 30, can slip without real cost
- Indexed with facet pages showing by October 15
