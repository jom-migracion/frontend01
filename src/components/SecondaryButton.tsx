// import CustomButton from './CustomButton';
import { useTheme } from '@mui/material';
import { Button, ButtonProps } from '@mui/material';
import React from 'react';

export interface CustomButtonProps extends ButtonProps {
  label: string;
}

export const CustomButton1: React.FC<CustomButtonProps> = ({ label, sx = {}, ...props }) => {
  // const theme = useTheme();

  return (
    <Button
      {...props}
      sx={{
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: 2,
        '&:hover': {
          transform: 'translateY(-4px)',
        },

        ...sx,
      }}
    >
      {label}
    </Button>
  );
};

const SecondaryButton = (props: Omit<CustomButtonProps, 'variant' | 'color'>) => {
  const theme = useTheme();

  return (
    <CustomButton1
      {...props}
      variant="outlined"
      sx={{
        backgroundColor: theme.palette.common.white,
        color: theme.palette.secondary.main,
        borderColor: theme.palette.secondary.main,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

        '&:hover': {
          backgroundColor: theme.palette.action.hover,
          borderColor: theme.palette.secondary.dark,
          transform: 'translateY(-4px)',
        },
      }}
    />
  );
};

export default SecondaryButton;
