import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search, Share2, Copy, Snowflake, ExternalLink, Star, X, Sparkles, ChevronDown, Heart } from "lucide-react";
import { toast } from "sonner";
import productsData from "@/data/products.json";
import { krusticProducts } from "@/data/krustic";
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
import bakeryWindow from "@/assets/holiday/holiday-hero-2026.png.asset.json";
import bgbLogo from "@/assets/holiday/ornament-bgb-logo.png";
import ornBauble from "@/assets/holiday/ornament-bgb-bauble.png";
import ornCrust from "@/assets/holiday/ornament-crust-crumb.png";
import ornBanneton from "@/assets/holiday/ornament-banneton.png";
import ornMixerRed from "@/assets/holiday/ornament-mixer-red.jpg";
import ornStarter from "@/assets/holiday/ornament-starter-pack.jpg";
import ornHenryMixer from "@/assets/holiday/ornament-henry-mixer.jpg";
import fotmBanner from "@/assets/holiday/fotm-banner.jpg";
import bookSourdough from "@/assets/holiday/sourdough-rest-of-us-sharp.jpg";
import bookVitale from "@/assets/holiday/vitale-sourdough-mastery-sharp.jpg";
import bookFOTM from "@/assets/holiday/from-oven-to-market-sharp.jpg";
import bookLoaf from "@/assets/holiday/loaf-and-lie-sharp.jpg";
import bookJourney from "@/assets/holiday/bread-journey.jpg";
import giveBreadVideo from "@/assets/holiday/give-bread-instead.mp4.asset.json";
import giveBreadTag from "@/assets/holiday/give-bread-instead-tag.png.asset.json";
import { GiveawayModal } from "@/components/giveaway/GiveawayModal";
import { MusicPlayer } from "@/components/MusicPlayer";
import { WishlistDrawer, type WishlistItem } from "@/components/WishlistDrawer";
import { useWishlist } from "@/hooks/useWishlist";
import { breadcrumbJsonLd } from "@/components/seo/Breadcrumbs";

/* ============ Types & data ============ */
type Product = {
  slug: string;
  name: string;
  brand: string;
  price: number | string;
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

/* ============ Countdown ============ */
function useDaysToChristmas() {
  const [days, setDays] = useState(0);
  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const year = now.getMonth() === 11 && now.getDate() > 25 ? now.getFullYear() + 1 : now.getFullYear();
      const xmas = new Date(year, 11, 25);
      setDays(Math.max(0, Math.ceil((xmas.getTime() - now.getTime()) / 86400000)));
    };
    calc();
    const id = setInterval(calc, 60_000);
    return () => clearInterval(id);
  }, []);
  return days;
}

/* ============ Snow Canvas ============ */
function SnowCanvas({ on }: { on: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    if (!on) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const resize = () => {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const flakes = Array.from({ length: 70 }, () => ({
      x: Math.random() * c.width,
      y: Math.random() * c.height,
      r: 0.6 + Math.random() * 2.2,
      vy: 0.2 + Math.random() * 0.7,
      vx: -0.2 + Math.random() * 0.4,
      a: 0.35 + Math.random() * 0.45,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      for (const f of flakes) {
        f.y += f.vy;
        f.x += f.vx;
        if (f.y > c.height) { f.y = -5; f.x = Math.random() * c.width; }
        if (f.x < 0 || f.x > c.width) f.x = Math.random() * c.width;
        ctx.fillStyle = `rgba(255,250,235,${f.a})`;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [on]);
  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-[45] h-screen w-screen" />;
}

/* ============ Header Ornament Garland ============ */
const ORNAMENTS = [
  { src: ornBauble,     size: 62, drop: 14 },
  { src: ornCrust,      size: 56, drop: 26 },
  { src: ornBanneton,   size: 58, drop: 18 },
  { src: ornHenryMixer, size: 60, drop: 30 },
  { src: ornStarter,    size: 52, drop: 22 },
  { src: ornMixerRed,   size: 58, drop: 16 },
  { src: ornBauble,     size: 54, drop: 28 },
  { src: ornCrust,      size: 60, drop: 20 },
];

function HeaderGarland() {
  // The garland belongs to the hero. Once the visitor scrolls past it, fade it
  // out so it never hangs over live content further down the page.
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY < 160);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-full z-40 h-[120px] overflow-visible transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {/* String across the top */}
      <svg className="absolute inset-x-0 top-0 h-6 w-full" viewBox="0 0 1200 24" preserveAspectRatio="none">
        <path d="M0 4 Q 300 24 600 8 T 1200 4" stroke="hsl(var(--evergreen-deep))" strokeWidth="2" fill="none" opacity="0.85" />
      </svg>
      <div className="mx-auto flex max-w-[1200px] items-start justify-between px-6">
        {ORNAMENTS.map((o, i) => (
          <div
            key={i}
            className="ornament-sway relative"
            style={{
              // @ts-expect-error css var
              "--sway-a": `${-3 - (i % 3)}deg`,
              "--sway-b": `${3 + (i % 3)}deg`,
              animationDelay: `${(i * 0.35).toFixed(2)}s`,
              animationDuration: `${4 + (i % 4)}s`,
              marginTop: `${o.drop - 20}px`,
            }}
          >
            {/* twine */}
            <span
              className="absolute left-1/2 top-0 -z-10 block w-[2px] -translate-x-1/2 bg-[hsl(var(--twine))]"
              style={{ height: `${o.drop + 8}px` }}
            />
            <img
              src={o.src}
              alt=""
              className="ornament-twinkle block rounded-full object-cover"
              style={{
                width: o.size,
                height: o.size,
                marginTop: o.drop,
                animationDelay: `${(i * 0.25).toFixed(2)}s`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ Tiny holly icon (inline SVG) ============ */
function HollySprig({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 3c-1.6 2-4 2.4-6 1.6.4 2.2 2 4 4 4.4-2 .6-4 2.4-4.4 4.6 2-.8 4.4-.4 6 1.6 1.6-2 4-2.4 6-1.6-.4-2.2-2.4-4-4.4-4.6 2-.4 3.6-2.2 4-4.4-2 .8-4.4.4-5.2-1.6z" fill="#2f7d3a" stroke="#1c4a24" strokeWidth=".6"/>
      <circle cx="9.5" cy="15" r="1.4" fill="#e11d1d"/>
      <circle cx="13" cy="16.5" r="1.2" fill="#e11d1d"/>
      <circle cx="11.5" cy="13" r="1.1" fill="#e11d1d"/>
    </svg>
  );
}

/* ============ Gift Tag Card ============ */
function GiftTag({ p, onCopyCode }: { p: Product; onCopyCode: (code: string) => void }) {
  const num = priceNum(p);
  return (
    <article className="gift-tag">
      <span className="brand-chip">{p.brand}</span>
      <a href={p.url} target="_blank" rel="noopener noreferrer" className="flex h-[170px] items-center justify-center mb-3">
        <img src={p.img} alt={p.name} loading="lazy" className="max-h-full object-contain transition-transform group-hover:scale-105" style={{ mixBlendMode: "multiply" }} />
      </a>
      <h4 className="font-display text-[1.08rem] font-semibold text-crust mb-1 leading-tight">{p.name}</h4>
      <p className="text-[.86rem] text-[hsl(27_35%_28%)] mb-2 line-clamp-3">{p.desc}</p>
      {p.note && <p className="font-hand text-[1.12rem] text-cranberry-deep -rotate-1 mb-3">"{p.note}"</p>}
      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
        <span className={`font-bold text-[1.12rem] ${num === 0 ? "text-evergreen" : "text-crust"}`}>{num === 0 ? "Free" : priceStr(p)}</span>
        {p.code && (
          <button className="code-pill" onClick={() => onCopyCode(p.code!)}>
            <Copy className="h-3 w-3" /> {p.code}
          </button>
        )}
      </div>
      <div className="mt-3 flex gap-2">
        <a
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group/gift relative flex-1 overflow-hidden rounded-[10px] bg-evergreen px-3 py-[11px] text-center text-[.88rem] font-extrabold text-flour transition-colors hover:bg-evergreen-deep"
        >
          {/* mini string lights */}
          <span aria-hidden className="pointer-events-none absolute inset-x-1 top-1 flex justify-between">
            <i className="bulb block h-1.5 w-1.5 rounded-full bg-[#ffd166]" style={{ animationDelay: "0s", boxShadow: "0 0 6px #ffd166" }} />
            <i className="bulb block h-1.5 w-1.5 rounded-full bg-[#ef476f]" style={{ animationDelay: ".3s", boxShadow: "0 0 6px #ef476f" }} />
            <i className="bulb block h-1.5 w-1.5 rounded-full bg-[#06d6a0]" style={{ animationDelay: ".6s", boxShadow: "0 0 6px #06d6a0" }} />
            <i className="bulb block h-1.5 w-1.5 rounded-full bg-[#118ab2]" style={{ animationDelay: ".9s", boxShadow: "0 0 6px #118ab2" }} />
            <i className="bulb block h-1.5 w-1.5 rounded-full bg-[#ffd166]" style={{ animationDelay: "1.2s", boxShadow: "0 0 6px #ffd166" }} />
          </span>
          <span className="relative inline-flex items-center justify-center gap-1.5">
            <HollySprig className="h-4 w-4" />
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
          aria-label="Share"
        >
          <Share2 className="h-4 w-4" />
        </button>
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
                onClick={() => { setAns({ ...ans, [questions[step].key]: o }); setStep(step + 1); }}
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
                      <a key={p.slug} href={p.url} target="_blank" rel="noopener noreferrer" className="group relative rounded-xl border border-parchment-deep bg-white p-3 transition-transform hover:-translate-y-1">
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
  const days = useDaysToChristmas();
  const location = useLocation();
  const canonicalUrl = `https://gifts.bakinggreatbread.blog${location.pathname === "/" ? "/" : location.pathname}`;
  const [snow, setSnow] = useState(true);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [band, setBand] = useState<string | null>(null);
  const [quiz, setQuiz] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [music, setMusic] = useState(false);
  const [giveaway, setGiveaway] = useState(false);
  const searchInputId = useId();

  // Only claim success once the clipboard write actually resolves. If the
  // browser blocks it, show the code so it can be copied by hand.
  const copyCode = async (code: string) => {
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
          image: p.img,
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
          "@type": "WebPage",
          "@id": "https://gifts.bakinggreatbread.blog/#webpage",
          name: "The Bread Lover's Holiday Gift Guide 2026",
          url: "https://gifts.bakinggreatbread.blog/",
          description: "The 2026 holiday gift guide for bread bakers. Handpicked tools, wood bowls, lames, and books from Henry Hunter.",
        },
        {
          "@type": "ItemList",
          name: "Holiday Gift Guide 2026 — Curated picks",
          itemListElement: items,
        },
      ],
    };
  }, []);

  return (
    <div className="min-h-screen bg-flour text-ink">
      <Helmet>
        <title>Bread Lover's Holiday Gift Guide 2026 | Baking Great Bread</title>
        <meta name="description" content="The 2026 gift guide for bread bakers. Handpicked tools, lames, and books from Henry Hunter, with promo codes built in." />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Holiday Gift Guide 2026 | Bread Baker Essentials" />
        <meta property="og:description" content="The 2026 curated gift guide for bread bakers and sourdough obsessives. Real recommendations from Henry Hunter." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://gifts.bakinggreatbread.blog/og-image.png" />
        <meta name="twitter:title" content="Holiday Gift Guide 2026 | Bread Baker Essentials" />
        <meta name="twitter:description" content="Curated 2026 gifts for bread bakers and sourdough enthusiasts." />
        <meta name="twitter:image" content="https://gifts.bakinggreatbread.blog/og-image.png" />
      </Helmet>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-honey/25 bg-oven/95 text-flour backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center gap-3 px-4 py-2.5">
          <a href="#top" className="mr-auto flex items-center gap-2 font-display text-base font-semibold text-flour">
            <img
              src={bgbLogo}
              alt="Baking Great Bread at Home"
              className="ornament-twinkle h-9 w-9 rounded-full object-cover ring-1 ring-honey/40"
            />
            <span className="hidden sm:inline">Baking Great Bread at Home</span>
            <span className="sm:hidden">BGB</span>
          </a>
          <button
            onClick={() => setMusic((m) => !m)}
            aria-pressed={music}
            aria-label={music ? "Stop background music" : "Play background music"}
            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition-colors ${music ? "border-honey bg-honey/20 text-honey" : "border-honey/40 hover:bg-flour/10"}`}
          >
            {music ? <Music2 className="h-3 w-3" /> : <Music className="h-3 w-3" />}
            <span>🎄 Music</span>
          </button>
          <span className="rounded-full border border-honey/40 bg-cranberry/30 px-3 py-1 text-xs whitespace-nowrap">
            <b className="text-honey">{days}</b> days to Christmas
          </span>
          <button
            onClick={() => setSnow((s) => !s)}
            aria-pressed={snow}
            className={`hidden items-center gap-1 rounded-full border px-3 py-1 text-xs transition-colors sm:inline-flex ${snow ? "border-honey bg-flour/15" : "border-flour/30"}`}
          >
            <Snowflake className="h-3 w-3" /> Snow
          </button>
        </div>
        <HeaderGarland />
      </header>
      {/* Background music player — hidden YouTube iframe, click gesture allows autoplay */}
      {music && (
        <iframe
          key="bg-music"
          title="Background holiday music"
          src="https://www.youtube.com/embed/N91_IHbofhs?autoplay=1&loop=1&playlist=N91_IHbofhs&controls=0&modestbranding=1&rel=0"
          allow="autoplay"
          aria-hidden="true"
          tabIndex={-1}
          style={{ position: "fixed", left: -9999, top: -9999, width: 1, height: 1, border: 0, pointerEvents: "none" }}
        />
      )}

      <main id="top">
        {/* Hero */}
        <section className="relative overflow-hidden pt-[150px] text-flour" style={{ background: "radial-gradient(1200px 500px at 50% -10%, hsl(var(--honey) / 0.16), transparent 60%), linear-gradient(180deg, #17202b 0%, #1c1a14 45%, hsl(var(--oven)) 100%)" }}>
          <div className="relative z-20 mx-auto grid max-w-[1200px] items-center gap-10 px-5 pb-20 md:grid-cols-[1.05fr_0.95fr] md:gap-12">
            <div>
              <p className="eyebrow" style={{ color: "hsl(var(--honey))" }}>The 2026 Guide</p>
              <h1 className="mt-3 font-display font-medium" style={{ fontSize: "clamp(2.4rem, 5.6vw, 4.2rem)" }}>
                Every gift on this list has <em className="not-italic italic text-honey" style={{ fontVariationSettings: '"SOFT" 100' }}>flour on it.</em>
              </h1>
              <p className="mt-4 max-w-[46ch] text-[1.05rem]" style={{ color: "#e8dcc6" }}>
                Handpicked baking tools, wood bowls, lames, and books from Henry Hunter. Real gear I use, with promo codes built in.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => setQuiz(true)} className="inline-flex items-center gap-2 rounded-full bg-cranberry px-6 py-3 font-bold text-flour shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-cranberry-deep">
                  <Sparkles className="h-4 w-4" /> Open the Gift Finder
                </button>
                <a href="#top6" className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-flour/40 px-6 py-3 font-bold text-flour transition-colors hover:border-honey hover:text-honey">
                  See Henry's Top 6
                </a>
              </div>
              <p className="mt-5 text-sm" style={{ color: "#bfae92" }}>Affiliate links support free recipes. I only recommend what I use.</p>
            </div>
            <div
              className="relative overflow-hidden rounded-3xl"
              style={{
                boxShadow:
                  "0 0 0 4px #1a100a, 0 0 0 8px #3a2412, 0 24px 60px rgba(0,0,0,.6), 0 0 120px hsl(var(--honey) / 0.45)",
              }}
            >
              <img
                src={bakeryWindow.url}
                alt="Baking Great Bread at Home Holiday Shopper's Guide by Crust & Crumb Academy"
                className="block w-full"
                loading="eager"
              />
              <div
                className="pointer-events-none absolute inset-0 rounded-3xl"
                style={{ boxShadow: "inset 0 0 90px hsl(var(--honey) / 0.22)" }}
              />
            </div>
          </div>
        </section>
        {/* Site-wide snow, sits above hero and page, below modals */}
        <SnowCanvas on={snow} />

        {/* Promo marquee */}
        <div className="overflow-hidden border-y border-honey/30 bg-evergreen-deep text-flour">
          <div className="flex w-max animate-marquee gap-12 whitespace-nowrap py-3">
            {[...promoCodes, ...promoCodes, ...promoCodes].map(([code, brand], i) => (
              <span key={i} className="text-sm tracking-wide">
                <b className="font-display text-honey">{code}</b> · {brand}
              </span>
            ))}
          </div>
        </div>

        {/* Give Bread Instead campaign */}
        <section id="give-bread-instead" className="relative scroll-mt-[150px] overflow-hidden text-flour" style={{ background: "radial-gradient(900px 400px at 20% 0%, hsl(var(--cranberry) / 0.25), transparent 60%), linear-gradient(180deg, #2a1418 0%, #1c0f12 100%)" }}>
          <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 py-16 md:grid-cols-[1fr_1.1fr] md:py-20">
            <div>
              {/* Gift tag hanging as if tied to a package */}
              <div className="relative mb-8 flex justify-start" aria-hidden>
                <div className="relative">
                  <span
                    className="absolute left-1/2 -top-6 h-6 w-[2px] -translate-x-1/2 bg-[hsl(var(--twine))]"
                    style={{ background: "#c9a56a" }}
                  />
                  <img
                    src={giveBreadTag.url}
                    alt=""
                    className="ornament-sway block h-auto w-[130px] origin-top drop-shadow-2xl sm:w-[160px] md:w-[180px]"
                    style={{
                      transform: "rotate(-7deg)",
                      // @ts-expect-error css vars
                      "--sway-a": "-9deg",
                      "--sway-b": "-5deg",
                      animationDuration: "6s",
                    }}
                  />
                </div>
              </div>
              <p className="eyebrow" style={{ color: "hsl(var(--honey))" }}>A December tradition</p>
              <h2 className="mt-3 font-display font-medium text-flour" style={{ fontSize: "clamp(2rem, 4.4vw, 3.4rem)", lineHeight: 1.05 }}>
                Give <em className="not-italic italic text-honey">Bread</em> Instead.
              </h2>
              <p className="mt-4 max-w-[46ch] text-[1.05rem]" style={{ color: "#e8dcc6" }}>
                Skip the store-bought this year. A loaf you baked with your own hands says more than anything on a shelf. Watch the two-minute story, then pick a tool below to gift the baker in your life.
              </p>
              <p className="mt-3 text-sm" style={{ color: "#e8dcc6" }}>
                Baking your gift? <Link to="/how-to-wrap-sourdough-as-a-gift" className="font-semibold text-honey underline underline-offset-2 hover:text-flour">Learn how to wrap sourdough as a gift</Link>.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#top6" className="inline-flex items-center gap-2 rounded-full bg-cranberry px-6 py-3 font-bold text-flour shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-cranberry-deep" aria-label="Shop the 2026 Holiday Gift Guide">
                  <HollySprig className="h-4 w-4" /> Shop the guide
                </a>
                <button onClick={() => setQuiz(true)} className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-flour/40 px-6 py-3 font-bold text-flour transition-colors hover:border-honey hover:text-honey">
                  <Sparkles className="h-4 w-4" /> Find the perfect gift
                </button>
              </div>
            </div>
            <div
              className="relative overflow-hidden rounded-2xl"
              style={{
                boxShadow: "0 0 0 4px #1a100a, 0 0 0 8px #3a2412, 0 24px 60px rgba(0,0,0,.6), 0 0 100px hsl(var(--cranberry) / 0.35)",
              }}
            >
              <video
                src={giveBreadVideo.url}
                controls
                playsInline
                preload="metadata"
                className="block h-auto w-full"
              />
            </div>
          </div>
        </section>

        {/* Top 6 */}
        <section id="top6" className="scroll-mt-[150px] bg-gradient-to-b from-oven to-[hsl(24_38%_11%)] py-16 text-flour">
          <div className="mx-auto max-w-[1200px] px-5">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow" style={{ color: "hsl(var(--honey))" }}>If you only look at one shelf</p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-flour md:text-5xl">Henry's Top 6</h2>
              </div>
              <p className="max-w-[52ch] text-[hsl(37_35%_75%)]">The six gifts I'd put under my own tree. Proven, loved, and used until the paint wore off.</p>
            </div>
            <div className="grid grid-flow-col auto-cols-[minmax(230px,1fr)] gap-5 overflow-x-auto pb-6" style={{ scrollSnapType: "x mandatory" }}>
              {top6.map((p, i) => (
                <a key={p.slug} href={p.url} target="_blank" rel="noopener noreferrer" className="relative flex flex-col rounded-2xl bg-gradient-to-b from-[#fdf6e8] to-flour p-4 text-ink shadow-lg transition-transform hover:-translate-y-1.5" style={{ scrollSnapAlign: "start" }}>
                  <span className="absolute -left-2 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-cranberry font-display text-lg font-bold text-flour shadow-lg">{i + 1}</span>
                  <img src={p.img} alt={p.name} loading="lazy" className="mx-auto my-3 h-36 object-contain" style={{ mixBlendMode: "multiply" }} />
                  <h3 className="font-display text-[1.02rem] font-semibold text-crust">{p.name}</h3>
                  <p className="mt-auto pt-2 font-extrabold text-cranberry">{priceStr(p)}</p>
                </a>
              ))}
            </div>
            <div className="-mt-3 h-3.5 rounded bg-gradient-to-b from-[#5a3a20] to-[#3a2412] shadow-2xl" />
            <p className="mt-6 text-center text-sm text-[hsl(37_35%_75%)]">
              Need help choosing tools?{" "}
              <Link to="/essential-baking-tools" className="font-semibold text-honey underline underline-offset-2 hover:text-flour">
                See the essential baking tools checklist
              </Link>
              .
            </p>
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
                  <button key={c} aria-pressed={cat === c} className={`chip min-h-[44px] ${cat === c ? "on" : ""}`} onClick={() => setCat(cat === c ? null : c)}>{c}</button>
                ))}
              </div>
              <div className="-mx-1 flex flex-nowrap gap-2 overflow-x-auto px-1 pb-1 pr-4 md:flex-wrap" style={{ scrollbarWidth: "none" }} role="group" aria-label="Price filters">
                {PRICE_BANDS.map((b) => (
                  <button key={b.label} aria-pressed={band === b.label} className={`chip min-h-[44px] ${band === b.label ? "on price-on" : ""}`} onClick={() => setBand(band === b.label ? null : b.label)}>{b.label}</button>
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
              Prices and availability may change. Some links are affiliate links, which support our free recipes at no additional cost to you. <span className="whitespace-nowrap">Prices last checked {PRICES_LAST_CHECKED}.</span>
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
                      <div key={c} className="mb-14">
                        <div className="mb-6 flex items-baseline gap-3.5 border-b-2 border-dashed border-parchment-deep pb-2.5">
                          <h3 className="font-display text-2xl font-semibold text-crust">{c}</h3>
                          <span className="text-xs text-crumb">{items.length} gift{items.length !== 1 ? "s" : ""}</span>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                          {items.map((p) => <GiftTag key={p.slug} p={p} onCopyCode={copyCode} />)}
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
                <a key={i} href={k.url} target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-parchment-deep bg-white p-4 shadow-md transition-transform hover:-translate-y-1.5">
                  <div className="mb-3 flex h-44 items-center justify-center overflow-hidden rounded-xl bg-flour/50">
                    <img src={k.img} alt={k.name} loading="lazy" className="max-h-full object-contain transition-transform group-hover:scale-105" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-crust">{k.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-crumb">{k.desc}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-bold text-cranberry">{k.price}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-evergreen">Shop <ExternalLink className="h-3 w-3" /></span>
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
            <p className="mb-6 max-w-[60ch] text-crumb">The Amazon-available gear that rounds out a serious baker's kitchen.</p>
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {amazonProducts.map((a, i) => (
                <a key={i} href={a.url} target="_blank" rel="noopener noreferrer" className="group flex flex-col rounded-xl border border-parchment-deep bg-white p-3 shadow transition-transform hover:-translate-y-1">
                  <span className="mb-2 w-fit rounded-full bg-parchment px-2 py-0.5 text-xs font-bold text-crumb">{a.category}</span>
                  <div className="mb-3 flex h-44 items-center justify-center overflow-hidden rounded-lg bg-white">
                    <img src={a.img} alt={a.name} loading="lazy" className="max-h-full object-contain transition-transform group-hover:scale-105" />
                  </div>
                  <h3 className="font-display text-sm font-semibold text-crust line-clamp-2">{a.name}</h3>
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className={`h-3.5 w-3.5 ${s < Math.round(a.rating) ? "fill-honey text-honey" : "fill-honey/30 text-honey/30"}`} />
                    ))}
                    <span className="ml-1 text-crumb">{a.rating}</span>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <span className="font-bold text-cranberry">{a.price}</span>
                    <span className="rounded bg-[#FF9900] px-2 py-1 text-xs font-bold text-black">View</span>
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
            <p className="mt-4 text-xs text-[hsl(37_25%_70%)]">As an Amazon Associate Henry earns from qualifying purchases. Booth gear links go to Amazon; the Kit and course live at fromoventomarket.com.</p>
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
              {[
                { name: "Sourdough for the Rest of Us", price: "$6.08", url: "https://amzn.to/sourdoughrestofus", img: bookSourdough },
                { name: "Vitale Sourdough Mastery", price: "$9.60", url: "https://vitalebreadco.com?ref=bfriedman", img: bookVitale },
                { name: "From Oven to Market", price: "$7.62", url: "https://fromoventomarket.com/", img: bookFOTM },
                { name: "The Loaf and the Lie", price: "$6.99", url: "https://amzn.to/loafandlie", img: bookLoaf },
                { name: "Bread: A Journey Through History", price: "$7.95", url: "https://amzn.to/breadjourney", img: bookJourney },
              ].map((b, i) => (
                <a key={i} href={b.url} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center text-center">
                  <img src={b.img} alt={b.name} loading="lazy" className="h-56 w-auto object-contain drop-shadow-xl transition-transform group-hover:-translate-y-2" />
                  <h3 className="mt-4 font-display text-sm font-semibold text-crust">{b.name}</h3>
                  <p className="mt-1 font-bold text-cranberry">{b.price}</p>
                </a>
              ))}
            </div>
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
                      <HollySprig className="h-4 w-4" />
                      Get it free →
                    </a>
                  </article>
                ))}
                {/* Weekly Give Bread Instead gift tag set giveaway */}
                <article className="rounded-2xl border-2 border-honey/60 bg-white p-5 text-left shadow-md transition-transform hover:-translate-y-1">
                  <button
                    type="button"
                    onClick={() => setGiveaway(true)}
                    className="block w-full overflow-hidden rounded-xl bg-[hsl(38_55%_92%)]"
                    aria-label="Enter the Give Bread Instead Gift Tag Set giveaway"
                  >
                    <img
                      src={giveBreadTag.url}
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
                    onClick={() => setGiveaway(true)}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-cranberry px-5 py-2.5 text-sm font-bold text-flour hover:bg-cranberry-deep"
                  >
                    <HollySprig className="h-4 w-4" />
                    Enter to win →
                  </button>
                </article>
              </div>
            </div>
          </section>
        )}

        {/* Newsletter */}
        <section className="text-flour" style={{ background: "linear-gradient(180deg, hsl(var(--oven)), hsl(24 40% 12%))" }}>
          <div className="mx-auto max-w-[900px] px-5 py-20 text-center">
            <p className="eyebrow" style={{ color: "hsl(var(--honey))" }}>Free with your email</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-flour md:text-4xl">The Holiday Bread Collection</h2>
            <p className="mt-4 text-[hsl(37_35%_82%)]">Drop your email and I'll send you the printable one-sheet holiday recipes. Print them, bake them, give them.</p>
            <form onSubmit={(e) => { e.preventDefault(); toast.success("You're on the list — check your inbox."); }} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
              <input type="email" required placeholder="your@email.com" className="flex-1 rounded-full border-[1.5px] border-honey/40 bg-flour/10 px-5 py-3 text-flour placeholder:text-[hsl(37_25%_65%)] focus:border-honey focus:outline-none" />
              <button type="submit" className="rounded-full bg-cranberry px-6 py-3 font-bold text-flour hover:bg-cranberry-deep">Send it</button>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-honey/25 bg-oven text-flour">
        <div className="mx-auto grid max-w-[1200px] gap-8 px-5 py-12 md:grid-cols-2">
          <div>
            <b className="font-display text-lg text-flour">Baking Great Bread at Home</b>
            <p className="mt-2 text-sm text-[hsl(37_35%_78%)]">Curated with flour-dusted hands by Henry Hunter.</p>
            <p className="mt-2 text-xs text-[hsl(37_25%_65%)]">Affiliate links support free recipes and lessons. I only recommend what I use.</p>
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
