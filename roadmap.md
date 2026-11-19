# Holiday guide launch fixes

- [x] Restore admin role to Henry’s existing confirmed production account only.
- [x] Activate existing admin-only reporting and fix detached report call.
- [x] Verify Henry and ordinary-account report and giveaway permissions in preview and directly against production permissions.
- [ ] Check fresh confirmation email destination and hosted template: blocked by owner-only redirect settings; hosted template not available to read with current tools.
- [ ] Owner: update Auth settings → Advanced Site URL and Redirect URLs.
- [ ] Owner: sync/re-check latest main in Project settings → Git before publishing.
- [ ] Publish legacy redirect after main-branch sync is confirmed, then verify homepage and section redirects.
# Launch work order (Nov 19): .com domain, Brød & Taylor page
- [x] Canonicals and schema moved to gifts.bakinggreatbread.com sitewide; admin and saved gifts noindex
- [x] Save buttons in page HTML, saved counter highlight, shareable wish list link
- [x] Admin link removed from footers; About, Privacy, Contact added
- [x] Affiliate note above the fold; Brand — Category headings on all maker pages
- [x] Brød & Taylor copy, badges, Best for lines, 2 new bannetons, single price line, accordions only for variants
- [x] Curator note, Recipe Pantry banner moved below grid, budget pills, warm card styling, fast first 2 images
- [x] FAQ plus CollectionPage, Breadcrumb, ItemList, Organization, Person schema
- [ ] Owner: add https://gifts.bakinggreatbread.com/ as Site URL and /admin/analytics/ redirect in Auth settings
- [x] Owner: point gifts.bakinggreatbread.blog at .com with a permanent redirect at the domain host (verified live: 308 to gifts.bakinggreatbread.com)
# Improvements (Nov 19)
- [x] Curator note, badges, Best for lines and FAQ on all seven maker pages
- [x] Weekly price check (scripts/check-prices.mjs + GitHub Action opens an issue on changes)
- [x] One copy of maker pages: static HTML only; app route hands off
- [ ] Owner: submit https://gifts.bakinggreatbread.com/sitemap.xml in Google Search Console (needs owner's Google account)
- [x] Sitemap cleaned before submission: dropped 404 parameterized routes, the 2025 redirect page and noindex saved-gifts; every entry now matches the address its page names as canonical; rules enforced in scripts/check-dist.mjs
