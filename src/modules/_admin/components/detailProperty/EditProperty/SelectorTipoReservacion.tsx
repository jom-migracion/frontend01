import { Box, Button, Card, CardContent, Divider, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdvanceNotice from '../../AdvanceNotice';
import { ApprovalPolicyType } from '@/models/interfaces/ListingRentResponseStep';
import CardRectangle from '../../CardRectangle';
import { useCustomMutationByUrl, useGet2 } from '@/hooks/api';
import LoadingThreeDotsJumping from '@/components/LoadingThreeDotsJumping';
import { useSnackbar } from '@/context/SnackbarContext';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

const SelectorTipoReservacion: React.FC<{
  listingRentId: number;
  approvalPolicy: ApprovalPolicyType;
  minimunNoticeDays: number;
  preparationDay: number;
  listingRentName: string;
}> = ({ listingRentId, approvalPolicy, minimunNoticeDays, preparationDay, listingRentName }) => {
  // useState
  const [reservationType, setReservationType] = useState<ApprovalPolicyType>(approvalPolicy);
  const [advanceNoticeDays, setAdvanceNoticeDays] = useState(minimunNoticeDays);
  const [preparationDays, setPreparationDays] = useState(preparationDay);

  // api
  const { data: ParamListingRentReservationTypes, isLoading: loadingReservation } = useGet2<
    ApprovalPolicyType[]
  >('ParamListingRentAmenityTypes', '/Parametrics/ReservationTypes');

  const { mutate: UpdatePricingAndDiscounts, isPending } = useCustomMutationByUrl('put');

  const handleGuardar = async () => {
    const url = `Host/ListingRent/${listingRentId}/UpdateReservation?approvalPolicyTypeId=${reservationType.approvalPolicyTypeId}&minimunNoticeDays=${advanceNoticeDays}&preparationDays=${preparationDays}`;

    UpdatePricingAndDiscounts(
      { url },
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
          showSnackbar(error?.response?.data?.resultError?.message ?? error.message, 'error');
        },
      }
    );
  };

  // hooks
  const {
    palette: { customColors },
    typography,
  } = useTheme();
  const { t } = useTranslation('translation', { keyPrefix: 'admin.registerProperty.step32' });
  const { t: tcommon } = useTranslation('translation');
  const showSnackbar = useSnackbar();

  useEffect(() => {
    if (approvalPolicy && !reservationType && ParamListingRentReservationTypes?.data) {
      const foundApproval = ParamListingRentReservationTypes.data.find(
        (prope) => prope.approvalPolicyTypeId === approvalPolicy.approvalPolicyTypeId
      );
      if (foundApproval) {
        setReservationType(foundApproval);
      }
    }
  }, [ParamListingRentReservationTypes, approvalPolicy]);

  return (
    <>
      {<LoadingThreeDotsJumping open={isPending} modal={true} />}
      <Typography fontWeight="600" sx={{ fontSize: '18px', mb: 4, mt: -1.6, color: '#222', ml: 0 }}>
        {tcommon('admin.editProperty.8.title')}
      </Typography>
      <Divider sx={{ mx: -10, my: -2.8 }} />
      <Box sx={{ py: 1, pr:'20px', width: '100%', mt: 9 }}>
        <Grid container spacing={1} columns={6}>
          <Grid size={{ md: 8, xs: 16 }}>
            <Card
              sx={{ height: '100%', boxSizing: 'border-box', width: '100%', boxShadow: 'none', mt: -5.5, overflow: 'visible' }}
            >
              <Box display="flex" alignItems="center">
                <Typography sx={{ fontWeight: 600, fontSize: '16px' }}>
                  {tcommon('admin.editProperty.8.subtitle')}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Typography sx={{ mt: 2, mb: 2, fontSize: '14px', color: '#6b7280' }}>
                  {tcommon('admin.editProperty.8.description')}
                </Typography>
              </Box>
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  width: '100%',
                  p: 0,
                  gap: 1,
                }}
              >
                {loadingReservation ? (
                  <Box sx={{ mt: 5 }}>
                    <LoadingThreeDotsJumping />
                  </Box>
                ) : (
                  ParamListingRentReservationTypes?.data.map((appro) => {
                    if (appro?.code == 'manbook') {
                      return (
                        <CardRectangle
                          key={appro?.code}
                          onClick={() => setReservationType(appro)}
                          title={appro?.name}
                          description={appro?.description}
                          bgColor={
                            appro?.approvalPolicyTypeId == reservationType?.approvalPolicyTypeId
                              ? customColors.lights[3]
                              : ''
                          }
                          selected={appro?.approvalPolicyTypeId == reservationType?.approvalPolicyTypeId}
                        />
                      )
                    }
                  })
                )}
              </CardContent>
              <Box sx={{ borderRadius: 4, border: '1px solid #e0e0e0', p: 2, mt: 1 }}>
                <Typography sx={{ mb: 2, fontWeight: 600, fontSize: '14px', color: '#222' }}>
                  {tcommon('admin.editProperty.8.preparationManagement')}
                </Typography>
                <CardContent
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    flexDirection: 'column',
                    p: 0,
                    width: '100%',
                  }}
                >
                  <AdvanceNotice
                    title={t('advanceNoticeDaysTitle')}
                    description={t('advanceNoticeDaysDescription')}
                    onChange={setAdvanceNoticeDays}
                    initialDays={advanceNoticeDays}
                    maxDays={7}
                  />
                  <AdvanceNotice
                    title={t('preparationDaysTitle')}
                    description={t('preparationDaysDescription')}
                    onChange={setPreparationDays}
                    initialDays={preparationDays}
                    maxDays={2}
                  />
                </CardContent>
              </Box>
            </Card>
          </Grid>
        </Grid>
        <Box sx={{ mt:1, pt: 1 }}>
          <Typography 
            fontWeight="600" 
            sx={{ fontSize: '13px', mb: 1, color: '#0a3152' }}
          >
            {tcommon('admin.editProperty.8.calendar')}
          </Typography>
          <Button
            variant="outlined"
            sx={{
              textTransform: 'none',
              fontSize: 14,
              fontWeight: 500,
              px: 2,
              py: 1,
              borderRadius: 2,
              color: '#222',
              borderColor: '#e5e7eb',
              '&:hover': {
                borderColor: '#e5e7eb',
              },
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
            type="button"
            onClick={() => {
              const property = encodeURIComponent(String(listingRentId));
              const name = encodeURIComponent(listingRentName ?? '');
              window.location.href = `/host?property=${property}&name=${name}`;
            }}
          >
            <CalendarMonthOutlinedIcon />
             {tcommon('admin.editProperty.8.calendarTitle')}
          </Button>
          <Typography sx={{ fontSize: 13, mt: 1, color: '#717171' }}>
            {tcommon('admin.editProperty.8.calendarDescription')}
          </Typography>
        </Box>

        <Box sx={{
            position: 'sticky',
            bottom: { xs: -26, md: -5 },
            zIndex: 10,
          display: 'flex',
          justifyContent: 'flex-end',
          pt: 2,
          pb: 2,
          mt: 1,
          borderTop: '1px solid #e0e0e0',
          bgcolor: 'white',
          // zIndex: 1,
          // width: '100%',
        }}>
          <Button
            variant="primary"
            sx={{
              fontFamily: typography.paragraph1Regular,
              textTransform: 'none',
            }}
            onClick={handleGuardar}
          >
            {tcommon('commonNames.saveChanges')}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default SelectorTipoReservacion;
