import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  // useTheme,
  useMediaQuery,
  Container,
} from '@mui/material';
import { ArrowBackIos } from '@mui/icons-material';
import Grid from '@mui/material/Grid2';
import ReservationSidebar from '../components/ReservationStepper/ReservationSidebar';
import PaymentMethodCard from '../components/ReservationStepper/PaymentMethodCard';
// import HostMessageCard from '../components/ReservationStepper/HostMessageCard';
// import ReviewCard from '../components/ReservationStepper/ReviewCard';
import { Helmet } from 'react-helmet';
// import { AssertRoutes } from '@/common/enum/AssertRoutes';
import useHandleRouteLink from '@/hooks/useHandleRouteLink';
import { useParams } from 'react-router';
import { useGet2, usePost } from '@/hooks/api';
import { IPropsPaymentMethodCardResponse } from '../interface/IPropsPaymentMethodCard';
import { useSnackbar } from '@/context/SnackbarContext';
import LoadingThreeDotsJumping from '@/components/LoadingThreeDotsJumping';
// import { useAuthContext } from '@/modules/_auth/context';
import { Range } from 'react-date-range';
import { eachDayOfInterval } from 'date-fns';
import { useTranslation } from 'react-i18next';

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
  bookId: number;
  payPriceCalculations: PayPriceCalculations[];
}

// Subtipos

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

interface PayPriceCalculations {
  priceCalculation: PriceCalculation;
}
interface PriceCalculation {
  amount: number;
  bookId: number;
  calculationCode: string;
}

interface CalendarResponse {
  calendarDays: CalendarDay[];
  statusCode: string;
  hasError: boolean;
  resultError: null | string;
}

const ReservationStepper = () => {
  const { t } = useTranslation();

  // useState
  const [activeStep, setActiveStep] = useState(0);
  const [requestPay, setRequestPay] = useState<any>();
  const [methodOfPayment, setMethodOfPayment] = useState<number>(2);
  const [paymentPlatformCommission, setPaymentPlatformCommission] = useState<number | null>(null);

  // hooks
  const { id } = useParams();
  const handleRouteLink = useHandleRouteLink();
  const showSnackbar = useSnackbar();
  const isLargeScreen = useMediaQuery('(min-width:1920px)');
  // const theme = useTheme();

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  const currentDate = new Date();
  const oneYearLater = new Date();
  oneYearLater.setFullYear(currentDate.getFullYear() + 1);

  // store
  const storedData = localStorage.getItem('search-form-storage');

  // api
  const { mutate: CalculatePrice, isPending } = usePost<IPropsPaymentMethodCardResponse>(
    `/Book/${id}/CalculatePrice`
  );

  const { mutate: SimulatePayment, isPending: isPendingPay } = usePost(`/Payment/Simulate`);

  // Fetch property details using useGet2
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

  useEffect(() => {}, [CalendarDates]);

  const today = new Date();
  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(today.getDate() + 6);

  const [selectionRange, setSelectionRange] = useState<Range>(() => {
    const storedData = localStorage.getItem('search-form-storage');
    if (storedData) {
      try {
        const parsed: SearchFormStorage = JSON.parse(storedData);
        if (parsed.CheckInDate && parsed.CheckOutDate) {
          const startDate = new Date(parsed.CheckInDate);
          const endDate = new Date(parsed.CheckOutDate);
          if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && startDate <= endDate) {
            return {
              startDate,
              endDate,
              key: 'selection',
            };
          }
        }
      } catch (error) {
        console.error('Error parsing search-form-storage:', error);
      }
    }
    return {
      startDate: today,
      endDate: sevenDaysLater,
      key: 'selection',
    };
  });

  const [guests, setGuests] = useState<Guests>(() => {
    const storedData = localStorage.getItem('search-form-storage');
    if (storedData) {
      try {
        const parsed: SearchFormStorage = JSON.parse(storedData);
        if (parsed.Guests) {
          return {
            adults: parsed.Guests.adults || 1,
            children: parsed.Guests.children || 0,
            infants: parsed.Guests.infants || 0,
            pets: parsed.Guests.pets || 0,
          };
        }
      } catch (error) {
        console.error('Error parsing search-form-storage:', error);
      }
    }
    return {
      adults: 1,
      children: 0,
      infants: 0,
      pets: 0,
    };
  });

  // Actualizar localStorage cuando cambie selectionRange o guests
  useEffect(() => {
    const storedData = localStorage.getItem('search-form-storage');
    let storageData: SearchFormStorage = storedData ? JSON.parse(storedData) : {};
    storageData = {
      ...storageData,
      CheckInDate: selectionRange.startDate?.toISOString(),
      CheckOutDate: selectionRange.endDate?.toISOString(),
      Guests: guests,
    };
    localStorage.setItem('search-form-storage', JSON.stringify(storageData));
  }, [selectionRange, guests]);

  // Function to calculate enabled days
  const calculateEnabledDays = () => {
    if (!selectionRange.startDate || !selectionRange.endDate) {
      return 0;
    }

    const days = eachDayOfInterval({
      start: selectionRange.startDate,
      end: selectionRange.endDate,
    });

    const enabledDays = days.filter((day) => {
      return !disabledDates.some(
        (disabledDate: {
          getFullYear: () => number;
          getMonth: () => number;
          getDate: () => number;
        }) =>
          day.getFullYear() === disabledDate.getFullYear() &&
          day.getMonth() === disabledDate.getMonth() &&
          day.getDate() === disabledDate.getDate()
      );
    });

    return enabledDays.length;
  };

  // Recalculate enabled days when selectionRange or disabledDates change
  const enabledDaysCount = calculateEnabledDays();

  const handleNext = (payMethod?: string, formData?: any) => {
    if (payMethod == 'credit_card') {
      setRequestPay(formData);
      setMethodOfPayment(1);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const onSimulatePayment = (data: any) => {
    SimulatePayment(
      {
        calculationCode: data.calculationCode,
        amount: data.amount,
        currencyCode: data.currencyCode,
        methodOfPaymentId: methodOfPayment,
        paymentData: JSON.stringify(requestPay) ?? '',
        stan: '',
      },
      {
        onSuccess: (paymentResponse) => {
          const { statusCode: paymentStatusCode, resultError: paymentResultError } =
            paymentResponse;
          if (paymentStatusCode === '200') {
            showSnackbar(t('ReservationStepper.alerts.paymentSuccess'), 'success', 3000);
            // handleRouteLink(`${AssertRoutes.DETAIL_PROPERTY}/${id}`);
          } else {
            showSnackbar(paymentResultError?.message, 'error');
          }
        },
        onError: (error) => {
          showSnackbar(error?.message, 'error');
        },
      }
    );
  };

  const handleAccordionToggle = (stepIndex: number) => (_: any, isExpanded: boolean) => {
    if (stepIndex <= activeStep) {
      setActiveStep(isExpanded ? stepIndex : activeStep);
    }
  };

  // Render loading state
  if (isLoadingProperty) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Render error state
  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          Error: {error?.message || t('ReservationStepper.alerts.propertyLoadError')}
        </Typography>
      </Box>
    );
  }

  return (
    <Container
      maxWidth={isLargeScreen ? 'xl' : 'lg'}
      sx={{ px: { xs: 2, sm: 4, md: isLargeScreen ? 5 : 4 }, mt: 6 }}
    >
      <Helmet>
        <title>{t('ReservationStepper.title')}</title>
      </Helmet>
      {<LoadingThreeDotsJumping open={isPending || isPendingPay} modal={true} />}
      <Grid container spacing={10}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton
              edge="end"
              sx={{ mr: 2, color: 'black' }}
              onClick={() => handleRouteLink(`${'/reservation'}/${id}`)}
            >
              <ArrowBackIos />
            </IconButton>
            <Typography variant="h5" fontWeight="bold">
              {t('ReservationStepper.header')}
            </Typography>
          </Box>

          {/* Acordeones de pasos */}
          <Box sx={{ mt: 2 }}>
            {detailProperty && (
              <>
                <PaymentMethodCard
                  onNext={handleNext}
                  isExpanded={activeStep === 0}
                  onToggle={handleAccordionToggle(0)}
                  calculationCode={
                    detailProperty?.data?.payPriceCalculations[0]?.priceCalculation
                      ?.calculationCode ?? ''
                  }
                  bookId={detailProperty?.data?.bookId.toString() ?? '0'}
                  onPaymentRequestData={(commission) => setPaymentPlatformCommission(commission)}
                />
              </>
            )}
          </Box>
        </Grid>

        {/* Columna derecha - Sidebar */}
        <Grid size={{ xs: 12, md: 5 }}>
          <ReservationSidebar paymentPlatformCommission={paymentPlatformCommission} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ReservationStepper;
