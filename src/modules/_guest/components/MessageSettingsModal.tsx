import React from 'react';
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import ArchiveIcon from '@mui/icons-material/ArchiveOutlined';
import FeedbackIcon from '@mui/icons-material/FeedbackOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { usePost } from '@/hooks/api';
import { useSnackbar } from '@/context/SnackbarContext';
import LoadingThreeDotsJumping from '@/components/LoadingThreeDotsJumping';

import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface MessageSettingsModalProps {
  open: boolean;
  onClose: () => void;
  onArchivedMessagesClick: () => void;
}

const MessageSettingsModal: React.FC<MessageSettingsModalProps> = ({
  open,
  onClose,
  onArchivedMessagesClick,
}) => {
  const showSnackbar = useSnackbar();

  // api
  const { mutate: startConversationSupport, isPending } = usePost(
    `/Messaging/Conversations/Support`
  );

  const handleArchivedMessagesClick = () => {
    onArchivedMessagesClick();
    onClose();
  };

  // const handleSendFeedbackClick = () => {
  //   onClose();
  // };
  const handleSendMessageClick = () => {
    startConversationSupport(
      {
        bookId: 0,
        messageTypeId: 0,
        body: 'Hola, necesito ayuda con... ',
      },
      {
        onSuccess: (_) => {
          showSnackbar('Conversation inicada con soporte JoM', 'success');
        },
        onError: (error: any) => {
          showSnackbar(error?.response?.data?.message || 'Error al iniciar conversacion.', 'error');
        },
      }
    );
    onClose();
  };

  // agregar para traducir
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <>
      {<LoadingThreeDotsJumping open={isPending} modal={true} />}

      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="message-settings-title"
        maxWidth="xs"
        fullWidth
        slots={{
          transition: Transition,
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 6,
            },
          },
        }}
      >
        <DialogTitle
          id="message-settings-title"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 2,
            pt: 2,
            pb: 1,
          }}
        >
          {t('messagesUsers.messagesConfig.messagesSettings')}
          <Box display="flex" alignItems="end">
            <IconButton onClick={() => onClose()}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <Divider sx={{ mx: 2, borderColor: theme.palette.customColors.primary[1]}} />

        <List disablePadding>
          <ListItem disablePadding sx={{ pt: 4 }}>
            <ListItemButton onClick={handleArchivedMessagesClick}>
              <ListItemIcon>
                <ArchiveIcon />
              </ListItemIcon>
              <ListItemText primary={t('messagesUsers.messagesConfig.archivedMessages')} />
            </ListItemButton>
          </ListItem>

          {/* <ListItem disablePadding sx={{ pt: 2 }}>
            <ListItemButton onClick={handleSendFeedbackClick}>
              <ListItemIcon>
                <FeedbackIcon />
              </ListItemIcon>
              <ListItemText primary={t('messagesUsers.messagesConfig.sendComments')} />
            </ListItemButton>
          </ListItem> */}
          <ListItem disablePadding sx={{ pt: 2 }}>
            <ListItemButton onClick={handleSendMessageClick}>
              <ListItemIcon>
                <FeedbackIcon />
              </ListItemIcon>
              <ListItemText primary={t('messagesUsers.messagesConfig.chatWithJom')} />
            </ListItemButton>
          </ListItem>
        </List>
      </Dialog>
    </>
  );
};

export default MessageSettingsModal;
