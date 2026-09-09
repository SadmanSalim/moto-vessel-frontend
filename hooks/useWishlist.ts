import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { wishlistService } from "@/services/wishlistService";
import { useAuthStore } from "@/store/authStore";

export const useWishlist = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistService.list,
    enabled: isAuthenticated,
  });
};

export const useIsWishlisted = (productId?: number, source?: "pos" | "website") => {
  const { data } = useWishlist();
  if (!productId || !source) return false;
  return !!data?.some((p) => p.id === productId && p.source === source);
};

export const useToggleWishlist = (slug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => wishlistService.toggle(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};
