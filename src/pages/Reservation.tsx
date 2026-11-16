import { useGet2 } from '@/hooks/api';
import { useParams } from 'react-router';
import ReservationPending from './ReservationPending';
import ReservationApproved from './ReservationApproved';
import ReservationInProgress from './ReservationInProgress';
import ReservationCanceled from './ReservationCanceled';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import ReservationDetailView from './ReservationDetailView';
import StatusPropertySkeleton from '@/components/StatusPropertySkeleton';
import ReservationPostApproved from './ReservationPostApproved';
import ReservationDetailViewComplete from './ReservationDetailViewComplete';
import ReservationReview from './ReservationReview';

export interface BookingResponse {
  data: BookingData;
}

/* ---------- BookingData (objeto principal) ---------- */
export interface BookingData {
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
  gests: number | null;
  existPet: boolean | null;
  calendarDays: any[]; // estructura no provista (vacío en el ejemplo)
  owner: Person;
  photos: Photo[];
  listingRent: ListingRent;
  bookStatus: BookStatus;
  cancellationUser: any | null;
  userIdRenterNavigation: any | null;
  currency: any | null;
  reasonRefused: any | null;
  tlListingReviews: any[]; // array vacío en el JSON
  authorizationDateTime: string | null;
  authTimeElapsed: string | null;
  reviewDateTime: string | null;
  checkinStatus: boolean;
  checkoutStatus: boolean;
  payPriceCalculations: PayPriceCalculation[];
  datetimePayment: string | null;
  datetimePayout: string | null;
  datetimePayoutProgram: string | null;
  sidebarData?: SidebarData;
}
export interface SidebarData {
  tituloLateral?: string;
  mensajeLateral?: string;
  responseCode: string;
}

/* ---------- Person / Owner ---------- */
export interface Person {
  userId: number;
  name: string;
  lastName: string;
  favoriteName?: string | null;
  photoLink?: string | null;
  gender?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  phoneCode?: string | null;
  emergencyContact?: string | null;
  documents: any[];
  phones: any[];
  profilePhotos: any[];
  registerDate?: string | null;
  registerDateDays?: number | null;
  registerDateMonths?: number | null;
  registerDateYears?: number | null;
  cityName?: string | null;
  status?: string | null;
}

/* ---------- Photo ---------- */
export interface Photo {
  photoLink: string;
  isPrincipal: boolean;
  name: string;
  description?: string | null;
  position?: number | null;
  spaceType?: string | null;
  spaceTypeCode?: string | null;
  spaceTypeId?: number | null;
  listingPhotoId?: number | null;
}

/* ---------- ListingRent ---------- */
export interface ListingRent {
  listingRentId: number;
  status: string | null;
  name: string;
  description: string | null;
  minimunRentalPerDay: AmountObject | null;
  approvalRequestDays: number | null;
  phoneNumber: string | null;
  ownerUserId: number | null;
  listingStatusId: number | null;
  stepsCount: number | null;
  cancelationPolicyTypeId: number | null;
  approvalPolicyTypeId: number | null;
  accomodationTypeId: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  maxGuests: number | null;
  allDoorsLocked: boolean | null;
  beds: number | null;
  externalCameras: boolean | null;
  presenceOfWeapons: boolean | null;
  noiseDesibelesMonitor: boolean | null;
  listingRentConfirmationDate?: string | null;
  accomodationType: any | null;
  approvalPolicy: any | null;
  cancelationPolicy: CancelationPolicy | null;
  owner: Person;
  property: Property;
  price: ListingPrice;
  checkInOutPolicies: any[];
  amenities: any[];
  featuredAspects: any[];
  photos: Photo[];
  rentRules: any[];
  reviews: any[];
  securityItems: any[];
  spaces: any[];
  stayPresences: any | null;
  valoration: number | null;
  totalRents: string | null;
  myProperty: number | null;
  isFavorite: boolean;
  privateBathroom: any | null;
  privateBathroomLodging: any | null;
  sharedBathroom: any | null;
  avgReviews: number | null;
  minimunStay: any | null;
  maximumStay: any | null;
  minimumNotice: any | null;
  minimumNoticeHour: any | null;
  preparationDays: any | null;
  availabilityWindowMonth: any | null;
  checkInDays: any | null;
  checkOutDays: any | null;
  guestCount: number | null;
  canReview: boolean;
}

/* ---------- CancelationPolicy ---------- */
export interface CancelationPolicy {
  code: string;
  name: string;
  detail1: string | null;
  refoundUpToPercentage: number | null;
  refoundUpToDays: number | null;
  detail2: string | null;
  discountPercentage: number | null;
  withinDays: number | null;
  status: boolean | null;
  cancelationPolicyTypeId: number | null;
}

/* ---------- Property & Address ---------- */
export interface Property {
  latitude: number | null;
  longitude: number | null;
  address: Address | null;
  type: string | null;
  distanceMeters: number | null;
  cityName: string | null;
  countyName: string | null;
  stateName: string | null;
  countryName: string | null;
}

export interface Address {
  zipCode: string | null;
  address1: string | null;
  address2: string | null;
  cityId: number | null;
  countyId: number | null;
  stateId: number | null;
  city: City | null;
}

export interface City {
  cityId: number | null;
  city: string | null;
  state: string | null;
  stateCode: string | null;
  country: string | null;
  countryCode: string | null;
  county: string | null;
  latitude: number | null;
  longitude: number | null;
}

/* ---------- ListingPrice ---------- */
export interface ListingPrice {
  priceNightly: AmountObject | null;
  securityDepositPrice: AmountObject | null;
  currency: any | null;
  currencyCode: string | null;
  listingPriceId: number | null;
  listingRentId: number | null;
  listingPriceOfferId: number | null;
  timeUnitId: number | null;
  currencyId: number | null;
  weekendNightlyPrice: AmountObject | null;
  tlListingDiscountForRates: any[];
  specialDatePrices: any | null;
}

/* ---------- AmountObject (source + parsedValue) ---------- */
export interface AmountObject {
  source: string | null;
  parsedValue: number | null;
}

/* ---------- BookStatus ---------- */
export interface BookStatus {
  bookStatusId: number;
  name: string;
  description: string;
  code: string;
}

/* ---------- PayPriceCalculation (wrapper) ---------- */
export interface PayPriceCalculation {
  priceCalculation: PriceCalculation;
  priceBreakdowns: PriceBreakdown[];
}

/* ---------- PriceCalculation ---------- */
export interface PriceCalculation {
  priceCalculationId: number;
  calculationCode: string;
  bookId: number;
  amount: number;
  currencyCode: string | null;
  calculationDetails: string | null;
  creationDate: string | null;
  expirationDate: string | null;
  calculationStatue: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  methodOfPaymentId: number | null;
  paymentProviderId: number | null;
  paymentTransactionId: number | null;
  initBook: string | null;
  endBook: string | null;
  listingRentId: number | null;
  breakdownInfo: string | null;
  calculationStatusId: number | null;
  consultAccepted: boolean | null;
  consultResponse: string | null;
  reasonRefusedId: number | null;
  userId: number | null;
  calculationStatus: any | null;
  reasonRefused: any | null;
  methodOfPayment: any | null;
  paymentProvider: any | null;
  paymentTransaction: any | null;
}

/* ---------- PriceBreakdown ---------- */
export interface PriceBreakdown {
  type: string;
  description: string;
  amount: AmountObject | null;
  percentage: number | AmountObject | null;
  date: string | null;
}

export interface ProfileResponse {
  statusCode: string;
  data: {
    data: ProfileData;
  };
  hasError: boolean;
  resultError: any;
}

export interface ProfileData {
  additionalProfileDataId: number;
  userId: number;
  lastName: string;
  name: string;
  whatIDo: string;
  wantedToGo: string;
  pets: string;
  birthday: string; // o Date si lo parseas
  languages: Language[];
  liveAt: LiveAt;
  introduceYourself: string | null;
}

export interface Language {
  languageId: number;
  code: string;
  detail: string;
}

export interface LiveAt {
  cityId: number;
  cityName: string;
  location: string;
  liveAtShow: string;
}

const Reservation = () => {
  const { id: paramId } = useParams();
  const id = paramId || '';
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery('(min-width:1920px)');
  const {
    data: bookingData,
    isLoading: isLoadingProperty,
    isError,
    error,
    refetch,
  } = useGet2<BookingData>(['reservationData', id], `/Book/${id}`);

  const ownerUserId = bookingData?.data?.owner?.userId;

  const { data: additionalProfileData, isLoading: isLoadingProfile } = useGet2<any>(
    ['additionalProfileData', ownerUserId],
    ownerUserId ? `/GetAdditionalProfileDataByUserId/${ownerUserId}` : '',
    {},
    !!ownerUserId && !isError
  );

  const handleRefetch = async () => {
    await refetch();
  };

  // Mostrar skeleton mientras carga
  if (isLoadingProperty || isLoadingProfile) {
    return (
      <Container
        maxWidth={isLargeScreen ? 'xl' : 'lg'}
        sx={{ px: { xs: 5, sm: 4, md: isLargeScreen ? 5 : 4 }, mt: 6 }}
      >
        <StatusPropertySkeleton />
      </Container>
    );
  }

  // Mostrar error si hay problema
  if (isError) {
    return (
      <Container
        maxWidth={isLargeScreen ? 'xl' : 'lg'}
        sx={{ px: { xs: 5, sm: 4, md: isLargeScreen ? 5 : 4 }, mt: 6 }}
      >
        <Alert severity="error">Error loading reservation: {error.message}</Alert>
      </Container>
    );
  }

  // Verificar que tenemos datos antes de continuar
  if (!bookingData?.data) {
    return (
      <Box sx={{ padding: '32px' }}>
        <Alert severity="warning">No se encontraron datos de la reserva</Alert>
      </Box>
    );
  }

  const bookStatusCode = bookingData.data.bookStatus?.code;
  const introduceYourself = additionalProfileData?.data?.introduceYourself || '';

  // Obtener fechas de check-in y check-out
  const checkinDate = bookingData.data.checkin ? new Date(bookingData.data.checkin) : null;
  const checkoutDate = bookingData.data.checkout ? new Date(bookingData.data.checkout) : null;
  const currentDate = new Date();

  const renderContent = (bookStatusCode: string) => {
    switch (bookStatusCode) {
      case 'prebook':
        return (
          <ReservationPending
            bookingData={bookingData.data as any}
            onRefetch={handleRefetch}
            introduceYourself={introduceYourself}
            additionalInformation={additionalProfileData?.data as any}
            bookStatusCode={bookStatusCode}
          />
        );

      case 'approved':
        return (
          <ReservationApproved
            bookingData={bookingData.data as any}
            onRefetch={handleRefetch}
            introduceYourself={introduceYourself}
            additionalInformation={additionalProfileData?.data as any}
            bookStatusCode={bookStatusCode}
          />
        );
      case 'rented':
        if (checkinDate && checkoutDate) {
          if (
            checkinDate &&
            currentDate >= checkinDate &&
            checkoutDate &&
            currentDate < checkoutDate
          ) {
            // Durante la estadía
            return (
              <ReservationInProgress
                bookingData={bookingData.data as any}
                introduceYourself={introduceYourself}
                additionalInformation={additionalProfileData?.data as any}
                bookStatusCode={bookStatusCode}
              />
            );
          } else if (checkinDate && currentDate < checkinDate) {
            // Después del checkout
            return (
              <ReservationPostApproved
                bookingData={bookingData.data as any}
                introduceYourself={introduceYourself}
                additionalInformation={additionalProfileData?.data as any}
                bookStatusCode={bookStatusCode}
              />
            );
          }
        }
        return (
          <ReservationDetailView
            bookingData={bookingData.data as any}
            introduceYourself={introduceYourself}
            additionalInformation={additionalProfileData?.data as any}
            bookStatusCode={bookStatusCode}
          />
        );
      case 'completed':
        return (
          <ReservationDetailViewComplete
            bookingData={bookingData.data as any}
            introduceYourself={introduceYourself}
            additionalInformation={additionalProfileData?.data as any}
            bookStatusCode={bookStatusCode}
          />
        );
      case 'review':
        return (
          <ReservationReview
            bookingData={bookingData.data as any}
            introduceYourself={introduceYourself}
            additionalInformation={additionalProfileData?.data as any}
            bookStatusCode={bookStatusCode}
          />
        );
      case 'canceled':
        return (
          <ReservationCanceled
            bookingData={bookingData.data as any}
            introduceYourself={introduceYourself}
            additionalInformation={additionalProfileData?.data as any}
            bookStatusCode={bookStatusCode}
          />
        );
      case 'canceled_payed':
        return (
          <ReservationCanceled
            bookingData={bookingData.data as any}
            introduceYourself={introduceYourself}
            additionalInformation={additionalProfileData?.data as any}
            bookStatusCode={bookStatusCode}
          />
        );
      case 're_expired':
        return (
          <ReservationCanceled
            bookingData={bookingData.data as any}
            introduceYourself={introduceYourself}
            additionalInformation={additionalProfileData?.data as any}
            bookStatusCode={bookStatusCode}
          />
        );
      case 'book_expired':
        return (
          <ReservationCanceled
            bookingData={bookingData.data as any}
            introduceYourself={introduceYourself}
            additionalInformation={additionalProfileData?.data as any}
            bookStatusCode={bookStatusCode}
          />
        );
      case 'canceled_assert':
        return (
          <ReservationCanceled
            bookingData={bookingData.data as any}
            introduceYourself={introduceYourself}
            additionalInformation={additionalProfileData?.data as any}
            bookStatusCode={bookStatusCode}
          />
        );
      case 're_canceled':
        return (
          <ReservationCanceled
            bookingData={bookingData.data as any}
            introduceYourself={introduceYourself}
            additionalInformation={additionalProfileData?.data as any}
            bookStatusCode={bookStatusCode}
          />
        );
      case 'non_approved':
        return (
          <ReservationCanceled
            bookingData={bookingData.data as any}
            introduceYourself={introduceYourself}
            additionalInformation={additionalProfileData?.data as any}
            bookStatusCode={bookStatusCode}
          />
        );

      default:
        return (
          <Alert severity="warning">
            Estado de reserva desconocido: {bookStatusCode || 'No disponible'}
          </Alert>
        );
    }
  };
  return (
    <Container
      maxWidth={isLargeScreen ? 'xl' : 'lg'}
      sx={{ px: { xs: 2, sm: 4, md: isLargeScreen ? 5 : 4 }, mt: isMobile ? 1 : 6 }}
    >
      {renderContent(bookStatusCode)}
      {/* <ReservationPending bookingData={bookingData.data as any} bookStatusCode={bookStatusCode} /> */}
      {/* <ReservationApproved bookingData={bookingData.data as any} bookStatusCode={bookStatusCode} /> */}
      {/* <ReservationPostApproved
        bookingData={bookingData.data as any}
        bookStatusCode={bookStatusCode}
      /> */}
      {/* <ReservationInProgress
        bookingData={bookingData.data as any}
        bookStatusCode={bookStatusCode}
      /> */}
      {/* <ReservationDetailView
        bookingData={bookingData.data as any}
        bookStatusCode={bookStatusCode}
      /> */}
      {/* <ReservationDetailViewComplete
        bookingData={bookingData.data as any}
        bookStatusCode={bookStatusCode}
      /> */}
      {/* <ReservationCanceled bookingData={bookingData.data as any} bookStatusCode={bookStatusCode} /> */}
    </Container>
  );
};

export default Reservation;
