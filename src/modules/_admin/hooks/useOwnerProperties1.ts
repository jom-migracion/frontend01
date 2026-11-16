// import { useGet } from '@/hooks/api';
import ListingRentC from '@/models/interfaces/ListingRentCalendarInfo';

export interface ListingsRentResponse1 {
  statusCode: string;
  data: ListingRentC[];
  hasError: boolean;
  resultError?: {
    code: string;
    message: string;
    title: string;
    correlationId: string;
  };
}

// export const useListingsRent1 = (enabled: boolean = true) => {
//   return useGet<ListingsRentResponse1>(
//     'listingRentC',
//     '/Host/ListingRent/CalendarInfo',
//     {},
//     enabled // activado siempre
//   );
// };
