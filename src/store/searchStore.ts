// src/store/searchStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import SearchFormData from '../models/interfaces/SearchFormData';

interface SearchStore {
  data: SearchFormData;
  setData: (data: SearchFormData) => void;
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set) => ({
      data: {
        CityObject: undefined,   
        CheckInDate: null,
        CheckOutDate: null,
        MinPrice: undefined,
        MaxPrice: undefined,
        Guests: { adults: 0, children: 0, infants: 0, pets: 0 },
        Bedrooms: undefined,
        Beds: undefined,
        PropertyTypeId: undefined,
        AmenityIds: [], 
        Latitude: undefined,
        Longitude: undefined,
        Radius: undefined,
        CityId: undefined,
        StateId: undefined,
        CountryId: undefined,
        Bathrooms: undefined,
        pageNumber: 1,
        pageSize: 10,
      },
      setData: (data) => set({ data }),
    }),
    {
      name: 'search-form-storage',
    }
  )
);
