import { useGet2 } from '@/hooks/api';
import useDebounce from '@/modules/_admin/hooks/useDebounce';
import DetailedPropertyCard from '@/modules/_assert/components/propertyManagement/DetailedPropertyCard';
import { ListingRent } from '@/pages/DetailWishList';
import {
  Box,
  Pagination,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import React, { useEffect, useState } from 'react';

interface PaginationInfo {
  totalItemCount: number;
  totalPageCount: number;
  pageSize: number;
  currentPage: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

interface ListingRentResponse {
  pagination: PaginationInfo;
  statusCode: string;
  data: ListingRent[];
}

export interface CardProperty {
  id: number;
  title: string;
  location: string;
  date: string;
  authorName: string;
  authorLocation: string;
  authorAvatarUrl: string;
  imageUrl: string;
  description?: string;
  listingStatusId: number; // <--- Nuevo campo necesario
}

interface PropertyGridProps {
  endpoint: string;
  queryKey: string;
  cityName: string;
  onDetailClick: (property: CardProperty) => void;
}

const PropertyGrid: React.FC<PropertyGridProps> = ({ endpoint, queryKey, cityName, onDetailClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const debouncedCityName = useDebounce(cityName, 500);

  const fullQueryKey = [queryKey, currentPage, pageSize, debouncedCityName];

  /* const { data, isLoading, isError, error } = useGet2<ListingRentResponse>(fullQueryKey, endpoint, {
    CityName: debouncedCityName,
    pageNumber: currentPage,
    pageSize,
  }); */

  // 1. EXTRAEMOS 'refetch' DEL HOOK
  const { data, isLoading, isError, error, refetch } = useGet2<ListingRentResponse>(fullQueryKey, endpoint, {
    CityName: debouncedCityName,
    pageNumber: currentPage,
    pageSize,
  });

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, debouncedCityName]);

  if (isLoading) return <Typography>Cargando...</Typography>;
  if (isError) return <Typography>Error: {String(error)}</Typography>;

  const formatear = (iso: string): string =>
    new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(iso));

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid2 container spacing={2} sx={{ mb: 4 }}>
        {data?.data?.map((property: ListingRent) => (
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={property.listingRentId}>
            <DetailedPropertyCard
              property={{
                id: property.listingRentId,
                title: property.name,
                location: property.property?.cityName || 'Ubicación no disponible',
                date: formatear(property.listingRentConfirmationDate) || 'Fecha no disponible',
                authorName: `${property.owner.name} ${property.owner.lastName}`,
                authorLocation: property.owner.cityName || 'Ubicación del propietario',
                authorAvatarUrl: property.owner.photoLink || '',
                imageUrl:
                  property.photos.find((p) => p.isPrincipal)?.photoLink ||
                  property.photos[0]?.photoLink ||
                  '',
                description: property.description || 'No hay descripción disponible.',

                listingStatusId: property.listingStatusId
              }}
              onDetailClick={onDetailClick}
              onRefresh={refetch} // <--- NUEVO
            />
          </Grid2>
        ))}
      </Grid2>

      {data?.pagination && (
        <Box display="flex" justifyContent="center" my={4}>
          <Pagination
            count={data.pagination.totalPageCount}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size={isMobile ? 'medium' : 'large'}
            showFirstButton
            showLastButton
            siblingCount={0}
            boundaryCount={1}
          />
        </Box>
      )}
    </Box>
  );
};

export default PropertyGrid;