import type { Metadata } from "next";
import { readCatalog, type CatalogRecord } from "@/lib/catalog";
import { orderProducts } from "@/lib/facets";
import { contentForRoute, siteDisclosure, orderedCategories, categoryIntro } from "@/lib/content";
import { BASE_URL } from "@/lib/site.mjs";
import { buildItemListJsonLd } from "@/lib/schema";
import { ProductList } from "./components";
import { AllFacetLinks } from "./facet-links";
import { JsonLd } from "./jsonld";
import { PriceCheckedNote } from "./price-note";
import { Ornaments } from "./dressing";

export const dynamic = "force-static";

const ROUTE = "/gifts";

export function generateMetadata(): Metadata {
  const content = contentForRoute(ROUTE);
  if (!content) throw new Error(`facets.json is missing the "${ROUTE}" page entry`);
  return {
    title: content.title,
    description: content.metaDescription,
    alternates: { canonical: `${BASE_URL}/` },
  };
}

// Grouped index: every product appears exactly once, under its first category
// in the curated order. The render gate counts 87 markers on this page, so a
// grouping bug that duplicates or drops a product fails the build.
export default function GiftsIndex() {
  const { products } = readCatalog();
  const content = contentForRoute(ROUTE);
  if (!content) throw new Error(`facets.json is missing the "${ROUTE}" page entry`);

  const present = [...new Set(products.flatMap((p) => p.categories ?? []))];
  const ordered = orderedCategories(present);

  // Each product is assigned to its FIRST category in the curated order, so a
  // product with two categories appears once, in its primary group.
  const groups: Array<{ name: string; products: CatalogRecord[] }> = ordered.map((name) => ({ name, products: [] }));
  const byName = new Map(groups.map((g) => [g.name, g]));
  for (const p of products) {
    const first = (p.categories ?? []).find((c) => byName.has(c));
    if (!first) {
      throw new Error(`product "${p.name}" has no category present in the grouped index. Every product needs at least one category.`);
    }
    byName.get(first)!.products.push(p);
  }
  if (groups.reduce((a, g) => a + g.products.length, 0) !== products.length) {
    throw new Error(`grouped index covers ${groups.reduce((a, g) => a + g.products.length, 0)} of ${products.length} products.`);
  }

  return (
    <>
      <div style={{ position: "relative" }}>
        <Ornaments />
        <header className="hero">
          <img className="hero-img" src="/brand/hero-bread-baking-gifts.jpg" alt="Freshly baked sourdough loaves on a holiday table" width={1600} height={900} />
          <div className="hero-text">
            <p className="eyebrow">Henry Hunter's annual guide</p>
            <h1>{content.title}</h1>
          </div>
        </header>
      </div>
      <p className="intro">{content.intro}</p>
      <p className="disclosure">{siteDisclosure()}</p>
      <PriceCheckedNote />
      {content.topPicks && content.topPicks.length > 0 && (
        <section className="top-picks">
          <h2>Henry's top picks</h2>
          <div className="picks-grid">
            {content.topPicks.map((pick) => {
              const p = products.find((x) => x.name === pick.name);
              if (!p) return null;
              return (
                <article className="pick-card gift-tag" key={pick.name}>
                  {p.img && (
                    <span className="card-img-wrap">
                      <img className="card-img" src={p.img} alt={typeof p.alt === "string" && p.alt !== "" ? p.alt : p.name} loading="lazy" decoding="async" width={640} height={480} />
                    </span>
                  )}
                  <span className="tag-name">{p.name}</span>
                  <span className="tag-price">{typeof p.price === "number" ? `$${p.price.toFixed(2)}` : "price pending"}</span>
                  <p className="pick-pitch">{pick.pitch}</p>
                  {p.url && (
                    <a className="buy-btn" href={p.url} rel={p.rel ?? undefined} target={p.target ?? undefined}>
                      <span className="bulbs" aria-hidden="true">
                        <i className="bulb b1" />
                        <i className="bulb b2" />
                        <i className="bulb b3" />
                        <i className="bulb b4" />
                      </span>
                      Buy now →
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}
      <AllFacetLinks />
      {groups.map((g) => (
        <section key={g.name} className="cat-group">
          <h2>{g.name}</h2>
          {categoryIntro(g.name) && <p className="cat-intro">{categoryIntro(g.name)}</p>}
          <ProductList products={g.products} />
        </section>
      ))}
      <JsonLd data={buildItemListJsonLd(ROUTE)} />
    </>
  );
}
