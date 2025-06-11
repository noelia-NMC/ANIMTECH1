// 📁 src/config/i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from '../locales/es.json';
import en from '../locales/en.json';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3', // Importante para React Native
    resources: {
      es: { translation: es },
      en: { translation: en },
    },
    lng: 'es', // Idioma por defecto
    fallbackLng: 'es', // Idioma de respaldo
    interpolation: {
      escapeValue: false, // React ya se encarga de esto
    },
  });

export default i18n;