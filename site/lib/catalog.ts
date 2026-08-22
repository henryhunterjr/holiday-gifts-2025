import fs from "node:fs";
import path from "node:path";

// One source of product data: the catalog the root Vite app generates.
// Read at build time across the directory boundary. Never copied, never
// fetched, never duplicated.
const CATALOG_PATH = path.join(process.cwd(), "..", "public", "catalog.json");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CatalogRecord = Record<string, any> & {
  name?: string;
  slug?: string;
  price?: number | null;
  url?: string;
  rel?: string | null;
  target?: string | null;
  categories?: string[];
  audiences?: string[];
  priceBand?: string | null;
};

export type Facet = { kind: "category" | "audience" | "price-band"; name: string; slug: string };

export function readCatalog(): { products: CatalogRecord[] } {
  const raw = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const arrays = ["products", "krustic", "amazon", "books", "free_resources"] as const;
  const products: CatalogRecord[] = [];
  for (const key of arrays) {
    for (const record of raw[key] ?? []) products.push({ ...record });
  }
  return { products };
}

export function getCategories(): string[] {
  const { products } = readCatalog();
  return [...new Set(products.flatMap((p) => p.categories ?? []))].sort();
}

export function getAudiences(): string[] {
  const { products } = readCatalog();
  return [...new Set(products.flatMap((p) => p.audiences ?? []))].sort();
}

export function getPriceBands(): string[] {
  const { products } = readCatalog();
  return [...new Set(products.map((p) => p.priceBand).filter((b): b is string => typeof b === "string"))].sort();
}
