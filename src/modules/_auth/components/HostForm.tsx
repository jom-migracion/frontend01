import { useForm } from 'react-hook-form';
import {
  Box,  
  FormControl,
  TextField,
  Typography,
  Stack,
  Link,
  Paper,
} from '@mui/material';
import CustomButton from '@/components/CustomButton';
import { useTranslation } from 'react-i18next';
import HostFormProps from '@/models/interfaces/HostFormProps';
import { useAuthContext } from '../context';
import { useSnackbar } from '@/context/SnackbarContext';
import assertEnv from '@/config/env';
import { usePost } from '@/hooks/api';

interface Token {
  jwtToken: string;
}

const HostForm: React.FC<HostFormProps>= ({ onClose, onSubmit } ) => {  
  const { t } = useTranslation();
  const showSnackbar = useSnackbar();
  const { login } = useAuthContext();  

  const { mutate: loginHost } = usePost('/Login');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const internalSubmit = (dataForm:any) => {
    loginHost(
      {
        platform: 'local',
        token: '',
        userName: 'gary.vera.1976@gmail.com',
        password: assertEnv.VITE_BACKEND_PASSWORD,
      },
      {
        onSuccess: (responseLogin) => {
          const { data } = responseLogin;
          const dataResponse = data as Token;
          console.log('data', dataResponse);
          
          if (dataResponse.jwtToken) {
            login(dataResponse.jwtToken, responseLogin.data?.photo);
            showSnackbar('Inicio de sesión exitoso', 'success');             
            onClose()
            onSubmit(dataForm);           
          } else {
            showSnackbar('Error: No se recibió el token', 'error');
          }
        },
        onError: (error) => {
          showSnackbar(error?.message || 'Error al iniciar sesión', 'error');
        },
      }
    );    
  };

  return (
    <Box
      sx={{
        borderRadius: 13,
        padding: '68px 5px 68px 5px',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: 357,
          height: 300,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      >
        <Box sx={{ width: '357', height: '91px' }}>
          <Box sx={{ width: '249', height: '37px', padding: '10px' }}>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '100%',
                height: '17px',
              }}
            >
             Crea tu cuenta anfitrion
            </Typography>
          </Box>
          <Box sx={{ width: '357px', height: '54px', padding: '10px' }}>
            <Typography
              sx={{
                fontWeight: 300,
                fontSize: '14px',
                lineHeight: '100%',
                height: '34px',
                width: '341px',
              }}
            >
              Crea una cuenta para registrar tu alojamiento y gestionarlo.
            </Typography>
          </Box>
        </Box>

        <form onSubmit={handleSubmit(internalSubmit)} style={{ width: '332px', height: '350px' }}>
          <Stack spacing={0.8} mt={2} mr={1}>
            <FormControl fullWidth>
              <TextField
                label={t('authForm.fullName')}
                size="small"
                variant="outlined"
                {...register('fullName')}
                error={!!errors.fullName}
                helperText={errors.fullName && t(`authForm.errors.${errors.fullName?.message}`)}
                sx={{
                  '& .MuiInputBase-input': {
                    height: '15px',
                    padding: '10px',
                  },
                }}
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                label={t('authForm.email')}
                size="small"
                variant="outlined"
                type="email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email && t(`authForm.errors.${errors.email?.message}`)}
                sx={{
                  '& .MuiInputBase-input': {
                    height: '15px',
                    padding: '10px',
                  },
                }}
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                label="Contraseña"
                size="small"
                variant="outlined"
                type="password"
                {...register('password')}
                error={!!errors.password}
                sx={{
                  '& .MuiInputBase-input': {
                    height: '15px',
                    padding: '10px',
                  },
                }}
              />
            </FormControl>
            <Box sx={{paddingTop: '5px'}}>
            <CustomButton
              label="Registrate"
              type="submit"
              variant="contained"
              color="primary"
              borderRadius={15}
              fullWidth
              sx={{
                width: '325px',
                height: '36px',
                fontSize: '13px',
                fontWeight: 600,
                lineHeight: '100%',
              }}
            />
            </Box>
            <Box sx={{ width: '100%', maxWidth: '357px', height: '52px' }}>
              <Box sx={{ height: '34px', padding: '10px', marginLeft: '-15px', width: '357px', textAlign: 'center' }}>
                <Typography
                  sx={{
                    fontWeight: 300,
                    fontSize: '12px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                  }}
                >
                  Al iniciar sesión o al crear una cuenta aceptas nuestros
                </Typography>
              </Box>
              <Box sx={{ height: '34px', width: '151px', textAlign: 'center' }}>
                <Typography
                  sx={{
                    width: '328px',
                    fontWeight: 300,
                    fontSize: '12px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                  }}
                >
                  <Link href="#" underline="hover" color="info">
                    términos y condiciones
                  </Link>{' '}
                  y la{' '}
                  <Link href="#" underline="hover" color="info">
                    Política de privacidad
                  </Link>
                  .
                </Typography>
              </Box>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default HostForm;
