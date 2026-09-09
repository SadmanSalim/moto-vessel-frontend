import api from "@/lib/axios";
import { unwrap } from "@/lib/api";
import type { AuthUser } from "@/types";

type AuthResponse = {
  data: AuthUser;
  token: string;
};

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", { email, password });
    return { data: response.data.data, token: response.data.token };
  },

  register: async (data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    password_confirmation: string;
  }): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", data);
    return { data: response.data.data, token: response.data.token };
  },

  logout: async () => unwrap(await api.post("/auth/logout")),

  me: async (): Promise<AuthUser> => unwrap(await api.get("/auth/me")),

  forgotPassword: async (email: string) => unwrap(await api.post("/auth/forgot-password", { email })),

  resetPassword: async (data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => unwrap(await api.post("/auth/reset-password", data)),

  updateProfile: async (data: {
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
  }): Promise<AuthUser> => unwrap(await api.put("/auth/profile", data)),

  changePassword: async (data: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }) => unwrap(await api.put("/auth/password", data)),

  updateNotificationPreferences: async (data: {
    notify_order_updates: boolean;
    notify_marketing: boolean;
    notify_restock: boolean;
  }): Promise<AuthUser> => unwrap(await api.put("/auth/notification-preferences", data)),

  uploadAvatar: async (file: File): Promise<AuthUser> => {
    const formData = new FormData();
    formData.append("avatar", file);
    return unwrap(
      await api.post("/auth/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    );
  },
};
