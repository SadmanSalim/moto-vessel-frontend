import type { VehicleBrand, VehicleEngine, VehicleModel } from "@/types";

export type FinderStep = "brand" | "model" | "year" | "engine";

export type FinderState = {
  step: FinderStep;
  selectedBrand: VehicleBrand | null;
  selectedModel: VehicleModel | null;
  selectedYear: string | null;
  selectedEngine: VehicleEngine | null;
};

export const INITIAL_FINDER_STATE: FinderState = {
  step: "brand",
  selectedBrand: null,
  selectedModel: null,
  selectedYear: null,
  selectedEngine: null,
};

export function buildYearRange(from?: string, to?: string): string[] {
  const start = Number(from ?? 2010);
  const end = Number(to ?? new Date().getFullYear());
  const years: string[] = [];
  for (let y = end; y >= start; y--) {
    years.push(String(y));
  }
  return years.length ? years : ["2024", "2023", "2022", "2021", "2020"];
}
