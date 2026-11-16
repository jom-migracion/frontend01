// import { Box, CircularProgress } from '@mui/material';
// import CustomHouseMarker from './CustomHouseMarker';
// import { Circle, GoogleMap, useJsApiLoader } from '@react-google-maps/api';
// import { useMemo } from 'react';
// import assertEnv from '@/config/env';

// interface ShowMapProps {
//   latitude: number | undefined;
//   longitude: number | undefined;
//   tooltipText?: string;
// }

// const ShowMap: React.FC<ShowMapProps> = ({ latitude, longitude, tooltipText }) => {
//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: assertEnv.VITE_KEY_SEARCH_GOOGLE,
//   });

//   // Memorizamos las coordenadas para evitar re-renderizados innecesarios
//   const center = useMemo(
//     () => ({
//       lat: latitude ?? 0,
//       lng: longitude ?? 0,
//     }),
//     [latitude, longitude]
//   );

//   const isValid = !isNaN(center.lat) && !isNaN(center.lng) && center.lat !== 0;

//   return (
//     <Box
//       sx={{
//         height: { xs: 200, sm: 300, md: 450 },
//         backgroundColor: '#e0e0e0',
//         borderRadius: 4,
//         overflow: 'hidden',
//         position: 'relative',
//         boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
//       }}
//     >
//       {isLoaded && isValid ? (
//         <GoogleMap
//           mapContainerStyle={{ width: '100%', height: '100%' }}
//           center={center}
//           zoom={15}
//           options={{
//             disableDefaultUI: true,
//             gestureHandling: 'cooperative',
//           }}
//         >
//           <Circle
//             center={center}
//             radius={250}
//             options={{
//               fillColor: '#3b82f6',
//               fillOpacity: 0.15,
//               strokeColor: '#3b82f6',
//               strokeOpacity: 0.4,
//               strokeWeight: 1,
//               clickable: false,
//             }}
//           />
//           <CustomHouseMarker position={center} text={tooltipText || ''} />
//         </GoogleMap>
//       ) : (
//         <Box
//           sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}
//         >
//           <CircularProgress size={24} />
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default ShowMap;

import { Box, CircularProgress } from '@mui/material';
import CustomHouseMarker from './CustomHouseMarker';
import { Circle, GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { useMemo, useCallback } from 'react';
import assertEnv from '@/config/env';

interface ShowMapProps {
  latitude: number | undefined;
  longitude: number | undefined;
  tooltipText?: string;
}

const ShowMap: React.FC<ShowMapProps> = ({ latitude, longitude, tooltipText }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: assertEnv.VITE_KEY_SEARCH_GOOGLE,
  });

  const center = useMemo(
    () => ({
      lat: latitude ?? 0,
      lng: longitude ?? 0,
    }),
    [latitude, longitude]
  );

  const isValid = !isNaN(center.lat) && !isNaN(center.lng) && center.lat !== 0;

  const handleOpenGoogleMaps = useCallback(() => {
    if (isValid) {
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${center.lat},${center.lng}`;
      window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
    }
  }, [isValid, center]);

  return (
    <Box
      sx={{
        height: { xs: 200, sm: 300, md: 450 },
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        cursor: 'pointer',
      }}
      onClick={handleOpenGoogleMaps}
    >
      {isLoaded && isValid ? (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={center}
          zoom={15}
          onClick={handleOpenGoogleMaps}
          options={{
            disableDefaultUI: true,
            gestureHandling: 'cooperative',
          }}
        >
          <Circle
            center={center}
            radius={250}
            onClick={handleOpenGoogleMaps}
            options={{
              fillColor: '#3b82f6',
              fillOpacity: 0.15,
              strokeColor: '#3b82f6',
              strokeOpacity: 0.4,
              strokeWeight: 1,
              clickable: true,
            }}
          />
          {/* Si tu marcador personalizado soporta eventos de clic, también deberías pasárselo */}
          <CustomHouseMarker
            position={center}
            text={tooltipText || ''}
            /* onClick={handleOpenGoogleMaps} // (Descomentar si CustomHouseMarker acepta onClick) */
          />
        </GoogleMap>
      ) : (
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}
        >
          <CircularProgress size={24} />
        </Box>
      )}
    </Box>
  );
};

export default ShowMap;
