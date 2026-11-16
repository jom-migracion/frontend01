import EventIcon from '@mui/icons-material/Event';
import PaymentIcon from '@mui/icons-material/Payment';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CustomDialog from './CustomDialog';

interface CancelStayDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  propertyName: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  currency?: string;
  bookId?: number;
}

const CancelStayDialog: React.FC<CancelStayDialogProps> = ({
  open,
  onClose,
  onConfirm,
  propertyName,
  checkInDate,
  checkOutDate,
  totalAmount,
  currency = 'BOB',
  bookId,
}) => {
  const navigate = useNavigate();

  // const theme = useTheme();
  const { t } = useTranslation();

  const formattedCheckIn = checkInDate
    ? format(new Date(checkInDate), "d 'de' MMM", { locale: es })
    : '-';
  const formattedCheckOut = checkOutDate
    ? format(new Date(checkOutDate), "d 'de' MMM", { locale: es })
    : '-';

  const handleConfirm = () => {
    onConfirm();
    if (bookId) {
      navigate(`/canceled-new-step1/${bookId}`);
    }
  };

  return (
    <CustomDialog isOpen={open} onClose={onClose} maxWidth="sm" title={t('cancelStayDialog.title')}>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mb: 3, fontSize: '0.875rem' }}
      >
        {t('cancelStayDialog.warning')}
        <br />
        {propertyName}.
      </Typography>

      {/* Info card */}
      <Box
        sx={{
          bgcolor: '#f5f5f5',
          borderRadius: 2,
          p: 2.5,
          mb: 3,
        }}
      >
        {/* Check in / Check out */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <EventIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                {t('cancelStayDialog.checkIn')}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                {formattedCheckIn}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <EventIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                {t('cancelStayDialog.checkOut')}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                {formattedCheckOut}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Payment */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <PaymentIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
              {t('cancelStayDialog.paid')}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
            {currency}. {totalAmount.toFixed(2)}
          </Typography>
        </Box>
      </Box>

      {/* Cancel button */}
      <Button fullWidth variant="primary" onClick={handleConfirm}>
        {t('cancelStayDialog.cancelBtn')}
      </Button>
    </CustomDialog>
  );
};

export default CancelStayDialog;
