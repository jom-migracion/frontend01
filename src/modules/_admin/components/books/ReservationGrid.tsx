import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import ReservationCard from './ReservationCard';
import { Reservation } from '../../../../models/typeReservation';

interface Props {
  reservations: Reservation[];
}

export const ReservationGrid: React.FC<Props> = ({ reservations }) => {
  if (reservations.length === 0) {
    return <Typography>No tienes ninguna reservación para aprobar</Typography>;
  }

  return (
    <Grid container spacing={2} display="flex" justifyContent="center">
      {reservations.map((res, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
          <ReservationCard data={res} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ReservationGrid;
