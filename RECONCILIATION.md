# RECONCILIATION.md — Phase 1b structural pass

Date: 2026-08-21. Scope: section 5 of the handoff brief, structural half only. The enrichment merge from `catalog.seed.json` (step 3) is explicitly out of scope; `catalog.seed.json` was not read and does not exist in this working copy.

## What changed

`scripts/build-catalog.mjs` now enriches every record in every product array via shared helpers in `scripts/catalog-lib.mjs`, used by both the generator and the test. Output remains `public/catalog.json`. A new build test, `scripts/test-catalog.mjs`, runs after generation on every `npm run build`.

New fields on every record in `products`, `krustic`, `amazon`, `books`, `free_resources`:

| Field | Rule applied |
|---|---|
| `price` | Normalized number. Strings stripped of `$` and commas, parsed. Unparseable or absent becomes `null`. |
| `currency` | `"USD"` wherever a price exists (every price in this catalog comes from a US-dollar storefront); `null` where price is `null`. |
| `rel` | `"nofollow sponsored noopener"` on every record whose URL carries an affiliate signal; `null` otherwise. |
| `alt` | Derived only from `name` and `brand` already in the record (`"Name by Brand"`, or just `"Name"` when no brand). `null` if no usable name. |
| `categories` | One-element array from `cat` where `cat` exists, else empty array. `cat` kept in place for downstream compatibility. |
| `priceBand` | Derived from normalized price: under 25 → `under-25`, 25 to 74.99 → `25-75`, 75 to 149.99 → `75-150`, 150+ → `splurge`, null price → `null`. Never inferred from category or description. |
| `priceCheckedAt` | `null` on all 78 records. No verification date exists for any product; nothing backfilled from `meta.description` or anywhere else. |
| `audiences` | Empty array on all records. Placeholder until enrichment is available. |
| `concierge` | `{ "solves": [] }` on all records. Same reason. |

Verified: with the nine added fields stripped, the regenerated output is byte-identical to `catalog.live.json`. No existing value changed.

## Record counts per array, before and after

| Array | Before | After |
|---|---|---|
| top_picks | 6 | 6 |
| products | 41 | 41 |
| krustic | 7 | 7 |
| amazon | 23 | 23 |
| books | 5 | 5 |
| free_resources | 2 | 2 |

Total records enriched: 78. No records were added or removed; disabled slugs were filtered exactly as before.

### Record-count reconciliation: brief says 85, catalog holds 78

The handoff brief states "85 products across five arrays." The generated catalog has always held 78. Accounting:

1. **Real filter, 2 records.** `scripts/build-catalog.mjs` drops slugs listed in `src/lib/guideConfig.ts`:
   - `french-press` (Water Kettle & French Press) from products: 42 raw → 41.
   - `dual-flour-dehydrated-starter` from krustic: 8 raw → 7.
2. **Stale number in the brief, the remaining 7.** Raw records across the five arrays before filtering total 80, not 85, so even zero filtering cannot reach 85 from the data sources. The string "85" appears nowhere in the repo except HANDOFF.md itself.

**Git evidence:** every commit of this repo that contains `public/catalog.json`, from its first appearance (`5e218fd`, "Added catalog endpoint") through HEAD, holds exactly products=41, krustic=7, amazon=23, books=5, free_resources=2 = 78. One earlier commit (`9d8dc9a`) shows amazon=0 mid-build. No committed version was ever 85. Checked by materializing `public/catalog.json` from every commit in history.

**Miscount theories (both unproven, audit artifact is external):** the most likely explanations for "85" are loose-reference double-counting:
- Theory A: 80 raw records (counting the 2 dead items) plus the 4 `market_kit_highlights` entries that exist in `products.json` but are never exported to `catalog.json` = 84.
- Theory B: 78 live records plus the 6 `top_picks` entries counted as products, though they are slug references to products already counted = 84.

Either path lands one short of 85; neither can be confirmed without the original audit artifact. Treat 85 as wrong and 78 as complete.

### Disabled items: status detail

- **`french-press` (Water Kettle & French Press, Brød & Taylor).** Fixable, needs a regenerated Collabs URL. Brød & Taylor is an active Shopify Collabs partner, so the fix is a fresh shortlink from Henry's Collabs dashboard, not dropping the product. Verified 2026-08-21: `https://collabs.shop/b8bht0` returns HTTP 404 at Collabs itself, meaning the shortlink code is dead/revoked, not that the product is gone.
- **`dual-flour-dehydrated-starter` (Krustic).** Not malformed. The stored URL `https://www.krustic.com/products/dual-flour-dehydrated-starter?rfsn=8815980.edac31` is structurally correct (valid Shopify product path plus the Refersion parameter used by all seven live Krustic links), but it returns **HTTP 404** as of 2026-08-21. The product appears to have been delisted from Krustic's storefront. Unfixable on our side unless Krustic restocks it or it lives at a new handle.

Note: `top_picks` is an array of slug strings referencing products, not records, so it carries no fields and was left untouched. Changing its shape would break whatever consumes it today.

## Prices normalized (string → number)

30 prices were converted from dollar-string to number. Original values shown verbatim:

| Source | Record | Original | Parsed |
|---|---|---|---|
| krustic | Baker's Bundle | `"$349.99"` | 349.99 |
| krustic | Enameled Dutch Oven — Round | `"$149.99"` | 149.99 |
| krustic | Enameled Dutch Oven — Oval | `"$159.98"` | 159.98 |
| krustic | Cast Iron Dutch Oven — Round | `"$149.99"` | 149.99 |
| krustic | Cast Iron Dutch Oven — Oval | `"$159.98"` | 159.98 |
| krustic | Wood Pulp Banneton — Oval | `"$44.99"` | 44.99 |
| krustic | Silicone Transfer Mat | `"$19.99"` | 19.99 |
| amazon | Lodge 6qt Dutch Oven | `"$79.99"` | 79.99 |
| amazon | Challenger Bread Pan | `"$295"` | 295 |
| amazon | MyWeigh KD-8000 Scale | `"$39.95"` | 39.95 |
| amazon | Bread Bosses Banneton | `"$16.95"` | 16.95 |
| amazon | Wire Monkey UFO Lame | `"$35"` | 35 |
| amazon | Thermapen ONE | `"$105"` | 105 |
| amazon | Baking Steel | `"$119"` | 119 |
| amazon | OXO Bench Scraper | `"$10.99"` | 10.99 |
| amazon | Brod & Taylor Dough Whisk | `"$16.00"` | 16 |
| amazon | ThermoWorks ThermoPop | `"$34.00"` | 34 |
| amazon | Cambro 6qt Container | `"$17.29"` | 17.29 |
| amazon | Checkered Chef Cooling Rack | `"$12.95"` | 12.95 |
| amazon | KitchenAid Artisan 5qt Stand Mixer | `"$449.99"` | 449.99 |
| amazon | Feather Razor Blades (100 pack) | `"$18.50"` | 18.5 |
| amazon | Silicone Bread Sling | `"$12.99"` | 12.99 |
| amazon | Ball Wide Mouth Mason Jars (12) | `"$18.99"` | 18.99 |
| amazon | Le Creuset Signature Dutch Oven 5.5qt | `"$369.95"` | 369.95 |
| amazon | Staub Cast Iron Round Cocotte 5.5qt | `"$329.99"` | 329.99 |
| amazon | Lavatools Javelin PRO Duo | `"$54.99"` | 54.99 |
| amazon | FibraMent-D Baking Stone | `"$89.95"` | 89.95 |
| amazon | Emile Henry Bread Cloche | `"$89.95"` | 89.95 |
| amazon | Ankarsrum Original Stand Mixer | `"$799.00"` | 799 |
| amazon | Matfer Bourgeat Silicone Baking Mat | `"$32.00"` | 32 |

The other 46 priced records (`products`: 41, `books`: 5) were already numbers and passed through validation unchanged. `free_resources` (2 records) have no price field at all: price, currency, and priceBand are all `null`.

## Prices that could not be parsed

None. All 76 present price values parsed cleanly. Nothing was guessed.

## Records where alt could not be derived

None. Every one of the 78 records has a usable `name`, so no alt is null. Alt uses only `name` and, where present, `brand` (all 40 branded records are in `products`; `krustic`, `amazon`, `books`, and `free_resources` carry name-only alt). No attribute not already in the record appears in any alt string.

## rel assignments

70 of 78 records carry `rel="nofollow sponsored noopener"`. The rule (in `scripts/catalog-lib.mjs`): a URL is affiliate if it has any of the tracking params `tag=`, `rfsn=`, `wpam_id=`, `ref=`, `dt_id=`; or matches a known-affiliate prefix verified by following redirects on 2026-08-21 (`collabs.shop/*` lands on Brod & Taylor with `dt_id=` attribution, `bit.ly/Sourhouse` lands on a ReferralCandy share link, `brodandtaylor.com/henrysbreadkitchen` lands with `dt_id=`); or is a discount-code link carrying Henry's code on a known host (`modkitchn.com/discount/BAKINGGREATBREAD10`).

Got rel:
- products: 40 of 41 (Sourhouse ref links, bit.ly/Sourhouse, all collabs.shop links, brodandtaylor.com/henrysbreadkitchen, wiremonkey rfsn links, Challenger ?ref=henryhunterjr, Holland Bowl Mill wpam_id=10 links, ModKitchn discount-code links)
- krustic: all 7 (rfsn= Refersion links)
- amazon: all 23 (tag= Associates links)

Did not get rel, and why:
- products: Vitale Sourdough Starter (Dehydrated) — plain Etsy shop URL, no tracking params, Henry's own shop.
- books (all 5): the `a.co/d/*` shortlinks resolve to plain Amazon social-share URLs (`ref=cm_sw_r_ffobk_...`) with **no** Associates tag. Verified by redirect on 2026-08-21. They may still earn commission somewhere unobservable, but the link as stored shows no affiliate attribution, so rel would be a guess. Flagged below.
- free_resources (both): Henry's own free properties, not affiliate links.

## priceBand distribution

78 priced-or-null records across the five arrays:

| Band | Count |
|---|---|
| under-25 | 28 |
| 25-75 | 21 |
| 75-150 | 12 |
| splurge | 15 |
| null (no price) | 2 |

## How the rel test is wired in

The repo had no test runner (package.json scripts were dev/build/lint/preview only), so this is the fallback route: a plain Node assertion script, no framework added.

- `scripts/test-catalog.mjs` reads `public/catalog.json`, walks the five arrays, and fails with exit code 1 listing every record whose URL matches an affiliate signal but whose `rel` is not `"nofollow sponsored noopener"`.
- Wired into `package.json`: `"build": "node scripts/build-catalog.mjs && node scripts/test-catalog.mjs && vite build"`, so `npm run build` fails before Vite ever runs if the test trips.
- Run it alone with either `npm run test` (added) or directly: `node scripts/test-catalog.mjs`.

Negative test confirmed: removing one record's rel makes the test exit 1 with a named failure; regenerating restores the pass.

## Verification done

- `npm run build` passes end to end: catalog generated, test green, Vite build succeeds. Site output unchanged apart from `public/catalog.json`.
- Regenerated catalog vs `catalog.live.json`: identical after stripping the nine added fields.
- SPA components already handle numeric or string prices (`priceNum`/`priceStr` in `src/pages/HolidayGiftGuide.tsx`) and read `src/data/*` directly, not `catalog.json`, so nothing downstream breaks.

## market_kit_highlights: 4 records that never reach catalog.json

`src/data/products.json` contains a `market_kit_highlights` array of 4 Amazon-linked items. The generator never exports it, no component imports it, and the live catalog has never included them. They are real-looking products with tagged Associates links (all `tag=onamz55024a-20`), so they read as leftovers from an earlier "market seller kit" idea rather than junk data. Henry to decide keep or delete before Phase 2:

| Name | Price | URL |
|---|---|---|
| Crown Shades 10×10 Pop-Up Canopy | 139.99 | https://www.amazon.com/dp/B078XR1CS8?tag=onamz55024a-20 |
| US Weight 40 lb Canopy Weights | 36.59 | https://www.amazon.com/dp/B06XQ6BLLJ?tag=onamz55024a-20 |
| 40×20 A-Frame Chalkboard Sign | 65.54 | https://www.amazon.com/dp/B01NBG3QDF?tag=onamz55024a-20 |
| Kraft Bread Bags w/ Window (100) | 14.89 | https://www.amazon.com/dp/B0CW1YDB1M?tag=onamz55024a-20 |

Note: these 4 are part of the likely miscount behind the brief's "85" (Theory A above).

## Could not resolve / flagged for Henry

1. **Books affiliate status — ASIN resolved, swap pending Henry's confirmation.** All five Amazon book links resolve without an Associates tag. ASINs below were resolved from each `a.co/d/*` shortlink by following redirects on 2026-08-21, so the five stored URLs can be rebuilt as tagged `amazon.com/dp/{asin}?tag=onamz55024a-20` links. Henry is verifying each dp page in a browser before the swap lands in `src/data/products.json` (two of five look like recent ASINs). Once swapped, rel follows automatically on the next build.

   | Book | Current URL | Resolved ASIN | Status |
   |---|---|---|---|
   | Sourdough for the Rest of Us | https://a.co/d/guDGoiE | B0F3D7FJM4 | pending Henry's verification |
   | Vitale Sourdough Mastery | https://a.co/d/h8Lnskn | B0CV8MLK47 | pending Henry's verification |
   | From Oven to Market | https://a.co/d/3MKgp3l | B0D8PNGC7Q | **confirmed by Henry** |
   | The Loaf and the Lie | https://a.co/d/fyIyomh | B0FNNN8WWF | pending Henry's verification |
   | Bread: A Journey | https://a.co/d/3jUvHC8 | B0CH2D2GDB | **confirmed by Henry** |
2. **Vitale starter link** is a bare Etsy shop URL. If there is a tracked link available, swap it in; until then it stays non-affiliate.
3. **ModKitchn discount links** are treated as affiliate because they carry Henry's tracked code, but they show no commission parameter. If any of them are not commission-bearing, say the word and I will narrow the rule.
4. **`meta.description`** in catalog.json still says "prices last verified on the site." Left untouched as out of scope for this pass; it contradicts the null `priceCheckedAt` data and should be reworded before Phase 2 renders a date from data.
5. **Enrichment merge** (seed audiences/priceBand/concierge/rel overrides, plus the NutriMill/Fourneau/Farm2Flour/Fusek/Better Batter/Polselli/FarmSteady/Made With Loave presence check) not started, per scope.
6. **Currency assumption:** every storefront in the catalog prices in USD, so currency is set to `"USD"` for all 76 parsed prices, including those stored as bare numbers. If any non-dollar price ever enters the data, the parser will need a currency hint rather than this default.
