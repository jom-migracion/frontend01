import { alpha } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import useTheme from '@mui/material/styles/useTheme';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { type TransitionProps } from '@mui/material/transitions';

// Definir las props para la transición incluyendo direction
interface CustomTransitionProps extends TransitionProps {
  children: React.ReactElement;
  direction?: 'up' | 'down' | 'left' | 'right';
}

// Componente Transition modificado para aceptar direction como prop
const Transition = React.forwardRef((props: CustomTransitionProps, ref: React.Ref<unknown>) => {
  // Extraer direction de las props, con valor por defecto
  const { direction = 'up', ...rest } = props;
  return <Slide direction={direction} ref={ref} {...rest} />;
});

interface CustomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  displacement?: 'up' | 'down' | 'left' | 'right';
}
const CustomDialog = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'xs',
  displacement = 'up',
}: CustomDialogProps) => {
  const theme = useTheme();
  const CustomTransition = React.useCallback(
    (props: TransitionProps & { children: React.ReactElement }) => (
      <Transition direction={displacement} {...props} />
    ),
    [displacement]
  );
  return (
    <Dialog
      open={isOpen}
      maxWidth={maxWidth}
      fullWidth
      slots={{
        transition: CustomTransition,
      }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          },
        },
      }}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 6,
          p: 2,
          m: 4,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          px: 3,
          py: 2.5,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Typography
          sx={{
            fontFamily: theme.typography.h6Medium,
            fontWeight: 700,
            fontSize: '1.1rem',
          }}
        >
          {title}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 12,
            top: 4,
            color: theme.palette.grey[400],
            zIndex: 10,
            transition: 'all 0.2s',
            '&:hover': {
              color: theme.palette.grey[700],
              backgroundColor: alpha(theme.palette.grey[200], 0.5),
              transform: 'rotate(90deg)',
            },
          }}
        >
          <CloseIcon sx={{ fontSize: '24px' }} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ bgcolor: 'transparent' }}>{children}</DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
