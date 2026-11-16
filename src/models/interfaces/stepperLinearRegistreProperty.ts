export interface Address {
  zipCode: string;
  address1: string;
  address2: string;
  cityId: number;
  city: City;
  countyId: number;
  stateId: number;
  latitude: number;
  longitude: number;
}

export interface City {
  cityId: number;
  city: string;
  state: string;
  stateCode: string;
  country: string;
  countryCode: string;
  county: string;
  latitude: number;
  longitude: number;
}

export interface BathroomDetail {
  spaceTypeId: number;
  number: number;
}

export interface Photo {
  photoId: number;
  title: string;
  fileName: string;
}

export interface Discount {
  dicountTypeId: number
  price: number
  percentage: number
}

export interface CheckInPolicies {
  checkInTime: string
  checkOutTime: string
  maxCheckInTime: string
}

export interface rulesModel {
  ruleId: number
  value: string
}

export interface StepperLinearRegistreProperty {
  listingRentId?: number | string | null;
  step: number;
  viewCode: string;
  subtypeId: number;
  accomodationId: number;
  address: Address;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  sofaBeds: number;
  allDoorsLooked: boolean;
  bathroomDetails: BathroomDetail[];
  stayPrecense: number[];
  amenities: number[];
  featuredAmenities: number[];
  securityItems: number[];
  photos: Photo[];
  title: string;
  featuredAspects: number[];
  description: string;
  approvalPolicyTypeId: number;
  pricing: number;
  discounts: Discount[];
  externalCameras: boolean;
  noiseDesibelesMonitor: boolean;
  presenceOfWeapons: boolean;
  reviewConfirmatin: boolean;
  useTechnicalMessages: boolean;
  listingConfirmation: boolean;
  currencyId: number;
  bathrooms: number;
  weekendPrice: number;
  minimunNoticeDays: number;
  preparationDays: number;
  checkInPolicies: CheckInPolicies
  rules: number[]
  privateBathroom: number;
  privateBathroomLodging: number;
  sharedBathroom: number;
  cancelPolicyTypeId: number;
  rulesModels: rulesModel[];
}

export const getDefaultStepperLinearRegistre = (): StepperLinearRegistreProperty => ({
  listingRentId: 0,
  step: 0,
  viewCode: '',
  subtypeId: 0,
  accomodationId: 0,
  address: {
    zipCode: '',
    address1: '',
    address2: '',
    cityId: 0,
    countyId: 0,
    stateId: 0,
    city: {
      city: '',
      state: '',
      stateCode: '',
      country: '',
      countryCode: '',
      cityId: 0,
      county: '',
      latitude: 0,
      longitude: 0
    },
    latitude: 0,
    longitude: 0,
  },
  maxGuests: 0,
  bedrooms: 0,
  beds: 0,
  sofaBeds: 0,
  allDoorsLooked: false,
  bathroomDetails: [],
  stayPrecense: [],
  amenities: [],
  featuredAmenities: [],
  securityItems: [],
  photos: [],
  title: '',
  featuredAspects: [],
  description: '',
  approvalPolicyTypeId: 0,
  pricing: 0,
  discounts: [],
  externalCameras: false,
  noiseDesibelesMonitor: false,
  presenceOfWeapons: false,
  reviewConfirmatin: false,
  useTechnicalMessages: false,
  listingConfirmation: false,
  currencyId: 0,
  bathrooms: 0,
  weekendPrice: 0,
  minimunNoticeDays: 0,
  preparationDays: 0,
  checkInPolicies: {checkInTime:'',checkOutTime:'',maxCheckInTime:''},
  rules: [],
  privateBathroom: 0,
  privateBathroomLodging: 0,
  sharedBathroom: 0,
  cancelPolicyTypeId: 0,
  rulesModels: [],
});

export interface ParamPropertyTypes {
  subTypeCode: string;
  subType: string;
  subTypeIcon: string;
  type: string;
  typeCode: string;
  typeIcon: string;
  propertySubtypeId: number;
}
