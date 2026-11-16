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
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePost } from '@/hooks/api';
import { useAuthStore } from '@/store/auth.store';
import { useTranslation } from 'react-i18next';
import { ofuscarCorreo } from '@/common/util/stringFunctions';

// --- Type Definitions ---
// IMPORTANTE: Inferir el tipo de las inputs directamente del esquema Zod
type LegalNameFormInputs = z.infer<typeof validationSchema>;

interface EmailSectionProps {
  initialEmail: string | null;
  onSave: (email: string) => Promise<void>; // Callback to parent
}

// --- Validation Schema (Con Zod) ---
const validationSchema = z.object({
  email: z.string().trim().min(1, 'El nombre preferido es requerido.'),
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

// --- LegalNameSection Component ---
const EmailSection1: React.FC<EmailSectionProps> = ({ initialEmail, onSave }) => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { identifier, user } = useAuthStore.getState();
  const { t } = useTranslation();

  const resolvedEmail = initialEmail ?? (user ?? '');

  const { mutate: UpdatePersonalInformation } = usePost<any>('/UpdatePersonalInformation');

  const {
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    register,
  } = useForm<LegalNameFormInputs>({
    // IMPORTANTE: Usar zodResolver
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: resolvedEmail,
    },
    mode: 'onTouched',
  });

  useEffect(() => {
    reset({
      email: resolvedEmail,
    });
  }, [resolvedEmail, reset]);

  const handleOpenForm = () => {
    setShowForm(true);
    setErrorMessage(null);
    reset({
      email: resolvedEmail,
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setErrorMessage(null);
    reset({
      email: resolvedEmail,
    });
  };

  const onSubmit = async (data: LegalNameFormInputs) => {
    setUpdating(true);
    setErrorMessage(null);

    try {
      await handleSave(data.email);
    } catch (err: any) {
      setShowForm(true);
      setErrorMessage(
        err.message || 'Error al actualizar el nombre preferido. Intente nuevamente.'
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleSave = async (email: string) => {
    let data = {
      userId: identifier,
      name: null,
      lastName: null,
      favoriteName: null,
      email: email,
      phone: null,
      address: null
    };

    UpdatePersonalInformation(data, {
      onSuccess: (response) => {
        // console.log(response);
        setShowForm(false);
        onSave(email);
      },
      onError: (error: any) => {
        console.log('Existe error', error);
        setErrorMessage(
          `Error: ${t('accountSettings.personalInformation.emailAddress.messageError')}`
        );
        setShowForm(true);
      },
    });
  };

  return (
    <StyledPaper>
      {!showForm ? (
        <>
          <SectionHeader variant="h6">
            {t('accountSettings.personalInformation.emailAddress.title')}
          </SectionHeader>
          <FieldContainer>
            <Typography variant="body1" color="textSecondary">
              {ofuscarCorreo(resolvedEmail)}
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
              {t('commonNames.edit')}
              {/* {initialEmail ? t('commonNames.edit') : t('commonNames.add')} */}
            </Button>
          </FieldContainer>
        </>
      ) : (
        <>
          <FieldContainer>
            <SectionHeader variant="h6">
              {t('accountSettings.personalInformation.emailAddress.title')}
            </SectionHeader>
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
              {t('accountSettings.personalInformation.emailAddress.message')}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 12 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    disabled={updating}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button type="submit" variant="primary" disabled={updating || !isDirty}>
                  {updating ? <CircularProgress size={24} /> : t('commonNames.saveAndContinue')}
                </Button>
              </Box>
            </form>
          </Box>
        </>
      )}
    </StyledPaper>
  );
};

export default EmailSection1;
