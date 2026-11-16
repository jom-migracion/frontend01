import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Box,
  Divider,
  FormControl,
  TextField,
  Typography,
  Stack,
  Link,
  Paper,
  Button,
} from '@mui/material';
import { authRegistrationScheme } from '@/modules/_auth/validations/authRegistration.scheme';
import CustomButton from '@/components/CustomButton';
import { useTranslation } from 'react-i18next';
import AuthRegitrationProps from '@/models/interfaces/AuthRegitrationProps';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useState } from 'react';
import { useSnackbar } from '@/context/SnackbarContext';
import { usePost } from '@/hooks/api';
import { useAuthContext } from '@/modules/_auth/context';
// import { jwtDecode } from 'jwt-decode';
import FacebookLogin from '@greatsumini/react-facebook-login';
import LoadingThreeDotsJumping from '@/components/LoadingThreeDotsJumping';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { zodResolver } from '@hookform/resolvers/zod';
import PasswordChangeModal from './PasswordChangeModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import { RestClient } from '@/services/RestClient';
import { useQueryClient } from '@tanstack/react-query';
import assertEnv from '@/config/env';

type AuthRegistrationFormData = z.infer<typeof authRegistrationScheme>;

interface UserProfile {
  name: string;
  email: string;
  picture: string;
  sub: string; // ID único del usuario
}

// const socialButtonStyles = {
//   textTransform: 'none',
//   justifyContent: 'flex-start',
//   pl: 2,
// };

// const socialIconStyles = {
//   width: 20,
//   height: 20,
// };

interface Token {
  jwtToken: string;
}

interface FacebookUserProfile {
  id: string;
  name: string;
  email?: string;
  picture?: {
    data: {
      url: string;
    };
  };
  accessToken: string;
}

const AuthRegistrationForm: React.FC<AuthRegitrationProps> = ({ onClose, typeLogin }) => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState<UserProfile | null>(null);
  const { mutate: enroll } = usePost('/EnrollmentLocalUserAndLogin');
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpForgotPassword, setOtpForgotPassword] = useState(false);
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] = useState(false);
  const [requiredOtp, setRequiredOtp] = useState(false);
  const showSnackbar = useSnackbar();
  const { login } = useAuthContext();
  const queryClient = useQueryClient();
  const { mutate: loginHost, isPending: isPending } = usePost<{ jwtToken: string; photo: string }>(
    '/Login'
  );
  const { mutate: postForgotPassword } = usePost<any>('/ForgotPassword');
  // const [userMeta, setUserMeta] = useState<FacebookUserProfile | null>(null);
  const googleClientId = assertEnv.VITE_KEY_GOOGLE_CLIENT_ID;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<AuthRegistrationFormData>({
    resolver: zodResolver(authRegistrationScheme),
    defaultValues: {
      phoneCode: '+591',
    },
  });

  const onSubmit = async (data: AuthRegistrationFormData) => {
    if (typeLogin == 'registration') {
      if (requiredOtp) {
        enroll(
          {
            name: data.names,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            countryId: 1,
            phoneNumber: `${data.phoneCode} ${data.phoneNumber}`,
            otpCode: data.otp,
          },
          {
            onSuccess: (responseEnroll: any) => {
              // if (responseEnroll.statusCode === '200') {
              //   // if (responseEnroll.data === "OTP_SENT") {
              //   //   setRequiredOtp(true);
              //   //   showSnackbar('Codigo OTP enviado a su correo.', 'info');
              //   //   onClose();
              //   // } else {
              //   //   showSnackbar('Error:' + responseEnroll.data, 'error');
              //   // }
              // } else {
              //   showSnackbar('Error:' + responseEnroll.data, 'error');
              // }

              if (responseEnroll?.data) {
                login(responseEnroll?.data?.jwtToken, responseEnroll?.data?.photo);
                if (responseEnroll?.data?.photo) {
                  localStorage.setItem('userPhoto', responseEnroll?.data?.photo);
                }
                showSnackbar(t('authForm.successLoginMessage'), 'success');
                // location.reload();
                queryClient.invalidateQueries({ queryKey: ['listingRent'] });
                onClose();
              } else {
                showSnackbar('Error en el registro. Intente mas tarde.', 'error');
              }
            },
            onError: (error) => {
              console.log('Existe ERROR: ', error.data.response);
              showSnackbar('Error:' + error.data, 'error');
            },
          }
        );
      } else {
        RestClient.post('/EnrollmentLocalUserAndLogin', {
          name: data.names,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          countryId: 1,
          phoneNumber: `${data.phoneCode} ${data.phoneNumber}`,
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
                  showSnackbar(
                    'Error: Estado en ' + responseEnroll?.data + ' código OTP.',
                    'error'
                  );
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
    }
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

  const handleLogin = () => {
    const loginData = getValues();
    loginHost(
      {
        platform: 'local',
        token: '',
        userName: loginData?.email,
        password: loginData?.password,
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
            onClose();
            showSnackbar(t('authForm.successLoginMessage'), 'success');
            // location.reload();
            queryClient.invalidateQueries({ queryKey: ['listingRent'] });
          } else {
            showSnackbar('Error: No se recibió el token', 'error');
          }
        },
        onError: (error) => {
          showSnackbar(
            error?.response?.data?.resultError?.message || 'Error al iniciar sesión',
            'error',
            4000
          );
        },
      }
    );
  };

  // Manejar el éxito de la autenticación Google
  const handleSuccess = (_: any) => {
    // const decodedCredential = jwtDecode(credentialResponse.credential) as UserProfile;
    // setUser(decodedCredential);
    // login(
    //   //{ user: 'gary.vera.1976@gmail.com', password: assertEnv.VITE_BACKEND_PASSWORD },
    //   { platform: 'google',
    //     token: credentialResponse.credential || '',
    //     userName: decodedCredential.email || '',
    //     password: ''
    //    },
    //   {
    //     onSuccess: (responseLogin) => {
    //       const { data } = responseLogin;
    //       console.log('data-user: ', data);
    //       const dataResponse = data as Token;
    //       if (dataResponse.jwtToken) {
    //         loginHost(decodedCredential.email || '', dataResponse.jwtToken);
    //         showSnackbar('Inicio de sesión exitoso', 'success');
    //         onClose();
    //       } else {
    //         showSnackbar('Error: No se recibió el token', 'error');
    //       }
    //     },
    //     onError: (error) => {
    //       showSnackbar(error?.message || 'Error al iniciar sesión', 'error');
    //     },
    //   }
    // );
  };

  // const validateToken = async (accessToken: string) => {
  //   try {
  //     const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`);
  //     const data = await response.json();
  //     console.log('Datos validados:', data);
  //   } catch (err) {
  //     console.error('Error al validar el token:', err);
  //   }
  // };

  // const validateToken = (accessToken: string): Promise<any> => {
  //   return fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`)
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error(`Error HTTP: ${response.status}`);
  //       }
  //       return response.json();
  //     })
  //     .then(data => {
  //       console.log('Datos validados:', data);
  //       return data;
  //     })
  //     .catch(error => {
  //       console.error('Error al validar el token:', error);
  //       throw error;
  //     });
  // };

  // Iniciar sesión con Facebook
  const handleFacebookLogin = (response: any) => {
    if (response.accessToken) {
      const userFacebookProfile: FacebookUserProfile = {
        id: response.id,
        name: response.name || 'Usuario desconocido',
        email: response.email,
        picture: response.picture,
        accessToken: response.accessToken,
      };
      // setUser(userProfile);
      // setError(null);
      // validateToken(response.accessToken); // Validar el token

      fetch(
        `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${response.accessToken}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
          }
          return response.json();
        })
        .then((_) => {
          //callback(data); // Llama al callback con los datos
          // let dataEmail = data?.email || '';
          // login(
          //   //{ user: 'gary.vera.1976@gmail.com', password: assertEnv.VITE_BACKEND_PASSWORD },
          //   { platform: 'meta',
          //     token: response.accessToken || '',
          //     userName: data.email || '',
          //     password: ''
          //    },
          //   {
          //     onSuccess: (responseLogin) => {
          //       console.log("response-user", responseLogin);
          //       const { data } = responseLogin;
          //       console.log('data-user: ', data);
          //       const dataResponse = data as Token;
          //       if (dataResponse.jwtToken) {
          //         loginHost(dataEmail, dataResponse.jwtToken);
          //         showSnackbar('Inicio de sesión exitoso', 'success');
          //         onClose();
          //       } else {
          //         showSnackbar('Error: No se recibió el token', 'error');
          //       }
          //     },
          //     onError: (error) => {
          //       showSnackbar(error?.message || 'Error al iniciar sesión', 'error');
          //     },
          //   }
          // );
        })
        .catch((error) => {
          console.error('Error al validar el token:', error);
        });
    } else {
      showSnackbar('No se pudo obtener el token de acceso. Intenta de nuevo.', 'error');
    }
  };

  // Iniciar sesión con Facebook
  // const handleLocalLogin = () => {
  //   login(
  //     {
  //       platform: 'local',
  //       token: '',
  //       userName: 'gary.vera.1976@gmail.com',
  //       password: 'Passw0rd',
  //     },
  //     {
  //       onSuccess: (responseLogin) => {
  //         const { data } = responseLogin;
  //         const dataResponse = data as Token;
  //         if (dataResponse.jwtToken) {
  //           loginHost('gary.vera.1976@gmail.com', dataResponse.jwtToken);
  //           showSnackbar('Inicio de sesión exitoso', 'success');
  //         } else {
  //           showSnackbar('Error: No se recibió el token', 'error');
  //         }
  //       },
  //       onError: (error) => {
  //         showSnackbar(error?.message || 'Error al iniciar sesión', 'error');
  //       },
  //     }
  //   );
  // };

  // Manejar el fallo del login
  const handleFacebookFailure = (error: any) => {
    //setError('Error al iniciar sesión con Facebook. Por favor, intenta de nuevo.');
    console.error('Error en la autenticación:', error);
  };

  // Manejar el fallo de la autenticación
  const handleFailure = (error: any) => {
    console.error('Error en la autenticación:', error);
  };

  // Cerrar sesión (limpiar el estado)
  const handleLogout = () => {
    setUser(null);
  };

  const handleOtpSubmit = (otp: string, newPassword: string) => {
    const registrationData = getValues();

    if (otpForgotPassword) {
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
    } else if (registrationData) {
      enroll(
        {
          name: registrationData.names,
          lastName: registrationData.lastName,
          email: registrationData.email,
          password: registrationData.password,
          countryId: 0,
          phoneNumber: `${registrationData.phoneCode} ${registrationData.phoneNumber}`,
          otpCode: otp,
        },
        {
          onSuccess: (responseEnroll: any) => {
            if (responseEnroll?.data) {
              login(responseEnroll?.data?.jwtToken, responseEnroll?.data?.photo);
              if (responseEnroll?.data?.photo) {
                localStorage.setItem('userPhoto', responseEnroll?.data?.photo);
              }
              showSnackbar(t('authForm.successLoginMessage'), 'success');
              // location.reload();
              queryClient.invalidateQueries({ queryKey: ['listingRent'] });
              onClose();
            } else {
              showSnackbar('Error no se recuperaron los datos del registro.', 'error');
            }
          },
          onError: (error) => {
            console.log(error);
            showSnackbar('Error esta persona esta registrado.', 'error');
          },
        }
      );
      // const { data } = responseLogin;
      //     const dataResponse = data as Token;
      //     if (dataResponse.jwtToken) {
      //       login(dataResponse.jwtToken, responseLogin?.data?.photo);
      //       if (responseLogin?.data?.photo) {
      //         localStorage.setItem('userPhoto', responseLogin.data.photo);
      //       }
      //       location.reload();
      //       onClose();
      //       showSnackbar('Inicio de sesión exitoso', 'success');
      //     } else {
      //       showSnackbar('Error: No se recibió el token', 'error');
      //     }
    }

    // if (otp === otpCode){// otp === '123456') {
    //   //otpCode) {
    //   if (otpForgotPassword) {
    //     //setIsOtpModalOpen(false);
    //     setOtpForgotPassword(false);
    //     // alert('Abrir Cambioa de contraseña');
    //     setIsPasswordChangeModalOpen(true);
    //   } else if (registrationData) {
    //     enroll(
    //       {
    //         name: registrationData.names,
    //         lastName: registrationData.lastName,
    //         email: registrationData.email,
    //         password: registrationData.password,
    //         countryId: 0,
    //         phoneNumber: `${registrationData.phoneCode} ${registrationData.phoneNumber}`,
    //       },
    //       {
    //         onSuccess: (responseEnroll: any) => {
    //           if (responseEnroll?.data) {
    //             login(responseEnroll?.data?.jwtToken, responseEnroll?.data?.photo);
    //             if (responseEnroll?.data?.photo) {
    //               localStorage.setItem('userPhoto', responseEnroll?.data?.photo);
    //             }
    //             showSnackbar('Inicio de sesión exitoso', 'success');
    //             onClose();
    //           } else {
    //             showSnackbar('Error no se recuperaron los datos del registro.', 'error');
    //           }
    //         },
    //         onError: (error) => {
    //           showSnackbar('Error esta persona esta registrado.', 'error');
    //         },
    //       }
    //     );
    //     setIsOtpModalOpen(false);
    //   } else {
    //     showSnackbar('Error al recuperar los datos.', 'error');
    //   }
    // } else {
    //   showSnackbar('El código OTP es inválido', 'error');
    // }
  };

  const handlePasswordChange = () => {
    setIsOtpModalOpen(false);
    setOtpForgotPassword(false);
    onClose();
    // location.reload();
    queryClient.invalidateQueries({ queryKey: ['listingRent'] });
  };

  return (
    <>
      {<LoadingThreeDotsJumping open={isPending} modal={true} />}
      <Box
        sx={{
          borderRadius: { xs: 0, sm: 13 },
          padding: { xs: '10px 10px', sm: '5px 5px 10px 5px' },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: { xs: '100%', sm: 400 },
            height: 'auto',
            minHeight:
              typeLogin === 'registration' ? { xs: 'auto', sm: 613 } : { xs: 'auto', sm: 380 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: '100%',
            px: { xs: 2, sm: 0 },
            py: { xs: 2, sm: 0 },
          }}
        >
          <Box sx={{ width: { xs: '100%', sm: '357px' }, height: 'auto' }}>
            <Box
              sx={{
                width: { xs: '100%', sm: '249px' },
                height: 'auto',
                padding: { xs: '5px', sm: '10px' },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '16px', sm: '14px' },
                  lineHeight: { xs: '120%', sm: '100%' },
                  height: 'auto',
                }}
              >
                {t('login.title')}
              </Typography>
            </Box>
            <Box
              sx={{
                width: { xs: '100%', sm: '357px' },
                height: 'auto',
                padding: { xs: '5px 0', sm: '10px' },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 300,
                  fontSize: { xs: '13px', sm: '14px' },
                  lineHeight: { xs: '140%', sm: '100%' },
                  height: 'auto',
                  width: { xs: '100%', sm: '341px' },
                }}
              >
                {typeLogin === 'registration'
                  ? `${t('authForm.textRegister')}`
                  : `${t('login.text2')}`}
              </Typography>
            </Box>
          </Box>

          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ width: '100%', maxWidth: '332px', height: 'auto' }}
          >
            {typeLogin === 'registration' ? (
              <Stack spacing={0.8} mt={2} mr={1}>
                <FormControl fullWidth>
                  <TextField
                    label={t('authForm.names')}
                    size="small"
                    variant="outlined"
                    {...register('names')}
                    error={!!errors.names}
                    helperText={errors.names && t(`authForm.errors.${errors.names?.message}`)}
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
                    label={t('authForm.lastName')}
                    size="small"
                    variant="outlined"
                    {...register('lastName')}
                    error={!!errors.lastName}
                    helperText={errors.lastName && t(`authForm.errors.${errors.lastName?.message}`)}
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
                    label={t('authForm.password')}
                    size="small"
                    variant="outlined"
                    type="password"
                    {...register('password')}
                    error={!!errors.password}
                    helperText={errors.password?.message}
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
                    label={t('authForm.confirmPassword')}
                    size="small"
                    variant="outlined"
                    type="password"
                    {...register('confirmPassword')}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    sx={{
                      '& .MuiInputBase-input': {
                        height: '15px',
                        padding: '10px',
                      },
                    }}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <PhoneInput
                    country={'bo'}
                    onChange={(_, country: any) => {
                      const newPhoneCode = `+${country.dialCode}`;

                      setValue('phoneCode', newPhoneCode, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                    inputProps={{
                      name: 'phoneCode',
                      required: true,
                      autoFocus: true,
                    }}
                    inputStyle={{
                      width: '100%',
                      height: '35px',
                      paddingLeft: '50px',
                    }}
                    containerStyle={{
                      marginBottom: '8px',
                      width: '100%',
                    }}
                    enableSearch
                    disableDropdown={false}
                  />
                  {errors.phoneCode && (
                    <Typography color="error" variant="caption">
                      {errors.phoneCode.message}
                    </Typography>
                  )}
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    label={t('authForm.phone')}
                    size="small"
                    variant="outlined"
                    {...register('phoneNumber')}
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                    sx={{
                      '& .MuiInputBase-input': {
                        height: '20px',
                        padding: '10px',
                      },
                    }}
                  />
                </FormControl>
                {requiredOtp && (
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
                )}
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: { xs: '100%', sm: '357px' },
                    height: 'auto',
                    px: { xs: 0, sm: 0 },
                  }}
                >
                  <Box
                    sx={{
                      height: 'auto',
                      padding: { xs: '5px 0', sm: '10px' },
                      marginLeft: { xs: 0, sm: '-15px' },
                      width: '100%',
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 300,
                        fontSize: { xs: '11px', sm: '12px' },
                        lineHeight: { xs: '140%', sm: '100%' },
                        letterSpacing: '0%',
                      }}
                    >
                      {t('authForm.textInfo')}
                    </Typography>
                  </Box>
                  <Box sx={{ height: 'auto', width: '100%', textAlign: 'center' }}>
                    <Typography
                      sx={{
                        width: '100%',
                        fontWeight: 300,
                        fontSize: { xs: '11px', sm: '12px' },
                        lineHeight: { xs: '140%', sm: '100%' },
                        letterSpacing: '0%',
                      }}
                    >
                      <Link href="#" underline="hover" color="info">
                        {t('authForm.linkTerms')}
                      </Link>{' '}
                      {t('authForm.and')}{' '}
                      <Link href="#" underline="hover" color="info">
                        {t('authForm.linkPrivacyPolicy')}
                      </Link>
                      .
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ paddingTop: '5px', width: '100%' }}>
                  <CustomButton
                    label={t('authForm.signUp')}
                    type="submit"
                    variant="contained"
                    color="primary"
                    borderRadius={15}
                    fullWidth
                    sx={{
                      width: '100%',
                      maxWidth: { xs: '100%', sm: '325px' },
                      height: '36px',
                      fontSize: { xs: '12px', sm: '13px' },
                      fontWeight: 600,
                      lineHeight: '100%',
                    }}
                  />
                </Box>
              </Stack>
            ) : (
              <Stack spacing={0.8} mt={2} mr={1}>
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
                    label={t('authForm.password')}
                    size="small"
                    variant="outlined"
                    type="password"
                    {...register('password')}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    sx={{
                      '& .MuiInputBase-input': {
                        height: '15px',
                        padding: '10px',
                      },
                    }}
                  />
                </FormControl>
                <Box sx={{ paddingTop: '5px', width: '100%' }}>
                  <CustomButton
                    label={t('login.enterButton')}
                    variant="contained"
                    color="primary"
                    borderRadius={15}
                    fullWidth
                    sx={{
                      width: '100%',
                      maxWidth: { xs: '100%', sm: '325px' },
                      height: '36px',
                      fontSize: { xs: '12px', sm: '13px' },
                      fontWeight: 600,
                      lineHeight: '100%',
                    }}
                    onClick={() => {
                      handleLogin();
                    }}
                  />
                </Box>
                <Box sx={{ paddingTop: '15px' }}>
                  <Link
                    variant="body2"
                    underline="hover"
                    onClick={() => {
                      console.info("I'm a button.");
                      sendOtpForgotPassword();
                    }}
                    sx={{ cursor: 'pointer' }}
                  >
                    {t('login.forgotPassword')}
                  </Link>
                </Box>
              </Stack>
            )}
            <Box sx={{ width: { xs: '100%', sm: '98%' }, height: 'auto', my: { xs: 2, sm: 0 } }}>
              <Divider sx={{ my: { xs: 2, sm: 3 } }}>{t('authForm.or')}</Divider>
            </Box>
            <Box sx={{ width: '100%', maxWidth: { xs: '100%', sm: '322px' }, height: 'auto' }}>
              <Stack spacing={2} sx={{ width: '100%', px: { xs: 0, sm: 0 } }}>
                <div style={{ width: '100%' }}>
                  {!user ? (
                    <GoogleOAuthProvider clientId={googleClientId}>
                      <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={() => handleFailure}
                        useOneTap
                        locale={i18n.language}
                      />
                    </GoogleOAuthProvider>
                  ) : (
                    <div>
                      <h2>
                        {t('login.welcome')} {user.name}
                      </h2>
                      <img
                        src={user.picture}
                        alt={t('login.profilePhotoAlt')}
                        style={{ borderRadius: '50%', width: '100px' }}
                      />
                      <p>Email: {user.email}</p>
                      <p>ID: {user.sub}</p>
                      <button onClick={handleLogout} style={{ marginTop: '10px' }}>
                        {t('login.logout')}
                      </button>
                    </div>
                  )}
                </div>
                <FacebookLogin
                  appId="2159989987788304" // Reemplaza con tu App ID
                  autoLoad={false}
                  fields="name,email,picture"
                  onSuccess={handleFacebookLogin}
                  onFail={handleFacebookFailure}
                  render={(props: { onClick?: () => void }) => (
                    <Button
                      variant="contained"
                      onClick={props.onClick ? props.onClick : undefined}
                      sx={{
                        backgroundColor: '#3b5998',
                        '&:hover': { backgroundColor: '#2a4373' },
                        fontSize: { xs: '12px', sm: '14px' },
                      }}
                      fullWidth
                    >
                      {t('login.facebook')}
                    </Button>
                  )}
                />
              </Stack>
            </Box>
          </form>
        </Paper>
      </Box>
      <ForgotPasswordModal
        open={isOtpModalOpen || otpForgotPassword}
        onClose={() => {
          setIsOtpModalOpen(false);
          setOtpForgotPassword(false);
        }}
        onConfirm={handleOtpSubmit}
      />
      <PasswordChangeModal
        open={isPasswordChangeModalOpen}
        onClose={() => setIsPasswordChangeModalOpen(false)}
        onPasswordChange={handlePasswordChange}
      />
    </>
  );
};

export default AuthRegistrationForm;
