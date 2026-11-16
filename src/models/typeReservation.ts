export interface Reservation {
  profileImageUrl: string;
  reservationStartDates: string;
  reservationEndDates: string;
  listingName: string;
  hasReservations: boolean;
  timeDateApprovalRequest: string; // ISO string
}