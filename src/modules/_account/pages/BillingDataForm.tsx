import {
  Autocomplete,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  Stack,
  TextField,
  Switch,
} from '@mui/material';
import { ParametricsCityResponse } from '@/models/interfaces/ParametricsCityResponse';
import ResponseAssert from '@/models/interfaces/backend/ResponseAssert';
import { ApiService } from '@/services/ApiService';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface BillingFormData {
  fullName: string;
  email: string;
  nit: string;
  documentType: 'CI' | 'NIT';
  fiscalAddress: string;
  stateId: number;
  stateName: string;
  cityId: number;
  cityName: string;
}

export interface BillingFormErrors {
  fullName?: string;
  email?: string;
  nit?: string;
  fiscalAddress?: string;
  cityId?: string;
}

interface BillingDataFormProps {
  billingData: BillingFormData;
  billingErrors: BillingFormErrors;
  billingType?: string | null;
  onFieldChange: (field: keyof BillingFormData, value: string | number) => void;
  onSave: () => void;
  onCancel: () => void;
}

interface CityOption {
  cityId: number;
  stateId: number;
  label: string;
}

const BillingDataForm = ({
  billingData,
  billingErrors,
  onFieldChange,
  onSave,
  onCancel,
  billingType,
}: BillingDataFormProps) => {
  const { t } = useTranslation();
  const [cityOptions, setCityOptions] = useState<CityOption[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const isNitDocumentType = billingData.documentType === 'NIT';
  const selectedCityOption = useMemo(
    () =>
      cityOptions.find((option) => option.cityId === billingData.cityId) ||
      (billingData.cityId
        ? {
            cityId: billingData.cityId,
            stateId: billingData.stateId,
            label: [billingData.cityName, billingData.stateName].filter(Boolean).join(' / '),
          }
        : null),
    [cityOptions, billingData.cityId, billingData.stateId, billingData.cityName, billingData.stateName]
  );

  useEffect(() => {
    const fetchCities = async () => {
      if (citySearch.trim().length < 3) {
        setCityOptions([]);
        setLoadingCities(false);
        return;
      }

      setLoadingCities(true);

      try {
        const response = await ApiService.get<ResponseAssert<ParametricsCityResponse>>(
          `/Parametrics/City/${citySearch.trim()}`
        );

        const mappedCities: CityOption[] = [];

        response?.data?.forEach((country) => {
          country.states.forEach((state) => {
            state.counties.forEach((county) => {
              county.cities.forEach((city) => {
                mappedCities.push({ cityId: city.cityId, stateId: state.stateId, label: `${city.name} / ${state.name}` });
              });
            });
          });
        });

        const uniqueCities = Array.from(new Map(mappedCities.map((city) => [city.cityId, city])).values());

        setCityOptions(uniqueCities);
      } catch {
        setCityOptions([]);
      } finally {
        setLoadingCities(false);
      }
    };

    const timer = setTimeout(() => {
      fetchCities();
    }, 400);

    return () => clearTimeout(timer);
  }, [citySearch]);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', py: 4, px: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontWeight: 500 }}>
        {t('BillingDataForm.breadcrumbs')}
      </Typography>

      <Typography variant="h4" fontWeight="700" sx={{ mb: 3 }}>
        {t('BillingDataForm.title')}
      </Typography>

      <Card variant="outlined" sx={{ borderRadius: 0 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                {t('BillingDataForm.fields.documentType.document')}
              </Typography>

              <Box
                sx={{
                  border: '1px solid #E5E7EB',
                  borderRadius: 2,
                  px: 1.5,
                  py: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  width: 'fit-content',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: isNitDocumentType ? '#9CA3AF' : '#1F2937',
                    minWidth: 20,
                  }}
                >
                  CI
                </Typography>

                <Switch
                  checked={isNitDocumentType}
                  onChange={(event) => onFieldChange('documentType', event.target.checked ? 'NIT' : 'CI')}
                  size="medium"
                  sx={{
                    '& .MuiSwitch-switchBase': {
                      color: '#FFFFFF',
                      '& + .MuiSwitch-track': {
                        backgroundColor: '#D1D5DB',
                        opacity: 1,
                      },
                    },
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#FFFFFF',
                      '& + .MuiSwitch-track': {
                        backgroundColor: '#2D75F0',
                        opacity: 1,
                      },
                    },
                    '& .MuiSwitch-track': {
                      borderRadius: 999,
                    },
                    '& .MuiSwitch-thumb': {
                      boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                    },
                  }}
                />

                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: isNitDocumentType ? '#1F2937' : '#9CA3AF',
                    minWidth: 30,
                  }}
                >
                  NIT
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                {isNitDocumentType ? 'NIT' : 'CI'}
              </Typography>
              <TextField
                fullWidth
                placeholder={isNitDocumentType ? t('BillingDataForm.fields.nit.placeholderNIT') : t('BillingDataForm.fields.nit.placeholderCI')}
                value={billingData.nit}
                onChange={(event) => onFieldChange('nit', event.target.value)}
                error={Boolean(billingErrors.nit)}
                helperText={billingErrors.nit}
              />
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                {t('BillingDataForm.fields.fullName.label')}
              </Typography>
              <TextField
                fullWidth
                placeholder={t('BillingDataForm.fields.fullName.placeholder')}
                value={billingData.fullName}
                onChange={(event) => onFieldChange('fullName', event.target.value)}
                error={Boolean(billingErrors.fullName)}
                helperText={billingErrors.fullName}
              />
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                {t('BillingDataForm.fields.email.label')}
              </Typography>
              <TextField
                fullWidth
                type="email"
                placeholder={t('BillingDataForm.fields.email.text')}
                value={billingData.email}
                onChange={(event) => onFieldChange('email', event.target.value)}
                error={Boolean(billingErrors.email)}
                helperText={billingErrors.email}
              />
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                {t('BillingDataForm.fields.fiscalAddress.label')}
              </Typography>
              <TextField
                fullWidth
                placeholder={t('BillingDataForm.fields.fiscalAddress.placeholder')}
                value={billingData.fiscalAddress}
                onChange={(event) => onFieldChange('fiscalAddress', event.target.value)}
                error={Boolean(billingErrors.fiscalAddress)}
                helperText={billingErrors.fiscalAddress}
              />
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                {t('BillingDataForm.fields.location.label')}
              </Typography>
              <Autocomplete
                fullWidth
                options={cityOptions}
                getOptionLabel={(option) => option.label}
                value={selectedCityOption}
                onChange={(_, option) => {
                  onFieldChange('cityId', option?.cityId ?? 0);
                  onFieldChange('stateId', option?.stateId ?? 0);
                  onFieldChange('cityName', option?.label.split(' / ')[0] ?? '');
                  onFieldChange('stateName', option?.label.split(' / ')[1] ?? '');
                }}
                onInputChange={(_, value, reason) => {
                  if (reason === 'input' || reason === 'clear') {
                    setCitySearch(value);
                  }
                }}
                loading={loadingCities}
                isOptionEqualToValue={(option, value) => option.cityId === value.cityId}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={t('BillingDataForm.fields.location.placeholder')}
                    error={Boolean(billingErrors.cityId)}
                    helperText={billingErrors.cityId}
                  />
                )}
              />
              {billingErrors.cityId ? (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                  {billingErrors.cityId}
                </Typography>
              ) : null}
            </Box>

            <Divider sx={{ mt: 1 }} />

            <Typography variant="body2" color="text.secondary">
              {t('BillingDataForm.disclaimer')}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Button
        variant="contained"
        fullWidth
        onClick={onSave}
        sx={{ mt: 3, py: 1.5, fontSize: '1.1rem', textTransform: 'none' }}
      >
        {billingType == 'pay' ? 'Continuar' : t('BillingDataForm.buttons.save')}
      </Button>

      {!billingType && <Button
        variant="text"
        fullWidth
        onClick={onCancel}
        sx={{ mt: 1.5, py: 1.2, textTransform: 'none', color: 'text.primary' }}
      >
        {t('BillingDataForm.buttons.cancel')}
      </Button>}
    </Box>
  );
};

export default BillingDataForm;
