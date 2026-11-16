import { useState, useRef, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  FormControl,
  TextField,
  Link,
  Box,
  Button,
  CircularProgress,
  Stack,
  InputAdornment,
  Typography,
  Divider,
} from '@mui/material';
import { IconButton } from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  EmailOutlined as MailIcon,
  LockOutlined as LockIcon,
} from '@mui/icons-material';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { usePost } from '@/hooks/api';
import { useSnackbar } from '@/context/SnackbarContext';
import { useAuthContext } from '@/modules/_auth/context';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import CustomDialog from './CustomDialog';
import { useNotification } from '@/context/NotificationContext';
import ForgotPasswordModal from '@/modules/_auth/components/ForgotPasswordModal';
import { jwtDecode } from 'jwt-decode';
import assertEnv from '@/config/env';
import { pushToDataLayer } from '@/utilities/analytics';
import { useAuthStore } from '@/store/auth.store';

interface UserProfile {
  name: string;
  email: string;
  picture: string;
  sub: string; // ID único del usuario
}

interface Token {
  jwtToken: string;
}
interface AuthRequest {
  email: string;
  password: string;
}

interface SignInFormProps {
  open: boolean;
  onClose: () => void;
  typeLogin?: string;
}

const SignInForm = ({ open, onClose, typeLogin }: SignInFormProps) => {
  const googleButtonBorderRadius = 14;
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpForgotPassword, setOtpForgotPassword] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const showSnackbar = useSnackbar();
  const showNotification = useNotification();
  const { login } = useAuthContext();
  const { mutate: postForgotPassword } = usePost<any>('/ForgotPassword');
  const { identifier } = useAuthStore.getState();

  // Definir esquema con useMemo para que se actualice al cambiar idioma
  const loginSchema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .min(1, { message: t('login.emailRequired') })
          .email({ message: t('login.emailInvalid') }),
        password: z.string().min(8, { message: t('login.passwordMin') }),
      }),
    [t]
  );

  const { mutate: loginHost, isPending: isPending } = usePost<{ jwtToken: string; photo: string }>(
    '/Login'
  );
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: AuthRequest, event?: React.BaseSyntheticEvent) => {
    const submitter = (event?.nativeEvent as SubmitEvent | undefined)?.submitter as
      | HTMLButtonElement
      | undefined;

    // Esto evita submits accidentales desde otros botones/componentes creo!!!.
    if (!submitter || submitter.name !== 'local-login-submit') {
      return;
    }

    if (typeLogin === 'login') {
      // console.log('Es login');
    }

    loginHost(
      {
        platform: 'local',
        token: '',
        userName: data?.email,
        password: data?.password,
      },
      {
        onSuccess: (responseLogin) => {
          const { data } = responseLogin;
          const dataResponse = data as Token;
          if (dataResponse.jwtToken) {
            login(dataResponse.jwtToken, responseLogin?.data?.photo);
            pushToDataLayer('login', { user_id: identifier});
            if (responseLogin?.data?.photo) {
              localStorage.setItem(
                'userPhoto',
                responseLogin.data.photo.replace(
                  'https://assert-dev.runasp.net',
                  assertEnv.VITE_BASE_URL
                )
              );
            }
            reset();
            onClose();
            showNotification(
              'success',
              t('authForm.successLoginTitle'),
              t('authForm.successLoginMessage')
            );
            queryClient.invalidateQueries({ queryKey: ['listingRent'] });
          } else {
            showNotification('error', t('authForm.successLoginTitle'), t('authForm.errorToken'));
          }
        },
        onError: (error) => {
          showSnackbar(
            error?.response?.data?.resultError?.message || t('authForm.errorLoginMessage'),
            'error',
            4000
          );
        },
      }
    );
  };

  const sendOtpForgotPassword = () => {
    const loginData = getValues();

    if (loginData?.email) {
      const dataRequest = {
        userName: loginData?.email,
        newPassword: '',
        otpCode: '',
      };
      postForgotPassword(dataRequest, {
        onSuccess: (_) => {
          setOtpForgotPassword(true);
          showSnackbar(t('forgotPassword.description'), 'info', 8000);
        },
        onError: (error) => {
          showSnackbar(
            `Error: ${error?.response?.data?.resultError?.message || 'Error no se puede realiazar esta accion.'}`,
            'error',
            6000
          );
        },
      });
    } else {
      showSnackbar(t('authForm.errors.errorForgotPassword'), 'error');
    }
  };

  const handleOtpSubmit = (otp: string, newPassword: string) => {
    const loginData = getValues();
    const dataRequest = {
      userName: loginData?.email,
      newPassword: newPassword,
      otpCode: otp,
    };
    postForgotPassword(dataRequest, {
      onSuccess: (response) => {
        setOtpForgotPassword(false);
        if (response?.statusCode === '200') {
          if (response?.data === 'UPDATED') {
            onClose();
            showSnackbar('Cambio de contraseña exitoso', 'success');
          } else {
            showSnackbar('Error: ' + response?.data, 'error');
          }
        } else {
          showSnackbar('Error en la petición', 'error');
        }
      },
      onError: (error) => {
        console.error(`Error en la petición para el grupo:`, error);
        showSnackbar('El código OTP es inválido', 'error');
      },
    });
  };

  const handleSuccess = async (credentialResponse: any) => {
    const decodedCredential = jwtDecode(credentialResponse.credential) as UserProfile;

    loginHost(
      {
        platform: 'google',
        token: credentialResponse.credential || '',
        userName: decodedCredential.email || '',
        password: '',
      },
      {
        onSuccess: (responseLogin) => {
          const { data } = responseLogin;
          const dataResponse = data as Token;
          if (responseLogin?.statusCode == '200' && !responseLogin?.hasError) {
            if (dataResponse.jwtToken) {
              login(dataResponse.jwtToken, responseLogin?.data?.photo);
              if (responseLogin?.data?.photo) {
                localStorage.setItem(
                  'userPhoto',
                  responseLogin.data.photo.replace(
                    'https://assert-dev.runasp.net',
                    assertEnv.VITE_BASE_URL
                  )
                );
              }
              reset();
              showSnackbar('Inicio de sesión exitoso', 'success');
              onClose();
              queryClient.invalidateQueries({ queryKey: ['listingRent'] });
            } else {
              showSnackbar('Error: No se recibió el token del proveedor de Google.', 'error');
            }
          } else {
            showSnackbar(
              responseLogin?.resultError?.message || 'Error al iniciar sesión con Google.',
              'error'
            );
          }
        },
        onError: (error) => {
          showSnackbar(
            error?.response?.data?.resultError?.message || 'Error al iniciar sesión.',
            'error'
          );
        },
      }
    );
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      emailRef.current?.focus();
    }, 300);

    return () => clearTimeout(timer);
  }, [open]);

  return (
    <CustomDialog isOpen={open} onClose={handleClose} maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            backgroundColor: '#ebe8e8aa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <LoginIcon sx={{ color: 'gray', fontSize: 32, mr: 1 }} />
        </Box>
        <Typography variant="h5" fontWeight="600" color="text.primary">
          {t('login.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mt: 1 }}>
          {t('login.description')}
        </Typography>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl fullWidth>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                inputRef={emailRef}
                placeholder={t('authForm.email')}
                error={!!errors.email}
                helperText={errors.email && errors.email.message}
                autoComplete="off"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailIcon fontSize="small" sx={{ color: 'action.active' }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                type={showPassword ? 'text' : 'password'}
                placeholder={t('authForm.password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                autoComplete="off"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon fontSize="small" sx={{ color: 'action.active' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />
        </FormControl>
        <FormControl fullWidth>
          <Box sx={{ textAlign: 'right', mt: 0 }}>
            <Link
              component="button"
              type="button"
              variant="body2"
              sx={{
                textDecoration: 'none',
              }}
              onClick={() => {
                sendOtpForgotPassword();
              }}
            >
              {t('login.forgotPassword')}
            </Link>
          </Box>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <Button
            name="local-login-submit"
            variant="primary"
            type="submit"
            fullWidth
            disabled={isPending}
          >
            {isPending ? (
              <Stack direction="row" alignItems="center">
                <CircularProgress size={24} style={{ color: 'white' }} />
              </Stack>
            ) : (
              t('login.enterButton')
            )}
          </Button>
        </FormControl>
      </form>
      <Box sx={{ width: '100%', mt: 3 }}>
        <Divider sx={{ mb: 3, color: 'text.secondary', fontSize: '0.875rem' }}>
          {t('authForm.or')}
        </Divider>
      </Box>
      <GoogleOAuthProvider clientId="1090396545242-2baohi0qfsl3mm78ofhg08jqimua7rv0.apps.googleusercontent.com">
        <Box
          sx={{
            width: '100%',
            borderRadius: `${googleButtonBorderRadius}px`,
            border: '1px solid #c0bebe',
            backgroundColor: '#ffffff',
            overflow: 'hidden',
            transition: 'border-color 0.2s ease, background-color 0.2s ease',
            '&:hover': {
              borderColor: '#787b80',
              backgroundColor: '#616263',
            },
            '& > div': {
              width: '100% !important',
            },
            '& iframe': {
              width: '100% !important',
              borderRadius: `${googleButtonBorderRadius}px !important`,
            },
          }}
        >
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => {
              console.error('Error en la autenticación con Google');
            }}
            locale={i18n.language}
            theme="outline"
            size="large"
            shape="rectangular"
            text="continue_with"
            logo_alignment="center"
            width="100%"
          />
        </Box>
      </GoogleOAuthProvider>
      <ForgotPasswordModal
        open={isOtpModalOpen || otpForgotPassword}
        onClose={() => {
          setIsOtpModalOpen(false);
          setOtpForgotPassword(false);
        }}
        onConfirm={handleOtpSubmit}
      />
    </CustomDialog>
  );
};

export default SignInForm;
