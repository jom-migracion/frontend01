import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Stack,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import { useGet2 } from '@/hooks/api';
import { useTranslation } from 'react-i18next';
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';

// Interfaces para la respuesta del API
interface Pagination {
  totalItemCount: number;
  totalPageCount: number;
  pageSize: number;
  currentPage: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

interface IncomeByPropertyData {
  listingRentId: number;
  propertyName: string;
  mainPhotoUrl: string;
  grossIncome: number;
  adjustments: number;
  serviceFee: number;
  total: number;
  dateRange: string;
}

interface IncomeByPropertyResponse {
  pagination: Pagination;
  statusCode: string;
  data: IncomeByPropertyData[];
  hasError: boolean;
  resultError: any;
}

interface IncomeByPropertyProps {
  hostUserId?: number;
  startDate: string;
  endDate: string;
}

const IncomeByProperty: React.FC<IncomeByPropertyProps> = ({ hostUserId, startDate, endDate }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [visibleItems, setVisibleItems] = useState(3);
  const pageSize = 100;

  const usePagination = false;

  // Construir query parameters
  const queryParams = new URLSearchParams({
    startDate,
    endDate,
    hostUserId: (hostUserId ?? '').toString(),
    usePagination: usePagination.toString(),
    pageNumber: '1',
    pageSize: pageSize.toString(),
  });

  // Llamada al API
  const { data, isLoading, isError, error } = useGet2<IncomeByPropertyData[]>(
    ['income-by-property', hostUserId, startDate, endDate],
    `/IncomeByProperty?${queryParams.toString()}`,
    {},
    !!hostUserId
  );

  // Obtener los datos del API
  const incomeData: IncomeByPropertyData[] = data?.data ?? [];

  const handleVerMas = () => {
    setVisibleItems((prev) => Math.min(prev + 3, incomeData.length));
  };

  // Estados de carga y error
  if (isLoading) {
    return (
      <Stack spacing={2}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
          {t('incomeByProperty.title')}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <Typography>{t('incomeByProperty.loading')}</Typography>
        </Box>
      </Stack>
    );
  }

  if (isError) {
    return (
      <Stack spacing={2}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
          {t('incomeByProperty.title')}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <Typography color="error">
            {t('incomeByProperty.error')} {error?.message || 'Error desconocido'}
          </Typography>
        </Box>
      </Stack>
    );
  }

  // Lógica para mostrar de 3 en 3
  const displayedData = incomeData.slice(0, visibleItems);
  const hasMoreItems = visibleItems < incomeData.length;

  // Función para formatear números a formato BOB
  const formatCurrency = (amount: number) => {
    return `BOB ${amount.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`;
  };

  const formatDateRange = (rangeString: string): string => {
    try {
      const [startStr, endStr] = rangeString.split(' - ').map((s) => s.trim());

      const formatDate = (dateString: string): string => {
        // parse interpreta la fecha en hora local
        const date = parse(dateString, 'yyyy-MM-dd', new Date());
        return format(date, 'dd/MM/yyyy', { locale: es });
      };

      return `${formatDate(startStr)} - ${formatDate(endStr)}`;
    } catch {
      return rangeString;
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
        {t('incomeByProperty.title')}
      </Typography>

      {isMobile ? (
        /* Mobile: card por propiedad */
        <Stack spacing={1.5}>
          {displayedData.map((row: IncomeByPropertyData) => (
            <Paper
              key={row.listingRentId}
              variant="outlined"
              sx={{ borderRadius: '16px', overflow: 'hidden', borderColor: '#e0e0e0' }}
            >
              {/* Cabecera de la card con avatar y nombre */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1.5,
                  backgroundColor: '#fafafa',
                  borderBottom: '1px solid #e0e0e0',
                }}
              >
                <Avatar src={row.mainPhotoUrl || undefined} sx={{ width: 36, height: 36 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#555' }}>
                    {row.propertyName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDateRange(row.dateRange)}
                  </Typography>
                </Box>
              </Box>
              {/* Filas de datos */}
              {[
                {
                  label: t('incomeByProperty.tableHeaders.grossIncome'),
                  value: formatCurrency(row.grossIncome),
                },
                {
                  label: t('incomeByProperty.tableHeaders.adjustments'),
                  value: formatCurrency(row.adjustments),
                },
                {
                  label: t('incomeByProperty.tableHeaders.serviceFee'),
                  value: formatCurrency(row.serviceFee),
                },
              ].map((item, idx, arr) => (
                <React.Fragment key={idx}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, py: 1.2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {item.label}
                    </Typography>
                    <Typography variant="body2">{item.value}</Typography>
                  </Box>
                  {idx < arr.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Paper>
          ))}
        </Stack>
      ) : (
        /* Desktop: tabla estilo FinancialTable */
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{ borderRadius: '16px', borderColor: '#e0e0e0' }}
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
                <TableCell sx={{ width: '30%' }}>
                  {t('incomeByProperty.tableHeaders.property')}
                </TableCell>
                <TableCell>{t('incomeByProperty.tableHeaders.date')}</TableCell>
                <TableCell>{t('incomeByProperty.tableHeaders.grossIncome')}</TableCell>
                <TableCell>{t('incomeByProperty.tableHeaders.adjustments')}</TableCell>
                <TableCell>{t('incomeByProperty.tableHeaders.serviceFee')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedData.map((row: IncomeByPropertyData) => (
                <TableRow key={row.listingRentId} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        src={row.mainPhotoUrl || undefined}
                        sx={{ mr: 2, width: 40, height: 40 }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {row.propertyName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{formatDateRange(row.dateRange)}</Typography>
                  </TableCell>
                  <TableCell>{formatCurrency(row.grossIncome)}</TableCell>
                  <TableCell>{formatCurrency(row.adjustments)}</TableCell>
                  <TableCell>{formatCurrency(row.serviceFee)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {hasMoreItems && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="outlined"
            onClick={handleVerMas}
            sx={{ borderColor: '#e0e0e0', color: 'text.primary', textTransform: 'none' }}
          >
            {t('incomeByProperty.viewMore')}
          </Button>
        </Box>
      )}
    </Stack>
  );
};

export default IncomeByProperty;
