import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
import React from 'react';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  description?: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = '¿Estás seguro?',
  message = 'Esta acción no se puede deshacer.',
  description,
  onClose,
  onConfirm,
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  confirmColor = 'error',
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slots={{
        transition: Transition,
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {description ? (
          typeof description === 'string' ? (
            <DialogContentText>{description}</DialogContentText>
          ) : (
            description
          )
        ) : (
          <DialogContentText>{message}</DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{cancelText}</Button>
        <Button onClick={onConfirm} variant="contained" color={confirmColor}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
