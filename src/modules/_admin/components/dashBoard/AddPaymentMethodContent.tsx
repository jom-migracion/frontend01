// AddPaymentMethodContent.tsx

import React from 'react';
import { Dialog, DialogContent, Typography, IconButton, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';

interface AddPaymentMethodContentProps {
  open?: boolean;
  onClose?: () => void;
}

const AddPaymentMethodContent: React.FC<AddPaymentMethodContentProps> = ({
  open = false,
  onClose,
}) => {
  const navigate = useNavigate();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            margin: { xs: 0, sm: '32px' },
          },
        },
      }}
    >
      <DialogContent sx={{ p: 3 }}>
        {/* 1. Icono de retroceso */}
        <IconButton aria-label="back" sx={{ p: 0, mb: 2 }} onClick={onClose}>
          <ArrowBackIcon />
        </IconButton>

        {/* 2. Título */}
        <Typography variant="h5" component="h1" fontWeight="semi-bold" gutterBottom>
          Agrega un método de cobro
        </Typography>

        {/* 3. Texto de cuerpo */}
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Parece que hay un problema con tu método de cobro. Puedes eliminarlo e intentar
          configurarlo otra vez, o agregar un nuevo.
        </Typography>

        {/* 4. Botón de Acción */}
        <Button
          onClick={() => navigate('/host/info-profile/payments')}
          variant="primary" // Fondo sólido
          fullWidth
        >
          Ir a configuración
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentMethodContent;
