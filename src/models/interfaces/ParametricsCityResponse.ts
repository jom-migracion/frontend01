export type ParametricsCityResponse = Country[];

export interface Country {
  countryId: number;
  name: string;
  states: State[];
  latitude: number
  longitude: number  
}

export interface State {
  stateId: number;
  name: string;
  counties: County[];
  latitude: number
  longitude: number  
}

export interface County {
  countyId: number;
  name: string;
  cities: City[];
  latitude: number
  longitude: number  
}

export interface City {
  cityId: number;
  name: string;
  latitude: number
  longitude: number  
}

export interface CityOption {
  countryId?: number;
  stateId: number;
  province: string;
  value: number;
  label: string;
  cityName: string;
  latitude: number;
  longitude: number;   
}

export interface ProvinceOption {
  countyId: number;
  name: string;
}

export const defaultCity: CityOption = {
  countryId: 0,
  stateId: 0,
  province: '',
  value: 0,
  label: '',
  cityName: '',
  latitude: -17.7832,
  longitude: -63.1815
};

export const defaultCounty: ProvinceOption = {
  countyId: 0,
  name: '',
};
