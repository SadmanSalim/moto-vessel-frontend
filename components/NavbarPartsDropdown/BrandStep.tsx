"use client";

import Image from "next/image";
import { useState } from "react";
import { BRANDS, brandSlug, type BrandName } from "./data";
import { cn } from "@/lib/utils";

type BrandStepProps = {
  selectedBrand: BrandName | null;
  onSelect: (brand: BrandName) => void;
  onBack: () => void;
  onNext: () => void;
};

function BrandLogo({ brand }: { brand: BrandName }) {
  const [failed, setFailed] = useState(false);
  const slug = brandSlug(brand);

  if (failed) {
    return (
      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[10px] bg-[#111111] text-[11px] font-bold uppercase tracking-wider text-white">
        {brand.slice(0, 3)}
      </div>
    );
  }

  return (
    <div className="relative h-[72px] w-[72px] overflow-hidden rounded-[10px] bg-[#111111]">
      <Image
        src={`/brands/${slug}.png`}
        alt={brand}
        fill
        className="object-contain p-2"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export function BrandStep({ selectedBrand, onSelect, onBack, onNext }: BrandStepProps) {
  return (
    <>
      <div className="text-center">
        <h2 className="text-[28px] font-extrabold tracking-tight text-[#1a2e6f]">Vehicle Parts Finder</h2>
        <p className="mx-auto mt-2 max-w-[520px] text-[13px] leading-relaxed text-[#6b7c95]">
          Precision engineered components for your specific machine. Start by selecting your brand.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {BRANDS.map((brand) => {
          const isSelected = selectedBrand === brand;
          return (
            <button
              key={brand}
              type="button"
              onClick={() => onSelect(brand)}
              className={cn(
                "group flex flex-col items-center rounded-[12px] border-2 bg-white px-3 py-4 shadow-[0_4px_16px_rgba(26,46,111,0.06)] transition hover:-translate-y-0.5",
                isSelected
                  ? "border-[#2563eb] shadow-[0_8px_24px_rgba(37,99,235,0.15)]"
                  : "border-transparent hover:border-[#2563eb]/40",
              )}
            >
              <BrandLogo brand={brand} />
              <span className="mt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1a2e6f]">{brand}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-[#eef2f8] pt-5">
        <button
          type="button"
          onClick={onBack}
          className="text-[13px] font-medium text-[#6b7c95] transition hover:text-[#1a2e6f]"
        >
          ← Back
        </button>
        <div className="flex items-center gap-4">
          {selectedBrand ? (
            <p className="text-[13px] text-[#6b7c95]">
              Selected: <span className="font-bold text-[#2563eb]">{selectedBrand}</span>
            </p>
          ) : null}
          <button
            type="button"
            onClick={onNext}
            disabled={!selectedBrand}
            className="rounded-[8px] bg-[#1a2e6f] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#152456] disabled:cursor-not-allowed disabled:opacity-45"
          >
            Next Step →
          </button>
        </div>
      </div>
    </>
  );
}
