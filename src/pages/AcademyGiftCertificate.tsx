import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Copy, Gift } from "lucide-react";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

const SITE_ORIGIN = "https://gifts.bakinggreatbread.com";
const ORDER_EMAIL = "BGBAH2023@gmail.com";
const subject = "Christmas gift certificate: one year at Crust & Crumb Academy";
const body =
  "Hi Henry, I'd like to buy a $45 Christmas gift certificate for one year at Crust & Crumb Academy. Please send me the payment details.\n\nMy name:\nGift recipient's name:";
const orderEmailHref = `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export default function AcademyGiftCertificate() {
  useEffect(() => {
    trackEvent("page_view", { section: "academy_gift_certificate" });
  }, []);

  const copyOrderEmail = async () => {
    trackEvent("academy_cert_email_copy", { offer_price: 45 });
    try {
      if (!navigator.clipboard?.writeText) throw new Error("no clipboard");
      await navigator.clipboard.writeText(ORDER_EMAIL);
      toast.success(`Copied ${ORDER_EMAIL} — send a quick note with your recipient's name.`);
    } catch {
      toast.error(`Email Henry directly at ${ORDER_EMAIL}`, { duration: 8000 });
    }
  };

  return (
    <main className="certificate-shop">
      <Helmet>
        <title>Christmas Gift Certificate ($45) | Crust &amp; Crumb Academy</title>
        <meta
          name="description"
          content="Gift one full year of Crust & Crumb Academy by Henry Hunter for $45 (25% off). Includes Saturday bake-alongs, bread lessons, and community coaching."
        />
        <link rel="canonical" href={`${SITE_ORIGIN}/academy-gift-certificate`} />
        <meta property="og:title" content="Christmas Gift Certificate | Crust & Crumb Academy" />
        <meta property="og:description" content="Give a full year of baking with Henry Hunter for $45 this Christmas (save $15)." />
        <meta property="og:url" content={`${SITE_ORIGIN}/academy-gift-certificate`} />
        <meta property="og:image" content={`${SITE_ORIGIN}/og-image.png`} />
      </Helmet>
      <Link className="certificate-back" to="/">← Holiday Shopping Guide</Link>
      <article className="christmas-certificate">
        <div className="certificate-face">
          <img src="/brand-logos/academy-crest.webp" width="720" height="405" alt="Crust & Crumb Academy" />
          <p className="certificate-kicker">Christmas gift certificate</p>
          <h1>A year of baking<br />with Henry Hunter.</h1>
          <p>Give your baker a seat at the Saturday bake-along, bread lessons to work through at home, and a place to bring their dough questions.</p>
          <div className="certificate-signature">Henry Hunter</div>
          <small>Baking Great Bread at Home</small>
        </div>
        <div className="certificate-order">
          <Gift size={36} aria-hidden />
          <h2>One annual Academy membership</h2>
          <p className="certificate-cost">$45 <s>$60</s></p>
          <p>Save $15 this Christmas. That’s 25% off.</p>
          <a
            href={orderEmailHref}
            onClick={() => trackEvent("academy_cert_cta_click", { method: "mailto", offer_price: 45 })}
          >
            Order your gift by email <span aria-hidden>→</span>
          </a>
          <button
            type="button"
            onClick={copyOrderEmail}
            className="mt-3 inline-flex min-h-[44px] items-center gap-2 border-b border-[#ffedc7]/60 text-sm font-semibold text-[#ffedc7] hover:text-white"
            aria-label={`Copy ${ORDER_EMAIL} to order from Gmail or webmail`}
          >
            <Copy size={15} aria-hidden /> Using webmail? Copy {ORDER_EMAIL}
          </button>
          <small className="mt-3">Your email opens with the gift details filled in, or copy {ORDER_EMAIL} to email Henry directly for payment instructions.</small>
        </div>
      </article>
    </main>
  );
}
