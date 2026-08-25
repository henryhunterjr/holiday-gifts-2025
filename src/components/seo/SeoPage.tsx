import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/seo/Breadcrumbs";

const SITE = "https://gifts.bakinggreatbread.blog";
const OG_IMAGE = `${SITE}/og-image.png`;

export type SeoPageProps = {
  path: string;
  title: string;
  description: string;
  h1: string;
  eyebrow?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  children: ReactNode;
};

/**
 * Shared shell for scaffolded SEO pages. Owns Helmet metadata,
 * canonical URL, JSON-LD, the top back-to-hub nav, the visible <h1>,
 * and the footer link back into the Holiday Gift Guide 2026 hub.
 */
export function SeoPage({ path, title, description, h1, eyebrow, jsonLd, children }: SeoPageProps) {
  const canonical = `${SITE}${path}`;
  const fullTitle = `${title} — Holiday Gifts 2026`;
  const ldArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <div className="min-h-screen bg-flour text-ink">
      <Helmet>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={OG_IMAGE} />
        {ldArray.map((obj, i) => (
          <script key={i} type="application/ld+json">{JSON.stringify(obj)}</script>
        ))}
      </Helmet>

      <nav aria-label="Breadcrumb" className="border-b border-parchment-deep bg-parchment/50">
        <div className="mx-auto flex max-w-[900px] items-center px-5 py-3">
          <Link
            to="/"
            className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-crust hover:text-cranberry focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cranberry focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to the 2026 Holiday Gift Guide
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-[900px] px-5 py-12 md:py-16">
        <header className="mb-10">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="mt-3 font-display text-4xl font-semibold text-crust md:text-5xl">{h1}</h1>
          <p className="mt-4 max-w-[60ch] text-lg text-crumb">{description}</p>
        </header>

        <div className="space-y-10 text-[1.02rem] leading-relaxed text-ink">{children}</div>

        <footer className="mt-16 border-t border-parchment-deep pt-8 text-sm text-crumb">
          <p>
            Looking for gift ideas? Head back to the{" "}
            <Link to="/" className="font-semibold text-cranberry hover:underline">
              2026 Holiday Gift Guide for bread bakers
            </Link>
            .
          </p>
        </footer>
      </main>
    </div>
  );
}

/** Reusable placeholder section block. Content goes here later. */
export function StubSection({ id, heading, children }: { id: string; heading: string; children?: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="rounded-2xl border border-parchment-deep bg-white/70 p-6 md:p-8">
      <h2 id={`${id}-h`} className="font-display text-2xl font-semibold text-crust md:text-3xl">{heading}</h2>
      <div className="mt-4 space-y-3 text-crumb">
        {children ?? <p className="italic text-crumb/80">Content coming soon.</p>}
      </div>
    </section>
  );
}