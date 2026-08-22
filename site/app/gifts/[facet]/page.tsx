import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildFacets, productsForFacet } from "@/lib/facets";
import { ProductList } from "../components";

export const dynamic = "force-static";

export function generateStaticParams() {
  return buildFacets().map((f) => ({ facet: f.slug }));
}

function findFacet(slug: string) {
  return buildFacets().find((f) => f.slug === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ facet: string }> }): Promise<Metadata> {
  const { facet: slug } = await params;
  const facet = findFacet(slug);
  return { title: facet ? `${facet.name} — Holiday Gift Guide` : "Holiday Gift Guide" };
}

export default async function FacetPage({ params }: { params: Promise<{ facet: string }> }) {
  const { facet: slug } = await params;
  const facet = findFacet(slug);
  if (!facet) notFound();
  const products = productsForFacet(facet);
  return (
    <>
      <h1>
        {facet.name} ({products.length})
      </h1>
      <ProductList products={products} />
    </>
  );
}
