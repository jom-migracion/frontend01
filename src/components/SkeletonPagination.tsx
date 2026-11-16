import { Box, Skeleton, useMediaQuery, useTheme } from '@mui/material';

const SkeletonPagination = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Cuántos "botones" simularás, cambia si lo necesitas
  const skeletonButtons = isMobile ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 3, 4, 5, 6, 7];

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        my: 4,
        px: { xs: 1, sm: 0 },
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          minWidth: isMobile ? 340 : undefined,
          mx: isMobile ? 'auto' : 2,
          overflowX: isMobile ? 'auto' : 'visible',
        }}
      >
        {skeletonButtons.map((_, i) =>
          i === 0 || i === skeletonButtons.length - 1 ? (
            // Skeleton para flechas "first" y "last"
            <Skeleton
              key={i}
              sx={{marginLeft: '5px'}}
              variant="circular"
              width={32}
              height={32}
              animation="wave"
            />
          ) : (
            // Skeleton para números de página (circular)
            <Skeleton
              key={i}
              sx={{marginLeft: '5px'}}
              variant="circular"
              width={isMobile ? 32 : 40}
              height={isMobile ? 32 : 40}
              animation="wave"
            />
          )
        )}
      </Box>
    </Box>
  );
};

export default SkeletonPagination;
