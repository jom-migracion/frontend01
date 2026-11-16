import SidebarMessage from '@/modules/_guest/components/SidebarMessage';
import ChatAreaMessage from '@/modules/_guest/components/ChatAreaMessage';
import { Box, useMediaQuery, useTheme, Drawer } from '@mui/material';
import Grid from '@mui/material/Grid2';
// import { Helmet } from 'react-helmet';
import { useSnackbar } from '@/context/SnackbarContext';
import { MessageConversation } from '@/models/interfaces/Message';
import React, { useState, useEffect, useRef } from 'react';
// import { useTranslation } from 'react-i18next';
import { useAuthContext } from '@/modules/_auth/context';
import DetailPanelMessageGuest01 from '../components/DetailPanelMessageGuest01';
import { RestClient } from '@/services/RestClient';
import { useMessageStoreReservation } from '@/store/message.store';
import { ReservationSkeleton } from '../components/skeleton/SidebarMessageSkeleton';
import DetailPanelMessageHost02 from '../components/DetailPanelMessageHost02';
import { Helmet } from 'react-helmet-async';

const GuestMessage: React.FC<{
  seeNavbar?: boolean;
  onViewReservation?: (bookingData: any) => void;
}> = ({ onViewReservation }) => {
  const [conversation, setConversation] = useState<any | null>(null);
  const [listingRentData, setListingRentData] = useState<any>(null);
  const [bookingData, setBookingData] = useState<any>(null);
  const [isLoadingReservation, setIsLoadingReservation] = useState<boolean>(false);
  const [mobileOpenDetail, setMobileOpenDetail] = useState<boolean>(false);
  const [mobileOpenSidebar, setMobileOpenSidebar] = useState<boolean>(false);
  const [showDetailPanel, setShowDetailPanel] = useState<boolean>(true);
  const [messages, setMessages] = useState<MessageConversation[]>([]);
  const markedAsReadRef = React.useRef<Set<number>>(new Set());
  const refetchSidebarRef = useRef<() => void>(() => {});
  const callConvArchivedRef = useRef<() => void>(() => {})

  // store
  const storeReservation = useMessageStoreReservation((state: any) => state.setStateReservation);
  const setSelectedConv = useMessageStoreReservation((state: any) => state.setSelectedConv);

  // hooks
  const showSnackbar = useSnackbar();
  const { isGuestAuthenticated } = useAuthContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  // const { t } = useTranslation('translation', { keyPrefix: 'messagesUsers' });

  //  api
  // const { mutate: readMessage } = usePut(
  //   `Messaging/Conversations/${conversation?.conversationId}/Messages/Read`
  // );

  // Función para obtener mensajes sin caché
  const fetchMessages = async () => {
    if (!conversation?.conversationId) return;

    try {
      const response = await RestClient.get(
        `/Messaging/Conversations/${conversation.conversationId}/Messages?orderBy=dateAsc`
      );
      const responseData = await response.data;

      if (responseData.statusCode === '200' && responseData.data) {
        setMessages(responseData.data);
      } else {
        showSnackbar(responseData.resultError?.message || 'Error al obtener mensajes', 'error');
      }
    } catch (error: any) {
      showSnackbar(error?.message || 'Error al cargar mensajes', 'error');
    }
  };

  // Función para recargar la conversación completa
  const reloadConversation = async () => {
    if (!conversation?.conversationId) return;

    try {
      const response = await RestClient.get(
        `/Messaging/Conversations/${conversation.conversationId}`
      );
      const responseData = await response.data;

      if (responseData.statusCode === '200' && responseData.data) {
        setConversation(responseData.data);
      }
    } catch (error: any) {
      console.error('Error al recargar conversación:', error);
    }
  };

  // Cargar mensajes cuando cambia la conversación
  useEffect(() => {
    if (conversation?.conversationId) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [conversation?.conversationId]);

  // Polling: Recuperar mensajes cada 5 segundos cuando la conversación está activa
  useEffect(() => {
    if (!conversation?.conversationId) return;

    const intervalId = setInterval(() => {
      fetchMessages();
    }, 5000); // 5 segundos

    return () => clearInterval(intervalId);
  }, [conversation?.conversationId]);

  const handleRefreshBookingData = async () => {
    const responseBooking = await RestClient.get(`/Book/${conversation?.bookId}`);
    const responseProcessBooking = await responseBooking.data;
    if (responseProcessBooking.statusCode == '200' && responseProcessBooking.data) {
      setBookingData(responseProcessBooking.data);
    }
  };

  const getUserConversationsMessage = async (conv: any) => {
    setIsLoadingReservation(true);
    // Limpiar el registro de mensajes leídos al cambiar de conversación
    markedAsReadRef.current.clear();
    // Si la conversación seleccionada es la misma, no se desactiva
    setConversation((prev: any) => (prev?.conversationId === conv.conversationId ? prev : conv));

    if (conv.listingRent?.listingRentId) {
      if (conv?.priceCalculation) {
        storeReservation(conv?.priceCalculation?.priceCalculation?.calculationStatue ?? null);
      }

      if (conv?.booking) {
        try {
          const responseBooking = await RestClient.get(`/Book/${conv?.booking?.bookId}`);
          const responseProcessBooking = await responseBooking.data;
          if (responseProcessBooking.statusCode == '200' && responseProcessBooking.data) {
            setBookingData(responseProcessBooking.data);
          } else {
            showSnackbar(
              responseProcessBooking.resultError?.message || 'Error al obtener reserva',
              'error'
            );
            setBookingData(null);
          }
          setListingRentData(null);
        } catch (error: any) {
          showSnackbar(
            error?.response?.data?.resultError?.message ||
              error?.message ||
              'Error al cargar reserva',
            'error'
          );
          setBookingData(null);
          setListingRentData(null);
          setIsLoadingReservation(false);
          return;
        }
      } else {
        const responseContinue = await RestClient.get(
          `/ListingRent/${conv.listingRent.listingRentId}`
        );

        const responseProcessData = await responseContinue.data;

        if (responseProcessData.statusCode == '200' && responseProcessData.data) {
          setListingRentData(responseProcessData.data);
        }
        setBookingData(null);
      }
    }
    setSelectedConv(true);
    setIsLoadingReservation(false);
  };

  // consultar estado de reserva cada 6 segundos si la conversación tiene una reserva asociada
  useEffect(() => {
    if (!conversation?.bookId) return;

    const intervalId = setInterval(() => {
      handleRefreshBookingData();
    }, 6000);

    return () => clearInterval(intervalId);
  }, [conversation]);

  return (
    <>
      <Helmet>
        <title>Mensajeria</title>
        <meta name="Mensajeria" content="Página de administración de mensajes" />
      </Helmet>
      <Box
        sx={{
          height: 'calc(100vh - 80px)',
          p: { xs: 1, sm: 2 },
          py: { xs: 1, sm: '32px' },
          overflow: 'hidden',
        }}
      >
        <Grid
          container
          spacing={0}
          sx={{
            height: '100%',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '15px',
            overflow: 'hidden',
            bgcolor: 'background.paper',
          }}
        >
          {/* Sidebar - Conversaciones */}
          <Grid
            size={{ xs: 12, sm: 4, md: 3, lg: 3 }}
            sx={{
              height: '100%',
              display: {
                xs: conversation ? 'none' : 'block',
                sm: mobileOpenDetail ? 'none' : 'block',
                md: 'block',
              },
              borderRight: { sm: '1px solid', md: '1px solid' },
              borderColor: { sm: 'divider', md: 'divider' },
            }}
          >
            <SidebarMessage
              handleMessage={getUserConversationsMessage}
              reloadConversation={reloadConversation}
              disableAutoSelect={isMobile}
              onRefetchReady={(refetchFn, callArchivedFn) => {
                  refetchSidebarRef.current = refetchFn;
                  callConvArchivedRef.current = callArchivedFn;
                }}
            />
          </Grid>

          {/* Chat Area */}
          <Grid
            size={{ xs: 12, sm: 8, md: showDetailPanel ? 6 : 9, lg: showDetailPanel ? 6 : 9 }}
            sx={{
              height: '100%',
              display: {
                xs: conversation && !mobileOpenDetail ? 'block' : 'none',
                sm: conversation && !mobileOpenDetail ? 'block' : 'none',
                md: 'block',
              },
              position: 'relative',
            }}
          >
            <ChatAreaMessage
              messages={messages}
              conversation={conversation}
              reCalled={fetchMessages}
              reloadConversation={reloadConversation}
              refetchConversations={() => refetchSidebarRef.current()}
              onUnarchivedSuccess={() => callConvArchivedRef.current()}
              photoUser2={conversation?.userIdOneNavigation?.photoLink}
              onToggleDetailPanel={() =>
                isMobile ? setMobileOpenDetail(true) : setShowDetailPanel((prev) => !prev)
              }
              detailPanelVisible={showDetailPanel}
              onBack={() => setConversation(null)}
            />
          </Grid>

          {/* Detail Panel */}
          <Grid
            size={{ xs: 12, sm: 12, md: 3, lg: 3 }}
            sx={{
              height: '100%',
              display: {
                xs: mobileOpenDetail && conversation ? 'block' : 'none',
                sm: mobileOpenDetail && conversation ? 'block' : 'none',
                md: showDetailPanel && conversation ? 'block' : 'none',
              },
            }}
          >
            {isLoadingReservation ? (
              <ReservationSkeleton isGuest={isGuestAuthenticated} />
            ) : conversation?.isOwner ? (
              <DetailPanelMessageHost02
                bookingData={bookingData}
                conversation={conversation}
                reCalled={fetchMessages}
                onCloseMobile={() => setMobileOpenDetail(false)}
                onViewReservation={onViewReservation}
              />
            ) : (
              <DetailPanelMessageGuest01
                listingRentData={listingRentData}
                conversation={conversation}
                bookingData={bookingData}
                reloadConversation={reloadConversation}
                onCloseMobile={() => setMobileOpenDetail(false)}
              />
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Sidebar Drawer - Mobile */}
      {isMobile && (
        <Drawer
          anchor="left"
          open={mobileOpenSidebar}
          onClose={() => setMobileOpenSidebar(false)}
          ModalProps={{ keepMounted: true }}
          PaperProps={{ sx: { width: '100%', maxWidth: 400, zIndex: 1500 } }}
        >
          <SidebarMessage
            handleMessage={(conv: any) => {
              getUserConversationsMessage(conv);
              setMobileOpenSidebar(false);
            }}
          />
        </Drawer>
      )}

      {/* Floating buttons for mobile when panels are hidden */}
      {/* {isMobile && conversation && (
        <IconButton
          aria-label="toggle sidebar"
          onClick={() => setMobileOpenSidebar((prev) => !prev)}
          sx={{
            position: 'fixed',
            left: 20,
            top: 65,
            zIndex: 1400,
            bgcolor: 'background.paper',
            boxShadow: 3,
            '&:hover': { bgcolor: 'grey.100' },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {isMobile && conversation && (bookingData || listingRentData) && (
        <IconButton
          aria-label="toggle details"
          onClick={() => setMobileOpenDetail((prev) => !prev)}
          sx={{
            position: 'fixed',
            right: 20,
            top: 65,
            zIndex: 1400,
            bgcolor: 'background.paper',
            boxShadow: 3,
            '&:hover': { bgcolor: 'grey.100' },
          }}
        >
          <InfoOutlinedIcon />
        </IconButton>
      )} */}
    </>
  );
};

export default GuestMessage;
