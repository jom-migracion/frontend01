export interface ProfileAditionalInfo {
  additionalProfileDataId: number;
  userId: number;
  whatIDo: string;
  wantedToGo: string;
  pets: string;
  birthday: string;
  languages: LanguageModel[];
  liveAt: {
    cityId: number;
    cityName: string;
    location: string;
  };
  introduceYourself: string;
}

export interface LanguageModel {
  languageId: number;
  code: string;
  detail: string;
}
