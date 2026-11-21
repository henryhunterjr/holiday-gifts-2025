import { Link } from "react-router-dom";
import { ArrowUpRight, CheckCircle2, Wrench } from "lucide-react";
import toolboxData from "@/data/bakersToolbox.json";

// The companion is also served at bakinggreatbread.com/sourdough-for-the-rest-of-us/
// through a same-path proxy. Root-relative files (/product-images/...) would load
// from bakinggreatbread.com there and break, so companion assets always use this origin.
export const ASSET_ORIGIN = "https://gifts.bakinggreatbread.com";
export const asset = (src: string) => (src.startsWith("/") ? ASSET_ORIGIN + src : src);

export const COMPANION_URL = "https://bakinggreatbread.com/sourdough-for-the-rest-of-us/";
export const TOOLS_URL = "https://bakinggreatbread.com/sourdough-for-the-rest-of-us/tools/";
export const ABOUT_HENRY_URL = "https://skoo.ly/about-henry";
export const HERO_IMAGE = "https://bakinggreatbread.blog/wp-content/uploads/2026/11/sourdough-for-the-rest-of-us-companion-hero.png";
export const HENRY_PORTRAIT = "https://bakinggreatbread.com/hub/henry-arms-crossed.jpg";

export type Tool = {
  slug: string;
  name: string;
  kind: string;
  what: string;
  problem?: string;
  forWho?: string;
  url: string | null;
  chapters?: string[];
  status: "live" | "in-progress" | "retired";
  launched?: string;
  retired?: string;
};
export const toolbox = toolboxData.toolbox as Tool[];
export const workshop = toolboxData.workshop as Tool[];
export const toolsLastChecked = toolboxData.lastChecked;

/** Tools from the toolbox that the book ties to a chapter. The glossary covers every chapter but is listed on its own. */
export const toolsForChapter = (key: string) => toolbox.filter(t => t.chapters?.includes(key));

export const chapterLabel = (chapters?: string[]) => {
  if (!chapters?.length) return "";
  if (chapters.includes("all")) return "Every chapter";
  return (chapters.length === 1 ? "Chapter " : "Chapters ") + chapters.join(", ");
};

export type CompanionSection = "lessons" | "glossary" | "equipment" | "tools";

const NAV: { key: CompanionSection | "videos" | "about"; label: string; to?: string; href?: string }[] = [
  { key: "lessons", label: "Chapters", to: "/sourdough-for-the-rest-of-us/?view=lessons" },
  { key: "videos", label: "Techniques & Videos", href: "https://bakinggreatbread.com/bread-authority" },
  { key: "glossary", label: "Bread Glossary", to: "/sourdough-for-the-rest-of-us/?view=glossary" },
  { key: "equipment", label: "Equipment", to: "/sourdough-for-the-rest-of-us/?view=equipment" },
  { key: "tools", label: "Baker's Toolbox", to: "/sourdough-for-the-rest-of-us/tools/" },
  { key: "about", label: "About Henry", href: ABOUT_HENRY_URL },
];

/** One row of real links. Sticky under the hero so the active section never hides behind it. */
export function CompanionNav({ active }: { active: CompanionSection }) {
  return (
    <nav aria-label="Book companion" className="sticky top-0 z-30 border-b border-[#3d281a] bg-[#1f110b]/95 backdrop-blur supports-[backdrop-filter]:bg-[#1f110b]/85">
      <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3 py-2 text-sm [scrollbar-width:none] sm:justify-center sm:px-6">
        {NAV.map(item => {
          const isActive = item.key === active;
          const cls = "flex min-h-[44px] items-center gap-1 whitespace-nowrap rounded-full px-4 font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f0c477] " +
            (isActive ? "bg-[#f0c477] text-[#241307]" : "text-[#f6e3c0] hover:bg-[#3a2416]");
          return (
            <li key={item.key}>
              {item.to
                ? <Link to={item.to} aria-current={isActive ? "page" : undefined} className={cls}>{item.key === "tools" && <Wrench size={14} aria-hidden="true" />}{item.label}</Link>
                : <a href={item.href} className={cls}>{item.label}<ArrowUpRight size={13} aria-hidden="true" /></a>}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * The hero photo is 3:2 with Henry on the right, the loaf in the middle and the
 * starter jar beside it. Under 1024px it sits above the headline as a full,
 * uncropped band. From 1024px it is anchored to the right at its natural shape
 * so a wide monitor never crops Henry's face, and the dark wall on its left edge
 * fades into the headline's space.
 */
export function CompanionHero({ eyebrow, title, tagline, subtitle, children }: { eyebrow: string; title: React.ReactNode; tagline?: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <header className="relative isolate overflow-hidden bg-[#1f110b] text-[#fff5df]">
      <div className="relative lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-[3/2] lg:h-full" aria-hidden="true">
        <img src={HERO_IMAGE} alt="" width={1536} height={1024} className="block aspect-[3/2] w-full object-cover lg:h-full lg:w-auto" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#1f110b] to-transparent lg:inset-y-0 lg:left-0 lg:right-auto lg:h-full lg:w-[38%] lg:bg-gradient-to-r" />
      </div>
      <div className="relative mx-auto flex max-w-6xl flex-col px-5 pb-10 pt-2 sm:px-8 lg:min-h-[clamp(600px,42vw,780px)] lg:justify-center lg:py-16">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm lg:absolute lg:left-8 lg:top-7 lg:mb-0 lg:justify-start lg:gap-5">
          <a href="https://bakinggreatbread.com/" className="font-semibold text-[#f5dcae] hover:underline">← BakingGreatBread.com</a>
          <span className="rounded-full border border-[#e1b96e] bg-[#32170fd9] px-4 py-2 text-xs font-bold uppercase tracking-[.14em] text-[#ffe5af]">2026 Revised & Expanded</span>
        </div>
        <div className="max-w-[560px] lg:max-w-[46%] xl:max-w-[540px]">
          <p className="mb-4 text-xs font-bold uppercase tracking-[.23em] text-[#f6c977]">{eyebrow}</p>
          <h1 className="font-display text-[clamp(2.9rem,7vw,5.9rem)] leading-[.94] tracking-[-.03em] text-[#fff2d7] [text-shadow:0_3px_30px_#120700a8]">{title}</h1>
          <div className="mt-6 h-[3px] w-32 rounded-full bg-gradient-to-r from-[#bb7930] via-[#ffd27a] to-[#bb7930]" />
          {tagline && <p className="mt-5 font-display text-2xl italic text-[#ffdea5] sm:text-3xl">{tagline}</p>}
          {subtitle && <p className="mt-4 max-w-[470px] text-base leading-relaxed text-[#fffaed] sm:text-lg">{subtitle}</p>}
          {children}
        </div>
      </div>
    </header>
  );
}

export function AboutHenry() {
  return (
    <section aria-labelledby="about-henry-heading" className="overflow-hidden rounded-3xl border border-[#d8c8b3] bg-white/90 shadow-sm sm:grid sm:grid-cols-[minmax(0,240px)_1fr]">
      <img src={HENRY_PORTRAIT} alt="Henry Hunter in his burgundy chef's jacket, arms crossed" width={1122} height={1402} loading="lazy" className="h-64 w-full object-cover object-top sm:h-full" />
      <div className="p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[#8e642f]">About the author</p>
        <h2 id="about-henry-heading" className="mt-2 font-display text-3xl text-[#2d2118]">Meet Henry Hunter</h2>
        <p className="mt-3 text-[#4b3d32]">I teach home bakers through Baking Great Bread at Home and Crust &amp; Crumb Academy, and I write books and build tools to make good bread easier for everyone.</p>
        <ul className="mt-4 grid gap-1 text-sm text-[#4b3d32] sm:grid-cols-2">
          <li>Author of Sourdough for the Rest of Us and other books</li>
          <li>Founder of Baking Great Bread at Home</li>
          <li>Founder of Crust &amp; Crumb Academy</li>
          <li>Builder of the tools in the Baker's Toolbox</li>
        </ul>
        <a href={ABOUT_HENRY_URL} className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#382417] px-5 font-semibold text-[#fff7e9] hover:bg-[#633d24]">About the Author <ArrowUpRight size={15} aria-hidden="true" /></a>
      </div>
    </section>
  );
}

export function CompanionFooter() {
  return (
    <footer className="mt-16 border-t border-[#d6c6ae] pt-6 text-sm text-[#665444]">
      <p><CheckCircle2 className="mr-2 inline-block" size={16} aria-hidden="true" /> Perfection not required. Progress is.</p>
      <p className="mt-2">
        Built by <a className="font-semibold underline" href={ABOUT_HENRY_URL}>Henry Hunter</a> · Crust &amp; Crumb Academy ·{" "}
        <Link to="/sourdough-for-the-rest-of-us/" className="underline">Book companion home</Link> ·{" "}
        <a href="https://gifts.bakinggreatbread.com/" className="underline">Holiday Shopping Guide</a>
      </p>
    </footer>
  );
}

const STATUS: Record<Tool["status"], { label: string; cls: string }> = {
  live: { label: "Live", cls: "bg-[#e3efdc] text-[#2f5a22]" },
  "in-progress": { label: "In progress", cls: "bg-[#fbe9c8] text-[#7a4d0e]" },
  retired: { label: "Retired", cls: "bg-[#ece6df] text-[#5c5148]" },
};

export function StatusPill({ status }: { status: Tool["status"] }) {
  const s = STATUS[status];
  return <span className={"inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider " + s.cls}>{s.label}</span>;
}

/** A workbench card: the chapter tab on top, what it does, why it exists, and one clear way in. */
export function ToolCard({ tool, compact = false }: { tool: Tool; compact?: boolean }) {
  const live = tool.status !== "retired" && tool.url;
  return (
    <article id={"tool-" + tool.slug} className="group relative flex flex-col rounded-2xl border border-[#d8c8b3] bg-[#fffaf1] p-5 shadow-[0_1px_0_#d8c8b3,0_10px_24px_-18px_#3b230f] transition-transform hover:-translate-y-0.5">
      <div className="flex flex-wrap items-center gap-2">
        {tool.chapters?.length ? <span className="rounded-md bg-[#2e1d12] px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#f3d49c]">{chapterLabel(tool.chapters)}</span> : null}
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8e642f]">{tool.kind}</span>
        <span className="ml-auto"><StatusPill status={tool.status} /></span>
      </div>
      <h3 className="mt-3 font-display text-2xl leading-tight text-[#2d2118]">{tool.name}</h3>
      <p className="mt-2 text-[15px] text-[#3f3229]">{tool.what}</p>
      {!compact && tool.problem && <p className="mt-3 border-l-2 border-[#d19a47] pl-3 text-sm italic text-[#5b4a3d]">{tool.problem}</p>}
      {!compact && tool.forWho && <p className="mt-3 text-sm text-[#5b4a3d]"><strong className="font-semibold text-[#3f3229]">For:</strong> {tool.forWho}</p>}
      {(tool.launched || tool.retired) && <p className="mt-3 text-xs text-[#7a6757]">{tool.retired ? `Retired ${tool.retired}` : `Launched ${tool.launched}`}</p>}
      <div className="mt-auto pt-4">
        {live
          ? <a href={tool.url!} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2 font-semibold text-[#70461e] underline decoration-[#d19a47] decoration-2 underline-offset-4">Open {tool.name.split(" (")[0]} <ArrowUpRight size={15} aria-hidden="true" /></a>
          : <p className="text-sm font-semibold text-[#7a6757]">No longer available</p>}
      </div>
    </article>
  );
}
