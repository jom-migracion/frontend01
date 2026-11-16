export interface ProfileCardProps {
  name: string;
  role: string;
  hostings: number;
  reviews: number;
  rating?: number;
  avatarSrc?: string;
  isDocumentVerified?: boolean;
  timeInAssert: string;
  guestHostingsTotal?: number;
}
