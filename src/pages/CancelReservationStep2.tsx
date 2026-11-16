import CancelStep2ReservationSkeleton from '@/components/CancelStep2ReservationSkeleton';
import { useGet2 } from '@/hooks/api';
import useHandleRouteLink from '@/hooks/useHandleRouteLink';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import Cardreimbursement from './Cardreimbursement';

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

const CancelReservationStep2: React.FC = () => {
  const { id: paramId } = useParams();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery('(min-width:1920px)');
  const handleRouteLink = useHandleRouteLink();
  const id = paramId || '';
  const [cancelReason, setCancelReason] = useState('');

  const {
    data: canceledPropertyStep2,
    isLoading: isLoadingProperty,
    isError,
    error,
  } = useGet2<BookingData>(['canceledBookStep2', id], `/Book/${id}`);

  const primaryPhoto = canceledPropertyStep2?.data?.listingRent.photos.find(
    (photo) => photo.isPrincipal
  );
  const photoToShow =
    primaryPhoto?.photoLink || canceledPropertyStep2?.data?.listingRent.photos[0]?.photoLink;

  // Función para formatear fechas de checkin/checkout
  const formatCheckDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    } catch {
      return '';
    }
  };

  if (isLoadingProperty) return <CancelStep2ReservationSkeleton />;
  if (isError) return <Alert severity="error">Error loading property: {error.message}</Alert>;
  return (
    <Container
      maxWidth={isLargeScreen ? 'xl' : 'lg'}
      sx={{ px: { xs: 2, sm: 3, md: isLargeScreen ? 5 : 4 }, mt: { xs: 2, md: 6 } }}
    >
      <Grid container spacing={4}>
        {/* Columna izquierda */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" gutterBottom>
            ¿Cuéntale a {canceledPropertyStep2?.data?.owner.name}{' '}
            {canceledPropertyStep2?.data?.owner.lastName} por que tienes que cancelar?
          </Typography>

          <TextField
            multiline
            rows={3}
            maxRows={4}
            placeholder="Describe el problema"
            variant="outlined"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            sx={{ borderRadius: 8, width: '80%' }}
          />

          <Button
            variant="contained"
            disabled={!cancelReason.trim()}
            sx={{
              mt: 3,
              bgcolor: theme.palette.primary.main,
              color: 'white',
              '&:hover': { bgcolor: theme.palette.primary.main },
              '&:disabled': {
                bgcolor: 'rgba(0, 0, 0, 0.12)',
                color: 'rgba(0, 0, 0, 0.26)',
              },
              textTransform: 'none',
            }}
            onClick={() => handleRouteLink(`/reservation/${canceledPropertyStep2?.data?.bookId}`)}
          >
            Cancelar reservación
          </Button>
        </Grid>
        <Cardreimbursement
          image={photoToShow || ''}
          title={canceledPropertyStep2?.data?.listingRent?.name}
          location={`${canceledPropertyStep2?.data?.listingRent?.property?.address?.city?.city}, ${canceledPropertyStep2?.data?.listingRent?.property?.address?.city?.country}`}
          rating={canceledPropertyStep2?.data?.listingRent?.valoration ?? undefined}
          reviews={canceledPropertyStep2?.data?.listingRent?.reviews?.length}
          checkIn={formatCheckDate(canceledPropertyStep2?.data?.checkin) || 'Sin fecha'}
          checkOut={formatCheckDate(canceledPropertyStep2?.data?.checkout) || 'Sin fecha'}
          travelers="1 adulto"
          paid={`BOB. ${canceledPropertyStep2?.data?.amountTotal}`}
          refund="BOB. 300,00"
          cancelPolicy={canceledPropertyStep2?.data?.listingRent?.cancelationPolicy}
        />
      </Grid>
    </Container>
  );
};

export default CancelReservationStep2;

// import { Box, Typography, Container, Paper, Card, CardMedia, Link } from '@mui/material';
// import Grid from '@mui/material/Grid2';

// const RefundProcess3 = () => {
//   return (
//     <Box sx={{ minHeight: '100vh', py: 4 }}>
//       <Container maxWidth="lg">
//         <Grid container spacing={4}>
//           <Grid size={{ xs: 12, md: 7 }}>
//             <Box>
//               <Typography variant="h5" sx={{ fontWeight: 700 }}>
//                 Tus pagos para [nombre del anuncio]
//               </Typography>

//               <Typography sx={{ mt: 2, fontWeight: 600 }}>Completado</Typography>
//               <Typography sx={{ mt: 2, color: 'text.secondary' }}>2024</Typography>

//               {/* Payment item - Refund */}
//               <Grid container alignItems="center" spacing={2} sx={{ mt: 2 }}>
//                 <Grid>
//                   <Card sx={{ display: 'flex', boxShadow: 0 }}>
//                     <CardMedia
//                       component="img"
//                       sx={{ width: 120, borderRadius: 1 }}
//                       image="https://picsum.photos/200/120"
//                       alt="propiedad"
//                     />
//                   </Card>
//                 </Grid>
//                 <Grid>
//                   <Typography sx={{ fontWeight: 700 }}>Reembolsado 20 sept</Typography>
//                   <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Visa 0511</Typography>
//                   <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
//                     Santa Cruz de la Sierra 22 sept - 25 sept
//                   </Typography>
//                 </Grid>
//                 <Grid>
//                   <Typography sx={{ fontWeight: 700, color: '#000' }}>- 300 BOB</Typography>
//                 </Grid>
//               </Grid>

//               <Grid container alignItems="center" spacing={2} sx={{ mt: 3 }}>
//                 <Grid>
//                   <Card sx={{ display: 'flex', boxShadow: 0 }}>
//                     <CardMedia
//                       component="img"
//                       sx={{ width: 120, borderRadius: 1 }}
//                       image="https://picsum.photos/200/120"
//                       alt="propiedad"
//                     />
//                   </Card>
//                 </Grid>
//                 <Grid>
//                   <Typography sx={{ fontWeight: 700 }}>Pagado 9 sept</Typography>
//                   <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Visa 0511</Typography>
//                   <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
//                     Santa Cruz de la Sierra 22 sept - 25 sept
//                   </Typography>
//                 </Grid>
//                 <Grid>
//                   <Typography sx={{ fontWeight: 700, color: '#000' }}>300 BOB</Typography>
//                 </Grid>
//               </Grid>
//             </Box>
//           </Grid>

//           <Grid size={{ xs: 12, md: 5 }}>
//             <Paper sx={{ p: 3, borderRadius: 2 }} style={{ boxShadow: ' 0 0 10px #c9c6c6' }}>
//               <Typography sx={{ fontWeight: 700, mb: 2 }}>¿Necesitas ayuda?</Typography>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//                 <Link href="#" underline="hover">
//                   ¿Cómo funcionan los planes de pago?
//                 </Link>
//                 <Link href="#" underline="hover">
//                   ¿Cómo se paga una reservación de larga duración?
//                 </Link>
//                 <Link href="#" underline="hover">
//                   ¿Dónde puedo consultar mi pago?
//                 </Link>
//               </Box>
//             </Paper>
//           </Grid>
//         </Grid>
//       </Container>
//     </Box>
//   );
// };

// export default RefundProcess3;
