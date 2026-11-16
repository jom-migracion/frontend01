import {
  Card,
  Typography,
  Box,
  Divider,
  Button,
  useTheme,
  TextField,
  Avatar,
  ListItemText,
  ListItemButton,
  Paper,
  List,
  ListItem,
  IconButton,
  Radio,
  CircularProgress,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import { useCustomMutationByUrl, useGet, usePost, usePost2, usePut } from '@/hooks/api';
import { useSnackbar } from '@/context/SnackbarContext';
import { useMessageStoreReservation, useViewReservationStore } from '@/store/message.store';

import { NestedListModal } from './NestedListModal';
import ProfileModal from '@/modules/_admin/components/ProfileModal';
import { RestClient } from '@/services/RestClient';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import ConfirmDialog from '@/components/ConfirmDialog';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { formatDateCheckIn } from '@/common/util/dateFunctions';
import { useAuthStore } from '@/store/auth.store';
import { useAuthContext } from '@/modules/_auth/context/AuthContext';
import theme from '@/themes/theme';
import { formatSemicolon } from '@/common/util/numbersFuntios';
import { estadoColorReserva, EstadoReserva } from '@/common/util/statusFunctios';
import { formatDate } from '@/utilities/dateUtils';
import { pushToDataLayer } from '@/utilities/analytics';

const QuestionCancel: React.FC<{
  listItems: any;
  conversation: any;
  setStatusAproved: (bol: string | null) => void;
}> = ({ listItems, conversation, setStatusAproved }) => {
  const storeReservation = useMessageStoreReservation((state: any) => state.setStateReservation);
  const { t } = useTranslation();

  // hooks
  const showSnackbar = useSnackbar();
  const { typography } = useTheme();

  // api
  const { mutate: RefuseConsulting } = usePut(
    `/Host/Booking/Consulting/${conversation?.priceCalculation?.priceCalculation?.priceCalculationId}/Refuse`
  );

  const handleCancelConsult = (item: any) => {
    if (conversation?.priceCalculation?.priceCalculation?.priceCalculationId) {
      RefuseConsulting(item?.reasonRefusedId, {
        onSuccess: (response) => {
          const { resultError, statusCode } = response;
          if (statusCode == '200') {
            storeReservation('REFUSED');
            showSnackbar(t('hostMessagePanel.cancelFlow.success'), 'success');
            setStatusAproved(null);
          } else showSnackbar(resultError?.message, 'error');
        },
        onError: (error: any) => showSnackbar(error?.message, 'error'),
      });
    } else {
      showSnackbar(t('hostMessagePanel.cancelFlow.error'), 'error');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#fff',
      }}
    >
      <Paper
        sx={{
          width: '100%',
          maxWidth: '500px',
          margin: 'auto',
          padding: 3,
          textAlign: 'center',
          borderRadius: '12px',
          boxShadow: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100vh',
        }}
      >
        <Box>
          <Typography
            variant="h3Medium"
            component="h1"
            sx={{ fontWeight: 'bold', textAlign: 'left', mb: 4 }}
          >
            {t('hostMessagePanel.cancelFlow.tellUsWhy')}
          </Typography>
          <List>
            {listItems.map((item: any) => (
              <ListItem
                key={item?.reasonRefusedId}
                sx={{
                  paddingLeft: 0,
                  paddingRight: 0,
                  '& .MuiListItemText-primary': {
                    fontFamily: typography.paragraph1Medium,
                    lineHeight: '1.5',
                    cursor: 'pointer',
                    ':hover': {
                      backgroundColor: 'black',
                      color: 'white',
                      p: 1,
                      borderRadius: '12px',
                      transition: '0.3s',
                    },
                  },
                  paddingBottom: 2,
                  paddingTop: 2,
                }}
              >
                <ListItemText
                  primary={item?.reasonRefusedText}
                  onClick={() => handleCancelConsult(item)}
                />
              </ListItem>
            ))}
          </List>
          <Button
            variant="outlined"
            fullWidth
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontFamily: typography.paragraph1Medium,
              padding: '12px 24px',
              borderColor: 'grey.400',
              mt: 5,
            }}
            onClick={() => setStatusAproved(null)}
          >
            {t('hostMessagePanel.cancelFlow.cancel')}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

const CostComponentJom = (title: string, value: number, currency: string) => {
  if (value <= 0 || value === null || value === undefined) {
    return null;
  }

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
  );
};

const DetailPanelMessageHost02: React.FC<{
  bookingData: any;
  conversation: any;
  reCalled: () => void;
  onCloseMobile?: () => void;
  onViewReservation?: (bookingData: any) => void;
}> = ({ bookingData, conversation, reCalled, onCloseMobile }) => {
  const [statusAproved, setStatusAproved] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [convId, setConvId] = useState(null);
  const [cancellationToShow, setCancellationToShow] = useState<any>([]);
  const [openComplaint, setOpenComplaint] = useState<boolean>(false);
  const [openProfileModal, setOpenProfileModal] = useState<boolean>(false);
  const [seeButtonDecline, setSeeButtonDecline] = useState<boolean>(true);
  const [cancelement, setCancelement] = useState<any>(null);
  const [navigationHistory, setNavigationHistory] = useState<any[]>([]);
  const [seeViewCancelRented, setSeeViewCancelRented] = useState(false);
  const [dataParametricCancelRented, setDataParametricCancelRented] = useState<any[]>([]);
  const [selectedCancelReasonId, setSelectedCancelReasonId] = useState<number | null>(null);
  const [isLoadingCancelNextStep, setIsLoadingCancelNextStep] = useState<boolean>(false);
  const [isCancelLastStep, setIsCancelLastStep] = useState<boolean>(false);
  const [cancelDescription, setCancelDescription] = useState<string>('');
  const [cancelEndStepData, setCancelEndStepData] = useState<any>(null);
  const [cancelGuestMessage, setCancelGuestMessage] = useState<string>('');
  const [isLoadingCancelConfirm, setIsLoadingCancelConfirm] = useState<boolean>(false);
  const [showComplaintWarning, setShowComplaintWarning] = useState<boolean>(false);
  const [complaintsSummary, setComplaintsSummary] = useState<any>(null);
  const [penality, setPenality] = useState<any>(null);

  const stateReservation = useMessageStoreReservation((state: any) => state.stateReservation);
  const { identifier: userId } = useAuthStore.getState();
  // const storeReservation = useMessageStoreReservation((state: any) => state.setStateReservation);
  const { isHostAuthenticated, changeRole } = useAuthContext();
  const setViewReservation = useViewReservationStore((state: any) => state.setViewReservation);

  const {
    conversationId,
    userIdTwoNavigation,
    listingRent,
    priceCalculation,
    userIdOneNavigation,
    listingRentId,
    booking,
  } = conversation || {};
  const { bookStatus, bookId, checkin, checkout, payPriceCalculations } = bookingData || {};
  // const infoPrice = JSON.parse(priceCalculation?.priceCalculation?.breakdownInfo ?? '[]');
  // const feeJom = infoPrice?.find((item: any) => item?.Type == 'PLATFORM_HOST_FEE')?.Amount ?? 0;
  // const newDiscount = infoPrice?.find((item: any) => item?.Type == 'NEW_DISCOUNT')?.Amount;
  // const nigthByNight = infoPrice?.filter((item: any) => item?.Type == 'BASE_PRICE')?.length ?? 0;

  // const priceBase =
  //   infoPrice?.reduce(
  //     (sum: number, item: any) =>
  //       item?.Type == 'BASE_PRICE' ? sum + Number(item?.Amount ?? 0) : sum,
  //     0
  //   ) ?? 0;

  // const totalToPay = Array.isArray(payPriceCalculations)
  //   ? (payPriceCalculations[0]?.priceCalculation?.payoutAmount ?? 0)
  //   : 0;
  // const additionalFees = Array.isArray(payPriceCalculations)
  //   ? (payPriceCalculations[0]?.priceCalculation?.additionalFees ?? 0)
  //   : 0;
  const currencyPay = Array.isArray(payPriceCalculations)
    ? (payPriceCalculations[0]?.priceCalculation?.currencyCode ?? '')
    : '';

  const {
    amountToCollect,
    accommodation,
    additionalCharges,
    hostCommission,
    subtotal: subtotalHost,
  } = Array.isArray(payPriceCalculations)
    ? payPriceCalculations[0]?.priceCalculation?.hostResume
    : {};

  // hooks
  const { typography } = useTheme();
  const showSnackbar = useSnackbar();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const checkinDate = new Date(checkin);
  const checkoutDate = new Date(checkout);
  const fechaActual = new Date();

  const estadoResult = estadoColorReserva(bookStatus?.code, checkin, checkout) as EstadoReserva;

  // api
  const { mutate: ApproveDeclineReservation } = useCustomMutationByUrl('put');
  const { mutate: sendMessage } = usePost2(`Messaging/Conversations/${conversationId}/Messages`);
  const { mutate: ComplaintCreate } = usePost(`Complaint/Create`);
  const { data: GetHostBookCancellation } = useGet(
    'GetHostBookCancellation',
    `/Parametrics/ReasonRefusedFirstStep`
  );
  const { data: GetComplaintReasonsAsTree } = useGet(
    'GetComplaintReasonsAsTree',
    `/Parametrics/GetComplaintReasonsAsTree`
  );
  // const { mutate: ApproveConsulting } = usePut(`/Host/Booking/Consulting/${conversation?.priceCalculation?.priceCalculation?.priceCalculationId}/Approve`);
  const { data: ParametricsReasonRefused } = useGet<any>(
    'ParametricsReasonRefused',
    '/Parametrics/ReasonRefusedFirstStep'
  );

  const { data: GetProfileByUserIdMessage } = useGet<any>(
    'GetProfileByUserIdMessage',
    `/GetProfileByUserId/${userId == userIdOneNavigation?.userId ? userIdTwoNavigation?.userId : userIdOneNavigation?.userId}`
  );

  // functions
  const handleAccept = () => {
    pushToDataLayer('confirm_booking');
    const url = `/Host/Booking/${bookId}/Approve`;
    ApproveDeclineReservation(
      { url },
      {
        onSuccess: (response) => {
          const { resultError, statusCode } = response;
          if (statusCode == '200') {
            showSnackbar(t('hostMessagePanel.messages.reservationAccepted'), 'success');
            setStatusAproved('FINISH_APROVED');
          } else {
            setStatusAproved(null);
            showSnackbar(resultError?.message, 'error');
          }
        },
        onError: (error: any) => showSnackbar(error?.message, 'error'),
      }
    );
  };

  const handleAcceptReservation = async () => {
    // verificar que huesped no tenga denuncias previas
    const consult = await RestClient.get(`Complaint/Count/${userIdOneNavigation?.userId}`);

    if (consult.data?.statusCode == '200') {
      const complaints = consult.data?.data?.complaintsCount;
      if (complaints > 10) {
        // Mostrar modal de advertencia
        setComplaintsSummary(complaints);
        setShowComplaintWarning(true);
      } else {
        // alert('no complaints found');
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

  /* const handlAceptConsult = () => {
    if (conversation?.priceCalculation?.priceCalculation?.priceCalculationId) {
      ApproveConsulting({}, {
        onSuccess: (response) => {
          const { resultError, statusCode } = response;
          if (statusCode == '200') {
            storeReservation('PENDING');
            showSnackbar('La consulta ha sido aceptada.', 'success');
          }
          else showSnackbar(resultError?.message, 'error');
        },
        onError: (error: any) => showSnackbar(error?.message, 'error')
      });
    } else {
      showSnackbar('No se pudo aprobar la consulta, intente nuevamente.', 'error');
    }
  } */
  const handleDeclineConsult = () => {
            const url = `/Host/Booking/${bookId}/Refuse`;

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
                    showSnackbar(t('hostMessagePanel.messages.reservationRefused'), 'success');
                    setStatusAproved('FINISH_REJECTED');
                  } else {
                    setStatusAproved(null);
                    showSnackbar(resultError?.message, 'error');
                  }
                },
                onError: (error: any) => showSnackbar(error?.message, 'error'),
              }
            );
  }

  const handleSendMessage = () => {
    sendMessage(
      {
        bookId: bookId,
        messageTypeId: 1,
        body: message,
      },
      {
        onSuccess: (response) => {
          const { resultError, statusCode } = response;
          if (statusCode == '200') {
            reCalled();
            setMessage('');
            const url = `/Host/Booking/${bookId}/Refuse`;

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
                    showSnackbar(t('hostMessagePanel.messages.reservationRefused'), 'success');
                    setStatusAproved('FINISH_REJECTED');
                  } else {
                    setStatusAproved(null);
                    showSnackbar(resultError?.message, 'error');
                  }
                },
                onError: (error: any) => showSnackbar(error?.message, 'error'),
              }
            );
          } else {
            showSnackbar(resultError?.message, 'error');
          }
        },
        onError: (error: any) => {
          showSnackbar(error?.message || t('hostMessagePanel.messages.sendError'), 'error');
        },
      }
    );
  };

  const handleComplaint = () => {
    setOpenComplaint(true);
  };

  // const handleCancelRented = async () => {
  //   setSeeViewCancelRented(true);
  //   const parametricFirstStep = await RestClient.get(
  //     'Parametrics/GetHostCancellationReasonFirstStep'
  //   );
  //   if (parametricFirstStep?.data?.statusCode == '200') {
  //     setDataParametricCancelRented(parametricFirstStep?.data?.data ?? []);
  //   }
  // };

  const handleNextStepCancelRented = async (cancelId: number) => {
    setIsLoadingCancelNextStep(true);
    try {
      const parametricNextStep = await RestClient.get(
        `Parametrics/GetHostCancellationReasonNextStep?cancellationReasonOwnerId=${cancelId}&bookingId=${bookId}`
      );
      if (parametricNextStep?.data?.statusCode == '200') {
        const nextData = parametricNextStep?.data?.data ?? [];
        const endStepItem = nextData.find((item: any) => item?.isEndStep === true);
        if (nextData.length === 0) {
          setIsCancelLastStep(true);
        } else if (endStepItem) {
          setCancelEndStepData(endStepItem);
          setCancelGuestMessage('');
        } else {
          setDataParametricCancelRented(nextData);
          setSelectedCancelReasonId(null);
          setIsCancelLastStep(false);
          setCancelEndStepData(null);
        }
      }
    } finally {
      setIsLoadingCancelNextStep(false);
    }
  };

  useEffect(() => {
    if (convId != conversationId) {
      setConvId(conversationId);
      setStatusAproved(null);
      setNavigationHistory([]);
      setCancelement(null);
      setSeeViewCancelRented(false);
      setDataParametricCancelRented([]);
      setSelectedCancelReasonId(null);
      setIsCancelLastStep(false);
      setCancelDescription('');
      setCancelEndStepData(null);
      setCancelGuestMessage('');
    }
  }, [conversationId, setStatusAproved]);

  useEffect(() => {
    if (GetHostBookCancellation?.data) {
      setCancellationToShow(GetHostBookCancellation?.data);
      setNavigationHistory([]);
      setCancelement(null);
    }
  }, [GetHostBookCancellation]);

  useEffect(() => {
    if (bookingData?.sidebarData?.responseCode == 'M21') {
      (async () => {
        const consult = await RestClient.get(`/Penalty/GetByBookId/${bookId}`);
        if (consult.data?.statusCode == '200') {      
          setPenality(consult.data?.data);      
        }
      })();
    }
  }, []);

  const guestFirstName =
    userId == userIdOneNavigation?.userId
      ? (userIdTwoNavigation?.name ?? '')
      : (userIdOneNavigation?.name ?? '');

  const isCompletedPhase1 =
    bookStatus?.code == 'completed' && checkoutDate.toDateString() == fechaActual.toDateString();
  const isCompletedPhase2 =
    bookStatus?.code == 'completed' &&
    !isCompletedPhase1 &&
    fechaActual.getTime() - checkoutDate.getTime() < 24 * 60 * 60 * 1000;

  const statusTitle: string = (() => {
    switch (bookStatus?.code) {
      case 'prebook':
        return 'Tienes una nueva solicitud';
      case 'approved':
        return 'Aceptaste la solicitud';
      case 'rented':
        if (fechaActual <= checkinDate) return 'Pago confirmado';
        if (checkinDate <= fechaActual && checkoutDate >= fechaActual)
          return `${guestFirstName} está hospedado/a`;
        return 'Pago confirmado';
      case 'canceled':
        return 'El huésped canceló la solicitud';
      case 'non_approved':
        return 'Rechazaste la solicitud';
      case 'completed':
        if (isCompletedPhase1) return `${guestFirstName} se retira hoy`;
        if (isCompletedPhase2) return 'Tu pago está en camino';
        return 'Pago enviado a tu cuenta';
      case 're_expired':
        return 'No respondiste a tiempo';
      case 'canceled_payed':
        return 'Cancelaste la reserva';
      case 'canceled_assert':
        return 'Cancelación por soporte';
      case 'review':
        return 'Soporte está revisando la cancelación';
      case 'book_expired':
        return 'El huésped no completó el pago';
      case 'closed':
        return 'Cerrada por Administración';
      default:
        return '';
    }
  })();

  const statusDescription: string = (() => {
    switch (bookStatus?.code) {
      case 'prebook':
        return 'Responde dentro de 12 horas para no afectar tu índice de respuesta.';
      case 'approved':
        return 'El huésped está completando el pago para confirmar la reserva.';
      case 'rented':
        if (fechaActual <= checkinDate)
          return `La reserva está confirmada. El check-in será el ${formatDateCheckIn(checkin)}.`;
        if (checkinDate <= fechaActual && checkoutDate >= fechaActual)
          return 'La estadía está en curso. Mantente disponible para cualquier asistencia.';
        return `La reserva está confirmada. El check-in será el ${formatDateCheckIn(checkin)}.`;
      case 'canceled':
        return 'Esta solicitud ya no está activa y no requiere respuesta.';
      case 'non_approved':
        return 'El huésped fue notificado y ya no podrá continuar con esta reserva.';
      case 'completed':
        if (isCompletedPhase1) return 'Puedes dejar una reseña. El pago se liberará en 24 horas.';
        if (isCompletedPhase2)
          return 'El monto neto se reflejará en tu cuenta en menos de 24 horas.';
        return 'El monto ya fue transferido. Verifícalo en tu cuenta bancaria.';
      case 're_expired':
        return 'La solicitud expiró y ya no requiere respuesta.';
      case 'canceled_payed':
        return 'La reserva fue cancelada y se aplicará una tarifa de cancelación según la política de JOM.';
      case 'canceled_assert':
        return 'La reserva fue cancelada con/sin tarifa de cancelación, caso revisado por soporte.';
      case 'review':
        return 'Estamos revisando el motivo de cancelación para definir si corresponde aplicar una tarifa de cancelación.';
      case 'book_expired':
        return 'La solicitud aprobada expiró porque el huésped no pagó a tiempo.';
      case 'closed':
        return 'Este estado está cerrado por administración.';
      default:
        return '';
    }
  })();

  const handleSeeOptions = () => {
    const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 6);
    const dataBook = conversation?.priceCalculation?.priceCalculation;
    const dataListing = bookingData?.listingRent?.property ?? {};

    const checkIn = dataBook
      ? formatDate(new Date(dataBook?.initBook), false)
      : formatDate(today, false);
    const checkOut = dataBook
      ? formatDate(new Date(dataBook?.endBook), false)
      : formatDate(sevenDaysLater, false);

    const params = new URLSearchParams();
    params.set('checkIn', checkIn.toString());
    params.set('checkOut', checkOut.toString());
    dataListing?.latitude && params.set('Latitude', dataListing.latitude.toString());
    dataListing?.longitude && params.set('Longitude', dataListing.longitude.toString());

    params.set('Street', dataListing?.address?.address1?.toString() ?? '');
    params.set('City', dataListing?.cityName?.toString() ?? '');
    params.set('County', dataListing?.countyName?.toString() ?? '');
    params.set('State', dataListing?.stateName?.toString() ?? '');
    params.set('Country', dataListing?.countryName?.toString() ?? '');
    conversation?.booking?.gests > 0 && params.set('guests', conversation?.booking?.gests?.toString());
    conversation?.booking?.adultCount > 0 && params.set('adtCount', conversation?.booking?.adultCount?.toString());
    conversation?.booking?.childCount > 0 && params.set('chdCount', conversation?.booking?.childCount?.toString());
    conversation?.booking?.infantCount > 0 && params.set('infCount', conversation?.booking?.infantCount?.toString());
    conversation?.booking?.petCount > 0 && params.set('petsCount', conversation?.booking?.petCount?.toString());

    navigate(`/search-results?${params.toString()}`);
  };

  return (
    <>
      {conversation && (
        <React.Fragment>
          <Card
            sx={{
              pt: 0,
              px: { xs: 1.5, sm: 2, md: 4, lg: 5 },
              boxShadow: 0,
              bgcolor: 'transparent',
              overflowY: 'hidden',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* {bookStatus?.code == 'approved' && statusAproved != 'SEE_GUESTS' && (
              <React.Fragment>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                    gap: { xs: 1, sm: 0 },
                  }}
                >
                  <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 'auto' } }}>
                    <Typography
                      variant="small1Medium"
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                    >
                      {t('hostMessagePanel.status.acceptedLabel')}
                    </Typography>
                    <Typography
                      variant="small1Medium"
                      component="div"
                      sx={{ fontWeight: 'bold', fontSize: { xs: '0.9rem', sm: '0.95rem' } }}
                    >
                      {userIdOneNavigation?.name ?? ''} {userIdOneNavigation?.lastName ?? ''}
                    </Typography>
                  </Box>
                  <Avatar
                    alt={userIdOneNavigation?.name ?? 'Anfitrion'}
                    src={userIdOneNavigation?.photoLink?.replace(
                      'https://localhost:44317/',
                      'https://assert-dev.runasp.net/'
                    )}
                    sx={{
                      width: { xs: 50, sm: 60 },
                      height: { xs: 50, sm: 60 },
                      cursor: 'pointer',
                    }}
                    onClick={() => setOpenProfileModal(true)}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '4px',
                      transformOrigin: 'left',
                      transform: 'scaleX(0.5)',
                    }}
                  />
                </Box>
                <Divider sx={{ my: 2, bgcolor: '#e0e0e0' }} />
              </React.Fragment>
            )} */}

            {(statusAproved == null ||
              statusAproved == 'FINISH_APROVED' ||
              statusAproved == 'ACCEPTED' ||
              statusAproved == 'FINISH_REJECTED') && (
              <React.Fragment>
                {/* <Typography
                  variant="small1Medium"
                  color="text.secondary"
                  sx={{ mb: 1, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                  component="div"
                >
                  {bookStatus?.code == 'non_approved'
                    ? t('hostMessagePanel.status.consultRefused')
                    : bookStatus?.code == 'rented'
                      ? t('hostMessagePanel.status.inProgress')
                      : '\u00A0'}
                </Typography> */}
                <Box
                  sx={{
                    minHeight: 80,
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0,
                    mx: { xs: -1.5, sm: -2, md: -4, lg: -5 },
                    px: { xs: 1.5, sm: 2, md: 4, lg: 5 },
                    borderBottom: '1px solid #e0e0e0',
                  }}
                >
                  {onCloseMobile && (
                    <IconButton
                      onClick={onCloseMobile}
                      edge="start"
                      sx={{ color: 'gray', mr: 0.5, display: { xs: 'flex', md: 'none' } }}
                    >
                      <ArrowBackIos />
                    </IconButton>
                  )}
                  <Typography
                    component="div"
                    noWrap
                    sx={{
                      fontWeight: 'bold',
                      fontSize: { xs: '16px', md: '16px', lg: '20px' },
                    }}
                  >
                    Detalle
                  </Typography>
                </Box>
              </React.Fragment>
            )}

            <Box
              sx={{
                flexGrow: 1,
                overflowY: 'auto',
                mx: { xs: -1.5, sm: -2, md: -5 },
                px: { xs: 1.5, sm: 2, md: 5 },
                pb: 2,
                pt: 2,
              }}
            >
              {seeViewCancelRented ? (
                <Box sx={{ color: '#222222' }}>
                  <IconButton
                    sx={{ bgcolor: '#f5f5f5', mb: 3, '&:hover': { bgcolor: '#e0e0e0' } }}
                    onClick={() => {
                      if (cancelEndStepData) {
                        setCancelEndStepData(null);
                        setCancelGuestMessage('');
                      } else if (isCancelLastStep) {
                        setIsCancelLastStep(false);
                      } else {
                        setSeeViewCancelRented(false);
                        setDataParametricCancelRented([]);
                        setSelectedCancelReasonId(null);
                        setCancelDescription('');
                      }
                    }}
                  >
                    <ArrowBackIos sx={{ fontSize: 16 }} />
                  </IconButton>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                    Cancelar les afecta tanto a ti como a tu huésped
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 4, color: '#484848' }}>
                    Si cancelas, {guestFirstName} tendrá que buscar otro alojamiento y tu calendario
                    quedará bloqueado durante esas fechas.
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    ¿Por qué no puedes hospedar a {guestFirstName}?
                  </Typography>

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
                      <Typography variant="body2" sx={{ color: '#484848', mb: 2 }}>
                        Esta información es privada y nos ayuda a mejorar la experiencia en la
                        plataforma.
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={5}
                        placeholder="Explica con detalle el motivo por el cual estás cancelando esta reserva..."
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
                      {dataParametricCancelRented.map((item: any) => (
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
                              sx={{
                                mr: 1,
                                color: '#9CA3AF',
                                '&.Mui-checked': { color: '#5B55C8' },
                              }}
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

                  <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                    <Button
                      variant="secondary"
                      sx={{
                        textTransform: 'none',
                        borderRadius: 3,
                        px: 3,
                        py: 1.2,
                        borderColor: '#9e9e9e',
                        color: '#474747',
                        fontWeight: 500,
                        '&:hover': { borderColor: '#757575', bgcolor: 'transparent' },
                      }}
                      onClick={() => {
                        setSeeViewCancelRented(false);
                        setDataParametricCancelRented([]);
                        setSelectedCancelReasonId(null);
                        setIsCancelLastStep(false);
                        setCancelEndStepData(null);
                        setCancelGuestMessage('');
                        setCancelDescription('');
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
                      sx={{
                        textTransform: 'none',
                        px: 3,
                        py: 1.2,
                        bgcolor: '#5c52a3',
                        fontWeight: 500,
                        '&:hover': { bgcolor: '#4a418a' },
                        '&.Mui-disabled': { bgcolor: '#e0e0e0', color: '#9e9e9e' },
                      }}
                      startIcon={
                        isLoadingCancelNextStep || isLoadingCancelConfirm ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : undefined
                      }
                      onClick={async () => {
                        if (cancelEndStepData) {
                          setIsLoadingCancelConfirm(true);
                          try {
                            const url = `/Host/Booking/${bookId}/UpsertHostBookCancellation`;
                            ApproveDeclineReservation(
                              {
                                url,
                                data: {
                                  bookId: bookId,
                                  cancellationReasonId: selectedCancelReasonId,
                                  message: cancelGuestMessage,
                                },
                              },
                              {
                                onSuccess: (response: any) => {
                                  const { resultError, statusCode } = response;
                                  if (statusCode == '200') {
                                    setSeeViewCancelRented(false);
                                    setCancelEndStepData(null);
                                    setCancelGuestMessage('');
                                    setSelectedCancelReasonId(null);
                                    setDataParametricCancelRented([]);
                                    reCalled();
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
                        } else if (selectedCancelReasonId) {
                          handleNextStepCancelRented(selectedCancelReasonId);
                        }
                      }}
                    >
                      {cancelEndStepData || isCancelLastStep ? 'Enviar' : 'Siguiente'}
                    </Button>
                  </Stack>
                </Box>
              ) : (
                <>
                  {estadoResult.code != 'desconocido' &&
                    (() => {
                      const IconComponent = estadoResult.icon;
                      return (
                        <Chip
                          icon={
                            IconComponent ? (
                              <IconComponent color={estadoResult.iconColor} />
                            ) : undefined
                          }
                          label={
                            <Stack
                              direction={'row'}
                              gap={'5px'}
                              sx={{ fontSize: '12px', color: estadoResult.color }}
                            >
                              {' '}
                              <Typography
                                fontWeight={'bold'}
                                fontSize={'12px'}
                                sx={{ color: estadoResult.color }}
                              >
                                {' '}
                                {estadoResult.title}
                              </Typography>{' '}
                              {' - '} {estadoResult.estado}
                            </Stack>
                          }
                          style={{
                            width: '15em',
                            backgroundColor: estadoResult.bg,
                            marginBottom: '10px',
                          }}
                        />
                      );
                    })()}

                  {stateReservation == 'REFUSED' && (
                    <Typography variant="paragraph1Medium">
                      {t('hostMessagePanel.status.youRefused')}
                    </Typography>
                  )}
                  {(statusAproved == null ||
                    statusAproved == 'FINISH_APROVED' ||
                    statusAproved == 'FINISH_REJECTED') && (
                    <React.Fragment>
                      <Typography
                        color="textPrimary"
                        sx={{
                          m: '16px 0',
                          fontSize: { xs: '0.9rem', sm: '1.2rem' },
                          fontWeight: 600,
                        }}
                      >
                        {/* {statusTitle} */}
                        {/* {estadoResult.titleHost} */}
                        {bookingData?.sidebarData?.tituloLateral ?? ""}
                      </Typography>
                      <Box
                        sx={{
                          border: '1px solid #e0e0e0',
                          borderRadius: '16px',
                          p: 2,
                          mb: 3,
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 2,
                        }}
                      >
                        <Avatar
                          alt={
                            userId == userIdOneNavigation?.userId
                              ? userIdTwoNavigation?.name
                              : (userIdOneNavigation?.name ?? 'Usuario')
                          }
                          src={
                            userId == userIdOneNavigation?.userId
                              ? userIdTwoNavigation?.photoLink?.replace(
                                  'https://localhost:44317/',
                                  'https://assert-dev.runasp.net/'
                                )
                              : userIdOneNavigation?.photoLink?.replace(
                                  'https://localhost:44317/',
                                  'https://assert-dev.runasp.net/'
                                )
                          }
                          sx={{ width: 64, height: 64 }}
                        />
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.5,
                            overflow: 'hidden',
                            wordBreak: 'break-word',
                          }}
                        >
                          <Typography
                            variant="small1Medium"
                            sx={{
                              fontWeight: 600,
                              color: '#000',
                              fontSize: { xs: '0.9rem', sm: '0.95rem' },
                            }}
                          >
                            {userId == userIdOneNavigation?.userId
                              ? userIdTwoNavigation?.name
                              : (userIdOneNavigation?.name ?? '')}{' '}
                            {userId == userIdOneNavigation?.userId
                              ? userIdTwoNavigation?.lastName
                              : (userIdOneNavigation?.lastName ?? '')}
                          </Typography>
                          <Typography
                            variant="small1Regular"
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                          >
                            {listingRent?.name ?? ''}
                          </Typography>
                          <Typography
                            variant="small1Regular"
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                          >
                            {priceCalculation?.priceCalculation?.calculationDetails ?? ''}
                          </Typography>
                          <Typography
                            variant="small1Medium"
                            sx={{
                              fontWeight: 500,
                              color: '#000',
                              fontSize: { xs: '0.85rem', sm: '0.9rem' },
                              mt: 0.5,
                            }}
                          >
                            {`Huéspedes: ${booking?.adultCount || 0} ${booking?.adultCount === 1 ? 'Adulto' : 'Adultos'}, 
                          ${booking?.childCount || 0} ${booking?.childCount === 1 ? 'Niño' : 'Niños'}, 
                          ${booking?.infantCount || 0} ${booking?.infantCount === 1 ? 'Bebé' : 'Bebés'}, 
                          ${booking?.petCount || 0} ${booking?.petCount === 1 ? 'Mascota' : 'Mascotas'}`}
                            {' - '}
                            {formatSemicolon(amountToCollect)} {currencyPay}
                          </Typography>
                        </Box>
                      </Box>
                      {/* {statusDescription && ( */}
                      {estadoResult.code != 'desconocido' && (
                        <Box
                          sx={{
                            bgcolor: '#f8f8f8',
                            borderRadius: '12px',
                            p: { xs: 1.5, sm: 2 },
                            mb: 2,
                          }}
                        >
                          <Typography
                            variant="small1Regular"
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.82rem', sm: '0.875rem' }, lineHeight: 1.6 }}
                          >
                            {/* <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
                              {statusTitle}:{' '}
                              {estadoResult.titleHost}: { ' '}
                            </Box> */}
                            {/* {estadoResult.msgHost} */}
                            {bookingData?.sidebarData?.mensajeLateral ?? ""}
                          </Typography>
                        </Box>
                      )}
                    </React.Fragment>
                  )}
                  {statusAproved != 'ACCEPTED' && statusAproved != 'REJECTED' && (
                    <Divider sx={{ my: 2, bgcolor: '#e0e0e0' }} />
                  )}
                  {/*         
                  {
                    (bookStatus == undefined && statusAproved == null) && <React.Fragment>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                          mb: 3,
                        }}
                      >
                        <Button variant="outlined" sx={{ borderColor: "#1a1a1a", fontFamily: typography.paragraph1Medium, textTransform: "none", p: 1.5 }} onClick={handlAceptConsult}>
                          Aceptar Consulta
                        </Button>
                        <Button variant="outlined" sx={{ borderColor: "#1a1a1a", fontFamily: typography.paragraph1Medium, textTransform: "none", p: 1.5 }} onClick={() => setStatusAproved('REJECTED_CONSULT')}>
                          Rechazar Consulta
                        </Button>
                      </Box>
                    </React.Fragment>
                  } 
               */}
                  {statusAproved == null && bookStatus?.code == 'prebook' && (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: { xs: 1.5, sm: 2 },
                        mb: { xs: 2, sm: 3 },
                      }}
                    >
                      <Typography
                        variant="small1Regular"
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                      >
                        Acciones posibles sobre esta solicitud pendiente.
                      </Typography>
                      <Button
                        variant="primary"
                        sx={{
                          bgcolor: '#6358DC',
                          color: '#fff',
                          borderRadius: '15px',
                          fontFamily: typography.paragraph1Medium,
                          textTransform: 'none',
                          p: { xs: 1.2, sm: 1.5 },
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          '&:hover': {
                            bgcolor: '#5248CC',
                          },
                        }}
                        onClick={() => setStatusAproved('ACCEPTED')}
                      >
                        {t('hostMessagePanel.actions.accept')}
                      </Button>
                      <Button
                        variant="outlined"
                        sx={{
                          // borderColor: '#1a1a1a',
                          // color: '#1a1a1a',
                          // borderRadius: '15px',
                          // fontFamily: typography.paragraph1Medium,
                          // textTransform: 'none',
                          // p: { xs: 1.2, sm: 1.5 },
                          // fontSize: { xs: '0.875rem', sm: '1rem' },
                          borderColor: '#9b9b9b',
                          color: '#474747',
                          borderRadius: '12px',
                          fontFamily: typography.paragraph1Medium,
                          textTransform: 'none',
                          p: { xs: 1.2, sm: 1.5 },
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          fontWeight: 500,
                        }}
                        onClick={() => setStatusAproved('REJECTED')}
                      >
                        {t('hostMessagePanel.actions.decline')}
                      </Button>
                    </Box>
                  )}
                  {/* Botón de Ver reservación / Cancelar solicitud */}
                  {bookingData && estadoResult?.code != 'pendiente' && (
                      <Box sx={{ mb: 2 }}>
                        <Button
                          variant="primary"
                          fullWidth
                        sx={{
                          bgcolor: '#6358DC',
                          color: '#fff',
                          borderRadius: '15px',
                          fontFamily: typography.paragraph1Medium,
                          textTransform: 'none',
                          p: { xs: 1.2, sm: 1.5 },
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          '&:hover': {
                            bgcolor: '#5248CC',
                          },
                        }}                          
                          onClick={() => {
                            setViewReservation(bookingData);
                            if (!isHostAuthenticated) {
                              changeRole('host');
                              navigate('/host');
                            }
                          }}
                        >
                          Ver reserva
                        </Button>
                      </Box>
                    )}
                    {/* {estadoResult?.code != 'pendiente' && isGuestAuthenticated && (
                <Button
                  variant="primary"
                  fullWidth
                        sx={{
                          bgcolor: '#6358DC',
                          color: '#fff',
                          borderRadius: '15px',
                          fontFamily: typography.paragraph1Medium,
                          textTransform: 'none',
                          p: { xs: 1.2, sm: 1.5 },
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          '&:hover': {
                            bgcolor: '#5248CC',
                          },
                        }}
                  onClick={handleSeeOptions}
                >
                  {t('detailPanelGuest.buttons.seeOptions')}
                </Button>                    
                )} */}
                  {/* : (
                    bookStatus?.code &&
                    onViewReservation &&
                    bookStatus.code !== 'prebook' &&
                    !['canceled', 're_expired', 'book_expired', 'canceled_payed'].includes(
                      bookStatus.code
                    ) && (
                      <Box sx={{ mb: 2 }}>
                        <Button
                          variant="secondary"
                          fullWidth
                          sx={{
                            borderColor: '#9e9e9e',
                            color: theme.palette.text.secondary,
                          }}
                          onClick={() => onViewReservation(bookingData)}
                        >
                          Ver reservación
                        </Button>
                      </Box>
                    )
                  )} */}

                  <React.Fragment>
                    {(statusAproved == null ||
                      statusAproved == 'FINISH_APROVED' ||
                      statusAproved == 'FINISH_REJECTED') && (
                      <Box sx={{ my: { xs: 2, sm: 3 } }}>
                        <Box sx={{ mb: 3 }}>
                          <Typography
                            sx={{
                              fontSize: { xs: '0.9rem', sm: '1rem' },
                              fontWeight: 600,
                              color: '#000',
                              mb: 3,
                            }}
                          >
                            {t('hostMessagePanel.about.title')}{' '}
                            {userId == userIdOneNavigation?.userId
                              ? userIdTwoNavigation?.name
                              : (userIdOneNavigation?.name ?? ' ')}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'flex-start' }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              bgcolor: '#f5f5f5',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <StarBorderOutlinedIcon />
                          </Box>
                          <Box>
                            <Typography
                              variant="small1Medium"
                              sx={{ fontWeight: 600, color: '#000' }}
                            >
                              {GetProfileByUserIdMessage?.data?.guestReviewCalification ?? 0}{' '}
                              {t('hostMessagePanel.about.ratingLabel', 'de valoración')}
                            </Typography>
                            <Typography variant="small1Regular" color="text.secondary">
                              {t('hostMessagePanel.about.basedOn', ' Basado en')}{' '}
                              {GetProfileByUserIdMessage?.data?.guestReviews.length ?? 0}{' '}
                              {t('hostMessagePanel.about.reviews', 'reseñas')}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'flex-start' }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              bgcolor: '#f5f5f5',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <VerifiedUserOutlinedIcon />
                          </Box>
                          <Box>
                            <Typography
                              variant="small1Medium"
                              sx={{ fontWeight: 600, color: '#000' }}
                            >
                              {t('hostMessagePanel.about.identityVerified')}
                            </Typography>
                            <Typography variant="small1Regular" color="text.secondary">
                              {GetProfileByUserIdMessage?.data?.isDocumentVerified
                                ? t(
                                    'hostMessagePanel.about.documentValidated',
                                    ' Documento validado'
                                  )
                                : t(
                                    'hostMessagePanel.about.documentNotValidated',
                                    ' Documento no validado'
                                  )}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'flex-start' }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              bgcolor: '#f5f5f5',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <LocationOnOutlinedIcon />
                          </Box>
                          <Box>
                            {GetProfileByUserIdMessage?.data?.department ||
                              (GetProfileByUserIdMessage?.data?.country && (
                                <Typography
                                  variant="small1Medium"
                                  sx={{ fontWeight: 600, color: '#000' }}
                                >
                                  {t('hostMessagePanel.about.livesInPrefix', ' Vive en')}{' '}
                                  {GetProfileByUserIdMessage?.data?.department ?? ''} ,{' '}
                                  {GetProfileByUserIdMessage?.data?.country ?? ''}
                                </Typography>
                              ))}
                              {GetProfileByUserIdMessage?.data?.timeInAssert && (
                            <Typography variant="small1Regular" color="text.secondary">
                              {t('hostMessagePanel.about.timeInAssert', ' Se unio hace') +
                                ' ' +
                                GetProfileByUserIdMessage?.data?.timeInAssert}
                            </Typography>
                            )}
                          </Box>
                        </Box>
                        {GetProfileByUserIdMessage?.data?.languages?.length > 0 && (
                          <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'flex-start' }}>
                            <Box sx={{ width: 40, height: 40, flexShrink: 0 }} />
                            <Typography
                              variant="small1Regular"
                              sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}
                            >
                              {GetProfileByUserIdMessage?.data?.languages?.length > 0
                                ? `${t('hostMessagePanel.about.speaks')} ${GetProfileByUserIdMessage?.data?.languages?.join(', ')}`
                                : ''}
                            </Typography>
                          </Box>
                        )}
                        <Link
                          to={`/host/show-profile-guest/${userId == userIdOneNavigation?.userId ? userIdTwoNavigation?.userId : userIdOneNavigation?.userId}/${listingRent?.listingRentId}`}
                          target="_blank"
                          style={{ textDecoration: 'none', color: '#6358DC' }}
                        >
                          <Typography
                            variant="small1Medium"
                            component="div"
                            sx={{
                              color: '#6358DC',
                              cursor: 'pointer',
                              fontSize: { xs: '0.9rem', sm: '1rem' },
                              fontWeight: 500,
                              mt: GetProfileByUserIdMessage?.data?.languages?.length > 0 ? 0 : -1,
                            }}
                          >
                            {t('hostMessagePanel.about.showProfile', 'Mostrar el perfil completo')}
                          </Typography>
                        </Link>
                      </Box>
                    )}

                    {/* {bookStatus?.code == 'approved' && statusAproved != 'SEE_GUESTS' && (
                      <React.Fragment>
                        <Divider sx={{ my: 2, bgcolor: '#e0e0e0' }} />
                        <Box sx={{ mt: 3 }}>
                          <Typography variant="paragraph1Medium" sx={{ mb: 1 }} component="div">
                            {t('hostMessagePanel.status.acceptedRequest')}{' '}
                            {userIdOneNavigation?.name ?? ''}
                          </Typography>
                          <Typography variant="small1Regular" sx={{ mb: 1 }}>
                            {t('hostMessagePanel.status.datesAvailableWarning')}
                          </Typography>
                        </Box>
                      </React.Fragment>
                    )} */}
                    {(statusAproved == null ||
                      statusAproved == 'FINISH_APROVED' ||
                      statusAproved == 'FINISH_REJECTED') && (
                      <React.Fragment>
                        <Divider sx={{ my: 2, bgcolor: '#e0e0e0' }} />

                        {/* Sección de detalles de la reservación */}
                        <Box sx={{ mt: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
                          <Typography
                            variant="paragraph1Medium"
                            sx={{
                              fontSize: { xs: '1.1rem', sm: '1.25rem' },
                              fontWeight: 600,
                              color: '#000',
                              mb: 3,
                            }}
                          >
                            {t('hostMessagePanel.details.title')}
                          </Typography>

                          <Box sx={{ mb: 2, mt: 2 }}>
                            <Typography
                              variant="small1Medium"
                              sx={{
                                fontWeight: 600,
                                color: '#000',
                                fontSize: { xs: '0.9rem', sm: '1rem' },
                              }}
                              component="div"
                            >
                              {t('hostMessagePanel.details.guests')}
                            </Typography>
                            <Typography
                              variant="small1Regular"
                              color="text.secondary"
                              sx={{
                                // cursor: 'pointer',
                                fontSize: { xs: '0.85rem', sm: '0.9rem' },
                              }}
                              component="div"
                              // onClick={() => setStatusAproved('SEE_GUESTS')}
                            >
                              {/* {data.huespedes.replace('huesped', 'adulto')} */}
                              {/* {booking?.gests ?? 1} adulto {booking?.gests > 1 ? 's' : ''} */}
                              {`${booking?.adultCount || 0} ${booking?.adultCount === 1 ? 'Adulto' : 'Adultos'}, 
                          ${booking?.childCount || 0} ${booking?.childCount === 1 ? 'Niño' : 'Niños'}, 
                          ${booking?.infantCount || 0} ${booking?.infantCount === 1 ? 'Bebé' : 'Bebés'}, 
                          ${booking?.petCount || 0} ${booking?.petCount === 1 ? 'Mascota' : 'Mascotas'}`}
                            </Typography>
                          </Box>

                          <Box sx={{ mb: 2 }}>
                            <Typography
                              variant="small1Medium"
                              sx={{
                                fontWeight: 600,
                                color: '#000',
                                fontSize: { xs: '0.9rem', sm: '1rem' },
                              }}
                              component="div"
                            >
                              {t('hostMessagePanel.details.checkin')}
                            </Typography>
                            <Typography
                              variant="small1Regular"
                              color="text.secondary"
                              sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' } }}
                              component="div"
                            >
                              {formatDateCheckIn(booking?.checkin, true) ?? ''}
                            </Typography>
                          </Box>

                          <Box sx={{ mb: 3 }}>
                            <Typography
                              variant="small1Medium"
                              sx={{
                                fontWeight: 600,
                                color: '#000',
                                fontSize: { xs: '0.9rem', sm: '1rem' },
                              }}
                              component="div"
                            >
                              {t('hostMessagePanel.details.checkout')}
                            </Typography>
                            <Typography
                              variant="small1Regular"
                              color="text.secondary"
                              sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' } }}
                            >
                              {formatDateCheckIn(booking?.checkout, true) ?? ''}
                            </Typography>
                          </Box>

                          <Typography
                            variant="small1Medium"
                            component="div"
                            sx={{
                              color: '#6358DC',
                              cursor: 'pointer',
                              fontSize: { xs: '0.9rem', sm: '1rem' },
                              fontWeight: 500,
                            }}
                            onClick={() => {
                              if (!isHostAuthenticated) {
                                changeRole('host');
                              }
                              const property = encodeURIComponent(
                                String(bookingData?.listingRent?.listingRentId ?? '')
                              );
                              const name = encodeURIComponent(bookingData?.listingRent?.name ?? '');
                              window.location.href = `/host?property=${property}&name=${name}`;
                            }}
                          >
                            {t('hostMessagePanel.details.showCalendar')}
                          </Typography>
                        </Box>

                        <Divider sx={{ my: { xs: 1.5, sm: 2 }, bgcolor: '#e0e0e0' }} />

                        <Box sx={{ mt: { xs: 2, sm: 3 } }}>
                           {/* ini Ganancias potenciales */}
                          {['M19', 'M21', 'M23'].includes(bookingData?.sidebarData?.responseCode) ?
                           (<>
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
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="small1Medium">
                              {t('hostMessagePanel.accommodation.calculatedPenalty', 'Penalización calculado')}
                            </Typography>
                            <Typography
                              variant="small1Medium"
                              sx={{
                                fontWeight: 500,
                                color: '#000',
                                fontSize: { xs: '0.85rem', sm: '0.9rem' },
                              }}
                            >
                              {formatSemicolon(penality?.penaltyAmount??0)} {currencyPay}
                            </Typography>
                          </Box>    
                          <Divider
                            sx={{
                              my: 2,
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
                              {formatSemicolon(penality?.penaltyAmount??0)} {currencyPay}
                            </Typography>
                          </Box>

                           </>)
                          : (
                          <>
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
                              {['M25'].includes(bookingData?.sidebarData?.responseCode) ? t('hostMessagePanel.income.subTitle', 'Ingresos') : t('hostMessagePanel.income.title', 'Ingresos Potenciales')}
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
                                currency: currencyPay,
                                price: formatSemicolon(accommodation?.baseAmount),
                                nights: accommodation?.nightsCount,
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
                              {formatSemicolon(accommodation?.baseAmount)} {currencyPay}
                            </Typography>
                          </Box>

                          {CostComponentJom(
                            t(
                              'hostMessagePanel.accommodation.discountApplied',
                              'Descuento aplicado'
                            ),
                            accommodation?.appliedDiscount,
                            currencyPay
                          )}

                          {accommodation?.appliedDiscount > 0 && CostComponentJom(
                            t(
                              'hostMessagePanel.accommodation.discounted',
                              'Hospedaje con descuento'
                            ),
                            accommodation?.discountedAmount,
                            currencyPay
                          )}

                          {additionalCharges?.extraGuestFee > 0 ||
                            additionalCharges?.petFee > 0 ||
                            additionalCharges?.cleaningFee > 0 ||
                            (additionalCharges?.otherFees > 0 && (
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
                                  {t(
                                    'hostMessagePanel.additionalCharges.title',
                                    'Cargos adicionales'
                                  )}
                                </Typography>
                              </Box>
                            ))}

                          {CostComponentJom(
                            t(
                              'hostMessagePanel.additionalCharges.extraGuestFee',
                              'Huéspedes extra'
                            ),
                            additionalCharges?.extraGuestFee,
                            currencyPay
                          )}

                          {CostComponentJom(
                            t('hostMessagePanel.additionalCharges.petFee', 'Mascota'),
                            additionalCharges?.petFee,
                            currencyPay
                          )}

                          {CostComponentJom(
                            t('hostMessagePanel.additionalCharges.cleaningFee', 'Limpieza'),
                            additionalCharges?.cleaningFee,
                            currencyPay
                          )}

                          {CostComponentJom(
                            t('hostMessagePanel.additionalCharges.otherFees', 'Otros cargos'),
                            additionalCharges?.otherFees,
                            currencyPay
                          )}

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
                              {formatSemicolon(subtotalHost)} {currencyPay}
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
                              {t(
                                'hostMessagePanel.totalGenerated.comision',
                                'Comisión JOM anfitrión 5%'
                              )}
                            </Typography>
                            <Typography
                              variant="paragraph1Medium"
                              sx={{
                                fontWeight: 700,
                                color: '#000',
                                fontSize: { xs: '0.85rem', sm: '0.9rem' },
                              }}
                            >
                              {formatSemicolon(hostCommission)} {currencyPay}
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
                              {formatSemicolon(amountToCollect)} {currencyPay}
                            </Typography>
                          </Box>
                          </>)} 
                          {/* end Ganancias */}

                          <Divider sx={{ my: 4, bgcolor: '#e0e0e0' }} />

                          <Typography
                            variant="paragraph1Medium"
                            sx={{
                              mb: 2,
                              fontWeight: 600,
                              color: '#000',
                              fontSize: { xs: '1.1rem', sm: '1.25rem' },
                            }}
                          >
                            {t('hostMessagePanel.support.title')}
                          </Typography>

                          {/* Enlace Denunciar */}
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              cursor: 'pointer',
                              py: 1,
                            }}
                            onClick={handleComplaint}
                          >
                            <Typography
                              variant="small1Medium"
                              sx={{ fontWeight: 500, color: '#000' }}
                            >
                              {t('hostMessagePanel.support.reportUser')}
                            </Typography>
                            <ArrowForwardIosIcon
                              sx={{
                                fontSize: 'medium',
                                color: 'text.secondary',
                                backgroundColor: 'transparent',
                                width: '18px',
                                height: '18px',
                              }}
                            />
                          </Box>

                          {/* Enlace Centro de Ayuda */}
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              cursor: 'pointer',
                              py: 1,
                              mb: 4,
                            }}
                          >
                            <Link
                              to="/help-center"
                              target="_blank"
                              style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                              <Typography
                                variant="small1Medium"
                                sx={{ fontWeight: 500, color: '#000' }}
                              >
                                {t('hostMessagePanel.support.visitHelpCenter')}
                              </Typography>
                            </Link>
                            <ArrowForwardIosIcon
                              sx={{
                                fontSize: 'medium',
                                color: 'text.secondary',
                                backgroundColor: 'transparent',
                                width: '18px',
                                height: '18px',
                              }}
                            />
                          </Box>

                          {/* <Typography
                        variant="paragraph1Medium"
                        sx={{
                          fontWeight: 600,
                          color: '#00254A',
                          fontSize: { xs: '1.1rem', sm: '1.25rem' },
                          mb: 2,
                        }}
                      >
                        {t('hostMessagePanel.support.faqTitle')}
                      </Typography> */}

                          {/* Detalle de Pregunta Frecuente */}
                          {/* <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="small1Medium"
                          sx={{ fontWeight: 600, color: '#00254A', mb: 0.5 }}
                        >
                          {t('hostMessagePanel.support.rejectTitle')}
                        </Typography>
                        <Typography
                          variant="small1Regular"
                          color="text.secondary"
                          sx={{ lineHeight: 1.5 }}
                        >
                          {t('hostMessagePanel.support.rejectDesc')}
                        </Typography>
                      </Box>
                      <Typography
                        variant="small1Medium"
                        sx={{
                          color: '#6358DC',
                          cursor: 'pointer',
                          mb: 3,
                          fontWeight: 500,
                        }}
                      >
                        {t('hostMessagePanel.support.readMore', 'Mostrar más')}
                      </Typography> */}
                        </Box>
                      </React.Fragment>
                    )}
                  </React.Fragment>

                  {/*aprobar  */}
                  {statusAproved == 'ACCEPTED' && (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        pt: 1,
                        pb: 4,
                      }}
                    >
                      <Typography
                        variant="paragraph1Medium"
                        sx={{
                          fontSize: { xs: '1.25rem', sm: '1.5rem' },
                          fontWeight: 600,
                          color: '#000',
                          mb: 3,
                        }}
                      >
                        {t(
                          'hostMessagePanel.flows.acceptTitle',
                          '¿Quieres aprobar la solicitud de reserva?'
                        )}
                      </Typography>

                      <Typography
                        variant="small1Regular"
                        color="text.secondary"
                        sx={{ mb: 4, lineHeight: 1.5, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}
                      >
                        {t('hostMessagePanel.flows.acceptDesc')}
                      </Typography>

                      <Box
                        sx={{
                          border: '1px solid #E5E7EB',
                          borderRadius: '16px',
                          p: 2.5,
                          mb: 4,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.5,
                          bgcolor: '#F9FAFB',
                        }}
                      >
                        <Typography
                          variant="small1Medium"
                          sx={{
                            fontWeight: 600,
                            color: '#000',
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                          }}
                        >
                          {listingRent?.name ?? ''}
                        </Typography>
                        <Typography
                          variant="small1Regular"
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' } }}
                        >
                          {priceCalculation?.priceCalculation?.calculationDetails ?? ''}
                        </Typography>
                        <Typography
                          variant="small1Regular"
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' } }}
                        >
                          {booking?.gests ?? 0} {' huésped(s)'}
                        </Typography>
                        <Typography
                          variant="paragraph1Medium"
                          sx={{
                            fontWeight: 600,
                            color: '#000',
                            mt: 2,
                            fontSize: { xs: '1rem', sm: '1.1rem' },
                          }}
                        >
                          {currencyPay} {formatSemicolon(amountToCollect)}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Button
                          variant="primary"
                          sx={{
                            bgcolor: '#6358DC',
                            color: '#fff',
                            borderRadius: '12px',
                            fontFamily: typography.paragraph1Medium,
                            textTransform: 'none',
                            p: { xs: 1.2, sm: 1.5 },
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            fontWeight: 500,
                            '&:hover': {
                              bgcolor: '#5248CC',
                            },
                          }}
                          onClick={handleAcceptReservation}
                        >
                          {t('hostMessagePanel.actions.yesApprove', 'Sí, aprobar solicitud')}
                        </Button>
                        <Button
                          variant="outlined"
                          sx={{
                            borderColor: '#E5E7EB',
                            color: '#000',
                            borderRadius: '12px',
                            fontFamily: typography.paragraph1Medium,
                            textTransform: 'none',
                            p: { xs: 1.2, sm: 1.5 },
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            fontWeight: 500,
                          }}
                          onClick={() => setStatusAproved(null)}
                        >
                          {t('hostMessagePanel.actions.cancel', 'Cancelar')}
                        </Button>
                      </Box>

                      <Typography
                        variant="small1Regular"
                        color="text.secondary"
                        sx={{ textAlign: 'center', mt: 1, fontSize: '0.8rem' }}
                      >
                        {t(
                          'hostMessagePanel.flows.contactGuestNote',
                          'Podrás comunicarte con el huésped mientras se completa el pago.'
                        )}
                      </Typography>
                    </Box>
                  )}

                  {statusAproved == 'SEE_GUESTS' && (
                    <React.Fragment>
                      <Box
                        sx={{
                          p: 2,
                          maxWidth: '400px',
                          mx: 'auto',
                          backgroundColor: 'white',
                        }}
                      >
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                          2 huéspedes en este viaje
                        </Typography>

                        <Typography variant="body1" sx={{ mb: 4, color: 'text.primary' }}>
                          {t('hostMessagePanel.flows.guestsDesc')}
                        </Typography>

                        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                          <Box
                            component="li"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              mb: 2,
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                alt={userIdOneNavigation?.name ?? 'Anfitrion'}
                                src={userIdOneNavigation?.photoLink?.replace(
                                  'https://localhost:44317/',
                                  'https://assert-dev.runasp.net/'
                                )}
                                sx={{ width: 56, height: 56, mr: 2 }}
                              />
                              <Box>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                  {userIdOneNavigation?.name ?? ''}
                                </Typography>

                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                  {t('hostMessagePanel.about.identityVerified')}
                                </Typography>
                              </Box>
                            </Box>
                            <IconButton
                              size="large"
                              sx={{ border: '1px solid #6c757d', borderRadius: '5px' }}
                            >
                              <ArrowForwardIosIcon fontSize="small" />
                            </IconButton>
                          </Box>

                          <Box
                            component="li"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                alt={userIdTwoNavigation?.name ?? 'Anfitrion'}
                                src={userIdTwoNavigation?.photoLink?.replace(
                                  'https://localhost:44317/',
                                  'https://assert-dev.runasp.net/'
                                )}
                                sx={{ width: 56, height: 56, mr: 2 }}
                              />
                              <Box>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                  {t('hostMessagePanel.flows.guestLabel')}
                                </Typography>
                              </Box>
                            </Box>
                            <IconButton
                              size="large"
                              sx={{ border: '1px solid #6c757d', borderRadius: '5px' }}
                            >
                              <ArrowForwardIosIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
                          <Button
                            variant="outlined"
                            color="inherit"
                            sx={{
                              py: 1.5,
                              px: 6,
                              borderRadius: '10px',
                              textTransform: 'none',
                              fontSize: '1rem',
                              borderColor: 'text.primary',
                              color: 'text.primary',
                              '&:hover': {
                                borderColor: 'text.primary',
                              },
                            }}
                            onClick={() => setStatusAproved(null)}
                          >
                            {t('hostMessagePanel.actions.back')}
                          </Button>
                        </Box>
                      </Box>
                    </React.Fragment>
                  )}
                  {statusAproved == 'REJECTED_CONSULT' && (
                    <QuestionCancel
                      listItems={ParametricsReasonRefused?.data || []}
                      setStatusAproved={setStatusAproved}
                      conversation={conversation}
                    />
                  )}
                  {statusAproved == 'REJECTED' && (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography variant="h3Medium" component="div" sx={{ pb: 2 }}>
                        {t('hostMessagePanel.flows.tellUsWhy')}
                      </Typography>

                      {/* <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    pt: 5,
                  }}
                >
                  <Typography variant="paragraph1Medium" >
                    Hubo un problema con las fechas del viaje
                  </Typography>
                  <ArrowForwardIosIcon sx={{ ml: 1, color: 'text.secondary', border: '1px solid #6c757d', borderRadius: '5px' }}
                    onClick={() => setStatusAproved('REJECTED_SUB1')}
                  />
                </Box> 
                */}

                      {cancellationToShow.map((el: any) => {
                        return (
                          <React.Fragment>
                            {el?.isEndStep ? (
                              <Box key={el.reasonRefusedId} sx={{ mt: 3, mb: 5 }}>
                                <Typography
                                  variant="paragraph1Medium"
                                  component="div"
                                  sx={{
                                    mb: 3,
                                    backgroundColor: '#DADADA',
                                    mt: 1,
                                    textAlign: 'center',
                                    borderRadius: 5,
                                    width: '80%',
                                  }}
                                >
                                  {el?.messageTo == 'GUEST'
                                    ? t('hostMessagePanel.actions.optional')
                                    : t('hostMessagePanel.actions.actionRequired')}
                                </Typography>

                                <Typography
                                  variant="h3Medium"
                                  component="div"
                                  sx={{
                                    mb: 2,
                                  }}
                                >
                                  {el?.grouperText}
                                </Typography>

                                {/* Instructional Text */}
                                <Typography variant="paragraph1Medium" sx={{ mb: 3 }}>
                                  {el?.reasonRefusedText}
                                </Typography>

                                {/* Text Area Input */}
                                <TextField
                                  multiline
                                  rows={3}
                                  fullWidth
                                  value={message}
                                  onChange={(e) => setMessage(e.target.value)}
                                  variant="outlined"
                                  sx={{
                                    mt: 5,
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 4,
                                      backgroundColor: 'white',
                                      fontFamily: typography.paragraph1Regular,
                                    },
                                  }}
                                />
                                {el?.messageTo != 'ASSERT' && (
                                  <Box
                                    gap={2}
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      borderTop: '1px solid lightgrey',
                                      mt: 3,
                                      pt: 2,
                                      width: '100%',
                                    }}
                                  >
                                    <Button
                                      onClick={handleCancellationReasonBeforeStep}
                                      variant="secondary"
                                      fullWidth
                                      // sx={{
                                      //   fontWeight: 'bold',
                                      //   textTransform: 'none',
                                      //   fontSize: '1rem',
                                      //   mr: 2,
                                      //   py: 1.2,
                                      //   px: 5,
                                      //   borderRadius: '10px',
                                      //   fontFamily: typography.paragraph1Medium,
                                      // }}
                                    >
                                      {t('hostMessagePanel.actions.cancel')}
                                    </Button>

                                    <Button
                                      variant="primary"
                                      onClick={handleDeclineConsult}
                                      fullWidth
                                      // sx={{
                                      //   color: 'white',
                                      //   '&:hover': {
                                      //     backgroundColor: 'darkgrey',
                                      //   },
                                      //   borderRadius: '10px',
                                      //   py: 1.2,
                                      //   px: 3,
                                      //   textTransform: 'none',
                                      //   minWidth: '150px',
                                      //   fontFamily: typography.paragraph1Medium,
                                      // }}
                                    >
                                      {'Enviar el mensaje'}
                                    </Button>
                                  </Box>
                                )}
                              </Box>
                            ) : (
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  cursor: 'pointer',
                                  pt: 3,
                                }}
                                key={el.reasonRefusedId}
                                onClick={() => handleCancellationReasonNextStep(el)}
                              >
                                <Typography variant="paragraph1Medium">
                                  {el?.reasonRefusedText}
                                </Typography>
                                <ArrowForwardIosIcon
                                  sx={{
                                    ml: 1,
                                    color: 'text.secondary',
                                    border: '1px solid #6c757d',
                                    borderRadius: '5px',
                                  }}
                                />
                              </Box>
                            )}
                          </React.Fragment>
                        );
                      })}

                      {seeButtonDecline && (
                        <>
                          <Button
                            variant="secondary"
                            fullWidth
                            sx={{
                              mt: 4,
                              color: theme.palette.text.secondary,
                              borderColor: '#6c757d',
                            }}
                            // sx={{
                            //   borderColor: '#1a1a1a',
                            //   fontFamily: typography.paragraph1Medium,
                            //   textTransform: 'none',
                            //   p: 2,
                            //   mt: 8,
                            //   borderRadius: '15px',
                            // }}
                            onClick={handleCancellationReasonBeforeStep}
                          >
                            {t('hostMessagePanel.actions.cancel')}
                          </Button>
                        </>
                      )}
                    </Box>
                  )}

                  {statusAproved == 'REJECTED_SUB1' && (
                    <React.Fragment>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography variant="h3Medium" component="div">
                          {t('hostMessagePanel.flows.tellUsWhy')}
                        </Typography>

                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer',
                            pt: 5,
                          }}
                        >
                          <Typography variant="paragraph1Medium">
                            {t('hostMessagePanel.flows.reasons.dates')}
                          </Typography>
                          <ArrowForwardIosIcon
                            sx={{
                              ml: 1,
                              color: 'text.secondary',
                              border: '1px solid #6c757d',
                              borderRadius: '5px',
                            }}
                            onClick={() => setStatusAproved('REJECTED_SUB1_MSG')}
                          />
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer',
                            pt: 3,
                          }}
                        >
                          <Typography variant="paragraph1Medium">
                            {t('hostMessagePanel.flows.reasons.duration')}
                          </Typography>
                          <ArrowForwardIosIcon
                            sx={{
                              ml: 1,
                              color: 'text.secondary',
                              border: '1px solid #6c757d',
                              borderRadius: '5px',
                            }}
                            onClick={() => setStatusAproved('REJECTED_SUB1_MSG')}
                          />
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer',
                            pt: 3,
                          }}
                        >
                          <Typography variant="paragraph1Medium">
                            {t('hostMessagePanel.flows.reasons.price')}
                          </Typography>
                          <ArrowForwardIosIcon
                            sx={{
                              color: 'text.secondary',
                              border: '1px solid #6c757d',
                              borderRadius: '5px',
                            }}
                          />
                        </Box>

                        <Button
                          variant="outlined"
                          sx={{
                            borderColor: '#1a1a1a',
                            fontFamily: typography.paragraph1Medium,
                            textTransform: 'none',
                            p: 2,
                            mt: 8,
                          }}
                          onClick={() => setStatusAproved('REJECTED')}
                        >
                          {t('hostMessagePanel.actions.cancel')}
                        </Button>
                      </Box>
                    </React.Fragment>
                  )}
                  {statusAproved == 'REJECTED_SUB2' && (
                    <React.Fragment>REJECTED_SUB2</React.Fragment>
                  )}
                  {statusAproved == 'REJECTED_SUB3' && (
                    <React.Fragment>REJECTED_SUB3</React.Fragment>
                  )}

                  {statusAproved == 'REJECTED_SUB1_MSG' && (
                    <Box>
                      <Typography
                        variant="paragraph1Medium"
                        component="div"
                        sx={{
                          mb: 3,
                          backgroundColor: '#DADADA',
                          p: 1,
                          textAlign: 'left',
                          borderRadius: 5,
                          width: '80%',
                        }}
                      >
                        {t('hostMessagePanel.actions.actionRequired')}
                      </Typography>

                      <Typography
                        variant="h3Medium"
                        component="div"
                        sx={{
                          mb: 2,
                        }}
                      >
                        {t('hostMessagePanel.flows.explainTitle')}
                      </Typography>

                      {/* Instructional Text */}
                      <Typography variant="paragraph1Medium" sx={{ mb: 3 }}>
                        {t('hostMessagePanel.flows.explainDesc')}
                      </Typography>

                      {/* Text Area Input */}
                      <TextField
                        multiline
                        rows={3}
                        fullWidth
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        variant="outlined"
                        sx={{
                          mt: 5,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 4,
                            backgroundColor: 'white',
                            fontFamily: typography.paragraph1Regular,
                          },
                        }}
                      />

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderTop: '1px solid lightgrey',
                          mt: 3,
                          pt: 2,
                          width: '100%',
                        }}
                      >
                        <Button
                          onClick={() => setStatusAproved('REJECTED_SUB1')}
                          color="inherit"
                          variant="text"
                          sx={{
                            fontWeight: 'bold',
                            textTransform: 'none',
                            fontSize: '1rem',
                            mr: 2,
                            py: 1.2,
                            px: 5,
                            borderRadius: '10px',
                            fontFamily: typography.paragraph1Medium,
                          }}
                        >
                          {t('hostMessagePanel.actions.cancel')}
                        </Button>

                        <Button
                          variant="contained"
                          onClick={handleDeclineConsult}
                          sx={{
                            backgroundColor: 'black',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'darkgrey',
                            },
                            borderRadius: '10px',
                            py: 1.2,
                            px: 3,
                            textTransform: 'none',
                            minWidth: '150px',
                            fontFamily: typography.paragraph1Medium,
                          }}
                        >
                          {'Enviar el mensaje'}
                        </Button>
                      </Box>
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Card>
        </React.Fragment>
      )}
      <NestedListModal
        open={openComplaint}
        onClose={() => setOpenComplaint(false)}
        data={GetComplaintReasonsAsTree?.data}
        onSubmit={(selected, text) => {
          if (selected.children.length == 0) {
            ComplaintCreate(
              {
                bookingId: bookId,
                complaintReasonId: selected.id,
                freeTextDescription: text,
              },
              {
                onSuccess: (response) => {
                  const { resultError, statusCode } = response;
                  if (statusCode == '200') {
                    showSnackbar(t('hostMessagePanel.messages.complaintSent'), 'success');
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
      <ProfileModal
        open={openProfileModal}
        onClose={() => setOpenProfileModal(false)}
        userId={userIdTwoNavigation?.userId}
        propertyId={listingRentId}
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
    </>
  );
};

export default DetailPanelMessageHost02;
