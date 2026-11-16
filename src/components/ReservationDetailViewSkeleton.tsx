import { Box, Card, Divider, Paper, Skeleton, useMediaQuery, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React from 'react';

const ReservationDetailViewSkeleton: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box>
      {/* Encabezado estado */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Skeleton variant="text" width={200} height={28} />
        <Skeleton variant="rounded" width={100} height={28} sx={{ borderRadius: 2 }} />
      </Box>

      <Grid container spacing={4}>
        {/* Columna izquierda */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Skeleton
              variant="rectangular"
              sx={{ height: { xs: 300, sm: 400, md: 580 } }}
              width="100%"
            />
          </Card>

          {/* Info alojamiento */}
          <Box mt={3}>
            <Skeleton variant="text" width="70%" height={40} />

            <Box display="flex" alignItems="center" mt={2}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
              <Box flex={1}>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="50%" />
              </Box>
            </Box>
          </Box>

          {/* Rating */}
          <Paper variant="outlined" sx={{ p: 2, mt: 2, borderRadius: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Skeleton variant="text" width="60%" height={24} sx={{ mx: 'auto' }} />
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                <Skeleton variant="rectangular" width={200} height={50} sx={{ borderRadius: 1 }} />
              </Box>
            </Box>
          </Paper>

          {/* Llegada y salida */}
          <Paper variant="outlined" sx={{ p: 2, mt: 2, borderRadius: 2, bgcolor: '#f0f0f0' }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 5 }}>
                <Skeleton variant="text" width={60} />
                <Skeleton variant="text" width={100} sx={{ mt: 0.5 }} />
                <Skeleton variant="text" width={60} sx={{ mt: 0.5 }} />
              </Grid>
              <Grid size={{ xs: 1 }}>
                <Divider orientation="vertical" />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Box display="flex" flexDirection="column" alignItems="flex-end">
                  <Skeleton variant="text" width={60} />
                  <Skeleton variant="text" width={100} sx={{ mt: 0.5 }} />
                  <Skeleton variant="text" width={60} sx={{ mt: 0.5 }} />
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Mensaje anfitrión */}
          <Box mt={3}>
            <Skeleton variant="text" width="50%" height={24} />
            <Skeleton variant="text" width="40%" sx={{ mt: 1, ml: 4 }} />
            <Skeleton variant="text" width="45%" height={24} sx={{ mt: 2 }} />
            <Skeleton variant="text" width="60%" sx={{ mt: 1, ml: 4 }} />
          </Box>

          {/* Detalles de la reserva */}
          <Box mt={4}>
            <Divider sx={{ borderBottomWidth: 1 }} />
            <Skeleton variant="text" width="40%" height={32} sx={{ mt: 2 }} />
            <Skeleton variant="text" width="30%" sx={{ mt: 2 }} />
            <Skeleton variant="text" width="90%" sx={{ mt: 1 }} />
            <Skeleton variant="text" width="30%" sx={{ mt: 2 }} />
            <Skeleton variant="text" width="95%" sx={{ mt: 1 }} />
            <Skeleton variant="text" width="90%" sx={{ mt: 0.5 }} />
            <Skeleton variant="text" width="25%" sx={{ mt: 1 }} />
          </Box>

          {/* Cómo llegar */}
          <Box mt={4}>
            <Divider sx={{ borderBottomWidth: 1 }} />
            <Skeleton variant="text" width="40%" height={32} sx={{ mt: 2 }} />
            <Skeleton variant="text" width="70%" sx={{ mt: 1 }} />
            <Skeleton
              variant="rectangular"
              sx={{
                height: { xs: 200, sm: 300 },
                borderRadius: 2,
                mt: 1,
              }}
            />
          </Box>

          {/* Reglas e instrucciones */}
          <Box mt={4}>
            <Divider sx={{ borderBottomWidth: 1 }} />
            <Skeleton variant="text" width="40%" height={32} sx={{ mt: 2 }} />
            <Skeleton variant="text" width="30%" sx={{ mt: 2 }} />
            <Skeleton variant="text" width="85%" sx={{ mt: 1 }} />
            <Skeleton variant="text" width="20%" sx={{ mt: 1 }} />
          </Box>

          {/* Anfitrión */}
          <Box mt={4}>
            <Divider sx={{ borderBottomWidth: 1 }} />
            <Box display="flex" justifyContent="space-between">
              <Skeleton variant="text" width="50%" height={32} sx={{ mt: 2 }} />
              <Skeleton variant="circular" width={40} height={40} sx={{ mt: 2 }} />
            </Box>
            <Box mt={2}>
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="text" width="100%" sx={{ mt: 1 }} />
              <Skeleton variant="text" width="95%" />
              <Skeleton variant="text" width="90%" />
              <Skeleton variant="text" width="25%" sx={{ mt: 1 }} />
            </Box>
          </Box>

          {/* Información de precio */}
          <Box mt={4}>
            <Divider sx={{ borderBottomWidth: 1 }} />
            <Skeleton variant="text" width="40%" height={32} sx={{ mt: 2 }} />
            <Skeleton variant="text" width="30%" sx={{ mt: 1 }} />
            <Skeleton variant="text" width="25%" height={32} sx={{ mt: 0.5 }} />
            <Skeleton variant="text" width="40%" sx={{ mt: 1 }} />
          </Box>

          {/* Asistencia */}
          <Box mt={4}>
            <Divider sx={{ borderBottomWidth: 1 }} />
            <Skeleton variant="text" width="50%" height={32} sx={{ mt: 2 }} />
            <Skeleton variant="text" width="95%" sx={{ mt: 1 }} />
            <Skeleton variant="text" width="85%" sx={{ mt: 0.5 }} />
            <Skeleton variant="text" width="30%" sx={{ mt: 1 }} />
          </Box>
        </Grid>

        {/* Columna derecha */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              position: { xs: 'fixed', md: 'sticky' },
              bottom: { xs: 0, md: 'auto' },
              top: { xs: 'auto', md: 88 },
              left: { xs: 0, md: 'auto' },
              right: { xs: 0, md: 'auto' },
              width: { xs: '100%', md: 'auto' },
              zIndex: { xs: 1200, md: 10 },
              transition: 'all 0.3s ease-in-out',
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 1 },
                borderRadius: { xs: '16px 16px 0 0', md: 3 },
                width: { xs: '100%', md: '80%' },
                maxWidth: { md: 380 },
                border: '1px solid #eee',
                boxShadow: {
                  xs: '0px -4px 16px rgba(0, 0, 0, 0.1)',
                  md: '0px 8px 24px rgba(0, 0, 0, 0.08)',
                },
              }}
            >
              {/* Vista compacta para móvil */}
              {isMobile && (
                <Box
                  sx={{
                    display: { xs: 'flex', md: 'none' },
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box flex={1}>
                    <Skeleton variant="text" width="70%" height={24} />
                    <Skeleton variant="text" width="50%" height={20} />
                  </Box>
                  <Skeleton variant="circular" width={28} height={28} />
                </Box>
              )}

              {/* Vista completa - Desktop */}
              <Box
                sx={{ display: { xs: 'none', md: 'block' } }}
                pl={2}
                pt={2}
                pb={2}
                gap={2}
                position="relative"
              >
                {/* Step Items */}
                {[1, 2, 3, 4, 5, 6].map((item, index) => (
                  <Box
                    key={item}
                    display="flex"
                    alignItems="flex-start"
                    gap={2}
                    mb={index === 5 ? 0 : 0}
                    position="relative"
                  >
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <Skeleton variant="circular" width={28} height={28} />
                      {index < 5 && (
                        <Box
                          sx={{
                            width: 2,
                            height: 30,
                            bgcolor: '#e0e0e0',
                            mt: 0,
                            mb: 2,
                          }}
                        />
                      )}
                    </Box>
                    <Box flex={1} pt={0.5}>
                      <Skeleton variant="text" width="80%" />
                      <Skeleton variant="text" width="60%" />
                    </Box>
                  </Box>
                ))}

                {/* Botón */}
                <Box px={2} pb={2} pt={3}>
                  <Skeleton variant="rounded" width="100%" height={42} sx={{ borderRadius: 2 }} />
                </Box>

                {/* Link cancelación */}
                <Box px={2} pb={2}>
                  <Skeleton variant="text" width="60%" height={20} sx={{ mx: 'auto' }} />
                </Box>
              </Box>
            </Paper>
          </Box>
          {/* Espaciador para móvil cuando el componente está fijo */}
          {isMobile && <Box sx={{ height: 120 }} />}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReservationDetailViewSkeleton;
