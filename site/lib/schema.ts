import { buildFacets, productsForFacet, orderProducts } from "./facets";
import { contentForRoute } from "./content";
import type { CatalogRecord } from "./catalog";

// JSON-LD rules (see RECONCILIATION.md):
// - One ItemList per facet page; itemListElement order matches render order.
// - Books (source "books", all Henry's own titles) get @type Book with author.
// - free_resources are list items only: no Product, no Book, no Offer.
// - Offer only when price is a real positive number AND currency exists.
//   Null price means NO offers property, never a zero or invented value.
// - No aggregateRating, no review, no priceValidUntil: no such data exists.

function itemFor(p: CatalogRecord): Record<string, unknown> | undefined {
  if (p.source === "free") return undefined;
  const isBook = p.source === "books";
  const entry: Record<string, unknown> = {
    "@type": isBook ? "Book" : "Product",
    name: p.name,
  };
  if (typeof p.desc === "string" && p.desc.trim() !== "") entry.description = p.desc;
  if (isBook) entry.author = { "@type": "Person", name: "Henry Hunter" };
  if (typeof p.price === "number" && p.price > 0 && typeof p.currency === "string" && p.currency !== "") {
    // priceFrom records do not have A price, they have a range across sizes or
    // tray counts. AggregateOffer with lowPrice ONLY: highPrice would be a mid
    // price pretending to be a ceiling, and that is the same fabrication we
    // refuse everywhere else. No offerCount, no priceValidUntil.
    entry.offers = p.priceFrom
      ? {
          "@type": "AggregateOffer",
          lowPrice: p.price,
          priceCurrency: p.currency,
          url: p.url,
        }
      : {
          "@type": "Offer",
          price: p.price,
          priceCurrency: p.currency,
          url: p.url,
        };
  }
  return entry;
}

export function buildItemListJsonLd(route: string): Record<string, unknown> {
  const slug = route === "/gifts" ? null : route.replace("/gifts/", "");
  const facet = slug ? buildFacets().find((f) => f.slug === slug) : null;
  if (route !== "/gifts" && !facet) throw new Error(`buildItemListJsonLd: no facet for ${route}`);
  const content = contentForRoute(route);
  const products = orderProducts(productsForFacet(facet!), content?.pinnedPick ?? null);

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    ...(content ? { name: content.title } : {}),
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => {
      const li: Record<string, unknown> = {
        "@type": "ListItem",
        position: i + 1,
        url: p.url,
        name: p.name,
      };
      const item = itemFor(p);
      if (item) li.item = item;
      return li;
    }),
  };
}
