import type { CatalogRecord } from "@/lib/catalog";

// Product card: a faithful port of the SPA's .gift-tag element — brand chip,
// contain-fit product image melting into the parchment, display-font name,
// Henry's handwritten note, price + promo code row, evergreen Buy button with
// string lights. The whole card is clickable via a stretched anchor that
// carries the record's affiliate rel/target. data-product-slug stays on the
// card root; the render gate counts it.
function buyLabel(p: CatalogRecord): string {
  if (p.source === "books" || p.source === "amazon") return "Buy on Amazon";
  if (p.source === "krustic") return "Buy at Krustic";
  if (p.source === "free") return "Get it free";
  if (typeof p.brand === "string" && p.brand.trim() !== "") return `Buy at ${p.brand}`;
  return "Buy it here";
}

export function ProductList({ products, pinnedName }: { products: CatalogRecord[]; pinnedName?: string | null }) {
  return (
    <ul className="card-grid">
      {products.map((p, i) => {
        const pinned = pinnedName != null && p.name === pinnedName;
        const hasImg = typeof p.img === "string" && p.img.trim() !== "";
        return (
          <li key={`${p.slug ?? p.name ?? i}`} data-product-slug={p.slug} className={`gift-tag${pinned ? " has-pick" : ""}`}>
            {pinned && <span className="pick-ribbon">Henry's pick</span>}
            {typeof p.brand === "string" && p.brand.trim() !== "" && <span className="brand-chip">{p.brand}</span>}
            {/* stretched anchor: makes the whole card clickable */}
            {p.url && (
              <a className="card-stretch" href={p.url} rel={p.rel ?? undefined} target={p.target ?? undefined} aria-label={p.name ?? "product link"} />
            )}
            {hasImg ? (
              <span className="card-img-wrap">
                <img className="card-img" src={p.img} alt={typeof p.alt === "string" && p.alt !== "" ? p.alt : p.name ?? ""} loading="lazy" decoding="async" width={640} height={480} />
              </span>
            ) : (
              <span className="no-img">
                <span>{p.name}</span>
              </span>
            )}
            <span className="tag-name">{p.name}</span>
            {typeof p.desc === "string" && p.desc.trim() !== "" && <p className="tag-desc">{p.desc}</p>}
            {typeof p.note === "string" && p.note.trim() !== "" && <p className="tag-note">"{p.note}"</p>}
            <span className="tag-foot">
              <span className="tag-price">{typeof p.price === "number" ? `${p.priceFrom ? "from " : ""}$${p.price.toFixed(2)}` : "price pending"}</span>
              {typeof p.code === "string" && p.code.trim() !== "" && <span className="code-pill">{p.code}</span>}
            </span>
            {p.url && (
              <a className="buy-btn" href={p.url} rel={p.rel ?? undefined} target={p.target ?? undefined}>
                <span className="bulbs" aria-hidden="true">
                  <i className="bulb b1" />
                  <i className="bulb b2" />
                  <i className="bulb b3" />
                  <i className="bulb b4" />
                </span>
                {buyLabel(p)} →
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}
