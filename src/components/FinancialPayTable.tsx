import React, { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import CircleIcon from '@mui/icons-material/Circle';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import Grid from '@mui/material/Grid2';
import { DateRange } from 'react-date-range';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { styled } from '@mui/system';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { pdf } from '@react-pdf/renderer';
import FinancialPayTablePDF, { PaymentRowData } from './FinancialPayTablePDF';
import FilterByAdDialog from '../modules/_admin/components/dashBoard/FilterByAdDialog';
import { useTranslation } from 'react-i18next';
import { ApiService } from '@/services/ApiService';
import { useQuery } from '@tanstack/react-query';
import { useGet2 } from '@/hooks/api';
import theme from '@/themes/theme';
import { useNavigate } from 'react-router';
import { useViewReservationStore } from '@/store/message.store';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

interface PayoutsGroupedResponse {
  data: PayoutGroup[];
  statusCode: string;
  hasError: boolean;
  resultError: null | unknown;
}

interface PayoutGroup {
  status: string;
  datePayment: string;
  totalAmount: string;
  currency: string;
  methodOfPayment: string;
  transactions: number;
  paymentsList: PayoutTransaction[];
}

interface PayoutTransaction {
  payoutTransactionId: number;
  bookId: number;
  listingRentId: number;
  scheduled: string;
  processed: string;
  processed_STR: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  paymentMethodDescription: string;
  paymentDetails: PaymentDetails;
  book: BookDetail;
}

interface PaymentDetails {
  amount: number;
  currency: string;
  processed: string;
  account: null | string | Record<string, unknown>;
}

interface BookDetail {
  bookId: number;
  status: string;
  start: string;
  end: string;
  paymentDate: string | null;
  propertyName: string;
  host: Person;
  guest: Person;
}

interface Person {
  userId: number;
  name: string;
  lastName: string;
}

type RowData = PaymentRowData & {
  bookId?: string;
  cuentaTitular?: string;
  cuentaNumero?: string;
  cuentaMoneda?: string;
  guestName?: string;
  hostName?: string;
};

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

// =============================================================
//         StepItem: Componente de paso reutilizable
// =============================================================

interface StepItemProps {
  index: number;
  label: string;
  secondary?: string;
  done?: boolean;
  active?: boolean;
  isLast?: boolean;
}

const StepItem: React.FC<StepItemProps> = ({ index, label, secondary, done, active, isLast }) => (
  <Box display="flex" alignItems="flex-start" gap={2} position="relative">
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: done || active ? theme.palette.customColors.primary[7] : 'transparent',
          border: active
            ? `2px solid ${theme.palette.customColors.primary[1]}`
            : done
              ? 'none'
              : '2px solid #d0d0d0',
          color: active
            ? theme.palette.customColors.primary[1]
            : done
              ? theme.palette.customColors.primary[1]
              : '#757575',
          fontWeight: 700,
          fontSize: 10,
          lineHeight: 1,
          zIndex: 1,
        }}
      >
        {done ? <CheckIcon sx={{ fontSize: 14 }} /> : index}
      </Box>
      {!isLast && (
        <Box
          sx={{
            width: 2,
            height: 30,
            bgcolor: '#e0e0e0',
            mt: 0,
            mb: 2,
          }}
        />
      )}
    </Box>
    <Box flex={1} pt={0.5}>
      <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1f1f1f' }}>{label}</Typography>
      {secondary && (
        <Typography
          sx={{
            fontSize: 12,
            color: active ? theme.palette.customColors.primary[1] : 'text.secondary',
            fontWeight: active ? 600 : 400,
          }}
        >
          {secondary}
        </Typography>
      )}
    </Box>
  </Box>
);

// ==================================================================
//    3. NUEVA VISTA DEL PANEL DERECHO: "Tu dinero está en camino"
// ==================================================================

interface MoneyInTransitViewProps {
  onBack: () => void;
  onClose: () => void;
  data: RowData;
}

const MoneyInTransitView: React.FC<MoneyInTransitViewProps> = ({ onBack, onClose, data }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* --- Encabezado --- */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <IconButton onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* --- Contenido - DINÁMICO --- */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3, pt: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: '600', mb: 4 }}>
          {t('financialPayTable.moneyInTransit.title')}
        </Typography>

        <StepItem
          index={1}
          label={t('financialPayTable.moneyInTransit.sent')}
          secondary={data.fecha}
          done
          isLast={false}
        />
        <StepItem
          index={2}
          label={t('financialPayTable.moneyInTransit.estimatedArrival')}
          secondary={data.fecha}
          active
          isLast
        />

        <Typography variant="body1" sx={{ mt: 3, mb: 3 }}>
          {t('financialPayTable.moneyInTransit.sendingInfo', {
            amount: data.monto,
            property: data.propiedad,
          })}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, mb: 3 }}>
          {t('financialPayTable.moneyInTransit.disclaimer', {
            status: data.estado,
            detail: data.detalleEstado,
            method: data.metodo,
          })}
        </Typography>

        <Button variant="primary" onClick={() => navigate('/host/info-profile/payments')}>
          {t('financialPayTable.moneyInTransit.moreInfo')}
        </Button>
      </Box>
    </Box>
  );
};

// =====================================================
//       VISTA DEL PANEL DERECHO 2: "Pagado"
// ======================================================

const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  mt: 8,
}));

// Estilos para las tarjetas de información
const InfoCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: 'none',
  border: '1px solid #e0e0e0',
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(7),
  height: theme.spacing(7),
  marginRight: theme.spacing(2),
}));

interface PaidDetailsViewProps {
  onClose: () => void;
  onNavigateToInTransit: () => void;
  data: RowData;
}

const PaidDetailsView: React.FC<PaidDetailsViewProps> = ({
  onClose,
  onNavigateToInTransit,
  data,
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* --- Encabezado con la 'X' --- */}
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
            {data.monto}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('financialPayTable.paidDetails.sentInfo', { date: data.fecha })}{' '}
            <a
              href="#"
              style={{ color: 'inherit', cursor: 'pointer' }}
              onClick={(e) => {
                e.preventDefault();
                onNavigateToInTransit();
              }}
            >
              <u>{t('financialPayTable.paidDetails.detailsLink')}</u>
            </a>
          </Typography>
        </Box>

        {/* Tarjeta de Cuenta Bancaria */}
        <InfoCard sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {t('financialPayTable.paidDetails.bankAccountTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data.cuentaTitular
                ? `${data.cuentaTitular}${data.cuentaNumero ? `, ${data.cuentaNumero}` : ''}`
                : '—'}
            </Typography>
            {data.cuentaMoneda && (
              <Typography variant="body2" color="text.secondary">
                ({data.cuentaMoneda})
              </Typography>
            )}
          </CardContent>
        </InfoCard>

        {/* Tarjeta de Reserva del Usuario - DINÁMICO */}
        <InfoCard sx={{ borderRadius: 2 }}>
          <CardContent>
            <Stack direction="column" alignItems="flex-start" sx={{ mb: 2 }}>
              <Box display={'flex'} justifyContent={'space-between'} width={'100%'} mb={2}>
                <UserAvatar alt={data.guestName || 'Huésped'}>
                  {data.guestName ? data.guestName.charAt(0).toUpperCase() : '?'}
                </UserAvatar>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {t('financialPayTable.paidDetails.accommodationLabel')} {data.fecha}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {data.propiedad}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" sx={{ mb: 1 }}>
              {t('financialPayTable.paidDetails.statusLabel')} {data.estado} - {data.detalleEstado}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {t('financialPayTable.paidDetails.methodLabel')} {data.metodo}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body1" color="text.secondary">
                {t('financialPayTable.paidDetails.totalLabel')}
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {data.monto.replace('BOB ', '')}
              </Typography>
            </Stack>
          </CardContent>
        </InfoCard>
      </StyledContainer>
    </Box>
  );
};

interface AddMethodViewProps {
  onBack: () => void;
}

const AddMethodView: React.FC<AddMethodViewProps> = ({ onBack }) => {
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
          {t('financialPayTable.addMethod.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {t('financialPayTable.addMethod.description')}
        </Typography>
        <Button variant="primary" fullWidth>
          {t('financialPayTable.addMethod.button')}
        </Button>
      </Box>
    </Box>
  );
};

// ==================================================================
//          VISTA DEL PANEL DERECHO 2: "Detalles del Pago"
// ==================================================================

interface PaymentDetailsViewProps {
  onClose: () => void;
  onNavigateToAddMethod: () => void;
  data: RowData;
}

const PaymentDetailsView: React.FC<PaymentDetailsViewProps> = ({
  onClose,
  onNavigateToAddMethod,
  data,
}) => {
  const { t } = useTranslation();

  // Extrae el valor numérico del monto para el footer
  const totalAmount = data.monto.replace('BOB ', '').replace('.', '');

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

      {/* --- Contenido de Detalles (Scrollable) - DINÁMICO --- */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3, pt: 0 }}>
        <Typography variant="h5" sx={{ fontWeight: '600' }}>
          {data.monto}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#d9534f',
            }}
          />
          <Typography variant="body2" color="text.secondary">
            {t('financialPayTable.paymentDetails.depositInfo')} {data.fecha}.
          </Typography>
          {/* --- ¡AQUÍ ESTÁ EL TRIGGER! --- */}
          <Link
            component="button"
            variant="body2"
            underline="hover"
            onClick={onNavigateToAddMethod}
            sx={{ cursor: 'pointer' }}
          >
            {t('financialPayTable.paymentDetails.detailsLink')}
          </Link>
        </Box>

        {/* Card: Cuenta bancaria */}
        <Paper
          variant="outlined"
          sx={{ p: 2, borderRadius: '12px', mt: 3, borderColor: '#e0e0e0' }}
        >
          <Typography variant="body2" sx={{ fontWeight: '600', mb: 0.5 }}>
            {t('financialPayTable.paymentDetails.bankAccountTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data.cuentaTitular
              ? `${data.cuentaTitular}${data.cuentaNumero ? `, ${data.cuentaNumero}` : ''}${data.cuentaMoneda ? ` (${data.cuentaMoneda})` : ''}`
              : '—'}
          </Typography>
        </Paper>

        {/* Card: Usuario - DINÁMICO */}
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: '12px',
            mt: 2,
            borderColor: '#e0e0e0',
            position: 'relative',
          }}
        >
          <Chip
            label={`REF-${data.id.toUpperCase()}`}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              backgroundColor: '#f0f0f0',
              color: '#555',
              fontWeight: 500,
              fontSize: '0.7rem',
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar alt={data.guestName || 'Huésped'}>
              {data.guestName ? data.guestName.charAt(0).toUpperCase() : '?'}
            </Avatar>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: '600' }}>
                {data.guestName || `${t('financialPayTable.paymentDetails.userLabel')}${data.id}`}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                {t('financialPayTable.paymentDetails.accommodationLabel')} {data.fecha}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                {data.propiedad}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Typography variant="body2" sx={{ mt: 3, color: '#555' }}>
          {t('financialPayTable.paymentDetails.statusLabel')} {data.estado} - {data.detalleEstado}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: '#555' }}>
          {t('financialPayTable.paymentDetails.methodLabel')} {data.metodo}
        </Typography>
      </Box>

      {/* --- Footer de Detalles --- */}
      <Box sx={{ p: 3, borderTop: '1px solid #eee', flexShrink: 0 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {t('financialPayTable.paymentDetails.totalLabel')}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: '600' }}>
            {totalAmount}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
// ==================================================================
//            5. COMPONENTE PRINCIPAL DE LA PÁGINA
// ==================================================================

type RightPanelView = 'details' | 'addMethod' | 'paidDetails' | 'inTransit';

interface FinancialPayTableProps {
  onBack?: () => void;
  hostUserId?: number;
}

const FinancialPayTable: React.FC<FinancialPayTableProps> = ({
  onBack,
  hostUserId: _hostUserId,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [rightPanelView, setRightPanelView] = useState<RightPanelView>('details');
  const [openAdDialog, setOpenAdDialog] = useState(false);
  const [anchorElDate, setAnchorElDate] = useState<HTMLButtonElement | null>(null);
  const [searchCode, setSearchCode] = useState('');

  // Helpers para fechas dinámicas
  const pad = (n: number) => String(n).padStart(2, '0');
  const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const getDefaultDates = () => {
    const now = new Date();
    const prevMonth = new Date(now);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    return { start: fmt(prevMonth), end: fmt(now) };
  };

  const [dateRange, setDateRange] = useState(() => getDefaultDates());
  const [selectedBooks, setSelectedBooks] = useState<string | null>(null);
  const [selectionRange, setSelectionRange] = useState(() => {
    const now = new Date();
    const prevMonth = new Date(now);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    return { startDate: prevMonth, endDate: now, key: 'selection' };
  });

  const openDatePicker = Boolean(anchorElDate);

  // Obtener propiedades publicadas
  const { data: listingRentPublished } = useGet2<any>('listingRentPublished', '/Host/ListingRent', {
    status: 'PUBLISH,UNPUBLISH',
  });

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy', { locale: es });
    } catch {
      return dateString;
    }
  };

  // Función para obtener datos del servicio
  async function fetchAuthorizedPayouts(params?: {
    start?: string;
    end?: string;
    books?: string;
    listingRentId?: string;
    hostId?: number;
  }) {
    try {
      const queryParams = new URLSearchParams();

      if (params?.start) queryParams.append('start', params.start);
      if (params?.end) queryParams.append('end', params.end);
      if (params?.books) queryParams.append('books', params.books);
      if (params?.listingRentId) queryParams.append('listingRentId', params.listingRentId);
      if (params?.hostId) queryParams.append('hostId', params.hostId.toString());

      const url = `/AuthorizedPayouts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      return await ApiService.get<PayoutsGroupedResponse>(url);
    } catch (error) {
      console.error('Error fetching authorized payouts:', error);
      throw error;
    }
  }

  const {
    data: dataPayout,
    isLoading: isLoadingPayout,
    isError,
    error,
  } = useQuery<PayoutsGroupedResponse>({
    queryKey: ['authorizedPayouts', dateRange.start, dateRange.end, _hostUserId, selectedBooks],
    queryFn: () =>
      fetchAuthorizedPayouts({
        start: dateRange.start,
        end: dateRange.end,
        listingRentId: selectedBooks ? selectedBooks : undefined,
      }),
    enabled: !!listingRentPublished,
  });

  // Convertir datos del servicio a formato de tabla
  const convertToRowData = (group: PayoutGroup): RowData[] => {
    const currencyCode =
      group.currency === 'Bolivianos'
        ? 'BOB'
        : group.currency === 'United States dollar'
          ? 'USD'
          : group.currency;

    return group.paymentsList.map((payment) => ({
      id: payment.payoutTransactionId.toString(),
      bookId: payment.bookId.toString(),
      estado: group.status,
      detalleEstado: payment.paymentMethodDescription,
      fecha: formatDate(payment.processed_STR),
      propiedad: payment.book.propertyName,
      detallePropiedad: '',
      monto: `${currencyCode} ${payment.amount.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`,
      metodo: payment.paymentMethod,
      // Campos adicionales para el panel lateral
      cuentaTitular: `${payment.book.host.name} ${payment.book.host.lastName}`,
      cuentaNumero: (() => {
        const acct = payment.paymentDetails.account;
        if (acct == null) return '';
        if (typeof acct === 'object') {
          const num = (acct as Record<string, unknown>).accountNumber;
          return num != null ? String(num) : '';
        }
        return String(acct);
      })(),
      cuentaMoneda: currencyCode,
      guestName: `${payment.book.guest.name} ${payment.book.guest.lastName}`,
      hostName: `${payment.book.host.name} ${payment.book.host.lastName}`,
    }));
  };

  // Obtener todos los registros de todos los grupos
  const tableData: RowData[] = dataPayout?.data?.flatMap(convertToRowData) || [];

  // Calcular total
  const totalAmount =
    dataPayout?.data?.reduce((sum, group) => {
      const groupTotal = group.paymentsList.reduce((gSum, payment) => gSum + payment.amount, 0);
      return sum + groupTotal;
    }, 0) || 0;

  // Filtrar por búsqueda de código
  const filteredTableData = tableData.filter(
    (row) =>
      !searchCode ||
      row.id.toLowerCase().includes(searchCode.toLowerCase()) ||
      row.propiedad.toLowerCase().includes(searchCode.toLowerCase())
  );

  const handleRowClick = (row: RowData) => {
    setSelectedRow(row);
    setRightPanelView('paidDetails');
  };

  const handleCloseDetails = () => {
    setSelectedRow(null);
    setRightPanelView('paidDetails');
  };

  // --- Navegación del panel derecho ---
  const navigateToDetails = () => setRightPanelView('details');
  const navigateToAddMethod = () => setRightPanelView('addMethod');
  const navigateToInTransit = () => setRightPanelView('inTransit');
  const navigateToPaidDetails = () => setRightPanelView('paidDetails');

  // Función para abrir el dialog de filtro por anuncio
  const handleOpenAdDialog = () => {
    setOpenAdDialog(true);
  };

  const handleCloseAdDialog = () => {
    setOpenAdDialog(false);
  };

  const handleApplyAdFilter = (selectedIds: string[]) => {
    setSelectedBooks(selectedIds.length > 0 ? selectedIds.join(',') : '');
    handleCloseAdDialog();
  };

  // Helpers de formato de fecha
  const formatFilterDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr + 'T00:00:00');
      return format(date, 'dd MMM', { locale: es }).replace(/\./g, '');
    } catch {
      return dateStr;
    }
  };

  const formatDateToYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Funciones para el Popover de fecha
  const handleOpenDatePicker = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElDate(event.currentTarget);
  };

  const handleCloseDatePicker = () => {
    setAnchorElDate(null);
  };

  const handleDateSelect = (ranges: any) => {
    setSelectionRange(ranges.selection);
  };

  const handleApplyDateRange = () => {
    const startDate = formatDateToYYYYMMDD(selectionRange.startDate);
    const endDate = formatDateToYYYYMMDD(selectionRange.endDate);
    setDateRange({ start: startDate, end: endDate });
    handleCloseDatePicker();
  };

  // Función para exportar PDF
  const handleExportPDF = async () => {
    try {
      // Generar el documento PDF con los datos reales
      const doc = <FinancialPayTablePDF paymentsData={tableData} />;
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();

      // Crear URL para descargar
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pagos-realizados-${new Date().toISOString().split('T')[0]}.pdf`;

      // Simular click para descargar
      document.body.appendChild(link);
      link.click();

      // Limpiar
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert(t('financialPayTable.main.pdfError'));
    }
  };

  const setViewReservation = useViewReservationStore((state: any) => state.setViewReservation);

  const handleRefClick = async (e: React.MouseEvent, bookId: string | undefined) => {
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

  return (
    <>
      <CssBaseline />
      <Grid container sx={{ height: '100vh', overflow: 'hidden' }}>
        {/* ===================================
                COLUMNA IZQUIERDA (TABLA)
        ======================================= */}
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
          {/* --- Encabezado de página (solo desktop) --- */}
          {/* {!isMobile && (
            <Box sx={{ px: 3, pt: 3, pb: 2, flexShrink: 0 }}>
              <Button
                startIcon={<ArrowBackIcon sx={{ fontSize: '0.9rem' }} />}
                onClick={() => onBack?.()}
                sx={{
                  color: 'primary.main',
                  textTransform: 'none',
                  p: 0,
                  mb: 1.5,
                  fontWeight: 400,
                  fontSize: '0.875rem',
                }}
              >
                {t('financialPayTable.main.backButton')}
              </Button>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
                {t('financialPayTable.main.title') || 'Pagos realizados'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('financialPayTable.main.subtitle') || 'Historial de pagos ya liquidados'}
              </Typography>
            </Box>
          )} */}

          <Box sx={{ px: 3, pt: 3, pb: 2, flexShrink: 0 }}>
            <Button
              startIcon={<ArrowBackIcon sx={{ fontSize: '0.9rem' }} />}
              onClick={() => onBack?.()}
              sx={{
                color: 'primary.main',
                textTransform: 'none',
                p: 0,
                mb: 1.5,
                fontWeight: 400,
                fontSize: '0.875rem',
              }}
            >
              {t('financialPayTable.main.backButton')}
            </Button>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
              {t('financialPayTable.main.title') || 'Pagos realizados'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('financialPayTable.main.subtitle') || 'Historial de pagos ya liquidados'}
            </Typography>
          </Box>
          {/* --- Barra de Filtros --- */}
          <Box
            sx={{
              px: { xs: 2, sm: 3 },
              py: 1.5,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 1.5,
              borderBottom: '1px solid #eee',
              flexShrink: 0,
              minHeight: 56,
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
              {t('financialPayTable.main.filterAds') || 'Todas las propiedades'}
            </Button>

            {/* Search */}
            <TextField
              variant="outlined"
              size="small"
              placeholder={t('financialPayTable.main.searchPlaceholder') || 'Buscar por código...'}
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
              onClick={handleExportPDF}
              disabled={tableData.length === 0}
            >
              {t('financialPayTable.main.exportButton') || 'Exportar'}
            </Button>
          </Box>

          {/* --- Contenido Principal (Tabla) --- */}
          <Box
            sx={{
              flexGrow: 1,
              overflow: 'hidden',
              pt: isMobile ? 0 : 3,
              backgroundColor: '#fcfcfc',
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {isMobile ? (
              /* ── MOBILE: card list ── */
              <Box sx={{ flexGrow: 1, overflow: 'auto', px: 2, pb: 2, pt: 2 }}>
                {isLoadingPayout ? (
                  <Typography sx={{ mt: 3, textAlign: 'center' }}>
                    {t('financialPayTable.main.loading')}
                  </Typography>
                ) : isError ? (
                  <Typography color="error" sx={{ mt: 3, textAlign: 'center' }}>
                    {t('financialPayTable.main.error')} {error?.message}
                  </Typography>
                ) : filteredTableData.length === 0 ? (
                  <Typography sx={{ mt: 3, textAlign: 'center' }}>
                    {t('financialPayTable.main.noData')}
                  </Typography>
                ) : (
                  filteredTableData.map((row) => (
                    <Paper
                      key={row.id}
                      variant="outlined"
                      onClick={() => handleRowClick(row)}
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
                          <CircleIcon
                            sx={{
                              fontSize: 10,
                              color:
                                row.estado === 'AUTHORIZED'
                                  ? '#4caf50'
                                  : row.estado === 'Pending'
                                    ? '#ff9800'
                                    : '#f44336',
                            }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {row.estado}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
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
                      <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>
                        {row.propiedad}
                      </Typography>
                    </Paper>
                  ))
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
                      <TableCell>{t('financialPayTable.main.tableHeaders.status')}</TableCell>
                      <TableCell>Codigo</TableCell>
                      <TableCell>{t('financialPayTable.main.tableHeaders.date')}</TableCell>
                      <TableCell>{t('financialPayTable.main.tableHeaders.property')}</TableCell>
                      <TableCell align="right">
                        {t('financialPayTable.main.tableHeaders.amount')}
                      </TableCell>
                      <TableCell>{t('financialPayTable.main.tableHeaders.method')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isLoadingPayout ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                          <Typography>{t('financialPayTable.main.loading')}</Typography>
                        </TableCell>
                      </TableRow>
                    ) : isError ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <Typography color="error">
                            {t('financialPayTable.main.error')} {(error as any)?.message}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : filteredTableData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                          {t('FinancialTable.table.noData')}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTableData.map((row) => (
                        <TableRow
                          key={row.id}
                          onClick={() => handleRowClick(row)}
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
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CircleIcon
                                sx={{
                                  fontSize: 10,
                                  color:
                                    row.estado === 'AUTHORIZED'
                                      ? '#4caf50'
                                      : row.estado === 'Pending'
                                        ? '#ff9800'
                                        : '#f44336',
                                }}
                              />
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {row.estado === 'AUTHORIZED' ? 'Autorizado' : ''}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {row.detalleEstado}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              onClick={(e) => handleRefClick(e, row.bookId)}
                              sx={{
                                color: theme.palette.customColors.primary[1],
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                '&:hover': { color: 'primary.main' },
                              }}
                            >
                              {row.bookId}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(row.fecha)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontWeight: 500 }}
                            >
                              {row.propiedad}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontWeight: 500 }}
                            >
                              {row.monto}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {row.metodo}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>

          {/* --- Footer de la Tabla --- */}
          <Box
            sx={{
              px: { xs: 2, sm: 3 },
              py: 2,
              borderTop: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexShrink: 0,
              backgroundColor: '#fff',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {`BOB ${totalAmount.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`}
            </Typography>
          </Box>
        </Grid>

        {/* ======================================
                 COLUMNA DERECHA (DINÁMICA)
        ======================================= */}
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
            {rightPanelView === 'details' && selectedRow ? (
              <PaymentDetailsView
                onClose={handleCloseDetails}
                onNavigateToAddMethod={navigateToAddMethod}
                data={selectedRow}
              />
            ) : rightPanelView === 'addMethod' ? (
              <AddMethodView onBack={navigateToDetails} />
            ) : rightPanelView === 'paidDetails' && selectedRow ? (
              <PaidDetailsView
                onClose={handleCloseDetails}
                onNavigateToInTransit={navigateToInTransit}
                data={selectedRow}
              />
            ) : rightPanelView === 'inTransit' && selectedRow ? (
              <MoneyInTransitView
                onBack={navigateToPaidDetails}
                onClose={handleCloseDetails}
                data={selectedRow}
              />
            ) : null}
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
      >
        <Box sx={{ p: 2 }}>
          <DateRange
            ranges={[selectionRange]}
            onChange={handleDateSelect}
            months={isMobile ? 1 : 2}
            direction={isMobile ? 'vertical' : 'horizontal'}
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
              Cerrar
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default FinancialPayTable;
