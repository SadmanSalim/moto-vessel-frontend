import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "@/services/reviewService";
import { useAuthStore } from "@/store/authStore";

export const useMyReviews = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["my-reviews"],
    queryFn: reviewService.myReviews,
    enabled: isAuthenticated,
  });
};

export const useDeleteMyReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => reviewService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-reviews"] }),
  });
};
