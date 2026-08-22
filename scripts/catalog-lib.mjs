// Shared helpers for build-catalog.mjs and test-catalog.mjs.
// Rules documented in RECONCILIATION.md. Never guess: null is a valid answer.

export const REL_AFFILIATE = "nofollow sponsored noopener";

// Query parameters that only exist on tracked affiliate links in this catalog.
const AFFILIATE_PARAMS = ["tag", "rfsn", "wpam_id", "ref", "dt_id"];

// Links whose affiliate nature was verified by following redirects on 2026-08-21
// or which carry no other signal:
// - collabs.shop/*      Shopify Collabs shortlinks, land with dt_id= attribution
// - bit.ly/Sourhouse    lands on go.referralcandy.com share link
// - brodandtaylor.com/henrysbreadkitchen lands with dt_id= attribution
const KNOWN_AFFILIATE_PREFIXES = [
  "https://collabs.shop/",
  "https://bit.ly/Sourhouse",
  "https://brodandtaylor.com/henrysbreadkitchen",
];

// Discount-code links carrying Henry's own codes (e.g. modkitchn.com/discount/BAKINGGREATBREAD10).
const AFFILIATE_DISCOUNT_HOSTS = ["modkitchn.com"];

export function isAffiliateUrl(url) {
  if (typeof url !== "string" || !url.trim()) return false;
  let u;
  try {
    u = new URL(url);
  } catch {
    return false;
  }
  const host = u.hostname.replace(/^www\./, "");
  if (u.search && [...u.searchParams.keys()].some((k) => AFFILIATE_PARAMS.includes(k))) return true;
  if (KNOWN_AFFILIATE_PREFIXES.some((p) => url.startsWith(p))) return true;
  if (AFFILIATE_DISCOUNT_HOSTS.includes(host) && u.pathname.startsWith("/discount/")) return true;
  return false;
}

// "$159.98" -> 159.98, 89 -> 89, "1,299" -> 1299. Anything else -> null.
export function parsePrice(v) {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v !== "string") return null;
  const cleaned = v.trim().replace(/^\$/, "").replace(/,/g, "");
  if (!/^\d+(\.\d+)?$/.test(cleaned)) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export function priceBandFor(price) {
  if (typeof price !== "number") return null;
  if (price < 25) return "under-25";
  if (price < 75) return "25-75";
  if (price < 150) return "75-150";
  return "splurge";
}

// Alt text strictly from name and brand already present in the record.
export function deriveAlt(r) {
  const name = typeof r.name === "string" ? r.name.trim() : "";
  const brand = typeof r.brand === "string" ? r.brand.trim() : "";
  if (!name) return null;
  return brand ? `${name} by ${brand}` : name;
}

export function enrichRecord(r) {
  const price = parsePrice(r.price);
  const cat = typeof r.cat === "string" ? r.cat.trim() : "";
  return {
    ...r,
    price,
    currency: price === null ? null : "USD",
    rel: isAffiliateUrl(r.url) ? REL_AFFILIATE : null,
    alt: deriveAlt(r),
    categories: cat ? [cat] : [],
    priceBand: priceBandFor(price),
    priceCheckedAt: null,
    audiences: [],
    concierge: { solves: [] },
  };
}
