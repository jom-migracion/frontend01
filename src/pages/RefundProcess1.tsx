import { useGet2 } from '@/hooks/api';
import { theme } from '@/themes/theme';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid2';
import { format, parseISO, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

export interface CancellationType {
  bookCancellationTypeId: number;
  canellationTypeCode: string;
  name: string;
  detalle: string;
}

export interface BookCancellationPolicyCalculation {
  cancellationTypeId: number;
  datetimeCancellation: string;
  hostBalance: number;
  guestBalance: number;
  jomBalance: number;
  paymentPlatformBalance: number;
  iva: number;
  it: number;
  ivaItTopay: number;
  penaltyToHost: boolean;
  affectedNigths: number;
  penaltyAmount: number;
  cancellationType: CancellationType;
}

export interface RefundAccount {
  payoutAccountId: string;
  userId: string;
  numberAccount: string;
  accountDetails: string | null;
  methodOfPayment: number;
  accStatus: string | null;
  isPrincipal: boolean;
  formOfPaymentId: string | number | null;
  bankCode: string | null;
  bankName: string | null;
}

export interface RefundData {
  userId: string;
  amount: number;
  refundStatus: string;
  scheduledRefundDate: string;
  refundDate: string;
  attemptCount: number;
  failureReason: string | null;
  bookId: string | number | null;
  transactionStatusId: number;
  lastAttempt: string | null;
  originalAmount: number;
  poCode: string;
  currencyCode: string | null;
  createdAt: string | null;
  affectedsNights: number | null;
  bookCancellationPolicyCalculationId: string | number | null;
  bookCancellationPolicyCalculation: BookCancellationPolicyCalculation;
  methodOfPayment: string | null;
  refundAccount: RefundAccount;
  transactionStatus: string | null;
}

export interface ApiResponse<T = RefundData> {
  data: T;
  statusCode: string;
  hasError: boolean;
  resultError: string | null;
}

// Interfaz principal de la respuesta
export interface BookingResponse {
  data: BookingData | null;
  statusCode: string;
  hasError: boolean;
  resultError: string | null;
}

// Datos principales de la reserva
export interface BookingData {
  bookId: string;
  listingRentId: number;
  userIdRenter: number;
  startDate: string; // ISO string
  endDate: string;
  amountTotal: number;
  currencyId: number;
  mountPerNight: number | null;
  amountFees: number | null;
  nameRenter: string;
  lastNameRenter: string;
  termsAccepted: boolean;
  additionalInfo: string | null;
  bookStatusId: number;
  isApprobal: boolean;
  approvalDetails: string | null;
  isManualApprobal: boolean | null;
  daysToApproval: number | null;
  initDate: string | null;
  paymentCode: string;
  pk: string | null;
  paymentId: string;
  depositSec: number | null;
  pickUpLocation: string | null;
  vggFee: number | null;
  vggFeePercent: number | null;
  checkin: string;
  checkout: string;
  maxCheckin: string;
  guestCheckin: string | null;
  guestCheckout: string | null;
  cancellationStart: string | null;
  cancellationEnd: string | null;
  cancellation: string | null;
  cancellationUserId: number | null;
  reasonRefusedId: number | null;
  requestDateTime: string;
  expiredDateTime: string | null;
  gests: number;
  existPet: boolean | null;
  calendarDays: any[]; // puedes tipar más si sabes la estructura
  owner: Owner;
  photos: Photo[];
  listingRent: ListingRent;
  bookStatus: BookStatus;
  cancellationUser: any | null; // null en el ejemplo
  userIdRenterNavigation: User;
  currency: any | null; // null en el ejemplo
  reasonRefused: any | null;
  tlListingReviews: ListingReview[];
  authorizationDateTime: string;
  authTimeElapsed: string;
  reviewDateTime: string;
  checkinStatus: boolean;
  checkoutStatus: boolean;
  payPriceCalculations: PayPriceCalculation[];
  datetimePayment: string;
  datetimePayout: string | null;
  datetimePayoutProgram: string | null;
  guestCount: number;
  canReview: boolean;
  valoration: number;
  totalRents: string;
  myProperty: number;
  isFavorite: boolean;
  privateBathroom: boolean | null;
  privateBathroomLodging: boolean | null;
  sharedBathroom: boolean | null;
  avgReviews: number;
  minimunStay: number;
  maximumStay: number;
  minimumNotice: number;
  minimumNoticeHour: number | null;
  preparationDays: number;
  availabilityWindowMonth: number | null;
  checkInDays: any | null;
  checkOutDays: any | null;
}

// Interfaces auxiliares
export interface Owner {
  userId: number;
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
  registerDateDays: number | null;
  registerDateMonths: number | null;
  registerDateYears: number | null;
  cityName: string;
  status: string;
}

export interface User {
  userId: number;
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
  registerDateDays: number | null;
  registerDateMonths: number | null;
  registerDateYears: number | null;
  cityName: string;
  status: string;
}

export interface Photo {
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

export interface BookStatus {
  bookStatusId: number;
  name: string;
  description: string;
  code: string;
}

// Puedes extender estas interfaces si necesitas más detalle
export interface ListingRent {
  listingRentId: number;
  name: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  beds: number;
  listingRentConfirmationDate: string;
  cancelationPolicy: CancellationPolicy;
  owner: Owner;
  property: Property;
  price: Price;
  photos: Photo[];
  reviews: ListingReview[];
  // ... otros campos según necesites
}

export interface CancellationPolicy {
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

export interface Property {
  latitude: number;
  longitude: number;
  address: Address;
  cityName: string;
  countyName: string;
  stateName: string;
  countryName: string;
}

export interface Address {
  zipCode: string | null;
  address1: string;
  address2: string | null;
  cityId: number;
  countyId: number;
  stateId: number;
  city: City;
}

export interface City {
  cityId: number;
  city: string;
  state: string;
  country: string;
  county: string;
}

export interface Price {
  priceNightly: number;
  weekendNightlyPrice: number;
  currencyId: number;
  // ... otros campos de precio
}

export interface ListingReview {
  user: string;
  dateTimeReview: string;
  calification: number;
  comment: string;
  userProfilePhoto: string;
  isComplete: boolean;
  listingReviewId: number;
  userId: number;
  listingRentId: number;
  bookId: number;
  reviewQuestions: ReviewQuestion[];
  listingRent: ListingRent;
}

export interface ReviewQuestion {
  listingReviewQuestionId: number;
  listingReviewId: number;
  reviewQuestionId: number;
  rating: number;
  reviewDate: string;
}

export interface PayPriceCalculation {
  priceCalculation: PriceCalculation;
  priceBreakdowns: PriceBreakdown[];
}

export interface PriceCalculation {
  priceCalculationId: number;
  calculationCode: string;
  bookId: number;
  amount: number;
  currencyCode: string;
  calculationDetails: string;
  creationDate: string;
  expirationDate: string;
  calculationStatue: string;
  breakdownInfo: string; // es un JSON stringificado
  // ... otros campos
}

export interface PriceBreakdown {
  type: string;
  description: string;
  amount: number;
  percentage: number | null;
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

const RefundProcess1 = () => {
  const { id } = useParams();
  const refundId = id;
  const { t } = useTranslation();

  const isLargeScreen = useMediaQuery('(min-width:1920px)');

  const {
    data: refundData,
    isLoading: isLoadingRefund,
    isError: isErrorRefund,
    error: questionError,
  } = useGet2<PaymentData>(['refund-proccess-1'], `/Book/${refundId}/CancelationDetails`);

  const {
    data: detailProperty,
    isLoading: isLoadingProperty,
    isError: isErrorProperty,
  } = useGet2<BookingData>(['book-detail', refundId], `/Book/${refundId}`);

  const {
    data: refundProperty,
    isLoading: isLoadingRefundProperty,
    isError: isErrorRefundProperty,
  } = useGet2<RefundData>(['Refund', refundId], `/Refund/GetByBookId/${refundId}`);

  if (isLoadingRefund || isLoadingProperty || isLoadingRefundProperty) {
    return <div>{t('RefundProcess1.loading')}</div>;
  }
  if (isErrorRefund || isErrorProperty || isErrorRefundProperty) {
    return (
      <>
        <div>Error: {questionError instanceof Error ? questionError.message : 'Unknown error'}</div>
        <div>Error: {isErrorRefundProperty ? 'Error loading refund property' : null}</div>
      </>
    );
  }

  console.log('Refund Data:', detailProperty?.data?.listingRent?.photos[0]?.photoLink);

  return (
    <Container
      maxWidth={isLargeScreen ? 'xl' : 'lg'}
      sx={{
        px: { xs: 1.5, sm: 3, md: isLargeScreen ? 5 : 4 },
        mt: { xs: 2, sm: 4, md: 6 },
        pb: { xs: 3, md: 0 },
      }}
    >
      <Box>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {/* Left column */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 4, md: 6 },
                borderRadius: { xs: 2, md: 3 },
                //  border: '1px solid rgba(0, 0, 0, 0.08)',
              }}
            >
              <Stack spacing={{ xs: 2.5, sm: 3, md: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  {/* <Avatar
                    sx={{ width: 56, height: 56, mx: 'auto', bgcolor: 'transparent', boxShadow: 0 }}
                  >
                    <CreditCardIcon sx={{ fontSize: '48px', color: 'gray' }} />
                  </Avatar> */}

                  <Typography
                    sx={{
                      fontSize: { xs: '24px', sm: '28px', md: '34px' },
                      fontWeight: 800,
                      mt: { xs: 1, md: 2 },
                      color: '#1e293b',
                    }}
                  >
                    {/* {refundData?.data?.currency}. {refundData?.data?.guestBalance?.toFixed(2)} */}
                    {refundData?.data?.currency} . {refundProperty?.data?.amount.toFixed(2)}
                  </Typography>
                  <Typography
                    sx={{
                      color: 'text.secondary',
                      mt: 0.5,
                      fontSize: { xs: '14px', sm: '15px', md: '16px' },
                    }}
                  >
                    {t('RefundProcess1.title')}
                  </Typography>

                  <Typography
                    sx={{
                      mt: { xs: 2, md: 3 },
                      color: 'text.secondary',
                      fontSize: { xs: '13px', sm: '14px', md: '15px' },
                      lineHeight: 1.6,
                      px: { xs: 1, sm: 0 },
                    }}
                  >
                    {t('RefundProcess1.description')}
                  </Typography>
                </Box>

                <Divider sx={{ my: { xs: 0.5, md: 1 } }} />

                {/* Detalles */}
                <Box>
                  <Typography
                    sx={{
                      fontSize: { xs: '16px', sm: '18px', md: '20px' },
                      fontWeight: 700,
                      mb: { xs: 1.5, md: 2 },
                      color: '#1e293b',
                    }}
                  >
                    {t('RefundProcess1.details.title')}
                  </Typography>

                  <Grid container spacing={{ xs: 1, md: 0 }}>
                    <Grid size={{ xs: 7, sm: 8 }}>
                      <Typography
                        sx={{
                          color: 'text.secondary',
                          fontSize: { xs: '13px', sm: '14px', md: '15px' },
                        }}
                      >
                        {t('RefundProcess1.details.amount')}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 5, sm: 4 }} sx={{ textAlign: 'right' }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: '13px', sm: '14px', md: '15px' },
                        }}
                      >
                        {/* {refundData?.data?.currency}. {refundData?.data?.guestBalance?.toFixed(2)} */}
                        {refundData?.data?.currency} . {refundProperty?.data?.amount.toFixed(2)}
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 7, sm: 8 }} sx={{ mt: { xs: 0.5, md: 0 } }}>
                      <Typography
                        sx={{
                          color: 'text.secondary',
                          fontSize: { xs: '13px', sm: '14px', md: '15px' },
                        }}
                      >
                        {t('RefundProcess1.details.paymentMethod')}
                      </Typography>
                    </Grid>
                    <Grid
                      size={{ xs: 5, sm: 4 }}
                      sx={{ mt: { xs: 0.5, md: 0 }, textAlign: 'right' }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: '13px', sm: '14px', md: '15px' },
                        }}
                      >
                        {refundData?.data?.instanceOfPayment}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: { xs: 1, md: 2 } }} />

                {/* Timeline */}
                <List sx={{ p: 0 }}>
                  <ListItem sx={{ px: { xs: 0, sm: 2 }, py: { xs: 1, md: 2 } }}>
                    <ListItemAvatar sx={{ minWidth: { xs: 40, sm: 56 } }}>
                      <CheckCircleIcon
                        sx={{
                          color: theme.palette.primary.main,
                          fontSize: { xs: '28px', sm: '32px', md: '36px' },
                        }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: { xs: '14px', sm: '15px', md: '16px' },
                            color: '#1e293b',
                          }}
                        >
                          {t('RefundProcess1.timeline.initiated')}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          sx={{
                            color: 'text.secondary',
                            fontSize: { xs: '12px', sm: '13px', md: '14px' },
                          }}
                        >
                          {refundData?.data?.processDate && (
                            <>
                              {' '}
                              {format(parseISO(refundData!.data!.processDate), 'EEE, d MMM', {
                                locale: es,
                              })}
                            </>
                          )}
                        </Typography>
                      }
                    />
                  </ListItem>

                  <ListItem sx={{ px: { xs: 0, sm: 2 }, py: { xs: 1, md: 2 } }}>
                    <ListItemAvatar sx={{ minWidth: { xs: 40, sm: 56 } }}>
                      <CheckCircleIcon
                        sx={{
                          color: theme.palette.primary.main,
                          fontSize: { xs: '28px', sm: '32px', md: '36px' },
                        }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: { xs: '14px', sm: '15px', md: '16px' },
                            color: '#1e293b',
                          }}
                        >
                          {t('RefundProcess1.timeline.processing')}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          sx={{
                            color: 'text.secondary',
                            fontSize: { xs: '12px', sm: '13px', md: '14px' },
                          }}
                        >
                          {refundData?.data?.processDate && (
                            <>
                              {' '}
                              {format(parseISO(refundData!.data!.processDate), 'EEE, d MMM', {
                                locale: es,
                              })}
                            </>
                          )}
                        </Typography>
                      }
                    />
                  </ListItem>

                  <ListItem sx={{ px: { xs: 0, sm: 2 }, py: { xs: 1, md: 2 } }}>
                    <ListItemAvatar sx={{ minWidth: { xs: 40, sm: 56 } }}>
                      <RadioButtonUncheckedIcon
                        sx={{
                          color: '#64748b',
                          fontSize: { xs: '28px', sm: '32px', md: '36px' },
                        }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: { xs: '14px', sm: '15px', md: '16px' },
                            color: '#1e293b',
                          }}
                        >
                          {t('RefundProcess1.timeline.estimatedArrival')}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          sx={{
                            color: 'text.secondary',
                            fontSize: { xs: '12px', sm: '13px', md: '14px' },
                          }}
                        >
                          {t('RefundProcess1.timeline.estimatedDate')}{' '}
                          {refundData?.data?.processDate &&
                            format(
                              addDays(parseISO(refundData.data.processDate), 1),
                              'EEE, d MMM',
                              {
                                locale: es,
                              }
                            )}
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              </Stack>
            </Paper>
          </Grid>

          {/* Right column */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card
              elevation={0}
              sx={{
                borderRadius: { xs: 2, sm: 4, md: 6 },
                border: '1px solid rgba(100, 116, 139, 0.2)',
                overflow: 'hidden',
              }}
            >
              <CardActionArea sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                  <Grid size={{ xs: 5, sm: 4 }}>
                    <CardMedia
                      component="img"
                      image={detailProperty?.data?.listingRent?.photos[0]?.photoLink}
                      alt="propiedad"
                      sx={{
                        width: '100%',
                        height: { xs: '100px', sm: '120px', md: '140px' },
                        objectFit: 'cover',
                        borderRadius: { xs: 1, sm: 1.5 },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 7, sm: 8 }}>
                    <CardContent
                      sx={{ p: { xs: 0.5, sm: 1 }, '&:last-child': { pb: { xs: 0.5, sm: 1 } } }}
                    >
                      <Chip
                        label={t('RefundProcess1.card.statusCancelled')}
                        size="small"
                        sx={{
                          color: '#c94b43',
                          bgcolor: '#fef2f2',
                          mb: { xs: 0.5, sm: 1 },
                          fontSize: { xs: '11px', sm: '12px' },
                          height: { xs: '20px', sm: '24px' },
                          fontWeight: 600,
                        }}
                      />
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: '13px', sm: '14px', md: '16px' },
                          color: '#1e293b',
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {detailProperty?.data?.listingRent?.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: { xs: '11px', sm: '12px' },
                          color: 'text.secondary',
                          mt: { xs: 0.5, sm: 1 },
                          lineHeight: 1.4,
                        }}
                      >
                        {t('RefundProcess1.card.reservationCode')}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: { xs: '11px', sm: '12px' },
                          color: 'text.secondary',
                          mt: { xs: 0.5, sm: 1 },
                          lineHeight: 1.4,
                        }}
                      >
                        {refundProperty?.data?.poCode}
                      </Typography>
                    </CardContent>
                  </Grid>
                </Grid>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default RefundProcess1;
