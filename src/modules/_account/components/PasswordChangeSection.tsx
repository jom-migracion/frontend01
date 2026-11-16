import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  CircularProgress,
  Collapse,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePost } from '@/hooks/api';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';

type PasswordChangeFormInputs = z.infer<typeof validationSchema>;

interface PasswordChangeProps {
  initialId: number;
  onSave: (
    id: number,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => Promise<void>; // Callback to parent
}

// --- Validation Schema (Con Zod) ---
const validationSchema = z
  .object({
    currentPassword: z.string().trim().min(1, 'La contraseña actual es requerida.'),
    newPassword: z
      .string()
      .trim()
      .min(1, 'La nueva contraseña es requerida.')
      .refine((value) => value.length >= 8, {
        message: 'La nueva contraseña debe tener al menos 8 caracteres.',
      })
      .refine((value) => /[A-Z]/.test(value), {
        message: 'La nueva contraseña debe tener al menos una letra mayúscula.',
      })
      .refine((value) => /[a-z]/.test(value), {
        message: 'La nueva contraseña debe tener al menos una letra minúscula.',
      })
      .refine((value) => /\d/.test(value), {
        message: 'La nueva contraseña debe tener al menos un número.',
      })
      .refine((value) => /[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>/]/.test(value), {
        message: 'La nueva contraseña debe tener al menos un carácter especial.',
      }),
    confirmPassword: z.string().trim().min(1, 'La confirmación de contraseña es requerida.'),
    otpCode: z.string().trim().optional(), // Nuevo campo: OTP (se validará en el modal)
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las nuevas contraseñas no coinciden.', // Mensaje de error para la validación cruzada
    path: ['confirmPassword'], // Aplica el error al campo 'confirmPassword'
  });

// --- Styled Components ---
const StyledPaper = styled(Paper)(() => ({
  border: 0,
  boxShadow: 'none',
  borderBottom: '1px solid #ccc',
  paddingBottom: '20px',
  borderRadius: 0,
}));

const SectionHeader = styled(Typography)(() => ({
  fontWeight: 600,
}));

const FieldContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  border: 0,
}));

// --- PasswordChangeSection Component ---
const PasswordChangeSection: React.FC<PasswordChangeProps> = ({ /*initialId,*/ onSave }) => {
  const { t } = useTranslation();

  // Estados para el flujo
  const [showForm, setShowForm] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false); // NUEVO
  const [passwordData, setPasswordData] = useState<PasswordChangeFormInputs | null>(null); // NUEVO: Datos para el paso 2
  const [otpError, setOtpError] = useState<string | null>(null); // NUEVO: Error del modal

  // Hooks de API (SE ASUMEN ESTOS ENDPOINTS CORRECTOS)
  const { mutate: RequestOtp, isPending: requestingOtp } = usePost<any>('/ChangePassword'); // API 1
  const { mutate: ChangePassword, isPending: changingPassword } = usePost<any>('/ChangePassword'); // API 2

  // Control para el campo OTP dentro del modal
  const {
    register: otpRegister,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm<{ otpCode: string }>();

  const {
    // control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    register,
  } = useForm<PasswordChangeFormInputs>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
  });

  useEffect(() => {
    reset({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  }, [reset]);

  const handleOpenForm = () => {
    setShowForm(true);
    setErrorMessage(null);
    reset({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleCancel = () => {
    setShowForm(false);
    setErrorMessage(null);
    reset({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleCloseOtpModal = () => {
    setShowOtpModal(false);
    setOtpError(null);
  };

  // PASO 1: Envío del formulario principal (SOLICITAR OTP)
  const onSubmit = async (data: PasswordChangeFormInputs) => {
    setUpdating(true);
    setErrorMessage(null);
    setPasswordData(data); // Guardar datos para el paso 2

    let dataRequest = {
      newPassword: data.newPassword,
      oldPassword: data.currentPassword,
      otpCode: '',
    };
    RequestOtp(dataRequest, {
      onSuccess: () => {
        // setShowForm(false);
        // onSave(selectedCity?.label || '');
        setShowOtpModal(true);
        setShowForm(false); // Ocultar el formulario principal
        setUpdating(false); // Detener el loading general
      },
      onError: (error: any) => {
        //alert("Error: no controlado.")
        // onSave(selectedCity?.label || '');
        setErrorMessage(
          error?.response?.data?.message || 'Error al solicitar el código OTP. Verifique su contraseña actual e intente nuevamente.'
        );
        setUpdating(false);
      },
    });
  };

  // PASO 2: Envío del formulario del modal (VERIFICAR OTP Y CAMBIAR CONTRASEÑA)
  const onOtpSubmit = async (otpFormData: { otpCode: string }) => {
    if (!passwordData) return;

    setOtpError(null);

    const apiData = {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
      confirmPassword: passwordData.confirmPassword,
      otpCode: otpFormData.otpCode,
    };

    // 2. Llamar a la API para CAMBIAR la contraseña con el OTP
    ChangePassword(apiData, {
      onSuccess: () => {
        handleCloseOtpModal(); // Cerrar el modal
        onSave(
          0,
          passwordData.currentPassword,
          passwordData.newPassword,
          passwordData.confirmPassword
        ); // Callback al padre
        reset({ currentPassword: '', newPassword: '', confirmPassword: '' }); // Resetear el formulario principal
      },
      onError: (error: any) => {
        console.log('Error al cambiar la contraseña con OTP', error);
        setOtpError(
          error?.response?.data?.message ||
            'Código OTP inválido o expirado. Intente reenviar o verifique su entrada.'
        );
      },
    });
  };

  // Función para reenviar el OTP (simplemente llama a la API 1 de nuevo)
  const handleResendOtp = () => {
    if (!passwordData || requestingOtp) return;

    RequestOtp(
      { currentPassword: passwordData.currentPassword },
      {
        onSuccess: () => {
          setOtpError('Código OTP reenviado con éxito a su correo.');
        },
        onError: (error) => {
          setOtpError('Error al reenviar el código OTP. Intente de nuevo. ' + (error?.response?.data?.message || error));
        },
      }
    );
  };

  // --- Renderizado del Dialog de OTP ---
  const OtpDialog = () => (
    <Dialog
      open={showOtpModal}
      onClose={handleCloseOtpModal}
      aria-labelledby="otp-dialog-title"
      disableEscapeKeyDown={changingPassword} // Opcional: Deshabilita cerrar con ESC
      fullWidth
      maxWidth="xs" // Define un ancho más apropiado para formularios
    >
      <DialogTitle id="otp-dialog-title">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="h2" fontWeight={600}>
            Verificación de Código OTP
          </Typography>
          <IconButton onClick={handleCloseOtpModal} disabled={changingPassword}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {' '}
        {/* dividers añade una línea separadora */}
        <Collapse in={!!otpError}>
          <Alert severity={otpError?.includes('éxito') ? 'success' : 'error'} sx={{ mb: 2 }}>
            {otpError}
          </Alert>
        </Collapse>
        <Typography sx={{ mt: 0, mb: 2 }}>
          Se ha enviado un código de verificación (OTP) a su correo electrónico. Por favor,
          ingréselo a continuación.
        </Typography>
        <form onSubmit={handleOtpSubmit(onOtpSubmit)}>
          <TextField
            autoFocus // Foco automático al abrir
            fullWidth
            label="Código OTP (6 dígitos)"
            variant="outlined"
            margin="normal"
            {...otpRegister('otpCode', { required: 'El código OTP es requerido.' })}
            error={!!otpErrors.otpCode}
            helperText={otpErrors.otpCode?.message}
            disabled={changingPassword || requestingOtp}
          />
          {/* Nota: En DialogContent se recomienda solo contenido. Las acciones van en DialogActions.
                   Dejaremos el botón de "Verificar" en DialogActions y solo el de "Reenviar" aquí si es necesario,
                   o moveremos ambos a DialogActions. Moveremos ambos.
                */}
          <input type="submit" style={{ display: 'none' }} /> {/* Input invisible para el submit */}
        </form>
      </DialogContent>

      <DialogActions sx={{ flexDirection: 'column', gap: 1, padding: '16px 24px' }}>
        <Button
          onClick={handleOtpSubmit(onOtpSubmit)} // Usar el handler del form para la validación
          variant="primary"
          fullWidth
          disabled={changingPassword || requestingOtp}
        >
          {changingPassword ? <CircularProgress size={24} /> : 'Verificar y Cambiar Contraseña'}
        </Button>
        <Button
          variant="secondary"
          fullWidth
          onClick={handleResendOtp}
          disabled={changingPassword || requestingOtp}
        >
          {requestingOtp ? <CircularProgress size={24} /> : 'Reenviar Código OTP'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <StyledPaper>
        {/* ... (El renderizado condicional de showForm permanece igual) */}
        {!showForm ? (
          // Vista de solo visualización
          <>
            <SectionHeader variant="h6">{t('authForm.password')}</SectionHeader>
            <FieldContainer>
              <Typography variant="body1" color="textSecondary">
                {'********'}
              </Typography>
              <Button
                onClick={handleOpenForm}
                variant="text"
                sx={{
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  borderBottom: '1px solid black',
                  borderRadius: 0,
                  fontWeight: 'normal',
                }}
              >
                {t('accountSettings.loginAndSecurity.btn')}
              </Button>
            </FieldContainer>
          </>
        ) : (
          // Vista de formulario
          <>
            <FieldContainer>
              <SectionHeader variant="h6">{t('authForm.password')}</SectionHeader>
              <Button
                variant="text"
                onClick={handleCancel}
                disabled={updating}
                sx={{
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  borderBottom: '1px solid black',
                  borderRadius: 0,
                  fontWeight: 'normal',
                }}
              >
                {t('commonNames.cancel')}
              </Button>
            </FieldContainer>

            <Collapse in={!!errorMessage}>
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            </Collapse>

            <Box sx={{ mt: 0 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {t('accountSettings.loginAndSecurity.textChange')}
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 12 }}>
                    <TextField
                      fullWidth
                      label={t('accountSettings.loginAndSecurity.textCurrent')}
                      type="password"
                      variant="outlined"
                      {...register('currentPassword')}
                      error={!!errors.currentPassword}
                      helperText={errors.currentPassword?.message}
                      disabled={updating}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12 }}>
                    <TextField
                      fullWidth
                      label={t('accountSettings.loginAndSecurity.textNew')}
                      type="password"
                      variant="outlined"
                      {...register('newPassword')}
                      error={!!errors.newPassword}
                      helperText={errors.newPassword?.message}
                      disabled={updating}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12 }}>
                    <TextField
                      fullWidth
                      label={t('accountSettings.loginAndSecurity.textConfirm')}
                      type="password"
                      variant="outlined"
                      {...register('confirmPassword')}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message}
                      disabled={updating}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button type="submit" variant="primary" disabled={updating || !isDirty}>
                    {updating ? <CircularProgress size={24} /> : `${t('accountSettings.loginAndSecurity.btnRequest')}`}
                  </Button>
                </Box>
              </form>
            </Box>
          </>
        )}
      </StyledPaper>

      {/* Nuevo componente Modal para el OTP */}
      <OtpDialog />
    </>
  );
};

export default PasswordChangeSection;
