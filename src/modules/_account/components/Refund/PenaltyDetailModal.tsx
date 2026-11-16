import React from 'react';
import { Typography, Box, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { PenaltyTransaction } from './PenaltiesTab';
import CustomDialog from '@/components/CustomDialog';

interface PenaltyDetailModalProps {
  open: boolean;
  onClose: () => void;
  penaltyData: PenaltyTransaction | null;
}

const PenaltyDetailModal: React.FC<PenaltyDetailModalProps> = ({ open, onClose, penaltyData }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  
  if (!penaltyData) return null;

  const currencySymbol = penaltyData.bookingCurrency === 'BOB' ? 'Bs.' : penaltyData.bookingCurrency === 'USD' ? '$' : (penaltyData.bookingCurrency || '');

  return (
    <CustomDialog 
        isOpen={open} 
        onClose={onClose} 
        maxWidth="sm" 
        title={t('accountSettings.refundsAndPenalties.penalties.modal.title', { defaultValue: 'Detalle de penalización aplicada' })}
    >
      <Box sx={{ p: { xs: 1, sm: 2 } }}>
        {/* Subtítulo */}
        <Typography 
            variant="paragraph1Medium" 
            sx={{ color: theme.palette.text.secondary, mb: 3 }}
        >
          {t('accountSettings.refundsAndPenalties.penalties.modal.penalty', { defaultValue: 'ID Penalización:' })} {penaltyData.penaltyId ?? 'N/A'} | {t('accountSettings.refundsAndPenalties.penalties.modal.status', { defaultValue: 'Estado:' })} {penaltyData.penaltyStatus ?? 'Desconocido'}
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
            {t('accountSettings.refundsAndPenalties.penalties.modal.propertyAffected', { defaultValue: 'Propiedad afectada:' })}
          </Typography>
          <Typography variant="paragraph1Regular" sx={{ color: theme.palette.text.primary }}>
              {penaltyData.propertyName ?? 'N/A'}
          </Typography>

          <Typography variant="paragraph1Medium" sx={{ color: theme.palette.text.secondary }}>
            {t('accountSettings.refundsAndPenalties.penalties.modal.resolution', { defaultValue: 'Resolución de Soporte:' })}
          </Typography>
          <Typography variant="paragraph1Regular" sx={{ color: theme.palette.text.primary }}>
              {penaltyData.concept ?? 'No provisto por sistema'}
          </Typography>

          <Typography variant="paragraph1Medium" sx={{ color: theme.palette.text.secondary }}>
            {t('accountSettings.refundsAndPenalties.penalties.modal.action', { defaultValue: 'Acción del sistema:' })}
          </Typography>
          <Typography variant="paragraph1Medium" sx={{ color: theme.palette.customColors.error[7] }}>
            {penaltyData.mechanism ?? 'N/A'}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed', my: 2, borderColor: theme.palette.neutralBorder || theme.palette.divider }} />

        {/* Desglose Financiero */}
        <Box sx={{ my: 3 }}>
          <Box display="flex" justifyContent="space-between" mb={1.5}>
            <Typography variant="paragraph1Regular" color="text.primary">
              {t('accountSettings.refundsAndPenalties.penalties.modal.bookingAmount', { defaultValue: 'Monto base de reserva afectada' })} ({penaltyData.bookId ?? 'N/A'})
            </Typography>
            <Typography variant="paragraph1Medium">
              {penaltyData.baseAmount != null ? `${currencySymbol} ${penaltyData.baseAmount.toFixed(2)}` : 'N/A'}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={3}>
            <Typography variant="small1Medium" sx={{ color: theme.palette.text.secondary, maxWidth: '100%' }}>
              (x) {penaltyData.calculationNote ?? 'N/A'}
            </Typography>
          </Box>

          {/* Total Deuda */}
          <Box
            sx={{
              bgcolor: theme.palette.customColors.primary[7],
              //bgcolor: theme.palette.customColors.error[1],
              p: 2,
              borderRadius: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="paragraph1Bold" sx={{ color: theme.palette.customColors.primary[1] }}>
            {/* <Typography variant="paragraph1Bold" sx={{ color: theme.palette.customColors.error[7] }}> */}
              {t('accountSettings.refundsAndPenalties.penalties.modal.total', { defaultValue: 'TOTAL DEUDA A LIQUIDAR' })}
            </Typography>
            <Typography 
                sx={{ 
                    fontFamily: theme.typography.h4Bold, 
                    color: theme.palette.customColors.primary[1]
                    //color: theme.palette.customColors.error[7]
                }}
            >
              {penaltyData.penaltyAmount != null ? `${currencySymbol} ${penaltyData.penaltyAmount.toFixed(2)}` : 'N/A'}
            </Typography>
          </Box>
        </Box>
        
      </Box>
    </CustomDialog>
  );
};

export default PenaltyDetailModal;