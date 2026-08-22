import type { CatalogRecord } from "@/lib/catalog";

// Every product renders as real text in the HTML: name, price with two
// decimals, and the affiliate link carrying rel/target straight from the
// catalog record. Nothing hardcoded. Records with no price (null) show no
// price rather than an invented one.
export function ProductList({ products }: { products: CatalogRecord[] }) {
  return (
    <ul>
      {products.map((p, i) => (
        <li key={`${p.slug ?? p.name ?? i}`} data-product-slug={p.slug}>
          {p.url ? (
            <a href={p.url} rel={p.rel ?? undefined} target={p.target ?? undefined}>
              {p.name}
            </a>
          ) : (
            <span>{p.name}</span>
          )}{" "}
          ({typeof p.price === "number" ? `$${p.price.toFixed(2)}` : "price pending"})
        </li>
      ))}
    </ul>
  );
}
