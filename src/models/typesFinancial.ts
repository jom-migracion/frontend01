// types.ts

export type FinancialSummary = {
  grossIncome: number;
  adjustments: number;
  serviceFee: number;
  total: number;
  idUser: string;
};

export type ReservationStats = {
  confirmedBookings: number;
  reservedNights: number;
  avgNightsPerBooking: number;
  idUser: string;
};

export type PropertyIncome = {
  propertyImagen: string;
  propertyName: string;
  incomeDate: string;
  grossIncome: number;
  adjustments: number;
  serviceFee: number;
  total: number;
  idUser: string;
};

export type PropertyPerformance = {
  propertyImagen: string;
  propertyName: string;
  nightsBooked: number;
  averageNightsPerStay: number;
  occupancyRate: number;
  idUser: string;
};
