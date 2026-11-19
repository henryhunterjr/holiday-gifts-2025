import seasonalTools from "./seasonalAmazon.json";
import kitchenaid from "@/assets/holiday/amazon-kitchenaid-mixer.png";

const TAG = "onamz55024a-20";
const link = (asin: string) => `https://www.amazon.com/dp/${asin}?tag=${TAG}`;

export type AmazonProduct = {
  name: string;
  category: string;
  img: string;
  note: string;
  detail?: string;
  url: string;
};

export const amazonProducts: AmazonProduct[] = [
  { name: "MyWeigh KD-8000 Scale", category: "Scale", img: "/product-images/myweigh-kd8000.jpg", url: link("B00VEKX35Y"), note: "Baker's percentages on the display, and it holds a full bowl of dough without flinching." },
  { name: "Baking Steel", category: "Baking Steel", img: "https://m.media-amazon.com/images/I/81T2o6K4fLL.jpg", url: link("B00N205G22"), note: "Fixes a pale bottom crust permanently. More heat from below than any stone I've tried." },
  { name: "OXO Bench Scraper", category: "Bench Tool", img: "/product-images/oxo-bench-scraper.jpg", url: link("B00004OCNJ"), note: "The first tool I'd buy today. Cheap, and it earns its drawer space forever." },
  seasonalTools.thermometer,
  seasonalTools.cambro,
  { name: "KitchenAid Artisan 5qt Stand Mixer", category: "Stand Mixer", img: kitchenaid, url: link("B00005UP2P"), note: "For cake bakers drifting into bread. It handles dough right up until they catch the bug properly." },
];
