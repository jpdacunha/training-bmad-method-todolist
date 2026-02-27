import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Language preference store
 * [Source: architecture.md#Internationalization]
 * Persisted in localStorage
 */

type Language = 'en' | 'fr';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language:
        typeof navigator !== 'undefined' && navigator.language.startsWith('fr') ? 'fr' : 'en',
      setLanguage: (lang: Language) => set({ language: lang }),
    }),
    {
      name: 'language-store',
    },
  ),
);
