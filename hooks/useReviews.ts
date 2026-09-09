import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "@/services/reviewService";

export const useProductReviews = (slug: string, enabled = true) =>
  useQuery({
    queryKey: ["product-reviews", slug],
    queryFn: () => reviewService.list(slug),
    enabled: !!slug && enabled,
  });

export const useSubmitReview = (slug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { rating: number; title?: string; comment?: string }) => reviewService.submit(slug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews", slug] });
    },
  });
};
