import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Avatar, useTheme } from '@mui/material';
import { Markunread } from '@mui/icons-material';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import ArchiveIcon from '@mui/icons-material/Archive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
// import Link from '@mui/material/Link';
import { useDelete, usePut } from '@/hooks/api';
import { useSnackbar } from '@/context/SnackbarContext';
import { MdOutlineQuestionMark } from 'react-icons/md';
import ProfileModal from '@/modules/_admin/components/ProfileModal';
import { useTranslation } from 'react-i18next';
import LoadingThreeDotsJumping from '@/components/LoadingThreeDotsJumping';
import { useAuthStore } from '@/store/auth.store';

// Definimos las claves de traducción para iterar sobre ellas
// const remindersKeys = [
//   'conversationDetails.reminders.items.security',
//   'conversationDetails.reminders.items.rights',
//   'conversationDetails.reminders.items.photos',
//   'conversationDetails.reminders.items.payments',
// ];

const ConversationDetails: React.FC<{ conversation?: any, oncloseModal: (open: boolean) => void, reloadConversation: () => void, refetchConversations?: () => void, onOpenProfile?: (userId?: number, propertyId?: number) => void, onUnarchivedSuccess?: () => void }> = ({ conversation, oncloseModal, reloadConversation, refetchConversations, onOpenProfile, onUnarchivedSuccess }) => {
  // state
  const [conversationIdSelect, setConversationId] = useState<number | null>(null);
  const [openProfileModal, setOpenProfileModal] = useState<boolean>(false);

  // api  
  const { mutate: Archived, isPending: isPendingArchived } = usePut(`/Messaging/Conversations/${conversationIdSelect}/Archived`);
  const { mutate: Featured, isPending: isPendingFeatured } = usePut(`/Messaging/Conversations/${conversationIdSelect}/Featured`);
  const { mutate: Silent, isPending: isPendingSilent } = usePut(`/Messaging/Conversations/${conversationIdSelect}/Silent`);
  const { mutate: Unread, isPending: isPendingUnread } = useDelete(`/Messaging/Conversations/${conversationIdSelect}/Unread`);

  const { mutate: Unarchived } = useDelete(`/Messaging/Conversations/${conversationIdSelect}/Unarchived`);
  const { mutate: Unfeatured } = useDelete(`/Messaging/Conversations/${conversationIdSelect}/Unfeatured`);
  const { mutate: Unsilent } = useDelete(`/Messaging/Conversations/${conversationIdSelect}/Unsilent`);
  const { mutate: MarkRead } = usePut(`/Messaging/Conversations/${conversationIdSelect}/Read`);

  const showSnackbar = useSnackbar();
  const { typography } = useTheme()
  const { t } = useTranslation();
  const { identifier: userId } = useAuthStore.getState();

  const handleMarkConversation = (type: string) => {
    if (conversationIdSelect) {
      if (type === 'A' && conversation?.archived) {
        Unarchived({}, {
          onSuccess: (response) => {
            const { resultError, statusCode } = response;
            if (statusCode == '200') { 
              showSnackbar(t('conversationDetails.feedback.unarchived'), 'success');
              reloadConversation();
              if (refetchConversations) refetchConversations();
              if (onUnarchivedSuccess) {
                onUnarchivedSuccess();
              }
              oncloseModal(false);
            }
            else showSnackbar(resultError?.message, 'error');
          },
          onError: (error: any) => showSnackbar(error?.message, 'error')
        });
        return;
      } else if (type === 'F' && conversation?.featured) {
        Unfeatured({}, {
          onSuccess: (response) => {
            const { resultError, statusCode } = response;
            if (statusCode == '200') { 
              showSnackbar(t('conversationDetails.feedback.unfeatured'), 'success');
              reloadConversation();
              if (refetchConversations) refetchConversations();
              oncloseModal(false);
            }
            else showSnackbar(resultError?.message, 'error');
          },
          onError: (error: any) => showSnackbar(error?.message, 'error')
        });
        return;
      } else if (type === 'S' && conversation?.silent) {
        Unsilent({}, {
          onSuccess: (response) => {
            const { resultError, statusCode } = response;
            if (statusCode == '200') { 
              showSnackbar(t('conversationDetails.feedback.unmuted'), 'success');
              reloadConversation();
              if (refetchConversations) refetchConversations();
              oncloseModal(false);
            }
            else showSnackbar(resultError?.message, 'error');
          },
          onError: (error: any) => showSnackbar(error?.message, 'error')
        });
        return;
      } else if (type === 'U' && conversation?.isUnread) {
        MarkRead({}, {
          onSuccess: (response) => {
            const { resultError, statusCode } = response;
            if (statusCode == '200') { 
              showSnackbar(t('conversationDetails.feedback.markedRead'), 'success');
              reloadConversation();
              if (refetchConversations) refetchConversations();
              oncloseModal(false);
            }
            else showSnackbar(resultError?.message, 'error');
          },
          onError: (error: any) => showSnackbar(error?.message, 'error')
        });
        return;
      } else if (type == 'A' && !conversation?.archived) {
        Archived({}, {
          onSuccess: (response) => {
            const { resultError, statusCode } = response;
            if (statusCode == '200') { 
              showSnackbar(t('conversationDetails.feedback.archived'), 'success');
              reloadConversation();
              if (refetchConversations) refetchConversations();
              oncloseModal(false);
            }
            else showSnackbar(resultError?.message, 'error');
          },
          onError: (error: any) => showSnackbar(error?.message, 'error')
        })
      } else if (type == 'F' && !conversation?.featured) {
        Featured({}, {
          onSuccess: (response) => {
            const { resultError, statusCode } = response;
            if (statusCode == '200') { 
              showSnackbar(t('conversationDetails.feedback.featured'), 'success');
              reloadConversation();
              if (refetchConversations) refetchConversations();
              oncloseModal(false);
            }
            else showSnackbar(resultError?.message, 'error');
          },
          onError: (error: any) => showSnackbar(error?.message, 'error')
        })
      } else if (type == 'S' && !conversation?.silent) {
        Silent({}, {
          onSuccess: (response) => {
            const { resultError, statusCode } = response;
            if (statusCode == '200') { 
              showSnackbar(t('conversationDetails.feedback.muted'), 'success');
              reloadConversation();
              if (refetchConversations) refetchConversations();
              oncloseModal(false);
            }
            else showSnackbar(resultError?.message, 'error');
          },
          onError: (error: any) => showSnackbar(error?.message, 'error')
        })
      } else if (type === 'U' && !conversation?.isUnread) {
        Unread({}, {
          onSuccess: (response) => {
            const { resultError, statusCode } = response;
            if (statusCode == '200') { 
              showSnackbar(t('conversationDetails.feedback.unread'), 'success');
              reloadConversation();
              if (refetchConversations) refetchConversations();
              oncloseModal(false);
            }
            else showSnackbar(resultError?.message, 'error');
          },
          onError: (error: any) => showSnackbar(error?.message, 'error')
        })
      }
    };
  }

  useEffect(() => {
    if (conversation?.conversationId) {
      setConversationId(conversation?.conversationId);
    }
  }, [conversation]);

  return (
    <Box sx={{ p:0.5, bgcolor: 'background.paper', borderRadius: 6 }}>
      {/* loading */}
      {<LoadingThreeDotsJumping open={isPendingArchived || isPendingFeatured || isPendingSilent || isPendingUnread} modal={true} />}
      <Typography variant="paragraph1SMedium" gutterBottom >
        {t('conversationDetails.title')}
      </Typography>

      {/* Sección de participantes */}
      <Box sx={{ mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, mt: 2, cursor: 'pointer' }} onClick={() => {
            if (onOpenProfile) {
              oncloseModal(false);
              
              onOpenProfile(conversation ?.isOwner ? userId != conversation?.userIdOneNavigation?.userId ? conversation?.userIdOneNavigation?.userId : conversation?.userIdTwoNavigation?.userId : userId != conversation?.userIdOneNavigation?.userId ? conversation?.userIdTwoNavigation?.userId : conversation?.userIdOneNavigation?.userId, conversation?.listingRentId);
            } else {
              oncloseModal(false);
              setOpenProfileModal(true);
            }
          }}>
          <Avatar sx={{ bgcolor: 'grey.400', color: 'text.primary', mr: 2 }} src={ conversation ?.isOwner ? userId != conversation?.userIdOneNavigation?.userId ? conversation?.userIdOneNavigation?.photoLink : conversation?.userIdTwoNavigation?.photoLink : userId != conversation?.userIdOneNavigation?.userId ? conversation?.userIdTwoNavigation?.photoLink : conversation?.userIdOneNavigation?.photoLink}  />
          <Box>
            <Typography variant="small1Medium" component="div">{ conversation ?.isOwner ?  userId != conversation?.userIdOneNavigation?.userId ? conversation?.userIdOneNavigation?.name : conversation?.userIdTwoNavigation?.name : userId != conversation?.userIdOneNavigation?.userId ? conversation?.userIdTwoNavigation?.name : conversation?.userIdOneNavigation?.name }</Typography>
            <Typography variant="small1Regular" >
              {t('conversationDetails.roles.reservationResponsible')}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => {
            if (onOpenProfile) {
              oncloseModal(false);
              
              onOpenProfile(conversation ?.isOwner ? userId == conversation?.userIdOneNavigation?.userId ? conversation?.userIdOneNavigation?.userId : conversation?.userIdTwoNavigation?.userId : userId == conversation?.userIdOneNavigation?.userId ? conversation?.userIdTwoNavigation?.userId : conversation?.userIdOneNavigation?.userId, conversation?.listingRentId);
            } else {
              oncloseModal(false);
              setOpenProfileModal(true);
            }
          }}>
          <Avatar sx={{ mr: 2 }} src={ conversation ?.isOwner ? userId == conversation?.userIdOneNavigation?.userId ? conversation?.userIdOneNavigation?.photoLink : conversation?.userIdTwoNavigation?.photoLink : userId == conversation?.userIdOneNavigation?.userId ? conversation?.userIdTwoNavigation?.photoLink : conversation?.userIdOneNavigation?.photoLink} alt="Tú" />
          <Box sx={{ mb: 3 }}>
            <Typography variant="small1Medium" component="div">{ conversation ?.isOwner ?  userId == conversation?.userIdOneNavigation?.userId ? conversation?.userIdOneNavigation?.name : conversation?.userIdTwoNavigation?.name : userId == conversation?.userIdOneNavigation?.userId ? conversation?.userIdTwoNavigation?.name : conversation?.userIdOneNavigation?.name }</Typography>
            <Typography variant="small1Regular" color="text.secondary">
              {t('conversationDetails.roles.host')}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* <Divider sx={{ my: 2 }} /> */}

      {/* Sección de acciones */}
      <Typography variant="paragraph1SMedium" gutterBottom>
        {t('conversationDetails.actions.title')}
      </Typography>
      <List sx={{
        '& .MuiListItemText-primary': {
          fontFamily: typography.small1Regular
        },
        mt: 2,
        p: 1,
        my: 2,
      }} >
        <ListItem disablePadding sx={{ cursor: 'pointer' }}>
          <ListItemIcon>
            <Markunread onClick={() => handleMarkConversation('U')} />
          </ListItemIcon>
          <ListItemText primary={conversation?.isUnread ? t('conversationDetails.actions.unmarkUnread') : t('conversationDetails.actions.markUnread')} onClick={() => handleMarkConversation('U')} />
        </ListItem>
        <ListItem disablePadding sx={{ cursor: 'pointer' }} >
          <ListItemIcon>
            <StarOutlineIcon onClick={() => handleMarkConversation('F')} />
          </ListItemIcon>
          <ListItemText primary={conversation?.featured ? t('conversationDetails.actions.unfeature') : t('conversationDetails.actions.feature')} onClick={() => handleMarkConversation('F')} />
        </ListItem>
        <ListItem disablePadding sx={{ cursor: 'pointer' }}>
          <ListItemIcon>
            <ArchiveIcon onClick={() => handleMarkConversation('A')} />
          </ListItemIcon>
          <ListItemText primary={conversation?.archived ? t('conversationDetails.actions.unarchive') : t('conversationDetails.actions.archive')} onClick={() => handleMarkConversation('A')} />
        </ListItem>
        <ListItem disablePadding sx={{ cursor: 'pointer' }}>
          <ListItemIcon>
            <NotificationsOffIcon onClick={() => handleMarkConversation('S')} />
          </ListItemIcon>
          <ListItemText primary={conversation?.silent ? t('conversationDetails.actions.unmute') : t('conversationDetails.actions.mute')} onClick={() => handleMarkConversation('S')} />
        </ListItem>
        <Box sx={{ mt: 2 }}>
          <Typography variant="paragraph1SMedium" sx={{ fontWeight: 'bold', mb: 1 }}>
            {t('conversationDetails.support.title')}
          </Typography>
          <List disablePadding>

            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <MdOutlineQuestionMark />
              </ListItemIcon>
              <ListItemText primary={t('conversationDetails.support.helpCenter')} sx={{
                '& .MuiListItemText-primary': {
                  fontFamily: typography.small1Regular
                }, cursor: 'pointer', color: 'text.primary', '&:hover': { textDecoration: 'underline' }
              }} onClick={() => window.open("/help-center", "_blank")}/>
            </ListItem>
          </List>
        </Box>
        {/* <Box sx={{ mt: 2 }}>
          <Typography variant="paragraph1SMedium" sx={{ fontWeight: 'bold' }} >
            {t('conversationDetails.reminders.title')}
          </Typography>
          {remindersKeys.map((key, index) => (
            <Typography key={index} variant="small1Regular" sx={{ mb: 2, mt: index == 0 ? 2 : 0 }} component="div">
              {t(key)} <span style={{ textDecoration: 'underline', fontWeight: 'bold' }}>{t('conversationDetails.reminders.moreInfo')}</span>
            </Typography>
          ))}
        </Box> */}
      </List>
      <ProfileModal open={openProfileModal} onClose={() => setOpenProfileModal(false)} userId={conversation?.userIdOneNavigation?.userId} propertyId={conversation?.listingRentId} />
    </Box>
  );
};

export default ConversationDetails;