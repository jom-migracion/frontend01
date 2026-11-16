import React from 'react';
import { Box, Stack, Skeleton, Typography } from '@mui/material';

const SkeletonRecentlyViewed: React.FC = () => {
  const pageSize = 10;

  return (
    <Stack direction="column" sx={{ m: '0px 24px 100px 40px' }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        <Skeleton width="200px" />
      </Typography>
      <Typography variant="body1" fontWeight={200} mb={3}>
        <Skeleton width="300px" />
      </Typography>

      <Box>
        {[...Array(2)].map((_, dateIndex) => (
          <Box key={dateIndex} mb={4}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              <Skeleton width="150px" />
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                gap: 3,
                justifyContent: 'center',
              }}
            >
              {[...Array(pageSize)].map((_, cardIndex) => (
                <Skeleton key={cardIndex} variant="rectangular" height={300} />
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Stack>
  );
};

export default SkeletonRecentlyViewed;