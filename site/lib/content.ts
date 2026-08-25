import contentJson from "../content/facets.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PageContent = {
  title: string;
  metaDescription: string;
  intro: string;
  pinnedPick: string | null;
  topPicks?: Array<{ name: string; pitch: string }>;
};

// Route keys mirror the public paths: "/gifts" and "/gifts/<slug>".
const parsed = contentJson as unknown as {
  pages: Record<string, PageContent>;
  _meta: {
    disclosure: string;
    categoryOrder: string[];
    categoryIntros: Record<string, string>;
  };
};

export function contentForRoute(route: string): PageContent | undefined {
  return parsed.pages[route];
}

export function siteDisclosure(): string {
  return parsed._meta.disclosure;
}

// Curated category order for the grouped index. Unknown categories (a new one
// added next month) append alphabetically after the curated list.
export function orderedCategories(present: string[]): string[] {
  const curated = parsed._meta.categoryOrder.filter((c) => present.includes(c));
  const extras = present.filter((c) => !parsed._meta.categoryOrder.includes(c)).sort();
  return [...curated, ...extras];
}

export function categoryIntro(name: string): string | undefined {
  return parsed._meta.categoryIntros[name];
}
