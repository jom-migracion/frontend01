import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Button,
  Paper,
  Popover,
  useTheme,
  useMediaQuery,
  Stack,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { useGet2 } from '@/hooks/api';
import { pdf } from '@react-pdf/renderer';
import RankingPropertiesPDF from './RankingPropertiesPDF';
import { useTranslation } from 'react-i18next';
import { DateRange } from 'react-date-range';
import type { Range, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format, subMonths } from 'date-fns';
import es from 'date-fns/locale/es';

export interface RankingResponse {
  data: PropertyRanking[];
  statusCode: string;
  hasError: boolean;
  resultError: any;
}

export interface PropertyRanking {
  listingRentId: number;
  listingRentTitle: string;
  listingRentDescription: string;
  photoLink: string;
  totalRent: number;
  platformFee: number;
  income: number;
  reservationCount: number;
  occupancyRate: number;
  occupiedDays: number;
}

interface RankingPropertiesProps {
  onBack?: () => void;
  hostId?: number;
  startDate?: string;
  endDate?: string;
}

// Parses "YYYY-MM-DD" as local midnight to avoid UTC offset shifting the date
const parseLocalDateStr = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const RankingProperties: React.FC<RankingPropertiesProps> = ({
  onBack,
  hostId,
  startDate: initialStartDate,
  endDate: initialEndDate,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const initialRange: Range = {
    startDate: initialStartDate ? parseLocalDateStr(initialStartDate) : subMonths(new Date(), 1),
    endDate: initialEndDate ? parseLocalDateStr(initialEndDate) : new Date(),
    key: 'selection',
  };

  const [pendingRange, setPendingRange] = useState<Range[]>([initialRange]);
  const [confirmedRange, setConfirmedRange] = useState<Range>(initialRange);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const { startDate: confirmedStart, endDate: confirmedEnd } = confirmedRange;

  const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const apiStartDate = confirmedStart
    ? formatLocalDate(confirmedStart)
    : formatLocalDate(subMonths(new Date(), 1));

  const apiEndDate = confirmedEnd ? formatLocalDate(confirmedEnd) : formatLocalDate(new Date());

  const buttonText =
    confirmedStart && confirmedEnd
      ? `${format(confirmedStart, 'dd MMM', { locale: es })} - ${format(confirmedEnd, 'dd MMM', { locale: es })}`
      : t('rankingProperties.selectDates');

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPendingRange([confirmedRange]);
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleDateRangeSelect = (rangesByKey: RangeKeyDict) => {
    setPendingRange([rangesByKey.selection]);
  };

  const onApply = () => {
    setConfirmedRange(pendingRange[0]);
    handlePopoverClose();
  };

  const onClear = () => {
    const defaultRange = {
      startDate: subMonths(new Date(), 1),
      endDate: new Date(),
      key: 'selection',
    };
    setPendingRange([defaultRange]);
    setConfirmedRange(defaultRange);
    handlePopoverClose();
  };

  const isPopoverOpen = Boolean(anchorEl);

  const {
    data: rankingResponse,
    isLoading,
    isError,
    error,
  } = useGet2<RankingResponse>(
    ['property-ranking', hostId, apiStartDate, apiEndDate],
    `/Dashboard/GetPropertyRanking?hostId=${hostId}&startDate=${apiStartDate}&endDate=${apiEndDate}`
  );

  if (isLoading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Typography>{t('rankingProperties.loading')}</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Typography>Error: {error?.message || 'Failed to load property ranking'}</Typography>
      </Box>
    );
  }

  // Manejar la respuesta de la API de forma segura
  const properties: PropertyRanking[] = Array.isArray(rankingResponse?.data)
    ? rankingResponse.data
    : Array.isArray(rankingResponse)
      ? rankingResponse
      : [];

  // Función para exportar PDF
  const handleExportPDF = async () => {
    try {
      // Formatear el rango de fechas dinámicamente
      const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'short',
        });
      };

      const pdfDateRange = `${formatDate(apiStartDate)} – ${formatDate(apiEndDate)} ${new Date().getFullYear()}`;

      // Generar el documento PDF
      const doc = <RankingPropertiesPDF properties={properties} dateRange={pdfDateRange} />;
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();

      // Crear URL para descargar
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ranking-propiedades-${new Date().toISOString().split('T')[0]}.pdf`;

      // Simular click para descargar
      document.body.appendChild(link);
      link.click();

      // Limpiar
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert(t('rankingProperties.pdfError'));
    }
  };

  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/host/dashboard/earnings');
    }
  };
  return (
    <Stack spacing={2} m={{ xs: 2 }}>
      <Box>
        <Button
          startIcon={<ArrowBackIcon sx={{ fontSize: '0.9rem' }} />}
          onClick={() => (onBack ? onBack() : handleGoBack())}
          sx={{
            color: 'primary.main',
            textTransform: 'none',
            p: 0,
            mb: 1.5,
            fontWeight: 400,
            fontSize: '0.875rem',
          }}
        >
          Volver al dashboard
        </Button>

        {/* Título */}
        <Typography variant="h5" fontWeight={700} mb={0.5} sx={{ color: '#0f172a' }}>
          {t('rankingProperties.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          {t('rankingProperties.subtitle')}
        </Typography>

        {/* Toolbar */}
        <Box display="flex" flexDirection="row" gap={2} alignItems="center" mb={3}>
          <Button
            variant="outlined"
            endIcon={<ArrowDropDownIcon />}
            onClick={handleClick}
            sx={{
              textTransform: 'none',
              borderColor: '#e2e8f0',
              color: '#1e293b',
              borderRadius: '8px',
              fontWeight: 500,
              '&:hover': { borderColor: '#cbd5e1', backgroundColor: '#f8fafc' },
            }}
          >
            {buttonText}
          </Button>
          <Popover
            open={isPopoverOpen}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: isMobile ? 'center' : 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: isMobile ? 'center' : 'left' }}
            disableAutoFocus
            disableEnforceFocus
            sx={{
              '& .MuiPopover-paper': {
                width: isMobile ? '100vw' : 'auto',
                minWidth: isMobile ? 'unset' : 650,
                maxWidth: isMobile ? '100vw' : 'none',
                overflow: 'auto',
              },
            }}
          >
            {/* <Box p={1} onClick={(e) => e.stopPropagation()} sx={{ overflowX: 'auto' }}> */}
            {/* <DateRange
              className="custom-date-range"
              ranges={pendingRange}
              onChange={handleDateRangeSelect}
              months={isMobile ? 1 : 2}
              direction={isMobile ? 'vertical' : 'horizontal'}
              rangeColors={['#000']}
              showDateDisplay={false}
              editableDateInputs={false}
              moveRangeOnFirstSelection={false}
            /> */}
            {/* <DateRange
              ranges={pendingRange}
              onChange={handleDateRangeSelect}
              months={isMobile ? 1 : 2}
              direction={isMobile ? 'vertical' : 'horizontal'}
              locale={es}
              rangeColors={[theme.palette.customColors?.primary?.[1] || '#3f51b5']}
              showPreview={false}
              showDateDisplay={false}
              editableDateInputs={false}
              moveRangeOnFirstSelection={false}
            /> */}

            <Box sx={{ p: 2 }}>
              <DateRange
                ranges={pendingRange}
                onChange={handleDateRangeSelect}
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
            {/* </Box> */}
          </Popover>
          <Box sx={{ flex: 1 }} />
          <Button
            variant="outlined"
            startIcon={<FileDownloadOutlinedIcon />}
            onClick={handleExportPDF}
            disabled={properties.length === 0}
            sx={{
              textTransform: 'none',
              borderColor: '#e2e8f0',
              color: '#1e293b',
              borderRadius: '8px',
              fontWeight: 500,
              '&:hover': { borderColor: '#cbd5e1', backgroundColor: '#f8fafc' },
            }}
          >
            {t('rankingProperties.exportButton')}
          </Button>
        </Box>

        {/* Contenedor tabla */}
        {isMobile ? (
          <Stack spacing={1.5}>
            {properties.length > 0 ? (
              properties.map((item: PropertyRanking, index: number) => (
                <Paper
                  key={item.listingRentId}
                  variant="outlined"
                  sx={{ borderRadius: '16px', overflow: 'hidden', borderColor: '#e2e8f0' }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      px: 2,
                      py: 1.5,
                      backgroundColor: '#fafafa',
                      borderBottom: '1px solid #e2e8f0',
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={600}
                      sx={{ minWidth: 20 }}
                    >
                      {index + 1}
                    </Typography>
                    <Avatar
                      src={
                        item.photoLink
                          ? item.photoLink.startsWith('http')
                            ? item.photoLink
                            : `https://localhost:44317/resources/listings/${item.photoLink}`
                          : ''
                      }
                      alt={item.listingRentTitle}
                      sx={{ width: 36, height: 36, borderRadius: '8px' }}
                    />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                        {item.listingRentTitle}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.listingRentDescription.length > 40
                          ? `${item.listingRentDescription.substring(0, 40)}...`
                          : item.listingRentDescription}
                      </Typography>
                    </Box>
                  </Box>
                  {[
                    {
                      label: t('rankingProperties.tableHeaders.income'),
                      value: `BOB ${item.income.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`,
                    },
                    {
                      label: t('rankingProperties.tableHeaders.reservations'),
                      value: String(item.reservationCount),
                    },
                    {
                      label: t('rankingProperties.tableHeaders.occupancy'),
                      value: `${item.occupancyRate.toFixed(2)}%`,
                    },
                    {
                      label: t('rankingProperties.tableHeaders.occupiedDays'),
                      value: `${item.occupiedDays} ${t('rankingProperties.tableHeaders.days')}`,
                    },
                  ].map((row, idx, arr) => (
                    <React.Fragment key={idx}>
                      <Box
                        sx={{ display: 'flex', justifyContent: 'space-between', px: 2, py: 1.2 }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {row.label}
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {row.value}
                        </Typography>
                      </Box>
                      {idx < arr.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </Paper>
              ))
            ) : (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {t('rankingProperties.noData')}
                </Typography>
              </Box>
            )}
          </Stack>
        ) : (
          <Paper
            elevation={0}
            sx={{
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#fff' }}>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.72rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: '#94a3b8',
                      borderBottom: '1px solid #e2e8f0',
                      py: 1.5,
                    }}
                  >
                    #
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.72rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: '#94a3b8',
                      borderBottom: '1px solid #e2e8f0',
                      py: 1.5,
                    }}
                  >
                    {t('rankingProperties.tableHeaders.property')}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.72rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: '#94a3b8',
                      borderBottom: '1px solid #e2e8f0',
                      py: 1.5,
                    }}
                  >
                    {t('rankingProperties.tableHeaders.income')}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.72rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: '#94a3b8',
                      borderBottom: '1px solid #e2e8f0',
                      py: 1.5,
                    }}
                  >
                    {t('rankingProperties.tableHeaders.reservations')}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.72rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: '#94a3b8',
                      borderBottom: '1px solid #e2e8f0',
                      py: 1.5,
                    }}
                  >
                    {t('rankingProperties.tableHeaders.occupancy')}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.72rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: '#94a3b8',
                      borderBottom: '1px solid #e2e8f0',
                      py: 1.5,
                    }}
                  >
                    {t('rankingProperties.tableHeaders.occupiedDays')}
                  </TableCell>
                  {/* <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#94a3b8',
                  borderBottom: '1px solid #e2e8f0',
                  py: 1.5,
                }}
              >
                {t('rankingProperties.tableHeaders.actions')}xxxxxx
              </TableCell> */}
                </TableRow>
              </TableHead>

              <TableBody>
                {properties.length > 0 ? (
                  properties.map((item: PropertyRanking, index: number) => (
                    <TableRow
                      key={item.listingRentId}
                      sx={{
                        '&:hover': { backgroundColor: '#f8fafc' },
                        '& .MuiTableCell-root': { borderBottom: '1px solid #f1f5f9', py: 2 },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                          {index + 1}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar
                            src={
                              item.photoLink
                                ? item.photoLink.startsWith('http')
                                  ? item.photoLink
                                  : `https://localhost:44317/resources/listings/${item.photoLink}`
                                : ''
                            }
                            alt={item.listingRentTitle}
                            sx={{ width: 36, height: 36, borderRadius: '8px' }}
                          />
                          <Box>
                            <Typography variant="body2" fontWeight={600} sx={{ color: '#0f172a' }}>
                              {item.listingRentTitle}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.listingRentDescription.length > 50
                                ? `${item.listingRentDescription.substring(0, 50)}...`
                                : item.listingRentDescription}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" fontWeight={700} sx={{ color: '#0f172a' }}>
                          BOB {item.income.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t('rankingProperties.tableHeaders.totalIncome')}{' '}
                          {item.totalRent.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" fontWeight={500} sx={{ color: '#0f172a' }}>
                          {item.reservationCount}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" fontWeight={500} sx={{ color: '#0f172a' }}>
                          {item.occupancyRate.toFixed(2)}%
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" fontWeight={500} sx={{ color: '#0f172a' }}>
                          {item.occupiedDays} {t('rankingProperties.tableHeaders.days')}
                        </Typography>
                      </TableCell>

                      {/* <TableCell>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      onClick={() => handleViewDetail()}
                      sx={{
                        cursor: 'pointer',
                        color: 'primary.main',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      {t('rankingProperties.actions.viewDetail')}
                    </Typography>
                  </TableCell> */}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        {t('rankingProperties.noData')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Box>
    </Stack>
  );
};

export default RankingProperties;
