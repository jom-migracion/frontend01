const assertEnv = {
  VITE_BASE_URL: import.meta.env.VITE_BASE_URL || "https://api.example.com",
  VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
  VITE_BACKEND_USER: import.meta.env.VITE_BACKEND_USER,
  VITE_BASE_URL_PHOTOS_LISTING:
    import.meta.env.VITE_BASE_URL + import.meta.env.VITE_ROUTE_PHOTOS_LISTING,
  VITE_BACKEND_PASSWORD: import.meta.env.VITE_BACKEND_PASSWORD,
  VITE_PORT: import.meta.env.VITE_PORT || 3001,
  VITE_KEY_GOOGLE_MAP: import.meta.env.VITE_KEY_GOOGLE_MAP,
  VITE_KEY_SEARCH_GOOGLE: import.meta.env.VITE_KEY_SEARCH_GOOGLE,
  VITE_KEY_GOOGLE_CLIENT_ID: import.meta.env.VITE_KEY_GOOGLE_CLIENT_ID,
  VITE_USER_TOKEN_KEY: import.meta.env.VITE_USER_TOKEN_KEY,
};

// Congelar el objeto para evitar modificaciones accidentales
Object.freeze(assertEnv);

export default assertEnv;
