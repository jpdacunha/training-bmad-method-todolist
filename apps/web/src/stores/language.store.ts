import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  LANGUAGE_EN,
  LANGUAGE_FR,
  LANGUAGE_DETECTION_PREFIX_FR,
  STORE_KEY_LANGUAGE,
} from '../constants/app.constants';

/**
 * Language preference store
 * [Source: architecture.md#Internationalization]
 * Persisted in localStorage
 */

type Language = typeof LANGUAGE_EN | typeof LANGUAGE_FR;

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language:
        typeof navigator !== 'undefined' && navigator.language.startsWith(LANGUAGE_DETECTION_PREFIX_FR) ? LANGUAGE_FR : LANGUAGE_EN,
      setLanguage: (lang: Language) => set({ language: lang }),
    }),
    {
      name: STORE_KEY_LANGUAGE,
    },
  ),
);
