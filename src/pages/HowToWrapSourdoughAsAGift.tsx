import { SeoPage, StubSection } from "@/components/seo/SeoPage";
import { Link } from "react-router-dom";

const PATH = "/how-to-wrap-sourdough-as-a-gift";

export default function HowToWrapSourdoughAsAGift() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Wrap Sourdough as a Gift",
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://gifts.bakinggreatbread.blog${PATH}` },
    inLanguage: "en-US",
    about: ["how to wrap sourdough as a gift", "sourdough gift", "Give Bread Instead"],
  };

  return (
    <SeoPage
      path={PATH}
      title="How to Wrap Sourdough as a Gift"
      description="Step-by-step ideas for wrapping sourdough bread as a beautiful, practical gift."
      h1="How to Wrap Sourdough as a Gift"
      eyebrow="Give Bread Instead"
      jsonLd={articleLd}
    >
      <StubSection id="choose-loaf" heading="Choosing the loaf" />
      <StubSection id="cool-store" heading="Cooling and storing" />
      <StubSection id="wrap-ideas" heading="Wrapping ideas" />
      <StubSection id="transport" heading="Safe transport tips" />
      <StubSection id="tags-story" heading="Gift tags & storytelling" />

      <aside className="rounded-2xl bg-parchment p-6">
        <p className="text-sm text-crumb">
          Prefer to gift the gear? Browse the{" "}
          <Link to="/" className="font-semibold text-cranberry hover:underline">
            2026 Holiday Gift Guide
          </Link>
          .
        </p>
      </aside>
    </SeoPage>
  );
}