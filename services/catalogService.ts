import api from "@/lib/axios";
import { unwrap } from "@/lib/api";
import type { Category, CategoryMenuGroup, Brand } from "@/types";

export const categoryService = {
  getAll: async (options?: { nav?: boolean; type?: "car" | "bike" }): Promise<Category[]> =>
    unwrap(
      await api.get("/categories", {
        params: {
          ...(options?.nav ? { nav: 1 } : {}),
          ...(options?.type ? { type: options.type } : {}),
        },
      }),
    ),
  getMenu: async (type: "car" | "bike"): Promise<CategoryMenuGroup[]> =>
    unwrap(await api.get("/categories/menu", { params: { type } })),
};

export const brandService = {
  getAll: async (): Promise<Brand[]> => unwrap(await api.get("/brands")),
};
