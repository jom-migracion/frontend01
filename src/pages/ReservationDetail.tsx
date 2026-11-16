import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import HostInfo from '@/components/HostInfo ';
import PasosReserva from '@/components/PasosReserva';
import ImageCarouselCard from '@/components/ImageCarouselCard';
import ReviewSummaryCard from '@/components/ReviewSummaryCard';
import HostBioAccordion from '@/components/HostBioAccordion';
import MessageHostCard from '@/components/MessageHostCard';
import ReservationDetailsCard from '@/components/ReservationDetailsCard';
import PaymentInfoCard from '@/components/PaymentInfoCard';
import { useParams } from 'react-router';
import { useGet2 } from '@/hooks/api';
import { differenceInMonths, format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import Grid from '@mui/material/Grid2';
import { useTranslation } from 'react-i18next';

interface BookData {
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
  tlListingDiscountForRates: any[]; // Array vacío
  specialDatePrices: any | null;
}

interface Currency {
  currencyId?: number;
  code?: string;
}

const ReservationDetail = () => {
  const { id: paramId } = useParams();
  const id = paramId || '';
  const { t } = useTranslation();

  const {
    data: detailBook,
    isLoading: isLoadingBook,
    isError: isErrorBook,
    error: errorBook,
    // refetch: refetchBook,
  } = useGet2<BookData>(['propertyRent', id], `/Book/${id}`);

  // Date and time formatting functions
  const formatDate = (dateStr: string): string => {
    return format(parseISO(dateStr), "EEE, dd 'de' MMMM", { locale: es });
  };

  const formatTime = (timeStr: string): string => {
    return format(parseISO(`2000-01-01T${timeStr}`), 'h:mm a', { locale: es });
  };

  const listingData: BookData | undefined = detailBook?.data;

  if (isLoadingBook) {
    return <Typography>{t('reservationDetail.loading')}</Typography>;
  }

  if (isErrorBook) {
    return (
      <Typography>
        {t('reservationDetail.loadingError')}: {errorBook?.message}
      </Typography>
    );
  }

  if (!listingData) {
    return <Typography>{t('reservationDetail.noData')}</Typography>;
  }

  const months = differenceInMonths(
    new Date(),
    new Date(listingData.listingRent?.owner?.registerDate || '')
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={2}>
        <Grid container spacing={2} alignItems="center">
          {/* Columna de la imagen */}
          <Grid size={{ xs: 12, md: 7 }}>
            <ImageCarouselCard images={listingData?.photos || []} />
          </Grid>

          {/* Columna de los pasos */}
          <Grid size={{ xs: 12, md: 5 }}>
            <PasosReserva
              pasos={[
                { label: t('reservationDetail.steps.request'), completed: true },
                { label: t('reservationDetail.steps.approved'), completed: true },
                {
                  label: t('reservationDetail.steps.checkin'),
                  completed: true,
                  date: '2025-08-31',
                },
                {
                  label: t('reservationDetail.steps.checkout'),
                  completed: false,
                  date: '2025-09-01',
                },
              ]}
              reviewStart="2025-09-02"
              reviewEnd="2025-09-07"
              onEnviarReseña={() => console.log(t('reservationDetail.sendReview'))}
              onContactarSoporte={() => console.log(t('reservationDetail.contactSupport'))}
            />
          </Grid>
        </Grid>

        <Box>
          <Typography variant="h6">
            {listingData?.listingRent?.name || t('reservationDetail.unnamedProperty')}
          </Typography>
          <Typography variant="body2">
            {t('reservationDetail.entirePlace')}{' '}
            <b>
              {listingData?.listingRent?.property?.address?.city?.city ||
                t('reservationDetail.unknownLocation')}
              ,{' '}
              {listingData?.listingRent?.property?.address?.city?.country ||
                t('reservationDetail.unknownCountry')}
            </b>
          </Typography>
        </Box>
        <HostInfo
          title={listingData?.listingRent?.accomodationType ?? t('reservationDetail.monoambiente')}
          location={`${listingData?.listingRent?.property?.address?.city?.city ?? ''}, ${listingData?.listingRent?.property?.address?.city?.country ?? ''}`}
          hostName={`${listingData?.owner?.name ?? ''} ${listingData?.owner?.lastName ?? ''}`}
          hostingTime={`${listingData?.owner?.registerDateMonths}`}
        />

        <Box sx={{ mx: 'auto', mt: 4, p: 2 }}>
          {/* Calificación */}

          <ReviewSummaryCard listingRentId={listingData?.listingRent?.listingRentId} />
          <Divider sx={{ mb: 2, mt: 2 }} />

          {/* Check-in / Check-out */}

          <Card sx={{ width: '100%', backgroundColor: '#fafafa', borderRadius: 3, p: 2, mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} justifyContent="space-between" alignItems="center">
                <Grid size={{ xs: 5 }}>
                  <Typography variant="subtitle2">Check-in</Typography>
                  <Typography>{formatDate('2025-08-05T09:35:00')}</Typography>
                  <Typography variant="body2">
                    {formatTime(
                      listingData.listingRent?.checkInOutPolicies[0]?.checkInTime || '15:00'
                    )}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 2 }}>
                  <Divider orientation="vertical" sx={{ height: '100%' }} />
                </Grid>

                <Grid size={{ xs: 5 }}>
                  <Typography variant="subtitle2">Check-out</Typography>
                  <Typography>{formatDate('2025-08-06T09:35:00')}</Typography>
                  <Typography variant="body2">
                    {formatTime(
                      listingData.listingRent?.checkInOutPolicies[0]?.checkOutTime || '11:00'
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Divider sx={{ mb: 2, mt: 2 }} />

          {/* Mensaje al anfitrión */}

          <MessageHostCard
            hostName={listingData.listingRent?.owner?.name}
            hostId={listingData.listingRent?.ownerUserId}
          />
          <Divider sx={{ mb: 2, mt: 2 }} />
          {/* Detalles de la reserva */}

          <HostBioAccordion
            hostName={listingData.listingRent?.owner?.name}
            hostId={listingData.listingRent?.ownerUserId}
            hostingTime={`${months} ${months === 1 ? t('reservationDetail.monthSingular') : t('reservationDetail.monthPlural')}`}
            hostDescription="Me dedico a la construcción y bienes raíces, viajo bastante por trabajo y también me gusta viajar."
            hostPhotoUrl={listingData.listingRent?.owner?.photoLink || ''}
          />

          <Divider sx={{ mb: 2 }} />

          {/* Política de cancelación */}

          <ReservationDetailsCard
            guests={listingData?.guestCount || 0}
            //cancelationPolicy="Puedes cancelar hasta 24 horas antes de la llegada para obtener un reembolso completo. Las políticas pueden variar según el anfitrión."
            cancelationPolicy={
              listingData?.listingRent?.cancelationPolicy?.detail1 ||
              t('reservationDetail.cancelationPolicyFallback')
            }
          />
          <Divider sx={{ my: 2 }} />

          {/* Información de pago */}

          <PaymentInfoCard amount={listingData?.listingRent?.price?.priceNightly || 0} />

          <Divider sx={{ my: 2 }} />
        </Box>
      </Stack>
    </Container>
  );
};

export default ReservationDetail;
