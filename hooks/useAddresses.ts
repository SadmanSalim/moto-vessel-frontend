import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addressService, type AddressInput } from "@/services/addressService";
import { useAuthStore } from "@/store/authStore";

export const useAddresses = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["addresses"],
    queryFn: addressService.list,
    enabled: isAuthenticated,
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddressInput) => addressService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<AddressInput> }) => addressService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => addressService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });
};

export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => addressService.setDefault(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });
};
