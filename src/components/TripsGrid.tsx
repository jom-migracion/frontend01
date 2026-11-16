import { BookStatusEnum } from '@/common/enum/BookStatusEnum';
import { ApiService } from '@/services/ApiService';
import { Box, Card, Chip, Link, Stack, Typography } from '@mui/material';
import { CalendarTodayOutlined, ChevronRight } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import TripsGridSkeleton from './TripsGridSkeleton';
import { useTranslation } from 'react-i18next';
import { theme } from '@/themes/theme';
import EmptyState from './EmptyState';
import { AssertRoutes } from '@/common/enum/AssertRoutes';
import SearchIcon from '@mui/icons-material/Search';
import { estadoColorReserva } from '@/common/util/statusFunctios';

export interface BookingMap {
  [key: string]: Booking;
}

export interface Booking {
  bookId: number;
  listingRentId: number;
  userIdRenter: number;
  startDate: string;
  endDate: string;
  amountTotal: Amount;
  currencyId: number;
  mountPerNight: null;
  amountFees: null;
  nameRenter: string;
  lastNameRenter: string;
  termsAccepted: boolean | null;
  additionalInfo: null;
  bookStatusId: number;
  isApprobal: boolean;
  approvalDetails: null;
  isManualApprobal: null;
  daysToApproval: null;
  initDate: null;
  paymentCode: string;
  pk: null;
  paymentId: string;
  depositSec: null;
  pickUpLocation: null;
  vggFee: null;
  vggFeePercent: null;
  checkin: string;
  checkout: string;
  maxCheckin: string;
  guestCheckin: null;
  guestCheckout: null;
  cancellationStart: null;
  cancellationEnd: string;
  cancellation: null;
  cancellationUserId: null;
  reasonRefusedId: null;
  requestDateTime: null;
  expiredDateTime: null;
  gests: null;
  existPet: null;
  calendarDays: any[];
  owner: User;
  photos: Photo[];
  listingRent: ListingRent;
  bookStatus: BookStatus | null;
  cancellationUser: null;
  userIdRenterNavigation: null;
  currency: Currency | null;
  reasonRefused: null;
  tlListingReviews: any[];
  authorizationDateTime: string | null;
  authTimeElapsed: null;
  reviewDateTime: string | null;
  checkinStatus: boolean;
  checkoutStatus: boolean;
  payPriceCalculations: PayPriceCalculation[];
  datetimePayment: string | null;
  datetimePayout: null;
  datetimePayoutProgram: null;
}

export interface Amount {
  source: string;
  parsedValue: number;
}

export interface User {
  userId: number;
  name: string;
  lastName: string;
  favoriteName: string;
  photoLink: string;
  gender: null;
  email: null;
  phoneNumber: null;
  phoneCode: null;
  emergencyContact: null;
  documents: any[];
  phones: any[];
  profilePhotos: any[];
  registerDate: string;
  registerDateDays: null;
  registerDateMonths: null;
  registerDateYears: null;
  cityName: string;
  status: string;
}

export interface Photo {
  photoLink: string;
  isPrincipal: boolean;
  name: string;
  description: string;
  position: number;
  spaceType: null;
  spaceTypeCode: null;
  spaceTypeId: number | null;
  listingPhotoId: number;
}

export interface BookStatus {
  bookStatusId: number;
  name: string;
  description: string;
  code: string;
}

export interface Currency {
  currencyId: number;
  code: string;
  symbol: string;
  name: string;
  countryCode: string;
}

export interface ListingRent {
  listingRentId: number;
  status: null;
  name: string;
  description: string;
  minimunRentalPerDay: Amount;
  approvalRequestDays: number;
  phoneNumber: null;
  ownerUserId: number;
  listingStatusId: number;
  stepsCount: number;
  cancelationPolicyTypeId: number;
  approvalPolicyTypeId: number;
  accomodationTypeId: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  allDoorsLocked: boolean;
  beds: number;
  externalCameras: boolean;
  presenceOfWeapons: boolean;
  noiseDesibelesMonitor: boolean;
  listingRentConfirmationDate: string;
  accomodationType: null;
  approvalPolicy: ApprovalPolicy;
  cancelationPolicy: null;
  owner: User;
  property: Property;
  price: Price;
  checkInOutPolicies: any[];
  amenities: any[];
  featuredAspects: any[];
  photos: Photo[];
  rentRules: any[];
  reviews: any[];
  securityItems: any[];
  spaces: any[];
  stayPresences: null;
  valoration: Amount;
  totalRents: string;
  myProperty: number;
  isFavorite: boolean;
  privateBathroom: null;
  privateBathroomLodging: null;
  sharedBathroom: null;
  avgReviews: Amount;
  minimunStay: null;
  maximumStay: null;
  minimumNotice: null;
  minimumNoticeHour: null;
  preparationDays: null;
  availabilityWindowMonth: null;
  checkInDays: null;
  checkOutDays: null;
}

export interface ApprovalPolicy {
  code: string;
  name: string;
  description: string;
  isRecommended: boolean;
  status: boolean;
  approvalPolicyTypeId: number;
}

export interface Property {
  latitude: number;
  longitude: number;
  address: Address;
  type: null;
  distanceMeters: number;
  cityName: string;
  countyName: string;
  stateName: string;
  countryName: string;
}

export interface Address {
  zipCode: null;
  address1: null;
  address2: null;
  cityId: number;
  countyId: number;
  stateId: number;
  city: City;
}

export interface City {
  cityId: number;
  city: string;
  state: string;
  stateCode: null;
  country: string;
  countryCode: null;
  county: string;
  latitude: null;
  longitude: null;
}

export interface Price {
  priceNightly: null;
  securityDepositPrice: null;
  currency: null;
  currencyCode: null;
  listingPriceId: number;
  listingRentId: number;
  listingPriceOfferId: null;
  timeUnitId: null;
  currencyId: null;
  weekendNightlyPrice: null;
  tlListingDiscountForRates: any[];
  specialDatePrices: null;
}

export interface PayPriceCalculation {
  priceCalculation: PriceCalculation;
  priceBreakdowns: any[];
}

export interface PriceCalculation {
  priceCalculationId: number;
  calculationCode: string;
  bookId: null;
  amount: Amount;
  currencyCode: null;
  calculationDetails: null;
  creationDate: string;
  expirationDate: string;
  calculationStatue: null;
  ipAddress: null;
  userAgent: null;
  methodOfPaymentId: null;
  paymentProviderId: null;
  paymentTransactionId: null;
  initBook: null;
  endBook: null;
  listingRentId: null;
  breakdownInfo: null;
  calculationStatusId: number;
  consultAccepted: null;
  consultResponse: null;
  reasonRefusedId: null;
  userId: null;
  calculationStatus: null;
  reasonRefused: null;
  methodOfPayment: null;
  paymentProvider: null;
  paymentTransaction: null;
}

export const STATUS_ROUTES: Record<BookStatusEnum | 'default', string> = {
  [BookStatusEnum.PREBOOK]: '/prebook',
  [BookStatusEnum.APPROVED]: '/approved',
  [BookStatusEnum.RENTED]: '/rented',
  [BookStatusEnum.CANCELED]: '/canceled',
  [BookStatusEnum.NON_APPROVED]: '/non_approved',
  [BookStatusEnum.COMPLETED]: '/completed',
  [BookStatusEnum.RE_EXPIRED]: '/re_expired',
  default: '/detail',
};

const fetchBooks = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const response = await ApiService.get<{ data: Booking[] }>(
    '/Book/GetBooks/prebook,approved,rented'
  );
  return response.data;
};

const TripsGrid = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks,
  });
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (isLoading) return <TripsGridSkeleton count={3} />;
  if (isError) return <Typography>{t('trips.noRecords')}</Typography>;

  const handleViewDetail = (bookId: number, _statusId: BookStatusEnum) => {
    const fullPath = `/reservation/${bookId}`;
    navigate(fullPath);
  };

  return (
    <Box sx={{ px: 0, mt: 0, mb: 6 }}>
      <Stack spacing={2} mt={2}>
        {data?.length === 0 ? (
          <Box display={'flex'} justifyContent={'center'} sx={{ width: '100%' }}>
            <EmptyState
              title={t('pastTrips.emptyStates.travel.title')}
              description={t('pastTrips.emptyStates.travel.description')}
              icon={SearchIcon}
              buttonRoute={AssertRoutes.HOME}
            />
          </Box>
        ) : (
          data?.map((book) => {
            // Buscar la foto principal
            const primaryPhoto =
              book.photos.find((photo) => photo.isPrincipal)?.photoLink ||
              book.photos[0]?.photoLink ||
              'https://via.placeholder.com/400x300';

            // Formatear fechas
            const startDate = new Date(book.startDate);
            const endDate = new Date(book.endDate);
            const dateRange = `${startDate.getDate()} - ${endDate.getDate()} ${startDate.toLocaleDateString('es-ES', { month: 'long' })}, ${startDate.getFullYear()}`;

            return (
              <Card
                key={book.bookId}
                elevation={0}
                onClick={() => handleViewDetail(book.bookId, book.bookStatusId as BookStatusEnum)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '12px',
                  border: '1px solid #E0E0E0',
                  backgroundColor: '#FFFFFF',
                  overflow: 'visible',
                  padding: '12px',
                  '@media (min-width: 600px)': {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 2,
                    gap: 2,
                    overflow: 'hidden',
                  },
                }}
              >
                {/* Imagen - Arriba en mobile, izquierda en desktop */}
                <Box
                  component="img"
                  src={primaryPhoto}
                  alt={book.listingRent.name}
                  sx={{
                    width: '100%',
                    height: 180,
                    objectFit: 'cover',
                    borderRadius: '12px',
                    '@media (min-width: 600px)': {
                      width: 180,
                      height: 120,
                      borderRadius: '12px',
                      flexShrink: 0,
                    },
                  }}
                />
                {/* Contenedor de información */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '12px 0 0 0',
                    flex: 1,
                    gap: 1,
                    '@media (min-width: 600px)': {
                      padding: 0,
                      gap: 1,
                    },
                  }}
                >
                  {/* Título */}
                  <Box display={'flex'} gap={2} alignItems={'center'}>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 500,
                        fontSize: { xs: '14px', sm: '15px' },
                        color: '#111827',
                        lineHeight: 1.4,
                      }}
                    >
                      {book.listingRent.name}
                    </Typography>
                    <Box display={'flex'}>
                      {(() => {
                        const result = estadoColorReserva(
                          book.bookStatus?.code ?? '',
                          book?.checkin ?? '',
                          book?.checkout ?? ''
                        );
                        if (typeof result === 'string') return null;
                        return (
                          <Chip
                            label={result.estado}
                            sx={{
                              bgcolor: result.bg,
                              color: result.color,
                              height: { xs: 20, sm: 28 },
                              padding: { xs: '13px 8px' },
                              width: 'auto !important',
                              //marginBottom: '10px',
                            }}
                          />
                        );
                      })()}
                    </Box>
                  </Box>

                  {/* Fecha y Chip en la misma línea */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mt: 0.5 }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.8}
                      sx={{ color: '#6B7280' }}
                    >
                      <CalendarTodayOutlined sx={{ fontSize: { xs: 20, sm: 20 } }} />
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: { xs: '12px', sm: '13px' },
                          color: '#6B7280',
                        }}
                      >
                        {dateRange}
                      </Typography>
                    </Stack>
                    {/* Link de acción - centrado */}
                    <Link
                      component="button"
                      onClick={() =>
                        handleViewDetail(book.bookId, book.bookStatusId as BookStatusEnum)
                      }
                      underline="none"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.3,
                        color: theme.palette.primary.main,
                        fontWeight: 500,
                        fontSize: { xs: '12px', sm: '13px' },
                        fontFamily: 'Inter, sans-serif',
                        transition: 'opacity 0.2s',
                        mt: 1,
                        '@media (min-width: 600px)': {
                          justifyContent: 'flex-end',
                        },
                        '&:hover': {
                          opacity: 0.8,
                          cursor: 'pointer',
                        },
                      }}
                    >
                      {t('trips.card.viewDetail')}
                      <ChevronRight sx={{ fontSize: { xs: 14, sm: 16 } }} />
                    </Link>
                  </Stack>
                </Box>
              </Card>
            );
          })
        )}
      </Stack>
    </Box>
  );
};

export default TripsGrid;
