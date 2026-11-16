import CancelStep2ReservationSkeleton from '@/components/CancelStep2ReservationSkeleton';
import CustomDialog from '@/components/CustomDialog';
import { useSnackbar } from '@/context/SnackbarContext';
import { useGet2 } from '@/hooks/api';
import { ApiService } from '@/services/ApiService';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CiMoneyBill } from 'react-icons/ci';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { CancellationPolicyCalculation } from './CancelReservationNewStep1';
import Cardreimbursement from './Cardreimbursement';
import { ApiResponse } from './DetailWishList';

export interface BookingResponse {
  data: BookingData;
}

/* ---------- BookingData (objeto principal) ---------- */
export interface BookingData {
  bookId: number;
  listingRentId: number;
  userIdRenter: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
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

export interface CancellationReasonResponse {
  data: CancellationReason[];
  statusCode: string;
  hasError: boolean;
  resultError: string | null;
}

export interface CancellationReason {
  cancellationReasonId: number;
  cancellationReasonParentId: number;
  cancellationGroupId: number;
  cancellationTypeCode: string;
  cancellationLevel: number;
  isEndStep: boolean;
  titleGroup: string;
  detail: string;
  messageTo: string;
  icon: string;
}
interface CancelBody {
  bookCancellationId: number;
  bookId: string;
  cancellationReasonId: number;
  messageTo: string;
  message: string;
}

const CancelReservationNewStep2: React.FC = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [refund, setRefund] = useState<number>(0);
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const reasonId = searchParams.get('reasonId');
  const { id: paramId } = useParams<{ id: string }>();
  const isLargeScreen = useMediaQuery('(min-width:1920px)');
  const id = paramId || '';
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const showSnackbar = useSnackbar();

  const {
    data: canceledPropertyStep1,
    isLoading: isLoadingProperty,
    isError: isErrorProperty,
    error: errorProperty,
  } = useGet2<BookingData>(['canceledBookNewStep1', id], `/Book/${id}`);

  const primaryPhoto = canceledPropertyStep1?.data?.listingRent.photos.find(
    (photo) => photo.isPrincipal
  );
  const photoToShow =
    primaryPhoto?.photoLink || canceledPropertyStep1?.data?.listingRent.photos[0]?.photoLink;

  const formatCheckDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    } catch {
      return '';
    }
  };

  const {
    data: reasonData,
    isLoading: isLoadingReason,
    isError: isErrorReason,
    error: errorReason,
  } = useGet2<any>(
    ['cancellationReasonNext', reasonId, id],
    `/Parametrics/GetGuestCancellationReasonNextStep/`,
    {
      cancellationReasonOwnerId: reasonId,
      bookingId: id,
    },
    Boolean(reasonId && id)
  );

  const deleteMutation = useMutation({
    mutationFn: (payload: CancelBody) =>
      ApiService.put<CancelBody>(`/Host/Booking/${id}/UpsertHostBookCancellation`, payload),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['UpsertHostBookCancellation'] });
    },
    onSuccess: (_data, variables) => {
      // navigate(`/refund-process-1/${variables.bookId}`);
      navigate(`/reservation/${variables.bookId}`);
    },
    onError: (error: any) => {
      console.error('Error al cancelar la reserva:', error);
    },
  });

  const handleConfirmDelete = () => {
    const payload: CancelBody = {
      bookCancellationId: 0,
      bookId: id,
      cancellationReasonId: Number(reasonData?.data[0]?.cancellationReasonId),
      messageTo: '',
      message: message.trim(),
    };
    deleteMutation.mutate(payload);
  };

  const deleteMutationRefund = useMutation<ApiResponse<CancellationPolicyCalculation>, Error, void>(
    {
      mutationFn: () =>
        ApiService.delete<ApiResponse<CancellationPolicyCalculation>>(
          `/Book/${id}/ConfirmedCancellationCalculation`
        ),
      onSuccess: (response) => {
        setRefund(response.data?.guestBalance || 0);

        if (response.hasError) {
          showSnackbar(t('cancelReservationStep2.errors.refundError'), 'error');
          return;
        }
      },
      onError: (error) => {
        showSnackbar(
          `${t('cancelReservationStep2.errors.refundDetailError')} ${error.message}`,
          'error'
        );
      },
    }
  );

  useEffect(() => {
    if (id) deleteMutationRefund.mutate();
  }, [id]);

  const isActuallyLoading = isLoadingProperty || (isLoadingReason && !!reasonId);

  if (isActuallyLoading) {
    return <CancelStep2ReservationSkeleton />;
  }

  if (isErrorProperty) {
    return (
      <Alert severity="error">
        {t('cancelReservationStep2.errors.loadReservation')} {errorProperty?.message}
      </Alert>
    );
  }

  if (isErrorReason) {
    return (
      <Alert severity="error">
        {t('cancelReservationStep2.errors.loadReasons')} {errorReason?.message}
      </Alert>
    );
  }
  return (
    <Container
      maxWidth={isLargeScreen ? 'xl' : 'lg'}
      sx={{ px: { xs: 2, sm: 3, md: isLargeScreen ? 5 : 4 }, mt: { xs: 2, md: 6 } }}
    >
      <Grid container spacing={4} justifyContent="space-between">
        <Grid size={{ xs: 12, md: 5 }}>
          <IconButton
            onClick={() => navigate(`/canceled-new-step1/${id}`)}
            sx={{
              mb: 3,
              bgcolor: '#f0f0f0',
              width: 40,
              height: 40,
              '&:hover': {
                bgcolor: '#e0e0e0',
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          {!reasonData || !reasonData.data ? (
            <Skeleton
              variant="rectangular"
              width={'100%'}
              height={32}
              sx={{ mb: 1, borderRadius: 1 }}
            />
          ) : (
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {reasonData.data[0]?.titleGroup}
            </Typography>
          )}

          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            {t('cancelReservationStep2.description')}
          </Typography>

          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder={t('cancelReservationStep2.placeholder')}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              size="medium"
              disabled={!message.trim()}
              onClick={() => {
                setOpenDialog(true);
              }}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: 'white',
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': {
                  bgcolor: theme.palette.primary.main,
                },
                '&.Mui-disabled': {
                  bgcolor: 'rgba(0, 0, 0, 0.12)',
                  color: 'rgba(0, 0, 0, 0.26)',
                },
              }}
            >
              {t('cancelReservationStep2.buttons.sendAndCancel')}
            </Button>
          </Box>
        </Grid>
        <Cardreimbursement
          image={photoToShow || ''}
          title={canceledPropertyStep1?.data?.listingRent?.name}
          location={`${canceledPropertyStep1?.data?.listingRent?.property?.address?.city?.city}, ${canceledPropertyStep1?.data?.listingRent?.property?.address?.city?.country}`}
          rating={canceledPropertyStep1?.data?.listingRent?.valoration ?? undefined}
          reviews={canceledPropertyStep1?.data?.listingRent?.reviews?.length}
          checkIn={
            formatCheckDate(canceledPropertyStep1?.data?.checkin) ||
            t('cancelReservationStep2.card.noDate')
          }
          checkOut={
            formatCheckDate(canceledPropertyStep1?.data?.checkout) ||
            t('cancelReservationStep2.card.noDate')
          }
          travelers="1 adulto"
          paid={`BOB. ${canceledPropertyStep1?.data?.amountTotal}`}
          refund={`BOB. ${refund}`}
          cancelPolicy={canceledPropertyStep1?.data?.listingRent?.cancelationPolicy}
        />
      </Grid>

      <CustomDialog
        isOpen={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="xs"
        title={t('cancelReservationStep2.dialog.title')}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          {t('cancelReservationStep2.dialog.description')}
        </Typography>

        <Box
          sx={{
            bgcolor: '#f5f5f5',
            borderRadius: 2,
            p: 2.5,
            mb: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              component="span"
              sx={{
                fontSize: '1.2rem',
              }}
            >
              <CiMoneyBill size={24} />
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {t('cancelReservationStep2.dialog.refundLabel')}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {`BOB. ${refund}`}
          </Typography>
        </Box>
        <Box display={'flex'} justifyContent={'center'}>
          <Button
            fullWidth
            variant="primary"
            disabled={!message.trim()}
            onClick={handleConfirmDelete}
          >
            {t('cancelReservationStep2.buttons.sendAndCancel')}
          </Button>
        </Box>
      </CustomDialog>
    </Container>
  );
};

export default CancelReservationNewStep2;
