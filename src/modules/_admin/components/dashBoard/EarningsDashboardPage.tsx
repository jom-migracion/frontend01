import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Popover,
  Stack,
  ButtonProps,
  useTheme,
  useMediaQuery,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SummaryCards from './SummaryCards';
import IncomeByProperty from './IncomeByProperty';
import PerformanceByProperty from './PerformanceByProperty';
import DownloadDialog from './DownloadDialog';
import FilterByAdDialog from './FilterByAdDialog';
import { DateRange } from 'react-date-range';
import { format, subMonths } from 'date-fns';
import type { Range, RangeKeyDict } from 'react-date-range';
import es from 'date-fns/locale/es';
import { useGet2 } from '@/hooks/api';
import { useTranslation } from 'react-i18next';
import RankingProperties from './RankingProperties';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

// ===================================================================
// INTERFACES PARA EL SERVICIO FINANCIERO
// ===================================================================
interface FinancialSummaryData {
  dateRange: string;
  totalEarned: string;
  grossIncome: number;
  adjustments: number;
  serviceFee: number;
  total: number;
  confirmedReservations: number;
  reservedNights: number;
  averageNightsPerReservation: number;
  propertyDetails: any;
}

// ===================================================================
// 1. COMPONENTE: HeaderButton
// ===================================================================
interface HeaderButtonProps extends ButtonProps {}

const HeaderButton: React.FC<HeaderButtonProps> = ({ children, onClick, ...otherProps }) => {
  return (
    <Button
      onClick={onClick}
      variant="outlined"
      endIcon={<ArrowDropDownIcon />}
      sx={{
        borderColor: '#e0e0e0',
        color: 'text.primary',
        textTransform: 'none',
        borderRadius: '20px',
      }}
      {...otherProps}
    >
      {children}
    </Button>
  );
};

// ===================================================================
// 2. COMPONENTE: IncomeSummary
// ===================================================================
interface IncomeSummaryProps {
  data?: FinancialSummaryData;
  isLoading?: boolean;
  isError?: boolean;
}

const IncomeSummary: React.FC<IncomeSummaryProps> = ({ data, isLoading, isError }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Función para formatear números a formato BOB
  const formatCurrency = (amount: number) => {
    return `BOB ${amount.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`;
  };

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t('earningsDashboard.incomeSummary.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('earningsDashboard.incomeSummary.loading')}
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t('earningsDashboard.incomeSummary.title')}
        </Typography>
        <Typography variant="body2" color="error">
          {t('earningsDashboard.incomeSummary.error')}
        </Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t('earningsDashboard.incomeSummary.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('earningsDashboard.incomeSummary.noData')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {t('earningsDashboard.incomeSummary.title')}
      </Typography>

      {isMobile ? (
        /* Mobile: tabla estilo FinancialTable */
        <Paper
          variant="outlined"
          sx={{ borderRadius: '16px', overflow: 'hidden', borderColor: '#e0e0e0' }}
        >
          <TableContainer>
            <Table size="small">
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
                  <TableCell>{t('earningsDashboard.incomeSummary.table.summary')}</TableCell>
                  <TableCell align="right">
                    {t('earningsDashboard.incomeSummary.table.incomeRow')}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow hover>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {t('earningsDashboard.incomeSummary.table.grossIncome')}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">{formatCurrency(data.grossIncome)}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {t('earningsDashboard.incomeSummary.table.adjustments')}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">{formatCurrency(data.adjustments)}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {t('earningsDashboard.incomeSummary.table.serviceFee')}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">{formatCurrency(data.serviceFee)}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {t('earningsDashboard.incomeSummary.table.total')}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {formatCurrency(data.total)}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        /* Desktop: horizontal grid */
        <Box
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          {/* Header row */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
              borderBottom: '1px solid #e0e0e0',
              textTransform: 'uppercase',
              backgroundColor: '#f9fbfc',
              color: '#64748b',
              fontWeight: 700,
              fontSize: '0.5rem',
              letterSpacing: '0.06em',
              '&:last-child': { borderRight: 'none' },
              py: 0,
            }}
          >
            <Box>
              <Typography
                variant="body2"
                sx={{ p: 2, color: '#64748b', fontSize: '0.7rem', fontWeight: 700 }}
              >
                {t('earningsDashboard.incomeSummary.table.summary')}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{ p: 2, color: '#64748b', fontSize: '0.7rem', fontWeight: 700 }}
              >
                {t('earningsDashboard.incomeSummary.table.grossIncome')}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{ p: 2, color: '#64748b', fontSize: '0.7rem', fontWeight: 700 }}
              >
                {t('earningsDashboard.incomeSummary.table.adjustments')}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{ p: 2, color: '#64748b', fontSize: '0.7rem', fontWeight: 700 }}
              >
                {t('earningsDashboard.incomeSummary.table.serviceFee')}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{ p: 2, color: '#64748b', fontSize: '0.7rem', fontWeight: 700 }}
              >
                {t('earningsDashboard.incomeSummary.table.total')}
              </Typography>
            </Box>
          </Box>

          {/* Data row */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="body2">
                {t('earningsDashboard.incomeSummary.table.incomeRow')}
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography variant="body2">{formatCurrency(data.grossIncome)}</Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography variant="body2">{formatCurrency(data.adjustments)}</Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography variant="body2">{formatCurrency(data.serviceFee)}</Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(data.total)}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

// ===================================================================
// 3. COMPONENTE: FilterToolbar
// ===================================================================
interface FilterToolbarProps {
  buttonText: string;
  onDateClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onFilterOpen: () => void;
  onDownloadOpen: () => void;
}

const FilterToolbar: React.FC<FilterToolbarProps> = ({
  buttonText,
  onDateClick,
  onFilterOpen,
  onDownloadOpen,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Stack
      direction={isMobile ? 'column' : 'row'}
      spacing={1}
      sx={{ width: isMobile ? '100%' : 'auto', gap: 1 }}
    >
      <HeaderButton onClick={onDateClick} size="small" fullWidth={isMobile}>
        {buttonText}
      </HeaderButton>
      {/*Quite el filtro*/}
      {/* <HeaderButton onClick={onFilterOpen} size="small" fullWidth={isMobile}>
        {t('earningsDashboard.buttons.allListings')}
      </HeaderButton> */}
      <HeaderButton onClick={onDownloadOpen} size="small" fullWidth={isMobile}>
        {t('earningsDashboard.buttons.download')}
      </HeaderButton>
    </Stack>
  );
};

// ===================================================================
// 4. COMPONENTE: DateRangePopover
// ===================================================================
interface DateRangePopoverProps {
  open: boolean;
  anchorEl: HTMLButtonElement | null;
  dateRange: Range[];
  onClose: () => void;
  onClear: () => void;
  onApply: () => void;
  onDateRangeSelect: (rangesByKey: RangeKeyDict) => void;
}

const DateRangePopover: React.FC<DateRangePopoverProps> = ({
  open,
  anchorEl,
  dateRange,
  onClose,
  onClear,
  onApply,
  onDateRangeSelect,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
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
          ranges={dateRange}
          onChange={onDateRangeSelect}
          months={isMobile ? 1 : 2}
          direction={isMobile ? 'vertical' : 'horizontal'}
          locale={es}
          rangeColors={[theme.palette.customColors?.primary?.[1] || '#3f51b5']}
          showPreview={false}
          showDateDisplay={false}
          editableDateInputs={false}
          moveRangeOnFirstSelection={false}
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
            onClick={onClear}
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
            Limpiar Fecha
          </Typography>
          <Button variant="primary" sx={{ mr: 2 }} onClick={onApply}>
            Aplicar
          </Button>
        </Box>
      </Box>
    </Popover>
  );
};

// ===================================================================
// 5. COMPONENTE: PageHeader
// ===================================================================
interface PageHeaderProps {
  startDate?: Date;
  endDate?: Date;
  financialData?: FinancialSummaryData;
  isLoading?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  startDate,
  endDate,
  financialData,
  isLoading,
}) => {
  const { t } = useTranslation();

  const displayDateRange =
    financialData?.dateRange ||
    (startDate && endDate
      ? `${format(startDate, "dd 'de' MMMM yyyy", { locale: es })} - ${format(endDate, "dd 'de' MMMM yyyy", { locale: es })}`
      : t('earningsDashboard.header.selectDateRange'));
  const displayEarnings = isLoading ? 'Cargando...' : financialData?.totalEarned || 'BOB 0,00';

  return (
    <Box sx={{ textAlign: 'center', my: 2 }}>
      <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.25rem', sm: '2.125rem' } }}>
        {displayDateRange}
      </Typography>
      <Typography
        variant="h6"
        component="p"
        color="text.secondary"
        sx={{ fontSize: { xs: '0.95rem', sm: '1.25rem' } }}
      >
        {isLoading ? t('earningsDashboard.incomeSummary.loading') : `${displayEarnings}`}
      </Typography>
    </Box>
  );
};

// ===================================================================
// 6. COMPONENTE: DialogsContainer
// ===================================================================
interface DialogsContainerProps {
  filterOpen: boolean;
  onFilterClose: () => void;
  downloadOpen: boolean;
  onDownloadClose: () => void;
  listings?: any[];
  onApplyListings: (selectedIds: string[]) => void;
}

const DialogsContainer: React.FC<DialogsContainerProps> = ({
  filterOpen,
  onFilterClose,
  downloadOpen,
  onDownloadClose,
  listings,
  onApplyListings,
}) => {
  return (
    <>
      <FilterByAdDialog
        open={filterOpen}
        onClose={onFilterClose}
        listings={listings}
        onApply={(selectedIds) => {
          onApplyListings(selectedIds);
          onFilterClose();
        }}
      />
      <DownloadDialog open={downloadOpen} onClose={onDownloadClose} />
    </>
  );
};

// ===================================================================
// 7. HOOK PERSONALIZADO: useDateRange
// ===================================================================
const useDateRange = () => {
  const { t } = useTranslation();

  const defaultRange: Range = {
    startDate: subMonths(new Date(), 1),
    endDate: new Date(),
    key: 'selection',
  };

  // Estado confirmado: alimenta el queryKey del API
  const [dateRange, setDateRange] = useState<Range[]>([defaultRange]);
  // Estado visual: solo actualiza el picker sin disparar el API
  const [pendingDateRange, setPendingDateRange] = useState<Range[]>([defaultRange]);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const { startDate, endDate } = dateRange[0];

  const buttonText =
    startDate && endDate
      ? `${format(startDate, 'dd MMM yyyy', { locale: es })} - ${format(endDate, 'dd MMM yyyy', { locale: es })}`
      : t('earningsDashboard.header.selectDates');

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Sincronizar picker con el rango confirmado al abrir
    setPendingDateRange(dateRange);
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  // Solo actualiza el picker visual, NO dispara el API
  const handleDateRangeSelect = (rangesByKey: RangeKeyDict) => {
    const range = rangesByKey.selection;
    setPendingDateRange([range]);
  };

  // Confirma la selección y dispara el API
  const handleApply = () => {
    setDateRange(pendingDateRange);
    handlePopoverClose();
  };

  const handleClear = () => {
    setDateRange([defaultRange]);
    setPendingDateRange([defaultRange]);
    handlePopoverClose();
  };

  const isPopoverOpen = Boolean(anchorEl);

  return {
    dateRange: pendingDateRange,
    anchorEl,
    startDate,
    endDate,
    buttonText,
    isPopoverOpen,
    handleClick,
    handlePopoverClose,
    handleDateRangeSelect,
    handleClear,
    handleApply,
  };
};

// ===================================================================
// 8. COMPONENTE PRINCIPAL: EarningsDashboardPage
// ===================================================================
interface EarningsDashboardPageProps {
  restoreState: () => void;
  hostUserId?: number;
}

const EarningsDashboardPage: React.FC<EarningsDashboardPageProps> = ({
  restoreState,
  hostUserId,
}) => {
  const { t } = useTranslation();
  const [filterOpen, setFilterOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  const [selectedListingIds, setSelectedListingIds] = useState<string[]>([]);
  const {
    dateRange,
    anchorEl,
    startDate,
    endDate,
    buttonText,
    isPopoverOpen,
    handleClick,
    handlePopoverClose,
    handleDateRangeSelect,
    handleClear,
    handleApply,
  } = useDateRange();

  const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Uso corregido:
  const financialStartDate = startDate
    ? formatLocalDate(startDate)
    : formatLocalDate(subMonths(new Date(), 1));

  const financialEndDate = endDate ? formatLocalDate(endDate) : formatLocalDate(new Date());

  // Construir query parameters para el resumen financiero
  const financialQueryParams = new URLSearchParams({
    startDate: financialStartDate,
    endDate: financialEndDate,
    hostUserId: (hostUserId ?? '').toString(),
  });

  // Llamada al API para el resumen financiero
  const {
    data: financialData,
    isLoading: isFinancialLoading,
    isError: isFinancialError,
  } = useGet2<FinancialSummaryData>(
    [
      'financial-summary',
      financialStartDate,
      financialEndDate,
      hostUserId,
      selectedListingIds.join(','),
    ],
    `/GetHostFinancialSummary?${financialQueryParams.toString()}`,
    {},
    !!hostUserId
  );

  // Handlers para los diálogos
  const handleFilterOpen = () => setFilterOpen(true);
  const handleFilterClose = () => setFilterOpen(false);
  const handleDownloadOpen = () => setDownloadOpen(true);
  const handleDownloadClose = () => setDownloadOpen(false);

  if (showRanking) {
    return (
      <RankingProperties
        onBack={() => setShowRanking(false)}
        hostId={hostUserId}
        startDate={financialStartDate}
        endDate={financialEndDate}
      />
    );
  }

  return (
    <>
      <Stack spacing={2} m={{ xs: 2 }}>
        <Box display={'flex'} alignItems={'flex-start'} gap={0}>
          <Button
            startIcon={<ArrowBackIcon sx={{ fontSize: '0.9rem' }} />}
            onClick={restoreState}
            sx={{
              color: 'primary.main',
              textTransform: 'none',
              fontWeight: 400,
              fontSize: '0.875rem',
            }}
          >
            {t('earningsDashboard.back')}
          </Button>
        </Box>
        <Box
          display={'flex'}
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={2}
          flexWrap="wrap"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          {/* Barra de filtros */}
          <FilterToolbar
            buttonText={buttonText}
            onDateClick={handleClick}
            onFilterOpen={handleFilterOpen}
            onDownloadOpen={handleDownloadOpen}
          />
          {/* Diálogos */}
          <DialogsContainer
            filterOpen={filterOpen}
            onFilterClose={handleFilterClose}
            downloadOpen={downloadOpen}
            onDownloadClose={handleDownloadClose}
            listings={financialData?.data?.propertyDetails ?? []}
            onApplyListings={setSelectedListingIds}
          />
          {/* Popover de rango de fechas */}
          <DateRangePopover
            open={isPopoverOpen}
            anchorEl={anchorEl}
            dateRange={dateRange}
            onClose={handlePopoverClose}
            onClear={handleClear}
            onApply={handleApply}
            onDateRangeSelect={handleDateRangeSelect}
          />
          <Button
            sx={{ textTransform: 'none', borderRadius: '16px' }}
            variant="contained"
            size="small"
            onClick={() => setShowRanking(true)}
          >
            {t('earningsDashboard.buttons.ranking')}
          </Button>
        </Box>
        {/* Encabezado de la página */}
        <PageHeader
          startDate={startDate}
          endDate={endDate}
          financialData={financialData?.data}
          isLoading={isFinancialLoading}
        />
        {/* Sección de resumen y métricas */}
        <Stack spacing={4}>
          <IncomeSummary
            data={financialData?.data}
            isLoading={isFinancialLoading}
            isError={isFinancialError}
          />
          <SummaryCards
            data={financialData?.data}
            isLoading={isFinancialLoading}
            isError={isFinancialError}
          />
        </Stack>
        {/* Sección de ingresos por inmueble */}
        <IncomeByProperty
          hostUserId={hostUserId}
          startDate={financialStartDate}
          endDate={financialEndDate}
        />
        {/* Sección de rendimiento por inmueble */}
        <PerformanceByProperty
          hostUserId={hostUserId}
          startDate={financialStartDate}
          endDate={financialEndDate}
        />
      </Stack>
    </>
  );
};

export default EarningsDashboardPage;
