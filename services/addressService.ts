import api from "@/lib/axios";
import { unwrap } from "@/lib/api";
import type { Address } from "@/types";

export type AddressInput = {
  label?: string;
  recipient_name: string;
  phone: string;
  address_line: string;
  city: string;
  area?: string;
  postal_code?: string;
  is_default?: boolean;
};

export const addressService = {
  list: async (): Promise<Address[]> => unwrap(await api.get("/addresses")),
  create: async (data: AddressInput): Promise<Address> => unwrap(await api.post("/addresses", data)),
  update: async (id: number, data: Partial<AddressInput>): Promise<Address> =>
    unwrap(await api.put(`/addresses/${id}`, data)),
  remove: async (id: number) => unwrap(await api.delete(`/addresses/${id}`)),
  setDefault: async (id: number): Promise<Address> => unwrap(await api.patch(`/addresses/${id}/default`)),
};
