import { SeoPage, StubSection } from "@/components/seo/SeoPage";
import { Link } from "react-router-dom";

const PATH = "/sourdough-starter-troubleshooting";

const FAQ_STUBS = [
  { q: "Why isn't my sourdough starter rising?", a: "Placeholder answer — most starters that stall are simply too cold. Aim for 75–82°F." },
  { q: "Why isn't my starter doubling?", a: "Placeholder answer — check feeding ratio, flour type, and ambient temperature." },
  { q: "How long should it take my starter to double?", a: "Placeholder answer — a healthy starter doubles in 4–8 hours at the right temperature." },
  { q: "Can I revive a starter that hasn't been fed in weeks?", a: "Placeholder answer — usually yes. Feed for 2–3 days before deciding it's dead." },
  { q: "When should I start over?", a: "Placeholder answer — only if you see actual mold. Hooch and slow rises are fixable." },
];

export default function SourdoughStarterTroubleshooting() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_STUBS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <SeoPage
      path={PATH}
      title="Sourdough Starter Troubleshooting: Why It's Not Rising"
      description="Find out why your sourdough starter isn't rising or doubling and what to fix first, from temperature to feeding schedule."
      h1="Sourdough Starter Troubleshooting"
      eyebrow="Troubleshooting"
      jsonLd={faqLd}
    >
      <StubSection id="check-temperature" heading="Check Temperature" />
      <StubSection id="check-feeding-ratio" heading="Check Feeding Ratio" />
      <StubSection id="check-timing" heading="Check Timing" />
      <StubSection id="when-to-start-over" heading="When to Start Over" />

      <section aria-labelledby="faq-h" className="rounded-2xl border border-parchment-deep bg-white/70 p-6 md:p-8">
        <h2 id="faq-h" className="font-display text-2xl font-semibold text-crust md:text-3xl">Frequently asked</h2>
        <div className="mt-4 space-y-4">
          {FAQ_STUBS.map((f) => (
            <details key={f.q} className="rounded-xl border border-parchment-deep p-4">
              <summary className="cursor-pointer font-semibold text-crust">{f.q}</summary>
              <p className="mt-2 text-crumb">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <aside className="rounded-2xl bg-parchment p-6">
        <p className="text-sm text-crumb">
          New to sourdough? Start with the{" "}
          <Link to="/sourdough-starter-care-guide" className="font-semibold text-cranberry hover:underline">
            sourdough starter care guide
          </Link>
          .
        </p>
      </aside>
    </SeoPage>
  );
}