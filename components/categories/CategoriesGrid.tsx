"use client";

import Link from "next/link";
import { useCategories } from "@/hooks/useCatalog";
import { resolveCmsIcon } from "@/lib/cmsIcons";
import type { Category } from "@/types";

function CategoryCard({ category }: { category: Category }) {
  const Icon = resolveCmsIcon(category.icon ?? "");

  return (
    <Link
      href={`/products/all?category=${category.slug}`}
      prefetch={false}
      className="group flex flex-col items-center rounded-xl border border-mv-border bg-white px-3 py-5 shadow-sm transition hover:-translate-y-0.5 hover:border-mv-primary/30 hover:shadow-md"
    >
      <div className="flex h-[58px] w-[58px] items-center justify-center overflow-hidden rounded-full bg-mv-blue-light text-mv-primary transition group-hover:bg-mv-primary group-hover:text-white">
        {category.image_path ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={category.image_path} alt="" className="h-full w-full object-cover" />
        ) : (
          <Icon size={26} strokeWidth={1.5} />
        )}
      </div>
      <span className="mt-2.5 text-center text-[12px] font-semibold text-mv-text md:text-[13px]">{category.name}</span>
      {typeof category.products_count === "number" && (
        <span className="mt-1 text-[11px] text-mv-muted">{category.products_count} products</span>
      )}
    </Link>
  );
}

function CategoryGroup({ title, items }: { title: string; items: Category[] }) {
  if (!items.length) return null;

  return (
    <div className="mb-10">
      <h2 className="mb-4 text-[18px] font-bold text-mv-text md:text-[20px]">{title}</h2>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 md:gap-4 lg:grid-cols-7">
        {items.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}

export function CategoriesGrid({ initialCategories }: { initialCategories?: Category[] } = {}) {
  const { data: apiCategories, isLoading } = useCategories({ nav: true }, initialCategories);
  const categories = apiCategories ?? [];

  const carCategories = categories.filter((c) => (c.vehicle_type ?? "car") === "car");
  const bikeCategories = categories.filter((c) => c.vehicle_type === "bike");

  if (isLoading && !categories.length) {
    return (
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 md:gap-4 lg:grid-cols-7">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="flex animate-pulse flex-col items-center rounded-xl border border-mv-border bg-white px-3 py-5">
            <div className="h-[58px] w-[58px] rounded-full bg-mv-bg" />
            <div className="mt-2.5 h-3 w-14 rounded bg-mv-bg" />
          </div>
        ))}
      </div>
    );
  }

  if (!categories.length) {
    return <p className="text-[14px] text-mv-muted">No categories found.</p>;
  }

  return (
    <div>
      <CategoryGroup title="Car Parts" items={carCategories} />
      <CategoryGroup title="Bike Parts" items={bikeCategories} />
    </div>
  );
}
