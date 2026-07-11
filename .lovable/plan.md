# Holiday Gift Guide 2026 — Launch Readiness Plan

Scope: repair, harden, and update the existing guide. No changes to visual identity, hero art, ornament strip, typography, palette, product photography, snow effect, or brand voice.

## 1. 2025 → 2026 refresh
- Update hero copy ("The 2026 Guide"), page title, meta description, OG/Twitter title & description, and any alt text / hidden labels that mention 2025.
- Keep countdown dynamic: target `new Date(new Date().getFullYear(), 11, 25)`; if past, roll to next year.
- Leave production domain untouched.

## 2. Data source of truth + broken links
- Consolidate products into a single typed catalog with per-item fields: `slug, name, brand, price, priceValue (number), category, image, url, promoCode, description, personalNote, enabled, lastVerified`.
- Render only where `enabled !== false` AND `url` is a valid non-placeholder URL.
- Move known-broken items to a clearly-marked `NEEDS_URL` config block with `enabled: false`:
  - Water Kettle & French Press (`collabs.shop/b8bht0`)
  - Dual-Flour Dehydrated Starter (Krustic)
- Free-resource cards (Sourdough Starter Guide, Holiday Recipe Collection): hide until real URLs provided (same `enabled: false` pattern; never render `href="#"`).

## 3. Gift Finder — budget as hard constraint
- Price bands: `<25`, `25–75` inclusive, `>75 and ≤150`, `>150`.
- Pipeline: filter by budget → score by recipient + need/category + style → return top 3.
- Empty state with actions: Widen budget, Change category, Start over. Announce via `aria-live="polite"`.

## 4. Gift Finder — accessible modal
- Rebuild on shadcn `Dialog` (Radix): gives `role="dialog"`, `aria-modal`, focus trap, Escape, focus restore, scroll lock, outside-click close for free. Keep current look and 4-question flow.
- `aria-labelledby` on visible heading. First answer or close gets focus on open.
- Answer buttons min 44×44. Result region `aria-live="polite"`.
- Wire both "Open the Gift Finder" triggers.

## 5. Search
- Rename input to "Search the main gift collection…" (avoids large architectural change).
- Add persistent `<label>` (visually hidden ok), visible Clear button when text present, `aria-live` count ("14 gifts"), zero-results state with "Clear all filters".
- Preserve combined category + price filtering.

## 6. Filter chips
- Add `aria-pressed`, min 44px height, strong `:focus-visible` ring.
- Active-filter summary line + "Clear all" + result count.
- Mobile: horizontal scroll with fade affordance and right padding so last chip isn't clipped.

## 7. Progressive disclosure (shorter page, same content)
- Hero + Top 6 always visible.
- Main catalog: show first N (e.g. 12), then "View all gifts" / "Show fewer".
- Collapsible sections (native `<details>` for SEO-friendly, crawlable markup): Krustic, Amazon finds, Market seller gifts, Books, Free resources.
- Jump-nav near main catalog: Top Picks, Under $25, New Bakers, Serious Bakers, Market Sellers.

## 8. Touch targets & focus
- Ensure ≥44×44 on: search, chips, coupon buttons, share buttons, footer social, modal close.
- Global `:focus-visible` ring token added to `index.css` for links, cards, chips, CTAs, coupons, share, modal options, footer nav. Hover styles preserved.

## 9. Reduced motion
- Extend `@media (prefers-reduced-motion: reduce)` block: snow off (skip canvas RAF loop), ornament sway/twinkle off, gift-tag lift off, marquee off, `scroll-behavior: auto`.
- Snow toggle keeps `aria-pressed`.

## 10. Trust language
- Disclaimer near main catalog: "Prices and availability may change. Some links are affiliate links, which support our free recipes at no additional cost to you."
- Single `PRICES_LAST_CHECKED` constant rendered once as "Prices last checked {date}".

## 11. SEO / social metadata
- `index.html`: canonical `https://holiday-gifts-2025.lovable.app/`, 2026 title/desc, OG + Twitter title/desc, absolute OG/Twitter image URL (`https://holiday-gifts-2025.lovable.app/og-image.png`).
- Remove `twitter:site="@Lovable"` (no verified handle supplied — will ask user).
- JSON-LD injected in page: `WebPage`, `ItemList` for curated guide, `Product` entries only where name+url+image+price are reliable. No availability/ratings/reviews/shipping.

## 12. Preserve
- Snow toggle, countdown, 4-question finder, search, combined filters, coupon copy, link copy, affiliate params, `target="_blank" rel="noopener noreferrer"`, mobile no-overflow, Top 6 anchor, all copy & photos.

## Technical notes

Files to touch:
- `src/pages/HolidayGiftGuide.tsx` — most changes
- `src/data/products.json` + wrapper (or new `src/data/catalog.ts`) — extend schema, `enabled`, `lastVerified`
- `src/data/krustic.ts`, `src/data/amazon.ts` — add `enabled`/`slug`
- `src/components/holiday/GiftFinderQuiz.tsx` — rebuild on shadcn Dialog
- `src/components/holiday/FilterBar.tsx` — aria-pressed, focus, summary
- `src/components/holiday/SnowCanvas.tsx` — reduced-motion guard
- `src/index.css` — focus-visible tokens, reduced-motion extensions
- `index.html` — 2026 meta, canonical, absolute OG image, drop @Lovable
- New: `src/lib/config.ts` (`PRICES_LAST_CHECKED`, price band predicates, `NEEDS_URL` set)

## Items I will need from you after shipping
- Correct URLs for: Water Kettle & French Press, Krustic Dual-Flour Dehydrated Starter, Sourdough Starter Guide, Holiday Recipe Collection.
- Verified Twitter/X handle for `twitter:site` (or confirm to omit).
- Confirm OG image path (`/og-image.png`) is the right social preview.

## Acceptance verification
Build passes, Playwright pass on `/` at 375px and 1280px checking: no "2025" text, no `href="#"` CTAs, hidden broken products, Finder budget constraint, focus trap + Escape, aria-pressed on chips, search label matches behavior, zero-results state, reduced-motion disables snow, valid JSON-LD, no console errors, no horizontal overflow.
