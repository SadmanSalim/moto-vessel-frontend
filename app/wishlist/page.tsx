"use client";

import { Heart, Loader2, Plus, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ErrorMessage from "@/components/ErrorMessage";
import { useReveal } from "@/hooks/useReveal";
import { useToggleWishlist, useWishlist } from "@/hooks/useWishlist";
import { getErrorMessage } from "@/lib/api";
import { formatPrice, mapApiProductToCard } from "@/lib/mapProduct";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import type { ApiProduct } from "@/types";

function WishlistCard({ product }: { product: ApiProduct }) {
  const card = mapApiProductToCard(product);
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useToggleWishlist(card.slug ?? String(product.id));

  return (
    <article className="mv-card min-w-0 overflow-hidden">
      <div className="relative">
        <Link href={`/products/${card.slug}`} className="relative block aspect-[4/3] bg-mv-bg p-4">
          <Image src={card.image} alt={card.name} width={200} height={150} className="h-full w-full object-contain" />
        </Link>
        <button
          type="button"
          onClick={() => toggleWishlist.mutate()}
          disabled={toggleWishlist.isPending}
          aria-label="Remove from wishlist"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-mv-red shadow disabled:opacity-60"
        >
          <Heart size={14} className="fill-mv-red" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-[13px] font-semibold text-mv-text">{card.name}</h3>
        <div className="mt-1 flex items-center gap-1">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={11} className={i < Math.round(card.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
            ))}
          </div>
          {card.reviewCount ? <span className="text-[10px] text-mv-muted">({card.reviewCount})</span> : null}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-[15px] font-bold text-mv-text">{formatPrice(card.price)}</p>
          <button
            type="button"
            onClick={() =>
              addItem({
                id: product.id,
                source: product.source,
                sku: product.sku,
                name: card.name,
                price: card.price,
                quantity: 1,
                image: card.image,
              })
            }
            className="flex h-8 w-8 items-center justify-center rounded-full bg-mv-primary text-white transition hover:bg-mv-primary-dark"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function WishlistPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data, isLoading, isError, error } = useWishlist();

  useReveal();

  if (!isAuthenticated) {
    return (
      <div className="mv-container flex min-h-[50vh] flex-col items-center justify-center gap-4 py-16 text-center">
        <Heart size={32} className="text-mv-muted" />
        <p className="text-[16px] font-semibold text-mv-text">Sign in to view your wishlist</p>
        <Link href="/sign-in" className="rounded-xl bg-mv-primary px-6 py-3 text-[13px] font-semibold text-white">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-mv-bg">
      <div className="border-b border-mv-border bg-white py-3">
        <div className="mv-container text-[12px] text-mv-muted">
          <Link href="/" className="hover:text-mv-primary">Home</Link>
          {" > "}
          <span className="text-mv-text">Wishlist</span>
        </div>
      </div>

      <div className="mv-container py-8 md:py-12">
        <h1 className="text-[22px] font-bold text-mv-text">My Wishlist</h1>
        <p className="mt-1 text-[13px] text-mv-muted">
          {isLoading ? "Loading..." : `${data?.length ?? 0} saved ${data?.length === 1 ? "item" : "items"}`}
        </p>

        {isError ? (
          <div className="mt-6">
            <ErrorMessage message={getErrorMessage(error)} />
          </div>
        ) : null}

        {isLoading ? (
          <div className="mt-10 flex justify-center">
            <Loader2 size={24} className="animate-spin text-mv-primary" />
          </div>
        ) : null}

        {!isLoading && !isError && (data?.length ?? 0) === 0 ? (
          <div className="mt-10 text-center">
            <p className="text-[13px] text-mv-muted">You haven&apos;t saved any parts yet.</p>
            <Link href="/products/all" className="mt-4 inline-flex rounded-xl bg-mv-primary px-6 py-3 text-[13px] font-semibold text-white">
              Browse Products
            </Link>
          </div>
        ) : null}

        {!isLoading && !isError && (data?.length ?? 0) > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data!.map((product) => (
              <WishlistCard key={`${product.source}-${product.id}`} product={product} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
