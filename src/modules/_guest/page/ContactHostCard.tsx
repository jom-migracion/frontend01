import {
  Box,
  Typography,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
  Container,
  Avatar,
} from '@mui/material';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from '@/context/SnackbarContext';
import { useGet2, usePost2 } from '@/hooks/api';
import { useAuthStore } from '@/store/auth.store';
import { useNavigate, useParams } from 'react-router';
import Grid from '@mui/material/Grid2';
import { Range, RangeKeyDict } from 'react-date-range';
import { useEffect, useMemo, useState } from 'react';
import BookingCard from '@/components/BookingCard';
import { useHostStore } from '@/store/useHostStore';
import { Conversation } from '@/models/interfaces/Message';
import { AssertRoutes } from '@/common/enum/AssertRoutes';
import LoadingThreeDotsJumping from '@/components/LoadingThreeDotsJumping';
import BookingDisponibilityCard from '@/components/BookingDisponibilityCard';
import { priceCalculationCardStore } from '@/store/priceInformation.store';
import { useTranslation } from 'react-i18next';
import { HostData } from '@/pages/HostProfileInfo';
import { RestClient } from '@/services/RestClient';
import { useAuthContext } from '@/modules/_auth/context/AuthContext';
import ConfirmDialog from '@/components/ConfirmDialog';
import { pushToDataLayer } from '@/utilities/analytics';

const getRuleValue = (rules: any[] | undefined, code: string): string | null => {
  if (!Array.isArray(rules) || !code) return null;
  const rule = rules.find((r) => r?.code === code);
  return rule?.valueString ?? null;
};

type MessageForm = {
  message: string;
};

const ContactHostCard = () => {
  const { listingRentId, msgsee } = useParams();
  // state
  const [disponibility, setDisponibility] = useState<boolean>(false);
  const [isLoadingContinue, setIsLoadingContinue] = useState(false);
  const { changeRole } = useAuthContext();
  const isLargeScreen = useMediaQuery('(min-width:1920px)');
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showPayoutAccountWarning, setShowPayoutAccountWarning] = useState<boolean>(false);

  // store
  const { identifier } = useAuthStore.getState();
  const hostId = useHostStore((state) => state.hostId);
  console.log(hostId);
  const dataCalcPriceCard = priceCalculationCardStore((state) => state.dataCalcPriceCard);
  // const setDataCalcPriceCard = priceCalculationCardStore((state) => state.setDataCalcPriceCard);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const messageSchema = useMemo(
    () =>
      z.object({
        message: z.string().min(10, t('contactHost.form.validation.minLength')),
      }),
    [t]
  );

  // Modifique aqui
  const { mutate: createConversation, isPending } = usePost2<Conversation>(
    '/Messaging/Conversations'
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<MessageForm>({
    resolver: zodResolver(messageSchema),
  });

  const { data: detailProperty } = useGet2<any>(
    'ListingRentHostCard',
    `/ListingRent/${listingRentId}`
  );

  const { data: detailReview } = useGet2<HostData>(
    ['detailReview', detailProperty?.data?.ownerUserId],
    `/GetProfileByUserId/${detailProperty?.data?.ownerUserId}`,
    {},
    !!detailProperty?.data?.ownerUserId
  );

  //  console.log(detailProperty?.data?.ownerUserId);
  console.log(detailProperty?.data?.ownerUserId);
  console.log(detailProperty?.data?.listingId);

  const pets = useMemo(() => {
    return getRuleValue(detailProperty?.data?.rentRules, 'ALLOW_PETS');
  }, [detailProperty?.data?.rentRules]);

  const ensureHasPayoutAccount = async (): Promise<boolean> => {
    try {
      const response = await RestClient.get('/Payout/Account');
      const { statusCode, data, resultError } = response?.data ?? {};

      if (statusCode !== '200') {
        showSnackbar(resultError?.message || 'No se pudo verificar la cuenta bancaria.', 'error');
        return false;
      }

      // console.log("tiene cuenta?", Array.isArray(data) && data.length > 0);
      const hasAccounts = Array.isArray(data) && data.length > 0;

      if (!hasAccounts) {
        setShowPayoutAccountWarning(true);
        return false;
      }

      return true;
    } catch (error: any) {
      showSnackbar(error?.message || 'No se pudo verificar la cuenta bancaria.', 'error');
      return false;
    }
  };

  const onSubmit: (msg: MessageForm) => void = (msg: MessageForm) => {
    if (dataCalcPriceCard?.priceCalculationId) {
      createConversation(
        {
          hostId: detailProperty?.data?.ownerUserId,
          renterId: identifier,
          priceCalculationId: dataCalcPriceCard?.priceCalculationId,
          listingId: listingRentId,
          isBookingRequest: msgsee == 'false' ? true : false,
          message: msg.message,
        },
        {
          onSuccess: async (response) => {
            const { resultError, statusCode } = response;
            if (statusCode == '200') {
              showSnackbar(t('contactHost.alerts.success'), 'success');

              /*await RestClient.post(`Messaging/Conversations/${data?.conversationId}/Messages`, {
                bookId: 0,
                messageTypeId: 1,
                body: msg.message,
              });*/
              reset();
              navigate(AssertRoutes.GUEST_MESSAGE);
            } else {
              showSnackbar(resultError?.message, 'error');
            }
          },
          onError: (error: any) => {
            showSnackbar(error?.message || t('contactHost.alerts.genericError'), 'error');
          },
        }
      );
    } else {
      showSnackbar(t('contactHost.alerts.noQuote'), 'warning');
      return;
    }
  };
  const today = new Date();
  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(today.getDate() + 6);
  const [selectionRange, setSelectionRange] = useState<Range>(() => {
    const storedData = localStorage.getItem('search-form-storage');
    if (storedData) {
      try {
        const parsed: any = JSON.parse(storedData);
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

  const [guests, setGuests] = useState<any>(() => {
    const storedData = localStorage.getItem('search-form-storage');
    if (storedData) {
      try {
        const parsed: any = JSON.parse(storedData);
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

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const currentDate = new Date();
  const oneYearLater = new Date();
  oneYearLater.setFullYear(currentDate.getFullYear() + 1);

  const { data: CalendarDates } = useGet2<any>(
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
      ?.filter((day: any) => day.blockType === 2)
      .map((day: any) => {
        const d = new Date(day.date);
        d.setHours(0, 0, 0, 0);
        return d;
      }) || [];

  useEffect(() => {
    if (msgsee == 'false') {
      setDisponibility(true);
    } else {
      setDisponibility(false);
    }
  }, []);

  const handleChangeHost = async (): Promise<boolean> => {
    setIsLoadingContinue(true);
    try {
      const responseGetProfile = await RestClient.post('/GetProfile');
      if (responseGetProfile?.data?.statusCode == 200) {
        if (responseGetProfile?.data?.statusCode != '200' && responseGetProfile?.data?.hasError) {
          showSnackbar(
            'Error: ' + responseGetProfile?.data?.resultError?.message?.message || '',
            'error',
            8000
          );
          return false;
        } else {
          if (responseGetProfile?.data?.data?.isDocumentVerified) {
            changeRole('guest');
            ///Agregar la llamada
            const hasPayoutAccount = await ensureHasPayoutAccount();
            if (!hasPayoutAccount) {
              setShowPayoutAccountWarning(true);
              return false;
            } else {
              setShowPayoutAccountWarning(false);
              return true;
            }
          } else {
            navigate(AssertRoutes.ACCOUNT_SETTINGS + '?openIdentityVerification=true');
            return false;
          }
        }
      } else {
        showSnackbar('Error: No es posible cambiar de rol.', 'error', 8000);
        return false;
      }
    } catch (error) {
      showSnackbar('Error: No es posible cambiar de rol.', 'error', 8000);
      return false;
    } finally {
      setIsLoadingContinue(false);
    }
  };

  const handleButtonClick = async () => {
    const canSubmit = await handleChangeHost();
    if (canSubmit) {
      pushToDataLayer('view_availability', {
        availability_property_id: detailProperty?.data?.listingRentId,
        availability_checkin: selectionRange.startDate
          ? formatDate(selectionRange.startDate)
          : undefined,
        availability_checkout: selectionRange.endDate
          ? formatDate(selectionRange.endDate)
          : undefined,
        availability_search_clients: guests.adults + guests.children,
        availability_price_nightly: detailProperty?.data?.price?.priceNightly ?? 0,
      });
      handleSubmit(onSubmit)();
    }
  };

  return (
    <>
      <Container
        maxWidth={isLargeScreen ? 'xl' : 'lg'}
        sx={{
          px: { xs: 2, sm: 4, md: isLargeScreen ? 5 : 4 },
          mt: isMobile ? 1 : 6,
          pb: { xs: '200px', md: 0 },
        }}
      >
        <Helmet>
          <title>{t('contactHost.title')}</title>
        </Helmet>
        {<LoadingThreeDotsJumping open={isPending} modal={true} />}
        {/* <Box sx={{ flexGrow: 1, p: 3, minHeight: '100vh' }}> */}
        <Box>
          <Grid container spacing={2}>
            {/* FORMULARIO DE MENSAJE */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
              >
                {/* Flecha atrás + Título */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography
                    sx={{
                      fontSize: { xs: '18px', sm: '20px' },
                      fontWeight: 600,
                      lineHeight: 1.3,
                    }}
                  >
                    {msgsee == 'true'
                      ? t('contactHost.availabilityHeader')
                      : t('contactHost.header')}
                  </Typography>
                </Box>

                {/* Título y descripción del mensaje */}
                <Box>
                  <Typography
                    sx={{
                      fontSize: { xs: '16px', sm: '18px' },
                      fontWeight: 600,
                      mb: 1,
                    }}
                  >
                    {t('contactHost.messageTitle')}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: '13px', sm: '14px' },
                      color: 'text.secondary',
                      lineHeight: 1.6,
                    }}
                  >
                    {t('contactHost.messageDescription')}
                  </Typography>
                </Box>

                {/* Info del anfitrión */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={detailProperty?.data?.owner?.photoLink}
                    alt={detailProperty?.data?.owner?.name || 'Host Avatar'}
                    sx={{ width: 48, height: 48 }}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontSize: '16px', fontWeight: 600, lineHeight: 1.4 }}>
                      {detailProperty?.data?.owner?.name}
                      {detailProperty?.data?.owner?.lastName
                        ? ` ${detailProperty?.data?.owner?.lastName}`
                        : ''}
                    </Typography>
                    <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                      {/* {detailProperty?.data?.owner?.typicalResponseTime
                        ? `${t('contactHost.typicalResponseTime')} ${detailProperty?.data?.owner?.typicalResponseTime}`
                        : t('contactHost.typicalResponseTime')} */}
                      {`${detailReview?.data?.timeInAssert} como anfitrión` ||
                        'Tiempo como anfitrion desconocido'}
                    </Typography>
                  </Box>
                </Box>

                {/* Textarea + Botón + Términos */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={6}
                    placeholder={t('contactHost.form.placeholder')}
                    sx={{
                      '& .MuiInputBase-root': {
                        minHeight: 160,
                        alignItems: 'flex-start',
                        padding: 2,
                      },
                      '& .MuiInputBase-input': { resize: 'none', padding: 0 },
                    }}
                    {...register('message')}
                    error={!!errors.message}
                    helperText={errors.message?.message}
                    disabled={isSubmitting}
                  />
                  <Box sx={{ pt: 2 }}>
                    <Button
                      type="button"
                      onClick={handleButtonClick}
                      variant="primary"
                      disabled={!disponibility || isLoadingContinue}
                      sx={{
                        width: { xs: '100%', md: 'auto' },
                        px: 6,
                        height: 48,
                        fontSize: '16px',
                        fontWeight: 600,
                      }}
                    >
                      {t('contactHost.form.submitButton')}
                    </Button>
                    <Typography sx={{ mt: 2, fontSize: '12px', color: 'text.secondary' }}>
                      {t('contactHost.termsPrefix')}{' '}
                      <Box
                        component="span"
                        sx={{
                          color: 'primary.main',
                          fontWeight: 500,
                          cursor: 'pointer',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        {t('contactHost.termsLink')}
                      </Box>
                    </Typography>
                  </Box>
                </Box>
                <ConfirmDialog
                  open={showPayoutAccountWarning}
                  onClose={() => setShowPayoutAccountWarning(false)}
                  onConfirm={() => {
                    setShowPayoutAccountWarning(false);
                    navigate('/host/info-profile/payments?tab=3', {
                      state: { paymentTab: 3 },
                    });
                  }}
                  title="Configura tu cuenta bancaria"
                  confirmColor="primary"
                  description={
                    <Box>
                      <Typography variant="body1" sx={{ mb: 1.5 }}>
                        Para aceptar reservas, primero debes registrar una cuenta bancaria para
                        recibir tus pagos.
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Te llevaremos a la sección de configuración de cuenta.
                      </Typography>
                    </Box>
                  }
                  confirmText="Ir a configuración"
                  cancelText="Cancelar"
                />
              </Box>
            </Grid>
            {/* CARD DE RESERVA */}
            <Grid size={{ xs: 12, md: 5 }} sx={{ mt: 0 }}>
              {disponibility ? (
                <BookingCard
                  listingRentId={Number(listingRentId)}
                  changeDisponibility={setDisponibility}
                  pricePerNight={detailProperty?.data?.price?.priceNightly ?? 0}
                  rating={Math.trunc(detailProperty?.data?.valoration ?? 0)}
                  countReviews={detailProperty?.data?.reviews?.length ?? 0}
                  guests={guests}
                  discountedPrice={
                    detailProperty?.data?.price?.tlListingDiscountForRates[0] &&
                    detailProperty?.data?.price?.tlListingDiscountForRates[0].porcentage
                  }
                  selectionRange={selectionRange}
                  onSelect={handleSelect}
                  onClear={handleClear}
                  disabledDates={disabledDates}
                  seeButtonReserve={msgsee == 'false' && false}
                  avatarUrl={detailProperty?.data?.owner?.photoLink ?? ''}
                  maxGuests={detailProperty?.data?.maxGuests ?? 18}
                  maxPets={pets}
                />
              ) : (
                <BookingDisponibilityCard
                  listingRentId={listingRentId}
                  disponibility={true}
                  changeDisponibility={setDisponibility}
                  pricePerNight={detailProperty?.data?.price?.priceNightly ?? 0}
                  rating={Math.trunc(detailProperty?.data?.valoration ?? 0)}
                  countReviews={detailProperty?.data?.reviews?.length ?? 0}
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
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default ContactHostCard;
