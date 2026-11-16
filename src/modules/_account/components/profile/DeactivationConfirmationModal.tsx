import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
  Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface DeactivationConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userEmail: string;
}

const DeactivationConfirmationModal: React.FC<DeactivationConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  userEmail,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-modal-title"
      sx={{
        '& .MuiDialog-paper': {
          minWidth: fullScreen ? '100%' : 450,
          borderRadius: fullScreen ? 0 : 3,
        },
      }}
    >
      <DialogTitle id="confirmation-modal-title" sx={{ fontWeight: 'bold' }}>
        {t('securitySettings.deactivateAccount.title')}
      </DialogTitle>
      <DialogContent sx={{ padding: 0 }}>
        <Box
          sx={{
            padding: theme.spacing(2),
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography fontWeight="bold">{userEmail}</Typography>
        </Box>
        <Box
          sx={{
            padding: theme.spacing(2),
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography>{t('securitySettings.deactivateAccount.message1')}</Typography>
        </Box>
        <Box sx={{ padding: theme.spacing(2) }}>
          <Typography>
            {t('securitySettings.deactivateAccount.message2')}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: theme.spacing(3) }}>
        <Button
          onClick={onClose}
          variant="primary"
          sx={{
            flexGrow: 1
          }}
        >
          {t('commonNames.cancel')}
        </Button>
        <Button
          onClick={onConfirm}
          variant="primary"
          sx={{
            flexGrow: 1
          }}
        >
          {t('commonNames.yesConfirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeactivationConfirmationModal;
