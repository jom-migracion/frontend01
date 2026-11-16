import AboutSpaceModal from '@/components/AboutSpaceModal';
import AmenityDialog from '@/components/AmenityDialog';
import BookingCard from '@/components/BookingCard';
import BookingDisponibilityCard from '@/components/BookingDisponibilityCard';
import DetailPropertySkeleton from '@/components/DetailPropertySkeleton';
import ExpandableAmenities from '@/components/ExpandableAmenities';
import ExpandableText from '@/components/ExpandableText';
import HostInfoCard from '@/components/HostInfoCard';
import ModalPhotoGallery from '@/components/ModalPhotoGallery';
import ReviewModal from '@/components/ReviewModal';
import RoomSpace from '@/components/RoomSpace';
import Section from '@/components/Section';
import SectionRentModal from '@/components/SectionRentModal';
import SectionSecurityModal from '@/components/SectionSecurityModal';
import SignInForm from '@/components/SignInForm';
import SummaryHostInfo from '@/components/SummaryHostInfo';
import { useGet2 } from '@/hooks/api';
import ResponseAssert from '@/models/interfaces/backend/ResponseAssert';
// import AuthRegistrationForm from '@/modules/_auth/components/AuthRegistrationForm';
import { useAuthContext } from '@/modules/_auth/context';
import { ApiService } from '@/services/ApiService';
import countLines from '@/utilities/countLines';
import StarIcon from '@mui/icons-material/Star';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardMedia,
  Divider,
  IconButton,
  // Modal,
  Rating,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import { useMutation } from '@tanstack/react-query';
import { es } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { DateRange, Range, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useTranslation } from 'react-i18next';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router';

interface Guests {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

interface SearchFormStorage {
  CityName?: string;
  typeDesc?: string;
  CityId?: number;
  CheckInDate?: string;
  CheckOutDate?: string;
  Guests?: Guests;
  pageNumber?: number;
  pageSize?: number;
}

interface ListingData {
  listingRentId: number;
  status: string | null;
  name: string;
  description: string;
  minimunRentalPerDay: number;
  approvalRequestDays: number;
  phoneNumber: string | null;
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
  accomodationType: AccomodationType;
  approvalPolicy: ApprovalPolicy;
  cancelationPolicy: CancelationPolicy;
  owner: Owner;
  property: Property;
  price: Price;
  checkInOutPolicies: CheckInOutPolicy[];
  amenities: Amenity[];
  featuredAspects: any; // Puede ajustarse según estructura real
  photos: Photo[];
  rentRules: RentRule[];
  reviews: Review[];
  securityItems: SecurityItem[];
  spaces: Space[];
  stayPresences: any; // Puede ajustarse
  valoration: number;
  historyDate: string | null;
  isFavorite: boolean;
}

// Subtipos (mismos que en el código original)
interface AccomodationType {
  accommodationName: string;
  accommodationDescription: string;
  accommodationTypeId: number;
  accomodationCode: string;
}

interface ApprovalPolicy {
  code: string;
  name: string;
  description: string;
  isRecommended: boolean;
  status: boolean;
  approvalPolicyTypeId: number;
}

interface CancelationPolicy {
  code: string;
  name: string;
  detail1: string;
  refoundUpToPercentage: number;
  refoundUpToDays: number;
  detail2: string | null;
  discountPercentage: number;
  withinDays: number;
  status: boolean;
  cancelationPolicyTypeId: number;
}

interface Owner {
  name: string;
  lastName: string;
  favoriteName: string | null;
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
  registerDateDays: number;
  registerDateMonths: number;
  registerDateYears: number;
}

interface Property {
  latitude: number;
  longitude: number;
  address: Address;
  type: PropertyType;
  distanceMeters: number;
}

interface Address {
  zipCode: string | null;
  address1: string | null;
  address2: string | null;
  cityId: number;
  countyId: number;
  stateId: number;
  city: City;
}

interface City {
  city: string;
  state: string;
  stateCode: string | null;
  country: string;
  countryCode: string | null;
  county: string;
}

interface PropertyType {
  subTypeCode: string;
  subType: string;
  subTypeIcon: string;
  type: string;
  typeCode: string;
  typeIcon: string | null;
  propertySubtypeId: number;
}

interface Price {
  priceNightly: number;
  securityDepositPrice: number;
  currency: string | null;
  currencyCode: string | null;
  tlListingDiscountForRates: DiscountForRate[];
  specialDatePrices: any; // puede ser objeto o lista
}

interface DiscountForRate {
  code: string;
  days: number;
  question: string;
  porcentageSuggest: number;
  suggestDescription: string | null;
  discountTypeForTypePriceId: number;
  listingDiscountForRate: number;
  listingRentId: number;
  discountCalculated: number;
  porcentage: number;
  isDiscount: boolean;
}

interface CheckInOutPolicy {
  checkInTime: string;
  checkOutTime: string;
  maxCheckInTime: string | null;
  flexibleCheckIn: boolean;
  flexibleCheckOut: boolean;
  lateCheckInFee: number;
  lateCheckOutFee: number;
  instructions: string;
  checkInTime_Str: string;
  checkOutTime_Str: string;
  maxCheckInTime_Str: string | null;
}

interface Amenity {
  value: boolean | null;
  valueString: string | null;
  isPremium: boolean;
  typeCode: string;
  type: string;
  iconLink: string;
  amenitiesTypeId: number;
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

interface Review {
  user: string | null;
  dateTimeReview: string;
  calification: number;
  comment: string;
  userProfilePhoto: string | null;
}

interface SecurityItem {
  value: boolean;
  valueString: string;
  code: string;
  name: string;
  iconLink: string | null;
  description: string;
  securityItemTypeId: number;
}

interface Space {
  count: number;
  code: string;
  name: string;
  description: string;
  icon: string;
}

interface CalendarDay {
  date: string;
  price: number;
  blockType: number;
  blockReason: string;
  bookId: number;
  minimumStay: number;
  maximumStay: number;
  discounts: null | any; // Adjust 'any' to a specific type if discounts structure is known
  blockTypeName: string;
}

// interface Pagination {
//   totalItemCount: number;
//   totalPageCount: number;
//   pageSize: number;
//   currentPage: number;
//   hasPrevious: boolean;
//   hasNext: boolean;
// }

interface CalendarResponse {
  //  data: Calendar;
  calendarDays: CalendarDay[];
  statusCode: string;
  hasError: boolean;
  resultError: null | string;
}

interface CardProperty {
  id: number;
  title: string;
  location: string;
  date: string;
  authorName: string;
  authorLocation: string;
  authorAvatarUrl: string;
  imageUrl: string;
  description?: string;
}

const getRuleValue = (rules: any[] | undefined, code: string): string | null => {
  if (!Array.isArray(rules) || !code) return null;
  const rule = rules.find((r) => r?.code === code);
  return rule?.valueString ?? null;
};

const PropertyDetail: React.FC<{ property: CardProperty; onClose: () => void }> = ({
  property,
  onClose,
}) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const [openReview, setOpenReview] = useState(false);
  const [openAboutSpace, setOpenAboutSpace] = useState(false);
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagens, setImagens] = useState<string[]>([]);
  const [disponibility, setDisponibility] = useState<boolean>(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userId, setUserId] = useState<number>(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isModalLogin, setIsModalLogin] = useState(false);
  const [loginType, setLoginType] = useState<'registration' | 'login'>('login');
  const { isGuestAuthenticated } = useAuthContext();

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  const currentDate = new Date();
  const oneYearLater = new Date();
  oneYearLater.setFullYear(currentDate.getFullYear() + 1);

  const {
    data: detailProperty,
    isLoading: isLoadingProperty,
    isError,
    error,
    refetch,
  } = useGet2<ListingData>(
    ['detailProperty', property.id],
    true ? `/ListingRent/${property.id}` : `/Host/ListingRent/${property.id}` // previewListing fijo en true para modo preview
  );
  const pets = useMemo(() => {
    return getRuleValue(detailProperty?.data?.rentRules, 'ALLOW_PETS');
  }, [detailProperty?.data?.rentRules]);

  const { data: CalendarDates } = useGet2<CalendarResponse>(
    ['calendar', detailProperty?.data?.listingRentId],
    detailProperty?.data?.listingRentId ? `/Calendar/${detailProperty?.data?.listingRentId}` : '',
    {
      startDate: formatDate(currentDate),
      endDate: formatDate(oneYearLater),
      pageNumber: 1,
      pageSize: 30,
    },
    !!detailProperty?.data?.listingRentId
  );

  const disabledDates =
    CalendarDates?.data?.calendarDays
      ?.filter((day: CalendarDay) => day.blockType === 2)
      .map((day: CalendarDay) => {
        const d = new Date(day.date);
        d.setHours(0, 0, 0, 0);
        return d;
      }) || [];

  type ProfileResponse = { userId: number };

  const GetProfile = async () => {
    return ApiService.post<ResponseAssert<ProfileResponse>>('/GetProfile');
  };
  const mutation = useMutation<ResponseAssert<ProfileResponse>>({
    mutationFn: GetProfile,
    onSuccess: (data) => {
      setUserId(data?.data?.userId || 0);
    },
  });

  useEffect(() => {}, [CalendarDates]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await ApiService.get<{ data: Review[] }>(
          `/ListingRent/${property.id}/Reviews`
        );
        setReviews(response.data);
      } catch (error) {
        console.error('Error al cargar reseñas:', error);
      }
    };

    if (property.id) {
      fetchReviews();
      mutation.mutate();
    }
  }, [property.id]);

  useEffect(() => {
    if (detailProperty?.data?.photos && detailProperty.data.photos.length > 0) {
      const photoLinks = detailProperty.data.photos.map((photo) => photo.photoLink);
      setImagens(photoLinks);
    } else {
      setImagens(Array(5).fill('https://via.placeholder.com/200'));
    }
  }, [detailProperty]);

  const today = new Date();
  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(today.getDate() + 6);

  const [selectionRange, setSelectionRange] = useState<Range>(() => {
    // 1) URL params → each tab / panel instance is independent
    const urlCheckIn = searchParams.get('checkIn');
    const urlCheckOut = searchParams.get('checkOut');
    if (urlCheckIn && urlCheckOut) {
      const startDate = new Date(urlCheckIn + 'T00:00:00');
      const endDate = new Date(urlCheckOut + 'T00:00:00');
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && startDate <= endDate) {
        return { startDate, endDate, key: 'selection' };
      }
    }
    // 2) localStorage fallback
    try {
      const storedData = localStorage.getItem('search-form-storage');
      if (storedData) {
        const parsed: SearchFormStorage = JSON.parse(storedData);
        if (parsed.CheckInDate && parsed.CheckOutDate) {
          const startDate = new Date(parsed.CheckInDate);
          const endDate = new Date(parsed.CheckOutDate);
          if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && startDate <= endDate) {
            return { startDate, endDate, key: 'selection' };
          }
        }
      }
    } catch {}
    return { startDate: today, endDate: sevenDaysLater, key: 'selection' };
  });

  const [guests, setGuests] = useState<Guests>(() => {
    // 1) URL params — supports adtCount/chdCount (search results) and adults/children (card)
    const urlAdults = searchParams.get('adtCount') ?? searchParams.get('adults');
    const urlChildren = searchParams.get('chdCount') ?? searchParams.get('children');
    const urlInfants = searchParams.get('infCount') ?? searchParams.get('infants');
    const urlPets = searchParams.get('petsCount') ?? searchParams.get('pets');
    if (urlAdults !== null) {
      return {
        adults: Math.max(1, parseInt(urlAdults) || 1),
        children: Math.max(0, parseInt(urlChildren ?? '0') || 0),
        infants: Math.max(0, parseInt(urlInfants ?? '0') || 0),
        pets: Math.max(0, parseInt(urlPets ?? '0') || 0),
      };
    }
    // 2) localStorage fallback
    try {
      const storedData = localStorage.getItem('search-form-storage');
      if (storedData) {
        const parsed: SearchFormStorage = JSON.parse(storedData);
        if (parsed.Guests) {
          return {
            adults: parsed.Guests.adults || 1,
            children: parsed.Guests.children || 0,
            infants: parsed.Guests.infants || 0,
            pets: parsed.Guests.pets || 0,
          };
        }
      }
    } catch {}
    return { adults: 1, children: 0, infants: 0, pets: 0 };
  });

  const travelers = guests.adults + guests.children;

  const handleSelect = (ranges: RangeKeyDict) => {
    const newRange = ranges.selection;
    if (newRange.startDate && newRange.endDate && newRange.startDate <= newRange.endDate) {
      setSelectionRange(newRange);
    }
  };

  const handleClear = () => {
    setSelectionRange({ startDate: today, endDate: sevenDaysLater, key: 'selection' });
    setGuests({ adults: 1, children: 0, infants: 0, pets: 0 });
  };

  const toggleFavorite = (isFavoriteProperty: boolean | undefined, id: number | undefined) => {
    if (!isGuestAuthenticated) {
      setIsModalLogin(true);
      setLoginType('login');
    } else {
      if (isFavoriteProperty) {
        deleteFromFavorite(id);
      } else {
        addToFavorite(id);
      }
    }
  };

  const deleteFromFavorite = async (id: number | undefined) => {
    try {
      await ApiService.delete(`/ListingRent/Favorite/${id}`);
      refetch();
    } catch (error) {
      console.error(`Error al eliminar el favorito con ID: ${id}`, error);
    }
  };

  const addToFavorite = async (id: number | undefined) => {
    try {
      await ApiService.post(`/ListingRent/Favorite/${id}`);
      refetch();
    } catch (error) {
      console.error(`Error al añadir el favorito con ID: ${id}`, error);
    }
  };

  if (isLoadingProperty) return <DetailPropertySkeleton />;
  if (isError) return <Alert severity="error">Error loading property: {error.message}</Alert>;

  const handleCloseModal = () => {
    setIsModalLogin(false);
  };

  return (
    <Box p={3}>
      <Stack direction="column" sx={{ mx: { xs: 1, md: 3 }, my: 3 }}>
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          gap={2}
          mb={2}
        >
          <Box flex={1}>
            <Typography sx={{ fontFamily: theme.typography.h4Medium }}>
              {`${detailProperty?.data?.name} - ${detailProperty?.data?.property?.address?.city?.state ?? detailProperty?.data?.property?.address?.city?.city ?? ''}`}
            </Typography>
            <Box display="flex" alignItems="flex-end" mt={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <StarIcon sx={{ color: 'primary.main', fontSize: '1.5em' }} />
                <Typography sx={{ fontFamily: theme.typography.paragraph1SRegular }}>
                  {`${Math.floor(detailProperty?.data?.valoration == undefined ? 0 : detailProperty?.data?.valoration * 10) / 10} - ( ${detailProperty?.data?.reviews?.length} ${t('propertyDetail.reviews.count')} )`}
                </Typography>
              </Stack>
            </Box>
          </Box>
          <IconButton
            onClick={() =>
              toggleFavorite(detailProperty?.data?.isFavorite, detailProperty?.data?.listingRentId)
            }
            sx={{
              backgroundColor: '#f5f5f5',
              p: isMobile ? 0.5 : 1,
              transition: 'transform 0.3s ease',
              transform: detailProperty?.data?.isFavorite ? 'scale(1.3)' : 'scale(1)',
              alignSelf: { xs: 'flex-start', sm: 'flex-end' },
              mt: { xs: 1, sm: 0 },
              '& svg': {
                fontSize: isMobile ? '1.5rem' : '2rem',
              },
            }}
          >
            {detailProperty?.data?.isFavorite ? (
              <IoMdHeart color="#000" />
            ) : (
              <IoMdHeartEmpty color="#a5a2a2" />
            )}
          </IconButton>
        </Box>

        {/* Galería de imágenes */}
        <Grid container spacing={2} mb={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: { xs: 220, sm: 360, md: 600 } }}>
              <CardMedia
                component="img"
                height="100%"
                image={imagens[0] ?? 'https://via.placeholder.com/200'}
                alt={''}
                sx={{ objectFit: 'cover', height: '100%', cursor: 'pointer', bgcolor: '#e3e3e3' }}
                onClick={() => setOpen(true)}
              />
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={2}>
              {imagens.length > 1
                ? imagens.slice(1, 5).map((img, index) => (
                    <Grid size={{ xs: 6 }} key={index}>
                      <Card sx={{ height: { xs: 100, sm: 150, md: 292 } }}>
                        <CardMedia
                          component="img"
                          height="100%"
                          image={img}
                          alt={``}
                          sx={{
                            objectFit: 'cover',
                            height: '100%',
                            cursor: 'pointer',
                            bgcolor: '#e3e3e3',
                          }}
                          onClick={() => setOpen(true)}
                        />
                      </Card>
                    </Grid>
                  ))
                : Array(4)
                    .fill('https://via.placeholder.com/200')
                    .map((img, index) => (
                      <Grid size={{ xs: 6 }} key={index}>
                        <Card sx={{ height: { xs: 100, sm: 150, md: 292 } }}>
                          <CardMedia
                            component="img"
                            height="100%"
                            image={img}
                            alt={``}
                            sx={{
                              objectFit: 'cover',
                              height: '100%',
                              cursor: 'pointer',
                              bgcolor: '#e3e3e3',
                            }}
                            onClick={() => setOpen(true)}
                          />
                        </Card>
                      </Grid>
                    ))}
              <ModalPhotoGallery
                images={
                  imagens.length > 0
                    ? imagens.map((src) => ({ src }))
                    : [{ src: 'https://via.placeholder.com/200' }]
                }
                index={0}
                open={open}
                onClose={() => setOpen(false)}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Detalles y reserva */}
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Box>
              <SummaryHostInfo
                title={detailProperty?.data?.accomodationType?.accommodationName ?? 'Monoambiente'}
                location={`${detailProperty?.data?.property?.address?.city?.city ?? ''}, ${detailProperty?.data?.property?.address?.city?.country ?? ''}`}
                hostName={`${detailProperty?.data?.owner?.name ?? ''} ${detailProperty?.data?.owner?.lastName ?? ''}`}
                hostingTime={`${detailProperty?.data?.owner?.registerDateMonths}`}
              />
            </Box>
            <Box mt={4}>
              <Divider sx={{ my: 3 }} />
              <Typography sx={{ fontFamily: theme.typography.h5Medium }}>
                {t('propertyDetail.description.title')}
              </Typography>
              <RoomSpace
                bedrooms={detailProperty?.data?.bedrooms}
                bathrooms={detailProperty?.data?.bathrooms}
                beds={detailProperty?.data?.beds}
              />
              <ExpandableText text={detailProperty?.data?.description} />
              {countLines(detailProperty?.data?.description) < 4 ? (
                ' '
              ) : (
                <Box mt={2}>
                  <Button
                    sx={{ textTransform: 'none' }}
                    variant="outlined"
                    onClick={() => setOpenAboutSpace(true)}
                  >
                    {t('propertyDetail.description.aboutSpace')}
                  </Button>
                </Box>
              )}
              <AboutSpaceModal
                description={detailProperty?.data?.description}
                open={openAboutSpace}
                onClose={() => setOpenAboutSpace(false)}
              />
              <Divider sx={{ my: 3 }} />
              <Typography sx={{ fontFamily: theme.typography.h5Medium }}>
                {t('propertyDetail.amenities.title')}
              </Typography>
              <ExpandableAmenities items={detailProperty?.data?.amenities} />
              {Array.isArray(detailProperty?.data?.amenities) &&
              detailProperty?.data?.amenities?.length > 3 ? (
                <Button
                  sx={{ textTransform: 'none', mt: 1 }}
                  variant="outlined"
                  onClick={() => setIsModalOpen(true)}
                >
                  {t('propertyDetail.amenities.viewMore')}
                </Button>
              ) : detailProperty?.data?.amenities?.length === 0 ? (
                <Typography
                  sx={{ fontFamily: theme.typography.paragraph1Regular }}
                  textAlign="justify"
                >
                  {t('propertyDetail.amenities.noAmenities')}
                </Typography>
              ) : (
                ''
              )}
              <AmenityDialog
                open={isModalOpen}
                amenities={(detailProperty?.data?.amenities || []) as any}
                onClose={() => setIsModalOpen(false)}
              />
              <Divider sx={{ my: 3 }} />
              <Typography sx={{ fontFamily: theme.typography.h5Medium }}>
                {t('propertyDetail.booking.selectCheckIn')}
              </Typography>
              <Typography sx={{ fontFamily: theme.typography.paragraph1Regular }} mb={2}>
                {t('propertyDetail.booking.addDates')}
              </Typography>
              <Box sx={{ pb: 2, maxWidth: '660px', display: 'flex', flexDirection: 'column' }}>
                <DateRange
                  ranges={[selectionRange]}
                  onChange={handleSelect}
                  months={2}
                  direction="horizontal"
                  rangeColors={
                    selectionRange.startDate && selectionRange.endDate ? ['#000'] : ['transparent']
                  }
                  showDateDisplay={false}
                  locale={es}
                  disabledDay={(date) =>
                    disabledDates.some(
                      (d: Date) =>
                        date.getFullYear() === d.getFullYear() &&
                        date.getMonth() === d.getMonth() &&
                        date.getDate() === d.getDate()
                    )
                  }
                  minDate={new Date()}
                  editableDateInputs={false}
                />
                <Button
                  variant="outlined"
                  onClick={handleClear}
                  sx={{ mt: 2, textTransform: 'none', width: '140px' }}
                  disabled={!selectionRange.startDate || !selectionRange.endDate}
                >
                  {t('propertyDetail.booking.clearDates')}
                </Button>
              </Box>
              <Divider sx={{ my: 3 }} />
              <Typography sx={{ fontFamily: theme.typography.h5Medium, mb: 2 }}>
                {t('propertyDetail.reviews.title')}
              </Typography>
              {reviews.length > 0 ? (
                <>
                  <Box sx={{ maxHeight: 'auto', overflowY: 'auto' }}>
                    <Box mb={3}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          src={reviews[0].userProfilePhoto as string | undefined}
                          alt={reviews[0].user as string | undefined}
                        />
                        <Box>
                          <Typography
                            sx={{
                              fontFamily: theme.typography.paragraph1Medium,
                              color: theme.palette.customColors.primary[1],
                            }}
                          >
                            {reviews[0].user}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: theme.typography.paragraph1Regular,
                              color: theme.palette.customColors.secondary[2],
                            }}
                          >
                            Cochabamba, Bolivia
                          </Typography>
                        </Box>
                      </Box>
                      <Stack direction="row" spacing={1} mt={1} alignItems="center">
                        <Rating
                          value={reviews[0].calification}
                          readOnly
                          size="small"
                          sx={{ color: 'black' }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(reviews[0].dateTimeReview).toLocaleDateString()}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: theme.typography.small1SRegular,
                            color: theme.palette.customColors.secondary[2],
                          }}
                        >
                          {t('propertyDetail.reviews.oneNightStay')}
                        </Typography>
                      </Stack>
                      <Typography sx={{ fontFamily: theme.typography.paragraph1SRegular }} mt={1}>
                        {reviews[0].comment}
                      </Typography>
                      <Box mt={2}>
                        <Button
                          sx={{ textTransform: 'none' }}
                          variant="outlined"
                          onClick={() => setOpenReview(true)}
                        >
                          {t('propertyDetail.reviews.viewReviews')}
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                  <ReviewModal
                    open={openReview}
                    onClose={() => setOpenReview(false)}
                    reviews={reviews}
                    rating={detailProperty?.data?.valoration ?? 0}
                    hostingTime={`${detailProperty?.data?.owner?.registerDateMonths ?? 0}`}
                  />
                </>
              ) : reviews.length == 0 ? (
                <Typography
                  sx={{ fontFamily: theme.typography.paragraph1Regular }}
                  textAlign="justify"
                >
                  {t('propertyDetail.reviews.noReviews')}
                </Typography>
              ) : (
                ''
              )}
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            {disponibility ? (
              <BookingCard
                changeDisponibility={setDisponibility}
                listingRentId={Number(property.id)}
                pricePerNight={detailProperty?.data?.price?.priceNightly ?? 200}
                rating={detailProperty?.data?.valoration ?? 4.7}
                countReviews={detailProperty?.data?.reviews?.length ?? 120}
                guests={guests}
                discountedPrice={
                  detailProperty?.data?.price?.tlListingDiscountForRates[0] &&
                  detailProperty?.data?.price?.tlListingDiscountForRates[0].porcentage
                }
                selectionRange={selectionRange}
                onSelect={handleSelect}
                onClear={handleClear}
                disabledDates={disabledDates}
                avatarUrl={detailProperty?.data?.owner?.photoLink ?? ''}
                maxGuests={detailProperty?.data?.maxGuests ?? 18}
                maxPets={pets}
              />
            ) : (
              <BookingDisponibilityCard
                listingRentId={property.id.toString()}
                disponibility={disponibility}
                changeDisponibility={setDisponibility}
                pricePerNight={detailProperty?.data?.price?.priceNightly ?? 200}
                rating={detailProperty?.data?.valoration ?? 4.7}
                countReviews={detailProperty?.data?.reviews?.length ?? 120}
                travelers={travelers}
                adults={guests.adults}
                children={guests.children}
                infants={guests.infants}
                pets={guests.pets}
                selectionRange={selectionRange}
                onSelect={handleSelect}
                onClear={handleClear}
                disabledDates={disabledDates}
                maxGuests={detailProperty?.data?.maxGuests ?? 18}
                maxPets={pets}
              />
            )}
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 3 }} />
            <Typography sx={{ fontFamily: theme.typography.h5Medium }} gutterBottom>
              {t('propertyDetail.location.title')}
            </Typography>
            <Typography sx={{ fontFamily: theme.typography.paragraph1SRegular }}>
              {detailProperty?.data?.property?.address?.city?.city ?? ''}{' '}
              {detailProperty?.data?.property?.address?.city?.country ?? ''}
            </Typography>
            <Box
              sx={{
                height: { xs: 200, sm: 300, md: 450 },
                backgroundColor: '#e0e0e0',
                borderRadius: 2,
              }}
            >
              <iframe
                src={`https://maps.google.com/maps?q=${detailProperty?.data?.property?.latitude},${detailProperty?.data?.property?.longitude}&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="mapa"
              ></iframe>
            </Box>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ fontFamily: theme.typography.h5Medium }} mt={0} mb={2}>
              {t('propertyDetail.host.meetHost')}
            </Typography>

            <HostInfoCard
              photoLink={detailProperty?.data?.owner.photoLink}
              name={detailProperty?.data?.owner.name}
              lastName={detailProperty?.data?.owner?.lastName}
              registerDateMonths={detailProperty?.data?.owner?.registerDateMonths}
              hostId={detailProperty?.data?.ownerUserId}
              userId={userId}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 3 }} />
            <Typography sx={{ fontFamily: theme.typography.h5Medium }} gutterBottom>
              {t('propertyDetail.know.title')}
            </Typography>
            <Grid container spacing={3}>
              <SectionRentModal
                title={t('propertyDetail.know.houseRules')}
                content={detailProperty?.data?.rentRules || []}
                emptyMessage={t('propertyDetail.know.noRules')}
              />
              <SectionSecurityModal
                title={t('propertyDetail.know.security')}
                content={detailProperty?.data?.securityItems || []}
                emptyMessage={t('propertyDetail.know.noSecurity')}
              />
              <Section
                title={t('propertyDetail.know.cancellationPolicy')}
                name={detailProperty?.data?.cancelationPolicy?.name ?? ''}
                content={detailProperty?.data?.cancelationPolicy?.detail1 ?? ''}
                emptyMessage={t('propertyDetail.know.noCancellation')}
                code={detailProperty?.data?.cancelationPolicy?.code}
              />
            </Grid>
          </Grid>
        </Grid>
      </Stack>
      {/* <Modal open={isModalLogin} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: '20px 50px 80px 50px',
          }}
        >
          <AuthRegistrationForm onClose={handleCloseModal} typeLogin={loginType} />
        </Box>
      </Modal> */}
      <SignInForm open={isModalLogin} onClose={handleCloseModal} typeLogin={loginType} />
      <Button
        variant="contained"
        onClick={onClose}
        sx={{ mt: 2, backgroundColor: '#000', '&:hover': { backgroundColor: '#333' } }}
      >
        {t('propertyDetail.buttons.back')}
      </Button>
    </Box>
  );
};

export default PropertyDetail;
