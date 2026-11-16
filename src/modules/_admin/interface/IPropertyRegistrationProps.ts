import {
  AccomodationType,
} from '@/models/interfaces/ListingRentResponseStep';
import { ParamPropertyTypes } from '@/models/interfaces/stepperLinearRegistreProperty';
import { TypeStepperProperty_3_1formSchema } from '../validations/stepperProperty_3_1FormSchema';
import { TypeStepperProperty_2_3formSchema } from '../validations/stepperProperty_2_3FormSchema';

export interface CounterTableProps {
  items: CounterItem[];
  values: Record<string, number>;
  onValueChange: (key: string, newValue: number) => void;
}

export interface CounterItem {
  key: string;
  name: string;
  description: string;
  count: number;
  hidden: boolean;
  maxLimit?: number;
}

export interface Guests {
  guests: number;
  bathrooms: number;
  bedrooms: number;
  beds: number;
  sofaBeds: number;
  privateBathroom: number;
  privateBathroomLodging: number;
  sharedBathroom: number;
  [key: string]: number;
}

export interface FileRelations {
  spaceTypeId: number;
  description: string;
  isMain: boolean;
  fileName: string;
}

export interface photosListingRent {
  isPrincipal?: boolean,
  link: string;
  photoId: number;
}

export interface PropertyRegistrationProps_1_1 {
  onChange: (data: {
    step1_1: { propertyType?: ParamPropertyTypes; accomodationType?: AccomodationType };
  }) => void;
}

export interface PropertyRegistrationProps_1_2 {
  onChange: (data: { step1_2: Guests }) => void;
}

export interface PropertyRegistrationProps_1_3 {
  onChange: (data: { step1_3: any }) => void;
}

export interface PropertyRegistrationProps_2_1 {
  onChange: (data: {
    step2_1: { featuredAmenities: number[]; featuredAspects: number[]; securityItems: number[] };
  }) => void;
}
export interface PropertyRegistrationProps_2_2 {
  listingRentId: number | string;
}

export interface PropertyRegistrationProps_2_2_Galery {
  seeTitle?: boolean;
  uploadedImages: photosListingRent[];
  onAddMoreFiles?: (newFiles: File[]) => void;
  onReorderImages?: (newOrder: photosListingRent[]) => void;
  listingRentId: number | string;
  onDeleteImage?: (photoId: number) => void;
  openModalToUpload?: boolean;
  setOpenModalToUpload?: (open: boolean) => void;
  contronNumImages?: number;  
}

export interface PropertyRegistrationProps_2_3 {
  onChange: (data: { step2_3: TypeStepperProperty_2_3formSchema }) => void;
}

export interface PropertyRegistrationProps_3_1 {
  onChange: (data: { step3_1: TypeStepperProperty_3_1formSchema }) => void;
}

export interface PropertyRegistrationProps_3_2 {
  onChange: (data: {
    step3_2: { approvalPolicyTypeId: number; advanceNotice: number; preparation: number };
  }) => void;
}

export interface PropertyRegistrationProps_3_3 {
  onChange: (data: {
    step3_3: {
      arrivalStart: string;
      departureTime: string;
      arrivalEnd: string;
      ruleStates: number[];
      ruleStatesModels: { ruleId: number; value: string }[];
    };
  }) => void;
}

export interface PropertyRegistrationProps_3_4 {
  onChange: (data: { step3_4: { cancelPolicyTypeId: number } }) => void;
}
