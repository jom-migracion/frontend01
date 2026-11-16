import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { useTranslation } from 'react-i18next';

const SupportSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box mt={8}>
      <Typography sx={{ fontSize: 18, fontWeight: 600, mb: 3 }}>
        {t('reservationPostApproved.support.title')}
      </Typography>
      <Typography sx={{ fontSize: 14, color: '#64748b', mb: 2 }}>
        {t('reservationPostApproved.support.text')}
      </Typography>
      <MuiLink
        component={RouterLink}
        to="/help-center"
        underline="hover"
        sx={{ fontSize: 14, fontWeight: 500, color: '#5B55C8' }}
      >
        {t('reservationPostApproved.support.contactBtn')}
      </MuiLink>
    </Box>
  );
};

export default SupportSection;
