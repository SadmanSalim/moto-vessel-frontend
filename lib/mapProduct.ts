import type { Product } from "@/data/products";
import type { ApiProduct } from "@/types";

const PLACEHOLDER = "/images/placeholders/product.svg";

export function mapApiProductToCard(product: ApiProduct): Product {
  // has_price is the authoritative signal (distinguishes "no price set" from
  // a genuine 0). Fall back to a null/undefined check for any older API
  // response shape that doesn't send has_price yet.
  const hasPrice = product.has_price ?? product.price != null;
  const price = Number(product.effective_price ?? product.sale_price ?? product.price ?? 0);
  const stockStatus =
    product.stock_quantity <= 0
      ? "out-of-stock"
      : product.stock_quantity < 5
        ? "low-stock"
        : "in-stock";

  return {
    id: product.id,
    name: product.name,
    category: product.category?.name ?? product.brand?.name ?? "Parts",
    price,
    oldPrice: product.sale_price ? Number(product.price) : undefined,
    image: product.primary_image?.url ?? PLACEHOLDER,
    badge: product.category?.name ?? product.brand?.name,
    rating: product.average_rating ?? 0,
    reviewCount: product.review_count ?? 0,
    // The listing endpoints (e.g. GET /products) put slug directly on the
    // product object; only some other shapes nest it under `detail`. Prefer
    // the top-level field — checking `detail` first was the bug: for every
    // product returned by the main listing/search endpoints, `detail` isn't
    // present at all, so this silently fell through to the numeric id
    // (e.g. /products/3245 instead of /products/throttle-cable-...).
    slug: product.slug ?? product.detail?.slug ?? String(product.id),
    stockStatus,
    source: product.source ?? "pos",
    hasPrice,
  };
}

export function formatPrice(amount: number): string {
  return `৳${amount.toLocaleString("en-BD")}`;
}
