import type { BrandName } from "./data";

export type FinderStep = "brand" | "model" | "year" | "engine";

export type FinderState = {
  step: FinderStep;
  selectedBrand: BrandName | null;
  selectedModel: string | null;
  selectedYear: string | null;
  selectedEngine: string | null;
};

export const INITIAL_FINDER_STATE: FinderState = {
  step: "brand",
  selectedBrand: null,
  selectedModel: null,
  selectedYear: null,
  selectedEngine: null,
};
