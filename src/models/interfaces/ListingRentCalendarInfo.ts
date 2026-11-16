// Interface principal para cada objeto dentro del array "data"
export default interface ListingRentC {
  listingRentId: string;
  ownerUserId: number;
  listingStatusId: number;
  name: string;
  description: string;
  stepsCount: null;
  minimunRentalPerDay: null;
  cancelationPolicyTypeId: null;
  approvalPolicyTypeId: number;
  approvalRequestDays: null;
  accomodationTypeId: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  allDoorsLocked: null;
  beds: number;
  listingRentConfirmationDate: string;
  externalCameras: null;
  presenceOfWeapons: null;
  noiseDesibelesMonitor: null;
  minimunStay: null;
  maximumStay: null;
  minimumNotice: number;
  minimumNoticeHour: null;
  preparationDays: number;
  availabilityWindowMonth: null;
  checkInDays: null;
  checkOutDays: null;
  privateBathroom: number;
  privateBathroomLodging: number;
  sharedBathroom: number;
  avgReviews: null;
  price: Price;
  reservations: Reservation[];
  calendarDays: CalendarDay[];
  property: Property;
  photos: Photo[];
}

// Interface para el objeto "price"
export interface Price {
  priceNightly: number;
  securityDepositPrice: null;
  currency: null;
  currencyCode: null;
  listingPriceId: number;
  listingRentId: number;
  listingPriceOfferId: null;
  timeUnitId: null;
  currencyId: number;
  weekendNightlyPrice: number;
  tlListingDiscountForRates: null;
  specialDatePrices: null;
}

// Interface para el array de "reservations"
export interface Reservation {
  bookId: number;
  listingRentId: number;
  userIdRenter: number;
  startDate: string;
  endDate: string;
  amountTotal: number;
  currencyId: number;
  mountPerNight: null;
  amountFees: null;
  nameRenter: string;
  lastNameRenter: string;
  termsAccepted: boolean;
  additionalInfo: null;
  bookStatusId: number;
  isApprobal: null;
  approvalDetails: null;
  isManualApprobal: null;
  daysToApproval: null;
  initDate: null;
  paymentCode: string;
  pk: null;
  paymentId: string;
  depositSec: null;
  pickUpLocation: null;
  vggFee: null;
  vggFeePercent: null;
  calendarDays: CalendarDay[];
  owner: Owner;
  photos: Photo[];
}

// Interface para el array de "calendarDays"
export interface CalendarDay {
  date: string;
  price: number;
  blockType: number;
  blockReason: string;
  bookId: number | null;
  minimumStay: number;
  maximumStay: number;
  discounts: null;
  blockTypeName: null;
}

// Interface para el objeto "owner" dentro de "reservations"
export interface Owner {
  name: string;
  lastName: string;
  favoriteName: string;
  photoLink: string;
  gender: null;
  email: null;
  phoneNumber: null;
  phoneCode: null;
  emergencyContact: null;
  documents: any[];
  phones: any[];
  profilePhotos: any[];
  registerDate: string;
  registerDateDays: null;
  registerDateMonths: null;
  registerDateYears: null;
}

// Interface para el objeto "property"
export interface Property {
  latitude: number;
  longitude: number;
  address: Address;
  type: null;
  distanceMeters: number;
}

// Interface para el objeto "address"
export interface Address {
  zipCode: string;
  address1: string;
  address2: string;
  cityId: number;
  countyId: number;
  stateId: number;
  city: City;
}

// Interface para el objeto "city"
export interface City {
  cityId: number;
  city: string;
  state: string | null;
  stateCode: null;
  country: string | null;
  countryCode: null;
  county: string | null;
  latitude: null;
  longitude: null;
}

// Interface para el array de "photos"
export interface Photo {
  photoLink: string;
  isPrincipal: boolean;
  name: string;
  description: string;
  position: null;
  spaceType: null;
  spaceTypeCode: null;
  spaceTypeId: null;
  listingPhotoId: number;
}

// // Interface para la estructura general del JSON
// export interface JsonData {
//   data: ListingRent[];
// }
