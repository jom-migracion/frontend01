import { create } from 'zustand';

export const useMessageStoreReservation = create(

  (set) => ({
    stateReservation: null,
    selectedConv: false,
    setStateReservation: (newStateReservation: string) => set({ stateReservation: newStateReservation }),
    resetState: () => set({ newStateReservation: null }),
    setSelectedConv: (value: boolean) => set({ selectedConv: value }),
  })

);
export const useListingRentStore = create(

  (set) => ({
    listingRent: { listingRentId: null, name: '' },
    resetState: () => set({ listingRent: { listingRentId: null, name: '' } }),
    setListingRent: (value: { listingRentId: number | null; name: string }) => set({ listingRent: value }),

  })

);

export const useConvertReservationStore = create(

  (set) => ({
    stateConversationId: null,
    resetState: () => set({ stateConversationId: null }),
    setStateConversationId: (value: number | null) => set({ stateConversationId: value }),
  })

);

export const useViewReservationStore = create(

  (set) => ({
    viewReservationData: null,
    resetViewReservation: () => set({ viewReservationData: null }),
    setViewReservation: (value: any) => set({ viewReservationData: value }),
  })

);