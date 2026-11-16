export interface ListingRentResponseStep {
  parametrics: Parametrics;
  listingData: ListingData;
  continueStepPublishing?: string | null;
}

export interface Parametrics {
  propertySubTypes: PropertySubType[];
  accomodationTypes: AccomodationType[];
  amenitiesTypes: AmenitiesType[];
  featuredAspects: FeaturedAspect[];
  discountTypes: DiscountType[];
  securityItems: SecurityItems[];
  approvalPolicyType: ApprovalPolicyType[];
  ruleTypes: RuleTypes[];
  cancelationPolicyTypes: CancelationPolicyTypes[];
}

export interface CancelationPolicyTypes {
  code: string;
  name: string;
  detail1: string;
  refoundUpToPercentage: number;
  refoundUpToDays: number;
  detail2: string;
  discountPercentage: number;
  withinDays: number;
  status: boolean;
  cancelationPolicyTypeId: number;
  isSelected: boolean;
}

export interface Rules {
  value: any;
  valueString: any;
  code: any;
  name: any;
  description: any;
  status: any;
  iconLink: any;
  ruleTypeId: number;
}

export interface RuleTypes {
  value: string;
  valueString: string;
  code: string;
  name: string;
  description: string;
  status: boolean;
  iconLink: string;
  ruleTypeId: number;
  isSelected: boolean;
}
export interface PropertySubType {
  subTypeCode: string;
  subType: string;
  subTypeIcon: string;
  type: string;
  typeCode: string;
  typeIcon: string;
  propertySubtypeId: number;
}

export interface ApprovalPolicyType {
  approvalPolicyTypeId: number;
  code: string;
  name: string;
  description: string;
  isRecommended: boolean;
  status: boolean;
}

export interface AccomodationType {
  accommodationName: string;
  accommodationDescription: string;
  accommodationTypeId: number;
  accomodationCode: string;
  accommodationIcon: string;
}

export interface AmenitiesType {
  value: boolean;
  valueString: string;
  isPremium: boolean;
  typeCode: string;
  type: string;
  iconLink: string;
  amenitiesTypeId: number;
  isSelected: boolean;
}

export interface FeaturedAspect {
  isSelected: boolean;
  value: string;
  code: string;
  name: string;
  featuredAspectTypeId: number;
}

export interface DiscountType {
  discountCalculated: number;
  porcentage: number;
  isDiscount: boolean;
  code: string;
  days: number;
  question: string;
  porcentageSuggest: number;
  suggestDescription: string;
  discountTypeForTypePriceId: number;
}

export interface TlCheckInOutPolicy {
  checkInTime: string;
  checkInTime_Str: string;
  checkOutTime: string;
  checkOutTime_Str: string;
  flexibleCheckIn: boolean;
  flexibleCheckOut: boolean;
  lateCheckInFee: number;
  lateCheckOutFee: number;
  instructions: string;
  maxCheckInTime: string;
  maxCheckInTime_Str: string;
}

export interface ListingData {
  property: any;
  listingPhotos: ListingPhoto[];
  maxGuests: number;
  bathrooms: number;
  bedrooms: number;
  beds: number;
  sofaBeds: number;
  amenities: Amenity[];
  accomodationTypeId: number | null;
  address: Address;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  featuredAspects: FeaturedAspect2[];
  discounts: Discount[];
  listingRentId: number | string;
  nextViewCode: string;
  actualViewCode: string;
  privateBathroom: number;
  privateBathroomLodging: number;
  sharedBathroom: number;
  propertySubTypeId: number | null;
  cancelationPolicyTypeId: number | null;
  currencyCode: string;
  currencyId: number | null;
  preparationDays: number;
  priceNightly: number | undefined;
  rules: Rules[];
  securityItems: SecurityItems[];
  weekendNightlyPrice: number | undefined;
  combinationOption: number;
  approvalPolicyTypeId: number | null;
  minimunNoticeDays: number;
  cancelPolicyTypeId: number | null;
  tlCheckInOutPolicy: TlCheckInOutPolicy | null;
  rentRules: any[];
}

export interface ListingPhoto {
  photoLink: string;
  isPrincipal: boolean;
  name: string;
  description: string;
  position: number;
  spaceType: string;
  spaceTypeCode: string;
  spaceTypeId: number;
  listingPhotoId: number;
}

export interface Amenity {
  value: boolean;
  valueString: string;
  isPremium: boolean;
  typeCode: string;
  type: string;
  iconLink: string;
  amenitiesTypeId: number;
}

export interface Address {
  zipCode?: string;
  address1: string;
  address2: string;
  cityId: number;
  city?: City;
  countyId?: number;
  stateId?: number;
}

export interface City {
  city: string;
  state: string;
  stateCode: string;
  country: string;
  countryCode: string;
  county: string;
}

export interface FeaturedAspect2 {
  value: string;
  code: string;
  name: string;
  featuredAspectTypeId: number;
}

export interface Discount {
  discountCalculated: number;
  porcentage: number;
  isDiscount: boolean;
  code: string;
  days: number;
  question: string;
  porcentageSuggest: number;
  suggestDescription: string;
  discountTypeForTypePriceId: number;
}

export interface SecurityItems {
  securityItemTypeId: number;
  value?: string;
  valueString?: string;
  code: string;
  name: string;
  iconLink?: string;
  description: string;
  isSelected: boolean;
}
