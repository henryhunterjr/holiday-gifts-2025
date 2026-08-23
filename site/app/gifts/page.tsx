import type { Metadata } from "next";
import { readCatalog } from "@/lib/catalog";
import { orderProducts } from "@/lib/facets";
import { contentForRoute } from "@/lib/content";
import { ProductList } from "./components";
import { AllFacetLinks } from "./facet-links";

export const dynamic = "force-static";

const ROUTE = "/gifts";

export function generateMetadata(): Metadata {
  const content = contentForRoute(ROUTE);
  if (!content) throw new Error(`facets.json is missing the "${ROUTE}" page entry`);
  return {
    title: content.title,
    description: content.metaDescription,
  };
}

export default function GiftsIndex() {
  const { products } = readCatalog();
  const content = contentForRoute(ROUTE);
  if (!content) throw new Error(`facets.json is missing the "${ROUTE}" page entry`);
  return (
    <>
      <h1>{content.title}</h1>
      <p className="intro">{content.intro}</p>
      <AllFacetLinks />
      <ProductList products={orderProducts(products, content.pinnedPick)} pinnedName={content.pinnedPick} />
    </>
  );
}
