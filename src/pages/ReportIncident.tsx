import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import theme from '@/themes/theme';
import { useNavigate, useParams } from 'react-router';
import { queryClient } from '@/services/QueryClient';
import { useMutation } from '@tanstack/react-query';
import { ApiService } from '@/services/ApiService';
import { AssertRoutes } from '@/common/enum/AssertRoutes';
import { useSnackbar } from '@/context/SnackbarContext';
import { useTranslation } from 'react-i18next';

interface ReportIncident {
  messageTypeId: number;
  body: string;
}

const ReportIncident: React.FC = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const { id: paramId } = useParams<{ id: string }>();
  const id = paramId || '';
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const deleteMutation = useMutation({
    mutationFn: (payload: ReportIncident) =>
      ApiService.post<ReportIncident>(`/Messaging/Support/Incident/${id}`, payload),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['ReportIncident'] });
    },
    onSuccess: (_data) => {
      showSnackbar(t('contactHost.alerts.success'), 'success');
      navigate(AssertRoutes.GUEST_MESSAGE);
    },
    onError: (error: any) => {
      console.error('Error al reportar el suceso:', error);
    },
  });

  const handleConfirmIncident = () => {
    const payload: ReportIncident = {
      messageTypeId: 0,
      body: message.trim(),
    };
    deleteMutation.mutate(payload);
  };
  return (
    // Contenedor principal con padding y centrado
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      {/* Botón de retroceso */}
      <IconButton
        onClick={() => navigate(`/reservation/${id}`)}
        sx={{
          mb: 3,
          bgcolor: '#f0f0f0',
          width: 40,
          height: 40,
          '&:hover': {
            bgcolor: '#e0e0e0',
          },
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Título Principal */}
      <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Reportar suceso
      </Typography>

      {/* Instrucciones */}
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        Cuéntanos por que tienes que cancelar la reservación para revisar tu caso.
      </Typography>

      {/* Área de texto para la descripción */}
      <TextField
        fullWidth
        multiline
        rows={6}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Describe el problema"
        variant="outlined"
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: 6,
          },
        }}
      />

      {/* Nota al pie con enlace a la política */}
      <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary' }}>
        Revisaremos tu caso, para verificar si aplicaremos las sanciones de{' '}
        <Link href="#" underline="always" sx={{ color: 'text.primary', fontWeight: 'medium' }}>
          Política de cancelación del anfitrión.
        </Link>
      </Typography>

      {/* Botón de acción alineado a la derecha */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          size="medium"
          disabled={!message.trim()}
          onClick={handleConfirmIncident}
          sx={{
            bgcolor: theme.palette.primary.main,
            color: 'white',
            textTransform: 'none',
            borderRadius: 2,
            '&:hover': {
              bgcolor: theme.palette.primary.main,
            },
            '&.Mui-disabled': {
              bgcolor: 'rgba(0, 0, 0, 0.12)',
              color: 'rgba(0, 0, 0, 0.26)',
            },
          }}
        >
          Apertura caso
        </Button>
      </Box>
    </Box>
  );
};

export default ReportIncident;
