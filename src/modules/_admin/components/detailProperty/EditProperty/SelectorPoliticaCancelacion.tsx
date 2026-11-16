import { useGet, usePut } from '@/hooks/api';
import { CancelationPolicyTypes } from '@/models/interfaces/ListingRentResponseStep';
import { Box, Card, CardContent, Typography, useTheme, Chip, Button, Divider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CardRectangle from '../../CardRectangle';
import LoadingThreeDotsJumping from '@/components/LoadingThreeDotsJumping';
import { useSnackbar } from '@/context/SnackbarContext';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid2';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';

const SelectorPoliticaCancelacion: React.FC<{
  listingRentId: number;
  selectedPolicyId?: number;
}> = ({ listingRentId, selectedPolicyId }) => {

  const [cancelationPolicy, setCancelationPolicy] = useState<CancelationPolicyTypes>();

  // api
  const { data: ParamListingRentCancellationPolicies, isLoading } = useGet<CancelationPolicyTypes[]>(
    'ParamListingRentCancellationPolicies',
    '/Parametrics/CancellationPolicies'
  );

  const { mutate: UpdateCancellationPolicy, isPending } = usePut(
    `/Host/ListingRent/${listingRentId}/UpdateCancellationPolicy?cancellationPolicyId=${cancelationPolicy?.cancelationPolicyTypeId}`
  );

  // functions
  const handleSubmit = async () => {
    UpdateCancellationPolicy(
      {},
      {
        onSuccess: (response) => {
          const { statusCode, resultError } = response;

          if (statusCode === '200') {
            showSnackbar('update', 'success');
          } else {
            showSnackbar(resultError?.message, 'error');
          }
        },
        onError: (error) => {
          showSnackbar(error?.message, 'error');
        },
      }
    );
  };

  // hooks
  const {
    palette: { customColors, primary },
    typography,
  } = useTheme();
  const showSnackbar = useSnackbar();
  const { t: tStep34 } = useTranslation('translation', { keyPrefix: 'PropertyRegistrationStep_3_4' });
  const { t } = useTranslation('translation', { keyPrefix: 'admin.registerProperty.step34' });
  const { t: tcommon } = useTranslation();

  useEffect(() => {
    if (selectedPolicyId && !cancelationPolicy && ParamListingRentCancellationPolicies?.data) {
      const foundCancelationPolicy = ParamListingRentCancellationPolicies.data.find(
        (cance) => cance.cancelationPolicyTypeId === selectedPolicyId
      );
      if (foundCancelationPolicy) {
        setCancelationPolicy(foundCancelationPolicy);
      }
    }
  }, [selectedPolicyId, cancelationPolicy, ParamListingRentCancellationPolicies]);

  return (
    <>
      {<LoadingThreeDotsJumping open={isPending} modal={true} />}
        <Typography
          fontWeight="600"
          sx={{ fontSize: '18px', mb: 3, color: '#222', mt: -1.5, ml: 0 }}
        >
          {tcommon('admin.editProperty.10.title')}
        </Typography>
        <Divider sx={{ mx: -10, my: -1.9 }} />
      <Box
        sx={{
          py: 1,
          maxWidth: '90%',
          mt: 3
        }}
      >
        <Typography mb={2} sx={{fontSize: '16px', fontWeight: 600}}>
          {tStep34('pageTitle', { defaultValue: 'Política de cancelación JOM' })}
        </Typography>
          <Typography
            sx={{ fontSize: '13px', color: '#6b7280' }}
          >
            {tStep34('pageSubtitle', { defaultValue: 'JOM aplica una política única para garantizar transparencia y seguridad tanto para anfitriones como para huéspedes.' })}
          </Typography>
        <CardContent
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            width: '100%',
            p: 0,
            mt:1,
            gap: 2,
          }}
        >
          {isLoading ? (
            <Box sx={{ mt: 10 }}>
              <LoadingThreeDotsJumping />
            </Box>
          ) : (
            ParamListingRentCancellationPolicies?.data &&
            ParamListingRentCancellationPolicies.data.map((cancel) => (
              <CardRectangle
                key={cancel.cancelationPolicyTypeId}
                title={cancel.name}
                description={cancel.detail1}
                onClick={() => setCancelationPolicy(cancel)}
                bgColor={
                  cancel?.cancelationPolicyTypeId == cancelationPolicy?.cancelationPolicyTypeId
                    ? primary.main
                    : ''
                }
                textColorTitle={
                  cancel?.cancelationPolicyTypeId == cancelationPolicy?.cancelationPolicyTypeId
                    ? customColors.lights[4]
                    : customColors.primary[1]
                }
                selected={cancel?.cancelationPolicyTypeId == cancelationPolicy?.cancelationPolicyTypeId}  
              />
            ))
          )}
        </CardContent>

        <Box sx={{ mt: 4, mb: 4, width: '100%' }}>
          <Card
            variant="outlined"
            sx={{
              width: '100%',
              p: 3,
              borderRadius: 3,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            {/* Título y subtítulo */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>
                  {tcommon('admin.editProperty.10.schemaTitle')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#d1fae5' }} />
                    <Typography sx={{ fontSize: '13px', color: '#6b7280' }}>
                      {t('refundable') || 'Reembolsable'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#E0E0E0' }} />
                    <Typography sx={{ fontSize: '13px', color: '#6b7280' }}>
                      {t('protected') || 'Protegido'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Typography sx={{ fontSize: '13px', color: '#6b7280' }}>
                {tcommon('admin.editProperty.10.rule')}
              </Typography>
            </Box>

            {/* Línea de tiempo */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  {tcommon('admin.editProperty.10.reserve')}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  {tcommon('admin.editProperty.10.checkIn')}
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
                  label={tcommon('admin.editProperty.10.days')}
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
                      {t('totalRefund') || 'Reembolso total'}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: '13px', color: '#047857', lineHeight: 1.5 }}>
                    {tcommon('admin.editProperty.10.descRefund')}
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
                      {t('protectedIncome') || 'Ingresos protegidos'}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: '13px', lineHeight: 1.5 }}>
                    {tcommon('admin.editProperty.10.descProtected')}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>
          {/* <Card
            variant="outlined"
            sx={{
              maxWidth: 700,
              p: 3,
              borderRadius: 3,
              mt: 4,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          > */}

            {/* Sección de información */}
            {/* <Box
              sx={{
                p: 2.5,
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ pt: 0.5 }}>
                  <InfoOutlinedIcon sx={{ fontSize: 24, color: '#673AB7' }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '16px', mb: 1 }}>
                    {'¿Cómo funciona la protección?'}
                  </Typography>
                  <Typography sx={{ fontSize: '0.875rem', color: '#6b7280', mb: 1.5, lineHeight: 1.6 }}>
                    { 'Nuestra política de 5 días está diseñada para equilibrar la confianza del huésped con la seguridad financiera del anfitrión.'}
                  </Typography>

                  <Box component="ul" sx={{ m: 0, pl: 2.5, listStyle: 'none' }}>
                    <Box component="li" sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#673AB7', mt: 0.8, flexShrink: 0 }} />
                      <Typography sx={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                        {'Cancelaciones en el'} <strong>{'día 6, 7 o antes'}:</strong> {'Reembolso completo al huésped.'}
                      </Typography>
                    </Box>
                    <Box component="li" sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#673AB7', mt: 0.8, flexShrink: 0 }} />
                      <Typography sx={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                        {'Cancelaciones desde el'} <strong>{'día 5 hasta el check-in'}:</strong> {'El anfitrión recibe el pago íntegro.'}
                      </Typography>
                    </Box>
                    <Box component="li" sx={{ display: 'flex', gap: 1 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#673AB7', mt: 0.8, flexShrink: 0 }} />
                      <Typography sx={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                        {'Transparencia total'}: {'No hay letras pequeñas ni variaciones por temporada.'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Card> */}
        </Box>

        <Box sx={{
            position: 'sticky',
            bottom: { xs: -26, md: -5 },
            zIndex: 10,
          display: 'flex',
          justifyContent: 'flex-end',
          pt: 2,
          pb: 2,
          // mx: -4,
          borderTop: '1px solid #e0e0e0',
          bgcolor: 'white',
          // zIndex: 1,
        }}>
          <Button
            variant="primary"
            sx={{ fontFamily: typography.paragraph1Regular, textTransform: 'none' }}
            onClick={handleSubmit}
          >
            {tcommon('commonNames.saveChanges')}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default SelectorPoliticaCancelacion;
