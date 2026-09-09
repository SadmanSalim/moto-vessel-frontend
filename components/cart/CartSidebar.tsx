"use client";

import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useHasMounted } from "@/hooks/useHasMounted";
import { formatPrice } from "@/lib/mapProduct";
import { useCartUIStore } from "@/store/cartUIStore";
import { useCartStore } from "@/store/cartStore";

/**
 * Slide-out cart drawer, opened from the header cart icon. Lets someone
 * adjust quantity or remove an item without leaving whatever page they're
 * on, then either go to full Checkout or the dedicated /cart page for a
 * bigger view of the same thing.
 */
export function CartSidebar() {
  const mounted = useHasMounted();
  const isOpen = useCartUIStore((s) => s.isOpen);
  const close = useCartUIStore((s) => s.close);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const total = useCartStore((s) => s.total());

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000]" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div className="absolute inset-0 bg-black/50" onClick={close} aria-hidden />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-[400px] flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-mv-border px-5 py-4">
          <h2 className="flex items-center gap-2 text-[15px] font-bold text-mv-text">
            <ShoppingCart size={18} />
            Your Cart {items.length > 0 ? `(${items.length})` : ""}
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close cart"
            className="flex h-8 w-8 items-center justify-center rounded-full text-mv-muted transition hover:bg-mv-bg hover:text-mv-text"
          >
            <X size={18} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingCart size={40} className="text-mv-border" />
            <p className="text-[13px] text-mv-muted">Your cart is empty.</p>
            <Link
              href="/products/all"
              onClick={close}
              className="mt-2 rounded-xl bg-mv-primary px-5 py-2.5 text-[13px] font-semibold text-white"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={`${item.source}-${item.id}`} className="flex gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-mv-bg">
                      <Image
                        src={item.image ?? "/images/placeholders/product.svg"}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-[12.5px] font-semibold leading-snug text-mv-text">{item.name}</p>
                      <p className="mt-0.5 text-[13px] font-bold text-mv-primary">{formatPrice(item.price)}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex items-center rounded-full border border-mv-border">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.source, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                            className="px-2 py-0.5 text-mv-muted hover:text-mv-text disabled:opacity-40"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="w-6 text-center text-[12px] font-semibold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.source, item.quantity + 1)}
                            aria-label="Increase quantity"
                            className="px-2 py-0.5 text-mv-muted hover:text-mv-text"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id, item.source)}
                          aria-label={`Remove ${item.name}`}
                          className="text-[11px] font-semibold text-mv-muted transition hover:text-mv-red"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-mv-border px-5 py-4">
              <div className="flex items-center justify-between text-[13px]">
                <span className="font-semibold text-mv-muted">Subtotal</span>
                <span className="text-[17px] font-bold text-mv-text">{formatPrice(total)}</span>
              </div>
              <p className="mt-1 text-[11px] text-mv-muted">Shipping and tax calculated at checkout.</p>

              <Link
                href="/checkout"
                onClick={close}
                className="mt-4 flex w-full items-center justify-center rounded-xl bg-mv-navy py-3 text-[14px] font-bold text-white"
              >
                Checkout
              </Link>
              <Link
                href="/cart"
                onClick={close}
                className="mt-2.5 flex w-full items-center justify-center rounded-xl border border-mv-border py-3 text-[13px] font-semibold text-mv-text transition hover:bg-mv-bg"
              >
                View Cart
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
