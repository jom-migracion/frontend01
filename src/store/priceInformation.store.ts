import { create } from "zustand";

export const priceCalculationCardStore = create<any>()((set) => ({
  dataCalcPriceCard: null,
  setDataCalcPriceCard: (data: any) => set({ dataCalcPriceCard: data }),
}));
export interface priceInformationStore {
  calculatePrice: (checkInDate: Date, checkOutDate: Date) => void;
  dataInformation: {
    nightlyRate: number;
    nights: number;
    subtotal: number | string;
    discount: number | string;
    cleaningFee: number;
    serviceFee: number;
    total: number | string;
  };
}

export const userPriceInformationStore = create<priceInformationStore>()(
  // persist(
  (set, get) => ({
    dataInformation: {
      nightlyRate: 200,
      nights: 0,
      subtotal: 0,
      discount: 0,
      cleaningFee: 100,
      serviceFee: 20,
      total: 0,
    },
    calculatePrice: (checkInDate: Date, checkOutDate: Date) => {
      const checkIn = checkInDate instanceof Date ? checkInDate.getTime() : 0;
      const checkOut =
        checkOutDate instanceof Date ? checkOutDate.getTime() : 0;
      const nights = (checkOut - checkIn) / (1000 * 3600 * 24);
      const subtotal = get().dataInformation.nightlyRate * nights;
      const discount = subtotal * 0.1; // 10% descuento
      const total =
        subtotal -
        discount +
        get().dataInformation.cleaningFee +
        get().dataInformation.serviceFee;

      set({
        dataInformation: {
          nightlyRate: get().dataInformation.nightlyRate,
          nights: nights,
          subtotal: subtotal.toFixed(2),
          discount: discount.toFixed(2),
          cleaningFee: get().dataInformation.cleaningFee,
          serviceFee: get().dataInformation.serviceFee,
          total: total.toFixed(2),
        },
      });
    },
  })
  //   {
  //     name: 'price-information-storage',
  //   }
  // )
);
