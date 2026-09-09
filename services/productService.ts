import api from "@/lib/axios";
import { normalizeProductsPayload, unwrap } from "@/lib/api";
import type { ApiProduct, PaginatedProducts } from "@/types";

type ProductParams = {
  page?: number;
  per_page?: number;
  category_id?: number;
  category?: string;
  brand_id?: number;
  brand?: string;
  model?: string;
  year?: string;
  featured?: boolean;
  best_seller?: boolean;
  sort?: string;
  search?: string;
  price_min?: number;
  price_max?: number;
};

export const productService = {
  getAll: async (params?: ProductParams): Promise<PaginatedProducts> => {
    const response = await api.get("/products", { params });
    return normalizeProductsPayload(unwrap(response));
  },

  getBySlug: async (slug: string): Promise<ApiProduct> => {
    const response = await api.get(`/products/${slug}`);
    return unwrap(response);
  },

  search: async (query: string, page = 1, perPage?: number): Promise<PaginatedProducts> => {
    const response = await api.get("/products/search", { params: { q: query, page, per_page: perPage } });
    return normalizeProductsPayload(unwrap(response));
  },

  getByVehicle: async (params: {
    brand: string;
    model: string;
    year: string;
    engine: string;
    type?: string;
    page?: number;
  }): Promise<PaginatedProducts> => {
    const response = await api.get("/products/by-vehicle", { params });
    return normalizeProductsPayload(unwrap(response));
  },
};
