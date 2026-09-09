import api from "@/lib/axios";
import { unwrap } from "@/lib/api";
import type { Banner } from "@/types";

export const bannerService = {
  getAll: async (): Promise<Banner[]> =>
    unwrap(await api.get("/cms/banners", { params: { position: "hero" } })),
};
