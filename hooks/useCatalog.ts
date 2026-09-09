import { useQuery } from "@tanstack/react-query";
import { brandService, categoryService } from "@/services/catalogService";
import type { Category } from "@/types";

export const useCategories = (
  options?: { nav?: boolean; type?: "car" | "bike" },
  initialData?: Category[],
) =>
  useQuery({
    queryKey: ["categories", options?.nav ?? false, options?.type ?? "all"],
    queryFn: () => categoryService.getAll(options),
    initialData,
    initialDataUpdatedAt: 0,
  });

export const useCategoryMenu = (type: "car" | "bike") =>
  useQuery({
    queryKey: ["categories", "menu", type],
    queryFn: () => categoryService.getMenu(type),
    staleTime: 0,
  });

export const useBrands = () => useQuery({ queryKey: ["brands"], queryFn: brandService.getAll });
