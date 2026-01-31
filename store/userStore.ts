import { create } from "zustand";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "seller" | "hub_manager";
};

type UserState = {
  user: UserProfile | null;
  token: string | null;
  setUser: (user: UserProfile | null) => void;
  setToken: (token: string | null) => void;
  clearAuth: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  clearAuth: () => set({ user: null, token: null }),
}));
