import api from "@/lib/axios";
import { unwrap } from "@/lib/api";
import type { StoreLocation } from "@/types";

export const storeService = {
  getAll: async (): Promise<StoreLocation[]> => unwrap(await api.get("/stores")),
};
