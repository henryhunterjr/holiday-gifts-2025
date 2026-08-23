import type { CatalogRecord } from "@/lib/catalog";

// Product card: name, price to two decimals, description and promo code from
// the catalog when present, buy link carrying rel/target straight from the
// record. data-product-slug is the stable marker the render test counts.
export function ProductList({ products, pinnedName }: { products: CatalogRecord[]; pinnedName?: string | null }) {
  return (
    <ul className="products">
      {products.map((p, i) => {
        const pinned = pinnedName != null && p.name === pinnedName;
        return (
          <li key={`${p.slug ?? p.name ?? i}`} data-product-slug={p.slug} className={pinned ? "pinned" : undefined}>
            {pinned && <span className="pick-label">Henry's pick</span>}
            <span className="name">
              {p.url ? (
                <a href={p.url} rel={p.rel ?? undefined} target={p.target ?? undefined}>
                  {p.name}
                </a>
              ) : (
                p.name
              )}
            </span>{" "}
            <span className="price">({typeof p.price === "number" ? `$${p.price.toFixed(2)}` : "price pending"})</span>
            {typeof p.desc === "string" && p.desc.trim() !== "" && <p className="desc">{p.desc}</p>}
            {typeof p.code === "string" && p.code.trim() !== "" && (
              <p className="code">
                Promo code: <strong>{p.code}</strong>
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
