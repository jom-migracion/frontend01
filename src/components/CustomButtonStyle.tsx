import Button from '@mui/material/Button';
import useTheme from '@mui/material/styles/useTheme';
import React from 'react';

interface CustomButtonStyleProps {
  label?: string;
  size: 'small' | 'medium' | 'large';
  variant?: 'text' | 'outlined' | 'contained';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  color?: string;
  bgcolor?: string;
  background?: string;
  primary?: boolean;
  onClickButton?: () => void;
}

const CustomButtonStyle = ({
  label,
  size,
  startIcon,
  endIcon,
  color,
  bgcolor,
  background,
  primary,
  variant,
}: CustomButtonStyleProps) => {
  const theme = useTheme();
  return (
    <Button
      variant={variant ? variant : 'outlined'}
      size={size}
      fullWidth
      startIcon={startIcon}
      endIcon={endIcon}
      sx={{
        boxSizing: 'border-box',
        bgcolor: bgcolor ? bgcolor : undefined,
        color: color ? color : '#64748b',
        background: background ? background : undefined,
        border: `-1px solid ${theme.palette.customColors.primary[1]}`,
        textTransform: 'none',
        borderRadius: 2,
        transition: 'all 0.3s',
        '&:hover': {
          border: `0px solid ${theme.palette.customColors.primary[1]}`,
          bgcolor: bgcolor ? bgcolor : undefined,
          boxShadow: '1px 5px 5px rgba(0, 0, 0, 0.2)',
          transform: 'translateY(-4px)',
          color: primary ? 'white' : '#64748b',
        },
      }}
    >
      {label}
    </Button>
  );
};

export default CustomButtonStyle;
