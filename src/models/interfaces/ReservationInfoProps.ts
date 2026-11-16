export default interface ReservationInfoProps {
  arrivalDate: string;
  departureDate: string;
  guests: number;
  totalCost: number;
  currency: string;
  hostName: string;
  hostLocation: string;
  hostImage: string; // URL de la imagen del host
  indiceColor: number;
  user?: string;
  listingId?: string;
  conversationId?: string;
  onWriteMessage?: () => void;
}
