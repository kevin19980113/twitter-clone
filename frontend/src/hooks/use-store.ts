import { create } from "zustand";

type AuthStore = {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
};

export const useAuthStore = create<AuthStore>()((set) => ({
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
}));
