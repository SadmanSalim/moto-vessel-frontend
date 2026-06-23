"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { BrandStep } from "./BrandStep";
import { EngineStep } from "./EngineStep";
import { ModelStep } from "./ModelStep";
import { StepTracker } from "./StepTracker";
import { YearStep } from "./YearStep";
import { getEngines, getModels, getYears, type BrandName } from "./data";
import { INITIAL_FINDER_STATE, type FinderState, type FinderStep } from "./types";
import { cn } from "@/lib/utils";

type VehiclePartsFinderDropdownProps = {
  className?: string;
};

export function VehiclePartsFinderDropdown({ className }: VehiclePartsFinderDropdownProps) {
  const router = useRouter();
  const [state, setState] = useState<FinderState>(INITIAL_FINDER_STATE);
  const [animKey, setAnimKey] = useState(0);

  const goToStep = useCallback((step: FinderStep) => {
    setState((prev) => ({ ...prev, step }));
    setAnimKey((k) => k + 1);
  }, []);

  const handleFindParts = () => {
    const { selectedBrand, selectedModel, selectedYear, selectedEngine } = state;
    if (!selectedBrand || !selectedModel || !selectedYear || !selectedEngine) return;

    const params = new URLSearchParams({
      brand: selectedBrand,
      model: selectedModel,
      year: selectedYear,
      engine: selectedEngine,
    });

    router.push(`/products/brake-shoes?${params.toString()}`);
  };

  const years = getYears();
  const models = state.selectedBrand ? getModels(state.selectedBrand) : [];
  const engines =
    state.selectedBrand && state.selectedModel
      ? getEngines(state.selectedBrand, state.selectedModel)
      : [];

  return (
    <div
      className={cn(
        "parts-finder-dropdown-enter w-[min(900px,calc(100vw-2rem))] rounded-b-[16px] border border-t-0 border-[#e8edf5] bg-white px-8 pb-8 pt-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
        className,
      )}
      role="dialog"
      aria-label="Vehicle Parts Finder"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
        }
      }}
    >
      <div className="mb-8">
        <StepTracker step={state.step} />
      </div>

      <div key={animKey} className="parts-finder-step-enter">
        {state.step === "brand" ? (
          <BrandStep
            selectedBrand={state.selectedBrand}
            onSelect={(brand: BrandName) => setState((prev) => ({ ...prev, selectedBrand: brand }))}
            onBack={() => setState(INITIAL_FINDER_STATE)}
            onNext={() => {
              if (state.selectedBrand) goToStep("model");
            }}
          />
        ) : null}

        {state.step === "model" && state.selectedBrand ? (
          <ModelStep
            selectedBrand={state.selectedBrand}
            selectedModel={state.selectedModel}
            models={models}
            onSelect={(model) => setState((prev) => ({ ...prev, selectedModel: model }))}
            onBack={() => goToStep("brand")}
            onNext={() => {
              if (state.selectedModel) goToStep("year");
            }}
          />
        ) : null}

        {state.step === "year" && state.selectedBrand && state.selectedModel ? (
          <YearStep
            selectedBrand={state.selectedBrand}
            selectedModel={state.selectedModel}
            selectedYear={state.selectedYear}
            years={years}
            onSelect={(year) => setState((prev) => ({ ...prev, selectedYear: year }))}
            onBack={() => goToStep("model")}
            onNext={() => {
              if (state.selectedYear) goToStep("engine");
            }}
          />
        ) : null}

        {state.step === "engine" && state.selectedBrand && state.selectedModel && state.selectedYear ? (
          <EngineStep
            selectedBrand={state.selectedBrand}
            selectedModel={state.selectedModel}
            selectedYear={state.selectedYear}
            selectedEngine={state.selectedEngine}
            engines={engines}
            onSelect={(engine) => setState((prev) => ({ ...prev, selectedEngine: engine }))}
            onBack={() => goToStep("year")}
            onFindParts={handleFindParts}
          />
        ) : null}
      </div>
    </div>
  );
}
