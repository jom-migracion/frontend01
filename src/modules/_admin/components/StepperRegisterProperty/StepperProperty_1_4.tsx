import { Box, Card, CardContent, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import StepperWrapperLinear from './StepperWrapperLinear';
import StepperWrapperProps from '@/models/interfaces/StepperWrapperProps';
import PropertyCardStep from './PropertyCardStep';
import { useForm } from 'react-hook-form';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import assertEnv from '@/config/env';
import { useCallback, useState } from 'react';
import { useSnackbar } from '@/context/SnackbarContext';

interface Position {
  lat: number;
  lng: number;
}

const StepperProperty_1_4: React.FC<StepperWrapperProps> = ({
  stepsCount,
  activeStep,
  step,
  onSubmit,
  prefillData,
}) => {
  const { handleSubmit } = useForm({ defaultValues: prefillData, mode: 'onChange' });
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const showSnackbar = useSnackbar();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: assertEnv.VITE_KEY_GOOGLE_MAP,
    language: 'es',
  });

  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return;

    const newPosition: Position = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    setSelectedPosition(newPosition);
  }, []);

  const internalSubmit = () => {
    if (!selectedPosition) {
      showSnackbar('Por favor selecciona su ubicacion', 'info');
    } else {
      onSubmit && onSubmit(selectedPosition);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <form key={step} onSubmit={onSubmit ? handleSubmit(internalSubmit) : undefined}>
        <Grid container spacing={1} columns={16} sx={{ mt: 10 }}>
          <Grid size={{ md: 8, xs: 16 }}>
            <PropertyCardStep step={step} activeStep={activeStep} />
          </Grid>
          <Grid size={{ md: 8, xs: 16 }}>
            <Card
              sx={{ height: '100%', boxSizing: 'border-box', width: '100%', boxShadow: 'none' }}
            >
              <Typography sx={{ mt: 1, ml: 4, mr: 20, fontWeight: 600, fontSize: '20px' }}>
                Confirma tu dirección
              </Typography>
              <Typography
                sx={{ ml: 4, mr: 5, fontWeight: 300, fontSize: '15px', color: '#000000' }}
              >
                Deja en claro a los huespedes dónde se encuentra tu espacio. Solo les daremos tu
                dirección una vez realizada la reserva.
              </Typography>
              <CardContent sx={{ width: '580px' }}>
                {isLoaded && (
                  <GoogleMap
                    onClick={handleMapClick}
                    mapContainerStyle={{ width: '100%', height: '300px' }}
                    center={selectedPosition || { lat: -17.786, lng: -63.181 }}
                    zoom={14}
                  >
                    {selectedPosition && <Marker position={selectedPosition} />}
                  </GoogleMap>
                )}
              </CardContent>
            </Card>
            <Grid sx={{ ml: 3, width: '80%' }}>
              <StepperWrapperLinear stepsCount={stepsCount} activeStep={activeStep} />
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
export default StepperProperty_1_4;
