import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * UI state store — theme mode, sidebar
 * [Source: architecture.md#Frontend Architecture — State Management]
 */

type ThemeMode = 'light' | 'dark';

interface UiState {
  themeMode: ThemeMode;
  sidebarOpen: boolean;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const getInitialTheme = (): ThemeMode => {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      themeMode: getInitialTheme(),
      sidebarOpen: false,
      toggleTheme: () =>
        set((state) => ({
          themeMode: state.themeMode === 'light' ? 'dark' : 'light',
        })),
      setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({ themeMode: state.themeMode }),
    },
  ),
);
