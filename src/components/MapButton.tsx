import React from 'react';
import { Fab, Box } from '@mui/material';
import MapIcon from '@mui/icons-material/MapOutlined'; // El icono delineado se parece más al de tu imagen

const MapButton: React.FC = () => {
  return (
    // Usamos un Box contenedor para simular el contenido de la pantalla (opcional)
    // El botón real es el componente <Fab> de abajo
    <Box sx={{ height: '100vh', position: 'relative', bgcolor: '#f5f5f5' }}>
      {/* ... Aquí iría el resto del contenido de tu app ... */}

      <Fab
        variant="extended"
        color="primary"
        aria-label="ver mapa"
        sx={{
          // Posicionamiento fijo para que flote sobre el contenido
          position: 'fixed',
          bottom: 24, // Margen desde abajo
          left: '50%',
          transform: 'translateX(-50%)', // Centrar horizontalmente

          // Estilos visuales para igualar tu imagen
          backgroundColor: '#6552FF', // Un morado similar al de la imagen
          color: '#fff',
          textTransform: 'none', // Evita que el texto se ponga en MAYÚSCULAS
          fontWeight: 600,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)', // Sombra suave
          paddingX: 3, // Ancho del botón (padding horizontal)

          // Hover state (opcional)
          '&:hover': {
            backgroundColor: '#5040cc',
          },

          // Z-index alto para asegurar que esté encima de todo (mapas, listas, etc.)
          zIndex: 1000,
        }}
        onClick={() => console.log('Abrir mapa')}
      >
        <MapIcon sx={{ mr: 1 }} /> {/* Icono con margen a la derecha */}
        Mapa
      </Fab>
    </Box>
  );
};

export default MapButton;
