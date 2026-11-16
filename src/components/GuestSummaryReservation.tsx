import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface GuestSummaryReservationProps {
  adultCount?: number;
  childCount?: number;
  infantCount?: number;
  petCount?: number;
}

const GuestSummaryReservation: React.FC<GuestSummaryReservationProps> = ({
  adultCount = 0,
  childCount = 0,
  infantCount = 0,
  petCount = 0,
}) => {
  const { t } = useTranslation();

  const guestsText = [
    adultCount > 0
      ? `${adultCount} ${adultCount === 1 ? t('reservationCommon.guests.adult') : t('reservationCommon.guests.adults')}`
      : null,
    childCount > 0
      ? `${childCount} ${childCount === 1 ? t('reservationCommon.guests.child') : t('reservationCommon.guests.children')}`
      : null,
    infantCount > 0
      ? `${infantCount} ${infantCount === 1 ? t('reservationCommon.guests.infant') : t('reservationCommon.guests.infants')}`
      : null,
    petCount > 0
      ? `${petCount} ${petCount === 1 ? t('reservationCommon.guests.pet') : t('reservationCommon.guests.pets')}`
      : null,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Box mt={8}>
      <Typography sx={{ fontSize: 18, fontWeight: 600, mb: 3 }}>
        {t('reservationPostApproved.reservationDetails.title')}
      </Typography>
      <Typography sx={{ fontWeight: 500, mb: 0.5 }}>
        {t('reservationPostApproved.reservationDetails.whoAccompanies')}
      </Typography>
      {guestsText && (
        <Typography sx={{ fontSize: 14, color: '#64748b', mt: 1 }}>{guestsText}</Typography>
      )}
    </Box>
  );
};

export default GuestSummaryReservation;
