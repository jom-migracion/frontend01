import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

const AirbnbCardSkeleton = () => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Image Container - aspect ratio 4:3 */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4/3',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
          animation="wave"
        />
        {/* Favorite Button Skeleton */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 2,
          }}
        >
          <Skeleton variant="circular" width={32} height={32} animation="wave" />
        </Box>
        {/* Image Indicators */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 0.5,
          }}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} variant="circular" width={6} height={6} animation="wave" />
          ))}
        </Box>
      </Box>

      {/* Card Info */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        {/* Location and Rating */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Skeleton width="60%" height={24} animation="wave" />
          <Skeleton
            variant="rectangular"
            width={50}
            height={24}
            animation="wave"
            sx={{ borderRadius: '8px' }}
          />
        </Box>

        {/* Title */}
        <Skeleton width="80%" height={21} animation="wave" />

        {/* Price */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '4px', mt: '4px' }}>
          <Skeleton width="35%" height={27} animation="wave" />
          <Skeleton width="15%" height={21} animation="wave" />
        </Box>
      </Box>
    </Box>
  );
};

export default AirbnbCardSkeleton;
