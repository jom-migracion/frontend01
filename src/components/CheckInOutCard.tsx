import React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

interface CheckInOutCardProps {
  checkin?: string | null;
  checkout?: string | null;
}

const CheckInOutCard: React.FC<CheckInOutCardProps> = ({ checkin, checkout }) => {
  const { t } = useTranslation();

  const formatDate = (date?: string | null) =>
    date ? format(new Date(date), 'EEE, d MMM', { locale: es }) : '-';

  const formatTime = (date?: string | null) => (date ? format(new Date(date), 'HH:mm') : '-');

  return (
    <Box
      mt={3}
      p={2}
      sx={{
        bgcolor: '#F8F9FC',
        border: '1px solid #e2e8f0',
        borderRadius: 4,
        display: 'grid',
        gridTemplateColumns: '1fr 1px 1fr',
        gap: 2,
      }}
    >
      <Box>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#64748b', mb: 0.5 }}>
          {t('reservationPostApproved.checkInOut.arrival')}
        </Typography>
        <Typography sx={{ fontWeight: 600 }}>{formatDate(checkin)}</Typography>
        <Typography sx={{ fontSize: 14, color: '#64748b' }}>{formatTime(checkin)}</Typography>
      </Box>

      <Divider orientation="vertical" sx={{ bgcolor: '#e2e8f0' }} />

      <Box>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#64748b', mb: 0.5 }}>
          {t('reservationPostApproved.checkInOut.departure')}
        </Typography>
        <Typography sx={{ fontWeight: 600 }}>{formatDate(checkout)}</Typography>
        <Typography sx={{ fontSize: 14, color: '#64748b' }}>{formatTime(checkout)}</Typography>
      </Box>
    </Box>
  );
};

export default CheckInOutCard;
