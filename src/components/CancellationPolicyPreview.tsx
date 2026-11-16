import React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

interface CancellationPolicyPreviewProps {
  detail1?: string | null;
  onReadMore: () => void;
}

const CancellationPolicyPreview: React.FC<CancellationPolicyPreviewProps> = ({
  detail1,
  onReadMore,
}) => {
  const { t } = useTranslation();

  return (
    <Box mt={8}>
      <Typography sx={{ fontSize: 18, fontWeight: 600, mb: 3 }}>
        {t('reservationPostApproved.reservationDetails.cancelPolicyTitle')}
      </Typography>
      <Typography sx={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>
        {detail1 || t('reservationPostApproved.reservationDetails.noCancelInfo')}
      </Typography>
      <Link
        href="#"
        underline="hover"
        sx={{
          mt: 2,
          display: 'inline-block',
          fontSize: 14,
          fontWeight: 500,
          color: '#5B55C8',
        }}
        onClick={(e) => {
          e.preventDefault();
          onReadMore();
        }}
      >
        {t('reservationPostApproved.reservationDetails.readMore')}
      </Link>
    </Box>
  );
};

export default CancellationPolicyPreview;
