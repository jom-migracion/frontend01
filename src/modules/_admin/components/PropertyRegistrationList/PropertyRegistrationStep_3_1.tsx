import { Box, Typography, Chip, styled, InputAdornment } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomTextField from '@/components/CustomTextField';
import { PropertyRegistrationProps_3_1 } from '../../interface/IPropertyRegistrationProps';
import {
  stepperProperty_3_1formSchema,
  TypeStepperProperty_3_1formSchema,
} from '../../validations/stepperProperty_3_1FormSchema';
import { useEffect, useRef, useState } from 'react';
import { useStepValidation } from '@/context/FormStepContext';
import { usePropertyRegistration } from '@/store/listingRentPropertyRegistration.store';
import { useTranslation } from 'react-i18next';
import Switch, { SwitchProps } from '@mui/material/Switch';

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

const PriceCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: '12px',
  border: `1px solid ${theme.palette.divider}`,
}));

const DiscountRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2.5),
  borderRadius: '12px',
  marginTop: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
  },
}));

export const PropertyRegistrationStep_3_1: React.FC<PropertyRegistrationProps_3_1> = ({
  onChange,
}) => {
  // store
  const { discountTypes } = usePropertyRegistration((state) => state.data.parametrics);
  const { priceNightly, weekendNightlyPrice, discounts } = usePropertyRegistration(
    (state) => state.data.listingData
  );
  
  const porcentageNew = discounts.find((item) => item.code == 'new')?.porcentage;
  const porcentageWeek = discounts.find((item) => item.code == 'week')?.porcentage;
  const porcentageMonth = discounts.find((item) => item.code == 'month')?.porcentage;

  // hooks
  const { setStepValid } = useStepValidation();
  
  // Hook original (para labelPriceNightly y labelCustomizedPrice)
  const { t } = useTranslation('translation', { keyPrefix: 'admin.registerProperty.step31' });
  // Nuevo hook para los textos faltantes
  const { t: tStep31 } = useTranslation('translation', { keyPrefix: 'PropertyRegistrationStep_3_1' });

  const {
    register,
    formState: { errors, isValid },
    watch,
    setValue,
    setError,
    clearErrors,
  } = useForm<TypeStepperProperty_3_1formSchema>({
    defaultValues: {
      pricePerNight: priceNightly,
      customizedPrice: weekendNightlyPrice,
      newPercentage: porcentageNew,
      weeklyPercentage: porcentageWeek,
      monthlyPercentage: porcentageMonth,
    },
    mode: 'onChange',
    resolver: zodResolver(stepperProperty_3_1formSchema),
  });

  const values = watch();
  const previousValuesRef = useRef<TypeStepperProperty_3_1formSchema | null>(null);
  
  // Estados para los switches de descuentos
  const [weeklyEnabled, setWeeklyEnabled] = useState(!!porcentageWeek);
  const [monthlyEnabled, setMonthlyEnabled] = useState(!!porcentageMonth);
  const [newEnabled, setNewEnabled] = useState(!!porcentageNew);

  useEffect(() => {
    let isCustomValid = true;

    if (weeklyEnabled && (!values.weeklyPercentage || values.weeklyPercentage <= 0)) {
      if (!errors.weeklyPercentage) {
        setError('weeklyPercentage', { type: 'manual', message: tStep31('requiredError', { defaultValue: 'Requerido' }) });
      }
      isCustomValid = false;
    } else if (weeklyEnabled && values.weeklyPercentage && values.weeklyPercentage > 99) {
      if (!errors.weeklyPercentage) {
        setError('weeklyPercentage', { type: 'manual', message: tStep31('maxPercentageError', { defaultValue: 'No puede superar 99%' }) });
      }
      isCustomValid = false;
    } else {
      if (errors.weeklyPercentage?.type === 'manual') {
        clearErrors('weeklyPercentage');
      }
    }

    if (monthlyEnabled && (!values.monthlyPercentage || values.monthlyPercentage <= 0)) {
      if (!errors.monthlyPercentage) {
        setError('monthlyPercentage', { type: 'manual', message: tStep31('requiredError', { defaultValue: 'Requerido' }) });
      }
      isCustomValid = false;
    } else if (monthlyEnabled && values.monthlyPercentage && values.monthlyPercentage > 99) {
      if (!errors.monthlyPercentage) {
        setError('monthlyPercentage', { type: 'manual', message: tStep31('maxPercentageError', { defaultValue: 'No puede superar 99%' }) });
      }
      isCustomValid = false;
    } else {
      if (errors.monthlyPercentage?.type === 'manual') {
        clearErrors('monthlyPercentage');
      }
    }

    if (newEnabled && (!values.newPercentage || values.newPercentage <= 0)) {
      if (!errors.newPercentage) {
        setError('newPercentage', { type: 'manual', message: tStep31('requiredError', { defaultValue: 'Requerido' }) });
      }
      isCustomValid = false;
    } else if (newEnabled && values.newPercentage && values.newPercentage > 99) {
      if (!errors.newPercentage) {
        setError('newPercentage', { type: 'manual', message: tStep31('maxPercentageError', { defaultValue: 'No puede superar 99%' }) });
      }
      isCustomValid = false;
    } else {
      if (errors.newPercentage?.type === 'manual') {
        clearErrors('newPercentage');
      }
    }

    setStepValid(6, isValid && isCustomValid);
    const valuesChanged = JSON.stringify(previousValuesRef.current) !== JSON.stringify(values);

    if (valuesChanged || previousValuesRef.current === null) {
      previousValuesRef.current = values;  
      onChange({ step3_1: values });
    }
  }, [values, isValid, setStepValid, weeklyEnabled, monthlyEnabled, newEnabled, setError, clearErrors, onChange, errors, tStep31]);

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 800 }}>
      {/* Título principal */}
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 600, 
          fontSize:'1.5rem',
          mb: 1.5,
          color: 'text.primary',
          mt: '25px'
        }}
      >
        {/* {t('title')} */}
        {tStep31('headerTitle', { defaultValue: 'Define el precio de tu espacio' })}
      </Typography>
      <Typography         
        color="text.secondary" 
        sx={{ mb: 4, lineHeight: 1.6, fontSize: '0.875rem' }}
      >
        {tStep31('headerSubtitle', { defaultValue: 'Puedes cambiarlo en cualquier momento. Comienza con un precio competitivo para recibir tus primeras reservaciones y evaluaciones.' })}
      </Typography>

      {/* Precios base */}
      <PriceCard sx={{ mb: 3 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            mb: 3,
            fontSize: '16px',
            color: 'text.primary',
          }}
        >
          {tStep31('basePricesTitle', { defaultValue: 'Precios base' })}
        </Typography>
        
        <Grid container spacing={3}>
          {/* Precio por noche estándar */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600,
                fontSize: '14px',
                mb: 2,
                color: 'text.primary',
              }}
            >
              {/* Uso del hook original */}
              {t('labelPriceNightly')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
              <CustomTextField
                type="number"
                placeholder="347"
                {...register('pricePerNight', {
                  setValueAs: (value) => (value === '' ? undefined : value),
                })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">BOB</InputAdornment>,
                  sx: {
                    fontSize: '20px !important',
                    fontWeight: 600,
                  }
                }}
                sx={{
                  '& input': {
                    fontSize: '20px !important',
                    fontWeight: 600,
                    padding: '12px',
                  }
                }}
                error={!!errors.pricePerNight}
                helperText={errors.pricePerNight?.message}
              />
            </Box>
            <Typography sx={{ fontSize: '12px' }} color="text.secondary">
              {tStep31('basePriceDesc', { defaultValue: 'Precio base de Lunes a Viernes' })}
            </Typography>
          </Grid>

          {/* Precio de fin de semana */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600,
                fontSize: '14px',
                mb: 2,
                color: 'text.primary',
              }}
            >
              {/* Uso del hook original */}
              {t('labelCustomizedPrice')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
              <CustomTextField
                type="number"
                placeholder="420"
                {...register('customizedPrice', {
                  setValueAs: (value) => (value === '' ? undefined : value),
                })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">BOB</InputAdornment>,
                  sx: {
                    fontSize: '20px !important',
                    fontWeight: 600,
                  }
                }}
                sx={{
                  '& input': {
                    fontSize: '20px',
                    fontWeight: 600,
                    padding: '12px',
                  }
                }}
                error={!!errors.customizedPrice}
                helperText={errors.customizedPrice?.message}
              />
            </Box>
            <Typography sx={{ fontSize: '12px' }} color="text.secondary">
              {tStep31('weekendPriceDesc', { defaultValue: 'Se aplica a las noches de Sabados y Domingos' })}
            </Typography>
          </Grid>
        </Grid>
      </PriceCard>

      {/* Descuentos automáticos */}
      <PriceCard>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            fontSize: '16px',
            mb: 2,
            color: 'text.primary',
          }}
        >
          {tStep31('autoDiscountsTitle', { defaultValue: 'Descuentos automáticos' })}
        </Typography>

        {/* Descuento semanal */}
        <DiscountRow>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography sx={{ fontWeight: 600, fontSize: '14px', color: 'text.primary' }}>
                {tStep31('weeklyDiscount', { defaultValue: 'Descuento semanal' })}
              </Typography>
              <Chip 
                label={tStep31('recommendedBadge', { defaultValue: 'RECOMENDADO' })} 
                size="small" 
                sx={{ 
                  height: 20,
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  backgroundColor: '#ECFDF5',
                  color: '#059669',
                }} 
              />
            </Box>
            <Typography sx={{ fontSize: '12px' }} color="text.secondary">
              {tStep31('weeklyDiscountDesc', { defaultValue: 'Se aplica automáticamente a reservas de 7 noches o más.' })}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CustomTextField
              type="number"
              placeholder={`${discountTypes.find((item) => item.code == 'week')?.porcentageSuggest}`}
              {...register('weeklyPercentage')}
              disabled={!weeklyEnabled}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                inputProps: { min: 1, max: 99 },
              }}
              sx={{ width: 100 }}
              error={!!errors.weeklyPercentage}
              helperText={errors.weeklyPercentage?.message}
            />
            <JOMSwitch checked={weeklyEnabled} 
            // checked={weeklyEnabled}
              onChange={(e) => {
                const isEnabled = e.target.checked;
                setWeeklyEnabled(isEnabled);
                if (!isEnabled) {
                  setValue('weeklyPercentage', 0, { shouldValidate: true });
                } else if (!values.weeklyPercentage) {
                  // Trigger validation immediately when enabled
                  setValue('weeklyPercentage', undefined as any, { shouldValidate: true });
                }
              }}/>
            {/* <Switch ... /> */}
          </Box>
        </DiscountRow>

        {/* Descuento mensual */}
        <DiscountRow>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '14px', color: 'text.primary', mb: 0.5 }}>
              {/* {t('discounts.monthly')} */}
              {tStep31('monthlyDiscount', { defaultValue: 'Descuento mensual' })}
            </Typography>
            <Typography sx={{ fontSize: '12px' }} color="text.secondary">
              {tStep31('monthlyDiscountDesc', { defaultValue: 'Se aplica automáticamente a reservas de 28 noches o más.' })}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CustomTextField
              type="number"
              placeholder={`${discountTypes.find((item) => item.code == 'month')?.porcentageSuggest}`}
              {...register('monthlyPercentage')}
              disabled={!monthlyEnabled}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                inputProps: { min: 1, max: 99 },
              }}
              sx={{ width: 100 }}
              error={!!errors.monthlyPercentage}
              helperText={errors.monthlyPercentage?.message}
            />
            <JOMSwitch checked={monthlyEnabled} 
              // checked={monthlyEnabled}
              onChange={(e) => {
                const isEnabled = e.target.checked;
                setMonthlyEnabled(isEnabled);
                if (!isEnabled) {
                  setValue('monthlyPercentage', 0, { shouldValidate: true });
                } else if (!values.monthlyPercentage) {
                  setValue('monthlyPercentage', undefined as any, { shouldValidate: true });
                }

              }}/>            
            {/* <Switch ... /> */}
          </Box>
        </DiscountRow>

        {/* Promoción nuevo anuncio */}
        <DiscountRow>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '14px', color: 'text.primary', mb: 0.5 }}>
              {/* {t('discounts.new')} */}
              {tStep31('newListingDiscount', { defaultValue: 'Promoción nuevo anuncio' })}
            </Typography>
            <Typography sx={{ fontSize: '12px' }} color="text.secondary">
              {tStep31('newListingDiscountDesc', { defaultValue: 'Ofrece un descuento en tus primeras 3 reservaciones.' })}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CustomTextField
              type="number"
              placeholder={`${discountTypes.find((item) => item.code == 'new')?.porcentageSuggest}`}
              {...register('newPercentage', {
                setValueAs: (value) => (value === '' ? undefined : value),
              })}
              disabled={!newEnabled}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                inputProps: { min: 1, max: 99 },
              }}
              sx={{ width: 100 }}
              error={!!errors.newPercentage}
              helperText={errors.newPercentage?.message}
            />
           <JOMSwitch 
              checked={newEnabled}
              onChange={(e) => {
                const isEnabled = e.target.checked;
                setNewEnabled(isEnabled);
                if (!isEnabled) {
                  setValue('newPercentage', 0, { shouldValidate: true });
                } else if (!values.newPercentage) {
                  setValue('newPercentage', undefined as any, { shouldValidate: true });
                }

              }}/>            
            {/* <Switch ... /> */}
          </Box>
        </DiscountRow>
      </PriceCard>
    </Box>
  );
};