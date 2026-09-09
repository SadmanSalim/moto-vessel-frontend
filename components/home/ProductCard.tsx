"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { useCmsSettings } from "@/hooks/useCms";
import { useHasMounted } from "@/hooks/useHasMounted";
import { useIsWishlisted, useToggleWishlist } from "@/hooks/useWishlist";
import { useCartStore } from "@/store/cartStore";
import { useCartUIStore } from "@/store/cartUIStore";
import { useAuthStore } from "@/store/authStore";
import { analytics } from "@/lib/analytics";
import { formatPrice } from "@/lib/mapProduct";
import { buildWhatsAppInquiryLink, productAbsoluteUrl } from "@/lib/whatsapp";

type ProductCardProps = {
  product: Product;
  revealClass?: string;
  apiProductId?: number;
  sku?: string;
};

export function ProductCard({ product, revealClass = "", apiProductId, sku }: ProductCardProps) {
  const mounted = useHasMounted();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartUIStore((s) => s.open);
  const isAuthenticatedRaw = useAuthStore((s) => s.isAuthenticated);
  const isAuthenticated = mounted && isAuthenticatedRaw;
  const source = product.source ?? "pos";
  const isWishlisted = useIsWishlisted(apiProductId ?? product.id, source);
  const toggleWishlist = useToggleWishlist(product.slug ?? String(product.id));
  const hasPrice = product.hasPrice ?? true;
  const inStock = (product.stockStatus ?? "in-stock") !== "out-of-stock";
  const canPurchase = hasPrice && inStock;
  const { data: settings } = useCmsSettings();
  const whatsappHref = buildWhatsAppInquiryLink({
    phone: settings?.contact_phone,
    productName: product.name,
    productUrl: productAbsoluteUrl(product.slug ?? product.id),
    hasPrice,
    inStock,
  });

  const handleAddToCart = () => {
    addItem({
      id: apiProductId ?? product.id,
      source: product.source ?? "pos",
      sku: sku ?? `SKU-${product.id}`,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    openCart();
  };

  const handleSelectItem = () => {
    analytics.selectItem({ id: apiProductId ?? product.id, name: product.name, price: product.price, category: product.category });
  };

  const handleToggleWishlist = () => {
    if (!isWishlisted) {
      analytics.addToWishlist({ id: apiProductId ?? product.id, name: product.name, price: product.price });
    }
    toggleWishlist.mutate();
  };

  return (
    <article className={`mv-card mv-card-hover flex h-full min-w-0 flex-col overflow-hidden ${revealClass}`}>
      <div className="relative">
        <Link href={`/products/${product.slug ?? product.id}`} onClick={handleSelectItem} prefetch={false} className="relative block aspect-[4/3] bg-mv-bg p-5">
          <Image src={product.image} alt={product.name} width={240} height={180} className="h-full w-full object-contain" />
        </Link>
        {isAuthenticated ? (
          <button
            type="button"
            onClick={handleToggleWishlist}
            disabled={toggleWishlist.isPending}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow disabled:opacity-60"
          >
            <Heart size={14} className={isWishlisted ? "fill-mv-red text-mv-red" : "text-mv-muted"} />
          </button>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="inline-block w-fit rounded-full bg-mv-blue-light px-2.5 py-0.5 text-[10px] font-semibold text-mv-primary">
          {product.category}
        </span>
        <h3 className="mt-2 line-clamp-2 min-h-[40px] text-[13px] font-semibold leading-snug text-mv-text">
          {product.name}
        </h3>
        <p className="mt-2 text-[17px] font-bold text-mv-text">
          {hasPrice ? formatPrice(product.price) : <span className="text-[13px] text-mv-muted">Contact for price</span>}
        </p>
        <div className="mt-3 flex gap-2">
          {canPurchase ? (
            <>
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 rounded-xl border border-mv-primary py-2 text-[12px] font-semibold text-mv-primary transition hover:bg-mv-blue-light"
              >
                Add to Cart
              </button>
              <Link
                href={`/products/${product.slug ?? product.id}`}
                prefetch={false}
                className="flex-1 rounded-xl bg-mv-primary py-2 text-center text-[12px] font-semibold text-white transition hover:bg-mv-primary-dark"
              >
                Buy Now
              </Link>
            </>
          ) : (
            // Either no price is set yet, or it's out of stock — Buy
            // Now/Add to Cart don't make sense either way, so WhatsApp
            // (pre-filled with a price/pre-order message + product link) is
            // the only ordering path shown.
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 rounded-xl bg-[#25D366] py-2 text-center text-[12px] font-semibold text-white transition hover:bg-[#1fb855]"
            >
              {inStock ? "Order on WhatsApp" : "Contact on WhatsApp"}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
