import { useState } from 'react';
import PastTripCard from '@/components/PastTripCard';
import PastTripSkeleton from '@/components/PastTripSkeleton';
import { useGet2 } from '@/hooks/api';
import useHandleRouteLink from '@/hooks/useHandleRouteLink';
import theme from '@/themes/theme';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Container from '@mui/material/Container';
import useMediaQuery from '@mui/material/useMediaQuery';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import EmptyState from '@/components/EmptyState';
import PlaylistRemoveOutlinedIcon from '@mui/icons-material/PlaylistRemoveOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import { AssertRoutes } from '@/common/enum/AssertRoutes';
import { GoBack } from '@/components/GoBack';

// Interfaces (las mantengo tal como las tenías)
export interface BookingsResponse {
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
  amountTotal: number;
  currencyId: number;
  mountPerNight?: number | null;
  amountFees?: number | null;
  nameRenter: string;
  lastNameRenter: string;
  termsAccepted: boolean;
  additionalInfo?: string | null;
  bookStatusId: number;
  isApprobal?: boolean | null;
  approvalDetails?: string | null;
  isManualApprobal?: boolean | null;
  daysToApproval?: number | null;
  initDate?: string | null;
  paymentCode: string;
  pk?: number | null;
  paymentId: string;
  depositSec?: number | null;
  pickUpLocation?: string | null;
  vggFee?: number | null;
  vggFeePercent?: number | null;
  calendarDays: any[];
  owner: Owner;
  photos: Photo[];
  listingRent: ListingRent;
  bookStatus: BookStatus;
}

export interface BookStatus {
  bookStatusId: number;
  name: string;
  description: string;
  code: string;
}

export interface Owner {
  name: string;
  lastName: string;
  favoriteName: string;
  photoLink: string;
  gender?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  phoneCode?: string | null;
  emergencyContact?: string | null;
  documents: any[];
  phones: any[];
  profilePhotos: any[];
  registerDate: string;
  registerDateDays?: number | null;
  registerDateMonths?: number | null;
  registerDateYears?: number | null;
}

export interface Photo {
  photoLink: string;
  isPrincipal: boolean;
  name: string;
  description: string;
  position: number;
  spaceType?: string | null;
  spaceTypeCode?: string | null;
  spaceTypeId?: number | null;
  listingPhotoId: number;
}

export interface ListingRent {
  listingRentId: number;
  status?: string | null;
  name: string;
  description: string;
  minimunRentalPerDay: number;
  approvalRequestDays: number;
  phoneNumber?: string | null;
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
  accomodationType?: string | null;
  approvalPolicy?: string | null;
  cancelationPolicy?: string | null;
  owner: Owner;
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
  stayPresences?: any | null;
  valoration: number;
  historyDate?: string | null;
  isFavorite: boolean;
}

export interface Property {
  latitude: number;
  longitude: number;
  address: Address;
  type?: string | null;
  distanceMeters: number;
}

export interface Address {
  zipCode?: string | null;
  address1?: string | null;
  address2?: string | null;
  cityId: number;
  countyId: number;
  stateId: number;
  city: City;
}

export interface City {
  cityId: number;
  city: string;
  state: string;
  stateCode?: string | null;
  country: string;
  countryCode?: string | null;
  county: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface Price {
  priceNightly?: number | null;
  securityDepositPrice?: number | null;
  currency?: string | null;
  currencyCode?: string | null;
  listingPriceId: number;
  listingRentId: number;
  listingPriceOfferId?: number | null;
  timeUnitId?: number | null;
  currencyId?: number | null;
  weekendNightlyPrice?: number | null;
  tlListingDiscountForRates: any[];
  specialDatePrices?: any | null;
}

const PastTrip = () => {
  const { t } = useTranslation();
  const handleRouteLink = useHandleRouteLink();
  const isLargeScreen = useMediaQuery('(min-width:1920px)');
  const [tabValue, setTabValue] = useState('completed');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  // Datos de viajes completados
  const {
    data: booking,
    isLoading: completedLoading,
    isError: completedError,
    error: completedErrorObj,
  } = useGet2(['past-trips'], '/Book/GetBooks/completed');

  // Datos de viajes cancelados
  const {
    data: cancelBooking,
    isLoading: canceledLoading,
    isError: canceledError,
    error: canceledErrorObj,
  } = useGet2(
    ['cancel-trips'],
    '/Book/GetBooks/canceled,re_expired,canceled_payed,canceled_assert,non_approved,re_canceled,book_expired'
  );

  // Datos de viajes cancelados
  const {
    data: reviewBooking,
    isLoading: reviewLoading,
    isError: reviewError,
    error: reviewErrorObj,
  } = useGet2(['review-trips'], '/Book/GetBooks/review');

  // Función para formatear rango de fechas
  const formatDateRange = (
    startDate: Date | string | null | undefined,
    endDate: Date | string | null | undefined
  ): string => {
    if (!startDate || !endDate) return '';
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

    if (
      !(start instanceof Date && !isNaN(start.getTime())) ||
      !(end instanceof Date && !isNaN(end.getTime()))
    ) {
      return '';
    }

    const startFormatted = format(start, 'd MMM', { locale: es });
    const endFormatted = format(end, 'd MMM yyyy', { locale: es });
    return `${startFormatted} - ${endFormatted}`;
  };

  // Agrupar viajes completados por año
  const bookingsByYear = Array.isArray(booking?.data)
    ? booking.data.reduce(
        (acc, item) => {
          const year = new Date(item.startDate).getFullYear();
          if (!acc[year]) acc[year] = [];
          acc[year].push(item);
          return acc;
        },
        {} as Record<number, Booking[]>
      )
    : {};

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

  if (completedError || canceledError || reviewError) {
    return (
      <Typography>
        Error:{' '}
        {(completedErrorObj || canceledErrorObj || reviewErrorObj)?.message ||
          t('pastTrips.errorLoading')}
      </Typography>
    );
  }

  return (
    <Container
      maxWidth={isLargeScreen ? 'xl' : 'lg'}
      sx={{ px: { xs: 2, sm: 4, md: isLargeScreen ? 5 : 4 }, mt: isMobile ? 1 : 6 }}
    >
      <Stack direction="column">
        {/* Título principal */}
        <Box
          sx={{
            width: '100%',
            mx: 'auto',
            px: { xs: 2, sm: 0 },
          }}
        >
          <Typography
            sx={{
              fontFamily: theme.typography.h2,
              color: theme.palette.text.primary,
            }}
          >
            {t('pastTrips.title')}
          </Typography>
        </Box>
        <Box>
          <GoBack />
        </Box>

        {/* Tabs */}
        <Box
          sx={{
            width: '100%',
            mx: 'auto',
            //    maxWidth: maxWidthConfig,
            px: { xs: 0, sm: '40px', md: 0 },
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="Tabs de viajes pasados"
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: theme.palette.primary.main,
                },
              }}
            >
              <Tab
                sx={{ textTransform: 'none' }}
                label={t('pastTrips.tabs.completed')}
                value="completed"
              />
              <Tab
                sx={{ textTransform: 'none' }}
                label={t('pastTrips.tabs.canceled')}
                value="canceled"
              />
              <Tab
                sx={{ textTransform: 'none' }}
                label={t('pastTrips.tabs.review')}
                value="review"
              />
            </Tabs>
          </Box>

          {/* Tab: Viajes completados */}
          {tabValue === 'completed' && (
            <Box sx={{ pt: 4 }}>
              {completedLoading ? (
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
                    alignItems: 'start',
                  }}
                >
                  {Array.from({ length: getSkeletonCount() }).map((_, index) => (
                    <Box key={index}>
                      <PastTripSkeleton />
                    </Box>
                  ))}
                </Box>
              ) : Object.keys(bookingsByYear).length === 0 ? (
                <EmptyState
                  title={t('pastTrips.emptyStates.completed.title')}
                  description={t('pastTrips.emptyStates.completed.description')}
                  icon={DoneOutlinedIcon}
                  buttonRoute={AssertRoutes.HOME}
                />
              ) : (
                Object.entries(bookingsByYear)
                  .sort(([a], [b]) => Number(b) - Number(a))
                  .map(([year, trips]) => (
                    <Stack key={year} spacing={2} mb={5}>
                      <Box display="flex" justifyContent="flex-start">
                        <Chip
                          label={year}
                          variant="filled"
                          sx={{
                            fontSize: theme.typography.h6Bold,
                            padding: '18px 15px',
                            backgroundColor: 'rgba(91, 76, 160, 0.1)',
                            color:
                              theme.palette.customColors?.primary?.[1] ||
                              theme.palette.primary.main,
                          }}
                        />
                      </Box>
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
                          alignItems: 'start',
                        }}
                      >
                        {(trips as Booking[]).map((item, index) => {
                          const primaryPhoto =
                            item.photos.find((photo) => photo.isPrincipal) || item.photos[0];
                          const photoArray = primaryPhoto ? [primaryPhoto] : [];

                          return (
                            <Box key={item.bookId || index}>
                              <PastTripCard
                                status={item.bookStatus?.code ?? 'completed'}
                                imageUrl={photoArray}
                                name={item.listingRent.name}
                                location={
                                  `${item.listingRent.property.address.city.city}, ${item.listingRent.property.address.city.country || 'Bolivia'}` ||
                                  t('pastTrips.unknownCountry')
                                }
                                date={formatDateRange(item.startDate, item.endDate)}
                                onClick={() => handleRouteLink(`/reservation/${item.bookId}`)}
                              />
                            </Box>
                          );
                        })}
                      </Box>
                    </Stack>
                  ))
              )}
            </Box>
          )}

          {/* Tab: Reservas canceladas */}
          {tabValue === 'canceled' && (
            <Box sx={{ pt: 4 }}>
              {canceledLoading ? (
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
                    alignItems: 'start',
                  }}
                >
                  {Array.from({ length: getSkeletonCount() }).map((_, index) => (
                    <Box key={index}>
                      <PastTripSkeleton />
                    </Box>
                  ))}
                </Box>
              ) : !Array.isArray(cancelBooking?.data) || cancelBooking.data.length === 0 ? (
                <EmptyState
                  title={t('pastTrips.emptyStates.canceled.title')}
                  description={t('pastTrips.emptyStates.canceled.description')}
                  icon={PlaylistRemoveOutlinedIcon}
                  buttonRoute={AssertRoutes.HOME}
                />
              ) : (
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
                    alignItems: 'start',
                  }}
                >
                  {cancelBooking.data.map((item: Booking, index: number) => {
                    const primaryPhoto =
                      item.photos?.find((photo: Photo) => photo.isPrincipal) || item.photos?.[0];
                    const photoArray = primaryPhoto ? [primaryPhoto] : [];

                    return (
                      <Box key={item.bookId || index}>
                        <PastTripCard
                          status={item.bookStatus?.code}
                          imageUrl={photoArray}
                          name={item.listingRent.name}
                          location={
                            `${item.listingRent.property.address.city.city}, ${item.listingRent.property.address.city.country || 'Bolivia'}` ||
                            t('pastTrips.unknownCountry')
                          }
                          date={formatDateRange(item.startDate, item.endDate)}
                          onClick={() => handleRouteLink(`/reservation/${item.bookId}`)}
                        />
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
          )}

          {/* Tab: Reservas observados */}
          {tabValue === 'review' && (
            <Box sx={{ pt: 4 }}>
              {reviewLoading ? (
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
                    alignItems: 'start',
                  }}
                >
                  {Array.from({ length: getSkeletonCount() }).map((_, index) => (
                    <Box key={index}>
                      <PastTripSkeleton />
                    </Box>
                  ))}
                </Box>
              ) : !Array.isArray(reviewBooking?.data) || reviewBooking.data.length === 0 ? (
                <EmptyState
                  title={t('pastTrips.emptyStates.review.title')}
                  description={t('pastTrips.emptyStates.review.description')}
                  icon={PlaylistRemoveOutlinedIcon}
                  buttonRoute={AssertRoutes.HOME}
                />
              ) : (
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
                    alignItems: 'start',
                  }}
                >
                  {reviewBooking?.data.map((item: Booking, index: number) => {
                    const primaryPhoto =
                      item.photos?.find((photo: Photo) => photo.isPrincipal) || item.photos?.[0];
                    const photoArray = primaryPhoto ? [primaryPhoto] : [];

                    return (
                      <Box key={item.bookId || index}>
                        <PastTripCard
                          status={item.bookStatus?.code || 'review'}
                          //status={t('pastTrips.status.canceled')}
                          imageUrl={photoArray}
                          name={item.listingRent.name}
                          location={
                            `${item.listingRent.property.address.city.city}, ${item.listingRent.property.address.city.country || 'Bolivia'}` ||
                            t('pastTrips.unknownCountry')
                          }
                          date={formatDateRange(item.startDate, item.endDate)}
                          onClick={() => handleRouteLink(`/reservation/${item.bookId}`)}
                        />
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Stack>
    </Container>
  );
};

export default PastTrip;
