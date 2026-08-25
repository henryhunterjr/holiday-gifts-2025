import { SeoPage, StubSection } from "@/components/seo/SeoPage";
import { Link } from "react-router-dom";

const PATH = "/essential-baking-tools";

export default function EssentialBakingTools() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Essential Baking Tools for Home Bread Bakers",
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://gifts.bakinggreatbread.blog${PATH}` },
    inLanguage: "en-US",
    author: { "@type": "Person", name: "Henry Hunter" },
  };

  return (
    <SeoPage
      path={PATH}
      title="Essential Baking Tools for Home Bread Bakers"
      description="The short list of baking tools that actually change your bread, what to buy first, what to skip, and where the money is worth spending."
      h1="Essential Baking Tools"
      eyebrow="Buying guide"
      jsonLd={ld}
    >
      <StubSection id="buy-first" heading="Buy these five first">
        <p>
          You can bake excellent bread with less gear than the internet suggests. These five earn their place on day
          one, and together they cost less than one fancy Dutch oven.
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li><b>Digital scale (0.1g resolution).</b> Baking by weight is the single biggest jump in consistency you will ever make. Cups lie.</li>
          <li><b>Instant-read thermometer.</b> Dough temperature and internal loaf temperature. Two numbers that end most bread arguments.</li>
          <li><b>Bench knife and flexible bowl scraper.</b> Handling wet dough without fighting it. Cheap, and you will use them every bake.</li>
          <li><b>Banneton with a liner.</b> Supports the final proof and gives you a round loaf instead of a puddle.</li>
          <li><b>Dutch oven or covered baker.</b> Traps steam for the first half of the bake. That is where oven spring and blistered crust come from.</li>
        </ul>
      </StubSection>

      <StubSection id="worth-upgrading" heading="Worth upgrading once you're hooked">
        <ul className="ml-5 list-disc space-y-2">
          <li><b>A real lame.</b> A comfortable handle and a fresh blade turn scoring from a gamble into a decision.</li>
          <li><b>Folding proofer or starter warmer.</b> Holds the Goldilocks Zone, 75 to 82°F, in any season. It makes your schedule predictable.</li>
          <li><b>Purpose-built bread pan.</b> Cast iron pans with a shallow base are far easier and safer to load than a deep pot.</li>
          <li><b>Baking steel or stone.</b> For pan loaves, pizza, and anything baked uncovered.</li>
          <li><b>Grain mill.</b> Fresh-milled flour tastes like a different ingredient. This is the deep end, and it is worth it.</li>
        </ul>
      </StubSection>

      <StubSection id="skip" heading="What you can skip">
        <ul className="ml-5 list-disc space-y-2">
          <li><b>Bread machines,</b> if your goal is real sourdough. They cannot do what your hands and your oven do.</li>
          <li><b>Novelty scoring stencils.</b> Fun, but they do not improve the bread.</li>
          <li><b>Proofing baskets in five sizes.</b> One round and one oval covers years of baking.</li>
          <li><b>Specialty flours before you can bake a plain loaf well.</b> Master one flour first.</li>
        </ul>
      </StubSection>

      <StubSection id="care" heading="Care and storage">
        <p>
          Bannetons never touch soap. Knock the flour out, let them dry completely, and store them somewhere with air
          movement. Wood bowls get hand-washed, dried immediately, and oiled a few times a year with a food-safe oil.
        </p>
        <p>
          Lame blades are consumable. Swap them when scoring starts dragging instead of gliding. Keep cast iron dry and
          lightly seasoned, and never shock a hot baker with cold water.
        </p>
      </StubSection>

      <aside className="rounded-2xl bg-parchment p-6">
        <p className="text-sm text-crumb">
          Shopping for someone else? The{" "}
          <Link to="/" className="font-semibold text-cranberry hover:underline">
            2026 Holiday Gift Guide
          </Link>{" "}
          sorts all of this by budget, and the{" "}
          <Link to="/sourdough-tools-and-supplies" className="font-semibold text-cranberry hover:underline">
            sourdough tools and supplies list
          </Link>{" "}
          goes deeper on starter gear.
        </p>
      </aside>
    </SeoPage>
  );
}
