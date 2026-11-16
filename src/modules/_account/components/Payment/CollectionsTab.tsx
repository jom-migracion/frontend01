import React, { useMemo, useState, useRef } from 'react';
import {
  Avatar,
  Box,
  Dialog,
  Divider,
  IconButton,
  Skeleton,
  //Link,
  Stack,
  Typography,
  //useMediaQuery,
  //useTheme,
  Button,
} from '@mui/material';
//import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import EmailIcon from '@mui/icons-material/Email';
import { useGet2 } from '@/hooks/api';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// --- INTERFACES ---
interface HostResume {
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
  hostCommission?: number;
  hostCommissionPercent?: number;
  amountToCollect?: number;
  currencyCode?: string | null;
  penaltyApplied?: number | null;
}

interface CollectionBreakdownItem {
  type?: string | null;
  description?: string | null;
  amount?: number;
}

interface PayoutReceiptApiItem {
  payoutTransactionId: number;
  amount?: number;
  currencyCode?: string | null;
  originalAmount?: number;
  PayoutDate?: string | null;
  ScheduledPayoutDate?: string | null;
  poCode?: string | null;
  priceCalculation?: {
    amount?: number;
    discounts?: number;
    platformFee?: number | null;
    currencyCode?: string | null;
    breakdownInfo?: CollectionBreakdownItem[];
    hostResume?: HostResume;
  };
  book?: {
    bookId?: number;
    bookingCode?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    nigths?: number;
    Guest?: {
      name?: string | null;
      lastname?: string | null;
    };
    listingRent?: {
      name?: string | null;
      Owner?: {
        name?: string | null;
        lastname?: string | null;
      };
    };
  };
  payoutStatus?: string | null;
  payoutAccount?: {
    numberAccount?: string | null;
    formOfPayment?: string | null;
    provider?: string | null;
  };

  penaltyApplied?: number | null;
}

interface CollectionItem {
  id: string;
  title: string;
  card: string;
  paymentMethodText: string;
  destinationAndDates: string;
  amount: number;
  currency: string;
  image: string;
  year: number;
  receiptCode: string;
  receiptDateLabel: string;
  payoutDateLabel: string;
  startDateLabel: string;
  endDateLabel: string;
  nights: number;
  hostName: string;
  guestName: string;
  bookingCode: string;
  listingName: string;
  hostResume: HostResume | null;
  endorsementReason?: string | null;
  endorsementDocumentNumber?: string | null;
  // últimos campos agregados
  payoutStatus?: string | null;
  exactPayoutDate?: string | null;
  penaltyApplied?: number | null;
}

// --- HELPERS ---

/* const formatearFechaRecibo = (dateStr?: string): string => {
  if (!dateStr) return '';
  const match = dateStr.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2}),\s+(\d{4})/i);
  if (!match) return dateStr;

  const meses: Record<string, string> = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
  };

  const mesIngles = match[1].toLowerCase();
  const dia = match[2].padStart(2, '0');
  const anio = match[3];
  const mesNumero = meses[mesIngles] || '01';

  return `${dia}/${mesNumero}/${anio}`;
}; */

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

const CollectionsTab: React.FC = () => {
  //const { t } = useTranslation();
  //const theme = useTheme();
  //const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedCollection, setSelectedCollection] = useState<CollectionItem | null>(null);

  const receiptRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const {
    data: collectionsResponse,
    isLoading,
    //isError,
  } = useGet2<PayoutReceiptApiItem[]>(['account-collections'], '/Payout/RentalsReceipts');

  const formatShortDate = (dateString?: string | null) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '--';
    return date.toLocaleDateString('es-BO', { month: 'short', day: 'numeric' });
  };

  const formatReceiptDate = (dateString?: string | null) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '--';
    return date.toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const resolveYear = (dateString?: string | null) => {
    if (!dateString) return new Date().getFullYear();
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return new Date().getFullYear();
    return date.getFullYear();
  };

  function formatAmount(amount: number) {
    const absAmount = Math.abs(amount).toFixed(2);
    const formatted = absAmount.replace('.', ',');
    return amount < 0 ? `- ${formatted}` : formatted;
  }

  // Helper para formatear la fecha exacta como "YYYY-MM-DD"
  const formatExactDateTime = (dateString?: string | null) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const collections = useMemo(() => {
    const rawData = collectionsResponse?.data ?? [];

    return rawData.map((item): CollectionItem => {
      const payoutDate = item.PayoutDate;
      const startDate = item.book?.startDate;
      const endDate = item.book?.endDate;
      const currency = item.currencyCode ?? item.priceCalculation?.currencyCode ?? 'BOB';
      const amount = Number(item.amount ?? 0);
      const bookingCode = item.book?.bookingCode ?? '';

      const payoutAccount = item.payoutAccount;
      const accountNumber = payoutAccount?.numberAccount ?? '';
      const accountTail = accountNumber ? accountNumber.slice(-4) : '';
      const card = [
        payoutAccount?.formOfPayment,
        payoutAccount?.provider,
        accountTail ? `****${accountTail}` : null,
      ]
        .filter(Boolean)
        .join(' · ');

      const paymentMethodText = payoutAccount?.formOfPayment || 'Transferencia';

      const listingName = item.book?.listingRent?.name || 'Propiedad';
      const startShort = formatShortDate(startDate);
      const endShort = formatShortDate(endDate);

      const guestName = [item.book?.Guest?.name, item.book?.Guest?.lastname]
        .filter(Boolean)
        .join(' ');
      const hostName = [
        item.book?.listingRent?.Owner?.name,
        item.book?.listingRent?.Owner?.lastname,
      ]
        .filter(Boolean)
        .join(' ');

      return {
        id: String(item.payoutTransactionId),
        title: `Cobro el ${formatShortDate(payoutDate)}`,
        card: card || 'Metodo de cobro no disponible',
        paymentMethodText,
        destinationAndDates: `${listingName} · ${startShort}-${endShort}`,
        amount,
        currency,
        image: '/images/fake/image_1.jpeg',
        year: resolveYear(payoutDate),
        receiptCode: item.poCode || `RC${item.payoutTransactionId}`,
        receiptDateLabel: formatReceiptDate(payoutDate),
        payoutDateLabel: formatReceiptDate(payoutDate),
        startDateLabel: startShort,
        endDateLabel: endShort,
        nights: Number(item.book?.nigths ?? 0),
        hostName: hostName || 'Anfitrion',
        guestName: guestName || 'Huesped',
        bookingCode:
          item.book?.bookingCode || `BK-${item.book?.bookId ?? item.payoutTransactionId}`,
        listingName,
        hostResume: item.priceCalculation?.hostResume ?? null,
        endorsementReason: (item.priceCalculation as any)?.endorsementReason ?? null,
        endorsementDocumentNumber:
          (item.priceCalculation as any)?.EndorsementDocumentNumber ?? null,

        // --- NUEVOS CAMPOS ---
        payoutStatus: item.payoutStatus ?? null,
        exactPayoutDate: formatExactDateTime(item.PayoutDate),
        penaltyApplied: item.penaltyApplied ?? null,
      };
    });
  }, [collectionsResponse?.data]);

  const groupedByYear = useMemo(() => {
    return collections.reduce<Record<number, CollectionItem[]>>((acc, item) => {
      if (!acc[item.year]) acc[item.year] = [];
      acc[item.year].push(item);
      return acc;
    }, {});
  }, [collections]);

  const sortedYears = useMemo(
    () =>
      Object.keys(groupedByYear)
        .map(Number)
        .sort((a, b) => b - a),
    [groupedByYear]
  );

  // Lógica para el Texto Literal
  //const total = selectedCollection?.hostResume?.amountToCollect ?? 0;
  const total = selectedCollection?.amount ?? 0;

  const receiptTotalLiteral = useMemo(() => {
    if (!total) return 'Cero 00/100';

    const totalFixed = Math.abs(total).toFixed(2);
    const partes = totalFixed.split('.');

    const parteEntera = parseInt(partes[0], 10);
    const parteDecimal = partes[1];

    const letrasEnteras = numeroALetras(parteEntera);

    return `${letrasEnteras} ${parteDecimal}/100`;
  }, [total]);

  // --- FUNCIÓN DE EXPORTACIÓN A PDF ---
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

      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      pdf.save(`recibo_JOM_Host_${selectedCollection?.receiptCode || 'cobro'}.pdf`);
    } catch (error) {
      console.error('Error generando el PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const ListRowSkeleton = () => (
    <Stack spacing={2} sx={{ mb: 5 }}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Stack
          key={`collection-skeleton-${index}`}
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          spacing={2}
          sx={{ px: 1, py: 1 }}
        >
          <Stack direction="row" spacing={1.5} sx={{ flex: 1, minWidth: 0, width: '100%' }}>
            <Skeleton variant="rounded" width={40} height={40} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="80%" height={16} />
              <Skeleton variant="text" width="50%" height={16} />
            </Box>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ pl: { xs: 6.5, sm: 0 }, width: { xs: '100%', sm: 'auto' } }}
          >
            <Stack
              alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
              sx={{ width: 80, mr: { xs: 2, sm: 4 } }}
            >
              <Skeleton variant="text" width={60} height={24} />
            </Stack>

            <Stack alignItems={{ xs: 'flex-end', sm: 'flex-start' }} sx={{ width: 140 }}>
              <Skeleton variant="text" width={80} height={20} />
              <Skeleton variant="text" width={120} height={16} />
            </Stack>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );

  // Helper para el Subtotal Real del Host (Hospedaje + Cargos Extra - Descuentos)
  /* const calculateHostSubtotal = (resume?: HostResume | null) => {
    if (!resume) return 0;
    if (resume.subtotal && resume.subtotal > 0) return resume.subtotal;

    let sub = resume.accommodation?.discountedAmount || resume.accommodation?.baseAmount || 0;
    sub += resume.additionalCharges?.cleaningFee || 0;
    sub += resume.additionalCharges?.extraGuestFee || 0;
    sub += resume.additionalCharges?.petFee || 0;
    sub += resume.additionalCharges?.otherFees || 0;
    return sub;
  }; */

  //const computedSubtotal = calculateHostSubtotal(selectedCollection?.hostResume);
  //const amountToCollect = selectedCollection?.hostResume?.amountToCollect ?? 0;

  return (
    <Box sx={{ maxWidth: 760 }}>
      {isLoading ? <ListRowSkeleton /> : null}

      {/* --- LISTADO DE COBROS --- */}
      {!isLoading &&
        sortedYears.map((year) => (
          <Box key={year}>
            <Typography sx={{ color: 'text.secondary', fontSize: 20, fontWeight: 500, mb: 2.5 }}>
              {year}
            </Typography>

            <Stack spacing={2} sx={{ mb: 5 }}>
              {groupedByYear[year].map((item) => (
                <Stack
                  key={item.id}
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
                  onClick={() => setSelectedCollection(item)}
                >
                  {/* COLUMNA 1: Avatar y Detalles */}
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="flex-start"
                    sx={{ flex: 1, minWidth: 0, width: '100%' }}
                  >
                    <Avatar
                      src={item.image}
                      alt={item.title}
                      variant="rounded"
                      sx={{ width: 40, height: 40, borderRadius: 1.25, mt: 0.5 }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: { xs: 17, md: 17 }, fontWeight: 600 }}>
                        {item.title}
                      </Typography>
                      <Typography sx={{ color: 'text.secondary', fontSize: 15, lineHeight: 1.3 }}>
                        {item.card}
                      </Typography>
                      <Typography sx={{ color: 'text.secondary', fontSize: 14, lineHeight: 1.3 }}>
                        {item.destinationAndDates}
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
                        sx={{
                          fontSize: 17,
                          fontWeight: 600,
                          lineHeight: 1.1,
                          color: 'text.primary',
                        }}
                      >
                        {formatAmount(item.amount)}
                      </Typography>
                      <Typography sx={{ fontSize: 15, lineHeight: 1.1, color: 'text.primary' }}>
                        {item.currency}
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
                        {item.payoutStatus || '--'}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 13,
                          lineHeight: 1.2,
                          color: 'text.secondary',
                          textAlign: { xs: 'right', sm: 'left' },
                        }}
                      >
                        {item.exactPayoutDate}
                      </Typography>
                      <Typography variant="body2" color="primary">
                        {item.bookingCode}
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
        open={Boolean(selectedCollection)}
        onClose={() => setSelectedCollection(null)}
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
          <Box
            sx={{
              maxWidth: 850,
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
              mb: 1,
            }}
          >
            <IconButton onClick={() => setSelectedCollection(null)} aria-label="Cerrar recibo">
              <CloseIcon />
            </IconButton>
          </Box>

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
                      {selectedCollection?.receiptCode}
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
                      {selectedCollection?.receiptDateLabel}
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
                      {selectedCollection?.paymentMethodText}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>

            {/* SECCIÓN DE DATOS */}
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
                  <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                    Nombre/Razón Social:
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#1A2138' }}>
                    {selectedCollection?.endorsementReason}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>NIT/CI:</Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#1A2138' }}>
                    {selectedCollection?.endorsementDocumentNumber}
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
                  #{selectedCollection?.bookingCode}
                </Typography>
                <Typography sx={{ fontSize: 14, mb: 0.5 }}>
                  <Typography component="span" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                    Inmueble:{' '}
                  </Typography>
                  {selectedCollection?.listingName}
                </Typography>
                <Typography sx={{ fontSize: 14 }}>
                  <Typography component="span" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                    Fechas:{' '}
                  </Typography>
                  {selectedCollection?.startDateLabel} - {selectedCollection?.endDateLabel}
                </Typography>
              </Box>
            </Box>

            {/* TABLA DE DESGLOSE */}
            <Box sx={{ width: '100%', mb: 4 }}>
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

              <Stack spacing={2.5}>
                {/* 1. Hospedaje Base */}
                {Number(selectedCollection?.hostResume?.accommodation?.baseAmount) > 0 && (
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
                        Hospedaje ({selectedCollection?.hostResume?.accommodation?.nightsCount || 1}{' '}
                        noches)
                      </Typography>
                      <Typography sx={{ color: 'text.secondary', fontSize: 13, mt: 0.5 }}>
                        Huésped: {selectedCollection?.guestName}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, textAlign: 'center' }}>
                      {selectedCollection?.hostResume?.accommodation?.nightsCount}
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, textAlign: 'right' }}>
                      {/* {formatAmount(selectedCollection!.hostResume!.accommodation!.baseAmount!)}  */}
                      {formatAmount(selectedCollection!.hostResume!.accommodation!.ratePerNight!)}
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, textAlign: 'right' }}>
                      {formatAmount(selectedCollection!.hostResume!.accommodation!.baseAmount!)}
                    </Typography>
                  </Box>
                )}

                {/* 2.1 Huésped Adicional */}
                {Number(selectedCollection?.hostResume?.additionalCharges?.extraGuestFee) > 0 && (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '6fr 2fr 2fr 2fr',
                      gap: 2,
                      alignItems: 'center',
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#1A2138' }}>
                      Huésped adicional
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, textAlign: 'center' }}>
                      1
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, textAlign: 'right' }}>
                      {formatAmount(
                        selectedCollection!.hostResume!.additionalCharges!.extraGuestFee!
                      )}
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, textAlign: 'right' }}>
                      {formatAmount(
                        selectedCollection!.hostResume!.additionalCharges!.extraGuestFee!
                      )}
                    </Typography>
                  </Box>
                )}

                {/* 2.2 Tarifa por Mascota */}
                {Number(selectedCollection?.hostResume?.additionalCharges?.petFee) > 0 && (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '6fr 2fr 2fr 2fr',
                      gap: 2,
                      alignItems: 'center',
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#1A2138' }}>
                      Tarifa por mascota
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, textAlign: 'center' }}>
                      1
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, textAlign: 'right' }}>
                      {formatAmount(selectedCollection!.hostResume!.additionalCharges!.petFee!)}
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, textAlign: 'right' }}>
                      {formatAmount(selectedCollection!.hostResume!.additionalCharges!.petFee!)}
                    </Typography>
                  </Box>
                )}

                {/* 2.3 Limpieza */}
                {Number(selectedCollection?.hostResume?.additionalCharges?.cleaningFee) > 0 && (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '6fr 2fr 2fr 2fr',
                      gap: 2,
                      alignItems: 'center',
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#1A2138' }}>
                      Gastos de limpieza
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, textAlign: 'center' }}>
                      1
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, textAlign: 'right' }}>
                      {formatAmount(
                        selectedCollection!.hostResume!.additionalCharges!.cleaningFee!
                      )}
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, textAlign: 'right' }}>
                      {formatAmount(
                        selectedCollection!.hostResume!.additionalCharges!.cleaningFee!
                      )}
                    </Typography>
                  </Box>
                )}

                {/* 2.4 Otros Cargos */}
                {Number(selectedCollection?.hostResume?.additionalCharges?.otherFees) > 0 && (
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
                      {formatAmount(selectedCollection!.hostResume!.additionalCharges!.otherFees!)}
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, textAlign: 'right' }}>
                      {formatAmount(selectedCollection!.hostResume!.additionalCharges!.otherFees!)}
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ borderColor: 'divider', my: 1 }} />

                {/* 3. Subtotal */}
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
                    {/* {selectedCollection?.hostResume?.subtotal} */}
                  </Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, textAlign: 'right' }}>
                    {formatAmount(selectedCollection?.hostResume?.subtotal || 0)}
                  </Typography>
                </Box>

                {/* 4. Comisión del Anfitrión */}
                {Number(selectedCollection?.hostResume?.hostCommission) > 0 && (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '6fr 2fr 2fr 2fr',
                      gap: 2,
                      alignItems: 'center',
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#1A2138' }}>
                      Comisión de servicio JOM
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, textAlign: 'center' }}>
                      1
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, textAlign: 'right' }}>
                      {formatAmount(-selectedCollection!.hostResume!.hostCommission!)}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 14, fontWeight: 700, textAlign: 'right', color: '#1A2138' }}
                    >
                      {formatAmount(-selectedCollection!.hostResume!.hostCommission!)}
                    </Typography>
                  </Box>
                )}

                {/* 5. Penalidad */}
                {Number(selectedCollection?.penaltyApplied) > 0 && (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '6fr 2fr 2fr 2fr',
                      gap: 2,
                      alignItems: 'center',
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#1A2138' }}>
                      Penalidad
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, textAlign: 'center' }}>
                      1
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, textAlign: 'right' }}>
                      {formatAmount(-selectedCollection!.penaltyApplied!)}
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, textAlign: 'right' }}>
                      {formatAmount(-selectedCollection!.penaltyApplied!)}
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
                    {/* {selectedCollection?.currency} {formatAmount(amountToCollect)} */}
                    {selectedCollection?.currency} {formatAmount(total)}
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
                  El presente recibo detalla la liquidación correspondiente al alojamiento prestado
                  a través de la plataforma tecnológica JOM. El monto final transferido refleja la
                  deducción de nuestra comisión por servicios de intermediación.
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
              JOM.
            </Typography>
          </Box>

          {/* BOTONES */}
          <Stack
            direction="row"
            justifyContent="center"
            spacing={3}
            sx={{ mt: 4, maxWidth: 850, width: '100%' }}
          >
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

export default CollectionsTab;
