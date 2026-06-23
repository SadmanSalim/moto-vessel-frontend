"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { useState } from "react";
import { brandSlug, modelSlug, type BrandName } from "./data";
import { cn } from "@/lib/utils";

type ModelStepProps = {
  selectedBrand: BrandName;
  selectedModel: string | null;
  models: string[];
  onSelect: (model: string) => void;
  onBack: () => void;
  onNext: () => void;
};

function ModelImage({ brand, model }: { brand: BrandName; model: string }) {
  const [failed, setFailed] = useState(false);
  const src = `/models/${brandSlug(brand)}/${modelSlug(model)}.jpg`;

  if (failed) {
    return (
      <div className="flex h-full min-h-[100px] w-full items-center justify-center bg-[#1a1a1a] text-[11px] font-medium text-white/60">
        {model}
      </div>
    );
  }

  return (
    <div className="relative h-[100px] w-full overflow-hidden bg-[#1a1a1a]">
      <Image src={src} alt={model} fill className="object-cover" onError={() => setFailed(true)} />
    </div>
  );
}

export function ModelStep({ selectedBrand, selectedModel, models, onSelect, onBack, onNext }: ModelStepProps) {
  return (
    <>
      <div className="text-center">
        <h2 className="text-[28px] font-extrabold tracking-tight text-[#1a2e6f]">Select Vehicle Model</h2>
        <p className="mt-2 text-[13px] text-[#6b7c95]">
          Step 2: Choose your specific model for <span className="font-bold text-[#2563eb]">{selectedBrand}</span>
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {models.map((model) => {
          const isSelected = selectedModel === model;
          return (
            <button
              key={model}
              type="button"
              onClick={() => onSelect(model)}
              className={cn(
                "group relative overflow-hidden rounded-[12px] border-2 bg-[#f8f9fb] text-left transition hover:-translate-y-0.5",
                isSelected ? "border-[#2563eb] shadow-[0_8px_24px_rgba(37,99,235,0.12)]" : "border-transparent hover:border-[#2563eb]/35",
              )}
            >
              {isSelected ? (
                <span className="absolute right-2 top-2 z-[2] flex h-6 w-6 items-center justify-center rounded-full bg-[#2563eb] text-white shadow-sm">
                  <Check size={14} strokeWidth={3} />
                </span>
              ) : null}
              <ModelImage brand={selectedBrand} model={model} />
              <p className="px-3 py-3 text-center text-[13px] font-bold text-[#1a2e6f]">{model}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-[#eef2f8] pt-5">
        <button
          type="button"
          onClick={onBack}
          className="text-[13px] font-medium text-[#1a2e6f] transition hover:text-[#2563eb]"
        >
          ← Back to Brand
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!selectedModel}
          className="rounded-[8px] bg-[#1a2e6f] px-6 py-2.5 text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(26,46,111,0.2)] transition hover:bg-[#152456] disabled:cursor-not-allowed disabled:opacity-45"
        >
          Next: Select Year →
        </button>
      </div>
    </>
  );
}
