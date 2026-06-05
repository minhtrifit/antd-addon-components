/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en/translation.json';
import viTranslation from './locales/vi/translation.json';

i18n
  .use(LanguageDetector) // tự phát hiện ngôn ngữ từ trình duyệt
  .use(initReactI18next)
  .init({
    fallbackLng: 'vi',
    resources: {
      en: { translation: enTranslation },
      vi: { translation: viTranslation },
    },
    interpolation: {
      escapeValue: false, // React đã tự escape
    },
  });

export default i18n;
