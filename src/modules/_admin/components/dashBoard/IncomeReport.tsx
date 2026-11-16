import React, { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useGet2 } from '@/hooks/api';

interface ApiAmount {
  source?: string;
  parsedValue?: number;
}

interface MonthlyIncomeItem {
  mes?: number;
  month?: number;
  monthNumber?: number;
  nombreMes?: string;
  monthName?: string;
  ingresosBrutos?: number | string | ApiAmount;
  grossIncome?: number | string | ApiAmount;
  ajustes?: number | string | ApiAmount;
  adjustments?: number | string | ApiAmount;
  tarifaPorServicio?: number | string | ApiAmount;
  serviceFee?: number | string | ApiAmount;
  total?: number | string | ApiAmount;
}

interface MonthlyIncomeReportData {
  datosPorMes?: MonthlyIncomeItem[];
  monthlyData?: MonthlyIncomeItem[];
  months?: MonthlyIncomeItem[];
}

interface IncomeEntry {
  fecha: string;
  ingresosBrutos: number;
  ajustes: number;
  tarifaPorServicio: number;
  total: number;
}

interface IncomeReportProps {
  hostUserId?: number;
}

const IncomeReport: React.FC<IncomeReportProps> = ({ hostUserId: _hostUserId }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const currentYear = new Date().getFullYear();

  const {
    data: monthlyIncomeReport,
    isLoading,
    isError,
  } = useGet2<MonthlyIncomeReportData>(
    ['monthly-income-report', currentYear],
    '/MonthlyIncomeReport',
    { year: currentYear }
  );

  const formatCurrency = (amount: number): string => {
    return `BOB ${amount.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const toNumber = (value: number | string | ApiAmount | undefined): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const cleaned = value.replace(/[^\d.-]/g, '');
      const parsed = Number(cleaned);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    if (value && typeof value === 'object') {
      if (typeof value.parsedValue === 'number') return value.parsedValue;
      if (typeof value.source === 'string') {
        const parsed = Number(value.source.replace(/[^\d.-]/g, ''));
        return Number.isFinite(parsed) ? parsed : 0;
      }
    }
    return 0;
  };

  // const incomeData: IncomeEntry[] = useMemo(() => {
  //   const sourceRows =
  //     monthlyIncomeReport?.data?.datosPorMes ||
  //     monthlyIncomeReport?.data?.monthlyData ||
  //     monthlyIncomeReport?.data?.months ||
  //     [];

  //   return sourceRows
  //     .map((row, index) => {
  //       const monthNumber = row.mes || row.month || row.monthNumber || index + 1;
  //       const monthLabel =
  //         row.nombreMes ||
  //         row.monthName ||
  //         `${String(monthNumber).padStart(2, '0')}/${currentYear}`;
  //       const grossIncome = toNumber(row.ingresosBrutos ?? row.grossIncome);
  //       const adjustments = toNumber(row.ajustes ?? row.adjustments);
  //       const total = toNumber(row.total);
  //       const serviceFeeValue = row.tarifaPorServicio ?? row.serviceFee;
  //       const serviceFee =
  //         serviceFeeValue !== undefined
  //           ? toNumber(serviceFeeValue)
  //           : Math.max(0, grossIncome + adjustments - total);

  //       return {
  //         fecha: monthLabel,
  //         ingresosBrutos: grossIncome,
  //         ajustes: adjustments,
  //         tarifaPorServicio: serviceFee,
  //         total,
  //       };
  //     })
  //     .filter((entry) => entry.ingresosBrutos !== 0);
  // }, [monthlyIncomeReport, currentYear]);

  const incomeData: IncomeEntry[] = useMemo(() => {
    const sourceRows =
      monthlyIncomeReport?.data?.datosPorMes ||
      monthlyIncomeReport?.data?.monthlyData ||
      monthlyIncomeReport?.data?.months ||
      [];

    const currentMonth = new Date().getMonth() + 1; // 1 = enero, 9 = septiembre

    const allMonths = sourceRows
      .map((row, index) => {
        const monthNumber = row.mes || row.month || row.monthNumber || index + 1;
        const monthLabel =
          row.nombreMes ||
          row.monthName ||
          `${String(monthNumber).padStart(2, '0')}/${currentYear}`;
        const grossIncome = toNumber(row.ingresosBrutos ?? row.grossIncome);
        const adjustments = toNumber(row.ajustes ?? row.adjustments);
        const total = toNumber(row.total);
        const serviceFeeValue = row.tarifaPorServicio ?? row.serviceFee;
        const serviceFee =
          serviceFeeValue !== undefined
            ? toNumber(serviceFeeValue)
            : Math.max(0, grossIncome + adjustments - total);

        return {
          fecha: monthLabel,
          ingresosBrutos: grossIncome,
          ajustes: adjustments,
          tarifaPorServicio: serviceFee,
          total,
          monthNumber,
        };
      })
      // Solo meses ya concluidos (menores al mes actual) y con ingresos
      .filter((entry) => entry.monthNumber < currentMonth && entry.ingresosBrutos !== 0)
      .sort((a, b) => a.monthNumber - b.monthNumber);

    // Solo el más reciente de los concluidos
    return allMonths.length > 0 ? [allMonths[allMonths.length - 1]] : [];
  }, [monthlyIncomeReport, currentYear]);

  const formatFecha = (fecha: string): string => {
    const parts = fecha.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    if (parts.length === 2) return `${parts[1]}/${parts[0]}`;
    return fecha;
  };

  if (isLoading) {
    return (
      <Box sx={{ py: 3 }}>
        <Typography variant="body2" color="text.secondary">
          {t('incomeReport.loading')}
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ py: 3 }}>
        <Typography variant="body2" color="error">
          {t('incomeReport.error')}
        </Typography>
      </Box>
    );
  }

  if (incomeData.length === 0) {
    return (
      <Box sx={{ py: 3 }}>
        <Typography variant="body2" color="text.secondary">
          {t('incomeReport.noData')}
        </Typography>
      </Box>
    );
  }

  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {incomeData.map((row, index) => (
          <Box key={index}>
            <Box sx={{ py: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 1,
                }}
              >
                <Typography variant="body1" fontWeight={600}>
                  {formatFecha(row.fecha)}
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {row.total}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('incomeReport.tableHeaders.grossIncome')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatCurrency(row.ingresosBrutos)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('incomeReport.tableHeaders.adjustments')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatCurrency(row.ajustes)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  {t('incomeReport.tableHeaders.serviceFee')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatCurrency(row.tarifaPorServicio)}
                </Typography>
              </Box>
            </Box>
            {index < incomeData.length - 1 && <Divider />}
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ borderRadius: '16px', border: '1px solid #e0e0e0' }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="income report table">
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
              <TableCell>{t('incomeReport.tableHeaders.date')}</TableCell>
              <TableCell>{t('incomeReport.tableHeaders.grossIncome')}</TableCell>
              <TableCell>{t('incomeReport.tableHeaders.adjustments')}</TableCell>
              <TableCell>{t('incomeReport.tableHeaders.serviceFee')}</TableCell>
              <TableCell>{t('incomeReport.tableHeaders.total')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incomeData.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:last-child td, &:last-child th': { borderBottom: 0 },
                  '& .MuiTableCell-root': {
                    borderBottom: '1px solid #e5e7eb',
                    '&:last-child': { borderRight: 'none' },
                  },
                }}
              >
                <TableCell component="th" scope="row">
                  {formatFecha(row.fecha)}
                </TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>
                  {formatCurrency(row.ingresosBrutos)}
                </TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>
                  {formatCurrency(row.ajustes)}
                </TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>
                  {formatCurrency(row.tarifaPorServicio)}
                </TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>{formatCurrency(row.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default IncomeReport;
