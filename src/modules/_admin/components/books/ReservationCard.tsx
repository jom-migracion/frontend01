import { Card, CardContent, Avatar, Typography, Box, Stack } from '@mui/material';
import { Reservation } from '../../../../models/typeReservation';
import { differenceInHours } from 'date-fns';

interface Props {
  data: Reservation;
}

const ReservationCard: React.FC<Props> = ({ data }) => {
  const remainingHours = differenceInHours(new Date(data.timeDateApprovalRequest), new Date());

  return (
    <Card elevation={3} sx={{ borderRadius: 2, transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
      <CardContent>
        <Box sx={{ backgroundColor: '#FFEB3B', padding: '4px 8px', borderRadius: 1, mb: 1 }}>
          <Typography variant="body2">Quedan: {remainingHours} horas</Typography>
        </Box>
        <Stack alignItems="center" spacing={1}>
          <Avatar src={data.profileImageUrl} sx={{ width: 56, height: 56 }} />
          <Typography variant="body2">
            Solicitud de reserva {data.reservationStartDates} - {data.reservationEndDates}
          </Typography>
          <Typography variant="subtitle2">{data.listingName}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ReservationCard;
