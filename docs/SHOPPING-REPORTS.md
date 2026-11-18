# Shopping guide review, November 18, 2026

The preview has seven maker catalogs and 52 products. Prices come from Henry's supplied November 17–18 research package, not a live feed. Recheck before publishing. Soft White Wheat has no supplied photo and is explicitly marked as such. ModKitchn uses a text brand heading because no standalone logo was supplied.

Partner catalogs use one saved-gifts storage key shared with the homepage. This is a device-local gift list, not a combined checkout. Retailer links open new tabs. Each retailer handles payment, tax, shipping, returns, stock and the final price. Cross-retailer checkout requires commercial and technical integrations with the partners.

## Analytics activation is blocked

The available Supabase connection cannot access project `wrshjbmfcnkceezqkavt`. No migration has been applied and no new live analytics collection is active. Never present sample numbers as real traffic.

To activate using authorized project access:

1. Apply `supabase/migrations/20261118180000_guide_analytics.sql` to the existing guide database after reviewing it. It adds an event table with RLS and no direct anonymous/authenticated table grants. Only the bounded ingestion function accepts events. The aggregate reporting function checks the existing admin role on the server.
2. Confirm Henry's existing account has the admin role. Do not grant admin automatically to signups.
3. Set `VITE_GUIDE_ANALYTICS_ENABLED=true` in the site's Vercel environment and rebuild. Keep existing VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY. Never supply a service-role key to the browser.
4. Verify ingestion with a test preview visit, verify anonymous and non-admin report access is rejected, then verify admin reports. Preview traffic is separated from production.

Reports cover anonymous session counts, page views, product impressions, gift saves, partner clicks, sources, UTM campaigns and mobile/desktop use for 7, 30 or 90 days. No email addresses, names, IP addresses, full referring URLs, checkout details or payment information are collected by the new client code. DNT and Global Privacy Control suppress collection. Session counts are not unique people; browser storage and blockers affect counts. Client-originated events are directional analytics, not fraud-proof sales records. Define retention and add server-side bot controls before large campaigns. Purchases and commissions require affiliate dashboard reconciliation or partner conversion integrations.

## Validation

Full build and existing catalog/schema/render checks passed. TypeScript check passed. Browser UI checks verified cross-maker saving, persistence after reload, removal, logo loading at phone width, and redirection to admin sign-in. Database integration and authenticated report checks remain blocked by project access.
