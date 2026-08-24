import type { Metadata } from "next";
import { readCatalog } from "@/lib/catalog";
import { orderProducts } from "@/lib/facets";
import { contentForRoute } from "@/lib/content";
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

export default function GiftsIndex() {
  const { products } = readCatalog();
  const content = contentForRoute(ROUTE);
  if (!content) throw new Error(`facets.json is missing the "${ROUTE}" page entry`);
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
      <PriceCheckedNote />
      <AllFacetLinks />
      <ProductList products={orderProducts(products, content.pinnedPick)} pinnedName={content.pinnedPick} />
      <JsonLd data={buildItemListJsonLd(ROUTE)} />
    </>
  );
}
