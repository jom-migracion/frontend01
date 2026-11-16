import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  FormControl,
  Button,
  Grid,
  Chip,
  Switch,
  styled,
  Divider,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import CustomTextField from '@/components/CustomTextField';
import { useForm } from 'react-hook-form';
import {
  stepperProperty_3_1formSchema,
  TypeStepperProperty_3_1formSchema,
} from '@/modules/_admin/validations/stepperProperty_3_1FormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import LoadingThreeDotsJumping from '@/components/LoadingThreeDotsJumping';
import { useGet, usePut } from '@/hooks/api';
import { useSnackbar } from '@/context/SnackbarContext';
import { DiscountType } from '@/models/interfaces/ListingRentResponseStep';
import { SwitchProps } from '@mui/material/Switch';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

const JOMSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#5B55C8',
        opacity: 1,
        border: 0,
        ...theme.applyStyles('dark', {
          backgroundColor: '#2ECA45',
        }),
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100],
      ...theme.applyStyles('dark', {
        color: theme.palette.grey[600],
      }),
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.7,
      ...theme.applyStyles('dark', {
        opacity: 0.3,
      }),
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#E9E9EA',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    ...theme.applyStyles('dark', {
      backgroundColor: '#39393D',
    }),
  },
}));

interface requestUpdate {
  nightlyPrice: number;
  weekendNightlyPrice: number;
  currencyId: number;
  discountPrices: any[];
}
interface initialValues {
  listingRentId: number;
  pricePerNight: number;
  customizedPrice: number;
  discountNewPercentage: any;
  discountWeeklyPercentage: any;
  discountMonthlyPercentage: any;
  listingRentName: string;
}
const FormularioPreciosYDescuentos: React.FC<initialValues> = ({
  listingRentId,
  pricePerNight,
  customizedPrice,
  discountNewPercentage,
  discountWeeklyPercentage,
  discountMonthlyPercentage,
  listingRentName,
}) => {
  // api
  const { mutate: UpdatePricingAndDiscounts, isPending } = usePut(
    `/Host/ListingRent/${listingRentId}/UpdatePricingAndDiscounts`
  );

  const { data: ParamListingRentDiscountTypes } = useGet<DiscountType[]>('ParamListingRentDiscountTypes', '/Parametrics/DiscountTypes');

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<TypeStepperProperty_3_1formSchema>({
    defaultValues: {
      pricePerNight: pricePerNight,
      customizedPrice: customizedPrice,
      newPercentage: discountNewPercentage?.porcentage,
      weeklyPercentage: discountWeeklyPercentage?.porcentage,
      monthlyPercentage: discountMonthlyPercentage?.porcentage,
    },
    mode: 'onChange',
    resolver: zodResolver(stepperProperty_3_1formSchema),
  });

  const [weeklyEnabled, setWeeklyEnabled] = useState<boolean>(!!discountWeeklyPercentage?.porcentage);
  const [monthlyEnabled, setMonthlyEnabled] = useState<boolean>(!!discountMonthlyPercentage?.porcentage);
  const [newEnabled, setNewEnabled] = useState<boolean>(!!discountNewPercentage?.porcentage);
  const [isCustomValid, setIsCustomValid] = useState<boolean>(true);

  const values = watch();

  useEffect(() => {
    let customValid = true;

    if (weeklyEnabled && (!values.weeklyPercentage || values.weeklyPercentage <= 0)) {
      if (!errors.weeklyPercentage) {
        setError('weeklyPercentage', { type: 'manual', message: 'Requerido' });
      }
      customValid = false;
    } else if (weeklyEnabled && values.weeklyPercentage && values.weeklyPercentage > 99) {
      if (!errors.weeklyPercentage) {
        setError('weeklyPercentage', { type: 'manual', message: 'No puede superar 99%' });
      }
      customValid = false;
    } else {
      if (errors.weeklyPercentage?.type === 'manual') clearErrors('weeklyPercentage');
    }

    if (monthlyEnabled && (!values.monthlyPercentage || values.monthlyPercentage <= 0)) {
      if (!errors.monthlyPercentage) {
        setError('monthlyPercentage', { type: 'manual', message: 'Requerido' });
      }
      customValid = false;
    } else if (monthlyEnabled && values.monthlyPercentage && values.monthlyPercentage > 99) {
      if (!errors.monthlyPercentage) {
        setError('monthlyPercentage', { type: 'manual', message: 'No puede superar 99%' });
      }
      customValid = false;
    } else {
      if (errors.monthlyPercentage?.type === 'manual') clearErrors('monthlyPercentage');
    }

    if (newEnabled && (!values.newPercentage || values.newPercentage <= 0)) {
      if (!errors.newPercentage) {
        setError('newPercentage', { type: 'manual', message: 'Requerido' });
      }
      customValid = false;
    } else if (newEnabled && values.newPercentage && values.newPercentage > 99) {
      if (!errors.newPercentage) {
        setError('newPercentage', { type: 'manual', message: 'No puede superar 99%' });
      }
      customValid = false;
    } else {
      if (errors.newPercentage?.type === 'manual') clearErrors('newPercentage');
    }

    setIsCustomValid(customValid);
  }, [values, weeklyEnabled, monthlyEnabled, newEnabled, setError, clearErrors, errors]);

  // hooks
  const { t } = useTranslation('translation', { keyPrefix: 'admin.registerProperty.step31' });
  const { t: tcommon } = useTranslation();  
  const showSnackbar = useSnackbar();

  // functions
  const onSubmit = async (data: any) => {
    const request: requestUpdate = {
      nightlyPrice: data?.pricePerNight,
      weekendNightlyPrice: data?.customizedPrice,
      currencyId: 0,
      discountPrices: [],
    };

    if (data?.newPercentage >= 0 && data?.newPercentage != discountNewPercentage?.porcentage) {
      const newDis = ParamListingRentDiscountTypes?.data?.find(item => item.code == 'new');
      request.discountPrices.push({
        discountCode: newDis?.code,
        discountId: newDis?.discountTypeForTypePriceId,
        percentage: data?.newPercentage,
      });
    }
    if (data?.weeklyPercentage >= 0 && data?.weeklyPercentage != discountWeeklyPercentage?.porcentage) {
      const newWeek = ParamListingRentDiscountTypes?.data?.find(item => item.code == 'week');
      request.discountPrices.push({
        discountCode: newWeek?.code,
        discountId: newWeek?.discountTypeForTypePriceId,
        percentage: data?.weeklyPercentage,
      });
    }
    if (
      data?.monthlyPercentage >= 0 &&
      data?.monthlyPercentage != discountMonthlyPercentage?.porcentage
    ) {
      const newMonth = ParamListingRentDiscountTypes?.data?.find(item => item.code == 'month');
      request.discountPrices.push({
        discountCode: newMonth?.code,
        discountId: newMonth?.discountTypeForTypePriceId,
        percentage: data?.monthlyPercentage,
      });
    }

    UpdatePricingAndDiscounts(request, {
      onSuccess: (response) => {
        const { statusCode, resultError } = response;

        if (statusCode === '200') {
          showSnackbar(t('messages.successUpdate'), 'success');
        } else {
          showSnackbar(resultError?.message, 'error');
        }
      },
      onError: (error) => {
        showSnackbar(error?.response?.data?.resultError?.message ?? error.message, 'error');
      },
    });
  };

  return (
    <>
      {<LoadingThreeDotsJumping open={isPending} modal={true} />}
      <Typography sx={{ fontWeight: 600, fontSize: '18px', mt: -1.4, ml: 1 }}>{tcommon('admin.editProperty.4.title')}</Typography>
      <Divider sx={{ mx: -3, my: 1 }} />
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          p: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          width: '100%',
          maxWidth: 800,
        }}
      >

        {/* grid ini */}
        <Card sx={{ boxShadow: 'none', border: 'none' }}>
          <Box>
            <Typography
              variant="h6"
              fontWeight="600"
              sx={{ fontSize: 16, mb: 1, mt: 0, color: '#222' }}
            >
              {tcommon('admin.editProperty.4.subtitle')}
            </Typography>
            <Typography
              sx={{ fontSize: '13px', mb: 3, color: '#6b7280' }}
            >
              {tcommon('admin.editProperty.4.description')}
            </Typography>
          </Box>
          <CardContent sx={{ p: 0 }}>
            <Typography
              fontWeight="600"
              sx={{ fontSize: '15px', mb: 2, color: '#0a3152' }}
            >
              {tcommon('admin.editProperty.4.titleLabel')}
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, mb: 1, color: '#1f2937' }}>
                    {tcommon('admin.editProperty.4.priceByNight')}
                  </Typography>
                  <CustomTextField
                    fullWidth
                    placeholder="200"
                    type="number"
                    {...register('pricePerNight', {
                      setValueAs: (value) => (value === '' ? undefined : Number(value)),
                    })}
                    error={!!errors.pricePerNight}
                    helperText={errors.pricePerNight?.message}
                    InputProps={{ inputProps: { min: 0 } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontSize: 16,
                      }
                    }}
                  />
                  <Typography sx={{ fontSize: '12px', mt: 0.5, color: '#6b7280' }}>
                    {tcommon('admin.editProperty.4.priceByNightDesc')}
                  </Typography>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                   <Typography sx={{ fontSize: '13px', fontWeight: 600, mb: 1, color: '#1f2937' }}>
                    {tcommon('admin.editProperty.4.priceWeekend')}
                  </Typography>
                  <CustomTextField
                    fullWidth
                    placeholder="250"
                    type="number"
                    {...register('customizedPrice', {
                      setValueAs: (value) => (value === '' ? undefined : Number(value)),
                    })}
                    error={!!errors.customizedPrice}
                    helperText={errors.customizedPrice?.message}
                    InputProps={{ inputProps: { min: 0 } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontSize: 16,
                      }
                    }}
                  />
                  <Typography sx={{ fontSize: '12px', mt: 0.5, color: '#6b7280' }}>
                    {tcommon('admin.editProperty.4.priceWeekendDesc')}
                  </Typography>
                </FormControl>
              </Grid>
            </Grid>
            <Typography
              fontWeight="600"
              sx={{ fontSize: '15px', mb: 2, mt: 1, color: '#1f2937' }}
            >
              {tcommon('admin.editProperty.4.titleLabelDiscounts')}
            </Typography>

            <Stack spacing={2}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 2,
                    p: 1,
                    borderRadius: 4,
                    border: '1px solid #e0e0e0'
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#222' }}>                      
                      {tcommon('admin.editProperty.4.weeklyDiscount')}
                    </Typography>
                    <Chip
                      label={tcommon('admin.editProperty.4.recomended')}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '10px',
                        fontWeight: 700,
                        backgroundColor: '#ecfdf5',
                        color: '#059669',
                        '& .MuiChip-label': { px: 1 }
                      }}
                    />
                  </Box>
                  <Typography sx={{ fontSize: '12px', color: '#6b7280' }}>
                    
                    {tcommon('admin.editProperty.4.weeklyDiscountDesc')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120, justifyContent: 'flex-end' }}>
                  <CustomTextField
                    size="small"
                    placeholder={`${ParamListingRentDiscountTypes?.data?.find(item => item.code == 'week')?.porcentageSuggest ?? '10'}`}
                    {...register('weeklyPercentage')}
                    disabled={!weeklyEnabled}
                    error={!!errors.weeklyPercentage}
                    helperText={errors.weeklyPercentage?.message}
                    InputProps={{ inputProps: { min: 1, max: 99 } }}
                    sx={{ width: 70, pt: 1.5 }}
                  />
                  <Typography sx={{ fontSize: 16, color: '#717171' }}>%</Typography>

                  <JOMSwitch
                    checked={weeklyEnabled}
                    color="secondary"
                    onChange={(e) => {
                      setWeeklyEnabled(e.target.checked);
                      if (!e.target.checked) setValue('weeklyPercentage', 0);
                    }}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 2,
                    p: 1,
                    borderRadius: 4,
                    border: '1px solid #e0e0e0'
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#222' }}>
                    {tcommon('admin.editProperty.4.monthlyDiscount')}
                  </Typography>
                  <Typography sx={{ fontSize: '12px', color: '#6b7280' }}>
                    {tcommon('admin.editProperty.4.monthlyDiscountDesc')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120, justifyContent: 'flex-end' }}>
                  <CustomTextField
                    size="small"
                    placeholder={`${ParamListingRentDiscountTypes?.data?.find(item => item.code == 'month')?.porcentageSuggest ?? '20'}`}
                    {...register('monthlyPercentage')}
                    disabled={!monthlyEnabled}
                    error={!!errors.monthlyPercentage}
                    helperText={errors.monthlyPercentage?.message}
                    InputProps={{ inputProps: { min: 1, max: 99 } }}
                    sx={{ width: 70, pt: 1.5 }}
                  />
                  <Typography sx={{ fontSize: 16, color: '#717171' }}>%</Typography>
                  <JOMSwitch
                    checked={monthlyEnabled}
                    color="secondary"
                    onChange={(e) => {
                      setMonthlyEnabled(e.target.checked);
                      if (!e.target.checked) setValue('monthlyPercentage', 0);
                    }}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 2,
                    p: 1,
                    borderRadius: 4,
                    border: '1px solid #e0e0e0'
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#222' }}>
                    {tcommon('admin.editProperty.4.newAdPromotion')}
                  </Typography>
                  <Typography sx={{ fontSize: '12px', color: '#6b7280' }}>
                    {tcommon('admin.editProperty.4.newAdPromotionDesc')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120, justifyContent: 'flex-end' }}>
                  <CustomTextField
                    size="small"
                    placeholder={`${ParamListingRentDiscountTypes?.data?.find(item => item.code == 'new')?.porcentageSuggest ?? '20'}`}
                    {...register('newPercentage', {
                      setValueAs: (value) => (value === '' ? undefined : value),
                    })}
                    disabled={!newEnabled || discountNewPercentage?.porcentage > 0}
                    error={!!errors.newPercentage}
                    helperText={errors.newPercentage?.message}
                    InputProps={{ inputProps: { min: 1, max: 99 } }}
                    sx={{ width: 70, pt: 1.5 }}
                  />
                  <Typography sx={{ fontSize: 16, color: '#717171' }}>%</Typography>
                  <JOMSwitch
                    checked={newEnabled}
                    color="secondary"
                    disabled={discountNewPercentage?.porcentage > 0}
                    onChange={(e) => {
                      setNewEnabled(e.target.checked);
                      if (!e.target.checked) setValue('newPercentage', 0);
                    }}
                  />
                </Box>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Box sx={{ mt:2, pt: 3, borderTop: '1px solid #e0e0e0' }}>
          <Typography 
            fontWeight="600" 
            sx={{ fontSize: '13px', mb: 1, color: '#0a3152' }}
          >            
            {tcommon('admin.editProperty.4.calendar')}
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
              {tcommon('admin.editProperty.4.calendarTitle')}              
          </Button>
          <Typography sx={{ fontSize: 13, mt: 1, color: '#717171' }}>
            {tcommon('admin.editProperty.4.calendarDesc')}
          </Typography>
        </Box>
            {/* boton guardar */}
        <Box
          sx={{
            position: 'sticky',
            bottom: { xs: -42, md: -5 },
            zIndex: 10,
            display: 'flex',
            justifyContent: 'flex-end',
           
            py: 4,
            borderTop: '1px solid #e0e0e0',
            bgcolor: 'white',
            // zIndex: 1,
          }}
        >
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
            disabled={!isValid || !isCustomValid || isPending}
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
            type="submit"
          >
            {isPending ? t('buttons.saving') : !isValid ? t('buttons.incomplete') : tcommon('commonNames.saveChanges')}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default FormularioPreciosYDescuentos;
