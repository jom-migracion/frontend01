import React from 'react';
import Grid from '@mui/material/Grid2';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';

const CancelReservationSkeleton: React.FC = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Container maxWidth={matches ? 'lg' : 'md'} sx={{ py: 6 }}>
      <Grid container spacing={4}>
        {/* Columna izquierda */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Skeleton variant="text" width="60%" sx={{ fontSize: '1.5rem', mb: 2 }} />
          <Box sx={{ mb: 3 }}>
            <Skeleton variant="text" width="80%" height={30} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="80%" height={30} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="80%" height={30} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="80%" height={30} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="80%" height={30} />
          </Box>
          <Skeleton
            variant="rectangular"
            height={48}
            width="150px"
            sx={{ borderRadius: 2, mt: 3 }}
          />
        </Grid>

        {/* Columna derecha - Card skeleton */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined" sx={{ borderRadius: 4, boxShadow: 1, p: 1, maxWidth: 380 }}>
            {/* Encabezado con imagen + info */}
            <Box display={'flex'} flexDirection={'row'}>
              <Box flex={1.2} p={2}>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={130}
                  sx={{ borderRadius: 1 }}
                />
              </Box>
              <Box
                flex={1.5}
                display={'flex'}
                flexDirection={'column'}
                justifyContent={'center'}
                alignItems={'flex-start'}
                p={1}
              >
                <Skeleton variant="text" width="90%" sx={{ fontSize: '0.875rem', mb: 0.5 }} />
                <Skeleton variant="text" width="70%" sx={{ fontSize: '0.875rem', mb: 1 }} />
                <Skeleton variant="text" width="60%" sx={{ fontSize: '0.875rem' }} />
              </Box>
            </Box>

            {/* Contenido */}
            <CardContent>
              {/* Detalles del viaje */}
              <Skeleton variant="text" width="50%" sx={{ fontSize: '1rem', mb: 1 }} />

              <Box
                display="flex"
                justifyContent="space-between"
                mb={2}
                borderRadius={2}
                border={'1px solid #e0e0e0'}
                p={1}
              >
                <Box sx={{ flex: 1, pr: 1 }}>
                  <Skeleton variant="text" width="80%" height={20} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="60%" height={18} />
                </Box>
                <Box sx={{ flex: 1, pr: 1 }}>
                  <Skeleton variant="text" width="80%" height={20} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="60%" height={18} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="80%" height={20} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="60%" height={18} />
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Pago y reembolso */}
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Skeleton variant="text" width="30%" />
                <Skeleton variant="text" width="35%" />
              </Box>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Skeleton variant="text" width="35%" />
                <Skeleton variant="text" width="30%" />
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Política de cancelación */}
              <Skeleton variant="text" width="60%" sx={{ fontSize: '0.875rem', mb: 1 }} />
              <Skeleton variant="text" width="100%" sx={{ mb: 0.5 }} />
              <Skeleton variant="text" width="90%" sx={{ mb: 1 }} />
              <Skeleton variant="text" width="40%" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CancelReservationSkeleton;
