import { useGet } from '@/hooks/api';
import Listing from '@/models/interfaces/Listing';

export const useFeaturedListings = (enabled: boolean = true) => {
  return useGet<Listing[]>(
    'listingRent', // clave de cache
    '/ListingRent/Featureds', // endpoint
    { pageNumber: 1, pageSize: 10 }, // 🔢 página fija de 10 resultados
    enabled
  );
};
