import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import backend from "i18next-http-backend";

// Get language stored in localStorage (Zustand stores it here)
const storedLang = localStorage.getItem("i18n-store")
  ? JSON.parse(localStorage.getItem("i18n-store")!).state.lang
  : "es";

i18n
  .use(backend) // Load translations from backend
  .use(initReactI18next)
  .init({
    lng: storedLang, //default language
    fallbackLng: "es", // fallback language
    supportedLngs: ["es", "en"],
    nonExplicitSupportedLngs: true,
    load: "languageOnly",
    backend: {
      loadPath: `/locales/{{lng}}.json?v=1`, // path to translation files
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
