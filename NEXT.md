# NEXT.md — open items after Phase 1b

Last updated 2026-08-22. Read alongside RECONCILIATION.md.

Phase 1b structural pass complete (commits `e5d2753`, `ed3e6a5`, `3f6039f`). Enrichment
merge and seed merge complete 2026-08-22: catalog now holds 87 records, every one carrying
categories, audiences and concierge.solves. Items below reflect what is still open.

---

## 1. Books: three ASINs need Henry's eyes

Two are confirmed, three are not. Do not swap any URL until Henry has opened the dp page
in a browser and confirmed the cover.

| Book | Resolved ASIN | Status |
|---|---|---|
| From Oven to Market | B0D8PNGC7Q | confirmed |
| Bread: A Journey | B0CH2D2GDB | confirmed |
| Sourdough for the Rest of Us | B0F3D7FJM4 | **verify in browser** |
| Vitale Sourdough Mastery | B0CV8MLK47 | **verify, and see conflict below** |
| The Loaf and the Lie | B0FNNN8WWF | **verify in browser** |

**Name conflict.** Henry's own reference doc lists *The Tally: Sourdough Mastery* at
ASIN `B0CVB8ZCFV`. The catalog calls the book *Vitale Sourdough Mastery* and it resolves
to `B0CV8MLK47`. Different title, different ASIN. Either these are two separate books and
one is mislabeled in the guide, or one link has been pointing at the wrong product.
Henry decides.

**Also unconfirmed:** Henry's records show no Amazon listing at all for *Sourdough for the
Rest of Us* (Gumroad and flipbook only) or *The Loaf and the Lie* (described as a flipbook).
So those two ASINs may be new editions his records haven't caught up with, or they may
resolve somewhere wrong.

**Before retagging anything:** check the Amazon Associates Operating Agreement on linking
to your own published titles. Do not assume it is allowed.

Once confirmed, swap the URLs in `src/data/products.json` to
`https://www.amazon.com/dp/{ASIN}?tag=onamz55024a-20`. Then `rel` and `target` land
automatically on the next build, because tagged URLs trip the affiliate rule.

## 2. Brød & Taylor french press link

`french-press` is disabled because `https://collabs.shop/b8bht0` returns HTTP 404 at
Collabs itself. The shortlink code is dead or revoked; the product is fine.

Brød & Taylor is one of only three active Collabs partnerships in Henry's account
(the others being NutriMill and NY Vanilla), so this is a negotiated rate sitting idle.
Fix: generate a fresh shortlink from the Collabs dashboard, drop it in, re-enable the slug
in `src/lib/guideConfig.ts`.

The other disabled item, `dual-flour-dehydrated-starter`, is **not** fixable on our side.
The Krustic URL is well formed but the product returns 404, so it appears delisted.
Leave it disabled.

## 3. Merge catalog.seed.json — DONE 2026-08-22

The merge landed in `scripts/build-catalog.mjs`. All 12 seed products are in `catalog.json`
(inside the `products` array, with `source: "seed"`), categories mapped to the real
vocabulary, audiences and concierge.solves carried as written. See RECONCILIATION.md,
"Enrichment and seed merge", for the mapping table and the drop records.

Still open from this section:

- **commissionRate / partnerStatus — resolved 2026-08-22.** Stripped from the build output
  and from `catalog.seed.json`; the rates now live only in the gitignored
  `catalog.partners.json`, and `scripts/test-catalog.mjs` fails the build if either field
  ever appears in catalog output. Caveat: they were briefly public (see RECONCILIATION.md)
  and remain in git history of `catalog.seed.json`. `colorways` ships — it is product data.
- Slugs for the 12 were generated at build time (`slugify` of the name). If any slug needs
  to change later, change it in `slugify`'s output deliberately — URLs may already reference them.

## 4. Prices for the twelve new products — STILL OPEN

Pull from the product pages. When they land, `priceBand` computes and `priceCheckedAt`
finally gets a real date for those twelve. Everything else stays `null` until someone
actually verifies a price.

## 5. Audiences and concierge mappings for the existing 78 — DONE 2026-08-22

Landed via `catalog.enrichment.json`, merged in `scripts/build-catalog.mjs`. All 75 surviving
original records (78 minus the 3 amazon drops) now carry real categories, audiences and
concierge.solves; the test fails the build on any empty categories or audiences array.
Phase 4's Pantry Concierge can wire to this data.

Quality note: the mappings were written by Henry and Claude without live product-page
verification. Spot-check a handful of `solves` strings against the actual products before
Phase 4 leans on them hard.

## 6. market_kit_highlights: keep or delete

Four Amazon-linked items in `src/data/products.json` that the generator never exports:
Crown Shades canopy, US Weight canopy weights, A-frame chalkboard, Kraft bread bags.
All carry valid `tag=onamz55024a-20` links.

Together they are a market stall in four items, which maps directly onto the
`market-sellers` audience tag and the `/gifts/market-sellers` page Phase 2 has to generate.
Recommendation: wire them in rather than delete. Henry decides.

## 7. meta.description still claims a verification date

`catalog.json` `meta.description` says prices were "last verified on the site" with a
hardcoded date. It contradicts the null `priceCheckedAt` data and the date is wrong.
Left untouched in Phase 1b as out of scope. Phase 2 renders the max `priceCheckedAt`
from data instead. Until then it is a live incorrect claim on a live page, so a one-line
copy edit now is reasonable.

---

## Phase 2, when it starts

Do not hand it over as one prompt. It is a framework change, Vite SPA to Next.js App Router,
not an extension of Phase 1b. Scope it into four briefs, with a human read between each:

1. Scaffold and routing. Get the URL structure right first, everything else depends on it.
2. Facet page generation from the catalog: every category, audience and price band as its
   own server-rendered URL.
3. JSON-LD (`ItemList` per collection, `Product` + `Offer` per item) and canonical tags.
4. Redirects and deployment to `bakinggreatbread.blog/gifts`.

**The acceptance test does not need a browser.** `curl` the built HTML and grep for a
product name. If "Challenger Bread Pan" appears in the raw response, the page is
server-rendered. Wire that into the build as a test that fails, the same way the rel test
works, rather than relying on anyone remembering to check.
