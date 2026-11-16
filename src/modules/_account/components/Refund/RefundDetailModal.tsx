import React from 'react';
import { Typography, Box, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { RefundTransaction } from './RefundsTab';
import CustomDialog from '@/components/CustomDialog';

interface RefundDetailModalProps {
  open: boolean;
  onClose: () => void;
  refundData: RefundTransaction | null;
}

const RefundDetailModal: React.FC<RefundDetailModalProps> = ({ open, onClose, refundData }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  if (!refundData) return null;

  const currencySymbol = refundData.bookingCurrency === 'BOB' ? 'Bs.' : (refundData.bookingCurrency ?? '');
  const montoSeguro = refundData.boookingAmount ?? null;

  return (
    <CustomDialog 
        isOpen={open} 
        onClose={onClose} 
        maxWidth="sm" 
        title={t('accountSettings.refundsAndPenalties.modal.title', { defaultValue: 'Detalle de liquidación' })}
    >
      <Box sx={{ p: { xs: 1, sm: 2 } }}>
        {/* Subtítulo (ID Transacción / Reserva) */}
        <Typography 
            variant="paragraph1Medium" 
            sx={{ color: theme.palette.text.secondary, mb: 3 }}
        >
          {t('accountSettings.refundsAndPenalties.modal.transaction', { defaultValue: 'Transacción:' })} {refundData.refundId ?? 'null'} | {t('accountSettings.refundsAndPenalties.modal.booking', { defaultValue: 'Reserva:' })} {refundData.bookId ?? 'null'}
        </Typography>

        {/* Información General */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '5fr 7fr',
            gap: 1.5,
            mb: 3,
            mt: 1
          }}
        >
          <Typography variant="paragraph1Medium" sx={{ color: theme.palette.text.secondary }}>
            {t('accountSettings.refundsAndPenalties.modal.property', { defaultValue: 'Propiedad:' })}
          </Typography>
          <Typography variant="paragraph1Regular" sx={{ color: theme.palette.text.primary }}>
              {refundData.propertyName ?? 'null'}
          </Typography>

          <Typography variant="paragraph1Medium" sx={{ color: theme.palette.text.secondary }}>
            {t('accountSettings.refundsAndPenalties.modal.reason', { defaultValue: 'Motivo / Concepto:' })}
          </Typography>
          <Typography variant="paragraph1Regular" sx={{ color: theme.palette.text.primary }}>
              {refundData.reasonOfOperation ?? 'null'}
          </Typography>

          <Typography variant="paragraph1Medium" sx={{ color: theme.palette.text.secondary }}>
            {t('accountSettings.refundsAndPenalties.modal.account', { defaultValue: 'Cuenta de destino:' })}
          </Typography>
          <Typography variant="paragraph1Regular" sx={{ color: theme.palette.text.primary }}>
              {refundData.payoutAccount?.numberAccount ?? 'null'}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed', my: 2, borderColor: theme.palette.neutralBorder || theme.palette.divider }} />

        {/* Desglose */}
        <Box sx={{ my: 3 }}>
          <Box display="flex" justifyContent="space-between" mb={1.5}>
            <Typography variant="paragraph1Regular">
                {t('accountSettings.refundsAndPenalties.modal.bookingAmount', { defaultValue: 'Monto de la reserva' })} ({refundData.bookingNights ?? 'null'} {t('accountSettings.refundsAndPenalties.modal.night', { defaultValue: 'noches' })})
            </Typography>
            <Typography variant="paragraph1Medium">
                {montoSeguro != null ? `${currencySymbol} ${montoSeguro.toFixed(2)}` : 'null'}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={1.5}>
            <Typography variant="paragraph1Regular" sx={{ color: theme.palette.text.secondary }}>
              (-) {t('accountSettings.refundsAndPenalties.modal.nightsAffected', { defaultValue: 'Noches afectadas' })} ({refundData.breakdown?.nigthsAffecteds ?? 'null'} {t('accountSettings.refundsAndPenalties.modal.night', { defaultValue: 'noches' })})
            </Typography>
            <Typography variant="paragraph1Medium" sx={{ color: theme.palette.text.secondary }}>
                - {currencySymbol} {refundData.breakdown?.nigthsAffecteds ?? 'null'}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={3}>
            <Typography variant="small1Medium" sx={{ color: theme.palette.text.secondary, fontStyle: 'italic', maxWidth: '80%' }}>
              {t('accountSettings.refundsAndPenalties.modal.note', { defaultValue: 'Nota:' })} {refundData.breakdown?.note ?? 'null'}
            </Typography>
          </Box>

          {/* Tarjeta de Total */}
          <Box 
            sx={{ 
                //bgcolor: theme.palette.customColors.success[4],
                bgcolor: theme.palette.customColors.primary[7],
                p: 2, 
                borderRadius: 2, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
            }}
          >
            {/* <Typography variant="paragraph1Bold" sx={{ color: theme.palette.customColors.success[7] }}> */}
            <Typography variant="paragraph1Bold" sx={{ color: theme.palette.customColors.primary[1] }}>
              {t('accountSettings.refundsAndPenalties.modal.total', { defaultValue: 'TOTAL REEMBOLSADO NETO:' })}
            </Typography>
            <Typography 
              sx={{ 
                fontFamily: theme.typography.h4Bold, 
                //color: theme.palette.customColors.success[7],
                color: theme.palette.customColors.primary[1]
              }}
            >
              {currencySymbol} {refundData.amount ?? 'null'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default RefundDetailModal;