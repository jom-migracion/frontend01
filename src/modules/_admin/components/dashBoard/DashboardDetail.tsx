import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Container,
  Typography,
  CircularProgress,
  Alert,
  useMediaQuery,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Grid from '@mui/material/Grid2';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  type ActiveElement,
  type ChartEvent,
} from 'chart.js';
import { useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import FilterDialogDashboard from './FilterDialogDashboard';
import FilterByAdDialog from './FilterByAdDialog';
import { type RevenueReport, type MonthlyRecord } from './MainDashboard';
import { useGet2 } from '@/hooks/api';
import { useTranslation } from 'react-i18next';
import { theme } from '@/themes/theme';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type View = 'mensual' | 'anual';

export interface DashboardInfoResponse {
  data: {
    month: number | null;
    year: number;
    monthSpanish: string | null;
    monthEnglish: string | null;
    filterMode: number;
    filterModeStr: string;
    totalPaid: number;
    paidByPeriod: PeriodData[];
    totalUpcoming: number;
    upcomingByPeriod: PeriodData[];
    totalConfirmedBooks: number;
    confirmedBooksByPeriod: PeriodData[];
    totalNightsBooked: number;
    nightsBookedByPeriod: PeriodData[];
    averageNightsPerBook: number;
    averageNightsPerBookByPeriod: PeriodData[];
  };
  statusCode: string;
  hasError: boolean;
  resultError: string | null;
}

export interface PeriodData {
  period: number;
  value: number;
}

/* ---------- STYLES ---------- */
const cardSx = {
  borderRadius: 3,
  boxShadow: 0,
  backgroundColor: '#fff',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
};

const metricCardSx = {
  borderRadius: 3,
  boxShadow: 0,
  border: '1px solid #f0f0f0',
  backgroundColor: '#fff',
  padding: '20px 24px',
};

const MONTH_NAMES_ES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];
interface RestoreStateProps {
  restoreState: () => void;
  hostUserId?: number;
}
/* ---------- COMPONENT ---------- */
const DashboardDetail = ({ restoreState, hostUserId }: RestoreStateProps) => {
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openAdDialog, setOpenAdDialog] = useState(false);
  const [view, setView] = useState<View>('mensual');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedLabel, setSelectedLabel] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(new Date().getMonth() + 1); // Mes actual por defecto
  const [selectedBooks, setSelectedBooks] = useState<string | null>(null);

  const { t } = useTranslation();

  // Preparar parámetros para la API
  const apiParams = useMemo(() => {
    const params: Record<string, any> = { year: selectedYear };
    if (view === 'mensual' && selectedMonth) {
      params.month = selectedMonth;
    }
    return params;
  }, [selectedYear, selectedMonth, view]);

  const dashboardInfoParams = {
    ...apiParams,
    ...(hostUserId && { hostId: hostUserId }),
    ...(selectedBooks !== null && selectedBooks !== '' && { books: selectedBooks }),
  };

  const { data, isLoading, isError, error } = useGet2<DashboardInfoResponse['data']>(
    ['dashboard-info', view, selectedYear, selectedMonth, hostUserId, selectedBooks],
    '/Dashboard/GetDashboardInfo',
    dashboardInfoParams
  );

  const { data: revenueData, isLoading: isChartLoading } = useGet2<RevenueReport>(
    ['revenue-report', selectedYear],
    `/GetRevenueReportYear/${selectedYear}`
  );

  const { data: listingRentPublished } = useGet2<any>('listingRentPublished', '/Host/ListingRent', {
    status: 'PUBLISH',
  });

  const handleApplyAdFilter = (selectedIds: string[]) => {
    setSelectedBooks(selectedIds.length > 0 ? selectedIds.join(',') : '');
  };

  // Preparar datos para el gráfico
  const monthNames = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ];

  const chartData = useMemo(() => {
    const report = revenueData as any as RevenueReport | undefined;
    const monthlyRevenue = Array(12).fill(0);

    if (report?.data?.monthlyData) {
      report.data.monthlyData.forEach((entry: MonthlyRecord) => {
        const idx = entry.month - 1;
        if (idx >= 0 && idx < 12) monthlyRevenue[idx] = entry.netRevenue;
      });
    }

    const backgroundColor = monthlyRevenue.map((_, i) => {
      if (view === 'mensual' && selectedMonth != null) {
        return i + 1 === selectedMonth ? theme.palette.primary.main : '#E8EEFF';
      }
      return theme.palette.primary.main;
    });

    return {
      labels: monthNames,
      datasets: [
        {
          label: t('dashboardDetail.chart.paidLabel'),
          data: monthlyRevenue,
          backgroundColor,
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 8,
          barThickness: 50,
          categoryPercentage: 0.6,
          barPercentage: 0.8,
        },
      ],
    };
  }, [revenueData, view, selectedMonth, monthNames]);

  // Estados de carga y error
  if (isLoading) {
    return (
      <Container maxWidth={'lg'}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress color="primary" />
        </Box>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxWidth={'lg'}>
        <Alert severity="error">
          {t('dashboardDetail.error')} {error?.message}
        </Alert>
      </Container>
    );
  }

  const dashboardData = data as any;
  const isMensual = view === 'mensual';

  /* Handle view change from dialog */
  const handleViewChange = (v: View, year: number, month?: number) => {
    setView(v);
    setSelectedYear(year);
    setSelectedMonth(month);

    if (v === 'mensual' && month) {
      setSelectedLabel(`${MONTH_NAMES_ES[month - 1]} ${year}`);
    } else {
      setSelectedLabel(`${year}`);
    }

    setOpenViewDialog(false);
  };

  /* Click sobre una barra — siempre selecciona el mes */
  const handleClickBar = (_event: ChartEvent, elements: ActiveElement[]) => {
    if (!elements.length) return;
    const index = elements[0].index;
    const label = chartData.labels[index];
    setSelectedMonth(index + 1);
    setSelectedLabel(`${label} ${selectedYear}`);
  };

  // Generar título dinámico
  const getDisplayTitle = () => {
    const dashboardData = data as any;
    if (selectedLabel) {
      return selectedLabel;
    }

    if (isMensual) {
      if (dashboardData?.data?.monthSpanish && dashboardData?.data?.year) {
        return `${dashboardData.data.monthSpanish} ${dashboardData.data.year}`;
      }
      return `${selectedYear}`;
    } else {
      return `${selectedYear}`;
    }
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: handleClickBar,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.dataset.label}: ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#555' } },
      y: {
        beginAtZero: true,
        ticks: { stepSize: isMensual ? 20 : 100, color: '#555' },
      },
    },
  };

  return (
    <>
      <FilterDialogDashboard
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        onApply={handleViewChange}
        currentView={view}
        currentYear={selectedYear}
        currentMonth={selectedMonth}
      />

      <FilterByAdDialog
        open={openAdDialog}
        onClose={() => setOpenAdDialog(false)}
        listings={listingRentPublished?.data || []}
        onApply={handleApplyAdFilter}
      />
      <Card sx={cardSx}>
        {/* Header row: back + title on left, filters on right */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            pr: isMobile ? 2 : 3,
            pt: 3,
            pb: 1,
            gap: { xs: 1.5, sm: 0 },
          }}
        >
          <Box sx={{ pl: isMobile ? 2 : 3, pt: 3, pb: 2, flexShrink: 0 }}>
            <Button
              startIcon={<ArrowBackIcon sx={{ fontSize: '0.9rem' }} />}
              onClick={restoreState}
              sx={{
                color: 'primary.main',
                textTransform: 'none',
                mb: 1.5,
                fontWeight: 400,
                fontSize: '0.875rem',
              }}
            >
              {/* Volver al dashboard */} {t('dashboardDetail.back')}
            </Button>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
              {getDisplayTitle()}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              flexWrap: 'wrap',
              pl: '12px',
              mt: 1,
              mb: 3,
            }}
          >
            {/* Mensual / Anual toggle */}
            <Box
              sx={{
                display: 'flex',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                overflow: 'hidden',
                pr: '3px',
                gap: '4px',
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              <Button
                size="small"
                fullWidth={isMobile ? true : false}
                onClick={() => setOpenViewDialog(true)}
                sx={{
                  pl: 2,
                  pr: 2,
                  m: 0.5,
                  textAlign: 'center',
                  borderRadius: '8px',
                  textTransform: 'none',
                  minWidth: 80,
                  fontWeight: 500,
                  fontSize: '0.85rem',
                  backgroundColor: isMensual ? '#fafafa' : 'transparent',
                  color: isMensual ? '#5C5FEF' : 'text.secondary',
                }}
              >
                {t('dashboardDetail.filters.monthly')}
              </Button>
              <Button
                size="small"
                fullWidth={isMobile ? true : false}
                onClick={() => setOpenViewDialog(true)}
                sx={{
                  pl: 2,
                  pr: 3,
                  m: 0.5,
                  borderRadius: '8px',
                  textTransform: 'none',
                  minWidth: 70,
                  fontWeight: 500,
                  fontSize: '0.85rem',
                  backgroundColor: !isMensual ? '#fafafa' : 'transparent',
                  color: !isMensual ? '#5C5FEF' : 'text.secondary',
                }}
              >
                {t('dashboardDetail.filters.annual')}
              </Button>
            </Box>

            {/* Todos los anuncios */}
            <Button
              size="small"
              variant="outlined"
              fullWidth={isMobile}
              endIcon={<KeyboardArrowDownIcon />}
              onClick={() => setOpenAdDialog(true)}
              sx={{
                p: 1,
                borderRadius: '20px',
                textTransform: 'none',
                borderColor: '#e0e0e0',
                color: 'text.primary',
                fontWeight: 500,
                fontSize: '0.85rem',
                '&:hover': { borderColor: '#bdbdbd', backgroundColor: 'rgba(0,0,0,0.02)' },
              }}
            >
              {t('dashboardDetail.filters.allListings')}
            </Button>
          </Box>
        </Box>

        {/* Pagado / Próximos / Retenido */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 2.5 },
            px: { xs: 2, sm: 3 },
            mt: 0.5,
            mb: 2.5,
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: '#e53935',
                flexShrink: 0,
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {t('dashboardDetail.summary.paid')}{' '}
              {dashboardData?.data?.totalPaid?.toLocaleString('es-BO', {
                minimumFractionDigits: 2,
              }) || '0,00'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: '#bdbdbd',
                flexShrink: 0,
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {t('dashboardDetail.summary.upcoming')}{' '}
              {dashboardData?.data?.totalUpcoming?.toLocaleString('es-BO', {
                minimumFractionDigits: 2,
              }) || '0,00'}
            </Typography>
          </Box>
          {(dashboardData?.data as any)?.totalRetained != null && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <WarningAmberIcon sx={{ fontSize: 16, color: '#e53935' }} />
              <Typography variant="body2" color="error" fontWeight={500}>
                {t('dashboardDetail.summary.retained')}{' '}
                {(dashboardData?.data as any)?.totalRetained?.toLocaleString('es-BO', {
                  minimumFractionDigits: 2,
                }) || '0,00'}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Métricas */}
        <Grid container spacing={2} sx={{ px: { xs: 2, sm: 3 }, pb: 2 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card sx={metricCardSx}>
              <Typography variant="body2" color="text.secondary" fontWeight={400} mb={0.5}>
                {t('dashboardDetail.metrics.confirmedReservations')}
              </Typography>
              <Typography variant="h4" fontWeight={600}>
                {dashboardData?.data?.totalConfirmedBooks || 0}
              </Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card sx={metricCardSx}>
              <Typography variant="body2" color="text.secondary" fontWeight={400} mb={0.5}>
                {t('dashboardDetail.metrics.bookedNights')}
              </Typography>
              <Typography variant="h4" fontWeight={600}>
                {dashboardData?.data?.totalNightsBooked || 0}
              </Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card sx={metricCardSx}>
              <Typography variant="body2" color="text.secondary" fontWeight={400} mb={0.5}>
                {t('dashboardDetail.metrics.avgNights')}
              </Typography>
              <Typography variant="h4" fontWeight={600}>
                {dashboardData?.data?.averageNightsPerBook?.toFixed(1) || '0.0'}
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Gráfico */}
        <Box sx={{ px: { xs: 2, sm: 3 }, pb: 4, mt: 1 }}>
          <Box
            sx={{
              border: '1px solid #f0f0f0',
              borderRadius: 3,
              p: 3,
            }}
          >
            <Typography variant="subtitle1" fontWeight={700} mb={0.25}>
              {t('dashboardDetail.chart.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              {t('dashboardDetail.chart.subtitle')}
            </Typography>
            <Box sx={{ height: 220, position: 'relative' }}>
              {isChartLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <CircularProgress size={32} color="primary" />
                </Box>
              ) : (
                <Bar data={chartData} options={chartOptions} />
              )}
            </Box>
          </Box>
        </Box>
      </Card>
    </>
  );
};

export default DashboardDetail;
