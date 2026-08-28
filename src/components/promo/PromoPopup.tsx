import { useCallback, useEffect, useId, useRef, useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { PROMO_CAMPAIGNS, type PromoCampaign } from "@/data/promoCampaigns";

/* ============ Storage ============ */
const K_DISMISSED = "bgb.promo.dismissedAt";
const K_CLICKED = "bgb.promo.clicked";
const K_LAST = "bgb.promo.lastCampaign";
const K_IMG = "bgb.promo.imageIndex"; // JSON map campaignId -> index
const K_SESSION = "bgb.promo.shownThisSession";
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

const readJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const writeJson = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — promo just runs stateless */
  }
};

function clickedIds(): string[] {
  return readJson<string[]>(K_CLICKED, []);
}

/** Eligibility that does not depend on triggers: dismissal window, session cap, click suppression. */
function pickCampaign(): PromoCampaign | null {
  try {
    if (sessionStorage.getItem(K_SESSION)) return null;
  } catch {
    /* ignore */
  }
  const dismissedAt = Number(readJson<number>(K_DISMISSED, 0));
  if (dismissedAt && Date.now() - dismissedAt < SEVEN_DAYS) return null;

  const suppressed = clickedIds();
  const eligible = PROMO_CAMPAIGNS.filter((c) => !suppressed.includes(c.id));
  if (eligible.length === 0) return null;

  const last = readJson<string | null>(K_LAST, null);
  if (eligible.length === 1) return eligible[0];
  const lastIndex = PROMO_CAMPAIGNS.findIndex((c) => c.id === last);
  const next = PROMO_CAMPAIGNS[(lastIndex + 1) % PROMO_CAMPAIGNS.length];
  return eligible.find((c) => c.id === next.id) ?? eligible[0];
}

function nextImage(campaign: PromoCampaign): string {
  const map = readJson<Record<string, number>>(K_IMG, {});
  const prev = typeof map[campaign.id] === "number" ? map[campaign.id] : -1;
  const idx = (prev + 1) % campaign.images.length;
  writeJson(K_IMG, { ...map, [campaign.id]: idx });
  return campaign.images[idx];
}

/* ============ Trigger hook ============ */
// Desktop: 25s timer OR 40% scroll depth OR exit intent — whichever fires
// first, then every other listener is torn down. Mobile: 40% scroll only.
// `blocked` defers the promo while any other modal/drawer is open.
export function usePromoCampaign(blocked: boolean) {
  const [campaign, setCampaign] = useState<PromoCampaign | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [armed, setArmed] = useState(false);
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    const isMobile = window.matchMedia("(max-width: 767px), (hover: none)").matches;
    let timer: number | undefined;

    const fire = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      cleanup();
      setArmed(true);
    };

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      if (window.scrollY / max >= 0.4) fire();
    };
    const onMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 8) fire();
    };

    function cleanup() {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onMouseOut);
      if (timer) window.clearTimeout(timer);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    if (!isMobile) {
      timer = window.setTimeout(fire, 25_000);
      document.addEventListener("mouseout", onMouseOut);
    }
    return cleanup;
  }, []);

  // Once armed, wait for a clear stage before showing anything.
  useEffect(() => {
    if (!armed || blocked || campaign) return;
    const c = pickCampaign();
    if (!c) return;
    setImage(nextImage(c));
    setCampaign(c);
    try {
      sessionStorage.setItem(K_SESSION, "1");
    } catch {
      /* ignore */
    }
    writeJson(K_LAST, c.id);
  }, [armed, blocked, campaign]);

  const dismiss = useCallback(() => {
    writeJson(K_DISMISSED, Date.now());
    setCampaign(null);
  }, []);

  const clickThrough = useCallback((id: string) => {
    const next = [...new Set([...clickedIds(), id])];
    writeJson(K_CLICKED, next);
    setCampaign(null);
  }, []);

  return { campaign, image, dismiss, clickThrough };
}

/* ============ Popup ============ */
export function PromoPopup({
  campaign,
  image,
  onDismiss,
  onClickThrough,
}: {
  campaign: PromoCampaign | null;
  image: string | null;
  onDismiss: () => void;
  onClickThrough: (id: string) => void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<Element | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!campaign) return;
    returnFocusRef.current = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      const back = returnFocusRef.current;
      if (back instanceof HTMLElement) back.focus();
    };
  }, [campaign, onDismiss]);

  if (!campaign || !image) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(campaign.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the code is visible as text */
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/65 motion-safe:animate-in motion-safe:fade-in"
        onClick={onDismiss}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative m-0 flex max-h-[80vh] w-full max-w-[500px] flex-col overflow-y-auto rounded-t-2xl border-[1.5px] border-honey/40 bg-flour shadow-2xl sm:m-4 sm:max-h-[82vh] sm:rounded-2xl motion-safe:animate-in motion-safe:slide-in-from-bottom-6 motion-safe:sm:zoom-in-95"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onDismiss}
          aria-label={`Close the ${campaign.productName} holiday offer`}
          className="absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-oven/85 text-flour transition-colors hover:bg-oven"
        >
          <X className="h-5 w-5" />
        </button>
        <a
          href={campaign.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => onClickThrough(campaign.id)}
          className="block"
        >
          <img src={image} alt={campaign.alt} className="block h-auto max-h-[30vh] w-full object-contain" />
        </a>
        <div className="flex flex-col gap-2 border-t border-parchment-deep bg-[hsl(38_55%_95%)] p-3 sm:p-4">
          <h2 id={titleId} className="font-display text-base font-semibold leading-tight text-crust">
            {campaign.productName} — {campaign.discountLabel}
          </h2>
          <p className="text-sm text-crumb">
            <span className="line-through">${campaign.regularPrice.toFixed(2)}</span>{" "}
            <b className="text-cranberry-deep">${campaign.salePrice.toFixed(2)}</b> with code
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border-[1.5px] border-dashed border-honey bg-white px-2 py-1.5 font-mono text-sm font-bold tracking-wide text-crust">
              {campaign.code}
            </span>
            <button
              type="button"
              onClick={copy}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border-[1.5px] border-crust px-3 text-sm font-bold text-crust transition-colors hover:bg-crust hover:text-flour"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy Code"}
            </button>
          </div>
          <a
            href={campaign.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => onClickThrough(campaign.id)}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-evergreen px-5 text-sm font-extrabold text-flour transition-colors hover:bg-evergreen-deep"
          >
            Shop {campaign.productName} →
          </a>
        </div>
      </div>
    </div>
  );
}
