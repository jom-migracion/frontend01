import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLang = create(
  persist(
    (set) => ({
      lang: 'es',
      setLang: (newLang: string) => set({ lang: newLang })
    }),
    {
      name: 'i18n-store',
    }
  )
);
