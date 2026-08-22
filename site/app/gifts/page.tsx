import { readCatalog } from "@/lib/catalog";
import { ProductList } from "./components";

export const dynamic = "force-static";

export default function GiftsIndex() {
  const { products } = readCatalog();
  return (
    <>
      <h1>Holiday Gift Guide — all products ({products.length})</h1>
      <ProductList products={products} />
    </>
  );
}
