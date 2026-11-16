import {
  alpha,
  Box,
  Card,
  Container,
  Skeleton,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid2';

const DetailPropertySkeleton: React.FC = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery('(min-width:1920px)');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const brandColor = '#e7e7e7';

  return (
    <Container
      maxWidth={isLargeScreen ? 'xl' : 'lg'}
      sx={{ px: { xs: 1, sm: 4, md: isLargeScreen ? 5 : 4 }, mt: isMobile ? 1 : 6 }}
    >
      <Stack direction="column">
        {/* Título y botón de guardar */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems={'baseline'}
          width="100%"
          sx={{ mb: 3 }}
        >
          <Skeleton variant="text" width="50%" height={48} />
          <Box display={'flex'}>
            <Skeleton
              variant="text"
              width={isMobile ? 48 : 120}
              height={48}
              sx={{ borderRadius: 2, ml: 2 }}
            />
            <Skeleton
              variant="text"
              width={isMobile ? 48 : 120}
              height={48}
              sx={{ borderRadius: 2, ml: 2 }}
            />
          </Box>
        </Box>

        {/* Galería de imágenes */}
        <Box
          sx={{
            borderRadius: '24px',
            overflow: 'hidden',
            mt: 0,
            mb: 4,
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            bgcolor: '#fff',
          }}
        >
          <Grid container spacing={1}>
            {/* Imagen principal */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  height: { xs: 250, sm: 360, md: 500 },
                  overflow: 'hidden',
                }}
              >
                <Skeleton variant="rectangular" width="100%" height="100%" />
              </Box>
            </Grid>

            {/* Grilla secundaria */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={1} sx={{ height: '100%' }}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <Grid size={{ xs: 6 }} key={index}>
                    <Box
                      sx={{
                        width: '100%',
                        height: { xs: 120, sm: 180, md: 246 },
                        overflow: 'hidden',
                      }}
                    >
                      <Skeleton variant="rectangular" width="100%" height="100%" />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>

        {/* Detalles y reserva */}
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 7 }}>
            {/* Detalles del anfitrión y descripción */}
            <Box sx={{ mb: 6 }}>
              <Skeleton variant="text" width="50%" height={35} />
              <Skeleton variant="text" width="40%" height={25} sx={{ mt: 1 }} />
            </Box>

            <Box
              sx={{
                height: '1px',
                width: '100%',
                background: `linear-gradient(90deg, ${alpha(brandColor, 0.4)} 0%, transparent 100%)`,
                my: 5,
              }}
            />

            {/* Descripción */}
            <Box component="section">
              <Skeleton variant="text" width="30%" height={35} sx={{ mb: 3 }} />
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="text" width="25%" height={24} />
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="text" width="25%" height={24} />
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="text" width="25%" height={24} />
              </Box>
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="80%" height={20} />
              <Box mt={2}>
                <Skeleton variant="rectangular" width={150} height={40} sx={{ borderRadius: 2 }} />
              </Box>
            </Box>

            <Box
              sx={{
                height: '1px',
                width: '100%',
                background: `linear-gradient(90deg, ${alpha(brandColor, 0.4)} 0%, transparent 100%)`,
                my: 5,
              }}
            />

            {/* Servicios y amenidades */}
            <Box component="section">
              <Skeleton variant="text" width="35%" height={35} sx={{ mb: 3 }} />
              {Array.from({ length: 3 }).map((_, index) => (
                <Box key={index} display="flex" alignItems="center" gap={2} mb={2}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton variant="text" width="40%" height={24} />
                </Box>
              ))}
              <Skeleton
                variant="rectangular"
                width={150}
                height={40}
                sx={{ mt: 2, borderRadius: 2 }}
              />
            </Box>

            <Box
              sx={{
                height: '1px',
                width: '100%',
                background: `linear-gradient(90deg, ${alpha(brandColor, 0.4)} 0%, transparent 100%)`,
                my: 5,
              }}
            />

            {/* Selección de fechas */}
            <Box component="section">
              <Skeleton variant="text" width="40%" height={35} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="60%" height={20} sx={{ mb: 3 }} />
              <Box
                sx={{
                  bgcolor: '#fff',
                  borderRadius: '30px',
                  display: 'inline-block',
                  p: 2,
                }}
              >
                <Grid container spacing={1}>
                  {Array.from({ length: 14 }).map((_, index) => (
                    <Grid size={{ xs: 12 / 7, sm: 12 / 7 }} key={index}>
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={isMobile ? 40 : 50}
                        sx={{ borderRadius: 2 }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>

            <Box
              sx={{
                height: '1px',
                width: '100%',
                background: `linear-gradient(90deg, ${alpha(brandColor, 0.4)} 0%, transparent 100%)`,
                my: 5,
              }}
            />

            {/* Reseñas */}
            <Box component="section">
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="text" width="20%" height={35} />
                <Skeleton variant="text" width="15%" height={25} />
              </Box>
              {Array.from({ length: 2 }).map((_, index) => (
                <Box key={index} mb={3}>
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <Skeleton variant="circular" width={48} height={48} />
                    <Box flex={1}>
                      <Skeleton variant="text" width="30%" height={24} />
                      <Skeleton variant="text" width="20%" height={20} />
                    </Box>
                  </Box>
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="70%" height={20} />
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Columna derecha - Card de reserva */}
          <Grid size={{ xs: 12, md: 5 }} sx={{ mt: 0 }}>
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
                border: '1px solid #e2e8f0',
              }}
            >
              <Box display="flex" alignItems="baseline" gap={1} mb={3}>
                <Skeleton variant="text" width="40%" height={32} />
                <Skeleton variant="text" width="30%" height={24} />
              </Box>

              <Box mb={2}>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={120}
                  sx={{ borderRadius: 2, mb: 2 }}
                />
              </Box>

              <Box display="flex" justifyContent="space-between" mb={1}>
                <Skeleton variant="text" width="40%" height={20} />
                <Skeleton variant="text" width="30%" height={20} />
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Skeleton variant="text" width="35%" height={20} />
                <Skeleton variant="text" width="30%" height={20} />
              </Box>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Skeleton variant="text" width="40%" height={20} />
                <Skeleton variant="text" width="30%" height={20} />
              </Box>

              <Box
                sx={{
                  height: '1px',
                  width: '100%',
                  bgcolor: '#e2e8f0',
                  my: 2,
                }}
              />

              <Box display="flex" justifyContent="space-between" mb={3}>
                <Skeleton variant="text" width="30%" height={28} />
                <Skeleton variant="text" width="35%" height={28} />
              </Box>

              <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: 2 }} />
            </Card>
          </Grid>

          {/* Ubicación */}
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                height: '1px',
                width: '100%',
                background: `linear-gradient(90deg, ${alpha(brandColor, 0.5)} 0%, transparent 100%)`,
                my: 3,
              }}
            />
            <Skeleton variant="text" width="40%" height={35} sx={{ mb: 5 }} />
            <Skeleton
              variant="rectangular"
              width="100%"
              sx={{ borderRadius: 2, height: { xs: 200, sm: 300, md: 450 } }}
            />
          </Grid>

          {/* Información del host */}
          <Grid size={{ xs: 12 }}>
            <Skeleton variant="text" width="30%" height={35} sx={{ mb: 5 }} />
            <Box display="flex" alignItems="flex-start" gap={2}>
              <Skeleton variant="circular" width={64} height={64} />
              <Box flex={1}>
                <Skeleton variant="text" width="40%" height={28} />
                <Skeleton variant="text" width="30%" height={20} sx={{ mt: 1 }} />
                <Skeleton variant="text" width="100%" height={20} sx={{ mt: 2 }} />
                <Skeleton variant="text" width="90%" height={20} />
              </Box>
            </Box>
            <Skeleton
              variant="rectangular"
              width={180}
              height={40}
              sx={{ mt: 2, borderRadius: 2 }}
            />
          </Grid>

          {/* Políticas */}
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                height: '1px',
                width: '100%',
                background: `linear-gradient(90deg, ${alpha(brandColor, 0.5)} 0%, transparent 100%)`,
                my: 6,
              }}
            />
            <Skeleton variant="text" width="35%" height={35} sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              {Array.from({ length: 3 }).map((_, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={index}>
                  <Box
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: '16px',
                      padding: '1.5rem',
                    }}
                  >
                    <Skeleton variant="text" width="80%" height={24} />
                    <Skeleton variant="text" width="100%" height={20} sx={{ mt: 1 }} />
                    <Skeleton variant="text" width="90%" height={20} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
};

export default DetailPropertySkeleton;
