// src/interfaces/Location.ts
export interface City {
  cityId: number;
  name: string;
}

export interface County {
  countyId: number;
  name: string;
  cities: City[];
}

export interface State {
  stateId: number;
  name: string;
  counties: County[];
}

export interface Country {
  countryId: number;
  name: string;
  states: State[];
}

// Interfaz aplanada para el Autocomplete
export interface FlatCity {
  cityId: number;
  cityName: string;
  countyName: string;
  stateName: string;
  countryName: string;
  fullDetail: string; // Para mostrar en el subtítulo del Autocomplete
}
