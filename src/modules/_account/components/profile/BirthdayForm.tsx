import { Typography, Button, Box, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, subYears } from 'date-fns'; // Para formatear la fecha seleccionada
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/auth.store';
import { usePost } from '@/hooks/api';
import { useTranslation } from 'react-i18next';
import { useNotification } from '@/context/NotificationContext';

interface PetsProps {
  onSave: (data: Date | null) => void;
  initialDate?: Date | null; // Optional: for pre-filling the input
  initialId: number;
}

const minimumAdultDate = subYears(new Date(), 18);

// Definir el esquema de Zod y el tipo de datos directamente en el componente
const dateOfBirthSchema = z.object({
  dateOfBirth: z
    .date({
      invalid_type_error: 'La fecha de nacimiento no es válida.',
    })
    .max(minimumAdultDate, {
      message: 'No puedes registrar una fecha de nacimiento de una persona menor de 18 años.',
    })
    .max(new Date(), { message: 'La fecha no puede ser en el futuro.' })
    .nullable(),
});

type DateOfBirthForm = z.infer<typeof dateOfBirthSchema>;

const BirthdayForm: React.FC<PetsProps> = ({ initialDate, initialId, onSave }) => {
  const { t } = useTranslation();
  const showNotification = useNotification();
  const theme = useTheme();
  const { t: tcommon } = useTranslation('translation', { keyPrefix: 'commonNames' });
  const { identifier } = useAuthStore.getState();
  const { mutate: UpdatePersonalInformation } = usePost<any>('/UpsertAdditionalProfileData');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DateOfBirthForm>({
    resolver: zodResolver(dateOfBirthSchema),
    defaultValues: {
      dateOfBirth: initialDate,
    },
  });

  const onSubmit = (data: DateOfBirthForm) => {
    let dataRequest = {
      additionalProfileDataId: initialId,
      userId: identifier,
      whatIDo: null,
      wantedToGo: null,
      pets: null,
      birthday: data.dateOfBirth ? format(data.dateOfBirth, 'yyyy-MM-dd') + 'T00:00:00' : null,
      languages: null,
      liveAt: null,
      introduceYourself: null,
    };

    UpdatePersonalInformation(dataRequest, {
      onSuccess: (response) => {
        console.log(response);
        onSave(data.dateOfBirth || null);
      },
      onError: (error: any) => {
        alert('Error: ' + error);
        showNotification(
          'error',
          'Perfil: ¿Cuándo es tu cumpleaños?',
          'Hubo un error al actualizar la información.'
        );
      },
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 12 }}>
          <Typography
            sx={{
              fontFamily: theme.typography.h6,
              color: theme.palette.text.primary,
            }}
          >
            {t('myProfile.myProfilePage.Birthday.question')}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 12 }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 500,
              color: theme.palette.text.primary,
            }}
          >
            {t('myProfile.myProfilePage.Birthday.message')}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 12 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label={t('myProfile.myProfilePage.Birthday.title')}
                  disableFuture
                  maxDate={minimumAdultDate}
                  views={['year', 'month', 'day']}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.dateOfBirth,
                      helperText: errors.dateOfBirth?.message,
                    },
                  }}
                />
              )}
            />
            <Box display="flex" justifyContent="flex-end" mt={1}>
              <Button type="submit" variant="primary" sx={{ width: '150px' }}>
                {tcommon('save')}
              </Button>
            </Box>
          </form>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default BirthdayForm;
