import Guests from "./Guests";

interface Location {
  id: string;
  name: string;
  description: string;
  type: number;
  typeDesc: string;
  entityId: number;
}
interface SearchFormData {
  CityObject?: Location | undefined;
  CheckInDate?: Date | null; 
  CheckOutDate?: Date | null;
  MinPrice?: number;
  MaxPrice?: number;
  Guests?: Guests;
  Bedrooms?: number;
  Beds?: number;
  PropertyTypeId?: number;
  AmenityIds?: number[]; 
  Latitude?: number;
  Longitude?: number;
  Radius?: number;
  CityName?: string; 
  CityId?: number;
  StateId?: number;
  CountyId?: number;
  CountryId?: number;
  Bathrooms?: number;
  pageNumber?: number;
  pageSize?: number;
}
export default SearchFormData;

