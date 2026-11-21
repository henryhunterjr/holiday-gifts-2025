import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { BookOpen, ShoppingBag, ArrowRight, ExternalLink, ChevronDown, ChevronUp, Wrench, Search } from "lucide-react";
import productsData from "@/data/products.json";
import makersData from "@/data/makers.json";
import { bookChapters } from "@/data/bookCompanionChapters";
import { glossaryTermUrl, GLOSSARY_BASE } from "@/data/glossaryTerms";
import { DISABLED_PRODUCT_SLUGS, isValidUrl } from "@/lib/guideConfig";
import { ProductPhoto } from "@/components/ProductPhoto";
import { trackEvent } from "@/lib/analytics";
import {
  AboutHenry, CompanionFooter, CompanionHero, CompanionNav, ToolCard, asset, toolbox, toolsForChapter,
  COMPANION_URL, HERO_IMAGE, ABOUT_HENRY_URL,
} from "@/components/companion/CompanionChrome";

type Gear = { slug: string; name: string; brand: string; img: string; url: string; desc: string; code?: string };
type MakerItem = { slug: string; name: string; url: string; img: string; desc: string; code?: string };
type Maker = { id: string; brand: string; items: MakerItem[] };

// One catalog for the companion: the gift guide's products, plus maker-page items
// (NutriMill lives only there). Same source the Holiday Shopping Guide uses.
const catalog: Gear[] = [
  ...(productsData.products as Gear[]),
  ...(makersData as Maker[]).flatMap(m => m.items.map(i => ({ ...i, brand: m.brand }))),
].filter(p => !DISABLED_PRODUCT_SLUGS.has(p.slug) && isValidUrl(p.url));
const findGear = (slug: string) => catalog.find(p => p.slug === slug);

const authority = "https://bakinggreatbread.com/bread-authority";
const topic = (path: string) => authority + "/" + path + "?utm_campaign=bread-authority";

// Instant-read thermometer from the same Amazon store list as the gift guide.
const THERMOMETER = { name: "Lavatools Javelin PRO Classic", url: "https://www.amazon.com/dp/B01F59K0KA?tag=onamz55024a-20" };

const essentials = [
  { title: "Digital scale, 1 g increments", why: "Every recipe uses grams first. If you buy one thing, make it a scale.", swap: "Use the volume amounts until you have one.", slug: "bakers-scale" },
  { title: "Clear glass jar", why: "See your starter rise and fall.", swap: "A pint or quart mason jar is perfect.", slug: "starter-jars" },
  { title: "Mixing bowl or clear container", why: "Mix dough and see how bulk fermentation progresses.", swap: "A large bowl works. Mark rise in a small sample jar.", slug: "proof-container" },
  { title: "Bench scraper", why: "Move, divide, and shape sticky dough.", swap: "A flexible plastic bowl scraper works too.", slug: "bench-knife" },
  { title: "Instant-read thermometer", why: "Water, dough, and finished-loaf temperatures.", swap: "An inexpensive basic thermometer is enough.", external: THERMOMETER },
  { title: "Lidded baking vessel", why: "Capture steam for better oven spring and crust.", swap: "Use a sheet pan or cast iron skillet with a heat-safe stainless bowl over the loaf.", slug: "shell-steel-bundle" },
];
const optional = [
  { title: "Banneton", why: "Holds dough during the final proof. A towel-lined bowl works too.", slug: "oval-banneton" },
  { title: "Lame", why: "A scoring tool is helpful, but a carefully handled fresh razor blade also works.", slug: "goose-lame" },
  { title: "Dough whisk", why: "Handy for mixing a stiff starter or shaggy dough.", slug: "dough-whisk" },
  { title: "Bread sling", why: "Helps lower bread safely into a hot Dutch oven.", slug: "round-sling" },
  { title: "Controlled warm spot", why: "A proofer or starter warmer makes fermentation more predictable.", slug: "proofer" },
];
const partners = [
  { name: "Brød & Taylor", purpose: "Weighing, baking, proofing, starter backup", slugs: ["bakers-scale", "shell-steel-bundle", "proofer", "dough-whisk", "bench-knife", "proof-container"] },
  { name: "Sourhouse", purpose: "Reliable starter and dough temperatures", slugs: ["goldie", "doughbed", "starter-jars", "bread-blanket"] },
  { name: "Wire Monkey", purpose: "Scoring and proofing", slugs: ["goose-lame", "ufo-zero", "oval-banneton"] },
  { name: "ModKitchn", purpose: "Safer loading and bread storage", slugs: ["round-sling", "oval-sling", "bread-bag"] },
  { name: "Holland Bowl Mill", purpose: "Mixing and bulk", slugs: ["walnut-17", "maple-17"] },
  { name: "NutriMill", purpose: "Fresh-milled flour and enriched dough", slugs: ["classic-grain-mill", "impact-grain-mill", "white-universal-plus"] },
];

// Chapters whose printed "gear" pointer should land on a focused set, not the whole Chapter 11 list.
const CHAPTER_GEAR: Record<string, { title: string; note: string; slugs: string[] }> = {
  "1": { title: "Starter gear", note: "A clear jar and a steady, warm spot are all a new starter needs.", slugs: ["starter-jars", "goldie", "sourdough-home"] },
  "2": { title: "Starter gear", note: "Routines are easier when the jar shows you the rise and the temperature stays put.", slugs: ["starter-jars", "goldie", "sourdough-home"] },
  "5": { title: "Bulk and proofing gear", note: "See the rise, hold the temperature, and proof in something that supports the shape.", slugs: ["proof-container", "proofer", "doughbed", "oval-banneton"] },
  "7": { title: "Scoring gear", note: "A comfortable lame and a fresh blade make the cuts in Chapter 7 easier.", slugs: ["goose-lame", "ufo-zero"] },
  "10": { title: "Temperature gear", note: "A controlled warm spot keeps your schedule on time in a cold kitchen.", slugs: ["proofer", "doughbed", "goldie"] },
  "15": { title: "Milling gear", note: "The mills behind the fresh-milled recipes. Code ACADEMY26 takes $20 off at NutriMill.", slugs: ["classic-grain-mill", "impact-grain-mill"] },
  "22": { title: "Bread storage gear", note: "Breathable storage for the counter and a bag that keeps the crust from going soft.", slugs: ["bread-bag", "bread-blanket"] },
};

const chapters = bookChapters;
const normalizeChapter = (raw: string | null) => {
  if (!raw) return null;
  const n = parseInt(raw.replace(/^ch(apter)?-?/i, ""), 10);
  return Number.isFinite(n) && chapters.some(c => c.key === String(n)) ? String(n) : null;
};

const card = "rounded-2xl border border-[#d8c8b3] bg-white/90 p-5 shadow-sm";
const button = "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#382417] px-4 py-2 text-sm font-semibold text-[#fff7e9] hover:bg-[#633d24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9e681e]";
const chip = "inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-[#cbb18c] bg-[#faf3e5] px-3 py-2 text-sm font-semibold hover:bg-[#f0e1c9]";

function GearLink({ slug, external }: { slug?: string; external?: { name: string; url: string } }) {
  const p = slug ? findGear(slug) : undefined;
  const target = p ? { name: p.name, url: p.url, brand: p.brand, slug: p.slug } : external ? { ...external, brand: "Amazon", slug: "thermometer" } : null;
  if (!target) return null;
  return <a href={target.url} target="_blank" rel="noopener noreferrer sponsored nofollow" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#70461e] underline underline-offset-4" onClick={() => trackEvent("outbound_affiliate_click", { slug: target.slug, brand: target.brand, section: "book_companion" })}>See {target.name}<ExternalLink size={13} aria-hidden="true" /></a>;
}

function GearGrid({ slugs }: { slugs: string[] }) {
  const products = slugs.map(findGear).filter((p): p is Gear => Boolean(p));
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{products.map(p => <article key={p.slug} className={card}>
    <div className="h-44 overflow-hidden rounded-lg bg-[#f5f0e7]"><ProductPhoto src={asset(p.img)} name={p.name} /></div>
    <p className="mt-4 text-xs font-bold uppercase tracking-widest text-[#8e642f]">{p.brand}</p>
    <h4 className="mt-1 text-lg font-semibold text-[#2d2118]">{p.name}</h4>
    <p className="mt-2 text-sm text-[#55483d]">{p.desc}</p>
    {p.code && <p className="mt-2 text-xs font-semibold">Code: {p.code}</p>}
    <GearLink slug={p.slug} />
  </article>)}</div>;
}

const VIEW_META = {
  lessons: { title: "Sourdough for the Rest of Us: Book Companion, All 24 Chapters | Henry Hunter", description: "The official companion to Henry Hunter's Sourdough for the Rest of Us, 2nd Edition: videos, Bread Authority lessons, glossary terms and tools for all 24 chapters." },
  equipment: { title: "Sourdough Equipment Guide: Chapter 11 Gear | Sourdough for the Rest of Us", description: "The six tools you actually need for sourdough, budget swaps, and the gear Henry Hunter uses, from Chapter 11 of Sourdough for the Rest of Us." },
  glossary: { title: "Bread Glossary for Every Chapter | Sourdough for the Rest of Us", description: "Every glossary term in Sourdough for the Rest of Us, chapter by chapter, linked to its full definition and pronunciation in the Crust & Crumb glossary." },
} as const;

const bookSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person", "@id": ABOUT_HENRY_URL + "#person", name: "Henry Hunter", url: ABOUT_HENRY_URL,
      jobTitle: "Artisan bread baker, author and educator",
      sameAs: ["https://bakinggreatbread.com/about", "https://www.youtube.com/@henryhunterjr", "https://www.amazon.com/stores/Henry-Hunter/author/B0CH8WVFBZ"],
    },
    {
      "@type": "Book", "@id": COMPANION_URL + "#book", name: "Sourdough for the Rest of Us", bookEdition: "Second Edition, revised and expanded",
      author: { "@id": ABOUT_HENRY_URL + "#person" }, inLanguage: "en", about: "Sourdough bread baking at home", image: HERO_IMAGE,
    },
    {
      "@type": "WebPage", "@id": COMPANION_URL, url: COMPANION_URL, name: "Sourdough for the Rest of Us: Official Book Companion",
      about: { "@id": COMPANION_URL + "#book" }, author: { "@id": ABOUT_HENRY_URL + "#person" }, primaryImageOfPage: HERO_IMAGE,
      hasPart: chapters.map(c => ({ "@type": "WebPageElement", name: `Chapter ${c.key}: ${c.name}`, url: `${COMPANION_URL}?view=lessons&chapter=${c.key}` })),
    },
  ],
};

export default function BookCompanion() {
  const [params, setParams] = useSearchParams();
  const view = params.get("view");
  const activeTab: "lessons" | "equipment" | "glossary" = view === "equipment" ? "equipment" : view === "glossary" ? "glossary" : "lessons";
  const [openPartner, setOpenPartner] = useState<string | null>(null);
  const linkedChapter = normalizeChapter(params.get("chapter"));
  const openChapters = useMemo(() => linkedChapter ? chapters.filter(c => c.key === linkedChapter) : chapters, [linkedChapter]);
  const setView = (next: Record<string, string>) => setParams(next);
  const focusRef = useRef<HTMLDivElement>(null);
  const chapterGear = activeTab === "equipment" && linkedChapter ? CHAPTER_GEAR[linkedChapter] : undefined;

  // Deep links from the book (QR codes and Kindle links) land on the content, not the hero.
  useEffect(() => {
    if (linkedChapter && focusRef.current) focusRef.current.scrollIntoView({ block: "start" });
  }, [linkedChapter, activeTab]);

  const meta = VIEW_META[activeTab];
  const chapterName = linkedChapter ? chapters.find(c => c.key === linkedChapter)?.name : undefined;
  const title = chapterName && activeTab === "lessons" ? `Chapter ${linkedChapter}: ${chapterName} | Sourdough for the Rest of Us Companion` : meta.title;

  return <main className="min-h-screen bg-[#faf4e9] text-[#33251b]">
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={COMPANION_URL} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={COMPANION_URL} />
      <meta property="og:image" content={HERO_IMAGE} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json">{JSON.stringify(bookSchema)}</script>
    </Helmet>
    <CompanionHero eyebrow="Henry Hunter · The official digital companion" title={<>Sourdough <span className="block text-[.54em] italic leading-[1.1]">for the Rest of Us</span></>}
      subtitle="The book is in your hands. Here you can watch the techniques, understand the language, and find the tools behind every chapter.">
      <p className="mt-5 font-display text-2xl italic text-[#ffdea5] sm:text-3xl">Perfection Not Required.</p>
      <div className="mt-7 flex flex-wrap gap-3">
        <Link to="/sourdough-for-the-rest-of-us/?view=lessons" className="inline-flex min-h-[44px] items-center rounded-lg bg-[#d19a47] px-5 text-sm font-extrabold text-[#281408] hover:bg-[#efbe72]">Explore all 24 chapters</Link>
        <Link to="/sourdough-for-the-rest-of-us/tools/" className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#f1d3a0] bg-[#261811ba] px-5 text-sm font-semibold text-[#fff6e8] hover:bg-[#57361a]"><Wrench size={15} aria-hidden="true" /> Henry's Baker's Toolbox</Link>
      </div>
    </CompanionHero>
    <CompanionNav active={activeTab} />
    <div ref={focusRef} className="mx-auto max-w-5xl scroll-mt-16 px-4 pb-20 pt-10 sm:px-6">
      {activeTab === "equipment" ? <div className="space-y-12">
        {chapterGear && <section id={"chapter-gear-" + linkedChapter} className="rounded-3xl border-2 border-[#d19a47] bg-[#fff6e6] p-6 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-widest text-[#875c2e]">From Chapter {linkedChapter}: {chapterName}</p>
          <h2 className="mt-2 font-display text-3xl">{chapterGear.title}</h2>
          <p className="mt-2 max-w-3xl">{chapterGear.note}</p>
          <div className="mt-6"><GearGrid slugs={chapterGear.slugs} /></div>
          <p className="mt-6 text-sm">The full Chapter 11 equipment guide follows below. <button type="button" className="font-semibold underline" onClick={() => setView({ view: "lessons", chapter: linkedChapter! })}>Back to Chapter {linkedChapter}</button></p>
        </section>}
        <section><p className="text-sm font-bold uppercase tracking-widest text-[#875c2e]">Chapter 11 · Start here</p><h2 className="mt-2 font-display text-3xl">The six tools you actually need</h2><p className="mt-3 max-w-3xl">Don't buy $400 worth of gear to solve a $20 problem. Most of these are already in your kitchen. If you're buying something, start with the scale, then the thermometer.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">{essentials.map((item, i) => <article className={card} key={item.title}><span className="text-xs font-bold tracking-widest text-[#94632c]">{i + 1}</span><h3 className="mt-1 text-xl font-bold">{item.title}</h3><p className="mt-2">{item.why}</p><p className="mt-3 text-sm text-[#55483d]"><strong>Budget tip:</strong> {item.swap}</p><GearLink slug={item.slug} external={item.external} /></article>)}</div>
        </section>
        <section className="rounded-3xl bg-[#efe1c8] p-6 sm:p-9"><h2 className="font-display text-3xl">How to spend your first $50</h2><p className="mt-3">About $20 for a scale, $10 for a thermometer, $10 for two scrapers, and $10 for razor blades and parchment. Use your own bowl and a towel-lined bowl for proofing. Bake under an inverted heat-safe stainless steel bowl on a sheet pan until you're ready to upgrade.</p><p className="mt-3 text-sm font-semibold">These are illustrative budget estimates, not current product prices.</p></section>
        <section><h2 className="font-display text-3xl">Nice to have, not necessary</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">{optional.map(item => <article key={item.title} className={card}><h3 className="text-lg font-semibold">{item.title}</h3><p className="mt-2 text-sm">{item.why}</p><GearLink slug={item.slug} /></article>)}</div></section>
        <section className={card}><h2 className="font-display text-3xl">No-gear swaps</h2><ul className="mt-5 space-y-4">{[
          ["No Dutch oven?", "Try a cast iron skillet or sheet pan with a large heat-safe stainless steel bowl inverted over the loaf for the first 20 minutes."],
          ["No banneton?", "Line a mixing bowl with a well-floured, smooth kitchen towel."],
          ["No proofing box?", "Use a cooler with a jar of warm water, or a switched-off oven with a light and bowl of hot water. Check the temperature. Never turn the oven on while dough is inside."],
          ["No scale yet?", "Use the book's volume conversions. Spoon flour into the measuring cup and level it."],
        ].map(([h, t]) => <li key={h}><strong>{h}</strong> {t}</li>)}</ul></section>
        <section className={card}><h2 className="font-display text-3xl">What you can skip for now</h2><p className="mt-3">A stand mixer for one loaf, a couche, transfer peel, baking steel, six bannetons, starter-feeding app, or anything bought just because it says “artisan.” Bake a dozen loaves first. Buy tools to solve problems, not to look the part.</p></section>
        <section id="my-gear"><h2 className="font-display text-3xl">The gear I actually use</h2><p className="mt-3">These recommendations come from the same product catalog as my Holiday Shopping Guide, so updated links and products carry through. Some are affiliate links; I may earn a commission at no extra cost to you, and it goes back into the community.</p>
          <div className="mt-6 space-y-3">{partners.map(partner => <div className={card} key={partner.name}><button type="button" className="flex min-h-[44px] w-full items-center justify-between gap-4 text-left" aria-expanded={openPartner === partner.name} onClick={() => setOpenPartner(openPartner === partner.name ? null : partner.name)}><span><strong className="text-xl">{partner.name}</strong><span className="mt-1 block text-sm text-[#584639]">{partner.purpose}</span></span>{openPartner === partner.name ? <ChevronUp aria-hidden="true" /> : <ChevronDown aria-hidden="true" />}</button>{openPartner === partner.name && <div className="mt-5"><GearGrid slugs={partner.slugs} /></div>}</div>)}</div>
        </section>
        <p className="rounded-2xl border border-dashed border-[#c7ab83] p-5 text-sm">Looking for software instead of gear? The calculators, planners and guides I built live in <Link to="/sourdough-for-the-rest-of-us/tools/" className="font-semibold underline">Henry's Baker's Toolbox</Link>.</p>
        <section className="rounded-3xl bg-[#2e2118] p-7 text-[#fff5e2]"><h2 className="font-display text-3xl">Ask before you buy</h2><p className="mt-2">Not sure a gadget will solve your problem? Bring your question to Crust & Crumb Academy. We care about better bread, not bigger shopping carts.</p><a href="https://www.skool.com/crust-crumb-academy-7621/about" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 font-bold text-[#f0cd8d] underline">Visit the Academy <ArrowRight size={16} aria-hidden="true" /></a></section>
      </div> : activeTab === "lessons" ? <div className="space-y-8">
        <section><p className="text-sm font-bold uppercase tracking-widest text-[#875c2e]">Book lessons</p><h2 className="mt-2 font-display text-3xl">Watch it. Read it. Try it.</h2><p className="mt-3 max-w-3xl">All 24 chapters are here in manuscript order. Each one leads to related demonstrations, explanations, glossary terms, tools and practical resources.</p><a className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#70461e] underline" href={authority} target="_blank" rel="noopener noreferrer">Explore the full Bread Authority <ExternalLink size={14} aria-hidden="true" /></a></section>
        <div className="rounded-2xl border border-[#d8c8b3] bg-white p-4">
          <label htmlFor="book-chapter-select" className="mb-2 block text-sm font-semibold">Jump to a chapter</label>
          <select id="book-chapter-select" value={linkedChapter ?? ""} onChange={e => setView(e.target.value ? { view: "lessons", chapter: e.target.value } : { view: "lessons" })} className="w-full rounded-lg border border-[#a99985] bg-[#fffaf3] p-3 text-base">
            <option value="">Browse all 24 chapters</option>
            {chapters.map(ch => <option key={ch.key} value={ch.key}>Chapter {ch.key}: {ch.name}</option>)}
          </select>
        </div>
        {!linkedChapter && <div className="rounded-2xl border border-[#b99663] bg-[#f3e6d1] p-5">
          <p className="font-semibold text-[#6c3b23]">Chapter 22 spotlight: Freezing bread</p>
          <p className="mt-1 text-sm">The book explains freezing, thawing and reheating. Watch the demonstration or read the full article.</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <a href="https://bakinggreatbread.blog/2026/06/17/how-to-freeze-bread/" target="_blank" rel="noopener noreferrer" className="text-sm font-bold underline">Read the freezing article</a>
            <a href="https://www.youtube.com/watch?v=eiepOzOVDgk" target="_blank" rel="noopener noreferrer" className="text-sm font-bold underline">Watch the video</a>
            <Link to="/sourdough-for-the-rest-of-us/?view=lessons&chapter=22" className="text-sm font-bold underline">Open Chapter 22</Link>
          </div>
        </div>}
        {linkedChapter && <Link to="/sourdough-for-the-rest-of-us/?view=lessons" className="inline-flex text-sm font-semibold underline">← All 24 chapters</Link>}
        <div className="grid gap-5">{openChapters.map(ch => {
          const tools = toolsForChapter(ch.key);
          const gear = CHAPTER_GEAR[ch.key];
          return <section className={card} key={ch.key} id={"chapter-" + ch.key}>
            <div className="flex gap-3"><BookOpen className="mt-1 shrink-0 text-[#8a602d]" aria-hidden="true" /><div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-wide text-[#8a602d]">Chapter {ch.key} · Print page {ch.page}</p>
              <h3 className="mt-1 text-xl font-bold">{ch.name}</h3><p className="mt-2 text-sm">{ch.desc}</p>
              <p className="mt-4 text-sm font-bold">Subjects from this chapter</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{ch.focus.map(f => <li key={f}>{f}</li>)}</ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {ch.key === "11" && <Link to="/sourdough-for-the-rest-of-us/?view=equipment" className={button}>Chapter 11 Gear <ArrowRight size={15} aria-hidden="true" /></Link>}
                {gear && ch.key !== "11" && <Link to={`/sourdough-for-the-rest-of-us/?view=equipment&chapter=${ch.key}`} className={button}>{gear.title} <ShoppingBag size={15} aria-hidden="true" /></Link>}
                {ch.links.map(l => <a key={l.title} href={l.url ?? (l.path ? topic(l.path) : authority)} target="_blank" rel="noopener noreferrer" className={chip}>{l.title}<ExternalLink size={13} aria-hidden="true" /></a>)}
              </div>
              {tools.length > 0 && <div className="mt-4 rounded-xl bg-[#f6ecda] p-3">
                <p className="text-xs font-bold uppercase tracking-widest text-[#7a5326]"><Wrench size={12} className="mr-1 inline" aria-hidden="true" />Tools for this chapter</p>
                <div className="mt-2 flex flex-wrap gap-2">{tools.map(t => <a key={t.slug} href={t.url!} target="_blank" rel="noopener noreferrer" className={chip + " bg-white"}>{t.name}<ExternalLink size={13} aria-hidden="true" /></a>)}</div>
              </div>}
              <p className="mt-4 text-xs"><b>Glossary terms:</b> {ch.glossaryTerms.join(" · ")} <Link className="font-semibold underline" to={`/sourdough-for-the-rest-of-us/?view=glossary&chapter=${ch.key}`}>Explore these terms</Link></p>
            </div></div></section>;
        })}</div>
        <p className="text-sm text-[#625043]">All 24 chapters are mapped. Resource links may be updated without changing the book’s QR codes; recipe QR codes still go to Recipe Pantry.</p>
        {!linkedChapter && <section aria-labelledby="toolbox-teaser" className="rounded-3xl bg-[#2a1a10] p-6 text-[#fff5e2] sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#f0c477]">Henry's Baker's Toolbox</p>
          <h2 id="toolbox-teaser" className="mt-2 font-display text-3xl text-[#fff2d7]">Tools I built to help you bake better bread.</h2>
          <p className="mt-2 max-w-2xl text-[#f3e3c8]">Calculators, planners and guides that sit beside the book. Each one is matched to the chapters where it helps.</p>
          <div className="mt-6 grid gap-4 text-[#33251b] sm:grid-cols-2 lg:grid-cols-3">{toolbox.slice(0, 3).map(t => <ToolCard key={t.slug} tool={t} compact />)}</div>
          <Link to="/sourdough-for-the-rest-of-us/tools/" className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#f0c477] px-5 font-bold text-[#241307] hover:bg-[#ffd994]">See all {toolbox.length} tools <ArrowRight size={16} aria-hidden="true" /></Link>
        </section>}
      </div> : <div className="space-y-8">
        <section>
          <p className="text-sm font-bold uppercase tracking-widest text-[#875c2e]">The words behind the work</p>
          <h2 className="mt-2 font-display text-3xl">Understand the language of bread</h2>
          <p className="mt-3 max-w-3xl">Stuck on a word in the book? Tap it to open my full glossary entry, with the definition, how to say it, and the mistakes to avoid. Definitions live in the Crust & Crumb glossary so corrections and new material stay current without a new edition.</p>
          <a className="mt-4 inline-flex items-center gap-2 font-semibold text-[#70461e] underline" target="_blank" rel="noopener noreferrer" href={GLOSSARY_BASE + "/"}>Open the full glossary <ExternalLink size={15} aria-hidden="true" /></a>
        </section>
        {linkedChapter && <Link to="/sourdough-for-the-rest-of-us/?view=glossary" className="inline-flex text-sm font-semibold underline">← Terms from all 24 chapters</Link>}
        <div className="space-y-5">{openChapters.map(ch => <section key={ch.key} className={card} id={"glossary-" + ch.key}>
          <h3 className="font-display text-2xl">Chapter {ch.key} · {ch.name}</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">{ch.glossaryTerms.map(term => {
            const url = glossaryTermUrl(term);
            return <a key={term} href={url ?? GLOSSARY_BASE + "/#dictionary"} target="_blank" rel="noopener noreferrer" className="group rounded-xl border border-[#d8c8b3] bg-[#fcf8ef] p-4 hover:border-[#986735] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9e681e]">
              <div className="flex items-center justify-between gap-2"><strong className="text-lg text-[#382417] group-hover:underline">{term}</strong>{url ? <ExternalLink size={15} aria-hidden="true" /> : <Search size={15} aria-hidden="true" />}</div>
              <p className="mt-1 text-sm text-[#55483d]">{url ? "Read the definition and hear it said" : "Not in the glossary yet. Search the full glossary"}</p></a>;
          })}</div>
          {ch.key === "11" && <Link to="/sourdough-for-the-rest-of-us/?view=equipment" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#70461e] underline">See the tools in Chapter 11 <ArrowRight size={15} aria-hidden="true" /></Link>}
        </section>)}</div>
        <div className="rounded-2xl bg-[#efe1c8] p-5"><h3 className="font-display text-2xl">A loaf giving you trouble?</h3><p className="mt-2">Use the glossary's Diagnose a Problem tool to start with the symptom, then see the likely causes and fixes.</p><a href={GLOSSARY_BASE + "/"} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 font-semibold underline">Open the glossary diagnosis tool <ExternalLink size={15} aria-hidden="true" /></a></div>
      </div>}
      <div className="mt-14"><AboutHenry /></div>
      <CompanionFooter />
    </div>
  </main>;
}
