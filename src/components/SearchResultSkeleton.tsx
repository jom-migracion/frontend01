import { Box, Container, Skeleton, Stack, useMediaQuery } from '@mui/material';
import Grid from '@mui/material/Grid2';
import AirbnbCardSkeleton from '@/components/AirbnbCardSkeleton';

const SearchResultsSkeleton: React.FC = () => {
  const isLargeScreen = useMediaQuery('(min-width:1920px)');
  return (
    // <Box sx={{ px: { xs: 5, sm: 4, md: 4 }, mt: 6 }}>
    <Container
      maxWidth={isLargeScreen ? 'xl' : 'lg'}
      sx={{ px: { xs: 0, sm: 4, md: isLargeScreen ? 5 : 4 }, mt: '24px' }}
    >
      <Stack direction="column">
        <Box sx={{ flex: 1, width: '100%', display: 'flex', borderRadius: 6 }}>
          <Grid container spacing={0} sx={{ flex: 1 }}>
            {/* Columna derecha: Mapa skeleton */}
            <Grid
              size={{ xs: 12, md: 5 }}
              sx={{
                height: { xs: '400px', md: '100vh' },
                position: { xs: 'relative', md: 'sticky' },
                top: { md: 0 },
                alignSelf: { md: 'flex-start' },
                order: { xs: 1, md: 2 },
              }}
            >
              <Skeleton
                variant="rectangular"
                sx={{
                  height: '100%',
                  width: '100%',
                  borderRadius: '16px',
                }}
              />
            </Grid>

            {/* Columna izquierda: Lista con scroll */}
            <Grid
              size={{ xs: 12, md: 7 }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                order: { xs: 2, md: 1 },
                height: { xs: 'auto', md: '100vh' },
                overflow: 'hidden',
              }}
            >
              {/* Buscador skeleton */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  flexShrink: 0,
                }}
              >
                <Skeleton
                  variant="rectangular"
                  sx={{ borderRadius: '12px', width: '100%', height: 60 }}
                />
              </Box>

              {/* Cabecera con resultados skeleton */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  pb: 1.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  flexShrink: 0,
                }}
              >
                <Skeleton variant="text" width={150} height={24} />
                <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 2 }} />
              </Box>

              {/* Grid de tarjetas skeleton */}
              <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', overflowX: 'hidden' }}>
                <Grid container spacing={2}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Grid key={i} size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
                      <AirbnbCardSkeleton />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </Container>
  );
};

export default SearchResultsSkeleton;
