## What we're building

A full replacement of the current `/` page with the design from your uploaded prototype: warm flour-white background, gift-tag product cards with twine and handwritten notes, glowing "bakery window" hero, marquee promo strip, Henry's Top 6 shelf, sticky filter bar, category aisles, Gift Finder quiz, Books shelf, free gifts, and footer. Krustic and the Amazon "Shop More Baking Essentials" grid stay intact as their own sections so no product is lost.

## Design system

Add these tokens to `index.css` and `tailwind.config.ts`:
- Colors: oven, crust, crumb, flour (bg), parchment, cranberry, evergreen, honey, twine
- Fonts: Fraunces (display, SOFT variation), Karla (body), Caveat (Henry's notes) — loaded from Google Fonts in `index.html`
- Gift-tag card component: parchment bg, punched hole with twine, slight rotation that straightens on hover, dashed promo pill

All colors are HSL semantic tokens. No hardcoded hex in components.

## Page structure

1. Sticky top bar: brand, "X days until Christmas" countdown, snow toggle, Admin link (Admin is placeholder, no route yet)
2. Hero: bakery window with honey radial glow, garland, canvas snow (respects prefers-reduced-motion). Headline: "Every gift on this list has flour on it." CTA opens the Gift Finder.
3. Promo-code marquee: HBK23, BAKINGGREATBREAD10, `bread`, Wire Monkey built-in
4. Henry's Top 6 shelf: ranked cards on a wooden shelf board (goldie, challenger-pan, proofer, goose-lame, walnut-17, holiday-bags)
5. Sticky filter bar: search, category chips, price chips
6. The Counter: products from `gift-guide-products.json` grouped into category aisles, rendered as gift-tag cards with tap-to-copy promo pills
7. Krustic brand section (preserved, restyled to match tags)
8. Shop More Baking Essentials — Amazon grid (preserved, restyled)
9. From Oven to Market evergreen section: 4 Market Kit highlights, CTAs to fromoventomarket.com/market-kit and the course
10. Books shelf on parchment: 5 books with lift on hover
11. Free gifts: Starter Guide + Recipe Collection in dashed-border cards
12. Newsletter block + footer (blog, Facebook, YouTube, From Oven to Market)

## Gift Finder quiz

Modal opened by the hero CTA. 4 short questions:
1. Who's it for? (new baker / weekend baker / obsessed sourdough baker / market seller)
2. Budget? (Under $25 / $25–75 / $75–150 / Splurge $150+)
3. What do they need most? (starter care / proofing / scoring / bake day / serving / storage)
4. Gift style? (stocking stuffer / centerpiece gift / bundle)

Scores products from the JSON by matching category, price band, and hand-picked tag weights. Shows top 3 matches as gift-tag cards with a "Copy shareable link" button (link encodes selections as query params so refreshing restores results).

Pure client-side, no backend.

## Data

- Copy `user-uploads://gift-guide-products.json` into `src/data/products.json`
- Preserve current Krustic product data as a separate file `src/data/krustic.ts`
- Preserve current Amazon products list as `src/data/amazon.ts`
- All product images imported from `src/assets/holiday/` (existing) — no re-download needed for items already local

## Files

New:
- `src/pages/HolidayGiftGuide.tsx` (rewritten)
- `src/components/holiday/GiftTag.tsx` (card)
- `src/components/holiday/BakeryWindowHero.tsx`
- `src/components/holiday/PromoMarquee.tsx`
- `src/components/holiday/Top6Shelf.tsx`
- `src/components/holiday/FilterBar.tsx`
- `src/components/holiday/CategoryAisle.tsx`
- `src/components/holiday/BooksShelf.tsx`
- `src/components/holiday/OvenToMarket.tsx`
- `src/components/holiday/GiftFinderQuiz.tsx`
- `src/components/holiday/SnowCanvas.tsx`
- `src/components/holiday/CountdownBadge.tsx`
- `src/data/products.json`, `src/data/krustic.ts`, `src/data/amazon.ts`

Updated:
- `index.css` (tokens, fonts, gift-tag styles)
- `tailwind.config.ts` (color extensions, font families)
- `index.html` (Google Fonts preconnect + link, title/meta)

Removed from current page: old dark-navy hero, sticky nav buttons row, existing category headers — but every product (Krustic + Amazon + all Sourhouse/Wire Monkey/etc.) is carried into the new layout.

## Out of scope (deferred)

- Phase 2 click tracking
- Phase 3 shareable curated lists with slugs
- Phase 4 admin dashboard
- Lovable Cloud (not needed for Phase 1 + quiz)

## Verification

After build: view `/` in the preview, confirm hero renders with snow, marquee scrolls, gift-tag cards rotate on hover, promo pill copies to clipboard, quiz opens and returns matches, Krustic + Amazon sections still show all products, mobile layout works at 375px. Then publish.
