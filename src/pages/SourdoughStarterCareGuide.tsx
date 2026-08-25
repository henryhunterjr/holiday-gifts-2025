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
    author: { "@type": "Person", name: "Henry Hunter" },
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
      description="A clear sourdough starter care guide: build from scratch, feed 1:1:1 by weight, keep it in the Goldilocks Zone, and know when it's ready to bake."
      h1="How to Care for a Sourdough Starter"
      eyebrow="Pillar guide"
      jsonLd={articleLd}
    >
      <StubSection id="intro" heading="Start here">
        <p>
          A sourdough starter is flour and water with a colony of wild yeast and bacteria living in it. That's the
          whole thing. You are not raising a pet, you are running a small fermentation. Feed it, keep it warm, and it
          will raise bread for the rest of your life.
        </p>
        <p>
          This guide is for the baker who wants a starter that doubles on schedule instead of one that sulks in the
          back of the fridge. Two habits do most of the work: consistent temperature and consistent feeding by weight.
          Everything else is detail.
        </p>
      </StubSection>

      <StubSection id="goldilocks-zone" heading="The Goldilocks Zone (75 to 82°F / 24 to 28°C)">
        <p>
          Temperature is the biggest lever you have, and most people never touch it. At 68°F a starter creeps. At 78°F
          the same starter doubles in four to six hours and smells like yogurt and green apple instead of nail polish.
        </p>
        <p>
          Your kitchen counter in December is not 78°F. Put the jar somewhere warm and stable: on top of the fridge,
          in the oven with only the light on, in a proofing box, or next to a starter warmer. If your starter has been
          "slow" for weeks, this is almost always the fix.
        </p>
        <p className="text-sm">
          Cold spots to avoid: exterior walls, tile counters, windowsills, and anywhere near an air vent.
        </p>
      </StubSection>

      <StubSection id="build-from-scratch" heading="Build a starter from scratch (Day 1 to Day 7+)">
        <p>
          You need a scale, a clear jar, unbleached flour, and water that isn't heavily chlorinated. Whole wheat or rye
          for the first few days gives the wild yeast more to work with.
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li><b>Day 1:</b> Mix 50g whole wheat or rye flour with 50g warm water. Cover loosely. Keep it warm.</li>
          <li><b>Days 2 to 3:</b> You may see bubbles and a sharp smell. That's early bacteria, not yeast. Discard all but 50g, then feed 50g flour and 50g water once a day.</li>
          <li><b>Day 4:</b> Activity usually stalls here and beginners panic. Keep feeding. Switch to bread flour if you like.</li>
          <li><b>Days 5 to 7:</b> Feed twice a day, roughly 12 hours apart. Rises get taller and faster, the smell turns tangy and clean.</li>
          <li><b>Day 7+:</b> When it reliably doubles within 4 to 8 hours after a feed, it's a starter. Name it and bake with it.</li>
        </ul>
        <p>
          Some starters take two weeks. Cold kitchens and low-protein flour both slow things down. Slow is not dead.
        </p>
      </StubSection>

      <StubSection id="feeding" heading="Feeding 1:1:1 by weight">
        <p>
          One part starter, one part flour, one part water, measured on a scale. Twenty grams of each is plenty for
          home baking and wastes far less flour than the cup-based routines floating around.
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li><b>Baking this week:</b> keep it on the counter and feed once or twice a day.</li>
          <li><b>Baking now and then:</b> keep it in the fridge and feed once a week. Pull it out and give it two warm feedings before you bake.</li>
          <li><b>Volume cues:</b> use a clear jar and mark the level after feeding with a rubber band. You want to see it double, not guess.</li>
        </ul>
        <p>
          Dark liquid on top is hooch. It means hungry, not ruined. Pour it off or stir it in and feed.
        </p>
      </StubSection>

      <StubSection id="ready-to-bake" heading="Ready-to-bake checklist">
        <ul className="ml-5 list-disc space-y-2">
          <li>Doubled in volume since the last feed, with a domed top</li>
          <li>Webbed with bubbles through the sides of the jar, not just on the surface</li>
          <li>Smells tangy and yeasty, like yogurt or ripe fruit</li>
          <li>A spoonful floats in room-temperature water</li>
          <li>Used at peak, not hours after it has collapsed back down</li>
        </ul>
        <p>
          Miss the peak and your dough will ferment slower and taste sharper. Set a timer once you know your starter's
          rhythm at your kitchen's temperature.
        </p>
      </StubSection>

      <StubSection id="backup" heading="Backup plan: dehydrate and revive">
        <p>
          Spread a thin layer of ripe starter on parchment, dry it until it cracks, then break it into flakes and store
          it in a sealed jar. It keeps for years in a cupboard. Do this once and you never lose your culture to a
          vacation, a move, or a power outage.
        </p>
        <p>
          To revive: cover 10g of flakes with 20g warm water, wait an hour, stir in 20g flour, then feed twice a day
          until it doubles again. Usually two to four days.
        </p>
      </StubSection>

      <StubSection id="faq" heading="Quick answers">
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-crust">What flour is best?</p>
            <p>Unbleached bread flour for daily feeding, with a spoonful of rye or whole wheat when you want more activity.</p>
          </div>
          <div>
            <p className="font-semibold text-crust">Do I have to discard?</p>
            <p>Yes, or your jar grows forever and your ratios drift. Save discard for pancakes and crackers.</p>
          </div>
          <div>
            <p className="font-semibold text-crust">Tap water or bottled?</p>
            <p>Tap is fine in most places. If your water is strongly chlorinated, leave it out overnight or use filtered.</p>
          </div>
          <div>
            <p className="font-semibold text-crust">When is it actually dead?</p>
            <p>Only when you see fuzzy mold or pink or orange streaks. Everything else is fixable with warmth and feeding.</p>
          </div>
        </div>
      </StubSection>

      <aside className="rounded-2xl bg-parchment p-6">
        <p className="text-sm text-crumb">
          Starter still stalling? Work through{" "}
          <Link to="/sourdough-starter-troubleshooting" className="font-semibold text-cranberry hover:underline">
            starter troubleshooting
          </Link>
          . Ready to shop? See our{" "}
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
