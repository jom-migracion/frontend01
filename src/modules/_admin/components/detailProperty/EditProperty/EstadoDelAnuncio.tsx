import { useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Radio,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useCustomMutationByUrl } from '@/hooks/api';
import { useSnackbar } from '@/context/SnackbarContext';
import LoadingThreeDotsJumping from '@/components/LoadingThreeDotsJumping';
import { jomWhite } from '@/assets';
import { useTranslation } from 'react-i18next';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { pushToDataLayer } from '@/utilities/analytics';

// --- Definiciones del Estado de la Vista ---
const VISTA = {
  ESTADO: 'estado', // Muestra las tarjetas "Publicado" / "No Publicado"
  DESCANSO: 'descanso', // Muestra los botones "Ocultar por ahora" / "Elige las fechas"
};

// --- Componente Principal ---

const EstadoDelAnuncio: React.FC<{status?:string, photos?: any[], listingRentId: number, listingRentName?: string, location?: string, price?: number, currencyCode?: string, handleChangeSelectedCardId: (_: any, newValue: number) => void; }> = ({ status, photos = [], listingRentId, listingRentName = '', location = '', price = 0, currencyCode = 'BOB', handleChangeSelectedCardId }) => {

  const imgPortada = photos.length > 0 ? photos.find((photo: any) => photo.isPrincipal) : undefined;

  const showSnackbar = useSnackbar();
  const { t } = useTranslation();

  // Estado para controlar qué opción está seleccionada
  const [selectedStatus, setSelectedStatus] = useState<'PUBLICADO' | 'NO_PUBLICADO'>(
    status === 'UNPUBLISH' ? 'NO_PUBLICADO' : 'PUBLICADO'
  );

  // api
  const { mutate: UpdateListingRentStatus, isPending: isUpdatingStatus } = useCustomMutationByUrl('put');

  // Inicializamos el estado en la vista ESTADO
  const [vistaActual, setVistaActual] = useState(VISTA.ESTADO);

  // --- Manejadores de Eventos ---

  const handleNoPublicadoClick = () => {
    // Cuando se hace clic en "No Publicado", cambiamos la vista a DESCANSO
    setVistaActual(VISTA.DESCANSO);
  };

  const handleHideNow = () => {
    pushToDataLayer('deactivate_property', {
      property_id: listingRentId
    });
    const url = `/ListingRent/ChangeStatus?listingRentId=${listingRentId}&status=UNPUBLISH`;
    UpdateListingRentStatus(
      { url },
      {
        onSuccess: (response) => {
          const { statusCode, resultError } = response;

          if (statusCode === '200') {
            showSnackbar('update', 'success');
            handleChangeSelectedCardId(null, 1)
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

  const handleBackToEstado = () => {
    setVistaActual(VISTA.ESTADO);
  }

  const handlePublish = () => {
    pushToDataLayer('activate_property', {
      property_id: listingRentId
    });    
    const url = `/ListingRent/ChangeStatus?listingRentId=${listingRentId}&status=PUBLISH`;
    UpdateListingRentStatus(
      { url },
      {
        onSuccess: (response) => {
          const { statusCode, resultError } = response;
          if (statusCode === '200') {
            showSnackbar('update', 'success');
            handleChangeSelectedCardId(null, 1)
          } else {
            showSnackbar(resultError?.message, 'error');
          }
        },
        onError: (error) => {
          showSnackbar(error?.response?.data?.resultError?.message ?? error.message, 'error');
        }
      }
    );
  };

  // --- Renderizado de Contenido Dinámico ---

  const renderContenido = () => {
    if (vistaActual === VISTA.ESTADO) {
      // 1. Contenido de la primera pantalla ("Estado del anuncio")
      return (
        <>
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: '#717171',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                mb: 2
              }}
            >
              {t('listingStatus.views.status.unpublished.currentStatus')}
            </Typography>

            <Grid container spacing={2}>
              {/* Tarjeta: Publicado */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card
                  onClick={() => {
                    setSelectedStatus('PUBLICADO');
                  }}
                  sx={{
                    cursor: 'pointer',
                    border: selectedStatus === 'PUBLICADO' ? '2px solid #0071c2' : '1px solid #e0e0e0',
                    borderRadius: 2,
                    backgroundColor: selectedStatus === 'PUBLICADO' ? '#f0f8ff' : '#fff',
                    '&:hover': {
                      borderColor: '#0071c2',
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
                      <Box flex={1}>
                        <Typography
                          sx={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: '#222',
                            mb: 0.5
                          }}
                        >
                          {t('listingStatus.views.status.published.title')}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 14,
                            color: '#717171'
                          }}
                        >
                          {t('listingStatus.views.status.published.description')}
                        </Typography>
                        {selectedStatus === 'PUBLICADO' && (
                          <Typography
                            sx={{
                              fontSize: 12,
                              color: '#00a699',
                              fontWeight: 600,
                              mt: 0.5,
                              textTransform: 'uppercase'
                            }}
                          >
                            {t('listingStatus.views.status.unpublished.active')}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ pt: 0.5 }}>
                        {selectedStatus === 'PUBLICADO' ? (
                          <CheckCircleIcon sx={{ color: '#00a699', fontSize: 24 }} />
                        ) : (
                          <Radio
                            checked={false}
                            sx={{
                              p: 0,
                              '& .MuiSvgIcon-root': {
                                fontSize: 24,
                              }
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Tarjeta: No Publicado */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card
                  onClick={() => {
                    setSelectedStatus('NO_PUBLICADO');
                    handleNoPublicadoClick();
                  }}
                  sx={{
                    cursor: 'pointer',
                    border: selectedStatus === 'NO_PUBLICADO' ? '2px solid #5B55C8' : '1px solid #e0e0e0',
                    borderRadius: 2,
                    backgroundColor: selectedStatus === 'NO_PUBLICADO' ? '#f5f3f9' : '#fff',
                    '&:hover': {
                      borderColor: '#5B55C8',
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
                      <Box flex={1}>
                        <Typography
                          sx={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: '#222',
                            mb: 0.5
                          }}
                        >
                          {t('listingStatus.views.status.unpublished.title')}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 14,
                            color: '#717171'
                          }}
                        >
                          {t('listingStatus.views.status.unpublished.description')}
                        </Typography>
                      </Box>
                      <Box sx={{ pt: 0.5 }}>
                        <Radio
                          checked={selectedStatus === 'NO_PUBLICADO'}
                          sx={{
                            p: 0,
                            color: selectedStatus === 'NO_PUBLICADO' ? '#5c34a4' : undefined,
                            '&.Mui-checked': {
                              color: '#5c34a4',
                            },
                            '& .MuiSvgIcon-root': {
                              fontSize: 24,
                            }
                          }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Typography
              sx={{
                fontSize: 14,
                color: '#717171',
                mt: 2
              }}
            >
              {t('listingStatus.views.status.unpublished.changeStatus')}
            </Typography>
          </Box>
        </>
      );
    } else if (vistaActual === VISTA.DESCANSO) {
      // 2. Contenido de la segunda pantalla ("Tomarse un descanso")
      return (
        <>
          {/* Título y Descripción */}
          <Box sx={{ mb: 4, textAlign: 'left' }}>
            <Typography
              sx={{
                fontSize: 18,
                fontWeight: 600,
                color: '#222',
                mb: 1
              }}
            >
              {t('listingStatus.views.break.title')}
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                color: '#717171'
              }}
            >
              {t('listingStatus.views.break.description')}
            </Typography>
          </Box>

          {/* Botones de Acción */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            <Button
              variant="primary"
              sx={{
                textTransform: 'none',
                fontSize: 16,
                fontWeight: 500,
                px: 3,
                py: 1.5,
                borderRadius: 2,
              }}
              onClick={handleHideNow}
            >
              {t('listingStatus.views.break.buttons.hideNow')}
            </Button>
            <Button
              variant="primary"
              sx={{
                textTransform: 'none',
                fontSize: 16,
                fontWeight: 500,
                px: 3,
                py: 1.5,
                borderRadius: 2,
                color: '#fff',
              }}
              onClick={handleBackToEstado}
            >
              {t('listingStatus.views.break.buttons.back')}
            </Button>
          </Box>
        </>
      );
    }
  };

  // --- Estructura Global del Componente ---

  return (
    <>
      {<LoadingThreeDotsJumping open={isUpdatingStatus} modal={true} />}
      <Typography
        fontWeight="600"
        sx={{ fontSize: '18px', mb: 3, color: '#222', mt: -1.5, ml: 0 }}
      >
        {t('listingStatus.views.status.unpublished.adStatus')}
      </Typography>
      <Divider sx={{ mx: -10, my: -1.9 }} />

      <Box sx={{ py: 3, pr:'20px', maxWidth: 800, width: '100%' }}>
        {/* Título Principal */}
        <Typography
          fontWeight="600"
          sx={{ fontSize: '16px', mb: 1, color: '#222', mt: 1 }}
        >
          {t('listingStatus.title')}
        </Typography>

        <Box sx={{ mb: 4 }}>
          {/* <Typography 
            variant="h6" 
            fontWeight="600" 
            sx={{ fontSize: 16, mb: 1, color: '#222' }}
          >
            Estado del anuncio
          </Typography> */}
          <Typography
            sx={{ fontSize: '13px', color: '#6b7280' }}
          >            
            {t('listingStatus.views.status.unpublished.checkWhether')}
          </Typography>
        </Box>

        {/* Card con información de la propiedad */}
        <Card
          sx={{
            mb: 4,
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            boxShadow: 'none'
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 2,
                  overflow: 'hidden',
                  flexShrink: 0,
                  backgroundColor: '#f0f0f0'
                }}
              >
                <img
                  src={imgPortada?.photoLink || jomWhite}
                  alt="Propiedad"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>
              <Box flex={1}>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#222',
                    mb: 0.5
                  }}
                >
                  {listingRentName || t('adminGallery.card.noTitle')}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '13px',
                    color: '#717171',
                    mb: 0.5
                  }}
                >
                  {location || t('adminGallery.card.noLocation')}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '13px',
                    color: '#5B55C8',
                    fontWeight: 600
                  }}
                >
                  {`${price ?? 0} ${currencyCode ?? 'BOB'} / noche`}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Renderizado Condicional del Contenido */}
        {renderContenido()}

        {/* Botones finales - Solo visible en vista ESTADO */}
        {vistaActual === VISTA.ESTADO && (
          <Box sx={{
            position: 'sticky',
            bottom: { xs: -18, md: -5 },
            zIndex: 10,
            display: 'flex',
            justifyContent: 'flex-end',
            pt: 2,
            pb: 2,
            // mx: -4,
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
              disabled={isUpdatingStatus}
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
              onClick={() => {
                if (selectedStatus === 'PUBLICADO') {
                  handlePublish();
                } else {
                  // Ya está en modo descanso, no hacer nada o mostrar mensaje
                }
              }}
            >
              {isUpdatingStatus ? t('listingStatus.views.status.unpublished.saving') : t('listingStatus.views.status.unpublished.buttonSave')}
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

export default EstadoDelAnuncio;