"use client";

import { Bike, Car } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { BrandStep } from "./BrandStep";
import { EngineStep } from "./EngineStep";
import { ModelStep } from "./ModelStep";
import { StepTracker } from "./StepTracker";
import { YearStep } from "./YearStep";
import { INITIAL_FINDER_STATE, buildYearRange, type FinderState, type FinderStep } from "./types";
import { useVehicleBrands, useVehicleEngines, useVehicleModels } from "@/hooks/useVehicles";
import { cn } from "@/lib/utils";

type VehiclePartsFinderDropdownProps = {
  className?: string;
  /** Called right after navigating to the results page, so the header can close the dropdown/sheet. */
  onNavigate?: () => void;
};

export function VehiclePartsFinderDropdown({ className, onNavigate }: VehiclePartsFinderDropdownProps) {
  const router = useRouter();
  const [vehicleType, setVehicleType] = useState<"car" | "bike">("car");
  const [state, setState] = useState<FinderState>(INITIAL_FINDER_STATE);
  const [animKey, setAnimKey] = useState(0);

  const { data: brands = [], isLoading: brandsLoading } = useVehicleBrands(vehicleType);
  const { data: models = [], isLoading: modelsLoading } = useVehicleModels(state.selectedBrand?.id);
  const { data: engines = [], isLoading: enginesLoading } = useVehicleEngines(state.selectedModel?.id);

  const switchVehicleType = (type: "car" | "bike") => {
    if (type === vehicleType) return;
    setVehicleType(type);
    setState(INITIAL_FINDER_STATE);
    setAnimKey((k) => k + 1);
  };

  const years = useMemo(() => {
    if (state.selectedEngine) {
      return buildYearRange(state.selectedEngine.year_from, state.selectedEngine.year_to);
    }
    return buildYearRange();
  }, [state.selectedEngine]);

  const goToStep = useCallback((step: FinderStep) => {
    setState((prev) => ({ ...prev, step }));
    setAnimKey((k) => k + 1);
  }, []);

  // Accepts an optional engine override so the just-clicked engine can be
  // used immediately — state updates are async, so `state.selectedEngine`
  // wouldn't be populated yet in the same tick the user picks it.
  const handleFindParts = (engineOverride?: FinderState["selectedEngine"]) => {
    const { selectedBrand, selectedModel, selectedYear } = state;
    const selectedEngine = engineOverride ?? state.selectedEngine;
    if (!selectedBrand || !selectedModel || !selectedYear || !selectedEngine) return;

    const params = new URLSearchParams({
      type: vehicleType,
      brand: selectedBrand.name,
      model: selectedModel.name,
      year: selectedYear,
      engine: selectedEngine.name,
    });

    router.push(`/parts-finder?${params.toString()}`);
    onNavigate?.();
  };

  return (
    <div
      className={cn(
        "parts-finder-dropdown-enter w-[min(900px,calc(100vw-2rem))] rounded-b-[16px] border border-t-0 border-[#e8edf5] bg-white px-8 pb-8 pt-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
        className,
      )}
      role="dialog"
      aria-label="Vehicle Parts Finder"
      onKeyDown={(e) => {
        if (e.key === "Escape") e.stopPropagation();
      }}
    >
      {state.step === "brand" ? (
        <div className="mb-6 flex justify-center">
          <div className="inline-flex rounded-full bg-[#f0f2f7] p-1">
            <button
              type="button"
              onClick={() => switchVehicleType("car")}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-5 py-2 text-[12px] font-bold uppercase tracking-[0.08em] transition",
                vehicleType === "car" ? "bg-[#1a2e6f] text-white shadow-sm" : "text-[#6b7c95] hover:text-[#1a2e6f]",
              )}
            >
              <Car size={14} />
              Car Parts
            </button>
            <button
              type="button"
              onClick={() => switchVehicleType("bike")}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-5 py-2 text-[12px] font-bold uppercase tracking-[0.08em] transition",
                vehicleType === "bike" ? "bg-[#1a2e6f] text-white shadow-sm" : "text-[#6b7c95] hover:text-[#1a2e6f]",
              )}
            >
              <Bike size={14} />
              Bike Parts
            </button>
          </div>
        </div>
      ) : null}

      <div className="mb-8">
        <StepTracker step={state.step} />
      </div>

      <div key={animKey} className="parts-finder-step-enter">
        {state.step === "brand" ? (
          <BrandStep
            brands={brands}
            isLoading={brandsLoading}
            selectedBrand={state.selectedBrand}
            onSelect={(brand) => setState((prev) => ({ ...prev, selectedBrand: brand, selectedModel: null, selectedEngine: null }))}
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
            isLoading={modelsLoading}
            onSelect={(model) => setState((prev) => ({ ...prev, selectedModel: model, selectedEngine: null }))}
            onBack={() => goToStep("brand")}
            onNext={() => {
              if (state.selectedModel) goToStep("year");
            }}
          />
        ) : null}

        {state.step === "year" && state.selectedBrand && state.selectedModel ? (
          <YearStep
            selectedBrand={state.selectedBrand.name}
            selectedModel={state.selectedModel.name}
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
            selectedBrand={state.selectedBrand.name}
            selectedModel={state.selectedModel.name}
            selectedYear={state.selectedYear}
            selectedEngine={state.selectedEngine}
            engines={engines}
            isLoading={enginesLoading}
            onSelect={(engine) => {
              setState((prev) => ({ ...prev, selectedEngine: engine }));
              // Auto-navigate the moment the last field is picked — no need
              // for a separate "Find Parts" click.
              handleFindParts(engine);
            }}
            onBack={() => goToStep("year")}
            onFindParts={() => handleFindParts()}
          />
        ) : null}
      </div>
    </div>
  );
}
