import api from "@/lib/axios";
import { unwrap } from "@/lib/api";
import type { VehicleBrand, VehicleEngine, VehicleModel } from "@/types";

export const vehicleService = {
  getBrands: async (type?: "car" | "bike"): Promise<VehicleBrand[]> =>
    unwrap(await api.get("/vehicles/brands", { params: type ? { type } : undefined })),
  getModels: async (brandId: number): Promise<VehicleModel[]> =>
    unwrap(await api.get(`/vehicles/models/${brandId}`)),
  getEngines: async (modelId: number): Promise<VehicleEngine[]> =>
    unwrap(await api.get(`/vehicles/engines/${modelId}`)),
};
