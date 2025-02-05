// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en.json';
import translationAR from './locales/ar.json';

const resources = {
  en: { translation: translationEN },
  ar: { translation: translationAR },
};

i18n
  // Use the browser language detector plugin
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    // No explicit lng is set here—this lets the detector run,
    // but note our fallback is Arabic.
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    detection: {
      // Optional options
      order: ['navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie'], // caches the detected language
    },
  });

export default i18n;
