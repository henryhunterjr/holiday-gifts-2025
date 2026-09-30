// Rotating holiday promo campaigns. Each campaign owns its own identity,
// artwork pair, and affiliate URL. Add a campaign here and the popup system
// picks it up — no component changes needed.
import boschA from "@/assets/promo/bosch-promo-a.png.asset.json";
import boschB from "@/assets/promo/bosch-promo-b.png.asset.json";
import millA from "@/assets/promo/nutrimill-promo-a.png.asset.json";
import millB from "@/assets/promo/nutrimill-promo-b.png.asset.json";
import sourhouseGoldie from "@/assets/promo/sourhouse-goldie-promo.png.asset.json";
import wireMonkey from "@/assets/promo/wiremonkey-promo-2026.png.asset.json";

export type PromoCampaign = {
  id:
    | "bosch-universal-plus-mixer"
    | "nutrimill-classic-grain-mill"
    | "sourhouse-goldie"
    | "wire-monkey-lames";
  campaignName: string;
  productName: string;
  regularPrice?: number;
  salePrice?: number;
  discountLabel: string;
  code: string;
  url: string;
  images: [string, string];
  alt: string;
};

// Rotation order advances across visits while clicked campaigns stay suppressed.
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
    salePrice: 329.97,
    discountLabel: "$20 OFF",
    code: "ACADEMY26",
    url: "https://nutrimill.com/Academy26",
    images: [millA.url, millB.url],
    alt: "NutriMill Classic Grain Mill holiday offer, $20 off with code ACADEMY26",
  },
  {
    id: "sourhouse-goldie",
    campaignName: "Sourhouse Goldie Holiday Offer",
    productName: "Sourhouse Goldie",
    discountLabel: "10% OFF",
    code: "HBK26",
    url: "https://sourhouse.co/?ref=henryhunter",
    images: [sourhouseGoldie.url, sourhouseGoldie.url],
    alt: "Sourhouse Goldie starter warmer holiday offer, 10% off with code HBK26",
  },
  {
    id: "wire-monkey-lames",
    campaignName: "Wire Monkey Holiday Offer",
    productName: "Wire Monkey",
    discountLabel: "10% OFF",
    code: "HBK26",
    url: "https://wiremonkey.com/henryhunter",
    images: [wireMonkey.url, wireMonkey.url],
    alt: "Wire Monkey handcrafted wood scoring lames, 10% off with code HBK26",
  },
];
