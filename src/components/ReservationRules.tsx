import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SectionReservationDialog from '@/components/SectionReservationDialog';

interface ReservationRulesProps {
  rentRules?: any[];
}

const ReservationRules: React.FC<ReservationRulesProps> = ({ rentRules = [] }) => {
  const { t } = useTranslation();

  return (
    <Box mt={8}>
      <Typography sx={{ fontSize: 18, fontWeight: 600, mb: 3 }}>
        {t('reservationPostApproved.rules.title')}
      </Typography>
      <SectionReservationDialog
        title={t('bookingCard.houseRules.title')}
        content={rentRules}
        emptyMessage={t('bookingCard.houseRules.empty')}
      />
    </Box>
  );
};

export default ReservationRules;
