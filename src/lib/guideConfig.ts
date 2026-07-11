// Central config for the Holiday Gift Guide.
// Update these values here rather than editing components directly.

export const PRICES_LAST_CHECKED = "November 15, 2026";

// Products whose destination URL is broken or unverified. Hidden from the live
// guide until a valid URL is supplied. Keys are product slugs.
export const DISABLED_PRODUCT_SLUGS: ReadonlySet<string> = new Set([
  // 404 as of 2026 launch audit
  "french-press", // Water Kettle & French Press — collabs.shop/b8bht0
]);

// Krustic product URL slugs (from `krustic.ts`) that are unverified or 404.
export const DISABLED_KRUSTIC_SLUGS: ReadonlySet<string> = new Set([
  "dual-flour-dehydrated-starter",
]);

// Free resource cards are hidden until real download URLs are provided.
export const FREE_RESOURCES_ENABLED = false;

// Price bands. Single source of truth for both the Gift Finder and catalog.
// Rules:
//   Under $25    : price < 25
//   $25–75       : 25 <= price <= 75
//   $75–150      : 75 < price <= 150
//   Splurge $150+: price > 150
export type PriceBand = {
  label: "Under $25" | "$25–75" | "$75–150" | "Splurge $150+";
  test: (p: number) => boolean;
};

export const PRICE_BANDS: PriceBand[] = [
  { label: "Under $25", test: (p) => p < 25 },
  { label: "$25–75", test: (p) => p >= 25 && p <= 75 },
  { label: "$75–150", test: (p) => p > 75 && p <= 150 },
  { label: "Splurge $150+", test: (p) => p > 150 },
];

export const bandByLabel = (label: string | null) =>
  label ? PRICE_BANDS.find((b) => b.label === label) : undefined;

// Guard for rendering — treat "#" or empty as placeholder.
export const isValidUrl = (url: string | undefined | null): boolean => {
  if (!url) return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed === "#") return false;
  return /^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith("/");
};
