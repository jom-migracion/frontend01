import { Box, Card, CardContent, Typography, useTheme, Chip } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useEffect, useState } from 'react';
import CardRectangle from '../CardRectangle';
import { useStepValidation } from '@/context/FormStepContext';
import { PropertyRegistrationProps_3_4 } from '../../interface/IPropertyRegistrationProps';
import { CancelationPolicyTypes } from '@/models/interfaces/ListingRentResponseStep';
import { usePropertyRegistration } from '@/store/listingRentPropertyRegistration.store';
import { useTranslation } from 'react-i18next';
import AssertModal from '@/components/AssertModal';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';

export const PropertyRegistrationStep_3_4: React.FC<PropertyRegistrationProps_3_4> = ({
  onChange,
}) => {
  // store
  const { cancelationPolicyTypes } = usePropertyRegistration((state) => state.data.parametrics);
  const { cancelationPolicyTypeId } = usePropertyRegistration((state) => state.data.listingData);

  // useState
  const [cancelationPolicy, setCancelationPolicy] = useState<CancelationPolicyTypes>();
  const [openModal, setOpenModal] = useState<boolean>(false);

  // hooks
  const { setStepValid } = useStepValidation();
  const { palette: { customColors }, typography } = useTheme();
  
  // Hook original
  const { t } = useTranslation('translation', { keyPrefix: 'admin.registerProperty.step34' });
  // Nuevo hook para textos faltantes
  const { t: tStep34 } = useTranslation('translation', { keyPrefix: 'PropertyRegistrationStep_3_4' });

  useEffect(() => {
    if (cancelationPolicyTypeId && cancelationPolicyTypes.length > 0 && !cancelationPolicy) {
      const foundCancelationPolicy = cancelationPolicyTypes.find(
        (cance) => cance.cancelationPolicyTypeId === cancelationPolicyTypeId
      );
      if (foundCancelationPolicy) {
        setCancelationPolicy(foundCancelationPolicy);
      }
    }
  }, [cancelationPolicyTypes, cancelationPolicy]);

  useEffect(() => {
    const isValid = !!cancelationPolicy;
    setStepValid(9, isValid); // Notifica al componente padre si es válido o no
    if (cancelationPolicy) {
      onChange({
        step3_4: { cancelPolicyTypeId: cancelationPolicy.cancelationPolicyTypeId },
      });
    }
  }, [cancelationPolicy, setStepValid, onChange]);

  return (
    <React.Fragment>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1} columns={10}>
          <Grid size={{ md: 8, xs: 16 }}>
            <Card sx={{ height: '100%', boxSizing: 'border-box', width: '100%', boxShadow: 'none', mt: '16px', bgcolor:'#f8f9fc' }}>
              <Box sx={{ mb: 1, mt:-1 }}>
                <Typography sx={{ fontSize: '1.5rem', mb: 1.5, fontWeight: 600, color: '#222222', lineHeight: '2rem' }}>
                  {tStep34('pageTitle', { defaultValue: 'Política de cancelación JOM' })}
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.5, mb: 2 }}>
                  {tStep34('pageSubtitle', { defaultValue: 'JOM aplica una política única para garantizar transparencia y seguridad tanto para anfitriones como para huéspedes.' })}
                </Typography>
              </Box>
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  flexDirection: 'column',
                  p: 0,
                  width: '100%',
                  gap: 2,
                }}
              >
                {cancelationPolicyTypes.map((cancel) => (
                  <CardRectangle
                    key={cancel.cancelationPolicyTypeId}
                    title={cancel.name}
                    description={cancel.detail1}
                    onClick={() => setCancelationPolicy(cancel)}
                    selected={cancel?.cancelationPolicyTypeId === cancelationPolicy?.cancelationPolicyTypeId}
                    bgColor={
                      cancel?.cancelationPolicyTypeId == cancelationPolicy?.cancelationPolicyTypeId
                        ? customColors.lights[3]
                        : ''
                    }
                  />
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      
      {/* Componente de Cronograma unificado */}
      <Box sx={{ mt: 4, mb: 4 }}>
        <Card
          variant="outlined"
          sx={{
            maxWidth: 640,
            p: 3,
            borderRadius: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          {/* Título y subtítulo */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>
                {t('timelineTitle') || tStep34('timelineTitle', { defaultValue: 'Esquema de política JOM' })}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#d1fae5' }} />
                  <Typography sx={{ fontSize: '13px', color: '#6b7280' }}>
                    {t('refundable') || tStep34('refundable', { defaultValue: 'Reembolsable' })}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#E0E0E0' }} />
                  <Typography sx={{ fontSize: '13px', color: '#6b7280' }}>
                    {t('protected') || tStep34('protected', { defaultValue: 'Protegido' })}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Typography sx={{ fontSize: '13px', color: '#6b7280' }}>
              {t('timelineSubtitle') || tStep34('timelineSubtitle', { defaultValue: 'Regla fija: 5 días antes del check-in marca el cambio de cobertura.' })}
            </Typography>
          </Box>

          {/* Línea de tiempo */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{  fontSize: '0.75rem', fontWeight: 600 }}>
                {t('reservation') || tStep34('reservation', { defaultValue: 'Reserva' })}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600}}>
                {t('checkIn') || tStep34('checkIn', { defaultValue: 'Check-in' })}
              </Typography>
            </Box>
            
            {/* Barra de progreso */}
            <Box sx={{ position: 'relative', height: 8, backgroundColor: '#E0E0E0', borderRadius: 1 }}>
              <Box 
                sx={{ 
                  position: 'absolute', 
                  left: 0, 
                  height: '100%', 
                  width: '57%', 
                  backgroundColor: '#d1fae5', 
                  borderRadius: 1 
                }} 
              />
              <Chip
                label={t('daysBeforeLabel') || tStep34('daysBeforeLabel', { defaultValue: '5 días antes' })}
                size="small"
                sx={{
                  position: 'absolute',
                  top: -28,
                  left: '58%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#5b55c8',
                  color: '#fff',
                  fontFamily: typography.small1Regular,
                  fontSize: '12px',
                  height: 24,
                }}
              />
            </Box>
          </Box>

          {/* Cards de reembolso e ingresos */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: '#d1fae580',
                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 20, color: '#4DB8A8' }} />
                  <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: '#047857' }}>
                    {t('totalRefund') || tStep34('totalRefund', { defaultValue: 'Reembolso total' })}
                  </Typography>
                </Box>
                <Typography sx={{  fontSize: '13px', color: '#047857', lineHeight: 1.5 }}>
                  {t('totalRefundDescription') || tStep34('totalRefundDescription', { defaultValue: 'Si el huésped cancela antes de este límite, recibe el monto total (menos comisiones de Pasarela de pagos).' })}
                </Typography>
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: '#F5F5F5',
                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <SecurityOutlinedIcon sx={{ fontSize: 20 }} />
                  <Typography sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
                    {t('protectedIncome') || tStep34('protectedIncome', { defaultValue: 'Ingresos protegidos' })}
                  </Typography>
                </Box>
                <Typography sx={{  fontSize: '13px',  lineHeight: 1.5 }}>
                  {t('protectedIncomeDescription') || tStep34('protectedIncomeDescription', { defaultValue: 'Sin reembolso para el huésped. El pago del anfitrión está asegurado por la plataforma.' })}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          </Card>
      </Box>

      <AssertModal
        title={tStep34('modalTitle', { defaultValue: 'Políticas de cancelación para tu alojamiento' })}
        content={tStep34('modalContent', { defaultValue: 'Flexible\nLos huéspedes pueden cancelar hasta 24 horas antes del check-in para recibir un reembolso total incluidos los impuestos, y tú no recibirás ningún pago.\nSi lo hacen después de ese plazo, recibirán un reembolso de los impuestos prorrateados, y tú recibirás el monto correspondiente a las noches que se queden, más una noche adicional.' })}
        open={openModal}
        showCloseLeft={false}
        onClose={() => setOpenModal(false)}
        rightIcon={<CloseIcon />}
        showRightIcon={true}
      />
    </React.Fragment>
  );
};