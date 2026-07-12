import { SeoPage, StubSection } from "@/components/seo/SeoPage";
import { Link } from "react-router-dom";

const PATH = "/sourdough-tools-and-supplies";

export default function SourdoughToolsAndSupplies() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Essential Sourdough Tools and Supplies",
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://holiday-gifts-2025.lovable.app${PATH}` },
    inLanguage: "en-US",
    about: ["sourdough tools", "sourdough supplies", "sourdough accessories", "bread baking supplies"],
  };

  return (
    <SeoPage
      path={PATH}
      title="Essential Sourdough Tools and Supplies"
      description="A practical list of essential sourdough tools and supplies for home bakers, from scales and jars to proofing gear."
      h1="Essential Sourdough Tools and Supplies"
      eyebrow="Buying guide"
      jsonLd={articleLd}
    >
      <StubSection id="starter-care" heading="Starter care" />
      <StubSection id="mixing-fermentation" heading="Mixing & fermentation" />
      <StubSection id="proofing" heading="Proofing" />
      <StubSection id="baking-vessels" heading="Baking vessels" />
      <StubSection id="optional-upgrades" heading="Optional upgrades" />

      <aside className="rounded-2xl bg-cranberry/10 p-6 text-center">
        <p className="text-crust">
          Shopping for a sourdough baker?{" "}
          <Link to="/" className="font-semibold text-cranberry hover:underline">
            See the 2026 Holiday Gift Guide for bread bakers →
          </Link>
        </p>
      </aside>
    </SeoPage>
  );
}