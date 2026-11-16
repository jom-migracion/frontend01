import ReservationInfoProps from '@/models/interfaces/ReservationInfoProps';
import { useConvertReservationStore } from '@/store/message.store';
import { Box, Typography, Link, Avatar /*, Divider*/ } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTranslation } from 'react-i18next';
import { Link as Link2 } from 'react-router-dom';

const ReservationInfo: React.FC<ReservationInfoProps> = ({
  arrivalDate,
  departureDate,
  guests,
  totalCost,
  currency,
  hostName,
  hostLocation,
  hostImage,
  user,
  listingId,
  conversationId,
  onWriteMessage,
}) => {
  const { t } = useTranslation();
  
  // store
  const setStateConversationId = useConvertReservationStore(
    (state: any) => state.setStateConversationId
  );

  return (
    <Box sx={{ padding: 2, borderRadius: 6 }}>
      <Grid container alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 9 }}>
          <Typography variant="h5" fontWeight="bold">
            {hostName}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {hostLocation}
          </Typography>
          <Box mt={1}>
            <Link2
              to={`/host/show-profile-guest/${user}/${listingId}`}
              target="_blank"
              style={{ textDecoration: 'none' }}
            >
              <Link underline="hover" sx={{ fontSize: 14, fontWeight: 500, color: '#5B55C8' }}>
                {t('reservationRequest.details.showProfile')}
              </Link>
            </Link2>
            <Link
              href="#"
              underline="hover"
              sx={{ ml: 2, fontSize: 14, fontWeight: 500, color: '#5B55C8' }}
              onClick={(event) => {
                event.preventDefault();
                setStateConversationId(conversationId|| null);
                onWriteMessage?.();
              }}
            >
              {t('reservationInfo.writeMessage')}
            </Link>
          </Box>
        </Grid>
        <Grid size={{ xs: 3 }}>
          <Avatar src={hostImage} alt={hostName} sx={{ width: 64, height: 64 }} />
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Grid container justifyContent="space-between" mb={1}>
          <Grid>
            <Typography variant="body1">{t('reservationInfo.arrival')}</Typography>
          </Grid>
          <Grid>
            <Typography variant="body1" fontWeight="bold">
              {arrivalDate}
            </Typography>
          </Grid>
        </Grid>

        <Grid container justifyContent="space-between" mb={1}>
          <Grid>
            <Typography variant="body1">{t('reservationInfo.departure')}</Typography>
          </Grid>
          <Grid>
            <Typography variant="body1" fontWeight="bold">
              {departureDate}
            </Typography>
          </Grid>
        </Grid>

        <Grid container justifyContent="space-between" mb={1}>
          <Grid>
            <Typography variant="body1">{t('reservationInfo.totalGuests')}</Typography>
          </Grid>
          <Grid>
            <Typography variant="body1" fontWeight="bold">
              {/* {guests} {guests === 1 ? 'adulto' : 'adultos'} */}
              {t('reservationInfo.guestCount', { count: guests })}
            </Typography>
          </Grid>
        </Grid>

        <Grid container justifyContent="space-between" mb={1}>
          <Grid>
            <Typography variant="body1">{t('reservationInfo.totalCost')}</Typography>
          </Grid>
          <Grid>
            <Typography variant="body1" fontWeight="bold">
              {currency} {totalCost}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ReservationInfo;
