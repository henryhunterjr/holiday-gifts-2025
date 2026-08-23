import { maxPriceCheckedAt } from "@/lib/prices";

// Renders nothing while every priceCheckedAt is null. The day real dates land,
// the max date appears here, from data.
export function PriceCheckedNote() {
  const date = maxPriceCheckedAt();
  if (!date) return null;
  return (
    <p className="checked">
      Prices last checked {date}.
    </p>
  );
}
