import { useEffect, useState } from 'react';
import { ToggleButtonGroup, ToggleButton, Typography, Box, Link } from '@mui/material';
import ReservationGrid from './books/ReservationGrid';
import { fetchPendingReservations } from '../hooks/useMockReservationService';

import { Reservation } from '../../../models/typeReservation';
import { styled } from '@mui/material/styles';

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  borderRadius: 50,
  padding: '8px 24px',
  margin: '0 8px',
  textTransform: 'none',
  fontWeight: 'bold',
  backgroundColor: '#e0e0e0',
  color: '#000',
  '&.Mui-selected': {
    backgroundColor: '#000',
    color: '#fff',
  },
}));

const ReservationPage = () => {
  const [mode, setMode] = useState<'today' | 'scheduled'>('today');
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    if (mode === 'today') {
      fetchPendingReservations().then(setReservations);
    }
  }, [mode]);

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="center" mt={2}>
        <ToggleButtonGroup value={mode} exclusive onChange={(_, val) => val && setMode(val)}>
          <StyledToggleButton value="today">Hoy</StyledToggleButton>
          <StyledToggleButton value="scheduled">Reservaciones programadas</StyledToggleButton>
        </ToggleButtonGroup>
      </Box>
      {mode === 'today' && (
        <>
          <Typography variant="h5" align="center" mt={3}>
            Tu solicitud
          </Typography>
          <Box display="flex" justifyContent="center" mt={2}>
            <ReservationGrid reservations={reservations} />
          </Box>
        </>
      )}

      {mode === 'scheduled' && <Typography>No tienes ninguna reservación</Typography>}

      <Box display="flex" justifyContent="center" mt={2}>
        <Link href="#">Mostrar todas las reservaciones</Link>
      </Box>
    </Box>
  );
};

export default ReservationPage;
