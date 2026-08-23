import contentJson from "../content/facets.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PageContent = { title: string; metaDescription: string; intro: string; pinnedPick: string | null };

// Route keys mirror the public paths: "/gifts" and "/gifts/<slug>".
const pages = contentJson as unknown as { pages: Record<string, PageContent> };

export function contentForRoute(route: string): PageContent | undefined {
  return pages.pages[route];
}
