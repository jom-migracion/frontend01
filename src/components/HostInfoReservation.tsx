import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface HostInfoReservationProps {
  owner?: {
    name?: string;
    lastName?: string;
    photoLink?: string;
  } | null;
  liveAtShow?: string | null;
  listingName?: string | null;
}

const HostInfoReservation: React.FC<HostInfoReservationProps> = ({
  owner,
  liveAtShow,
  listingName,
}) => {
  const { t } = useTranslation();

  return (
    <Box mt={3}>
      {listingName && (
        <Typography variant="h5" fontWeight="bold">
          {listingName}
        </Typography>
      )}
      <Box display="flex" alignItems="center" mt={2}>
        <Avatar src={owner?.photoLink} alt={owner?.name || 'Host'} sx={{ mr: 2 }} />
        <Box>
          <Typography fontWeight="bold">
            {`${owner?.name || ''} ${owner?.lastName || ''}`.trim()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {liveAtShow ?? t('reservationCommon.noInfo')}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default HostInfoReservation;
