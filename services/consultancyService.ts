import api from "@/lib/axios";
import { unwrap } from "@/lib/api";

export const consultancyService = {
  submit: async (data: {
    name: string;
    phone: string;
    email?: string;
    message?: string;
    vehicle_brand?: string;
    vehicle_model?: string;
  }) => unwrap(await api.post("/consultancy", data)),
};
