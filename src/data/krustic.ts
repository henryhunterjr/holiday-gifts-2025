import bundle from "@/assets/holiday/krustic-bakers-bundle.jpg";
import enamelRound from "@/assets/holiday/krustic-enamel-round.jpg";
import enamelOval from "@/assets/holiday/krustic-enamel-oval.jpeg";
import castRound from "@/assets/holiday/krustic-cast-iron-round.png";
import castOval from "@/assets/holiday/krustic-cast-iron-oval.jpeg";
import banneton from "@/assets/holiday/krustic-banneton-oval.jpeg";
import mat from "@/assets/holiday/krustic-transfer-mat.jpeg";
import starter from "@/assets/holiday/krustic-starter.webp";

const R = "?rfsn=8815980.edac31";

export type KrusticProduct = {
  name: string;
  img: string;
  price: string;
  url: string;
  desc: string;
};

export const krusticProducts: KrusticProduct[] = [
  { name: "Baker's Bundle", img: bundle, price: "$349.99", url: `https://www.krustic.com/products/prime-bakers-bundle${R}`, desc: "The complete kit: Dutch oven, banneton, starter, transfer mat. Everything a new baker needs." },
  { name: "Enameled Dutch Oven — Round", img: enamelRound, price: "$149.99", url: `https://www.krustic.com/products/freeform-dutch-oven-round-enameled${R}`, desc: "Enameled cast iron built for boules. Even heat, easy release, gorgeous color." },
  { name: "Enameled Dutch Oven — Oval", img: enamelOval, price: "$159.98", url: `https://www.krustic.com/products/freeform-dutch-oven-oval-enameled${R}`, desc: "Same enameled quality, shaped for batards. Room for two loaves side by side." },
  { name: "Cast Iron Dutch Oven — Round", img: castRound, price: "$149.99", url: `https://www.krustic.com/products/the-freeform-dutch-oven-cast-iron-round${R}`, desc: "Traditional bare cast iron. Seasons beautifully, holds heat like nothing else." },
  { name: "Cast Iron Dutch Oven — Oval", img: castOval, price: "$159.98", url: `https://www.krustic.com/products/the-freeform-dutch-oven-cast-iron-oval${R}`, desc: "Oval bare cast iron for long loaves. A workhorse for the serious baker." },
  { name: "Wood Pulp Banneton — Oval", img: banneton, price: "$44.99", url: `https://www.krustic.com/products/the-wood-pulp-banneton-oval${R}`, desc: "Sustainable wood pulp proofing basket. Leaves clean spiral patterns on the crust." },
  { name: "Silicone Transfer Mat", img: mat, price: "$19.99", url: `https://www.krustic.com/products/silicone-transfer-mat-round${R}`, desc: "Move dough from bench to Dutch oven without burns or dropped loaves." },
  { name: "Dual-Flour Dehydrated Starter", img: starter, price: "$19.99", url: `https://www.krustic.com/products/dual-flour-dehydrated-starter${R}`, desc: "A hardy starter that wakes up in days, built on two flours for balanced fermentation." },
];
