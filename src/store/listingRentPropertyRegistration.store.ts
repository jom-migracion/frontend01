import { ListingRentResponseStep } from '@/models/interfaces/ListingRentResponseStep';
import { create } from 'zustand';
import { persist } from "zustand/middleware";

interface IListingRent {
  data: ListingRentResponseStep;
  setData: (data: ListingRentResponseStep) => void;
  continueStepPublishing?: string
  setContinueStepPublishing: (value: string) => void
}
interface UpdateListingData {
  (partialListingData: Partial<ListingRentResponseStep['listingData']>): void;
}

interface UpdateParametrics {
  (partialParametrics: Partial<ListingRentResponseStep['parametrics']>): void;
}

interface IListingRentStore extends IListingRent {
  updateListingData: UpdateListingData;
  updateParametrics: UpdateParametrics;
  resetState: () => void;
}

const initialState: ListingRentResponseStep = {
  listingData: {
    property: [],
    listingPhotos: [],
    maxGuests: 0,
    bathrooms: 0,
    bedrooms: 0,
    beds: 0,
    sofaBeds: 0,
    amenities: [],
    accomodationTypeId: null,
    address: {
      zipCode: '',
      address1: '',
      address2: '',
      cityId: 0,
      city: {
        city: '',
        state: '',
        stateCode: '',
        country: '',
        countryCode: '',
        county: '',
      },
    },
    latitude: -17.7832,
    longitude: -63.1815,
    title: '',
    description: '',
    featuredAspects: [],
    discounts: [],
    listingRentId: 0,
    nextViewCode: '',
    actualViewCode: '',
    privateBathroom: 0,
    privateBathroomLodging: 0,
    sharedBathroom: 0,
    propertySubTypeId: null,
    cancelationPolicyTypeId: null,
    currencyCode: '',
    currencyId: null,
    preparationDays: 0,
    priceNightly: undefined,
    rules: [],
    securityItems: [],
    weekendNightlyPrice: undefined,
    combinationOption: 0,
    approvalPolicyTypeId: null,
    minimunNoticeDays: 1,
    cancelPolicyTypeId: null,
    tlCheckInOutPolicy: null,
  },
  parametrics: {
    propertySubTypes: [],
    accomodationTypes: [],
    amenitiesTypes: [],
    featuredAspects: [],
    discountTypes: [],
    securityItems: [],
    approvalPolicyType: [],
    ruleTypes: [],
    cancelationPolicyTypes: [],
  },
};

export const usePropertyRegistration = create<IListingRentStore>()((set) => ({
  data: initialState, // Uso de estado inicial
  setData: (data: ListingRentResponseStep) => set({ data }),
  setContinueStepPublishing: (value: string) => set({ continueStepPublishing: value }),
  updateListingData: (partialListingData: Partial<ListingRentResponseStep['listingData']>) => {
    set((state) => ({
      data: {
        ...state.data,
        listingData: {
          ...state.data.listingData,
          ...partialListingData,
        },
      },
    }));
  },

  updateParametrics: (partialParametrics: Partial<ListingRentResponseStep['parametrics']>) => {
    set((state) => ({
      data: {
        ...state.data,
        parametrics: {
          ...state.data.parametrics,
          ...partialParametrics,
        },
      },
    }));
  },
  
  resetState: () => set({ data: initialState }),
}));

export const listingRentPublishedStore = create<any>()((set) => ({
  seeProperties: false,
  listingRentId: null,
  setListingRentId: (id: number) => set({ listingRentId: id }),
  setSeeProperties: (value: boolean) => set({ seeProperties: value }),
}));


export const useListingRentContinueStore = create<any>()(
  persist(
    (set) => ({
      listingRentIdContinue: null,
      setListingRentIdContinue: (id: number) => set({ listingRentIdContinue: id }),
      clearListingRentIdContinue: () => set({ listingRentIdContinue: null }),
    }),
    {
      name: "listing-rent-continue-storage",
    }
  )
);