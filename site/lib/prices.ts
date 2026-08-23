import { readCatalog } from "./catalog";

// The brief's rule: priceCheckedAt is data, the page renders the max across
// the catalog, no date is ever hardcoded. Today every record is null, so this
// returns null and pages render nothing. The day real dates land, the max
// appears with no further changes.
export function maxPriceCheckedAt(): string | null {
  const { products } = readCatalog();
  const dates = products
    .map((p) => p.priceCheckedAt)
    .filter((d): d is string => typeof d === "string" && d.trim() !== "")
    .sort(); // ISO-style dates sort lexically
  return dates.length > 0 ? dates[dates.length - 1] : null;
}
