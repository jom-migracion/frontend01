/* import React, { useMemo, useState } from 'react';
import {
  Box,
  Avatar,
  Dialog,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { useGet2 } from '@/hooks/api';
import assertEnv from '@/config/env';

type PaymentStatus = 'paid' | 'refunded';

interface PaymentBreakdownItem {
  type?: string | null;
  description?: string | null;
  amount?: number;
}

interface PaymentApiItem {
  paymentId: number | string;
  dateDisplay: string | null;
  amount?: {
    value?: number;
    currency?: string;
    signo?: string;
    breakdownInfo?: PaymentBreakdownItem[];
  };
  methodOfPayment?: {
    type?: string | null;
    brand?: string | null;
    account?: string | null;
    urlIcon?: string | null;
  };
  booking?: {
    location?: string | null;
    initDate?: string | null;
    endDate?: string | null;
    thumbnail?: string | null;
    cancelationPolicy?: string | null;
    hostName?: string | null;
    bookIdentifier?: string | null;
    bedrooms: number;
    guests: number;
  };
  status?: string | null;
}

interface PaymentItem {
  id: string;
  title: string;
  card: string;
  destinationAndDates: string;
  amount: number;
  currency: string;
  image: string;
  year: number;
  status: PaymentStatus;
  cancelationPolicy?: string | null;
  hostName?: string | null;
  bookIdentifier?: string | null;
  bedrooms: number;
  guests: number;
  priceBreakdown: Array<{
    type: string;
    description: string;
    amount: number;
  }>;
}
*/

/* const PaymentsTab: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedPayment, setSelectedPayment] = useState<PaymentItem | null>(null);
  const { data: paymentsResponse, isLoading, isError } = useGet2<PaymentApiItem[]>(
    ['account-payments'],
    '/Payment'
  );

  const buildImageUrl = (thumbnail?: string | null) => {
    if (!thumbnail) {
      return '/images/fake/image_1.jpeg';
    }

    if (thumbnail.startsWith('http')) {
      return thumbnail;
    }

    return `${assertEnv.VITE_BASE_URL_PHOTOS_LISTING}${thumbnail}`;
  };

  const resolvePaymentYear = (dateDisplay?: string | null) => {
    if (!dateDisplay) {
      return new Date().getFullYear();
    }

    const yearMatch = dateDisplay.match(/(\d{4})/);
    return yearMatch ? Number(yearMatch[1]) : new Date().getFullYear();
  };

  const payments = useMemo(() => {
    const rawData = paymentsResponse?.data ?? [];

    return rawData.map((payment, index): PaymentItem => {
      const amountValue = Number(payment.amount?.value ?? 0);
      const amountSign = payment.amount?.signo === '-' ? -1 : 1;
      const hasPaidStatus = (payment.status ?? '').toUpperCase() === 'AUTHORIZED';
      const isRefunded = amountSign < 0 || (payment.status ?? '').toUpperCase() === 'REFUNDED';

      const paymentType = payment.methodOfPayment?.type;
      const paymentBrand = payment.methodOfPayment?.brand;
      const paymentAccount = payment.methodOfPayment?.account;
      const cardDescription = [paymentType, paymentBrand, paymentAccount].filter(Boolean).join(' · ');

      const location = payment.booking?.location ?? t('accountSettings.payments.receipt.locationFallback', {
        defaultValue: 'Ubicacion no disponible',
      });
      const initDate = payment.booking?.initDate ?? '--';
      const endDate = payment.booking?.endDate ?? '--';

      const breakdownMap = new Map<string, { type: string; description: string; amount: number }>();
      const breakdownInfo = payment.amount?.breakdownInfo ?? [];

      breakdownInfo.forEach((item) => {
        const type = item.type ?? 'OTHER';
        const amount = Number(item.amount ?? 0) * amountSign;
        const existing = breakdownMap.get(type);

        if (existing) {
          existing.amount += amount;
          if (!existing.description && item.description) {
            existing.description = item.description;
          }
          return;
        }

        breakdownMap.set(type, {
          type,
          description: item.description ?? type,
          amount,
        });
      });

      const paymentId = String(payment.paymentId ?? '').trim();

      return {
        id: paymentId, // || `PENDING-${index}`,
        title:
          payment.dateDisplay ??
          (hasPaidStatus
            ? t('accountSettings.payments.tabHistory.paidLabel', { defaultValue: 'Pago autorizado' })
            : t('accountSettings.payments.tabHistory.pendingLabel', { defaultValue: 'Pago pendiente' })),
        card:
          cardDescription ||
          t('accountSettings.payments.tabHistory.methodUnavailable', {
            defaultValue: 'Metodo de pago pendiente',
          }),
        destinationAndDates: `${location} · ${initDate}-${endDate}`,
        amount: amountValue * amountSign,
        currency: payment.amount?.currency || 'BOB',
        image: buildImageUrl(payment.booking?.thumbnail),
        year: resolvePaymentYear(payment.dateDisplay),
        status: isRefunded ? 'refunded' : 'paid',
        cancelationPolicy: payment.booking?.cancelationPolicy ?? null,
        hostName: payment.booking?.hostName ?? null,
        bookIdentifier: payment.booking?.bookIdentifier ?? null,
        bedrooms: payment.booking?.bedrooms ?? 0,
        guests: payment.booking?.guests ?? 0,
        priceBreakdown: Array.from(breakdownMap.values()),
      };
    });
  }, [paymentsResponse?.data, t]);

  const groupedByYear = useMemo(() => {
    return payments.reduce<Record<number, PaymentItem[]>>((acc, payment) => {
      if (!acc[payment.year]) {
        acc[payment.year] = [];
      }

      acc[payment.year].push(payment);
      return acc;
    }, {});
  }, [payments]);

  const sortedYears = useMemo(
    () => Object.keys(groupedByYear).map(Number).sort((a, b) => b - a),
    [groupedByYear]
  );

  const formatAmount = (amount: number) => {
    const absAmount = Math.abs(amount).toFixed(2);
    return amount < 0 ? `- $${absAmount}` : `$${absAmount}`;
  };

  const selectedDestination = selectedPayment?.destinationAndDates.split('·')[0]?.trim() ?? 'Valparaiso';

  const selectedDateRange = selectedPayment?.destinationAndDates.split('·')[1]?.trim() ?? 'Sep 18-Sep 20';

  const selectedDateLabel = selectedPayment?.title.replace('Paid ', '').replace('Refunded ', '') ?? 'Sep 14';

  const selectedCancelationPolicy = selectedPayment?.cancelationPolicy ?? null;

  const selectedBookIdentifier = selectedPayment?.bookIdentifier ?? null;

  const selectedPriceBreakdown = selectedPayment?.priceBreakdown ?? [];

  const isInitialLoading = isLoading;
*/

/* const PaymentRowSkeleton = ({ withYear = false }: { withYear?: boolean }) => (
  <Box sx={{ mb: withYear ? 3 : 0 }}>
    {withYear ? <Skeleton variant="text" width={90} height={48} sx={{ mb: 0.5 }} /> : null}
    <Stack spacing={1.75}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Stack
          key={`payment-skeleton-${index}`}
          direction="row"
          justifyContent="space-between"
          spacing={2}
          alignItems="flex-start"
          sx={{ py: 0.75 }}
        >
          <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
            <Skeleton variant="rounded" width={54} height={54} sx={{ borderRadius: 1.5, flexShrink: 0 }} />

            <Box sx={{ minWidth: 0, width: '100%' }}>
              <Skeleton variant="text" width="60%" height={34} />
              <Skeleton variant="text" width="45%" height={30} />
              <Skeleton variant="text" width="70%" height={30} />
            </Box>
          </Stack>

          <Stack alignItems="flex-end" sx={{ flexShrink: 0 }}>
            <Skeleton variant="text" width={110} height={34} />
            <Skeleton variant="text" width={45} height={30} />
          </Stack>
        </Stack>
      ))}
    </Stack>
  </Box>
);
*/

/* return (
  <Box sx={{ maxWidth: 720 }}>
    {isInitialLoading ? <PaymentRowSkeleton withYear /> : null}

    {sortedYears.map((year) => (
      <Box key={year} sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: 20, md: 28 },
            fontWeight: 500,
            mb: 1,
            color: 'text.primary',
          }}
        >
          {year}
        </Typography>

        <Stack spacing={1.75}>
          {groupedByYear[year].map((payment) => (
            <Stack
              key={payment.id}
              direction="row"
              justifyContent="space-between"
              spacing={2}
              alignItems="flex-start"
              sx={{
                py: 0.75,
                cursor: 'pointer',
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: '#f4f4f4',
                },
              }}
              onClick={() => setSelectedPayment(payment)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedPayment(payment);
                }
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0 }}>
                <Avatar
                  src={payment.image}
                  alt={payment.title}
                  variant="rounded"
                  sx={{ width: 54, height: 54, borderRadius: 1.5, flexShrink: 0 }}
                />

                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: { xs: 17, md: 17 }, fontWeight: 600, lineHeight: 1.1 }}>
                    {payment.title}
                  </Typography>
                  <Typography sx={{ fontSize: { xs: 15, md: 15 }, color: 'text.secondary', lineHeight: 1.1 }}>
                    {payment.card}
                  </Typography>
                  <Typography sx={{ fontSize: { xs: 15, md: 15 }, color: 'text.secondary', lineHeight: 1.15 }}>
                    {payment.destinationAndDates}
                  </Typography>
                </Box>
              </Stack>

              <Stack alignItems="flex-end" sx={{ flexShrink: 0 }}>
                <Typography
                  sx={{
                    fontSize: { xs: 17, md: 17 },
                    fontWeight: 600,
                    lineHeight: 1.1,
                    color: payment.status === 'refunded' ? '#8A1F17' : 'text.primary',
                  }}
                >
                  {formatAmount(payment.amount)}
                </Typography>
                <Typography sx={{ fontSize: { xs: 15, md: 15 }, lineHeight: 1.1, color: 'text.primary' }}>
                  {payment.currency}
                </Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Box>
    ))}

    <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
      {isError ? (
        <Typography variant="body2" color="error">
          {t('accountSettings.payments.tabHistory.errorLoading', {
            defaultValue: 'No se pudieron cargar los pagos.',
          })}
        </Typography>
      ) : null}
      {!isLoading && !isError && payments.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {t('accountSettings.payments.tabHistory.endOfList', {
            defaultValue: 'No hay pagos para mostrar.',
          })}
        </Typography>
      ) : null}
    </Box>

    <Dialog
      open={Boolean(selectedPayment)}
      onClose={() => setSelectedPayment(null)}
      fullScreen
      sx={{
        '& .MuiDialog-paper': {
          width: '100%',
          height: '100%',
          maxWidth: 'none',
          maxHeight: 'none',
          m: 0,
          borderRadius: 0,
          backgroundColor: '#f7f7f7',
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          px: { xs: 2, md: 6 },
          py: { xs: 2, md: 4 },
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
          <Box>
            <Typography sx={{ fontSize: { xs: 26, md: 40 }, fontWeight: 700, lineHeight: 1.1 }}>
              {t('accountSettings.payments.receipt.title', { defaultValue: 'Tu recibo de Joom' })}
            </Typography>
            <Typography sx={{ color: 'text.secondary', mt: 1, fontSize: { xs: 14, md: 20 } }}>
              {t('accountSettings.payments.receipt.identifier', {
                defaultValue: `Identificador del recibo: ${selectedPayment?.id} - ${selectedDateLabel}`,
              })}
            </Typography>
          </Box>

          <IconButton onClick={() => setSelectedPayment(null)} aria-label="Cerrar recibo">
            <CloseIcon />
          </IconButton>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: 3,
            alignItems: 'start',
          }}
        >
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: '#fff',
              p: { xs: 2, md: 3 },
            }}
          >
            <Typography sx={{ fontSize: { xs: 24, md: 34 }, fontWeight: 600, mb: 1.5 }}>
              {selectedDestination}
            </Typography>
            <Typography sx={{ fontSize: { xs: 18, md: 26 }, fontWeight: 700, mb: 1.5 }}>
              {`2 noches en ${selectedDestination}`}
            </Typography>
            <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 1.5, mb: 1.5 }}>
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Box>
                  <Typography sx={{ fontSize: { xs: 14, md: 18 }, fontWeight: 600 }}>
                    {selectedDateRange}
                  </Typography>
                  <Typography sx={{ fontSize: { xs: 13, md: 16 }, color: 'text.secondary' }}>
                    Alojamiento entero · {selectedPayment?.bedrooms || 0} camas · {selectedPayment?.guests || 0} viajeros
                  </Typography>
                  <Typography sx={{ fontSize: { xs: 13, md: 16 }, color: 'text.secondary', mt: 1 }}>
                    Anfitrion: {selectedPayment?.hostName ?? 'Anfitrion no disponible'}
                  </Typography>
                  <Typography sx={{ fontSize: { xs: 13, md: 16 }, color: 'text.secondary' }}>
                    Codigo de confirmacion: {selectedBookIdentifier}
                  </Typography>
                </Box>
                <Avatar
                  src={selectedPayment?.image}
                  alt={selectedDestination}
                  variant="rounded"
                  sx={{ width: { xs: 56, md: 88 }, height: { xs: 56, md: 88 }, borderRadius: 1.5 }}
                />
              </Stack>
            </Box>

            <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 1.5 }}>
              <Typography sx={{ fontSize: { xs: 20, md: 30 }, fontWeight: 700, mb: 1 }}>
                Politica de cancelacion
              </Typography>
              <Typography sx={{ fontSize: { xs: 13, md: 16 }, color: 'text.secondary' }}>
                {selectedCancelationPolicy}
              </Typography>
            </Box>
          </Box>

          <Stack spacing={3}>
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: '#fff',
                p: { xs: 2, md: 3 },
              }}
            >
              <Typography sx={{ fontSize: { xs: 24, md: 34 }, fontWeight: 600, mb: 2 }}>
                Desglose del precio
              </Typography>

              <Stack spacing={1.25}>
                {selectedPriceBreakdown.map((item) => {
                  return (item.type != 'PLATFORM_HOST_FEE') ?
                    <Stack key={item.type} direction="row" justifyContent="space-between">
                      <Typography sx={{ color: 'text.secondary', fontSize: { xs: 14, md: 20 } }}>
                        {item.description}
                      </Typography>
                      <Typography sx={{ fontSize: { xs: 14, md: 20 } }}>{formatAmount(item.amount)}</Typography>
                    </Stack>
                    : null;
                })}
              </Stack>

              <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 2, pt: 2 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: { xs: 16, md: 24 }, fontWeight: 700 }}>Total (BOB)</Typography>
                  <Typography sx={{ fontSize: { xs: 16, md: 24 }, fontWeight: 700 }}>
                    {formatAmount(selectedPayment?.amount ?? 0).replace('-', '')}
                  </Typography>
                </Stack>
              </Box>
            </Box>

            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: '#fff',
                p: { xs: 2, md: 3 },
              }}
            >
              <Typography sx={{ fontSize: { xs: 24, md: 34 }, fontWeight: 600, mb: 2 }}>Pago</Typography>

              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography sx={{ fontSize: { xs: 15, md: 22 }, fontWeight: 700, textTransform: 'uppercase' }}>
                    {selectedPayment?.card}
                  </Typography>
                  
                </Box>
                <Typography sx={{ fontSize: { xs: 15, md: 22 }, fontWeight: 600 }}>
                  {formatAmount(selectedPayment?.amount ?? 0)}
                </Typography>
              </Stack>

              <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 2, pt: 2 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: { xs: 16, md: 24 }, fontWeight: 700 }}>
                    Cantidad abonada (BOB)
                  </Typography>
                  <Typography sx={{ fontSize: { xs: 16, md: 24 }, fontWeight: 700 }}>
                    {formatAmount(selectedPayment?.amount ?? 0)}
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Dialog>
  </Box>
);
};

export default PaymentsTab;
*/

// NUEVO CODIGO
import React, { useMemo, useRef, useState } from 'react';
import {
  Box,
  Avatar,
  Dialog,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  //useMediaQuery,
  //useTheme,
  Divider,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import EmailIcon from '@mui/icons-material/Email';
import { useGet2 } from '@/hooks/api';
import assertEnv from '@/config/env';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

type PaymentStatus = 'paid' | 'refunded';

interface PaymentBreakdownItem {
  type?: string | null;
  description?: string | null;
  amount?: number;
}

interface PaymentApiItem {
  paymentId: number | string;
  dateDisplay: string | null;
  amount?: {
    value?: number;
    currency?: string;
    signo?: string;
    breakdownInfo?: PaymentBreakdownItem[];
    priceCalculation?: {
      guestResume?: GuestResume;
    };
  };
  methodOfPayment?: {
    type?: string | null;
    brand?: string | null;
    account?: string | null;
    urlIcon?: string | null;
  };
  booking?: {
    location?: string | null;
    initDate?: string | null;
    endDate?: string | null;
    thumbnail?: string | null;
    cancelationPolicy?: string | null;
    hostName?: string | null;
    bookIdentifier?: string | null;
    listingName?: string | null;
    bedrooms: number;
    guests: number;
  };
  status?: string | null;
  clientDetails?: {
    documentType?: string | null;
    email?: string | null;
    documentNumber?: string | null;
    fullName?: string | null;
    documentExtension?: string | null;
  } | null;
}

interface PaymentItem {
  id: string;
  title: string;
  dateDisplay: string;
  card: string;
  paymentMethodText: string;
  destinationAndDates: string;
  amount: number;
  currency: string;
  image: string;
  year: number;
  status: PaymentStatus;
  cancelationPolicy?: string | null;
  hostName?: string | null;
  bookIdentifier?: string | null;
  listingName?: string | null;
  initDate?: string | null;
  endDate?: string | null;
  bedrooms: number;
  guests: number;
  priceBreakdown: Array<{
    type: string;
    description: string;
    amount: number;
  }>;
  clientDetails?: {
    documentType?: string | null;
    email?: string | null;
    documentNumber?: string | null;
    fullName?: string | null;
    documentExtension?: string | null;
  } | null;
  clientName: string;
  clientDocument: string;
  guestResume: GuestResume | null;
}

interface GuestResume {
  accommodation?: {
    ratePerNight?: number;
    nightsCount?: number;
    baseAmount?: number;
    appliedDiscount?: number;
    discountedAmount?: number;
  };
  additionalCharges?: {
    extraGuestFee?: number;
    petFee?: number;
    cleaningFee?: number;
    otherFees?: number;
  };
  subtotal?: number;
  guestCommission?: number;
  guestCommissionPercent?: number;
  total?: number;
  currencyCode?: string;
}

// Helper para convertir números a letras en español (Soporta hasta millones)
const numeroALetras = (num: number): string => {
  if (num === 0) return 'Cero';

  const convertirTresDigitos = (n: number): string => {
    let c = Math.floor(n / 100);
    let d = Math.floor((n % 100) / 10);
    let u = n % 10;
    let str = '';

    if (c === 1) {
      str += d === 0 && u === 0 ? 'cien ' : 'ciento ';
    } else if (c > 1) {
      const cientos = [
        '',
        '',
        'doscientos',
        'trescientos',
        'cuatrocientos',
        'quinientos',
        'seiscientos',
        'setecientos',
        'ochocientos',
        'novecientos',
      ];
      str += cientos[c] + ' ';
    }

    if (d === 1) {
      const especiales = [
        'diez',
        'once',
        'doce',
        'trece',
        'catorce',
        'quince',
        'dieciséis',
        'diecisiete',
        'dieciocho',
        'diecinueve',
      ];
      str += especiales[u] + ' ';
    } else if (d === 2) {
      const unidades = [
        '',
        'un',
        'dos',
        'tres',
        'cuatro',
        'cinco',
        'seis',
        'siete',
        'ocho',
        'nueve',
      ];
      if (u === 0) str += 'veinte ';
      else str += 'veinti' + unidades[u] + ' ';
    } else if (d > 2) {
      const decenas = [
        '',
        '',
        '',
        'treinta',
        'cuarenta',
        'cincuenta',
        'sesenta',
        'setenta',
        'ochenta',
        'noventa',
      ];
      const unidades = [
        '',
        'un',
        'dos',
        'tres',
        'cuatro',
        'cinco',
        'seis',
        'siete',
        'ocho',
        'nueve',
      ];
      str += decenas[d];
      if (u > 0) str += ' y ' + unidades[u];
      str += ' ';
    } else if (u > 0) {
      const unidades = [
        '',
        'un',
        'dos',
        'tres',
        'cuatro',
        'cinco',
        'seis',
        'siete',
        'ocho',
        'nueve',
      ];
      str += unidades[u] + ' ';
    }

    return str.trim();
  };

  let resultado = '';
  let millones = Math.floor(num / 1000000);
  let miles = Math.floor((num % 1000000) / 1000);
  let resto = Math.floor(num % 1000);

  if (millones > 0) {
    if (millones === 1) resultado += 'un millón ';
    else resultado += convertirTresDigitos(millones) + ' millones ';
  }

  if (miles > 0) {
    if (miles === 1) resultado += 'mil ';
    else resultado += convertirTresDigitos(miles) + ' mil ';
  }

  if (resto > 0) {
    resultado += convertirTresDigitos(resto);
  }

  const texto = resultado.trim();
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

const PaymentsTab: React.FC = () => {
  const { t } = useTranslation();
  //const theme = useTheme();
  //const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedPayment, setSelectedPayment] = useState<PaymentItem | null>(null);
  //const [selectedPayment, setSelectedPayment] = useState<any | null>(null);

  // Referencia para el contenedor imprimible
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false); // Estado para controlar el loading del botón

  const {
    data: paymentsResponse,
    isLoading,
    isError,
  } = useGet2<PaymentApiItem[]>(['account-payments'], '/Payment');

  const buildImageUrl = (thumbnail?: string | null) => {
    if (!thumbnail) {
      return '/images/fake/image_1.jpeg';
    }
    if (thumbnail.startsWith('http')) {
      return thumbnail;
    }
    return `${assertEnv.VITE_BASE_URL_PHOTOS_LISTING}${thumbnail}`;
  };

  const resolvePaymentYear = (dateDisplay?: string | null) => {
    if (!dateDisplay) {
      return new Date().getFullYear();
    }
    const yearMatch = dateDisplay.match(/(\d{4})/);
    return yearMatch ? Number(yearMatch[1]) : new Date().getFullYear();
  };

  // Helper para convertir la fecha a formato normal
  const formatearFechaRecibo = (dateStr?: string): string => {
    if (!dateStr) return '';

    const match = dateStr.match(
      /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2}),\s+(\d{4})/i
    );

    if (!match) return dateStr;

    const meses: Record<string, string> = {
      jan: '01',
      feb: '02',
      mar: '03',
      apr: '04',
      may: '05',
      jun: '06',
      jul: '07',
      aug: '08',
      sep: '09',
      oct: '10',
      nov: '11',
      dec: '12',
    };

    const mesIngles = match[1].toLowerCase();
    const dia = match[2].padStart(2, '0');
    const anio = match[3];

    const mesNumero = meses[mesIngles] || '01';

    return `${dia}/${mesNumero}/${anio}`;
  };

  const payments = useMemo(() => {
    const rawData = paymentsResponse?.data ?? [];

    return rawData.map((payment, index): PaymentItem => {
      const amountValue = Number(payment.amount?.value ?? 0);
      const amountSign = payment.amount?.signo === '-' ? -1 : 1;
      const hasPaidStatus = (payment.status ?? '').toUpperCase() === 'AUTHORIZED';
      const isRefunded = amountSign < 0 || (payment.status ?? '').toUpperCase() === 'REFUNDED';

      const paymentType = payment.methodOfPayment?.type;
      const paymentBrand = payment.methodOfPayment?.brand;
      const paymentAccount = payment.methodOfPayment?.account;
      const cardDescription = [paymentType, paymentBrand, paymentAccount]
        .filter(Boolean)
        .join(' · ');

      const paymentMethodText = paymentType || 'Tarjeta de Crédito';

      const location =
        payment.booking?.location ??
        t('accountSettings.payments.receipt.locationFallback', {
          defaultValue: 'Ubicacion no disponible',
        });
      const initDate = payment.booking?.initDate ?? '--';
      const endDate = payment.booking?.endDate ?? '--';

      const breakdownMap = new Map<string, { type: string; description: string; amount: number }>();
      const breakdownInfo = payment.amount?.breakdownInfo ?? [];

      const clientName = payment.clientDetails?.fullName || 'Consumidor Final';

      const docType = payment.clientDetails?.documentType || 'CI/NIT';
      const docNum = payment.clientDetails?.documentNumber || '0000000';
      const docExt = payment.clientDetails?.documentExtension
        ? ` ${payment.clientDetails.documentExtension}`
        : '';
      const clientDocument = `${docType}: ${docNum}${docExt}`;

      breakdownInfo.forEach((item) => {
        const type = item.type ?? 'OTHER';
        const amount = Number(item.amount ?? 0) * amountSign;
        const existing = breakdownMap.get(type);

        if (existing) {
          existing.amount += amount;
          if (!existing.description && item.description) {
            existing.description = item.description;
          }
          return;
        }

        breakdownMap.set(type, {
          type,
          description: item.description ?? type,
          amount,
        });
      });

      const paymentId = String(payment.paymentId ?? '').trim();

      const guestResumeData = payment.amount?.priceCalculation?.guestResume ?? null;

      return {
        id: paymentId,
        title:
          payment.dateDisplay ??
          (hasPaidStatus
            ? t('accountSettings.payments.tabHistory.paidLabel', {
                defaultValue: 'Pago autorizado',
              })
            : t('accountSettings.payments.tabHistory.pendingLabel', {
                defaultValue: 'Pago pendiente',
              })),
        dateDisplay: payment.dateDisplay ?? '',
        card:
          cardDescription ||
          t('accountSettings.payments.tabHistory.methodUnavailable', {
            defaultValue: 'Metodo de pago pendiente',
          }),
        paymentMethodText,
        destinationAndDates: `${location} · ${initDate}-${endDate}`,
        amount: amountValue * amountSign,
        currency: payment.amount?.currency || 'BOB',
        image: buildImageUrl(payment.booking?.thumbnail),
        year: resolvePaymentYear(payment.dateDisplay),
        status: isRefunded ? 'refunded' : 'paid',
        cancelationPolicy: payment.booking?.cancelationPolicy ?? null,
        hostName: payment.booking?.hostName ?? null,
        bookIdentifier: payment.booking?.bookIdentifier ?? null,
        listingName: payment.booking?.listingName ?? null,
        initDate: payment.booking?.initDate,
        endDate: payment.booking?.endDate,
        bedrooms: payment.booking?.bedrooms ?? 0,
        guests: payment.booking?.guests ?? 0,
        priceBreakdown: Array.from(breakdownMap.values()),
        clientName,
        clientDocument,
        guestResume: guestResumeData,
        clientDetails: payment.clientDetails,
      };
    });
  }, [paymentsResponse?.data, t]);

  const groupedByYear = useMemo(() => {
    return payments.reduce<Record<number, PaymentItem[]>>((acc, payment) => {
      if (!acc[payment.year]) acc[payment.year] = [];
      acc[payment.year].push(payment);
      return acc;
    }, {});
  }, [payments]);

  const sortedYears = useMemo(
    () =>
      Object.keys(groupedByYear)
        .map(Number)
        .sort((a, b) => b - a),
    [groupedByYear]
  );

  const formatAmount = (amount: number) => {
    const absAmount = Math.abs(amount).toFixed(2);
    const formatted = absAmount.replace('.', ',');
    return amount < 0 ? `- ${formatted}` : formatted;
  };

  const isInitialLoading = isLoading;

  // --- VARIABLES DERIVADAS PARA EL RECIBO ---
  /* const receiptSubtotal = selectedPayment?.priceBreakdown
    //.filter(item => item.type !== 'PLATFORM_HOST_FEE' && item.type !== 'PAYMENT_PLATFORM_FEE')
    .filter(item => item.type !== 'PLATFORM_HOST_FEE')
    .reduce((acc, curr) => acc + curr.amount, 0) ?? 0; */

  const receiptTotal = selectedPayment?.guestResume?.total ?? 0;

  // Lógica para el Texto Literal del Monto Total
  const receiptTotalLiteral = useMemo(() => {
    if (!receiptTotal) return 'Cero 00/100';

    // A 2 decimales
    const totalFixed = Math.abs(receiptTotal).toFixed(2);
    const partes = totalFixed.split('.');

    const parteEntera = parseInt(partes[0], 10);
    const parteDecimal = partes[1];

    const letrasEnteras = numeroALetras(parteEntera);

    return `${letrasEnteras} ${parteDecimal}/100`;
  }, [receiptTotal]);

  // Helper de Skeleton
  const PaymentRowSkeleton = ({ withYear = false }: { withYear?: boolean }) => (
    <Box sx={{ mb: withYear ? 3 : 0 }}>
      {withYear && <Skeleton variant="text" width={90} height={48} sx={{ mb: 0.5 }} />}
      <Stack spacing={1.75}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Stack
            key={`payment-skeleton-${index}`}
            direction="row"
            justifyContent="space-between"
            spacing={2}
            sx={{ py: 0.75 }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
              <Skeleton variant="rounded" width={54} height={54} sx={{ borderRadius: 1.5 }} />
              <Box sx={{ minWidth: 0, width: '100%' }}>
                <Skeleton variant="text" width="60%" height={34} />
                <Skeleton variant="text" width="45%" height={30} />
              </Box>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Box>
  );

  // --- FUNCIÓN PARA EXPORTAR A PDF ---
  const handleExportPDF = async () => {
    const element = receiptRef.current;
    if (!element) return;

    try {
      setIsExporting(true);

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      // Tipo de imagen 'image/jpeg'; compresión (0.75 - 0.80)
      const imgData = canvas.toDataURL('image/jpeg', 0.8);

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Renderizado en el PDF con formato JPEG
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      pdf.save(`recibo_JOM_${selectedPayment?.id || 'pago'}.pdf`);
    } catch (error) {
      console.error('Error generando el PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 760 }}>
      {isInitialLoading && <PaymentRowSkeleton withYear />}

      {/* --- LISTADO DE PAGOS --- */}
      {sortedYears.map((year) => (
        <Box key={year} sx={{ mb: 3 }}>
          <Typography sx={{ color: 'text.secondary', fontSize: 20, fontWeight: 500, mb: 2.5 }}>
            {year}
          </Typography>

          <Stack spacing={2} sx={{ mb: 5 }}>
            {groupedByYear[year].map((payment) => (
              <Stack
                key={payment.id}
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                spacing={{ xs: 1, sm: 2 }}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                sx={{
                  py: 1.5,
                  px: 1,
                  cursor: 'pointer',
                  borderRadius: 1,
                  '&:hover': { backgroundColor: '#f4f4f4' },
                }}
                onClick={() => setSelectedPayment(payment)}
              >
                {/* Columna 1: Detalles */}
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="flex-start"
                  sx={{ flex: 1, minWidth: 0, width: '100%' }}
                >
                  <Avatar
                    src={payment.image}
                    alt={payment.title}
                    variant="rounded"
                    sx={{ width: 40, height: 40, borderRadius: 1.25, mt: 0.5 }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: { xs: 17, md: 17 }, fontWeight: 600 }}>
                      {payment.title}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 15, lineHeight: 1.3 }}>
                      {payment.card}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 14, lineHeight: 1.3 }}>
                      {payment.destinationAndDates}
                    </Typography>
                  </Box>
                </Stack>

                {/* CONTENEDOR PARA COLUMNAS 2 Y 3 (Montos y Estado) */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    width: { xs: '100%', sm: 'auto' },
                    pl: { xs: 6.5, sm: 0 },
                    mt: { xs: 0.5, sm: 0 },
                  }}
                >
                  {/* COLUMNA 2: Montos */}
                  <Stack
                    alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
                    sx={{ flexShrink: 0, minWidth: { sm: 80 }, mr: { xs: 2, sm: 4 } }}
                  >
                    <Typography
                      sx={{ fontSize: 17, fontWeight: 600, lineHeight: 1.1, color: 'text.primary' }}
                    >
                      ${Math.abs(payment.amount).toFixed(2)}
                    </Typography>
                    <Typography sx={{ fontSize: 15, lineHeight: 1.1, color: 'text.primary' }}>
                      {payment.currency}
                    </Typography>
                  </Stack>

                  {/* COLUMNA 3: Estado y Fecha */}
                  <Stack
                    alignItems={{ xs: 'flex-end', sm: 'flex-start' }}
                    sx={{ flexShrink: 0, minWidth: { sm: 150 } }}
                  >
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 700,
                        lineHeight: 1.2,
                        color: 'text.primary',
                        textTransform: 'uppercase',
                        textAlign: { xs: 'right', sm: 'left' },
                      }}
                    >
                      {payment.status || '--'}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 13,
                        lineHeight: 1.2,
                        color: 'text.secondary',
                        textAlign: { xs: 'right', sm: 'left' },
                      }}
                    >
                      {payment.dateDisplay}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Box>
      ))}

      {/* --- DIALOG DEL RECIBO --- */}
      <Dialog
        open={Boolean(selectedPayment)}
        onClose={() => setSelectedPayment(null)}
        fullScreen
        sx={{
          '& .MuiDialog-paper': {
            width: '100%',
            height: '100%',
            maxWidth: 'none',
            maxHeight: 'none',
            m: 0,
            borderRadius: 0,
            backgroundColor: '#F5F5F5',
          },
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: { xs: 2, md: 6 },
            px: 2,
          }}
        >
          {/* Botón Cerrar */}
          <Box
            sx={{
              maxWidth: 850,
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
              mb: 1,
            }}
          >
            <IconButton onClick={() => setSelectedPayment(null)} aria-label="Cerrar recibo">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* CONTENEDOR TIPO HOJA */}
          <Box
            ref={receiptRef}
            sx={{
              maxWidth: 850,
              width: '100%',
              backgroundColor: '#fff',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
              borderRadius: 2,
              p: { xs: 3, md: 6 },
              position: 'relative',
            }}
          >
            {/* ENCABEZADO */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 4,
                mb: 6,
              }}
            >
              {/* Lado Izquierdo - Logo y Empresa */}
              <Box>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: '#1A2138',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box sx={{ width: 16, height: 16, border: '2px solid #fff' }} />
                  </Box>
                  <Typography
                    sx={{ fontWeight: 800, fontSize: 24, color: '#1A2138', letterSpacing: 0.5 }}
                  >
                    JOM
                  </Typography>
                </Stack>
                <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                  Equipetrol, Calle 5 Este
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                  Santa Cruz de la Sierra, Bolivia
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: 14, mt: 1 }}>
                  NIT: 1029384756
                </Typography>
              </Box>

              {/* Lado Derecho - Datos del Recibo */}
              <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: 32, md: 48 },
                    color: '#1A2138',
                    lineHeight: 1,
                    mb: 2,
                  }}
                >
                  RECIBO
                </Typography>
                <Stack spacing={0.5}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                      gap: 1,
                    }}
                  >
                    <Typography
                      sx={{ color: 'text.secondary', fontSize: 12, textTransform: 'uppercase' }}
                    >
                      N° RECIBO:
                    </Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: 12 }}>
                      {selectedPayment?.id || '00452'}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                      gap: 1,
                    }}
                  >
                    <Typography
                      sx={{ color: 'text.secondary', fontSize: 12, textTransform: 'uppercase' }}
                    >
                      FECHA/HORA:
                    </Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: 12 }}>
                      {formatearFechaRecibo(selectedPayment?.dateDisplay)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                      gap: 1,
                    }}
                  >
                    <Typography
                      sx={{ color: 'text.secondary', fontSize: 12, textTransform: 'uppercase' }}
                    >
                      MÉTODO DE PAGO:
                    </Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: 12 }}>
                      {selectedPayment?.paymentMethodText}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>

            {/* SECCIÓN DE DATOS (Cliente y Reserva) */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 4,
                mb: 6,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: 12,
                    fontWeight: 600,
                    mb: 1.5,
                    letterSpacing: 1,
                  }}
                >
                  DATOS DEL CLIENTE
                </Typography>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '170px 1fr',
                    rowGap: 0.5,
                    alignItems: 'baseline',
                  }}
                >
                  {/* Fila Nombre */}
                  <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                    Nombre/Razón Social:
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#1A2138' }}>
                    {selectedPayment?.clientDetails?.fullName}
                  </Typography>
                  {/* Fila Documento */}
                  <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>NIT/CI:</Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#1A2138' }}>
                    {selectedPayment?.clientDetails?.documentNumber}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: 12,
                    fontWeight: 600,
                    mb: 1.5,
                    letterSpacing: 1,
                  }}
                >
                  REFERENCIA DE RESERVA
                </Typography>
                <Typography sx={{ fontSize: 14, mb: 0.5 }}>
                  <Typography component="span" sx={{ fontWeight: 700 }}>
                    ID:{' '}
                  </Typography>
                  #{selectedPayment?.bookIdentifier}
                </Typography>
                <Typography sx={{ fontSize: 14, mb: 0.5 }}>
                  <Typography component="span" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                    Inmueble:{' '}
                  </Typography>
                  {selectedPayment?.listingName || 'Propiedad'}
                </Typography>
                <Typography sx={{ fontSize: 14 }}>
                  <Typography component="span" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                    Fechas:{' '}
                  </Typography>
                  {selectedPayment?.initDate} - {selectedPayment?.endDate}
                </Typography>
              </Box>
            </Box>

            {/* TABLA DE DESGLOSE */}
            <Box sx={{ width: '100%', mb: 4 }}>
              {/* Table Headers */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '6fr 2fr 2fr 2fr',
                  gap: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  pb: 1.5,
                  mb: 2,
                }}
              >
                <Typography
                  sx={{ color: 'text.secondary', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}
                >
                  CONCEPTO
                </Typography>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: 1,
                    textAlign: 'center',
                  }}
                >
                  CANTIDAD
                </Typography>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: 1,
                    textAlign: 'right',
                  }}
                >
                  PRECIO UNITARIO
                </Typography>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: 1,
                    textAlign: 'right',
                  }}
                >
                  SUBTOTAL
                </Typography>
              </Box>

              {/* Table Rows basadas en guestResume */}
              <Stack spacing={2.5}>
                {/* 1. Hospedaje Base */}
                {Number(selectedPayment?.guestResume?.accommodation?.baseAmount) > 0 && (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '6fr 2fr 2fr 2fr',
                      gap: 2,
                      alignItems: 'flex-start',
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#1A2138' }}>
                        Hospedaje ({selectedPayment?.guestResume?.accommodation?.nightsCount || 1}{' '}
                        noche(s))
                      </Typography>
                      <Typography sx={{ color: 'text.secondary', fontSize: 13, mt: 0.5 }}>
                        Alojamiento en {selectedPayment?.listingName || 'Propiedad'}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, textAlign: 'center' }}>
                      1
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, textAlign: 'right' }}>
                      {formatAmount(selectedPayment!.guestResume!.accommodation!.baseAmount!)}
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, textAlign: 'right' }}>
                      {formatAmount(selectedPayment!.guestResume!.accommodation!.baseAmount!)}
                    </Typography>
                  </Box>
                )}

                {/* 2. Descuento */}
                {Number(selectedPayment?.guestResume?.accommodation?.appliedDiscount) > 0 && (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '6fr 2fr 2fr 2fr',
                      gap: 2,
                      alignItems: 'center',
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#1A2138' }}>
                      Descuento nuevos
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, textAlign: 'center' }}>
                      1
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, textAlign: 'right' }}>
                      {formatAmount(-selectedPayment!.guestResume!.accommodation!.appliedDiscount!)}
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, textAlign: 'right' }}>
                      {formatAmount(-selectedPayment!.guestResume!.accommodation!.appliedDiscount!)}
                    </Typography>
                  </Box>
                )}

                {/* 3. Hospedaje con Descuento (Solo si hubo descuento) */}
                {Number(selectedPayment?.guestResume?.accommodation?.appliedDiscount) > 0 && (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '6fr 6fr',
                      gap: 2,
                      alignItems: 'center',
                      borderTop: '2px solid #1A2138',
                      pt: 1.5,
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#1A2138' }}>
                      Hospedaje con Descuento
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, textAlign: 'right' }}>
                      {selectedPayment?.currency}{' '}
                      {formatAmount(selectedPayment!.guestResume!.accommodation!.discountedAmount!)}
                    </Typography>
                  </Box>
                )}

                {/* 4. Cargos Adicionales */}
                {Number(selectedPayment?.guestResume?.additionalCharges?.cleaningFee) > 0 && (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '6fr 2fr 2fr 2fr',
                      gap: 2,
                      alignItems: 'center',
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#1A2138' }}>
                      Tarifa por limpieza de propiedades
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, textAlign: 'center' }}>
                      1
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, textAlign: 'right' }}>
                      {formatAmount(selectedPayment!.guestResume!.additionalCharges!.cleaningFee!)}
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, textAlign: 'right' }}>
                      {formatAmount(selectedPayment!.guestResume!.additionalCharges!.cleaningFee!)}
                    </Typography>
                  </Box>
                )}

                {Number(selectedPayment?.guestResume?.additionalCharges?.extraGuestFee) > 0 && (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '6fr 2fr 2fr 2fr',
                      gap: 2,
                      alignItems: 'center',
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#1A2138' }}>
                      Huéspedes extra
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, textAlign: 'center' }}>
                      1
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, textAlign: 'right' }}>
                      {formatAmount(
                        selectedPayment!.guestResume!.additionalCharges!.extraGuestFee!
                      )}
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, textAlign: 'right' }}>
                      {formatAmount(
                        selectedPayment!.guestResume!.additionalCharges!.extraGuestFee!
                      )}
                    </Typography>
                  </Box>
                )}

                {Number(selectedPayment?.guestResume?.additionalCharges?.petFee) > 0 && (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '6fr 2fr 2fr 2fr',
                      gap: 2,
                      alignItems: 'center',
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#1A2138' }}>
                      Mascota
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, textAlign: 'center' }}>
                      1
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, textAlign: 'right' }}>
                      {formatAmount(selectedPayment!.guestResume!.additionalCharges!.petFee!)}
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, textAlign: 'right' }}>
                      {formatAmount(selectedPayment!.guestResume!.additionalCharges!.petFee!)}
                    </Typography>
                  </Box>
                )}

                {Number(selectedPayment?.guestResume?.additionalCharges?.otherFees) > 0 && (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '6fr 2fr 2fr 2fr',
                      gap: 2,
                      alignItems: 'center',
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#1A2138' }}>
                      Otros cargos
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, textAlign: 'center' }}>
                      1
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, textAlign: 'right' }}>
                      {formatAmount(selectedPayment!.guestResume!.additionalCharges!.otherFees!)}
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, textAlign: 'right' }}>
                      {formatAmount(selectedPayment!.guestResume!.additionalCharges!.otherFees!)}
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ borderBottomWidth: 2, borderColor: '#1A2138', mb: 1.5 }} />

                {/* 5. Subtotal general */}
                {Number(selectedPayment?.guestResume?.subtotal) > 0 && (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '6fr 2fr 2fr 2fr',
                      gap: 2,
                      alignItems: 'center',
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: 'text.secondary' }}>
                      Subtotal
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, textAlign: 'center' }}>
                      1
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, textAlign: 'right' }}>
                      {formatAmount(selectedPayment!.guestResume!.subtotal!)}
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, textAlign: 'right' }}>
                      {formatAmount(selectedPayment!.guestResume!.subtotal!)}
                    </Typography>
                  </Box>
                )}

                {/* 6. Comisión de la Plataforma */}
                {Number(selectedPayment?.guestResume?.guestCommission) > 0 && (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '6fr 2fr 2fr 2fr',
                      gap: 2,
                      alignItems: 'center',
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#1A2138' }}>
                      Comisión de uso de plataforma
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, textAlign: 'center' }}>
                      1
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, textAlign: 'right' }}>
                      {formatAmount(selectedPayment!.guestResume!.guestCommission!)}
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, textAlign: 'right' }}>
                      {formatAmount(selectedPayment!.guestResume!.guestCommission!)}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Box>

            {/* TOTALES */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 6 }}>
              <Box sx={{ width: { xs: '100%', sm: 350 } }}>
                <Divider sx={{ borderBottomWidth: 2, borderColor: '#1A2138', mb: 1.5 }} />
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-end"
                  sx={{ mb: 1 }}
                >
                  <Typography sx={{ fontWeight: 700, fontSize: 16 }}>TOTAL</Typography>
                  <Typography
                    sx={{ fontWeight: 800, fontSize: 28, color: '#1A2138', lineHeight: 1 }}
                  >
                    {selectedPayment?.currency}{' '}
                    {formatAmount(selectedPayment?.guestResume?.total || 0)}
                    {/* {selectedPayment?.currency} {selectedPayment?.guestResume?.total || 0} */}
                  </Typography>
                </Stack>

                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: 10,
                    fontWeight: 500,
                    textAlign: 'right',
                    mt: 0.5,
                    fontStyle: 'italic',
                  }}
                >
                  Son: {receiptTotalLiteral} Bolivianos
                </Typography>
              </Box>
            </Box>

            {/* NOTAS Y PIE DE PÁGINA */}
            <Box sx={{ mb: 6 }}>
              <Box
                sx={{
                  backgroundColor: '#F8F9FA',
                  p: 3,
                  borderRadius: 1,
                  borderLeft: '4px solid #E0E0E0',
                }}
              >
                <Typography sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.6 }}>
                  <Typography component="span" sx={{ fontWeight: 700 }}>
                    Nota:{' '}
                  </Typography>
                  El presente recibo corresponde únicamente al servicio de intermediación digital
                  proporcionado por JOM por el uso de su plataforma tecnológica. El cobro por
                  concepto de alojamiento es gestionado de manera independiente por el anfitrión del
                  inmueble conforme a las políticas de servicio.
                </Typography>
              </Box>
            </Box>

            <Typography
              sx={{
                textAlign: 'center',
                fontSize: 10,
                color: 'text.disabled',
                fontWeight: 600,
                letterSpacing: 1,
              }}
            >
              ESTE RECIBO CONTRIBUYE AL DESARROLLO DEL PAÍS. CUALQUIER CONSULTA POR FAVOR CONTACTE A
              JOM
            </Typography>
          </Box>

          {/* BOTONES DE ACCIÓN */}
          <Stack direction="row" justifyContent="center" spacing={3} sx={{ mt: 8 }}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleExportPDF}
              disabled={isExporting}
              sx={{
                backgroundColor: '#111526',
                color: '#fff',
                borderRadius: 8,
                textTransform: 'none',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                '&:hover': { backgroundColor: '#0a0d18' },
              }}
            >
              {isExporting ? 'Exportando...' : 'Exportar PDF'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<EmailIcon sx={{ color: 'text.secondary' }} />}
              sx={{
                borderColor: 'divider',
                color: 'text.primary',
                borderRadius: 8,
                textTransform: 'none',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                '&:hover': { backgroundColor: '#f5f5f5', borderColor: 'divider' },
              }}
            >
              Enviar por correo
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
};

export default PaymentsTab;
