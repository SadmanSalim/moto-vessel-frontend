import { useQuery } from "@tanstack/react-query";
import { storeService } from "@/services/storeService";
import type { StoreLocation } from "@/types";

// initialData seeds this from the server (lib/serverApi.ts fetchStores +
// app/layout.tsx) so the footer's branch cards render immediately instead
// of showing skeletons until the client-side fetch resolves post-hydration.
export const useStores = (initialData?: StoreLocation[]) =>
  useQuery({
    queryKey: ["stores"],
    queryFn: storeService.getAll,
    initialData,
    initialDataUpdatedAt: 0,
  });
