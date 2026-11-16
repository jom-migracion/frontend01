// services/mockService.ts

import {
  FinancialSummary,
  ReservationStats,
  PropertyIncome,
  PropertyPerformance,
} from '@/models/typesFinancial';

export const fetchFinancialSummary = (idUser: string): FinancialSummary => ({
  idUser: idUser,
  grossIncome: 8240.0,
  adjustments: 0.0,
  serviceFee: 659.2,
  total: 7580.8,
});

export const fetchReservationStats = (idUser: string): ReservationStats => ({
  idUser: idUser,
  confirmedBookings: 10,
  reservedNights: 57,
  avgNightsPerBooking: 3,
});

export const fetchPropertyIncome = (idUser: string): PropertyIncome[] => [
  {
    idUser: idUser,
    propertyImagen: '/images/penthouse.jpg',
    propertyName: 'Pent-house',
    incomeDate: '2024-06-15',
    grossIncome: 3082,
    adjustments: 0,
    serviceFee: 246,
    total: 2836,
  },
  {
    idUser: idUser,
    propertyImagen: '/images/srontto.jpg',
    propertyName: 'Srontto',
    incomeDate: '2024-06-15',
    grossIncome: 3082,
    adjustments: 0,
    serviceFee: 246,
    total: 2836,
  },
  {
    idUser: idUser,
    propertyImagen: '/images/duplex.jpg',
    propertyName: 'Duplex en Urquizo',
    incomeDate: '2024-06-15',
    grossIncome: 2070,
    adjustments: 0,
    serviceFee: 165,
    total: 1905,
  },
  {
    idUser: idUser,
    propertyImagen: '/images/loft.jpg',
    propertyName: 'Loft moderno',
    incomeDate: '2024-06-15',
    grossIncome: 1800,
    adjustments: 0,
    serviceFee: 144,
    total: 1656,
  },
];

export const fetchPropertyPerformance = (idUser: string): PropertyPerformance[] => [
  {
    idUser: idUser,
    propertyImagen: '/images/penthouse.jpg',
    propertyName: 'Pent-house',
    nightsBooked: 27,
    averageNightsPerStay: 5,
    occupancyRate: 90,
  },
  {
    idUser: idUser,
    propertyImagen: '/images/srontto.jpg',
    propertyName: 'Srontto',
    nightsBooked: 18,
    averageNightsPerStay: 3,
    occupancyRate: 75,
  },
  {
    idUser: idUser,
    propertyImagen: '/images/duplex.jpg',
    propertyName: 'Duplex en Urquizo',
    nightsBooked: 12,
    averageNightsPerStay: 4,
    occupancyRate: 60,
  },
  {
    idUser: idUser,
    propertyImagen: '/images/loft.jpg',
    propertyName: 'Loft moderno',
    nightsBooked: 30,
    averageNightsPerStay: 6,
    occupancyRate: 95,
  },
];