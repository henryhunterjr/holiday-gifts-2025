import { SeoPage, StubSection } from "@/components/seo/SeoPage";
import { Link } from "react-router-dom";

const PATH = "/sourdough-starter-troubleshooting";

const FAQ = [
  {
    q: "Why isn't my sourdough starter rising?",
    a: "Nine times out of ten it is too cold. Below about 70°F fermentation slows to a crawl. Move the jar somewhere 75 to 82°F, feed it twice a day for two days, and watch again. If it is warm and still flat, switch to unbleached bread flour with a spoonful of rye and check that your water is not heavily chlorinated.",
  },
  {
    q: "Why isn't my starter doubling?",
    a: "Either the ratio is off or you are looking at the wrong window. Feed 1:1:1 by weight, mark the jar right after feeding, and check at four, six, and eight hours. Many starters double and fall back before the baker ever looks.",
  },
  {
    q: "How long should it take my starter to double?",
    a: "A healthy mature starter doubles in four to eight hours at 75 to 82°F. A young starter, under two weeks old, can take twelve hours or more and that is still normal.",
  },
  {
    q: "Can I revive a starter that hasn't been fed in weeks?",
    a: "Usually yes. Pour off any hooch, scrape 20g from the cleanest part of the jar into a fresh jar, and feed 1:1:1 twice a day in a warm spot. Give it three days before you judge it. Long-neglected starters often come back stronger than they were.",
  },
  {
    q: "What is the dark liquid on top?",
    a: "Hooch. It is alcohol from a hungry culture. Stir it in for a tangier flavor or pour it off for a milder one, then feed more often or move the jar somewhere cooler between feedings.",
  },
  {
    q: "When should I start over?",
    a: "Only if you see fuzzy mold or pink or orange streaks. Those go in the trash, jar and all. Slow rises, hooch, acetone smells, and separation are all fixable.",
  },
];

export default function SourdoughStarterTroubleshooting() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <SeoPage
      path={PATH}
      title="Sourdough Starter Troubleshooting: Why It's Not Rising"
      description="Find out why your sourdough starter isn't rising or doubling and what to fix first, from temperature to feeding ratio to timing."
      h1="Sourdough Starter Troubleshooting"
      eyebrow="Troubleshooting"
      jsonLd={faqLd}
    >
      <StubSection id="check-temperature" heading="Check temperature first">
        <p>
          Before you change flour, water, jars, or schedules, take the temperature of the spot where your starter lives.
          A cheap instant-read thermometer settles most arguments in ten seconds.
        </p>
        <p>
          Target 75 to 82°F. At 65°F a starter can take three times as long to peak, which reads exactly like a dead
          culture if you are checking on it once a day. Warm it up and most problems disappear on their own.
        </p>
      </StubSection>

      <StubSection id="check-feeding-ratio" heading="Check the feeding ratio">
        <p>
          Feed by weight, not by cups. One part starter, one part flour, one part water. If you feed a big jar of
          starter a small amount of flour, it burns through the food in an hour and collapses before you notice a rise.
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>Keep the jar small. Twenty grams of starter is plenty.</li>
          <li>Discard down to that before every feed so the ratio stays honest.</li>
          <li>Use unbleached flour. Bleached flour and some whole-grain blends slow activity.</li>
        </ul>
      </StubSection>

      <StubSection id="check-timing" heading="Check your timing">
        <p>
          Mark the jar right after you feed it. A rubber band works. Then look at four hours, six hours, and eight
          hours. Write down when it peaks for three days running and you will know your starter's actual schedule
          instead of guessing.
        </p>
        <p>
          Peak is a domed top with bubbles through the sides. Once the dome sinks and the surface goes flat and
          bubbly, it has passed peak. Bake at peak, not after.
        </p>
      </StubSection>

      <StubSection id="smells" heading="What the smell is telling you">
        <ul className="ml-5 list-disc space-y-2">
          <li><b>Yogurt, green apple, ripe fruit:</b> healthy and ready.</li>
          <li><b>Nail polish or acetone:</b> hungry. Feed more often or warm it up.</li>
          <li><b>Sharp vinegar:</b> over-fermented. Discard more and feed sooner.</li>
          <li><b>Cheese or gym socks in the first three days:</b> normal early bacteria. Keep feeding.</li>
          <li><b>Musty or truly rotten, with fuzz:</b> mold. Start over.</li>
        </ul>
      </StubSection>

      <StubSection id="when-to-start-over" heading="When to start over">
        <p>
          Rare. Fuzzy mold in any color, or pink or orange streaks, means the culture is compromised and no amount of
          feeding fixes it. Throw out the starter, wash the jar in hot soapy water, and rebuild. Everything short of
          that deserves three more days of warm, consistent feeding before you give up.
        </p>
      </StubSection>

      <section aria-labelledby="faq-h" className="rounded-2xl border border-parchment-deep bg-white/70 p-6 md:p-8">
        <h2 id="faq-h" className="font-display text-2xl font-semibold text-crust md:text-3xl">Frequently asked</h2>
        <div className="mt-4 space-y-4">
          {FAQ.map((f) => (
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
          . Loaves coming out gummy?{" "}
          <Link to="/fix-gummy-dense-sourdough" className="font-semibold text-cranberry hover:underline">
            Fix gummy or dense sourdough
          </Link>
          .
        </p>
      </aside>
    </SeoPage>
  );
}
