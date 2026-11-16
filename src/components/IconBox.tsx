import React from 'react';
import { Box, useTheme, SxProps, Theme } from '@mui/material';

interface IconBoxProps {
  icon: React.ReactElement;
  sx?: SxProps<Theme>;
}

const IconBox = ({ icon, sx = {} }: IconBoxProps) => {
  const theme = useTheme();

  // Definimos los colores base (puedes ajustar los fallbacks si no tienes ese tema específico)
  const iconColor = theme.palette.customColors?.primary?.[1] || theme.palette.primary.main;
  const bgColor = 'rgba(91, 76, 160, 0.1)';

  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      }}
    >
      {React.isValidElement(icon) &&
        React.cloneElement(icon, {
          style: {
            fontSize: '20px',
            color: iconColor,
            ...(icon.props as any).style,
          },
        } as any)}
    </Box>
  );
};

export default IconBox;
