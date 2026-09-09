import api from "@/lib/axios";
import { unwrap } from "@/lib/api";
import type { ApiProduct } from "@/types";

export const wishlistService = {
  list: async (): Promise<ApiProduct[]> => {
    const data = unwrap(await api.get("/wishlist"));
    return Array.isArray(data) ? data : [];
  },

  toggle: async (slug: string): Promise<{ wishlisted: boolean }> =>
    unwrap(await api.post(`/products/${slug}/wishlist`)),
};
