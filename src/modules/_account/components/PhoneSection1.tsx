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
import { maskFirstFourDigits } from '@/common/util/stringFunctions';

// --- Type Definitions ---
// IMPORTANTE: Inferir el tipo de las inputs directamente del esquema Zod
type LegalNameFormInputs = z.infer<typeof validationSchema>;

interface EmailSectionProps {
  initialCodeCountry: string;
  initialPhone: string;
  onSave: (phoneCode: string, phone: string) => Promise<void>; // Callback to parent
}

// --- Validation Schema (Con Zod) ---
const validationSchema = z.object({
  phone: z.string().trim().min(1, 'El nombre preferido es requerido.'),
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
const PhoneSection1: React.FC<EmailSectionProps> = ({ initialCodeCountry, initialPhone, onSave }) => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { identifier } = useAuthStore.getState();
  const { t } = useTranslation();

  const { mutate: UpdatePersonalInformation} = usePost<any>(
    '/UpdatePersonalInformation'
  );
  
  const {
    // control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    register,
  } = useForm<LegalNameFormInputs>({
    // IMPORTANTE: Usar zodResolver
    resolver: zodResolver(validationSchema),
    defaultValues: {
      phone: initialPhone,
    },
    mode: 'onTouched',
  });

  useEffect(() => {
    reset({
      phone: initialPhone,
    });
  }, [initialPhone, reset]);


  const handleOpenForm = () => {
    setShowForm(true);
    setErrorMessage(null);
    reset({
      phone: initialPhone,
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setErrorMessage(null);
    reset({
      phone: initialPhone,
    });
  };

  const onSubmit = async (data: LegalNameFormInputs) => {
    setUpdating(true);
    setErrorMessage(null);

    try {
      await handleSave(data.phone);
    } catch (err: any) {
      setShowForm(true);
      setErrorMessage(err.message || 'Error al actualizar el número de teléfono. Intente nuevamente.');
    } finally {
      setUpdating(false);
    }
  };

  const handleSave = async (phone:string) => {
    let data ={
      userId: identifier,
      name: null,
      lastName: null,
      favoriteName: null,
      email: null,
      phone: `+591-${phone}`,
      address: null,
    };

    UpdatePersonalInformation(data,{
      onSuccess: (response) => {
        console.log(response);
        setShowForm(false);
        onSave("", phone);
      },
      onError: (error: any) => {
        console.log("Existe error", error);
        setErrorMessage(`Error: ${t("accountSettings.personalInformation.telephoneNumber.messageError")}`);
        setShowForm(true);
      }}
    );
  };

  return (
    <StyledPaper>
      {!showForm ? (
        <>
          <SectionHeader variant="h6">{t("accountSettings.personalInformation.telephoneNumber.title")}</SectionHeader>
          <FieldContainer>
            <Typography variant="body1" color="textSecondary">
              {initialPhone
                ? `+${initialCodeCountry} ${maskFirstFourDigits(initialPhone)}`
                : t("commonNames.notProvided")}
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
              {initialPhone ? t("commonNames.edit") : t("commonNames.add") }
            </Button>
          </FieldContainer>
        </>
      ) : (
        <>
          <FieldContainer>
            <SectionHeader variant="h6">{t("accountSettings.personalInformation.telephoneNumber.title")}</SectionHeader>
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
              {t("commonNames.cancel")}
            </Button>
          </FieldContainer>
          <Collapse in={!!errorMessage}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          </Collapse>
          <Box sx={{ mt: 0 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t("accountSettings.personalInformation.telephoneNumber.message")}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid size={{xs:12, sm: 12}}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    {...register('phone')}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    disabled={updating}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={updating || !isDirty}
                >
                  {updating ? <CircularProgress size={24} /> : t("commonNames.saveAndContinue")}
                </Button>
              </Box>
            </form>
          </Box>
        </>
      )}
    </StyledPaper>
  );
};

export default PhoneSection1;