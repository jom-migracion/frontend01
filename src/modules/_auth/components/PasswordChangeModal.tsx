import React, { useState } from 'react';
import { Box, Button, Modal, TextField, Typography, IconButton, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface OtpModalProps {
  open: boolean;
  onClose: () => void;
  //onOtpSubmit: (otp: string) => void;
  onPasswordChange: () => void;
}

const PasswordChangeModal: React.FC<OtpModalProps> = ({ open, onClose, onPasswordChange }) => {
  // const [otp, setOtp] = useState('');
  // Dentro de tu componente PasswordChangeModal
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleConfirm = () => {
    if (validateForm()) {
      // Lógica para enviar el cambio de contraseña a la API
      console.log('Contraseña cambiada con éxito!');
      onClose();
    }
  };

  const validateForm = () => {
    if (newPassword === '' || confirmPassword === '') {
      setValidationError('Todos los campos son obligatorios.');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setValidationError('Las contraseñas no coinciden.');
      return false;
    }
    // Agrega más validaciones aquí
    setValidationError(''); // Limpiar errores si la validación es exitosa
    return true;
  };

  const handlePasswordChange = () => {
    if (validateForm()) {
      // Lógica para enviar el cambio de contraseña a la API
      console.log('Contraseña cambiada con éxito!');
      onPasswordChange();
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
            
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        {/* <Typography sx={{ mt: 2 }}>
          Por favor....
        </Typography> */}
        <TextField
          autoFocus
          margin="dense"
          label="Nueva Contraseña"
          type="password"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={!!validationError}
        />
        <TextField
          margin="dense"
          label="Repita contraseña"
          type="password"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={!!validationError}
          helperText={validationError}
        />
        <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
          <Button onClick={onClose} variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleConfirm} variant="contained">
            Cambiar
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default PasswordChangeModal;
