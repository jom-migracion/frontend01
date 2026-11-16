import React from 'react';
import { Alert, Slide, SlideProps, Snackbar } from '@mui/material';

interface SnackbarAlertProps {
  open: boolean;
  message: string;
  severity?: 'success' | 'error' | 'info' | 'warning'
  variant?: 'filled'| 'outlined'| 'standard'
  duration?: number;
  onClose: () => void;
}

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

const SnackbarAlert: React.FC<SnackbarAlertProps> = ({
  open,
  message,
  severity = 'error',
  duration = 4000,
  variant,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      onClose={onClose}
      autoHideDuration={duration}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      slotProps={{ transition: SlideTransition }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant={variant}
        sx={{ width: '100%', color: 'white'}}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAlert;
