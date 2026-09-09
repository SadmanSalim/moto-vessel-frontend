import Cookies from "js-cookie";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  address?: string;
  city?: string;
  notify_order_updates?: boolean;
  notify_marketing?: boolean;
  notify_restock?: boolean;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        localStorage.setItem("mv_token", token);
        Cookies.set("mv_token", token, { expires: 7, sameSite: "lax" });
        set({ user, token, isAuthenticated: true });
      },
      updateUser: (partial) => {
        set((state) => ({ user: state.user ? { ...state.user, ...partial } : state.user }));
      },
      logout: () => {
        localStorage.removeItem("mv_token");
        Cookies.remove("mv_token");
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    { name: "mv-auth" },
  ),
);
