import React from 'react';
import Grid from '@mui/material/Grid2';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';

const CancelStep2ReservationSkeleton: React.FC = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Container maxWidth={matches ? 'lg' : 'md'} sx={{ py: 6 }}>
      <Grid container spacing={4} justifyContent="space-between">
        {/* Columna izquierda */}
        <Grid size={{ xs: 12, md: 5 }}>
          {/* Botón de volver */}
          <Skeleton variant="circular" width={40} height={40} sx={{ mb: 3, bgcolor: '#f0f0f0' }} />

          {/* Título */}
          <Skeleton
            variant="text"
            width="85%"
            sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 1 }}
          />

          {/* Subtítulo */}
          <Skeleton variant="text" width="75%" sx={{ fontSize: '0.875rem', mb: 3 }} />

          {/* TextField multiline */}
          <Skeleton variant="rounded" width="100%" height={120} sx={{ mb: 3, borderRadius: 2 }} />

          {/* Botón de enviar (alineado a la derecha) */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Skeleton variant="rectangular" height={40} width="220px" sx={{ borderRadius: 2 }} />
          </Box>
        </Grid>

        {/* Columna derecha - Card skeleton */}
        <Grid size={{ xs: 12, md: 6 }}>
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

export default CancelStep2ReservationSkeleton;
