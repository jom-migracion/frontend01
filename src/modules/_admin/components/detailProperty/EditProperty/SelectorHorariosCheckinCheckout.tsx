import React from 'react';
import { Box, Typography, FormControl, Select, MenuItem, Button, Alert, Divider } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { TlCheckInOutPolicy } from '@/models/interfaces/ListingRentResponseStep';
import { timeOptions } from '@/common/constants/timeOptionsCheckInCheckout';
import { useTranslation } from 'react-i18next';
import { usePut } from '@/hooks/api';
import LoadingThreeDotsJumping from '@/components/LoadingThreeDotsJumping';
import { useSnackbar } from '@/context/SnackbarContext';
import { convertirString_Minutos } from '@/common/util/dateFunctions';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';

const SelectorHorariosCheckinCheckout: React.FC<{
  listingRentId: number;
  tlCheckInOutPolicy: TlCheckInOutPolicy;
}> = ({ listingRentId, tlCheckInOutPolicy }) => {
  // useState
  const [arrivalStart, setArrivalStart] = React.useState(
    tlCheckInOutPolicy?.checkInTime_Str ?? '14:00'
  );
  const [arrivalEnd, setArrivalEnd] = React.useState(tlCheckInOutPolicy?.maxCheckInTime_Str ?? '');
  const [departureTime, setDepartureTime] = React.useState(
    tlCheckInOutPolicy?.checkOutTime_Str ?? '11:00'
  );

  // hooks
  const showSnackbar = useSnackbar();
  const { t } = useTranslation('translation', { keyPrefix: 'admin.registerProperty.step33' });
  const { t: tcommon } = useTranslation();
  // api

  const { mutate: UpdateCheckInOut, isPending } = usePut(
    `/Host/ListingRent/${listingRentId}/UpdateCheckInOutAndRules`
  );

  const handleSubmit = async () => {
    const timeCheckIn = convertirString_Minutos(arrivalStart);
    const timeEnd = convertirString_Minutos(arrivalEnd);
    if (timeEnd < timeCheckIn) {
      showSnackbar(t('alertCheckInTimeCheckEnd'), 'info');
    } else {
      const request = {
        checkInTime: arrivalStart,
        checkOutTime: departureTime,
        maxCheckInTime: arrivalEnd,
      };
      UpdateCheckInOut(request, {
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
      });
    }
  };
  return (
    <>
      {<LoadingThreeDotsJumping open={isPending} modal={true} />}
      <Typography
        fontWeight="600"
        sx={{ fontSize: '18px', mb: 3, color: '#222', mt: -1.5, ml: 0 }}
      >
        {tcommon('admin.editProperty.11.title')}
      </Typography>
      <Divider sx={{ mx: -10, my: -1.9 }} />
      <Box sx={{ py: 3, maxWidth: 800, width: '100%' }}>


        <Box sx={{ mb: 4, mt: 1 }}>
          <Typography
            fontWeight="600"
            sx={{ fontSize: '16px', mb: 1, color: '#1f2937' }}
          >
            {tcommon('admin.editProperty.11.subtitle')}
          </Typography>
          <Typography
            sx={{ fontSize: '13px', color: '#6b7280' }}
          >
            {tcommon('admin.editProperty.11.description')}
          </Typography>
        </Box>

        <Grid container spacing={3} mb={3}>
          {/* Check-in Card */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 3,
                p: 3
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Box sx={{ fontSize: 20 }}><ExitToAppOutlinedIcon /></Box>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#222'
                  }}
                >
                  {tcommon('admin.editProperty.11.checkIn')}
                </Typography>
              </Box>

              {/* Desde */}
              <Box mb={2}>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#1F2937',
                    mb: 1
                  }}
                >
                 {tcommon('admin.editProperty.11.from')}
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={arrivalStart}
                    displayEmpty
                    size="small"
                    sx={{ borderRadius: 2 }}
                    renderValue={(selected) => {
                      if (!selected) {
                        return <span style={{ color: '#999' }}>{t('placeHolderCheckInTime')}</span>;
                      }
                      const selectedTime = timeOptions.find((option) => option.value === selected);
                      return selectedTime ? selectedTime.label : selected;
                    }}
                    onChange={(e) => setArrivalStart(e.target.value)}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 200,
                        },
                      },
                    }}
                  >
                    {timeOptions.map((time) => (
                      <MenuItem key={time.value} value={time.value}>
                        {time.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Typography sx={{ fontSize: '13px', color: '#6b7280', mt: 0.5 }}>
                  {tcommon('admin.editProperty.11.minTime')}
                </Typography>
              </Box>

              {/* Hasta */}
              <Box>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#1F2937',
                    mb: 1
                  }}
                >
                  {tcommon('admin.editProperty.11.to')}
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={arrivalEnd}
                    displayEmpty
                    size="small"
                    sx={{ borderRadius: 2 }}
                    renderValue={(selected) => {
                      if (!selected) {
                        return <span style={{ color: '#999' }}>{t('labelCheckEnd')}</span>;
                      }
                      const selectedTime = timeOptions.find((option) => option.value === selected);
                      return selectedTime ? selectedTime.label : selected;
                    }}
                    onChange={(e) => setArrivalEnd(e.target.value)}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 200,
                        },
                      },
                    }}
                  >
                    {timeOptions.map((time) => (
                      <MenuItem key={time.value} value={time.value}>
                        {time.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Typography sx={{ fontSize: '13px', color: '#6b7280', mt: 0.5 }}>
                  {tcommon('admin.editProperty.11.timeLimit')}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Check-out Card */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 3,
                p: 3
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Box sx={{ fontSize: 20 }}><ExitToAppOutlinedIcon /></Box>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#222'
                  }}
                >
                  {tcommon('admin.editProperty.11.checkOut')}
                </Typography>
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#1F2937',
                    mb: 1
                  }}
                >
                  {tcommon('admin.editProperty.11.timeOut')}
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={departureTime}
                    displayEmpty
                    size="small"
                    sx={{ borderRadius: 2 }}
                    renderValue={(selected) => {
                      if (!selected) {
                        return <span style={{ color: '#999' }}>{t('placeHolderCheckOutTime')}</span>;
                      }
                      const selectedTime = timeOptions.find((option) => option.value === selected);
                      return selectedTime ? selectedTime.label : selected;
                    }}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 200,
                        },
                      },
                    }}
                  >
                    {timeOptions.map((time) => (
                      <MenuItem key={time.value} value={time.value}>
                        {time.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Typography sx={{ fontSize: '13px', color: '#6b7280', mt: 0.5 }}>
                  {tcommon('admin.editProperty.11.maxTime')}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Alert informativo */}
        <Alert
          icon={<InfoOutlinedIcon sx={{ color: '#6b7280' }} />}
          severity="info"
          sx={{
            mb: 4,
            fontSize: '13px',
            backgroundColor: '#f8f9fc99',
            border: '1px solid #e5e7eb',
            borderRadius: 2,
            '& .MuiAlert-message': {
              color: '#222',
              fontSize: '13px',
            }
            ,mt: 2
          }}
        >
          {tcommon('admin.editProperty.11.alert')}
        </Alert>

        {/* Botones */}
        <Box sx={{
            position: 'sticky',
            bottom: { xs: -25, md: -5 },
            zIndex: 10,
          display: 'flex',
          justifyContent: 'flex-end',
          pt: 2,
          pb: 2,
          borderTop: '1px solid #e0e0e0',
          bgcolor: 'white',
          // zIndex: 1,
        }}>
          {/* <Button
            variant="outlined"
            sx={{
              textTransform: 'none',
              fontSize: 16,
              fontWeight: 500,
              px: 3,
              py: 1.5,
              borderRadius: 2,
              color: '#222',
              borderColor: '#222',
              '&:hover': {
                borderColor: '#000',
                backgroundColor: '#f7f7f7'
              }
            }}
            onClick={() => window.history.back()}
          >
            Cancelar
          </Button> */}
          <Button
            variant="primary"
            disabled={isPending}
            sx={{
              textTransform: 'none',
              fontSize: 16,
              fontWeight: 500,
              px: 3,
              py: 1.5,
              borderRadius: 2,
              color: '#fff',
              '&.Mui-disabled': {
                backgroundColor: '#e0e0e0',
                color: '#999'
              }
            }}
            onClick={handleSubmit}
          >
            {isPending ? tcommon('commonNames.saving') : tcommon('commonNames.saveChanges')}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default SelectorHorariosCheckinCheckout;
