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
import cambro from "@/assets/holiday/amazon-cambro-container.jpg";
import rack from "@/assets/holiday/amazon-checkered-chef-rack.jpg";
import whisk from "@/assets/holiday/amazon-brod-taylor-whisk.jpg";
import thermopop from "@/assets/holiday/amazon-thermopop.jpg";

const TAG = "onamz55024a-20";
const link = (asin: string) => `https://www.amazon.com/dp/${asin}?tag=${TAG}`;

export type AmazonProduct = {
  name: string;
  category: string;
  img: string;
  price: string;
  note: string;
  rating: number;
  url: string;
};

export const amazonProducts: AmazonProduct[] = [
  { name: "Lodge 6qt Dutch Oven", category: "Dutch Oven", img: "https://cdn.shoplightspeed.com/shops/633447/files/32303969/image.jpg", price: "$79.99", rating: 4.7, url: link("B000N4UX4Q"), note: "The pot I point beginners at. Real sourdough without the three hundred dollar spend." },
  { name: "Challenger Bread Pan", category: "Bread Pan", img: "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_4:3/at%2Fnews-culture%2F2020-02%2FChallenger%2520Bread%2520Pan_Family_hi-res-2", price: "$295", rating: 4.9, url: link("B07M6MF86P") },
  { name: "MyWeigh KD-8000 Scale", category: "Scale", img: "https://m.media-amazon.com/images/I/71xM2VXpPAL.jpg", price: "$39.95", rating: 4.8, url: link("B00VEKX35Y"), note: "Baker's percentages on the display, and it holds a full bowl of dough without flinching." },
  { name: "Bread Bosses Banneton", category: "Banneton", img: "https://m.media-amazon.com/images/I/81b7ZfPVQGL.jpg", price: "$16.95", rating: 4.7, url: link("B01GM4UZJI"), note: "The cheap way to find out whether a banneton is your thing." },
  { name: "Wire Monkey UFO Lame", category: "Scoring", img: "https://wiremonkey.com/cdn/shop/products/MG_0020_1445x.jpg?v=1573946504", price: "$35", rating: 4.9, url: link("B07KPTC1FN") },
  { name: "Thermapen ONE", category: "Thermometer", img: "https://cdn.coalwayohio.com/wp-content/uploads/2024/09/Thermapen-Mk4_generic-01.jpg", price: "$105", rating: 4.9, url: link("B084XZLB7W"), note: "The instant read the professionals argue about. Fast enough to end the guessing." },
  { name: "Baking Steel", category: "Baking Steel", img: "https://m.media-amazon.com/images/I/81T2o6K4fLL.jpg", price: "$119", rating: 4.8, url: link("B00N205G22"), note: "Fixes a pale bottom crust permanently. More heat from below than any stone I've tried." },
  { name: "OXO Bench Scraper", category: "Bench Tool", img: "https://m.media-amazon.com/images/I/71NIKz3Az2L.jpg", price: "$10.99", rating: 4.8, url: link("B00004OCNJ"), note: "The first tool I'd buy today. Cheap, and it earns its drawer space forever." },
  { name: "Brod & Taylor Dough Whisk", category: "Whisk", img: whisk, price: "$16.00", rating: 4.8, url: link("B0821K5RDJ") },
  { name: "ThermoWorks ThermoPop", category: "Thermometer", img: thermopop, price: "$34.00", rating: 4.7, url: link("B07MJSQR1F"), note: "Most of the Thermapen for a lot less money. Dough temp, sorted." },
  { name: "Cambro 6qt Container", category: "Container", img: cambro, price: "$17.29", rating: 4.8, url: link("B001NCDE74"), note: "Watch your bulk rise through the wall instead of lifting a towel to guess." },
  { name: "Checkered Chef Cooling Rack", category: "Cooling Rack", img: rack, price: "$12.95", rating: 4.7, url: link("B01N1YDLIG"), note: "Soggy bottoms are a rack problem. This one fits a half sheet pan." },
  { name: "KitchenAid Artisan 5qt Stand Mixer", category: "Stand Mixer", img: kitchenaid, price: "$449.99", rating: 4.8, url: link("B00005UP2P"), note: "For cake bakers drifting into bread. It handles dough right up until they catch the bug properly." },
  { name: "Feather Razor Blades (100 pack)", category: "Scoring", img: feather, price: "$18.50", rating: 4.8, url: link("B004LK3Y8W"), note: "Scoring blades by the hundred. A fresh blade every loaf, no more dragging." },
  { name: "Silicone Bread Sling", category: "Sling", img: sling, price: "$12.99", rating: 4.6, url: link("B07W4TKLR3"), note: "The cheapest safe way to lower a loaf into a hot pot." },
  { name: "Ball Wide Mouth Mason Jars (12)", category: "Starter Jar", img: balljars, price: "$18.99", rating: 4.8, url: link("B01N6QBJG0"), note: "Starter jars without boutique pricing. Buy the dozen, give half away." },
  { name: "Le Creuset Signature Dutch Oven 5.5qt", category: "Dutch Oven", img: lecreuset, price: "$369.95", rating: 4.8, url: link("B00076SGQE"), note: "The pot that's as good on the stove as it is for bread, and on the counter for decades." },
  { name: "Staub Cast Iron Round Cocotte 5.5qt", category: "Dutch Oven", img: staub, price: "$329.99", rating: 4.8, url: link("B000RUTDNA"), note: "A heavy lid that seals tight, with a matte interior that browns better than enamel." },
  { name: "Lavatools Javelin PRO Duo", category: "Thermometer", img: lavatools, price: "$54.99", rating: 4.7, url: link("B00GRFHXVQ"), note: "Fast, accurate, readable at a glance, without the flagship price tag." },
  { name: "FibraMent-D Baking Stone", category: "Baking Stone", img: fibrament, price: "$89.95", rating: 4.7, url: link("B005IF2B28"), note: "The stone that doesn't crack. Deck oven heat across the whole rack." },
  { name: "Emile Henry Bread Cloche", category: "Cloche", img: emile, price: "$89.95", rating: 4.6, url: link("B001CJNJBC"), note: "A lighter way to trap steam, for when the Dutch oven lift is too much." },
  { name: "Ankarsrum Original Stand Mixer", category: "Stand Mixer", img: ankarsrum, price: "$799.00", rating: 4.7, url: link("B0892SQPVQ"), note: "The mixer actually built for dough. It doesn't walk across the counter and it doesn't strain." },
  { name: "Matfer Bourgeat Silicone Baking Mat", category: "Baking Mat", img: matfer, price: "$32.00", rating: 4.8, url: link("B000WM0CQU"), note: "Retire the parchment habit. This survives daily commercial use." },
];
