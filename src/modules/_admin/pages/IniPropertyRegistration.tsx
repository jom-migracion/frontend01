import { Box, Card, CardContent, Dialog, DialogContent, Divider, Icon, Typography, Checkbox, FormControlLabel, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import CustomCloseButton from '@/components/CustomCloseButton';
import useItemState from '@/hooks/userItemState';
import { useAuthContext } from '@/modules/_auth/context';
import HostForm from '@/modules/_auth/components/HostForm';
import { useNavigate } from 'react-router';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { GoogleMap, OverlayView, useLoadScript } from '@react-google-maps/api';
import assertEnv from '@/config/env';
import CustomMapMarker from '@/components/CustomMapMarker';
import { useGet } from '@/hooks/api';
import { IListingRentResumeResponse } from '../interface/IListingRentResume';
// import { usePropertyRegistration } from '@/store/listingRentPropertyRegistration.store';
// import LoadingThreeDotsJumping from '@/components/LoadingThreeDotsJumping';
import { GOOGLE_MAPS_LIBRARIES } from '@/common/constants/googleMapLibraries';
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined';
import { JomMarker } from '@/components/JomMarker';
import { RestClient } from '@/services/RestClient';
import { useSnackbar } from '@/context/SnackbarContext';
import { Helmet } from 'react-helmet-async';

const defaultMapCenter = {
  lat: -17.7832,
  lng: -63.1815,
};

const IniPropertyRegistration: React.FC = () => {
  // useState
  // const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [existingProperty, setExistingProperty] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const showSnackbar = useSnackbar();

  // store
  // const setDataListingRent = usePropertyRegistration((state) => state.setData);
  // const setContinueStepPublishing = usePropertyRegistration(
  //   (state) => state.setContinueStepPublishing
  // );
  // const resetState = usePropertyRegistration((state) => state.resetState);

  const fetchExistingProperty = async () => { 
    try {
      const response = await RestClient.get('/Acceptance/SERVICE_AGREEMENT');  
      const responseData = response?.data;
      
      if (responseData?.statusCode === '200' && responseData?.data && !responseData?.data?.alreadyAccepted) {        
        setExistingProperty(true);
      }
      // else {
      //   showSnackbar('No se encontraron propiedades existentes.', 'info');
      // }
    } catch (error) {
      showSnackbar('Error al verificar el acuerdo de servicio.', 'error');
      return false;
    }
  };

  // api
  const { data: ListingRentResumePropertyPublish } = useGet<IListingRentResumeResponse[]>(
    'ListingRentResumePropertyPublish',
    '/Host/ListingRent/Resume'
  );

  // hooks
  const navigate = useNavigate();
  const { t } = useTranslation('tralation', { keyPrefix: 'IniPropertyRegistration' });
  // const showSnackbar = useSnackbar();
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const {
    open: openHostForm,
    handleClose: handleCloseHostForm,
  } = useItemState();
  const { isHostAuthenticated } = useAuthContext();

  // functions
  const onSubmit = () => {
    if (!isHostAuthenticated) {
      navigate(`/`);
    } else {
      // navigate(`/host/register`);
      navigate(`/host/register-start-using`);
    }
  };
  const handleAcceptedTerms = async (checked: boolean) => {
    const verify = await RestClient.post(`/Acceptance/SERVICE_AGREEMENT`, {"detail": ""})
    if(verify?.data?.statusCode == '200') {
      showSnackbar('Términos y condiciones aceptados correctamente.', 'success');
      setAcceptedTerms(checked);    
    } else {
      showSnackbar('Error al aceptar términos y condiciones.', 'error');
    }
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: assertEnv.VITE_KEY_SEARCH_GOOGLE,
    libraries: GOOGLE_MAPS_LIBRARIES,
    language: 'es',
  });
  const [markerDimensions, setMarkerDimensions] = useState({ width: 0, height: 0 });
  const markerRef = useRef<HTMLDivElement>(null);

  // useEffect para medir el CustomMapMarker una vez que se renderice
  useEffect(() => {
    if (!isHostAuthenticated) {
      navigate(`/`);
    }
    if (markerRef.current) {
      const rect = markerRef.current.getBoundingClientRect();
      const estimatedTotalHeight = rect.height + 10;

      if (
        markerDimensions.width !== rect.width ||
        markerDimensions.height !== estimatedTotalHeight
      ) {
        setMarkerDimensions({ width: rect.width, height: estimatedTotalHeight });
      }
    }
  }, [markerRef, markerDimensions]); // Vuelve a ejecutar si la referencia o las dimensiones cambian

  const getPixelPositionOffset = useCallback(
    () => {
      return {
        x: -markerDimensions.width / 2,
        y: -markerDimensions.height,
      };
    },
    [markerDimensions] // Se recalcula si las dimensiones del marcador cambian
  );

  useEffect(() => {
    fetchExistingProperty();
  }, []);

  if (loadError) return <div>{t('mapLoadError', { defaultValue: 'Error al cargar el mapa.' })}</div>;

  return (
    <>
      <Helmet>
        <title>Registro de Propiedad</title>
        <meta name="registro de propiedad" content="Página de registro de propiedad" />
      </Helmet>
      {/* {<LoadingThreeDotsJumping open={loading} modal={true} />} */}
      <Box sx={{ flexGrow: 1, display: 'flex', bgcolor: '#F8F9FC', justifyContent: 'center', alignItems: 'center', px: { xs: 2, sm: 4 }, py: { xs: 4, md: 8 } }}>
        <Grid container sx={{ width: '100%', maxWidth: '1000px', mx: 'auto', borderRadius: '16px', overflow: 'hidden', border: "1px solid rgb(229,231,235)" }}>
          {/* Columna Izquierda - Contenido */}
          <Grid 
            size={{ xs: 12, md: 6 }} 
            sx={{ 
              bgcolor: '#ffffff', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'flex-start',
              py: { xs: 4, md: 6 },
              pr: { xs: 4, md: 6 },
              pl: { xs: 3, md: 5 } // Menos margen a la izquierda
            }}
          >
            <Box sx={{ width: '100%' }}>
              {/* Encabezado pequeño */}
              <Box sx={{
                display: 'flex', alignItems: 'center',
                bgcolor: '#5b55c814', // suave fondo morado                
                borderRadius: '9999px', gap: 1, mb: { xs: 3, md: 4 },
                width: 'fit-content'
              }}>
                <AutoAwesomeIcon sx={{
                  color: '#5b55c8',
                  fontSize: '1rem',
                }} />
                <Typography
                  sx={{
                    fontSize: { xs: '11px', sm: '12px' },
                    color: '#5b55c8',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    m: 0.3
                  }}
                >
                  {t('badge', { defaultValue: 'OPORTUNIDAD DE ANFITRIÓN' })}
                </Typography>
              </Box>

              {/* Título principal */}
              <Typography
                sx={{
                  lineHeight: '1.2',
                  mb: { xs: 2.5, md: 3 },
                  fontWeight: 800,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '2.75rem' },
                  color: "#111827",
                  letterSpacing: '-0.02em'
                }}
              >
                {t('titlePart1', { defaultValue: 'Descubre cuánto puedes ' })}
                <Box
                  component="span"
                  sx={{
                  color: '#5b55c8',
                  }}
                >
                  {t('titleHighlight', { defaultValue: 'ganar' })}
                </Box>{' '}
                {t('titlePart2', { defaultValue: 'con JOM.' })}
              </Typography>

              {/* Subtítulo */}
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: '18px', //{ xs: '18px', sm: '18px', md: '18px' },
                  lineHeight: '1.6',
                  color: '#4b5563',
                  mb: { xs: 4, md: 5 },
                  maxWidth: '90%',
                }}
              >
                {t('subtitle', { defaultValue: 'Únete a la red más exclusiva de propiedades y convierte tu espacio en una fuente constante de ingresos con nuestra gestión inteligente.' })}
              </Typography>

              {/* Checkbox de aceptación de términos */}
              {existingProperty && (
                <Box sx={{ mb: 2, mt: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={acceptedTerms}
                        onChange={(e) => handleAcceptedTerms(e.target.checked)}
                        sx={{
                          mt: '-10px',
                          color: '#5b55c8',
                          '&.Mui-checked': {
                            color: '#5b55c8',
                          },
                          '& .MuiSvgIcon-root': {
                            fontSize: 22,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography
                        sx={{
                          fontSize: { xs: '13px', sm: '14px' },
                          fontWeight: 400,
                          color: '#333',
                          '& a': {
                            color: '#5b55c8',
                            textDecoration: 'none',
                            fontWeight: 600,
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          },
                        }}
                      >
                        {t('acept')} {' '}
                        <a href="/host-contract" target="_blank" rel="noopener noreferrer" style={{color: '#6366f1'}}>
                          {t('contract')}
                        </a>
                      </Typography>
                    }
                    sx={{
                      alignItems: 'flex-start',
                      ml: 0,
                      mr: 0,
                    }}
                  />
                </Box>
              )}
              {/* Botón */}
              <Button
                onClick={onSubmit}
               variant="primary"
                // hoverColor={theme.palette.customColors.secondary[4]}
                disabled={existingProperty && !acceptedTerms}
                sx={{
                  width: '100%',
                  borderRadius: '10px',
                  fontSize: { xs: '15px', sm: '16px' },
                  fontWeight: 600,
                  py: 1.8,
                  textTransform: 'none',
                  opacity: existingProperty && !acceptedTerms ? 0.5 : 1,
                  cursor: existingProperty && !acceptedTerms ? 'not-allowed' : 'pointer',                  
                  boxShadow: '0 4px 6px -1px rgba(91, 85, 200, 0.2), 0 2px 4px -1px rgba(91, 85, 200, 0.1)',
                }}
              >
                {t('startNow', { defaultValue: 'Comienza ahora' })}
              </Button>

              {/* Texto pequeño debajo del botón */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2.5, mb: 4 }}>
                <Box
                  component="span"
                  sx={{
                    color: '#5b55c8',
                    display: 'flex',
                  }}
                >
                  <GppGoodOutlinedIcon fontSize='small' />
                </Box>
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#4b5563'
                  }}
                >
                  {t('registrationTime', { defaultValue: 'Registro en 5 minutos.' })}
                </Typography>
              </Box>
              
             <Divider sx={{ mb: 4, width: '100%', borderColor: '#e5e7eb' }} />
             
              {/* Estadísticas */}
              {/* <Box
                sx={{
                  display: 'flex',
                  gap: { xs: 4, sm: 6 },
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: '1.75rem',
                      fontWeight: 800,
                      color: '#111827',
                      lineHeight: '1',
                      mb: 0.5,
                    }}
                  >
                    +12k
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '11px',
                      mt: 1,
                      fontWeight: 700,
                      color: '#6b7280',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {t('activeHostsLabel', { defaultValue: 'ANFITRIONES ACTIVOS' })}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: '1.75rem',
                      fontWeight: 800,
                      color: '#111827',
                      lineHeight: '1',
                      mb: 0.5,
                    }}
                  >
                    4.9/5
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '11px',
                      mt: 1,
                      fontWeight: 700,
                      color: '#6b7280',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {t('averageRatingLabel', { defaultValue: 'CALIFICACIÓN MEDIA' })}
                  </Typography>
                </Box>
              </Box> */}
            </Box>
          </Grid>

          {/* Columna Derecha - Mapa */}
          <Grid 
            size={{ xs: 12, md: 6 }} 
            sx={{ 
              bgcolor: '#FAF9FF', // Color de fondo gris claro similar a la imagen
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              p: { xs: 4, md: 2 },
              minHeight: { xs: '500px', md: 'auto' }
            }}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: '400px', // Card más pequeño
                aspectRatio: '4/7', // Proporción similar a la tarjeta de la imagen
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                }}
              >
                {/* Elementos decorativos de fondo simplificados y ajustados sutilmente */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: '-10px',
                    bgcolor: 'rgba(255, 255, 255, 0.4)',
                    borderRadius: '32px',
                    zIndex: 0,
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    inset: '-20px',
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '40px',
                    zIndex: -1,
                  }}
                />

                <Card
                  sx={{
                    height: '100%',
                    width: '105%',
                    boxSizing: 'border-box',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '24px',
                    zIndex: 1,
                    border: '4px solid #ffffff',
                    bgcolor: '#ffffff',
                  }}
                >
                  <CardContent sx={{ p: 0, height: '100%', position: 'relative' }}>
                    {isLoaded && (
                      <GoogleMap
                        onLoad={onMapLoad}
                        mapContainerStyle={{ height: '100%', width: '100%' }}
                        center={defaultMapCenter}
                        zoom={12}
                        options={{
                          disableDefaultUI: true,
                          fullscreenControl: false,
                          streetViewControl: false,
                          mapTypeControl: false,
                          zoomControl: true,
                          gestureHandling: 'greedy',
                          styles: [
                            // Estilo opcional para que el mapa se vea un poco más claro/minimalista
                            {
                              featureType: "poi",
                              elementType: "labels",
                              stylers: [{ visibility: "off" }]
                            }
                          ]
                        }}
                      >
                        <div
                          style={{ position: 'absolute', visibility: 'hidden', top: 0, left: 0 }}
                          ref={markerRef}
                        >
                          <CustomMapMarker text="XXX BOB" />
                        </div>

                        {ListingRentResumePropertyPublish &&
                          ListingRentResumePropertyPublish.data.map(
                            (prop: IListingRentResumeResponse) => (
                              <OverlayView
                                key={prop?.listingRentId}
                                position={{
                                  lat: prop?.property?.latitude,
                                  lng: prop?.property?.longitude,
                                }}
                                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                getPixelPositionOffset={
                                  markerDimensions.width && markerDimensions.height
                                    ? getPixelPositionOffset
                                    : undefined
                                }
                              >
                              <JomMarker
                                price={`${prop?.price?.currencyCode ?? t('currencyCode', { defaultValue: 'BOB' })} ${prop?.price?.priceNightly??0}`}
                              />                            
                              </OverlayView>
                            )
                          )}
                      </GoogleMap>
                    )}
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Dialog
        open={openHostForm}
        aria-labelledby="responsive-dialog-title"
        maxWidth="sm"
        scroll="body"
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <CustomCloseButton onClick={handleCloseHostForm}>
          <Icon component="span" sx={{ fontSize: '1.25rem' }}>
            X
          </Icon>
        </CustomCloseButton>
        <DialogContent
          sx={{
            pb: (theme) => `${theme.spacing(2)} !important`,
            px: (theme) => [`${theme.spacing(8)} !important`, `${theme.spacing(8)} !important`],
            pt: (theme) => [`${theme.spacing(5)} !important`, `${theme.spacing(1)} !important`],
          }}
        >
          <HostForm onClose={handleCloseHostForm} onSubmit={handleCloseHostForm} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IniPropertyRegistration;