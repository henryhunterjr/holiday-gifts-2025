import { SeoPage, StubSection } from "@/components/seo/SeoPage";
import { Link } from "react-router-dom";

const PATH = "/fix-gummy-dense-sourdough";

export default function FixGummyDenseSourdough() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Fix Gummy or Dense Sourdough",
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://gifts.bakinggreatbread.blog${PATH}` },
    inLanguage: "en-US",
    about: ["gummy sourdough", "dense sourdough bread", "sourdough troubleshooting"],
  };

  return (
    <SeoPage
      path={PATH}
      title="How to Fix Gummy or Dense Sourdough"
      description="Troubleshoot gummy, dense, or flat sourdough loaves with clear fixes for hydration, fermentation, shaping, and baking."
      h1="How to Fix Gummy or Dense Sourdough"
      eyebrow="Troubleshooting"
      jsonLd={articleLd}
    >
      <StubSection id="check-proofing" heading="Check Proofing" />
      <StubSection id="check-hydration" heading="Check Hydration" />
      <StubSection id="check-baking" heading="Check Baking Time & Temp" />
      <StubSection id="common-mistakes" heading="Common Mistakes" />

      <aside className="rounded-2xl bg-parchment p-6">
        <p className="text-sm text-crumb">
          Starter looking weak too? See{" "}
          <Link to="/sourdough-starter-troubleshooting" className="font-semibold text-cranberry hover:underline">
            starter troubleshooting
          </Link>{" "}
          or the full{" "}
          <Link to="/sourdough-starter-care-guide" className="font-semibold text-cranberry hover:underline">
            starter care guide
          </Link>
          .
        </p>
      </aside>
    </SeoPage>
  );
}