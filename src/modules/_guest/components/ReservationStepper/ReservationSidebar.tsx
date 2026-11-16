import { houseFake } from '@/assets';
import AssertModal from '@/components/AssertModal';
import BookingCalendar from '@/components/BookingCalendar';
import DetailPropertySkeleton from '@/components/DetailPropertySkeleton';
import { useGet2 } from '@/hooks/api';
import StarIcon from '@mui/icons-material/Star';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Divider,
  Tooltip,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Range } from 'react-date-range';
import { useParams } from 'react-router';
import ReservationAccordion from '../ReservationAccordion';
import { IoCalendarOutline } from 'react-icons/io5';
import { BiUser } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';
import { priceCalculationCardStore } from '@/store/priceInformation.store';

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
  //property: Property;
  price: Price;
  checkInOutPolicies: CheckInOutPolicy[];
  amenities: Amenity[];
  featuredAspects: any; // Puede ajustarse según estructura real
  photos: Photo[];
  rentRules: RentRule[];
  // reviews: Review[];
  securityItems: SecurityItem[];
  spaces: Space[];
  stayPresences: any; // Puede ajustarse
  // valoration: number;
  historyDate: string | null;
  isFavorite: boolean;
  listingRent: ListintRentInfo;
  checkin: string;
  checkout: string;
  payPriceCalculations: PayPriceCalculation[];
  gests: number;
  adultCount?: number;
  childCount?: number;
  infantCount?: number;
  petCount?: number;
}
interface ListintRentInfo {
  valoration: number;
  reviews: Review[];
  name: string;
  property: Property;
}

// Subtipos (abreviados para brevedad, mantener los originales si es necesario)
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
  value: boolean;
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
  discounts: null | any;
  blockTypeName: string;
}

interface CalendarResponse {
  calendarDays: CalendarDay[];
  statusCode: string;
  hasError: boolean;
  resultError: null | string;
}

interface PayPriceCalculation {
  priceBreakdowns: PriceBreakdown[];
  priceCalculation: PriceCalculation;
}
interface PriceBreakdown {
  amount: number;
  date: string;
  description: string;
  percentage: number;
  type: string;
  subItems?: PriceBreakdown[];
}
interface PriceCalculation {
  amount: number;
  bookId: number;
}

const ReservationSidebar = ({
  paymentPlatformCommission,
}: {
  paymentPlatformCommission?: number | null;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();
  const [openAboutSpace, setOpenAboutSpace] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [openBreakdownIndex, setOpenBreakdownIndex] = useState<number | null>(null);
  const { id } = useParams<{ id: string }>();
  const dataCalcPriceCard = priceCalculationCardStore((state) => state.dataCalcPriceCard);

  // const formatDate = (date: Date) => {
  //   return date.toISOString().split('T')[0];
  // };

  const normalizeDate = (date: Date | string | null | undefined): Date => {
    if (!date) return new Date();
    const d = typeof date === 'string' ? new Date(date) : new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Formatear fecha para mostrar en español (ej: "23 abr")
  const formatDisplayDate = (date: Date) => {
    const day = date.getDate();
    const months = [
      'ene',
      'feb',
      'mar',
      'abr',
      'may',
      'jun',
      'jul',
      'ago',
      'sep',
      'oct',
      'nov',
      'dic',
    ];
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  };
  const currentDate = new Date();
  const oneYearLater = new Date();
  oneYearLater.setFullYear(currentDate.getFullYear() + 1);

  const {
    data: detailProperty,
    isLoading: isLoadingProperty,
    isError,
    error,
  } = useGet2<ListingData>(['detailProperty', id], `/Book/${id}`);

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

  // const today = new Date();
  // const sevenDaysLater = new Date();
  // sevenDaysLater.setDate(today.getDate() + 6);
  const today = normalizeDate(new Date());
  const sevenDaysLater = normalizeDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [selectionRange, setSelectionRange] = useState<Range>({
    startDate: today,
    endDate: sevenDaysLater,
    key: 'selection',
  });

  // Actualizar selectionRange cuando detailProperty se cargue
  useEffect(() => {
    if (detailProperty?.data?.checkin && detailProperty?.data?.checkout) {
      const startDate = normalizeDate(new Date(detailProperty.data.checkin));
      const endDate = normalizeDate(new Date(detailProperty.data.checkout));

      console.log(
        'CheckInDate:',
        detailProperty.data.checkin,
        'CheckOutDate:',
        detailProperty.data.checkout
      );

      // Validar que las fechas sean válidas y el checkout sea después del checkin
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && startDate <= endDate) {
        setSelectionRange({
          startDate,
          endDate,
          key: 'selection',
        });
      }
    }
  }, [detailProperty?.data?.checkin, detailProperty?.data?.checkout]);

  const [guests, setGuests] = useState<Guests>(() => {
    if (detailProperty?.data?.gests) {
      return {
        adults: detailProperty?.data?.gests || 1,
        children: 0,
        infants: 0,
        pets: 0,
      };
    }
    return {
      adults: 1,
      children: 0,
      infants: 0,
      pets: 0,
    };
  });

  useEffect(() => {
    const storedData = localStorage.getItem('search-form-storage');
    let storageData: SearchFormStorage = storedData ? JSON.parse(storedData) : {};
    storageData = {
      ...storageData,
      Guests: guests,
    };
    localStorage.setItem('search-form-storage', JSON.stringify(storageData));
  }, [guests]);

  if (isLoadingProperty) {
    return <DetailPropertySkeleton />;
  }

  if (isError) {
    return (
      <Alert severity="error">t('ReservationSidebar.errors.loadingProperty) {error.message}</Alert>
    );
  }
  // console.log('Book: ', detailProperty);
  const propertyName =
    detailProperty?.data?.listingRent?.name ?? t('ReservationSidebar.fallbacks.propertyName');
  const location =
    detailProperty?.data?.listingRent?.property?.address?.city?.city ||
    detailProperty?.data?.listingRent?.property?.address?.city?.state ||
    t('ReservationSidebar.fallbacks.location');
  const rating = detailProperty?.data?.listingRent?.valoration ?? 4.4;
  const reviewCount = detailProperty?.data?.listingRent?.reviews?.length ?? 0;
  const mainImage = detailProperty?.data?.photos?.[0]?.photoLink ?? houseFake;
  const brandColor = theme.palette.primary.main;
  const priceBreakdownsRaw = detailProperty?.data?.payPriceCalculations?.[0]?.priceBreakdowns ?? [];
  const arrayDataCalcPriceCard = Object.values(
    priceBreakdownsRaw
      .filter((b: PriceBreakdown) => b.type !== 'PLATFORM_HOST_FEE')
      .reduce((acc: Record<string, any>, item: PriceBreakdown) => {
        const clave = `${item.type}|${item.description}`;
        if (!acc[clave]) {
          acc[clave] = { ...item, subItems: [item] };
        } else {
          acc[clave].amount += item.amount;
          acc[clave].subItems.push(item);
        }
        return acc;
      }, {})
  );

  return (
    <>
      <Card
        elevation={0}
        sx={{
          borderRadius: { xs: 3, md: 6 },
          border: '1px solid rgba(0, 0, 0, 0.08)',
          p: { xs: 2, md: 3 },
          maxWidth: 400,
          height: 'fit-content',
          position: 'sticky',
          mt: 1,
        }}
      >
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          {/* Encabezado con imagen + info */}
          <Box display="flex" flexDirection="row" gap={2} mb={2}>
            <Box flex={1.2} display="flex" justifyContent="center" alignItems="center">
              <img
                width="100%"
                height="130px"
                src={mainImage}
                alt={propertyName}
                style={{ margin: 2, borderRadius: 4, objectFit: 'cover' }}
              />
            </Box>
            <Box
              flex={1.5}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="flex-start"
            >
              <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#1F2937' }}>
                {propertyName}
              </Typography>
              <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#6B7280' }}>
                {location}
              </Typography>

              <Box display="flex" alignItems="center" gap={0.5} mt={1} mb={0}>
                <StarIcon sx={{ fontSize: '20px', color: theme.palette.warning.main }} />
                <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
                  {rating} ({reviewCount} {t('ReservationSidebar.rating.reviews')})
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Cancelación */}
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', mb: 1 }}>
              {t('ReservationSidebar.cancellation.title')}
            </Typography>
            <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#64748b', mb: 1 }}>
              {detailProperty?.data?.cancelationPolicy?.detail1 ||
                t('ReservationSidebar.fallbacks.cancelationPolicy')}
            </Typography>
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#64748b',
                textDecoration: 'underline',
                cursor: 'pointer',
                '&:hover': {
                  color: '#1e293b',
                },
              }}
              onClick={() => setOpenAboutSpace(true)}
            >
              {t('ReservationSidebar.cancellation.fullPolicy')}
            </Typography>
          </Box>

          <Divider sx={{ mb: 2, borderColor: 'rgba(0, 0, 0, 0.08)' }} />

          {/* Detalles del viaje */}
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', mb: 2 }}>
              {t('ReservationSidebar.tripDetails.title')}
            </Typography>

            <Box
              onClick={() => setShowCalendar(!showCalendar)}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: 3,
                border: '1px solid rgba(0, 0, 0, 0.08)',
                bgcolor: '#f8fafc',
                p: 2,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                '&:hover': {
                  bgcolor: '#f1f5f9',
                },
              }}
            >
              {/* SALIDA */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 0.5,
                  flex: 1,
                  borderRight: '1px solid rgba(100, 116, 139, 0.2)',
                }}
              >
                <Box display="flex" gap={0.5} alignItems="center">
                  <IoCalendarOutline size={16} color="#64748b" style={{ opacity: 0.7 }} />
                  <Typography
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {t('ReservationSidebar.tripDetails.checkOut')}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#1e293b' }}>
                  {formatDisplayDate(selectionRange.startDate || new Date())}
                </Typography>
              </Box>

              {/* LLEGADA */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 0.5,
                  flex: 1,
                  borderRight: '1px solid rgba(100, 116, 139, 0.2)',
                }}
              >
                <Box display="flex" gap={0.5} alignItems="center">
                  <IoCalendarOutline size={16} color="#64748b" style={{ opacity: 0.7 }} />
                  <Typography
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {t('ReservationSidebar.tripDetails.checkIn')}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#1e293b' }}>
                  {formatDisplayDate(selectionRange.endDate || new Date())}
                </Typography>
              </Box>

              {/* HUÉSPEDES */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 0.5,
                  flex: 1,
                }}
              >
                <Box display="flex" gap={0.5} alignItems="center">
                  <BiUser size={16} color="#64748b" style={{ opacity: 0.7 }} />
                  <Typography
                    sx={{
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {t('ReservationSidebar.tripDetails.guests')}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '0.6rem', fontWeight: 600, color: '#1e293b', ml: 2 }}>
                  {/* {guests.adults + guests.children}{' '}
                  {guests.adults + guests.children === 1 ? 'adulto' : 'adultos'} */}
                  {`${detailProperty?.data?.adultCount || 0} ${detailProperty?.data?.adultCount === 1 ? 'Adulto' : 'Adultos'}, 
                ${detailProperty?.data?.childCount || 0} ${detailProperty?.data?.childCount === 1 ? 'Niño' : 'Niños'}, 
                ${detailProperty?.data?.infantCount || 0} ${detailProperty?.data?.infantCount === 1 ? 'Bebé' : 'Bebés'}, 
                ${detailProperty?.data?.petCount || 0} ${detailProperty?.data?.petCount === 1 ? 'Mascota' : 'Mascotas'}`}
                </Typography>
              </Box>
            </Box>

            {/* BookingCalendar colapsable */}
            {showCalendar && (
              <Box sx={{ mt: 2 }}>
                <BookingCalendar
                  selectionRange={selectionRange}
                  onChange={(ranges) => setSelectionRange(ranges.selection)}
                  guests={guests}
                  onGuestsChange={setGuests}
                  disabledDates={disabledDates}
                />
              </Box>
            )}
          </Box>

          <Divider sx={{ mb: 2, borderColor: 'rgba(0, 0, 0, 0.08)' }} />

          {/* Información del precio */}
          <Box>
            <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', mb: 2 }}>
              {t('ReservationSidebar.priceInfo.title')}
            </Typography>

            {dataCalcPriceCard?.guestResume && (
              <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3 }}>
                {/* ── Hospedaje ── */}
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    mb: 1.5,
                    display: 'block',
                  }}
                >
                  Hospedaje
                </Typography>

                {(() => {
                  const acc = dataCalcPriceCard.guestResume.accommodation;
                  const weekendNights = acc?.weekend_NightsCount ?? 0;
                  const weekdayNights = (acc?.nightsCount ?? 0) - weekendNights;

                  const itemsWithDates = (arrayDataCalcPriceCard as any[]).filter((item: any) =>
                    item.subItems?.some((s: any) => !!s?.date)
                  );
                  const weekdayAccItem: any = itemsWithDates[0] ?? null;
                  const weekendAccItem: any = itemsWithDates[1] ?? null;

                  const renderAccRow = (
                    label: string,
                    amount: number | undefined,
                    breakdownItem: any,
                    rowKey: number
                  ) => {
                    const count = breakdownItem?.subItems?.length ?? 0;
                    const showTooltip = count > 1;

                    const labelNode = (
                      <Typography
                        component="span"
                        sx={{
                          fontSize: '14px',
                          fontWeight: 400,
                          color: '#64748b',
                          ...(showTooltip && {
                            cursor: 'help',
                            textDecoration: 'underline dotted',
                          }),
                        }}
                      >
                        {label}
                      </Typography>
                    );

                    const mobilePanel = showTooltip && (
                      <Box
                        sx={{
                          mt: 1,
                          mb: 0.5,
                          bgcolor: '#1e293b',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          width: '100%',
                          boxSizing: 'border-box',
                        }}
                      >
                        <Box
                          sx={{
                            px: 2,
                            py: 0.75,
                            bgcolor: 'rgba(255,255,255,0.06)',
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              color: '#94a3b8',
                              textTransform: 'uppercase',
                              letterSpacing: '0.6px',
                            }}
                          >
                            {breakdownItem?.description ?? ''}
                          </Typography>
                        </Box>
                        <Box sx={{ px: 2, py: 1 }}>
                          {breakdownItem?.subItems.map((sub: any, i: number) => (
                            <Box
                              key={i}
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              gap={2}
                              sx={{
                                py: 0.5,
                                borderBottom:
                                  i < breakdownItem.subItems.length - 1
                                    ? '1px solid rgba(255,255,255,0.06)'
                                    : 'none',
                              }}
                            >
                              <Typography sx={{ fontSize: '0.78rem', color: '#cbd5e1', flex: 1 }}>
                                {sub?.date
                                  ? sub.date.split('T')[0].split('-').reverse().join('-')
                                  : (sub?.description ?? '')}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  color: '#f1f5f9',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {sub?.amount?.toFixed(2)}{' '}
                                {dataCalcPriceCard.guestResume.currencyCode}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    );

                    return (
                      <Box key={rowKey} mb={1}>
                        <Box display="flex" justifyContent="space-between" gap={2}>
                          {showTooltip ? (
                            isMobile ? (
                              <Typography
                                component="span"
                                sx={{
                                  fontSize: '14px',
                                  fontWeight: 400,
                                  color: '#64748b',
                                  cursor: 'pointer',
                                  textDecoration: 'underline dotted',
                                }}
                                onClick={() =>
                                  setOpenBreakdownIndex(
                                    openBreakdownIndex === rowKey ? null : rowKey
                                  )
                                }
                              >
                                {label}
                              </Typography>
                            ) : (
                              <Tooltip
                                placement="top"
                                arrow
                                slotProps={{
                                  tooltip: {
                                    sx: {
                                      bgcolor: '#1e293b',
                                      color: '#f8fafc',
                                      borderRadius: '12px',
                                      boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                                      p: 0,
                                      minWidth: 220,
                                      maxWidth: 280,
                                      overflow: 'hidden',
                                    },
                                  },
                                  arrow: { sx: { color: '#1e293b' } },
                                }}
                                title={
                                  <Box>
                                    <Box
                                      sx={{
                                        px: 2,
                                        py: 1,
                                        bgcolor: 'rgba(255,255,255,0.06)',
                                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: '0.7rem',
                                          fontWeight: 700,
                                          color: '#94a3b8',
                                          textTransform: 'uppercase',
                                          letterSpacing: '0.6px',
                                        }}
                                      >
                                        {breakdownItem?.description ?? ''}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ px: 2, py: 1.5 }}>
                                      {breakdownItem?.subItems.map((sub: any, i: number) => (
                                        <Box
                                          key={i}
                                          display="flex"
                                          justifyContent="space-between"
                                          alignItems="center"
                                          gap={3}
                                          sx={{
                                            py: 0.5,
                                            borderBottom:
                                              i < breakdownItem.subItems.length - 1
                                                ? '1px solid rgba(255,255,255,0.06)'
                                                : 'none',
                                          }}
                                        >
                                          <Typography
                                            sx={{ fontSize: '0.8rem', color: '#cbd5e1', flex: 1 }}
                                          >
                                            {sub?.date
                                              ? sub.date
                                                  .split('T')[0]
                                                  .split('-')
                                                  .reverse()
                                                  .join('-')
                                              : (sub?.description ?? '')}
                                          </Typography>
                                          <Typography
                                            sx={{
                                              fontSize: '0.8rem',
                                              fontWeight: 700,
                                              color: '#f1f5f9',
                                              whiteSpace: 'nowrap',
                                            }}
                                          >
                                            {sub?.amount?.toFixed(2)}{' '}
                                            {dataCalcPriceCard.guestResume.currencyCode}
                                          </Typography>
                                        </Box>
                                      ))}
                                    </Box>
                                  </Box>
                                }
                              >
                                {labelNode}
                              </Tooltip>
                            )
                          ) : (
                            labelNode
                          )}
                          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>
                            {amount?.toFixed(2)} {dataCalcPriceCard.guestResume.currencyCode}
                          </Typography>
                        </Box>
                        {isMobile && openBreakdownIndex === rowKey && mobilePanel}
                      </Box>
                    );
                  };

                  return (
                    <>
                      {renderAccRow(
                        `Precio por noche (×${weekdayNights})`,
                        acc?.baseAmount,
                        weekdayAccItem,
                        0
                      )}

                      {weekendNights > 0 &&
                        renderAccRow(
                          `Precio fin de semana (×${weekendNights})`,
                          acc?.weekend_BaseAmount,
                          weekendAccItem,
                          1
                        )}

                      {(acc?.appliedDiscount ?? 0) > 0 && (
                        <Box display="flex" justifyContent="space-between" gap={2} mb={1}>
                          <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#64748b' }}>
                            Descuento aplicado
                          </Typography>
                          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>
                            -{acc?.appliedDiscount?.toFixed(2)}{' '}
                            {dataCalcPriceCard.guestResume.currencyCode}
                          </Typography>
                        </Box>
                      )}

                      <Box display="flex" justifyContent="space-between" gap={2} mb={1}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#64748b' }}>
                          {(acc?.appliedDiscount ?? 0) > 0
                            ? 'Hospedaje con descuento'
                            : 'Total alojamiento'}
                        </Typography>
                        <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>
                          {acc?.discountedAmount?.toFixed(2)}{' '}
                          {dataCalcPriceCard.guestResume.currencyCode}
                        </Typography>
                      </Box>
                    </>
                  );
                })()}

                {/* ── Cargos adicionales ── */}
                {((dataCalcPriceCard.guestResume.additionalCharges?.extraGuestFee ?? 0) > 0 ||
                  (dataCalcPriceCard.guestResume.additionalCharges?.petFee ?? 0) > 0 ||
                  (dataCalcPriceCard.guestResume.additionalCharges?.cleaningFee ?? 0) > 0 ||
                  (dataCalcPriceCard.guestResume.additionalCharges?.otherFees ?? 0) > 0) && (
                  <>
                    <Typography
                      sx={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        mt: 2,
                        mb: 1.5,
                        display: 'block',
                      }}
                    >
                      Cargos adicionales
                    </Typography>

                    {(dataCalcPriceCard.guestResume.additionalCharges?.extraGuestFee ?? 0) > 0 && (
                      <Box display="flex" justifyContent="space-between" gap={2} mb={1}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#64748b' }}>
                          Huéspedes extra
                        </Typography>
                        <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>
                          {dataCalcPriceCard.guestResume.additionalCharges?.extraGuestFee?.toFixed(
                            2
                          )}{' '}
                          {dataCalcPriceCard.guestResume.currencyCode}
                        </Typography>
                      </Box>
                    )}

                    {(dataCalcPriceCard.guestResume.additionalCharges?.petFee ?? 0) > 0 && (
                      <Box display="flex" justifyContent="space-between" gap={2} mb={1}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#64748b' }}>
                          Mascota
                        </Typography>
                        <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>
                          {dataCalcPriceCard.guestResume.additionalCharges?.petFee?.toFixed(2)}{' '}
                          {dataCalcPriceCard.guestResume.currencyCode}
                        </Typography>
                      </Box>
                    )}

                    {(dataCalcPriceCard.guestResume.additionalCharges?.cleaningFee ?? 0) > 0 && (
                      <Box display="flex" justifyContent="space-between" gap={2} mb={1}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#64748b' }}>
                          Limpieza
                        </Typography>
                        <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>
                          {dataCalcPriceCard.guestResume.additionalCharges?.cleaningFee?.toFixed(2)}{' '}
                          {dataCalcPriceCard.guestResume.currencyCode}
                        </Typography>
                      </Box>
                    )}

                    {(dataCalcPriceCard.guestResume.additionalCharges?.otherFees ?? 0) > 0 && (
                      <Box display="flex" justifyContent="space-between" gap={2} mb={1}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#64748b' }}>
                          Otros cargos
                        </Typography>
                        <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>
                          {dataCalcPriceCard.guestResume.additionalCharges?.otherFees?.toFixed(2)}{' '}
                          {dataCalcPriceCard.guestResume.currencyCode}
                        </Typography>
                      </Box>
                    )}
                  </>
                )}

                {/* ── Contenedor: Subtotal + Comisión + Total ── */}
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: alpha(brandColor, 0.06),
                    borderRadius: 2,
                    border: `1px solid ${alpha(brandColor, 0.15)}`,
                  }}
                >
                  <Box display="flex" justifyContent="space-between" gap={2} mb={1}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#475569' }}>
                      Subtotal:
                    </Typography>
                    <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>
                      {dataCalcPriceCard.guestResume.subtotal?.toFixed(2)}{' '}
                      {dataCalcPriceCard.guestResume.currencyCode}
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" gap={2} mb={1.5}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#475569' }}>
                      {`Comisión JOM anfitrión ${dataCalcPriceCard.guestResume.guestCommissionPercent ?? 15}%:`}
                    </Typography>
                    <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>
                      {dataCalcPriceCard.guestResume.guestCommission?.toFixed(2)}{' '}
                      {dataCalcPriceCard.guestResume.currencyCode}
                    </Typography>
                  </Box>

                  <Divider sx={{ borderColor: alpha(brandColor, 0.2), mb: 1.5 }} />

                  <Box display="flex" justifyContent="space-between" gap={2}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                      {t('ReservationSidebar.priceInfo.total')}
                    </Typography>
                    <Typography sx={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                      {(
                        (dataCalcPriceCard.guestResume.total ?? 0) +
                        (paymentPlatformCommission ?? 0)
                      ).toFixed(2)}{' '}
                      {dataCalcPriceCard.guestResume.currencyCode}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
      <AssertModal
        title={t('ReservationSidebar.modal.termsTitle')}
        content={<ReservationAccordion />}
        showCloseLeft
        open={openAboutSpace}
        onClose={() => setOpenAboutSpace(false)}
      />
    </>
  );
};

export default ReservationSidebar;
