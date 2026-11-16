import { useState, useMemo } from 'react';
import { Card, Typography, Box, CircularProgress, Alert, useTheme } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartEvent,
  type ActiveElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
//import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { useTranslation } from 'react-i18next';
import ResponseAssert from '@/models/interfaces/backend/ResponseAssert';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export interface RevenueReport {
  data: {
    grandTotalRevenue: number;
    grandTotalPlatformFees: number;
    grandTotalNetRevenue: number;
    grandTotalTransactions: number;
    monthlyData: MonthlyRecord[];
  };
  statusCode: string;
  hasError: boolean;
  resultError: string | null;
}

export interface MonthlyRecord {
  month: number;
  year: number;
  totalRevenue: number;
  totalPlatformFees: number;
  netRevenue: number;
  transactionCount: number;
  monthSpanish: string;
  monthEnglish: string;
}

interface showDetailProps {
  showDetail: () => void;
  data: ResponseAssert<RevenueReport> | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

/* ---------- COMPONENT ---------- */
const MainDashboard = ({ showDetail, data, isLoading, isError, error }: showDetailProps) => {
  const [selectedLabel, setSelectedLabel] = useState<string>('');
  const theme = useTheme();
  const { t, i18n } = useTranslation();

  const date = new Date();
  const currentYear = date.getFullYear();

  const monthNames = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(i18n.language, { month: 'short' });
    const months = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(currentYear, i, 1);
      const m = formatter.format(d);
      months.push(m.charAt(0).toUpperCase() + m.slice(1));
    }
    return months;
  }, [i18n.language, currentYear]);

  const chartData = useMemo(() => {
    const revenueData = data as any;
    if (!revenueData?.data?.monthlyData) {
      return {
        labels: monthNames,
        datasets: [
          {
            label: 'Ingresos netos (BOB)',
            data: Array(12).fill(0),
            backgroundColor: '#ececec',
            borderColor: '#757575',
            borderWidth: { top: 2, left: 0, right: 0, bottom: 0 },
            borderRadius: 0,
            barThickness: 60,
            categoryPercentage: 0.6,
            barPercentage: 0.8,
          },
        ],
      };
    }

    // Crear array de 12 meses con valores en 0
    const monthlyRevenue = Array(12).fill(0);

    // Llenar con datos reales de la API
    revenueData.data.monthlyData.forEach((monthData: any) => {
      const monthIndex = monthData.month - 1; // Los meses vienen del 1-12, necesitamos 0-11
      monthlyRevenue[monthIndex] = monthData.netRevenue;
    });

    return {
      labels: monthNames,
      datasets: [
        {
          label: t('mainDashboard.netIncomeLabel'),
          data: monthlyRevenue,
          backgroundColor: theme.palette.primary.main,
          borderColor: '#757575',
          borderWidth: { top: 2, left: 0, right: 0, bottom: 0 },
          borderRadius: 0,
          barThickness: 60,
          categoryPercentage: 0.6,
          barPercentage: 0.8,
        },
      ],
    };
  }, [data, monthNames]);

  const handleClickBar = (_event: ChartEvent, elements: ActiveElement[]) => {
    if (!elements.length) return;
    const index = elements[0].index;
    const label = chartData.labels[index];
    setSelectedLabel(label);
  };

  // Calcular el total de ingresos y mes seleccionado
  const revenueData = data as any; // Temporal para evitar errores de tipado
  const totalNetRevenue = revenueData?.data?.grandTotalNetRevenue || 0;
  const selectedMonthData = selectedLabel
    ? revenueData?.data?.monthlyData?.find((m: any) => monthNames[m.month - 1] === selectedLabel)
    : null;

  const displayAmount = selectedMonthData ? selectedMonthData.netRevenue : totalNetRevenue;
  const displayPeriod = selectedLabel || `${t('mainDashboard.yearLabel')} ${currentYear}`;

  // Estados de carga y error - DESPUÉS de todos los hooks
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (isError) {
    return <Alert severity="error">Error loading property: {error?.message}</Alert>;
  }

  /* ---------- OPCIONES DEL GRÁFICO ---------- */
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
      x: {
        grid: { display: false },
        ticks: {
          color: '#555', // 🔹 color de los meses
          font: { size: 13 },
        },
      },
      y: {
        display: false, // 🔹 oculta el eje vertical (valores)
        beginAtZero: true,
        grid: { display: false },
      },
    },
    layout: {
      padding: { top: 10, bottom: 10 }, // 🔹 menos espacio vertical
    },
  };

  return (
    <Card elevation={0} sx={{ borderRadius: 6, border: '1px solid #e0e0e0' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 3,
          pt: 2,
        }}
      >
        <Typography gutterBottom sx={{ fontSize: { xs: '1rem', md: '18px' } }}>
          {t('mainDashboard.title')}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          px: 3,
          pt: 2,
        }}
      >
        <Typography
          variant="h1Medium"
          sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, lineHeight: { xs: 1.3, md: '56px' } }}
        >
          {t('mainDashboard.earnedLabel')}
        </Typography>
      </Box>
      <Box display={'flex'} justifyContent={'space-between'}>
        <Box
          sx={{
            display: 'flex',
            px: 3,
            mb: 1,
          }}
        >
          <Typography
            variant="h1Medium"
            sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, lineHeight: { xs: 1.3, md: '56px' } }}
          >
            {t('mainDashboard.amountDetail', {
              amount: displayAmount.toLocaleString('es-BO', { minimumFractionDigits: 2 }),
              period: displayPeriod,
            })}
          </Typography>
        </Box>
        {/* <Box
          display={'flex'}
          justifyContent={'flex-end'}
          alignItems={'center'}
          gap={1}
          onClick={showDetail}
          sx={{ cursor: 'pointer', mb: 1 }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              textDecoration: 'underline',
              fontSize: '0.8rem',
            }}
          >
            {t('mainDashboard.viewFullAnalysis')}nnn
          </Typography>
          <OpenInFullIcon sx={{ fontSize: 14, color: 'text.secondary', mr: 4 }} />
        </Box> */}
      </Box>
      <Box display={'flex'} flexDirection={'column'} sx={{ flex: 1, px: 3, pb: 3 }}>
        <Box display={'flex'} sx={{ height: '30vh' }}>
          <Bar data={chartData} options={chartOptions} />
        </Box>
      </Box>
    </Card>
  );
};

export default MainDashboard;
