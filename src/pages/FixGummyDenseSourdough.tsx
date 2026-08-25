import { SeoPage, StubSection } from "@/components/seo/SeoPage";
import { Link } from "react-router-dom";

const PATH = "/fix-gummy-dense-sourdough";

const FAQ = [
  {
    q: "Why is my sourdough gummy inside?",
    a: "Almost always because it was cut too soon or pulled from the oven too early. Bread finishes cooking as it cools. Bake to an internal temperature of 205 to 210°F and let the loaf cool at least four hours before slicing.",
  },
  {
    q: "Why is my sourdough dense?",
    a: "Under-fermented dough, weak starter, or not enough strength built during shaping. Use starter at peak, ferment until the dough is visibly puffy and jiggly, and give it real tension on the bench before the final proof.",
  },
  {
    q: "Can I fix a gummy loaf after baking?",
    a: "Partly. Slice it thick and toast it, or dry it in a 300°F oven for croutons and breadcrumbs. You cannot re-bake it back into a good crumb, but you can absolutely still eat it.",
  },
];

export default function FixGummyDenseSourdough() {
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
      title="How to Fix Gummy or Dense Sourdough Bread"
      description="Gummy crumb and dense loaves come from a handful of fixable causes: under-baking, slicing too early, weak starter, and under-fermented dough. Here's how to correct each one."
      h1="Fix Gummy or Dense Sourdough"
      eyebrow="Troubleshooting"
      jsonLd={faqLd}
    >
      <StubSection id="diagnose" heading="Diagnose the loaf first">
        <p>
          Cut a slice and look at the crumb, because the crumb tells you where it went wrong.
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li><b>Sticky, paste-like band near the bottom:</b> under-baked, or sliced warm.</li>
          <li><b>Tight, even, cake-like crumb with little rise:</b> under-fermented or weak starter.</li>
          <li><b>Big tunnels over a dense base:</b> shaping problem, gas escaped instead of spreading out.</li>
          <li><b>Gray, wet, sour crumb that tears:</b> over-fermented. Gluten broke down.</li>
        </ul>
      </StubSection>

      <StubSection id="under-baking" heading="Under-baking and slicing too early">
        <p>
          This is the number one cause of gummy sourdough and the easiest to fix. Bake until the internal temperature
          reads 205 to 210°F in the center. Color is not a reliable signal, especially with a dark whole-grain loaf.
        </p>
        <p>
          Then leave it alone. A hot loaf is still setting its starch structure. Four hours on a wire rack is the
          minimum for a standard boule, and overnight is better for high-hydration or rye-heavy loaves. Cutting at
          thirty minutes guarantees a gummy streak no matter how well you baked it.
        </p>
      </StubSection>

      <StubSection id="fermentation" heading="Under-fermented and over-fermented dough">
        <p>
          Under-fermented dough is heavy and pale with a tight crumb. It needs more time, a warmer spot, or a stronger
          starter. Watch the dough, not the clock: bulk is done when it has grown noticeably, feels airy, and jiggles
          as one mass.
        </p>
        <p>
          Over-fermented dough spreads flat, sticks to everything, and bakes into a gray, damp crumb. Cut the bulk
          time, ferment cooler, or use less starter in the mix. In a 78°F kitchen, dough moves much faster than most
          recipes assume.
        </p>
      </StubSection>

      <StubSection id="starter-strength" heading="Starter strength">
        <p>
          A sluggish starter cannot raise a loaf no matter how patient you are. Before mixing, your starter should
          double within four to eight hours, dome on top, and pass the float test. If it does not, give it two days of
          twice-daily feeding in a warm spot before you bake again.
        </p>
        <p>
          Work through{" "}
          <Link to="/sourdough-starter-troubleshooting" className="font-semibold text-cranberry hover:underline">
            starter troubleshooting
          </Link>{" "}
          if yours is stubborn.
        </p>
      </StubSection>

      <StubSection id="hydration-and-flour" heading="Hydration and flour">
        <p>
          If you are new, back the hydration down to 70 percent and build up from there. High-hydration dough is not
          more advanced bread, it is just harder to handle and far less forgiving of a fermentation error.
        </p>
        <p>
          Use bread flour with 12 percent protein or more for structure. Whole wheat and rye absorb more water and
          ferment faster, so when you add them, add water and subtract time.
        </p>
      </StubSection>

      <StubSection id="fix-checklist" heading="Next-bake checklist">
        <ul className="ml-5 list-disc space-y-2">
          <li>Starter used at peak, doubled and domed</li>
          <li>70 to 75 percent hydration with 12 percent-plus protein bread flour</li>
          <li>Bulk fermented until visibly puffy and jiggly, judged by feel not by clock</li>
          <li>Real tension built at shaping, taut skin, seam sealed</li>
          <li>Baked covered then uncovered, to 205 to 210°F internal</li>
          <li>Cooled on a rack at least four hours before slicing</li>
        </ul>
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
          A thermometer and a proofer solve most of this. Both are in the{" "}
          <Link to="/essential-baking-tools" className="font-semibold text-cranberry hover:underline">
            essential baking tools list
          </Link>
          .
        </p>
      </aside>
    </SeoPage>
  );
}
