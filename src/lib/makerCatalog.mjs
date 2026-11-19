const makerCategories = {
  "wire-monkey": "Scoring & Shaping",
  "brod-and-taylor": "Bake Day",
  "sour-house": "Starter Care",
  "holland-bowl": "Wood & Serving",
  nutrimill: "Milling & Flour",
  "grand-teton": "Milling & Flour",
  modkitchn: "Storage & Gifting",
};

const itemCategories = {
  "sourdough-home": "Starter Care",
  "sourdough-starter-jar": "Starter Care",
  "banneton-boule-set-of-2": "Scoring & Shaping",
  "bread-lame": "Scoring & Shaping",
  "folding-proofer": "Proofing & Temp",
};

export function makerGifts(makers, curated) {
  const existing = new Set(curated.map(item => item.url));
  return makers.flatMap(maker => maker.items
    .filter(item => item.availability !== "Coming soon" && !existing.has(item.url))
    .map(item => ({
      slug: `${maker.id}:${item.slug}`,
      name: item.name,
      brand: maker.brand,
      cat: itemCategories[item.slug] ?? makerCategories[maker.id],
      img: item.img,
      url: item.url,
      desc: item.desc,
      price: Number(item.priceLabel.match(/\d[\d,]*(?:\.\d+)?/)?.[0].replaceAll(",", "")),
      priceLabel: item.priceLabel,
      priceChecked: item.priceChecked,
    }))
    .filter(item => Number.isFinite(item.price)));
}
