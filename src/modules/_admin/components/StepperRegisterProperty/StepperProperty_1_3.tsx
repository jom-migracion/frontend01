import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  FormControl,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import StepperWrapperLinear from './StepperWrapperLinear';
import StepperWrapperProps from '@/models/interfaces/StepperWrapperProps';
import PropertyCardStep from './PropertyCardStep';
import { useForm, Controller } from 'react-hook-form';
import {
  stepperProperty_1_3formSchema,
  TypeStepperProperty_1_3formSchema,
} from '../../validations/stepperProperty_1_3Form.scheme';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useGet } from '@/hooks/api';
import { CityOption, defaultCity, defaultCounty, ParametricsCityResponse, ProvinceOption } from '@/models/interfaces/ParametricsCityResponse';

const StepperProperty_1_3: React.FC<StepperWrapperProps> = ({
  stepsCount,
  activeStep,
  step,
  onSubmit,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [inputProvince, setInputProvince] = useState('');
  const [departmentValue, setDepartmentValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<CityOption[]>([]);
  const [loadingProv, setLoadingProv] = useState(false);
  const [province, setProvinces] = useState<ProvinceOption[]>([]);

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    setValue
  } = useForm<TypeStepperProperty_1_3formSchema>({
    defaultValues: {},
    mode: 'onChange',
    resolver: zodResolver(stepperProperty_1_3formSchema),
  });

  const {
    refetch,
  } = useGet<ParametricsCityResponse>(
    'ParametricsCity',
    `/Parametrics/City/${inputValue}`,
    {},
    false
  );

  const { refetch: refetchProvinces } = useGet<ParametricsCityResponse>(
    'ParametricsProvince',
    `/Parametrics/Locations/city/${departmentValue}`,
    {},
    false
  );

  const internalSubmit = (data: any) => {
    data = {...data, inputProvince}
    onSubmit && onSubmit(data);
  };

  const filterProvinces = useCallback(async () => {
    if (!departmentValue) { // Solo si departmentValue está definido
      setProvinces([]);
      return;
    }
    setLoadingProv(true);
    try {
      const { data } = await refetchProvinces();

      const newProvinces: ProvinceOption[] = [];

      data?.data.forEach((country) => {
        country.states.forEach((state) => {
          state.counties.forEach((county) => {
            // Asegurarse de que solo se añaden condados únicos si es necesario
            const exists = newProvinces.some(p => p.countyId === county.countyId);
            if (!exists) {
              newProvinces.push({
                countyId: county.countyId,
                name: county.name,
              });
            }
          });
        });
      });
      setProvinces(newProvinces);
    } catch (error) {
      setProvinces([]);
    }
    setLoadingProv(false);
  }, [departmentValue, refetchProvinces]); 

  const fetchDepartments = useCallback(async() => {
    setLoading(true);
    try {
      const { data } = await refetch(); // <-- Usa el resultado directamente

      const cities: CityOption[] = [];

      data?.data.forEach((country) => {
        country.states.forEach((state) => {
          state.counties.forEach((county) => {
            county.cities.forEach((city) => {
              cities.push({
                countryId: country.countryId,
                stateId: state.stateId,
                province: county.name,
                value: city.cityId,
                label: `${state.name}, ${country.name}`,
                cityName: state.name,
              });
            });
          });
        });
      });

      setOptions(cities);
    } catch (error) {      
      setOptions([]);
    }
    setLoading(false);
  }, [inputValue, refetch]);

  useEffect(() => {
    if (inputValue.length >= 3) {
      const timer = setTimeout(() => {
        fetchDepartments();
      }, 500); // Debounce para evitar muchas llamadas mientras se escribe

      return () => clearTimeout(timer);
    } else {
      setOptions([]);
    }
  }, [inputValue]);

  useEffect(() => {
    // Cuando departmentValue cambia, limpiamos la provincia seleccionada y cargamos las nuevas provincias
    setValue('county', defaultCounty); 
    setProvinces([]); 
    if (departmentValue) {
      const timer = setTimeout(() => {
        filterProvinces();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [departmentValue, filterProvinces, setValue]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <form key={step} onSubmit={onSubmit ? handleSubmit(internalSubmit) : undefined}>
        <Grid container spacing={1} columns={16} sx={{ mt: 10 }}>
          <Grid size={{ md: 8, xs: 16 }}>
            <PropertyCardStep step={step} activeStep={activeStep} />
          </Grid>
          <Grid size={{ md: 8, xs: 16 }}>
            <Card
              sx={{ height: '100%', boxSizing: 'border-box', width: '100%', boxShadow: 'none' }}
            >
              <Typography sx={{ mt: 1, ml: 4, mr: 20, fontWeight: 600, fontSize: '20px' }}>
                Confirma tu dirección
              </Typography>
              <Typography
                sx={{ ml: 4, mr: 5, fontWeight: 300, fontSize: '15px', color: '#000000' }}
              >
                Solo compartiremos tu dirección con los huéspedes que hayan hecho una reservación
              </Typography>
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  flexDirection: 'column',
                  ml: 2,
                  mr: 5,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Stack mt={1} mr={1}>
                    <FormControl sx={{ width: '560px' }}>
                      <Controller
                        name="city"
                        control={control}
                        rules={{ required: 'Este campo es obligatorio' }}
                        render={({ field: { onChange, value } }) => (
                          <Autocomplete
                            id="autocomplete-departamento"
                            options={options}
                            getOptionLabel={(option) => option.label || ''}
                            isOptionEqualToValue={(option, val) => option.value === val.value}
                            value={value || null}
                            onChange={(_, data) => {
                              onChange(data);
                              if (data) {
                                setDepartmentValue(data.cityName.toLowerCase());
                              } else {
                                setDepartmentValue('');
                                setValue('county', defaultCounty); 
                                setProvinces([]);
                              }
                            }}
                            onInputChange={(_, newInputValue) => {                           
                              setInputValue(newInputValue);
                              if (!newInputValue) {
                                setValue('city', defaultCity);
                                setValue('county', defaultCounty);
                                setDepartmentValue('');
                                setProvinces([]);
                              }
                            }}
                            loading={loading}
                            clearOnEscape
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Departamento"
                                focused
                                placeholder="Escribe al menos 3 letras"
                                color="secondary"
                                error={!!errors.city}
                                helperText={errors.city?.message}
                              />
                            )}
                          />
                        )}
                      />
                    </FormControl>
                    <FormControl sx={{ width: '560px', mt:2 }}>
                      <Controller
                        name="county"
                        control={control}
                        rules={{ required: 'Este campo es obligatorio' }}
                        render={({ field: { onChange, value } }) => (
                          <Autocomplete
                            id="autocomplete-provincia"
                            options={province} // Ahora las opciones provienen de province
                            getOptionLabel={(option) => option.name || ''}
                            // Es importante que isOptionEqualToValue compare propiedades únicas y estables
                            isOptionEqualToValue={(option, val) => option.countyId === val.countyId}
                            value={value || null} // Asegura que el valor sea null si no hay selección
                            onChange={(_, data) => onChange(data)} // Actualiza el valor en react-hook-form
                            onInputChange={(_, newInputValueProvince) => {
                              // Esto es para la búsqueda en la provincia (si fuera necesario, no tan común aquí)
                              setInputProvince(newInputValueProvince);
                            }}
                            loading={loadingProv}
                            clearOnEscape
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Provincia"
                                focused
                                color="secondary"
                                error={!!errors.county}
                                helperText={errors.county?.message}
                              />
                            )}
                          />
                        )}
                      />
                    </FormControl>
                    <FormControl sx={{ width: '560px' }}>
                      <TextField
                        id="2"
                        label="Dirección"
                        variant="outlined"
                        sx={{ mt: 2 }}
                        placeholder="Av. Santos Dumont 6to anillo"
                        focused
                        color="secondary"
                        {...register('address1')}
                        error={!!errors.address1}
                        helperText={errors.address1?.message}
                      />
                    </FormControl>
                    <FormControl sx={{ width: '560px' }}>
                      <TextField
                        id="3"
                        label="Apartamento, piso, edificio (si corresponde)"
                        variant="outlined"
                        sx={{ mt: 2 }}
                        placeholder="Apartamento 417"
                        focused
                        color="secondary"
                        {...register('address2')}
                        error={!!errors.address2}
                        helperText={errors.address2?.message}
                      />
                    </FormControl>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
            <Grid sx={{ ml: 3, width: '82%' }}>
              <StepperWrapperLinear stepsCount={stepsCount} activeStep={activeStep} />
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
export default StepperProperty_1_3;
