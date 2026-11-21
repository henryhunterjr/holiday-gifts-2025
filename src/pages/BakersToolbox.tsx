import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { bookChapters } from "@/data/bookCompanionChapters";
import {
  AboutHenry, CompanionFooter, CompanionHero, CompanionNav, ToolCard, toolbox, workshop, toolsLastChecked, toolsForChapter,
  COMPANION_URL, TOOLS_URL, HERO_IMAGE, ABOUT_HENRY_URL,
} from "@/components/companion/CompanionChrome";

const TITLE = "Henry's Baker's Toolbox: Sourdough Calculators, Planners and Guides | Henry Hunter";
const DESCRIPTION = "The baking tools Henry Hunter built for home bakers: a sourdough and yeast recipe converter, fermentation planner, starter and levain calculator, salt converter, bread glossary and more, matched to the chapters of Sourdough for the Rest of Us.";

const liveTools = toolbox.filter(t => t.status !== "retired" && t.url);
const workshopLive = workshop.filter(t => t.status !== "retired");
const archive = workshop.filter(t => t.status === "retired");

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Person", "@id": ABOUT_HENRY_URL + "#person", name: "Henry Hunter", url: ABOUT_HENRY_URL },
    {
      "@type": "CollectionPage", "@id": TOOLS_URL, url: TOOLS_URL, name: "Henry's Baker's Toolbox", description: DESCRIPTION,
      isPartOf: { "@type": "WebPage", "@id": COMPANION_URL, url: COMPANION_URL, name: "Sourdough for the Rest of Us: Official Book Companion" },
      author: { "@id": ABOUT_HENRY_URL + "#person" }, image: HERO_IMAGE,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: liveTools.map((t, i) => ({
          "@type": "ListItem", position: i + 1,
          item: { "@type": "WebApplication", name: t.name, url: t.url, description: t.what, applicationCategory: "Food & Drink", operatingSystem: "Web browser", creator: { "@id": ABOUT_HENRY_URL + "#person" } },
        })),
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Sourdough for the Rest of Us companion", item: COMPANION_URL },
        { "@type": "ListItem", position: 2, name: "Baker's Toolbox", item: TOOLS_URL },
      ],
    },
  ],
};

export default function BakersToolbox() {
  return <main className="min-h-screen bg-[#faf4e9] text-[#33251b]">
    <Helmet>
      <title>{TITLE}</title>
      <meta name="description" content={DESCRIPTION} />
      <link rel="canonical" href={TOOLS_URL} />
      <meta property="og:title" content="Henry's Baker's Toolbox" />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:url" content={TOOLS_URL} />
      <meta property="og:image" content={HERO_IMAGE} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
    <CompanionHero eyebrow="Sourdough for the Rest of Us · Book companion" title={<>Henry's Baker's <span className="block italic text-[#f6c977]">Toolbox</span></>}
      subtitle="Tools I built to help you bake better bread. Teaching is most of what I do, and some lessons work better as a tool you can use at the counter.">
      <div className="mt-7 flex flex-wrap gap-3">
        <a href="#toolbox" className="inline-flex min-h-[44px] items-center rounded-lg bg-[#d19a47] px-5 text-sm font-extrabold text-[#281408] hover:bg-[#efbe72]">Open the toolbox</a>
        <a href="#by-chapter" className="inline-flex min-h-[44px] items-center rounded-lg border border-[#f1d3a0] bg-[#261811ba] px-5 text-sm font-semibold text-[#fff6e8] hover:bg-[#57361a]">Find a tool by chapter</a>
      </div>
    </CompanionHero>
    <CompanionNav active="tools" />
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-sm text-[#6b5848]"><Link to="/sourdough-for-the-rest-of-us/" className="underline">Book companion</Link> <span aria-hidden="true">/</span> Baker's Toolbox</nav>

      <section className="mt-6 grid gap-6 rounded-3xl border border-[#d8c8b3] bg-white/80 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h2 className="font-display text-3xl">Software, not gear</h2>
          <p className="mt-3 text-[#4b3d32]">Everything here runs in your browser. These are the calculators, planners and references I built for my bakers. Physical equipment, like scales, lames and proofers, lives in the <Link to="/sourdough-for-the-rest-of-us/?view=equipment" className="font-semibold underline">Chapter 11 equipment guide</Link>.</p>
        </div>
        <div className="rounded-2xl bg-[#f6ecda] p-5 text-sm text-[#4b3d32]">
          <p className="font-semibold text-[#2d2118]">You don't need all of them.</p>
          <p className="mt-2">Start with the tool that matches the chapter you're reading. Each card shows the chapters it helps with. The rest will be here when you need them.</p>
        </div>
      </section>

      <section id="toolbox" aria-labelledby="toolbox-heading" className="mt-12 scroll-mt-20">
        <p className="text-sm font-bold uppercase tracking-widest text-[#875c2e]">The toolbox</p>
        <h2 id="toolbox-heading" className="mt-2 font-display text-4xl">Tools that go with the book</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{toolbox.map(t => <ToolCard key={t.slug} tool={t} />)}</div>
      </section>

      <section id="by-chapter" aria-labelledby="by-chapter-heading" className="mt-14 scroll-mt-20">
        <h2 id="by-chapter-heading" className="font-display text-3xl">Find a tool by chapter</h2>
        <p className="mt-2 text-[#4b3d32]">The glossary covers every chapter. These are the chapters with a tool of their own.</p>
        <ol className="mt-5 divide-y divide-[#e3d5c0] overflow-hidden rounded-2xl border border-[#d8c8b3] bg-white/90">
          {bookChapters.filter(c => toolsForChapter(c.key).length).map(c => <li key={c.key} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
            <Link to={`/sourdough-for-the-rest-of-us/?view=lessons&chapter=${c.key}`} className="font-semibold hover:underline"><span className="mr-2 text-[#8a602d]">Ch {c.key}</span>{c.name}</Link>
            <span className="flex flex-wrap gap-2">{toolsForChapter(c.key).map(t => <a key={t.slug} href={"#tool-" + t.slug} className="rounded-full border border-[#cbb18c] bg-[#faf3e5] px-3 py-1 text-sm font-semibold hover:bg-[#f0e1c9]">{t.name}</a>)}</span>
          </li>)}
        </ol>
      </section>

      <section aria-labelledby="workshop-heading" className="mt-14 rounded-3xl bg-[#2a1a10] p-6 text-[#fff5e2] sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-[#f0c477]">Henry's Workshop</p>
        <h2 id="workshop-heading" className="mt-2 font-display text-3xl text-[#fff2d7]">More from the workbench</h2>
        <p className="mt-2 max-w-2xl text-[#f3e3c8]">Other things I've built for bakers. They don't map to one chapter, but they're part of the same work.</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">{workshopLive.map(t => <li key={t.slug} className="rounded-2xl border border-[#4a3222] bg-[#33200f] p-4">
          <a href={t.url!} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-[#ffd994] underline-offset-4 hover:underline">{t.name}<ArrowUpRight size={14} aria-hidden="true" /></a>
          <p className="mt-1 text-sm text-[#f3e3c8]">{t.what}</p>
        </li>)}</ul>
        {archive.length > 0 && <div className="mt-8 border-t border-[#4a3222] pt-6">
          <h3 className="font-display text-2xl text-[#fff2d7]">From the archive</h3>
          <p className="mt-1 text-sm text-[#d9c6a6]">Retired tools stay listed so their history isn't lost. They're no longer available, so there's no link.</p>
          <ul className="mt-4 space-y-2">{archive.map(t => <li key={t.slug} className="flex flex-wrap items-baseline gap-2 text-sm"><span className="rounded-full bg-[#4a3a2e] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#e8dccd]">Retired{t.retired ? ` ${t.retired}` : ""}</span><strong className="text-[#fff2d7]">{t.name}</strong><span className="text-[#d9c6a6]">{t.what}</span></li>)}</ul>
        </div>}
      </section>

      <p className="mt-6 text-xs text-[#7a6757]">Every link on this page was checked on {new Date(toolsLastChecked + "T12:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.</p>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link to="/sourdough-for-the-rest-of-us/?view=lessons" className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#382417] px-5 font-semibold text-[#fff7e9] hover:bg-[#633d24]">Back to all 24 chapters <ArrowRight size={15} aria-hidden="true" /></Link>
      </div>

      <div className="mt-12"><AboutHenry /></div>
      <CompanionFooter />
    </div>
  </main>;
}
