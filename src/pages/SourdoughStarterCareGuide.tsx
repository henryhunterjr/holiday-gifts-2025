import { SeoPage, StubSection } from "@/components/seo/SeoPage";
import { Link } from "react-router-dom";

const PATH = "/sourdough-starter-care-guide";

export default function SourdoughStarterCareGuide() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Care for a Sourdough Starter (Beginner Guide)",
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://gifts.bakinggreatbread.blog${PATH}` },
    inLanguage: "en-US",
    about: [
      "sourdough starter",
      "how to make sourdough starter",
      "how to feed sourdough starter",
      "best flour for sourdough starter",
    ],
  };

  return (
    <SeoPage
      path={PATH}
      title="How to Care for a Sourdough Starter (Beginner Guide)"
      description="A clear sourdough starter care guide: build from scratch, feed 1:1:1, keep it in the Goldilocks Zone, and know when it's ready to bake."
      h1="How to Care for a Sourdough Starter"
      eyebrow="Pillar guide"
      jsonLd={articleLd}
    >
      <StubSection id="intro" heading="Intro">
        <p>Who this guide is for and how to use it.</p>
      </StubSection>
      <StubSection id="goldilocks-zone" heading="The Goldilocks Zone (75–82°F / 24–28°C)">
        <p>Why warmth is the single biggest lever in starter care.</p>
      </StubSection>
      <StubSection id="build-from-scratch" heading="Build a Starter from Scratch (Day 1 → Day 7+)" />
      <StubSection id="feeding" heading="Feeding 1:1:1 by Weight" />
      <StubSection id="ready-to-bake" heading="Ready-to-Bake Checklist" />
      <StubSection id="backup" heading="Backup Plan: Dehydrate and Revive" />
      <StubSection id="faq" heading="FAQ" />

      <aside className="rounded-2xl bg-parchment p-6">
        <p className="text-sm text-crumb">
          Ready to shop? See our{" "}
          <Link to="/sourdough-tools-and-supplies" className="font-semibold text-cranberry hover:underline">
            essential sourdough tools and supplies
          </Link>
          , or head to the{" "}
          <Link to="/" className="font-semibold text-cranberry hover:underline">
            2026 Holiday Gift Guide
          </Link>
          .
        </p>
      </aside>
    </SeoPage>
  );
}