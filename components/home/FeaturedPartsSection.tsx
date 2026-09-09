"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type SwiperCore from "swiper";
import "swiper/css";
import ErrorMessage from "@/components/ErrorMessage";
import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";
import { ProductCard } from "./ProductCard";
import { useCmsHomepage } from "@/hooks/useCms";
import { useProducts } from "@/hooks/useProducts";
import { getSectionTitle } from "@/lib/cmsHelpers";
import { mapApiProductToCard } from "@/lib/mapProduct";
import { getErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { PaginatedProducts } from "@/types";

const tabs = [
  { id: "best", label: "Best Selling", params: { best_seller: true } },
  { id: "new", label: "New Arrivals", params: { sort: "name" as const } },
  { id: "discounted", label: "Discounted", params: { sort: "price_asc" as const } },
  { id: "featured", label: "Featured", params: { featured: true } },
] as const;

export function FeaturedPartsSection({ initialProducts }: { initialProducts?: PaginatedProducts } = {}) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("best");
  const { data: homepage } = useCmsHomepage();
  const swiperRef = useRef<SwiperCore | null>(null);
  const activeParams = tabs.find((t) => t.id === activeTab)?.params ?? {};
  // initialProducts came from a build-time fetch matching the "best" tab's
  // params exactly — only seed it there, so switching to another tab still
  // triggers a real client fetch instead of briefly showing the wrong data
  // under the wrong tab.
  const { data, isLoading, isError, error } = useProducts(
    { ...activeParams, per_page: 4 },
    { initialData: activeTab === "best" ? initialProducts : undefined },
  );

  const products = data?.items ?? [];

  return (
    <section id="featured-parts" className="bg-mv-bg py-12 md:py-16" aria-labelledby="featured-heading">
      <div className="mv-container">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 id="featured-heading" className="section-title reveal">
            {getSectionTitle(homepage?.sections, "featured_products", "Featured Parts")}
          </h2>
          <div className="flex shrink-0 items-center gap-4">
            {products.length > 1 && (
              <div className="reveal hidden gap-2 sm:flex">
                <button
                  type="button"
                  aria-label="Previous products"
                  onClick={() => swiperRef.current?.slidePrev()}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-mv-border bg-white text-mv-text transition hover:border-mv-primary hover:text-mv-primary"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  aria-label="Next products"
                  onClick={() => swiperRef.current?.slideNext()}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-mv-border bg-white text-mv-text transition hover:border-mv-primary hover:text-mv-primary"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
            <Link href="/products/all" className="text-[13px] font-semibold text-mv-primary hover:underline">
              View All →
            </Link>
          </div>
        </div>

        <div className="flex gap-1 border-b border-mv-border" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "border-b-2 px-4 py-2.5 text-[13px] font-semibold transition",
                activeTab === tab.id
                  ? "border-mv-primary text-mv-primary"
                  : "border-transparent text-mv-muted hover:text-mv-text",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-7" role="tabpanel">
          {isLoading && (
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}
          {isError && <ErrorMessage message={getErrorMessage(error)} />}
          {!isLoading && !isError && (products.length ? (
            <Swiper
              key={`${activeTab}-${products.length}`}
              modules={[Navigation]}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              spaceBetween={16}
              slidesPerView={1.4}
              breakpoints={{
                480: { slidesPerView: 2.15 },
                768: { slidesPerView: 3, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 20 },
              }}
              className="!pb-1"
            >
              {products.map((product, index) => {
                const card = mapApiProductToCard(product);
                return (
                  <SwiperSlide key={`${activeTab}-${product.id}`} className="h-auto">
                    <ProductCard
                      product={card}
                      apiProductId={product.id}
                      sku={product.sku}
                      revealClass={`reveal d${index + 1}`}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          ) : (
            <p className="text-center text-[13px] text-mv-muted">No products available yet.</p>
          ))}
        </div>
      </div>
    </section>
  );
}
