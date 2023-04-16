import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import localesKo from './locales/ko.json';
import localesEn from './locales/en.json';

i18n.use(initReactI18next).init({
  resources: {
    ko: {
      translation: localesKo
    },
    en: {
      translation: localesEn
    }
  },
  lng: localStorage.getItem('i18nLanguage') || 'ko',
  fallbackLng: 'ko',
  debug: true,

  interpolation: {
    escapeValue: false // not needed for react as it escapes by default
  }
});

export default i18n;
