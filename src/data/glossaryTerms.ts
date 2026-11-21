// Crust & Crumb glossary term pages, checked against the glossary's sitemap
// (crust-and-crumb-tawny.vercel.app/sitemap.xml) on 2026-11-21.
// A book term links straight to its term page when the glossary has one.
// Terms with no page yet fall back to the glossary home, and the card says so.
export const GLOSSARY_BASE = "https://crust-and-crumb-tawny.vercel.app";

export const GLOSSARY_SLUGS: ReadonlySet<string> = new Set(["acetic-acid", "active-dry-yeast", "aged-flour", "aleurone-layer", "aliquot-jar", "all-purpose-flour", "amaranth", "amylase", "ancient-grain", "ascorbic-acid", "ash-content", "autolyse", "babka", "bagel", "baguette", "bakers-couche", "bakers-percentage", "baking-powder", "baking-soda", "baking-steel", "baking-stone", "banneton", "banneton-liner", "banneton-sticking", "barley", "bassinage", "batard", "belly", "bench-rest", "bench-scraper", "bialy", "biga", "blisters", "blowout", "bolted-flour", "bolting", "boule", "bowl-scraper", "braiding", "bran", "bran-sharpness", "bran-soaker", "bread-flour", "bread-knife", "bread-wheat", "brine", "brioche", "bruhstuck", "buckwheat", "bulk-fermentation", "bulk-rise-target", "buttermilk", "caramelization", "cast-iron-skillet", "challah", "ciabatta", "clear-flour", "cloche", "coil-fold", "cold-bulk", "cold-proof", "colomba", "combo-cooker", "cooling-rack", "cornmeal", "cracked-grain", "croissant", "cross-score", "crumb", "crust", "damaged-starch", "danish-dough-whisk", "degassing", "dense-crumb", "desired-dough-temperature", "detroit-style-pizza", "diastatic-malt", "digital-scale", "discard", "docking", "dough-container", "dough-sheeter", "durum-wheat", "dutch-oven", "ear", "egg-wash", "einkorn", "elasticity", "emmer", "endosperm", "english-muffin", "enriched-dough", "extensibility", "extraction-rate", "falling-number", "farro", "feeding", "feeding-ratio", "fermentation", "fermentolyse", "float-test", "flour-freshness", "flour-strength", "flying-crust", "focaccia", "fonio", "fools-crumb", "fougasse", "fresh-milled-flour", "fresh-yeast", "friction-factor", "gelatinization", "germ", "gluten", "gluten-quality", "grain-mill", "gummy-crumb", "hard-red-spring-wheat", "hard-red-winter-wheat", "hard-wheat", "hard-white-wheat", "hearth-loaf", "heritage-grain", "high-extraction-flour", "hoagie-roll", "home-milling", "hooch", "hydration", "identity-preserved-grain", "impact-mill", "inclusions", "infrared-thermometer", "injera", "inoculation", "instant-yeast", "intensive-mix", "kaiser-roll", "khorasan-wheat", "kneading", "kochstuck", "lactic-acid", "lactic-acid-bacteria", "lame", "laminated-dough", "lamination", "landrace-grain", "lava-rocks", "leaf-score", "lean-dough", "letter-fold", "levain", "lievito-madre", "lye", "maceration", "maillard-reaction", "maltose", "marquis-wheat", "miche", "middlings", "milk-bread", "millet", "milling-temperature", "modern-wheat", "mother", "naan", "neapolitan-pizza", "new-york-style-pizza", "non-diastatic-malt", "oats", "osmotolerant-yeast", "oven-spring", "oven-steam", "oven-thermometer", "overmixing", "overproofed", "overripe-starter", "p-l-ratio", "pain-de-campagne", "pain-de-mie", "pale-crust", "pancaking", "panettone", "par-baking", "particle-size", "pate-fermentee", "patent-flour", "peak", "pentosans", "ph", "pita", "pizza-dough-balls", "pizza-peel", "pizza-stone-steel", "poke-test", "poolish", "pre-shape", "preferment", "pretzels", "probe-thermometer", "proofing", "proofing-box", "protease", "protein-content", "pseudocereal", "pullman-pan", "pumpernickel", "quellstuck", "quick-bread", "quinoa", "red-fife", "retarding", "retrogradation", "rice-flour", "ripe-starter", "roasted-garlic", "rolling-pin", "rope", "rouge-de-bordeaux", "rubaud-method", "rye-flour", "salt", "scald", "scalding", "scoring", "seam", "semolina-flour", "shaggy-mass", "shaping", "sifter", "slap-and-fold", "soaker", "soft-wheat", "soft-white-wheat", "sonora-wheat", "sorghum", "sourdough", "sourdough-discard", "sourdough-starter", "spelt-flour", "spiral-mixer", "sponge", "sprout-damage", "sprouted-flour", "stand-mixer", "starch-attack", "starter-jar", "stiff-starter", "stitching", "stone-mill", "straight-grade-flour", "stretch-and-fold", "surface-tension", "tangzhong", "teff", "tempering", "tenacity", "tension-pull", "terroir", "titratable-acidity", "triticale", "tunneling", "turkey-red", "turning-peel", "type-00-flour", "type-flour", "underfermented", "underproofed", "vital-wheat-gluten", "vollkornbrot", "w-value", "wheat-berry", "wheat-class", "wheat-stalk-score", "whole-wheat-flour", "windowpane-test", "yeast", "yeast-water", "young-levain", "yudane", "zest"]);

// Book wording that differs from the glossary's term name.
const ALIASES: Record<string, string> = {
  "Active starter": "ripe-starter",
  "Bagel boil": "bagel",
  "Braid": "braiding",
  "Expansion score": "scoring",
  "Khorasan": "khorasan-wheat",
  "Malt": "diastatic-malt",
  "Malted flour": "diastatic-malt",
  "Proof": "proofing",
  "Protein": "protein-content",
  "Retard": "retarding",
  "Spelt": "spelt-flour",
  "Starter": "sourdough-starter",
  "Windowpane": "windowpane-test",
  "Staling": "retrogradation",
  "Sweet levain": "levain",
  "Enzymes": "amylase"
};

const slugify = (term: string) => term.toLowerCase().replace(/'/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/** The glossary term page for a book term, or null when the glossary has no page for it yet. */
export function glossaryTermUrl(term: string): string | null {
  const slug = ALIASES[term] ?? slugify(term);
  return GLOSSARY_SLUGS.has(slug) ? `${GLOSSARY_BASE}/term/${slug}` : null;
}
