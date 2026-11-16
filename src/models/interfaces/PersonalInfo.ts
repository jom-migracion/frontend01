
export interface PersonalInfo  {
    name?: string;
    lastName: string;
    favoriteName: string;
    photoLink: string;
    gender: string;
    email: string;
    phoneNumber: string;
    phoneCode: string;
    emergencyContact: {
      emergencyContactId: number;
      userId: number;
      name: string;
      lstName: string;
      relationship: string;
      languageId: number;
      email: string;
      phoneCode: string;
      phoneNumber: string;
    },
    documents: string[];
    phones: PhoneData[];
    profilePhotos: string[];
    address: string;
}

export interface PhoneData {
    countryCode: string;
    areaCode: string;
    number: string;
    isPrimary: boolean;
    isMobile: boolean;
}
