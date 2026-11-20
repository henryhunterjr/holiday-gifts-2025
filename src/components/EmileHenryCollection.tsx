import { ArrowUpRight } from "lucide-react";
import ceramics from "@/data/emileHenry.json";

type Ceramic = (typeof ceramics)[number];

function Purchase({ piece }: { piece: Ceramic }) {
  return (
    <div className="ceramic-purchase">
      <p className="ceramic-price">
        <strong>${piece.price.toFixed(2)}</strong>
        {piece.regularPrice && <del aria-label={`Regular price ${piece.regularPrice} dollars`}>${piece.regularPrice.toFixed(2)}</del>}
      </p>
      <a href={piece.url} target="_blank" rel="noopener noreferrer" aria-label={`Shop the ${piece.name} in ${piece.color} at Émile Henry`}>
        Shop at Émile Henry <ArrowUpRight size={18} aria-hidden />
      </a>
    </div>
  );
}

export function EmileHenryCollection() {
  const [baguette, ...pieces] = ceramics;
  return (
    <section id="emile-henry" aria-labelledby="ceramics-heading" className="ceramics">
      <div className="ceramics-inner">
        <header className="ceramics-heading">
          <div><p className="ceramic-kicker">French ceramic bakeware</p><h2 id="ceramics-heading">Émile Henry</h2></div>
          <p>A baguette for supper. A sandwich loaf for the week. Start with the bread they love to make, then choose the piece shaped for it.</p>
        </header>
        <article className="ceramic-feature" data-product={baguette.slug} data-brand={baguette.brand}>
          <img src={baguette.img} alt="A Burgundy baguette baker open beside three scored baguettes, olives and a linen napkin" width="1200" height="1200" loading="lazy" />
          <div className="ceramic-feature-copy">
            <p className="ceramic-kicker">Shown in {baguette.color}</p>
            <h3>{baguette.name}</h3><p>{baguette.desc}</p>
            <Purchase piece={baguette} />
          </div>
        </article>
        <div className="ceramic-grid">
          {pieces.map(piece => (
            <article key={piece.slug} data-product={piece.slug} data-brand={piece.brand}>
              <div className="ceramic-photo"><img src={piece.img} alt={piece.alt} width="850" height="850" loading="lazy" decoding="async" /></div>
              <div className="ceramic-copy">
                <p className="ceramic-kicker">Shown in {piece.color}</p>
                <h3>{piece.name}</h3><p>{piece.desc}</p>
                <Purchase piece={piece} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
