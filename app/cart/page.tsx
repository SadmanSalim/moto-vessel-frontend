"use client";

import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useHasMounted } from "@/hooks/useHasMounted";
import { formatPrice } from "@/lib/mapProduct";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const mounted = useHasMounted();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const total = useCartStore((s) => s.total());

  if (!mounted) return null;

  return (
    <div className="bg-mv-bg">
      <div className="border-b border-mv-border bg-white py-3">
        <div className="mv-container text-[12px] text-mv-muted">
          <Link href="/" className="hover:text-mv-primary">Home</Link>
          {" > "}
          <span className="text-mv-text">Cart</span>
        </div>
      </div>

      <div className="mv-container py-8 md:py-12">
        <h1 className="mb-6 text-[22px] font-bold text-mv-text">Your Cart</h1>

        {items.length === 0 ? (
          <div className="mv-card flex flex-col items-center gap-3 py-16 text-center">
            <ShoppingCart size={40} className="text-mv-border" />
            <p className="text-[14px] font-semibold text-mv-text">Your cart is empty</p>
            <p className="text-[13px] text-mv-muted">Add parts to your cart to see them here.</p>
            <Link href="/products/all" className="mt-4 rounded-xl bg-mv-primary px-6 py-3 text-[13px] font-semibold text-white">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="mv-card divide-y divide-mv-border">
              {items.map((item) => (
                <div key={`${item.source}-${item.id}`} className="flex gap-4 p-5">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-mv-bg">
                    <Image
                      src={item.image ?? "/images/placeholders/product.svg"}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold text-mv-text">{item.name}</p>
                    <p className="mt-0.5 text-[12px] text-mv-muted">{item.sku}</p>
                    <p className="mt-1 text-[15px] font-bold text-mv-primary">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id, item.source)}
                      aria-label={`Remove ${item.name}`}
                      className="text-mv-muted transition hover:text-mv-red"
                    >
                      <X size={18} />
                    </button>
                    <div className="flex items-center rounded-full border border-mv-border">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.source, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                        className="px-3 py-1.5 text-mv-muted hover:text-mv-text disabled:opacity-40"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-8 text-center text-[13px] font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.source, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="px-3 py-1.5 text-mv-muted hover:text-mv-text"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mv-card h-fit p-6">
              <h2 className="text-[15px] font-bold text-mv-text">Order Summary</h2>
              <div className="mt-4 flex justify-between text-[13px]">
                <span className="text-mv-muted">Subtotal</span>
                <span className="font-semibold text-mv-text">{formatPrice(total)}</span>
              </div>
              <p className="mt-1 text-[11px] text-mv-muted">Shipping and tax calculated at checkout.</p>
              <Link
                href="/checkout"
                className="mt-5 flex w-full items-center justify-center rounded-xl bg-mv-navy py-3.5 text-[14px] font-bold text-white"
              >
                Proceed to Checkout
              </Link>
              <Link
                href="/products/all"
                className="mt-2.5 flex w-full items-center justify-center rounded-xl border border-mv-border py-3 text-[13px] font-semibold text-mv-text transition hover:bg-mv-bg"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
