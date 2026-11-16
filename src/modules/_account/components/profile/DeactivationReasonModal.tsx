import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  Typography,
  Radio,
  FormControlLabel,
  useMediaQuery,
  useTheme,
  Box
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface DeactivationReasonModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  options: any[];
}

const DeactivationReasonModal: React.FC<DeactivationReasonModalProps> = ({
  open,
  onClose,
  onConfirm,
  options,
}) => {
  const [selectedReason, setSelectedReason] = useState<any>(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();

  const handleReasonChange = (reason: any) => {
    setSelectedReason(reason);
  };

  const handleConfirm = () => {
    if (selectedReason) {
      onClose(); 
      onConfirm(selectedReason);
    }
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      aria-labelledby="deactivation-modal-title"
      sx={{
        '& .MuiDialog-paper': {
          minWidth: fullScreen ? '100%' : 450,
          borderRadius: fullScreen ? 0 : 3,
        }
      }}
    >
      <DialogTitle id="deactivation-modal-title" sx={{ fontWeight: 'bold' }}>
        {t('securitySettings.deactivateAccount.question')}
      </DialogTitle>
      <DialogContent dividers>
        <List disablePadding>
          {options?.map((reason) => (
            <ListItem
              key={reason.userSelectionOptionsId}
              disablePadding
              sx={{
                padding: theme.spacing(2),
                border: `1px solid ${selectedReason === reason ? theme.palette.common.black : theme.palette.divider}`,
                borderRadius: 2,
                marginBottom: theme.spacing(1.5),
                cursor: 'pointer',
                '&:hover': {
                  borderColor: theme.palette.grey[700],
                },
              }}
              onClick={() => handleReasonChange(reason)}
            >
              <FormControlLabel
                value={reason}
                control={
                  <Radio
                    checked={selectedReason === reason}
                    onChange={() => handleReasonChange(reason)}
                    name="deactivation-reason-radio"
                    color="default"
                  />
                }
                label={
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography>{reason?.optionDetail}</Typography>
                  </Box>
                }
                labelPlacement="end"
                sx={{ 
                  marginRight: 0, 
                  width: '100%', 
                  '.MuiFormControlLabel-label': { marginLeft: theme.spacing(1) }
                }}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions sx={{ padding: theme.spacing(3) }}>
        <Button 
          onClick={onClose} 
          variant="primary"
          sx={{ flexGrow: 1 }}
        >
          {t('commonNames.cancel')}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="primary"
          sx={{ 
            flexGrow: 1
          }}
          disabled={!selectedReason}
        >
          {t('commonNames.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeactivationReasonModal;