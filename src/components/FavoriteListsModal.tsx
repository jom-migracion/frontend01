import assertEnv from '@/config/env';
import { ApiService } from '@/services/ApiService';
import GetCurrentYear from '@/utilities/GetCurrentYear';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { alpha } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid2';
import Slide from '@mui/material/Slide';
import { useTheme } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Logo from '../assets/LogoJOM-MORADO.svg';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const addListingToFavoriteGroup = async (listingRentId: string, groupId: string) => {
  return ApiService.post(`/ListingRent/${listingRentId}/favorite`, {}, { params: { groupId } });
};

export const removeListingFromFavoriteGroup = async (listingRentId: string, groupId: string) => {
  return ApiService.delete(`/ListingRent/${listingRentId}/favorite`, {
    params: { groupId },
  });
};

export interface CardItem {
  id: string;
  title: string;
  image?: string;
}

interface ApiResponse<T> {
  data: T;
  statusCode: string;
  hasError: boolean;
  resultError: any;
}

interface FavoriteGroupListing {
  favoriteGroupListingId: number;
  userId: number;
  favoriteGroupName: string;
  creationDate: string | null;
  groupStatus: number;
  tlListingFavorites: ListingFavorite[];
  totalRegisters: number;
}

interface ListingFavorite {
  favoriteListingId: number;
  listingRentId: number;
  userId: number;
  createAt: string | null;
  favoriteGroupId: number | null;
  listingRent: ListingRent | null;
}

interface ListingRent {
  listingRentId: number;
  name: string;
  photos: Photo[];
}

interface Photo {
  name?: string;
  photoLink: string;
  isPrincipal: boolean;
}

interface FavoriteListsModalProps {
  open: boolean;
  onClose: (clearCard?: boolean) => void;
  selectedCard: CardItem | null;
  onCardAssigned?: () => void;
  onFavoriteChange?: (cardId: string, isFavorited: boolean) => void;
  onFavoriteAdded?: () => void;
  onReopenWithCard?: (card: CardItem) => void;
  skipSkeleton?: boolean;
}

interface CreateListForm {
  groupName: string;
}

const FavoriteListsModal: React.FC<FavoriteListsModalProps> = ({
  open,
  onClose,
  selectedCard,
  onCardAssigned,
  onFavoriteChange,
  onFavoriteAdded,
  onReopenWithCard,
}) => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [undoInfo, setUndoInfo] = useState<{ listId: string; card: CardItem } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [addPending, setAddPending] = useState<string | null>(null);

  const [isReopeningAfterUndo, setIsReopeningAfterUndo] = useState(false);

  // agregar para traducir
  const { t } = useTranslation();

  const { data: response } = useQuery<ApiResponse<FavoriteGroupListing[]>>({
    queryKey: ['favorite-lists'],
    queryFn: () => ApiService.get<ApiResponse<FavoriteGroupListing[]>>('/ListingRent/Favorites'),
    enabled: open,
  });

  const lists: FavoriteGroupListing[] = response?.data ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
    clearErrors,
  } = useForm<CreateListForm>();

  const onSubmit = async (formData: CreateListForm) => {
    setErrorMsg(null);
    setIsPending(true);
    try {
      await ApiService.post('/favorite', {}, { params: { groupName: formData.groupName } });
      await queryClient.invalidateQueries({ queryKey: ['favorite-lists'] });
      reset();
      clearErrors();
    } catch (error: any) {
      setError('groupName', { message: error?.message || 'No se pudo crear la lista' });
      setErrorMsg(error?.message || 'No se pudo crear la lista');
    } finally {
      setIsPending(false);
    }
  };

  const handleSelectList = async (listId: string) => {
    if (!selectedCard) return;
    setAddPending(listId);
    setErrorMsg(null);
    try {
      await addListingToFavoriteGroup(selectedCard.id, listId);
      await queryClient.invalidateQueries({ queryKey: ['favorite-lists'] });
      await queryClient.invalidateQueries({ queryKey: ['listingRent'] });
      await queryClient.invalidateQueries({ queryKey: ['detailProperty'] });
      setUndoInfo({ listId, card: selectedCard });
      setShowSnackbar(true);
      onCardAssigned?.();
      onFavoriteAdded?.();
      onClose();
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message ||
          err?.message ||
          'No se pudo agregar el hospedaje a favoritos'
      );
    } finally {
      setAddPending(null);
    }
  };

  const handleUndo = async () => {
    if (!undoInfo) return;
    const savedCard = undoInfo.card;
    try {
      setShowSnackbar(false);
      setUndoInfo(null);
      await removeListingFromFavoriteGroup(savedCard.id, undoInfo.listId);
      await queryClient.invalidateQueries({ queryKey: ['listingRent'] });
      await queryClient.invalidateQueries({ queryKey: ['detailProperty'] });
      await queryClient.invalidateQueries({ queryKey: ['favorite-lists'] });
      onFavoriteChange?.(savedCard.id, false);
      setIsReopeningAfterUndo(true);

      setTimeout(() => {
        onReopenWithCard?.(savedCard);
      }, 300);
    } catch (error: any) {
      console.error('Error al cambiar favorito:', error);
    }
  };

  useEffect(() => {
    if (open) {
      if (!isReopeningAfterUndo) {
        setShowSkeleton(true);
      }

      queryClient.invalidateQueries({ queryKey: ['favorite-lists'] });
      queryClient.refetchQueries({ queryKey: ['favorite-lists'] }).then(() => {
        setShowSkeleton(false);
        setIsReopeningAfterUndo(false);
      });
    } else {
      reset();
      clearErrors();
      setErrorMsg(null);
      setIsReopeningAfterUndo(false);
    }
  }, [open, queryClient, reset, clearErrors, isReopeningAfterUndo]);

  const getListImage = (list: FavoriteGroupListing): string => {
    const lastFavorite = list.tlListingFavorites?.[list.tlListingFavorites.length - 1];
    const principalPhoto = lastFavorite?.listingRent?.photos?.find((p) => p.isPrincipal);
    const photoName =
      principalPhoto?.photoLink || lastFavorite?.listingRent?.photos?.[0]?.photoLink;

    if (!photoName || photoName === Logo) {
      return Logo;
    }

    if (photoName.startsWith('http')) {
      return photoName;
    }

    return `${assertEnv.VITE_BASE_URL_PHOTOS_LISTING}${photoName}`;
  };

  const isShowingLogo = (list: FavoriteGroupListing): boolean => {
    const image = getListImage(list);
    return image === Logo;
  };
  const brandColor = '#6366f1';
  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="sign-in-dialog-title"
        aria-describedby="sign-in-dialog-description"
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        slots={{
          transition: Transition,
        }}
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
            },
          },
        }}
        sx={{
          zIndex: 10000,
          '& .MuiDialog-paper': {
            borderRadius: { xs: 0, sm: '24px' }, // Bordes más suaves
            margin: { xs: 0, sm: 4 },
            maxHeight: { xs: '100%', sm: '85vh' },
            width: { xs: '100%', sm: '520px' }, // Ancho fijo óptimo
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // Sombra premium
            overflow: 'hidden', // Importante para bordes
          },
          '& .MuiTypography-root': {
            p: 1.5,
          },
        }}
      >
        {/* --- HEADER --- */}
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            px: 3,
            py: 2.5,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Typography
            sx={{
              fontFamily: theme.typography.h6Medium,
              fontWeight: 700,
              fontSize: '1.1rem',
            }}
          >
            {t('recentlyViewed.dialog.title')}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => onClose(true)}
            sx={{
              position: 'absolute',
              right: 12,
              top: 18,
              color: theme.palette.grey[400],
              zIndex: 10,
              transition: 'all 0.2s',
              '&:hover': {
                color: theme.palette.grey[700],
                backgroundColor: alpha(theme.palette.grey[200], 0.5),
                transform: 'rotate(90deg)',
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        {/* --- CONTENT --- */}
        <DialogContent
          sx={{
            p: 0, // Quitamos padding global para controlar mejor las secciones
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            // bgcolor: '#fff',
          }}
        >
          {errorMsg && (
            <Box px={3} pt={2}>
              <Typography
                color="error"
                sx={{
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  p: 1,
                  borderRadius: 2,
                  fontSize: '0.9rem',
                }}
              >
                {errorMsg}
              </Typography>
            </Box>
          )}

          {/* --- LISTA DE FAVORITOS (Scrollable) --- */}
          {lists.length > 1 && (
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                p: 3,
                // Estilos para scrollbar bonito
                '&::-webkit-scrollbar': { width: '6px' },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: alpha(theme.palette.grey[400], 0.5),
                  borderRadius: '4px',
                },
              }}
            >
              <Grid container spacing={3}>
                {showSkeleton ? (
                  // SKELETON MEJORADO
                  Array.from({ length: 2 }).map((_, i) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={`skel-${i}`}>
                      <Skeleton variant="rounded" height={160} sx={{ borderRadius: 4, mb: 1 }} />
                      <Skeleton width="60%" height={24} />
                      <Skeleton width="40%" height={20} />
                    </Grid>
                  ))
                ) : lists.length === 0 ? (
                  <Grid size={{ xs: 12 }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      py={4}
                      textAlign="center"
                    >
                      <Box
                        component="img"
                        src="https://cdn-icons-png.flaticon.com/512/4049/4049969.png" // Icono placeholder opcional
                        sx={{ width: 80, opacity: 0.5, mb: 2, filter: 'grayscale(100%)' }}
                      />
                      <Typography color="text.secondary" fontWeight={500}>
                        {t('favorites.textNoFavs')}
                      </Typography>
                    </Box>
                  </Grid>
                ) : (
                  lists.map((list: any) =>
                    list.favoriteGroupListingId === -1 ? null : (
                      <Grid size={{ xs: 12, sm: 6 }} key={list.favoriteGroupListingId}>
                        <Box
                          onClick={
                            addPending
                              ? undefined
                              : () => handleSelectList(list.favoriteGroupListingId.toString())
                          }
                          sx={{
                            cursor: addPending ? 'not-allowed' : 'pointer',
                            group: 'true',
                            position: 'relative',
                          }}
                        >
                          <Card
                            elevation={0}
                            sx={{
                              borderRadius: '16px',
                              border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
                              overflow: 'hidden',
                              position: 'relative',
                              height: 160,
                              mb: 1.5,
                            }}
                          >
                            <CardMedia
                              component="img"
                              sx={{
                                height: '100%',
                                width: '100%',
                                objectFit: isShowingLogo(list) ? 'contain' : 'cover',
                                p: isShowingLogo(list) ? 3 : 0,
                                transition: 'transform 0.5s ease',
                              }}
                              image={getListImage(list)}
                              alt={list.favoriteGroupName}
                            />

                            {addPending === list.favoriteGroupListingId.toString() && (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  inset: 0,
                                  bgcolor: 'rgba(255,255,255,0.7)',
                                  backdropFilter: 'blur(2px)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  zIndex: 2,
                                }}
                              >
                                <CircularProgress size={28} sx={{ color: brandColor }} />
                              </Box>
                            )}
                          </Card>

                          <Box px={0}>
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 700,
                                color: theme.palette.text.primary,
                                lineHeight: 0,
                              }}
                              noWrap
                            >
                              {list.favoriteGroupName}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: theme.palette.text.secondary,
                                fontWeight: 500,
                                fontSize: '0.8rem',
                              }}
                            >
                              {list.totalRegisters}{' '}
                              {list.totalRegisters === 1 ? 'guardado' : 'guardados'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    )
                  )
                )}
              </Grid>
            </Box>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{
              pl: 3,
              pr: 3,
              pb: 3,
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              backgroundColor: '#fff',
              boxShadow: '0 -4px 20px rgba(0,0,0,0.02)', // Sombra hacia arriba muy sutil
              zIndex: 10,
            }}
          >
            <Box sx={{ mb: 0, p: 2, pl: 0, pr: 0, borderRadius: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                }}
              >
                {t('recentlyViewed.dialog.name')}
              </Typography>

              <TextField
                fullWidth
                size="small"
                variant="outlined"
                autoFocus
                autoComplete="off"
                placeholder={`${t('recentlyViewed.dialog.exampleText')} ${GetCurrentYear()}`}
                disabled={isPending || isSubmitting}
                error={Boolean(errors.groupName || errorMsg)}
                helperText={errors.groupName?.message || errorMsg}
                {...register('groupName', {
                  required: 'El nombre es obligatorio',
                  minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                  maxLength: { value: 60, message: 'Máximo 60 caracteres' },
                })}
                sx={{
                  fontSize: '0.875rem',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: '#fff',
                    '&:hover fieldset': { borderColor: 'primary.light' },
                    '&.Mui-focused fieldset': {
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputBase-input': {
                    // padding: '12px 14px',
                  },
                }}
              />
            </Box>
            <Box display="flex" gap={2} flexDirection={'column'}>
              <Button variant="primary" disabled={isPending || isSubmitting} type="submit">
                {isPending || isSubmitting ? (
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                ) : (
                  <AddIcon sx={{ mr: 0.5, fontSize: 20 }} />
                )}
                {t('recentlyViewed.dialog.buttonCreate')}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={5000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 10 }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2,
            py: 1.5,
            borderRadius: 2,
            backdropFilter: 'blur(12px)',
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
            minWidth: 280,
            maxWidth: 360,
          }}
        >
          {/* Imagen */}
          <Box
            component="img"
            src={undoInfo?.card?.image || Logo}
            alt="preview"
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10%',
              objectFit: 'cover',
              flexShrink: 0,
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = Logo;
            }}
          />

          {/* Texto */}
          <Typography
            variant="body2"
            sx={{
              flex: 1,
              fontWeight: 500,
              color: '#1a1a1a',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Guardado en{' '}
            <strong>
              {undoInfo
                ? lists.find((l) => l.favoriteGroupListingId.toString() === undoInfo.listId)
                    ?.favoriteGroupName
                : 'Favoritos'}
            </strong>
          </Typography>

          {/* Acción */}
          <Button
            onClick={handleUndo}
            sx={{
              minWidth: 'auto',
              px: 0,
              fontSize: 13,
              fontWeight: 600,
              color: theme.palette.customColors.primary[1],
              textTransform: 'none',
              '&:hover': {
                bgcolor: 'transparent',
                opacity: 0.7,
              },
            }}
          >
            Cambiar
          </Button>
        </Box>
      </Snackbar>
    </>
  );
};

export default FavoriteListsModal;
