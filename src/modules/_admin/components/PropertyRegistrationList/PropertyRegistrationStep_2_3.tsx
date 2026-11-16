import { Box, /*Card, CardContent,*/ Typography/*, styled*/ } from '@mui/material';
// // import Grid from '@mui/material/Grid2';
import CustomTextField from '@/components/CustomTextField';
// // import { GoQuestion } from 'react-icons/go';
import { useTheme } from '@mui/material/styles';
import { useStepValidation } from '@/context/FormStepContext';
import { useEffect, useRef, useState } from 'react';
import { PropertyRegistrationProps_2_3 } from '../../interface/IPropertyRegistrationProps';
import { Controller, useForm } from 'react-hook-form';
// import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  stepperProperty_2_3formSchema,
  TypeStepperProperty_2_3formSchema,
} from '../../validations/stepperProperty_2_3FormSchema';
import { usePropertyRegistration } from '@/store/listingRentPropertyRegistration.store';
import { validateOffensiveContent } from '@/utilities/contentModeration';
import { useTranslation } from 'react-i18next';

// const TipBox = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'flex-start',
//   gap: theme.spacing(2),
//   padding: theme.spacing(2.5),
//   // backgroundColor: theme.palette.grey[50],
//   borderRadius: '12px',
//   border: `1px solid ${theme.palette.divider}`,
//   marginTop: theme.spacing(4),
// }));

export const PropertyRegistrationStep_2_3: React.FC<PropertyRegistrationProps_2_3> = ({
  onChange,
}) => {
  // estado para validación de contenido
  const [contentWarnings, setContentWarnings] = useState<{
    title?: { isValid: boolean; message: string; severity: 'low' | 'medium' | 'high' };
    description?: { isValid: boolean; message: string; severity: 'low' | 'medium' | 'high' };
  }>({});
  // store
  const { title, description } = usePropertyRegistration((state) => state.data.listingData);

  // hooks
  const {
    palette: {  },
  } = useTheme();
  const { setStepValid } = useStepValidation();
  
  // hook de traducciones
  const { t } = useTranslation('translation');

  const {
    
    formState: { errors, isValid },
    watch,
    control,
  } = useForm<TypeStepperProperty_2_3formSchema>({
    defaultValues: {
      title: title,
      description: description,
    },
    mode: 'onChange',
    resolver: zodResolver(stepperProperty_2_3formSchema),
  });

  const values = watch();
  const previousValuesRef = useRef<TypeStepperProperty_2_3formSchema | null>(null);

  const normalizeSpaces = (value: string) => value.replace(/\s{2,}/g, ' ').replace(/^\s+/, '');

  // Función para validar contenido en tiempo real
  const validateFieldContent = (fieldName: 'title' | 'description', value: string) => {
    if (!value || value.trim().length === 0) {
      setContentWarnings(prev => ({ ...prev, [fieldName]: undefined }));
      return;
    }

    const validation = validateOffensiveContent(value);

    if (!validation.isValid) {
      const baseMessage = t('PropertyRegistrationStep_2_3.inappropriateContent', { defaultValue: 'Contenido inapropiado detectado:' });
      const message = `${baseMessage} ${validation.offensiveWords.join(', ')}`;
      
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

  // Verificar si el contenido es válido (sin palabras ofensivas)
  const isContentValid = () => {
    const hasContentWarnings =
      (contentWarnings.title && !contentWarnings.title.isValid) ||
      (contentWarnings.description && !contentWarnings.description.isValid);

    return !hasContentWarnings;
  };

  // Combinar validación de formulario con validación de contenido
  const isFormValid = isValid && isContentValid();

  useEffect(() => {
    setStepValid(5, isFormValid);
    const valuesChanged = JSON.stringify(previousValuesRef.current) !== JSON.stringify(values);
    const hasValues = values && typeof values === 'object' && values.title && values.description;
    if (valuesChanged || previousValuesRef.current === null && hasValues) {
      previousValuesRef.current = values;
      onChange({ step2_3: values });
    }
  }, [isFormValid, onChange, setStepValid, values]);

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 600, bgcolor:'#f8f9fc' }}>
      {/* Título principal y descripción */}
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: '1.5rem',
          mb: 1.5,
          color: 'text.primary',  
          mt: '25px'        
        }}
      >
        {t('PropertyRegistrationStep_2_3.headerTitle', { defaultValue: 'Dale personalidad a tu anuncio' })}
      </Typography>
      <Typography
        color="text.secondary"
        sx={{ mb: 4, lineHeight: 1.6, fontSize: '1rem' }}
      >
        {t('PropertyRegistrationStep_2_3.headerDescription', { defaultValue: 'Crea un título atractivo y una descripción detallada para que los huéspedes sepan qué hace que tu espacio sea único.' })}
      </Typography>

      {/* Campo Título */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: '14px',
              color: 'text.primary',
            }}
          >
            {t('PropertyRegistrationStep_2_3.titleLabel', { defaultValue: 'Título' })}
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontWeight: 500, color:'#9ca3af' }}
          >
            {watch('title')?.trim().length || 0} / 50
          </Typography>
        </Box>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <CustomTextField
              placeholder={t('PropertyRegistrationStep_2_3.titlePlaceholder', { defaultValue: 'Ej: Moderno departamento con vista al Illimani' })}
              fullWidth
              color="secondary"
              {...field}
              // onChange={(e) => {
              //   const normalizedValue = normalizeSpaces(e.target.value);
              //   field.onChange(normalizedValue);
              //   validateFieldContent('title', normalizedValue);
              // }}
              inputProps={{
                maxLength: 50,
              }}
              error={!!errors.title || !!contentWarnings.title}
              helperText={errors.title?.message || contentWarnings.title?.message}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'background.paper',                  
                },
                bgcolor:'#ffffff',
                borderRadius: '4px',
              }}
            />
          )}
        />
        <Typography
          sx={{
            mt: 1,
            lineHeight: 1.5,
            fontSize: '12px'
          }}
        >
          {t('PropertyRegistrationStep_2_3.titleHelper', { defaultValue: 'Un buen título debe ser corto, descriptivo y resaltar lo mejor de tu propiedad.' })}
        </Typography>
      </Box>

      {/* Campo Descripción */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography
          variant="h4Bold"
          sx={{
            fontWeight: 600,              

              fontSize: '14px',            
            color: 'text.primary',
            mb: 1,
          }}
        >
          {t('PropertyRegistrationStep_2_3.descriptionLabel', { defaultValue: 'Descripción' })}
        </Typography>
          <Typography
            variant="caption"            
            sx={{ fontWeight: 500, color:'#9ca3af' }}
          >
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
              minRows={6}
              maxRows={10}
              {...field}
              // onChange={(e) => {
              //   const normalizedValue = normalizeSpaces(e.target.value);
              //   field.onChange(normalizedValue);
              //   validateFieldContent('description', normalizedValue);
              // }}
              error={!!errors.description || !!contentWarnings.description}
              helperText={errors.description?.message || contentWarnings.description?.message}
              placeholder={t('PropertyRegistrationStep_2_3.descriptionPlaceholder', { 
                defaultValue: `Cuéntales a tus huéspedes:\n• ¿Qué es lo que más te gusta de tu espacio?\n• ¿Cómo es el barrio?\n• ¿Qué comodidades especiales ofreces?` 
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'background.paper',
                },
                '& textarea::placeholder': {
                  whiteSpace: 'pre-line',
                },
                bgcolor:'#ffffff',
                borderRadius: '4px'
              }}
            />
          )}
        />
      </Box>

      {/* Consejo profesional */}
      {/* <TipBox sx={{bgcolor:'#ffffff'}}>
        <LightbulbOutlinedIcon
          sx={{
            color: 'primary.main',
            fontSize: 24,
            flexShrink: 0,
            mt: 0.5,
          }}
        />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 1.6 }}
        >
          Los anuncios claros y específicos generan más reservas. Menciona detalles que no se vean en las fotos.
        </Typography>
      </TipBox> */}
    </Box>
  );
};