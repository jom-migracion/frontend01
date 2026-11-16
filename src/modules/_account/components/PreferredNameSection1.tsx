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

// --- Type Definitions ---
// IMPORTANTE: Inferir el tipo de las inputs directamente del esquema Zod
type LegalNameFormInputs = z.infer<typeof validationSchema>;

interface PreferredNameSectionProps {
  initialPreferredNameValue: string;
  // initialLastName: string;
  onSave: (preferredName: string) => Promise<void>; // Callback to parent
}

// --- Validation Schema (Con Zod) ---
const validationSchema = z.object({
  preferredName: z.string().trim().min(1, 'El nombre preferido es requerido.'),
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
const PreferredNameSection1: React.FC<PreferredNameSectionProps> = ({
  initialPreferredNameValue,
  onSave,
}) => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { identifier } = useAuthStore.getState();
  const { t } = useTranslation();

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
      preferredName: initialPreferredNameValue,
    },
    mode: 'onTouched',
  });

  useEffect(() => {
    reset({
      preferredName: initialPreferredNameValue,
    });
  }, [initialPreferredNameValue, reset]);

  const handleOpenForm = () => {
    setShowForm(true);
    setErrorMessage(null);
    reset({
      preferredName: initialPreferredNameValue,
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setErrorMessage(null);
    reset({
      preferredName: initialPreferredNameValue,
    });
  };

  const onSubmit = async (data: LegalNameFormInputs) => {
    setUpdating(true);
    setErrorMessage(null);

    try {
      await handleSave(data.preferredName);
    } catch (err: any) {
      setShowForm(true);
      setErrorMessage(
        err.message || 'Error al actualizar el nombre preferido. Intente nuevamente.'
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleSave = async (preferredName: string) => {
    let data = {
      userId: identifier,
      name: null,
      lastName: null,
      favoriteName: preferredName,
      email: null,
      phone: null,
      address: null,
    };

    UpdatePersonalInformation(data, {
      onSuccess: (response) => {
        console.log(response);
        setShowForm(false);
        onSave(preferredName);
      },
      onError: (error: any) => {
        console.log('Existe error', error);
        setErrorMessage(
          `Error: ${t('accountSettings.personalInformation.preferredName.messageError')}`
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
            {t('accountSettings.personalInformation.preferredName.title')}
          </SectionHeader>
          <FieldContainer>
            <Typography variant="body1" color="textSecondary">
              {initialPreferredNameValue
                ? `${initialPreferredNameValue}`
                : t('commonNames.notProvided')}
            </Typography>
            <Button
              onClick={handleOpenForm}
              variant="text"
              sx={{
                textTransform: 'none', // Esto previene que el texto se ponga en mayúsculas
                fontSize: '1.1rem', // Makes the text larger
                borderBottom: '1px solid black', // Adds a 1px solid black border at the bottom
                borderRadius: 0,
                fontWeight: 'normal',
              }}
            >
              {initialPreferredNameValue ? t('commonNames.edit') : t('commonNames.add')}
            </Button>
          </FieldContainer>
        </>
      ) : (
        <>
          <FieldContainer>
            <SectionHeader variant="h6">
              {t('accountSettings.personalInformation.preferredName.title')}
            </SectionHeader>
            <Button
              variant="text"
              onClick={handleCancel}
              disabled={updating}
              sx={{
                textTransform: 'none', // Esto previene que el texto se ponga en mayúsculas
                fontSize: '1.1rem', // El tamanio del texto
                borderBottom: '1px solid black', // interlineado sobre el boton
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
              {t('accountSettings.personalInformation.preferredName.message')}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 12 }}>
                  <Typography variant="body2" gutterBottom>
                    {t('accountSettings.personalInformation.preferredName.labelPreferredName')}
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    {...register('preferredName')}
                    error={!!errors.preferredName}
                    helperText={errors.preferredName?.message}
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

export default PreferredNameSection1;
