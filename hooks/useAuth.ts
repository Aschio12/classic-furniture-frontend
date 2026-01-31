"use client";

import { useUserStore } from "@/store/userStore";

export const useAuth = () => {
  const { user, token, setUser, setToken, clearAuth } = useUserStore();

  const isAuthenticated = Boolean(token && user);

  return {
    user,
    token,
    isAuthenticated,
    setUser,
    setToken,
    clearAuth,
  };
};
