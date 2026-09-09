import { useQuery } from "@tanstack/react-query";
import { vehicleService } from "@/services/vehicleService";

export const useVehicleBrands = (type?: "car" | "bike") =>
  useQuery({
    queryKey: ["vehicle-brands", type ?? "all"],
    queryFn: () => vehicleService.getBrands(type),
  });

export const useVehicleModels = (brandId?: number) =>
  useQuery({
    queryKey: ["vehicle-models", brandId],
    queryFn: () => vehicleService.getModels(brandId!),
    enabled: !!brandId,
  });

export const useVehicleEngines = (modelId?: number) =>
  useQuery({
    queryKey: ["vehicle-engines", modelId],
    queryFn: () => vehicleService.getEngines(modelId!),
    enabled: !!modelId,
  });
