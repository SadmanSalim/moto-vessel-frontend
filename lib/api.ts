import type { AxiosError } from "axios";
import type { ApiProduct, PaginatedProducts } from "@/types";

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export function unwrap<T>(response: { data: ApiEnvelope<T> }): T {
  return response.data.data;
}

export function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError<ApiEnvelope<unknown> & { errors?: Record<string, string[]> }>;
    const data = axiosError.response?.data;
    if (data?.message) return data.message;
    if (data?.errors) {
      const first = Object.values(data.errors)[0];
      if (first?.[0]) return first[0];
    }
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

export function normalizeProductsPayload(data: unknown): PaginatedProducts {
  if (!data || typeof data !== "object") {
    return { items: [], meta: { current_page: 1, last_page: 1, per_page: 15, total: 0 } };
  }

  const payload = data as {
    data?: ApiProduct[];
    meta?: PaginatedProducts["meta"];
    match_type?: PaginatedProducts["matchType"];
    matched_on?: PaginatedProducts["matchedOn"];
  };

  if (Array.isArray(payload.data) && payload.meta) {
    return {
      items: payload.data,
      meta: payload.meta,
      matchType: payload.match_type,
      matchedOn: payload.matched_on,
    };
  }

  if (Array.isArray(data)) {
    return {
      items: data as ApiProduct[],
      meta: { current_page: 1, last_page: 1, per_page: (data as ApiProduct[]).length, total: (data as ApiProduct[]).length },
    };
  }

  return { items: [], meta: { current_page: 1, last_page: 1, per_page: 15, total: 0 } };
}
