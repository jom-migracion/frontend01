import React from 'react';
import { Box, Pagination, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SkeletonPagination from '@/components/SkeletonPagination';

interface ListingsPaginationProps {
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const ListingsPagination: React.FC<ListingsPaginationProps> = ({
  isLoading,
  totalPages,
  currentPage,
  onPageChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (isLoading) return <SkeletonPagination />;
  if (!totalPages) return null;

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
          minWidth: isMobile ? 340 : undefined,
          mx: isMobile ? 'auto' : 0,
          overflowX: isMobile ? 'auto' : 'visible',
          display: 'inline-block',
        }}
      >
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={onPageChange}
          color="primary"
          size={isMobile ? 'medium' : 'large'}
          showFirstButton
          showLastButton
          siblingCount={0}
          boundaryCount={1}
          variant="text"
          sx={{
            '.MuiPagination-ul': {
              flexWrap: 'nowrap',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default ListingsPagination;
