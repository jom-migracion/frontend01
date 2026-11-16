import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Definimos los tipos de estado permitidos
export type NotificationStatus = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  status: NotificationStatus;
  title: string;
  description: string;
}

const statusConfig = {
  success: {
    mainColor: '#1b5e20',
    bgColor: '#e8f5e9',
    Icon: CheckCircleOutlineIcon,
  },
  error: {
    mainColor: '#d32f2f',
    bgColor: '#ffebee',
    Icon: ErrorOutlineIcon,
  },
  warning: {
    mainColor: '#ed6c02',
    bgColor: '#fff3e0',
    Icon: WarningAmberIcon,
  },
  info: {
    mainColor: '#0288d1',
    bgColor: '#e1f5fe',
    Icon: InfoOutlinedIcon,
  },
};

export const Notification: React.FC<NotificationProps> = ({ status, title, description }) => {
  const config = statusConfig[status];
  const IconComponent = config.Icon;

  return (
    <Paper
      elevation={2}
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: 1.6,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        marginBottom: 2,
        width: '100%',
        backgroundColor: '#fff',
      }}
    >
      {/* 1. La barra de color a la izquierda */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '6px',
          backgroundColor: config.mainColor,
        }}
      />

      {/* 2. El círculo con el ícono */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 48,
          height: 48,
          borderRadius: '50%',
          backgroundColor: config.bgColor,
          color: config.mainColor,
          marginLeft: 1, // Espacio después de la barra de borde
          marginRight: 2,
          flexShrink: 0, // Evita que el ícono se aplaste si hay mucho texto
        }}
      >
        <IconComponent fontSize="medium" />
      </Box>

      {/* 3. Textos (Título y Descripción) */}
      <Box flexGrow={1} minWidth={0} sx={{ pr: 2 }}>
        <Typography
          variant="body2"
          component="div"
          sx={{ fontWeight: 'bold', color: '#333', lineHeight: 0.6 }}
        >
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', marginTop: 0.5 }}>
          {description}
        </Typography>
      </Box>
    </Paper>
  );
};
