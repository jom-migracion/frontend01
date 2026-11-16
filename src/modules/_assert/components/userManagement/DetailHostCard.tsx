// import { ApiService } from '@/services/ApiService';
// import { queryClient } from '@/services/QueryClient';
// import { Avatar, Box, Button, Divider, Typography } from '@mui/material';
// import Grid from '@mui/material/Grid2';
// import React from 'react';

// export interface User {
//   userId: number;
//   name: string;
//   lastName: string;
//   favoriteName: string;
//   photoLink: string;
//   gender: string | null;
//   email: string | null;
//   phoneNumber: string | null;
//   phoneCode: string | null;
//   emergencyContact: any | null;
//   documents: any[];
//   phones: any[];
//   profilePhotos: any[];
//   registerDate: string | undefined;
//   registerDateDays: number | null;
//   registerDateMonths: number | null;
//   registerDateYears: number | null;
//   cityName: string;
//   status: string;
// }

// interface DetailUserProps {
//   user?: User;
// }

// const DetailHostCard: React.FC<DetailUserProps> = ({ user }) => {



//     const disableHost = async (userId: number | undefined) => {
//     //  setErrorMsg(null);
//     //  setIsPending(true);
//       try {
//         await ApiService.put2("/User/BlockedHost", {}, { params: { userId: userId} });
//         await queryClient.invalidateQueries({ queryKey: ['user-1'] });
//         //reset();
//         //clearErrors();
//       } catch (error: any) {
//         //setError('groupName', { message: error?.message || 'No se pudo crear la lista' });
//         //setErrorMsg(error?.message || 'No se pudo crear la lista');
//       } finally {
//         //setIsPending(false);
//       }
//     };

//     const enableHost = async (userId: number | undefined) => {
//     //  setErrorMsg(null);
//     //  setIsPending(true);
//       try {
//         await ApiService.put2("/User/UnblockedHost", {}, { params: { userId: userId} });
//         await queryClient.invalidateQueries({ queryKey: ['user-1'] });
//         //reset();
//         //clearErrors();
//       } catch (error: any) {
//         //setError('groupName', { message: error?.message || 'No se pudo crear la lista' });
//         //setErrorMsg(error?.message || 'No se pudo crear la lista');
//       } finally {
//         //setIsPending(false);
//       }
//     };



//   const formatear = (iso: string): string =>
//     new Intl.DateTimeFormat('es-ES', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       timeZone: 'UTC',
//     }).format(new Date(iso));

//   return (
//     <Box
//       sx={{
//         p: {
//           xs: 2,
//           sm: 4,
//           md: 8,
//         },
//         bgcolor: 'whitesmoke',
//       }}
//     >
//       <Grid container spacing={2} alignItems="stretch">
//         {/* Columna izquierda */}
//         <Grid size={{ xs: 12 }}>
//           <Box
//             sx={{
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               justifyContent: 'center',
//               textAlign: 'center',
//               height: '100%',
//               width: '100%',
//               gap: 1,
//             }}
//           >
//             <Avatar
//               alt="Assert"
//               src={user?.photoLink || '/path/to/fallback-image.jpg'}
//               sx={{
//                 width: 120,
//                 height: 120,
//                 mb: 1,
//                 border: '4px solid #fff',
//                 objectFit: 'cover',
//               }}
//             />
//             <Typography variant="h6" component="div">
//               {user?.name}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Huésped/Anfitrión
//             </Typography>
//             <Typography variant="caption" color="text.secondary">
//               {user?.cityName ? user?.cityName : 'No disponible'}
//             </Typography>
//           </Box>
//         </Grid>

//         {/* Columna derecha */}
//         <Grid size={{ xs: 12 }}>
//           <Box
//             sx={{
//               display: 'flex',
//               flexDirection: 'column',
//               gap: 1.5,
//               height: '100%',
//               justifyContent: 'center',
//             }}
//           >
//             {user?.status === "AC" ? (
//             <Button
//             onClick={() => disableHost(user?.userId)}
//               variant="contained"
//               sx={{
//                 backgroundColor: '#FF0000',
//                 color: '#fff',
//                 borderRadius: '50px',
//                 textTransform: 'none',
//                 '&:hover': { backgroundColor: '#CC0000' },
//               }}
//             >
//               Bloquear
//             </Button>

//             ) : (
//               <Button
//                onClick={() => enableHost(user?.userId)}
//               variant="contained"
//               sx={{
//                 backgroundColor: '#9e9c9c',
//                 color: '#fff',
//                 borderRadius: '50px',
//                 textTransform: 'none',
//                 '&:hover': { backgroundColor:'#9e9c9c'},
//               }}
//             >
//               Desbloquear
//             </Button>
//             )}

//             <Divider />

//             <Button
//               variant="contained"
//               sx={{
//                 backgroundColor: '#000',
//                 color: '#fff',
//                 borderRadius: '20px',
//                 textTransform: 'none',
//                 '&:hover': { backgroundColor: '#333' },
//               }}
//             >
//               Propiedades
//             </Button>

//             <Divider />

//             <Button
//               variant="contained"
//               sx={{
//                 backgroundColor: '#000',
//                 color: '#fff',
//                 borderRadius: '20px',
//                 textTransform: 'none',
//                 '&:hover': { backgroundColor: '#333' },
//               }}
//             >
//               Reservas
//             </Button>

//             <Box sx={{ mt: 2 }}>
//               <Typography variant="body2" color="text.secondary">
//                 Correo: {user?.email}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Celular: {user?.phoneCode} {user?.phoneNumber}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Fecha Registro: {user?.registerDate && formatear(user.registerDate)}
//               </Typography>
//             </Box>
//           </Box>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default DetailHostCard;


import { useSnackbar } from '@/context/SnackbarContext';
import { ApiService } from '@/services/ApiService';
//import { queryClient } from '@/services/QueryClient';
import { Avatar, Box, Button, Divider, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress } from '@mui/material';
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

const DetailHostCard: React.FC<DetailUserProps> = ({ user, onRefresh }) => {

  const { t } = useTranslation();
  const showSnackbar = useSnackbar();
  // Estado para controlar la visibilidad del modal
  const [openModal, setOpenModal] = useState(false);
  // Estado para bloquear botones mientras se procesa la petición
  const [loading, setLoading] = useState(false);

  const disableHost = async (userId: number | undefined) => {
    if (!userId) return;

    setLoading(true);
    
    try {
      //await ApiService.put2("/User/BlockedHost", {}, { params: { userId: userId} });
      
      // CORRECCIÓN: Se envía 'ownerId' en lugar de 'userId'
      await ApiService.put2("/User/BlockedHost", {}, { 
        params: { ownerId: userId } 
      });
      
      //await queryClient.invalidateQueries({ queryKey: ['user-1'] });

      if (onRefresh) {
        onRefresh();
      }

      setOpenModal(false);
      showSnackbar(t('detailHostCard.messages.blockSuccess'), 'success');
    } catch (error: any) {
      console.error('Error al bloquear usuario:', error?.message || 'No se pudo bloquear el usuario');

      showSnackbar(t('detailHostCard.messages.blockErrorNoProperties'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const enableHost = async (userId: number | undefined) => {
    if (!userId) return;

    setLoading(true);

    try {
      //await ApiService.put2("/User/UnblockedHost", {}, { params: { userId: userId} });
      
      // CORRECCIÓN: Se envía 'ownerId' en lugar de 'userId'
      await ApiService.put2("/User/UnblockedHost", {}, { 
        params: { ownerId: userId } 
      });

      //await queryClient.invalidateQueries({ queryKey: ['user-1'] });

      if (onRefresh) {
        onRefresh();
      }

      showSnackbar(t('detailHostCard.messages.unblockSuccess'), 'success');

    } catch (error: any) {
      console.error('Error al desbloquear usuario:', error?.message || 'No se pudo desbloquear el usuario');
      showSnackbar(t('detailHostCard.messages.unblockError'), 'error');
    } finally {
      setLoading(false);
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
      await disableHost(user.userId);
      setOpenModal(false);
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
              Huésped/Anfitrión
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.cityName ? user?.cityName : t('detailHostCard.cityFallback')}
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
                onClick={handleOpenModal} // Abrir modal en lugar de llamar directamente a disableHost
                variant="contained"
                disabled={loading}
                sx={{
                  backgroundColor: '#FF0000',
                  color: '#fff',
                  borderRadius: '50px',
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#CC0000' },
                }}
              >
                {t('detailHostCard.buttons.block')}
              </Button>
            ) : (
              <Button
                onClick={() => enableHost(user?.userId)}
                variant="contained"
                sx={{
                  backgroundColor: '#9e9c9c',
                  color: '#fff',
                  borderRadius: '50px',
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#9e9c9c' },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Desbloquear'}
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
              {t('detailHostCard.buttons.properties')}
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
              {t('detailHostCard.buttons.reservations')}
            </Button>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {t('detailHostCard.labels.email')} {user?.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('detailHostCard.labels.phone')} {user?.phoneCode} {user?.phoneNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('detailHostCard.labels.registerDate')} {user?.registerDate && formatear(user.registerDate)}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Modal de confirmación */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t('detailHostCard.modal.title')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {/* ¿Estás seguro de que deseas bloquear a {user?.name}? El usuario no podrá iniciar sesión. */}
            {t('detailHostCard.modal.content', { name: user?.name })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary" variant="contained">
            {t('detailHostCard.modal.cancel')}
          </Button>
          <Button
            onClick={handleConfirmDisable}
            color="error"
            variant="contained"
            autoFocus
          >
            {loading ? t('detailHostCard.buttons.processing') : t('detailHostCard.modal.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DetailHostCard;