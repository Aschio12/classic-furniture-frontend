import { create } from "zustand";

interface ServerState {
  isServerWaking: boolean;
  setIsServerWaking: (status: boolean) => void;
}

export const useServerStore = create<ServerState>((set) => ({
  isServerWaking: false,
  setIsServerWaking: (status) => set({ isServerWaking: status }),
}));
