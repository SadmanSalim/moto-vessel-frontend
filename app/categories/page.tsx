import type { Metadata } from "next";
import { CategoriesGrid } from "@/components/categories/CategoriesGrid";
import { fetchNavCategories } from "@/lib/serverApi";

export const metadata: Metadata = {
  title: "Shop by Category - Moto Vessel",
  description: "Browse all car and bike parts categories available on Moto Vessel.",
};

// Server component so the full category list is baked into the static
// HTML at build time, same pattern as the homepage's CategorySlider —
// avoids an empty grid flashing before the client-side fetch resolves.
export default async function CategoriesPage() {
  const initialCategories = await fetchNavCategories();

  return (
    <div className="mv-container py-10 md:py-14">
      <h1 className="mb-1 text-[24px] font-extrabold text-mv-text md:text-[28px]">Shop by Category</h1>
      <p className="mb-8 text-[14px] text-mv-muted">Browse every car and bike parts category we carry.</p>
      <CategoriesGrid initialCategories={initialCategories.length ? initialCategories : undefined} />
    </div>
  );
}
