import { Helmet } from "react-helmet-async";
import { Gift } from "lucide-react";

const subject = "Christmas gift certificate: one year at Crust & Crumb Academy";
const body = "Hi Henry, I'd like to buy a $45 Christmas gift certificate for one year at Crust & Crumb Academy. Please send me the payment details.\n\nMy name:\nGift recipient's name:";
const orderEmail = `mailto:BGBAH2023@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export default function AcademyGiftCertificate() {
  return (
    <main className="certificate-shop">
      <Helmet><title>Christmas Gift Certificate | Crust &amp; Crumb Academy</title></Helmet>
      <a className="certificate-back" href="/">← Holiday Shopping Guide</a>
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
          <a href={orderEmail}>Order your gift by email <span aria-hidden>→</span></a>
          <small>Your email opens with the gift details filled in. Send it to Henry to request payment instructions.</small>
        </div>
      </article>
    </main>
  );
}
