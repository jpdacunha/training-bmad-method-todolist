import { create } from 'zustand';

type AuthState = {
  accessToken: string | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  isAuthenticated: false,
  isBootstrapping: true,
  setAccessToken: (token: string) =>
    set({ accessToken: token, isAuthenticated: true, isBootstrapping: false }),
  clearAuth: () =>
    set({ accessToken: null, isAuthenticated: false, isBootstrapping: false }),
}));
