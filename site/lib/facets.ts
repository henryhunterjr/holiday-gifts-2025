import { slugify } from "./slugs.mjs";
import { getCategories, getAudiences, getPriceBands, readCatalog, type Facet } from "./catalog";

// The route list is derived from the catalog at build time. Add a category or
// audience next month and its page appears with no routing edits.
export function buildFacets(): Facet[] {
  return [
    ...getCategories().map((name) => ({ kind: "category" as const, name, slug: slugify(name) })),
    ...getAudiences().map((name) => ({ kind: "audience" as const, name, slug: slugify(name) })),
    ...getPriceBands().map((name) => ({ kind: "price-band" as const, name, slug: slugify(name) })),
  ];
}

export function productsForFacet(facet: Facet) {
  const { products } = readCatalog();
  switch (facet.kind) {
    case "category":
      return products.filter((p) => (p.categories ?? []).includes(facet.name));
    case "audience":
      return products.filter((p) => (p.audiences ?? []).includes(facet.name));
    case "price-band":
      return products.filter((p) => p.priceBand === facet.name);
  }
}
