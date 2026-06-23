import Link from "next/link";
import { categories } from "@/data/categories";

const delayClasses = ["d1", "d2", "d3", "d4", "d5", "d6"];

export function CategorySlider() {
  return (
    <section className="bg-white py-12 md:py-14" aria-labelledby="categories-heading">
      <div className="mv-container">
        <div className="mb-7 flex items-center justify-between gap-4">
          <h2 id="categories-heading" className="section-title-blue reveal">
            Shop by Category
          </h2>
          <Link href="/products/brake-shoes" className="shrink-0 text-[13px] font-semibold text-mv-primary transition hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-7 md:gap-4">
          {categories.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href="#"
                className={`group reveal flex flex-col items-center rounded-xl border border-mv-border bg-white px-3 py-5 shadow-sm transition hover:-translate-y-0.5 hover:border-mv-primary/30 hover:shadow-md ${delayClasses[index % delayClasses.length]}`}
              >
                <div className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-mv-blue-light text-mv-primary transition group-hover:bg-mv-primary group-hover:text-white">
                  <Icon size={26} strokeWidth={1.5} />
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
