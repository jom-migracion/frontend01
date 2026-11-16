import { useSnackbar } from '@/context/SnackbarContext';
import { ApiService } from '@/services/ApiService';
//import { queryClient } from '@/services/QueryClient';
import { Avatar, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface User {
  userId: number;
  name: string;
  lastName: string;
  favoriteName: string;
  photoLink: string;
  gender: string | null;
  email: string | null;
  phoneNumber: string | null;
  phoneCode: string | null;
  emergencyContact: any | null;
  documents: any[];
  phones: any[];
  profilePhotos: any[];
  registerDate: string | undefined;
  registerDateDays: number | null;
  registerDateMonths: number | null;
  registerDateYears: number | null;
  cityName: string;
  status: string;
}

interface DetailUserProps {
  user?: User;
  onRefresh?: () => void; // <--- Nuevo Prop opcional
}

const DetailAdminCard: React.FC<DetailUserProps> = ({ user, onRefresh }) => {

  const { t } = useTranslation();
  const showSnackbar = useSnackbar();

  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const disableGuest = async (userId: number | undefined) => {
    if (!userId) return;
    setLoading(true);
    //  setErrorMsg(null);
    //  setIsPending(true);
    try {
      await ApiService.put2("/User/BlockedGuest", {}, { 
        params: { userId: userId } 
      });
      
      //await queryClient.invalidateQueries({ queryKey: ['user-2'] });

      if (onRefresh) {
        onRefresh();
      }

      setOpenModal(false);
      showSnackbar('Administrador bloqueado correctamente', 'success');
      //reset();
      //clearErrors();
    } catch (error: any) {
      //setError('groupName', { message: error?.message || 'No se pudo crear la lista' });
      //setErrorMsg(error?.message || 'No se pudo crear la lista');
      console.error('Error:', error);
      showSnackbar('Error al bloquear administrador', 'error');
    } finally {
      //setIsPending(false);
      setLoading(false);
    }
  };

  const enableGuest = async (userId: number | undefined) => {
    if (!userId) return;
    setLoading(true);
    //  setErrorMsg(null);
    //  setIsPending(true);
    try {
      await ApiService.put2("/User/UnblockedGuest", {}, { 
        params: { userId: userId } 
      });

      //await queryClient.invalidateQueries({ queryKey: ['user-2'] });

      if (onRefresh) {
        onRefresh();
      }

      showSnackbar('Administrador desbloqueado correctamente', 'success');
      //reset();
      //clearErrors();
    } catch (error: any) {
      console.error('Error:', error);
      showSnackbar('Error al desbloquear administrador', 'error');
      //setError('groupName', { message: error?.message || 'No se pudo crear la lista' });
      //setErrorMsg(error?.message || 'No se pudo crear la lista');
    } finally {
      setLoading(false);
      //setIsPending(false);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleConfirmDisable = async () => {
    if (user?.userId) {
      await disableGuest(user.userId);
    }
  };

  const formatear = (iso: string): string =>
    new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(iso));

  return (
    <Box
      sx={{
        p: {
          xs: 2,
          sm: 4,
          md: 8,
        },
        bgcolor: 'whitesmoke',
      }}
    >
      <Grid container spacing={2} alignItems="stretch">
        {/* Columna izquierda */}
        <Grid size={{ xs: 12 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              height: '100%',
              width: '100%',
              gap: 1,
            }}
          >
            <Avatar
              alt="Assert"
              src={user?.photoLink || '/path/to/fallback-image.jpg'}
              sx={{
                width: 120,
                height: 120,
                mb: 1,
                border: '4px solid #fff',
                objectFit: 'cover',
              }}
            />
            <Typography variant="h6" component="div">
              {user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('detailAdminCard.role')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.cityName ? user?.cityName : t('detailAdminCard.cityFallback')}
            </Typography>
          </Box>
        </Grid>

        {/* Columna derecha */}
        <Grid size={{ xs: 12 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              height: '100%',
              justifyContent: 'center',
            }}
          >
            {user?.status === "AC" ? (
              <Button
                onClick={handleOpenModal}
                variant="contained"
                sx={{
                  backgroundColor: '#FF0000',
                  color: '#fff',
                  borderRadius: '50px',
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#CC0000' },
                }}
              >
                {t('detailAdminCard.buttons.block')}
              </Button>

            ) : (
              <Button
                onClick={() => enableGuest(user?.userId)}
                variant="contained"
                sx={{
                  backgroundColor: '#9e9c9c',
                  color: '#fff',
                  borderRadius: '50px',
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#9e9c9c' },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : t('detailAdminCard.buttons.unblock')}
              </Button>
            )}

            <Divider />

            <Button
              variant="contained"
              sx={{
                backgroundColor: '#000',
                color: '#fff',
                borderRadius: '20px',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#333' },
              }}
            >
              {t('detailAdminCard.buttons.properties')}
            </Button>

            <Divider />

            <Button
              variant="contained"
              sx={{
                backgroundColor: '#000',
                color: '#fff',
                borderRadius: '20px',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#333' },
              }}
            >
              {t('detailAdminCard.buttons.reservations')}
            </Button>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {t('detailAdminCard.labels.email')} {user?.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('detailAdminCard.labels.phone')} {user?.phoneCode} {user?.phoneNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('detailAdminCard.labels.registerDate')} {user?.registerDate && formatear(user.registerDate)}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>{t('detailAdminCard.modal.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('detailAdminCard.modal.question', { name: user?.name })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} disabled={loading} color="primary" variant="contained">
            {t('detailAdminCard.modal.btnCancel')}
          </Button>
          <Button onClick={handleConfirmDisable} color="error" variant="contained" autoFocus disabled={loading}>
             {loading ? "..." : t('detailAdminCard.buttons.block')}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default DetailAdminCard;
