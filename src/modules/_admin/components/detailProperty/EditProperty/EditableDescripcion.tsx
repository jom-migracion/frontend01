import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Divider, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import {
  stepperProperty_2_3formSchema,
  TypeStepperProperty_2_3formSchema,
} from '@/modules/_admin/validations/stepperProperty_2_3FormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomTextField from '@/components/CustomTextField';
import { usePut } from '@/hooks/api';
import { useSnackbar } from '@/context/SnackbarContext';
import LoadingThreeDotsJumping from '@/components/LoadingThreeDotsJumping';
import { validateOffensiveContent,  } from '@/utilities/contentModeration';
// import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
const EditableDescripcion: React.FC<{
  listingRentId: number;
  title: string;
  description: string;
}> = ({ listingRentId, title = '', description = '' }) => {
  // estado para validación de contenido
  const [contentWarnings, setContentWarnings] = useState<{
    title?: { isValid: boolean; message: string; severity: 'low' | 'medium' | 'high' };
    description?: { isValid: boolean; message: string; severity: 'low' | 'medium' | 'high' };
  }>({});
  // api
  const { mutate: UpdateNameAndDescription, isPending } = usePut(
    `/Host/ListingRent/${listingRentId}/UpdateNameAndDescription`
  );

  // hooks
  const { t } = useTranslation('translation', { keyPrefix: 'admin.registerProperty.step23' });
  const { t: tcommon } = useTranslation('translation', { keyPrefix: 'commonNames' });

  const { t: tEditor } = useTranslation();

  const showSnackbar = useSnackbar();

  const {
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
    control,
  } = useForm<TypeStepperProperty_2_3formSchema>({
    defaultValues: {
      title: title,
      description: description,
    },
    mode: 'onChange',
    resolver: zodResolver(stepperProperty_2_3formSchema),
  });

  // functions
    const normalizeSpaces = (value: string) => value.replace(/\s{2,}/g, ' ').replace(/^\s+/, '');
  const validateFieldContent = (fieldName: 'title' | 'description', value: string) => {
    if (!value || value.trim().length === 0) {
      setContentWarnings(prev => ({ ...prev, [fieldName]: undefined }));
      return;
    }

    const validation = validateOffensiveContent(value);
    
    if (!validation.isValid) {
      const message = `${tEditor('descriptionEditor.validation.inappropriateContent')} ${validation.offensiveWords.join(', ')}`;
      setContentWarnings(prev => ({
        ...prev,
        [fieldName]: {
          isValid: false,
          message,
          severity: validation.severity
        }
      }));
    } else {
      setContentWarnings(prev => ({ ...prev, [fieldName]: undefined }));
    }
  };

  // Función para verificar si el contenido es válido para guardar
  const isContentValid = () => {
    const currentValues = getValues();
    
    // Si no hay advertencias de contenido, es válido
    const hasContentWarnings = 
      (contentWarnings.title && !contentWarnings.title.isValid) ||
      (contentWarnings.description && !contentWarnings.description.isValid);
    
    // Si hay valores pero no hemos validado aún, validar ahora
    if (currentValues.title && !contentWarnings.title) {
      const titleValidation = validateOffensiveContent(currentValues.title);
      if (!titleValidation.isValid) return false;
    }
    
    if (currentValues.description && !contentWarnings.description) {
      const descValidation = validateOffensiveContent(currentValues.description);
      if (!descValidation.isValid) return false;
    }
    
    return !hasContentWarnings;
  };

  const onSubmit = async (data: any) => {
    // Validar contenido antes de enviar
    const titleValidation = validateOffensiveContent(data.title);
    const descriptionValidation = validateOffensiveContent(data.description);

    if (!titleValidation.isValid || !descriptionValidation.isValid) {
      showSnackbar(tEditor('descriptionEditor.validation.checkSnackbar'), 'error');
      return;
    }

    const request = {
      title: data.title,
      description: data.description,
    };
    UpdateNameAndDescription(request, {
      onSuccess: (response) => {
        const { statusCode, resultError } = response;

        if (statusCode === '200') {
          showSnackbar(tEditor('descriptionEditor.messages.successUpdate'), 'success');
        } else {
          showSnackbar(resultError?.message, 'error');
        }
      },
      onError: (error) => {
        showSnackbar(error?.response?.data?.resultError?.message ?? error.message, 'error');
      },
    });
  };

  return (
    <>
      {<LoadingThreeDotsJumping open={isPending} modal={true} />}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography sx={{fontSize: '18px', fontWeight: '600', mt: -1.5, ml: 0}} >
          {tEditor('admin.editProperty.2.title', { defaultValue: 'Título y descripción' })}
        </Typography>
      </Stack>

      <Divider sx={{ mb: 2, mx: -4, my: -0.9 }} /> 
           
      <Box
        sx={{ pr: '20px', py: 2, width: '100%', maxWidth: 800 }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >

        <Box sx={{ mb: 4 }}>
          <Typography
            fontWeight="600"
            sx={{ fontSize: '16px', mb: 1, mt: 1, color: '#222' }}
          >
            {tEditor('admin.editProperty.2.subtitle', { defaultValue: 'Dale personalidad a tu anuncio' })}
          </Typography>
          <Typography sx={{ fontSize: '13px', color: '#717171' }}>
            {tEditor('admin.editProperty.2.description', { defaultValue: 'Crea un título atractivo y una descripción detallada para que los huéspedes sepan qué hace que tu espacio sea único.' })}            
          </Typography>
        </Box>
        <Card sx={{ m: 0, p: 0, boxShadow: 'none', border: 'none' }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#222' }}>
                {tEditor('admin.editProperty.2.titleLabel', { defaultValue: 'Título del anuncio' })}
              </Typography>
              <Typography sx={{ fontSize: 14, color: '#717171' }}>
                {watch('title')?.trim().length || 0} / 50
              </Typography>
            </Box>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <CustomTextField
                  placeholder={t('placeholderTitle')}
                  fullWidth
                  color="secondary"
                  {...field}
                //   onChange={(e) => {
                // const normalizedValue = normalizeSpaces(e.target.value);
                // field.onChange(normalizedValue);
                // validateFieldContent('title', normalizedValue);
                //   }}
                  inputProps={{
                    maxLength: 50,
                  }}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  sx={{ mb: 0.5, width: '100%' }}
                />
              )}
            />
            <Typography
              sx={{
                mt: 0.5,
                mb: 3,
                fontSize: '12px',
                color: '#6b7280',
              }}
            >
              {tEditor('admin.editProperty.2.titlePlaceholder', { defaultValue: 'Un buen título debe ser corto, descriptivo y resaltar lo mejor de tu propiedad.' })}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#717171' }}>
                 {/* {t('description')}  */}
                {watch('description')?.trim().length || 0} / 500
              </Typography>
            </Box>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <CustomTextField
                  multiline
                  fullWidth
                  color="secondary"
                  sx={{ mt: 1, width: '100%' }}
                  minRows={6}
                  maxRows={10}
                  {...field}
                //   onChange={(e) => {
                // const normalizedValue = normalizeSpaces(e.target.value);
                // field.onChange(normalizedValue);
                // validateFieldContent('description', normalizedValue);
                //   }}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  placeholder={t('placeholderDescription')}
                />
              )}
            />
            
            {/* <Alert 
              icon={<LightbulbOutlinedIcon sx={{ color: '#5b55c8' }} />}
              
              sx={{ 
                mt: 3,
                mb: 4,
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: 2,
              }}
            > */}
              {/* {t('msgDescription')} */}
              {/* Los anuncios claros y específicos generan más reservas. Menciona detalles que no se vean en las fotos.
            </Alert>   */}
          </CardContent>
        </Card>
                {/* boton guardar */}
        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            zIndex: 10,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            pt: 2,
            pb: 2,
            // mx: -10,
            px: 3,
            borderTop: '1px solid #e0e0e0',
            bgcolor: 'white',
          }}
        >
            <Button
              variant="primary"
              disabled={!isContentValid() || isPending}
              sx={{
                textTransform: 'none',
                fontSize: 16,
                fontWeight: 500,
                px: 3,
                py: 1.5,
                borderRadius: 2,
                color: '#fff',
                '&.Mui-disabled': {
                  backgroundColor: !isContentValid() ? '#ff385c' : '#e0e0e0',
                  color: !isContentValid() ? '#fff' : '#999',
                  opacity: !isContentValid() ? 0.8 : 1
                },
              }}
              type="submit"
            >
              {!isContentValid() 
                ? tEditor('descriptionEditor.buttons.inappropriate')
                : isPending 
                  ? tEditor('descriptionEditor.buttons.saving') 
                  : (tcommon('saveChanges') || 'Guardar cambios')
              }
            </Button>
          </Box>
      </Box>
    </>
  );
};

export default EditableDescripcion;
