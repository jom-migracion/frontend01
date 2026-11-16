import { useGet2 } from '@/hooks/api';
import useDebounce from '@/modules/_admin/hooks/useDebounce';
import { Box, Pagination, Typography, useMediaQuery, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useEffect, useState } from 'react';
import DetailAdminCard from './DetailAdminCard';
import DetailGuestCard from './DetailGuestCard';
import DetailHostCard from './DetailHostCard';

export interface User {
  userId: number;
  name: string;
  lastName: string;
  favoriteName: string;
  photoLink: string;
  gender: string | null;
  email: string | null;
  phoneNumber: string | null;
  phoneCode: string | null;
  emergencyContact: any | null;
  documents: any[];
  phones: any[];
  profilePhotos: any[];
  registerDate: string | undefined;
  registerDateDays: number | null;
  registerDateMonths: number | null;
  registerDateYears: number | null;
  cityName: string;
  status: string;
}

export interface ApiResponse {
  pagination: Pagination;
  statusCode: string;
  data: User[];
  hasError: boolean;
  resultError: any;
}

export interface Pagination {
  totalItemCount: number;
  totalPageCount: number;
  pageSize: number;
  currentPage: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

interface PropertyGridProps {
  endpoint: string;
  queryKey: string;
  NameOrSurname: string;
}

const UserGrid: React.FC<PropertyGridProps> = ({ endpoint, queryKey, NameOrSurname }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState(10);

  console.log('Key');
  console.log(queryKey);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const debouncedNameOrSurname = useDebounce(NameOrSurname, 500);

  const fullQueryKey = [queryKey, currentPage, pageSize, debouncedNameOrSurname];
  // --- AGREGA ESTO ---
  console.log("LA TABLA ESCUCHA ESTA KEY:", fullQueryKey);
  // -------------------

  /* const { data, isLoading, isError, error } = useGet2<ApiResponse>(fullQueryKey, endpoint, {
    NameOrSurname: debouncedNameOrSurname,
    pageNumber: currentPage,
    pageSize,
  }); */

  // 1. PRUEBA -EXTRAEMOS LA FUNCIÓN 'refetch' AQUÍ- PRUEBA
  const { data, isLoading, isError, error, refetch } = useGet2<ApiResponse>(
    fullQueryKey,
    endpoint,
    { NameOrSurname: debouncedNameOrSurname, pageNumber: currentPage, pageSize }
  );

  // --- EFECTO DE DEPURACIÓN ---
  useEffect(() => {
    if (isLoading) {
      console.log(`%c [GRID] Cargando datos...`, 'color: blue');
    }

    if (data) {
      // Esto se imprimirá cada vez que React Query traiga datos frescos del servidor
      console.log(`%c [GRID] ¡Datos actualizados recibidos!`, 'color: green; font-weight: bold');
      console.log('Data actual en grid:', data.data); // Revisa aquí el status de los usuarios
    }
  }, [data, isLoading]); // Se ejecuta cuando 'data' o 'isLoading' cambian
  // ----------------------------------------

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, debouncedNameOrSurname]);

  if (isLoading) return <Typography>Cargando...</Typography>;
  if (isError) return <Typography>Error: {String(error)}</Typography>;

  console.log(data?.data);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {queryKey == 'user-1' ? (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {data?.data.map((property: User, index: number) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <DetailHostCard
                user={property}
                onRefresh={refetch} // <--- Función ya configurada
              />
            </Grid>
          ))}
        </Grid>
      ) : queryKey == 'user-2' ? (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {data?.data.map((property: User, index: number) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <DetailGuestCard
                user={property}
                onRefresh={refetch} // <--- Función ya configurada
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {data?.data.map((property: User, index: number) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <DetailAdminCard
                user={property}
                onRefresh={refetch} // <--- Función ya configurada
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Paginación */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 4,
          mb: 2,
        }}
      >
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
    </Box>
  );
};

export default UserGrid;
