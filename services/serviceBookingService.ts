import api from "@/lib/axios";
import { unwrap } from "@/lib/api";

export const serviceBookingService = {
  book: async (
    serviceId: number,
    data: { name: string; email: string; phone: string; description?: string },
  ) => unwrap(await api.post(`/services/${serviceId}/book`, data)),
};
