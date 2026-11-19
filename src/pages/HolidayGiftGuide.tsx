import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Gift, Search, Share2, Copy, Snowflake, ExternalLink, X, Sparkles, ChevronDown, Heart } from "lucide-react";
import { toast } from "sonner";
import productsData from "@/data/products.json";
import { krusticProducts } from "@/data/krustic";
import seasonalTools from "@/data/seasonalAmazon.json";
import { amazonProducts } from "@/data/amazon";
import {
  PRICE_BANDS,
  bandByLabel,
  DISABLED_PRODUCT_SLUGS,
  DISABLED_KRUSTIC_SLUGS,
  FREE_RESOURCES_ENABLED,
  PRICES_LAST_CHECKED,
  isValidUrl,
} from "@/lib/guideConfig";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import fotmBanner from "@/assets/holiday/fotm-banner.jpg";
import { GiveawayModal } from "@/components/giveaway/GiveawayModal";
import { holidayBakingGuide } from "@/data/holidayBakingGuide";
import { WishlistDrawer, type WishlistItem } from "@/components/WishlistDrawer";
import { useWishlist } from "@/hooks/useWishlist";
import { breadcrumbJsonLd } from "@/components/seo/Breadcrumbs";
import { type TopPick } from "@/data/topPicks";
import "./holiday-editorial.css";
import makers from "@/data/makers.json";
import { ProductPhoto } from "@/components/ProductPhoto";
import { trackEvent } from "@/lib/analytics";

const SITE_ORIGIN = "https://gifts.bakinggreatbread.com";

/* ============ Types & data ============ */
type Product = {
  slug: string;
  name: string;
  brand: string;
  price: number | string;
  priceChecked?: string;
  cat: string;
  img: string;
  url: string;
  code?: string;
  desc: string;
  note?: string;
};

const allProducts = productsData.products as Product[];
// Hide products that are disabled or lack a valid URL.
const products = allProducts.filter(
  (p) => !DISABLED_PRODUCT_SLUGS.has(p.slug) && isValidUrl(p.url),
);
const top6Slugs = productsData.top6 as string[];
const promoCodes = productsData.promo_codes as [string, string][];
const visibleKrustic = krusticProducts.filter(
  (k) => !DISABLED_KRUSTIC_SLUGS.has(k.slug) && isValidUrl(k.url),
);

type FreeResource = {
  slug: string;
  name: string;
  img: string;
  url: string;
  desc: string;
};

const freeResources = (productsData.free || []) as FreeResource[];
const visibleFree = freeResources.filter((f) => isValidUrl(f.url));

const CATEGORIES = [
  "Starter Care",
  "Proofing & Temp",
  "Scoring & Shaping",
  "Bake Day",
  "Wood & Serving",
  "Storage & Gifting",
];

const priceNum = (p: Product) => (typeof p.price === "number" ? p.price : parseFloat(String(p.price).replace(/[^0-9.]/g, "")) || 0);
const priceStr = (p: Product) => (typeof p.price === "number" ? `$${p.price}` : p.price);

/* ============ Gift Tag Card ============ */
function GiftTag({ p, onCopyCode }: { p: Product; onCopyCode: (code: string) => void }) {
  const num = priceNum(p);
  const { has, toggle } = useWishlist();
  const saved = has(p.slug);
  return (
    <article className="holiday-product-card" data-product={p.slug} data-brand={p.brand}>
      <a href={p.url} target="_blank" rel="nofollow sponsored noopener noreferrer" aria-label={`Shop ${p.name}`} onClick={() => trackEvent("outbound_affiliate_click", { slug: p.slug, brand: p.brand, section: "browse", price: num, has_code: Boolean(p.code) })}>
        <ProductPhoto src={p.img} name={p.name} />
      </a>
      <div className="holiday-card-body">
      <p className="holiday-card-brand">{p.brand}</p>
      <h4 className="font-display text-[1.08rem] font-semibold text-crust mb-1 leading-tight">{p.name}</h4>
      <p className="text-[.86rem] text-[hsl(27_35%_28%)] mb-2 line-clamp-3">{p.desc}</p>
      {p.note && <p className="font-hand text-[1.12rem] text-cranberry-deep -rotate-1 mb-3">{p.note}</p>}
      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
        <span className={`font-bold text-[1.12rem] ${num === 0 ? "text-evergreen" : "text-crust"}`}>{num === 0 ? "Free" : priceStr(p)}</span>
        {p.code && (
          <button type="button" className="code-pill" aria-label={`Copy promo code ${p.code} for ${p.brand}`} onClick={() => onCopyCode(p.code!)}>
            <Copy className="h-3 w-3" /> {p.code}
          </button>
        )}
      </div>
      <div className="mt-3 flex gap-2">
        <a
          href={p.url}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className="group/gift relative flex-1 overflow-hidden rounded-[10px] bg-evergreen px-3 py-[11px] text-center text-[.88rem] font-extrabold text-flour transition-colors hover:bg-evergreen-deep"
          onClick={() => trackEvent("outbound_affiliate_click", { slug: p.slug, brand: p.brand, section: "browse_cta", price: num, has_code: Boolean(p.code) })}
        >
          <span className="relative inline-flex items-center justify-center gap-1.5">
            
            Gift it →
          </span>
        </a>
        <button
          onClick={async () => {
            if (navigator.share) {
              try {
                await navigator.share({ title: p.name, url: p.url });
                return;
              } catch {
                /* fall through to clipboard */
              }
            }
            try {
              if (!navigator.clipboard?.writeText) throw new Error("no clipboard");
              await navigator.clipboard.writeText(p.url);
              toast.success("Link copied");
            } catch {
              toast.error("Copy blocked by your browser. Long-press the link to copy it.");
            }
          }}
          className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-[10px] border-[1.5px] border-parchment-deep bg-white text-crumb transition-colors hover:border-cranberry hover:text-cranberry"
          type="button"
          aria-label={`Share ${p.name}`}
        >
          <Share2 className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            const nowSaved = toggle(p.slug);
            trackEvent("wishlist_toggle", { slug: p.slug, brand: p.brand, saved: nowSaved });
            toast.success(nowSaved ? `Saved ${p.name}` : `Removed ${p.name}`);
          }}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${p.name} from saved gifts` : `Save ${p.name} to your gift list`}
          title={saved ? "Saved" : "Save this gift"}
          className={`flex h-[42px] w-[42px] flex-none items-center justify-center rounded-[10px] border-[1.5px] transition-colors ${
            saved
              ? "border-cranberry bg-cranberry text-flour"
              : "border-parchment-deep bg-white text-crumb hover:border-cranberry hover:text-cranberry"
          }`}
        >
          <Heart className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      </div>
    </article>
  );
}

/* ============ Gift Finder Quiz ============ */
type QuizAnswers = { who: string; budget: string; need: string; style: string };

function GiftFinderQuiz({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState<QuizAnswers>({ who: "", budget: "", need: "", style: "" });
  const titleId = useId();
  useEffect(() => { if (open) { setStep(0); setAns({ who: "", budget: "", need: "", style: "" }); } }, [open]);

  const questions = [
    { key: "who" as const, q: "Who's it for?", opts: ["A new baker", "Weekend baker", "Obsessed sourdough baker", "Market seller"] },
    { key: "budget" as const, q: "What's the budget?", opts: ["Under $25", "$25–75", "$75–150", "Splurge $150+"] },
    { key: "need" as const, q: "What do they need most?", opts: ["Starter Care", "Proofing & Temp", "Scoring & Shaping", "Bake Day", "Wood & Serving", "Storage & Gifting"] },
    { key: "style" as const, q: "Gift style?", opts: ["Stocking stuffer", "Centerpiece gift", "Bundle"] },
  ];

  const done = step >= questions.length;

  // Budget is a hard constraint and the stated category comes first. Only when
  // the category has fewer than three in-budget matches do we backfill, and
  // those extras get labelled so the picks stay honest.
  const matches = useMemo<{ p: Product; extra: boolean }[]>(() => {
    if (!done) return [];
    const band = bandByLabel(ans.budget);
    const inBudget = band ? products.filter((p) => band.test(priceNum(p))) : products;
    const rank = (p: Product) => {
      let score = 0;
      if (ans.who === "A new baker" && ["Starter Care", "Bake Day"].includes(p.cat)) score += 2;
      if (ans.who === "Obsessed sourdough baker" && ["Scoring & Shaping", "Proofing & Temp"].includes(p.cat)) score += 2;
      if (ans.who === "Market seller" && ["Storage & Gifting", "Wood & Serving"].includes(p.cat)) score += 2;
      if (ans.style === "Stocking stuffer" && priceNum(p) < 30) score += 1;
      if (ans.style === "Centerpiece gift" && priceNum(p) > 100) score += 1;
      if (ans.style === "Bundle" && /bundle/i.test(p.name)) score += 2;
      return score;
    };
    const byRank = (a: Product, b: Product) => rank(b) - rank(a);
    const onCategory = inBudget.filter((p) => p.cat === ans.need).sort(byRank);
    const picks = onCategory.slice(0, 3).map((p) => ({ p, extra: false }));
    if (picks.length < 3) {
      const rest = inBudget
        .filter((p) => p.cat !== ans.need)
        .sort(byRank)
        .slice(0, 3 - picks.length)
        .map((p) => ({ p, extra: true }));
      picks.push(...rest);
    }
    return picks;
  }, [done, ans]);

  // Preload result photos before revealing them, so the payoff screen never
  // flashes empty white cards.
  const [imagesReady, setImagesReady] = useState(false);
  useEffect(() => {
    if (!done || matches.length === 0) { setImagesReady(false); return; }
    let cancelled = false;
    setImagesReady(false);
    Promise.all(
      matches.map(
        ({ p }) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = p.img;
          })
      )
    ).then(() => { if (!cancelled) setImagesReady(true); });
    const timer = window.setTimeout(() => { if (!cancelled) setImagesReady(true); }, 2500);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [done, matches]);

  const widenBudget = () => setStep(1); // jump back to budget question
  const changeCategory = () => setStep(2); // jump back to need/category
  const startOver = () => setStep(0);

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent
        aria-labelledby={titleId}
        className="max-w-2xl bg-flour p-6 md:p-10"
      >
        <DialogHeader className="text-left">
          <p className="eyebrow mb-1">Gift Finder</p>
          <DialogTitle id={titleId} className="font-display text-2xl font-semibold text-crust md:text-3xl">
            {done ? "Here's what I'd get them" : questions[step].q}
          </DialogTitle>
          <DialogDescription className="text-crumb">
            {done
              ? `Based on: ${Object.values(ans).filter(Boolean).join(" · ")}`
              : `Question ${step + 1} of ${questions.length}`}
          </DialogDescription>
        </DialogHeader>

        {!done ? (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {questions[step].opts.map((o) => (
              <button
                key={o}
                onClick={() => { const next = { ...ans, [questions[step].key]: o }; setAns(next); trackEvent("quiz_step", { step: step + 1, key: questions[step].key, answer: o }); if (step + 1 >= questions.length) { trackEvent("quiz_complete", { who: next.who, budget: next.budget, need: next.need, style: next.style }); } setStep(step + 1); }}
                className="min-h-[52px] rounded-xl border-[1.5px] border-parchment-deep bg-white px-4 py-3 text-left font-semibold text-crust transition-all hover:-translate-y-0.5 hover:border-honey hover:shadow-lg"
              >
                {o}
              </button>
            ))}
          </div>
        ) : (
          <div aria-live="polite">
            {matches.length === 0 ? (
              <div className="mt-2 rounded-xl border-2 border-dashed border-parchment-deep bg-white p-6 text-center">
                <p className="font-display text-lg font-semibold text-crust">Nothing lands inside that budget.</p>
                <p className="mt-1 text-sm text-crumb">Try widening the budget or picking a different category.</p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <button onClick={widenBudget} className="min-h-[44px] rounded-full border-[1.5px] border-crust px-5 py-2 font-bold text-crust hover:bg-crust hover:text-flour">Widen budget</button>
                  <button onClick={changeCategory} className="min-h-[44px] rounded-full border-[1.5px] border-crust px-5 py-2 font-bold text-crust hover:bg-crust hover:text-flour">Change category</button>
                  <button onClick={startOver} className="min-h-[44px] rounded-full bg-cranberry px-5 py-2 font-bold text-flour hover:bg-cranberry-deep">Start over</button>
                </div>
              </div>
            ) : (
              <>
                <p className="sr-only">{matches.length} gift{matches.length !== 1 ? "s" : ""} found within your budget.</p>
                {!imagesReady ? (
                  <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3" aria-hidden>
                    {matches.map(({ p }) => (
                      <div key={p.slug} className="rounded-xl border border-parchment-deep bg-parchment/50 p-3">
                        <div className="mx-auto h-32 animate-pulse rounded-lg bg-parchment-deep/40" />
                        <div className="mt-3 h-3 w-3/4 animate-pulse rounded bg-parchment-deep/40" />
                        <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-parchment-deep/40" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {matches.map(({ p, extra }) => (
                      <a key={p.slug} href={p.url} target="_blank" rel="nofollow sponsored noopener noreferrer" onClick={() => trackEvent("quiz_pick_click", { slug: p.slug, brand: p.brand, extra, price: priceNum(p) })} className="group relative rounded-xl border border-parchment-deep bg-white p-3 transition-transform hover:-translate-y-1">
                        {extra && (
                          <span className="absolute right-2 top-2 rounded-full bg-honey/25 px-2 py-0.5 text-[.65rem] font-bold uppercase tracking-wide text-crust">
                            Also worth a look
                          </span>
                        )}
                        <img src={p.img} alt={p.name} className="mx-auto h-32 object-contain" style={{ mixBlendMode: "multiply" }} />
                        <p className="mt-2 line-clamp-2 font-display text-sm font-semibold text-crust">{p.name}</p>
                        <p className="mt-1 text-xs text-crumb">{p.brand}</p>
                        <p className="mt-1 font-bold text-cranberry">{priceStr(p)}</p>
                      </a>
                    ))}
                  </div>
                )}
                {matches.some((m) => m.extra) && (
                  <p className="mt-3 text-xs text-crumb">
                    Only {matches.filter((m) => !m.extra).length} {ans.need} pick{matches.filter((m) => !m.extra).length === 1 ? "" : "s"} land in that budget, so I added a couple of close cousins.
                  </p>
                )}
                <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={startOver} className="min-h-[44px] rounded-full border-[1.5px] border-crust px-5 py-2 font-bold text-crust hover:bg-crust hover:text-flour">Start over</button>
                  <button onClick={onClose} className="min-h-[44px] rounded-full bg-cranberry px-5 py-2 font-bold text-flour hover:bg-cranberry-deep">Done</button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ============ Page ============ */
export default function HolidayGiftGuide() {
  const location = useLocation();
  useEffect(() => {
    const anchor = document.getElementById(location.hash.slice(1));
    if (!anchor) return;
    const frame = requestAnimationFrame(() => anchor.scrollIntoView({ block: "start" }));
    return () => cancelAnimationFrame(frame);
  }, [location.hash]);

  const canonicalUrl = `${SITE_ORIGIN}${location.pathname === "/" ? "/" : location.pathname}`;

  useEffect(() => {
    trackEvent("page_view", { section: "holiday_gift_guide" });
  }, []);

  const [navOpen, setNavOpen] = useState(false);
  useEffect(() => {
    if (!navOpen) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setNavOpen(false); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navOpen]);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [band, setBand] = useState<string | null>(null);
  const [quiz, setQuiz] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(window.location.hash === "#saved");
  const { count: savedCount, has, toggle } = useWishlist();
  const guideSaved = has(holidayBakingGuide.slug);
  const [giveaway, setGiveaway] = useState(false);
  const searchInputId = useId();

  // Only claim success once the clipboard write actually resolves. If the
  // browser blocks it, show the code so it can be copied by hand.
  const copyCode = async (code: string, surface = "card") => {
    trackEvent("promo_code_copy", { code, surface });
    try {
      if (!navigator.clipboard?.writeText) throw new Error("no clipboard");
      await navigator.clipboard.writeText(code);
      toast.success(`Copied ${code}`);
    } catch {
      toast.error(`Copy blocked. Use code: ${code}`, { duration: 8000 });
    }
  };

  const clearAllFilters = () => {
    setSearch(""); setCat(null); setBand(null);
  };
  const anyFilter = search.trim() !== "" || !!cat || !!band;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (cat && p.cat !== cat) return false;
      if (band) {
        const b = bandByLabel(band);
        if (b && !b.test(priceNum(p))) return false;
      }
      if (q && !`${p.name} ${p.brand} ${p.desc}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, cat, band]);

  const byCat = useMemo(() => {
    const map = new Map<string, Product[]>();
    for (const p of filtered) {
      if (!map.has(p.cat)) map.set(p.cat, []);
      map.get(p.cat)!.push(p);
    }
    return map;
  }, [filtered]);

  const top6 = top6Slugs.map((s) => products.find((p) => p.slug === s)).filter(Boolean) as Product[];
  // Positions 1-6 come from the curated slugs; 7-10 live in topPicks.ts.
  const top10: TopPick[] = [
    ...top6.map((p) => ({ id: p.slug, name: p.name, img: p.img, url: p.url, price: priceNum(p), desc: p.desc, seller: p.brand, code: p.code })),

  ];



  // JSON-LD for the curated guide (only fully-verified products).
  const jsonLd = useMemo(() => {
    const items = products
      .filter((p) => isValidUrl(p.url) && p.img && priceNum(p) > 0)
      .map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: p.name,
          brand: { "@type": "Brand", name: p.brand },
          image: p.img.startsWith("http") ? p.img : `${SITE_ORIGIN}${p.img}`,
          url: p.url,
          offers: {
            "@type": "Offer",
            price: priceNum(p),
            priceCurrency: "USD",
          },
        },
      }));
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://bakinggreatbread.com/#organization",
          name: "Baking Great Bread at Home",
          alternateName: "Crust & Crumb Academy",
          url: "https://bakinggreatbread.com/",
          sameAs: [
            "https://bakinggreatbread.blog/",
            "https://www.youtube.com/@henryhunterjr",
            "https://www.skool.com/crust-crumb-academy-7621",
          ],
        },
        {
          "@type": "Person",
          "@id": "https://bakinggreatbread.com/#henry-hunter",
          name: "Henry Hunter",
          jobTitle: "Founder & Bread Baking Instructor",
          worksFor: { "@id": "https://bakinggreatbread.com/#organization" },
          url: "https://bakinggreatbread.com/about",
          sameAs: ["https://www.youtube.com/@henryhunterjr"],
        },
        {
          "@type": "WebPage",
          "@id": `${SITE_ORIGIN}/#webpage`,
          name: "The Bread Lover's Holiday Gift Guide 2026",
          url: `${SITE_ORIGIN}/`,
          datePublished: "2026-11-19",
          dateModified: "2026-11-19",
          author: { "@id": "https://bakinggreatbread.com/#henry-hunter" },
          publisher: { "@id": "https://bakinggreatbread.com/#organization" },
          description: "The 2026 holiday gift guide for bread bakers. Handpicked tools, wood bowls, lames, and books from Henry Hunter.",
        },
        {
          "@type": "ItemList",
          name: "Holiday Gift Guide 2026 — Curated picks",
          itemListElement: items,
        },
        breadcrumbJsonLd([{ name: "Holiday Gift Guide 2026", path: "/" }]),
      ],
    };
  }, []);

  // Saved gifts are stored as slugs; resolve them back to card data on demand.
  const wishlistLookup = (slug: string): WishlistItem | undefined => {
    if (slug === holidayBakingGuide.slug) return holidayBakingGuide;
    const maker = makers.find(m => m.items.some(p => `${m.id}:${p.slug}` === slug));
    const item = maker?.items.find(p => `${maker.id}:${p.slug}` === slug);
    if (maker && item) return {slug,name:item.name,brand:maker.brand,img:item.img,url:item.url,priceLabel:item.priceLabel};
    const p = products.find((x) => x.slug === slug);
    if (!p) return undefined;
    return {
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      img: p.img,
      url: p.url,
      priceLabel: priceNum(p) === 0 ? "Free" : priceStr(p),
    };
  };

  return (
    <div className="holiday-editorial min-h-screen bg-flour text-ink">
      <Helmet>
        <title>Bread Lover's Holiday Gift Guide 2026 | Baking Great Bread</title>
        <meta name="description" content="The 2026 gift guide for bread bakers. Handpicked tools, lames, and books from Henry Hunter, with promo codes built in." />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Holiday Gift Guide 2026 | Bread Baker Essentials" />
        <meta property="og:description" content="The 2026 curated gift guide for bread bakers and sourdough obsessives. Real recommendations from Henry Hunter." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={`${SITE_ORIGIN}/og-image.png`} />
        <meta name="twitter:title" content="Holiday Gift Guide 2026 | Bread Baker Essentials" />
        <meta name="twitter:description" content="Curated 2026 gifts for bread bakers and sourdough enthusiasts." />
        <meta name="twitter:image" content={`${SITE_ORIGIN}/og-image.png`} />
      </Helmet>
      <script
        type="application/ld+json"

        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <a className="skip-guide" href="#browse">Skip to gifts</a>
      <div className="season-note">A little thought. A lot of good bread. <span>THE HOLIDAY EDIT 2026</span></div>
      <header className="editorial-header">
        <a href="#top" className="editorial-brand"><img src="/brand-logos/academy-crest.webp" alt="Crust & Crumb Academy" width="720" height="405" /><span>Baking Great Bread at Home<strong>Crust &amp; Crumb Academy</strong><small>A holiday guide by Henry Hunter</small></span></a>
        <div className="header-actions">
          <button type="button" className="mobile-browse" aria-expanded={navOpen} aria-controls="gift-guide-nav" onClick={() => setNavOpen(open => !open)}>Browse gifts <ChevronDown size={16} aria-hidden /></button>
          <a className="about-henry" href="https://bakinggreatbread.com/about" target="_blank" rel="noopener noreferrer">About Henry Hunter</a><button onClick={() => setWishlistOpen(true)} className="saved-control" aria-label={`Saved gifts, ${savedCount} saved`}><Heart size={17} aria-hidden /> <span>Saved</span> {savedCount}</button></div>
        <nav aria-label="Main navigation" id="gift-guide-nav" className={navOpen ? "is-open" : undefined} onClick={() => setNavOpen(false)}><a href="#makers">Shop by maker</a><a href="#grain-to-gift">Grain &amp; flour</a><a href="#browse">All gifts</a></nav>
      </header>
      <WishlistDrawer open={wishlistOpen} onClose={() => setWishlistOpen(false)} lookup={wishlistLookup} />
      <main id="top">
        <section className="editorial-hero">
          <div className="hero-copy"><p className="edition-label">THE BREAD LOVER’S GIFT GUIDE</p>
            <h1>For the hands<br />that <em>make<br className="desktop-break" /> the magic.</em></h1>
            <p>Thoughtful tools. Beautiful ingredients. Gifts for the people who turn flour into something worth sharing.</p>
            <div className="hero-actions"><Link className="christmas-gift-link" to="/academy-gift-certificate" onClick={() => trackEvent("academy_cert_cta_click", { surface: "hero" })}><Gift size={30} aria-hidden /><span><strong>Gift a Crust &amp; Crumb Academy membership</strong><small>One year for $45 this Christmas <span className="whitespace-nowrap">(25% off)</span></small></span><span aria-hidden>→</span></Link><button type="button" onClick={() => { trackEvent("quiz_start", { surface: "hero" }); setQuiz(true); }}>Help me choose <span aria-hidden>↗</span></button></div>
            <p className="curator-line">Curated by Henry Hunter <span>For a season of giving well.</span></p>
          </div>
          <div className="hero-composition" aria-label="A selection from the holiday gift edit">
            <div className="hero-arch" aria-hidden />
            <a className="hero-main-photo" href={products.find(p => p.slug === "challenger-pan")?.url} target="_blank" rel="nofollow sponsored noopener noreferrer"><img src="/product-images/challenger-bread-pan.jpg" alt="Challenger Bread Pan with a freshly baked loaf" width="650" height="650" fetchPriority="high" /><span>THE BAKE-DAY UPGRADE <b>Challenger Bread Pan ↗</b></span></a>
            <a className="hero-detail-photo" href={products.find(p => p.slug === "walnut-17")?.url} target="_blank" rel="nofollow sponsored noopener noreferrer"><img src="/product-images/walnut-bowl-17.jpg" alt="Handcrafted walnut bowl from Holland Bowl Mill" width="300" height="250" /><span>Made to be kept.</span></a>
            <a className="hero-holiday-logo" href="https://recipepantry.app/holiday-bake" target="_blank" rel="noopener noreferrer"><img src="/brand-logos/recipe-pantry.webp" alt="Explore the Recipe Pantry Holiday Collection" width="300" height="220" /></a>
          </div>
        </section>
        <div className="editorial-strip"><a href="#free-holiday-guide" className="guide-strip-link"><strong>FREE</strong> Holiday Baking Guide ↓</a><span>Handpicked by Henry</span><span>Affiliate links support free recipes</span></div>
        <section className="give-bread-banner" aria-labelledby="give-bread-title">
          <img src="/brand-logos/give-bread-instead-2026.webp" alt="Give Bread Instead. This holiday season, give bread instead. Campaign details coming soon." width="2048" height="682" loading="lazy" />
          <div className="give-bread-caption"><h2 id="give-bread-title">Give Bread Instead</h2><p>Nothing to buy. Just bake, wrap, and give.</p><span>Our annual community campaign. Details coming soon.</span></div>
          <p className="sr-only">For five years our community has baked a loaf, wrapped it, and given it to someone who matters. This year Baking Great Bread at Home, Crust &amp; Crumb Academy, and From Oven to Market are working on a way for every loaf to do a little good beyond your own table.</p>
        </section>
        <section id="makers" className="edit-section"><h2 className="text-4xl mb-8">Shop by need. Find your maker.</h2><div className="maker-doors">{makers.map(m => <a key={m.id} href={`/makers/${m.id}/`} onClick={() => trackEvent("maker_door_click", { maker_id: m.id, brand: m.brand })}><div><small>{m.brand}</small><h3>{m.title}</h3><span>Explore {m.items.length} gifts ↗</span></div><img src={m.items[0].img} alt="" loading="lazy" /></a>)}</div></section>
        <section id="free-holiday-guide" className="holiday-guide-feature" aria-labelledby="free-holiday-title">
          <a className="holiday-guide-art" href={holidayBakingGuide.url} target="_blank" rel="noopener noreferrer" aria-label="Open the free Holiday Baking Guide">
            <img src={holidayBakingGuide.img} alt="Henry Hunter with challah, panettone and Christmas stollen" width="1672" height="941" loading="lazy" />
          </a>
          <div className="holiday-guide-copy">
            <p className="free-gift-tag">FREE</p>
            <h2 id="free-holiday-title">Holiday Baking Guide</h2>
            <p>Christmas morning cinnamon rolls. Stollen to wrap for a friend. Pick from 35 recipes and use my make-ahead calendar to plan your bake. This one's on me.</p>
            <div className="holiday-guide-actions">
              <a className="promo-action" href={holidayBakingGuide.url} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("free_guide_click", { slug: holidayBakingGuide.slug })}>Open my free guide ↗</a>
              <button type="button" className="save-free-guide" aria-pressed={guideSaved} onClick={() => toggle(holidayBakingGuide.slug)}>
                <Heart size={17} fill={guideSaved ? "currentColor" : "none"} aria-hidden />
                {guideSaved ? "Saved to my gift list" : "Save to my gift list"}
              </button>
            </div>
          </div>
        </section>
        <section id="grain-to-gift" className="grain-story">
          <div className="grain-intro"><p className="edition-label">FROM GRAIN TO SOMETHING GREAT</p><h2>A gift that starts<br />a whole new ritual.</h2><p>Fresh flour, a favorite grain, a reason to bake again tomorrow. Bring the mill and the ingredients together.</p></div>
          <div className="partner-spread">
            <article className="mill-feature"><a href="/makers/nutrimill/" onClick={() => trackEvent("maker_door_click", { maker_id: "nutrimill", brand: "NutriMill" })}><img src="/product-images/nutrimill-classic-holiday.webp" alt="NutriMill Classic grain mill" width="700" height="700" loading="lazy" /></a><div><div className="partner-identity"><span className="partner-name">NUTRIMILL</span><a href="/makers/nutrimill/" onClick={() => trackEvent("maker_door_click", { maker_id: "nutrimill", brand: "NutriMill" })}><img src="/brand-logos/nutrimill-starburst.jpg" alt="NutriMill" width="92" height="82" /></a></div><h3>Make fresh flour part of the everyday.</h3><p>Explore home milling with the NutriMill Classic. Compare mills, mixers and prices in our NutriMill collection.</p><button className="partner-code" onClick={() => copyCode("ACADEMY26")} aria-label="Copy NutriMill code ACADEMY26"><Copy size={14} /> ACADEMY26 <small>Copy code</small></button><a className="editorial-text-link" href="/makers/nutrimill/" onClick={() => trackEvent("maker_door_click", { maker_id: "nutrimill", brand: "NutriMill" })}>Explore NutriMill <span aria-hidden>↗</span></a></div></article>
            <article className="grain-feature"><a href="/makers/grand-teton/" onClick={() => trackEvent("maker_door_click", { maker_id: "grand-teton", brand: "Grand Teton Ancient Grains" })}><img src="/product-images/grand-teton-holiday.webp" alt="Grand Teton Ancient Grains spelt berries, whole grain einkorn flour and emmer berries" width="700" height="600" loading="lazy" /></a><div><div className="partner-identity"><span className="partner-name">GRAND TETON ANCIENT GRAINS</span><a href="/makers/grand-teton/" onClick={() => trackEvent("maker_door_click", { maker_id: "grand-teton", brand: "Grand Teton Ancient Grains" })}><img src="/brand-logos/grand-teton-mark.png" alt="Grand Teton Ancient Grains" width="92" height="82" /></a></div><h3>Good bread begins with good grain.</h3><p>Explore einkorn, spelt and emmer from this family farm and mill in Idaho.</p><button className="partner-code" onClick={() => copyCode("crustandcrumb")} aria-label="Copy Grand Teton code crustandcrumb"><Copy size={14} /> crustandcrumb <small>Copy code</small></button><p className="offer-detail">10% off your first order through December 31, 2026.</p><a className="editorial-text-link" href="/makers/grand-teton/" onClick={() => trackEvent("maker_door_click", { maker_id: "grand-teton", brand: "Grand Teton Ancient Grains" })}>Explore grains & prices <span aria-hidden>↗</span></a></div></article>
          </div>
          <div className="grain-resources"><span>A little guidance for the first batch.</span><a href="https://grains.bakinggreatbread.com" target="_blank" rel="noopener noreferrer">Henry’s grain guide ↗</a></div>
        </section>
        <section id="ancient-grain-challenge" className="grain-challenge-feature" aria-labelledby="grain-challenge-title">
          <a href="https://challenge.bakinggreatbread.com/#me" target="_blank" rel="noopener noreferrer" aria-label="Register for the Ancient Grain Challenge">
            <img src="/brand-logos/ancient-grain-challenge.webp" alt="Weekly 5 lb bags of ancient grain, a 25 lb grain grand prize and a Bosch Universal Plus mixer giveaway" width="1800" height="599" loading="lazy" />
          </a>
          <div className="grain-challenge-caption">
            <div>
              <h2 id="grain-challenge-title">Ancient Grain Challenge</h2>
              <p>Register free for the December 1 Bosch Universal Plus mixer drawing. Complete one lesson to qualify for weekly 5 lb grain prizes, or all seven for a chance at the 25 lb bag from Grand Teton Ancient Grains.</p>
            </div>
            <a className="promo-action" href="https://challenge.bakinggreatbread.com/#me" target="_blank" rel="noopener noreferrer">Register free ↗</a>
          </div>
        </section>
        {/* Top 10 */}
        <section id="top6" className="edit-section py-16">
          <div className="mx-auto max-w-[1200px] px-5">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow" style={{ color: "hsl(var(--honey))" }}>THE GIFTS I’D GIVE</p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-flour md:text-5xl">Henry's Top Picks</h2>
              </div>
              <p className="max-w-[52ch] text-[hsl(37_35%_75%)]">A few good things for the flour-dusted counter. Start here, then find your own favorites.</p>
            </div>
            <article id="cambro-6qt" className="cambro-pick" data-product={seasonalTools.cambro.slug} data-brand="Cambro">
              <a href={seasonalTools.cambro.url} target="_blank" rel="nofollow sponsored noopener noreferrer" aria-label="View the Cambro container on Amazon">
                <img src={seasonalTools.cambro.img} width="600" height="600" alt="Clear 6-quart Cambro dough container with measurements and a red lid" loading="eager" />
              </a>
              <div>
                <h3>{seasonalTools.cambro.name}</h3>
                <p>{seasonalTools.cambro.note}</p>
                <a className="cambro-buy" href={seasonalTools.cambro.url} target="_blank" rel="nofollow sponsored noopener noreferrer">Shop Cambro on Amazon <ExternalLink size={18} aria-hidden /></a>
                <small>{seasonalTools.cambro.detail}</small>
              </div>
            </article>
            <div className="featured-grid">
              {top10.map((p) => (
                <article key={p.id} data-product={p.id} data-brand={p.seller} className="holiday-product-card holiday-featured-card">
                  <a href={p.url} target="_blank" rel="nofollow sponsored noopener noreferrer" aria-label={`Shop ${p.name}`}>
                    <ProductPhoto src={p.img} name={p.name} />
                  </a>
                  <div className="holiday-card-body">
                    <p className="holiday-card-brand">{p.seller ?? "HENRY’S EDIT"}</p><h3 className="font-display text-xl font-semibold leading-tight text-crust">{p.name}</h3>
                    {p.desc && <p className="mt-2 text-sm leading-relaxed text-crumb">{p.desc}</p>}
                    <div className="mt-auto pt-5">
                      {p.code && (
                        <button type="button" onClick={() => copyCode(p.code!)} className="code-pill mb-3 min-h-[44px]" aria-label={`Copy promo code ${p.code}`}>
                          <Copy className="h-3 w-3" /> {p.code}
                        </button>
                      )}
                      <a href={p.url} target="_blank" rel="nofollow sponsored noopener noreferrer" className="holiday-shop-link" onClick={() => trackEvent("outbound_affiliate_click", { slug: p.id, brand: p.seller ?? "Henrys Edit", section: "top_picks", price: p.price, has_code: Boolean(p.code) })}>
                        {p.cta ?? "Shop this gift"} <ExternalLink className="h-4 w-4" aria-hidden />
                      </a>
                      <p className="mt-3 text-xl font-bold text-evergreen-deep">${p.price.toFixed(2)}</p><p className="mt-1 text-xs text-crumb">USD · Reference price checked {products.find(x => x.slug === p.id)?.priceChecked ?? PRICES_LAST_CHECKED}. Confirm final price and stock at checkout.</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-6 text-center text-sm text-[hsl(37_35%_75%)]">
              Need help choosing tools?{" "}
              <Link to="/essential-baking-tools" className="font-semibold text-honey underline underline-offset-2 hover:text-flour">
                See the essential baking tools checklist
              </Link>
              .
            </p>
          </div>
        </section>


        <section className="academy-gift" id="academy-gift" aria-labelledby="academy-gift-title">
          <div className="academy-gift-face">
            <img src="/brand-logos/academy-crest.webp" alt="Crust & Crumb Academy" width="720" height="405" loading="lazy" />
            <div>
              <p className="academy-gift-label">Christmas gift certificate</p>
              <h2 id="academy-gift-title">A year of baking together.</h2>
              <p>Give your baker an annual Crust &amp; Crumb Academy membership. Bring the dough questions. Pull up a chair for a Saturday bake-along.</p>
            </div>
          </div>
          <div className="academy-gift-stub">
            <p className="academy-gift-label">One year of membership</p>
            <p className="academy-gift-price"><strong>$45</strong> <span>Regularly <s>$60</s></span></p>
            <p className="academy-gift-saving">Save $15 this Christmas · 25% off</p>
            <Link to="/academy-gift-certificate" onClick={() => trackEvent("academy_cert_cta_click", { surface: "mid_page_card" })}>View the Christmas gift certificate <span aria-hidden="true">↗</span></Link>
          </div>
        </section>

        {/* Partner Discount Codes cheat sheet */}
        <section id="promo-codes" className="partner-codes-bar" aria-labelledby="promo-codes-title">
          <div className="mx-auto max-w-[1200px] px-5">
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="promo-codes-title" className="font-display text-2xl font-semibold text-crust">Partner Discount Codes</h2>
              <span className="text-xs text-crumb">Tap any code to copy before checkout</span>
            </div>
            <div className="partner-codes-grid">
              {promoCodes.map(([code, label]) => (
                <div key={code} className="partner-code-row">
                  <span className="text-sm text-crust">{label}</span>
                  {code === "Discount built in" ? (
                    <span className="text-xs font-bold text-evergreen-deep">Auto-applied via link</span>
                  ) : (
                    <button
                      type="button"
                      className="code-pill min-h-[40px]"
                      onClick={() => copyCode(code, "promo_codes_bar")}
                      aria-label={`Copy promo code ${code}`}
                    >
                      <Copy className="h-3.5 w-3.5" aria-hidden /> {code}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Browse block. The sticky filter bar lives inside this wrapper, so it
            only follows the visitor through the section it actually filters. */}
        <div id="browse" className="relative">
        {/* Filter bar — sticky on desktop only, scoped to #browse. */}
        <div className="z-40 border-b border-parchment-deep bg-flour md:sticky md:top-[64px] md:bg-flour/95 md:backdrop-blur">
          <div className="mx-auto max-w-[1200px] px-5 py-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative min-w-[180px] flex-1">
                <label htmlFor={searchInputId} className="sr-only">Search the main gift collection</label>
                <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-crumb" />
                <input
                  id={searchInputId}
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search the main gift collection…"
                  aria-label="Search the main gift collection"
                  className="min-h-[44px] w-full rounded-full border-[1.5px] border-parchment-deep bg-white py-2.5 pl-10 pr-10 text-sm focus:border-honey focus:outline-none focus:ring-2 focus:ring-honey/30"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-crumb hover:bg-parchment"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="-mx-1 flex flex-nowrap gap-2 overflow-x-auto px-1 pb-1 md:flex-wrap" style={{ scrollbarWidth: "none" }} role="group" aria-label="Category filters">
                <button aria-pressed={!cat} className={`chip min-h-[44px] ${!cat ? "on" : ""}`} onClick={() => setCat(null)}>All</button>
                {CATEGORIES.map((c) => (
                  <button key={c} aria-pressed={cat === c} className={`chip min-h-[44px] ${cat === c ? "on" : ""}`} onClick={() => { const next = cat === c ? null : c; setCat(next); trackEvent("filter_used", { filter_type: "category", value: next ?? "all" }); }}>{c}</button>
                ))}
              </div>
              <div className="-mx-1 flex flex-nowrap gap-2 overflow-x-auto px-1 pb-1 pr-4 md:flex-wrap" style={{ scrollbarWidth: "none" }} role="group" aria-label="Price filters">
                {PRICE_BANDS.map((b) => (
                  <button key={b.label} aria-pressed={band === b.label} className={`chip min-h-[44px] ${band === b.label ? "on price-on" : ""}`} onClick={() => { const next = band === b.label ? null : b.label; setBand(next); trackEvent("filter_used", { filter_type: "price_band", value: next ?? "all" }); }}>{b.label}</button>
                ))}
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-crumb" aria-live="polite">
              <span><b className="text-crust">{filtered.length}</b> gift{filtered.length !== 1 ? "s" : ""}</span>
              {anyFilter && (
                <>
                  <span aria-hidden>·</span>
                  <span className="truncate">
                    Active: {[search && `"${search}"`, cat, band].filter(Boolean).join(" · ")}
                  </span>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="ml-auto min-h-[36px] rounded-full border border-crust/40 px-3 py-1 text-xs font-bold text-crust hover:bg-crust hover:text-flour"
                  >
                    Clear all filters
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Jump nav for the main catalog */}
        <nav aria-label="Jump to section" className="border-b border-parchment-deep/60 bg-flour">
          <div className="mx-auto flex max-w-[1200px] flex-nowrap gap-2 overflow-x-auto px-5 py-2 text-xs md:flex-wrap" style={{ scrollbarWidth: "none" }}>
            <a href="#top6" className="chip min-h-[36px]">Top Picks</a>
            <button className="chip min-h-[36px]" onClick={() => { setBand("Under $25"); setCat(null); }}>Under $25</button>
            <button className="chip min-h-[36px]" onClick={() => { setCat("Starter Care"); setBand(null); }}>New Bakers</button>
            <button className="chip min-h-[36px]" onClick={() => { setCat("Scoring & Shaping"); setBand(null); }}>Serious Bakers</button>
            <a href="#market-sellers" className="chip min-h-[36px]">Market Sellers</a>
          </div>
        </nav>

        {/* The Counter: category aisles with progressive disclosure */}
        <section className="border-t border-parchment-deep/70 bg-parchment/30 py-16">
          <div className="mx-auto max-w-[1200px] px-5">
            <h2 className="mb-3 font-display text-3xl font-semibold text-crust md:text-4xl">Browse all baking gifts</h2>
            <p className="mb-6 text-xs text-crumb md:text-sm">
              Prices and availability may change. Some links are affiliate links, which support our free recipes at no additional cost to you. <span className="whitespace-nowrap">Reference prices from {PRICES_LAST_CHECKED}. Check current prices at the store.</span>
            </p>
            {(() => {
              // If a filter is active, show everything. Otherwise, cap the
              // initial view and let the user opt into the full catalog.
              const INITIAL_LIMIT = 12;
              const shouldCap = !anyFilter && !showAll;
              const displayList = shouldCap ? filtered.slice(0, INITIAL_LIMIT) : filtered;
              const displayByCat = new Map<string, Product[]>();
              for (const p of displayList) {
                if (!displayByCat.has(p.cat)) displayByCat.set(p.cat, []);
                displayByCat.get(p.cat)!.push(p);
              }
              return (
                <>
                  {CATEGORIES.map((c) => {
                    const items = displayByCat.get(c) || [];
                    if (items.length === 0) return null;
                    return (
                      <div key={c}>
                        <div className="mb-14">
                          <div className="mb-6 flex items-baseline gap-3.5 border-b-2 border-dashed border-parchment-deep pb-2.5">
                            <h3 className="font-display text-2xl font-semibold text-crust">{c}</h3>
                            <span className="text-xs text-crumb">{items.length} gift{items.length !== 1 ? "s" : ""}</span>
                          </div>
                          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {items.map((p) => <GiftTag key={p.slug} p={p} onCopyCode={copyCode} />)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {filtered.length === 0 && (
                    <div className="py-16 text-center">
                      <p className="text-crumb">No gifts match your filters.</p>
                      <button onClick={clearAllFilters} className="mt-4 min-h-[44px] rounded-full bg-cranberry px-5 py-2 font-bold text-flour hover:bg-cranberry-deep">Clear all filters</button>
                    </div>
                  )}
                  {!anyFilter && filtered.length > INITIAL_LIMIT && (
                    <div className="mt-2 flex justify-center">
                      <button
                        onClick={() => setShowAll((s) => !s)}
                        className="min-h-[44px] rounded-full border-[1.5px] border-crust bg-white px-6 py-2 font-bold text-crust hover:bg-crust hover:text-flour"
                      >
                        {showAll ? "Show fewer" : `View all ${filtered.length} gifts`}
                      </button>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </section>
        </div>
        {/* /browse — the sticky filter bar releases here */}

        {/* Krustic brand section */}
        <section id="krustic" className="scroll-mt-[150px] border-y border-parchment-deep bg-parchment/60 py-10">
         <details open className="mx-auto max-w-[1200px] px-5">
          <summary className="mb-6 flex cursor-pointer list-none items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Featured brand</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-crust md:text-4xl">Krustic <span className="font-hand text-2xl text-cranberry">Rise Above Tradition™</span></h2>
            </div>
            <ChevronDown aria-hidden className="h-5 w-5 flex-none text-crumb" />
          </summary>
          <div>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mt-3 max-w-[60ch] text-crumb">Heritage-inspired sourdough tools that honor the past and elevate your bake. Free shipping + 30-day returns.</p>
                <p className="mt-2 max-w-[60ch] text-sm text-crumb">
                  New to sourdough?{" "}
                  <Link to="/sourdough-starter-care-guide" className="font-semibold text-cranberry hover:underline">
                    Start with the starter care guide
                  </Link>
                  . Gummy loaves?{" "}
                  <Link to="/fix-gummy-dense-sourdough" className="font-semibold text-cranberry hover:underline">
                    Here's a troubleshooting guide
                  </Link>
                  .
                </p>
              </div>
              <button onClick={() => copyCode("BGBAH25")} className="code-pill min-h-[44px] text-base">
                <Copy className="h-4 w-4" /> Use code BGBAH25 for 10% off
              </button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleKrustic.map((k, i) => (
                <a key={i} href={k.url} target="_blank" rel="nofollow sponsored noopener noreferrer" className="holiday-product-card">
                  <ProductPhoto src={k.img} name={k.name} />
                  <div className="holiday-card-body">
                  <h3 className="font-display text-base font-semibold text-crust">{k.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-crumb">{k.desc}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-bold text-cranberry">{k.price}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-evergreen">Shop <ExternalLink className="h-3 w-3" /></span>
                  </div>
                  </div>
                </a>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-crumb">
              <a href="https://www.instagram.com/krustic_crafts/" target="_blank" rel="noopener noreferrer" className="hover:text-cranberry">Instagram</a>
              <a href="https://www.facebook.com/KrusticCrafts" target="_blank" rel="noopener noreferrer" className="hover:text-cranberry">Facebook</a>
              <a href="https://www.tiktok.com/@krustic" target="_blank" rel="noopener noreferrer" className="hover:text-cranberry">TikTok</a>
            </div>
          </div>
         </details>
        </section>

        {/* Shop More Baking Essentials — Amazon */}
        <section className="py-10">
         <details open className="mx-auto max-w-[1200px] px-5">
          <summary className="mb-8 flex cursor-pointer list-none items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Also on Amazon</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-crust md:text-4xl">Shop More Baking Essentials</h2>
            </div>
            <ChevronDown aria-hidden className="h-5 w-5 flex-none text-crumb" />
          </summary>
          <div>
            <p className="mb-2 max-w-[60ch] text-crumb">More tools for the baker on your list.</p>
            <p className="mb-6 text-sm text-crumb">As an Amazon Associate I earn from qualifying purchases. These are paid links. Check Amazon for current prices and availability.</p>
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
              {amazonProducts.map((a) => (
                <a key={a.url} href={a.url} target="_blank" rel="nofollow sponsored noopener noreferrer" className="holiday-product-card">
                  <ProductPhoto src={a.img} name={a.name} />
                  <div className="holiday-card-body">
                    <p className="holiday-card-brand">{a.category}</p>
                    <h3 className="font-display text-lg font-semibold leading-tight text-crust">{a.name}</h3>
                    {a.detail && <p className="mb-3 text-sm text-crumb">{a.detail}</p>}
                    <span className="holiday-amazon-link mt-auto">Check price on Amazon <ExternalLink className="h-4 w-4" aria-hidden /></span>
                  </div>
                </a>
              ))}
            </div>
          </div>
         </details>
        </section>

        {/* From Oven to Market */}
        <section id="market-sellers" className="scroll-mt-[150px] text-flour" style={{ background: "radial-gradient(700px 300px at 85% 0%, hsl(var(--honey) / 0.12), transparent 60%), linear-gradient(180deg, hsl(var(--evergreen-deep)), #1d2f23)" }}>
          <a
            href="https://fromoventomarket.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="block overflow-hidden border-y border-honey/40 bg-evergreen-deep"
            aria-label="Visit From Oven to Market"
          >
            <img
              src={fotmBanner}
              alt="From Oven to Market — turn Saturdays into income"
              loading="lazy"
              className="mx-auto block h-auto w-full max-w-[1600px] object-contain transition-transform duration-700 hover:scale-[1.02]"
            />
          </a>
          <div className="mx-auto max-w-[1200px] px-5 py-20">
            <p className="eyebrow" style={{ color: "hsl(var(--honey))" }}>From Oven to Market · For the baker ready to sell</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-flour md:text-5xl">Know someone turning Saturdays into income?</h2>
            <p className="mt-4 max-w-[62ch] text-[hsl(37_35%_82%)]">These are the exact market-booth essentials I use behind my own table. Pair any of them with the From Oven to Market course and you've given someone a business, not just a gift.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: "10x10 Market Canopy", desc: "Weatherproof cover for outdoor markets." },
                { name: "Canopy Weights (4-pack)", desc: "Keep the tent standing when the wind picks up." },
                { name: "A-Frame Chalkboard Sign", desc: "Handwrite the daily loaves and prices." },
                { name: "Kraft Bread Bags (100)", desc: "Branded-ready packaging your loaves deserve." },
              ].map((m, i) => (
                <div key={i} className="rounded-xl border border-honey/30 bg-flour/5 p-5">
                  <h3 className="font-display text-lg font-semibold text-flour">{m.name}</h3>
                  <p className="mt-1 text-sm text-[hsl(37_35%_82%)]">{m.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="https://fromoventomarket.com" target="_blank" rel="noopener noreferrer" className="rounded-full bg-cranberry px-6 py-3 font-bold text-flour hover:bg-cranberry-deep">See the Market Kit at From Oven to Market →</a>
              <a href="https://fromoventomarket.com/" target="_blank" rel="noopener noreferrer" className="rounded-full border-[1.5px] border-flour/40 px-6 py-3 font-bold text-flour hover:border-honey hover:text-honey">Gift the course at From Oven to Market</a>
            </div>
            <p className="mt-4 text-xs text-[hsl(37_25%_70%)]">The market kit and course live at fromoventomarket.com.</p>
          </div>
        </section>

        {/* Books shelf */}
        <section className="bg-parchment/50 py-10">
         <details open className="mx-auto max-w-[1200px] px-5">
          <summary className="mb-8 flex cursor-pointer list-none items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Stocking-sized, kitchen-tested</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-crust md:text-4xl">Books from my own oven</h2>
            </div>
            <ChevronDown aria-hidden className="h-5 w-5 flex-none text-crumb" />
          </summary>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {productsData.books.filter((b) => isValidUrl(b.url)).map((b) => (
                <a key={b.slug} href={b.url} target="_blank" rel="nofollow sponsored noopener noreferrer" className="group flex flex-col items-center text-center">
                  <img src={b.img} alt={b.name} loading="lazy" className="h-56 w-auto object-contain drop-shadow-xl motion-safe:transition-transform motion-safe:group-hover:-translate-y-2" />
                  <h3 className="mt-4 font-display text-sm font-semibold text-crust">{b.name}</h3>
                  <p className="mt-2 text-sm font-semibold text-evergreen">View book on Amazon</p>
                </a>
              ))}            </div>
         </details>
        </section>

        {/* Free gifts — shown once real download URLs are configured in products.json. */}
        {FREE_RESOURCES_ENABLED && (
          <section className="py-16" style={{ background: "hsl(38 60% 94%)" }}>
            <div className="mx-auto max-w-[1200px] px-5 text-center">
              <p className="eyebrow">On the house</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-crust md:text-4xl">Free gifts, from me to you</h2>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleFree.map((f) => (
                  <article
                    key={f.slug}
                    className="rounded-2xl border border-parchment-deep bg-white p-5 text-left shadow-sm transition-transform hover:-translate-y-1"
                  >
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block overflow-hidden rounded-xl bg-flour"
                    >
                      <img
                        src={f.img}
                        alt={f.name}
                        loading="lazy"
                        className="h-40 w-full object-cover"
                      />
                    </a>
                    <h3 className="mt-4 font-display text-xl font-semibold text-crust">{f.name}</h3>
                    <p className="mt-2 text-sm text-crumb">{f.desc}</p>
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-evergreen px-5 py-2.5 text-sm font-bold text-flour hover:bg-evergreen-deep"
                    >
                      
                      Get it free →
                    </a>
                  </article>
                ))}
                {/* Weekly Give Bread Instead gift tag set giveaway */}
                <article className="rounded-2xl border-2 border-honey/60 bg-white p-5 text-left shadow-md transition-transform hover:-translate-y-1">
                  <button
                    type="button"
                    onClick={() => { trackEvent("giveaway_modal_open", { surface: "free_gifts" }); setGiveaway(true); }}
                    className="block w-full overflow-hidden rounded-xl bg-[hsl(38_55%_92%)]"
                    aria-label="Enter the Give Bread Instead Gift Tag Set giveaway"
                  >
                    <img
                      src="/give-bread-instead-poster.jpg"
                      alt="Give Bread Instead Gift Tag Set"
                      loading="lazy"
                      className="mx-auto h-40 w-auto object-contain py-3"
                    />
                  </button>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="rounded-full bg-cranberry px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-flour">Weekly winner</span>
                  </div>
                  <h3 className="mt-2 font-display text-xl font-semibold text-crust">Give Bread Instead Gift Tag Set</h3>
                  <p className="mt-2 text-sm text-crumb">
                    Printable gift tag templates and greeting cards. Register to win — a new winner picked each week, November 5 through December 25.
                  </p>
                  <button
                    type="button"
                    onClick={() => { trackEvent("giveaway_modal_open", { surface: "free_gifts" }); setGiveaway(true); }}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-cranberry px-5 py-2.5 text-sm font-bold text-flour hover:bg-cranberry-deep"
                  >
                    
                    Enter to win →
                  </button>
                </article>
              </div>
            </div>
          </section>
        )}

        {/* A direct resource link until a real email-delivery integration is available. */}
        <section className="bg-evergreen-deep text-flour">
          <div className="mx-auto max-w-[900px] px-5 py-20 text-center">
            
            <h2 className="mt-4 font-display text-3xl font-semibold text-flour md:text-4xl">Give them something you baked.</h2>
            <p className="mx-auto mt-4 max-w-[48ch] text-parchment">Find your next bake in the Recipe Pantry. Pick a recipe, dust off the counter, and make something worth sharing.</p>
            <a href="https://pantry.bakinggreatbread.com/" target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-[48px] items-center rounded-full bg-flour px-7 py-3 font-bold text-evergreen-deep">Explore the Recipe Pantry</a>
          </div>
        </section>
      </main>

      <footer className="border-t border-honey/25 bg-oven text-flour"><div className="max-w-6xl mx-auto px-5 pt-6 flex flex-wrap gap-6 text-sm"><Link to="/saved-gifts" className="underline underline-offset-4 hover:text-honey">Your gift list</Link><a href="https://bakinggreatbread.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-honey">Privacy Policy</a><a href="https://bakinggreatbread.com/about" target="_blank" rel="noopener noreferrer" className="hover:text-honey">About &amp; Contact</a></div>
        <div className="mx-auto grid max-w-[1200px] gap-8 px-5 py-12 md:grid-cols-2">
          <div>
            <b className="font-display text-lg text-flour">Baking Great Bread at Home</b>
            <p className="mt-2 text-sm text-[hsl(37_35%_78%)]">Curated with flour-dusted hands by Henry Hunter.</p>
            <p className="mt-2 text-xs text-[hsl(37_25%_65%)]">Affiliate links support free recipes and lessons. I only recommend what I use.</p>
            <p className="mt-2 text-xs text-parchment">As an Amazon Associate I earn from qualifying purchases.</p>
          </div>
          <div className="flex flex-col gap-2 text-sm md:items-end">
            <a href="https://bakinggreatbread.blog" target="_blank" rel="noopener noreferrer" className="hover:text-honey">The Blog</a>
            <a href="https://bit.ly/3srdSYS" target="_blank" rel="noopener noreferrer" className="hover:text-honey">Facebook Community</a>
            <a href="https://www.youtube.com/@henryhunterjr" target="_blank" rel="noopener noreferrer" className="hover:text-honey">YouTube</a>
            <a href="https://fromoventomarket.com" target="_blank" rel="noopener noreferrer" className="hover:text-honey">From Oven to Market</a>
          </div>
        </div>
      </footer>

      <GiftFinderQuiz open={quiz} onClose={() => setQuiz(false)} />
      <GiveawayModal open={giveaway} onClose={() => setGiveaway(false)} />

    </div>
  );
}


