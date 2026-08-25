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
  slug: string;
  name: string;
  img: string;
  price: string;
  url: string;
  desc: string;
  note: string;
};

export const krusticProducts: KrusticProduct[] = [
  { slug: "bakers-bundle", name: "Baker's Bundle", img: bundle, price: "$349.99", url: `https://www.krustic.com/products/prime-bakers-bundle${R}`, desc: "The complete kit: Dutch oven, banneton, starter, transfer mat. Everything a new baker needs.", note: "Everything a new baker needs in one box. My default answer when someone says they want to start." },
  { slug: "enameled-round", name: "Enameled Dutch Oven — Round", img: enamelRound, price: "$149.99", url: `https://www.krustic.com/products/freeform-dutch-oven-round-enameled${R}`, desc: "Enameled cast iron built for boules. Even heat, easy release, gorgeous color.", note: "No seasoning, no babysitting. Even heat, and the loaf lets go." },
  { slug: "enameled-oval", name: "Enameled Dutch Oven — Oval", img: enamelOval, price: "$159.98", url: `https://www.krustic.com/products/freeform-dutch-oven-oval-enameled${R}`, desc: "Same enameled quality, shaped for batards. Room for two loaves side by side.", note: "Two batards side by side. A round pot wastes that space." },
  { slug: "cast-iron-round", name: "Cast Iron Dutch Oven — Round", img: castRound, price: "$149.99", url: `https://www.krustic.com/products/the-freeform-dutch-oven-cast-iron-round${R}`, desc: "Traditional bare cast iron. Seasons beautifully, holds heat like nothing else.", note: "Bare iron that seasons into something better every bake." },
  { slug: "cast-iron-oval", name: "Cast Iron Dutch Oven — Oval", img: castOval, price: "$159.98", url: `https://www.krustic.com/products/the-freeform-dutch-oven-cast-iron-oval${R}`, desc: "Oval bare cast iron for long loaves. A workhorse for the serious baker.", note: "The long-loaf workhorse. Back to back bakes, no complaints." },
  { slug: "banneton-oval", name: "Wood Pulp Banneton — Oval", img: banneton, price: "$44.99", url: `https://www.krustic.com/products/the-wood-pulp-banneton-oval${R}`, desc: "Sustainable wood pulp proofing basket. Leaves clean spiral patterns on the crust.", note: "Clean spirals on a batard, none of the flour caking you get from cane." },
  { slug: "transfer-mat", name: "Silicone Transfer Mat", img: mat, price: "$19.99", url: `https://www.krustic.com/products/silicone-transfer-mat-round${R}`, desc: "Move dough from bench to Dutch oven without burns or dropped loaves.", note: "The drop-proof way to load a screaming hot pot." },
  { slug: "dual-flour-dehydrated-starter", name: "Dual-Flour Dehydrated Starter", img: starter, price: "$19.99", url: `https://www.krustic.com/products/dual-flour-dehydrated-starter${R}`, desc: "A hardy starter that wakes up in days, built on two flours for balanced fermentation.", note: "A backup culture in a jar. Cheap insurance against losing your starter." },
];
