import { useGet } from '@/hooks/api';
import { Listing } from '@/models/interfaces/Listing';

interface ListingsRentResponse {
  statusCode: string;
  data: Listing[];
  hasError: boolean;
  resultError?: {
    code: string;
    message: string;
    title: string;
    correlationId: string;
  };
}

export const useListingsRent = (enabled: boolean = true) => {
  return useGet<ListingsRentResponse>(
    'listingRent',
    '/Host/ListingRent',
    {},
    enabled // activado siempre
  );
};
