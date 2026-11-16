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
type EmergencyContactFormInputs = z.infer<typeof validationSchema>;

interface EmergencyContactSectionProps {
  initialId: number;
  initialName: string;
  initialRelationship: string;
  initialEmail: string;
  initialPhone: string;
  onSave: (
    id: number,
    name: string,
    relationship: string,
    email: string,
    phone: string
  ) => Promise<void>; // Callback to parent
}

// --- Validation Schema (Con Zod) ---
const validationSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es requerido.'),
  relationship: z.string().trim().min(1, 'La relacion es requerido.'),
  email: z.string().trim().min(1, 'El correo electronico es requerido.'),
  phone: z.string().trim().min(1, 'El correo es requerido.'),
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
const EmergencyContactSection1: React.FC<EmergencyContactSectionProps> = ({
  initialId,
  initialName,
  initialRelationship,
  initialEmail,
  initialPhone,
  onSave,
}) => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { identifier } = useAuthStore.getState();
  const { t } = useTranslation();

  const { mutate: UpdatePersonalInformation } = usePost<any>('/UpsertEmergencyContact');

  const {
    // control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    register,
  } = useForm<EmergencyContactFormInputs>({
    // IMPORTANTE: Usar zodResolver
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: initialName,
      relationship: initialRelationship,
      email: initialEmail,
      phone: initialPhone,
    },
    mode: 'onTouched',
  });

  useEffect(() => {
    reset({
      name: initialName,
      relationship: initialRelationship,
      email: initialEmail,
      phone: initialPhone,
    });
  }, [initialName, initialRelationship, initialEmail, initialPhone, reset]);

  const handleOpenForm = () => {
    setShowForm(true);
    setErrorMessage(null);
    reset({
      name: initialName,
      relationship: initialRelationship,
      email: initialEmail,
      phone: initialPhone,
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setErrorMessage(null);
    reset({
      name: initialName,
      relationship: initialRelationship,
      email: initialEmail,
      phone: initialPhone,
    });
  };

  const onSubmit = async (data: EmergencyContactFormInputs) => {
    setUpdating(true);
    setErrorMessage(null);

    try {
      await handleSave(data.name, data.relationship, data.email, data.phone);
    } catch (err: any) {
      setShowForm(true);
      setErrorMessage(
        err.message || 'Error al actualizar contacto de emergencia. Intente nuevamente.'
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleSave = async (
    name: string,
    relationship: string,
    email: string,
    phoneNumber: string
  ) => {
    let data = {
      emergencyContactId: initialId,
      userId: identifier,
      name: name,
      lastName: '',
      relationship: relationship,
      languageId: 1,
      email: email,
      phoneNumber: `+591-${phoneNumber}`,
    };

    UpdatePersonalInformation(data, {
      onSuccess: (response) => {
        console.log(response);
        setShowForm(false);
        onSave(0, name, relationship, email, phoneNumber);
      },
      onError: (error: any) => {
        console.log('Existe error', error);
        setErrorMessage(
          `Error: ${t('accountSettings.personalInformation.emergencyContact.messageError')}`
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
            {t('accountSettings.personalInformation.emergencyContact.title')}
          </SectionHeader>
          <FieldContainer>
            <Typography variant="body1" color="textSecondary">
              {initialName ? initialName : t('commonNames.notProvided')}
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
              {initialName ? t('commonNames.edit') : t('commonNames.add')}
            </Button>
          </FieldContainer>
        </>
      ) : (
        <>
          <FieldContainer>
            <SectionHeader variant="h6">
              {t('accountSettings.personalInformation.emergencyContact.title')}
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
              {t('accountSettings.personalInformation.emergencyContact.message')}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    {...register('name')}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    disabled={updating}
                    placeholder={t(
                      'accountSettings.personalInformation.emergencyContact.labelName'
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    {...register('relationship')}
                    error={!!errors.relationship}
                    helperText={errors.relationship?.message}
                    disabled={updating}
                    placeholder={t(
                      'accountSettings.personalInformation.emergencyContact.labelRelationship'
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    disabled={updating}
                    placeholder={t(
                      'accountSettings.personalInformation.emergencyContact.labelEmail'
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    {...register('phone')}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    disabled={updating}
                    placeholder={t(
                      'accountSettings.personalInformation.emergencyContact.labelPhone'
                    )}
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

export default EmergencyContactSection1;
