import type { CatalogRecord } from "@/lib/catalog";

// Product card: gift-tag styling, image on top (or a deliberate parchment
// panel when the catalog has none), name linked with rel/target straight from
// the record. data-product-slug stays on the card root — the render gate
// counts it, and if it moves the build fails, which is correct.
export function ProductList({ products, pinnedName }: { products: CatalogRecord[]; pinnedName?: string | null }) {
  return (
    <ul className="card-grid">
      {products.map((p, i) => {
        const pinned = pinnedName != null && p.name === pinnedName;
        return (
          <li key={`${p.slug ?? p.name ?? i}`} data-product-slug={p.slug} className={`gift-tag${pinned ? " has-pick" : ""}`}>
            {pinned && <span className="pick-ribbon">Henry's pick</span>}
            {typeof p.img === "string" && p.img.trim() !== "" ? (
              <img className="card-img" src={p.img} alt={typeof p.alt === "string" && p.alt !== "" ? p.alt : p.name ?? ""} loading="lazy" decoding="async" width={640} height={480} />
            ) : (
              <div className="no-img">
                <span>{p.name}</span>
              </div>
            )}
            <div className="tag-body">
              <span className="tag-name">
                {p.url ? (
                  <a href={p.url} rel={p.rel ?? undefined} target={p.target ?? undefined}>
                    {p.name}
                  </a>
                ) : (
                  p.name
                )}
              </span>{" "}
              <span className="tag-price">
                ({typeof p.price === "number" ? `${p.priceFrom ? "from " : ""}$${p.price.toFixed(2)}` : "price pending"})
              </span>
              {typeof p.desc === "string" && p.desc.trim() !== "" && <p className="tag-desc">{p.desc}</p>}
              {typeof p.code === "string" && p.code.trim() !== "" && <span className="code-pill">{p.code}</span>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
