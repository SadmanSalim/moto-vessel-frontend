import Link from "next/link";
import { categories as fallbackCategories } from "@/data/categories";
import { useCategories } from "@/hooks/useCatalog";
import { resolveCmsIcon } from "@/lib/cmsIcons";
import type { Category } from "@/types";

const delayClasses = ["d1", "d2", "d3", "d4", "d5", "d6"];

// Homepage only teases a handful of categories — the full list (currently
// 35 across car + bike parts) lives on the dedicated /categories page via
// the "View All" link below, so the homepage grid doesn't turn into a wall
// of icons.
const HOMEPAGE_CATEGORY_LIMIT = 14;

export function CategorySlider({ initialCategories }: { initialCategories?: Category[] } = {}) {
  const { data: apiCategories, isLoading } = useCategories({ nav: true }, initialCategories);

  // Only fall back to the generic placeholder list once loading has
  // actually finished and the API genuinely came back empty — never while
  // still loading, otherwise it flashes fake categories before the real
  // ones arrive.
  const items = apiCategories?.length
    ? apiCategories.slice(0, HOMEPAGE_CATEGORY_LIMIT).map((c) => ({
        id: c.id,
        name: c.name,
        href: `/products/all?category=${c.slug}`,
        image: c.image_path ?? null,
        Icon: resolveCmsIcon(c.icon ?? ""),
      }))
    : isLoading
      ? []
      : fallbackCategories.map((c) => ({ id: c.id, name: c.name, href: "#", image: null, Icon: c.icon }));

  return (
    <section className="bg-white py-12 md:py-14" aria-labelledby="categories-heading">
      <div className="mv-container">
        <div className="mb-7 flex items-center justify-between gap-4">
          <h2 id="categories-heading" className="section-title-blue reveal">
            Shop by Category
          </h2>
          <Link href="/categories" className="shrink-0 text-[13px] font-semibold text-mv-primary transition hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-7 md:gap-4">
          {isLoading && !items.length &&
            Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex animate-pulse flex-col items-center rounded-xl border border-mv-border bg-white px-3 py-5">
                <div className="h-[58px] w-[58px] rounded-full bg-mv-bg" />
                <div className="mt-2.5 h-3 w-14 rounded bg-mv-bg" />
              </div>
            ))}
          {items.map((item, index) => {
            const Icon = item.Icon;
            // Mobile only teases 6 (2 full rows of the 3-col grid) — the rest
            // stay in the DOM (so desktop's 7-col grid still shows all 14)
            // but are hidden below the sm breakpoint instead of being sliced
            // out, which would've shrunk the desktop grid too.
            const mobileHidden = index >= 6 ? "hidden sm:flex" : "flex";
            return (
              <Link
                key={item.id}
                href={item.href}
                prefetch={false}
                className={`group reveal ${mobileHidden} flex-col items-center rounded-xl border border-mv-border bg-white px-3 py-5 shadow-sm transition hover:-translate-y-0.5 hover:border-mv-primary/30 hover:shadow-md ${delayClasses[index % delayClasses.length]}`}
              >
                <div className="flex h-[58px] w-[58px] items-center justify-center overflow-hidden rounded-full bg-mv-blue-light text-mv-primary transition group-hover:bg-mv-primary group-hover:text-white">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Icon size={26} strokeWidth={1.5} />
                  )}
                </div>
                <span className="mt-2.5 text-center text-[12px] font-semibold text-mv-text md:text-[13px]">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
