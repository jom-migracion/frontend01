import React from 'react';
import { Box, Skeleton } from '@mui/material';

const SkeletonWishListCard: React.FC = () => (
  <Box sx={{ width: '100%' }}>
    {/* Image Container */}
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        aspectRatio: '4/3',
        borderRadius: 6,
        overflow: 'hidden',
        mb: 1,
        boxShadow: { xs: '0 2px 8px rgba(0, 0, 0, 0.1)', md: '0 4px 16px rgba(0, 0, 0, 0.15)' },
      }}
    >
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
      {/* Delete Button Skeleton */}
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
    </Box>

    {/* Title and Count */}
    <Box>
      <Skeleton variant="text" animation="wave" width="70%" height={20} sx={{ mb: 0.25 }} />
      <Skeleton variant="text" animation="wave" width="40%" height={18} />
    </Box>
  </Box>
);

export default SkeletonWishListCard;
