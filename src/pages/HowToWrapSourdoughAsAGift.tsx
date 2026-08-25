import { SeoPage, StubSection } from "@/components/seo/SeoPage";
import { Link } from "react-router-dom";

const PATH = "/how-to-wrap-sourdough-as-a-gift";

export default function HowToWrapSourdoughAsAGift() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to wrap sourdough bread as a gift",
    inLanguage: "en-US",
    author: { "@type": "Person", name: "Henry Hunter" },
    supply: [
      { "@type": "HowToSupply", name: "Cooled sourdough loaf" },
      { "@type": "HowToSupply", name: "Linen or cotton bread bag" },
      { "@type": "HowToSupply", name: "Parchment or kraft paper" },
      { "@type": "HowToSupply", name: "Baker's twine and a gift tag" },
    ],
    step: [
      { "@type": "HowToStep", name: "Cool completely", text: "Let the loaf cool on a rack at least four hours. Wrapping warm bread traps steam and softens the crust." },
      { "@type": "HowToStep", name: "Wrap in paper", text: "Roll the loaf in parchment or kraft paper, seam underneath, ends folded like a package." },
      { "@type": "HowToStep", name: "Slip it into cloth", text: "Set the wrapped loaf in a linen or cotton bread bag so the crust can still breathe." },
      { "@type": "HowToStep", name: "Tie and tag", text: "Tie with baker's twine and add a tag with the bake date and how to store it." },
      { "@type": "HowToStep", name: "Deliver same day", text: "Hand it over within 24 hours of baking for the best crust and crumb." },
    ],
  };

  return (
    <SeoPage
      path={PATH}
      title="How to Wrap Sourdough Bread as a Gift"
      description="Wrap a homemade sourdough loaf so it arrives with the crust intact: cool it fully, paper first, cloth second, twine and a tag, delivered same day."
      h1="How to Wrap Sourdough as a Gift"
      eyebrow="How-to"
      jsonLd={ld}
    >
      <StubSection id="cool-first" heading="Cool it completely first">
        <p>
          This is the step people skip and it is the one that matters most. A warm loaf gives off steam, and steam
          trapped in paper or cloth turns a crackling crust soft and leathery within an hour.
        </p>
        <p>
          Four hours on a wire rack for a standard boule. Overnight for anything high-hydration or rye-heavy. Bake the
          day before you give it away and the whole thing gets easier.
        </p>
      </StubSection>

      <StubSection id="wrapping" heading="Paper first, cloth second">
        <ol className="ml-5 list-decimal space-y-2">
          <li>Roll the cooled loaf in parchment or kraft paper, seam side down, ends folded in like a package.</li>
          <li>Slide the wrapped loaf into a linen or cotton bread bag. Cloth breathes, plastic does not.</li>
          <li>Tie it with baker's twine and leave the crust showing at one end if you want the loaf to sell itself.</li>
          <li>Add a tag with the bake date, the flour you used, and one line on storage.</li>
        </ol>
        <p>
          Skip cellophane and zip-top bags entirely. They look festive for about twenty minutes and then they steam the
          crust.
        </p>
      </StubSection>

      <StubSection id="pairings" heading="Pair the loaf with something">
        <p>
          A loaf alone is generous. A loaf inside a wood bowl, or beside a jar of honey, good butter, or flaky salt, is
          a real gift. Some pairings that work every time:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>A hand-turned wood bowl the loaf sits in, so the gift outlives the bread</li>
          <li>Cultured butter and finishing salt</li>
          <li>A jar of your dehydrated starter with feeding instructions</li>
          <li>A linen bread bag they keep using</li>
          <li>Local honey or a small jar of jam</li>
        </ul>
      </StubSection>

      <StubSection id="shipping" heading="Shipping a loaf">
        <p>
          It can be done, and it is worth being honest about the trade: shipped bread arrives softer than fresh.
          Wrap it in paper, then cloth, then set it in a rigid box with crumpled kraft paper around it. Never seal it
          airtight. Ship overnight or two-day, early in the week, and tell the recipient to refresh it for five minutes
          in a 375°F oven.
        </p>
        <p>
          For anything farther than two days out, send a jar of dehydrated starter and a note instead. That gift keeps
          going.
        </p>
      </StubSection>

      <StubSection id="tag-copy" heading="Tag copy you can steal">
        <p className="italic">
          "Baked {"{date}"}. Bread flour, water, salt, and a starter I've kept alive since {"{year}"}. Keep it cut-side
          down on the counter for two days, or slice and freeze it and toast from frozen. Do not put it in the fridge."
        </p>
        <p className="text-sm">
          One line about the starter's age turns a loaf into a story. That is the whole trick.
        </p>
      </StubSection>

      <aside className="rounded-2xl bg-parchment p-6">
        <p className="text-sm text-crumb">
          Wood bowls, linen wraps, and bread blankets are all in the{" "}
          <Link to="/" className="font-semibold text-cranberry hover:underline">
            2026 Holiday Gift Guide
          </Link>
          . Loaf not turning out right yet?{" "}
          <Link to="/fix-gummy-dense-sourdough" className="font-semibold text-cranberry hover:underline">
            Fix gummy or dense sourdough
          </Link>{" "}
          first.
        </p>
      </aside>
    </SeoPage>
  );
}
