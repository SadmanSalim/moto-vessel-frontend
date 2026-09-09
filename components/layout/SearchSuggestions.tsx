"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { formatPrice, mapApiProductToCard } from "@/lib/mapProduct";
import { productService } from "@/services/productService";

const MIN_QUERY_LENGTH = 2;
const SUGGESTION_LIMIT = 6;

export function SearchSuggestions({
  query,
  open,
  onNavigate,
  variant = "dropdown",
}: {
  /** Debounced search term — parent is responsible for debouncing. */
  query: string;
  open: boolean;
  onNavigate: () => void;
  /**
   * "dropdown" (default) absolutely-positions itself under an input inside
   * a `relative` wrapper — the desktop/mobile-drawer search bars. "inline"
   * renders as a plain block instead, for full-page contexts like
   * MobileSearchSheet where there's no input wrapper to anchor a dropdown
   * to.
   */
  variant?: "dropdown" | "inline";
}) {
  const trimmed = query.trim();
  const enabled = open && trimmed.length >= MIN_QUERY_LENGTH;

  const { data, isFetching } = useQuery({
    queryKey: ["products", "search-suggestions", trimmed],
    queryFn: () => productService.search(trimmed, 1, SUGGESTION_LIMIT),
    enabled,
    staleTime: 30_000,
  });

  if (!open || trimmed.length < MIN_QUERY_LENGTH) return null;

  const products = (data?.items ?? []).slice(0, SUGGESTION_LIMIT).map(mapApiProductToCard);
  const seeAllHref = `/products/all?search=${encodeURIComponent(trimmed)}`;

  return (
    <div
      className={
        variant === "dropdown"
          ? "absolute left-0 right-0 top-full z-[60] mt-2 max-h-[70vh] overflow-y-auto rounded-xl border border-gray-100 bg-white text-left shadow-xl"
          : "text-left"
      }
      role="listbox"
    >
      {isFetching && !data ? (
        <div className="space-y-3 p-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="h-11 w-11 shrink-0 rounded-lg bg-mv-bg" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-3/4 rounded bg-mv-bg" />
                <div className="h-3 w-1/4 rounded bg-mv-bg" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <ul className="divide-y divide-[var(--mv-border)]">
          {products.map((product) => (
            <li key={product.id}>
              <Link
                href={`/products/${product.slug}`}
                onClick={onNavigate}
                className="flex items-center gap-3 px-4 py-2.5 transition hover:bg-mv-bg"
              >
                <Image
                  src={product.image}
                  alt=""
                  width={44}
                  height={44}
                  className="h-11 w-11 shrink-0 rounded-lg border border-[var(--mv-border)] bg-white object-contain p-1"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-mv-text">{product.name}</p>
                  <p className="text-[11px] text-mv-muted">{product.category}</p>
                </div>
                <span className="shrink-0 text-[13px] font-bold text-mv-primary">
                  {product.hasPrice ? formatPrice(product.price) : "—"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="px-4 py-6 text-center text-[13px] text-mv-muted">
          No products found for &ldquo;{trimmed}&rdquo;
        </div>
      )}

      <Link
        href={seeAllHref}
        onClick={onNavigate}
        className="flex items-center justify-center gap-1.5 border-t border-[var(--mv-border)] px-4 py-3 text-[13px] font-semibold text-mv-primary transition hover:bg-mv-bg"
      >
        <Search size={13} />
        See all results for &ldquo;{trimmed}&rdquo;
        <ArrowRight size={13} />
      </Link>
    </div>
  );
}
