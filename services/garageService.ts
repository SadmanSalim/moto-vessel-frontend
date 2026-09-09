import api from "@/lib/axios";
import { unwrap } from "@/lib/api";
import type { GarageVehicle } from "@/types";

export type GarageVehicleInput = {
  vehicle_type: "car" | "bike";
  vehicle_brand_id: number;
  vehicle_model_id: number;
  vehicle_engine_id: number;
  year: string;
  nickname?: string;
};

export const garageService = {
  list: async (): Promise<GarageVehicle[]> => unwrap(await api.get("/garage")),
  create: async (data: GarageVehicleInput): Promise<GarageVehicle> => unwrap(await api.post("/garage", data)),
  updateNickname: async (id: number, nickname: string): Promise<GarageVehicle> =>
    unwrap(await api.put(`/garage/${id}`, { nickname })),
  remove: async (id: number) => unwrap(await api.delete(`/garage/${id}`)),
  setDefault: async (id: number): Promise<GarageVehicle> => unwrap(await api.patch(`/garage/${id}/default`)),
};
