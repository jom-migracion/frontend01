import { zodResolver } from '@hookform/resolvers/zod';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useTheme from '@mui/material/styles/useTheme';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Controller, useForm } from 'react-hook-form';
import { TypeOf, z, ZodSchema } from 'zod';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { usePost } from '@/hooks/api';
import DayBlockCalendar from '@/models/interfaces/calendar/DayBlockCalendar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { RestClient } from '@/services/RestClient';
import { useTranslation } from 'react-i18next';
import { useNotification } from '@/context/NotificationContext';

// Esquema de validación para el formulario
const reservationSchema = z
  .object({
    availability: z.enum(['disponible', 'bloqueado'], {
      errorMap: () => ({ message: 'Debes seleccionar una opción' }),
    }),
    precioPorNoche: z
      .union([
        z
          .number()
          .min(90, 'El precio por noche debe ser al menos 90')
          .max(10000, 'El precio por noche no puede superar 10000'),
        z.literal(null),
      ])
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      if (data.availability === 'disponible') {
        return data.precioPorNoche !== null && data.precioPorNoche !== undefined;
      }
      return true;
    },
    {
      message: 'El precio es obligatorio si está disponible',
      path: ['precioPorNoche'],
    }
  );

type ReservationForm = z.infer<typeof reservationSchema>;

interface UseZodFormProps<T extends ZodSchema> {
  schema: T;
  defaultValues?: TypeOf<T>;
}
interface FormSectionProps {
  selectedDate: DayBlockCalendar[];
  onSave: () => void;
  isAvailability: 'disponible' | 'bloqueado';
}

const useZodForm = <T extends ZodSchema>({ schema, defaultValues }: UseZodFormProps<T>) => {
  return useForm<TypeOf<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  });
};

// La función para agrupar los datos (la misma que arriba)
const groupData = (data: DayBlockCalendar[]) => {
  const grouped = data.reduce(
    (acc, currentItem) => {
      const key = `${currentItem.id}-${currentItem.name}`;
      if (!acc[key]) {
        acc[key] = {
          name: currentItem.name,
          dates: [],
        };
      }
      acc[key].dates.push(currentItem.date);
      return acc;
    },
    {} as Record<string, { name: string; dates: string[] }>
  );
  return grouped;
};

const FormLockCalendar: React.FC<FormSectionProps> = ({ selectedDate, isAvailability, onSave }) => {
  const { t } = useTranslation();
  const showNotification = useNotification();
  const theme = useTheme();
  const { mutateAsync: postBlock } = usePost<any>('/Calendar/block');
  const { mutateAsync: postUnblock } = usePost<any>('/Calendar/unblock');
  const groupedData = groupData(selectedDate);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useZodForm({
    schema: reservationSchema,
    defaultValues: {
      precioPorNoche: isAvailability === 'disponible' ? 0 : undefined,
      availability: isAvailability,
    },
  });

  const availability = watch('availability');

  const handleAvailabilityChange = (value: 'disponible' | 'bloqueado') => {
    setValue('availability', value);
    if (value === 'bloqueado') {
      setValue('precioPorNoche', null, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: ReservationForm) => {
    //obtener el primer valor
    if (selectedDate.length > 0 && data.availability === 'disponible') {
      // Mapeamos sobre los datos agrupados para crear una petición por cada grupo
      const requests = Object.entries(groupedData).map(async ([key, group]) => {
        // Preparamos los datos para la API
        const property = key.split('-');
        const dataRequest = {
          listingRentId: property[0],
          dates: group.dates, // Usamos la lista de fechas del grupo actual
          blockType: 2, //data.availability === 'bloqueado' ? 1 : 2, // 1 para bloqueado, 2 para disponible
          blockReason: 'Desbloqueo manual',
        };

        await postUnblock(dataRequest);

        const dataRequestPrice = {
          dates: group.dates,
          listingRentId: property[0],
          nightPrice: data.precioPorNoche,
        };

        await RestClient.post('/Calendar/SetNightPrice', dataRequestPrice);
      });

      try {
        await Promise.all(requests);
        onSave();
      } catch (error) {
        console.log('Una o más peticiones fallaron.', error);
        alert('Error al guardar las reservas. Por favor, inténtelo de nuevo.');
      }
    } else {
      const requestsBlock = Object.entries(groupedData).map(async ([key, group]) => {
        const property = key.split('-');
        const dataRequestBlock = {
          listingRentId: property[0],
          dates: group.dates,
          blockType: 1,
          blockReason: 'Desbloqueo manual',
        };

        await postBlock(dataRequestBlock);
      });

      try {
        await Promise.all(requestsBlock);
        onSave();
      } catch (error) {
        console.log('Una o más peticiones fallaron.', error);
        showNotification(
          'error',
          'Modificar Bloqueo/Desbloqueo',
          'Error al guardar las reservas. Por favor, inténtelo de nuevo.'
        );
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ m: 'auto' }}>
        <Box mb={3}>
          {Object.entries(groupedData).map(([key, group]) => (
            <Accordion key={key}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${key}-content`}
                id={`panel-${key}-header`}
                sx={{ p: 0, m: 0, ml: 1, mr: 1, pl: 1, pr: 1 }}
              >
                <Typography
                  sx={{
                    fontFamily: theme.typography.h6,
                    color: theme.palette.text.primary,
                    maxWidth: '85%',
                  }}
                >
                  {group.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    ml: 'auto',
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    alignContent: 'center',
                  }}
                >
                  ({group.dates.length} fechas)
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <Box sx={{ p: 0 }}>
                  <List disablePadding>
                    {group.dates.map((date, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={date} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
        <Box mb={3}>
          <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
            Disponibilidad
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={availability === 'disponible'}
                  onChange={() => handleAvailabilityChange('disponible')}
                />
              }
              label="Disponible"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={availability === 'bloqueado'}
                  onChange={() => handleAvailabilityChange('bloqueado')}
                />
              }
              label="Bloqueado"
            />
          </FormGroup>
        </Box>
        <Box mb={3}>
          <Typography
            sx={{
              fontFamily: theme.typography.h4,
              color: theme.palette.text.primary,
              mt: 3,
              mb: 1,
            }}
          >
            Precio por noche
          </Typography>
          <Controller
            name="precioPorNoche"
            control={control}
            render={({ field }) => (
              <TextField
                name={field.name}
                inputRef={field.ref}
                onBlur={field.onBlur}
                value={field.value ?? ''}
                type="number"
                variant="outlined"
                fullWidth
                disabled={availability === 'bloqueado'}
                error={!!errors.precioPorNoche}
                helperText={errors.precioPorNoche?.message}
                onChange={(e) =>
                  field.onChange(e.target.value === '' ? null : Number(e.target.value))
                }
              />
            )}
          />
        </Box>
        <Button type="submit" variant="primary" fullWidth>
          {t('commonNames.save')}
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default FormLockCalendar;
