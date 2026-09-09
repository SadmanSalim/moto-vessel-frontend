import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { garageService, type GarageVehicleInput } from "@/services/garageService";
import { useAuthStore } from "@/store/authStore";

export const useGarage = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["garage"],
    queryFn: garageService.list,
    enabled: isAuthenticated,
  });
};

export const useAddGarageVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GarageVehicleInput) => garageService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["garage"] }),
  });
};

export const useRenameGarageVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, nickname }: { id: number; nickname: string }) => garageService.updateNickname(id, nickname),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["garage"] }),
  });
};

export const useDeleteGarageVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => garageService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["garage"] }),
  });
};

export const useSetDefaultGarageVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => garageService.setDefault(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["garage"] }),
  });
};
