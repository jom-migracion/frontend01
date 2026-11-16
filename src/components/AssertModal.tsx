import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import useTheme from '@mui/material/styles/useTheme';
import { alpha } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import Slide from '@mui/material/Slide';
import { type TransitionProps } from '@mui/material/transitions';

interface CustomTransitionProps extends TransitionProps {
  children: React.ReactElement;
  direction?: 'up' | 'down' | 'left' | 'right';
}

const Transition = React.forwardRef((props: CustomTransitionProps, ref: React.Ref<unknown>) => {
  const { direction = 'up', ...rest } = props;
  return <Slide direction={direction} ref={ref} {...rest} />;
});

type ReservationModalProps = {
  title?: React.ReactNode;
  content?: React.ReactNode;
  open: boolean;
  onClose: () => void;
  showCloseLeft?: boolean;
  showRightIcon?: boolean;
  rightIcon?: React.ReactNode;
  showFooterButtons?: boolean;
  fullWidthA?: boolean;
  maxWidthA?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  displacement?: 'up' | 'down' | 'left' | 'right';
  onLeftButtonClick?: () => void;
  onRightButtonClick?: () => void;
  textLeftButton?: string;
  textRightButton?: string;
  primaryRightButton?: boolean;
  textContentJustify?: boolean;
};

const AssertModal: React.FC<ReservationModalProps> = ({
  title,
  content,
  open,
  onClose,
  showCloseLeft = true,
  showRightIcon = false,
  rightIcon = <AddIcon />,
  showFooterButtons = false,
  fullWidthA = true,
  maxWidthA = 'xs',
  displacement = 'up',
  onLeftButtonClick,
  onRightButtonClick,
  textLeftButton,
  textRightButton,
  primaryRightButton = false,
  textContentJustify = false,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const CustomTransition = React.useCallback(
    (props: TransitionProps & { children: React.ReactElement }) => (
      <Transition direction={displacement} {...props} />
    ),
    [displacement]
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={fullWidthA}
      maxWidth={maxWidthA}
      slots={{ transition: CustomTransition }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          },
        },
      }}
      sx={{
        '& .MuiDialog-container': {
          alignItems: 'center',
          px: { xs: 1, sm: 2 },
        },
        '& .MuiDialog-paper': {
          borderRadius: 6,
          p: { xs: 1, sm: 2 },
          m: { xs: 1, sm: 2 },
          maxHeight: 'calc(100vh - 24px)',
          height: 'auto',
          overflow: 'hidden',
          width: '100%',
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
        {/* <Box display="flex" alignItems="center"> */}
        {showCloseLeft && (
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
        )}
        {/* </Box> */}
        <Typography
          component="div"
          sx={{
            flexGrow: 1,
            textAlign: 'center',
            fontFamily: theme.typography.h6Medium,
            fontWeight: 700,
            fontSize: '1.1rem',
          }}
        >
          {title}
        </Typography>
        {showRightIcon && (
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
            {rightIcon}
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent
        sx={{
          bgcolor: 'transparent',
          textAlign: textContentJustify ? 'justify' : 'left',
          overflowY: 'auto',
          overflowX: 'hidden',
          maxHeight: { xs: 'calc(100vh - 140px)', sm: 'calc(100vh - 180px)' },
          px: { xs: 1, sm: 2 },
          py: { xs: 1, sm: 1.5 },
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(theme.palette.grey[400], 0.7),
            borderRadius: '999px',
          },
        }}
      >
        {content}
      </DialogContent>

      {showFooterButtons && (
        <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 2 }}>
          <Button
            variant={primaryRightButton ? "secondary" : "primary"}
            color="inherit"
            sx={{
              flex: 1,
              mr: 1,
            }}
            onClick={onLeftButtonClick}
          >
            {textLeftButton || t('cardProperty.step22.btn')}
          </Button>
          <Button
            variant={primaryRightButton ? "primary" : "secondary"}
            color="inherit"
            sx={{
              flex: 1,
              ml: 1,
            }}
            onClick={onRightButtonClick}
          >
            {textRightButton || t('cardProperty.step22.btnUpload')}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default AssertModal;
