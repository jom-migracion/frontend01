// src/data/citiesData.ts
import { Country, FlatCity } from '@/models/interfaces/profile/Location';

export const rawCitiesData: Country[] = [
    {
      countryId: 2,
      name: "Bolivia",
      states: [
        {
          stateId: 179,
          name: "Chuquisaca",
          counties: [
            {
              countyId: 1948,
              name: "Oropeza",
              cities: [
                {
                  cityId: 14358,
                  name: "Tarabuco"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      countryId: 2,
      name: "Bolivia",
      states: [
        {
          stateId: 173,
          name: "Cochabamba",
          counties: [
            {
              countyId: 1958,
              name: "Cercado",
              cities: [
                {
                  cityId: 14389,
                  name: "Tarata"
                }
              ]
            }
          ]
        }
      ]
    }
  ];

// Función para aplanar los datos de las ciudades
export const flattenCities = (data: Country[]): FlatCity[] => {
  const flatCities: FlatCity[] = [];
  data.forEach(country => {
    country.states.forEach(state => {
      state.counties.forEach(county => {
        county.cities.forEach(city => {
          flatCities.push({
            cityId: city.cityId,
            cityName: city.name,
            countyName: county.name,
            stateName: state.name,
            countryName: country.name,
            fullDetail: `${city.name}, ${county.name}, Departamento de ${state.name}, ${country.name}`,
          });
        });
      });
    });
  });
  return flatCities;
};

// Datos aplanados para usar en el Autocomplete
export const flattenedCities = flattenCities(rawCitiesData);