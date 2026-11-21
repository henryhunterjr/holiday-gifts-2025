import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { BookOpen, ShoppingBag, PlayCircle, BookText, ArrowRight, ExternalLink, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import productsData from "@/data/products.json";
import { bookChapters } from "@/data/bookCompanionChapters";
import { DISABLED_PRODUCT_SLUGS, isValidUrl } from "@/lib/guideConfig";
import { ProductPhoto } from "@/components/ProductPhoto";
import { trackEvent } from "@/lib/analytics";

type Gear = { slug: string; name: string; brand: string; img: string; url: string; desc: string; code?: string; price?: number | string };
const catalog = (productsData.products as Gear[]).filter(p => !DISABLED_PRODUCT_SLUGS.has(p.slug) && isValidUrl(p.url));
const findGear = (slug: string) => catalog.find(p => p.slug === slug);
const authority = "https://bakinggreatbread.com/bread-authority";
const glossary = "https://crust-and-crumb-tawny.vercel.app";
const termUrl = (slug: string) => `${glossary}/term/${slug}`;
const topic = (path: string) => authority + "/" + path + "?utm_campaign=bread-authority";
const essentials = [
  { title: "Digital scale, 1 g increments", why: "Every recipe uses grams first. If you buy one thing, make it a scale.", swap: "Use the volume amounts until you have one.", slug: "bakers-scale" },
  { title: "Clear glass jar", why: "See your starter rise and fall.", swap: "A pint or quart mason jar is perfect.", slug: "starter-jars" },
  { title: "Mixing bowl or clear container", why: "Mix dough and see how bulk fermentation progresses.", swap: "A large bowl works. Mark rise in a small sample jar.", slug: "proof-container" },
  { title: "Bench scraper", why: "Move, divide, and shape sticky dough.", swap: "A flexible plastic bowl scraper works too.", slug: "bench-knife" },
  { title: "Instant-read thermometer", why: "Water, dough, and finished-loaf temperatures.", swap: "An inexpensive basic thermometer is enough." },
  { title: "Lidded baking vessel", why: "Capture steam for better oven spring and crust.", swap: "Use a sheet pan or cast iron skillet with a heat-safe stainless bowl over the loaf.", slug: "shell-steel-bundle" },
];
const optional = [
  { title: "Banneton", why: "Holds dough during the final proof. A towel-lined bowl works too.", slug: "round-banneton" },
  { title: "Lame", why: "A scoring tool is helpful, but a carefully handled fresh razor blade also works.", slug: "goose-lame" },
  { title: "Dough whisk", why: "Handy for mixing a stiff starter or shaggy dough.", slug: "dough-whisk" },
  { title: "Bread sling", why: "Helps lower bread safely into a hot Dutch oven.", slug: "round-sling" },
  { title: "Controlled warm spot", why: "A proofer or starter warmer makes fermentation more predictable.", slug: "proofer" },
];
const partners = [
  { name: "Brød & Taylor", purpose: "Weighing, baking, proofing, starter backup", slugs: ["bakers-scale", "shell-steel-bundle", "proofer", "sahara", "dough-whisk", "bench-knife"] },
  { name: "Sourhouse", purpose: "Reliable starter and dough temperatures", slugs: ["goldie", "doughbed"] },
  { name: "Wire Monkey", purpose: "Scoring", slugs: ["goose-lame", "ufo-zero"] },
  { name: "ModKitchn", purpose: "Safer loading", slugs: ["round-sling", "oval-sling", "bread-bag"] },
  { name: "Holland Bowl Mill", purpose: "Mixing and bulk", slugs: ["walnut-17", "maple-17"] },
  { name: "NutriMill", purpose: "Fresh-milled flour and enriched dough", slugs: [] },
];
const chapters = bookChapters;
const knownGlossarySlugs: Record<string,string> = {"Bench scraper":"bench-scraper","Banneton":"banneton","Baking steel":"baking-steel","Aliquot jar":"aliquot-jar"};
const glossaryChapters = Object.fromEntries(chapters.map(chapter => [chapter.key, {
 title: `Chapter ${chapter.key} · ${chapter.name}`,
 terms: chapter.glossaryTerms.map(name=>({name,slug:knownGlossarySlugs[name],why:"Explore this term in the glossary"}))
}]));
const card = "rounded-2xl border border-[#d8c8b3] bg-white/90 p-5 shadow-sm";
const button = "inline-flex items-center justify-center gap-2 rounded-xl bg-[#382417] px-4 py-3 text-sm font-semibold text-[#fff7e9] hover:bg-[#633d24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9e681e]";
function GearLink({ slug }: { slug?: string }) {
  const p = slug ? findGear(slug) : undefined;
  if (!p) return null;
  return <a href={p.url} target="_blank" rel="noopener noreferrer sponsored nofollow" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#70461e] underline underline-offset-4" onClick={() => trackEvent("outbound_affiliate_click", { slug: p.slug, brand: p.brand, section: "book_companion" })}>See {p.name}<ExternalLink size={13}/></a>;
}
function GearGrid({ slugs }: { slugs: string[] }) {
  const products = slugs.map(findGear).filter((p): p is Gear => Boolean(p));
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{products.map(p => <article key={p.slug} className={card}><div className="h-40 overflow-hidden rounded-lg bg-[#f5f0e7]"><ProductPhoto src={p.img} name={p.name}/></div><p className="mt-4 text-xs font-bold uppercase tracking-widest text-[#8e642f]">{p.brand}</p><h4 className="mt-1 text-lg font-semibold text-[#2d2118]">{p.name}</h4><p className="mt-2 text-sm text-[#55483d]">{p.desc}</p>{p.code && <p className="mt-2 text-xs font-semibold">Available code: {p.code}</p>}<GearLink slug={p.slug}/></article>)}</div>;
}
export default function BookCompanion() {
  const [params, setParams] = useSearchParams();
  const activeTab = params.get("view") === "equipment" ? "equipment" : params.get("view") === "glossary" ? "glossary" : "lessons";
  const [openPartner, setOpenPartner] = useState<string | null>(null);
  const linkedChapter = params.get("chapter");
  const openChapters = useMemo(() => linkedChapter ? chapters.filter(c => c.key === linkedChapter) : chapters, [linkedChapter]);
  const select = (view: string) => setParams(existing => { const next = new URLSearchParams(existing); next.set("view", view); return next; });
  return <main className="min-h-screen bg-[#faf4e9] text-[#33251b]">
    <Helmet><title>Sourdough for the Rest of Us | Official Book Companion</title><meta name="description" content="Henry Hunter's permanent companion to Sourdough for the Rest of Us: Resources and explanations matched to all 24 chapters, including how to freeze bread, the glossary, and equipment."/><link rel="canonical" href="https://gifts.bakinggreatbread.com/sourdough-for-the-rest-of-us/"/></Helmet>
    <header className="bg-[#241811] px-5 py-10 text-[#fff6e5] sm:py-16"><div className="mx-auto max-w-5xl">
      <Link to="/" className="text-sm text-[#e6bf7d] underline underline-offset-4">← Holiday Shopping Guide</Link>
      <p className="mt-7 text-xs font-bold uppercase tracking-[.23em] text-[#e6bf7d]">Henry Hunter · Official Book Companion</p>
      <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight sm:text-6xl">Sourdough for the Rest of Us</h1>
      <h2 className="mt-3 text-xl text-[#e6bf7d]">The tools and teaching behind the book</h2>
      <p className="mt-5 max-w-2xl leading-relaxed text-[#efe2d0]">Perfection not required. Follow your chapter to video demonstrations, articles, glossary definitions and the gear I actually use.</p>
    </div></header>
    <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
      <nav aria-label="Companion sections" className="-mt-5 mb-9 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <button type="button" aria-pressed={activeTab === "equipment"} onClick={() => select("equipment")} className={button + (activeTab === "equipment" ? " ring-4 ring-[#d3aa61]" : " opacity-85")}><ShoppingBag size={18}/> Chapter 11 Gear</button>
        <button type="button" aria-pressed={activeTab === "lessons"} onClick={() => select("lessons")} className={button + (activeTab === "lessons" ? " ring-4 ring-[#d3aa61]" : " opacity-85")}><PlayCircle size={18}/> Techniques & Videos</button>
        <button type="button" aria-pressed={activeTab === "glossary"} onClick={() => select("glossary")} className={button + (activeTab === "glossary" ? " ring-4 ring-[#d3aa61]" : " opacity-85")}><BookText size={18}/> Bread Glossary</button>
      </nav>
      {activeTab === "equipment" ? <div className="space-y-12">
        <section><p className="text-sm font-bold uppercase tracking-widest text-[#875c2e]">Start here</p><h2 className="mt-2 font-serif text-3xl">The six tools you actually need</h2><p className="mt-3 max-w-3xl">Don't buy $400 worth of gear to solve a $20 problem. Most of these are already in your kitchen. If you're buying something, start with the scale, then the thermometer.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">{essentials.map((item,i)=><article className={card} key={item.title}><span className="text-xs font-bold tracking-widest text-[#94632c]">{i+1}</span><h3 className="mt-1 text-xl font-bold">{item.title}</h3><p className="mt-2">{item.why}</p><p className="mt-3 text-sm text-[#55483d]"><strong>Budget tip:</strong> {item.swap}</p><GearLink slug={item.slug}/></article>)}</div>
        </section>
        <section className="rounded-3xl bg-[#efe1c8] p-6 sm:p-9"><h2 className="font-serif text-3xl">How to spend your first $50</h2><p className="mt-3">About $20 for a scale, $10 for a thermometer, $10 for two scrapers, and $10 for razor blades and parchment. Use your own bowl and a towel-lined bowl for proofing. Bake under an inverted heat-safe stainless steel bowl on a sheet pan until you're ready to upgrade.</p><p className="mt-3 text-sm font-semibold">These are illustrative budget estimates, not current product prices.</p></section>
        <section><h2 className="font-serif text-3xl">Nice to have, not necessary</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">{optional.map(item=><article key={item.title} className={card}><h3 className="text-lg font-semibold">{item.title}</h3><p className="mt-2 text-sm">{item.why}</p><GearLink slug={item.slug}/></article>)}</div></section>
        <section className={card}><h2 className="font-serif text-3xl">No-gear swaps</h2><ul className="mt-5 space-y-4">{[
          ["No Dutch oven?", "Try a cast iron skillet or sheet pan with a large heat-safe stainless steel bowl inverted over the loaf for the first 20 minutes."],
          ["No banneton?", "Line a mixing bowl with a well-floured, smooth kitchen towel."],
          ["No proofing box?", "Use a cooler with a jar of warm water, or a switched-off oven with a light and bowl of hot water. Check the temperature. Never turn the oven on while dough is inside."],
          ["No scale yet?", "Use the book's volume conversions. Spoon flour into the measuring cup and level it."]
        ].map(([h,t])=><li key={h}><strong>{h}</strong> {t}</li>)}</ul></section>
        <section className={card}><h2 className="font-serif text-3xl">What you can skip for now</h2><p className="mt-3">A stand mixer for one loaf, a couche, transfer peel, baking steel, six bannetons, starter-feeding app, or anything bought just because it says “artisan.” Bake a dozen loaves first. Buy tools to solve problems, not to look the part.</p></section>
        <section id="my-gear"><h2 className="font-serif text-3xl">The gear I actually use</h2><p className="mt-3">These recommendations come from the same product catalog as my Holiday Shopping Guide, so updated links and products carry through. Some are affiliate links; I may earn a commission at no extra cost to you.</p>
          <div className="mt-6 space-y-3">{partners.map(partner => <div className={card} key={partner.name}><button type="button" className="flex w-full items-center justify-between gap-4 text-left" aria-expanded={openPartner === partner.name} onClick={() => setOpenPartner(openPartner === partner.name ? null : partner.name)}><span><strong className="text-xl">{partner.name}</strong><span className="mt-1 block text-sm text-[#584639]">{partner.purpose}</span></span>{openPartner === partner.name ? <ChevronUp/> : <ChevronDown/>}</button>{openPartner === partner.name && <div className="mt-5">{partner.slugs.length ? <GearGrid slugs={partner.slugs}/> : <p className="rounded-lg bg-[#faf4e9] p-4 text-sm">NutriMill Classic mill and Bosch mixer are mentioned in the book. Product links are being verified before publication. See <a className="font-semibold underline" href="https://gifts.bakinggreatbread.com">the main guide</a> for the current catalog.</p>}</div>}</div>)}</div>
        </section>
        <section className="rounded-3xl bg-[#2e2118] p-7 text-[#fff5e2]"><h2 className="font-serif text-3xl">Ask before you buy</h2><p className="mt-2">Not sure a gadget will solve your problem? Bring your question to Crust & Crumb Academy. We care about better bread, not bigger shopping carts.</p><a href="https://www.skool.com/crust-crumb-academy-7621/about" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 font-bold text-[#f0cd8d] underline">Visit the Academy <ArrowRight size={16}/></a></section>
      </div> : activeTab === "lessons" ? <div className="space-y-8">
        <section><p className="text-sm font-bold uppercase tracking-widest text-[#875c2e]">Book lessons</p><h2 className="mt-2 font-serif text-3xl">Watch it. Read it. Try it.</h2><p className="mt-3 max-w-3xl">All 24 chapters are here in manuscript order. Each one leads to related demonstrations, explanations, glossary terms and practical resources.</p><a className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#70461e] underline" href={authority} target="_blank" rel="noopener noreferrer">Explore the full Bread Authority <ExternalLink size={14}/></a></section>
        <div className="mb-5 rounded-2xl border border-[#b99663] bg-[#f3e6d1] p-5">
          <p className="font-semibold text-[#6c3b23]">Chapter 22 spotlight: Freezing bread</p>
          <p className="mt-1 text-sm">The book explains freezing, thawing and reheating. Watch the demonstration or read the full article.</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <a href="https://bakinggreatbread.blog/2026/06/17/how-to-freeze-bread/" target="_blank" rel="noopener noreferrer" className="text-sm font-bold underline">Read the freezing article</a>
            <a href="https://www.youtube.com/watch?v=eiepOzOVDgk" target="_blank" rel="noopener noreferrer" className="text-sm font-bold underline">Watch the video</a>
            <button onClick={() => setParams({view:"lessons",chapter:"22"})} className="text-sm font-bold underline">Open Chapter 22</button>
          </div>
        </div>
        {linkedChapter && <button type="button" className="mb-5 text-sm font-semibold underline" onClick={() => setParams({view:"lessons"})}>← All 24 chapters</button>}
        <div className="grid gap-5">{openChapters.length ? openChapters.map(ch => <section className={card} key={ch.key} id={"chapter-"+ch.key}>
          <div className="flex gap-3"><BookOpen className="mt-1 shrink-0 text-[#8a602d]"/><div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wide text-[#8a602d]">Chapter {ch.key} · Print page {ch.page}</p>
            <h3 className="mt-1 text-xl font-bold">{ch.name}</h3><p className="mt-2 text-sm">{ch.desc}</p>
            <p className="mt-4 text-sm font-bold">Subjects from this chapter</p>
            <ul className="mt-2 list-disc pl-5 text-sm space-y-1">{ch.focus.map(f=><li key={f}>{f}</li>)}</ul>
            <div className="mt-4 flex flex-wrap gap-2">
              {ch.key === "11" && <button onClick={() => select("equipment")} className={button}>Chapter 11 Gear <ArrowRight size={15}/></button>}
              {ch.key === "22" && <button onClick={() => select("equipment")} className={button}>Bread Storage Gear <ShoppingBag size={15}/></button>}
              {ch.links.map(l=><a key={l.title} href={l.url ?? (l.path ? topic(l.path) : authority)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-[#cbb18c] bg-[#faf3e5] px-3 py-2 text-sm font-semibold hover:bg-[#f0e1c9]">{l.title}<ExternalLink size={13}/></a>)}
            </div>
            <p className="mt-4 text-xs"><b>Glossary terms:</b> {ch.glossaryTerms.join(" · ")} <button className="font-semibold underline" onClick={() => setParams({view:"glossary",chapter:ch.key})}>Explore these terms</button></p>
          </div></div></section>) : <p className={card}>No chapter found. <button className="underline" onClick={() => setParams({view:"lessons"})}>See all chapters</button></p>}</div>
        <p className="text-sm text-[#625043]">All 24 chapters are mapped. Resource links may be updated without changing the book’s QR codes; recipe QR codes still go to Recipe Pantry.</p>
      </div> : <div className="space-y-8">
        <section>
          <p className="text-sm font-bold uppercase tracking-widest text-[#875c2e]">The words behind the work</p>
          <h2 className="mt-2 font-serif text-3xl">Understand the language of bread</h2>
          <p className="mt-3 max-w-3xl">Stuck on a word in the book? Open Henry's original glossary entry. Definitions remain in the Crust & Crumb glossary so corrections and new material stay current without a new edition.</p>
          <a className="mt-4 inline-flex items-center gap-2 font-semibold text-[#70461e] underline" target="_blank" rel="noopener noreferrer" href={glossary}>Open the full glossary <ExternalLink size={15}/></a>
          <p className="mt-3 text-sm text-[#5f4e3b]">The glossary also includes a Sourdough Mastery path created as a companion to this book, plus Tools & Equipment and troubleshooting paths.</p>
        </section>
        <div className="space-y-5">{Object.entries(glossaryChapters).filter(([key]) => !linkedChapter || key === linkedChapter).map(([key, section]) => <section key={key} className={card} id={"glossary-"+key}>
          <h3 className="font-serif text-2xl">{section.title}</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">{section.terms.map(term => <a key={term.slug} href={term.slug ? termUrl(term.slug) : glossary} target="_blank" rel="noopener noreferrer" className="group rounded-xl border border-[#d8c8b3] bg-[#fcf8ef] p-4 hover:border-[#986735] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9e681e]">
            <div className="flex items-center justify-between gap-2"><strong className="text-lg text-[#382417] group-hover:underline">{term.name}</strong><ExternalLink size={15} aria-hidden="true"/></div><p className="mt-1 text-sm text-[#55483d]">{term.why}</p></a>)}</div>
          {key === "11" && <button type="button" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#70461e] underline" onClick={() => select("equipment")}>See the tools in Chapter 11 <ArrowRight size={15}/></button>}
        </section>)}</div>
        <div className="rounded-2xl bg-[#efe1c8] p-5"><h3 className="font-serif text-2xl">A loaf giving you trouble?</h3><p className="mt-2">Use the glossary's Diagnose a Problem tool to start with the symptom, then see the likely causes and fixes.</p><a href={glossary} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 font-semibold underline">Open the glossary diagnosis tool <ExternalLink size={15}/></a></div>
      </div>}
      <footer className="mt-16 border-t border-[#d6c6ae] pt-6 text-sm text-[#665444]"><CheckCircle2 className="mr-2 inline-block" size={16}/> Perfection not required. Progress is.<div className="mt-2">© Henry Hunter · Crust & Crumb Academy · <Link to="/" className="underline">Holiday Shopping Guide</Link></div></footer>
    </div>
  </main>;
}
