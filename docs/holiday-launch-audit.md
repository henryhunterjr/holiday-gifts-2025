# Holiday guide launch review
Reviewed November 16, 2026, Eastern time.
Live page: https://holiday-gifts-2025.lovable.app/
Source baseline: be86396bd8911448a07360f1bfcef2b6aa8d2150

## Status
Draft changes prepared. Not published or certified ready for launch. Source checks passed; a full production build, browser preview, mobile interaction check, and merchant destination checks remain outstanding.

## Product-card redesign
The observed page used small, inconsistently sized images inside large cream boxes. Product cards now use a shared photo component with a generous image stage, a white photo mat, pale evergreen background, a restrained pine-and-berry corner, and consistent text spacing. Featured picks carry a cranberry ribbon. Product photos are preserved, not generated or altered. Photo load failures show a useful store prompt.

Four featured cards per desktop row replace the five-column layout. Mobile uses one column, then two at the small breakpoint. Pointer hover adds shallow perspective and elevation; touch and reduced-motion visitors get static cards. Optional hero scroll depth uses a CSS view timeline with a static fallback and native scrolling. No scroll interception.

Snow defaults off. The interrupting automatic promotion modal is removed from this page; campaign definitions are retained. Main-card blinking button lights are removed.

## Confirmed defects addressed in this draft

| Finding | Draft change |
| --- | --- |
| Top 10 included two Coming Soon placeholders | Label is Top Picks, and only valid non-placeholder entries render |
| Newsletter submit handler only displayed success, without sending or storing email | Replaced with an honest direct Recipe Pantry call to action |
| Book cards used placeholder-like Amazon shortlinks and Vitale linked to vitalebreadco.com?ref=bfriedman | Cards now read existing book records in products.json, with their existing a.co destinations; redirect and tag verification still pending |
| Amazon prices and ratings were literal constants | Removed from cards and Amazon source data; generator and public feed omit them, with a regression guard |
| Book price display lacked current provenance | Removed from cards and generated/public book records |
| Amazon and other product anchors omitted sponsored metadata | Updated gift cards, featured picks, Amazon, Krustic, books and saved-gift purchase links |
| Amazon disclosure was away from the Amazon shelf and used third-person wording | Exact first-person disclosure placed beside Amazon listings and in footer |
| Three Amazon entries ignored existing direct-partner deduplication policy | Removed Challenger, Wire Monkey UFO and Brod & Taylor whisk duplicates from the Amazon source; direct partner cards remain |
| Reference prices appeared as an old overall verification claim | Main catalog labels them as August 25 reference prices and tells shoppers to check the store; featured cards show store pricing CTA |
| Video described as two minutes while the observed player showed 0:44 | Copy now says short story |

## Launch blockers still requiring verification

1. **Discount conflict:** NutriMill Classic top-pick data says 20% off, $279.98, through collabs.shop/qn3koy and identifies Shenandoah Homestead Supply. Promo campaign data says $20 off, $329.97, through nutrimill.com/Academy26. The draft removes the top-pick amount/discount claim and disables the popup on this page, but the correct current offer needs verification before reintroducing claims.
2. **Sourhouse attribution conflict:** Main cards use ref=BAKINGGREATBREAD; popup data uses ref=henryhunter. Neither ownership nor attribution was independently verified in this review. Existing main-card link is preserved.
3. **Amazon ownership and destinations:** Existing tag onamz55024a-20 is preserved. A correctly shaped tag is not proof it belongs to Henry or that commissions are credited. Verify it in Associates and verify every ASIN/product match. Direct fetch attempts for selected Amazon/shortlink destinations were blocked, so those are NOT labeled broken or passed.
4. **Book redirects:** Existing catalog a.co URLs replace clearly inconsistent presentation URLs, but final book identity and affiliate tag still need verification.
5. **Merchant links:** Several accessories share the parent product's affiliate shortlink, such as proofer/shelf and Sahara/shelves. Check the actual landing product, variant, price, stock and coupon. Generic brand landing pages are not direct product links.
6. **Prices and claims:** Main merchant reference prices are from August. Current price, stock, shipping, discount exclusions and claims have not been reconfirmed. Do not update verification dates without doing the checks.
7. **Canonical domain:** Source uses gifts.bakinggreatbread.blog, while the supplied live URL is lovable.app. Confirm the intended canonical domain resolves to this guide before changing SEO.
8. **Giveaway:** Registration, winner schedule, confirmation and email delivery need an end-to-end check. No test entry was submitted.
9. **Responsive/interaction QA:** Search, all filters, Gift Finder, saved gifts, code copy, keyboard focus, image loading, video, reduced-motion and mobile layout need a browser pass on the built result.
10. **Other published surfaces:** Existing static exports/CSV and /gifts pages must be checked after the full build. The source has both a React SPA and a Next static export; this card redesign targets the supplied SPA homepage. This is not a full redesign of all facet pages.

## Link inventory
See holiday-link-inventory.csv for all 87 catalog records: 53 products, 7 Krustic items, 20 deduplicated Amazon products, 5 books and 2 free resources. Every destination is explicitly marked not independently verified. This file is a source inventory, not an HTTP uptime report or attribution certification. Additional homepage promotion/social/navigation links remain part of browser QA.

## Validation performed
- Catalog generator executed.
- Existing catalog tests passed: 79 affiliate-marked records carry required rel/target metadata; taxonomy and price-provenance shape checks passed.
- New Amazon catalog guard passed: no unsupported Amazon prices, currencies, price bands or star ratings.
- Modified TS/TSX files parsed successfully with esbuild.
- Styles parsed successfully with PostCSS.
- No full npm production build or visual/browser tests completed. Git network access failed, Lovable connector returned internal errors, and the browser connection disconnected. Local validation used fetched text sources; seed image-existence checks were not a full asset audit.

## Official Amazon references
- Disclosure: https://affiliate-program.amazon.com/help/node/topic/GPXFHVYZMTGPUMPE
- Linking and pricing: https://affiliate-program.amazon.com/help/operating/linking/
- Program policies and rating use: https://affiliate-program.amazon.com/help/operating/policies

The draft implements a conservative presentation change. It does not establish account compliance or verify attribution.
