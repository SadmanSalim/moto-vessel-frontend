import { useQuery } from "@tanstack/react-query";
import { bannerService } from "@/services/bannerService";
import type { Banner } from "@/types";

// initialBanners comes from a build-time server fetch (see app/page.tsx +
// lib/serverApi.ts's fetchHeroBanners) so the hero banner is already in the
// static HTML on first paint instead of waiting on this client-side fetch.
export const useBanners = (initialBanners?: Banner[]) =>
  useQuery({
    queryKey: ["banners"],
    queryFn: bannerService.getAll,
    initialData: initialBanners?.length ? initialBanners : undefined,
    initialDataUpdatedAt: 0,
  });
