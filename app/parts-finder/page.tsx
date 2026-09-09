"use client";

import { AlertCircle, CheckCircle2, Sparkles, TrendingUp } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";
import { ProductCard } from "@/components/home/ProductCard";
import { useProductsByVehicle } from "@/hooks/useProducts";
import { getErrorMessage } from "@/lib/api";
import { mapApiProductToCard } from "@/lib/mapProduct";
import type { VehicleMatchType } from "@/types";

const MATCH_BANNERS: Record<VehicleMatchType, { icon: typeof CheckCircle2; className: string; text: (v: string) => string }> = {
  exact: {
    icon: CheckCircle2,
    className: "border-green-200 bg-green-50 text-green-700",
    text: (v) => `Exact match — these parts are tagged compatible with your ${v}.`,
  },
  near: {
    icon: Sparkles,
    className: "border-mv-primary/20 bg-mv-blue-light/40 text-mv-primary",
    text: (v) => `No exact tag for your ${v} — showing closely compatible parts for the same brand/model.`,
  },
  broad: {
    icon: AlertCircle,
    className: "border-amber-200 bg-amber-50 text-amber-700",
    text: (v) => `No close match found for your ${v} — showing other parts from the same brand.`,
  },
  popular: {
    icon: TrendingUp,
    className: "border-mv-border bg-mv-bg text-mv-muted",
    text: () => "No compatibility data matched this vehicle yet — showing popular parts for this vehicle type instead.",
  },
};

function PartsFinderContent() {
  const searchParams = useSearchParams();
  const brand = searchParams.get("brand") ?? undefined;
  const model = searchParams.get("model") ?? undefined;
  const year = searchParams.get("year") ?? undefined;
  const engine = searchParams.get("engine") ?? undefined;
  const type = searchParams.get("type") ?? undefined;

  const { data, isLoading, isError, error } = useProductsByVehicle({ brand, model, year, engine, type });

  if (!brand || !model || !year || !engine) {
    return (
      <div className="mv-container py-16 text-center">
        <p className="text-[14px] text-mv-muted">Use the Vehicle Parts Finder in the navigation to search for compatible parts.</p>
      </div>
    );
  }

  const vehicleLabel = `${year} ${brand} ${model} (${engine})`;
  const hasResults = (data?.items.length ?? 0) > 0;
  const banner = data?.matchType && hasResults ? MATCH_BANNERS[data.matchType] : null;

  return (
    <section className="bg-mv-bg py-10 md:py-12">
      <div className="mv-container">
        <h1 className="text-[24px] font-bold text-mv-text">
          Parts for {year} {brand} {model} — {engine}
        </h1>
        <p className="mt-2 text-[13px] text-mv-muted">
          {isLoading ? "Searching..." : `${data?.meta.total ?? 0} products found`}
        </p>

        {!isLoading && banner ? (
          <div className={`mt-4 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-[13px] ${banner.className}`}>
            <banner.icon size={16} className="mt-0.5 shrink-0" />
            <span>{banner.text(vehicleLabel)}</span>
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          {isError && (
            <div className="col-span-full">
              <ErrorMessage message={getErrorMessage(error)} />
            </div>
          )}
          {!isLoading &&
            !isError &&
            (data?.items.length ? (
              data.items.map((product) => {
                const card = mapApiProductToCard(product);
                return (
                  <ProductCard key={product.id} product={card} apiProductId={product.id} sku={product.sku} />
                );
              })
            ) : (
              <div className="col-span-full py-6 text-center">
                <p className="text-[13px] font-medium text-mv-text">No parts in the catalog yet for this vehicle.</p>
                <p className="mt-1 text-[12px] text-mv-muted">
                  We checked for an exact match, similar models, the same brand, and popular parts for this vehicle
                  type — nothing matched. Try{" "}
                  <a href="/products/all" className="font-semibold text-mv-primary hover:underline">
                    browsing all products
                  </a>{" "}
                  or contact us for help finding the right part.
                </p>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

export default function PartsFinderPage() {
  return (
    <Suspense fallback={<div className="mv-container py-16">Loading...</div>}>
      <PartsFinderContent />
    </Suspense>
  );
}
