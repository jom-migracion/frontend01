import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Box,
  Button,
  Avatar,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { hostMessageSchema } from '../../validations/reservationStepper.scheme';
import { avatarGuest } from '@/assets';

const HostMessageCard:React.FC<{onNext: () => void, isExpanded: boolean, onToggle: any}> = ({ 
  onNext, 
  // onMessageChange, 
  isExpanded = false, 
  onToggle }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    // watch,
  } = useForm({
    resolver: zodResolver(hostMessageSchema),
    mode: 'onChange',
    defaultValues: {
      message: '',
    },
  });

  // const watchedMessage = watch('message');

  // React.useEffect(() => {
  //   if (onMessageChange) {
  //     onMessageChange({ message: watchedMessage });
  //   }
  // }, [watchedMessage, onMessageChange]);

  const onSubmit = (_:any) => {
    if (isValid) {
      onNext();
    }
  };

  return (
    <Accordion 
      expanded={isExpanded} 
      onChange={onToggle}
      sx={{ 
        maxWidth: 600,  
        mb: 2,
        '&:before': {
          display: 'none',
        },
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: '12px !important',
      }}
    >
      <AccordionSummary
        sx={{
          '& .MuiAccordionSummary-content': {
            margin: '12px 0',
          },
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          2. Mensaje al anfitrión
        </Typography>
      </AccordionSummary>
      <AccordionDetails>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Cuéntanos por qué viajas, quién te acompaña y qué es lo que más te gusta del espacio.
        </Typography>

        {/* Información del anfitrión */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar src={avatarGuest} sx={{ width: 40, height: 40, mr: 2 }} />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
               Jenny Montaño
            </Typography>
              <Typography variant="caption" color="text.secondary">
                Anfitrión desde 2020
              </Typography>
          </Box>
        </Box>

        {/* Mensaje de ejemplo del anfitrión */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="message"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                rows={4}
                placeholder="Hola, Jenny: Estaré de visita...."
                variant="outlined"
                error={!!errors.message}
                helperText={errors.message?.message}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            )}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#000',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#333',
                },
                borderRadius: 2,
                px: 4,
              }}
              disabled={!isValid}
            >
              Siguiente
            </Button>
          </Box>
        </form>
      </AccordionDetails>
    </Accordion>
  );
};

export default HostMessageCard;

