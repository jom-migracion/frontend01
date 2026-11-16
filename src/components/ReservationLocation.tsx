import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ShowMap from '@/components/ShowMap';

interface ReservationLocationProps {
  latitude?: number;
  longitude?: number;
}

const ReservationLocation: React.FC<ReservationLocationProps> = ({ latitude, longitude }) => {
  const { t } = useTranslation();

  return (
    <Box mt={8}>
      <Typography sx={{ fontSize: 18, fontWeight: 600, mb: 3 }}>
        {t('reservationPostApproved.location.title')}
      </Typography>
      <ShowMap latitude={latitude} longitude={longitude} />
    </Box>
  );
};

export default ReservationLocation;
