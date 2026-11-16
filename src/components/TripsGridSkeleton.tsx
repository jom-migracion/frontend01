import { Box, Card, Skeleton, Stack } from '@mui/material';

interface TripsGridSkeletonProps {
  count?: number;
}

const TripsGridSkeleton: React.FC<TripsGridSkeletonProps> = ({ count = 3 }) => {
  return (
    <Box sx={{ px: 0, mt: 4, mb: 6 }}>
      <Stack spacing={2} mt={3}>
        {Array.from({ length: count }).map((_, index) => (
          <Card
            key={index}
            elevation={0}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { sm: 'center' },
              justifyContent: 'space-between',
              padding: 2,
              borderRadius: '16px',
              border: '1px solid #E5E7EB',
              backgroundColor: '#FFFFFF',
              gap: 2,
            }}
          >
            {/* Sección Izquierda: Imagen + Info */}
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flex: 1 }}>
              {/* Imagen skeleton */}
              <Skeleton
                variant="rounded"
                sx={{
                  width: 180,
                  height: 120,
                  borderRadius: '12px',
                  flexShrink: 0,
                  '@media (max-width: 600px)': {
                    width: '100%',
                    height: 200,
                  },
                }}
              />

              {/* Información Textual skeleton */}
              <Box display="flex" flexDirection="column" gap={1} sx={{ flex: 1 }}>
                {/* Título y Chip */}
                <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
                  <Skeleton variant="text" width={200} height={24} />
                  <Skeleton
                    variant="rounded"
                    width={100}
                    height={28}
                    sx={{ borderRadius: '14px' }}
                  />
                </Stack>

                {/* Fecha con icono */}
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Skeleton variant="circular" width={18} height={18} />
                  <Skeleton variant="text" width={180} height={20} />
                </Stack>
              </Box>
            </Box>

            {/* Sección Derecha: Link de acción skeleton */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                paddingRight: { sm: 2 },
              }}
            >
              <Skeleton variant="text" width={80} height={20} />
              <Skeleton variant="circular" width={18} height={18} />
            </Box>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default TripsGridSkeleton;
