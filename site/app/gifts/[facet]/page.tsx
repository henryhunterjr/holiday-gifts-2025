import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildFacets, productsForFacet, orderProducts } from "@/lib/facets";
import { contentForRoute, siteDisclosure } from "@/lib/content";
import { BASE_URL } from "@/lib/site.mjs";
import { buildItemListJsonLd } from "@/lib/schema";
import { ProductList } from "../components";
import { FacetLinks } from "../facet-links";
import { JsonLd } from "../jsonld";
import { PriceCheckedNote } from "../price-note";
import { MiniOrnament } from "../dressing";

export const dynamic = "force-static";

export function generateStaticParams() {
  return buildFacets().map((f) => ({ facet: f.slug }));
}

function findFacet(slug: string) {
  return buildFacets().find((f) => f.slug === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ facet: string }> }): Promise<Metadata> {
  const { facet: slug } = await params;
  const content = contentForRoute(`/gifts/${slug}`);
  return {
    title: content?.title ?? "Holiday Gift Guide",
    description: content?.metaDescription,
    alternates: { canonical: `${BASE_URL}/${slug}/` },
  };
}

export default async function FacetPage({ params }: { params: Promise<{ facet: string }> }) {
  const { facet: slug } = await params;
  const facet = findFacet(slug);
  if (!facet) notFound();
  const content = contentForRoute(`/gifts/${slug}`);
  const products = orderProducts(productsForFacet(facet), content?.pinnedPick ?? null);
  return (
    <>
      <header className="slim-header">
        <p className="eyebrow">Holiday Gift Guide</p>
        <h1>{content?.title ?? facet.name}</h1>
        <MiniOrnament />
      </header>
      {content && <p className="intro">{content.intro}</p>}
      <p className="disclosure">{siteDisclosure()}</p>
      <PriceCheckedNote />
      <FacetLinks current={facet} />
      <ProductList products={products} pinnedName={content?.pinnedPick ?? null} />
      <JsonLd data={buildItemListJsonLd(`/gifts/${slug}`)} />
    </>
  );
}
