import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Search, Share2, Copy, Snowflake, ExternalLink, Star, X, Sparkles, ChevronDown } from "lucide-react";
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
import bakeryWindow from "@/assets/holiday/bakery-window.png";
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
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-full z-40 h-[120px] overflow-visible">
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
          onClick={() => {
            navigator.share?.({ title: p.name, url: p.url }).catch(() => {});
            navigator.clipboard?.writeText(p.url);
            toast.success("Link copied");
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

  const matches = useMemo(() => {
    if (!done) return [];
    // Budget is a HARD constraint: filter first, then score.
    const band = bandByLabel(ans.budget);
    const inBudget = band ? products.filter((p) => band.test(priceNum(p))) : products;
    return inBudget
      .map((p) => {
        let score = 0;
        if (p.cat === ans.need) score += 3;
        if (ans.who === "A new baker" && ["Starter Care", "Bake Day"].includes(p.cat)) score += 1;
        if (ans.who === "Obsessed sourdough baker" && ["Scoring & Shaping", "Proofing & Temp"].includes(p.cat)) score += 1;
        if (ans.who === "Market seller" && ["Storage & Gifting", "Wood & Serving"].includes(p.cat)) score += 1;
        if (ans.style === "Stocking stuffer" && priceNum(p) < 30) score += 1;
        if (ans.style === "Centerpiece gift" && priceNum(p) > 100) score += 1;
        if (ans.style === "Bundle" && /bundle/i.test(p.name)) score += 2;
        return { p, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((x) => x.p);
  }, [done, ans]);

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
                <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {matches.map((p) => (
                    <a key={p.slug} href={p.url} target="_blank" rel="noopener noreferrer" className="group rounded-xl border border-parchment-deep bg-white p-3 transition-transform hover:-translate-y-1">
                      <img src={p.img} alt={p.name} className="mx-auto h-32 object-contain" style={{ mixBlendMode: "multiply" }} />
                      <p className="mt-2 line-clamp-2 font-display text-sm font-semibold text-crust">{p.name}</p>
                      <p className="mt-1 text-xs text-crumb">{p.brand}</p>
                      <p className="mt-1 font-bold text-cranberry">{priceStr(p)}</p>
                    </a>
                  ))}
                </div>
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
  const [snow, setSnow] = useState(true);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [band, setBand] = useState<string | null>(null);
  const [quiz, setQuiz] = useState(false);

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    toast.success(`Copied ${code}`);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (cat && p.cat !== cat) return false;
      if (band) {
        const b = PRICE_BANDS.find((x) => x.label === band);
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

  return (
    <div className="min-h-screen bg-flour text-ink">
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

      <main id="top">
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 text-flour" style={{ background: "radial-gradient(1200px 500px at 50% -10%, hsl(var(--honey) / 0.16), transparent 60%), linear-gradient(180deg, #17202b 0%, #1c1a14 45%, hsl(var(--oven)) 100%)" }}>
          <div className="relative z-20 mx-auto grid max-w-[1200px] items-center gap-10 px-5 pb-20 md:grid-cols-[1.05fr_0.95fr] md:gap-12">
            <div>
              <p className="eyebrow" style={{ color: "hsl(var(--honey))" }}>The 2025 Guide</p>
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
                src={bakeryWindow}
                alt="Warm bakery kitchen at Christmas seen through a frosted window"
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
        <section id="give-bread-instead" className="relative overflow-hidden text-flour" style={{ background: "radial-gradient(900px 400px at 20% 0%, hsl(var(--cranberry) / 0.25), transparent 60%), linear-gradient(180deg, #2a1418 0%, #1c0f12 100%)" }}>
          <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 py-16 md:grid-cols-[1fr_1.1fr] md:py-20">
            <div>
              <p className="eyebrow" style={{ color: "hsl(var(--honey))" }}>A December tradition</p>
              <h2 className="mt-3 font-display font-medium text-flour" style={{ fontSize: "clamp(2rem, 4.4vw, 3.4rem)", lineHeight: 1.05 }}>
                Give <em className="not-italic italic text-honey">Bread</em> Instead.
              </h2>
              <p className="mt-4 max-w-[46ch] text-[1.05rem]" style={{ color: "#e8dcc6" }}>
                Skip the store-bought this year. A loaf you baked with your own hands says more than anything on a shelf. Watch the two-minute story, then pick a tool below to gift the baker in your life.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#top6" className="inline-flex items-center gap-2 rounded-full bg-cranberry px-6 py-3 font-bold text-flour shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-cranberry-deep">
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
        <section id="top6" className="bg-gradient-to-b from-oven to-[hsl(24_38%_11%)] py-16 text-flour">
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
          </div>
        </section>

        {/* Filter bar — sticky on desktop only. On mobile it scrolls naturally
            because the header height (with garland) varies and iOS Safari's
            URL-bar hide/show made a hard-coded sticky offset flicker. */}
        <div className="z-40 border-b border-parchment-deep bg-flour md:sticky md:top-[64px] md:bg-flour/95 md:backdrop-blur">
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-2.5 px-5 py-3">
            <div className="relative min-w-[180px] flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-crumb" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search gifts, brands, tools…"
                className="w-full rounded-full border-[1.5px] border-parchment-deep bg-white py-2.5 pl-10 pr-4 text-sm focus:border-honey focus:outline-none focus:ring-2 focus:ring-honey/30"
              />
            </div>
            <div className="flex flex-nowrap gap-2 overflow-x-auto md:flex-wrap" style={{ scrollbarWidth: "none" }}>
              <button className={`chip ${!cat ? "on" : ""}`} onClick={() => setCat(null)}>All</button>
              {CATEGORIES.map((c) => (
                <button key={c} className={`chip ${cat === c ? "on" : ""}`} onClick={() => setCat(cat === c ? null : c)}>{c}</button>
              ))}
            </div>
            <div className="flex flex-nowrap gap-2 overflow-x-auto md:flex-wrap" style={{ scrollbarWidth: "none" }}>
              {PRICE_BANDS.map((b) => (
                <button key={b.label} className={`chip ${band === b.label ? "on price-on" : ""}`} onClick={() => setBand(band === b.label ? null : b.label)}>{b.label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* The Counter: category aisles */}
        <section className="py-16">
          <div className="mx-auto max-w-[1200px] px-5">
            {CATEGORIES.map((c) => {
              const items = byCat.get(c) || [];
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
              <p className="py-16 text-center text-crumb">Nothing matches. Try clearing filters or a different search.</p>
            )}
          </div>
        </section>

        {/* Krustic brand section */}
        <section id="krustic" className="border-y border-parchment-deep bg-parchment/60 py-16">
          <div className="mx-auto max-w-[1200px] px-5">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Featured brand</p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-crust md:text-4xl">Krustic <span className="font-hand text-2xl text-cranberry">Rise Above Tradition™</span></h2>
                <p className="mt-3 max-w-[60ch] text-crumb">Heritage-inspired sourdough tools that honor the past and elevate your bake. Free shipping + 30-day returns.</p>
              </div>
              <button onClick={() => copyCode("BGBAH25")} className="code-pill text-base">
                <Copy className="h-4 w-4" /> Use code BGBAH25 for 10% off
              </button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {krusticProducts.map((k, i) => (
                <a key={i} href={k.url} target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-parchment-deep bg-white p-4 shadow-md transition-transform hover:-translate-y-1.5">
                  <div className="mb-3 flex h-44 items-center justify-center overflow-hidden rounded-xl bg-flour/50">
                    <img src={k.img} alt={k.name} loading="lazy" className="max-h-full object-contain transition-transform group-hover:scale-105" />
                  </div>
                  <h4 className="font-display text-base font-semibold text-crust">{k.name}</h4>
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
        </section>

        {/* Shop More Baking Essentials — Amazon */}
        <section className="py-16">
          <div className="mx-auto max-w-[1200px] px-5">
            <div className="mb-8">
              <p className="eyebrow">Also on Amazon</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-crust md:text-4xl">Shop More Baking Essentials</h2>
              <p className="mt-3 max-w-[60ch] text-crumb">The Amazon-available gear that rounds out a serious baker's kitchen.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {amazonProducts.map((a, i) => (
                <a key={i} href={a.url} target="_blank" rel="noopener noreferrer" className="group flex flex-col rounded-xl border border-parchment-deep bg-white p-3 shadow transition-transform hover:-translate-y-1">
                  <span className="mb-2 w-fit rounded-full bg-parchment px-2 py-0.5 text-xs font-bold text-crumb">{a.category}</span>
                  <div className="mb-3 flex h-44 items-center justify-center overflow-hidden rounded-lg bg-white">
                    <img src={a.img} alt={a.name} loading="lazy" className="max-h-full object-contain transition-transform group-hover:scale-105" />
                  </div>
                  <h4 className="font-display text-sm font-semibold text-crust line-clamp-2">{a.name}</h4>
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
        </section>

        {/* From Oven to Market */}
        <section className="text-flour" style={{ background: "radial-gradient(700px 300px at 85% 0%, hsl(var(--honey) / 0.12), transparent 60%), linear-gradient(180deg, hsl(var(--evergreen-deep)), #1d2f23)" }}>
          <a
            href="https://fromoventomarket.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="block overflow-hidden border-y border-honey/40"
            aria-label="Visit From Oven to Market"
          >
            <img
              src={fotmBanner}
              alt="From Oven to Market — turn Saturdays into income"
              loading="lazy"
              width={1600}
              height={260}
              className="block h-[160px] w-full object-cover md:h-[220px] lg:h-[260px] transition-transform duration-700 hover:scale-[1.02]"
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
                  <h4 className="font-display text-lg font-semibold text-flour">{m.name}</h4>
                  <p className="mt-1 text-sm text-[hsl(37_35%_82%)]">{m.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="https://fromoventomarket.com/market-kit" target="_blank" rel="noopener noreferrer" className="rounded-full bg-cranberry px-6 py-3 font-bold text-flour hover:bg-cranberry-deep">See all 35 Market Kit essentials →</a>
              <a href="https://fromoventomarket.com/" target="_blank" rel="noopener noreferrer" className="rounded-full border-[1.5px] border-flour/40 px-6 py-3 font-bold text-flour hover:border-honey hover:text-honey">Gift the course</a>
            </div>
            <p className="mt-4 text-xs text-[hsl(37_25%_70%)]">As an Amazon Associate Henry earns from qualifying purchases. Booth gear links go to Amazon; the Kit and course live at fromoventomarket.com.</p>
          </div>
        </section>

        {/* Books shelf */}
        <section className="bg-parchment/50 py-16">
          <div className="mx-auto max-w-[1200px] px-5">
            <div className="mb-8">
              <p className="eyebrow">Stocking-sized, kitchen-tested</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-crust md:text-4xl">Books from my own oven</h2>
            </div>
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
                  <h4 className="mt-4 font-display text-sm font-semibold text-crust">{b.name}</h4>
                  <p className="mt-1 font-bold text-cranberry">{b.price}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Free gifts */}
        <section className="py-16" style={{ background: "hsl(38 60% 94%)" }}>
          <div className="mx-auto max-w-[1200px] px-5 text-center">
            <p className="eyebrow">On the house</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-crust md:text-4xl">Free gifts, from me to you</h2>
            <div className="mx-auto mt-8 grid max-w-3xl gap-6 sm:grid-cols-2">
              {[
                { name: "Sourdough Starter Guide", desc: "Everything I wish someone had handed me on day one.", url: "#" },
                { name: "Holiday Recipe Collection", desc: "Gift loaves, quick breads, and the bakes neighbors ask for by name.", url: "#" },
              ].map((f, i) => (
                <a key={i} href={f.url} className="rounded-2xl border-2 border-dashed border-cranberry bg-white p-6 text-left transition-transform hover:-translate-y-1">
                  <h4 className="font-display text-lg font-semibold text-crust">{f.name}</h4>
                  <p className="mt-2 text-sm text-crumb">{f.desc}</p>
                  <p className="mt-3 font-bold text-evergreen">Free →</p>
                </a>
              ))}
            </div>
          </div>
        </section>

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
    </div>
  );
}
