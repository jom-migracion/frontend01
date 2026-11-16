import { ApiService } from '@/services/ApiService';
import { queryClient } from '@/services/QueryClient';
import { Avatar, Box, Button, Divider, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React from 'react';

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
}

const DetailedUserCard: React.FC<DetailUserProps> = ({ user }) => {



    const disableHost = async (userId: number | undefined) => {
    //  setErrorMsg(null);
    //  setIsPending(true);
      try {
        await ApiService.put2("/User/BlockedHost", {}, { params: { userId: userId} });
        await queryClient.invalidateQueries({ queryKey: ['user-1'] });
        //reset();
        //clearErrors();
      } catch (error: any) {
        //setError('groupName', { message: error?.message || 'No se pudo crear la lista' });
        //setErrorMsg(error?.message || 'No se pudo crear la lista');
      } finally {
        //setIsPending(false);
      }
    };

    const enableHost = async (userId: number | undefined) => {
    //  setErrorMsg(null);
    //  setIsPending(true);
      try {
        await ApiService.put2("/User/UnblockedHost", {}, { params: { userId: userId} });
        await queryClient.invalidateQueries({ queryKey: ['user-1'] });
        //reset();
        //clearErrors();
      } catch (error: any) {
        //setError('groupName', { message: error?.message || 'No se pudo crear la lista' });
        //setErrorMsg(error?.message || 'No se pudo crear la lista');
      } finally {
        //setIsPending(false);
      }
    };
        const disableGuest = async (userId: number | undefined) => {
    //  setErrorMsg(null);
    //  setIsPending(true);
      try {
        await ApiService.put2("/User/BlockedGuest", {}, { params: { userId: userId} });
        await queryClient.invalidateQueries({ queryKey: ['user-2'] });
        //reset();
        //clearErrors();
      } catch (error: any) {
        //setError('groupName', { message: error?.message || 'No se pudo crear la lista' });
        //setErrorMsg(error?.message || 'No se pudo crear la lista');
      } finally {
        //setIsPending(false);
      }
    };

    const enableGuest = async (userId: number | undefined) => {
    //  setErrorMsg(null);
    //  setIsPending(true);
      try {
        await ApiService.put2("/User/UnblockedGuest", {}, { params: { userId: userId} });
        await queryClient.invalidateQueries({ queryKey: ['user-2'] });
        //reset();
        //clearErrors();
      } catch (error: any) {
        //setError('groupName', { message: error?.message || 'No se pudo crear la lista' });
        //setErrorMsg(error?.message || 'No se pudo crear la lista');
      } finally {
        //setIsPending(false);
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
              {user?.cityName ? user?.cityName : 'No disponible'}
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
            onClick={() => disableHost(user?.userId)}
              variant="contained"
              sx={{
                backgroundColor: '#FF0000',
                color: '#fff',
                borderRadius: '50px',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#CC0000' },
              }}
            >
              Bloquear
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
                '&:hover': { backgroundColor:'#9e9c9c'},
              }}
            >
              Desbloquear
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
              Propiedades
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
              Reservas
            </Button>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Correo: {user?.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Celular: {user?.phoneCode} {user?.phoneNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fecha Registro: {user?.registerDate && formatear(user.registerDate)}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DetailedUserCard;
