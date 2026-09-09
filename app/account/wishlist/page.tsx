"use client";

import { Heart, Loader2, Plus, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ErrorMessage from "@/components/ErrorMessage";
import { useToggleWishlist, useWishlist } from "@/hooks/useWishlist";
import { getErrorMessage } from "@/lib/api";
import { formatPrice, mapApiProductToCard } from "@/lib/mapProduct";
import { useCartStore } from "@/store/cartStore";
import type { ApiProduct } from "@/types";

function WishlistCard({ product }: { product: ApiProduct }) {
  const card = mapApiProductToCard(product);
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useToggleWishlist(card.slug ?? String(product.id));

  return (
    <article className="min-w-0 overflow-hidden rounded-[14px] border border-[#eef2f8]">
      <div className="relative">
        <Link href={`/products/${card.slug}`} className="relative block aspect-[4/3] bg-[#f7f9fd] p-4">
          <Image src={card.image} alt={card.name} width={200} height={150} className="h-full w-full object-contain" />
        </Link>
        <button
          type="button"
          onClick={() => toggleWishlist.mutate()}
          disabled={toggleWishlist.isPending}
          aria-label="Remove from wishlist"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#dc2626] shadow disabled:opacity-60"
        >
          <Heart size={14} className="fill-[#dc2626]" />
        </button>
      </div>
      <div className="p-3.5">
        <h3 className="text-[12.5px] font-semibold text-[#1a2744]">{card.name}</h3>
        <div className="mt-1 flex items-center gap-1">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={10} className={i < Math.round(card.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
            ))}
          </div>
          {card.reviewCount ? <span className="text-[10px] text-[#5c7099]">({card.reviewCount})</span> : null}
        </div>
        <div className="mt-2.5 flex items-center justify-between">
          <p className="text-[14px] font-bold text-[#1a2744]">{formatPrice(card.price)}</p>
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
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1565c0] text-white transition hover:bg-[#0d4ba0]"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function AccountWishlistPage() {
  const { data, isLoading, isError, error } = useWishlist();

  return (
    <div className="rounded-[18px] bg-white p-6 shadow-[0_10px_30px_rgba(13,71,161,0.06)]">
      <h2 className="text-[15px] font-bold text-[#1a2744]">My Wishlist</h2>
      <p className="mt-1 text-[12px] text-[#5c7099]">
        {isLoading ? "Loading..." : `${data?.length ?? 0} saved ${data?.length === 1 ? "item" : "items"}`}
      </p>

      {isError ? (
        <div className="mt-4">
          <ErrorMessage message={getErrorMessage(error)} />
        </div>
      ) : null}

      {isLoading ? (
        <div className="mt-8 flex justify-center">
          <Loader2 size={22} className="animate-spin text-[#1565c0]" />
        </div>
      ) : null}

      {!isLoading && !isError && (data?.length ?? 0) === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-[12px] text-[#5c7099]">You haven&apos;t saved any parts yet.</p>
          <Link href="/products/all" className="mt-4 inline-flex rounded-xl bg-[#1565c0] px-6 py-2.5 text-[12px] font-bold text-white">
            Browse Products
          </Link>
        </div>
      ) : null}

      {!isLoading && !isError && (data?.length ?? 0) > 0 ? (
        <div className="mt-4 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {data!.map((product) => (
            <WishlistCard key={`${product.source}-${product.id}`} product={product} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
