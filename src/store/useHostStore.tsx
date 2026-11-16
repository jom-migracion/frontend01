// src/store/useHostStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface HostState {
  hostId: number | null;
  userId: number | null;
  setHostId: (id: number) => void;
  setUserId: (id: number) => void;
  clearHost: () => void;
}

export const useHostStore = create<HostState>()(
  persist(
    (set) => ({
      hostId: null,
      userId: null,
      setHostId: (id) => set({ hostId: id }),
      setUserId: (id) => set({ userId: id }),
      clearHost: () => set({ hostId: null, userId: null }),
    }),
    {
      name: 'host-storage',
    }
  )
);
