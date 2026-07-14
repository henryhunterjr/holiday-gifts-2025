
## 1. Music button in the header
- Add a **Music** button to the sticky header, immediately left of the "N days to Christmas" pill, with a small 🎄 emoji.
- Clicking toggles a hidden YouTube iframe (video `N91_IHbofhs`) that plays the track softly in the background (`autoplay=1&loop=1&playlist=N91_IHbofhs`, no controls, 1×1 offscreen). Second click stops it.
- ARIA-pressed on the button, `sr-only` label, respects "prefers-reduced-motion" (still allowed — user chose to play).
- Note: browsers require a user gesture to autoplay audio; the click itself is that gesture, so it works.

## 2. Give Bread Instead — hanging gift tag
- Upload the "Give Bread Instead" transparent gift tag PNG as a Lovable asset.
- Place it in the **top of the left column** of the Give Bread Instead section, above the eyebrow, rotated a subtle `-6deg` with a small twine line, styled to look like it's hanging off a package. Mobile: stays visible but sized down.

## 3. "Browse all baking gifts" section delineation
- Give the whole `Browse all baking gifts` section a subtly different background (`bg-parchment/40`) with a thin top border so it separates cleanly from the sticky filter bar and jump nav above it. No layout changes.

## 4. From Oven to Market banner cutoff
- The banner image is being cropped top/bottom by `object-cover` at fixed heights.
- Fix: switch to `object-contain` on a background matching the section, and let the natural aspect ratio show. Heights become min-heights so nothing clips.

## 5. Giveaway: Free Gift Tag Set (weekly winner) — needs backend
Enable **Lovable Cloud** and build:

**Database**
- `giveaway_entries` table: `id`, `first_name`, `last_name`, `email` (unique per week), `is_academy_member` (bool), `is_fotm_member` (bool), `baker_status` (enum: `baking_for_self`, `thinking_of_selling`, `has_cottage_business`, `other`), `baker_status_other` (text, nullable), `consent` (bool, required true), `created_at`.
- `app_role` enum + `user_roles` table + `has_role()` security-definer function (per platform rules).
- RLS: `anon` + `authenticated` can INSERT; only admins can SELECT.

**Third free-gift card**
- Add "Free Gift Tag Set" card to the Free gifts section (alongside Starter Guide + Recipe Collection).
- Card CTA opens a modal styled with the Give Bread Instead circle logo, capturing: first name, last name, email, academy member (checkbox), FOTM member (checkbox), baker status (radio group with 4 options + free-text if "Other"), consent (required checkbox with the exact copy you gave).
- Zod validation, insert into `giveaway_entries`, success toast, email confirmation not built (out of scope unless you add it later).

**Admin dashboard**
- New route `/admin/giveaway` (not linked in nav) — requires signed-in user with `admin` role.
- Table view of all entries, filterable by week (Nov 5 – Dec 25, 2026), CSV export button, "Pick a random winner" button that selects from that week's entries.
- Henry gets the `admin` role assigned manually via a one-time SQL insert after he signs up (I'll provide the snippet).

## Order of operations
1. Enable Cloud.
2. Push migration (table + roles + RLS + grants).
3. Ship items 1–4 (frontend-only) and the giveaway form + admin dashboard in the same build.
4. Publish and hand back the URL plus the SQL snippet to make Henry an admin.

Anything you want to change before I start?
