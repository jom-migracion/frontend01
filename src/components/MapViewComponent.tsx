// @/components/MapViewComponent.tsx
import React from 'react';
import { Fab } from '@mui/material';
import MapIcon from '@mui/icons-material/MapOutlined';
import ListIcon from '@mui/icons-material/FormatListBulleted';

interface MapViewComponentProps {
  isMapFullScreen: boolean;
  setIsMapFullScreen: (value: boolean) => void;
  isSearchDialogOpen?: boolean;
}

const MapViewComponent: React.FC<MapViewComponentProps> = ({
  isMapFullScreen,
  setIsMapFullScreen,
  isSearchDialogOpen = false,
}) => {
  // Ocultar el botón cuando el dialog de búsqueda está abierto
  if (isSearchDialogOpen) {
    return null;
  }

  return (
    <Fab
      variant="extended"
      onClick={() => setIsMapFullScreen(!isMapFullScreen)}
      sx={{
        position: 'fixed',
        bottom: 30, // Un poco más arriba para que no estorbe la navegación del móvil
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: (theme) => theme.palette.primary.main,
        color: '#fff',
        textTransform: 'none',
        fontWeight: 600,
        px: 3,
        zIndex: 10000, // Por encima del mapa (9999)
        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)',
        '&:hover': { backgroundColor: (theme) => theme.palette.primary.dark },
      }}
    >
      {isMapFullScreen ? (
        <>
          <ListIcon sx={{ mr: 1 }} />
          Lista
        </>
      ) : (
        <>
          <MapIcon sx={{ mr: 1 }} />
          Mapa
        </>
      )}
    </Fab>
  );
};

export default MapViewComponent;
