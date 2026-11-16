import React, { useState, memo, useCallback, useRef, useImperativeHandle, forwardRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Stack,
  Avatar,
  Card,
  CardContent,
  CssBaseline,
  Divider,
  Popover,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { useNavigate } from 'react-router';
import { styled } from '@mui/system';
import { useQuery } from '@tanstack/react-query';
import { ApiService } from '@/services/ApiService';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { pdf } from '@react-pdf/renderer';
import FinancialTablePDF, { RowData } from './FinancialTablePDF';
import FilterByAdDialog from './FilterByAdDialog';
import { useTranslation } from 'react-i18next';
import { useGet2 } from '@/hooks/api';
import { DateRange } from 'react-date-range';
import { useViewReservationStore } from '@/store/message.store';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

// --- 1. Definición de Tipos y Datos de Ejemplo ---

interface ScheduledPayoutsResponse {
  data: ScheduledPayout[];
  statusCode: string;
  hasError: boolean;
  resultError: null | unknown;
}

interface ScheduledPayout {
  payoutTransactionId: number;
  bookId: number;
  listingRentId: number;
  scheduled: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: null | string;
  description: null | string;
  attempts: number;
  paymentDetails: PaymentDetails;
  book: ScheduledBook;
  history: PayoutHistoryEntry[];
}

interface PaymentDetails {
  amount: number;
  currency: string;
  processed: string | null;
  lastAttempt: string | null;
  account: null | string;
}

interface ScheduledBook {
  bookId: number;
  status: string;
  start: string;
  end: string;
  paymentDate: string | null;
  paymentDate_STR: string | null;
  propertyName: string;
}

interface PayoutHistoryEntry {
  payoutTransactionHistoryId: number;
  payoutTransactionId: number;
  transactionStatus: string;
  transactionDate: string;
  transactionMessage: string;
  metadata: null | unknown;
}

// Interfaces para el servicio PayoutDetails
interface PayoutDetailsResponse {
  data: PayoutDetailsData;
  statusCode: string;
  hasError: boolean;
  resultError: null | unknown;
}

interface PayoutDetailsData {
  payoutTransactionId: number;
  amount: number;
  currencyCode: string;
  originalAmount: number;
  timeDiff: number;
  PayoutDate: string | null;
  ScheduledPayoutDate: string;
  poCode: string | null;
  priceCalculation: PriceCalculation;
  book: BookDetails;
  payoutStatus: string;
  transactionStatusId: number;
  payoutAccount: PayoutAccount;
}

interface PriceCalculation {
  additionalFees: number;
  amount: number;
  discounts: number;
  platformFee: number;
  BreakdownInfo: BreakdownInfo[];
  CleanFee: CleanFee | null;
  currencyCode: string;
}

interface BreakdownInfo {
  type: string;
  description: string;
  amount: number;
  percentage: number | null;
  date: string | null;
}

interface CleanFee {
  type: string;
  description: string;
  amount: number;
  percentage: number;
  date: string | null;
}

interface BookDetails {
  bookId: number;
  timeDiff: number;
  bookingCode: string | null;
  checkin: string;
  checkout: string;
  AmountPerNight: number | null;
  startDate: string;
  endDate: string;
  nigths: number;
  status: string | null;
  bookStatusId: number;
  Guest: GuestInfo;
  listingRent: ListingRentInfo;
}

interface GuestInfo {
  name: string;
  lastname: string;
  photoLink: string;
}

interface OwnerInfo {
  name: string;
  lastname: string;
  photoLink: string;
}

interface ListingRentInfo {
  name: string;
  Owner: OwnerInfo;
}

interface PayoutAccount {
  numberAccount: string;
  formOfPayment: string;
  provider: string;
}

export interface BookStatus {
  bookStatusId: number;
  name: string;
  description: string;
  code: string;
}

export interface Book {
  bookId: number;
  startDate: string;
  endDate: string;
  bookStatusId: number;
  listingRentId: number;
  amountTotal: number;
  listingRent: {
    name: string;
    property: {
      address: {
        city: {
          city: string;
          country: string;
        };
      };
    };
  };
  bookStatus: BookStatus;
  photos: { photoLink: string }[];
  owner?: {
    name: string;
    lastName: string;
  };
}

async function fetchPendingPayouts(params?: {
  start?: string;
  end?: string;
  books?: string;
  listingRentId?: string;
}) {
  try {
    const queryParams = new URLSearchParams();

    if (params?.start) queryParams.append('start', params.start);
    if (params?.end) queryParams.append('end', params.end);
    if (params?.books) queryParams.append('books', params.books);

    // Solo añadimos el parámetro si realmente existe
    if (params?.listingRentId) {
      queryParams.append('listingRentId', params.listingRentId);
    }

    const url = `/PendingPayouts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await ApiService.get<ScheduledPayoutsResponse>(url);
  } catch (error) {
    console.error('Error fetching pending payouts:', error);
    throw error;
  }
}

const filterChipStyle = {
  borderRadius: '8px',
  borderColor: '#e2e8f0',
  color: '#374151',
  textTransform: 'none',
  backgroundColor: '#fff',
  fontWeight: 400,
  fontSize: '0.875rem',
  '&:hover': {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
  },
};

// ==================================================================
// --- 3. VISTA DEL PANEL DERECHO 1: "Agrega un método de cobro" ---
// ==================================================================

interface AddMethodViewProps {
  onBack: () => void;
}

const AddMethodView: React.FC<AddMethodViewProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* --- Encabezado --- */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <IconButton onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>
      </Box>

      {/* --- Contenido --- */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3, pt: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: '600', mb: 2 }}>
          {t('FinancialTable.addMethod.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {t('FinancialTable.addMethod.description')}
        </Typography>
        <Button
          variant="primary"
          //   sx={footerButtonStyle}
          onClick={() => navigate('/host/info-profile/payments')}
        >
          {t('FinancialTable.addMethod.button')}
        </Button>
      </Box>
    </Box>
  );
};

// ==================================================================
// --- 4. VISTA DEL PANEL DERECHO 2: "Detalles del Pago" (Melissa) ---
// ==================================================================

interface PaymentDetailsViewProps {
  onClose: () => void;
  onNavigateToAddMethod: () => void;
  data: RowData;
  apiData?: ScheduledPayout[];
  payoutDetails: PayoutDetailsData | null;
  isLoadingDetails: boolean;
}
const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  mt: 8,
}));

// Estilos para las tarjetas de información
const InfoCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: 'none', // Sin elevación
  border: '1px solid #e0e0e0', // Borde visible
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(7),
  height: theme.spacing(7),
  marginRight: theme.spacing(2),
}));

const PaymentDetailsView: React.FC<PaymentDetailsViewProps> = ({
  onClose,
  onNavigateToAddMethod,
  // data,
  // apiData = [],
  payoutDetails,
  isLoadingDetails,
}) => {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language.startsWith('es') ? es : enUS;

  // Función para formatear fechas
  const formatDateShort = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy', { locale: currentLocale });
    } catch {
      return dateString;
    }
  };

  // Mostrar loading mientras carga
  if (isLoadingDetails || !payoutDetails) {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'flex-end',
            flexShrink: 0,
          }}
        >
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Typography>{t('FinancialTable.paymentDetails.loading')}</Typography>
        </Box>
      </Box>
    );
  }

  // Usar datos del servicio PayoutDetails
  const ownerName = `${payoutDetails.book.listingRent.Owner.name} ${payoutDetails.book.listingRent.Owner.lastname}`;
  const guestName = `${payoutDetails.book.Guest.name} ${payoutDetails.book.Guest.lastname}`;
  const propertyName = payoutDetails.book.listingRent.name;
  const totalAmount = `${payoutDetails.amount.toLocaleString('es-BO', { minimumFractionDigits: 2 })} ${payoutDetails.currencyCode}`;
  const scheduledDate = formatDateShort(payoutDetails.ScheduledPayoutDate);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* --- Encabezado de Detalles (Solo la X) --- */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'flex-end',
          flexShrink: 0,
        }}
      >
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <StyledContainer>
        {/* Sección Superior: Monto y Fecha - DINÁMICO */}
        <Box sx={{ textAlign: 'center', marginBottom: 3 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            {totalAmount}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('FinancialTable.paymentDetails.sentInfo')} {scheduledDate}.{' '}
            <Typography
              component="span"
              onClick={(e) => {
                e.preventDefault();
                onNavigateToAddMethod();
              }}
              sx={{
                textDecoration: 'underline',
                cursor: 'pointer',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              {t('FinancialTable.paymentDetails.detailsLink')}
            </Typography>
          </Typography>
        </Box>

        {/* Tarjeta de Cuenta Bancaria */}
        <InfoCard sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {t('FinancialTable.paymentDetails.bankAccountTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {ownerName}, {payoutDetails.payoutAccount.numberAccount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ({payoutDetails.currencyCode})
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {payoutDetails.payoutAccount.formOfPayment} - {payoutDetails.payoutAccount.provider}
            </Typography>
            <Divider sx={{ my: 1.5 }} />
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {t('FinancialTable.paymentDetails.paymentIdTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight="medium">
              G-WZJAPPLTE68E-{payoutDetails.payoutTransactionId}
            </Typography>
          </CardContent>
        </InfoCard>

        {/* Tarjeta de Reserva del Usuario - DINÁMICO */}
        <InfoCard sx={{ borderRadius: 2 }}>
          <CardContent>
            <Stack direction="column" alignItems="flex-start" sx={{ mb: 2 }}>
              <Box display={'flex'} justifyContent={'space-between'} width={'100%'} mb={2}>
                <UserAvatar
                  alt={guestName}
                  src={payoutDetails.book.Guest.photoLink || 'https://via.placeholder.com/150'}
                >
                  {!payoutDetails.book.Guest.photoLink && payoutDetails.book.Guest.name.charAt(0)}
                </UserAvatar>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ alignSelf: 'flex-start' }}
                >
                  REF-{payoutDetails.book.bookId}
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {t('FinancialTable.paymentDetails.userLabel')}
                  {payoutDetails.book.bookId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('FinancialTable.paymentDetails.accommodationLabel')}
                  {formatDateShort(payoutDetails.book.checkin)} -{' '}
                  {formatDateShort(payoutDetails.book.checkout)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {propertyName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('FinancialTable.paymentDetails.guestPrefix')} {guestName} -{' '}
                  {payoutDetails.book.nigths} {t('FinancialTable.paymentDetails.nights')}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Desglose de precios */}
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              {t('FinancialTable.paymentDetails.priceBreakdown')}
            </Typography>
            {payoutDetails.priceCalculation.BreakdownInfo.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                  {item.date && ` - ${formatDateShort(item.date)}`}
                </Typography>
                <Typography
                  variant="body2"
                  color={item.amount < 0 ? 'success.main' : 'text.primary'}
                >
                  {item.amount.toLocaleString('es-BO', { minimumFractionDigits: 2 })}{' '}
                  {payoutDetails.currencyCode}
                </Typography>
              </Box>
            ))}

            {/* Clean Fee si existe */}
            {payoutDetails.priceCalculation.CleanFee &&
              payoutDetails.priceCalculation.CleanFee.amount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {payoutDetails.priceCalculation.CleanFee.description}
                  </Typography>
                  <Typography variant="body2">
                    {payoutDetails.priceCalculation.CleanFee.amount.toLocaleString('es-BO', {
                      minimumFractionDigits: 2,
                    })}{' '}
                    {payoutDetails.currencyCode}
                  </Typography>
                </Box>
              )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" sx={{ mb: 1 }}>
              {t('FinancialTable.paymentDetails.statusLabel')} {payoutDetails.payoutStatus}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {t('FinancialTable.paymentDetails.methodLabel')}
              {payoutDetails.payoutAccount.formOfPayment}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body1" color="text.secondary">
                {t('FinancialTable.paymentDetails.totalLabel')}
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {totalAmount}
              </Typography>
            </Stack>
          </CardContent>
        </InfoCard>
      </StyledContainer>
    </Box>
  );
};

// =============================================
// --- 5a. COMPONENTE TABLA (memoizado) ---
// =============================================
interface PayoutsTableHandle {
  exportPDF: () => void;
}

interface PayoutsTableContentProps {
  dateRange: { start: string; end: string };
  selectedBooks: string | null;
  searchCode: string;
  hostUserId?: number;
  selectedRow: RowData | null;
  onRowClick: (row: RowData) => void;
  onTotalChange: (total: number) => void;
  payoutDetails?: any;
}

const PayoutsTableContent = memo(
  forwardRef<PayoutsTableHandle, PayoutsTableContentProps>(function PayoutsTableContent(
    { dateRange, selectedBooks, searchCode, hostUserId, selectedRow, onRowClick, onTotalChange },
    ref
  ) {
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const currentLocale = i18n.language.startsWith('es') ? es : enUS;

    const formatDate = (dateString: string): string => {
      try {
        const date = new Date(dateString);
        return format(date, 'dd/MM/yyyy', { locale: es });
      } catch {
        return dateString;
      }
    };
    const setViewReservation = useViewReservationStore((state: any) => state.setViewReservation);

    const handleRefClick = async (e: React.MouseEvent, bookId: number | string) => {
      e.stopPropagation(); // ← evita que se dispare onRowClick

      try {
        const response = await ApiService.get<any>('/Book/ReservationsListUser/ALL');
        if (response && !response.hasError && response.statusCode === '200') {
          const reservations: any[] = Array.isArray(response.data) ? response.data : [];
          const found = reservations.find((r) => String(r.bookId) === String(bookId));
          if (found) {
            setViewReservation(found);
          }
        }
      } catch {
        // silently ignore
      }
    };

    const { data: listingRentPublished } = useGet2<any>(
      'listingRentPublished',
      '/Host/ListingRent',
      {
        status: 'PUBLISH,UNPUBLISH',
      }
    );

    const {
      data: dataPendingPayouts,
      isLoading,
      isError,
      error,
    } = useQuery<ScheduledPayoutsResponse>({
      queryKey: ['pendingPayouts', dateRange.start, dateRange.end, selectedBooks, hostUserId],
      queryFn: () =>
        fetchPendingPayouts({
          start: dateRange.start,
          end: dateRange.end,
          listingRentId: selectedBooks ? selectedBooks : undefined,
        }),
      enabled: !!listingRentPublished,
    });

    const formatDateDisplay = (dateString: string): string => {
      try {
        return format(new Date(dateString), 'd MMM, yyyy', { locale: currentLocale }).replace(
          /\./g,
          ''
        );
      } catch {
        return dateString;
      }
    };

    const getStatusInfo = (status: string) => {
      switch (status) {
        case 'SCHEDULED':
          return {
            estado: status,
            color: '#ffc107',
            detalle: t('FinancialTable.statusDetail.scheduled'),
          };
        case 'AUTHORIZED':
          return {
            estado: status,
            color: '#4caf50',
            detalle: t('FinancialTable.statusDetail.authorized'),
          };
        case 'PENDING':
          return {
            estado: status,
            color: '#ff9800',
            detalle: t('FinancialTable.statusDetail.pending'),
          };
        default:
          return {
            estado: status,
            color: '#ffc107',
            detalle: t('FinancialTable.statusDetail.default'),
          };
      }
    };

    const convertPayoutToRowData = (payout: ScheduledPayout): RowData => {
      const statusInfo = getStatusInfo(payout.status);
      const currencySymbol =
        payout.currency === 'Bolivianos'
          ? 'BOB'
          : payout.currency === 'United States dollar'
            ? 'USD'
            : 'BOB';
      const grossAmount = payout.paymentDetails?.amount || payout.amount;
      const netAmount = payout.amount;
      const adjustment = netAmount - grossAmount;
      const formatMoney = (amount: number) =>
        `${currencySymbol} ${Math.abs(amount).toLocaleString('es-BO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
      return {
        id: payout.payoutTransactionId.toString(),
        estado: statusInfo.estado,
        detalleEstado: statusInfo.detalle,
        fecha: formatDateDisplay(payout.scheduled),
        propiedad: payout.book.propertyName,
        detallePropiedad: '',
        monto: formatMoney(netAmount),
        metodo: payout.paymentMethod || t('FinancialTable.paymentMethod'),
        codigo: `${String(payout.book.bookId).padStart(4, '0')}`,
        inmueble: payout.book.propertyName,
        montoBruto: formatMoney(grossAmount),
        ajustes: adjustment,
        ajustesStr: adjustment < 0 ? `-${formatMoney(Math.abs(adjustment))}` : '—',
        netoDepositado: formatMoney(netAmount),
        cuentaDestino:
          payout.paymentMethod ||
          payout.paymentDetails?.account ||
          t('FinancialTable.paymentMethod'),
      };
    };

    const payouts = dataPendingPayouts?.data || [];
    const tableData = payouts.map(convertPayoutToRowData);
    const filteredTableData = tableData.filter(
      (row) => !searchCode || row.codigo?.toLowerCase().includes(searchCode.toLowerCase())
    );
    const totalAmount = payouts.reduce((sum, p) => sum + p.amount, 0);

    React.useEffect(() => {
      onTotalChange(totalAmount);
    }, [totalAmount, onTotalChange]);

    const handleExportPDF = async () => {
      try {
        const doc = <FinancialTablePDF tableData={tableData} />;
        const asPdf = pdf(doc);
        const blob = await asPdf.toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reporte-financiero-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error generando PDF:', error);
        alert(t('FinancialTable.table.pdfError'));
      }
    };

    useImperativeHandle(ref, () => ({ exportPDF: handleExportPDF }), [tableData]);

    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
          <Typography>{t('FinancialTable.table.loading')}</Typography>
        </Box>
      );
    }

    if (isError) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
          <Typography color="error">
            {t('FinancialTable.table.error')} {error?.message || 'Error desconocido'}
          </Typography>
        </Box>
      );
    }

    return (
      <>
        {/* Contenido tabla */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'hidden',
            pt: isMobile ? 0 : 1,
            backgroundColor: '#fcfcfc',
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {isMobile ? (
            <Box sx={{ flexGrow: 1, overflow: 'auto', px: 2, pb: 2, pt: 2 }}>
              {tableData.length === 0 ? (
                <Typography sx={{ mt: 3, textAlign: 'center' }}>
                  {t('FinancialTable.table.noData')}
                </Typography>
              ) : (
                tableData.map((row: any) => {
                  const statusInfo = getStatusInfo(row.estado);
                  return (
                    <Paper
                      key={row.id}
                      variant="outlined"
                      onClick={() => onRowClick(row)}
                      sx={{
                        p: 2,
                        mb: 1.5,
                        borderRadius: 2,
                        cursor: 'pointer',
                        backgroundColor: selectedRow?.id === row.id ? '#f0f8ff' : '#fff',
                        borderColor: selectedRow?.id === row.id ? '#90caf9' : '#e0e0e0',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 0.5,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <CircleIcon sx={{ fontSize: 10, color: statusInfo.color }} />
                          <Typography variant="body2" color="text.secondary">
                            {row.estado}
                          </Typography>
                          <TableCell>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              onClick={(e) => handleRefClick(e, row.codigo)}
                              sx={{
                                color: theme.palette.customColors.primary[1],
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                '&:hover': { color: 'primary.main' },
                              }}
                            >
                              Cod: {row.codigo}
                            </Typography>
                          </TableCell>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {row.monto}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {row.detalleEstado}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">
                          {row.fecha}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {row.metodo}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {row.propiedad}
                      </Typography>
                    </Paper>
                  );
                })
              )}
            </Box>
          ) : (
            <TableContainer
              tabIndex={-1}
              sx={{ flexGrow: 1, overflow: 'auto', outline: 'none', caretColor: 'transparent' }}
            >
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      '& .MuiTableCell-root': {
                        backgroundColor: '#f9fbfc',
                        color: '#64748b',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        '&:last-child': { borderRight: 'none' },
                        py: 1.5,
                      },
                    }}
                  >
                    <TableCell>{t('FinancialTable.table.columns.date')}</TableCell>
                    <TableCell>{t('FinancialTable.table.columns.code')}</TableCell>
                    <TableCell>{t('FinancialTable.table.columns.property')}</TableCell>
                    <TableCell align="right">
                      {t('FinancialTable.table.columns.grossAmount')}
                    </TableCell>
                    <TableCell align="center">
                      {t('FinancialTable.table.columns.adjustments')}
                    </TableCell>
                    <TableCell align="right">
                      {t('FinancialTable.table.columns.netDeposited')}
                    </TableCell>
                    <TableCell>{t('FinancialTable.table.columns.destinationAccount')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTableData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                        {t('FinancialTable.table.noData')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTableData.map((row: any) => (
                      <TableRow
                        key={row.id}
                        onClick={() => onRowClick(row)}
                        hover
                        sx={{
                          '&:last-child td, &:last-child th': { borderBottom: 0 },
                          '& .MuiTableCell-root': {
                            borderBottom: '1px solid #e5e7eb',
                            '&:last-child': { borderRight: 'none' },
                          },
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(row.fecha)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            onClick={(e) => handleRefClick(e, row.codigo)}
                            sx={{
                              color: theme.palette.customColors.primary[1],
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              '&:hover': { color: 'primary.main' },
                            }}
                          >
                            {row.codigo}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {row.inmueble}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="text.secondary">
                            {row.montoBruto}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {row.ajustes < 0 ? (
                            <Typography variant="body2" sx={{ color: '#ef4444' }}>
                              {row.ajustesStr}
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.disabled">
                              —
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="text.secondary">
                            {row.netoDepositado}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <CreditCardOutlinedIcon sx={{ fontSize: '1rem', color: '#94a3b8' }} />
                            <Typography variant="body2" color="text.secondary">
                              {row.cuentaDestino}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </>
    );
  })
);

// =============================================
// --- 5. COMPONENTE PRINCIPAL DE LA PÁGINA ---
// =============================================

type RightPanelView = 'details' | 'addMethod';

interface FinancialTableProps {
  onBack?: () => void;
  hostUserId?: number;
}

const FinancialTable: React.FC<FinancialTableProps> = ({ onBack, hostUserId }) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const currentLocale = i18n.language.startsWith('es') ? es : enUS;

  const fmt = (date: Date): string => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  };

  const getDefaultDates = () => {
    const now = new Date();

    // Start = Fecha actual (hoy)
    const startDate = new Date(now);

    // End = Un mes después de hoy
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + 1);

    return {
      start: fmt(startDate),
      end: fmt(endDate),
    };
  };

  // Estados para filtros
  const [dateRange, setDateRange] = useState(() => getDefaultDates());
  const [selectedBooks, setSelectedBooks] = useState<string | null>(null);

  // Estado para el DateRange Picker
  const [anchorElDate, setAnchorElDate] = useState<HTMLButtonElement | null>(null);
  const [selectionRange, setSelectionRange] = useState(() => {
    const now = new Date();
    const prevMonth = new Date(now);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return { startDate: prevMonth, endDate: nextMonth, key: 'selection' };
  });

  const { data: listingRentPublished } = useGet2<any>('listingRentPublished', '/Host/ListingRent', {
    status: 'PUBLISH,UNPUBLISH',
  });

  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [rightPanelView, setRightPanelView] = useState<RightPanelView>('details');
  const [payoutDetails, setPayoutDetails] = useState<PayoutDetailsData | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [openAdDialog, setOpenAdDialog] = useState(false);
  const [searchCode, setSearchCode] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const tableRef = useRef<PayoutsTableHandle>(null);
  const handleTotalChange = useCallback((total: number) => setTotalAmount(total), []);

  const formatFilterDate = (dateStr: string): string => {
    if (!dateStr) return '';

    try {
      const date = new Date(dateStr + 'T00:00:00');
      if (isNaN(date.getTime())) {
        return dateStr;
      }
      return format(date, 'dd MMM', { locale: currentLocale }).replace(/\./g, '');
    } catch (error) {
      console.error('Error al formatear la fecha:', error);
      return dateStr;
    }
  };

  // useCallback evita que el hijo (memo) re-renderice por cambio de referencia de función
  const handleRowClick = useCallback(async (row: RowData) => {
    setSelectedRow(row);
    setRightPanelView('details');
    try {
      setIsLoadingDetails(true);
      const response = await ApiService.get<PayoutDetailsResponse>(`/PayoutDetails/${row.id}`);
      setPayoutDetails(response.data);
    } catch (error) {
      console.error('Error loading payout details:', error);
    } finally {
      setIsLoadingDetails(false);
    }
  }, []);

  const handleCloseDetails = () => {
    setSelectedRow(null);
    setPayoutDetails(null);
  };

  // --- Navegación del panel derecho ---
  const navigateToDetails = () => setRightPanelView('details');
  const navigateToAddMethod = () => setRightPanelView('addMethod');
  const navigation = useNavigate();

  // Funciones para manejar el dialog de filtro por anuncio
  const handleOpenAdDialog = () => {
    setOpenAdDialog(true);
  };

  const handleCloseAdDialog = () => {
    setOpenAdDialog(false);
  };

  const handleApplyAdFilter = (selectedIds: string[]) => {
    setSelectedBooks(selectedIds.length > 0 ? selectedIds.join(',') : '');
  };

  // Funciones para manejar el DateRange Popover
  const handleOpenDatePicker = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSelectionRange({
      startDate: new Date(dateRange.start + 'T00:00:00'),
      endDate: new Date(dateRange.end + 'T00:00:00'),
      key: 'selection',
    });
    setAnchorElDate(event.currentTarget);
  };

  const handleCloseDatePicker = () => {
    setAnchorElDate(null);
  };

  const handleDateSelect = (ranges: any) => {
    setSelectionRange(ranges.selection);
  };

  const formatDateToYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleApplyDateRange = () => {
    const startDate = formatDateToYYYYMMDD(selectionRange.startDate);
    const endDate = formatDateToYYYYMMDD(selectionRange.endDate);
    setDateRange({ start: startDate, end: endDate });
    handleCloseDatePicker();
  };

  const openDatePicker = Boolean(anchorElDate);

  return (
    <>
      <CssBaseline />
      <Grid container sx={{ height: '100vh', overflow: 'hidden' }}>
        {/* Columna izquierda (Tabla)*/}
        <Grid
          size={{ xs: selectedRow && !isMobile ? 8 : 12 }}
          sx={{
            transition: 'all 300ms ease-in-out',
            height: '100vh',
            display: selectedRow && isMobile ? 'none' : 'flex',
            flexDirection: 'column',
            backgroundColor: '#fff',
          }}
        >
          {/* --- Encabezado de página --- */}
          {/* {!isMobile && (
            <Box sx={{ px: 3, pt: 3, pb: 2, flexShrink: 0 }}>
              <Button
                startIcon={<ArrowBackIcon sx={{ fontSize: '0.9rem' }} />}
                onClick={() => (onBack ? onBack() : navigation(-1))}
                sx={{
                  color: 'primary.main',
                  textTransform: 'none',
                  p: 0,
                  mb: 1.5,
                  fontWeight: 400,
                  fontSize: '0.875rem',
                }}
              >
                {t('FinancialTable.header.backToDashboard')}
              </Button>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
                {t('FinancialTable.header.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('FinancialTable.header.subtitle')}
              </Typography>
            </Box>
          )} */}
          <Box sx={{ px: 3, pt: 3, pb: 2, flexShrink: 0 }}>
            <Button
              startIcon={<ArrowBackIcon sx={{ fontSize: '0.9rem' }} />}
              onClick={() => (onBack ? onBack() : navigation(-1))}
              sx={{
                color: 'primary.main',
                textTransform: 'none',
                p: 0,
                mb: 1.5,
                fontWeight: 400,
                fontSize: '0.875rem',
              }}
            >
              {t('FinancialTable.header.backToDashboard')}
            </Button>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
              {t('FinancialTable.header.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('FinancialTable.header.subtitle')}
            </Typography>
          </Box>

          {/* --- Barra de Filtros --- */}
          <Box
            sx={{
              px: { xs: 2, sm: 3 },
              py: 1.5,
              display: 'flex',
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
              alignItems: 'center',
              gap: 1.5,
              borderBottom: '1px solid #eee',
              flexShrink: 0,
              overflow: 'auto',
            }}
          >
            {/* Date range picker */}
            <Button
              variant="outlined"
              startIcon={<CalendarTodayOutlinedIcon sx={{ fontSize: '0.9rem' }} />}
              size="small"
              sx={{
                ...filterChipStyle,
                px: 2,
                height: 40,
                whiteSpace: 'nowrap',
                width: { xs: '100%', sm: 'auto' },
              }}
              onClick={handleOpenDatePicker}
            >
              {formatFilterDate(dateRange.start)} – {formatFilterDate(dateRange.end)}
            </Button>

            {/* Properties filter */}
            <Button
              variant="outlined"
              endIcon={<KeyboardArrowDownIcon />}
              size="small"
              sx={{
                ...filterChipStyle,
                px: 2,
                height: 40,
                whiteSpace: 'nowrap',
                width: { xs: '100%', sm: 'auto' },
              }}
              onClick={handleOpenAdDialog}
            >
              {t('FinancialTable.filters.allProperties')}
            </Button>

            {/* Search */}
            <TextField
              variant="outlined"
              size="small"
              placeholder={t('FinancialTable.filters.searchPlaceholder')}
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              sx={{
                width: { xs: '100%', sm: 260 },
                flexShrink: 0,
                mt: 2,
                '& .MuiOutlinedInput-root': {
                  height: 40,
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #e2e8f0' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: '1.1rem', color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* Spacer — pushes Export to the right */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }} />

            {/* Export button */}
            <Button
              variant="outlined"
              startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: '1rem' }} />}
              size="small"
              sx={{
                ...filterChipStyle,
                px: 2,
                height: 40,
                whiteSpace: 'nowrap',
                width: { xs: '100%', sm: 'auto' },
              }}
              onClick={() => tableRef.current?.exportPDF()}
              disabled={totalAmount === 0}
            >
              {t('FinancialTable.filters.exportReport')}
            </Button>
          </Box>

          {/* Tabla memoizada — solo re-renderiza cuando cambian sus props */}
          <PayoutsTableContent
            ref={tableRef}
            dateRange={dateRange}
            selectedBooks={selectedBooks}
            searchCode={searchCode}
            hostUserId={hostUserId}
            selectedRow={selectedRow}
            onRowClick={handleRowClick}
            onTotalChange={handleTotalChange}
            payoutDetails={payoutDetails}
          />

          {/* --- Footer de la Tabla --- */}
          <Box
            sx={{
              px: 3,
              py: 1.5,
              borderTop: '1px solid #eee',
              flexShrink: 0,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {selectedRow
                ? selectedRow.monto
                : `BOB ${totalAmount.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`}
            </Typography>
          </Box>
        </Grid>
        {/* =======================
            COLUMNA DERECHA (DINÁMICA)
        ======================== */}
        {selectedRow && (
          <Grid
            size={{ xs: isMobile ? 12 : 4 }}
            sx={{
              height: '100vh',
              borderLeft: isMobile ? 'none' : '1px solid #e0e0e0',
              backgroundColor: '#fff',
            }}
          >
            {/* --- Renderizado Condicional de la Vista --- */}
            {rightPanelView === 'details' ? (
              <PaymentDetailsView
                onClose={handleCloseDetails}
                onNavigateToAddMethod={navigateToAddMethod}
                data={selectedRow}
                apiData={undefined}
                payoutDetails={payoutDetails}
                isLoadingDetails={isLoadingDetails}
              />
            ) : (
              <AddMethodView onBack={navigateToDetails} />
            )}
          </Grid>
        )}
      </Grid>

      {/* FilterByAdDialog */}
      <FilterByAdDialog
        open={openAdDialog}
        onClose={handleCloseAdDialog}
        listings={listingRentPublished?.data || []}
        onApply={handleApplyAdFilter}
      />

      {/* DateRange Popover */}
      <Popover
        open={openDatePicker}
        anchorEl={anchorElDate}
        onClose={handleCloseDatePicker}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              boxShadow: 3,
              mt: 1,
            },
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <DateRange
            ranges={[selectionRange]}
            onChange={handleDateSelect}
            months={isMobile ? 1 : 2}
            direction={isMobile ? 'vertical' : 'horizontal'}
            locale={currentLocale}
            rangeColors={[theme.palette.customColors?.primary?.[1] || '#3f51b5']}
            showPreview={false}
            showDateDisplay={false}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              mt: 2,
            }}
          >
            <Typography
              onClick={handleCloseDatePicker}
              sx={{
                fontSize: '14px',
                fontWeight: 600,
                ml: 2,
                color: '#222',
                textDecoration: 'underline',
                cursor: 'pointer',
                '&:hover': {
                  color: '#000',
                },
              }}
            >
              {t('searchMenu.clearDate')}
            </Typography>
            <Button variant="primary" sx={{ mr: 2 }} onClick={handleApplyDateRange}>
              {t('FinancialTable.filters.apply')}
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default FinancialTable;
