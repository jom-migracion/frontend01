import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Stack,
  Typography,
  IconButton,
  Link,
  Divider,
  Alert,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Grid from '@mui/material/Grid2';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CustomTextField from '@/components/CustomTextField';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { useTranslation } from 'react-i18next';
import GoogleSearch from '@/components/GoogleSearch';
import { PropsInitialStateSearch } from '@/models/interfaces/PropsInitialStateSearch';
import { GOOGLE_MAPS_LIBRARIES } from '@/common/constants/googleMapLibraries';
import { Address } from '@/models/interfaces/ListingRentResponseStep';
import assertEnv from '@/config/env';
import {
  stepperProperty_1_3formSchema,
  TypeStepperProperty_1_3formSchema,
} from '@/modules/_admin/validations/stepperProperty_1_3Form.scheme';
import { useCustomMutationByUrl } from '@/hooks/api';
import LoadingThreeDotsJumping from '@/components/LoadingThreeDotsJumping';
import { useSnackbar } from '@/context/SnackbarContext';
import { TransitionProps } from '@mui/material/transitions';
import ErrorIcon from '@mui/icons-material/Error';
import Slide from '@mui/material/Slide';
import CustomHouseMarker from '@/components/CustomHouseMarker';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FormularioUbicacion: React.FC<{
  listingRentId: number;
  addressEdit: Address;
  latitude: number;
  longitude: number;
}> = ({ listingRentId, addressEdit, latitude, longitude }) => {
  const [inputValue, setInputValue] = useState<string>(addressEdit?.address1 ?? '');
  const [open, setOpen] = React.useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSatelliteView, setIsSatelliteView] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useState;
  const [mapCenter, setMapCenter] = useState({
    lat: latitude,
    lng: longitude,
  });

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

  // api
  const { mutate: UpdatePropertyLocation, isPending } = useCustomMutationByUrl('put');

  // hooks
  const { t } = useTranslation('translation', { keyPrefix: 'admin.registerProperty.step3' });
  const { t: tcommon } = useTranslation();
  const mapRef = useRef<google.maps.Map | null>(null);
  const showSnackbar = useSnackbar();
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: assertEnv.VITE_KEY_SEARCH_GOOGLE,
    libraries: GOOGLE_MAPS_LIBRARIES,
    language: 'es',
  });

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
    watch,
  } = useForm<TypeStepperProperty_1_3formSchema>({
    defaultValues: {
      address1: addressEdit?.address1,
      address2: addressEdit?.address2,
      department: addressEdit?.city?.state || '',
      city: addressEdit?.city?.county || '',
      position: latitude && longitude ? { lat: latitude, lng: longitude } : undefined,
    },
    mode: 'onChange',
    resolver: zodResolver(stepperProperty_1_3formSchema),
  });

  const position = watch('position');

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
            setValue('city', county ?? city, { shouldValidate: true });
            setValue('address1', street, { shouldValidate: true });
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

            const { city, county, state, street } = result.address_components.reduce(
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

            if (!street && !state && (!city || !county)) {
              handleClickOpen();
            } else {
              showSnackbar('Dirección encontrada y validada', 'success', 4000);
            }
          } else {
            handleClickOpen();
          }
        }
      );
    },
    [isLoaded, setValue, showSnackbar]
  );

  const handleDataGoogleSearch = (values: PropsInitialStateSearch) => {
    const lat = values.latitude;
    const lng = values.longitude;

    if (typeof lat === 'number' && typeof lng === 'number' && lat !== 0 && lng !== 0) {
      const newPosition = { lat, lng };
      setMapCenter(newPosition);
      setValue('position', newPosition, { shouldValidate: true });
      setValue('department', values.state, { shouldValidate: true });
      setValue('city', values.city || values.county, { shouldValidate: true });
      setValue('address1', values.street, { shouldValidate: true });
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

  const handleSaveChanges = async (data: any) => {
    const { postalCode, city, county, state, country } = dataGoogleSearch;

    const params = {
      Country: country.length > 0 ? country : addressEdit?.city?.country,
      State: state.length > 0 ? state : addressEdit?.city?.state,
      County: county.length > 0 ? county : addressEdit?.city?.county,
      City: city.length > 0 ? city : addressEdit?.city?.city,
      latitude: data?.position?.lat ?? latitude,
      longitude: data?.position?.lng ?? longitude,
      address1: data?.address1 ?? addressEdit.address1,
      address2: data?.address2 ?? addressEdit.address2,
      zipCode: postalCode.length > 0 ? postalCode : addressEdit.zipCode,
    };

    const urlParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined) {
        urlParams.append(key, String(value));
      }
    }

    const url = `/Host/ListingRent/${listingRentId}/UpdatePropertyLocation?${urlParams.toString()}`;

    UpdatePropertyLocation(
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {<LoadingThreeDotsJumping open={isPending} modal={true} />}
        <Typography fontWeight="600" sx={{ fontSize: '18px', mb: 4, mt: -1.5, color: '#222', ml: 0 }}>
          {tcommon('admin.editProperty.7.title')}
        </Typography>
        <Divider sx={{ mx: -10, my: -2.9 }} />       
      <Box
        sx={{ width: '100%', py: 3, maxWidth: 800 }}
        component="form"
        onSubmit={handleSubmit(handleSaveChanges)}
      >

        <Box sx={{ mb: 4 }}>          
          <Typography 
            fontWeight="600" 
            sx={{ fontSize: '16px', mb: 1, color: '#222', mt: 1.5 }}
          >
            {tcommon('admin.editProperty.7.subtitle')}
          </Typography>
          <Typography 
            sx={{ fontSize: '13px', mb: 3, color: '#717171' }}
          >
            {tcommon('admin.editProperty.7.description')}
          </Typography>
        </Box>

        <Card sx={{ boxShadow: 'none', border: 'none' }}>
          <CardContent sx={{ p: 0 }}>
                <Stack spacing={3}>
                  {/* País/Región - Solo lectura */}
                  {/* <FormControl>
                    <Typography 
                      sx={{ 
                        fontSize: 12, 
                        fontWeight: 600, 
                        mb: 0.5, 
                        color: '#717171',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      País / Región
                    </Typography>
                    <CustomTextField
                      fullWidth
                      value="Bolivia"
                      disabled
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#f7f7f7'
                        }
                      }}
                    />
                  </FormControl> */}

                  {/* Mapa con buscador integrado */}
                  <FormControl>
                    {isLoaded && (
                      <Box 
                        sx={{ 
                          position: 'relative',
                          border: '2px solid #E5E7EB',
                          borderRadius: 3,
                          overflow: 'hidden',
                          p: 2,
                          // backgroundColor: '#f0f8ff'
                        }}
                      >
                        {/* Buscador sobre el mapa */}
                        <Box sx={{ mb: 2, position: 'relative', zIndex: 2 }}>
                          <GoogleSearch
                            value={inputValue}
                            onChange={(value: string) => {
                              setInputValue(value);
                            }}
                            handleDataGoogleSearch={handleDataGoogleSearch}
                            fullWidth
                            placeholder={tcommon('admin.editProperty.7.searchPlaceholder')}
                          />
                        </Box>

                        {/* Mapa */}
                        <Box sx={{ position: 'relative' }}>
                          <GoogleMap
                            onLoad={onMapLoad}
                            onClick={handleMapClick}
                            mapContainerStyle={{
                              width: '100%',
                              height: '350px',
                              borderRadius: 12,
                            }}
                            center={mapCenter}
                            zoom={15}
                            options={{
                              draggableCursor: 'crosshair',
                              fullscreenControl: false,
                              streetViewControl: false,
                              mapTypeControl: false,
                              zoomControl: false,
                            }}
                          >
                            {position && (
                              <CustomHouseMarker position={position as google.maps.LatLngLiteral} text={tcommon('admin.editProperty.7.title')} />
                            )}
                          </GoogleMap>

                          {/* Botón Confirmar en mapa */}
                          {/* <Button
                            variant="contained"
                            startIcon={<Box component="span" sx={{ fontSize: 18 }}>📍</Box>}
                            sx={{
                              position: 'absolute',
                              bottom: 80,
                              left: '50%',
                              transform: 'translateX(-50%)',
                              backgroundColor: '#fff',
                              color: '#222',
                              fontWeight: 600,
                              textTransform: 'none',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                              borderRadius: 3,
                              px: 2,
                              py: 1,
                              fontSize: 14,
                              '&:hover': {
                                backgroundColor: '#f7f7f7'
                              },
                              zIndex: 1
                            }}
                            onClick={() => {
                              if (mapRef.current && position) {
                                mapRef.current.panTo(position as google.maps.LatLngLiteral);
                              }
                            }}
                          >
                            Confirmar en mapa
                          </Button> */}

                          {/* Controles de zoom personalizados */}
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 80,
                              right: 15,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 0.5,
                              zIndex: 1
                            }}
                          >
                            <IconButton
                              sx={{
                                backgroundColor: '#fff',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                '&:hover': { backgroundColor: '#f7f7f7' },
                                width: 36,
                                height: 36
                              }}
                              onClick={() => {
                                if (mapRef.current) {
                                  const currentZoom = mapRef.current.getZoom() || 15;
                                  mapRef.current.setZoom(currentZoom + 1);
                                }
                              }}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              sx={{
                                backgroundColor: '#fff',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                '&:hover': { backgroundColor: '#f7f7f7' },
                                width: 36,
                                height: 36
                              }}
                              onClick={() => {
                                if (mapRef.current) {
                                  const currentZoom = mapRef.current.getZoom() || 15;
                                  mapRef.current.setZoom(currentZoom - 1);
                                }
                              }}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>

                        {/* Información debajo del mapa */}
                        <Box 
                          sx={{ 
                            mt: 2, 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <InfoOutlinedIcon sx={{ fontSize: 18, color: '#0071c2' }} />
                            <Typography sx={{ fontSize: 13, color: '#222' }}>
                              {tcommon('admin.editProperty.7.dragInstruction')}
                            </Typography>
                          </Box>
                          <Link
                            href="#"
                            onClick={(e: React.MouseEvent) => {
                              e.preventDefault();
                              if (mapRef.current) {
                                const newMapType = isSatelliteView ? 'roadmap' : 'satellite';
                                mapRef.current.setMapTypeId(newMapType);
                                setIsSatelliteView(!isSatelliteView);
                              }
                            }}
                            sx={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: '#0071c2',
                              textDecoration: 'none',
                              '&:hover': { textDecoration: 'underline' }
                            }}
                          >
                            {isSatelliteView ? tcommon('admin.editProperty.7.viewMap') : tcommon('admin.editProperty.7.viewSatellite')}
                          </Link>
                        </Box>

                        {errors.position && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ mt: 1, display: 'block' }}
                          >
                            {errors.position.message}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </FormControl>

                  {/* Calle y Número */}
                  <FormControl>
                    <Typography 
                      sx={{ 
                        fontSize: '12px', 
                        fontWeight: 600, 
                        mb: 0.5, 
                        color: '#717171',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {tcommon('admin.editProperty.7.streetAndNumber')}
                    </Typography>
                    <CustomTextField
                      fullWidth
                      disabled
                      // placeholder={t('form.placeHolderAddress')}
                      {...register('address1', {
                        onChange: (e) => {
                          const newValue = e.target.value;

                          if (debounceTimeoutRef.current) {
                            clearTimeout(debounceTimeoutRef.current);
                          }

                          if (newValue && newValue.length > 10) {
                            debounceTimeoutRef.current = setTimeout(() => {
                              geocodeAddress(newValue);
                            }, 2000);
                          }
                        },
                      })}
                      error={!!errors.address1}
                      helperText={
                        errors.address1?.message ||
                        (isSearching ? tcommon('admin.editProperty.7.validateAddress') : '')
                      }
                    />
                  </FormControl>

                  {/* Ciudad y Departamento */}
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth>
                        <Typography 
                          sx={{ 
                            fontSize: '12px', 
                            fontWeight: 600, 
                            mb: 0.5, 
                            color: '#717171',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}
                        >
                          {tcommon('admin.editProperty.7.city')}
                        </Typography>
                        <CustomTextField
                          {...register('city')}
                          fullWidth
                          disabled
                          placeholder={t('form.placeHolderCity')}
                          error={!!errors.city}
                          helperText={errors.city?.message}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: '#f7f7f7'
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth>
                        <Typography 
                          sx={{ 
                            fontSize: '12px', 
                            fontWeight: 600, 
                            mb: 0.5, 
                            color: '#717171',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}
                        >
                          {tcommon('admin.editProperty.7.department')}
                        </Typography>
                        <CustomTextField
                          {...register('department')}
                          fullWidth
                          disabled
                          placeholder={t('form.placeHolderDepartment')}
                          error={!!errors.department}
                          helperText={errors.department?.message}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: '#f7f7f7'
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  {/* Apto, Suite, etc. (Opcional) */}
                  <FormControl>
                    <Typography 
                      sx={{ 
                        fontSize: '12px', 
                        fontWeight: 600, 
                        mb: 0.5, 
                        color: '#717171',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {tcommon('admin.editProperty.7.descriptionM')}                      
                    </Typography>
                    <CustomTextField
                      fullWidth
                      placeholder={t('form.placeHolderAddress2')}
                      {...register('address2')}
                      // error={!!errors.address2}
                      // helperText={errors.address2?.message}
                    />
                  </FormControl>
            <Alert 
              icon={<VisibilityOffOutlinedIcon sx={{ color: '#5b55c8' }} />}
              
              sx={{ 
                mt: 3,
                mb: 4,
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: 2,
                color: '#6b7280',
                fontSize: '13px',
              }}
            >
              <span style={{fontSize: '0.875rem', fontWeight: 600}}>{tcommon('admin.editProperty.7.privacyTitle')}</span><br />
              {/* {t('msgDescription')} */}
              {tcommon('admin.editProperty.7.privacyDescription')}
            </Alert> 
                </Stack>
              </CardContent>
        </Card>

        {/* Botones */}
        <Box sx={{           
          position: 'sticky',
          bottom: { xs: -26, md: -5 },
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
            type="submit"
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
          >
            {isPending ? tcommon('commonNames.saving') : tcommon('commonNames.saveChanges')}
          </Button>
        </Box>       
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
                {tcommon('admin.editProperty.7.addressNotRecognized')}
              </DialogTitle>

              <Typography
                sx={{
                  p: 0,
                  color: 'text.secondary',
                  fontSize: '1rem',
                  mt: 0.5,
                }}
              >
                {tcommon('admin.editProperty.7.confirmAddress')}
              </Typography>
            </Box>
          </Box>

          <DialogActions sx={{ p: 0, justifyContent: 'space-between', mt: 3 }}>
            <Button onClick={handleClose} color="primary" sx={{ textTransform: 'none' }}>
              {tcommon('admin.editProperty.7.editAddress')}
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
              {tcommon('admin.editProperty.7.addressIsCorrect')}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>      
    </>
  );
};

export default FormularioUbicacion;
