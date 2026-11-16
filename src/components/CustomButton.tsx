import Button, { ButtonProps } from '@mui/material/Button';
import React, { ReactNode } from 'react';

export interface CustomButtonProps extends ButtonProps {
  backgroundColor?: string;
  background?: string;
  textColor?: string;
  textColorHover?: string;
  hoverColor?: string;
  borderRadius?: number;
  label: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  size?: 'small' | 'medium' | 'large';
  variant?: 'text' | 'outlined' | 'contained';
  fullWidth?: boolean;
  sx?: object;
  width?: string | number;
  type?: 'button' | 'submit' | 'reset';
  border?: string;
  padding?: string;
  borderColor?: string;
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
}

const CustomButton: React.FC<CustomButtonProps> = ({
  backgroundColor,
  background,
  textColor,
  color = 'primary',
  variant = 'contained',
  sx = {},
  label,
  border,
  borderColor,
  ...props
}) => {
  const isCustomBg = Boolean(background || backgroundColor);

  return (
    <Button
      {...props}
      color={isCustomBg ? undefined : color}
      variant={variant}
      sx={{
        backgroundColor: backgroundColor,
        textTransform: 'none',
        fontWeight: 700,
        borderRadius: props.borderRadius || 2,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: border ? border : 'none',
        filter: 'brightness(1)',
        boxSizing: 'border-box',
        ...(isCustomBg
          ? {
              background: background,
              color: textColor ?? '#fff',
              borderColor: borderColor,
              boxShadow: `0 28px 20px rgba(${background}, 0.35)`,
              '&:hover': {
                filter: 'brightness(0.95)',
                transform: 'translateY(-3px)',
                boxShadow: `0 8px 20px rgba(${background}, 0.6)`,
              },
            }
          : {
              color: textColor ?? '#fff',
              '&:hover': {
                transform: 'translateY(-3px)',
                border: border ? border : 'none',
                borderColor: borderColor,
                boxShadow: `0 8px 20px rgba(${background}, 0.35)`,
              },
            }),
        ...sx,
      }}
    >
      {label}
    </Button>
  );
};

export default CustomButton;
