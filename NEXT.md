# NEXT.md — open items after Phase 1b

Last updated 2026-08-21, end of session. Read alongside RECONCILIATION.md.

Phase 1b structural pass is complete and verified: commits `e5d2753`, `ed3e6a5`, `3f6039f`.
Everything below is still open. Nothing here is blocked on anything except where noted.

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

## 3. Merge catalog.seed.json

`catalog.seed.json` (rebuilt 2026-08-21, replaces the lost original) holds 12 new products
with fresh Shopify Collabs URLs verified that day. It adds products only. It does **not**
enrich the existing 78 — that mapping still has to be rebuilt.

Notes for whoever merges it:

- `categories` values in the seed are provisional. Map them to the category names already
  used in `catalog.json` before merging.
- Every new product has `price`, `currency`, `priceBand` and `priceCheckedAt` set to `null`
  by design. No prices were available. Do not infer them from the brand, the commission
  rate, or the product type.
- NutriMill is four items, not five: Classic, Impact, Harvest, plus the Bosch bundle.
  Harvest ships in three colorways; all three URLs are preserved under `colorways` on the
  Harvest record, with Black as the default. Do not create three Harvest records.
- Each record carries `commissionRate` and `partnerStatus`. Those are for Henry's
  prioritisation, not for the site. Decide whether they ship in `catalog.json` or get
  stripped at build.

## 4. Prices for the twelve new products

Pull from the product pages. When they land, `priceBand` computes and `priceCheckedAt`
finally gets a real date for those twelve. Everything already in the catalog stays `null`
until someone actually verifies a price.

## 5. Audiences and concierge mappings for the existing 78

Every record currently carries `audiences: []` and `concierge: { solves: [] }`.
This is judgment work, not a mechanical merge: who is each product for, and what problem
does it solve in plain language. Henry and Claude do this together against the live catalog.
Phase 4's Pantry Concierge depends on `concierge.solves` being real.

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
