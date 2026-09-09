/**
 * Builds a wa.me link with a pre-filled inquiry message for products that
 * can't be bought through the normal Add to Cart / Buy Now flow — either
 * because there's no price set yet, or because it's out of stock (in which
 * case it's a pre-order inquiry instead). Always includes a link back to
 * the product page so whoever answers on WhatsApp has full context.
 */
export function buildWhatsAppInquiryLink(params: {
  phone?: string | null;
  productName: string;
  productUrl: string;
  hasPrice: boolean;
  inStock: boolean;
}): string {
  const { phone, productName, productUrl, hasPrice, inStock } = params;
  const digits = (phone ?? "").replace(/[^\d]/g, "");

  const intent =
    !inStock && !hasPrice
      ? "ask about the price and pre-order"
      : !inStock
        ? "pre-order"
        : "ask about the price of";

  const message = `Hi, I'd like to ${intent} this product:\n${productName}\n${productUrl}`;

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/**
 * Absolute URL to a product's detail page. Deliberately reads
 * NEXT_PUBLIC_APP_URL instead of `window.location.origin` — that env var is
 * inlined at build time, so it resolves to the exact same string on the
 * server-rendered HTML and the client's first render. Branching on
 * `typeof window` here previously caused a hydration mismatch: the server
 * always rendered "" (no window), but the client's very first render (the
 * one React diffs against the server HTML during hydration, before any
 * effect runs) already has `window`, so the href differed immediately.
 */
export function productAbsoluteUrl(slugOrId: string | number): string {
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "";
  return `${origin}/products/${slugOrId}`;
}
