import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/productService";
import type { ApiProduct, PaginatedProducts } from "@/types";

export const useProducts = (
  params?: Parameters<typeof productService.getAll>[0],
  options?: { enabled?: boolean; initialData?: PaginatedProducts },
) =>
  useQuery({
    queryKey: ["products", params],
    queryFn: () => productService.getAll(params),
    enabled: options?.enabled,
    initialData: options?.initialData,
    initialDataUpdatedAt: options?.initialData ? 0 : undefined,
  });

// initialData comes from the server component's build-time fetch of this
// exact slug (already needed for generateMetadata, so it was being fetched
// twice — once at build time for SEO tags, once again client-side after the
// page loaded — before this was wired through). Seeding it here means the
// product renders immediately from the static HTML instead of showing a
// skeleton until the client-side request resolves.
export const useProduct = (slug: string, initialData?: ApiProduct) =>
  useQuery({
    queryKey: ["product", slug],
    queryFn: () => productService.getBySlug(slug),
    enabled: !!slug,
    initialData,
    initialDataUpdatedAt: initialData ? 0 : undefined,
  });

export const useProductSearch = (query: string, enabled = true) =>
  useQuery({
    queryKey: ["products-search", query],
    queryFn: () => productService.search(query),
    enabled: enabled && query.length >= 2,
  });

export const useProductsByVehicle = (params: {
  brand?: string;
  model?: string;
  year?: string;
  engine?: string;
  type?: string;
  page?: number;
}) =>
  useQuery({
    queryKey: ["products-by-vehicle", params],
    queryFn: () =>
      productService.getByVehicle({
        brand: params.brand!,
        model: params.model!,
        year: params.year!,
        engine: params.engine!,
        type: params.type,
        page: params.page,
      }),
    enabled: !!(params.brand && params.model && params.year && params.engine),
  });
