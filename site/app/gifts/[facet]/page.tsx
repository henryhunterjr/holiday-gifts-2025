import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildFacets, productsForFacet, orderProducts } from "@/lib/facets";
import { contentForRoute } from "@/lib/content";
import { ProductList } from "../components";
import { FacetLinks } from "../facet-links";

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
  if (content) {
    return { title: content.title, description: content.metaDescription };
  }
  return { title: "Holiday Gift Guide" };
}

export default async function FacetPage({ params }: { params: Promise<{ facet: string }> }) {
  const { facet: slug } = await params;
  const facet = findFacet(slug);
  if (!facet) notFound();
  const content = contentForRoute(`/gifts/${slug}`);
  const products = orderProducts(productsForFacet(facet), content?.pinnedPick ?? null);
  return (
    <>
      <h1>{content?.title ?? facet.name}</h1>
      {content && <p className="intro">{content.intro}</p>}
      <FacetLinks current={facet} />
      <ProductList products={products} pinnedName={content?.pinnedPick ?? null} />
    </>
  );
}
