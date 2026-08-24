import { SeoPage, StubSection } from "@/components/seo/SeoPage";
import { Link } from "react-router-dom";

const PATH = "/essential-baking-tools";
const SITE = "https://gifts.bakinggreatbread.blog";

const PLACEHOLDER_ITEMS = [
  { name: "Digital kitchen scale", url: `${SITE}${PATH}#tbd-scale` },
  { name: "Instant-read thermometer", url: `${SITE}${PATH}#tbd-thermometer` },
  { name: "Bench scraper", url: `${SITE}${PATH}#tbd-bench-scraper` },
  { name: "Mixing bowls (nested set)", url: `${SITE}${PATH}#tbd-bowls` },
  { name: "Dutch oven or combo cooker", url: `${SITE}${PATH}#tbd-dutch-oven` },
  { name: "Banneton proofing basket", url: `${SITE}${PATH}#tbd-banneton` },
  { name: "Lame or scoring blade", url: `${SITE}${PATH}#tbd-lame` },
  { name: "Silicone spatula", url: `${SITE}${PATH}#tbd-spatula` },
];

export default function EssentialBakingTools() {
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Essential Baking Tools for Home Bakers",
    itemListElement: PLACEHOLDER_ITEMS.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };

  return (
    <SeoPage
      path={PATH}
      title="Essential Baking Tools for Home Bakers"
      description="The essential baking tools every home baker needs, plus budget-friendly options and upgrade picks."
      h1="Essential Baking Tools for Home Bakers"
      eyebrow="Baking essentials"
      jsonLd={itemListLd}
    >
      <StubSection id="absolute-essentials" heading="Absolute essentials" />
      <StubSection id="nice-to-have" heading="Nice to have" />
      <StubSection id="splurges" heading="Splurges" />
      <StubSection id="pantry" heading="Pantry must-haves" />

      <aside className="rounded-2xl bg-parchment p-6">
        <p className="text-sm text-crumb">
          Baking sourdough specifically? Jump to{" "}
          <Link to="/sourdough-tools-and-supplies" className="font-semibold text-cranberry hover:underline">
            sourdough tools and supplies
          </Link>
          , or grab a gift over on the{" "}
          <Link to="/" className="font-semibold text-cranberry hover:underline">
            Holiday Gift Guide
          </Link>
          .
        </p>
      </aside>
    </SeoPage>
  );
}