import { useDelete, useGet2, usePost, usePut } from '@/hooks/api';
import { RestClient } from '@/services/RestClient';
import { Conversation } from '@/models/interfaces/Message';
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import UnarchiveOutlinedIcon from '@mui/icons-material/UnarchiveOutlined';
import {
  Card,
  CardContent,
  Divider,
  Fade,
  ListItemButton,
  ListItemText,
  Paper,
  Popper,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getDayOfTheWeek } from '@/common/util/dateFunctions';
import { useSnackbar } from '@/context/SnackbarContext';
import { useAuthStore } from '@/store/auth.store';
import MessageSettingsModal from './MessageSettingsModal';
import { SidebarMessageSkeleton } from './skeleton/SidebarMessageSkeleton';
import { useConvertReservationStore } from '@/store/message.store';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import ArchiveIcon from '@mui/icons-material/Archive';
import { ArrowLeftIcon } from '@mui/x-date-pickers';
import theme from '@/themes/theme';

const SidebarMessage: React.FC<{ handleMessage: (conversation: Conversation) => void; disableAutoSelect?: boolean,reloadConversation?: () => void, onRefetchReady?: (refetchFn: () => void, callArchivedFn: () => void) => void; }> = ({
  handleMessage,
  disableAutoSelect = false,
  reloadConversation,
  onRefetchReady
}) => {
  // store
  const { identifier: userId } = useAuthStore.getState();
  const [conversationFilter, setConversationFilter] = useState<Conversation[]>([]);
  
  const stateConversationId = useConvertReservationStore((state: any) => state.stateConversationId);
  const resetStateConversationId = useConvertReservationStore((state: any) => state.resetState);

  // hooks
  const { t } = useTranslation('translation', { keyPrefix: 'messagesUsers' });
  const { t: tCommon } = useTranslation();
  const { t: tAlert } = useTranslation();
  const { palette } = useTheme();
  const showSnackbar = useSnackbar();

  // useState
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [toolOpen, setToolOpen] = useState<boolean>(false);
  const [buttonFilter, setButtonFilter] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [_, setHoveredDate] = useState<number | null>(null);
  const [buttonFilterText, setButtonFilterText] = useState<string>(t('all'));
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);

  // ... dentro de tu componente (donde muestras cada conversación en la lista)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedConvForMenu, setSelectedConvForMenu] = useState<any | null>(null);
  const openMenu = Boolean(anchorEl);

  // api
  const [conversations, setConversations] = useState<{ data: Conversation[] } | null>(null);
  const [isLoadingConversation, setIsLoadingConversation] = useState<boolean>(true);
  const hasFetchedOnce = useRef<boolean>(false);

  const refetchConversations = useCallback(async () => {
    if (!hasFetchedOnce.current) {
      setIsLoadingConversation(true); 
    }

    try {
      const response = await RestClient.get('/Messaging/Conversations');
      const responseData = response.data;
      if (responseData.statusCode === '200') {
        setConversations({ data: responseData.data });
        hasFetchedOnce.current = true;
      }
    } catch (error: any) {
      showSnackbar(error?.message || 'Error al cargar conversaciones', 'error');
    } finally {
      setIsLoadingConversation(false);
    }
  }, [showSnackbar]);

    const { data: ConversationsArchiveds, refetch: callConvArchived } = useGet2<any>(
    'ConversationsArchiveds',
    'Messaging/Conversations/Archiveds',
    [],
    false
  );

  const refetchRef = useRef(refetchConversations);
  const callConvArchivedRef = useRef(callConvArchived);
  useEffect(() => {
    refetchRef.current = refetchConversations;
  }, [refetchConversations]);

useEffect(() => {
    refetchRef.current();
    if (onRefetchReady) {
        onRefetchReady(
          () => refetchRef.current(),
          () => callConvArchivedRef.current() 
        );
    }
  }, []);

  const { mutate: Unarchived } = useDelete(`/Messaging/Conversations/${selectedId}/Unarchived`);
  const { mutate: Unfeatured } = useDelete(`/Messaging/Conversations/${selectedId}/Unfeatured`);
  const { mutate: MarkRead } = usePut(`/Messaging/Conversations/${selectedId}/Read`);

  const { mutate: Archived } = usePut(`/Messaging/Conversations/${selectedId}/Archived`);
  const { mutate: Featured } = usePut(`/Messaging/Conversations/${selectedId}/Featured`);
  const { mutate: Unread } = useDelete(`/Messaging/Conversations/${selectedId}/Unread`);



  const { mutate: FilteredConversations } = usePost<any>('/Messaging/Conversations/Search');


  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, conversation: Conversation) => {
    event.stopPropagation(); // importante para no seleccionar la conversación al abrir menú
    setSelectedConvForMenu(conversation);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
    setSelectedConvForMenu(null);
  };

  // Funciones de las opciones
  const handleMarkAsUnread = async (e: React.MouseEvent, type: string) => {
    e.stopPropagation();
    if (!selectedConvForMenu?.conversationId) return;
    
    const convId = selectedConvForMenu.conversationId;
    const isMarkingRead = type === 'unread';
    
    try {
      // Actualizar selectedId para que los hooks usen el ID correcto
      setSelectedId(convId);
      
      // Esperar un tick para que React actualice los hooks
      await new Promise(resolve => setTimeout(resolve, 0));
      
      if (isMarkingRead) {
        MarkRead({}, {
          onSuccess: (response) => {
            if (response.statusCode == '200') {
              showSnackbar(tAlert('conversationDetails.feedback.markedRead'), 'success');
              refetchConversations();
              reloadConversation && reloadConversation();
            } else {
              showSnackbar(response.resultError?.message, 'error');
            }
          },
          onError: (error: any) => showSnackbar(error?.message, 'error')
        });
      } else {
        Unread({}, {
          onSuccess: (response) => {
            if (response.statusCode == '200') {
              showSnackbar(tAlert('conversationDetails.feedback.unread'), 'success');
              refetchConversations();
              reloadConversation && reloadConversation();
            } else {
              showSnackbar(response.resultError?.message, 'error');
            }
          },
          onError: (error: any) => showSnackbar(error?.message, 'error')
        });
      }
    } catch (error: any) {
      showSnackbar(error?.message || 'Error', 'error');
    }
    
    setAnchorEl(null);
    setSelectedConvForMenu(null);
  };

  const handleToggleHighlight = async (e: React.MouseEvent, type: string) => {
    e.stopPropagation();
    if (!selectedConvForMenu?.conversationId) return;
    
    const convId = selectedConvForMenu.conversationId;
    const isUnfeaturing = type === 'unhighlight';
    
    try {
      setSelectedId(convId);
      await new Promise(resolve => setTimeout(resolve, 0));
      
      if (isUnfeaturing) {
        Unfeatured({}, {
          onSuccess: (response) => {
            if (response.statusCode == '200') {
              showSnackbar(tAlert('conversationDetails.feedback.unfeatured'), 'success');
              refetchConversations();
              reloadConversation && reloadConversation();
            } else {
              showSnackbar(response.resultError?.message, 'error');
            }
          },
          onError: (error: any) => showSnackbar(error?.message, 'error')
        });
      } else {
        Featured({}, {
          onSuccess: (response) => {
            if (response.statusCode == '200') {
              showSnackbar(tAlert('conversationDetails.feedback.featured'), 'success');
              refetchConversations();
              reloadConversation && reloadConversation();
            } else {
              showSnackbar(response.resultError?.message, 'error');
            }
          },
          onError: (error: any) => showSnackbar(error?.message, 'error')
        });
      }
    } catch (error: any) {
      showSnackbar(error?.message || 'Error', 'error');
    }
    
    setAnchorEl(null);
    setSelectedConvForMenu(null);
  };

  const handleUnarchive = async (e: React.MouseEvent, type: string) => {
    e.stopPropagation();
    if (!selectedConvForMenu?.conversationId) return;
    
    const convId = selectedConvForMenu.conversationId;
    const isUnarchiving = type === 'unarchive';
    
    try {
      setSelectedId(convId);
      await new Promise(resolve => setTimeout(resolve, 0));
      
      if (isUnarchiving) {
        Unarchived({}, {
          onSuccess: (response) => {
            if (response.statusCode == '200') {
              showSnackbar(tAlert('conversationDetails.feedback.unarchived'), 'success');
              refetchConversations();
              callConvArchived()
              reloadConversation && reloadConversation();
            } else {
              showSnackbar(response.resultError?.message, 'error');
            }
          },
          onError: (error: any) => showSnackbar(error?.message, 'error')
        });
      } else {
        Archived({}, {
          onSuccess: (response) => {
            if (response.statusCode == '200') {
              showSnackbar(tAlert('conversationDetails.feedback.archived'), 'success');
              refetchConversations();
              reloadConversation && reloadConversation();
            } else {
              showSnackbar(response.resultError?.message, 'error');
            }
          },
          onError: (error: any) => showSnackbar(error?.message, 'error')
        });
      }
    } catch (error: any) {
      showSnackbar(error?.message || 'Error', 'error');
    }
    
    setAnchorEl(null);
    setSelectedConvForMenu(null);
  };

  // functions
  const handleClick = (conv: any) => {
    setSelectedId(conv.conversationId);
    handleMessage(conv);

    if (!conv?.isUnread) return; 
    MarkRead({}, {
      onSuccess: (response) => {
        if (response.statusCode == '200') {
          refetchConversations();
          reloadConversation && reloadConversation();
        }
      }
    });    
  };

  const handleChangeTextButton = (text: string, popupState: any) => {
    text == 'Todos' && setShowArchived(false);
    setButtonFilterText(text);
    popupState.close();
    setButtonFilter(0);
    setShowOnlyUnread(false);
  };

  const handleSearchIconClick = () => {
    setShowSearch((prev) => !prev);
    setSearchTerm('');
  };

  let conversationsToShow: any = [];

  if (showArchived) {
    conversationsToShow = ConversationsArchiveds?.data || [];
  } else if (showSearch && searchTerm.length > 0) {
    conversationsToShow = conversationFilter;
  } else if (showOnlyUnread) {
    conversationsToShow = (conversations?.data || []).filter((conv: any) => conv?.isUnread);
  } else if (buttonFilterText === t('travelerMode')) {
    conversationsToShow = (conversations?.data || []).filter((conv: any) => conv?.isOwner == false);
  } else if (buttonFilterText === t('support')) {
    conversationsToShow = (conversations?.data || []).filter((conv: any) => conv?.isAssertSupport == true);
  }
  else {
    conversationsToShow = conversations?.data || [];
  }

  const handleArchivedMessagesNotification = () => {
    setShowArchived(true);
    callConvArchived();
  };

  // Filtrar conversaciones por nombre
  const handleFilteredConversations = (search: string) => {
    setSearchTerm(search);
    FilteredConversations(
      {
        keywords: [search],
        unreadOnly: false,
        userId: userId,
        pageNumber: 1,
        pageSize: 50,
        statusId: null,
      },
      {
        onSuccess: (response) => {
          setConversationFilter(response.data);
        },
        onError: (error: any) => {
          showSnackbar(error?.message, 'error');
        },
      }
    );
  };

  const handleMarkConversation = (type: string) => {
    if (selectedId) {
      switch (type) {
        case 'A':
          Unarchived(
            {},
            {
              onSuccess: (response) => {
                const { resultError, statusCode } = response;
                if (statusCode == '200') {
                  showSnackbar(tAlert('conversationDetails.feedback.unarchived'), 'success');
                  refetchConversations();
                  callConvArchived()
                  reloadConversation && reloadConversation();
                }
                else { showSnackbar(resultError?.message, 'error'); }
              },
              onError: (error: any) => showSnackbar(error?.message, 'error'),
            }
          );
          break;
        case 'F':
          Unfeatured(
            {},
            {
              onSuccess: (response) => {
                const { resultError, statusCode } = response;
                if (statusCode == '200') {
                  showSnackbar(tAlert('conversationDetails.feedback.unfeatured'), 'success');
                  refetchConversations();
                  reloadConversation && reloadConversation();
                }
                else { showSnackbar(resultError?.message, 'error'); }
              },
              onError: (error: any) => showSnackbar(error?.message, 'error'),
            }
          );
          break;
        case 'R':
          MarkRead(
            {},
            {
              onSuccess: (response) => {
                const { resultError, statusCode } = response;
                if (statusCode == '200') {
                  showSnackbar(tAlert('conversationDetails.feedback.markedRead'), 'success');
                  refetchConversations();
                  reloadConversation && reloadConversation();
                } else {
                  showSnackbar(resultError?.message, 'error');
                }
              },
              onError: (error: any) => showSnackbar(error?.message, 'error'),
            }
          );
          break;
        case 'U':
          Unread({}, {
            onSuccess: (response) => {
              const { resultError, statusCode } = response;
              if (statusCode == '200') {
                showSnackbar(tCommon('conversationDetails.feedback.unread'), 'success');
                refetchConversations();
                reloadConversation && reloadConversation();
              }
              else showSnackbar(resultError?.message, 'error');
            },
            onError: (error: any) => showSnackbar(error?.message, 'error')
          });
          break;          
      }      
    }
  };

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    if (!showSearch) return; // Solo buscar si el campo está visible

    debounceTimeout.current = setTimeout(() => {
      handleFilteredConversations(searchTerm);
    }, 500); // 500ms de espera

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [searchTerm, showSearch]);

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Autoseleccionar la primera conversación cuando se carga la lista
  useEffect(() => {
    
    if (stateConversationId == null && conversationsToShow.length > 0 && !selectedId) {
      if (!disableAutoSelect && !isMobile) {
        const firstConversation = conversationsToShow[0];
        handleClick(firstConversation);
      }
    } else if (stateConversationId && conversationsToShow.length > 0) {
      const conversationToSelect = conversationsToShow.find((conv: any) => conv.conversationId === stateConversationId);
      
      if (conversationToSelect) {
        handleClick(conversationToSelect);
        resetStateConversationId();
      }
    }
  }, [conversationsToShow, stateConversationId]);

  
  return (
    <>
      <Box
        sx={{
          height: '96%',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #e0e0e0',
        }}
      >
        <Box
          sx={{
            px: '20px',
            minHeight: '80px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          {!showArchived ? (
          <Typography  sx={{ fontWeight: 'bold', 
          fontSize: { xs: '18px', sm: '18px', md: '18px', lg: '22px' } 
          // fontSize: '22px'
          }}>
            {t('title')}
          </Typography>
            ): (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ArrowLeftIcon sx={{ cursor: 'pointer', mr: 1 }} onClick={() => setShowArchived(false)} />
                <Typography sx={{ fontWeight: 'bold', fontSize: { xs: '18px', sm: '18px', md: '18px', lg: '20px' } }}>
                  {t('archived')}
                </Typography>
              </Box>
          )}
          <Box>
            <IconButton size="small">
              <SearchIcon onClick={handleSearchIconClick} />
            </IconButton>
            <IconButton size="small">
              <SettingsOutlinedIcon onClick={() => setToolOpen(true)} />
            </IconButton>
          </Box>
        </Box>

        {/* Campo de búsqueda animado */}
        {showSearch && (
          <Box sx={{ px: 1, pb: 1 }}>
            <TextField
              autoFocus
              fullWidth
              size="small"
              placeholder={t('search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              sx={{
                backgroundColor: '#fff',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  fontSize: 14,
                },
              }}
            />
          </Box>
        )}
        <Divider sx={{my: -0.2}} />
        {!showArchived && (
        <Box sx={{ p: 1, display: 'flex', gap: 4 }}>
          <PopupState variant="popper" popupId="filter-all-assert">
            {(popupState) => (
              <div>
                <Button
                  variant="primary"
                  {...bindToggle(popupState)}
                  disableElevation
                  // endIcon={<ArrowDropDownIcon />}
                  sx={{
                    color: buttonFilter == 0 ? '#fff' : '#222',
                    borderRadius: '25px',
                    textTransform: 'none',
                    borderColor: '#e0e0e0',
                  }}
                >
                  {buttonFilterText}
                </Button>
                <Popper {...bindPopper(popupState)} transition>
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                      <Paper>
                        <List sx={{ overflowY: 'auto', flexGrow: 1, p: 0 }}>
                          <ListItemButton>
                            <ListItemText
                              primary={t('all')}
                              onClick={() => handleChangeTextButton(t('all'), popupState)}
                              sx={{ p: 0, m: 0 }}
                            />
                          </ListItemButton>
                          <ListItemButton>
                            <ListItemText
                              primary={t('travelerMode')}
                              onClick={() => handleChangeTextButton(t('travelerMode'), popupState)}
                              sx={{ p: 0, m: 0 }}
                            />
                          </ListItemButton>
                          <ListItemButton>
                            <ListItemText
                              primary={t('support')}
                              onClick={() => handleChangeTextButton(t('support'), popupState)}
                              sx={{ p: 0, m: 0 }}
                            />
                          </ListItemButton>
                        </List>
                      </Paper>
                    </Fade>
                  )}
                </Popper>
              </div>
            )}
          </PopupState>

          <Button
            variant="secondary"
            sx={{
              backgroundColor: buttonFilter == 1 ? '#d6d1d1' : '#f5f5f5',
              // borderRadius: '5px',
              textTransform: 'none',
              color: '#444' ,
              border: 'none',
              '&:hover': {
                color: '#444',
              },
            }}
            onClick={() => {
              setButtonFilter(1);
              setShowOnlyUnread(true);
            }}
          >
            {t('unRead')}
          </Button>
        </Box>
        )}
            {/* <Divider /> */}
        <List sx={{ overflowY: 'auto', flexGrow: 1, pt: 2, pb: 2, pr: 0, pl: 0 }}>
          {isLoadingConversation && <SidebarMessageSkeleton />}
          {conversationsToShow.length === 0 && !isLoadingConversation && (
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 4, color: '#888' }}>
              {t('noConversations') || 'No tienes conversaciones aún'}
            </Typography>
          )}
          {conversationsToShow.map((conv: any) => (
            <React.Fragment key={conv.conversationId}>
              <Card
                sx={{
                  position: 'relative',
                  border: 'none',
                  boxShadow: 'none',
                  display: 'flex',
                  alignItems: 'flex-start',
                  px: '16px',
                  py: '12px',
                  flexDirection: 'row',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderLeft: selectedId === conv.conversationId ? `4px solid ${palette.customColors.primary[1]}` : '4px solid transparent',                  
                  backgroundColor: selectedId === conv.conversationId ? '#EDEDED' : 'transparent',
                  '&:hover': {
                    backgroundColor: '#EDEDED',
                  },
                  height: '80px',
                  width: '100%',
                }}
                onClick={() => handleClick(conv)}
              >
                <Box
                  sx={{
                    position: 'relative',
                    mr: '16px',
                    flexShrink: 0,
                    width: '56px',
                    height: '56px',
                  }}
                >
                  {/* Notification Dot */}
                  {conv?.isUnread && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -2,
                        right: -2,
                        width: 10,
                        height: 10,
                        bgcolor: '#5248CC',
                        borderRadius: '50%',
                        zIndex: 3,
                        border: '2px solid white'
                      }}
                    />
                  )}
                  
                  <Box
                    component="img"
                    src={conv?.listingRent?.photos.find((im: any) => im.isPrincipal)?.photoLink}
                    alt="Foto propiedad"
                    sx={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <Avatar
                    alt="Avatar"
                    src={
                      userId == conv?.userIdOne
                        ? conv?.userIdTwoNavigation?.photoLink
                        : conv?.userIdOneNavigation?.photoLink
                    }
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 26,
                      height: 26,
                      border: '2px solid white',
                      zIndex: 2,
                    }}
                  />
                </Box>
                <CardContent
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    py: 0,
                    px: 0,
                    '&:last-child': { pb: 0 },
                    minWidth: 0,
                    pr: '85px',
                  }}
                >
                  <Typography
                    noWrap
                    sx={{
                      color: conv?.isUnread ? '#000' : '#292929',
                      fontWeight: 600,
                      fontSize: '14px',
                      mb: 0.5,
                    }}
                  >
                    {userId == conv?.userIdOne
                      ? conv?.userIdTwoNavigation?.name
                      : conv?.userIdOneNavigation?.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: conv?.isUnread ? '#212121' : '#6B7280',
                      fontWeight: 600,
                      fontSize: '12px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'block',
                    }}
                  >
                    {conv?.tmMessages[0]?.body ?? ''}
                  </Typography>
                  {conv?.priceCalculation?.priceCalculation?.calculationDetails && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: conv?.isUnread ? '#212121' : '#6B7280',
                        fontWeight: 'normal',
                        fontSize: '12px',
                        mt: 0.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'block',
                      }}
                    >
                      {conv?.priceCalculation?.priceCalculation?.calculationDetails}
                    </Typography>
                  )}
                </CardContent>
                <Box
                  sx={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 0.5,
                  }}
                >
                  <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    { conv?.featured && (
                    <IconButton 
                      size="small" 
                      sx={{ 
                        p: 0.5,
                        bgcolor: '#FFF9C4',
                        '&:hover': {
                          bgcolor: '#FFF59D'
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkConversation('F');
                      }}
                    >
                      <StarBorderIcon sx={{ fontSize: 16, color: '#F57C00' }} />
                    </IconButton>
                    )
                    }
                    {conv?.silent && (
                      <IconButton 
                        size="small" 
                        sx={{ 
                          p: 0.5
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkConversation('S');
                        }}
                      >
                        <NotificationsOffIcon sx={{ fontSize: 16, color: palette.customColors.secondary[1] }} />
                      </IconButton>
                    )}
                    {conv?.archived && (
                      <IconButton 
                        size="small" 
                        sx={{ 
                          p: 0.5,
                          bgcolor: '#F5F5F5',
                          '&:hover': {
                            bgcolor: '#E0E0E0'
                          }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkConversation('A');
                        }}
                      >
                        <ArchiveIcon sx={{ fontSize: 16, color: '#757575' }} />
                      </IconButton>
                    )}
                  </Box>
                  
                  {/* Fecha y botón de menú */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    <Typography
                      variant="small1SRegular"
                      sx={{
                        cursor: 'pointer',
                        display: 'inline-block',
                        textAlign: 'right',
                        transition: 'color 0.2s',
                        color: '#292929',
                        fontSize: '12px',
                        fontWeight: conv?.isUnread ? 'bold' : '500',
                      }}
                      onMouseEnter={() => setHoveredDate(conv.conversationId)}
                      onMouseLeave={() => setHoveredDate(null)}
                    >
                      {getDayOfTheWeek(conv?.creationDate)}
                    </Typography>
                    {selectedId === conv.conversationId && (
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, conv)}
                        sx={{
                          color: 'text.secondary',
                          p: 0.3,
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                      >
                        <MoreVertIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </Card>
              {/* <Divider variant="inset" component="li" sx={{ ml: '72px'}} /> */}
            </React.Fragment>
          ))}
        </List>

        {/* Menú desplegable ÚNICO fuera del map bb*/}
        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleMenuClose}
          onClick={(e) => e.stopPropagation()}
          elevation={0}
          anchorOrigin={{
            vertical: 40,
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          slotProps={{
            paper: {
              sx: {
                minWidth: 190,
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                border: '1px solid #ccc',
                borderRadius: 2,
                overflow: 'visible',
                mt: 1,
              },
            },
          }}
          MenuListProps={{
            sx: {
              py: 0,
            },
          }}
        >
          <MenuItem onClick={(e) => handleMarkAsUnread(e, !selectedConvForMenu?.isUnread ? 'read' : 'unread')}>
            <ListItemIcon>
              <MarkUnreadChatAltIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{!selectedConvForMenu?.isUnread ? tCommon('conversationDetails.actions.markUnread') : tCommon('conversationDetails.actions.unmarkUnread')}</ListItemText>
          </MenuItem>

          <MenuItem onClick={(e) => handleToggleHighlight(e, selectedConvForMenu?.featured ? 'unhighlight' : 'highlight')}>
            <ListItemIcon>
              {selectedConvForMenu?.featured ? (
                <StarIcon fontSize="small" sx={{ color: '#FFD700' }} />
              ) : (
                <StarBorderIcon fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText>
              {selectedConvForMenu?.featured ? tCommon('conversationDetails.actions.unfeature') : tCommon('conversationDetails.actions.feature')}
            </ListItemText>
          </MenuItem>

          <MenuItem onClick={(e) => handleUnarchive(e, selectedConvForMenu?.archived ? 'unarchive' : 'archive')}>
            <ListItemIcon>
              <UnarchiveOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{selectedConvForMenu?.archived ? tCommon('conversationDetails.actions.unarchive') : tCommon('conversationDetails.actions.archive')}</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
      <MessageSettingsModal
        open={toolOpen}
        onClose={() => setToolOpen(false)}
        onArchivedMessagesClick={handleArchivedMessagesNotification}
      />
    </>
  );
};

export default SidebarMessage;
