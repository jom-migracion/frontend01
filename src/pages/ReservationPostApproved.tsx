import { cancellationPolicyIconMap, securityIconMap } from '@/assets/amenitiesIcons';
import { estadoColorReserva, EstadoReserva } from '@/common/util/statusFunctios';
import CancellationPolicyPreview from '@/components/CancellationPolicyPreview';
import CancelRequestDialog from '@/components/CancelRequestDialog';
import CancelStayDialog from '@/components/CancelStayDialog';
import CustomDialog from '@/components/CustomDialog';
import GuestSummaryReservation from '@/components/GuestSummaryReservation';
import HostAboutSection from '@/components/HostAboutSection';
import PriceBreakdownGuest from '@/components/PriceBreakdownGuest';
import ReservationLocation from '@/components/ReservationLocation';
import ReservationPhoto from '@/components/ReservationPhoto';
import ReservationRules from '@/components/ReservationRules';
import ReservationStatusChip from '@/components/ReservationStatusChip';
import ReservationStayInfo from '@/components/ReservationStayInfo';
import SidebarMessageBox from '@/components/SidebarMessageBox';
import StatusPropertySkeleton from '@/components/StatusPropertySkeleton';
import SupportSection from '@/components/SupportSection';
import { useGet2 } from '@/hooks/api';
import { ListingData } from '@/models/interfaces/ListingRentResponseStep';
import { useConvertReservationStore } from '@/store/message.store';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalPoliceOutlinedIcon from '@mui/icons-material/LocalPoliceOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { default as Grid, default as Grid2 } from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

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
  documents: any[];
  phones: any[];
  profilePhotos: any[];
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
  tlListingDiscountForRates: any[]; // Array vacío
  specialDatePrices: any | null;
}

interface Currency {
  currencyId?: number;
  code?: string;
}
interface ReservationInProgressProps {
  bookingData: BookingData;
  introduceYourself?: string;
  additionalInformation?: any;
  bookStatusCode?: string;
}

const ReservationPostApproved: React.FC<ReservationInProgressProps> = ({
  bookingData,
  introduceYourself,
  additionalInformation,
  bookStatusCode,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelStayOpen, setCancelStayOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const handleCancelDialogOpen = () => setCancelStayOpen(true);
  const handleCancelDialogClose = () => setCancelDialogOpen(false);
  const handleCancelStayClose = () => setCancelStayOpen(false);
  const handleConfirmCancel = () => {
    // Aquí puedes agregar la lógica para cancelar la solicitud
    handleCancelDialogClose();
  };
  const handleConfirmCancelStay = () => {
    handleCancelStayClose();
  };

  const navigate = useNavigate();
  const setStateConversationId = useConvertReservationStore(
    (state: any) => state.setStateConversationId
  );

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

  const posApproved = { data: bookingData };
  const primaryPhoto = posApproved?.data?.listingRent.photos.find((photo) => photo.isPrincipal);
  const photoUrlToShow =
    primaryPhoto?.photoLink || posApproved?.data?.listingRent.photos[0]?.photoLink;

  const startShort = posApproved?.data?.checkin
    ? format(new Date(posApproved.data.checkin), 'EEE, d MMM', { locale: es })
    : '-';
  const endShort = posApproved?.data?.checkout
    ? format(new Date(posApproved.data.checkout), 'EEE, d MMM', { locale: es })
    : '-';
  const reservationRange =
    startShort !== '-' && endShort !== '-' ? `${startShort} - ${endShort}` : '-';

  useEffect(() => {
    if (!posApproved?.data?.expiredDateTime) {
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posApproved?.data?.expiredDateTime]);

  if (isLoadingProperty) {
    return (
      <Box>
        <StatusPropertySkeleton />
      </Box>
    );
  }

  const DynamicIcon = posApproved?.data?.listingRent?.cancelationPolicy?.code
    ? (securityIconMap[posApproved.data.listingRent.cancelationPolicy.code.trim()] ??
      cancellationPolicyIconMap[posApproved.data.listingRent.cancelationPolicy.code.trim()])
    : undefined;

  type StepItemProps = {
    index?: number;
    label: string;
    secondary?: string;
    done?: boolean;
    active?: boolean;
    isLast?: boolean;
  };

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
      {/* Estado */}
      <Box>
        <ReservationStatusChip estadoResult={estadoResult} />
      </Box>

      <Box mb={2}>
        {/* Mensaje segun estado */}
        <Typography variant="h5" fontWeight="bold">
          {bookingData?.sidebarData?.tituloLateral}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Columna izquierda */}

        <Grid size={{ xs: 12, md: 6 }}>
          {/* Imagen principal */}
          <Box>
            <ReservationPhoto photoUrl={photoUrlToShow} alt="room" />
          </Box>

          {/* Mensaje lateral */}
          <Box>
            <SidebarMessageBox message={bookingData?.sidebarData?.mensajeLateral} />
          </Box>

          {/* Información de la reservación */}
          <ReservationStayInfo
            owner={posApproved?.data?.owner}
            liveAtShow={additionalInformation?.liveAt?.liveAtShow}
            listingName={posApproved?.data?.listingRent?.name}
            listingId={posApproved?.data?.listingRent?.listingRentId}
            checkin={posApproved?.data?.checkin}
            checkout={posApproved?.data?.checkout}
            onMessageClick={() =>
              redirectChat(posApproved?.data?.tmConversations?.[0]?.conversationId)
            }
          />

          {/* Detalles de la reserva */}
          <Divider sx={{ mt: 8 }} />
          <GuestSummaryReservation
            adultCount={posApproved?.data?.adultCount || 0}
            childCount={posApproved?.data?.childCount || 0}
            infantCount={posApproved?.data?.infantCount || 0}
            petCount={posApproved?.data?.petCount || 0}
          />

          {/* Políticas de cancelación */}
          <Divider sx={{ mt: 8 }} />
          <CancellationPolicyPreview
            detail1={posApproved?.data?.listingRent?.cancelationPolicy?.detail1 || null}
            onReadMore={handleOpen}
          />

          {/* Cómo llegar */}
          <Divider sx={{ mt: 8 }} />
          <Box mt={8}>
            <ReservationLocation
              latitude={posApproved?.data?.listingRent?.property?.latitude}
              longitude={posApproved?.data?.listingRent?.property?.longitude}
            />
          </Box>

          {/* Reglas e instrucciones*/}
          <Divider sx={{ mt: 8 }} />
          <Box mt={8}>
            <ReservationRules rentRules={detailProperty?.data?.rentRules || []} />
          </Box>

          {/* Anfitrión */}
          <Divider sx={{ mt: 8 }} />
          <Box>
            <HostAboutSection
              owner={posApproved?.data?.owner}
              additionalInformation={additionalInformation}
              introduceYourself={introduceYourself}
            />
          </Box>

          {/* Información de precio */}
          <Divider sx={{ mt: 8 }} />
          <Box>
            <PriceBreakdownGuest
              guestResume={
                fullBooking?.data?.payPriceCalculations?.[0]?.priceCalculation?.guestResume
              }
              fallbackAmount={
                fullBooking?.data?.payPriceCalculations?.[0]?.priceCalculation?.guestResume.total
              }
              fallbackCurrency={
                fullBooking?.data?.payPriceCalculations?.[0]?.priceCalculation?.guestResume
                  .currencyCode
              }
            />
          </Box>

          {/* Obtén asistencia en todo momento */}
          <Divider sx={{ mt: 8 }} />
          <Box>
            <SupportSection />
          </Box>
        </Grid>

        {/* Columna derecha */}
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
                      {t('reservationPending.steps.checkin')} {startShort}
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
                    done
                    label={t('reservationPending.steps.confirmation')}
                    secondary={t('reservationPending.steps.sent')}
                  />
                  <StepItem
                    done
                    index={3}
                    label={t('reservationPending.steps.pay')}
                    secondary={t('reservationPending.steps.doPay')}
                  />
                  <StepItem
                    active
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
                    {t('reservationPostApproved.steps.cancelBtn')}
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
                    {t('reservationPostApproved.steps.cancelPolicyLink')}
                  </Link>
                </Box>
              </Box>
            </Paper>
          </Box>
          {/* Espaciador para móvil cuando el componente está fijo */}
          {isMobile && <Box sx={{ height: 120 }} />}
        </Grid2>
      </Grid>
      <CancelStayDialog
        open={cancelStayOpen}
        onClose={handleCancelStayClose}
        onConfirm={handleConfirmCancelStay}
        propertyName={posApproved?.data?.listingRent?.name || 'la propiedad'}
        checkInDate={posApproved?.data?.checkin || ''}
        checkOutDate={posApproved?.data?.checkout || ''}
        totalAmount={posApproved?.data?.amountTotal || 0}
        currency="BOB"
        bookId={posApproved?.data?.bookId}
      />
      <CancelRequestDialog
        open={cancelDialogOpen}
        onClose={handleCancelDialogClose}
        onConfirm={handleConfirmCancel}
        bookId={posApproved?.data?.bookId}
      />
      <CustomDialog
        isOpen={open}
        onClose={handleClose}
        title={t('reservationPostApproved.cancelDialog.title')}
        maxWidth="sm"
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
              {posApproved?.data?.listingRent?.cancelationPolicy?.name || ''}
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
              {posApproved?.data?.listingRent?.cancelationPolicy?.detail1 || ''}
            </Typography>
          </Box>
        </Box>
      </CustomDialog>
    </Box>
  );
};

export default ReservationPostApproved;
