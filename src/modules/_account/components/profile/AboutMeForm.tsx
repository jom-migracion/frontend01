import { Box, Button, TextField, Typography, useTheme } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid2';
import { usePost } from '@/hooks/api';
import { useAuthStore } from '@/store/auth.store';
import { useNotification } from '@/context/NotificationContext';

interface FormData {
  aboutMe: string;
}

interface WhatIDoProps {
  onSave: (data: string) => void;
  initialAboutMe?: string;
  initialId: number;
}

const AboutMeForm: React.FC<WhatIDoProps> = ({ initialAboutMe, initialId, onSave }) => {
  const MAX_CHARACTERS = 100;
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
      aboutMe: initialAboutMe,
    },
    mode: 'onChange',
  });

  const aboutMeValue = watch('aboutMe');
  const charactersRemaining = MAX_CHARACTERS - (aboutMeValue?.length || 0);

  const onSubmit = (data: FormData) => {
    let dataRequest = {
      additionalProfileDataId: initialId,
      userId: identifier,
      whatIDo: null,
      wantedToGo: null,
      pets: null,
      birthday: null,
      languages: null,
      liveAt: null,
      introduceYourself: data.aboutMe,
    };

    UpdatePersonalInformation(dataRequest, {
      onSuccess: (response) => {
        console.log(response);
        onSave(data.aboutMe);
      },
      onError: (error: any) => {
        alert('Error: ' + error);
        showNotification(
          'error',
          'Perfil: Información sobre mí',
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
            {t('myProfile.myProfilePage.aboutMe.introduceYourself')}
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 500,
              color: theme.palette.text.primary,
            }}
          >
            {t('myProfile.myProfilePage.aboutMe.message')}
          </Typography>
        </Box>
      </Grid>
      <Grid size={{ xs: 12, md: 12 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="aboutMe"
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
                multiline
                rows={4}
                fullWidth
                placeholder={`${t('myProfile.myProfilePage.aboutMe.defaultMessage')}:`}
                variant="outlined"
                error={!!errors.aboutMe}
                helperText={errors.aboutMe ? errors.aboutMe.message : ''}
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

export default AboutMeForm;
