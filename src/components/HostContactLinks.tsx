import React from 'react';
import { Box, Link, Typography } from '@mui/material';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { useTranslation } from 'react-i18next';

interface HostContactLinksProps {
  ownerName: string;
  listingName?: string | null;
  listingId?: number | null;
  onMessageClick: () => void;
}

const HostContactLinks: React.FC<HostContactLinksProps> = ({
  ownerName,
  listingName,
  listingId,
  onMessageClick,
}) => {
  const { t } = useTranslation();

  return (
    <Box mt={8}>
      <Box display="flex" gap={2}>
        <MessageOutlinedIcon sx={{ fontSize: 20, color: '#6B7280' }} />
        <Box>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#64748b', mb: 2 }}>
            {t('reservationPostApproved.hostInfo.messageHost')}
          </Typography>
          <Link
            component="button"
            onClick={onMessageClick}
            underline="hover"
            sx={{ fontSize: 14, fontWeight: 500, color: '#5B55C8' }}
          >
            {ownerName}
          </Link>
        </Box>
      </Box>

      <Box display="flex" gap={2} mt={2}>
        <HomeOutlinedIcon sx={{ fontSize: 20, color: '#6B7280' }} />
        <Box>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#64748b', mb: 1 }}>
            {t('reservationPostApproved.hostInfo.accommodation')}
          </Typography>
          <Link
            href={`/detail/${listingId}`}
            underline="hover"
            sx={{ fontSize: 14, fontWeight: 500, color: '#5B55C8' }}
          >
            {listingName}
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default HostContactLinks;
