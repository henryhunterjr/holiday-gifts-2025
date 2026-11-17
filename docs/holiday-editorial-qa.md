# Holiday editorial redesign QA

November 17, 2026. Draft branch only. No production deployment or merge.

## Implemented

- Rebuilt navigation, hero, page sequence and featured shopping presentation. Evergreen and warm paper, large serif typography, layered authentic photographs, open product layouts and purposeful space replace decorative gift-tag cards, garlands, snow and ticker.
- Independent desktop hero photograph depth uses native scroll timelines. Pointer image enlargement is restrained. Touch keeps a separate composition. Reduced motion disables animations and smooth scrolling.
- Added a prominent NutriMill Impact and Grand Teton Ancient Grains spread. Existing Impact link `https://collabs.shop/vavywo` resolves through ACADEMY26 to the correct NutriMill product with existing attribution intact. No new tracking parameter was invented. Grand Teton links to its official einkorn selection and displays the approved first-order code and expiry. No new Classic product details, launch copy or assets were added.
- Preserved catalog search, category and reference-budget filters, Gift Finder, saved gifts, resource pages, affiliate disclosures, analytics and giveaway interface. No signup or payment form submitted.
- Removed the broken host-only hero, video and Wire Monkey banner. Removed the featured Classic/Bosch entries with host-only art and conflicting old offer data. Other product records and static shopping routes remain available.
- Replaced failed Lodge, MyWeigh and OXO image links with local official photographs. Bread Bosses Banneton is withheld because its image URL fails and an authentic usable replacement was not recovered. Thermapen ONE is withheld because the old image explicitly depicts a Mk4 and the Amazon destination/product match remains unverified. No imitation image was substituted.
- Repaired the existing root dependency lock mismatch. Added a reproducible browser validation script with playwright-core. Fixed existing lint errors and excluded generated Next build files from source linting.

## Evidence

Local Chromium checks passed at 360, 390, 430, 768 and 1440 widths, without document overflow. All 86 expanded-page images decoded successfully, with zero failed images or product fallbacks. Search, combined category and budget filters, saved gifts across reload, copying Grand Teton’s code, all four Gift Finder questions and results, dialog escape, and reduced motion were exercised. No browser page errors occurred. The final exact counts are in the local `qa/holiday/report.json`; screenshots of desktop and phone compositions are included in `docs/screenshots/`.

`npm run build` checks both Vite and the existing Next static export, catalog metadata, all 17 rendered facet counts, schema, canonicals, sitemap and merged output. `npm run lint` passes with zero errors and 14 existing warnings. Catalog tests withhold unsupported Amazon prices and ratings. Budget filters continue to use the explicitly labeled August 25 reference prices; they are not a promise of current prices.

HTTP destination checks: NutriMill Impact final page, Grand Teton einkorn, Henry’s grain guide and grain challenge all return 200. NutriMill’s first automated HEAD request was rate-limited after the correct redirects; a subsequent GET reached the correct product with 200. Code copying was tested; checkout discount application and affiliate-account ownership were not certified.

## Authentic asset sources

- Grand Teton product page: https://www.ancientgrains.com/einkorn
  Image: https://www.ancientgrains.com/wp-content/uploads/Einkorn-1200x1200-1-730x730.webp
- Lodge product page: https://www.lodgecastiron.com/products/6-quart-enamel-dutch-oven
  Image: https://www.lodgecastiron.com/cdn/shop/files/EC6D43_04e47d28-8ac5-4da4-9406-23d001b7ce80.jpg?v=1772557642&width=800
- Manufacturer/distributor MyWeigh page: https://hbitech.com/product/kd-8000/
  Image: https://hbitech.com/wp-content/uploads/2018/06/My-Weigh-KD-8000.jpg
- OXO product page: https://www.oxo.com/multi-purpose-scraper-chopper-820-0.html
  Image: https://www.oxo.com/media/catalog/product/cache/9526abe58a368536f220458005aa0000/o/x/oxo_multi-purpose-scraper-chopper_pdp_00_main.jpg
- NutriMill Impact, Challenger, Goldie, Holland Bowl Mill and remaining local photography were retained from the existing repository. No generated product or logo images.

## Remaining limitations / launch checks

The three supplied Library references resolved and preparation returned signed transfers. The supported current Python transfer helper downloaded but failed during metadata application with `AttributeError: module 'os' has no attribute 'setxattr'` on Windows for all three. It did not complete materialization. Their actual pixels could not be inspected; no guessed file paths or substitute screenshots were used. Live old-preview and new-page inspection continued independently.

Real iPhone/touch-device behavior has not been tested. Chromium responsive checks do not establish physical-device performance. Older browsers without scroll timelines retain the static layout. The inherited main bundle remains over Vite’s 500 kB warning threshold. Existing secondary-site dependency audit findings and Fast Refresh warnings remain; dependency upgrades beyond the lock repair are outside this redesign.

The prior launch audit’s merchant ownership/attribution questions and giveaway-policy checks remain open. Existing giveaway forms were opened only where needed for visual inspection and never submitted. Bread Bosses needs a verified image; Thermapen ONE needs matching official art and a verified destination before restoration. Current merchant prices, actual checkout-code acceptance, and all unchanged affiliate destinations require a final launch review. No private correspondence is stored in this source or report.
