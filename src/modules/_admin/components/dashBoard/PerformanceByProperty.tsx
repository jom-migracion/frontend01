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

interface PropertyPerformanceData {
  listingRentId: number;
  propertyName: string;
  mainPhotoUrl: string;
  reservedNights: number;
  averageNightsPerStay: number;
  occupancyRate: number;
  dateRange: string;
}

interface PerformanceByPropertyProps {
  hostUserId?: number;
  startDate: string;
  endDate: string;
}

const PerformanceByProperty: React.FC<PerformanceByPropertyProps> = ({
  hostUserId,
  startDate,
  endDate,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [visibleItems, setVisibleItems] = useState(3);
  const pageSize = 100;
  const usePagination = false;

  const queryParams = new URLSearchParams({
    startDate,
    endDate,
    hostUserId: (hostUserId ?? '').toString(),
    usePagination: usePagination.toString(),
    pageNumber: '1',
    pageSize: pageSize.toString(),
  });

  const { data, isLoading, isError, error } = useGet2<PropertyPerformanceData[]>(
    ['property-performance', hostUserId, startDate, endDate],
    `/PropertyPerformance?${queryParams.toString()}`,
    {},
    !!hostUserId
  );

  const performanceData: PropertyPerformanceData[] = data?.data ?? [];

  const handleVerMas = () => {
    setVisibleItems((prev) => Math.min(prev + 3, performanceData.length));
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

  // Estados de carga y error
  if (isLoading) {
    return (
      <Stack spacing={2}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
          {t('performanceByProperty.title')}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <Typography>{t('performanceByProperty.loading')}</Typography>
        </Box>
      </Stack>
    );
  }

  if (isError) {
    return (
      <Stack spacing={2}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
          {t('performanceByProperty.title')}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <Typography color="error">
            {t('performanceByProperty.error')} {error?.message || 'Error desconocido'}
          </Typography>
        </Box>
      </Stack>
    );
  }

  const displayedData = performanceData.slice(0, visibleItems);
  const hasMoreItems = visibleItems < performanceData.length;

  const formatOccupancyRate = (rate: number) => {
    return `${rate.toFixed(2)}%`;
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
        {t('performanceByProperty.title')}
      </Typography>
      {isMobile ? (
        <Stack spacing={1.5}>
          {displayedData.map((row: PropertyPerformanceData) => (
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
                    {row.dateRange}
                  </Typography>
                </Box>
              </Box>
              {/* Filas de datos */}
              {[
                {
                  label: t('performanceByProperty.tableHeaders.reservedNights'),
                  value: String(row.reservedNights),
                },
                {
                  label: t('performanceByProperty.tableHeaders.avgNights'),
                  value: String(row.averageNightsPerStay),
                },
                {
                  label: t('performanceByProperty.tableHeaders.occupancyRate'),
                  value: formatOccupancyRate(row.occupancyRate),
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
                <TableCell sx={{ width: '40%' }}>
                  {t('performanceByProperty.tableHeaders.property')}
                </TableCell>
                <TableCell>{t('performanceByProperty.tableHeaders.reservedNights')}</TableCell>
                <TableCell>{t('performanceByProperty.tableHeaders.avgNights')}</TableCell>
                <TableCell>{t('performanceByProperty.tableHeaders.occupancyRate')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedData.map((row: PropertyPerformanceData) => (
                <TableRow key={row.listingRentId} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        src={row.mainPhotoUrl || undefined}
                        sx={{ mr: 2, width: 40, height: 40 }}
                      />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {row.propertyName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDateRange(row.dateRange)}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{row.reservedNights}</TableCell>
                  <TableCell>{row.averageNightsPerStay}</TableCell>
                  <TableCell>{formatOccupancyRate(row.occupancyRate)}</TableCell>
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
            {t('performanceByProperty.viewMore')}
          </Button>
        </Box>
      )}
    </Stack>
  );
};

export default PerformanceByProperty;
