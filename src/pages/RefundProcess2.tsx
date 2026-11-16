import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useParams } from 'react-router';
import { useGet2 } from '@/hooks/api';
import RefundProcessSkeleton from '@/components/RefundProcessSkeleton';

export interface BookingResponse {
  data: BookingData;
}

export interface BookingData {
  bookId: number;
  listingRentId: number;
  userIdRenter: number;
  startDate: string;
  endDate: string;
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
  guestCount: number | null;
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
  rentRules: RentRule[];
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

export interface PaymentResponse {
  data: PaymentData | null;
  statusCode: string;
  hasError: boolean;
  resultError: string | null;
}

export interface PaymentData {
  payoutDate: string | null;
  processDate: string;
  createdAt: string;
  scheduledPayoutDate: string | null;
  numberAccount: string | null;
  instanceOfPayment: string;
  currency: string;
  guestBalance: number;
}

const RefundProcess2 = () => {
  const theme = useTheme();
  const { id: paramId } = useParams();
  const id = paramId || '';

  const {
    data: bookingData,
    isLoading: isLoadingProperty,
    isError,
    error,
  } = useGet2<BookingData>(['refundprocess', id], `/Book/${id}`);

  const primaryPhoto = bookingData?.data?.listingRent.photos.find((photo) => photo.isPrincipal);
  const photoToShow =
    primaryPhoto?.photoLink || bookingData?.data?.listingRent.photos[0]?.photoLink;

  const formatCheckDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    } catch {
      return '';
    }
  };

  if (isLoadingProperty) return <RefundProcessSkeleton />;
  if (isError) return <Alert severity="error">Error loading property: {error.message}</Alert>;

  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Left column */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper sx={{ p: 6, borderRadius: 2, boxShadow: 0 }}>
              <Stack spacing={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar
                    sx={{ width: 56, height: 56, mx: 'auto', bgcolor: 'transparent', boxShadow: 0 }}
                  >
                    <CreditCardIcon sx={{ fontSize: 28 }} />
                  </Avatar>

                  <Typography variant="h4" sx={{ fontWeight: 800, mt: 2 }}>
                    BOB. {bookingData?.data?.amountTotal?.toFixed(2) || '0.00'}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>Reembolso</Typography>

                  <Typography sx={{ mt: 3, color: 'text.secondary' }}>
                    Te enviamos tu reembolso el{' '}
                    {formatCheckDate(bookingData?.data?.cancellationStart)}. Contáctate con el banco
                    y proporciona este{' '}
                    <Link href="#" underline="hover" sx={{ fontWeight: 600 }}>
                      numero de referencia (ARN)
                    </Link>{' '}
                    si todavía no aparece el reembolso en tu cuenta
                  </Typography>

                  <Box
                    sx={{
                      bgcolor: '#eee',
                      borderRadius: 1,
                      mt: 2,
                      p: 1.5,
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    {bookingData?.data?.paymentCode || '7450057426419067494728'}
                  </Box>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Detalles */}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Detalles
                  </Typography>

                  <Grid container>
                    <Grid size={{ xs: 8 }}>
                      <Typography sx={{ color: 'text.secondary' }}>Monto del reembolso</Typography>
                    </Grid>
                    <Grid size={{ xs: 4 }} sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontWeight: 600 }}>
                        BOB. {bookingData?.data?.amountTotal?.toFixed(2) || '0.00'}
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 8 }} sx={{ mt: 1 }}>
                      <Typography sx={{ color: 'text.secondary' }}>Forma de pago</Typography>
                    </Grid>
                    <Grid size={{ xs: 4 }} sx={{ mt: 1, textAlign: 'right' }}>
                      <Typography sx={{ fontWeight: 600 }}>
                        {bookingData?.data?.payPriceCalculations?.[0]?.priceCalculation
                          ?.methodOfPayment || 'Visa 05II'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Timeline */}
                <List>
                  <ListItem>
                    <ListItemAvatar>
                      <CheckCircleIcon
                        sx={{ color: theme.palette.primary.main, fontSize: '36px' }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography sx={{ fontWeight: 700 }}>Reemolso iniciado</Typography>}
                      secondary={
                        <Typography sx={{ color: 'text.secondary' }}>
                          {formatCheckDate(bookingData?.data?.cancellationStart)}
                        </Typography>
                      }
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemAvatar>
                      <CheckCircleIcon
                        sx={{ color: theme.palette.primary.main, fontSize: '36px' }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography sx={{ fontWeight: 700 }}>Procesando el reembolso</Typography>
                      }
                      secondary={
                        <Typography sx={{ color: 'text.secondary' }}>
                          {formatCheckDate(bookingData?.data?.cancellationStart)}
                        </Typography>
                      }
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemAvatar>
                      <CheckCircleIcon
                        sx={{ color: theme.palette.primary.main, fontSize: '36px' }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography sx={{ fontWeight: 700 }}>Fecha de reembolso</Typography>}
                      secondary={
                        <Typography sx={{ color: 'text.secondary' }}>
                          {formatCheckDate(bookingData?.data?.cancellationEnd)}
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>

                <Button
                  variant="contained"
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: '#fff',
                    borderRadius: 1,
                    mt: 2,
                  }}
                  fullWidth
                >
                  Obtén recibo
                </Button>
              </Stack>
            </Paper>
          </Grid>

          {/* Right column */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={{ borderRadius: 2, boxShadow: 4 }}>
              <CardActionArea sx={{ p: 2 }}>
                <Grid container>
                  <Grid size={{ xs: 5 }}>
                    <CardMedia
                      component="img"
                      image={photoToShow || 'https://picsum.photos/300/200'}
                      alt="propiedad"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Grid>
                  <Grid size={{ xs: 7 }}>
                    <CardContent>
                      <Chip
                        label={bookingData?.data?.bookStatus?.name || 'Cancelada'}
                        size="small"
                        sx={{ color: '#c94b43', mb: 1 }}
                      />
                      <Typography sx={{ fontWeight: 700 }}>
                        {bookingData?.data?.listingRent?.name || 'Monoambiente - Nomad Smart'}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 1 }}>
                        Codigo de reservación: {bookingData?.data?.paymentCode || 'HSKFORJALAOE'}
                      </Typography>
                    </CardContent>
                  </Grid>
                </Grid>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default RefundProcess2;
