// Shared helpers for build-catalog.mjs and test-catalog.mjs.
// Rules documented in RECONCILIATION.md. Never guess: null is a valid answer.

export const REL_AFFILIATE = "nofollow sponsored noopener";
export const TARGET_AFFILIATE = "_blank";

// Query parameters that only exist on tracked affiliate links in this catalog.
// Deliberately excludes the generic "ref": see AFFILIATE_REF_VALUES below.
const AFFILIATE_PARAMS = ["tag", "rfsn", "wpam_id", "dt_id"];

// "ref=" is the most generic query param on the web, so it only counts as an
// affiliate signal when it carries one of these exact partner attribution
// values on the expected host (verified in the catalog, 2026-08-21).
const AFFILIATE_REF_VALUES = new Map([
  ["sourhouse.co", "BAKINGGREATBREAD"],
  ["challengerbreadware.com", "henryhunterjr"],
]);

// Links whose affiliate nature was verified by following redirects on
// 2026-08-21, matched on hostname + path prefix (protocol- and www.-safe):
// - collabs.shop/*      Shopify Collabs shortlinks, land with dt_id= attribution
// - bit.ly/Sourhouse    lands on go.referralcandy.com share link
// - brodandtaylor.com/henrysbreadkitchen lands with dt_id= attribution
const KNOWN_AFFILIATE_PREFIXES = [
  { host: "collabs.shop", path: "/" },
  { host: "bit.ly", path: "/Sourhouse" },
  { host: "brodandtaylor.com", path: "/henrysbreadkitchen" },
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
  const host = u.hostname.replace(/^www\./, "").toLowerCase();
  if ([...u.searchParams.keys()].some((k) => AFFILIATE_PARAMS.includes(k))) return true;
  const refValue = AFFILIATE_REF_VALUES.get(host);
  if (refValue !== undefined && u.searchParams.get("ref") === refValue) return true;
  if (
    KNOWN_AFFILIATE_PREFIXES.some(
      (p) =>
        host === p.host &&
        (p.path === "/" || u.pathname === p.path || u.pathname.startsWith(p.path.endsWith("/") ? p.path : `${p.path}/`))
    )
  )
    return true;
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
  const affiliate = isAffiliateUrl(r.url);
  return {
    ...r,
    price,
    currency: price === null ? null : "USD",
    rel: affiliate ? REL_AFFILIATE : null,
    target: affiliate ? TARGET_AFFILIATE : null,
    alt: deriveAlt(r),
    categories: cat ? [cat] : [],
    priceBand: priceBandFor(price),
    priceFrom: false,
    priceCheckedAt: null,
    audiences: [],
    concierge: { solves: [] },
  };
}
