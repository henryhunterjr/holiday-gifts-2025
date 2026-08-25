// Henry's Top 10 — data driven so positions can be swapped without touching
// the component. Positions 1-6 come from products.json (top6 slugs); the
// entries below fill positions 7-10.
import boschImg from "@/assets/promo/bosch-universal-plus-mixer.webp.asset.json";
import millImg from "@/assets/promo/nutrimill-classic-grain-mill.webp.asset.json";

export type TopPick = {
  id: string;
  name: string;
  img: string;
  url: string;
  /** Regular (pre-discount) price */
  price: number;
  /** Price after the holiday discount, when one applies */
  salePrice?: number;
  discountLabel?: string;
  code?: string;
  desc?: string;
  cta?: string;
  seller?: string;
  placeholder?: boolean;
  placeholderLabel?: string;
};

export const EXTRA_TOP_PICKS: TopPick[] = [
  {
    id: "bosch-universal-plus-mixer",
    name: "Bosch Universal Plus Mixer",
    img: boschImg.url,
    url: "https://collabs.shop/igygnm",
    price: 499.0,
    salePrice: 399.2,
    discountLabel: "20% OFF",
    code: "ACADEMY26",
    desc: "A serious bread mixer built for everything from a single loaf to large batches of dough. Powerful bottom-drive motor, 6.5-quart bowl, four speeds plus pulse, and capacity for up to 14 pounds of dough.",
    cta: "Shop Bosch Universal Plus",
  },
  {
    id: "nutrimill-classic-grain-mill",
    name: "NutriMill Classic Grain Mill",
    img: millImg.url,
    url: "https://collabs.shop/qn3koy",
    price: 349.97,
    salePrice: 279.98,
    discountLabel: "20% OFF",
    code: "ACADEMY26",
    seller: "Shenandoah Homestead Supply",
    desc: "Mill fresh flour at home from wheat, rye, spelt, rice, corn, beans and more. Fine-to-coarse adjustment, up to 20 cups of flour at a time, powerful impact milling and a limited lifetime warranty.",
    cta: "Shop NutriMill Classic",
  },
  {
    id: "pick-9",
    name: "Henry's Pick #9",
    placeholderLabel: "Coming Soon",
    placeholder: true,
    img: "",
    url: "",
    price: 0,
  },
  {
    id: "pick-10",
    name: "Henry's Pick #10",
    placeholderLabel: "Coming Soon",
    placeholder: true,
    img: "",
    url: "",
    price: 0,
  },
];
