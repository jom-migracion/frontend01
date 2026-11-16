import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useForm, Controller } from 'react-hook-form';
import {
  // Dialog,
  // DialogContent,
  FormControl,
  TextField,
  alpha,
  Link,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Stack,
  InputAdornment,
  Typography,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
// import { CloseIcon } from 'yet-another-react-lightbox';
import { IconButton } from '@mui/material';
import { theme } from '@/themes/theme';
import {
  // Login as LoginIcon,
  LockOutlined as LockIcon,
  EmailOutlined as MailIcon,
  PersonAdd as PersonAddIcon,
  VisibilityOff,
  Visibility,
} from '@mui/icons-material';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { usePost } from '@/hooks/api';
import { useSnackbar } from '@/context/SnackbarContext';
import { useAuthContext } from '@/modules/_auth/context';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
// // import LockOpenIcon from '@mui/icons-material/LockOpen';
import CustomDialog from './CustomDialog';
import { RestClient } from '@/services/RestClient';
// import assertEnv from '@/config/env';
import { jwtDecode } from 'jwt-decode';

interface Token {
  jwtToken: string;
}
// interface AuthRequest {
//   email: string;
//   password: string;
// }

interface SignInFormProps {
  open: boolean;
  onClose: () => void;
  typeLogin?: string;
}

interface UserProfile {
  name: string;
  email: string;
  picture: string;
  sub: string; // ID único del usuario
}

const SignUpForm = ({ open, onClose, typeLogin }: SignInFormProps) => {
  const googleButtonBorderRadius = 14;
  const [showPassword, setShowPassword] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const showSnackbar = useSnackbar();
  const { login } = useAuthContext();
  const [requiredOtp, setRequiredOtp] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  //const googleClientId = assertEnv.VITE_KEY_GOOGLE_CLIENT_ID;
  // Crear esquema de validación dentro del componente para usar traducciones
  const loginSchema = useMemo(
    () =>
      z
        .object({
          names: z.string().min(1, { message: t('signUpForm.fields.names.error') }),
          lastName: z.string().min(1, { message: t('signUpForm.fields.lastName.error') }),
          countryId: z.number().optional(),
          phoneNumber: z
            .string()
            .min(1, { message: 'El número de teléfono es obligatorio.' })
            .refine(
              (value) => {
                const digits = value.replace(/\D/g, '');
                return digits.length >= 8 && digits.length <= 15;
              },
              { message: 'El número de teléfono debe tener entre 8 y 15 dígitos válidos.' }
            ),
          phoneCode: z.string().optional(),
          otpCode: z.string().optional(),
          otp: z.string().optional(),
          email: z
            .string()
            .min(1, { message: t('signUpForm.fields.email.errorRequired') })
            .email({ message: t('signUpForm.fields.email.errorInvalid') }),
          password: z.string().min(8, { message: t('signUpForm.fields.password.errorMin') }),
          confirmPassword: z
            .string()
            .min(8, { message: t('signUpForm.fields.confirmPassword.errorMin') }),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: t('signUpForm.fields.confirmPassword.errorMatch'),
          path: ['confirmPassword'],
        }),
    [t]
  );

  const { mutate: loginHost, isPending: isPending } = usePost<{ jwtToken: string; photo: string }>(
    '/EnrollmentLocalUserAndLogin'
  );
  const { mutate: loginGoogle /*, isPending: */ } = usePost<{ jwtToken: string; photo: string }>(
    '/Login'
  );
  const {
    control,
    reset,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      names: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      countryId: 1,
      phoneNumber: '',
      phoneCode: '',
      otpCode: '',
      otp: '',
    },
  });

  //   const handleLogin = () => {
  //     const loginData = getValues();
  //     loginHost(
  //       {
  //         platform: 'local',
  //         token: '',
  //         userName: loginData?.email,
  //         password: loginData?.password,
  //       },
  //       {
  //         onSuccess: (responseLogin) => {
  //           const { data } = responseLogin;
  //           const dataResponse = data as Token;
  //           if (dataResponse.jwtToken) {
  //             login(dataResponse.jwtToken, responseLogin?.data?.photo);
  //             if (responseLogin?.data?.photo) {
  //               localStorage.setItem('userPhoto', responseLogin.data.photo);
  //             }
  //             reset();
  //             onClose();
  //             showSnackbar(t('authForm.successLoginMessage'), 'success');
  //             // location.reload();
  //             queryClient.invalidateQueries({ queryKey: ['listingRent'] });
  //           } else {
  //             showSnackbar('Error: No se recibió el token', 'error');
  //           }
  //         },
  //         onError: (error) => {
  //           showSnackbar(
  //             error?.response?.data?.resultError?.message || 'Error al iniciar sesión',
  //             'error',
  //             4000
  //           );
  //         },
  //       }
  //     );
  //   };

  const onSubmit = async (data: any, event?: React.BaseSyntheticEvent) => {
    const submitter = (event?.nativeEvent as SubmitEvent | undefined)?.submitter as
      | HTMLButtonElement
      | undefined;

    // Con esto evitamos que otros elementos disparen accidentalmente el submit del formulario. Creo!!!
    if (!submitter || submitter.name !== 'local-signup-submit') {
      return;
    }

    if (typeLogin === 'registration') {
      // console.log('Es registration');
    }
    // console.log('Data del formulario:', data);
    // setIsLoading(true);
    if (requiredOtp) {
      loginHost(
        {
          name: data?.names,
          lastName: data?.lastName,
          email: data?.email,
          password: data?.password,
          countryId: 0,
          phoneNumber: `${data?.phoneNumber}`,
          otpCode: data?.otp,
        },
        {
          onSuccess: (responseLogin) => {
            const { data } = responseLogin;
            const dataResponse = data as Token;
            if (dataResponse.jwtToken) {
              login(dataResponse.jwtToken, responseLogin?.data?.photo);
              if (responseLogin?.data?.photo) {
                localStorage.setItem('userPhoto', responseLogin.data.photo);
              }
              reset();
              onClose();
              showSnackbar(t('authForm.successLoginMessage'), 'success');
              queryClient.invalidateQueries({ queryKey: ['listingRent'] });
            } else {
              showSnackbar(t('signUpForm.messages.errorToken'), 'error');
            }
          },
          onError: (error) => {
            showSnackbar(
              error?.response?.data?.resultError?.message || t('signUpForm.messages.errorGeneric'),
              'error',
              4000
            );
          },
        }
      );
    } else {
      // console.log('Realizando registro y envío de OTP', data);
      RestClient.post('/EnrollmentLocalUserAndLogin', {
        name: data.names,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        countryId: 0,
        phoneNumber: `${data.phoneNumber}`,
        otpCode: '',
      })
        .then((responseEnroll: any) => {
          if (responseEnroll?.status == 200) {
            if (responseEnroll?.data?.hasError == false) {
              if (responseEnroll?.data?.data == 'OTP_SENT') {
                setRequiredOtp(true);
                showSnackbar(
                  'Para completar su acceso/proceso, hemos enviado un Código de Verificación de un Solo Uso (OTP) a su dirección de correo electrónico registrada.' +
                    '  Por favor, revise su bandeja de entrada (y la carpeta de spam) e introduzca el código de 6 dígitos en el campo correspondiente.',
                  'info',
                  8000
                );
              } else {
                showSnackbar('Error: Estado en ' + responseEnroll?.data + ' código OTP.', 'error');
              }
            } else {
              showSnackbar('Error: ' + responseEnroll.data, 'error');
            }
          } else {
            showSnackbar('Error: ' + responseEnroll.data?.resultError?.message, 'error');
          }
        })
        .catch((error) => {
          showSnackbar('Error: ' + error?.response?.data?.resultError?.message, 'error', 8000);
        });
    }
    //  setIsLoading(false);
  };

  const submitLocalRegistration = handleSubmit(onSubmit);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const submitter = (event.nativeEvent as SubmitEvent | undefined)?.submitter as
      | HTMLButtonElement
      | undefined;

    // Solo validamoss y envía el formulario para el botón local.
    if (!submitter || submitter.name !== 'local-signup-submit') {
      event.preventDefault();
      return;
    }

    submitLocalRegistration(event);
  };

  // const GoogleLoginButton = () => {
  //   const googleLogin = useGoogleLogin({
  //     onSuccess: handleSuccess,
  //     onError: () => handleFailure,
  //   });

  //   return (
  //     <Button
  //       variant="outlined"
  //       fullWidth
  //       onClick={() => googleLogin()}
  //       sx={{
  //         textTransform: 'none',
  //         py: 1,
  //         fontSize: '0.9375rem',
  //         fontWeight: 500,
  //         color: 'text.primary',
  //         borderRadius: 2,
  //         borderColor: 'divider',
  //         '&:hover': {
  //           borderColor: 'text.secondary',
  //           backgroundColor: 'action.hover',
  //         },
  //       }}
  //       startIcon={
  //         <Box
  //           component="img"
  //           src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
  //           alt="Google"
  //           sx={{ width: 20, height: 20 }}
  //         />
  //       }
  //     >
  //       {t('login.continueWithGoogle') || 'Continuar con Google'}
  //     </Button>
  //   );
  // };

  const handleSuccess = async (credentialResponse: any) => {
    const decodedCredential = jwtDecode(credentialResponse.credential) as UserProfile;

    loginGoogle(
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
                localStorage.setItem('userPhoto', responseLogin.data.photo);
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

  const brandColor = '#6366f1';
  // const secondaryColor = '#818cf8';

  const handleClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      nameRef.current?.focus();
    }, 300);

    return () => clearTimeout(timer);
  }, [open]);

  return (
    <CustomDialog isOpen={open} onClose={handleClose} maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 3,
        }}
      >
        {/* <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            //   background: `linear-gradient(135deg, ${brandColor} 0%, ${secondaryColor} 100%)`,
            backgroundColor: '#ebe8e8aa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            //  boxShadow: `0 8px 16px ${alpha(brandColor, 0.3)}`,
            mb: 2,
          }}
        >
          <PersonAddIcon sx={{ color: 'gray', fontSize: 30 }} />
        </Box> */}
        <Typography variant="h5" fontWeight="700" color="text.primary">
          {typeLogin === 'registration' ? t('signUpForm.title') : t('login.enterButton')}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 0.5 }}>
          {typeLogin === 'registration' ? t('signUpForm.subtitle') : t('signUpForm.welcomeBack')}
        </Typography>
      </Box>
      {termsAccepted ? (
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
      ) : (
        <Box
          sx={{
            width: '100%',
            borderRadius: `${googleButtonBorderRadius}px`,
            border: '1px solid #e0e0e0',
            backgroundColor: '#f3f3f3',
            color: '#b0b0b0',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 1.2,
            mb: 1.5,
            cursor: 'not-allowed',
            opacity: 0.7,
            fontWeight: 500,
            fontSize: '0.9375rem',
            userSelect: 'none',
          }}
        >
          <Box
            component="img"
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            sx={{ width: 20, height: 20, mr: 1, filter: 'grayscale(1)' }}
          />
          {t('login.continueWithGoogle') || 'Continuar con Google'}
        </Box>
      )}
      <Box sx={{ width: '100%', mt: 0 }}>
        <Divider sx={{ mb: 3, color: 'text.secondary', fontSize: '0.875rem' }}>
          {t('signUpForm.divider')}
        </Divider>
      </Box>
      <form onSubmit={handleFormSubmit}>
        <Grid container columnSpacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 6 }}>
            <FormControl fullWidth>
              <Controller
                name="names"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    inputRef={nameRef}
                    placeholder={t('signUpForm.fields.names.placeholder')}
                    error={!!errors.names}
                    helperText={errors.names && errors.names.message}
                    autoComplete="off"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlineOutlinedIcon
                              fontSize="small"
                              sx={{ color: 'action.active' }}
                            />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <FormControl fullWidth>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    placeholder={t('signUpForm.fields.lastName.placeholder')}
                    error={!!errors.lastName}
                    helperText={errors.lastName && errors.lastName.message}
                    autoComplete="off"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeOutlinedIcon fontSize="small" sx={{ color: 'action.active' }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    placeholder={t('signUpForm.fields.email.placeholder')}
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
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('signUpForm.fields.password.placeholder')}
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
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('signUpForm.fields.confirmPassword.placeholder')}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
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
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <Box
                    sx={{
                      '& .react-tel-input .form-control': {
                        width: '100%',
                        height: '44px',
                        borderRadius: '12px',
                        borderColor: '#e0e0e0',
                        '& fieldset': {
                          borderColor: '#e0e0e0',
                        },
                        backgroundColor: '#fff',
                        transition: 'all 0.2s',
                        paddingLeft: '58px',
                        fontSize: '0.9rem',
                        fontFamily: theme.typography.fontFamily,
                      },
                      '& .react-tel-input .form-control:hover': {
                        border: `1px solid ${theme.palette.grey[300]}`,
                      },
                      '& .react-tel-input .form-control:focus': {
                        backgroundColor: 'white',
                        boxShadow: `0 4px 12px ${alpha(brandColor, 0.1)}`,
                        border: `1px solid ${brandColor}`,
                      },
                      '& .react-tel-input .flag-dropdown': {
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '12px 0 0 12px',
                      },
                      '& .react-tel-input .selected-flag': {
                        borderRadius: '12px 0 0 12px',
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
                      },
                    }}
                  >
                    <PhoneInput
                      country={'bo'}
                      value={field.value}
                      onChange={(value, country: any) => {
                        if (country && country.dialCode) {
                          const phoneOnly = value.slice(country.dialCode.length);
                          setValue('phoneCode', `+${country.dialCode}`);
                          field.onChange(`+${country.dialCode}${phoneOnly}`);
                        } else {
                          field.onChange(value);
                        }
                      }}
                      enableSearch
                      disableDropdown={false}
                    />
                  </Box>
                )}
              />
              {errors.phoneNumber && (
                <Typography color="error" variant="caption" sx={{ ml: 1, mt: 0.5 }}>
                  {errors.phoneNumber.message}
                </Typography>
              )}
            </FormControl>
          </Grid>
          {requiredOtp && (
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <TextField
                  label="Codigo OTP"
                  size="small"
                  variant="outlined"
                  {...register('otp')}
                  error={!!errors.otp}
                  helperText={errors.otp?.message}
                  sx={{
                    '& .MuiInputBase-input': {
                      height: '20px',
                      padding: '10px',
                    },
                  }}
                />
              </FormControl>
            </Grid>
          )}
          <Grid size={{ xs: 12 }}>
            {/* check */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', px: 1, pt: 2 }}>
              <Checkbox
                size="small"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                sx={{ p: 0.5, pt: 0, mr: 0.5 }}
              />
              <Typography
                variant="caption"
                align="left"
                color="text.secondary"
                sx={{ display: 'block', lineHeight: 1.3, textAlign: 'justify' }}
              >
                {t('signUpForm.terms.text')}
                {'\n'}
                <Link
                  target="_blank"
                  href="/terms-and-conditions"
                  underline="hover"
                  sx={{ fontWeight: 600, color: brandColor }}
                >
                  {t('signUpForm.terms.termsLink')}
                </Link>{' '}
                {t('signUpForm.terms.and')}{' '}
                <Link
                  target="_blank"
                  href="/privacy-policy"
                  underline="hover"
                  sx={{ fontWeight: 600, color: brandColor }}
                >
                  {t('signUpForm.terms.privacyLink')}{' '}
                </Link>
                {t('signUpForm.terms.and')}
                {'  '}
                {t('signUpForm.terms.the')} {'  '}
                <Link
                  target="_blank"
                  href="/guest-contract"
                  underline="hover"
                  sx={{ fontWeight: 600, color: brandColor }}
                >
                  {t('signUpForm.terms.contractPlatform')}
                </Link>
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth margin="normal">
              <Button
                name="local-signup-submit"
                variant="primary"
                type="submit"
                fullWidth
                disabled={!termsAccepted}
              >
                {isPending ? (
                  <Stack direction="row" alignItems="center">
                    <CircularProgress size={24} style={{ color: 'white' }} />
                  </Stack>
                ) : (
                  t('signUpForm.buttons.submit')
                )}
              </Button>
            </FormControl>
          </Grid>
        </Grid>
      </form>
    </CustomDialog>
  );
};

export default SignUpForm;
