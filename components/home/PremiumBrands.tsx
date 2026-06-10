import Image from "next/image";
import { premiumBrands } from "@/data/brands";

export function PremiumBrands() {
  return (
    <section className="border-t border-[var(--mv-border)] bg-white py-10 md:py-12" aria-labelledby="brands-heading">
      <div className="mv-container">
        <h2 id="brands-heading" className="section-title text-center">
          Premium Brands
        </h2>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-14">
          {premiumBrands.map((brand) => (
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
