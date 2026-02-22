import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AxiosError } from "axios";
import apiClient from "@/lib/apiClient";

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
  isAuthenticated: boolean;
  isLoading: boolean;
  _hasHydrated: boolean; // Tracks if Zustand has finished rehydrating from localStorage
  error: string | null;
  setUser: (user: AuthUser | null) => void;
  setToken: (token: string | null) => void;
  clearAuth: () => void;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      _hasHydrated: false,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token, isAuthenticated: !!token }),
      
      clearAuth: () => set({ user: null, token: null, isAuthenticated: false, error: null }),

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      login: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post("/auth/login", payload);
          const token = response.data?.token ?? null;
          const role = response.data?.role ?? "user";
          
          if (token) {
              set({ 
                  token, 
                  user: { id: "temp-id", name: "User", email: payload.email, role }, 
                  isAuthenticated: true,
                  error: null
              });
          }
        } catch (err) {
          const axiosError = err as AxiosError<{ message?: string }>;
          set({ error: axiosError.response?.data?.message || "Login failed", isAuthenticated: false });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
          set({ user: null, token: null, isAuthenticated: false, error: null });
          localStorage.removeItem("auth-storage"); // Ensure clean slate
          window.location.href = "/"; // Force redirect to Landing Page
      },
    }),
    {
      name: "auth-storage", // content is saved to localStorage under this key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
          user: state.user, 
          token: state.token, 
          isAuthenticated: state.isAuthenticated 
      }), // Only persist these fields
      onRehydrateStorage: () => (state) => {
        // Called when rehydration completes
        state?.setHasHydrated(true);
      },
    }
  )
);
