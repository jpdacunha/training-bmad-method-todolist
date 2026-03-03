import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import fr from './locales/fr.json';
import {
  LANGUAGE_EN,
  LANGUAGE_FR,
  LANGUAGE_DETECTION_PREFIX_FR,
  I18N_FALLBACK_LANGUAGE,
} from './constants/app.constants';

/**
 * i18n configuration — react-i18next
 * [Source: architecture.md#Internationalization]
 * MVP languages: en (default) + fr
 * Language detection: browser preference → localStorage
 */
i18n.use(initReactI18next).init({
  resources: {
    [LANGUAGE_EN]: { translation: en },
    [LANGUAGE_FR]: { translation: fr },
  },
  lng:
    typeof navigator !== 'undefined' && navigator.language.startsWith(LANGUAGE_DETECTION_PREFIX_FR)
      ? LANGUAGE_FR
      : LANGUAGE_EN,
  fallbackLng: I18N_FALLBACK_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
