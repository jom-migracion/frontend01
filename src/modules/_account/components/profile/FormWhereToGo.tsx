import { Box, Button, TextField, Typography, useTheme } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid2';
import { usePost } from '@/hooks/api';
import { useAuthStore } from '@/store/auth.store';
import { useNotification } from '@/context/NotificationContext';

interface FormData {
  whereToGo: string;
}

interface WhereToGoProps {
  onSave: (data: string) => void;
  initialWhereToGo: string;
  initialId: number;
}

const FormWhereToGo: React.FC<WhereToGoProps> = ({ initialWhereToGo, initialId, onSave }) => {
  const MAX_CHARACTERS = 40;
  const { t } = useTranslation();
  const showNotification = useNotification();
  const theme = useTheme();
  const { identifier } = useAuthStore.getState();
  const { mutate: UpdatePersonalInformation } = usePost<any>('/UpsertAdditionalProfileData');

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      whereToGo: initialWhereToGo,
    },
    mode: 'onChange',
  });

  // Observe el campo de entrada para obtener su valor actual para el recuento de caracteres
  const whereToGoValue = watch('whereToGo');
  const charactersRemaining = MAX_CHARACTERS - (whereToGoValue?.length || 0);

  const onSubmit = (data: FormData) => {
    let dataRequest = {
      additionalProfileDataId: initialId,
      userId: identifier,
      whatIDo: null,
      wantedToGo: data.whereToGo,
      pets: null,
      birthday: null,
      languages: null,
      liveAt: null,
      introduceYourself: null,
    };

    UpdatePersonalInformation(dataRequest, {
      onSuccess: (response) => {
        console.log(response);
        onSave(data.whereToGo);
      },
      onError: (error: any) => {
        console.log('Existe error', error);
        showNotification(
          'error',
          'Perfil: ¿A dónde siempre quisiste viajar?',
          'Hubo un error al actualizar la información.'
        );
      },
    });
  };

  return (
    <Grid container spacing={4}>
      <Grid size={{ xs: 12, md: 12 }}>
        <Box mb={1}>
          <Typography
            sx={{
              fontFamily: theme.typography.h6,
              color: theme.palette.text.primary,
            }}
          >
            {t('myProfile.myProfilePage.whereIAlwaysWantedToGo.question')}
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.primary,
            }}
          >
            {t('myProfile.myProfilePage.whereIAlwaysWantedToGo.message')}
          </Typography>
        </Box>
      </Grid>
      <Grid size={{ xs: 12, md: 12 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="whereToGo"
            control={control}
            rules={{
              required: 'Este campo es obligatorio',
              maxLength: {
                value: MAX_CHARACTERS,
                message: `El texto no puede exceder los ${MAX_CHARACTERS} caracteres`,
              },
              max: MAX_CHARACTERS,
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder={`${t('myProfile.myProfilePage.whereIAlwaysWantedToGo.title')}:`}
                variant="outlined"
                error={!!errors.whereToGo}
                helperText={errors.whereToGo ? errors.whereToGo.message : ''}
              />
            )}
          />
          <Box display="flex" justifyContent="flex-end" alignItems="center" mt={1} mb={1}>
            <Typography
              variant="caption"
              color={charactersRemaining < 0 ? 'error' : 'text.secondary'}
            >
              {charactersRemaining} {t('commonNames.availableCharacters')}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="flex-end" mt={1}>
            <Button type="submit" variant="primary" sx={{ width: '150px' }}>
              {t('commonNames.save')}
            </Button>
          </Box>
        </form>
      </Grid>
    </Grid>
  );
};

export default FormWhereToGo;
