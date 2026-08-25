import { SeoPage, StubSection } from "@/components/seo/SeoPage";
import { Link } from "react-router-dom";

const PATH = "/sourdough-tools-and-supplies";

export default function SourdoughToolsAndSupplies() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Sourdough Tools and Supplies: What You Actually Need",
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://gifts.bakinggreatbread.blog${PATH}` },
    inLanguage: "en-US",
    author: { "@type": "Person", name: "Henry Hunter" },
  };

  return (
    <SeoPage
      path={PATH}
      title="Sourdough Tools and Supplies: What You Need"
      description="A practical sourdough supply list: starter care gear, mixing and shaping tools, scoring, baking vessels, and storage, with the reason each one matters."
      h1="Sourdough Tools and Supplies"
      eyebrow="Buying guide"
      jsonLd={ld}
    >
      <StubSection id="starter-care" heading="Starter care">
        <p>
          Your starter needs a clear jar, a scale, and a warm place to live. That is the whole kit. The jar should be
          straight-sided and tall enough to show a double, because seeing the rise is how you learn your timing.
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li><b>Straight-sided glass jars,</b> two of them, so you always have a clean one.</li>
          <li><b>Starter warmer or folding proofer</b> to hold 75 to 82°F through winter.</li>
          <li><b>Dough whisk</b> for stirring in flour without gluing your spoon shut.</li>
          <li><b>Dehydrated backup starter,</b> either your own flakes or a purchased culture.</li>
        </ul>
      </StubSection>

      <StubSection id="mixing-shaping" heading="Mixing and shaping">
        <ul className="ml-5 list-disc space-y-2">
          <li><b>Large mixing bowl,</b> wood or glass, wide enough to fold dough in.</li>
          <li><b>Flexible bowl scraper</b> to clear the bowl in one pass.</li>
          <li><b>Bench knife</b> for dividing and pre-shaping without tearing.</li>
          <li><b>Silicone mat</b> so your counter stops being the problem.</li>
          <li><b>Bannetons,</b> one round and one oval, plus liners for sticky dough.</li>
        </ul>
        <p>
          A stand mixer is optional for sourdough. Time and folds do the same work as a dough hook, and gentler.
        </p>
      </StubSection>

      <StubSection id="scoring" heading="Scoring">
        <p>
          A lame is a handle plus a razor blade, and the handle is what you are paying for. A good one lets you set the
          angle and depth on purpose. Shallow at 30 degrees for an ear, deeper and straight down for decorative cuts.
        </p>
        <p>
          Keep spare blades on hand and change them often. A dull blade drags the skin of the dough and ruins the score
          before the loaf ever hits the oven.
        </p>
      </StubSection>

      <StubSection id="baking" heading="Baking vessels">
        <ul className="ml-5 list-disc space-y-2">
          <li><b>Dutch oven:</b> the default. Traps steam, cheap, works.</li>
          <li><b>Cast iron bread pan with a lid:</b> easier to load, safer than reaching into a deep pot, better shape control.</li>
          <li><b>Baking steel or stone:</b> for uncovered bakes, pan loaves, and pizza night.</li>
          <li><b>Bread sling or parchment:</b> gets the loaf in and out without a burn.</li>
        </ul>
      </StubSection>

      <StubSection id="storage-gifting" heading="Storage and gifting">
        <p>
          Cut sourdough face-down on a board keeps for two days on the counter. Longer than that, slice the loaf and
          freeze it, then toast from frozen. Plastic bags soften the crust, and a bread box or a linen wrap keeps it
          crisp.
        </p>
        <p>
          Giving a loaf away? A wood bowl, a linen wrap, and a tag look better than any bakery box.{" "}
          <Link to="/how-to-wrap-sourdough-as-a-gift" className="font-semibold text-cranberry hover:underline">
            Here's how to wrap it
          </Link>
          .
        </p>
      </StubSection>

      <aside className="rounded-2xl bg-parchment p-6">
        <p className="text-sm text-crumb">
          See the shortest possible version in{" "}
          <Link to="/essential-baking-tools" className="font-semibold text-cranberry hover:underline">
            essential baking tools
          </Link>
          , or shop everything by budget in the{" "}
          <Link to="/" className="font-semibold text-cranberry hover:underline">
            2026 Holiday Gift Guide
          </Link>
          .
        </p>
      </aside>
    </SeoPage>
  );
}
