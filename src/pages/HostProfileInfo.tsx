import HostProfileInfoSkeleton from '@/components/HostProfileInfoSkeleton';
import ProfileHostInfo from '@/components/ProfileHostInfo';
import { useGet2 } from '@/hooks/api';
import ReviewCard from '@/modules/_account/components/ReviewCard';
import { formatDate } from '@/utilities/dateUtils';
import CloseIcon from '@mui/icons-material/Close';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, alpha } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LiaDogSolid } from 'react-icons/lia';
import { useParams } from 'react-router';
import CustomDialog from '@/components/CustomDialog';
import Pagination from '@mui/material/Pagination';
import HostAboutSection from '@/components/HostAboutSection';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import PetsOutlinedIcon from '@mui/icons-material/PetsOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { format, parseISO } from 'date-fns';

export interface HostData {
  userId: number;
  name: string;
  lastName: string;
  favoriteName: string;
  roles: string[];
  guestHostingsTotal: number;
  hostHostingsTotal: number;
  guestReviewCalification: number;
  hostReviewCalification: number;
  yearsInAssert: number;
  listingRentCount: number;
  timeInAssert: string;
  avatar: string;
  countReviewsGuest: number;
  countReviewsHost: number;
  guestReviews: any[];
  hostReviews: HostReview[];
}

export interface HostReview {
  reviewId: number;
  listingRentId: number;
  bookId: number;
  userIdReviewer: number;
  dateTimeReview: string;
  reviewerName: string;
  reviewerLocation: string;
  reviewDateName: string;
  stayDuration: number;
  rating: number;
  reviewText: string;
  avatar: string;
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
  featuredAspects: any;
  photos: Photo[];
  rentRules: RentRule[];
  reviews: Review[];
  securityItems: SecurityItem[];
  spaces: Space[];
  stayPresences: any;
  valoration: number;
  historyDate: string | null;
  isFavorite: boolean;
}

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
  specialDatePrices: any;
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

export interface UserProfileResponse {
  statusCode: string;
  data: UserData;
  hasError: boolean;
  resultError: null | string;
}

export interface UserData {
  additionalProfileDataId: number;
  userId: number;
  lastName: string;
  name: string;
  whatIDo: string;
  wantedToGo: string;
  pets: string;
  birthday: string;
  languages: Language[];
  liveAt: LiveAt;
  introduceYourself: null | string;
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

export interface ReviewResponse {
  data: ReviewData[];
}

export interface ReviewData {
  user: null;
  dateTimeReview: string;
  calification: number;
  comment: string;
  userProfilePhoto: null;
  isComplete: boolean;
  listingReviewId: number;
  userId: number;
  listingRentId: number;
  bookId: number;
  reviewQuestions: any[];
  listingRent: ListingRent;
}

export interface ListingRent {
  listingRentId: number;
  status: null | string;
  name: string;
  description: string;
  minimunRentalPerDay: number | null;
  approvalRequestDays: number | null;
  phoneNumber: null | string;
  ownerUserId: number;
  owner: Owner;
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
  noiseDesibelesMonitor: boolean | null;
  listingRentConfirmationDate: string;
  property: Property;
  isFavorite: boolean;
  privateBathroom: number | null;
  privateBathroomLodging: number | null;
  sharedBathroom: number | null;
  avgReviews: number;
  minimunStay: number | null;
  maximumStay: number | null;
  minimumNotice: number | null;
  minimumNoticeHour: string | null;
  preparationDays: number | null;
  availabilityWindowMonth: null;
  checkInDays: null;
  checkOutDays: null;
}

export interface OwnerReview {
  userId: number;
  name: string;
  lastName: string;
  favoriteName: string;
  photoLink: string;
  gender: null | string;
  email: null | string;
  phoneNumber: null | string;
  phoneCode: null | string;
  emergencyContact: null | string;
  documents: any[];
  phones: any[];
  profilePhotos: any[];
  registerDate: string;
  registerDateDays: null | number;
  registerDateMonths: null | number;
  registerDateYears: null | number;
  cityName: string;
  status: string;
}

export interface PropertyReview {
  latitude: number;
  longitude: number;
  address: Address;
  type: null;
  distanceMeters: number;
  cityName: string;
  countyName: string | null;
  stateName: string | null;
  countryName: string | null;
}

export interface AddressReview {
  zipCode: string | null;
  address1: string | null;
  address2: string | null;
  cityId: number | null;
  countyId: number;
  stateId: number;
  city: City;
}

export interface CityReview {
  cityId: number;
  city: string;
  state: string | null;
  stateCode: null;
  country: string | null;
  countryCode: null;
  county: string | null;
  latitude: null | number;
  longitude: null | number;
}

const HostProfileInfo = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { userId, propertyId } = useParams<any>();
  const theme = useTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openModal, setOpenModal] = useState(false);
  const isLargeScreen = useMediaQuery('(min-width:1920px)');
  const brandColor = theme.palette.customColors?.primary[1] || theme.palette.primary.main;

  // Hooks de datos
  const {
    data: hostProfile,
    isLoading: isLoadingProfile,
    isError: isErrorProfile,
  } = useGet2<UserData>(['host-profile', userId], `/GetAdditionalProfileDataByUserId/${userId}`);

  const {
    data: detailProperty,
    isLoading: isLoadingProperty,
    isError: isErrorProperty,
  } = useGet2<ListingData>(['detailProperty2', propertyId], `/ListingRent/${propertyId}`);

  const {
    data: detailReview,
    isLoading: isLoadingReview,
    isError: isErrorReview,
  } = useGet2<HostData>(['detailReview', userId], `/GetProfileByUserId/${userId}`);

  const {
    data: hostReview,
    isLoading: isLoadingHostReview,
    isError: isErrorHostReview,
  } = useGet2<any>(
    ['allHostReview', userId, pageNumber, pageSize],
    `/${userId}/Reviews/AsHost?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );

  console.log('1', hostProfile);
  console.log('2', detailProperty);
  console.log('3', detailReview);
  console.log('4', hostReview);
  console.log('5', hostReview?.data?.[0].dateTimeReview);
  console.log('5', hostReview?.data?.[0].reviewer?.department);
  console.log('5', hostReview?.data?.[0].reviewer?.country);

  const birthday = hostProfile?.data?.birthday
    ? format(parseISO(hostProfile.data?.birthday), 'dd/MM/yyyy')
    : t('reservationCommon.noInfo');

  const reviewsForDialog = hostReview?.data || [];
  const paginationData = hostReview?.pagination;

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPageNumber(value);
  };

  if (isLoadingProfile || isLoadingReview || isLoadingProperty || isLoadingHostReview)
    return <HostProfileInfoSkeleton />;
  if (isErrorProfile || isErrorReview || isErrorProperty || isErrorHostReview)
    return <Typography>Error loading data...</Typography>;

  const reviews = Array.isArray(detailReview?.data?.hostReviews)
    ? detailReview.data.hostReviews
    : [];
  const visibleReviews = reviews.slice(0, 3);

  const cardHost = isLargeScreen ? 4 : 5;

  // Componente para los items de la rejilla de detalles
  // const DetailPill = ({ icon: Icon, label, value }: any) => (
  //   <Box
  //     sx={{
  //       display: 'flex',
  //       alignItems: 'center',
  //       gap: 2,
  //       p: 1.5,
  //       borderRadius: 3,
  //       transition: 'all 0.2s',
  //       '&:hover': { bgcolor: alpha(brandColor, 0.05) },
  //     }}
  //   >
  //     <Box sx={{ color: 'text.secondary', display: 'flex' }}>
  //       <Icon style={{ fontSize: '22px' }} size={22} />
  //     </Box>
  //     <Box>
  //       <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
  //         {value || t('hostProfileInfo.notAvailable')}
  //       </Typography>
  //       <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
  //         {label}
  //       </Typography>
  //     </Box>
  //   </Box>
  // );

  return (
    <Container
      maxWidth={isLargeScreen ? 'xl' : 'lg'}
      sx={{ px: { xs: 2, sm: 4, md: isLargeScreen ? 5 : 4 }, mt: 4 }}
    >
      <Grid container spacing={{ xs: 4, md: 5 }}>
        {/* LADO IZQUIERDO: CARD DEL HOST (Sticky) */}
        <Grid size={{ xs: 12, md: 4, lg: cardHost }}>
          <Box sx={{ position: { md: 'sticky' }, top: 100 }}>
            <ProfileHostInfo
              countReviews={detailReview?.data?.countReviewsHost ?? 0}
              rating={Math.trunc(detailReview?.data?.hostReviewCalification ?? 0)}
              hostId={detailProperty?.data?.ownerUserId ?? ''}
              listingRentId={detailProperty?.data?.listingRentId ?? ''}
              photo={detailProperty?.data?.owner.photoLink ?? ''}
              name={detailProperty?.data?.owner.name ?? ''}
              lastName={detailProperty?.data?.owner.lastName ?? ''}
              registerDateMonths={detailProperty?.data?.owner.registerDateMonths ?? ''}
            />
          </Box>
        </Grid>

        {/* Lado derecho */}
        <Grid size={{ xs: 12, md: 8, lg: 7 }}>
          <Box mb={6}>
            <Typography
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                fontWeight: 400,
                mb: 3,
                letterSpacing: '-0.02em',
                color: 'text.primary',
              }}
            >
              {t('hostProfileInfo.aboutHostTitle')} {detailProperty?.data?.owner.name}
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                bgcolor: alpha(theme.palette.divider, 0.04),
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <InfoOutlinedIcon fontSize="small" />{' '}
                {t('hostProfileInfo.hostDetails', 'Detalles del Anfitrión')}
              </Typography>

              <Box mt={3}>
                <Divider sx={{ my: 3 }} />

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                      <WorkOutlineIcon sx={{ color: 'text.secondary', fontSize: 22, mt: 0.2 }} />
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary' }}>
                          {t('reservationCommon.hostInfo.whatIDo')}
                        </Typography>
                        <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.5 }}>
                          {hostProfile?.data?.whatIDo || t('reservationCommon.noInfo')}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
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
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                      <PetsOutlinedIcon sx={{ color: 'text.secondary', fontSize: 22, mt: 0.2 }} />
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary' }}>
                          {t('reservationCommon.hostInfo.pets')}
                        </Typography>
                        <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.5 }}>
                          {hostProfile?.data?.pets || t('reservationCommon.noInfo')}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                      <LocationOnOutlinedIcon
                        sx={{ color: 'text.secondary', fontSize: 22, mt: 0.2 }}
                      />
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary' }}>
                          {t('reservationCommon.hostInfo.whereILive')}
                        </Typography>
                        <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.5 }}>
                          {hostProfile?.data?.liveAt?.liveAtShow || t('reservationCommon.noInfo')}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    p: 2.5,
                    bgcolor: '#f8fafc',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'grey.100',
                  }}
                >
                  <Typography sx={{ fontWeight: 600, mb: 1, fontSize: 15, color: 'text.primary' }}>
                    {t('reservationPending.aboutHost')}
                  </Typography>
                  <Typography sx={{ fontSize: 14, color: 'text.secondary', lineHeight: 1.6 }}>
                    {hostProfile?.data?.introduceYourself || t('reservationCommon.noInfo')}
                  </Typography>
                  {/* {hostProfile?.data?.introduceYourself && (
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
                  )} */}
                </Box>
              </Box>
              {/* <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailPill
                    icon={PersonOutlineIcon}
                    label={t('hostProfileInfo.fullName', 'Nombre Completo')}
                    value={`${detailProperty?.data?.owner.name} ${detailProperty?.data?.owner.lastName}`}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailPill
                    icon={HomeOutlinedIcon}
                    label={t('hostProfileInfo.livesIn', 'Ubicación')}
                    value={hostProfile?.data?.liveAt?.cityName}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailPill
                    icon={LanguageOutlinedIcon}
                    label={t('hostProfileInfo.languages', 'Idiomas')}
                    value={hostProfile?.data?.languages.map((lang) => lang.detail).join(', ')}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailPill
                    icon={LiaDogSolid}
                    label={t('hostProfileInfo.pets', 'Mascotas')}
                    value={hostProfile?.data?.pets}
                  />
                </Grid>
              </Grid> */}
            </Paper>
          </Box>

          <Divider sx={{ mt: 4, mb: 4 }} />

          {/* 2. SECCIÓN DE RESEÑAS */}
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5" sx={{ fontWeight: 400 }}>
                ★{' '}
                {/* {detailReview?.data?.hostReviewCalification
                  ? Math.trunc(detailReview?.data?.hostReviewCalification)
                  : 0}{' '}
                · {reviews.length} {t('hostInfoCard.review')} */}
                {detailReview?.data?.countReviewsHost ?? 0} {t('hostInfoCard.review')}
              </Typography>
            </Box>

            <Grid container spacing={2}>
              {visibleReviews.map((review: any, index: number) => (
                <Grid size={{ xs: 12, md: 6 }} key={index}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      height: '100%',
                      borderRadius: 4,
                      bgcolor: '#fff',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        borderColor: alpha(brandColor, 0.5),
                        boxShadow: `0 4px 12px ${alpha(brandColor, 0.1)}`,
                      },
                    }}
                  >
                    <ReviewCard
                      reviewerName={review.reviewerName}
                      reviewerLocation={`${hostReview?.data?.[index]?.reviewer?.department || 'Información no disponible'} - ${hostReview?.data?.[index]?.reviewer?.country || 'Información no disponible'}`}
                      // reviewDateName={formatDate(hostReview?.data?.[index]?.dateTimeReview, true)}
                      reviewDateName={format(
                        parseISO(hostReview?.data?.[index]?.dateTimeReview),
                        'dd/MM/yyyy'
                      )}
                      rating={review.rating}
                      reviewText={review.reviewText}
                      avatar={review.avatar}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {(detailReview?.data?.countReviewsHost ?? 0) > 3 && (
              <Button
                variant="outlined"
                onClick={() => setOpenModal(true)}
                fullWidth={isMobile}
                sx={{
                  mt: 4,
                  borderRadius: 3,
                  px: 4,
                  py: 1.2,
                  fontWeight: 700,
                  borderWidth: '1.5px',
                  borderColor: 'text.primary',
                  color: 'text.primary',
                  '&:hover': {
                    borderColor: brandColor,
                    color: brandColor,
                    bgcolor: alpha(brandColor, 0.05),
                  },
                }}
              >
                {t('hostProfileInfo.showAllReviewsBtn')} (
                {detailReview?.data?.countReviewsHost ?? 0})
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* MODAL DE RESEÑAS */}
      <CustomDialog
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="xs"
        title={t('hostProfileInfo.reviewsDialogTitle')}
      >
        {isLoadingHostReview ? (
          <div>Cargando reseñas...</div>
        ) : isErrorHostReview ? (
          <div>Ocurrió un error al cargar las reseñas.</div>
        ) : (
          <>
            <Grid container spacing={0}>
              {reviewsForDialog.map((review: any, index: number) => (
                <Grid
                  size={{ xs: 12 }}
                  key={index}
                  sx={{
                    p: 3,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    borderRight: { sm: index % 2 === 0 ? '1px solid #e0e0e0' : 'none' },
                  }}
                >
                  <ReviewCard
                    reviewerName={review.user}
                    reviewerLocation={`${hostReview?.data?.[index]?.reviewer?.department || 'Información no disponible'} - ${hostReview?.data?.[index]?.reviewer?.country || 'Información no disponible'}`}
                    reviewDateName={format(
                      parseISO(hostReview?.data?.[index]?.dateTimeReview),
                      'dd/MM/yyyy'
                    )}
                    rating={review.calification}
                    reviewText={review.comment}
                    avatar={review.userProfilePhoto}
                  />
                </Grid>
              ))}
            </Grid>

            {/* CONTROLES DE PAGINACIÓN */}
            {paginationData && paginationData.totalPageCount > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <Pagination
                  count={paginationData.totalPageCount}
                  page={pageNumber}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </CustomDialog>
      {/* <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="md"
        scroll="paper"
        slotProps={{
          paper: {
            sx: { borderRadius: 6 },
          },
          backdrop: {
            sx: { backgroundColor: 'rgba(0, 0, 0, 0.2)', backdropFilter: 'blur(4px)' },
          },
        }}
      >
        <DialogTitle
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}
        >
          <Typography variant="h5" fontWeight={800}>
            {t('hostProfileInfo.reviewsDialogTitle')}
          </Typography>
          <IconButton onClick={() => setOpenModal(false)} sx={{ bgcolor: 'action.hover' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <Grid container spacing={0}>
            {reviews.map((review: any, index: number) => (
              <Grid
                size={{ xs: 12, sm: 6 }}
                key={index}
                sx={{
                  p: 3,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  borderRight: { sm: index % 2 === 0 ? '1px solid #e0e0e0' : 'none' },
                }}
              >
                <ReviewCard
                  reviewerName={review.reviewerName}
                  reviewerLocation={review.reviewerLocation}
                  reviewDateName={formatDate(review.dateTimeReview, true)}
                  rating={review.rating}
                  reviewText={review.reviewText}
                  avatar={review.avatar}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog> */}
    </Container>
  );
};

export default HostProfileInfo;
