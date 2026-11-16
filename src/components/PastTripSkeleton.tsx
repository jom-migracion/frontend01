import { Box, Card, Skeleton, Stack } from '@mui/material';

const PastTripSkeleton: React.FC = () => {
  return (
    <Card
      elevation={0}
      sx={{
        width: '100%',
        height: '100%',
        borderRadius: '12px',
        border: '1px solid #E0E0E0',
        display: 'flex',
        flexDirection: 'column',
        padding: '12px',
        backgroundColor: '#FFFFFF',
        '@media (min-width: 600px)': {
          padding: 2,
        },
      }}
    >
      {/* Image + chip */}
      <Box sx={{ position: 'relative', mb: 1.5 }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          sx={{
            height: { xs: 180, sm: 200 },
            borderRadius: '12px',
          }}
        />
        {/* Chip position */}
        <Skeleton
          variant="rounded"
          width={72}
          height={26}
          sx={{ position: 'absolute', top: 8, right: 8, borderRadius: '16px' }}
        />
      </Box>

      {/* Content */}
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 1 }}>
        {/* Title */}
        <Skeleton variant="text" width="80%" height={22} />

        {/* Location row */}
        <Stack direction="row" alignItems="center" spacing={0.8}>
          <Skeleton variant="circular" width={20} height={20} />
          <Skeleton variant="text" width="55%" height={18} />
        </Stack>

        {/* Divider */}
        <Box sx={{ height: '1px', width: '100%', bgcolor: 'rgba(0,0,0,0.06)', my: 0.5 }} />

        {/* Date row */}
        <Stack direction="row" alignItems="center" spacing={0.8}>
          <Skeleton variant="circular" width={20} height={20} />
          <Skeleton variant="text" width="45%" height={18} />
        </Stack>
      </Box>
    </Card>
  );
};

export default PastTripSkeleton;
