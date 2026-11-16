import { useSnackbar } from '@/context/SnackbarContext';
import { ApiService } from '@/services/ApiService';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import CustomDialog from './CustomDialog';

interface CancelRequestDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  onSuccess?: () => void;
  bookId: number | undefined;
}

const CancelRequestDialog: React.FC<CancelRequestDialogProps> = ({
  open,
  onClose,
  onSuccess,
  bookId,
}) => {
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleCancelRequest = async () => {
    if (!bookId) {
      showSnackbar('Error: No se encontró el ID de la reserva', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await ApiService.delete<any>(`/Book/${bookId}/Cancel`);

      if (!response?.hasError) {
        // console.log(response?.hasError);
        showSnackbar('Solicitud cancelada exitosamente', 'success');
        navigate(`/reservation/${bookId}`);
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      }
    } catch (error: any) {
      showSnackbar(error?.response?.data?.message || 'Error al cancelar la solicitud', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CustomDialog isOpen={open} onClose={onClose} maxWidth="sm">
        <Typography
          sx={{
            fontSize: '1.3rem',
            fontWeight: 400,
            textAlign: 'center',
            mb: 2,
            pt: 0,
            color: '#000',
            lineHeight: 1.5,
            letterSpacing: '0.01em',
          }}
        >
          ¿Quieres cancelar tu solicitud?
        </Typography>

        <Typography
          sx={{
            fontSize: '1rem',
            color: '#717171',
            textAlign: 'center',
            mb: 4.5,
            lineHeight: 1.6,
            letterSpacing: '0.01em',
            px: 6,
          }}
        >
          Si cancelas ahora, la solicitud no será respondida por el anfitrión.
        </Typography>

        <Button fullWidth variant="primary" onClick={handleCancelRequest} disabled={isLoading}>
          {isLoading ? (
            <>
              <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} />
              Cancelando...
            </>
          ) : (
            'Cancelar Solicitud'
          )}
        </Button>
      </CustomDialog>
    </>
  );
};

export default CancelRequestDialog;
