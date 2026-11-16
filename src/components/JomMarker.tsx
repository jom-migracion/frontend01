import React from 'react';
import { Box, Typography, styled, useTheme } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface JomMarkerProps {
  price?: string;
  selected?: boolean;
  isFavorite?: boolean;
  onClick?: () => void;
}

const PricePill = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(({ selected, theme }) => ({
  backgroundColor: selected ? theme.palette.primary.main : 'white',
  color: selected ? 'white' : 'black',
  padding: '6px 12px',
  borderRadius: '24px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  fontWeight: 'bold',
  fontSize: '14px',
  cursor: 'pointer',
  boxShadow: '0px 3px 10px rgba(0,0,0,0.15)',
  transition: 'all 0.2s ease-in-out',
  position: 'relative',
  whiteSpace: 'nowrap',
  width: 'auto',
  minWidth: 'fit-content',
  zIndex: selected ? 100 : 1,

  '&:hover': {
    transform: 'scale(1.1)',
    zIndex: 101,
  },
}));

export const JomMarker: React.FC<JomMarkerProps> = ({
  price,
  selected = false,
  isFavorite = false,
  onClick,
}) => {
  const theme = useTheme();
  return (
    <PricePill selected={selected} onClick={onClick}>
      <Typography variant="body2" sx={{ fontWeight: 700, color: 'inherit' }}>
        {price}
      </Typography>
      {isFavorite && (
        <FavoriteIcon
          sx={{
            fontSize: 14,
            color: selected ? 'white' : theme.palette.primary.main,
          }}
        />
      )}
    </PricePill>
  );
};
