import ProductsAllClient from "@/components/products/ProductsAllClient";
import { fetchDefaultProducts } from "@/lib/serverApi";

// Server component so the default catalog view (page 1, no filters) is
// fetched at build time and baked into the static HTML — previously this
// whole page was "use client" with nothing rendering until useProducts()
// resolved in the browser after hydration.
export default async function ProductsAllPage() {
  const initialProducts = await fetchDefaultProducts(12);
  return <ProductsAllClient initialProducts={initialProducts ?? undefined} />;
}
