import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { THEME_MODE_LIGHT, THEME_MODE_DARK, STORE_KEY_UI } from '../constants/app.constants';

/**
 * UI state store — theme mode, sidebar
 * [Source: architecture.md#Frontend Architecture — State Management]
 */

type ThemeMode = typeof THEME_MODE_LIGHT | typeof THEME_MODE_DARK;

interface UiState {
  themeMode: ThemeMode;
  sidebarOpen: boolean;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const getInitialTheme = (): ThemeMode => {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return THEME_MODE_DARK;
  }
  return THEME_MODE_LIGHT;
};

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      themeMode: getInitialTheme(),
      sidebarOpen: false,
      toggleTheme: () =>
        set((state) => ({
          themeMode: state.themeMode === THEME_MODE_LIGHT ? THEME_MODE_DARK : THEME_MODE_LIGHT,
        })),
      setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
    }),
    {
      name: STORE_KEY_UI,
      partialize: (state) => ({ themeMode: state.themeMode }),
    },
  ),
);
