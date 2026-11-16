import { useGet } from '@/hooks/api';
import {Listing} from '@/models/interfaces/Listing';

const useDetailProperty = (id?: string) => {
  const result = useGet<Listing>(['detailProperty', id], `/ListingRent/${id}`);
  
  return {
    ...result,
    data: result.data ?? null, // aseguro que siempre data exista o sea null
  };
};

export default useDetailProperty;
