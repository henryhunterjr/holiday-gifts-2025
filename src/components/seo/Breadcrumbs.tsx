import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Helmet } from "react-helmet-async";

export const SITE_ORIGIN = "https://gifts.bakinggreatbread.blog";

export type Crumb = { name: string; path?: string };

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.path ? { item: `${SITE_ORIGIN}${c.path}` } : {}),
    })),
  };
}

/**
 * Visible breadcrumb trail plus matching BreadcrumbList structured data, so
 * Google can render the trail in place of the raw URL in search results.
 * The last crumb is the current page and carries no link.
 */
export function Breadcrumbs({ crumbs, emitJsonLd = true }: { crumbs: Crumb[]; emitJsonLd?: boolean }) {
  return (
    <>
      {emitJsonLd && (
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd(crumbs))}</script>
        </Helmet>
      )}
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-crumb">
          {crumbs.map((c, i) => {
            const last = i === crumbs.length - 1;
            return (
              <li key={`${c.name}-${i}`} className="flex items-center gap-1">
                {c.path && !last ? (
                  <Link
                    to={c.path}
                    className="inline-flex min-h-[36px] items-center font-semibold text-crust hover:text-cranberry focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cranberry focus-visible:ring-offset-2"
                  >
                    {c.name}
                  </Link>
                ) : (
                  <span aria-current="page" className="inline-flex min-h-[36px] items-center">
                    {c.name}
                  </span>
                )}
                {!last && <ChevronRight className="h-3.5 w-3.5 flex-none opacity-60" aria-hidden />}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
