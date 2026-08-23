import Link from "next/link";
import { buildFacets } from "@/lib/facets";
import type { Facet } from "@/lib/catalog";

// Cross-links generated from the catalog: a facet page links to its index and
// to the other facets in its own group. The index links to all fifteen.
export function FacetLinks({ current }: { current?: Facet }) {
  const facets = buildFacets();
  const groups: Array<[string, Facet["kind"]]> = [
    ["By category", "category"],
    ["By audience", "audience"],
    ["By price band", "price-band"],
  ];
  return (
    <nav className="facets">
      <p>
        <Link href="/gifts/">All products</Link>
      </p>
      {groups.map(([label, kind]) => (
        <div key={kind}>
          <h2>{label}</h2>
          <ul>
            {facets
              .filter((f) => f.kind === kind)
              .map((f) => (
                <li key={f.slug}>
                  {current && f.kind === current.kind && f.slug === current.slug ? (
                    <strong>{f.name}</strong>
                  ) : (
                    <Link href={`/gifts/${f.slug}/`}>{f.name}</Link>
                  )}
                </li>
              ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

// Compact variant for the index page: all fifteen facets, grouped.
export function AllFacetLinks() {
  return <FacetLinks />;
}
