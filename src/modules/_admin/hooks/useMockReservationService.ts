import { Reservation } from '../../../models/typeReservation';

export const fetchPendingReservations = async (): Promise<Reservation[]> => {
  // Simulación de llamada a API
  return [
    {
      profileImageUrl: 'https://example.com/avatar.jpg',
      reservationStartDates: '14 de oct.',
      reservationEndDates: '16 de oct.',
      listingName: 'Hermosa casa',
      hasReservations: true,
      timeDateApprovalRequest: new Date().toISOString(),
    },
  ];
};