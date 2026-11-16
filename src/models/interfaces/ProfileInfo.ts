export interface ProfileInfo {
  userId: number;
  name: string;
  lastName: string;
  favoriteName: string;
  roles: string[];
  guestHostingsTotal: number;
  hostHostingsTotal: number;
  guestReviewCalification: number;
  hostReviewCalification: number;
  yearsInAssert: number;
  avatar: string;
  countReviewsGuest: number;
  countReviewsHost: number;
  isDocumentVerified?: boolean;
  guestReviews: any|null;
  hostReviews: any|null;
  timeInAssert: string;
}