import { useCallback, useEffect, useRef, useState } from 'react';
import { useLoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import assertEnv from '@/config/env';

type LatLng = { lat: number; lng: number };

type LocationData = {
  latitude: number;
  longitude: number;
  country?: string;
  state?: string;
  county?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
  streetNumber?: string;
  postalCode?: string;
};

export default function BuscadorGoogleMap() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: assertEnv.VITE_KEY_SEARCH_GOOGLE,
    libraries: ['places'],
    language: 'es',
  });

  const [center, setCenter] = useState<LatLng>({ lat: -17.3935, lng: -66.1569 });
  const [zoom, setZoom] = useState<number>(14);
  const [marker, setMarker] = useState<LatLng | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Recuperar datos guardados al cargar el componente
  useEffect(() => {
    const savedLocation = localStorage.getItem('locationData');
    if (savedLocation) {
      const parsed: LocationData = JSON.parse(savedLocation);
      setLocationData(parsed);
      setCenter({ lat: parsed.latitude, lng: parsed.longitude });
      setMarker({ lat: parsed.latitude, lng: parsed.longitude });
    }
  }, []);

  // Guardar automáticamente en localStorage cuando cambie locationData
  useEffect(() => {
    if (locationData) {
      localStorage.setItem('locationData', JSON.stringify(locationData));
    }
  }, [locationData]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const fetchGeocodingData = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${assertEnv.VITE_KEY_SEARCH_GOOGLE}&language=es`
      );
      const data = await response.json();

      if (data.status === 'OK' && data.results[0]) {
        const place = data.results[0];
        const location: LocationData = { latitude: lat, longitude: lng };

        for (const component of place.address_components) {
          const type = component.types[0];
          switch (type) {
            case 'street_number':
              location.streetNumber = component.long_name;
              break;
            case 'route':
              location.street = component.long_name;
              break;
            case 'neighborhood':
              location.neighborhood = component.long_name;
              break;
            case 'locality':
              location.city = component.long_name;
              break;
            case 'administrative_area_level_2':
              location.county = component.long_name;
              break;
            case 'administrative_area_level_1':
              location.state = component.long_name;
              break;
            case 'country':
              location.country = component.long_name;
              break;
            case 'postal_code':
              location.postalCode = component.long_name;
              break;
          }
        }
        setLocationData(location);
      } else {
        setLocationData({ latitude: lat, longitude: lng });
      }
    } catch (error) {
      console.error('Error en geocodificación:', error);
    }
  };

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarker({ lat, lng });
    setCenter({ lat, lng });
    fetchGeocodingData(lat, lng);
  };

  const handlePlaceSearch = () => {
    if (!inputRef.current || !window.google) return;
    const autocomplete = new google.maps.places.Autocomplete(inputRef.current);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry?.location) return;
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setCenter({ lat, lng });
      setMarker({ lat, lng });
      setZoom(17);
      fetchGeocodingData(lat, lng);
      mapRef.current?.panTo({ lat, lng });
    });
  };

  if (loadError) return <Typography color="error">Error cargando Google Maps</Typography>;
  if (!isLoaded) return <Typography>Cargando mapa...</Typography>;

  return (
    <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2} p={2}>
      <Paper sx={{ p: 2, width: { xs: '100%', md: 350 }, overflowY: 'auto' }} elevation={3}>
        <Typography variant="h6" gutterBottom>
          🗺️ Buscador de Ubicaciones
        </Typography>

        <TextField
          inputRef={inputRef}
          onFocus={handlePlaceSearch}
          fullWidth
          variant="outlined"
          placeholder="Buscar dirección, ciudad o lugar..."
        />

        <Box mt={2} display="flex" gap={1}>
          <Button
            variant="outlined"
            onClick={() => {
              setCenter({ lat: -17.3935, lng: -66.1569 });
              setZoom(14);
              setMarker(null);
              setLocationData(null);
              localStorage.removeItem('locationData');
              if (inputRef.current) inputRef.current.value = '';
              mapRef.current?.panTo({ lat: -17.3935, lng: -66.1569 });
            }}
          >
            Resetear
          </Button>
        </Box>

        <Box mt={3}>
          {locationData && (
            <>
              <Typography variant="subtitle1">
                <b>Detalles de Ubicación</b>
              </Typography>
              <Typography variant="body2">
                <b>Lat:</b> {locationData.latitude.toFixed(6)}
              </Typography>
              <Typography variant="body2">
                <b>Lng:</b> {locationData.longitude.toFixed(6)}
              </Typography>
              {locationData.street && (
                <Typography variant="body2">
                  <b>Calle:</b> {`${locationData.street} ${locationData.streetNumber || ''}`}
                </Typography>
              )}
              {locationData.neighborhood && (
                <Typography variant="body2">
                  <b>Barrio:</b> {locationData.neighborhood}
                </Typography>
              )}
              {locationData.city && (
                <Typography variant="body2">
                  <b>Ciudad:</b> {locationData.city}
                </Typography>
              )}
              {locationData.county && (
                <Typography variant="body2">
                  <b>Provincia/Condado:</b> {locationData.county}
                </Typography>
              )}
              {locationData.state && (
                <Typography variant="body2">
                  <b>Dpto./Estado:</b> {locationData.state}
                </Typography>
              )}
              {locationData.country && (
                <Typography variant="body2">
                  <b>País:</b> {locationData.country}
                </Typography>
              )}
              {locationData.postalCode && (
                <Typography variant="body2">
                  <b>Cód. Postal:</b> {locationData.postalCode}
                </Typography>
              )}
            </>
          )}
        </Box>
      </Paper>

      <Box flex={1} sx={{ height: { xs: '50vh', md: '80vh' }, minHeight: 400 }}>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '8px' }}
          center={center}
          zoom={zoom}
          onLoad={onMapLoad}
          onClick={onMapClick}
          options={{
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            zoomControl: true,
          }}
        >
          {marker && <Marker position={marker} />}
          {marker && locationData && (
            <InfoWindow position={marker} onCloseClick={() => setMarker(null)}>
              <Box>
                <Typography variant="subtitle2">
                  {locationData.street || locationData.city || 'Ubicación seleccionada'}
                </Typography>
                <Typography variant="caption">
                  {marker.lat.toFixed(5)}, {marker.lng.toFixed(5)}
                </Typography>
              </Box>
            </InfoWindow>
          )}
        </GoogleMap>
      </Box>
    </Box>
  );
}
