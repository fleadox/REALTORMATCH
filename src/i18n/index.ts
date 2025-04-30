import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import Cookies from 'js-cookie';

// Language configurations
export const languages = {
  en: { 
    code: 'en', 
    name: 'English', 
    dir: 'ltr',
    flag: 'https://flagcdn.com/w40/gb.png'
  },
  ka: { 
    code: 'ka', 
    name: 'ქართული', 
    dir: 'ltr',
    flag: 'https://flagcdn.com/w40/ge.png'
  },
  ru: { 
    code: 'ru', 
    name: 'Русский', 
    dir: 'ltr',
    flag: 'https://flagcdn.com/w40/ru.png'
  },
};

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: Object.keys(languages),
    
    // Language detection configuration
    detection: {
      order: ['cookie', 'localStorage', 'navigator'],
      lookupCookie: 'i18next',
      caches: ['cookie'],
      cookieOptions: {
        path: '/',
        maxAge: 31536000 // 365 days in seconds
      },
    },
    
    // Backend configuration
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    // Namespace configuration
    ns: ['common', 'auth', 'profile', 'properties'],
    defaultNS: 'common',
    
    interpolation: {
      escapeValue: false,
    },
  });

// Update HTML lang and dir attributes when language changes
i18n.on('languageChanged', (lng) => {
  const language = languages[lng as keyof typeof languages];
  if (language) {
    document.documentElement.lang = language.code;
    document.documentElement.dir = language.dir;
    Cookies.set('i18next', lng, { expires: 365, path: '/' });
  }
});

export default i18n;