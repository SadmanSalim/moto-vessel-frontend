import api from "@/lib/axios";
import { unwrap } from "@/lib/api";
import type { MyReview } from "@/types";

export type Review = {
  id: number;
  rating: number;
  title: string | null;
  comment: string | null;
  author: string;
  created_at: string;
};

export type ReviewStats = {
  average: number;
  count: number;
};

export const reviewService = {
  list: async (slug: string): Promise<{ items: Review[]; stats: ReviewStats }> =>
    unwrap(await api.get(`/products/${slug}/reviews`)),

  submit: async (
    slug: string,
    data: { rating: number; title?: string; comment?: string },
  ): Promise<{ item: Review; stats: ReviewStats }> => unwrap(await api.post(`/products/${slug}/reviews`, data)),

  myReviews: async (): Promise<MyReview[]> => unwrap(await api.get("/auth/reviews")),

  remove: async (id: number) => unwrap(await api.delete(`/reviews/${id}`)),
};
