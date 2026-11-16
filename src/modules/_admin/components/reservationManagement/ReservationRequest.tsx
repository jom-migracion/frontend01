import { jomWhite } from '@/assets';
import { AssertRoutes } from '@/common/enum/AssertRoutes';
import { formatDateCheckIn, formatearFecha } from '@/common/util/dateFunctions';
import { estadoColorReserva } from '@/common/util/statusFunctios';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useCurrentBreakpoint } from '@/components/IdentifySize';
import LoadingThreeDotsJumping from '@/components/LoadingThreeDotsJumping';
import { useSnackbar } from '@/context/SnackbarContext';
import { useCustomMutationByUrl, useGet, usePost, usePost2 } from '@/hooks/api';
import { NestedListModal } from '@/modules/_guest/components/NestedListModal';
import { RestClient } from '@/services/RestClient';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FilterListIcon from '@mui/icons-material/FilterList';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import MessageIcon from '@mui/icons-material/Message';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import Grid from '@mui/material/Grid2';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid2,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Radio,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Divider,
  Container
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Link as Link2 } from 'react-router-dom';
import { ReservationDetailSkeleton } from './ReservationSkeletons';
import ReservationSteps from './ReservationSteps';
import { formatSemicolon } from '@/common/util/numbersFuntios';
import { ArrowBackIos } from '@mui/icons-material';
import { useConvertReservationStore } from '@/store/message.store';
import Cardreimbursement from '@/pages/Cardreimbursement';
import { pushToDataLayer } from '@/utilities/analytics';

interface ReservationRequestProps {
  handleBackToList: () => void;
  selectedReservation: any;
  originCard: boolean;
  pendingReservations?: any[];
  onReservationSelect?: (reservation: any) => void;
  onShowCalendar?: () => void;
  onShowMessaging?: () => void;
  handleReservationClick: (reservation: any, onProcess: boolean) => void;
}

interface ConversationMessage {
  body?: string;
  creationDate?: string;
  conversationId?: string;
}

const CostComponentJomReserve = (title: string, value: number, currency: string, skip: boolean = false) => {

  if (!skip) {
    if (value <= 0 || value === null || value === undefined) {
    return null;
  }}  

  return (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography
              variant="small1Regular"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.85rem', sm: '0.8rem' } }}
            >
              {title}
            </Typography>
            <Typography
              variant="small1Medium"
              sx={{
                fontWeight: 500,
                color: '#000',
                fontSize: { xs: '0.85rem', sm: '0.9rem' },
              }}
            >
              {formatSemicolon(value)} {currency}
            </Typography>
          </Box>
  )
}


// Componente principal para gestionar solicitudes de reserva (detalle, aceptar/rechazar y flujos de incidencias).
const ReservationRequest: React.FC<ReservationRequestProps> = ({
  handleBackToList,
  selectedReservation,
  originCard = false,
  pendingReservations = [],
  onReservationSelect,
  onShowCalendar,
  onShowMessaging,
  handleReservationClick
}) => {
  // Estado local de UI y datos asociados a la reserva seleccionada.
  const [estadoBook, setEstadoBook] = useState<any>(null);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [isLoadingBookingDetails, setIsLoadingBookingDetails] = useState<boolean>(true);
  const [statusAproved, setStatusAproved] = useState<string | null>(null);
  const [openComplaint, setOpenComplaint] = useState<boolean>(false);
  const [_, setSeeButtonDecline] = useState<boolean>(true);
  const [cancelement, setCancelement] = useState<any>(null);
  const [message, setMessage] = useState<string>('');
  const [cancellationToShow, setCancellationToShow] = useState<any>([]);
  const [perfilGuestDetails, setPerfilGuestDetails] = useState<any>(null);
  const [currentSelectedId, setCurrentSelectedId] = useState<string | null>(
    selectedReservation?.bookId || null
  );
  const [navigationHistory, setNavigationHistory] = useState<any[]>([]);
  const [seeViewReportIncident, setSeeViewReportIncident] = useState<boolean>(false);
  const [seeViewCancelIncident, setSeeViewCancelIncident] = useState<boolean>(false);
  const [dataParametricFirstStep, setDataParametricFirstStep] = useState<any>([]);
  const [showComplaintWarning, setShowComplaintWarning] = useState<boolean>(false);
  const [showPayoutAccountWarning, setShowPayoutAccountWarning] = useState<boolean>(false);
  const [complaintsSummary, setComplaintsSummary] = useState<any>(null);

  const [description, setDescription] = useState('');
  const [selectedReasonId, setSelectedReasonId] = useState<any>(null);
  const [selectedCancelReasonId, setSelectedCancelReasonId] = useState<number | null>(null);
  const [isLoadingCancelNextStep, setIsLoadingCancelNextStep] = useState<boolean>(false);
  const [isCancelLastStep, setIsCancelLastStep] = useState<boolean>(false);
  const [cancelDescription, setCancelDescription] = useState<string>('');
  const [cancelEndStepData, setCancelEndStepData] = useState<any>(null);
  const [cancelGuestMessage, setCancelGuestMessage] = useState<string>('');
  const [isLoadingCancelConfirm, setIsLoadingCancelConfirm] = useState<boolean>(false);
  const [mobileShowDetail, setMobileShowDetail] = useState<boolean>(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messageConversationId, setMessageConversationId] = useState<string | null>(null);
  const [latestConversationBody, setLatestConversationBody] = useState<string>('');
  const [guestId, setGuestId] = useState<string | null>(null);
  const [perfilUserProfile, setPerfilUsertProfile] = useState<any>(null);
  const [penality, setPenality] = useState<any>(null);

  const [tick, setTick] = useState<number>(Date.now());
  const reservationDeadlinesRef = useRef<Record<string, number>>({});

  const setStateConversationId = useConvertReservationStore(
    (state: any) => state.setStateConversationId
  );

  const onShowConversations = () => {
    if (conversationId) {
      setStateConversationId(conversationId);
      onShowMessaging?.()
    }
  };

  const parseRemainingTimeToSeconds = (value?: string | null): number => {
    if (!value) return 0;

    const normalized = value.trim();
    const timeMatch = normalized.match(/(\d{1,2}):(\d{1,2}):(\d{1,2})/);

    if (!timeMatch) return 0;

    const hours = Number(timeMatch[1]);
    const minutes = Number(timeMatch[2]);
    const seconds = Number(timeMatch[3]);

    if ([hours, minutes, seconds].some((part) => Number.isNaN(part))) return 0;

    return Math.max(0, hours * 3600 + minutes * 60 + seconds);
  };

  const formatSecondsToHHMMSS = (totalSeconds: number): string => {
    const safeSeconds = Math.max(0, totalSeconds);
    const hours = Math.floor(safeSeconds / 3600)
      .toString()
      .padStart(2, '0');
    const minutes = Math.floor((safeSeconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const seconds = Math.floor(safeSeconds % 60)
      .toString()
      .padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  };

  const syncReservationDeadline = (bookId?: string, backendValue?: string | null) => {
    if (!bookId || !backendValue) return;

    const secondsFromBackend = parseRemainingTimeToSeconds(backendValue);
    const deadline = Date.now() + secondsFromBackend * 1000;
    reservationDeadlinesRef.current[bookId] = deadline;
  };

  const getRemainingTimeByBookId = (bookId?: string, fallbackValue?: string | null): string => {
    if (!bookId) return '00:00:00';

    const existingDeadline = reservationDeadlinesRef.current[bookId];

    if (!existingDeadline) {
      syncReservationDeadline(bookId, fallbackValue);
    }

    const deadline = reservationDeadlinesRef.current[bookId];
    if (!deadline) return formatSecondsToHHMMSS(parseRemainingTimeToSeconds(fallbackValue));

    const secondsLeft = Math.max(0, Math.floor((deadline - tick) / 1000));
    return formatSecondsToHHMMSS(secondsLeft);
  };

  // Hooks de tema, navegación, i18n y notificaciones.
  const theme = useTheme();
  const { typography } = theme;
  const showSnackbar = useSnackbar();
  const { t } = useTranslation();
  const navigate = useNavigate();

  //  Detección de Responsividad: true si la pantalla es pequeña (ej. < 900px)

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const currentBreakpoint = useCurrentBreakpoint();

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTick(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    pendingReservations.forEach((reservation: any) => {
      if (!reservationDeadlinesRef.current[reservation?.bookId]) {
        syncReservationDeadline(
          reservation?.bookId,
          reservation?.remainingTimeToRequestExpiration ?? null
        );
      }
    });
  }, [pendingReservations]);

  useEffect(() => {
    if (bookingDetails?.bookId) {
      syncReservationDeadline(
        bookingDetails.bookId,
        bookingDetails?.remainingTimeToRequestExpiration ?? null
      );
    }
  }, [bookingDetails?.bookId, bookingDetails?.remainingTimeToRequestExpiration]);

  // Endpoints y mutaciones utilizados por este flujo.
  const { data: GetComplaintReasonsAsTree } = useGet(
    'GetComplaintReasonsAsTree',
    `/Parametrics/GetComplaintReasonsAsTree`
  );
  const { mutate: ApproveDeclineReservation, isPending } = useCustomMutationByUrl('put');
  const { mutate: ComplaintCreate } = usePost(`Complaint/Create`);
  const { data: GetHostBookCancellation } = useGet(
    'GetHostBookCancellationAdm',
    `/Parametrics/ReasonRefusedFirstStep`
  );
  const { mutate: createConversationSupport } = usePost2(
    `/Messaging/Support/Incident/${currentSelectedId}`
  );

  const handleReportSubmit = () => {
    createConversationSupport(
      {
        messageTypeId: 1,
        body: description,
      },
      {
        onSuccess: async (response) => {
          const { resultError, statusCode } = response;
          if (statusCode == '200') {
            showSnackbar(t('contactHost.alerts.success'), 'success');

            navigate(AssertRoutes.GUEST_MESSAGE);
          } else {
            showSnackbar(resultError?.message, 'error');
          }
        },
        onError: (error: any) => {
          showSnackbar(error?.message || t('contactHost.alerts.genericError'), 'error');
        },
      }
    );
  };

  const handleAccept = () => {
    pushToDataLayer('confirm_booking');
    const url = `/Host/Booking/${selectedReservation?.bookId}/Approve`;
    ApproveDeclineReservation(
      { url },
      {
        onSuccess: (response) => {
          const { resultError, statusCode } = response;
          if (statusCode == '200') {
            showSnackbar(t('reservationRequest.alerts.successAccept'), 'success');
            setPerfilGuestDetails(null);
            setStatusAproved(null);
            setNavigationHistory([]);
            setCancelement(null);
            handleReservationClick && handleReservationClick(selectedReservation, true);
          } else {
            showSnackbar(resultError?.message, 'error');
            setStatusAproved(null);
          }
        },
        onError: (error: any) => {
          showSnackbar(error?.message, 'error');
          setStatusAproved(null);
        },
      }
    );
  };

  const ensureHasPayoutAccount = async (): Promise<boolean> => {
    try {
      const response = await RestClient.get('/Payout/Account');
      const { statusCode, data, resultError } = response?.data ?? {};

      if (statusCode !== '200') {
        showSnackbar(resultError?.message || 'No se pudo verificar la cuenta bancaria.', 'error');
        return false;
      }

      // console.log("tiene cuenta?", Array.isArray(data) && data.length > 0);
      const hasAccounts = Array.isArray(data) && data.length > 0;

      if (!hasAccounts) {
        setShowPayoutAccountWarning(true);
        return false;
      }

      return true;
    } catch (error: any) {
      showSnackbar(error?.message || 'No se pudo verificar la cuenta bancaria.', 'error');
      return false;
    }
  };

  // Flujo de aceptación con validación de denuncias previas del huésped.
  const handleAcceptReservation = async () => {
    const hasPayoutAccount = await ensureHasPayoutAccount();
    if (!hasPayoutAccount) return;

    // verificar que huesped no tenga denuncias previas
    const consult = await RestClient.get(`Complaint/Count/${bookingDetails?.userIdRenter}`);

    if (consult.data?.statusCode == '200') {
      const complaints = consult.data?.data?.complaintsCount;

      if (complaints > 10) {
        setComplaintsSummary(complaints);
        setShowComplaintWarning(true);
      } else {
        handleAccept();
      }
    } else {
      showSnackbar(consult.data?.resultError?.message, 'error');
    }
  };

  const handleConfirmAcceptWithComplaints = () => {
    setShowComplaintWarning(false);
    handleAccept();
  };

  // Abre el modal/flujo de denuncia manual.
  const handleComplaint = () => {
    setOpenComplaint(true);
  };

  // Navega hacia adelante en el árbol de motivos de rechazo.
  const handleCancellationReasonNextStep = async (cancel?: any) => {
    const consult = await RestClient.get(
      `Parametrics/ReasonRefusedNextStep?redusedReasonParentId=${cancel?.reasonRefusedId}`
    );

    if (consult.data?.statusCode == '200') {
      setCancellationToShow(consult.data?.data);

      // Agregar el elemento actual al historial antes de avanzar
      setNavigationHistory((prev) => [...prev, cancel]);

      // Si hay un isEndStep, ocultar el botón de cancelar
      consult.data?.data.map((item: any) => item?.isEndStep && setSeeButtonDecline(false));

      setCancelement(cancel);
    }
  };

  const handleNextStepCancel = async (cancelId: number) => {
    setIsLoadingCancelNextStep(true);
    try {
      const parametricNextStep = await RestClient.get(
        `Parametrics/GetHostCancellationReasonNextStep?cancellationReasonOwnerId=${cancelId}&bookingId=${currentSelectedId}`
      );

      if (parametricNextStep.data?.statusCode == '200') {
        const nextData = parametricNextStep.data?.data ?? [];
        const endStepItem = nextData.find((item: any) => item?.isEndStep === true);
        if (nextData.length === 0) {
          setIsCancelLastStep(true);
        } else if (endStepItem) {
          setCancelEndStepData(endStepItem);
          setCancelGuestMessage('');
        } else {
          setDataParametricFirstStep(nextData);
          setSelectedCancelReasonId(null);
          setIsCancelLastStep(false);
          setCancelEndStepData(null);
        }
      }
    } finally {
      setIsLoadingCancelNextStep(false);
    }
  };

  // Inicializa el flujo de cancelación por parte del host.
  const handleCancel = async () => {
    setSeeViewCancelIncident(true);
    setIsCancelLastStep(false);
    setCancelDescription('');
    setSelectedCancelReasonId(null);
    // const cancelCalculation = await RestClient.delete(`Book/${currentSelectedId}/ConfirmedCancellationCalculation`)

    const parametricFirstStep = await RestClient.get(
      `Parametrics/GetHostCancellationReasonFirstStep`
    );
    if (parametricFirstStep?.data?.statusCode == '200') {
      setDataParametricFirstStep(parametricFirstStep?.data?.data ?? []);
    }
    const consult = await RestClient.get(`/Penalty/GetByBookId/${selectedReservation?.bookId}`);
    
    if (consult.data?.statusCode == '200') {      
      setPenality(consult.data?.data);
    }else {
      showSnackbar(consult.data?.resultError?.message, 'info');
    }
  };

  // Navega hacia atrás en el árbol de motivos de rechazo.
  const handleCancellationReasonBeforeStep = async () => {
    setSeeButtonDecline(true);

    // Si hay historial, volver al elemento anterior
    if (navigationHistory.length > 0) {
      // Remover el último elemento del historial
      const newHistory = [...navigationHistory];
      newHistory.pop(); // Remover el elemento actual

      if (newHistory.length > 0) {
        // Si aún hay elementos en el historial, obtener el anterior
        const previousElement = newHistory[newHistory.length - 1];

        // Obtener los hijos del elemento anterior
        const consult = await RestClient.get(
          `Parametrics/ReasonRefusedNextStep?redusedReasonParentId=${previousElement?.reasonRefusedId}`
        );

        if (consult.data?.statusCode == '200') {
          setCancellationToShow(consult.data?.data);
          setCancelement(previousElement);
          setNavigationHistory(newHistory);
        }
      } else {
        // Si no hay más elementos en el historial, volver al nivel inicial
        if (GetHostBookCancellation?.data) {
          setCancellationToShow(GetHostBookCancellation?.data);
          setCancelement(null);
          setNavigationHistory([]);
        } else {
          setStatusAproved(null);
        }
      }
    } else {
      // Si no hay historial, salir del flujo
      setStatusAproved(null);
      setCancelement(null);
      setNavigationHistory([]);
    }
  };

  const handleSendMessage = () => {
    const url = `/Host/Booking/${selectedReservation?.bookId}/Refuse`;
    ApproveDeclineReservation(
      {
        url,
        data: {
          reasonRefused: cancelement?.reasonRefusedId,
          reasonRefusedMessage: message,
        },
      },
      {
        onSuccess: (response) => {
          const { resultError, statusCode } = response;
          if (statusCode == '200') {
            showSnackbar(t('reservationRequest.alerts.successReject'), 'success');
            // Limpiar estados
            setBookingDetails(null);
            setPerfilGuestDetails(null);
            setCurrentSelectedId(null);
            setStatusAproved(null);
            setNavigationHistory([]);
            setCancelement(null);
          } else {
            showSnackbar(resultError?.message, 'error');
            setStatusAproved(null);
          }
        },
        onError: (error: any) => {
          showSnackbar(error?.message, 'error');
          setStatusAproved(null);
        },
      }
    );
  };

  // Carga de detalle de reserva y perfil del huésped asociado.
  const fetchBookingDetails = async (bookId: string) => {
    setIsLoadingBookingDetails(true);
    try {
      const responseBooking = await RestClient.get(`/Book/${bookId}`);
      const responseProcessBooking = await responseBooking.data;

      const bookingData = responseProcessBooking?.data;
      const currentConversationId = bookingData?.tmConversations?.[0]?.conversationId ?? null;

      setBookingDetails(bookingData);
      setConversationId(currentConversationId);
      setMessageConversationId(bookingData?.tmConversations?.[0]?.userIdTwo ?? null);
      setLatestConversationBody('');

      // if (currentConversationId) {
      //   try {
      //     const responseMessages = await RestClient.get(
      //       `/Messaging/Conversations/${currentConversationId}/Messages?page=1&pageSize=20&orderBy=dateDesc`
      //     );
      //     const responseProcessMessages = await responseMessages.data;

      //     if (
      //       responseProcessMessages?.statusCode === '200' &&
      //       Array.isArray(responseProcessMessages?.data)
      //     ) {
      //       const latestMessage = responseProcessMessages.data
      //         .filter(
      //           (item: ConversationMessage) =>
      //             item?.conversationId === currentConversationId && !!item?.body
      //         )
      //         .reduce((latest: ConversationMessage | null, current: ConversationMessage) => {
      //           if (!latest) return current;

      //           const latestDate = latest?.creationDate
      //             ? new Date(latest.creationDate).getTime()
      //             : 0;
      //           const currentDate = current?.creationDate
      //             ? new Date(current.creationDate).getTime()
      //             : 0;

      //           return currentDate > latestDate ? current : latest;
      //         }, null);

      //       setLatestConversationBody(latestMessage?.body ?? '');
      //     }
      //   } catch (error) {
      //     console.error('Error fetching conversation messages:', error);
      //   }
      // }

      setEstadoBook(
        estadoColorReserva(
          bookingData?.bookStatus?.code,
          bookingData?.checkin,
          bookingData?.checkout
        )
      );
      const perfilGuest = await RestClient.get(
        `/GetAdditionalProfileDataByUserId/${bookingData?.userIdRenter}`
      );
      const responsePerfilGuest = await perfilGuest.data;
      setPerfilGuestDetails(responsePerfilGuest?.data);
      setGuestId(responsePerfilGuest?.data.userId);

      const perfilGuestProfile = await RestClient.get(
        `/GetProfileByUserId/${bookingData?.userIdRenter}`
      );
      const responsePerfilGuestProfile = await perfilGuestProfile.data;
      setPerfilUsertProfile(responsePerfilGuestProfile?.data);

    } catch (error) {
      console.error('Error fetching booking details:', error);
    } finally {
      setIsLoadingBookingDetails(false);
    }
  };

  const formatCheckDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    } catch {
      return '';
    }
  };

  // Sincroniza la vista con cambios en la reserva seleccionada.
  useEffect(() => {
    if (selectedReservation?.bookId) {
      fetchBookingDetails(selectedReservation.bookId);
      setCurrentSelectedId(selectedReservation.bookId);
    }
    if (bookingDetails?.sidebarData?.responseCode == 'M21') {
      (async () => {
        const consult = await RestClient.get(`/Penalty/GetByBookId/${selectedReservation?.bookId}`);
        if (consult.data?.statusCode == '200') {      
          setPenality(consult.data?.data);      
        }
      })();
    }
  }, [selectedReservation?.bookId, handleReservationClick]);

  useEffect(() => {
    if (GetHostBookCancellation?.data) {
      setCancellationToShow(GetHostBookCancellation?.data);
      setNavigationHistory([]);
      setCancelement(null);
    }
  }, [GetHostBookCancellation]);

  // Selección de una reserva desde la lista lateral.
  const handleReservationItemClick = (reservation: any) => {
    setCurrentSelectedId(reservation.bookId);
    fetchBookingDetails(reservation.bookId);
    if (isSmallScreen) {
      setMobileShowDetail(true);
    }
    if (onReservationSelect) {
      onReservationSelect(reservation);
    }
  };
  const isLargeScreen = useMediaQuery('(min-width:1920px)');
  // Ordena las reservaciones para priorizar la actualmente seleccionada.
  const orderedReservations = React.useMemo(() => {
    if (!pendingReservations.length) return [];
    const selected = pendingReservations.find((r) => r.bookId === currentSelectedId);
    const others = pendingReservations.filter((r) => r.bookId !== currentSelectedId);
    return selected ? [selected, ...others] : pendingReservations;
  }, [pendingReservations, currentSelectedId]);

  const isReservationRequestView = !originCard && bookingDetails?.bookStatus?.code === 'prebook';
  const isReservationDetailView =
    !!bookingDetails && (originCard || bookingDetails?.bookStatus?.code !== 'prebook');
  const isMainReservationsView = !originCard && (!isSmallScreen || !mobileShowDetail);

  const reservationFinancialSummary = React.useMemo(() => {
    const breakdowns: any[] = bookingDetails?.payPriceCalculations?.[0]?.priceBreakdowns ?? [];
    const hostFeeAmount = breakdowns.find((b: any) => b.type === 'PLATFORM_HOST_FEE')?.amount ?? 0;
    const grossFromBreakdowns = breakdowns
      .filter((b: any) => b.type !== 'PLATFORM_HOST_FEE')
      .reduce((sum: number, b: any) => sum + (b.amount ?? 0), 0);
    const gross =
      bookingDetails?.payPriceCalculations[0]?.priceCalculation.baseCalculation ??
      (grossFromBreakdowns > 0 ? grossFromBreakdowns : 0);
    const net = gross - hostFeeAmount;
    const currency =
      bookingDetails?.payPriceCalculations?.[0]?.priceCalculation?.currencyCode ??
      bookingDetails?.currency ??
      'BOB';

    return {
      currency,
      net,
      netFormatted: `${currency} ${net.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`,
    };
  }, [bookingDetails]);

  const {
    amountToCollect,
    hostCommission,
    additionalCharges,
    accommodation,    
    subtotal: subtotalHost,
  } = Array.isArray(bookingDetails?.payPriceCalculations)
    ? bookingDetails?.payPriceCalculations[0]?.priceCalculation?.hostResume
    : {};

  const currencyCode =
    bookingDetails?.payPriceCalculations?.[0]?.priceCalculation?.currencyCode ??
    bookingDetails?.currency ??
    'BOB';

  const showMobileStickyBar =
    isSmallScreen && mobileShowDetail && statusAproved === null && isReservationRequestView;

  return (
    <React.Fragment>
      {/* Loader global de acciones asíncronas (aprobar/rechazar). */}
      {<LoadingThreeDotsJumping open={isPending} modal={true} />}

      {/* Modo 1: vista de reporte de incidente. */}
      {seeViewReportIncident ? (
        <Box sx={{ maxWidth: 600, p: 4, mx: 'auto' }}>
          {/* Botón de Regresar */}
          <IconButton
            sx={{
              bgcolor: '#f5f5f5',
              mb: 4,
              '&:hover': { bgcolor: '#e0e0e0' },
            }}
            onClick={() => setSeeViewReportIncident(false)}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
          </IconButton>
          {/* Título */}
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 500 }}>
            {t('reservationRequest.incident.title')}
          </Typography>
          {/* Descripción Superior */}
          <Typography variant="body1" sx={{ mt: 4, mb: 2, color: '#333' }}>
            {t('reservationRequest.incident.description')}
          </Typography>
          {/* Área de Texto */}
          <TextField
            fullWidth
            multiline
            rows={6}
            placeholder={t('reservationRequest.incident.placeholder')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                '& fieldset': { borderColor: '#ccc' },
              },
            }}
          />
          {/* Texto de Política */}
          <Typography variant="body2" sx={{ mt: 3, color: '#333', lineHeight: 1.6 }}>
            {t('reservationRequest.incident.policyText')}{' '}
            <Link href="#" underline="always" sx={{ color: 'inherit', fontWeight: 'bold' }}>
              {t('reservationRequest.incident.policyLink')}
            </Link>
            .
          </Typography>
          {/* Botón de Envío */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button
              variant="contained"
              onClick={handleReportSubmit}
              sx={{
                bgcolor: '#5c52a3',
                textTransform: 'none',
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  bgcolor: '#4a418a',
                },
              }}
            >
              {t('reservationRequest.incident.openCase')}
            </Button>
          </Box>
        </Box>
      ) : seeViewCancelIncident ? (
        // Modo 2: flujo de cancelación de reserva.
    <Container
      maxWidth={isLargeScreen ? 'xl' : 'lg'}
      sx={{ px: { xs: 2, sm: 3, md: isLargeScreen ? 5 : 4 }, mt: { xs: 2, md: 3 } }}
    >
      <Grid container spacing={10} justifyContent="space-between">
        <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ maxWidth: 600, p: 4, mx: 'auto', color: '#222222' }}>
          {/* Botón Regresar */}
          <IconButton
            sx={{ bgcolor: '#f5f5f5', mb: 3, '&:hover': { bgcolor: '#e0e0e0' }, mt: -5 }}
            onClick={() => {
              if (cancelEndStepData) {
                setCancelEndStepData(null);
                setCancelGuestMessage('');
              } else if (isCancelLastStep) {
                setIsCancelLastStep(false);
              } else {
                setSeeViewCancelIncident(false);
                setCancelDescription('');
                setSelectedCancelReasonId(null);
              }
            }}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
          </IconButton>

          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            {t('reservationRequest.cancel.impactTitle')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: '#484848' }}>
            {t('reservationRequest.cancel.impactDesc')}
          </Typography>

          {/* Título Dinámico de la Lista */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {t('reservationRequest.cancel.whyTitle', {
              name: selectedReservation?.userIdRenterNavigation?.name,
            })}
          </Typography>

          {/* Lista de Opciones Dinámica / Textarea último paso */}
          {cancelEndStepData ? (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {cancelEndStepData.titleGroup}
              </Typography>
              <Typography variant="body2" sx={{ color: '#484848', mb: 2 }}>
                {cancelEndStepData.detail}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={5}
                placeholder="Escribe un mensaje para el huésped..."
                value={cancelGuestMessage}
                onChange={(e) => setCancelGuestMessage(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '& fieldset': { borderColor: '#ccc' },
                  },
                }}
              />
            </Box>
          ) : isCancelLastStep ? (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {t('reservationRequest.cancel.describeReason', {
                  defaultValue: 'Describe el motivo de cancelación',
                })}
              </Typography>
              <Typography variant="body2" sx={{ color: '#484848', mb: 2 }}>
                {t('reservationRequest.cancel.describeReasonHint', {
                  defaultValue:
                    'Esta información es privada y nos ayuda a mejorar la experiencia en la plataforma.',
                })}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={5}
                placeholder={t('reservationRequest.cancel.describeReasonPlaceholder', {
                  defaultValue:
                    'Explica con detalle el motivo por el cual estás cancelando esta reserva...',
                })}
                value={cancelDescription}
                onChange={(e) => setCancelDescription(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '& fieldset': { borderColor: '#ccc' },
                  },
                }}
              />
            </Box>
          ) : (
            <List disablePadding sx={{ mb: 4 }}>
              {dataParametricFirstStep.map((item: any) => (
                <ListItem key={item.cancellationReasonId} disablePadding>
                  <ListItemButton
                    selected={selectedCancelReasonId === item.cancellationReasonId}
                    sx={{
                      py: 2,
                      px: 0,
                      borderBottom: '1px solid #f0f0f0',
                      '&.Mui-selected': { bgcolor: '#f0eeff' },
                      '&.Mui-selected:hover': { bgcolor: '#e8e5fb' },
                    }}
                    onClick={() => setSelectedCancelReasonId(item.cancellationReasonId)}
                  >
                    <Radio
                      checked={selectedCancelReasonId === item.cancellationReasonId}
                      sx={{ mr: 1, color: '#9CA3AF', '&.Mui-checked': { color: '#5B55C8' } }}
                      size="small"
                    />
                    <ListItemText
                      primary={item.detail}
                      primaryTypographyProps={{ fontSize: '1rem', color: '#222222' }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}

          {/* Botones Inferiores (Segunda Imagen) */}
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button
              onClick={() => {
                setSeeViewCancelIncident(false);
                setIsCancelLastStep(false);
                setCancelEndStepData(null);
                setCancelGuestMessage('');
                setCancelDescription('');
                setSelectedCancelReasonId(null);
                setDataParametricFirstStep([]);
              }}
              variant="secondary"
              sx={{
                color: theme.palette.text.secondary,
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              disabled={
                cancelEndStepData
                  ? !cancelGuestMessage.trim() || isLoadingCancelConfirm
                  : isCancelLastStep
                    ? !cancelDescription.trim() || isLoadingCancelNextStep
                    : !selectedCancelReasonId || isLoadingCancelNextStep
              }
              onClick={async () => {
                if (cancelEndStepData) {
                  setIsLoadingCancelConfirm(true);
                  try {
                    const url = `/Host/Booking/${currentSelectedId}/UpsertHostBookCancellation`;
                    ApproveDeclineReservation(
                      {
                        url,
                        data: {
                          bookId: currentSelectedId,
                          cancellationReasonId: selectedCancelReasonId,
                          message: cancelGuestMessage,
                        },
                      },
                      {
                        onSuccess: (response) => {
                          const { resultError, statusCode } = response;
                          if (statusCode == '200') {
                            showSnackbar('Reserva cancelada correctamente.', 'success');
                            setSeeViewCancelIncident(false);
                            setCancelEndStepData(null);
                            setCancelGuestMessage('');
                            setSelectedCancelReasonId(null);
                          } else {
                            showSnackbar(resultError?.message, 'error');
                          }
                        },
                        onError: (error: any) => showSnackbar(error?.message, 'error'),
                      }
                    );
                  } finally {
                    setIsLoadingCancelConfirm(false);
                  }
                } else if (isCancelLastStep) {
                  // TODO: call cancellation API with selectedCancelReasonId + cancelDescription
                } else if (selectedCancelReasonId) {
                  handleNextStepCancel(selectedCancelReasonId);
                }
              }}
              startIcon={
                isLoadingCancelNextStep || isLoadingCancelConfirm ? (
                  <CircularProgress size={16} color="inherit" />
                ) : undefined
              }
            >
              {cancelEndStepData
                ? t('reservationRequest.cancel.confirmCancel', {
                    defaultValue: 'Confirmar cancelación',
                  })
                : isCancelLastStep
                  ? t('reservationRequest.cancel.confirmCancel', {
                      defaultValue: 'Confirmar cancelación',
                    })
                  : t('reservationRequest.cancel.next', { defaultValue: 'Siguiente' })}
            </Button>
          </Stack>
        </Box>
        </Grid>
        <Cardreimbursement
          image={selectedReservation?.photos?.find((photo: any) => photo.isPrincipal)?.photoLink || ''}
          title={selectedReservation?.listingRent?.name}
          location={`${selectedReservation?.listingRent?.property?.address?.city?.city}, ${selectedReservation?.listingRent?.property?.address?.city?.country}`}
          rating={selectedReservation?.listingRent?.valoration ?? undefined}
          reviews={selectedReservation?.listingRent?.reviews?.length}
          checkIn={
            formatCheckDate(selectedReservation?.checkin) ||
            t('cancelReservationStep1.card.noDate')
          }
          checkOut={
            formatCheckDate(selectedReservation?.checkout) ||
            t('cancelReservationStep1.card.noDate')
          }
          travelers={`${selectedReservation?.guestCount ?? 1} Huésped${selectedReservation?.guestCount > 1 ? 'es' : ''}`}
          paid=''
          refund=''
          penality={`BOB. ${penality?.penaltyAmount ?? 0}`}          
          cancelPolicy={selectedReservation?.listingRent?.cancelationPolicy}
        />
        </Grid>      
        </Container>        
      ) : (
        // Modo 3: layout principal (lista lateral + detalle de solicitud).
        <Box
          sx={{
            display: 'flex',
            height: isSmallScreen ? 'auto' : 'calc(100vh - 74px)',
            maxHeight: isSmallScreen ? 'none' : 'calc(100vh - 74px)',
            overflow: isSmallScreen ? 'visible' : 'hidden',
            minHeight: 0,
            flexDirection: isSmallScreen ? 'column' : 'row',
            width: '100%',
          }}
        >
          {/* Columna izquierda: lista de solicitudes */}
          {isMainReservationsView && (
            <Box
              sx={{
                width: isSmallScreen ? '100%' : '40%',
                minWidth: isSmallScreen ? 'unset' : '350px',
                borderRight: isSmallScreen ? 'none' : '1px solid #e0e0e0',
                bgcolor: 'white',
                overflowY: 'auto',
                height: isSmallScreen ? 'auto': 'calc(100vh - 115px)',
                maxHeight: isSmallScreen ? 'none': 'calc(100vh - 115px)',
                position: isSmallScreen ? 'static' : 'sticky',
                top: isSmallScreen ? 'auto' : 0,
                alignSelf: 'flex-start',
                border: '1px solid #E5E7EB',
                borderRadius: '16px',
                ml:
                  currentBreakpoint == 'lg'
                    ? 2
                    : currentBreakpoint == 'xl'
                      ? 16
                      : originCard
                        ? 4
                        : 0,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                  ml: 4,
                  mt: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconButton
                edge="start"
                sx={{ color: 'black' }}
                onClick={() => navigate("/host")}
              >
                <ArrowBackIos />
              </IconButton>
                <Typography variant="h4Medium" sx={{ fontWeight: 'bold' }}>
                  {t('reservationRequest.list.title')}
                </Typography>
                </Box>
                <IconButton>
                  <FilterListIcon />
                </IconButton>
              </Box>

              {orderedReservations.map((reservation: any) => (
                <Card
                  key={reservation.bookId}
                  onClick={() => handleReservationItemClick(reservation)}
                  sx={{
                    m: 0,
                    p: 0,
                    boxShadow: 'none',
                    border:
                      currentSelectedId === reservation.bookId
                        ? '0px solid transparent'
                        : '1px solid #e0e0e0',
                    mb: 2,
                    cursor: 'pointer',
                    bgcolor: currentSelectedId === reservation.bookId ? '#f9f9f9' : 'white',
                    borderLeft:
                      currentSelectedId === reservation.bookId
                        ? '4px solid #5B55C8'
                        : '4px solid transparent',
                    '&:hover': {
                      bgcolor: '#f5f5f5',
                    },
                  }}
                >
                  <CardContent sx={{ mt: 0, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                      <Avatar
                        src={reservation?.userIdRenterNavigation?.photoLink || jomWhite}
                        alt="User Avatar"
                        sx={{
                          width: 40,
                          height: 40,
                          backgroundColor: theme.palette.customColors.primary[1],
                        }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Typography
                            variant="small1Medium"
                            sx={{ fontWeight: 'bold', color: 'text.primary' }}
                          >
                            {reservation?.userIdRenterNavigation?.name || 'Usuario'}
                          </Typography>
                          <Typography
                            variant="small2Medium"
                            sx={{ color: 'text.secondary', fontSize: '0.72rem' }}
                          >
                            {reservation?.remainingTimeToRequestExpiration
                              ? `Hace ${getRemainingTimeByBookId(
                                  reservation?.bookId,
                                  reservation?.remainingTimeToRequestExpiration
                                )}`
                              : ''}
                          </Typography>
                        </Box>

                        <Typography
                          variant="small1Medium"
                          sx={{ fontWeight: 'bold', color: 'text.primary' }}
                        >
                          {t('reservationRequest.list.requestLabel')}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography
                      variant="small1Regular"
                      color="text.secondary"
                      sx={{ mb: 1, pl: '52px' }}
                    >
                      {reservation?.listingRent?.name || 'Nombre del anuncio'}
                    </Typography>

                    <Box sx={{ pl: '52px' }}>
                      <Box
                        component="span"
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.5,
                          bgcolor: '#FFEDCC',
                          color: '#CC8A00',
                          borderRadius: '15px',
                          padding: '3px 10px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <AccessTimeIcon sx={{ fontSize: 14 }} />
                        {t('reservationRequest.list.remaining')}{' '}
                        {getRemainingTimeByBookId(
                          reservation?.bookId,
                          reservation?.remainingTimeToRequestExpiration
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
          {/* Panel principal: Aceptar o rechazar reserva*/}
          {(originCard || currentSelectedId) &&
            (!isSmallScreen || mobileShowDetail || originCard) && (
              <Box
                sx={{
                  flexGrow: 1,
                  // bgcolor: '#0052f7',
                  pl: isSmallScreen ? 1 : 4,
                  pr: isSmallScreen ? 1 : 4,
                  pt: isSmallScreen ? 1 : 0,
                  pb: 0,
                  ml: isSmallScreen
                    ? 0
                    : currentBreakpoint == 'lg'
                      ? 0
                      : originCard && currentBreakpoint == 'xl'
                        ? 16
                        : originCard
                          ? 4
                          : 0,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isSmallScreen ? 'flex-start' : 'stretch',
                  justifyContent: 'flex-start',
                  overflowY: 'hidden',
                  height: isSmallScreen ? 'auto' : '100%',
                  maxHeight: isSmallScreen ? 'none' : '100%',
                  position: 'relative',
                  top: 'auto',
                  boxSizing: 'border-box',
                }}
              >
                {/* Scrollable content area */}
                <Box
                  sx={{
                    flex: 1,
                    overflowY: isSmallScreen
                      ? 'visible'
                      : statusAproved === 'REJECTED'
                        ? 'hidden'
                        : 'auto',
                    pb: isSmallScreen ? 22 : statusAproved === 'REJECTED' ? 0 : 4,
                    width: '100%',
                    minHeight: 0,
                    boxSizing: 'border-box',
                  }}
                >
                  {isLoadingBookingDetails ? (
                    <ReservationDetailSkeleton showSteps={originCard} />
                  ) : !bookingDetails || !currentSelectedId ? (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        gap: 2,
                        py: 10,
                      }}
                    >
                      <Typography variant="h4Medium" color="text.secondary">
                        {t('reservationRequest.empty.title')}
                      </Typography>
                      <Typography variant="paragraph1Regular" color="text.secondary">
                        {t('reservationRequest.empty.description')}
                      </Typography>
                    </Box>
                  ) : statusAproved === null ? (
                    // Layout de dos columnas cuando statusAproved es null
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: isSmallScreen ? 'column' : 'row',
                        width: '100%',
                        maxWidth: isSmallScreen ? '100%' : !originCard ? '1300px' : '100%',
                        mx: 'auto',
                        gap: 3,
                        alignItems: 'flex-start',
                        alignSelf: 'stretch',
                      }}
                    >
                      {/* Columna izquierda - Contenido principal (Detalles) */}
                      <Box
                        sx={{
                          flex: originCard ? '1 1 70%' : '1 1 100%',
                          minWidth: 0,
                          bgcolor: isSmallScreen && isReservationDetailView ? '#ffffff' : 'white',
                          border:
                            isSmallScreen && isReservationDetailView
                              ? '1px solid #E5E7EB'
                              : isSmallScreen
                                ? 'none'
                                : '1px solid #E5E7EB',
                          borderRadius:
                            isSmallScreen && isReservationDetailView
                              ? '16px'
                              : isSmallScreen
                                ? 0
                                : '16px',
                          p: isSmallScreen ? (isReservationDetailView ? 2 : 1) : 4,
                          overflowY: 'auto',
                          ...(isSmallScreen && {
                            flex: '1 1 100%',
                            width: '100%',
                          }),
                        }}
                      >
                        {/* Status chip + Page title */}
                        {isSmallScreen && isReservationRequestView ? (
                          <>
                            {/* Espaciador para compensar el header fijo */}
                            <Box sx={{ height: 58 }} />
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                position: 'fixed',
                                bgcolor: '#F9FAFB',
                                top: 52,
                                left: 0,
                                right: 0,
                                zIndex: 1200,
                                px: 2,
                                py: 1,
                                borderBottom: '1px solid #F3F4F6',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                              }}
                            >
                              {/* Seccion Solicutudes */}
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  gap: 1.5,
                                  minWidth: 0,
                                  flex: 1,
                                }}
                              >
                                <IconButton
                                  size="small"
                                  onClick={() => setMobileShowDetail(false)}
                                  sx={{ flexShrink: 0, p: 0.5 }}
                                >
                                  <ArrowBackIcon sx={{ fontSize: 22 }} />
                                </IconButton>
                                <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                                  <Typography
                                    sx={{
                                      fontSize: 15,
                                      fontWeight: 600,
                                      color: '#111827',
                                      lineHeight: 1.3,
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                    }}
                                  >
                                    {perfilGuestDetails?.name ?? ''}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: 12,
                                      color: '#6B7280',
                                      lineHeight: 1.3,
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                    }}
                                  >
                                    {bookingDetails?.listingRent?.name}
                                  </Typography>
                                </Box>
                              </Box>
                              {/* Derecha: avatar */}
                              <Avatar
                                src={
                                  perfilGuestDetails?.photoLink ||
                                  bookingDetails?.userIdRenterNavigation?.photoLink
                                }
                                alt={perfilGuestDetails?.name ?? ''}
                                sx={{ width: 40, height: 40, flexShrink: 0 }}
                              />
                            </Box>
                          </>
                        ) : (
                          <>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                gap: 3,
                                mb: isSmallScreen ? 2.5 : 4,
                              }}
                            >
                              {(!isSmallScreen ||
                                isReservationRequestView ||
                                isReservationDetailView) &&
                                estadoBook && (
                                  <Box
                                    component="span"
                                    sx={{
                                      display: 'inline-flex',
                                      alignSelf: 'flex-start',
                                      alignItems: 'center',
                                      gap: 0.5,
                                      backgroundColor: estadoBook.bg,
                                      color: estadoBook.color,
                                      px: 2,
                                      py: 0.8,
                                      borderRadius: '20px',
                                      fontSize: 14,
                                      fontWeight: 600,
                                      letterSpacing: '0.025em',
                                    }}
                                  >
                                    <AccessTimeIcon sx={{ fontSize: 18 }} />
                                    {/* {isReservationDetailView
                                      ? t('reservationRequest.details.reservationTitle', {
                                          defaultValue: 'Reserva',
                                        })
                                      : t('reservationRequest.details.requestTitle')} */}
                                      {estadoBook.title}
                                    {' - '}
                                    {estadoBook.estado}
                                  </Box>
                                )}
                              <Typography
                                sx={{
                                  fontSize: isSmallScreen ? 22 : 28,
                                  fontWeight: 600,
                                  color: '#111827',
                                  letterSpacing: '-0.025em',
                                  lineHeight: 1.2,
                                  px: isSmallScreen ? 0 : 1,
                                }}
                              >
                              {originCard && (
                                  <IconButton
                                    edge="start"
                                    sx={{ color: 'black' }}
                                    onClick={() => navigate("/host")}
                                  >
                                    <ArrowBackIos />
                                  </IconButton>  
                              )}
                                {isSmallScreen && isReservationDetailView
                                  ? t('reservationRequest.details.confirmedPaymentTitle', {
                                      defaultValue: 'Aprobaste la solicitud',
                                    })
                                  : `${perfilGuestDetails?.name ?? ''} ${t('reservationRequest.details.madeRequest')}`}
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                border: '1px solid #E5E7EB',
                                borderRadius: isSmallScreen ? '14px' : '16px',
                                p: isSmallScreen ? 2 : 3,
                                mb: isSmallScreen ? 2.5 : 3,
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 2,
                              }}
                            >
                              <Avatar
                                src={
                                  perfilGuestDetails?.photoLink ||
                                  bookingDetails?.userIdRenterNavigation?.photoLink
                                }
                                alt={perfilGuestDetails?.name ?? ''}
                                sx={{
                                  width: isSmallScreen ? 56 : 64,
                                  height: isSmallScreen ? 56 : 64,
                                  flexShrink: 0,
                                }}
                              />
                              <Box sx={{ minWidth: 0 }}>
                                <Typography
                                  sx={{
                                    fontSize: isSmallScreen ? 16 : 16,
                                    fontWeight: 600,
                                    color: '#111827',
                                    mb: 0.25,
                                  }}
                                >
                                  {perfilGuestDetails?.name ?? ''}{' '}
                                  {perfilGuestDetails?.lastName ?? ''}
                                </Typography>
                                <Typography
                                  sx={{ fontSize: isSmallScreen ? 14 : 14, color: '#6B7280' }}
                                >
                                  {bookingDetails?.listingRent?.name}
                                </Typography>
                                <Typography
                                  sx={{ fontSize: isSmallScreen ? 14 : 14, color: '#6B7280' }}
                                >
                                  {formatDateCheckIn(bookingDetails?.checkin)} -{' '}
                                  {formatDateCheckIn(bookingDetails?.checkout)}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: isSmallScreen ? 14 : 14,
                                    color: '#111827',
                                    fontWeight: 500,
                                    mt: 0.5,
                                  }}
                                >
                                  {`${t('reservationRequest.details.guestsLabel')}: ${bookingDetails?.adultCount || 0} ${bookingDetails?.adultCount === 1 ? t('reservationRequest.details.adult') : t('reservationRequest.details.adults')}, 
                                ${bookingDetails?.childCount || 0} ${bookingDetails?.childCount === 1 ? t('reservationRequest.details.child') : t('reservationRequest.details.children')}, 
                                ${bookingDetails?.infantCount || 0} ${bookingDetails?.infantCount === 1 ? t('reservationRequest.details.baby') : t('reservationRequest.details.babies')}, 
                                ${bookingDetails?.petCount || 0} ${bookingDetails?.petCount === 1 ? t('reservationRequest.details.pet') : t('reservationRequest.details.pets')}`}
                                  {' - '}
                                  {/* {bookingDetails?.amountTotal?.toLocaleString('es-BO', {
                                   */}
                                  {formatSemicolon(amountToCollect)} {currencyCode}
                                </Typography>
                              </Box>
                            </Box>
                          </>
                        )}
                        {isSmallScreen && isReservationRequestView && (
                          <Box sx={{ display: 'flex', flexDirection: 'column', pt: 0, pb: 3 }}>
                            <Box>
                              <Typography sx={{ fontSize: 13, color: '#6B7280' }}>
                                {formatDateCheckIn(bookingDetails?.checkin)} –{' '}
                                {formatDateCheckIn(bookingDetails?.checkout)}
                              </Typography>
                            </Box>

                            <Box>
                              <Typography sx={{ fontSize: 14, color: '#111827' }}>
                                {`${t('reservationRequest.details.guestsLabel')}: ${bookingDetails?.adultCount || 0} ${bookingDetails?.adultCount === 1 ? t('reservationRequest.details.adult') : t('reservationRequest.details.adults')}, 
                                ${bookingDetails?.childCount || 0} ${bookingDetails?.childCount === 1 ? t('reservationRequest.details.child') : t('reservationRequest.details.children')}, 
                                ${bookingDetails?.infantCount || 0} ${bookingDetails?.infantCount === 1 ? t('reservationRequest.details.baby') : t('reservationRequest.details.babies')}, 
                                ${bookingDetails?.petCount || 0} ${bookingDetails?.petCount === 1 ? t('reservationRequest.details.pet') : t('reservationRequest.details.pets')}`}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography sx={{ fontSize: 14 }}>
                                {'Total: '}
                                {/* {bookingDetails?.amountTotal?.toLocaleString('es-BO', { */}
                                {formatSemicolon(amountToCollect)}
                                {currencyCode}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                        {/* Info: próximo paso */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 2,
                            bgcolor: '#F9FAFB',
                            borderRadius: '16px',
                            border: '1px solid #E5E7EB',
                            px: 3,
                            py: 3,
                            mb: 6,
                          }}
                        >
                          <InfoOutlinedIcon
                            sx={{ fontSize: 24, color: '#6B7280', flexShrink: 0 }}
                          />
                          <Box>
                            <Typography
                              sx={{
                                fontSize: 14,
                                color: '#111827',
                                fontWeight: 500,
                                lineHeight: 1.6,
                              }}
                            >
                              {t('reservationRequest.details.messageFrom', {name: perfilGuestDetails?.name??''})}
                              <Box component="span" sx={{ fontWeight: 400, color: '#6B7280' }}>
                                {` `}{bookingDetails?.sidebarData?.mensajeLateral ||
                                  t('reservationRequest.details.nextStep')}
                                  {/*  */}
                              </Box>
                            </Typography>
                          </Box>
                        </Box>

                        {/* Mensajea al huésped */}
                        {!isSmallScreen || isReservationDetailView ? (
                          <Box display="flex" alignItems="center" gap={1.5} sx={{ mb: 6 }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <MessageIcon sx={{ fontSize: 20, color: '#9CA3AF' }} />
                            </Box>

                            <Box>
                              <Typography
                                sx={{ fontSize: 16, fontWeight: 600, color: '#111827', mb: 0.25 }}
                              >
                                {t('reservationRequest.details.sendMessageTitle')}
                              </Typography>
                              <Link
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  onShowConversations();
                                }}
                                underline="hover"
                                sx={{ fontSize: 14, fontWeight: 500, color: '#5B55C8' }}
                              >
                                {perfilGuestDetails?.name ?? ''}{' '}
                                {perfilGuestDetails?.lastName ?? ''}
                              </Link>
                            </Box>
                          </Box>
                        ) : (
                          ''
                        )}

                        {/* Action buttons + countdown */}
                        {bookingDetails?.bookStatus?.code === 'prebook' && !originCard && (
                          <Box sx={{ mb: 2 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                mb: 4,
                                maxWidth: 420,
                              }}
                            >
                              <Button
                                variant="primary"
                                fullWidth
                                onClick={async () => {
                                  const hasPayoutAccount = await ensureHasPayoutAccount();
                                  if (!hasPayoutAccount) return;

                                  setStatusAproved('ACCEPTED');
                                }}
                              >
                                {t('reservationRequest.actions.accept')}
                              </Button>
                              <Button
                                variant="secondary"
                                fullWidth
                                onClick={() => setStatusAproved('REJECTED')}
                              >
                                {t('reservationRequest.actions.reject')}
                              </Button>
                            </Box>
                            <Typography sx={{ fontSize: 13, color: '#64748b' }}>
                              {t('reservationRequest.list.remaining') || 'Decide en un plazo de'}{' '}
                              <Box component="span" sx={{ fontWeight: 600, color: '#111827' }}>
                                {getRemainingTimeByBookId(
                                  bookingDetails?.bookId,
                                  bookingDetails?.remainingTimeToRequestExpiration
                                )}
                              </Box>{' '}
                              para mantener{' '}
                              <Box component="span" sx={{ color: '#5B55C8' }}>
                                tu
                              </Box>{' '}
                              índice de respuesta.
                            </Typography>
                          </Box>
                        )}

                        <Box sx={{ borderTop: '1px solid #E5E7EB', py: isSmallScreen ? 4 : 6 }}>
                          <Typography
                            sx={{
                              fontSize: isSmallScreen ? 15 : 18,
                              fontWeight: 600,
                              color: '#111827',
                              mb: 3,
                            }}
                          >
                            {t('reservationRequest.details.aboutTitle')}{' '}
                            {perfilGuestDetails?.name ?? ''} {perfilGuestDetails?.lastName ?? ''}
                          </Typography>
                          <Grid2 container spacing={3}>
                            {/* Col 1: Rating */}
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                  }}
                                >
                                  <StarBorderIcon sx={{ fontSize: 20, color: '#9CA3AF' }} />
                                </Box>
                                <Box>
                                  <Typography
                                    sx={{ fontSize: 16, fontWeight: 600, color: '#111827' }}
                                  >
                                    {t('reservationRequest.details.reviews')}{' '}
                                    {Number(perfilUserProfile?.guestReviewCalification ?? 0).toFixed(1)}
                                  </Typography>
                                  <Typography sx={{ fontSize: 14, color: '#6B7280' }}>
                                    {perfilUserProfile?.guestReviews.length != null
                                      ? `${t('reservationRequest.details.basedOnReviews', { count: perfilUserProfile?.guestReviews.length, defaultValue: `Basado en ${perfilUserProfile?.guestReviews.length} reseñas` })}`
                                      : t('reservationRequest.details.noReviews', {
                                          defaultValue: 'Sin reseñas aún',
                                        })}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid2>
                            {/* Col 2: Identity verified */}
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                  }}
                                >
                                  <VerifiedUserOutlinedIcon
                                    sx={{ fontSize: 20, color: '#9CA3AF' }}
                                  />
                                </Box>
                                <Box>
                                  <Typography
                                    sx={{ fontSize: 16, fontWeight: 600, color: '#111827' }}
                                  >
                                    {t('reservationRequest.details.identityVerified')}
                                  </Typography>
                                  <Typography sx={{ fontSize: 14, color: '#6B7280' }}>
                                    
                                    {perfilUserProfile?.isDocumentVerified
                                      ? t('reservationRequest.details.documentValidated', {
                                          defaultValue: 'Documento validado',
                                        })
                                      : t('reservationRequest.details.documentPending', {
                                          defaultValue: 'Sin documentos verificados',
                                        })}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid2>
                            {/* Col 1: Lives in + joined */}
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                  }}
                                >
                                  <LocationOnOutlinedIcon sx={{ fontSize: 20, color: '#9CA3AF' }} />
                                </Box>
                                <Box>
                                  {perfilUserProfile?.department && (
                                  <Typography
                                    sx={{ fontSize: 16, fontWeight: 600, color: '#111827' }}
                                  >
                                    {`${t('reservationRequest.details.livesIn')} ${perfilUserProfile?.department??''}` || t('reservationRequest.details.livesIn')}
                                  </Typography>
                                  )}
                                  {perfilUserProfile?.timeInAssert && (
                                  <Typography sx={{ fontSize: 14, color: '#6B7280' }}>
                                    {t('reservationRequest.details.joined')}{' '}
                                    {perfilUserProfile?.timeInAssert}
                                  </Typography>
                                  )}
                                </Box>
                              </Box>
                            </Grid2>
                            {/* Col 2: Show profile link */}
                            <Grid2
                              size={{ xs: 12, sm: 6 }}
                              sx={{ display: 'flex', alignItems: 'center' }}
                            >
                              <Link2
                                to={`/host/show-profile-guest/${guestId}/${selectedReservation?.listingRent?.listingRentId}`}
                                target="_blank"
                                style={{ textDecoration: 'none' }}
                              >
                                <Link
                                  component="span"
                                  underline="hover"
                                  sx={{
                                    fontSize: 14,
                                    fontWeight: 500,
                                    color: '#5B55C8',
                                    cursor: 'pointer',
                                  }}
                                >
                                  {t('reservationRequest.details.showProfile')}
                                </Link>
                              </Link2>
                            </Grid2>
                          </Grid2>
                        </Box>
                        {/* Detalles de la reserva */}
                        <Box sx={{ borderTop: '1px solid #E5E7EB', py: isSmallScreen ? 4 : 6 }}>
                          <Typography
                            sx={{
                              fontSize: isSmallScreen ? 15 : 18,
                              fontWeight: 600,
                              color: '#111827',
                              mb: 3,
                            }}
                          >
                            {t('reservationRequest.details.detailsSectionTitle')}
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {/* Huéspedes */}
                            <Box sx={{ py: 0.5 }}>
                              <Typography
                                sx={{ fontSize: 16, fontWeight: 600, color: '#111827', mb: 0.25 }}
                              >
                                {t('reservationRequest.details.guestsLabel')}
                              </Typography>
                              <Typography sx={{ fontSize: 14, color: '#6B7280' }}>
                                {`${bookingDetails?.adultCount || 0} ${bookingDetails?.adultCount === 1 ? t('reservationRequest.details.adult') : t('reservationRequest.details.adults')}, 
                                ${bookingDetails?.childCount || 0} ${bookingDetails?.childCount === 1 ? t('reservationRequest.details.child') : t('reservationRequest.details.children')}, 
                                ${bookingDetails?.infantCount || 0} ${bookingDetails?.infantCount === 1 ? t('reservationRequest.details.baby') : t('reservationRequest.details.babies')}, 
                                ${bookingDetails?.petCount || 0} ${bookingDetails?.petCount === 1 ? t('reservationRequest.details.pet') : t('reservationRequest.details.pets')}`}
                              </Typography>
                            </Box>
                            {/* Check-in */}
                            <Box sx={{ py: 0.5 }}>
                              <Typography
                                sx={{ fontSize: 16, fontWeight: 600, color: '#111827', mb: 0.25 }}
                              >
                                {t('reservationRequest.details.checkin')}
                              </Typography>
                              <Typography sx={{ fontSize: 14, color: '#6B7280' }}>
                                {formatDateCheckIn(bookingDetails?.checkin, false, true)}
                              </Typography>
                            </Box>
                            {/* Check-out */}
                            <Box sx={{ py: 0.5 }}>
                              <Typography
                                sx={{ fontSize: 16, fontWeight: 600, color: '#111827', mb: 0.25 }}
                              >
                                {t('reservationRequest.details.checkout')}
                              </Typography>
                              <Typography sx={{ fontSize: 14, color: '#6B7280' }}>
                                {formatDateCheckIn(bookingDetails?.checkout, false, true)}
                              </Typography>
                            </Box>
                          </Box>
                          {/* Mostrar calendario */}
                          <Typography
                            onClick={() =>{
                              const property = encodeURIComponent(
                                String(bookingDetails?.listingRent?.listingRentId ?? '')
                              );
                              const name = encodeURIComponent(bookingDetails?.listingRent?.name ?? '');
                              window.location.href = `/host?property=${property}&name=${name}`;                              
                            }}
                            sx={{
                              fontSize: 14,
                              color: '#5B55C8',
                              fontWeight: 500,
                              textDecoration: 'underline',
                              cursor: 'pointer',
                              mt: 3,
                            }}
                          >
                            {t('reservationRequest.details.showCalendar')}
                          </Typography>
                        </Box>

                        {/* ini Ganancias potenciales */}
                        {['M19', 'M21', 'M23'].includes(bookingDetails?.sidebarData?.responseCode) ?
                        (
                         <Box
                          sx={{
                            borderTop: '1px solid #E5E7EB',
                            py: isSmallScreen ? 4 : 6,
                          }}
                        >
                          <Box sx={{ mb: 2 }}>
                            <Typography
                              variant="paragraph1Medium"
                              sx={{
                                mb: { xs: 2, sm: 3 },
                                fontWeight: 600,
                                color: '#000',
                                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                              }}
                            >
                              {t('hostMessagePanel.accommodation.penalty', 'Penalización')}
                            </Typography>
                          </Box>    
                          {CostComponentJomReserve (t('hostMessagePanel.accommodation.calculatedPenalty', 'Penalización calculado'), penality?.penaltyAmount??0, currencyCode, true)}        
                          <Divider
                            sx={{
                              borderStyle: 'dashed',
                              bgcolor: 'transparent',
                              borderColor: '#e0e0e0',
                            }}
                          />
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mb: 1,
                              pt: isSmallScreen ? 1 : 2
                            }}
                          >
                            <Typography
                              variant="small1Regular"
                              color="text.secondary"
                              sx={{
                                fontWeight: 500,
                                color: '#000',
                                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                              }}
                            >
                              {t('hostMessagePanel.accommodation.total', 'Total')}
                            </Typography>
                            <Typography
                              variant="paragraph1Medium"
                              sx={{
                                fontWeight: 700,
                                color: '#000',
                                fontSize: { xs: '0.8rem', sm: '1rem' },
                              }}
                            >
                              {formatSemicolon(penality?.penaltyAmount??0)} {currencyCode}
                            </Typography>
                          </Box>
                        </Box>
                        ) : 
                        (
                        <Box
                          sx={{
                            borderTop: '1px solid #E5E7EB',
                            py: isSmallScreen ? 4 : 6,
                          }}
                        >
                          <Box sx={{ mb: 2 }}>
                            <Typography
                              variant="paragraph1Medium"
                              sx={{
                                mb: { xs: 2, sm: 3 },
                                fontWeight: 600,
                                color: '#000',
                                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                              }}
                            >
                              {['M25'].includes(bookingDetails?.sidebarData?.responseCode) ? t('hostMessagePanel.income.subTitle', 'Ingresos') : t('hostMessagePanel.income.title', 'Ingresos Potenciales')}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Typography
                              variant="paragraph1Medium"
                              sx={{
                                mb: { xs: 2, sm: 3 },
                                fontWeight: 600,
                                color: '#000',
                                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                              }}
                            >
                              {t('hostMessagePanel.accommodation.title', 'Hospedaje')}
                            </Typography>
                          </Box>
                          {/* Detalle de Ingresos */}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="small1Medium">
                              {t('hostMessagePanel.income.nightsDetail', {
                                currency: currencyCode,
                                price: formatSemicolon(accommodation?.baseAmount),
                                nights: accommodation?.nightsCount         
                              })}
                            </Typography>
                            <Typography
                              variant="small1Medium"
                              sx={{
                                fontWeight: 500,
                                color: '#000',
                                fontSize: { xs: '0.85rem', sm: '0.9rem' },
                              }}
                            >
                              {formatSemicolon(accommodation?.baseAmount)} {currencyCode}
                            </Typography>
                          </Box>

                          {CostComponentJomReserve (t('hostMessagePanel.accommodation.discountApplied', 'Descuento aplicado'), accommodation?.appliedDiscount, currencyCode)}
                         
                         {accommodation?.appliedDiscount > 0 && CostComponentJomReserve (t('hostMessagePanel.accommodation.discounted', 'Hospedaje con descuento'), accommodation?.discountedAmount, currencyCode)}
  

                        {additionalCharges?.extraGuestFee> 0 || additionalCharges?.petFee> 0 || additionalCharges?.cleaningFee> 0 || additionalCharges?.otherFees> 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography
                              variant="paragraph1Medium"
                              sx={{
                                mb: { xs: 2, sm: 3 },
                                fontWeight: 600,
                                color: '#000',
                                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                              }}
                            >
                              {t('hostMessagePanel.additionalCharges.title', 'Cargos adicionales')}
                            </Typography>
                          </Box>
                          )}

                          {CostComponentJomReserve (t('hostMessagePanel.additionalCharges.extraGuestFee', 'Huéspedes extra'), additionalCharges?.extraGuestFee, currencyCode)}

                          {CostComponentJomReserve (t('hostMessagePanel.additionalCharges.petFee', 'Mascota'), additionalCharges?.petFee, currencyCode)}

                          {CostComponentJomReserve (t('hostMessagePanel.additionalCharges.cleaningFee', 'Limpieza'), additionalCharges?.cleaningFee, currencyCode)}

                          {CostComponentJomReserve (t('hostMessagePanel.additionalCharges.otherFees', 'Otros cargos'), additionalCharges?.otherFees, currencyCode)}


                          <Divider
                            sx={{
                              my: 2,
                              borderStyle: 'dashed',
                              bgcolor: 'transparent',
                              borderColor: '#e0e0e0',
                            }}
                          />

                          {/* Total de Ingresos */}   
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <Typography
                              variant="small1Regular"
                              color="text.secondary"
                              sx={{
                                fontWeight: 500,
                                color: '#000',
                                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                              }}
                            >
                              {t('hostMessagePanel.totalGenerated.title', 'Subtotal generado')}
                            </Typography>
                            <Typography
                              variant="paragraph1Medium"
                              sx={{
                                fontWeight: 700,
                                color: '#000',
                                 fontSize: { xs: '0.85rem', sm: '0.9rem' },
                              }}
                            >
                              {formatSemicolon(subtotalHost)} {currencyCode}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <Typography
                              variant="small1Regular"
                              color="text.secondary"
                              sx={{
                                fontWeight: 500,
                                color: '#000',
                                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                              }}
                            >
                              {t('hostMessagePanel.totalGenerated.comision', 'Comisión JOM anfitrión 5%')}
                            </Typography>
                            <Typography
                              variant="paragraph1Medium"
                              sx={{
                                fontWeight: 700,
                                color: '#000',
                                 fontSize: { xs: '0.85rem', sm: '0.9rem' },
                              }}
                            >
                              {formatSemicolon(hostCommission)} {currencyCode}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <Typography
                              variant="small1Regular"
                              color="text.secondary"
                              sx={{
                                fontWeight: 500,
                                color: '#000',
                                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                              }}
                            >
                              {t('hostMessagePanel.totalGenerated.receive', 'Recibirás')}
                            </Typography>
                            <Typography
                              variant="paragraph1Medium"
                              sx={{
                                fontWeight: 700,
                                color: '#000',
                                fontSize: { xs: '0.8rem', sm: '1rem' },
                              }}
                            >
                              {formatSemicolon(amountToCollect)} {currencyCode}
                            </Typography>
                          </Box>
                        </Box>
                        )}

                        {/* end Ganancias */}

                        {/* Ayuda y recursos */}
                        <Box
                          sx={{ borderTop: '1px solid #E5E7EB', pt: isSmallScreen ? 4 : 6, pb: 0 }}
                        >
                          <Typography
                            sx={{
                              fontSize: isSmallScreen ? 15 : 18,
                              fontWeight: 600,
                              color: '#111827',
                              mb: 3,
                            }}
                          >
                            {t('reservationRequest.support.title')}
                          </Typography>
                          {/* Centro de ayuda */}
                          <Link2
                            to="/help-center"
                            target="_blank"
                            style={{ textDecoration: 'none' }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                py: 1.5,
                                cursor: 'pointer',
                                '&:hover .help-icon': { color: '#4A45B0' },
                                '&:hover .help-text': { color: '#4A45B0' },
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <HelpOutlineIcon
                                  className="help-icon"
                                  sx={{ fontSize: 20, color: '#9CA3AF', transition: 'color 0.15s' }}
                                />
                                <Typography
                                  className="help-text"
                                  sx={{
                                    fontSize: 14,
                                    fontWeight: 500,
                                    color: '#6B7280',
                                    transition: 'color 0.15s',
                                  }}
                                >
                                  {t('reservationRequest.support.visitHelpCenter')}
                                </Typography>
                              </Box>
                              <ChevronRightIcon sx={{ fontSize: 20, color: '#9CA3AF' }} />
                            </Box>
                          </Link2>
                          {/* Denunciar */}
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              py: 1.5,
                              cursor: 'pointer',
                              '&:hover .flag-icon': { color: '#DC2626' },
                              '&:hover .flag-text': { color: '#DC2626' },
                            }}
                            onClick={handleComplaint}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <FlagOutlinedIcon
                                className="flag-icon"
                                sx={{ fontSize: 20, color: '#9CA3AF', transition: 'color 0.15s' }}
                              />
                              <Typography
                                className="flag-text"
                                sx={{
                                  fontSize: 14,
                                  fontWeight: 500,
                                  color: '#6B7280',
                                  transition: 'color 0.15s',
                                }}
                              >
                                {t('reservationRequest.support.reportGuest')}
                              </Typography>
                            </Box>
                            <ChevronRightIcon sx={{ fontSize: 20, color: '#9CA3AF' }} />
                          </Box>
                        </Box>
                      </Box>

                      {/* Columna derecha - Card process (Pasos de Reserva) */}
                      {originCard && (
                        <Box
                          sx={{
                            flex: '0 0 36%',
                            borderRadius: 3,
                            position: isSmallScreen ? 'static' : 'sticky',
                            top: isSmallScreen ? 'auto' : 0,
                            alignSelf: 'flex-start',
                            zIndex: 10,
                            ...(isSmallScreen && {
                              flex: '1 1 100%',
                              width: '100%',
                            }),
                          }}
                        >
                          <ReservationSteps
                            bookingDetails={bookingDetails}
                            onReportIncident={() => setSeeViewReportIncident(true)}
                            onCancelReservation={() => handleCancel()}
                          />
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        maxWidth: '100%',
                        width: '100%',
                        p: 0,
                        minHeight: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {statusAproved === 'ACCEPTED' && (
                        <React.Fragment>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              flex: 0.5,
                              minWidth: 0,
                              height: isSmallScreen ? 'auto' : 'calc(100vh - 74px)',
                              borderRadius: isSmallScreen ? 0 : 4,
                              border: isSmallScreen ? 0 : 1,
                              borderColor: 'divider',
                              bgcolor: 'background.paper',
                            }}
                          >
                            <Box sx={{ flex: 1, overflow: isSmallScreen ? 'visible' : 'hidden' }}>
                              <Box
                                sx={{
                                  maxWidth: 900,
                                  mx: 'auto',
                                  px: { xs: 3, md: 10 },
                                  pt: { xs: 4, md: 6 },
                                  pb: isSmallScreen ? 12 : 6,
                                }}
                              >
                                <Typography variant="h4Medium" component="div">
                                  {t('reservationRequest.actions.confirmAcceptTitle', {
                                    name: perfilGuestDetails?.name ?? '',
                                  })}
                                </Typography>
                                <Typography
                                  variant="paragraph1Regular"
                                  component="div"
                                  sx={{ mt: 2 }}
                                >
                                  {perfilGuestDetails?.name ??
                                    bookingDetails?.userIdRenterNavigation?.name}{' '}
                                  {perfilGuestDetails?.lastName ??
                                    bookingDetails?.userIdRenterNavigation?.lastName}{' '}
                                  quiere alojarse para las fechas{' '}
                                  {formatearFecha(bookingDetails?.checkin)} a{' '}
                                  {formatearFecha(bookingDetails?.checkout)}. Vas a ganar{' '}
                                  {formatSemicolon(amountToCollect)}, por los dias de reserva.
                                </Typography>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    gap: 2,
                                    mt: 5,
                                    mb: 2,
                                    justifyContent: 'flex-start',
                                    flexDirection: isSmallScreen ? 'column' : 'row',
                                  }}
                                >
                                  <Button
                                    variant="primary"
                                    fullWidth
                                    onClick={handleAcceptReservation}
                                  >
                                    {t('reservationRequest.actions.yesApprove')}
                                  </Button>
                                  <Button
                                    variant="secondary"
                                    fullWidth
                                    onClick={() => setStatusAproved(null)}
                                  >
                                    {t('reservationRequest.cancel.cancelButton')}
                                  </Button>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </React.Fragment>
                      )}
                      {statusAproved === 'REJECTED' && (
                        <React.Fragment>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              flex: 0.5,
                              minWidth: 0,
                              height: isSmallScreen ? 'auto' : 'calc(100vh - 74px)',
                              borderRadius: isSmallScreen ? 0 : 4,
                              border: isSmallScreen ? 0 : 1,
                              borderColor: 'divider',
                              bgcolor: 'background.paper',
                            }}
                          >
                            <Box sx={{ flex: 1, overflow: isSmallScreen ? 'visible' : 'hidden' }}>
                              <Box
                                sx={{
                                  maxWidth: 900,
                                  mx: 'auto',
                                  px: { xs: 3, md: 10 },
                                  pt: { xs: 4, md: 6 },
                                  pb: isSmallScreen ? 12 : 6,
                                }}
                              >
                                {/* Back button + step indicator */}
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    pb: 3,
                                  }}
                                >
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      if (navigationHistory.length > 0) {
                                        handleCancellationReasonBeforeStep();
                                      } else {
                                        setStatusAproved(null);
                                      }
                                    }}
                                    sx={{
                                      width: 32,
                                      height: 32,
                                      borderRadius: '50%',
                                      ml: -0.5,
                                      '&:hover': { bgcolor: 'action.hover' },
                                    }}
                                  >
                                    <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
                                  </IconButton>
                                  <Typography
                                    sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 500 }}
                                  >
                                    {t('reservationRequest.actions.stepIndicator', {
                                      defaultValue: `Paso ${navigationHistory.length + 1} de 3`,
                                      step: navigationHistory.length + 1,
                                      total: 3,
                                    })}
                                  </Typography>
                                </Box>

                                {/* Title */}
                                <Typography
                                  component="h1"
                                  sx={{
                                    fontSize: 24,
                                    fontWeight: 600,
                                    color: '#111827',
                                    lineHeight: 1.3,
                                    mb: 1,
                                  }}
                                >
                                  {navigationHistory.length === 0
                                    ? t('reservationRequest.actions.whyRejectTitle')
                                    : t('reservationRequest.actions.moreInfoTitle', {
                                        defaultValue: 'Danos un poco más de información',
                                      })}
                                </Typography>

                                {/* Subtitle */}
                                <Typography sx={{ fontSize: 14, color: 'text.secondary', mb: 4 }}>
                                  {navigationHistory.length === 0
                                    ? t('reservationRequest.actions.whyRejectSubtitle', {
                                        defaultValue:
                                          'Esta información ayuda a mejorar la experiencia para anfitriones y huéspedes.',
                                      })
                                    : t('reservationRequest.actions.moreInfoSubtitle', {
                                        defaultValue:
                                          'Esto nos ayuda a entender mejor tu decisión.',
                                      })}
                                </Typography>

                                {/* Options list */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                  {cancellationToShow.map((el: any) => (
                                    <React.Fragment key={el.reasonRefusedId}>
                                      {el?.isEndStep ? (
                                        <TextField
                                          multiline
                                          rows={5}
                                          fullWidth
                                          value={message}
                                          onChange={(e) => setMessage(e.target.value)}
                                          variant="outlined"
                                          placeholder="Hola, gracias por tu interés. lamentablamente no puedo aceptar esta reserva porque..."
                                          sx={{
                                            '& .MuiOutlinedInput-root': {
                                              borderRadius: 2,
                                              backgroundColor: 'white',
                                              fontFamily: typography.paragraph1Regular,
                                            },
                                          }}
                                        />
                                      ) : (
                                        <Box
                                          component="label"
                                          sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            p: 2,
                                            border: '1px solid',
                                            borderColor:
                                              selectedReasonId === el.reasonRefusedId
                                                ? 'primary.main'
                                                : 'divider',
                                            borderRadius: '16px',
                                            cursor: 'pointer',
                                            transition: 'border-color 0.2s, background-color 0.2s',
                                            '&:hover': { bgcolor: 'action.hover' },
                                          }}
                                          onClick={() => {
                                            setSelectedReasonId(el.reasonRefusedId);
                                          }}
                                        >
                                          <Typography
                                            sx={{
                                              fontSize: 14,
                                              fontWeight: 500,
                                              color: '#111827',
                                              pr: 2,
                                            }}
                                          >
                                            {el?.reasonRefusedText}
                                          </Typography>
                                          <Box
                                            sx={{
                                              width: 20,
                                              height: 20,
                                              borderRadius: '50%',
                                              border: `2px solid ${selectedReasonId === el.reasonRefusedId ? theme.palette.primary.main : '#b0b0b0'}`,
                                              flexShrink: 0,
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                            }}
                                          >
                                            {selectedReasonId === el.reasonRefusedId && (
                                              <Box
                                                sx={{
                                                  width: 10,
                                                  height: 10,
                                                  borderRadius: '50%',
                                                  backgroundColor: theme.palette.primary.main,
                                                }}
                                              />
                                            )}
                                          </Box>
                                        </Box>
                                      )}
                                    </React.Fragment>
                                  ))}
                                </Box>

                                {/* Bottom spacer */}
                                <Box sx={{ height: 48 }} />
                              </Box>
                            </Box>

                            {/* Footer anchored at bottom of container */}
                            <Box
                              sx={{
                                ...(isSmallScreen
                                  ? {
                                      position: 'fixed',
                                      bottom: 46,
                                      left: 0,
                                      right: 0,
                                      zIndex: 1100,
                                      borderRadius: 0,
                                    }
                                  : {
                                      flexShrink: 0,
                                      borderRadius: '0 0 16px 16px',
                                    }),
                                borderTop: '1px solid #e0e0e0',
                                pt: 2,
                                pb: isSmallScreen ? 3 : 3,
                                px: { xs: 2, md: 4 },
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                bgcolor: 'background.paper',
                                boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
                              }}
                            >
                              <Button
                                variant="text"
                                onClick={() => {
                                  if (navigationHistory.length > 0) {
                                    handleCancellationReasonBeforeStep();
                                  } else {
                                    setStatusAproved(null);
                                  }
                                }}
                                sx={{ color: 'primary.main', fontWeight: 500 }}
                              >
                                {t('reservationRequest.cancel.cancelButton', {
                                  defaultValue: 'Cancelar',
                                })}
                              </Button>
                              {cancellationToShow.some(
                                (el: any) => el?.isEndStep && el?.messageTo !== 'ASSERT'
                              ) ? (
                                <Button variant="primary" onClick={handleSendMessage}>
                                  {t('reservationRequest.actions.sendButton', {
                                    defaultValue: 'Enviar',
                                  })}
                                </Button>
                              ) : (
                                <Button
                                  variant="primary"
                                  disabled={!selectedReasonId}
                                  onClick={() => {
                                    const selectedItem = cancellationToShow.find(
                                      (el: any) => el.reasonRefusedId === selectedReasonId
                                    );
                                    if (selectedItem) {
                                      handleCancellationReasonNextStep(selectedItem);
                                    }
                                  }}
                                >
                                  {t('reservationRequest.actions.continueButton', {
                                    defaultValue: 'Continuar',
                                  })}
                                </Button>
                              )}
                            </Box>
                          </Box>
                        </React.Fragment>
                      )}
                    </Box>
                  )}
                </Box>

                {/* Desktop sticky footer */}
                {!isSmallScreen &&
                  !originCard &&
                  statusAproved === null &&
                  bookingDetails?.bookStatus?.code === 'prebook' && (
                    <Box
                      sx={{
                        flexShrink: 0,
                        position: 'sticky',
                        bottom: 40,
                        zIndex: 2,
                        border: '1px solid #E5E7EB',
                        borderRadius: '0 0 12px 12px',
                        backgroundColor: 'white',
                        mt: 0,
                        px: 8,
                        py: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTimeIcon sx={{ fontSize: 20, color: '#F59E0B' }} />
                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                          Expira en{' '}
                          {getRemainingTimeByBookId(
                            bookingDetails?.bookId,
                            bookingDetails?.remainingTimeToRequestExpiration
                          )}
                        </Typography>
                      </Box>

                      <Button
                        variant="secondary"
                        onClick={() => onShowConversations()}
                        sx={{ minWidth: 210, height: 46 }}
                      >
                        {t('reservationRequest.details.sendMessageTitle')}
                      </Button>
                    </Box>
                  )}
              </Box>
            )}
          <NestedListModal
            open={openComplaint}
            onClose={() => setOpenComplaint(false)}
            data={GetComplaintReasonsAsTree?.data}
            onSubmit={(selected, text) => {
              if (selected.children.length == 0) {
                ComplaintCreate(
                  {
                    bookingId: selectedReservation?.bookId,
                    complaintReasonId: selected.id,
                    freeTextDescription: text,
                  },
                  {
                    onSuccess: (response) => {
                      const { resultError, statusCode } = response;
                      if (statusCode == '200') {
                        showSnackbar(t('reservationRequest.alerts.successReport'), 'success');
                      } else {
                        showSnackbar(resultError?.message, 'error');
                      }
                    },
                    onError: (error: any) => showSnackbar(error?.message, 'error'),
                  }
                );
              }
            }}
          />
          <ConfirmDialog
            open={showComplaintWarning}
            onClose={() => setShowComplaintWarning(false)}
            onConfirm={handleConfirmAcceptWithComplaints}
            title={t('reservationRequest.complaintWarning.title')}
            confirmColor="primary"
            description={
              <Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {t('reservationRequest.complaintWarning.description')}
                </Typography>
                {complaintsSummary > 0 && (
                  <Box sx={{ bgcolor: '#fff3cd', p: 2, borderRadius: 2, mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {t('reservationRequest.complaintWarning.complaintCount', {
                        count: complaintsSummary,
                      })}
                    </Typography>
                  </Box>
                )}
                <Typography variant="body2" color="text.secondary">
                  {t('reservationRequest.complaintWarning.question')}
                </Typography>
              </Box>
            }
            confirmText={t('reservationRequest.complaintWarning.confirmButton')}
            cancelText={t('reservationRequest.complaintWarning.cancelButton')}
          />
          <ConfirmDialog
            open={showPayoutAccountWarning}
            onClose={() => setShowPayoutAccountWarning(false)}
            onConfirm={() => {
              setShowPayoutAccountWarning(false);
              navigate('/host/info-profile/payments?tab=3', {
                state: { paymentTab: 3 },
              });
            }}
            title="Configura tu cuenta bancaria"
            confirmColor="primary"
            description={
              <Box>
                <Typography variant="body1" sx={{ mb: 1.5 }}>
                  Para aceptar reservas, primero debes registrar una cuenta bancaria para recibir tus pagos.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Te llevaremos a la sección de configuración de cuenta.
                </Typography>
              </Box>
            }
            confirmText="Ir a configuración"
            cancelText="Cancelar"
          />
        </Box>
      )}

      {/* Mobile sticky bar above bottom navigation for list view */}
      {showMobileStickyBar && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 56,
            left: 0,
            right: 0,
            zIndex: 1100,
            bgcolor: 'white',
            borderTop: '1px solid #E5E7EB',
            px: 2,
            py: 1.5,
            boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 18, color: '#CC8A00' }} />
              <Box display={'flex'} flexDirection={'column'} lineHeight={1}>
                <Box>
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#000000' }}>
                    {'Expira en'}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#000000' }}>
                    {getRemainingTimeByBookId(
                      bookingDetails?.bookId,
                      bookingDetails?.remainingTimeToRequestExpiration
                    )}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Button variant="secondary" onClick={() => onShowMessaging?.()}>
              {t('reservationRequest.details.sendMessageTitle')}
            </Button>
          </Box>
        </Box>
      )}
    </React.Fragment>
  );
};

export default ReservationRequest;
