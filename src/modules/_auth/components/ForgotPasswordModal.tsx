import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid2';
import { useTranslation } from 'react-i18next';

interface ForgotPasswordProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (otp: string, newPassword: string) => void;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  outline: 'none',
};

const ForgotPasswordModal: React.FC<ForgotPasswordProps> = ({ open, onClose, onConfirm }) => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorOtp, setErrorOtp] = useState(false);
  const [errorPasswordMatch, setErrorPasswordMatch] = useState(false);

  const { t } = useTranslation();

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFormSubmit = () => {
    let isValid = true;
    setErrorOtp(false);
    setErrorPasswordMatch(false);

    if (otp.trim() === '') {
      setErrorOtp(true);
      isValid = false;
    }

    if (newPassword !== confirmPassword) {
      setErrorPasswordMatch(true);
      isValid = false;
    }

    if (isValid) {
      onConfirm(otp, newPassword);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          {t('forgotPassword.title')}
        </Typography>

        <TextField
          fullWidth
          label={t('forgotPassword.fields.otp')}
          variant="outlined"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          error={errorOtp}
          helperText={errorOtp ? t('forgotPassword.errors.otpEmpty') : ''}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label={t('forgotPassword.fields.newPassword')}
          variant="outlined"
          type={showPassword ? 'text' : 'password'}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleTogglePasswordVisibility}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label={t('forgotPassword.fields.confirmPassword')}
          variant="outlined"
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errorPasswordMatch}
          helperText={errorPasswordMatch ? t('forgotPassword.errors.passwordMismatch') : ''}
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleTogglePasswordVisibility}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Grid container spacing={2} justifyContent="flex-end">
          <Grid >
            <Button variant="outlined" onClick={onClose}>
              {t('forgotPassword.buttons.cancel')}
            </Button>
          </Grid>
          <Grid >
            <Button variant="contained" onClick={handleFormSubmit} sx={{ bgcolor: 'black', color: 'white', '&:hover': { bgcolor: 'darkgray' } }}>
              {t('forgotPassword.buttons.submit')}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default ForgotPasswordModal;