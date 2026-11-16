import React, { useEffect, useRef, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Radio,
  Box,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useForm /*, Controller*/ } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { creditCardSchema } from '../../validations/reservationStepper.scheme';
import { z } from 'zod';
import { IPropsPaymentMethodCard } from '../../interface/IPropsPaymentMethodCard';
import { RestClient } from '@/services/RestClient';
import { ApiService } from '@/services/ApiService';
import ResponseAssert from '@/models/interfaces/backend/ResponseAssert';
import { useSignalR } from '../../hooks/useSignalR';
import { CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { useSnackbar } from '@/context/SnackbarContext';
import { useTranslation } from 'react-i18next';
import BillingDataForm, {
  BillingFormData,
  BillingFormErrors,
} from '@/modules/_account/pages/BillingDataForm';
import { pushToDataLayer } from '@/utilities/analytics';

const emptySchema = z.object({});

type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed';

const PaymentMethodCard: React.FC<IPropsPaymentMethodCard> = ({
  onNext,
  isExpanded = false,
  onToggle,
  calculationCode,
  bookId,
  onPaymentRequestData,
}) => {
  const { t } = useTranslation();
  // useState
  const [selectedMethod, setSelectedMethod] = useState('credit_card');
  const [paymentExpanded, setPaymentExpanded] = useState<string | boolean>('credit_card');
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [billingExpanded, setBillingExpanded] = useState<boolean>(true);
  const [paymentSectionExpanded, setPaymentSectionExpanded] = useState<boolean>(false);
  const [paymentRequestData, setPaymentRequestData] = useState<any>(null);
  const [billingData, setBillingData] = useState<BillingFormData>({
    fullName: '',
    email: '',
    nit: '',
    documentType: 'CI',
    fiscalAddress: '',
    stateId: 0,
    stateName: '',
    cityId: 0,
    cityName: '',
  });
  const [billingErrors, setBillingErrors] = useState<BillingFormErrors>({});
  const paymentSectionRef = useRef<HTMLDivElement>(null);
  const [iframeUrl, setIframeUrl] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [qrImg, setQrImg] = useState<string>('');
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // SignalR hook
  const { notifications, isConnected } = useSignalR();

  // Determinar qué esquema usar basado en el método seleccionado
  const getValidationSchema = () => {
    return selectedMethod === 'credit_card' ? creditCardSchema : emptySchema;
  };

  const {
    handleSubmit,
    formState: { isValid },
    reset,
    // watch,
  } = useForm<any>({
    resolver: zodResolver(getValidationSchema()),
    mode: 'onChange',
    defaultValues: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      billingAddress: {
        address: '',
        apartmentNumber: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Bolivia',
      },
    },
  });

  useEffect(() => {
    console.log('Notificacion: ', notifications);
    if (notifications.length > 0) {
      console.log('existe Notifiacion: ', notifications);
      const latestNotification = notifications[0];
      if (latestNotification.bookingId == bookId) {
        try {
          pushToDataLayer('purchase');
          console.log('The Pay button has been clicked', window?.dataLayer);
        } catch (error) {
          console.warn('Analytics error on purchase event:', error);
        }
        navigate(`/reservation/${bookId}`);
      }
    }
  }, [notifications, onNext, isConnected]);

  // Escuchar mensajes del iframe
  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
      const { type, status } = event.data;

      if (type === 'PAYMENT_STATUS') {
        switch (status) {
          case 'processing':
            setPaymentStatus('processing');
            break;
          case 'success':
            setPaymentStatus('completed');
            break;
          case 'error':
            setPaymentStatus('failed');
            break;
        }
      }
    };

    window.addEventListener('message', handleIframeMessage);

    return () => {
      window.removeEventListener('message', handleIframeMessage);
    };
  }, []);

  // functions
  const handleMethodChange = (method: string) => {
    setSelectedMethod(method);
    setPaymentExpanded(method);
    setPaymentStatus('pending');
    setIframeUrl('');
    setQrImg('');

    if (method.toLocaleLowerCase() == 'Debit/Credit Card'.toLocaleLowerCase()) {
      setPaymentStatus('processing');
      const jsonRequest = {
        priceCalculationIdentifier: calculationCode,
        accountId: null,
        formOfPayment: 3,
        reasonSocial: billingData.fullName,
        nit: billingData.nit,
        documentType: billingData.documentType,
        email: billingData.email,
      };
      RestClient.post('/Payment/PaymentRequest', jsonRequest).then((x: any) => {
        if (x.data.hasError) {
          setPaymentStatus('failed');
          setIframeUrl('');
          showSnackbar(
            `Error: ${x.data?.resultError?.message || t('PaymentMethodCard.errors.default')}`,
            'error',
            6000
          );
        } else {
          const responseData = x.data.data;
          setPaymentRequestData(responseData);
          const commission = parseFloat(
            responseData?.additionalData?.PaymentPlatformCommission ?? '0'
          );
          if (!isNaN(commission)) onPaymentRequestData?.(commission);

          setIframeUrl(x.data.data.url.replace('http://', 'https://'));
          setPaymentStatus('pending');
        }
      });
    } else if (method.toLocaleLowerCase() == 'QR'.toLocaleLowerCase()) {
      setPaymentStatus('processing');
      const jsonRequest = {
        priceCalculationIdentifier: calculationCode,
        accountId: null,
        formOfPayment: 4,
        reasonSocial: billingData.fullName,
        nit: billingData.nit,
        documentType: billingData.documentType,
        email: billingData.email,
      };
      RestClient.post('/Payment/PaymentRequest', jsonRequest).then((x: any) => {
        if (x.data.hasError) {
          setPaymentStatus('failed');
          showSnackbar(
            `Error: ${x.data?.resultError?.message || t('PaymentMethodCard.errors.default')}`,
            'error',
            6000
          );
        } else {
          const responseData = x.data.data;
          setPaymentRequestData(responseData);
          const commission = parseFloat(
            responseData?.additionalData?.PaymentPlatformCommission ?? '0'
          );
          if (!isNaN(commission)) onPaymentRequestData?.(commission);

          setQrImg(x.data.data.url.replace('http://', 'https://'));
          setPaymentStatus('pending');
        }
      });
    }
  };

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        const response = await ApiService.get<ResponseAssert<unknown>>(
          '/GetUserEndorsement?invoiceTypeCode=GUEST'
        );
        if (!response?.hasError) {
          const rawData = response?.data;
          const source =
            Array.isArray(rawData) && rawData.length > 0
              ? (rawData[0] as Record<string, unknown>)
              : (rawData as Record<string, unknown> | null);
          if (source && typeof source === 'object') {
            setBillingData({
              fullName: String(source.fullName ?? ''),
              email: String(source.email ?? ''),
              nit: String(source.nit ?? ''),
              documentType: source.documentType === 'NIT' ? 'NIT' : 'CI',
              fiscalAddress: String(source.fiscalAddress ?? ''),
              stateId: Number(source.stateId ?? 0),
              stateName: String(source.stateName ?? ''),
              cityId: Number(source.cityId ?? 0),
              cityName: String(source.cityName ?? ''),
            });
          }
        }
      } catch {
        // silent — billing form remains empty for manual entry
      }
    };
    fetchBillingData();
  }, []);

  useEffect(() => {
    RestClient.get(`Payment/GetFormsOfPayment`).then((x: any) => {
      if (x?.data?.statusCode == '200') {
        setPaymentMethods(x.data.data);
      } else {
        showSnackbar(
          `Error: ${x.data?.resultError?.message || t('PaymentMethodCard.errors.default')}`,
          'error',
          6000
        );
      }
    });
  }, []);

  const handlePaymentAccordionChange =
    (panel: string) => (_event: any, isExpanded: string | boolean) => {
      setPaymentExpanded(isExpanded ? panel : false);
      if (isExpanded) {
        setSelectedMethod(panel);
        handleMethodChange(panel);
      }
    };

  const validateBillingData = (): BillingFormErrors => {
    const nextErrors: BillingFormErrors = {};

    if (!billingData.nit.trim()) {
      nextErrors.nit = t('PaymentMethodCard.errors.completeBillingFirst');
    }
    if (!billingData.fullName.trim()) {
      nextErrors.fullName = t('PaymentMethodCard.errors.completeBillingFirst');
    }
    if (!billingData.email.trim()) {
      nextErrors.email = t('PaymentMethodCard.errors.completeBillingFirst');
    }
    if (!billingData.fiscalAddress.trim()) {
      nextErrors.fiscalAddress = t('PaymentMethodCard.errors.completeBillingFirst');
    }
    if (!billingData.cityId) {
      nextErrors.cityId = t('PaymentMethodCard.errors.completeBillingFirst');
    }

    return nextErrors;
  };

  const isBillingComplete = () => Object.keys(validateBillingData()).length === 0;

  const handleBillingFieldChange = (field: keyof BillingFormData, value: string | number) => {
    setBillingData((prev) => ({ ...prev, [field]: value }));
    if (billingErrors[field as keyof BillingFormErrors]) {
      setBillingErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSaveBilling = () => {
    const nextErrors = validateBillingData();
    setBillingErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      showSnackbar(t('PaymentMethodCard.errors.completeBillingFirst'), 'warning', 4000);
      setBillingExpanded(true);
      return;
    }

    setBillingExpanded(false);
    setPaymentSectionExpanded(true);
  };

  const handleCancelBilling = () => {
    setBillingExpanded(false);
  };

  const handlePaymentSectionToggle = (event: any, expanded: boolean) => {
    if (expanded && !isBillingComplete()) {
      setBillingErrors(validateBillingData());
      setBillingExpanded(true);
      showSnackbar(t('PaymentMethodCard.errors.completeBillingFirst'), 'warning', 4000);
      return;
    }

    setPaymentSectionExpanded(expanded);
    onToggle(event, expanded);
  };

  const onSubmit = (data: any) => {
    // Para tarjeta de crédito, verificar que sea válido
    if (selectedMethod === 'credit_card') {
      if (isValid) {
        onNext('credit_card', data);
      }
    } else {
      onNext();
    }
  };

  React.useEffect(() => {
    reset();
  }, [selectedMethod, reset]);

  useEffect(() => {
    if (!isExpanded) {
      setPaymentSectionExpanded(false);
    }
  }, [isExpanded]);

  useEffect(() => {
    if (paymentSectionExpanded && paymentSectionRef.current) {
      setTimeout(() => {
        paymentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [paymentSectionExpanded]);

  return (
    <Box sx={{ maxWidth: { xs: '100%', md: 600 } }}>
      {/* Accordion 0: Datos de Factura */}
      <Accordion
        expanded={billingExpanded}
        onChange={() => setBillingExpanded((prev) => !prev)}
        elevation={0}
        sx={{
          mb: 2,
          '&:before': { display: 'none' },
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: { xs: 3, md: 6 },
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
        }}
      >
        <AccordionSummary
          sx={{
            px: { xs: 1.5, md: 3 },
            py: { xs: 1.5, md: 2 },
            minHeight: { xs: '56px !important', md: '64px !important' },
            '& .MuiAccordionSummary-content': { margin: '12px 0' },
            bgcolor: '#fafbfc',
            borderBottom: billingExpanded ? '1px solid rgba(0, 0, 0, 0.08)' : 'none',
          }}
        >
          <Typography
            sx={{ fontSize: { xs: '16px', md: '18px' }, fontWeight: 700, color: '#1e293b' }}
          >
            {t('PaymentMethodCard.billingTitle')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: { xs: 0, md: 0 }, bgcolor: '#ffffff' }}>
          <BillingDataForm
            billingType="pay"
            billingData={billingData}
            billingErrors={billingErrors}
            onFieldChange={handleBillingFieldChange}
            onSave={handleSaveBilling}
            onCancel={handleCancelBilling}
          />
        </AccordionDetails>
      </Accordion>

      {/* Accordion 1: Agregar método de pago */}
      <Accordion
        ref={paymentSectionRef}
        expanded={paymentSectionExpanded}
        onChange={handlePaymentSectionToggle}
        elevation={0}
        sx={{
          mb: 2,
          scrollMarginTop: '80px',
          '&:before': { display: 'none' },
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: { xs: 3, md: 6 },
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
        }}
      >
        <AccordionSummary
          sx={{
            px: { xs: 1.5, md: 3 },
            py: { xs: 1.5, md: 2 },
            minHeight: { xs: '56px !important', md: '64px !important' },
            '& .MuiAccordionSummary-content': {
              margin: '12px 0',
            },
            bgcolor: '#fafbfc',
            borderBottom: paymentSectionExpanded ? '1px solid rgba(0, 0, 0, 0.08)' : 'none',
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: '16px', md: '18px' },
              fontWeight: 700,
              color: '#1e293b',
            }}
          >
            {t('PaymentMethodCard.title')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            p: { xs: 1, md: 3 },
            bgcolor: '#ffffff',
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            {paymentMethods &&
              paymentMethods.map((method, index) => (
                <Accordion
                  key={method.id}
                  expanded={paymentExpanded === method.displayName}
                  onChange={handlePaymentAccordionChange(method.displayName)}
                  disabled={paymentStatus === 'completed'}
                  elevation={0}
                  sx={{
                    mb: index < paymentMethods.length - 1 ? { xs: 1, md: 1.5 } : 0,
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    borderRadius: { xs: 1.5, md: 2 },
                    overflow: 'hidden',
                    '&:before': {
                      display: 'none',
                    },
                    '&.Mui-disabled': {
                      bgcolor: '#f8fafc',
                      opacity: 0.6,
                    },
                    transition: 'all 0.2s ease',
                    '&:hover:not(.Mui-disabled)': {
                      borderColor: 'rgba(0, 0, 0, 0.15)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <Radio
                        checked={selectedMethod === method.displayName}
                        onChange={() => handleMethodChange(method.displayName)}
                        size="small"
                        disabled={paymentStatus === 'completed'}
                        sx={{
                          color: '#64748b',
                          '&.Mui-checked': {
                            color: 'primary.main',
                          },
                        }}
                      />
                    }
                    sx={{
                      px: { xs: 1.5, md: 2 },
                      py: { xs: 0.75, md: 1.5 },
                      minHeight: { xs: '48px !important', md: '56px !important' },
                      '& .MuiAccordionSummary-content': {
                        margin: { xs: '8px 0', md: '12px 0' },
                      },
                      bgcolor: paymentExpanded === method.displayName ? '#f8fafc' : 'transparent',
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.75, md: 1.5 } }}>
                      <Box
                        component="img"
                        src={method.icon}
                        alt={method.displayName}
                        sx={{
                          width: { xs: 24, md: 32 },
                          height: { xs: 24, md: 32 },
                          objectFit: 'contain',
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: { xs: '13px', md: '16px' },
                          fontWeight: 600,
                          color: '#1e293b',
                        }}
                      >
                        {method.displayName}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      px: { xs: 1, md: 2 },
                      pb: { xs: 1.5, md: 3 },
                      pt: { xs: 0.5, md: 1.5 },
                      bgcolor: '#fafbfc',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: '12px', md: '14px' },
                        color: '#64748b',
                        mb: { xs: 1.5, md: 2 },
                        lineHeight: 1.6,
                      }}
                    >
                      {method.description}
                    </Typography>
                    {/* Mostrar iframe para métodos que lo requieran */}
                    {method.responseType === 'IFRAME' && (
                      <Box>
                        {paymentStatus === 'processing' && !iframeUrl && (
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            gap={2}
                            p={4}
                          >
                            <CircularProgress size={40} />
                            <Typography
                              sx={{
                                fontSize: '14px',
                                color: '#64748b',
                                fontWeight: 500,
                              }}
                            >
                              {t('PaymentMethodCard.status.loadingForm')}
                            </Typography>
                          </Box>
                        )}

                        {iframeUrl && paymentStatus !== 'completed' && (
                          <Box
                            sx={{
                              position: 'relative',
                              border: '1px solid rgba(0, 0, 0, 0.08)',
                              borderRadius: { xs: 1.5, md: 2 },
                              overflow: 'hidden',
                              bgcolor: '#ffffff',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                              mx: { xs: -0.5, md: 0 },
                            }}
                          >
                            <iframe
                              title="Payment Iframe"
                              src={iframeUrl}
                              style={{
                                width: '100%',
                                height: isMobile ? '900px' : '640px',
                                border: 'none',
                                display: 'block',
                              }}
                            />

                            {/* Overlay de procesando */}
                            {paymentStatus === 'processing' && (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  bgcolor: 'rgba(255,255,255,0.95)',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: 2,
                                  backdropFilter: 'blur(2px)',
                                }}
                              >
                                <CircularProgress size={48} />
                                <Typography
                                  sx={{
                                    fontSize: { xs: '14px', md: '16px' },
                                    fontWeight: 600,
                                    color: '#1e293b',
                                  }}
                                >
                                  {t('PaymentMethodCard.status.processing')}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        )}

                        {/* Mensaje de pago completado */}
                        {paymentStatus === 'completed' && (
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: 2,
                              p: { xs: 3, md: 4 },
                              bgcolor: '#f0fdf4',
                              borderRadius: 3,
                              border: '1px solid #86efac',
                            }}
                          >
                            <CheckCircle
                              sx={{
                                fontSize: { xs: 56, md: 64 },
                                color: '#16a34a',
                              }}
                            />
                            <Typography
                              sx={{
                                fontSize: { xs: '16px', md: '18px' },
                                fontWeight: 700,
                                color: '#15803d',
                                textAlign: 'center',
                              }}
                            >
                              {t('PaymentMethodCard.status.completedSuccess')}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: { xs: '13px', md: '14px' },
                                color: '#16a34a',
                                fontWeight: 500,
                              }}
                            >
                              {t('PaymentMethodCard.status.redirecting')}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    )}
                    {method.responseType === 'IMG' && (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          mt: 2,
                        }}
                      >
                        {paymentStatus === 'processing' && !qrImg && (
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            gap={2}
                            p={4}
                          >
                            <CircularProgress size={40} />
                            <Typography
                              sx={{
                                fontSize: '14px',
                                color: '#64748b',
                                fontWeight: 500,
                              }}
                            >
                              {t('PaymentMethodCard.status.generatingQR')}
                            </Typography>
                          </Box>
                        )}
                        {qrImg && (
                          <Box
                            sx={{
                              position: 'relative',
                              border: '1px solid rgba(0, 0, 0, 0.08)',
                              borderRadius: { xs: 1.5, md: 2 },
                              overflow: 'hidden',
                              bgcolor: '#ffffff',
                              p: { xs: 1.5, md: 3 },
                              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                              maxWidth: { xs: '240px', md: '320px' },
                              width: '100%',
                            }}
                          >
                            <img
                              src={qrImg}
                              alt="QR Code"
                              style={{
                                width: '100%',
                                height: 'auto',
                                display: 'block',
                              }}
                            />

                            {/* Overlay de procesando */}
                            {paymentStatus === 'processing' && (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  bgcolor: 'rgba(255,255,255,0.95)',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: 2,
                                  backdropFilter: 'blur(2px)',
                                }}
                              >
                                <CircularProgress size={40} />
                                <Typography
                                  sx={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#1e293b',
                                  }}
                                >
                                  {t('PaymentMethodCard.status.processing')}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        )}
                        {qrImg && (
                          <Typography
                            sx={{
                              fontSize: { xs: '12px', md: '13px' },
                              color: '#64748b',
                              textAlign: 'center',
                              mt: 2,
                              px: 2,
                            }}
                          >
                            {t('PaymentMethodCard.instructions.scanQR')}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}
          </form>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default PaymentMethodCard;
