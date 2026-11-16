import { Box, Card, Divider, Paper, Skeleton, useMediaQuery, useTheme } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import React from 'react';

const StatusPropertySkeleton: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box>
      {/* Encabezado estado */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Skeleton variant="text" width={200} height={28} />
        <Skeleton variant="rounded" width={100} height={28} sx={{ borderRadius: 2 }} />
      </Box>

      <Grid2 container spacing={4} sx={{ pb: { xs: 20, md: 0 } }}>
        {/* Columna izquierda */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
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

          {/* Llegada y salida */}
          <Box
            mt={3}
            p={2}
            sx={{
              bgcolor: '#ededed',
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Skeleton variant="text" width={60} />
              <Skeleton variant="text" width={100} sx={{ mt: 0.5 }} />
              <Skeleton variant="text" width={60} sx={{ mt: 0.5 }} />
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box>
              <Skeleton variant="text" width={60} />
              <Skeleton variant="text" width={100} sx={{ mt: 0.5 }} />
              <Skeleton variant="text" width={60} sx={{ mt: 0.5 }} />
            </Box>
          </Box>

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
            <Skeleton variant="text" width="85%" sx={{ mt: 0.5 }} />
            <Skeleton variant="text" width="30%" sx={{ mt: 2 }} />
            <Skeleton variant="text" width="95%" sx={{ mt: 1 }} />
            <Skeleton variant="text" width="25%" sx={{ mt: 1 }} />
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

          {/* Precio */}
          <Box mt={4}>
            <Divider sx={{ borderBottomWidth: 1 }} />
            <Skeleton variant="text" width="40%" height={32} sx={{ mt: 2 }} />
            <Skeleton variant="text" width="30%" sx={{ mt: 1 }} />
            <Skeleton variant="text" width="25%" height={32} sx={{ mt: 0.5 }} />
          </Box>

          {/* Asistencia */}
          <Box mt={4}>
            <Divider sx={{ borderBottomWidth: 1 }} />
            <Skeleton variant="text" width="50%" height={32} sx={{ mt: 2 }} />
            <Skeleton variant="text" width="95%" sx={{ mt: 1 }} />
            <Skeleton variant="text" width="60%" sx={{ mt: 1 }} />
            <Skeleton variant="text" width="30%" sx={{ mt: 1 }} />
          </Box>
        </Grid2>

        {/* Columna derecha */}
        <Grid2 size={{ xs: 12, md: 6 }}>
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

              {/* Vista completa */}
              <Box
                sx={{ display: { xs: 'none', md: 'block' } }}
                pl={2}
                pt={2}
                pb={2}
                gap={2}
                position="relative"
              >
                {/* Step Items */}
                {[1, 2, 3, 4].map((item, index) => (
                  <Box
                    key={item}
                    display="flex"
                    alignItems="flex-start"
                    gap={2}
                    mb={index === 3 ? 0 : 0}
                    position="relative"
                  >
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <Skeleton variant="circular" width={28} height={28} />
                      {index !== 3 && (
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
              </Box>

              <Box p={1}>
                <Skeleton variant="rounded" height={48} sx={{ borderRadius: 2 }} />
                <Skeleton variant="text" width="60%" sx={{ pt: 2, mx: 'auto' }} />
              </Box>
            </Paper>
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default StatusPropertySkeleton;
