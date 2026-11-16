// import { appleIcon } from '@/assets';
import {
  ArrowBack,
  CalendarTodayOutlined,
  LockOutlined,
  PersonOutline,
  PhoneOutlined,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import {
  alpha,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  FormControl,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { useSignUpFlowStore } from '@/store/signUpFlow.store';
import { CountryPhones } from '@/common/util/countryPhones';
import {
  acceptanceTermsConditions,
  getSocialProviderData,
  registerLocalUser,
  registerSocialUser,
  resendOtpEnrollment,
  sendOtpEnrollment,
  validateOtpEnrollment,
} from '@/services/enrollmentService';
import { useSnackbar } from '@/context/SnackbarContext';
import CountryPhoneAutocomplete from './CountryPhoneAutocomplete';
import { useAuthContext } from '@/modules/_auth/context';
import { useQueryClient } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { pushToDataLayer } from '@/utilities/analytics';
import { getClaimsTokenPayload } from '@/common/util/jwtUtils';

interface SignUpForm2Props {
  open: boolean;
  onClose: () => void;
  onOpenSignIn?: () => void;
}

interface UserProfile {
  name: string;
  email: string;
  picture: string;
  sub: string;
}

const GOOGLE_CLIENT_ID =
  '1090396545242-2baohi0qfsl3mm78ofhg08jqimua7rv0.apps.googleusercontent.com';

const initialTouchedState = {
  email: false,
  names: false,
  lastName: false,
  phoneCode: false,
  phoneNumber: false,
  password: false,
  confirmPassword: false,
  birthDate: false,
};

const SignUpForm2 = ({ open, onClose, onOpenSignIn }: SignUpForm2Props) => {
  const { t } = useTranslation();
  const showSnackbar = useSnackbar();
  const step = useSignUpFlowStore((state) => state.step);
  const formData = useSignUpFlowStore((state) => state.formData);
  const setStep = useSignUpFlowStore((state) => state.setStep);
  const setField = useSignUpFlowStore((state) => state.setField);
  const resetFlow = useSignUpFlowStore((state) => state.resetFlow);
  const {
    email,
    otp,
    names,
    lastName,
    birthDate,
    password,
    confirmPassword,
    phoneCode,
    phoneNumber,
    termsAccepted,
  } = formData;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState(initialTouchedState);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState(false);
  const [googleAuthToken, setGoogleAuthToken] = useState('');
  const { login } = useAuthContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!open) {
      resetFlow();
      setTouched(initialTouchedState);
      setIsGoogleAuthenticated(false);
      setGoogleAuthToken('');
    }
  }, [open, resetFlow]);

  const todayDateString = useMemo(() => new Date().toISOString().split('T')[0], []);
  const birthDateValue = useMemo(() => {
    if (!birthDate) return null;

    const parsedDate = new Date(`${birthDate}T00:00:00`);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  }, [birthDate]);

  const emailError = useMemo(() => {
    if (!email.trim()) {
      return t('signUpForm.fields.email.errorRequired');
    }

    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      return t('signUpForm.fields.email.errorInvalid');
    }

    return '';
  }, [email, t]);

  const namesError = useMemo(() => {
    if (!names.trim()) {
      return t('signUpForm.fields.names.error');
    }

    return '';
  }, [names, t]);

  const lastNameError = useMemo(() => {
    if (!lastName.trim()) {
      return t('signUpForm.fields.lastName.error');
    }

    return '';
  }, [lastName, t]);

  const selectedCountry = useMemo(
    () => CountryPhones.find((c) => `+${c.phoneCode}` === phoneCode),
    [phoneCode]
  );

  const phoneCodeError = useMemo(() => {
    if (!phoneCode.trim()) {
      return 'El codigo de pais es obligatorio.';
    }

    if (!selectedCountry) {
      return 'El codigo de pais no es valido.';
    }

    return '';
  }, [phoneCode, selectedCountry]);

  const phoneError = useMemo(() => {
    if (!phoneNumber.trim()) {
      return 'El numero de telefono es obligatorio.';
    }

    const digits = phoneNumber.replace(/\D/g, '');

    if (selectedCountry) {
      if (digits.length !== selectedCountry.phoneLength) {
        return `El numero de telefono no es valido para el pais seleccionado y debe tener ${selectedCountry.phoneLength} digitos.`;
      }
      if (!new RegExp(selectedCountry.regex).test(digits)) {
        return 'El numero de telefono no es valido para el pais seleccionado.';
      }
    }

    return '';
  }, [phoneNumber, selectedCountry]);

  const birthDateError = useMemo(() => {
    if (!birthDate.trim()) {
      return 'La fecha de nacimiento es obligatoria.';
    }

    const parts = birthDate.split('-').map(Number);
    if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
      return 'La fecha de nacimiento no es valida.';
    }

    const [year, month, day] = parts;
    const selectedDate = new Date(year, month - 1, day);
    if (Number.isNaN(selectedDate.getTime())) {
      return 'La fecha de nacimiento no es valida.';
    }

    if (
      selectedDate.getFullYear() !== year ||
      selectedDate.getMonth() !== month - 1 ||
      selectedDate.getDate() !== day
    ) {
      return 'La fecha de nacimiento no es valida.';
    }

    if (birthDate > todayDateString) {
      return 'La fecha de nacimiento no puede ser futura.';
    }

    const today = new Date();
    let age = today.getFullYear() - year;
    const hasBirthdayPassedThisYear =
      today.getMonth() > month - 1 || (today.getMonth() === month - 1 && today.getDate() >= day);

    if (!hasBirthdayPassedThisYear) {
      age -= 1;
    }

    if (age < 18) {
      return 'Debes ser mayor o igual a 18 anios para registrarte.';
    }

    return '';
  }, [birthDate, todayDateString]);

  const passwordRules = useMemo(
    () => ({
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>/]/.test(password),
    }),
    [password]
  );

  const passwordError = useMemo(() => {
    if (isGoogleAuthenticated) {
      return '';
    }

    if (!password.trim()) {
      return 'La contrasenia es obligatoria.';
    }

    if (!passwordRules.minLength) {
      return 'La contrasenia debe tener al menos 8 caracteres.';
    }

    if (!passwordRules.uppercase) {
      return 'La contrasenia debe tener al menos una letra mayuscula.';
    }

    if (!passwordRules.lowercase) {
      return 'La contrasenia debe tener al menos una letra minuscula.';
    }

    if (!passwordRules.number) {
      return 'La contrasenia debe tener al menos un numero.';
    }

    if (!passwordRules.special) {
      return 'La contrasenia debe tener al menos un caracter especial.';
    }

    return '';
  }, [isGoogleAuthenticated, password, passwordRules]);

  const confirmPasswordError = useMemo(() => {
    if (isGoogleAuthenticated) {
      return '';
    }

    if (!confirmPassword.trim()) {
      return 'Debes confirmar la contrasenia.';
    }

    if (confirmPassword !== password) {
      return 'Las contrasenias no coinciden.';
    }

    return '';
  }, [confirmPassword, isGoogleAuthenticated, password]);

  const isValidOtp = useMemo(() => otp.trim().length === 6, [otp]);
  const isProfileComplete = useMemo(() => {
    return (
      !namesError &&
      !lastNameError &&
      !birthDateError &&
      (isGoogleAuthenticated || (!passwordError && !confirmPasswordError)) &&
      !phoneCodeError &&
      !phoneError &&
      termsAccepted
    );
  }, [
    birthDateError,
    confirmPasswordError,
    isGoogleAuthenticated,
    lastNameError,
    namesError,
    passwordError,
    phoneCodeError,
    phoneError,
    termsAccepted,
  ]);

  const getPrimaryErrorMessage = (message: string | undefined | null, fallback: string) => {
    const source = (message ?? fallback).toString();
    const firstMessage = source.split('|')[0]?.trim();
    return firstMessage || fallback;
  };

  const handleContinueToOtp = async () => {
    setTouched((prev) => ({ ...prev, email: true }));
    if (emailError) return;

    setSendingOtp(true);
    try {
      const responseEnroll = await sendOtpEnrollment(email.trim());

      if (responseEnroll?.hasError === false) {
        if (responseEnroll?.data === 'OTP_SENT') {
          setStep('otp');
        } else {
          showSnackbar('Error: Estado en ' + responseEnroll?.data + ' código OTP.', 'error');
        }
      } else {
        showSnackbar(
          'Error: ' +
            getPrimaryErrorMessage(
              responseEnroll?.resultError?.message,
              'Uno o más errores de validación ocurrieron.'
            ),
          'error'
        );
      }
    } catch (error: any) {
      showSnackbar(
        'Error: ' +
          getPrimaryErrorMessage(
            error?.response?.data?.resultError?.message,
            'No se pudo enviar el código OTP.'
          ),
        'error'
      );
    } finally {
      setSendingOtp(false);
    }
  };

  const handleValidateOtp = async () => {
    if (!isValidOtp) return;

    setVerifyingOtp(true);
    try {
      const responseValidate = await validateOtpEnrollment({
        email: email.trim(),
        otpCode: otp.trim(),
      });

      if (responseValidate?.hasError === false) {
        if (responseValidate?.data === 'OTP_VALID' || responseValidate?.statusCode === '200') {
          setStep('profile');
        } else {
          showSnackbar('Error: Estado en ' + responseValidate?.data + ' validación OTP.', 'error');
        }
      } else {
        showSnackbar(
          'Error: ' +
            getPrimaryErrorMessage(
              responseValidate?.resultError?.message,
              'Uno o más errores de validación ocurrieron.'
            ),
          'error'
        );
      }
    } catch (error: any) {
      showSnackbar(
        'Error: ' +
          getPrimaryErrorMessage(
            error?.response?.data?.resultError?.message,
            'No se pudo validar el código OTP.'
          ),
        'error'
      );
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email.trim() || resendingOtp) return;

    setResendingOtp(true);
    try {
      const responseResend = await resendOtpEnrollment(email.trim());

      if (responseResend?.hasError === false) {
        showSnackbar('Se envio un nuevo codigo OTP.', 'success');
      } else {
        showSnackbar(
          'Error: ' +
            getPrimaryErrorMessage(
              responseResend?.resultError?.message,
              'No se pudo reenviar el código OTP.'
            ),
          'error'
        );
      }
    } catch (error: any) {
      showSnackbar(
        'Error: ' +
          getPrimaryErrorMessage(
            error?.response?.data?.resultError?.message,
            'No se pudo reenviar el código OTP.'
          ),
        'error'
      );
    } finally {
      setResendingOtp(false);
    }
  };

  const handleCreateAccount = async () => {
    setTouched({
      email: true,
      names: true,
      lastName: true,
      phoneCode: true,
      phoneNumber: true,
      password: true,
      confirmPassword: true,
      birthDate: true,
    });

    if (
      !namesError &&
      !lastNameError &&
      !phoneCodeError &&
      !phoneError &&
      !birthDateError &&
      (isGoogleAuthenticated || (!passwordError && !confirmPasswordError)) &&
      isProfileComplete
    ) {
      const formattedPhone = `${phoneCode}-${phoneNumber.replace(/\D/g, '')}`;

      if (isGoogleAuthenticated && !googleAuthToken) {
        showSnackbar(
          'Error: No se encontró el token de Google para completar el registro.',
          'error'
        );
        return;
      }

      setCreatingAccount(true);
      try {
        const responseRegister: any = isGoogleAuthenticated
          ? await registerSocialUser({
              platform: 'google',
              token: googleAuthToken,
              name: names.trim(),
              lastName: lastName.trim(),
              dateOfBirth: birthDate,
              phone: formattedPhone,
            })
          : await registerLocalUser({
              email: email.trim(),
              name: names.trim(),
              lastName: lastName.trim(),
              dateOfBirth: birthDate,
              password,
              phone: formattedPhone,
            });

        if (responseRegister?.hasError === false) {
          if (responseRegister?.data?.jwtToken) {
            login(responseRegister?.data?.jwtToken, responseRegister?.data?.photo);
            if (responseRegister?.data?.photo) {
              localStorage.setItem('userPhoto', responseRegister?.data?.photo);
            }

            try {
              const claims = getClaimsTokenPayload(responseRegister?.data?.jwtToken);
              if (claims) {
                //google analityc
                pushToDataLayer('first_visit');
                pushToDataLayer('session_start');
                pushToDataLayer('sign_up', { user_id: claims.identifier || '' });
              }
              const responseAcceptance = await acceptanceTermsConditions({
                detail:
                  'He leido y acepto los Terminos y condiciones y Politica de Privacidad y el Contrato para el Uso de la Plataforma Jom de los Huespedes',
              });

              if (responseAcceptance?.hasError) {
                showSnackbar(
                  'Error: ' +
                    getPrimaryErrorMessage(
                      responseAcceptance?.resultError?.message,
                      'No se pudo registrar la aceptación de términos y condiciones.'
                    ),
                  'error'
                );
              }
            } catch (errorAcceptance: any) {
              showSnackbar(
                'Error: ' +
                  getPrimaryErrorMessage(
                    errorAcceptance?.response?.data?.resultError?.message,
                    'No se pudo registrar la aceptación de términos y condiciones.'
                  ),
                'error'
              );
            }

            handleClose();
            showSnackbar(t('authForm.successLoginMessage'), 'success');
            queryClient.invalidateQueries({ queryKey: ['listingRent'] });
          } else {
            showSnackbar(t('signUpForm.messages.errorToken'), 'error');
          }
        } else {
          showSnackbar(
            'Error: ' +
              getPrimaryErrorMessage(
                responseRegister?.resultError?.message,
                'No se pudo completar el registro de la cuenta.'
              ),
            'error'
          );
        }
      } catch (error: any) {
        showSnackbar(
          'Error: ' +
            getPrimaryErrorMessage(
              error?.response?.data?.resultError?.message,
              'No se pudo registrar la cuenta.'
            ),
          'error'
        );
      } finally {
        setCreatingAccount(false);
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const credential = credentialResponse?.credential;

    if (!credential) {
      showSnackbar('Error: No se recibió el token del proveedor de Google.', 'error');
      return;
    }

    const decodedCredential = jwtDecode(credential) as UserProfile;

    try {
      const responseSocialProvider = await getSocialProviderData({
        platform: 'google',
        token: credential,
      });

      if (
        responseSocialProvider?.statusCode === '200' &&
        responseSocialProvider?.hasError === false
      ) {
        setIsGoogleAuthenticated(true);
        setGoogleAuthToken(credential);

        // Open registration form prefilled with Google profile basics.
        setField('email', decodedCredential?.email || '');
        setField('names', responseSocialProvider?.data?.name || '');
        setField('lastName', responseSocialProvider?.data?.lastName || '');
        setStep('profile');
      } else {
        setIsGoogleAuthenticated(false);
        setGoogleAuthToken('');
        showSnackbar(
          'Error: ' +
            getPrimaryErrorMessage(
              responseSocialProvider?.resultError?.message,
              'No se pudo registrar la información del proveedor social.'
            ),
          'error'
        );
      }
    } catch (error: any) {
      setIsGoogleAuthenticated(false);
      setGoogleAuthToken('');
      showSnackbar(
        'Error: ' +
          getPrimaryErrorMessage(
            error?.response?.data?.resultError?.message,
            'Error al iniciar sesión.'
          ),
        'error'
      );
    }
  };

  const handleClose = () => {
    resetFlow();
    onClose();
  };

  const handleGoToSignIn = () => {
    handleClose();
    onOpenSignIn?.();
  };

  const renderDivider = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', my: 2 }}>
      <Box sx={{ flex: 1, height: '1px', bgcolor: '#e3e1eb' }} />
      <Typography sx={{ px: 2, color: '#6c6678', fontSize: '1rem', fontWeight: 500 }}>o</Typography>
      <Box sx={{ flex: 1, height: '1px', bgcolor: '#e3e1eb' }} />
    </Box>
  );

  // const renderSocialButton = (icon: string, label: string) => (
  //   <Button
  //     variant="outlined"
  //     startIcon={<Box component="img" src={icon} alt={label} sx={{ width: 18, height: 18 }} />}
  //   >
  //     {`Continuar con ${label}`}
  //   </Button>
  // );

  const renderGoogleSocialButton = () => (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => {
          showSnackbar('Error: No se pudo iniciar sesión con Google.', 'error');
        }}
      />
    </GoogleOAuthProvider>
  );

  const sharedInputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '16px',
      backgroundColor: '#fff',
      '& fieldset': {
        borderColor: '#d9d3e8',
      },
      '&:hover fieldset': {
        borderColor: '#b7abd9',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#6857d8',
      },
    },
  };

  const compactProfileInputSx = {
    ...sharedInputSx,
    '& .MuiInputBase-input': {
      py: 1,
    },
    '& .MuiFormHelperText-root': {
      mt: 0.25,
      mb: 0,
      lineHeight: 1.1,
    },
    '& .MuiFormHelperText-root:empty': {
      display: 'none',
    },
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(18, 14, 30, 0.28)',
          },
        },
      }}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '28px',
          p: { xs: 1.5, sm: 2 },
          m: { xs: 1.5, sm: 3 },
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #ffffff 0%, #fbf9ff 100%)',
        },
      }}
    >
      <DialogContent sx={{ p: { xs: 2, sm: 2.5 }, position: 'relative' }}>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            color: '#2d2638',
          }}
        >
          <CloseIcon sx={{ fontSize: 34 }} />
        </IconButton>

        {step === 'otp' && (
          <IconButton
            onClick={() => setStep('email')}
            sx={{
              position: 'absolute',
              top: 4,
              left: 4,
              color: '#2d2638',
            }}
          >
            <ArrowBack sx={{ fontSize: 30 }} />
          </IconButton>
        )}

        {step === 'email' && (
          <Stack spacing={0} alignItems="center" sx={{ pt: 2, pb: 1 }}>
            <Typography
              sx={{
                fontSize: { xs: '1.4rem', sm: '1.65rem' },
                fontWeight: 800,
                color: '#0f0c17',
                textAlign: 'center',
              }}
            >
              Regístrate
            </Typography>

            {renderDivider()}

            <FormControl fullWidth sx={{ mb: 0, ...sharedInputSx }}>
              <TextField
                value={email}
                onChange={(event) => setField('email', event.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                placeholder="ejemplo@correo.com"
                fullWidth
                error={touched.email && !!emailError}
                helperText={touched.email ? emailError || ' ' : ' '}
                sx={{
                  ...sharedInputSx,
                  '& .MuiInputBase-input': {
                    py: 1.8,
                    fontSize: '1rem',
                  },
                }}
              />
            </FormControl>

            <Button
              fullWidth
              onClick={handleContinueToOtp}
              disabled={sendingOtp}
              sx={{
                height: 52,
                borderRadius: '18px',
                textTransform: 'none',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: 'white',
                background: '#5f57cf',
                boxShadow: `0 18px 36px ${alpha('#6756d8', 0.22)}`,
                '&.Mui-disabled': {
                  background: '#c9c3de',
                  color: '#ffffff',
                },
                // '&:hover': {
                //   background: 'linear-gradient(90deg, #5d4ec8 0%, #564bc2 100%)',
                // },
              }}
            >
              {sendingOtp ? 'Enviando...' : 'Continuar'}
            </Button>

            {renderDivider()}

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
              display={{ xs: 'flex', sm: 'flex' }}
            >
              {renderGoogleSocialButton()}
              {/*renderSocialButton(appleIcon, 'Apple')*/}
            </Stack>
          </Stack>
        )}

        {step === 'otp' && (
          <Stack spacing={1} alignItems="center" sx={{ pt: 2, pb: 1 }}>
            <Typography
              sx={{
                fontSize: { xs: '1.4rem', sm: '1.65rem' },
                fontWeight: 800,
                color: '#0f0c17',
                textAlign: 'center',
              }}
            >
              Confirma que eres tú
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: '1rem', sm: '1.2rem' },
                color: '#6d6878',
                textAlign: 'center',
                maxWidth: 520,
              }}
            >
              Te enviamos un código a {email || 'tu correo electrónico'}.
            </Typography>

            <TextField
              value={otp}
              onChange={(event) =>
                setField('otp', event.target.value.replace(/\D/g, '').slice(0, 6))
              }
              placeholder="- - - - - -"
              autoComplete="off"
              inputProps={{
                maxLength: 6,
                inputMode: 'numeric',
                style: {
                  textAlign: 'center',
                  letterSpacing: '0.8rem',
                  fontSize: '1.35rem',
                  fontWeight: 700,
                },
              }}
              sx={{
                width: { xs: '100%', sm: 320 },
                ...sharedInputSx,
                '& .MuiOutlinedInput-root': {
                  ...sharedInputSx['& .MuiOutlinedInput-root'],
                  borderRadius: '14px',
                  '& fieldset': {
                    borderWidth: '2px',
                    borderColor: '#313131',
                  },
                },
                '& .MuiInputBase-input': {
                  py: 1.5,
                },
              }}
            />

            <Typography sx={{ color: '#2a2434', fontSize: '1rem', textAlign: 'center' }}>
              ¿No lo recibiste?{' '}
              <Link
                component="button"
                underline="always"
                onClick={handleResendOtp}
                sx={{
                  color: '#2a2434',
                  fontWeight: 700,
                  opacity: resendingOtp ? 0.6 : 1,
                  pointerEvents: resendingOtp ? 'none' : 'auto',
                }}
              >
                {resendingOtp ? 'Reenviando...' : 'Enviar un nuevo código'}
              </Link>
            </Typography>

            <Button
              onClick={handleValidateOtp}
              disabled={!isValidOtp || verifyingOtp}
              sx={{
                mt: 1,
                minWidth: 220,
                height: 52,
                borderRadius: '16px',
                textTransform: 'none',
                fontWeight: 700,
                color: 'white',
                background: '#6857d8',
                '&:hover': {
                  background: '#5a49ca',
                },
                '&.Mui-disabled': {
                  background: '#c9c3de',
                  color: '#ffffff',
                },
              }}
            >
              {verifyingOtp ? 'Verificando...' : 'Verificar código'}
            </Button>
          </Stack>
        )}

        {step === 'profile' && (
          <Stack spacing={0} sx={{ pt: 2, pb: 0.5 }}>
            <Typography
              sx={{
                fontSize: { xs: '1.4rem', sm: '1.65rem' },
                fontWeight: 800,
                color: '#0f0c17',
                textAlign: 'center',
              }}
            >
              Ahora creemos tu cuenta
            </Typography>
            <Typography
              sx={{
                mt: 0.5,
                mb: 0,
                fontSize: { xs: '0.85rem', sm: '1rem' },
                color: '#6d6878',
                textAlign: 'center',
              }}
            >
              {isGoogleAuthenticated
                ? 'Completamos tus datos de Google. Solo falta terminar tu registro.'
                : 'Esta información es obligatoria para reservar o anfitrionar.'}
            </Typography>

            {renderDivider()}

            <Grid container spacing={0.6} sx={{ mb: 0 }}>
              <Grid size={{ xs: 12, sm: 6 }} sx={{ m: 0, p: 0, pb: 0.5 }}>
                <TextField
                  value={names}
                  onChange={(event) => setField('names', event.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, names: true }))}
                  placeholder="Nombres"
                  fullWidth
                  error={touched.names && !!namesError}
                  helperText={touched.names && namesError ? namesError : undefined}
                  sx={{ ...compactProfileInputSx, mb: 0 }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutline sx={{ color: '#5b5568' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  value={lastName}
                  onChange={(event) => setField('lastName', event.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, lastName: true }))}
                  placeholder="Apellidos"
                  fullWidth
                  error={touched.lastName && !!lastNameError}
                  helperText={touched.lastName && lastNameError ? lastNameError : undefined}
                  sx={compactProfileInputSx}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutline sx={{ color: '#5b5568' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                  <DatePicker
                    value={birthDateValue}
                    onChange={(nextDate) => {
                      if (!nextDate || Number.isNaN(nextDate.getTime())) {
                        setField('birthDate', '');
                        return;
                      }

                      const yyyy = `${nextDate.getFullYear()}`;
                      const mm = `${nextDate.getMonth() + 1}`.padStart(2, '0');
                      const dd = `${nextDate.getDate()}`.padStart(2, '0');
                      setField('birthDate', `${yyyy}-${mm}-${dd}`);
                    }}
                    format="dd/MM/yyyy"
                    disableFuture
                    slots={{
                      openPickerIcon: CalendarTodayOutlined,
                      toolbar: () => null,
                    }}
                    slotProps={{
                      textField: {
                        onBlur: () => setTouched((prev) => ({ ...prev, birthDate: true })),
                        placeholder: 'Fecha de nacimiento: dd/mm/yyyy',
                        fullWidth: true,
                        error: touched.birthDate && !!birthDateError,
                        helperText:
                          touched.birthDate && birthDateError ? birthDateError : undefined,
                        sx: compactProfileInputSx,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              {!isGoogleAuthenticated && (
                <Grid size={{ xs: 12 }}>
                  <TextField
                    value={password}
                    onChange={(event) => setField('password', event.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                    placeholder="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    error={touched.password && !!passwordError}
                    helperText={touched.password && passwordError ? passwordError : undefined}
                    sx={compactProfileInputSx}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlined sx={{ color: '#5b5568' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword((value) => !value)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
              )}
              {!isGoogleAuthenticated && (
                <Grid size={{ xs: 12 }}>
                  <TextField
                    value={confirmPassword}
                    onChange={(event) => setField('confirmPassword', event.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
                    placeholder="Confirmar contraseña"
                    type={showConfirmPassword ? 'text' : 'password'}
                    fullWidth
                    error={touched.confirmPassword && !!confirmPasswordError}
                    helperText={
                      touched.confirmPassword && confirmPasswordError
                        ? confirmPasswordError
                        : undefined
                    }
                    sx={compactProfileInputSx}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlined sx={{ color: '#5b5568' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword((value) => !value)}
                              edge="end"
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
              )}
              <Grid size={{ xs: 12, sm: 4 }}>
                <CountryPhoneAutocomplete
                  value={phoneCode}
                  onChange={(nextPhoneCode) => {
                    setField('phoneCode', nextPhoneCode);
                    setTouched((prev) => ({ ...prev, phoneCode: true }));
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, phoneCode: true }))}
                  error={(touched.phoneCode || touched.phoneNumber) && !!phoneCodeError}
                  helperText={
                    touched.phoneCode || touched.phoneNumber
                      ? phoneCodeError || undefined
                      : undefined
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 8 }}>
                {/* <Box sx={{ display: 'flex', gap: 1.5 }}> */}
                <TextField
                  value={phoneNumber}
                  onChange={(event) => {
                    const digitsOnly = event.target.value.replace(/\D/g, '');
                    const limitedByCountry = selectedCountry
                      ? digitsOnly.slice(0, selectedCountry.phoneLength)
                      : digitsOnly;

                    if (
                      selectedCountry &&
                      limitedByCountry.length === selectedCountry.phoneLength &&
                      !new RegExp(selectedCountry.regex).test(limitedByCountry)
                    ) {
                      return;
                    }

                    setField('phoneNumber', limitedByCountry);
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, phoneNumber: true }))}
                  placeholder="Teléfono"
                  fullWidth
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: selectedCountry?.regex || '[0-9]*',
                    maxLength: selectedCountry?.phoneLength,
                  }}
                  error={touched.phoneNumber && !!phoneError}
                  helperText={touched.phoneNumber && phoneError ? phoneError : undefined}
                  sx={compactProfileInputSx}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneOutlined sx={{ color: '#5b5568' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                {/* </Box> */}
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5 }}>
              <Checkbox
                checked={termsAccepted}
                onChange={(event) => setField('termsAccepted', event.target.checked)}
                sx={{ p: 0.5, mr: 1, mt: -0.25 }}
              />
              <Typography sx={{ fontSize: '0.98rem', color: '#5c5768', lineHeight: 1.4 }}>
                He leído y acepto los{' '}
                <Link
                  href="/terms-and-conditions"
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  sx={{ color: '#6857d8' }}
                >
                  Términos y condiciones
                </Link>
                , la{' '}
                <Link
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  sx={{ color: '#6857d8' }}
                >
                  Política de privacidad
                </Link>{' '}
                y el Contrato para el uso de la plataforma JOM.
              </Typography>
            </Box>

            <Button
              fullWidth
              disabled={!termsAccepted || creatingAccount}
              onClick={handleCreateAccount}
              sx={{
                height: 48,
                borderRadius: '18px',
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'white',
                background: '#6857d8',
                '&:hover': {
                  background: '#6857d8',
                },
                '&.Mui-disabled': {
                  background: '#e6e6e6',
                  color: '#ffffff',
                },
              }}
            >
              {creatingAccount ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>

            <Typography sx={{ mt: 2, textAlign: 'center', color: '#5c5768', fontSize: '1rem' }}>
              ¿Ya tienes cuenta?{' '}
              <Link
                component="button"
                underline="hover"
                onClick={handleGoToSignIn}
                sx={{ color: '#6857d8', fontWeight: 700 }}
              >
                Inicia sesión
              </Link>
            </Typography>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SignUpForm2;
