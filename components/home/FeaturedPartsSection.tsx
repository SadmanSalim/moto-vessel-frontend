"use client";

import Link from "next/link";
import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { bestSellerProducts, discountedProducts, featuredTabProducts, newArrivalProducts } from "@/data/products";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "best", label: "Best Selling", products: bestSellerProducts },
  { id: "new", label: "New Arrivals", products: newArrivalProducts },
  { id: "discounted", label: "Discounted", products: discountedProducts },
  { id: "featured", label: "Featured", products: featuredTabProducts },
] as const;

export function FeaturedPartsSection() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("best");
  const activeProducts = tabs.find((t) => t.id === activeTab)?.products ?? bestSellerProducts;

  return (
    <section id="featured-parts" className="bg-mv-bg py-12 md:py-16" aria-labelledby="featured-heading">
      <div className="mv-container">
        <div className="mb-6 flex items-center justify-between">
          <h2 id="featured-heading" className="section-title reveal">
            Featured Parts
          </h2>
          <Link href="/products/brake-shoes" className="text-[13px] font-semibold text-mv-primary hover:underline">
            View All →
          </Link>
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

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" role="tabpanel">
          {activeProducts.slice(0, 4).map((product, index) => (
            <ProductCard key={`${activeTab}-${product.id}`} product={product} revealClass={`reveal d${index + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
