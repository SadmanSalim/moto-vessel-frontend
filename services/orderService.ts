import api from "@/lib/axios";
import { unwrap } from "@/lib/api";
import type { Order } from "@/types";

export const orderService = {
  create: async (data: Record<string, unknown>): Promise<Order> => unwrap(await api.post("/orders", data)),
  track: async (orderNumber: string): Promise<Order> => unwrap(await api.get(`/orders/track/${orderNumber}`)),
  myOrders: async (): Promise<Order[]> => {
    const data = unwrap(await api.get("/orders/my"));
    return Array.isArray(data) ? data : (data as { data?: Order[] }).data ?? [];
  },
};
