// Rotating holiday promo campaigns. Each campaign owns its own identity,
// artwork pair, and affiliate URL. Add a campaign here and the popup system
// picks it up — no component changes needed.
import boschA from "@/assets/promo/bosch-promo-a.png.asset.json";
import boschB from "@/assets/promo/bosch-promo-b.png.asset.json";
import millA from "@/assets/promo/nutrimill-promo-a.png.asset.json";
import millB from "@/assets/promo/nutrimill-promo-b.png.asset.json";

export type PromoCampaign = {
  id: "bosch-universal-plus-mixer" | "nutrimill-classic-grain-mill";
  campaignName: string;
  productName: string;
  regularPrice: number;
  salePrice: number;
  discountLabel: string;
  code: string;
  url: string;
  images: [string, string];
  alt: string;
};

// Rotation order: Bosch first, then NutriMill, alternating across visits.
export const PROMO_CAMPAIGNS: PromoCampaign[] = [
  {
    id: "bosch-universal-plus-mixer",
    campaignName: "Bosch Universal Plus Mixer Holiday Offer",
    productName: "Bosch Universal Plus Mixer",
    regularPrice: 499.0,
    salePrice: 399.2,
    discountLabel: "20% OFF",
    code: "ACADEMY26",
    url: "https://collabs.shop/igygnm",
    images: [boschA.url, boschB.url],
    alt: "Bosch Universal Plus Mixer holiday offer, 20% off with code ACADEMY26",
  },
  {
    id: "nutrimill-classic-grain-mill",
    campaignName: "NutriMill Classic Grain Mill Holiday Offer",
    productName: "NutriMill Classic Grain Mill",
    regularPrice: 349.97,
    salePrice: 279.98,
    discountLabel: "20% OFF",
    code: "ACADEMY26",
    url: "https://collabs.shop/qn3koy",
    images: [millA.url, millB.url],
    alt: "NutriMill Classic Grain Mill holiday offer, 20% off with code ACADEMY26",
  },
];
