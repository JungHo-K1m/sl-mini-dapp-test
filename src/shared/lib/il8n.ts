import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../locales/en.json';
import ko from '../locales/ko.json';
import ja from '../locales/ja.json';
import zh from '../locales/zh.json';
import th from "../locales/th.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ko: { translation: ko },
      ja: { translation: ja },
      th: { translation: th },
      zh: { translation: zh }
    },
    fallbackLng: 'en',
    load: 'languageOnly',
    interpolation: { escapeValue: false },
  });

export default i18n;
