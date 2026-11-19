import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Copy, ExternalLink, Heart } from "lucide-react";
import { toast } from "sonner";
import makers from "@/data/makers.json";
import { ProductPhoto } from "@/components/ProductPhoto";
import { useWishlist } from "@/hooks/useWishlist";
import { trackEvent } from "@/lib/analytics";
import NotFound from "./NotFound";
import "./holiday-editorial.css";

const SITE_ORIGIN = "https://gifts.bakinggreatbread.com";

type MakerItem = {
  slug: string;
  name: string;
  priceLabel?: string;
  note?: string;
  url: string;
  img?: string;
  code?: string;
};

type Maker = {
  id: string;
  brand: string;
  title: string;
  logo?: string;
  promoCode?: string;
  promoDetail?: string;
  items: MakerItem[];
};

export default function MakerCollection() {
  const { makerId } = useParams<{ makerId: string }>();
  const maker = (makers as Maker[]).find((m) => m.id === makerId);
  const { has, toggle } = useWishlist();

  useEffect(() => {
    if (maker) {
      window.scrollTo(0, 0);
      trackEvent("page_view", { section: "maker_collection", brand: maker.brand, maker_id: maker.id });
    }
  }, [maker]);

  if (!maker) return <NotFound />;

  const canonicalUrl = `${SITE_ORIGIN}/makers/${maker.id}/`;
  const copyCode = async (code: string) => {
    trackEvent("promo_code_copy", { code, brand: maker.brand, surface: "maker_page" });
    try {
      if (!navigator.clipboard?.writeText) throw new Error("no clipboard");
      await navigator.clipboard.writeText(code);
      toast.success(`Copied ${code}`);
    } catch {
      toast.error(`Copy blocked. Use code: ${code}`, { duration: 8000 });
    }
  };

  return (
    <div className="holiday-editorial min-h-screen bg-flour text-ink">
      <Helmet>
        <title>{maker.brand} Holiday Gifts 2026 | Baking Great Bread</title>
        <meta
          name="description"
          content={`Handpicked ${maker.brand} (${maker.title.toLowerCase()}) holiday gifts curated by Henry Hunter for home bread bakers.`}
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`${maker.brand} — 2026 Bread Baker Holiday Gift Guide`} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={`${SITE_ORIGIN}/og-image.png`} />
      </Helmet>

      <header className="editorial-header">
        <Link to="/" className="editorial-brand">
          <img src="/brand-logos/academy-crest.webp" alt="Crust & Crumb Academy" width="720" height="405" />
          <span>
            Baking Great Bread at Home
            <strong>Crust &amp; Crumb Academy</strong>
            <small>A holiday guide by Henry Hunter</small>
          </span>
        </Link>
        <div className="header-actions">
          <Link className="about-henry" to="/">← Back to full gift guide</Link>
          <Link className="saved-control" to="/saved-gifts">
            <Heart size={17} aria-hidden /> <span>Saved gifts</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-5 py-12">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-6 border-b border-parchment-deep pb-8">
          <div>
            <p className="edition-label" style={{ marginBottom: 10 }}>{maker.brand}</p>
            <h1 className="font-display text-4xl font-semibold text-crust md:text-5xl">{maker.brand} — {maker.title}</h1>
            <p className="mt-3 max-w-[60ch] text-crumb">
              Kitchen-tested picks from {maker.brand}. Affiliate links support our free recipes at no extra cost to you.
            </p>
            {maker.promoCode && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="partner-code"
                  onClick={() => copyCode(maker.promoCode!)}
                  aria-label={`Copy ${maker.brand} promo code ${maker.promoCode}`}
                >
                  <Copy size={14} /> {maker.promoCode} <small>Copy code</small>
                </button>
                {maker.promoDetail && <span className="text-sm text-crumb">{maker.promoDetail}</span>}
              </div>
            )}
          </div>
          {maker.logo && (
            <img
              src={maker.logo}
              alt={maker.brand}
              className="h-16 w-auto max-w-[180px] object-contain"
              loading="eager"
            />
          )}
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {maker.items.map((item) => {
            const wishlistSlug = `${maker.id}:${item.slug}`;
            const saved = has(wishlistSlug);
            const activeCode = item.code || maker.promoCode;
            return (
              <article key={item.slug} data-product={item.slug} data-brand={maker.brand} className="holiday-product-card">
                <a
                  href={item.url}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  aria-label={`Shop ${item.name} from ${maker.brand}`}
                  onClick={() =>
                    trackEvent("outbound_affiliate_click", {
                      slug: item.slug,
                      brand: maker.brand,
                      section: "maker_page",
                      has_code: Boolean(activeCode),
                    })
                  }
                >
                  <ProductPhoto src={item.img || maker.logo || "/brand-logos/academy-crest.webp"} name={item.name} />
                </a>
                <div className="holiday-card-body">
                  <p className="holiday-card-brand">{maker.brand}</p>
                  <h2 className="font-display text-xl font-semibold text-crust">{item.name}</h2>
                  {item.note && <p className="mt-2 text-sm text-crumb">{item.note}</p>}
                  {item.priceLabel && <p className="mt-3 text-lg font-bold text-evergreen-deep">{item.priceLabel}</p>}
                  <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="nofollow sponsored noopener noreferrer"
                      className="holiday-shop-link flex-1"
                      onClick={() =>
                        trackEvent("outbound_affiliate_click", {
                          slug: item.slug,
                          brand: maker.brand,
                          section: "maker_page",
                          has_code: Boolean(activeCode),
                        })
                      }
                    >
                      Shop at {maker.brand} <ExternalLink className="h-4 w-4" aria-hidden />
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        const nowSaved = toggle(wishlistSlug);
                        trackEvent("wishlist_toggle", { slug: wishlistSlug, brand: maker.brand, saved: nowSaved });
                        toast.success(nowSaved ? `Saved ${item.name}` : `Removed ${item.name}`);
                      }}
                      aria-pressed={saved}
                      aria-label={saved ? `Remove ${item.name} from saved gifts` : `Save ${item.name} to your gift list`}
                      className={`flex h-[44px] w-[44px] items-center justify-center rounded-[10px] border-[1.5px] transition-colors ${
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
          })}
        </div>
      </main>
    </div>
  );
}
