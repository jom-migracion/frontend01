import React, { useState } from 'react';
import { Box, Button, Modal, TextField, Typography, IconButton, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface OtpModalProps {
  open: boolean;
  onClose: () => void;
  onOtpSubmit: (otp: string) => void;
}

const OtpModal: React.FC<OtpModalProps> = ({ open, onClose, onOtpSubmit }) => {
  const [otp, setOtp] = useState('');

  const handleConfirm = () => {
    if (otp) {
      onOtpSubmit(otp);
    }
  };

  return (
    <Modal
      open={open}
      // Desactiva el cierre al presionar la tecla Escape
      disableEscapeKeyDown
      // Desactiva el cierre al hacer clic en el fondo
      //onBackdropClick={() => {}}
    >
      <Box
        sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Verificación de Código OTP
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography sx={{ mt: 2 }}>
          Se ha enviado un código a tu correo electrónico. Por favor, ingrésalo a continuación.
        </Typography>
        <TextField
          label="Código OTP"
          fullWidth
          margin="normal"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
          <Button onClick={onClose} variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleConfirm} variant="contained">
            Confirmar
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default OtpModal;