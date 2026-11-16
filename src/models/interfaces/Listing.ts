export interface Listing {
  listingRentId: string;
  latitude?: number | null;
  longitude?: number | null;
  status: string | null;
  name: string;
  description: string;
  minimunRentalPerDay: number;
  approvalRequestDays: number;
  phoneNumber: string | null;
  ownerUserId: number;
  listingStatusId: number;
  stepsCount: number;
  cancelationPolicyTypeId: number;
  approvalPolicyTypeId: number;
  accomodationTypeId: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  allDoorsLocked: boolean;
  beds: number;
  externalCameras: boolean;
  presenceOfWeapons: boolean;
  noiseDesibelesMonitor: boolean;
  accomodationType: AccomodationType;
  approvalPolicy: ApprovalPolicy;
  cancelationPolicy: CancelationPolicy;
  owner: Owner;
  property: Property;
  price: Price;
  checkInOutPolicies: CheckInOutPolicy[];
  amenities: Amenity[];
  featuredAspects: any;
  photos: Photo[];
  rentRules: RentRule[];
  reviews: Review[];
  securityItems: SecurityItem[];
  spaces: Space[];
  stayPresences: any;
  valoration: number;
  historyDate: string;
  listingRentConfirmationDate?: string;
  viewDate?: string;
  isFavorite: boolean;
  privateBathroom: number;
  privateBathroomLodging: number;
  sharedBathroom: number;
}

export interface AccomodationType {
  accommodationName: string;
  accommodationDescription: string;
  accommodationTypeId: number;
}

export interface ApprovalPolicy {
  code: string;
  name: string;
  description: string;
  isRecommended: boolean;
  status: boolean;
}

export interface CancelationPolicy {
  code: string;
  name: string;
  detail1: string;
  refoundUpToPercentage: number;
  refoundUpToDays: number;
  detail2: string;
  discountPercentage: number;
  withinDays: number;
  status: boolean;
}

export interface Owner {
  name: string;
  lastName: string;
  favoriteName: string;
  photoLink: string;
  gender: string | null;
  email: string | null;
  phoneNumber: string | null;
  phoneCode: string | null;
  emergencyContact: string | null;
  documents: any[];
  phones: any[];
  profilePhotos: any[];
  registerDate: string;
  registerDateDays: number;
  registerDateMonths: number;
  registerDateYears: number;
}

export interface Property {
  latitude: number;
  longitude: number;
  address: Address;
  type: PropertyType;
  distanceMeters: number;
}

export interface Address {
  zipCode: string | null;
  address1: string | null;
  address2: string | null;
  cityId: number;
  countyId: number;
  stateId: number;
  city: City;
}

export interface City {
  city: string;
  state: string;
  stateCode: string | null;
  country: string;
  countryCode: string | null;
  county: string;
}

export interface PropertyType {
  subTypeCode: string;
  subType: string;
  subTypeIcon: string;
  type: string;
  typeCode: string;
  typeIcon: string | null;
  propertySubtypeId: number;
}

export interface Price {
  priceNightly: number;
  securityDepositPrice: number;
  currency: string | null;
  currencyCode: string | null;
  tlListingDiscountForRates: DiscountForRate[];
  specialDatePrices: any;
}

export interface DiscountForRate {
  code: string;
  days: number;
  question: string;
  porcentageSuggest: number;
  suggestDescription: string | null;
  discountTypeForTypePriceId: number;
  listingDiscountForRate: number;
  listingRentId: number;
  discountCalculated: number;
  porcentage: number;
  isDiscount: boolean;
}

export interface CheckInOutPolicy {
  checkInTime: string;
  checkOutTime: string;
  flexibleCheckIn: boolean;
  flexibleCheckOut: boolean;
  lateCheckInFee: number;
  lateCheckOutFee: number;
  instructions: string;
}

export interface Amenity {
  value: boolean;
  valueString: string | null;
  isPremium: boolean;
  typeCode: string;
  type: string;
  iconLink: string;
  amenitiesTypeId: number;
}

export interface Photo {
  photoLink: string;
  isPrincipal: boolean;
  name: string;
  description: string | null;
  position: number | null;
  spaceType: string | null;
  spaceTypeCode: string | null;
  spaceTypeId: number | null;
}

export interface RentRule {
  value: boolean;
  valueString: string;
  code: string;
  name: string;
  description: string;
  status: string | null;
  iconLink: string;
  ruleTypeId: number;
}

export interface Review {
  user: string | null;
  dateTimeReview: string;
  calification: number;
  comment: string;
  userProfilePhoto: string | null;
}

export interface SecurityItem {
  value: boolean;
  valueString: string;
  code: string;
  name: string;
  iconLink: string | null;
  description: string;
  securityItemTypeId: number;
}

export interface Space {
  count: number;
  code: string;
  name: string;
  description: string;
  icon: string;
}
