import { useState } from 'react';
import { AssertRoutes } from '@/common/enum/AssertRoutes';
import useHandleRouteLink from '@/hooks/useHandleRouteLink';
import { ApiService } from '@/services/ApiService';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useQuery } from '@tanstack/react-query';
import Maleta from '../assets/maleta.png';
import TripsGrid from '@/components/TripsGrid';
import CardWithoutReview from '@/components/CardWithoutReview';
import CardWithoutReviewSkeleton from '@/components/CardWithoutReviewSkeleton';
import { useGet2 } from '@/hooks/api';
import { useTranslation } from 'react-i18next';
import EmptyState from '@/components/EmptyState';
import LuggageIcon from '@mui/icons-material/Luggage';
import GradingIcon from '@mui/icons-material/Grading';
import { GoBack } from '@/components/GoBack';
// import SearchIcon from '@mui/icons-material/Search';

export interface ApiResponse {
  data: Booking[];
  statusCode: string;
  hasError: boolean;
  resultError: any;
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
  termsAccepted: boolean;
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
  bookStatus: null;
  cancellationUser: null;
  userIdRenterNavigation: User;
  currency: null;
  reasonRefused: null;
  tlListingReviews: any[];
  authorizationDateTime: string;
  authTimeElapsed: null;
  reviewDateTime: string;
  checkinStatus: boolean;
  checkoutStatus: boolean;
  payPriceCalculations: any[];
  datetimePayment: string;
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

const Travel = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const handleRouteLink = useHandleRouteLink();
  const isLargeScreen = useMediaQuery('(min-width:1920px)');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data: booking } = useGet2(['past-trips-home'], '/Book/GetBooks/completed');

  async function fetchBooksWithoutReview() {
    try {
      return await ApiService.get<ApiResponse>('/Book/GetBooksWithoutReview');
    } catch (error) {
      console.error('Error fetching books without review:', error);
      throw error;
    }
  }

  const {
    data: booksWithoutReview,
    isLoading: isLoadingProperty,
    isError,
    error,
  } = useQuery<ApiResponse>({
    queryKey: ['booksWithoutReview'],
    queryFn: fetchBooksWithoutReview,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const [tabValue, setTabValue] = useState('1');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  if (isError) {
    return <Typography>Error: {error?.message || t('travel.errorLoading')}</Typography>;
  }

  const getSkeletonCount = () => {
    if (isLargeScreen) {
      return 12; // xl: 4 cards por fila × 3 filas
    }
    if (window.innerWidth >= 900) {
      return 9; // md: 3 cards por fila × 3 filas
    }
    if (window.innerWidth >= 600) {
      return 4; // sm: 2 cards por fila × 2 filas
    }
    return 2; // xs: 1 card por fila × 2 filas
  };

  return (
    <Container
      maxWidth={isLargeScreen ? 'xl' : 'lg'}
      sx={{ px: { xs: 2, sm: 4, md: isLargeScreen ? 5 : 4 }, mt: isMobile ? 1 : 6 }}
    >
      <Box
        sx={{
          width: '100%',
          mx: 'auto',
          // px: { xs: 1, sm: 4, md: 2 },
        }}
      >
        <Typography
          sx={{
            fontFamily: theme.typography.h2,
            color: theme.palette.text.primary,
          }}
        >
          {t('travel.title')}
        </Typography>
      </Box>
      <Box>
        <GoBack />
      </Box>

      {/* Tabs y contenido */}
      <Box
        sx={{
          width: '100%',
          mx: 'auto',
          px: { xs: 0, sm: 4, md: 0 },
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="Tabs de viajes"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: theme.palette.primary.main,
              },
            }}
          >
            <Tab sx={{ textTransform: 'none' }} label={t('travel.reservations')} value="1" />
            <Tab sx={{ textTransform: 'none' }} label={t('travel.pendingReviews')} value="2" />
          </Tabs>
        </Box>

        {/* Contenido Tab 1: Viajes actuales */}
        {tabValue === '1' && (
          <Box sx={{ pt: isMobile ? 1 : 4 }}>
            {booksWithoutReview && !isLoadingProperty ? (
              <>
                <TripsGrid />
              </>
            ) : !isLoadingProperty ? (
              <>
                <Box
                  sx={{ gridColumn: '1 / -1' }}
                  width={'100%'}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <EmptyState
                    title={t('travel.noReservationsTitle')}
                    description={t('travel.noReservationsDescription')}
                    icon={LuggageIcon}
                    buttonRoute={AssertRoutes.HOME}
                    buttonLabel={t('travel.exploreLodgings')}
                  />
                </Box>
              </>
            ) : null}
          </Box>
        )}

        {/* Contenido Tab 2: Reseñas pendientes */}
        {tabValue === '2' && (
          <Box sx={{ pt: 6 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(auto-fill, minmax(200px, 1fr))',
                  sm: 'repeat(auto-fill, minmax(200px, 1fr))',
                  md: 'repeat(auto-fill, minmax(260px, 1fr))',
                  lg: 'repeat(auto-fill, minmax(280px, 1fr))',
                },
                gap: { xs: 2, sm: 3, md: 3 },
                py: 2,
                alignItems: 'start',
              }}
            >
              {isLoadingProperty ? (
                Array.from({ length: getSkeletonCount() }).map((_, index) => (
                  <Box key={index} py={2}>
                    <CardWithoutReviewSkeleton />
                  </Box>
                ))
              ) : Array.isArray(booksWithoutReview?.data) && booksWithoutReview?.data.length > 0 ? (
                booksWithoutReview.data.map((item, index) => {
                  const primaryPhoto =
                    item.photos.find((photo) => photo.isPrincipal)?.photoLink ||
                    item.photos[0]?.photoLink ||
                    'https://via.placeholder.com/400x300';

                  return (
                    <Box key={index}>
                      <CardWithoutReview
                        bookId={item.bookId}
                        imageUrl={primaryPhoto}
                        title={item.listingRent.name || t('travel.unknownProperty')}
                        subtitle={t('travel.howWasStay')}
                        checkInDate={item.startDate}
                        checkOutDate={item.endDate}
                        address={item.listingRent?.property?.address?.city?.city || ''}
                        country={item.listingRent?.property?.address?.city?.country || ''}
                      />
                    </Box>
                  );
                })
              ) : (
                <Box
                  sx={{ gridColumn: '1 / -1' }}
                  width={'100%'}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <EmptyState
                    title={t('travel.noReviewsFound')}
                    description={t('travel.noReviewsDescription')}
                    icon={GradingIcon}
                    buttonRoute={AssertRoutes.HOME}
                    buttonLabel={t('travel.exploreLodgings')}
                  />
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
      {/* Sección de viajes pasados (siempre visible si hay datos) */}
      {booking && (
        <ButtonBase
          sx={{
            width: '100%',
            mt: 8,
            mx: 'auto',
            px: { xs: '0px', sm: '40px', md: 0 },
          }}
          onClick={() => handleRouteLink(AssertRoutes.PAST_TRIPS)}
        >
          <Paper
            elevation={0}
            sx={{
              width: '100%',
              px: { xs: 2, sm: 4 },
              py: { xs: 3, sm: 4 },
              borderRadius: 4,
              backgroundColor: '#f8f8f8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' },
              textAlign: { xs: 'center', sm: 'left' },
              gap: 3,
              boxShadow: '0.1px 0px 1px gray',
            }}
          >
            <Box display="flex" alignItems="center">
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {t('travel.findPastTrips')}
              </Typography>
              <ArrowForwardIosIcon fontSize="small" sx={{ ml: 1 }} />
            </Box>
            <Box
              component="img"
              src={Maleta}
              alt="maleta"
              sx={{ width: 80, height: 80, cursor: 'pointer' }}
            />
          </Paper>
        </ButtonBase>
      )}
    </Container>
  );
};

export default Travel;
