import CancelRequestDialog from '@/components/CancelRequestDialog';
import CustomDialog from '@/components/CustomDialog';
import ShowMap from '@/components/ShowMap';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import LocalPoliceOutlinedIcon from '@mui/icons-material/LocalPoliceOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Stack from '@mui/material/Stack';
import Grid2 from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router';
import { cancellationPolicyIconMap, securityIconMap } from '@/assets/amenitiesIcons';
import { useGet2 } from '@/hooks/api';
import { ListingData } from '@/models/interfaces/ListingRentResponseStep';
import StatusPropertySkeleton from '@/components/StatusPropertySkeleton';
import SectionReservationDialog from '@/components/SectionReservationDialog';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import PetsOutlinedIcon from '@mui/icons-material/PetsOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { useConvertReservationStore } from '@/store/message.store';
import { estadoColorReserva, EstadoReserva } from '@/common/util/statusFunctios';
import { parseISO } from 'date-fns/esm';

interface BookingData {
  bookId: number;
  listingRentId: number;
  userIdRenter: number;
  startDate: string;
  endDate: string;
  amountTotal: number;
  currencyId: number | null;
  mountPerNight: number | null;
  amountFees: number | null;
  nameRenter: string | null;
  lastNameRenter: string | null;
  termsAccepted: boolean;
  additionalInfo: string | null;
  bookStatusId: number | null;
  isApprobal: boolean | null;
  approvalDetails: string | null;
  isManualApprobal: boolean | null;
  daysToApproval: number | null;
  initDate: string | null;
  paymentCode: string | null;
  pk: string | null;
  paymentId: string | null;
  guestCount: number | null;
  depositSec: number | null;
  pickUpLocation: string | null;
  vggFee: number | null;
  vggFeePercent: number | null;
  checkin: string | null;
  checkout: string | null;
  maxCheckin: string | null;
  guestCheckin: string | null;
  guestCheckout: string | null;
  cancellationStart: string | null;
  cancellationEnd: string | null;
  cancellation: string | null;
  cancellationUserId: number | null;
  reasonRefusedId: number | null;
  requestDateTime: string | null;
  expiredDateTime: string | null;
  checkinStatu: boolean;
  checkoutStatu: boolean;
  payPriceCalculations: PayPriceCalculation[] | null;
  calendarDays: any[];
  owner: User;
  photos: Photo[];
  listingRent: ListingRent;
  bookStatus: BookStatus;
  cancellationUser: User | null;
  userIdRenterNavigation: User;
  currency: Currency | null;
  reasonRefused: any | null;
  canReview: boolean;
  tmConversations: TmConversations[];
  adultCount?: number;
  childCount?: number;
  infantCount?: number;
  petCount?: number;
  sidebarData?: SidebarData;
}

export interface PayPriceCalculation {
  priceCalculation: PriceCalculation;
  priceBreakdowns: PriceBreakdown[];
}

export interface PriceCalculation {
  priceCalculationId: string;
  calculationCode: string;
  bookId: string;
  amount: number;
  currencyCode: string;
  calculationDetails: string;
  creationDate: string;
  expirationDate: string;
  calculationStatue: string;
  ipAddress: string | null;
  userAgent: string | null;
  methodOfPaymentId: number;
  paymentProviderId: number;
  paymentTransactionId: number;
  initBook: string;
  endBook: string;
  listingRentId: string;
  breakdownInfo: string;
  calculationStatusId: number;
  consultAccepted: boolean | null;
  consultResponse: string | null;
  reasonRefusedId: number | null;
  userId: string;
  calculationStatus: unknown | null;
  reasonRefused: unknown | null;
  methodOfPayment: unknown | null;
  paymentProvider: unknown | null;
  paymentTransaction: unknown | null;
  additionalFees: number;
  discounts: number;
  platformFee: number;
  baseCalculation: number;
  paymentPlatformFee: number;
  payoutAmount: number;
  finalPayoutAmount: number;
  penaltyAmount: number;
  forGuest: unknown | null;
  guestResume: GuestResume;
  hostResume: HostResume;
}

export interface GuestResume {
  accommodation: Accommodation;
  additionalCharges: AdditionalCharges;
  subtotal: number;
  guestCommission: number;
  guestCommissionPercent: number;
  total: number;
  currencyCode: string;
}

export interface HostResume {
  accommodation: Accommodation;
  additionalCharges: AdditionalCharges;
  subtotal: number;
  hostCommission: number;
  hostCommissionPercent: number;
  amountToCollect: number;
  currencyCode: string;
  penaltyApplied: number;
  originalAmountToCollect: number;
}

export interface Accommodation {
  ratePerNight: number;
  nightsCount: number;
  baseAmount: number;
  weekend_RatePerNight: number;
  weekend_NightsCount: number;
  weekend_BaseAmount: number;
  totalBaseAmount: number;
  appliedDiscount: number;
  discountedAmount: number;
}

export interface AdditionalCharges {
  extraGuestFee: number;
  petFee: number;
  cleaningFee: number;
  otherFees: number;
}

export interface PriceBreakdown {
  type: string;
  description: string;
  amount: number;
  percentage: number | null;
  date: string | null;
}
export interface SidebarData {
  tituloLateral?: string;
  mensajeLateral?: string;
  responseCode: string;
}

export interface TmConversations {
  conversationId: string;
  userIdOne: number;
  userIdTwo: string;
  statusId: string;
  statusCode: string | null;
  status: string | null;
  conversationTypeId: number;
}

export interface BookStatus {
  bookStatusId: number;
  name: string;
  description: string;
  code: string;
}

interface User {
  userId: number;
  name: string;
  lastName: string;
  favoriteName: string;
  photoLink: string;
  gender: string | null;
  email: string | null;
  phoneNumber: string | null;
  phoneCode: string | null;
  emergencyContact: string | null;
  documents: any[]; // Array vacío
  phones: any[]; // Array vacío
  profilePhotos: any[]; // Array vacío
  registerDate: string;
  registerDateDays: number | null;
  registerDateMonths: number | null;
  registerDateYears: number | null;
  cityName: string;
  status: string;
}

interface Photo {
  photoLink: string;
  isPrincipal: boolean;
  name: string;
  description: string;
  position: number;
  spaceType: string | null;
  spaceTypeCode: string | null;
  spaceTypeId: number | null;
  listingPhotoId: number;
}

interface ListingRent {
  listingRentId: number;
  status: string | null;
  name: string;
  description: string;
  minimunRentalPerDay: number | null;
  approvalRequestDays: number | null;
  phoneNumber: string | null;
  ownerUserId: number;
  listingStatusId: number;
  stepsCount: number | null;
  cancelationPolicyTypeId: number;
  approvalPolicyTypeId: number;
  accomodationTypeId: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  allDoorsLocked: boolean | null;
  beds: number;
  externalCameras: boolean | null;
  presenceOfWeapons: boolean | null;
  noiseDesibelesMonitor: number | null;
  listingRentConfirmationDate: string;
  accomodationType: string | null;
  approvalPolicy: string | null;
  cancelationPolicy: CancelationPolicy | null;
  owner: User;
  property: Property;
  price: Price;
  checkInOutPolicies: any[];
  amenities: any[];
  featuredAspects: any[];
  photos: Photo[];
  rentRules: RentRule[];
  reviews: any[];
  securityItems: any[];
  spaces: any[];
  stayPresences: any | null;
  valoration: number;
  totalRents: string;
  myProperty: number;
  isFavorite: boolean;
  privateBathroom: number;
  privateBathroomLodging: number;
  sharedBathroom: number;
  avgReviews: number;
  minimunStay: number | null;
  maximumStay: number | null;
  minimumNotice: number;
  minimumNoticeHour: number | null;
  preparationDays: number;
  availabilityWindowMonth: number | null;
  checkInDays: any | null;
  checkOutDays: any | null;
}
interface RentRule {
  value: boolean;
  valueString: string;
  code: string;
  name: string;
  description: string;
  status: string | null;
  iconLink: string;
  ruleTypeId: number;
}

interface CancelationPolicy {
  code: string | null;
  name: string | null;
  detail1: string | null;
  refoundUpToPercentage: number | null;
  refoundUpToDays: number | null;
  detail2: string | null;
  discountPercentage: number | null;
  withinDays: number | null;
  status: string | null;
  cancelationPolicyTypeId: number | null;
}

interface Property {
  latitude: number;
  longitude: number;
  address: Address;
  type: string | null;
  distanceMeters: number;
  cityName: string;
  countyName: string;
  stateName: string;
  countryName: string;
}

interface Address {
  zipCode: string;
  address1: string;
  address2: string;
  cityId: number;
  countyId: number;
  stateId: number;
  city: City;
}

interface City {
  cityId: number;
  city: string;
  state: string;
  stateCode: string | null;
  country: string;
  countryCode: string | null;
  county: string;
  latitude: number | null;
  longitude: number | null;
}

interface Price {
  priceNightly: number;
  securityDepositPrice: number | null;
  currency: Currency | null;
  currencyCode: string | null;
  listingPriceId: number;
  listingRentId: number;
  listingPriceOfferId: number | null;
  timeUnitId: number | null;
  currencyId: number;
  weekendNightlyPrice: number;
  tlListingDiscountForRates: any[];
  specialDatePrices: any | null;
}

interface Currency {
  currencyId?: number;
  code?: string;
}

interface ReservationPendingProps {
  bookingData: BookingData;
  onRefetch?: () => void;
  introduceYourself?: string;
  additionalInformation?: any;
  bookStatusCode?: string;
}
const ReservationPending: React.FC<ReservationPendingProps> = ({
  bookingData,
  onRefetch,
  introduceYourself,
  additionalInformation,
  bookStatusCode,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isLargeScreen = useMediaQuery('(min-width:1920px)');
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [remaining, setRemaining] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCancelDialogOpen = () => setCancelDialogOpen(true);
  const handleCancelDialogClose = () => setCancelDialogOpen(false);
  const handleConfirmCancel = () => {
    handleCancelDialogClose();
  };
  const navigate = useNavigate();
  const setStateConversationId = useConvertReservationStore(
    (state: any) => state.setStateConversationId
  );

  const birthday = additionalInformation?.birthday
    ? format(parseISO(additionalInformation.birthday), 'dd/MM/yyyy')
    : t('reservationCommon.noInfo');

  const redirectChat = (conversationId: string) => {
    if (conversationId) {
      setStateConversationId(conversationId);
      navigate(`/host/messages`);
    } else {
      alert(t('reservationCommon.noConversation'));
    }
  };

  const { data: detailProperty, isLoading: isLoadingProperty } = useGet2<ListingData>(
    ['detailPropertyReservation', bookingData?.listingRentId],
    `/ListingRent/${bookingData?.listingRentId}`
  );

  const { data: fullBooking } = useGet2<BookingData>(
    ['fullBooking', bookingData?.bookId],
    `/Book/${bookingData?.bookId}`,
    { enabled: !!bookingData?.bookId }
  );

  const estadoResult = estadoColorReserva(
    bookStatusCode as string,
    bookingData?.checkin as string,
    bookingData?.checkout as string
  ) as EstadoReserva;
  const IconComponent = estadoResult.icon;

  const pendingProperty = { data: bookingData };
  const primaryPhoto = pendingProperty?.data?.listingRent.photos.find((photo) => photo.isPrincipal);
  const photoToShow =
    primaryPhoto?.photoLink || pendingProperty?.data?.listingRent.photos[0]?.photoLink;

  const startShort = pendingProperty?.data?.checkin
    ? format(new Date(pendingProperty.data.checkin), 'EEE, d MMM', { locale: es })
    : '-';
  const endShort = pendingProperty?.data?.checkout
    ? format(new Date(pendingProperty.data.checkout), 'EEE, d MMM', { locale: es })
    : '-';
  const checkinTime = pendingProperty?.data?.checkin
    ? format(new Date(pendingProperty.data.checkin), 'HH:mm', { locale: es })
    : '-';
  const checkoutTime = pendingProperty?.data?.checkout
    ? format(new Date(pendingProperty.data.checkout), 'HH:mm', { locale: es })
    : '-';
  const reservationRange =
    startShort !== '-' && endShort !== '-' ? `${startShort} - ${endShort}` : '-';

  useEffect(() => {
    if (!bookingData?.expiredDateTime) {
      setRemaining(null);
      return;
    }
    const target = new Date(bookingData.expiredDateTime).getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      const totalSeconds = Math.floor(diff / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const h = hours.toString().padStart(2, '0');
      const m = minutes.toString().padStart(2, '0');
      const s = seconds.toString().padStart(2, '0');
      setRemaining(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingData?.expiredDateTime]);

  if (isLoadingProperty) {
    return (
      <Box>
        <StatusPropertySkeleton />
      </Box>
    );
  }
  // 1. Extraemos los valores para que el código sea más limpio (opcional pero recomendado)
  const {
    adultCount = 0,
    childCount = 0,
    infantCount = 0,
    petCount = 0,
  } = pendingProperty?.data || {};

  // 2. Construimos un array solo con los textos de las categorías que tengan más de 0
  const guestsText = [
    adultCount > 0
      ? `${adultCount} ${adultCount === 1 ? t('reservationCommon.guests.adult') : t('reservationCommon.guests.adults')}`
      : null,
    childCount > 0
      ? `${childCount} ${childCount === 1 ? t('reservationCommon.guests.child') : t('reservationCommon.guests.children')}`
      : null,
    infantCount > 0
      ? `${infantCount} ${infantCount === 1 ? t('reservationCommon.guests.infant') : t('reservationCommon.guests.infants')}`
      : null,
    petCount > 0
      ? `${petCount} ${petCount === 1 ? t('reservationCommon.guests.pet') : t('reservationCommon.guests.pets')}`
      : null,
  ]
    .filter(Boolean) // Elimina los nulos del array
    .join(', '); // Une los elementos restantes con una coma y espacio

  const remainingHM = remaining ? remaining.substring(0, 5) : '03:00';

  type StepItemProps = {
    index?: number;
    label: string;
    secondary?: string;
    done?: boolean;
    active?: boolean;
    isLast?: boolean;
  };

  const DynamicIcon = pendingProperty?.data?.listingRent?.cancelationPolicy?.code
    ? (securityIconMap[pendingProperty.data.listingRent.cancelationPolicy.code.trim()] ??
      cancellationPolicyIconMap[pendingProperty.data.listingRent.cancelationPolicy.code.trim()])
    : undefined;

  const primary = theme.palette.primary.main;
  const StepItem: React.FC<StepItemProps> = ({ index, label, secondary, done, active, isLast }) => (
    <Box display="flex" alignItems="flex-start" gap={2} mb={isLast ? 0 : 0} position="relative">
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: done || active ? theme.palette.customColors.primary[7] : 'transparent',
            border: active
              ? `2px solid ${theme.palette.customColors.primary[1]}`
              : done
                ? `none`
                : `2px solid #d0d0d0`,
            color: active
              ? theme.palette.customColors.primary[1]
              : done
                ? theme.palette.customColors.primary[1]
                : '#757575',
            fontWeight: 700,
            fontSize: 10,
            lineHeight: 1,
            zIndex: 1,
          }}
        >
          {done ? <CheckIcon sx={{ fontSize: 14 }} /> : index}
        </Box>
        {!isLast && (
          <Box
            sx={{
              width: 2,
              height: 30,
              bgcolor: '#e0e0e0',
              mt: 0,
              mb: 2,
            }}
          />
        )}
      </Box>
      <Box flex={1} pt={0.5}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1f1f1f' }}>{label}</Typography>
        {secondary && (
          <Typography
            sx={{
              fontSize: 12,
              color: active ? primary : 'text.secondary',
              fontWeight: active ? 600 : 400,
            }}
          >
            {secondary}
          </Typography>
        )}
      </Box>
    </Box>
  );
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Chip
          icon={IconComponent ? <IconComponent color={estadoResult.iconColor} /> : undefined}
          label={
            <Stack
              direction={'row'}
              gap={'5px'}
              sx={{ fontSize: '12px', color: estadoResult.color }}
            >
              {' '}
              <Typography fontWeight={'bold'} fontSize={'12px'} sx={{ color: estadoResult.color }}>
                {' '}
                {estadoResult.title}
              </Typography>{' '}
              {' - '} {estadoResult.estado}
            </Stack>
          }
          style={{
            width: 'auto',
            backgroundColor: estadoResult.bg,
            marginBottom: '4px',
          }}
        />
      </Box>
      <Box mb={2}>
        <Typography variant="h5">{bookingData?.sidebarData?.tituloLateral}</Typography>
      </Box>
      <Grid2 container spacing={4} sx={{ pb: { xs: 20, md: 0 } }}>
        {/* Columna izquierda */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <CardMedia
              component="img"
              sx={{ height: { xs: 300, sm: 400, md: 580 } }}
              image={photoToShow}
              alt="room"
            />
          </Card>

          <Box
            sx={{
              bgcolor: '#F8F9FC',
              border: '1px solid #e2e8f0',
              borderRadius: 4,
              mt: 4,
            }}
          >
            <Typography variant="body2" color="text.secondary" m={4}>
              {bookingData?.sidebarData?.mensajeLateral}
            </Typography>
          </Box>

          {/* Info alojamiento */}
          <Box mt={3}>
            <Typography sx={{ fontSize: 28, fontWeight: 600, lineHeight: 1.3, mb: 2 }}>
              {pendingProperty?.data?.listingRent?.name}
            </Typography>

            <Box display="flex" alignItems="center" gap={1.5}>
              <Avatar
                src={pendingProperty?.data?.owner.photoLink}
                alt="Jorge"
                sx={{ width: 40, height: 40 }}
              />
              <Box>
                <Typography sx={{ fontWeight: 500 }}>
                  {`${pendingProperty?.data?.owner?.name} ${pendingProperty?.data?.owner?.lastName}`}
                </Typography>
                <Typography sx={{ fontSize: 14, color: '#64748b' }}>
                  {`${additionalInformation?.liveAt?.liveAtShow ?? t('reservationCommon.noInfo')}`}
                </Typography>
              </Box>
            </Box>
          </Box>
          {/* Llegada y salida */}
          <Box
            mt={3}
            p={2}
            sx={{
              bgcolor: '#F8F9FC',
              border: '1px solid #e2e8f0',
              borderRadius: 4,
              display: 'grid',
              gridTemplateColumns: '1fr 1px 1fr',
              gap: 2,
            }}
          >
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#64748b', mb: 0.5 }}>
                {t('reservationPending.arrival')}
              </Typography>
              <Typography sx={{ fontWeight: 600 }}>{startShort}</Typography>
              <Typography sx={{ fontSize: 14, color: '#64748b' }}>{checkinTime}</Typography>
            </Box>
            <Divider orientation="vertical" sx={{ bgcolor: '#e2e8f0' }} />
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#64748b', mb: 0.5 }}>
                {t('reservationPending.departure')}
              </Typography>
              <Typography sx={{ fontWeight: 600 }}>{endShort}</Typography>
              <Typography sx={{ fontSize: 14, color: '#64748b' }}>{checkoutTime}</Typography>
            </Box>
          </Box>
          {/* Mensaje anfitrión */}
          <Box mt={8}>
            <Box display="flex" gap={2}>
              <MessageOutlinedIcon sx={{ fontSize: 20, color: '#6B7280' }} />
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#64748b', mb: 2 }}>
                  {t('reservationPending.messageHost')}
                </Typography>
                <Link
                  component="button"
                  onClick={() =>
                    redirectChat(pendingProperty?.data?.tmConversations[0]?.conversationId)
                  }
                  underline="hover"
                  sx={{ fontSize: 14, fontWeight: 500, color: '#5B55C8' }}
                >
                  {`${pendingProperty?.data?.owner?.name} ${pendingProperty?.data?.owner?.lastName}`}
                </Link>
              </Box>
            </Box>

            <Box display="flex" gap={2} mt={2}>
              <HomeOutlinedIcon sx={{ fontSize: 20, color: '#6B7280' }} />
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#64748b', mb: 1 }}>
                  {t('reservationPending.accommodation')}
                </Typography>
                <Link
                  href={`/detail/${pendingProperty?.data?.listingRent?.listingRentId}`}
                  underline="hover"
                  sx={{ fontSize: 14, fontWeight: 500, color: '#5B55C8' }}
                >
                  {pendingProperty?.data?.listingRent?.name}
                </Link>
              </Box>
            </Box>
          </Box>
          {/* Detalles de la reserva */}
          <Divider sx={{ mt: 8 }} />
          <Box mt={8}>
            <Typography sx={{ fontSize: 18, fontWeight: 600, mb: 3 }}>
              {t('reservationPending.detailsTitle')}
            </Typography>
            <Typography sx={{ fontWeight: 500, mb: 0.5 }}>
              {t('reservationPending.whoAccompanies')}
            </Typography>
            {/* <Typography sx={{ fontSize: 14, color: '#64748b' }}>
              {pendingProperty?.data?.guestCount || 0} {t('reservationPending.guestsCount')} */}
            {/* {`${pendingProperty?.data?.adultCount || 0} ${pendingProperty?.data?.adultCount === 1 ? t('reservationCommon.guests.adult') : t('reservationCommon.guests.adults')}, 
              ${pendingProperty?.data?.childCount || 0} ${pendingProperty?.data?.childCount === 1 ? t('reservationCommon.guests.child') : t('reservationCommon.guests.children')}, 
              ${pendingProperty?.data?.infantCount || 0} ${pendingProperty?.data?.infantCount === 1 ? t('reservationCommon.guests.infant') : t('reservationCommon.guests.infants')}, 
              ${pendingProperty?.data?.petCount || 0} ${pendingProperty?.data?.petCount === 1 ? t('reservationCommon.guests.pet') : t('reservationCommon.guests.pets')}`} */}
            {/* </Typography> */}
            {guestsText && (
              <Typography sx={{ fontSize: 14, color: '#64748b', mt: 1 }}>{guestsText}</Typography>
            )}
          </Box>
          {/* Políticas de cancelación */}
          <Divider sx={{ mt: 8 }} />
          <Box mt={8}>
            <Typography sx={{ fontSize: 18, fontWeight: 600, mb: 3 }}>
              {t('reservationPending.cancellationPolicy')}
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>
              {pendingProperty?.data?.listingRent?.cancelationPolicy?.detail1 ||
                t('reservationPending.noCancellationInfo')}
            </Typography>
            <Link
              href="#"
              underline="hover"
              sx={{
                mt: 2,
                display: 'inline-block',
                fontSize: 14,
                fontWeight: 500,
                color: '#5B55C8',
              }}
              onClick={(e) => {
                e.preventDefault();
                handleOpen();
              }}
            >
              {t('reservationPending.readMore')}
            </Link>
          </Box>
          {/* Cómo llegar */}
          <Divider sx={{ mt: 8 }} />
          <Box mt={8}>
            <Typography sx={{ fontSize: 18, fontWeight: 600, mb: 3 }}>
              {t('reservationPostApproved.location.title')}
            </Typography>
            <ShowMap
              latitude={pendingProperty?.data?.listingRent?.property?.latitude}
              longitude={pendingProperty?.data?.listingRent?.property?.longitude}
            />
          </Box>
          {/* Reglas e instrucciones */}
          <Divider sx={{ mt: 8 }} />
          <Box mt={8}>
            <Typography sx={{ fontSize: 18, fontWeight: 600, mb: 3 }}>
              {t('reservationPending.rulesTitle')}
            </Typography>
            <SectionReservationDialog
              title={t('bookingCard.houseRules.title')}
              content={detailProperty?.data?.rentRules || []}
              emptyMessage={t('bookingCard.houseRules.empty')}
            />
          </Box>
          {/* Anfitrión */}
          <Divider sx={{ mt: 8 }} />
          <Box mt={8}>
            {/* Encabezado: Título y Avatar */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <Typography sx={{ fontSize: 18, fontWeight: 600, mb: 3 }}>
                {t('reservationPending.hostTitle')}
                {`${pendingProperty?.data?.owner?.name} ${pendingProperty?.data?.owner?.lastName}`}
              </Typography>
              <Avatar
                src={pendingProperty?.data?.owner?.photoLink}
                alt={`${pendingProperty?.data?.owner?.name || t('reservationCommon.hostFallback')}`}
                sx={{
                  width: 48,
                  height: 48,
                }}
              />
            </Stack>

            <Divider sx={{ my: 3 }} />

            {/* Cuadrícula de Información Adicional con Iconos */}
            <Grid2 container spacing={3} sx={{ mb: 4 }}>
              {/* A qué me dedico */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <WorkOutlineIcon sx={{ color: 'text.secondary', fontSize: 22, mt: 0.2 }} />
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary' }}>
                      {t('reservationCommon.hostInfo.whatIDo')}
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.5 }}>
                      {additionalInformation?.whatIDo ?? t('reservationCommon.noInfo')}
                    </Typography>
                  </Box>
                </Stack>
              </Grid2>

              {/* Cumpleaños */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <CakeOutlinedIcon sx={{ color: 'text.secondary', fontSize: 22, mt: 0.2 }} />
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary' }}>
                      {t('reservationCommon.hostInfo.birthday')}
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.5 }}>
                      {birthday ?? t('reservationCommon.noInfo')}
                    </Typography>
                  </Box>
                </Stack>
              </Grid2>

              {/* Mascotas */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <PetsOutlinedIcon sx={{ color: 'text.secondary', fontSize: 22, mt: 0.2 }} />
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary' }}>
                      {t('reservationCommon.hostInfo.pets')}
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.5 }}>
                      {additionalInformation?.pets ?? t('reservationCommon.noInfo')}
                    </Typography>
                  </Box>
                </Stack>
              </Grid2>

              {/* Dónde vivo */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <LocationOnOutlinedIcon sx={{ color: 'text.secondary', fontSize: 22, mt: 0.2 }} />
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary' }}>
                      {t('reservationCommon.hostInfo.whereILive')}
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.5 }}>
                      {additionalInformation?.liveAt?.liveAtShow ?? t('reservationCommon.noInfo')}
                    </Typography>
                  </Box>
                </Stack>
              </Grid2>
            </Grid2>

            {/* Sección "Acerca de mí" destacada */}
            <Box
              sx={{
                p: 2.5,
                bgcolor: '#f8fafc', // Un gris/azulado muy suave
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'grey.100',
              }}
            >
              <Typography sx={{ fontWeight: 600, mb: 1, fontSize: 15, color: 'text.primary' }}>
                {t('reservationPending.aboutHost')}
              </Typography>
              <Typography sx={{ fontSize: 14, color: 'text.secondary', lineHeight: 1.6 }}>
                {introduceYourself || t('reservationPending.noHostInfo')}
              </Typography>

              {introduceYourself && (
                <Link
                  href="#"
                  underline="hover"
                  sx={{
                    mt: 1.5,
                    display: 'inline-block',
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#5B55C8',
                  }}
                >
                  {t('reservationPending.showMore')}
                </Link>
              )}
            </Box>
          </Box>

          {/* Precio Guest */}
          <Divider sx={{ mt: 8 }} />
          <Box mt={8}>
            <Typography sx={{ fontSize: 18, fontWeight: 600, mb: 3 }}>
              {t('reservationCanceled.priceInfo')}
            </Typography>

            {(() => {
              const guestResume =
                fullBooking?.data?.payPriceCalculations?.[0]?.priceCalculation?.guestResume;

              if (!guestResume) {
                return (
                  <>
                    <Typography sx={{ fontSize: 14, color: '#64748b', mb: 0.5 }}>
                      {t('reservationCanceled.amountToPay')}
                    </Typography>
                    <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#1F2937' }}>
                      {`${pendingProperty?.data?.amountTotal ?? 0} BOB.`}
                    </Typography>
                  </>
                );
              }

              const {
                accommodation,
                additionalCharges,
                subtotal,
                guestCommission,
                total,
                currencyCode,
              } = guestResume;

              return (
                <Stack spacing={1.5}>
                  {/* Alojamiento */}
                  <Box display="flex" justifyContent="space-between">
                    <Typography sx={{ fontSize: 14, color: '#64748b' }}>
                      {accommodation.nightsCount} noche
                      {accommodation.nightsCount !== 1 ? 's' : ''} × {accommodation.ratePerNight}{' '}
                      {currencyCode}
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                      {accommodation.baseAmount} {currencyCode}
                    </Typography>
                  </Box>

                  {/* Cargos adicionales (solo si hay alguno > 0) */}
                  {additionalCharges.extraGuestFee > 0 && (
                    <Box display="flex" justifyContent="space-between">
                      <Typography sx={{ fontSize: 14, color: '#64748b' }}>
                        Huéspedes extra
                      </Typography>
                      <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                        {additionalCharges.extraGuestFee} {currencyCode}
                      </Typography>
                    </Box>
                  )}
                  {additionalCharges.petFee > 0 && (
                    <Box display="flex" justifyContent="space-between">
                      <Typography sx={{ fontSize: 14, color: '#64748b' }}>Mascotas</Typography>
                      <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                        {additionalCharges.petFee} {currencyCode}
                      </Typography>
                    </Box>
                  )}
                  {additionalCharges.cleaningFee > 0 && (
                    <Box display="flex" justifyContent="space-between">
                      <Typography sx={{ fontSize: 14, color: '#64748b' }}>Limpieza</Typography>
                      <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                        {additionalCharges.cleaningFee} {currencyCode}
                      </Typography>
                    </Box>
                  )}
                  {additionalCharges.otherFees > 0 && (
                    <Box display="flex" justifyContent="space-between">
                      <Typography sx={{ fontSize: 14, color: '#64748b' }}>Otros cargos</Typography>
                      <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                        {additionalCharges.otherFees} {currencyCode}
                      </Typography>
                    </Box>
                  )}

                  {/* Subtotal */}
                  <Box display="flex" justifyContent="space-between">
                    <Typography sx={{ fontSize: 14, color: '#64748b' }}>Subtotal</Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                      {subtotal} {currencyCode}
                    </Typography>
                  </Box>

                  {/* Comisión del huésped */}
                  <Box display="flex" justifyContent="space-between">
                    <Typography sx={{ fontSize: 14, color: '#64748b' }}>
                      Comisión de servicio ({guestResume.guestCommissionPercent}
                      %)
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                      {guestCommission} {currencyCode}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  {/* Total */}
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontSize: 16, fontWeight: 700 }}>Total</Typography>
                    <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#1F2937' }}>
                      {total} {currencyCode}
                    </Typography>
                  </Box>
                </Stack>
              );
            })()}
          </Box>
          {/* Asistencia */}
          <Divider sx={{ mt: 8 }} />
          <Box mt={8}>
            <Typography sx={{ fontSize: 18, fontWeight: 600, mb: 3 }}>
              {t('reservationPending.supportTitle')}
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#64748b', mb: 2 }}>
              {t('reservationPending.supportText')}
            </Typography>
            <Link
              component={RouterLink}
              to="/help-center"
              underline="hover"
              sx={{ fontSize: 14, fontWeight: 500, color: '#5B55C8' }}
            >
              {t('reservationPending.contactSupport')}
            </Link>
          </Box>
        </Grid2>

        {/* Columna derecha (nuevo diseño) */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              position: { xs: 'fixed', md: 'sticky' },
              bottom: { xs: 0, md: 'auto' },
              top: { xs: 'auto', md: 88 },
              left: { xs: 0, md: 'auto' },
              right: { xs: 0, md: 'auto' },
              width: { xs: '100%', md: 'auto' },
              zIndex: { xs: 1200, md: 10 },
              transition: 'all 0.3s ease-in-out',
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: isExpanded ? 3 : 2, md: 1 },
                borderRadius: { xs: isExpanded ? '16px 16px 0 0' : '16px 16px 0 0', md: 3 },
                width: { xs: '100%', md: '80%' },
                maxWidth: { md: 380 },
                border: '1px solid #eee',
                boxShadow: {
                  xs: '0px -4px 16px rgba(0, 0, 0, 0.1)',
                  md: '0px 8px 24px rgba(0, 0, 0, 0.08)',
                },
                maxHeight: { xs: isExpanded ? '80vh' : 'auto', md: 'auto' },
                overflow: { xs: isExpanded ? 'auto' : 'visible', md: 'visible' },
                transition: 'all 0.3s ease-in-out',
              }}
            >
              {/* Vista compacta para móvil (colapsado) */}
              {!isExpanded && isMobile && (
                <Box
                  onClick={() => setIsExpanded(true)}
                  sx={{
                    display: { xs: 'flex', md: 'none' },
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Box>
                    <Typography variant="body1" sx={{ fontSize: '0.95rem', fontWeight: 600 }}>
                      {t('reservationPending.steps.request')}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: '0.85rem', color: 'primary.main', fontWeight: 600 }}
                    >
                      {t('reservationPending.steps.confirmation')}
                    </Typography>
                  </Box>
                  <ExpandMoreIcon
                    sx={{ fontSize: 28, color: 'text.secondary', transform: 'rotate(180deg)' }}
                  />
                </Box>
              )}

              {/* Vista completa (desktop siempre, móvil solo cuando expandido) */}
              <Box sx={{ display: { xs: isExpanded ? 'block' : 'none', md: 'block' } }}>
                <Box pl={2} pt={2} pb={2} gap={2} position="relative">
                  {isMobile && isExpanded && (
                    <Box display="flex" justifyContent="flex-end" mb={1}>
                      <ExpandMoreIcon
                        onClick={() => setIsExpanded(false)}
                        sx={{
                          fontSize: 28,
                          color: 'text.secondary',
                          cursor: 'pointer',
                        }}
                      />
                    </Box>
                  )}
                  <StepItem
                    done
                    label={t('reservationPending.steps.request')}
                    secondary={t('reservationPending.steps.sent')}
                  />
                  <StepItem
                    active
                    index={2}
                    label={t('reservationPending.steps.confirmation')}
                    secondary={`${t('reservationPending.steps.responseIn')} ${remainingHM} hrs`}
                  />
                  <StepItem
                    index={3}
                    label={t('reservationPending.steps.pay')}
                    secondary={t('reservationPending.steps.doPay')}
                  />
                  <StepItem
                    index={4}
                    label={t('reservationPending.steps.checkin')}
                    secondary={startShort}
                  />
                  <StepItem
                    index={5}
                    label={t('reservationPending.steps.checkout')}
                    secondary={endShort}
                  />
                  <StepItem
                    index={6}
                    isLast
                    label={t('reservationPending.steps.review')}
                    secondary={reservationRange}
                  />
                </Box>
                <Box px={2} pb={2} pt={3}>
                  <Button fullWidth variant="primary" onClick={handleCancelDialogOpen}>
                    {t('reservationPending.cancelRequestButton')}
                  </Button>
                </Box>
                <Box px={2} pb={2}>
                  <Link
                    underline="always"
                    href="#"
                    sx={{
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      '&:hover': {
                        color: 'text.primary',
                      },
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleOpen();
                    }}
                  >
                    {t('reservationPending.cancelPolicyLink')}
                  </Link>
                </Box>
              </Box>
            </Paper>
          </Box>
          {/* Espaciador para móvil cuando el componente está fijo */}
          {isMobile && <Box sx={{ height: 120 }} />}
        </Grid2>
      </Grid2>
      <CancelRequestDialog
        open={cancelDialogOpen}
        onClose={handleCancelDialogClose}
        onConfirm={handleConfirmCancel}
        onSuccess={onRefetch}
        bookId={pendingProperty?.data?.bookId}
      />
      <CustomDialog
        isOpen={open}
        onClose={handleClose}
        maxWidth="sm"
        title={t('reservationPending.modal.title')}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2,
            p: 1.5,
            borderRadius: '12px',
            '&:hover': {
              backgroundColor: '#f8fafc',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              borderRadius: '10px',
              p: 1,
              boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            {DynamicIcon ? (
              <DynamicIcon style={{ color: '#334155', fontSize: '1.2rem', flexShrink: 0 }} />
            ) : (
              <LocalPoliceOutlinedIcon
                sx={{ color: '#334155', fontSize: '1.2rem', flexShrink: 0 }}
              />
            )}
          </Box>
          <Box display={'flex'} flexDirection="column" gap={1}>
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b', mb: 0.5 }}>
              {pendingProperty?.data?.listingRent?.cancelationPolicy?.name || ''}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#334155',
                lineHeight: 1.6,
                fontWeight: 500,
                pt: 0.5,
              }}
            >
              {pendingProperty?.data?.listingRent?.cancelationPolicy?.detail1 || ''}
            </Typography>
          </Box>
        </Box>
      </CustomDialog>
    </Box>
  );
};

export default ReservationPending;
