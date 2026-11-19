import seasonalTools from "./seasonalAmazon.json";
import matfer from "@/assets/holiday/amazon-matfer-baking-mat.jpeg";
import ankarsrum from "@/assets/holiday/amazon-ankarsrum-mixer.jpeg";
import emile from "@/assets/holiday/amazon-emile-henry-cloche.jpeg";
import fibrament from "@/assets/holiday/amazon-fibrament-stone.jpeg";
import lavatools from "@/assets/holiday/amazon-lavatools-thermometer.jpeg";
import staub from "@/assets/holiday/amazon-staub-cocotte.jpeg";
import lecreuset from "@/assets/holiday/amazon-le-creuset.jpeg";
import balljars from "@/assets/holiday/amazon-ball-jars.jpeg";
import sling from "@/assets/holiday/amazon-bread-sling.jpeg";
import feather from "@/assets/holiday/amazon-feather-blades.jpeg";
import kitchenaid from "@/assets/holiday/amazon-kitchenaid-mixer.png";
import rack from "@/assets/holiday/amazon-checkered-chef-rack.jpg";
import whisk from "@/assets/holiday/amazon-brod-taylor-whisk.jpg";

const TAG = "55024a-20";
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
  { name: "Lodge 6qt Dutch Oven", category: "Dutch Oven", img: "/product-images/lodge-6qt-dutch-oven.jpg", url: link("B000N501BK"), note: "The pot I point beginners at. Real sourdough without the three hundred dollar spend." },
  { name: "MyWeigh KD-8000 Scale", category: "Scale", img: "/product-images/myweigh-kd8000.jpg", url: link("B00VEKX35Y"), note: "Baker's percentages on the display, and it holds a full bowl of dough without flinching." },
  { name: "Baking Steel", category: "Baking Steel", img: "https://m.media-amazon.com/images/I/81T2o6K4fLL.jpg", url: link("B00N205G22"), note: "Fixes a pale bottom crust permanently. More heat from below than any stone I've tried." },
  { name: "OXO Bench Scraper", category: "Bench Tool", img: "/product-images/oxo-bench-scraper.jpg", url: link("B00004OCNJ"), note: "The first tool I'd buy today. Cheap, and it earns its drawer space forever." },
  seasonalTools.thermometer,
  seasonalTools.cambro,
  { name: "Checkered Chef Cooling Rack", category: "Cooling Rack", img: rack, url: link("B06Y5F3NGY"), note: "Let air circulate underneath your loaf as it cools." },
  { name: "KitchenAid Artisan 5qt Stand Mixer", category: "Stand Mixer", img: kitchenaid, url: link("B00005UP2P"), note: "For cake bakers drifting into bread. It handles dough right up until they catch the bug properly." },
  { name: "Feather Razor Blades (100 pack)", category: "Scoring", img: feather, url: link("B004RWTQTS"), note: "Scoring blades by the hundred. A fresh blade every loaf, no more dragging." },
  { name: "Silicone Bread Sling", category: "Sling", img: sling, url: link("B0CNRFQKB9"), note: "Use the long handles to lower your shaped loaf into the Dutch oven." },
  { name: "Ball Wide Mouth Mason Jars (12)", category: "Starter Jar", img: balljars, url: link("B07LCVB2H2"), note: "Starter jars without boutique pricing. Buy the dozen, give half away." },
  { name: "Le Creuset Signature Dutch Oven 5.5qt", category: "Dutch Oven", img: lecreuset, url: link("B0076NOGPY"), note: "The pot that's as good on the stove as it is for bread, and on the counter for decades." },
  { name: "Staub Cast Iron Round Cocotte 5.5qt", category: "Dutch Oven", img: staub, url: link("B000AXQADI"), note: "A heavy lid that seals tight, with a matte interior that browns better than enamel." },
  { name: "Lavatools Javelin PRO Classic", category: "Thermometer", img: lavatools, url: link("B01F59K0KA"), note: "Fast, accurate, readable at a glance, without the flagship price tag." },
  { name: "FibraMent 20 × 15-inch Baking Stone", category: "Baking Stone", img: fibrament, url: link("B0D94X5639"), note: "Measure your oven rack for this 20 × 15-inch rectangular stone." },
  { name: "Emile Henry Bread Cloche", category: "Cloche", img: emile, url: link("B00WRIJGQC"), note: "A lighter way to trap steam, for when the Dutch oven lift is too much." },
  { name: "Ankarsrum Original Stand Mixer", category: "Stand Mixer", img: ankarsrum, url: link("B07KQL5242"), note: "The mixer actually built for dough. It doesn't walk across the counter and it doesn't strain." },
  { name: "Matfer Bourgeat Silicone Baking Mat", category: "Baking Mat", img: matfer, url: link("B00005AXJ9"), note: "Retire the parchment habit. This survives daily commercial use." },
];
