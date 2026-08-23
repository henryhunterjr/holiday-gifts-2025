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

// Ordering rule from content/facets.json _meta.orderingRule: pinned pick first,
// then remaining products by price ascending, null-price records last.
// Array.prototype.sort is stable, so equal prices keep catalog order.
export function orderProducts<T extends { price?: number | null; name?: string }>(products: T[], pinnedName: string | null | undefined): T[] {
  const pin = pinnedName ? products.find((p) => p.name === pinnedName) : undefined;
  const rest = [...products.filter((p) => p !== pin)].sort((a, b) => {
    const pa = typeof a.price === "number" ? a.price : Infinity;
    const pb = typeof b.price === "number" ? b.price : Infinity;
    return pa - pb;
  });
  return pin ? [pin, ...rest] : rest;
}
