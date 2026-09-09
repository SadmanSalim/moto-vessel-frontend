"use client";

import { resolveCmsIcon } from "@/lib/cmsIcons";
import { useCmsHomepage } from "@/hooks/useCms";
import { brandPromises } from "@/data/promises";

export function ValuePromiseSection() {
  const { data, isLoading } = useCmsHomepage();
  // Same rule as TestimonialSection: only fall back to the generic promise
  // cards once loading is done and the CMS has none configured, not while
  // still loading.
  const cards = data?.feature_cards?.length
    ? data.feature_cards.map((card) => ({
        id: card.id,
        title: card.title,
        description: card.description,
        icon: resolveCmsIcon(card.icon),
      }))
    : isLoading
      ? []
      : brandPromises;

  return (
    <section className="border-y border-mv-border bg-white py-12 md:py-14" aria-labelledby="promise-heading">
      <div className="mv-container">
        <h2 id="promise-heading" className="section-title reveal text-center">
          {data?.sections?.find((s) => s.section_key === "features")?.title || "The Moto Vessel Promise"}
        </h2>
        <div className="mt-9 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
          {cards.map((item, index) => {
            const Icon = item.icon;
            return (
              <article key={item.id} className={`reveal flex flex-col items-center text-center d${index + 1}`}>
                <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-mv-blue-light text-mv-primary shadow-sm">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="mt-2.5 text-[13px] font-bold text-mv-text">{item.title}</h3>
                <p className="mt-0.5 text-[11px] leading-relaxed text-mv-muted">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
