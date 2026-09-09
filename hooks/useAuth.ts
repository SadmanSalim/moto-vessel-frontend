import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { analytics } from "@/lib/analytics";
import { getErrorMessage } from "@/lib/api";

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: (data) => {
      setAuth(data.data, data.token);
      analytics.login();
      router.push("/");
    },
  });
};

export const useRegister = () => {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: {
      name: string;
      email: string;
      phone?: string;
      password: string;
      password_confirmation: string;
    }) => authService.register(data),
    onSuccess: (data) => {
      setAuth(data.data, data.token);
      analytics.signUp();
      router.push("/");
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      logout();
      router.push("/sign-in");
    },
  });
};

export const useMe = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["auth-me"],
    queryFn: authService.me,
    enabled: isAuthenticated,
  });
};

export const useForgotPassword = () =>
  useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { token: string; email: string; password: string; password_confirmation: string }) =>
      authService.resetPassword(data),
    onSuccess: () => {
      router.push("/sign-in");
    },
  });
};

export const useUpdateProfile = () => {
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: { name?: string; phone?: string; address?: string; city?: string }) =>
      authService.updateProfile(data),
    onSuccess: (user) => {
      updateUser(user);
    },
  });
};

export const useChangePassword = () =>
  useMutation({
    mutationFn: (data: { current_password: string; password: string; password_confirmation: string }) =>
      authService.changePassword(data),
  });

export const useUpdateNotificationPreferences = () => {
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: { notify_order_updates: boolean; notify_marketing: boolean; notify_restock: boolean }) =>
      authService.updateNotificationPreferences(data),
    onSuccess: (user) => {
      updateUser(user);
    },
  });
};

export const useUploadAvatar = () => {
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: (file: File) => authService.uploadAvatar(file),
    onSuccess: (user) => {
      updateUser(user);
    },
  });
};

export { getErrorMessage };
