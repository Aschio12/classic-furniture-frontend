import { create } from "zustand";
import type { AxiosError } from "axios";
import api from "@/lib/axios";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "seller" | "hub_manager";
};

type LoginPayload = {
  email: string;
  password: string;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: AuthUser | null) => void;
  setToken: (token: string | null) => void;
  clearAuth: () => void;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  clearAuth: () => set({ user: null, token: null, error: null }),
  login: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/login", payload);
      const token = response.data?.token ?? null;
      const role = response.data?.role ?? "user";

      set({ token, user: token ? { id: "", name: "", email: payload.email, role } : null });
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      set({ error: axiosError.response?.data?.message || "Login failed" });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await api.get("/auth/logout");
      get().clearAuth();
    } catch (err) {
      set({ error: "Logout failed" });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
}));
