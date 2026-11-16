import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import React, { useState, useRef, useEffect } from 'react';
import { MessageConversation } from '@/models/interfaces/Message';
import { usePost2 } from '@/hooks/api';
import { Card, CardContent, Divider, InputAdornment, useMediaQuery, useTheme } from '@mui/material';
import { useSnackbar } from '@/context/SnackbarContext';
import { IoMdSend } from 'react-icons/io';
import { useHostStore } from '@/store/useHostStore';
import ResponseAssert from '@/models/interfaces/backend/ResponseAssert';
import { formatDateToTime, formatDateWithDateFnsCapitalized } from '@/common/util/dateFunctions';
import ConversationDetails from './ConversationDetails';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/auth.store';
import CustomDialog from '@/components/CustomDialog';
import ProfileModal from '@/modules/_admin/components/ProfileModal';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import theme from '@/themes/theme';
import { pushToDataLayer } from '@/utilities/analytics';
// import { EmptyChatSkeleton } from './skeleton/SidebarMessageSkeleton';

export interface ConversationResponse {
  data: ConversationData;
  statusCode: string;
  hasError: boolean;
  resultError: string | null;
}

export interface ConversationData {
  conversationId: number;
  userIdOne: number;
  userIdTwo: number;
  statusId: number;
  creationDate: string;
  userIdOneNavigation: any | null;
  userIdTwoNavigation: any | null;
}

const ChatComponent: React.FC<{
  messages: MessageConversation[];
  hostId: number | undefined;
  userId: number | undefined;
}> = ({ messages }) => {
  const { palette } = useTheme();
  const storeUserId = useAuthStore((state) => state.identifier);

  const renderMessage = (message: any, index: number) => {
    // 1. LÓGICA DE MENSAJES DE SISTEMA (Centrados)
    // Tipo 'info' (información) o 'apr' (aprobación)

    if (message.typeMessageCode === 'info' || message.typeMessageCode === 'apr') {
      return (
        <Box key={index} sx={{ textAlign: 'center', my: 2, px: { xs: 1, sm: 2 } }}>
          <Typography
            variant="small1Regular"
            sx={{
              mb: 0.5,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              color: palette.customColors.primary[3],
            }}
          >
            {message.creationDate ? formatDateToTime(message.creationDate) + ' ' : ''}
          </Typography>
          <Typography
            variant="small1Regular"
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              px: { xs: 1, sm: 0 },
            }}
          >
            {message.body}
          </Typography>
        </Box>
      );
    }

    // 2. LÓGICA DE MENSAJES DE CHAT (Derecha vs Izquierda)
    if (message.typeMessageCode === 'com') {
      // Definimos si el mensaje es del usuario actual para saber de qué lado ponerlo
      const isMe = message.userId == storeUserId;

      return (
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            // 'flex-end' mueve el contenido a la derecha, 'flex-start' a la izquierda
            alignItems: isMe ? 'flex-end' : 'flex-start',
            my: 1,
          }}
        >
          {/* Etiqueta superior opcional (Nombre/Hora) */}
          <Typography
            sx={{
              mb: 0.5,
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              color: 'text.secondary',
              display: isMe ? 'block' : 'none',
            }}>
            {message.creationDate && formatDateWithDateFnsCapitalized(new Date(message.creationDate))}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              mb: 0.5,
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              color: 'text.secondary',
              // Solo se muestra si hay información de remitente/hora y es de "derecha"
              display: isMe ? 'block' : 'none',
            }}
          >
            {message.sender} Tú {message.creationDate ? '  ' + formatDateToTime(message.creationDate) : ''}
          </Typography>

          {/* Burbuja del mensaje */}
          <Box
            sx={{
              // Color de fondo: El tuyo es el color principal, el del otro es gris claro
              bgcolor: isMe ? palette.primary.main : '#EDEDED',
              // Color de texto: Blanco/claro para ti, oscuro para el otro
              color: isMe ? palette.customColors.lights[4] : palette.customColors.primary[7],
              p: { xs: 1.5, sm: 2 },
              // Forma de la burbuja: Se "pica" la esquina según el lado
              borderRadius: isMe ? '20px 20px 0 20px' : '20px 20px 20px 0',
              maxWidth: { xs: '85%', sm: '70%' },
              wordWrap: 'break-word',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '0.875rem', sm: '1rem' },
                color: isMe ? palette.customColors.lights[4] : palette.customColors.primary[1],
              }}
            >
              {message.body}
            </Typography>
          </Box>

          {/* Fecha/Hora debajo (Común en mensajes recibidos de la izquierda) */}
          {!isMe && message.readDate && (
            <>
              <Typography
                variant="small1Regular"
                sx={{
                  pr: 1,
                  fontSize: { xs: '0.65rem', sm: '0.75rem' },
                  color: 'text.secondary',
                }}
              >
                {message.creationDate && formatDateWithDateFnsCapitalized(new Date(message.creationDate))}
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  pr: 1,
                  fontSize: { xs: '0.65rem', sm: '0.75rem' },
                  color: 'text.secondary',
                }}
              >
                {formatDateToTime(message.readDate)}
              </Typography>
            </>
          )}
        </Box>
      );
    }

    // En caso de que el tipo de mensaje no coincida con ninguno, no renderiza nada
    return null;
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: 900 },
        margin: 'auto',
        p: { xs: 1, sm: 2 },
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
      }}
    >
      {messages.length === 0 ? (
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
          }}
        >
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            No hay mensajes aún. ¡Envía el primero!
          </Typography>
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1 }}>{messages.map((msg, index) => renderMessage(msg, index))}</Box>
      )}
    </Box>
  );
};

//-------------------
const ChatAreaMessage: React.FC<{
  messages: MessageConversation[];
  conversation: any;
  photoUser2: string;
  reCalled: () => void;
  reloadConversation: () => void;
  refetchConversations: () => void;
  onToggleDetailPanel?: () => void;
  onUnarchivedSuccess?: () => void;
  detailPanelVisible?: boolean;
  onBack?: () => void;
}> = ({ messages = [], conversation, reCalled, reloadConversation, onToggleDetailPanel, refetchConversations, onUnarchivedSuccess, detailPanelVisible = true, onBack }) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openProfileModal, setOpenProfileModal] = useState<boolean>(false);
  const [_, setProfileUserId] = useState<number | undefined>(undefined);
  const [profilePropertyId, setProfilePropertyId] = useState<number | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
    // Bandera para saber si es la primera carga de la conversación
  const isFirstLoad = useRef(true);
  const [openErrorMessage, setOpenErrorMessage] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const handleErrorMessageClose = () => {
    setOpenErrorMessage(false);
  };
  const showSnackbar = useSnackbar();
  const hostId = useHostStore((state) => state.hostId);
  const userId = useHostStore((state) => state.userId);
  const { identifier: userIdSession } = useAuthStore.getState();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Solo hace scroll automático al abrir la conversación por primera vez o cambiar de chat
  useEffect(() => {
    isFirstLoad.current = true;
  }, [conversation?.conversationId]);

  useEffect(() => {
    if (isFirstLoad.current && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      isFirstLoad.current = false;
    }
  }, [messages]);

  // Usar hostId en tu request
  const { mutate: sendMessage } = usePost2(
    `Messaging/Conversations/${conversation?.conversationId}/Messages`
  );
  const { mutate: setStartConversation } = usePost2<ConversationData>('/Messaging/Conversations');

  const handleSendMessage = () => {
    if (message.trim()) {
      setIsLoading(true);
      if (conversation?.conversationId) {
        pushToDataLayer('respond_message');
        sendMessage(
          {
            bookId: conversation?.bookId ?? 0,
            messageTypeId: 1,
            body: message,
          },
          {
            onSuccess: (response) => {
              const { resultError, statusCode } = response;
              if (statusCode == '200') {                
                setMessage('');
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                reCalled();
                setTimeout(() => {
                  inputRef.current?.focus();
                }, 50);                
              } else {
                setOpenErrorMessage(true);
                setErrorMessage(resultError?.message || 'Error al enviar el mensaje');
                // showSnackbar(resultError?.message, 'error', 5000);
              }
              setIsLoading(false);
            },
            onError: (error: any) => {
              showSnackbar(error?.message || 'Error al enviar el mensaje', 'error', 5000);
              setIsLoading(false);
            },
          }
        );
      } else {
        setStartConversation(
          {
            hostId: hostId,
            renterId: userId,
          },
          {
            onSuccess: (response: ResponseAssert<ConversationData>) => {
              const { resultError, statusCode } = response;
              if (statusCode == '200') {
                sendMessage(
                  {
                    bookId: 0,
                    messageTypeId: 1,
                    body: message,
                  },
                  {
                    onSuccess: (response) => {
                      const { resultError, statusCode } = response;
                      if (statusCode == '200') {                      
                        setMessage('');
                        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                        reCalled();
                        setTimeout(() => {
                          inputRef.current?.focus();
                        }, 50);                        
                      } else {
                        showSnackbar(resultError?.message, 'error');
                      }
                      setIsLoading(false);
                    },
                    onError: (error: any) => {
                      showSnackbar(error?.message || 'Error al enviar el mensaje', 'error');
                      setIsLoading(false);
                    },
                  }
                );
              } else {
                showSnackbar(resultError?.message, 'error');
                setIsLoading(false);
              }
            },
            onError: (error: any) => {
              showSnackbar(error?.message || 'Error al enviar el mensaje', 'error');
              setIsLoading(false);
            },
          }
        );
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Si no hay conversación seleccionada
  if (!conversation) {
    return <></>;
    // return <EmptyChatSkeleton />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        pt: -3,
        borderRight: '1px solid #e0e0e0',
      }}
    >
      {/* Header - Información de la conversación */}
      <Box
        sx={{
          minHeight: '79px',
          px: '20px',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <Card
          sx={{
            position: 'relative',
            borderRadius: { xs: 2, sm: 3 },
            boxShadow: 'none',
            bgcolor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            flexDirection: { xs: 'row', sm: 'row' },
            textAlign: { xs: 'left', sm: 'left' },
            width: '100%',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              // mr: { xs: 1, sm: 2.5 },
              // mt: { xs: 2.5, sm: 2.5 },
              flexShrink: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isMobile && (
              <IconButton
                edge="end"
                sx={{ color: 'gray', mr: 1 }}
                onClick={onBack}
              >
                <ArrowBackIos />
              </IconButton>
            )}

            <Avatar
              alt={`Avatar de ${userIdSession == conversation?.userIdOne ? conversation?.userIdTwoNavigation?.name : conversation?.userIdOneNavigation?.name}`}
              src={userIdSession == conversation?.userIdOne ? conversation?.userIdTwoNavigation?.photoLink ? conversation.userIdTwoNavigation.photoLink.replace(
                'https://assert-api.runasp.net/',
                'https://assert-api.runasp.net/') : undefined : conversation?.userIdOneNavigation?.photoLink ? conversation.userIdOneNavigation.photoLink.replace(
                  'https://assert-api.runasp.net/',
                  'https://assert-api.runasp.net/') : undefined
              }
              onClick={() => setOpenModal(true)}
              sx={{
                width: 44,
                height: 44,
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                cursor: 'pointer',
              }}
            />
          </Box>
          <CardContent
            sx={{
              flexGrow: 1,
              p: { xs: 0.5, sm: 0.4 },
              '&:last-child': { pb: { xs: 0.5, sm: 1 } },
            }}
          >
            <Typography
              variant="h3"
              component="div"
              onClick={() => setOpenModal(true)}
              sx={{
                // fontSize: { xs: '0.9rem', sm: '1rem', md: '0.95rem', lg: '1.1rem' },
                fontSize: '16px',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                cursor: 'pointer',
                // mt: { xs: 0.5, sm: 0.5 },
              }}
            >
              {userIdSession == conversation?.userIdOne ? conversation?.userIdTwoNavigation?.name : conversation?.userIdOneNavigation?.name}
            </Typography>
            {conversation?.listingRent?.name && (
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  // fontSize: { sm: '0.75rem', md: '0.75rem', lg: '0.875rem' },
                  fontSize: '14px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {conversation?.listingRent?.name}
              </Typography>
            )}
          </CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', pt: isMobile ? 2 : 0 }}>
            {isMobile ? (
              <IconButton
                edge="end"
                sx={{ color: 'gray', mr: 1 }}
                onClick={onToggleDetailPanel}
              >
                <ArrowBackIos />
              </IconButton>
            ) : detailPanelVisible ? (
              <IconButton
                edge="end"
                sx={{ color: 'gray', mr: 1 }}
                onClick={onToggleDetailPanel}
              >
                <ArrowForwardIos />
              </IconButton>
            ) : (
              <IconButton
                edge="end"
                sx={{ color: 'gray', mr: 1 }}
                onClick={onToggleDetailPanel}
              >
                <ArrowBackIos />
              </IconButton>
            )}
          </Box>
        </Card>
      </Box>
      <Divider />
      {/* Área de mensajes */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <ChatComponent
          messages={messages}
          hostId={conversation?.userIdOne}
          userId={conversation?.userIdTwo}
        />
        <div ref={messagesEndRef} />
      </Box>

      {/* Campo de entrada de mensajes */}
      <Box sx={{ p: { xs: 1, sm: 2 } }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={t('messagesUsers.messagePlaceholder')}
          size="medium"
          multiline
          maxRows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isLoading}
          inputRef={inputRef}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              backgroundColor: '#fff',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              '&.Mui-disabled': {
                backgroundColor: '#eee',
              },
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isLoading}
                  sx={{
                    '&.Mui-disabled': {
                      color: 'action.disabled',
                    },
                  }}
                >
                  <IoMdSend />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <CustomDialog
        isOpen={openErrorMessage}
        onClose={handleErrorMessageClose}
        maxWidth="xs"
        title="Lo sentimos, no podemos enviar el mensaje"
      >
        <Box mt={1}>
          <Typography variant="body2">{errorMessage}</Typography>
        </Box>
      </CustomDialog>
      {/* Modal de detalles de la conversación */}
      <CustomDialog
        isOpen={openModal}
        title={t('conversationDetails.title')}
        children={
          <ConversationDetails
            conversation={conversation}
            oncloseModal={setOpenModal}
            reloadConversation={reloadConversation}
            refetchConversations={refetchConversations}
            onUnarchivedSuccess={onUnarchivedSuccess}
            onOpenProfile={(userId?: number, propertyId?: number) => {
              setOpenModal(false);
              window.open(`/host/show-profile-guest/${userId}/${propertyId}`, '_blank');
              // setProfileUserId(userId);
              // setProfilePropertyId(propertyId);
              // setOpenProfileModal(true);
            }}
          />
        }
        onClose={() => setOpenModal(false)}
        maxWidth="md"
      />
      <ProfileModal
        open={openProfileModal}
        onClose={() => setOpenProfileModal(false)}
        userId={ conversation ?.isOwner ? userIdSession != conversation?.userIdOne ? conversation?.userIdOne : conversation?.userIdTwo : userIdSession != conversation?.userIdTwo  ? conversation?.userIdOne : conversation?.userIdTwo}
        propertyId={profilePropertyId !== undefined ? String(profilePropertyId) : ''}
      />
    </Box>
  );
};

export default ChatAreaMessage;
