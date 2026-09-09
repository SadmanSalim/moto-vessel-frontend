"use client";

import Image from "next/image";
import { useCmsHomepage } from "@/hooks/useCms";
import { premiumBrands as fallbackBrands } from "@/data/brands";

export function PremiumBrands() {
  const { data, isLoading } = useCmsHomepage();

  // Same rule as testimonials: only drop back to the placeholder strip once
  // loading has actually finished and the admin genuinely hasn't featured
  // any real brands (Admin > Products > Brands) — never mid-load, or the
  // fake logos flash before the real ones arrive.
  const brands = data?.brands?.length ? data.brands : isLoading ? [] : fallbackBrands;
  const title = data?.sections?.find((s) => s.section_key === "brands_section")?.title || "Brands We Cover";

  if (!brands.length) return null;

  return (
    <section className="border-t border-[var(--mv-border)] bg-white py-10 md:py-12" aria-labelledby="brands-heading">
      <div className="mv-container">
        <h2 id="brands-heading" className="section-title reveal text-center">
          {title}
        </h2>

        <div className="reveal mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-14">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="grayscale opacity-50 transition duration-300 hover:grayscale-0 hover:opacity-100"
              title={brand.name}
            >
              <Image
                src={brand.logo}
                alt={brand.name}
                width={110}
                height={36}
                className="h-7 w-auto object-contain md:h-8"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
