import React, { useState, useEffect, useCallback } from 'react';
import { Autocomplete, Box, Button, Typography, FormControl, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CustomTextField from '@/components/CustomTextField';
import { useForm, Controller } from 'react-hook-form';
import { useGet, usePost } from '@/hooks/api';
import { useAuthStore } from '@/store/auth.store';
import { useTranslation } from 'react-i18next';
import { useNotification } from '@/context/NotificationContext';

interface CitySearchOption {
  cityName: string;
  label: string;
  value: number;
}

interface LocationSuggestItem {
  id: string;
  name: string;
  type: number;
  entityId: number;
}

interface LocationSuggestResponse {
  data: LocationSuggestItem[];
}

const defaultCitySearch: CitySearchOption = {
  value: 0,
  label: '',
  cityName: '',
};

interface CityProps {
  onSave: (data: { label: string; cityId: number }) => void;
  initialId: number;
  initialCityId?: number;
  initialLiveAtShow?: string;
  initialType?: number;
}

const CitySearchForm: React.FC<CityProps> = ({
  initialId,
  onSave,
  initialCityId,
  initialLiveAtShow,
  initialType = 1,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const showNotification = useNotification();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<CitySearchOption[]>([]);
  const [selectedCity, setSelectedCity] = useState<CitySearchOption | null>(null);
  const { identifier } = useAuthStore.getState();

  const { t } = useTranslation();
  const { t: tcommon } = useTranslation('translation', { keyPrefix: 'commonNames' });

  const {
    formState: { errors },
    control,
    setValue,
  } = useForm<any>({
    defaultValues: {},
    mode: 'onChange',
  });

  const { refetch } = useGet<LocationSuggestResponse>(
    'ParametricsCity',
    `/Parametrics/Locations/Suggest/${inputValue}`,
    {},
    false
  );
  const { mutate: UpdatePersonalInformation } = usePost<any>('/UpsertAdditionalProfileData');

  useEffect(() => {
    if (initialType === 1 && initialCityId && initialLiveAtShow) {
      const initialCity: CitySearchOption = {
        value: initialCityId,
        label: initialLiveAtShow,
        cityName: initialLiveAtShow,
      };
      setSelectedCity(initialCity);
      setValue('city', initialCity);
    }
  }, [initialCityId, initialLiveAtShow, initialType, setValue]);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await refetch();
      const departments =
        data?.data
          ?.filter((item: LocationSuggestItem) => item.type === 1)
          .map((item: LocationSuggestItem) => ({
            value: item.entityId,
            label: item.name,
            cityName: item.name,
          })) ?? [];

      setOptions(departments);
    } catch {
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, [inputValue, refetch]);

  useEffect(() => {
    if (inputValue.length >= 3) {
      const timer = setTimeout(() => {
        fetchDepartments();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setOptions([]);
    }
  }, [inputValue, fetchDepartments]);

  const handleSave = () => {
    let liveAtData = null;
    if (selectedCity) {
      liveAtData = {
        cityId: selectedCity?.value,
        cityName: null,
        location: null,
      };
    }
    let dataRequest = {
      additionalProfileDataId: initialId,
      userId: identifier,
      whatIDo: null,
      wantedToGo: null,
      pets: null,
      birthday: null,
      languages: null,
      liveAt: liveAtData,
      introduceYourself: null,
    };

    UpdatePersonalInformation(dataRequest, {
      onSuccess: () => {
        if (selectedCity) {
          setValue('city', selectedCity);
          setSelectedCity(selectedCity);
          onSave({ label: selectedCity.label, cityId: selectedCity.value });
          return;
        }
        onSave({ label: '', cityId: 0 });
      },
      onError: (_error: any) => {
        if (selectedCity) {
          onSave({ label: selectedCity.label, cityId: selectedCity.value });
        }
        showNotification(
          'error',
          'Perfil: ¿Dónde vives?',
          'Hubo un error al actualizar la información.'
        );
      },
    });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography
        gutterBottom
        sx={{
          fontFamily: theme.typography.h6,
          color: theme.palette.text.primary,
        }}
      >
        {t('myProfile.myProfilePage.iLiveIn.question')}
      </Typography>
      <FormControl style={{ width: '100%' }}>
        <Controller
          name="city"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              options={options}
              getOptionLabel={(option) => option.label || ''}
              isOptionEqualToValue={(option, val) => option.value === val.value}
              value={value || null}
              onChange={(_, data) => {
                onChange(data);
                if (data) {
                  setSelectedCity(data);
                } else {
                  setSelectedCity(null);
                }
              }}
              onInputChange={(_, newInputValue) => {
                setInputValue(newInputValue);
                if (!newInputValue) {
                  setValue('city', defaultCitySearch);
                  setSelectedCity(null);
                }
              }}
              loading={loading}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label={t('myProfile.myProfilePage.iLiveIn.text')}
                  startIcon={<SearchIcon />}
                  placeholder={t('myProfile.myProfilePage.iLiveIn.textSelect')}
                  error={!!errors.city}
                  helperText={typeof errors.city?.message === 'string' ? errors.city.message : undefined}
                />
              )}
            />
          )}
        />
      </FormControl>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button variant="primary" sx={{ width: '150px' }} onClick={handleSave}>
          {tcommon('save')}
        </Button>
      </Box>
    </Box>
  );
};

export default CitySearchForm;
