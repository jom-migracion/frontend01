import { Box, Container, Skeleton, Stack, useMediaQuery, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';

const HostProfileInfoSkeleton = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery('(min-width:1920px)');
  const cardHost = isLargeScreen ? 4 : 5;

  return (
    <Container
      maxWidth={isLargeScreen ? 'xl' : 'lg'}
      sx={{ px: { xs: 2, sm: 4, md: isLargeScreen ? 5 : 4 }, mt: 4 }}
    >
      <Grid container spacing={{ xs: 4, md: 5 }}>
        {/* LADO IZQUIERDO: Card del host */}
        <Grid size={{ xs: 12, md: 4, lg: cardHost }}>
          <Skeleton
            variant="rounded"
            sx={{ borderRadius: 6, width: '100%', height: { xs: 220, md: 320 } }}
          />
        </Grid>

        {/* LADO DERECHO */}
        <Grid size={{ xs: 12, md: 8, lg: 7 }}>
          {/* Título "Acerca de..." */}
          <Skeleton variant="text" width="55%" height={48} sx={{ mb: 3 }} />

          {/* Paper de detalles */}
          <Box
            sx={{
              p: 3,
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
              mb: 6,
            }}
          >
            {/* Título sección detalles */}
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <Skeleton variant="circular" width={20} height={20} />
              <Skeleton variant="text" width="30%" height={28} />
            </Stack>

            {/* Grid 2x2 de DetailPills */}
            <Grid container spacing={2}>
              {[1, 2, 3, 4].map((i) => (
                <Grid size={{ xs: 12, sm: 6 }} key={i}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 1.5 }}>
                    <Skeleton variant="circular" width={22} height={22} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="70%" height={20} />
                      <Skeleton variant="text" width="40%" height={14} />
                    </Box>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Divider */}
          <Skeleton variant="rectangular" height={1} sx={{ mb: 4 }} />

          {/* Título de reseñas */}
          <Skeleton variant="text" width="40%" height={40} sx={{ mb: 3 }} />

          {/* Grid de ReviewCards (2 columnas) */}
          <Grid container spacing={2}>
            {[1, 2, 3].map((card) => (
              <Grid size={{ xs: 12, md: 6 }} key={card}>
                <Box
                  sx={{
                    p: 2.5,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 4,
                  }}
                >
                  {/* Avatar + nombre */}
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2, mt: 1 }}>
                    <Skeleton variant="circular" width={44} height={44} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="60%" height={20} />
                      <Skeleton variant="text" width="40%" height={16} />
                    </Box>
                  </Stack>
                  {/* Rating + fecha */}
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
                    <Skeleton variant="rounded" width={90} height={16} />
                    <Skeleton variant="text" width="30%" height={16} />
                  </Stack>
                  {/* Texto reseña */}
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="65%" />
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Botón "Ver todas" */}
          <Skeleton variant="rounded" width={200} height={44} sx={{ mt: 4, borderRadius: 3 }} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default HostProfileInfoSkeleton;
