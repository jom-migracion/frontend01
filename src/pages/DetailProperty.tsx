import { Helmet } from 'react-helmet-async';
import AboutSpaceModal from '@/components/AboutSpaceModal';
import AmenityDialog from '@/components/AmenityDialog';
import BookingDisponibilityCard from '@/components/BookingDisponibilityCard';
import DetailPropertySkeleton from '@/components/DetailPropertySkeleton';
import ExpandableAmenities from '@/components/ExpandableAmenities';
import ExpandableHighlighted from '@/components/ExpandableHighlighted';
import ExpandableText from '@/components/ExpandableText';
import FavoriteListsModal, { CardItem } from '@/components/FavoriteListsModal';
import HighlightedDialog from '@/components/HighlightedDialog';
import HostInfoCard from '@/components/HostInfoCard';
import ModalPhotoGallery from '@/components/ModalPhotoGallery';
import NewShareModal from '@/components/NewShareModal';
import PropertyReviewsSection from '@/components/PropertyReviewsSection';
import RoomSpace from '@/components/RoomSpace';
import Section from '@/components/Section';
import SectionRentModal from '@/components/SectionRentModal';
import SectionSecurityModal from '@/components/SectionSecurityModal';
import ShowMap from '@/components/ShowMap';
import SignInForm from '@/components/SignInForm';
import SummaryHostInfo from '@/components/SummaryHostInfo';
import { useNotification } from '@/context/NotificationContext';
import { useGet2 } from '@/hooks/api';
import ResponseAssert from '@/models/interfaces/backend/ResponseAssert';
import { useAuthContext } from '@/modules/_auth/context';
import { ApiService } from '@/services/ApiService';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import { useMutation } from '@tanstack/react-query';
import { es } from 'date-fns/locale';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DateRange, Range, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router';

const brandColor = '#6366f1';

export interface LiveAt {
  cityId: number;
  cityName: string;
  location: string;
  liveAtShow: string;
}

export interface ProfileData {
  additionalProfileDataId: number;
  userId: string;
  lastName: string;
  name: string;
  whatIDo: string | null;
  wantedToGo: string | null;
  pets: string | null;
  birthday: string;
  languages: string[];
  liveAt: LiveAt;
  introduceYourself: string | null;
}

export interface ProfileResponse {
  statusCode: string;
  data: ProfileData;
  hasError: boolean;
  resultError: string | null;
}

interface HostData {
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

interface HostReview {
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
  bathrooms?: number;
  maxGuests: number;
  allDoorsLocked: boolean;
  beds?: number;
  sofaBeds?: number;
  privateBathroom?: number;
  privateBathroomLodging?: number;
  sharedBathroom?: number;
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
  featuredAspects: FeaturedAspects[];
  photos: Photo[];
  rentRules: RentRule[];
  reviews: Review[];
  securityItems: SecurityItem[];
  spaces: Space[];
  stayPresences: any;
  valoration: number;
  historyDate: string | null;
  isFavorite: boolean;
  minimumNotice: number;
}

interface FeaturedAspects {
  value: string | null;
  code: string;
  name: string;
  featuredAspectTypeId: number;
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
  isSuperHost: boolean;
}

interface Property {
  latitude: number;
  longitude: number;
  address: Address;
  type: PropertyType;
  distanceMeters: number;
  cityName: string;
  countyName: string;
  stateName: string;
  countryName: string;
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
interface GalleryImage {
  src: string;
  width: number;
  height: number;
}

const getRuleValue = (rules: any[] | undefined, code: string): string | null => {
  if (!Array.isArray(rules) || !code) return null;
  const rule = rules.find((r) => r?.code === code);
  return rule?.valueString ?? null;
};

const DetailProperty: React.FC<{ propListingRentId?: string; previewListing?: boolean }> = ({
  propListingRentId,
  previewListing = true,
}) => {
  const [isDocumentVerified, setIsDocumentVerified] = useState(false);
  const [openAboutSpace, setOpenAboutSpace] = useState(false);
  const [descriptionOverflows, setDescriptionOverflows] = useState(false);
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenHighlighted, setIsOpenHighlighted] = useState(false);
  const [imagens, setImagens] = useState<GalleryImage[]>([]);
  const [disponibility, setDisponibility] = useState<boolean>(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userId, setUserId] = useState<number>(0);
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);
  const [modalFavoritesOpen, setModalFavoritesOpen] = useState(false);
  const [togglingFavoriteId, setTogglingFavoriteId] = useState<string | null>(null);
  const [isModalLogin, setIsModalLogin] = useState(false);
  const [_, setLoginType] = useState<'registration' | 'login'>('login');
  const { isGuestAuthenticated } = useAuthContext();
  const isLargeScreen = useMediaQuery('(min-width:1920px)');
  const showNotification = useNotification();
  const { id: paramId } = useParams();
  const id = propListingRentId || paramId || '';
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isDialogShare, setIsDialogShare] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentUrl = window.location.href;

  const normalizeDate = (date: Date | string | null | undefined): Date => {
    if (!date) return new Date();
    if (typeof date === 'string') {
      const [year, month, day] = date.split('-').map(Number);
      if (year && month && day) return new Date(year, month - 1, day);
    }
    const d = date instanceof Date ? date : new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const currentDate = new Date();
  const oneYearLater = new Date();
  oneYearLater.setFullYear(currentDate.getFullYear() + 1);
  const reviewsSectionRef = useRef<HTMLDivElement>(null);

  // const { isLoaded } = useJsApiLoader({
  //   googleMapsApiKey: assertEnv.VITE_KEY_SEARCH_GOOGLE,
  // });

  const handleScrollToReviews = () => {
    reviewsSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const {
    data: detailProperty,
    isLoading: isLoadingProperty,
    isError,
    error,
    refetch,
  } = useGet2<ListingData>(
    ['detailProperty', id],
    previewListing ? `/ListingRent/${id}` : `/Host/ListingRent/${id}`
  );
  if (detailProperty?.statusCode === '404') {
    navigate('/');
  }

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
      pageSize: 100,
    },
    !!detailProperty?.data?.listingRentId
  );

  // A
  const toDateKey = (value: string | Date): string => {
    if (typeof value === 'string') return value.slice(0, 10);
    return formatDate(value);
  };
  // B
  // const disabledDates =
  //   CalendarDates?.data?.calendarDays
  //     .filter((day: CalendarDay) => day.blockType !== null)
  //     .map((day: CalendarDay) => {
  //       const d = new Date(day.date);
  //       d.setHours(0, 0, 0, 0);
  //       return d;
  //     }) || [];
  const disabledDates =
    CalendarDates?.data?.calendarDays
      ?.filter((day: CalendarDay) => day.blockType !== null)
      .map((day: CalendarDay) => {
        // Usar solo la parte de fecha para evitar problemas de zona horaria
        const [y, m, d] = toDateKey(day.date).split('-').map(Number);
        return new Date(y, m - 1, d);
      }) || [];

  // C
  const findFirstFreeWeek = (
    calendarDays: CalendarDay[] | undefined,
    minStartDate: Date
  ): { startDate: Date; endDate: Date } | null => {
    if (!calendarDays?.length) return null;

    // Solo días con blockType !== null → ocupados
    const blockedSet = new Set(
      calendarDays.filter((d) => d.blockType !== null).map((d) => toDateKey(d.date))
    );

    const searchFrom = normalizeDate(minStartDate);

    for (let offset = 0; offset < 365; offset++) {
      const candidateStart = new Date(searchFrom);
      candidateStart.setDate(searchFrom.getDate() + offset);

      let isFree = true;
      for (let i = 0; i < 7; i++) {
        const day = new Date(candidateStart);
        day.setDate(candidateStart.getDate() + i);
        if (blockedSet.has(formatDate(day))) {
          isFree = false;
          break;
        }
      }

      if (isFree) {
        const endDate = new Date(candidateStart);
        endDate.setDate(candidateStart.getDate() + 6);
        return {
          startDate: normalizeDate(candidateStart),
          endDate: normalizeDate(endDate),
        };
      }
    }
    return null;
  };

  type ProfileResponse = { userId: number; isDocumentVerified: boolean };

  const GetProfile = async () => {
    return ApiService.post<ResponseAssert<ProfileResponse>>('/GetProfile');
  };
  const mutation = useMutation<ResponseAssert<ProfileResponse>>({
    mutationFn: GetProfile,
    onSuccess: (data) => {
      console.log('GetProfile data:', data);
      setUserId(data?.data?.userId || 0);
      setIsDocumentVerified(data?.data?.isDocumentVerified || false);
    },
  });

  const { data: detailReview } = useGet2<HostData>(
    ['detailReview', detailProperty?.data?.ownerUserId],
    `/GetProfileByUserId/${detailProperty?.data?.ownerUserId}`,
    {},
    !!CalendarDates?.data && !!detailProperty?.data?.ownerUserId
  );

  const { data: additionalProfile } = useGet2<ProfileData>(
    ['getAdditionalProfileDataByUserId', detailProperty?.data?.ownerUserId],
    `/GetAdditionalProfileDataByUserId/${detailProperty?.data?.ownerUserId}`,
    {},
    !!CalendarDates?.data && !!detailProperty?.data?.ownerUserId
  );

  useEffect(() => {}, [CalendarDates]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await ApiService.get<{ data: Review[] }>(`/ListingRent/${id}/Reviews`);
        setReviews(response.data);
      } catch (error) {
        console.error('Error al cargar reseñas:', error);
      }
    };

    if (id) {
      fetchReviews();
      mutation.mutate();
    }
  }, [id]);

  useEffect(() => {
    if (detailProperty?.data?.photos?.length) {
      const orderedPhotos = detailProperty.data.photos
        .slice()
        .sort((a, b) => {
          if (a.isPrincipal) return -1;
          if (b.isPrincipal) return 1;
          return (a.position ?? Infinity) - (b.position ?? Infinity);
        })
        .map((photo) => photo.photoLink);

      setImagens(
        orderedPhotos.map((src) => ({
          src,
          width: 1600,
          height: 1000,
        }))
      );
    } else {
      setImagens(
        Array.from({ length: 5 }).map(() => ({
          src: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D/',
          width: 1600,
          height: 1000,
        }))
      );
    }
  }, [detailProperty]);

  // E
  // const today = normalizeDate(new Date());
  // const sevenDaysLater = normalizeDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

  const today = normalizeDate(new Date());
  const minAdvanceDays = detailProperty?.data?.minimumNotice ?? 0;
  const minSelectableDate = normalizeDate(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + minAdvanceDays)
  );

  const hasAutoSelected = useRef(false);

  useEffect(() => {
    if (hasAutoSelected.current) return;
    if (!detailProperty?.data) return;
    if (!CalendarDates?.data?.calendarDays?.length) return;

    const calendarDays = CalendarDates.data.calendarDays;
    const blockedSet = new Set(
      calendarDays.filter((d) => d.blockType !== null).map((d) => toDateKey(d.date))
    );

    const isRangeFree = (start: Date, end: Date) => {
      const cur = new Date(start);
      while (cur <= end) {
        if (blockedSet.has(formatDate(cur))) return false;
        cur.setDate(cur.getDate() + 1);
      }
      return true;
    };

    // 1) Validar fechas de la URL
    const urlCheckIn = searchParams.get('checkIn');
    const urlCheckOut = searchParams.get('checkOut');

    if (urlCheckIn && urlCheckOut) {
      const startDate = normalizeDate(urlCheckIn);
      const endDate = normalizeDate(urlCheckOut);

      const isValid =
        !isNaN(startDate.getTime()) &&
        !isNaN(endDate.getTime()) &&
        startDate <= endDate &&
        startDate >= minSelectableDate &&
        isRangeFree(startDate, endDate);

      if (isValid) {
        setSelectionRange({ startDate, endDate, key: 'selection' });
        hasAutoSelected.current = true;
        return;
      }
    }

    // 2) Primera semana libre (hoy + minimumNotice)
    const freeWeek = findFirstFreeWeek(calendarDays, minSelectableDate);
    if (freeWeek) {
      setSelectionRange({
        startDate: freeWeek.startDate,
        endDate: freeWeek.endDate,
        key: 'selection',
      });
      hasAutoSelected.current = true;
    }
  }, [
    CalendarDates?.data?.calendarDays,
    detailProperty?.data?.minimumNotice,
    minSelectableDate,
    searchParams,
  ]);

  const [selectionRange, setSelectionRange] = useState<Range>(() => {
    const urlCheckIn = searchParams.get('checkIn');
    const urlCheckOut = searchParams.get('checkOut');
    if (urlCheckIn && urlCheckOut) {
      const startDate = normalizeDate(urlCheckIn);
      const endDate = normalizeDate(urlCheckOut);
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && startDate <= endDate) {
        return { startDate, endDate, key: 'selection' };
      }
    }
    // 2) localStorage fallback (for direct navigation without URL params)
    try {
      const storedData = localStorage.getItem('search-form-storage');
      if (storedData) {
        const parsed: SearchFormStorage = JSON.parse(storedData);
        if (parsed.CheckInDate && parsed.CheckOutDate) {
          const startDate = normalizeDate(parsed.CheckInDate);
          const endDate = normalizeDate(parsed.CheckOutDate);
          if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && startDate <= endDate) {
            return { startDate, endDate, key: 'selection' };
          }
        }
      }
    } catch {}
    //return { startDate: today, endDate: sevenDaysLater, key: 'selection' };
    return {
      startDate: today,
      endDate: normalizeDate(new Date(today.getTime() + 6 * 86400000)),
      key: 'selection',
    };
  });

  const [guests, setGuests] = useState<Guests>(() => {
    // 1) URL params — supports both adtCount/chdCount (from search results) and adults/children (from card)
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

  const rentRules = useMemo(() => {
    const rules = detailProperty?.data?.rentRules ? [...detailProperty.data.rentRules] : [];
    const checkInOutPolicy = detailProperty?.data?.checkInOutPolicies?.[0];
    if (checkInOutPolicy && !rules.some((r) => r.code === 'CHECK_IN_OUT')) {
      rules.push(
        {
          code: 'CHECK_IN',
          name: 'Check-in',
          description: `${checkInOutPolicy.checkInTime_Str} - ${checkInOutPolicy.maxCheckInTime_Str}`,
          status: null,
          iconLink: '',
          ruleTypeId: 0,
          value: false,
          valueString: '',
        },
        {
          code: 'CHECK_OUT',
          name: 'Check-out',
          description: `${checkInOutPolicy.checkOutTime_Str}`,
          status: null,
          iconLink: '',
          ruleTypeId: 0,
          value: false,
          valueString: '',
        }
      );
    }

    // Actualizar la descripción para horas de silencio con su valor específico
    const quietHoursRule = rules.find((r) => r.code === 'QUIET_HOURS');
    if (quietHoursRule && quietHoursRule.valueString) {
      quietHoursRule.description = quietHoursRule.valueString;
    }

    return rules;
  }, [detailProperty?.data?.rentRules, detailProperty?.data?.checkInOutPolicies]);

  const handleSelect = (ranges: RangeKeyDict) => {
    const newRange = ranges.selection;
    if (newRange.startDate && newRange.endDate && newRange.startDate <= newRange.endDate) {
      const hasBlockedDates = disabledDates.some((blockedDate) => {
        const blockedTime = blockedDate.getTime();
        const startTime = newRange.startDate!.getTime();
        const endTime = newRange.endDate!.getTime();
        return blockedTime >= startTime && blockedTime <= endTime;
      });

      if (hasBlockedDates) {
        showNotification(
          'error',
          'Calendario',
          'Rango de fechas no disponibles. Por favor, selecciona otro rango.'
        );
        return;
      }

      setSelectionRange(newRange);
    }
  };

  const handleClear = () => {
    const freeWeek = findFirstFreeWeek(CalendarDates?.data?.calendarDays, minSelectableDate);
    if (freeWeek) {
      setSelectionRange({
        startDate: freeWeek.startDate,
        endDate: freeWeek.endDate,
        key: 'selection',
      });
    } else {
      const tempEnd = new Date(minSelectableDate);
      tempEnd.setDate(minSelectableDate.getDate() + 6);
      setSelectionRange({
        startDate: minSelectableDate,
        endDate: normalizeDate(tempEnd),
        key: 'selection',
      });
    }
    setGuests({ adults: 1, children: 0, infants: 0, pets: 0 });
    setDisponibility(false);
  };

  const toggleFavorite = (isFavoriteProperty: boolean | undefined, id: number | undefined) => {
    if (!isGuestAuthenticated) {
      setIsModalLogin(true);
      setLoginType('login');
    } else {
      if (isFavoriteProperty) {
        deleteFromFavorite(id);
      } else {
        // Abrir modal de favoritos
        const principalImage = detailProperty?.data?.photos?.find(
          (photo) => photo.isPrincipal
        )?.photoLink;
        const images = detailProperty?.data?.photos?.map((photo) => photo.photoLink) || [];

        openFolderModal({
          id: id?.toString() || '',
          title: detailProperty?.data?.name || 'Alojamiento',
          image: principalImage || images[0] || '',
        });
      }
    }
  };

  const deleteFromFavorite = async (id: number | undefined) => {
    try {
      setTogglingFavoriteId(id?.toString() || null);
      await ApiService.delete(`/ListingRent/Favorite/${id}`);
      showNotification('success', 'Favoritos', 'Se elimino de la lista de favoritos');
      refetch();
    } catch (error) {
      showNotification('error', 'Favoritos', `Error al eliminar de la lista de favorito`);
    } finally {
      setTogglingFavoriteId(null);
    }
  };

  const handleFavoriteChange = (id: string, makeFav: boolean) => {
    if (!makeFav) {
      deleteFromFavorite(Number(id));
    }
  };

  const openFolderModal = (card: CardItem) => {
    setSelectedCard(card);
    setTogglingFavoriteId(card.id);
    setModalFavoritesOpen(true);
  };

  const closeFolderModal = (clearCard = false) => {
    setModalFavoritesOpen(false);
    setTogglingFavoriteId(null);
    if (clearCard) {
      setSelectedCard(null);
    }
    refetch();
  };

  const reopenModal = () => {
    if (selectedCard) {
      setModalFavoritesOpen(true);
      setTogglingFavoriteId(selectedCard.id);
    }
  };

  if (isLoadingProperty) return <DetailPropertySkeleton />;
  if (isError) return <Alert severity="error">Error loading property: {error.message}</Alert>;

  const handleCloseModal = () => {
    setIsModalLogin(false);
  };

  return (
    <>
      <Helmet>
        <title>{detailProperty?.data?.name ? `JOM - ${detailProperty.data.name}` : 'JOM'}</title>
        <meta name="description" content={detailProperty?.data?.description ?? ''} />
        <link rel="canonical" href={`${import.meta.env.VITE_BASE_URL_UI}detail/${id}`} />
        <meta property="og:title" content={detailProperty?.data?.name ?? ''} />
        <meta
          property="og:image"
          content={
            detailProperty?.data?.photos?.find((photo) => photo.isPrincipal)?.photoLink ||
            detailProperty?.data?.photos?.[0]?.photoLink ||
            ''
          }
        />
      </Helmet>
      <FavoriteListsModal
        open={modalFavoritesOpen}
        onClose={(clearCard = true) => closeFolderModal(clearCard)}
        selectedCard={selectedCard}
        onCardAssigned={reopenModal}
        onFavoriteChange={handleFavoriteChange}
        onFavoriteAdded={() => setTogglingFavoriteId(null)}
        onReopenWithCard={openFolderModal}
      />
      <Container
        maxWidth={isLargeScreen ? 'xl' : 'lg'}
        sx={{ px: { xs: 2, sm: 3, md: isLargeScreen ? 5 : 4 }, mt: { xs: 2, md: 6 } }}
      >
        {/* Título  */}
        <Box
          display={'flex'}
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent={'space-between'}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          width={'100%'}
          sx={{ mb: { xs: 2, md: 3 }, gap: { xs: 1.5, sm: 0 } }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: { xs: 0, sm: 1 },
              color: '#1e293b',
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
              lineHeight: 1.3,
            }}
          >
            {detailProperty?.data?.name}{' '}
            {detailProperty?.data?.property?.address?.city?.state
              ? `- ${detailProperty?.data?.property?.address?.city?.state}`
              : detailProperty?.data?.property?.address?.city?.city
                ? `- ${detailProperty?.data?.property?.address?.city?.city}`
                : ''}
          </Typography>
          <Box
            display={'flex'}
            gap={1}
            flexWrap={{ xs: 'wrap', sm: 'nowrap' }}
            sx={{ alignSelf: { xs: 'flex-end', sm: 'auto' } }}
          >
            {isMobile ? (
              <IconButton onClick={() => setIsDialogShare(true)}>
                <ShareIcon />
              </IconButton>
            ) : (
              <Button
                variant="secondary"
                onClick={() => setIsDialogShare(true)}
                startIcon={<ShareIcon />}
                sx={{ minWidth: '120px', px: 2 }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontSize: 'inherit',
                    fontWeight: 'inherit',
                    fontFamily: theme.typography.paragraph1SRegular,
                  }}
                >
                  {t('detailProperty.shareBtn')}
                </Typography>
              </Button>
            )}
            <NewShareModal
              propertyId={detailProperty?.data?.listingRentId}
              open={isDialogShare}
              onClose={() => setIsDialogShare(false)}
              shareUrl={currentUrl}
              title={detailProperty?.data?.name || 'Mira esta increíble propiedad'}
              propertyImage={
                detailProperty?.data?.photos?.find((photo) => photo.isPrincipal)?.photoLink ||
                detailProperty?.data?.photos?.[0]?.photoLink ||
                'https://via.placeholder.com/80'
              }
              propertyType={detailProperty?.data?.accomodationType?.accommodationName}
              rating={detailProperty?.data?.valoration}
              address={detailProperty?.data?.property?.address?.city?.city}
              bedrooms={detailProperty?.data?.bedrooms}
            />
            {isMobile ? (
              <IconButton
                onClick={() =>
                  toggleFavorite(
                    detailProperty?.data?.isFavorite,
                    detailProperty?.data?.listingRentId
                  )
                }
                disabled={togglingFavoriteId === detailProperty?.data?.listingRentId?.toString()}
              >
                {togglingFavoriteId === detailProperty?.data?.listingRentId?.toString() ? (
                  <CircularProgress size={18} sx={{ color: brandColor }} />
                ) : detailProperty?.data?.isFavorite ? (
                  <FavoriteIcon sx={{ color: theme.palette.primary.main }} />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
            ) : (
              <Button
                variant="secondary"
                onClick={() =>
                  toggleFavorite(
                    detailProperty?.data?.isFavorite,
                    detailProperty?.data?.listingRentId
                  )
                }
                disabled={togglingFavoriteId === detailProperty?.data?.listingRentId?.toString()}
                startIcon={
                  togglingFavoriteId === detailProperty?.data?.listingRentId?.toString() ? (
                    <CircularProgress size={18} sx={{ color: brandColor }} />
                  ) : detailProperty?.data?.isFavorite ? (
                    <FavoriteIcon sx={{ color: theme.palette.primary.main }} />
                  ) : (
                    <FavoriteBorderIcon />
                  )
                }
                sx={{
                  textTransform: 'none',
                  color: '#1e293b',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  minWidth: '120px',
                  ml: 1,
                  px: 2,
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontSize: 'inherit',
                    fontWeight: 'inherit',
                    fontFamily: theme.typography.paragraph1SRegular,
                  }}
                >
                  {detailProperty?.data?.isFavorite
                    ? t('detailProperty.saveBtn2')
                    : t('detailProperty.saveBtn')}
                </Typography>
              </Button>
            )}
          </Box>
        </Box>
        {/* Galeria de imagens */}
        <Box
          sx={{
            borderRadius: { xs: '16px', md: '24px' },
            overflow: 'hidden',
            mt: 0,
            mb: { xs: 3, md: 4 },
            boxShadow: { xs: '0 4px 12px rgba(0,0,0,0.06)', md: '0 10px 30px rgba(0,0,0,0.08)' },
            bgcolor: '#fff',
            lineHeight: 0,
          }}
        >
          <Grid container spacing={1}>
            {/* Imagen principal */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  height: { xs: 250, sm: 360, md: 500 },
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  '&:hover .main-img': { transform: 'scale(1.03)' },
                }}
                onClick={() => {
                  setCurrentIndex(0);
                  setOpen(true);
                }}
              >
                <Box
                  className="main-img"
                  component="img"
                  src={imagens[0]?.src ?? 'https://via.placeholder.com/600x500'}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s ease',
                    bgcolor: '#f1f5f9',
                  }}
                />
              </Box>
            </Grid>

            {/* Siempre visible, debajo en móvil, al lado en escritorio */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={1} sx={{ height: '100%' }}>
                {(imagens.length > 1 ? imagens.slice(1, 5) : Array(4).fill(null)).map(
                  (img, index) => (
                    <Grid size={{ xs: 6 }} key={index}>
                      <Box
                        sx={{
                          width: '100%',
                          height: { xs: 120, sm: 180, md: 246 },
                          overflow: 'hidden',
                          position: 'relative',
                          cursor: 'pointer',
                          bgcolor: '#f1f5f9',
                          '&:hover .sub-img': { transform: 'scale(1.05)' },
                          ...(index === 3 &&
                            imagens.length > 5 && {
                              '&::after': {
                                content: `"+${imagens.length - 5}"`,
                                position: 'absolute',
                                inset: 0,
                                bgcolor: 'rgba(0,0,0,0.5)',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: { xs: '1rem', md: '1.2rem' },
                                transition: 'background 0.3s',
                              },
                              '&:hover::after': { bgcolor: 'rgba(0,0,0,0.6)' },
                            }),
                        }}
                        onClick={() => {
                          setCurrentIndex(index + 1);
                          setOpen(true);
                        }}
                      >
                        <Box
                          className="sub-img"
                          component="img"
                          src={img?.src ?? 'https://via.placeholder.com/300x250'}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                          }}
                        />
                      </Box>
                    </Grid>
                  )
                )}
              </Grid>
            </Grid>
          </Grid>
          <ModalPhotoGallery
            open={open}
            images={imagens.map((img) => ({ src: img.src, width: 1600, height: 1066 }))}
            index={currentIndex}
            onClose={() => setOpen(false)}
          />
        </Box>
        {/* Detalles y reserva */}
        <Grid container spacing={{ xs: 2, md: 4 }}>
          <Grid size={{ xs: 12, md: 7 }}>
            {/* Detalles del anfitrión y descripción */}
            <Box sx={{ mb: { xs: 4, md: 6 } }}>
              <SummaryHostInfo
                title={detailProperty?.data?.accomodationType?.accommodationName ?? 'Desconocido'}
                location={`${detailProperty?.data?.property.cityName ?? 'Sin información disponible'}`}
                hostName={`${detailProperty?.data?.owner?.name ?? ''} ${detailProperty?.data?.owner?.lastName ?? ''}`}
                hostingTime={
                  `${detailReview?.data?.timeInAssert} como anfitrión` ||
                  'Tiempo como anfitrion desconocido'
                }
                avatarUrl={detailProperty?.data?.owner?.photoLink ?? ''}
                onReviewsClick={handleScrollToReviews}
              />
            </Box>

            <Box
              sx={{
                height: '1px',
                width: '100%',
                my: { xs: 4, md: 6 },
              }}
            >
              <Divider />
            </Box>

            {/* Descripción */}
            <Box component="section">
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  color: '#1e293b',
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                }}
              >
                {t('detailProperty.descriptionTitle')}
              </Typography>
              <RoomSpace
                bedrooms={detailProperty?.data?.bedrooms}
                // bathrooms={detailProperty?.data?.bathrooms}
                beds={detailProperty?.data?.beds}
                sofaBeds={detailProperty?.data?.sofaBeds}
                privateBathroom={detailProperty?.data?.privateBathroom}
                privateBathroomLodging={detailProperty?.data?.privateBathroomLodging}
                sharedBathroom={detailProperty?.data?.sharedBathroom}
              />
              <Box mt={2}>
                <ExpandableText
                  text={detailProperty?.data?.description}
                  onOverflow={setDescriptionOverflows}
                />
                {descriptionOverflows && (
                  <Box mt={2}>
                    <Button variant="secondary" onClick={() => setOpenAboutSpace(true)}>
                      {t('detailProperty.aboutSpaceBtn')}
                    </Button>
                  </Box>
                )}
                <AboutSpaceModal
                  description={detailProperty?.data?.description}
                  open={openAboutSpace}
                  title={'Acerca de este espacio'}
                  onClose={() => setOpenAboutSpace(false)}
                />
              </Box>
            </Box>

            <Box
              sx={{
                height: '1px',
                width: '100%',
                my: { xs: 4, md: 6 },
              }}
            >
              <Divider />
            </Box>

            {/* Servicios y amenidades */}
            <Box component="section">
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  color: '#1e293b',
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                }}
              >
                {t('detailProperty.servicesTitle')}
              </Typography>
              <ExpandableAmenities items={detailProperty?.data?.amenities} />
              {Array.isArray(detailProperty?.data?.amenities) &&
              detailProperty?.data?.amenities?.length > 3 ? (
                <Button sx={{ mt: 2 }} variant="secondary" onClick={() => setIsModalOpen(true)}>
                  {t('detailProperty.seeMoreBtn')}
                </Button>
              ) : (
                detailProperty?.data?.amenities?.length === 0 && (
                  <Typography sx={{ color: '#64748b', fontStyle: 'italic' }}>
                    {t('detailProperty.noServices')}
                  </Typography>
                )
              )}
              <AmenityDialog
                open={isModalOpen}
                amenities={(detailProperty?.data?.amenities || []) as any}
                onClose={() => setIsModalOpen(false)}
              />
            </Box>

            <Box
              sx={{
                height: '1px',
                width: '100%',
                my: { xs: 4, md: 6 },
              }}
            >
              <Divider />
            </Box>
            {/* Servicios destacados */}
            <Box component="section">
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  color: '#1e293b',
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                }}
              >
                {t('detailProperty.servicesHighlightedTitle')}
              </Typography>
              <ExpandableHighlighted items={detailProperty?.data?.featuredAspects} />
              {Array.isArray(detailProperty?.data?.featuredAspects) &&
              detailProperty?.data?.featuredAspects?.length > 3 ? (
                <Button
                  sx={{ mt: 2 }}
                  variant="secondary"
                  onClick={() => setIsOpenHighlighted(true)}
                >
                  {t('detailProperty.seeMoreBtn')}
                </Button>
              ) : (
                detailProperty?.data?.featuredAspects?.length === 0 && (
                  <Typography sx={{ color: '#64748b', fontStyle: 'italic' }}>
                    {t('detailProperty.noServices')}
                  </Typography>
                )
              )}
              <HighlightedDialog
                open={isOpenHighlighted}
                highlighted={(detailProperty?.data?.featuredAspects || []) as any}
                onClose={() => setIsOpenHighlighted(false)}
              />
            </Box>

            <Box
              sx={{
                height: '1px',
                width: '100%',
                my: { xs: 4, md: 6 },
              }}
            >
              <Divider />
            </Box>

            {/* Selección de fechas */}
            <Box component="section">
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  color: '#1e293b',
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                }}
              >
                {t('detailProperty.selectDateTitle')}
              </Typography>
              <Typography sx={{ color: '#64748b', mb: 3 }}>
                {t('detailProperty.selectDateHint')}
              </Typography>

              <Box
                sx={{
                  bgcolor: '#fff',
                  borderRadius: { xs: '16px', md: '30px' },
                  display: 'inline-block',
                  width: { xs: '100%', md: 'auto' },
                  overflow: 'hidden',
                }}
              >
                <DateRange
                  ranges={[selectionRange]}
                  onChange={handleSelect}
                  months={isMobile ? 1 : 2}
                  direction={isMobile ? 'vertical' : 'horizontal'}
                  rangeColors={[theme.palette.customColors.primary[1]]}
                  showDateDisplay={false}
                  locale={es}
                  minDate={minSelectableDate}
                  disabledDay={(date) =>
                    disabledDates.some(
                      (d: Date) =>
                        date.getFullYear() === d.getFullYear() &&
                        date.getMonth() === d.getMonth() &&
                        date.getDate() === d.getDate()
                    )
                  }
                />
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="secondary"
                    onClick={handleClear}
                    disabled={!selectionRange.startDate || !selectionRange.endDate}
                  >
                    {t('detailProperty.clearDatesBtn')}
                  </Button>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                height: '1px',
                width: '100%',
                my: { xs: 4, md: 6 },
              }}
            >
              <Divider />
            </Box>

            {/* Reseñas */}
            <PropertyReviewsSection
              reviews={reviews}
              rating={detailProperty?.data?.valoration ?? 0}
              hostingTime={
                `${detailReview?.data?.timeInAssert} como anfitrión` ||
                'Tiempo como anfitrion desconocido'
              }
            />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }} sx={{ mt: 0 }}>
            <BookingDisponibilityCard
              listingRentId={id}
              disponibility={disponibility}
              changeDisponibility={setDisponibility}
              pricePerNight={detailProperty?.data?.price?.priceNightly ?? 200}
              rating={Math.trunc(detailProperty?.data?.valoration ?? 0)}
              countReviews={detailProperty?.data?.reviews?.length ?? 120}
              adults={guests.adults}
              children={guests.children}
              infants={guests.infants}
              pets={guests.pets}
              travelers={travelers}
              selectionRange={selectionRange}
              onSelect={handleSelect}
              onClear={handleClear}
              disabledDates={disabledDates}
              avatarUrl={detailProperty?.data?.owner?.photoLink ?? ''}
              maxGuests={detailProperty?.data?.maxGuests ?? 18}
              maxPets={pets}
            />
            {disponibility ? '' : ''}
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                height: '1px',
                width: '100%',
                my: { xs: 4, md: 6 },
              }}
            >
              <Divider />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: { xs: 3, md: 5 },
                color: '#1e293b',
                fontSize: { xs: '1.25rem', md: '1.5rem' },
              }}
            >
              {t('searchMenu.location')}:{' '}
              {detailProperty?.data?.property?.address?.city?.city ?? ''}
              {', '}
              {detailProperty?.data?.property?.address?.city?.country ?? 'Bolivia'}
            </Typography>
            <ShowMap
              latitude={detailProperty?.data?.property?.latitude}
              longitude={detailProperty?.data?.property?.longitude}
              tooltipText={t('bookingCard.textMap')}
            />
          </Grid>
          <Grid size={{ xs: 12 }} ref={reviewsSectionRef}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: { xs: 3, md: 5 },
                color: '#1e293b',
                fontSize: { xs: '1.25rem', md: '1.5rem' },
              }}
            >
              {t('bookingCard.meetHost')}
            </Typography>
            <HostInfoCard
              countReviews={detailReview?.data?.countReviewsHost || 0}
              rating={Math.trunc(detailReview?.data?.hostReviewCalification ?? 0)}
              listingRentId={detailProperty?.data?.listingRentId}
              photoLink={detailProperty?.data?.owner.photoLink}
              name={detailReview?.data?.name}
              lastName={detailReview?.data?.lastName}
              registerDateMonths={detailProperty?.data?.owner?.registerDateMonths}
              hostId={detailProperty?.data?.ownerUserId}
              userId={userId}
              isDocumentVerified={isDocumentVerified}
              isSuperHost={detailProperty?.data?.owner?.isSuperHost}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                {/* Divisor moderno con gradiente */}
                <Box
                  sx={{
                    height: '1px',
                    width: '100%',
                    my: { xs: 4, md: 6 },
                  }}
                >
                  <Divider />
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    mb: 4,
                    color: '#1e293b',
                    fontSize: { xs: '1.25rem', md: '1.6rem' },
                  }}
                >
                  {t('bookingCard.shouldKnow')}
                </Typography>
                <Grid container spacing={{ xs: 2, md: 3 }}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box
                      sx={{
                        borderRadius: '16px',
                      }}
                    >
                      <SectionRentModal
                        title={t('bookingCard.houseRules.title')}
                        content={rentRules || []}
                        emptyMessage={t('bookingCard.houseRules.empty')}
                      />
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box
                      sx={{
                        borderRadius: '16px',
                      }}
                    >
                      <SectionSecurityModal
                        title={t('bookingCard.security.title')}
                        content={detailProperty?.data?.securityItems || []}
                        emptyMessage={t('bookingCard.security.empty')}
                      />
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box
                      sx={{
                        borderRadius: '16px',
                      }}
                    >
                      <Section
                        title={t('bookingCard.cancellation.title')}
                        content={detailProperty?.data?.cancelationPolicy?.detail1 ?? ''}
                        emptyMessage={t('bookingCard.cancellation.empty')}
                        code={detailProperty?.data?.cancelationPolicy?.code ?? ''}
                        name={detailProperty?.data?.cancelationPolicy?.name ?? ''}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <SignInForm open={isModalLogin} onClose={handleCloseModal} typeLogin={'login'} />
    </>
  );
};

export default DetailProperty;
