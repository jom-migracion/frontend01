import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  IconButton,
  Avatar,
  Chip,
  Divider,
  CardContent,
  Paper,
  Stack,
  Link,
  useTheme,
  useMediaQuery,
  Rating,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useEffect, useMemo, useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { ArrowBackIos } from '@mui/icons-material';
import { useMessageStoreReservation } from '@/store/message.store';
import { useNavigate } from 'react-router';
import ReviewDialog from '@/components/ReviewDialog';
import { useGet2 } from '@/hooks/api';
import { formatDateCheckIn } from '@/common/util/dateFunctions';
import { Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { AssertRoutes } from '@/common/enum/AssertRoutes';
import { formatDate } from '@/utilities/dateUtils';
import { useTranslation } from 'react-i18next';
import { estadoColorReserva, EstadoReserva } from '@/common/util/statusFunctios';
import { useAuthStore } from '@/store/auth.store';
import { formatSemicolon } from '@/common/util/numbersFuntios';
import SectionRentModal from '@/components/SectionRentModal';

const DetailPanelMessageGuest01: React.FC<{
  listingRentData: any;
  conversation: any;
  bookingData: any;
  reloadConversation?: () => void;
  onCloseMobile?: () => void;
}> = ({ listingRentData, conversation, bookingData, reloadConversation, onCloseMobile }) => {
  // const
  const { name, description, property, price, photos, listingRentId } =
    bookingData?.listingRent || listingRentData || {};
  const { bookId, userIdTwoNavigation, userIdOneNavigation, listingRent, booking } =
    conversation || {};
  const {
    bookStatus,
    checkin,
    checkout,
    gests,
    listingRent: listingRentBooking,
    payPriceCalculations,
  } = bookingData || {};

  // const estadoResult: any = estadoColorReserva(bookStatus?.code, checkin, checkout);
  const estadoResult = estadoColorReserva(
    bookStatus?.code as string,
    bookingData?.checkin as string,
    bookingData?.checkout as string
  ) as EstadoReserva;
  const IconComponent = estadoResult.icon;

  // storeo
  const stateReservation = useMessageStoreReservation((state: any) => state.stateReservation);
  const { identifier: userId } = useAuthStore.getState();

  const userInv = userIdTwoNavigation?.userId != userId ? userIdTwoNavigation : userIdOneNavigation;

  // useState
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openReview, setOpenReview] = useState<boolean>(false);
  const [step, setStep] = useState(0);

  // api

  const { data: ReviewQuestionsMessage } = useGet2<any>(
    'ReviewQuestionsMessageReservations',
    '/Parametrics/ReviewQuestions/GuestToHost'
  );
  const { data: reviewData, refetch } = useGet2<any>(
    'reviewMessage',
    `/Book/${bookId}/Review`,
    {},
    false
  );
  const { data: GetProfileByUserIdMessage } = useGet2<any>(
    'GetProfileByUserIdMessage1',
    `/GetAdditionalProfileDataByUserId/${userId == userIdOneNavigation?.userId ? userIdTwoNavigation?.userId : userIdOneNavigation?.userId}`
  );

  // hooks
  const navigate = useNavigate();
  const theme = useTheme();

  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const { t } = useTranslation();

  const questions = useMemo(
    () =>
      ReviewQuestionsMessage?.data && Array.isArray(ReviewQuestionsMessage.data)
        ? ReviewQuestionsMessage.data.slice(0, 4)
        : [],
    [ReviewQuestionsMessage]
  );

  const countNightByNight =
    payPriceCalculations?.[0]?.priceBreakdowns?.filter(
      (item: any) => item?.Type == 'BASE_PRICE' || item?.type == 'BASE_PRICE'
    )?.length ?? 0;

  const nigthByNight = Array.isArray(payPriceCalculations)
    ? formatSemicolon(payPriceCalculations[0]?.priceCalculation?.guestResume?.total)
    : '0';
  // const priceBase =
  //   payPriceCalculations?.[0]?.priceBreakdowns?.reduce(
  //     (sum: number, item: any) =>
  //       item?.Type == 'BASE_PRICE' || item?.type == 'BASE_PRICE'
  //         ? sum + Number(item?.amount ?? 0)
  //         : sum,
  //     0
  //   ) ?? 0;
  // const priceBase = payPriceCalculations?.[0]?.priceCalculation?.amount ?? 0;

  const currencyCode =
    payPriceCalculations?.[0]?.priceCalculation?.currencyCode ?? price?.currencyCode ?? 0;

  useEffect(() => {
    if (reviewData) {
      const length = reviewData?.data?.reviewQuestions?.length ?? 0;

      setStep(length > 0 ? length / 2 : 0);
    } else {
      setStep(0);
    }
  }, [reviewData, bookId]);

  const images = photos?.length > 0 ? photos : [];

  // functions

  const handleButtonClick = async () => {
    try {
      await refetch();
      setOpenReview(true);
    } catch (err) {
      console.error('Error refetching review data:', err);
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((idx) => (idx + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((idx) => (idx - 1 + images.length) % images.length);
  };

  const handleDotClick = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(idx);
  };

  const handleSaveReview = async (): Promise<void> => {
    reloadConversation && reloadConversation();
  };

  const handleSeeOptions = () => {
    const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 6);
    const dataBook = conversation?.priceCalculation?.priceCalculation;
    const dataListing = bookingData?.listingRent?.property ?? listingRentData?.property ?? {};

    const checkIn = dataBook
      ? formatDate(new Date(dataBook?.initBook), false)
      : formatDate(today, false);
    const checkOut = dataBook
      ? formatDate(new Date(dataBook?.endBook), false)
      : formatDate(sevenDaysLater, false);

    const params = new URLSearchParams();
    params.set('checkIn', checkIn.toString());
    params.set('checkOut', checkOut.toString());
    dataListing?.latitude && params.set('Latitude', dataListing.latitude.toString());
    dataListing?.longitude && params.set('Longitude', dataListing.longitude.toString());

    params.set('Street', dataListing?.address?.address1?.toString() ?? '');
    params.set('City', dataListing?.cityName?.toString() ?? '');
    params.set('County', dataListing?.countyName?.toString() ?? '');
    params.set('State', dataListing?.stateName?.toString() ?? '');
    params.set('Country', dataListing?.countryName?.toString() ?? '');
    conversation?.booking?.gests > 0 && params.set('guests', conversation?.booking?.gests?.toString());
    conversation?.booking?.adultCount > 0 && params.set('adtCount', conversation?.booking?.adultCount?.toString());
    conversation?.booking?.childCount > 0 && params.set('chdCount', conversation?.booking?.childCount?.toString());
    conversation?.booking?.infantCount > 0 && params.set('infCount', conversation?.booking?.infantCount?.toString());
    conversation?.booking?.petCount > 0 && params.set('petsCount', conversation?.booking?.petCount?.toString());

    navigate(`/search-results?${params.toString()}`);
  };

  return (
    <Box
      sx={{
        borderLeft: '1px solid #e0e0e0',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        pt: { xs: 1, md: 5 },
        px: { xs: 2, md: 2 },
        overflowY: 'hidden',
      }}
    >
      {/* Mobile Back Button */}
      {onCloseMobile && (
        <Box sx={{ display: { xs: 'flex', md: 'none' }, mt: 0.5, mb: 1 }}>
          <IconButton onClick={onCloseMobile} edge="start" sx={{ color: 'gray', ml: 0.5 }}>
            <ArrowBackIos />
          </IconButton>
        </Box>
      )}

      {/* {estadoResult && ( */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            mb: { xs: 1.5, sm: 1.7 },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '18px', md: '20px', lg: '20px' },
              mt: { xs: -1, md: -2 },
              ml: 2,
              mb: { xs: 2, sm: 3, md: 0 },
            }}
          >
            {/* {estadoResult?.title} */}
            Detalle
          </Typography>
        </Box>
      {/* )} */}
      <Divider sx={{ my: { xs: -1, sm: -1, md: 2.2, lg: 2.2 }, mx: -2 }} />
      {conversation && (
        <Box
          sx={{
            pl: { xs: 1, sm: 2 },
            pr: { xs: 1, sm: 2, md: 5 },
            flexGrow: 1,
            overflowY: 'auto',
            pt: { xs: 1.5, sm: 0 },
          }}
        >
          {/* --- Image Slider --- */}
          <Box sx={{ position: 'relative', pt: { xs: 2, md: 1 } }}>
            {estadoResult?.code != 'desconocido' && (
            <Box>
            <Chip
              icon={IconComponent ? <IconComponent color={estadoResult.iconColor} /> : undefined}
              label={
                <Stack
                  direction={'row'}
                  gap={'5px'}
                  sx={{ fontSize: '12px', color: estadoResult.color }}
                >
                  {' '}
                  <Typography
                    fontWeight={'bold'}
                    fontSize={'12px'}
                    sx={{ color: estadoResult.color }}
                  >
                    {' '}
                    {estadoResult.title}
                  </Typography>{' '}
                  {' - '} {estadoResult.estado}
                </Stack>
              }
              style={{
                width: '15em',
                backgroundColor: estadoResult.bg,
                marginBottom: '20px',
              }}
            />
            <Typography
              component="div"
              variant="h3"
              gutterBottom
              sx={{ mb: 2 , fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
            >
              {/* {estadoResult.titleGuest} */}
              {bookingData?.sidebarData?.tituloLateral ?? ""}
            </Typography>    
             </Box> 
            )}
            <Card sx={{ borderRadius: '15px' }}>
              <CardMedia
                component="img"
                image={images[currentIndex]?.photoLink}
                alt="Apartment interior"
                sx={{ objectFit: 'cover', height: { xs: 180, sm: 200, md: 220 }, width: '100%' }}
              />
            </Card>
            <IconButton
              onClick={prevImage}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '10px',
                transform: 'translateY(-50%)',
                color: 'white',
                backgroundColor: 'rgba(0,0,0,0.5)',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
              }}
            >
              <IoIosArrowBack />
            </IconButton>
            <IconButton
              onClick={nextImage}
              sx={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                color: 'white',
                backgroundColor: 'rgba(0,0,0,0.5)',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
              }}
            >
              <IoIosArrowForward />
            </IconButton>
            <Box
              sx={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '8px',
              }}
            >
              {images.map((_: any, index: number) => (
                <Box
                  key={index}
                  onClick={(e) => handleDotClick(index, e)}
                  sx={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    backgroundColor: index === currentIndex ? 'white' : 'grey.400',
                  }}
                />
              ))}
            </Box>
          </Box>
          {/* --- Message Section --- */}
          <Box sx={{ my: { xs: 1.5, sm: 2 } }}>
            {/* <Typography
              component="div"
              variant="h3"
              gutterBottom
              sx={{ my: { xs: 1.5, sm: 2 }, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
            >
              {bookStatus?.code == 'non_approved'
                ? t('detailPanelGuest.mainMessage.rejected')
                : bookStatus?.code == 'approved'
                  ? t('detailPanelGuest.mainMessage.approved')
                  : bookStatus?.code == 'rented'
                    ? t('detailPanelGuest.mainMessage.ongoing')
                    : bookStatus?.code == 'completed'
                      ? t('detailPanelGuest.mainMessage.finished')
                      : t('detailPanelGuest.mainMessage.default')}
            </Typography> */}
            {/* <Typography
              component="div"
              variant="body1"
              sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >
              {bookStatus?.code == 'non_approved'
                ? t('detailPanelGuest.subMessage.rejected', { name: userInv?.name ?? '' })
                : bookStatus?.code == 'approved'
                  ? t('detailPanelGuest.subMessage.approved', { name: userInv?.name ?? '' })
                  : bookStatus?.code == 'rented'
                    ? t('detailPanelGuest.subMessage.ongoing')
                    : bookStatus?.code == 'completed'
                      ? t('detailPanelGuest.subMessage.finished')
                      : t('detailPanelGuest.subMessage.default')}
            </Typography> */}
          </Box>
          {estadoResult?.code != 'desconocido' && (
          <Box
            mt={{ xs: 3, sm: 2 }}
            sx={{ backgroundColor: '#f8f8f8', p: 2, borderRadius: 1, mb: 4 }}
          >
            <Typography
              variant="body1"
              sx={{ fontSize: { xs: '0.875rem', sm: '0.875rem', color: '#6B7280' } }}
            >
              {/* {estadoResult?.msgGuest} */}
              {bookingData?.sidebarData?.mensajeLateral ?? ""}
            </Typography>
          </Box>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {estadoResult?.code == 'pendiente' ? (
              stateReservation != 'PENDING' && (
                <Button
                  variant="primary"
                  fullWidth
                        sx={{
                          bgcolor: '#6358DC',
                          color: '#fff',
                          borderRadius: '15px',
                          textTransform: 'none',
                          p: { xs: 1.2, sm: 1.5 },
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          '&:hover': {
                            bgcolor: '#5248CC',
                          },
                        }}
                  onClick={handleSeeOptions}
                >
                  {t('detailPanelGuest.buttons.seeOptions')}
                  {/* {stateReservation == "CONSULT" || stateReservation == "REFUSED" ? 'Ver más opciones' : bookId != null ? 'Ver más opciones' : 'Ver más opciones'} */}
                </Button>
              )
            ) : ['proximo', 'en_curso', 'procesando_pago', 'finalizada'].includes(
                estadoResult?.code as string
              ) ? (
              <React.Fragment>
                {estadoResult?.code == 'procesando_pago' ? (
                  <Button
                    variant="primary"
                    fullWidth
                    sx={{
                      borderRadius: '4px',
                      textTransform: 'none',
                      p: { xs: 1.2, sm: 1.5 },
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    }}
                    //onClick={() => navigate(`${AssertRoutes.BOOK}/${listingRentId}`)}
                    onClick={() => navigate(`${AssertRoutes.BOOK}/${bookId}`)}
                  >
                    {t('detailPanelGuest.buttons.pay')}
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    fullWidth
                    sx={{
                      borderRadius: '4px',
                      textTransform: 'none',
                      p: { xs: 1.2, sm: 1.5 },
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    }}
                    onClick={() => navigate(`/reservation/${bookId}`)}
                  >
                    {t('detailPanelGuest.buttons.viewBooking')}
                  </Button>
                )}
                <Typography
                  variant="paragraph1Medium"
                  sx={{
                    fontWeight: 'bold',
                    mt: { xs: 1.5, sm: 2 },
                    fontSize: { xs: '0.95rem', sm: '1rem' },
                  }}
                >
                  {listingRent?.name ?? ''}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: { xs: 1.5, sm: 2 },
                    paddingBottom: { xs: 3, sm: 4 },
                  }}
                >
                  <Avatar
                    alt={userInv?.name ?? 'Anfitrión'}
                    src={userInv?.photoLink}
                    sx={{
                      width: { xs: 40, sm: 50 },
                      height: { xs: 40, sm: 50 },
                      mr: { xs: 1.5, sm: 2 },
                    }}
                  />
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 'bold', fontSize: { xs: '0.9rem', sm: '1rem' } }}
                    >
                      {userInv?.name ?? ''}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                    >
                      {GetProfileByUserIdMessage?.data?.liveAt?.liveAtShow}
                    </Typography>
                  </Box>
                </Box>

                {bookStatus?.code == 'completed' && (
                  <Typography
                    variant="paragraph1Medium"
                    sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                  >
                    {t('detailPanelGuest.review.finished')}
                  </Typography>
                )}
                {/* { bookStatus?.code == 'completed' && tlListingReviews?.length == 0 && ( */}
                {bookStatus?.code == 'completed' && booking?.tlListingReviews?.length == 0 ? (
                  <React.Fragment>
                    <Card
                      sx={{
                        borderRadius: 2,
                        p: { xs: 1, sm: 1.5 },
                        mt: { xs: 1, sm: 1 },
                        mb: { xs: 1.5, sm: 2 },
                      }}
                    >
                      <Box textAlign="center">
                        <Typography
                          variant="paragraph1Regular"
                          textAlign="center"
                          sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                        >
                          {t('detailPanelGuest.review.leaveReview')}
                        </Typography>
                      </Box>
                      <Box
                        textAlign="center"
                        sx={{ cursor: 'pointer' }}
                        onClick={handleButtonClick}
                      >
                        <Rating
                          sx={{
                            mb: { xs: 3, sm: 4 },
                            color: 'black',
                            fontSize: { xs: '32px', sm: '40px' },
                          }}
                          readOnly
                          value={0}
                        />
                      </Box>
                    </Card>
                  </React.Fragment>
                ) : (
                  bookStatus?.code == 'completed' &&
                  booking?.tlListingReviews?.length > 0 && (
                    <React.Fragment>
                      <Card
                        sx={{
                          borderRadius: 2,
                          p: 1,
                          mt: 1,
                          mb: 2,
                        }}
                      >
                        <Box textAlign="center">
                          <Rating
                            sx={{ mb: 4, color: 'black', fontSize: '40px' }}
                            readOnly
                            defaultValue={booking?.tlListingReviews[0]?.calification}
                          />
                        </Box>
                      </Card>
                    </React.Fragment>
                  )
                )}

                <ReviewDialog
                  open={openReview}
                  onClose={() => {
                    setOpenReview(false);
                  }}
                  questions={questions}
                  bookId={bookId}
                  step={step}
                  onSaved={() => handleSaveReview()}
                />
                <Card
                  sx={{
                    borderRadius: 2,
                    boxShadow: 'none',
                    backgroundColor: '#f5f5f5',
                    p: { xs: 0.5, sm: 1 },
                  }}
                >
                  <CardContent
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: { xs: 1, sm: 0 },
                      p: { xs: 1, sm: 2 },
                      '&:last-child': { pb: { xs: 1, sm: 2 } },
                    }}
                  >
                    {/* Llegada */}
                    <Box textAlign="justify" flex={1}>
                      <Typography
                        variant="small1Medium"
                        fontWeight="bold"
                        component="div"
                        sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                      >
                        {t('detailPanelGuest.cards.checkIn')}
                      </Typography>
                      <Typography
                        variant="small1Medium"
                        color="text.primary"
                        component="div"
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}
                      >
                        {checkin && formatDateCheckIn(checkin)}
                      </Typography>
                    </Box>

                    {/* Divider */}
                    <Divider
                      orientation={isSmUp ? 'vertical' : 'horizontal'}
                      flexItem
                      sx={{ mx: { xs: 0, sm: 2 }, my: { xs: 1, sm: 0 } }}
                    />

                    {/* Salida */}
                    <Box textAlign="justify" flex={1} sx={{ pl: { xs: 0, sm: 3 } }}>
                      <Typography
                        variant="small1Medium"
                        fontWeight="bold"
                        component="div"
                        sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                      >
                        {t('detailPanelGuest.cards.checkOut')}
                      </Typography>
                      <Typography
                        variant="small1Medium"
                        color="text.primary"
                        component="div"
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}
                      >
                        {checkout && formatDateCheckIn(checkout)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </React.Fragment>
            ) : (
              <Button
                variant="primary"
                fullWidth
                sx={{
                  borderRadius: '4px',
                  textTransform: 'none',
                  p: { xs: 1.2, sm: 1.5 },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
                onClick={handleSeeOptions}
              >
                {t('detailPanelGuest.buttons.seeOptions')}
              </Button>
            )}
          </Box>
          {/* <Divider sx={{ my: 4 }} /> */}
          {['canceled', 'prebook', 're_expired', 'canceled', 'non_approved'].includes(
            bookStatus?.code
          ) || bookStatus?.code == null ? (
            <Box sx={{ flexGrow: 1, pt: 1 }}>
              <Typography
                variant="h3SMedium"
                gutterBottom
                sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}
              >
                {t('detailPanelGuest.tripDetails.title')}
              </Typography>
              <Typography
                component="div"
                variant="small1SRegular"
                sx={{ mt: { xs: 1.5, sm: 2 }, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                {name}
              </Typography>
              <Typography
                variant="small1SRegular"
                component="div"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                {description}
              </Typography>
              <Typography
                variant="small1SRegular"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                {property?.countyName}, {property?.stateName},{' '}
                {property?.countryName ?? property?.cityName}
              </Typography>
              <Paper elevation={0} sx={{ margin: 'auto' }}>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  sx={{ marginBottom: { xs: 1.5, sm: 2 } }}
                >
                  <Grid size={{ xs: 6 }}>
                    <Typography
                      variant="small1SRegular"
                      fontWeight="bold"
                      sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                    >
                      {userInv?.name ?? ''}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <Avatar
                      alt={userInv?.name ?? 'Anfitrion'}
                      src={userInv?.photoLink}
                      sx={{ width: { xs: 22, sm: 25 }, height: { xs: 22, sm: 25 } }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={1} sx={{ marginBottom: 1 }}>
                  <Grid size={{ xs: 6 }}>
                    <Typography
                      variant="small1SRegular"
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}
                    >
                      {t('detailPanelGuest.cards.checkIn')}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }} sx={{ textAlign: 'left' }}>
                    <Typography
                      variant="small1SRegular"
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}
                    >
                      {checkin && formatDateCheckIn(checkin, true)}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={1} sx={{ marginBottom: 1 }}>
                  <Grid size={{ xs: 6 }}>
                    <Typography
                      variant="small1SRegular"
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}
                    >
                      {t('detailPanelGuest.cards.checkOut')}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }} sx={{ textAlign: 'left' }}>
                    <Typography
                      variant="small1SRegular"
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}
                    >
                      {checkout && formatDateCheckIn(checkout, true)}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={1}>
                  <Grid size={{ xs: 6 }}>
                    <Typography
                      variant="small1SRegular"
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}
                    >
                      {t('detailPanelGuest.tripDetails.guests')}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }} sx={{ textAlign: 'left' }}>
                    <Typography
                      variant="small1SRegular"
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}
                    >
                      {/* {t('detailPanelGuest.tripDetails.adult', { count: gests ?? 0 })} */}
                      {bookingData?.adultCount == 0
                        ? bookingData?.gests
                        : bookingData?.adultCount}{' '}
                      adulto{bookingData?.adultCount > 1 ? 's' : ''}
                      {bookingData?.childCount
                        ? `, ${bookingData?.childCount} niño${bookingData?.childCount > 1 ? 's' : ''}`
                        : ''}
                      {bookingData?.infantCount
                        ? `, ${bookingData?.infantCount} bebé${bookingData?.infantCount > 1 ? 's' : ''}`
                        : ''}
                      {bookingData?.petCount
                        ? `, ${bookingData?.petCount} mascota${bookingData?.petCount > 1 ? 's' : ''}`
                        : ''}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              <Divider sx={{ my: { xs: 1.5, sm: 2 } }} />
              {/* Título de Información de Pago */}
              <Typography
                variant="small1Regular"
                sx={{ mb: { xs: 2, sm: 3 }, fontSize: { xs: '0.85rem', sm: '0.9rem' } }}
              >
                {t('detailPanelGuest.payment.title')}
              </Typography>

              {/* Detalles del Pago */}
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography
                    variant="small1SRegular"
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}
                  >
                    {t('detailPanelGuest.payment.nightRate', {
                      count: countNightByNight,
                      price: nigthByNight,
                      currency: currencyCode,
                    })}
                  </Typography>
                  <Typography
                    variant="small1SRegular"
                    sx={{ fontWeight: 'medium', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}
                  >
                    {nigthByNight} {currencyCode}
                  </Typography>
                </Stack>
                <Divider sx={{ my: { xs: 1.5, sm: 2 } }} />
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography
                    variant="small1SRegular"
                    sx={{ fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                  >
                    {t('detailPanelGuest.payment.total')}
                  </Typography>
                  <Typography
                    variant="small1SRegular"
                    sx={{ fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                  >
                    {nigthByNight} {currencyCode}
                  </Typography>
                </Stack>
              </Box>

              {/* Enlace para Denunciar */}

              {/* <Link href="#" underline="hover" color="text.secondary">
                {t('detailPanelGuest.payment.report')}
              </Link> */}
            </Box>
          ) : (
            <React.Fragment>
              <Box mt={{ xs: 3, sm: 4 }}>
                <Divider />
                <Typography
                  variant="h6"
                  mt={{ xs: 1.5, sm: 2 }}
                  sx={{ fontSize: { xs: '1rem', sm: '1.15rem' } }}
                >
                  {t('detailPanelGuest.staticDetails.reservationDetails')}
                </Typography>
                <Typography
                  variant="subtitle2"
                  mt={{ xs: 1.5, sm: 2 }}
                  sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' } }}
                >
                  {t('detailPanelGuest.staticDetails.whoAccompanies')}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  mt={1}
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                >
                  {gests} {t('detailPanelGuest.staticDetails.guestsCount')}
                </Typography>

                <Typography variant="subtitle2" mt={2}>
                  {t('detailPanelGuest.staticDetails.cancelPolicy')}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {/* {t('detailPanelGuest.staticDetails.cancelText')} */}
                  {listingRentBooking?.cancelationPolicy?.detail1 ?? ''}{' '}
                  {listingRentBooking?.cancelationPolicy?.detail2 ?? ''}
                </Typography>
                <Link
                  href="/cancellation-policy"
                  underline="hover"
                  sx={{ mt: 1, display: 'inline-block' }}
                  target="_blank"
                >
                  {t('detailPanelGuest.staticDetails.readMore')}
                </Link>
              </Box>
              <Box mt={4}>
                <Divider />
                <Typography variant="h6" mt={2}>
                  {t('detailPanelGuest.staticDetails.rulesTitle')}
                </Typography>
                {/* <Typography variant="subtitle2" mt={2}>
                  {t('detailPanelGuest.staticDetails.houseRules')}
                </Typography> */}
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {listingRentBooking?.maxGuests} {t('detailPanelGuest.staticDetails.rulesText')}
                </Typography>
              <SectionRentModal
                title=''
                content={listingRentBooking.rentRules || []}
                emptyMessage={t('propertyDetail.know.noRules')}
              />  
              </Box>
              <Box mt={4}>
                <Divider />
                <Box display={'flex'} justifyContent={'space-between'}>
                  <Typography variant="h6" mt={2}>
                    {t('detailPanelGuest.staticDetails.hostTitle', {
                      name: `${userInv?.name ?? ''} ${userInv?.lastName ?? ''}`,
                    })}
                  </Typography>
                  <Avatar src={userInv?.photoLink} alt={userInv?.name ?? ''} sx={{ mt: 2 }} />
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t('detailPanelGuest.staticDetails.aboutHost')}
                    </Typography>
                    <Typography variant="body2" mt={1}>
                      {/* {t('detailPanelGuest.staticDetails.hostBio')} */}
                      {GetProfileByUserIdMessage?.data?.whatIDo ?? ''}
                    </Typography>
                    <Link
                      href={`/host/show-profile-guest/${userInv?.userId ?? ''}/${listingRentId}`}
                      underline="hover"
                      sx={{ mt: 1, display: 'inline-block' }}
                      target="_blank"
                    >
                      {t('detailPanelGuest.staticDetails.showMore')}
                    </Link>
                  </Box>
                </Box>
              </Box>
              <Box mt={4}>
                <Divider />
                <Typography variant="h6" mt={2}>
                  {t('detailPanelGuest.staticDetails.priceInfo')}
                </Typography>
                <Typography variant="body2" mt={1}>
                  {t('detailPanelGuest.staticDetails.amountToPay')}
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {currencyCode}. {nigthByNight}
                </Typography>
              </Box>

              <Box mt={4}>
                <Divider />
                <Typography variant="h6" mt={2}>
                  {t('detailPanelGuest.staticDetails.supportTitle')}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {t('detailPanelGuest.staticDetails.supportText')}
                </Typography>
                <MuiLink
                  component={RouterLink}
                  to="/contact"
                  underline="hover"
                  sx={{ mt: 1, display: 'inline-block' }}
                >
                  {t('detailPanelGuest.staticDetails.contactSupport')}
                </MuiLink>
              </Box>
            </React.Fragment>
          )}
        </Box>
      )}
    </Box>
  );
};

export default DetailPanelMessageGuest01;
