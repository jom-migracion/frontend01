import {
  Box,
  FormControl,
  Stack,
  Typography,
  Button,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useForm } from 'react-hook-form';
import {
  stepperProperty_1_3formSchema,
  TypeStepperProperty_1_3formSchema,
} from '../../validations/stepperProperty_1_3Form.scheme';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import CustomTextField from '@/components/CustomTextField';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import assertEnv from '@/config/env';
import { useStepValidation } from '@/context/FormStepContext';
import { PropertyRegistrationProps_1_3 } from '../../interface/IPropertyRegistrationProps';
import { usePropertyRegistration } from '@/store/listingRentPropertyRegistration.store';
import { useTranslation } from 'react-i18next';
import GoogleSearch from '@/components/GoogleSearch';
import { PropsInitialStateSearch } from '@/models/interfaces/PropsInitialStateSearch';
import { GOOGLE_MAPS_LIBRARIES } from '@/common/constants/googleMapLibraries';
import { useSnackbar } from '@/context/SnackbarContext';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import ErrorIcon from '@mui/icons-material/Error';
import CustomHouseMarker from '@/components/CustomHouseMarker';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const latitudeDefault = -17.7863;
const longitudeDefault = -63.1812;

export const PropertyRegistrationStep_1_3: React.FC<PropertyRegistrationProps_1_3> = ({
  onChange,
}) => {
  // state
  const [open, setOpen] = React.useState(false);

  // store
  const { address, latitude, longitude } = usePropertyRegistration(
    (state) => state.data.listingData
  );

  // estado local para el mapa
  const [mapCenter, setMapCenter] = useState({
    lat: latitude ?? latitudeDefault,
    lng: longitude ?? longitudeDefault,
  });
  const [inputValue, setInputValue] = useState<string>(address?.address1 ?? '');
  const [isSearching, setIsSearching] = useState(false);
  const [isSatelliteView, setIsSatelliteView] = useState(false);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);

  const [dataGoogleSearch, setDataGoogleSearch] = useState<PropsInitialStateSearch>({
    latitude: null,
    longitude: null,
    country: '',
    state: '',
    county: '',
    city: '',
    street: '',
    postalCode: '',
  });

  // hooks
  const { setStepValid } = useStepValidation();
  const { t } = useTranslation('translation', { keyPrefix: 'admin.registerProperty.step3' });
  const showSnackbar = useSnackbar();
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const {
    register,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<TypeStepperProperty_1_3formSchema>({
    defaultValues: {
      address1: address?.address1 ?? '',
      address2: address?.address2 ?? '',
      department: address?.city?.city ?? '',
      city: address?.city?.county ?? '',
      position: latitude && longitude ? { lat: latitude, lng: longitude } : { lat: latitudeDefault, lng: longitudeDefault },
    },
    mode: 'onChange',
    resolver: zodResolver(stepperProperty_1_3formSchema),
  });

  const values = watch();
  const previousValuesRef = useRef<TypeStepperProperty_1_3formSchema | null>(null);
  const position = watch('position');

  useEffect(() => {
    setStepValid(2, isValid);
    const valuesChanged = JSON.stringify(previousValuesRef.current) !== JSON.stringify(values);
    const hasValues =
      values && typeof values === 'object' && values.department && values.city && values.address1;
    if ((valuesChanged || previousValuesRef.current === null) && hasValues) {
      previousValuesRef.current = values;
      onChange({ step1_3: { ...values, search: dataGoogleSearch } });
    }
  }, [isValid, onChange, setStepValid, values]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: assertEnv.VITE_KEY_SEARCH_GOOGLE,
    libraries: GOOGLE_MAPS_LIBRARIES,
    language: 'es',
  });

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;

      const geocoder = new google.maps.Geocoder();

      const newPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };

      setValue('position', newPosition, { shouldValidate: true });

      geocoder.geocode({ location: newPosition }, (results, status) => {
        if (status === 'OK') {
          if (results && results[0]) {
            const { city, country, county, postalCode, state, street } =
              results[0].address_components.reduce(
                (acc, component) => {
                  const type = component.types[0];
                  switch (type) {
                    case 'street_number':
                      acc.street = `${component.long_name} ${acc.street}`.trim();
                      break;
                    case 'route':
                      acc.street = `${acc.street} ${component.long_name}`.trim();
                      break;
                    case 'political':
                      acc.street = `${acc.street} ${component.long_name}`.trim();
                      break;
                    case 'locality':
                      acc.city = component.long_name;
                      break;
                    case 'administrative_area_level_2':
                      acc.county = component.long_name;
                      break;
                    case 'administrative_area_level_1':
                      acc.state = component.long_name;
                      break;
                    case 'country':
                      acc.country = component.long_name;
                      break;
                    case 'postal_code':
                      acc.postalCode = component.long_name;
                      break;
                  }
                  return acc;
                },
                {
                  street: '',
                  country: '',
                  state: '',
                  county: '',
                  city: '',
                  postalCode: '',
                }
              );

            setDataGoogleSearch({
              latitude: newPosition.lat,
              longitude: newPosition.lng,
              country: country,
              state: state,
              county: county,
              city: city,
              street: results[0].formatted_address,
              postalCode: postalCode,
            });

            setValue('department', state, { shouldValidate: true });
            setValue('city', city ?? county, { shouldValidate: true });
            setValue('address1', street || 'sin dirección', { shouldValidate: true });
            setInputValue(results[0].formatted_address);
          } else {
            showSnackbar('No se encontraron resultados', 'info');
          }
        } else {
          showSnackbar(`Error en la geocodificación: ${status}.`, 'error');
        }
      });
    },
    [setValue]
  );

  const geocodeAddress = useCallback(
    (address: string) => {
      if (!address.trim() || !isLoaded) return;

      setIsSearching(true);
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode(
        {
          address: address,
          componentRestrictions: { country: 'BO' },
        },
        (results, status) => {
          setIsSearching(false);

          if (status === 'OK' && results && results[0]) {
            const result = results[0];
            // const lat = result.geometry.location.lat();
            // const lng = result.geometry.location.lng();

            // const { city, county, state, street } = result.address_components.reduce(
            const { street } = result.address_components.reduce(
              (acc, component) => {
                // const {} = result.address_components.reduce((acc, component) => {
                const type = component.types[0];
                switch (type) {
                  case 'street_number':
                    acc.street = `${component.long_name} ${acc.street}`.trim();
                    break;
                  case 'route':
                    acc.street = `${acc.street} ${component.long_name}`.trim();
                    break;
                  case 'locality':
                    acc.city = component.long_name;
                    break;
                  case 'administrative_area_level_2':
                    acc.county = component.long_name;
                    break;
                  case 'administrative_area_level_1':
                    acc.state = component.long_name;
                    break;
                  case 'country':
                    acc.country = component.long_name;
                    break;
                  case 'postal_code':
                    acc.postalCode = component.long_name;
                    break;
                }
                return acc;
              },
              {
                street: '',
                country: '',
                state: '',
                county: '',
                city: '',
                postalCode: '',
              }
            );

            /*const newPosition = { lat, lng };
          setMapCenter(newPosition);
          setValue('position', newPosition, { shouldValidate: true });
          setValue('department', state, { shouldValidate: true });
          setValue('city', city || county, { shouldValidate: true });
          setValue('address1', street, { shouldValidate: true });
          setInputValue(result.formatted_address);
          
          setDataGoogleSearch({
            latitude: lat,
            longitude: lng,
            country: country,
            state: state,
            county: county,
            city: city,
            street: result.formatted_address,
            postalCode: postalCode,
            formatted_address: result.formatted_address,
          });*/

            // if (!street && !state && (!city || !county)) {
            if (!street) {
              handleClickOpen();
            } else {
              showSnackbar('Dirección encontrada y validada', 'success', 4000);
            }
          } else {
            handleClickOpen();
            // showSnackbar(
            //   'No se pudo validar esta dirección. Por favor, haz clic en el mapa para marcar la ubicación exacta.',
            //   'warning',
            //   6000
            // );
          }
        }
      );
    },
    [isLoaded, setValue, showSnackbar]
  );

  const handleDataGoogleSearch = (values: PropsInitialStateSearch) => {

    const lat = values?.latitude;
    const lng = values?.longitude;

    if (typeof lat === 'number' && typeof lng === 'number' && lat !== 0 && lng !== 0) {
      const newPosition = { lat, lng };
      setMapCenter(newPosition);
      setValue('position', newPosition, { shouldValidate: true });
      setValue('department', values.state, { shouldValidate: true });
      setValue('city', values.city || values.county, { shouldValidate: true });
      setValue('address1', values.street || 'sin dirección', { shouldValidate: true });
      setInputValue(values.formatted_address || '');

      setDataGoogleSearch({
        latitude: lat,
        longitude: lng,
        country: values.country,
        state: values.state,
        county: values.county,
        city: values.city,
        street: values.street,
        postalCode: values.postalCode,
        formatted_address: values.formatted_address,
      });
    } else {
      // Si se limpia el buscador, resetear solo el input pero mantener el marker si existe
      setInputValue('');
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Box sx={{ flexGrow: 1 }}>
        {/* Título y descripción (Mobile) */}
        <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 2 }}>
          <Typography sx={{ fontWeight: 600, mb: 1, fontSize: '1.5rem' }}>
            {t('title2', {
              defaultValue: 'Confirma tu ubicación',
            })}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 1, fontSize: '0.875rem', lineHeight: '1.25rem' }}>
            {t('subtitle', {
              defaultValue: 'Asegúrate de que el marcador esté en el lugar correcto.',
            })}
            <br />
            {t('dragInstruction', {
              defaultValue: 'Puedes arrastrarlo para ajustarlo.'
            })}
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ flexDirection: { xs: 'column-reverse', md: 'row' } }}>
          {/* Columna Izquierda - Formulario */}
          <Grid size={{ md: 5, xs: 12 }} sx={{ mt: '5px' }}>
            <Box>
              {/* Título y descripción (Desktop) */}
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Typography sx={{ fontWeight: 600, mb: 1, fontSize: '1.5rem' }}>
                  {t('title2', {
                    defaultValue: 'Confirma tu ubicación',
                  })}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3, fontSize: '0.875rem', lineHeight: '1.25rem' }}>
                  {t('subtitle', {
                    defaultValue: 'Asegúrate de que el marcador esté en el lugar correcto.',
                  })}
                  <br />
                  {t('dragInstruction', {
                    defaultValue: 'Puedes arrastrarlo para ajustarlo.'
                  })}
                </Typography>
              </Box>

              {/* Formulario */}
              <Stack spacing={2.5}>

                {/* Calle y Número */}
                <FormControl fullWidth>
                  <Typography
                    variant="caption"
                    sx={{
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      fontSize: '10px',
                      color: 'text.secondary',
                      mb: 0.5,
                    }}
                  >
                    {t('streetAndNumber', {
                      defaultValue: 'Calle y Número'
                    })}
                  </Typography>
                  <CustomTextField
                    fullWidth
                    disabled
                    sx={{
                      bgcolor: 'white',
                    }}
                    placeholder={t('form.placeHolderAddress')}
                    {...register('address1', {
                      onChange: (e) => {
                        const newValue = e.target.value;

                        // Limpiar timeout anterior
                        if (debounceTimeoutRef.current) {
                          clearTimeout(debounceTimeoutRef.current);
                        }

                        // Si hay texto, esperar 2 segundos antes de buscar
                        if (newValue && newValue.length > 3) {
                          debounceTimeoutRef.current = setTimeout(() => {
                            geocodeAddress(newValue);
                          }, 2000);
                        }
                      },
                    })}
                    error={!!errors.address1}
                    helperText={
                      errors.address1?.message ||
                      (isSearching ? 'Validando dirección...' : '') ||
                      (!position && values.address1
                        ? 'Haz clic en el mapa para confirmar la ubicación exacta'
                        : '')
                    }
                  />
                </FormControl>

                {/* Ciudad y Departamento en dos columnas */}
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <FormControl fullWidth>
                      <Typography
                        variant="caption"
                        sx={{
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          fontSize: '10px',
                          color: 'text.secondary',
                          mb: 0.5,
                        }}
                      >
                        {t('city', {
                          defaultValue: 'Ciudad'
                        })}
                      </Typography>
                      <CustomTextField
                        {...register('city')}
                        fullWidth
                        placeholder={t('form.placeHolderCity')}
                        error={!!errors.city}
                        disabled
                        helperText={errors.city?.message}
                      />
                    </FormControl>
                  </Grid>
                  <Grid size={12}>
                    <FormControl fullWidth>
                      <Typography
                        variant="caption"
                        sx={{
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          fontSize: '10px',
                          color: 'text.secondary',
                          mb: 0.5,
                        }}
                      >
                        {t('department', {
                          defaultValue: 'Departamento'
                        })}
                      </Typography>
                      <CustomTextField
                        {...register('department')}
                        fullWidth
                        placeholder={t('form.placeHolderDepartment')}
                        error={!!errors.department}
                        disabled
                        helperText={errors.department?.message}
                      />
                    </FormControl>
                  </Grid>
                </Grid>

                {/* Apto, Suite, etc. (opcional) */}
                <FormControl fullWidth>
                  <Typography
                    variant="caption"
                    sx={{
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      fontSize: '10px',
                      color: 'text.secondary',
                      mb: 0.5,
                    }}
                  >
                    {t('references', {
                      defaultValue: 'REFERENCIAS'
                    })}
                  </Typography>
                  <CustomTextField
                    fullWidth
                    sx={{
                      bgcolor: 'white',
                    }}
                    placeholder={t('form.placeHolderAddress2')}
                    {...register('address2')}
                    error={!!errors.address2}
                    helperText={errors.address2?.message}
                  />
                </FormControl>

                {/* Mensaje de privacidad */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1.5,
                    p: 2,
                    backgroundColor: 'grey.50',
                    borderRadius: 2,
                    mt: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: 'grey.200',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <VisibilityOffOutlinedIcon fontSize="medium" color="primary" />
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                      {t('privacyTitle', {
                        defaultValue: 'Tu dirección es privada'
                      })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('privacyDescription', {
                        defaultValue: 'Solo compartiremos tu ubicación exacta con los huéspedes que tengan una reserva confirmada.'
                      })}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* Columna Derecha - Mapa */}
          <Grid size={{ md: 7, xs: 12 }}>
            <Box sx={{ position: 'sticky', top: 20 }}>
              {/* Contenedor del Mapa con Buscador flotante */}
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid',
                  borderColor: 'grey.300',
                }}
              >
                {isLoaded && (
                  <Box sx={{ p: 2, bgcolor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {/* Buscador flotante sobre el mapa */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 25,
                        left: 40,
                        right: 40,
                        zIndex: 2,
                      }}
                    >
                      <GoogleSearch
                        value={inputValue}
                        onChange={(value: string) => {
                          setInputValue(value);
                        }}
                        handleDataGoogleSearch={handleDataGoogleSearch}
                        fullWidth
                        placeholder={t('searchPlaceholder')}
                      />
                    </Box>

                    {/* Mapa */}
                    <GoogleMap
                      onLoad={onMapLoad}
                      onClick={handleMapClick}
                      mapContainerStyle={{
                        width: '100%',
                        height: '550px',
                        borderRadius: '16px',
                      }}
                      center={mapCenter}
                      zoom={15}
                      options={{
                        draggableCursor: 'crosshair',
                        fullscreenControl: false,
                        streetViewControl: false,
                        mapTypeControl: false,
                        zoomControl: true,
                        zoomControlOptions: {
                          position: 9, // RIGHT_BOTTOM (posición inferior derecha)
                        },
                        gestureHandling: 'greedy',
                      }}
                    >
                      {position && (
                        <CustomHouseMarker
                          position={position as google.maps.LatLngLiteral}
                          text={t('locationLabel')}
                        />
                      )}
                    </GoogleMap>

                    {/* Botón confirmar en mapa */}
                    {position && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 80,
                          left: 20,
                          zIndex: 1,
                        }}
                      >
                        <Button
                          variant="contained"
                          startIcon={
                            <Box
                              component="span"
                              sx={{
                                fontSize: '1.1rem',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              📍
                            </Box>
                          }
                          sx={{
                            backgroundColor: 'white',
                            color: 'text.primary',
                            fontWeight: 700,
                            px: 3,
                            py: 1.5,
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                            textTransform: 'uppercase',
                            fontSize: '13px',
                            '&:hover': {
                              backgroundColor: 'grey.100',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                            },
                          }}
                        >
                          {t('confirmOnMapBtn', {
                            defaultValue: 'CONFIRMAR EN MAPA'
                          })}
                        </Button>
                      </Box>
                    )}
                  </Box>
                )}
                {errors.position && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 10,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{
                        bgcolor: 'white',
                        px: 2,
                        py: 1,
                        borderRadius: 1,
                        boxShadow: 2,
                      }}
                    >
                      {errors.position.message}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Información debajo del mapa */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mt: 2,
                  px: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ErrorOutlineOutlinedIcon fontSize="small" color="info" />
                  </Box>
                  <Typography sx={{ fontSize: '13px' }} color="text.secondary">
                    {t('dragInstruction2', {
                      defaultValue: 'Arrastra el mapa para centrar tu propiedad',
                    })}
                  </Typography>
                </Box>
                <Button
                  size="small"
                  onClick={() => {
                    if (mapRef.current) {
                      if (isSatelliteView) {
                        mapRef.current.setMapTypeId('roadmap');
                        setIsSatelliteView(false);
                      } else {
                        mapRef.current.setMapTypeId('satellite');
                        setIsSatelliteView(true);
                      }
                    }
                  }}
                  sx={{
                    textTransform: 'none',
                    color: 'text.secondary',
                    // textDecoration: 'underline',
                    fontSize: '11px',
                    '&:hover': {
                      textDecoration: 'underline',
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  {isSatelliteView ? t('map') : t('satellite')}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-map"
        slotProps={{
          paper: {
            sx: {
              borderRadius: '8px',
              maxWidth: '450px',
              p: 1,
            },
          },
        }}
      >
        <DialogContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <ErrorIcon
              sx={{
                color: 'error.main',
                fontSize: 40,
                mr: 2,
                mt: 0.5,
              }}
            />

            <Box>
              <DialogTitle
                sx={{
                  p: 0,
                  fontWeight: 'bold',
                  fontSize: '1.25rem',
                }}
              >
                {t('addressNotFound', {
                  defaultValue: 'No reconocemos esa dirección'
                })}
              </DialogTitle>

              <Typography
                sx={{
                  p: 0,
                  color: 'text.secondary',
                  fontSize: '1rem',
                  mt: 0.5,
                }}
              >
                {t('question', {
                  defaultValue: '¿Confirmas que se trata de la dirección correcta?'
                })}
              </Typography>
            </Box>
          </Box>

          <DialogActions sx={{ p: 0, justifyContent: 'space-between', mt: 3 }}>
            <Button onClick={handleClose} color="primary" sx={{ textTransform: 'none' }}>
              {t('editAction', {
                defaultValue: 'No, quiero editar la dirección'
              })}
            </Button>

            <Button
              onClick={handleClose}
              variant="contained"
              disableElevation
              sx={{
                textTransform: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                py: 1,
                px: 2,
              }}
            >
              {t('confirmAction', {
                defaultValue: 'Sí, mi dirección es correcta'
              })}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};
