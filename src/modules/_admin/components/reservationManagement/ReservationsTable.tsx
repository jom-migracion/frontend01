import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  Popover,
  useMediaQuery,
  Card, // Importar Card para la nueva vista
  CardContent, // Importar CardContent
  Stack, // Importar Stack para mejor organización en la tarjeta
  Link, // Importar Link para navegación dentro de la tarjeta
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DownloadDialog from '../dashBoard/DownloadDialog';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import type { Range, RangeKeyDict } from 'react-date-range';
import es from 'date-fns/locale/es';
import { useGet, useGet2 } from '@/hooks/api';
import { esMenorALaFechaActual, formatearFechaYHora } from '@/common/util/dateFunctions';
import { ReservationsTableSkeleton } from './ReservationSkeletons';
import { estadoColorReserva } from '@/common/util/statusFunctios';
import FilterAdDialog from '../dashBoard/FilterAdDialog';
import ReservationsTablePDF from './ReservationsTablePDF';
import { useTranslation } from 'react-i18next';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { formatSemicolon } from '@/common/util/numbersFuntios';

interface ReservationData {
  bookId: string;
  bookStatus: { code: string };
  userIdRenterNavigation: { name: string; lastName: string };
  gests: number;
  checkin: string;
  checkout: string;
  datetimePayment: string;
  listingRent: { name: string; listingRentId?: number };
  listingRentId?: number;
  paymentCode: string;
  amountTotal: string;
}

const ROWS_TO_LOAD = 5;

// **********************************************
// Nuevo Componente: ReservationCard (Vista Móvil)
// **********************************************

const getChipProps = (code: string, theme: any, checkin: any, checkout: any, t: any) => {
  const { small1Medium } = theme.typography;
  const estadoResult: any = estadoColorReserva(code, checkin, checkout);
  const translationKey = estadoResult?.code || 'Desconocido';
  const translatedLabel = t(`reservationsTable.status.${translationKey}`, {
    defaultValue: estadoResult?.estado || '',
  });

  return {
    //label: estadoResult?.estado || '',
    label: translatedLabel,
    sx: {
      backgroundColor: estadoResult?.bg || '',
      color: estadoResult?.color || '',
      fontFamily: small1Medium,
      borderRadius: '50px',
      padding: '2px 8px',
      height: 'auto',
    },
  };
};

const ReservationCard: React.FC<{
  reservation: ReservationData;
  handleReservationClick: (reservation: any, onProcess: boolean) => void;
}> = ({ reservation, handleReservationClick }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const chipProps = getChipProps(
    reservation?.bookStatus?.code,
    theme,
    reservation.checkin,
    reservation.checkout,
    t
  );
  const { small1Medium, small1Regular } = theme.typography;

  return (
    <Card
      key={reservation.bookId}
      variant="outlined"
      sx={{
        mb: 2,
        borderRadius: 2,
        borderColor: '#e0e0e0',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
        },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          {/* Fila superior: Estado y Botón */}
          <Chip size="small" {...chipProps} />
          <Button
            variant="outlined"
            size="small"
            sx={{
              textTransform: 'none',
              color: 'black',
              borderColor: '#e0e0e0',
              backgroundColor: 'white',
              borderRadius: 9,
              padding: '4px 12px',
              minWidth: 'auto',
              fontFamily: small1Regular,
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleReservationClick(reservation, true);
            }}
          >
            {t('reservationsTable.buttons.details')}
          </Button>
        </Stack>

        <Box onClick={() => handleReservationClick(reservation, true)}>
          {/* Huésped */}
          <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1, fontFamily: small1Medium }}>
            {t('reservationsTable.card.guestLabel')}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: small1Regular }}>
            {reservation?.userIdRenterNavigation?.name}{' '}
            {reservation?.userIdRenterNavigation?.lastName} ({reservation?.gests}{' '}
            {t('reservationsTable.table.adult')})
          </Typography>

          {/* Inmueble y Código de Confirmación */}
          <Stack direction="row" spacing={2} mt={1}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold', fontFamily: small1Medium }}>
                {t('reservationsTable.card.propertyLabel')}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: small1Regular }}>
                {reservation?.listingRent?.name}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold', fontFamily: small1Medium }}>
                {t('reservationsTable.card.codeLabel')}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: small1Regular }}>
                {reservation?.paymentCode}
              </Typography>
            </Box>
          </Stack>

          {/* Fechas */}
          <Grid container spacing={1} mt={1}>
            <Grid size={{ xs: 6 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', fontFamily: small1Medium }}>
                {t('reservationsTable.card.datesLabel')}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: small1Regular }}>
                {formatearFechaYHora(reservation?.checkin)?.fecha} -{' '}
                {formatearFechaYHora(reservation?.checkout)?.fecha}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', fontFamily: small1Medium }}>
                {t('reservationsTable.card.bookedLabel')}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: small1Regular }}>
                {formatearFechaYHora(reservation?.datetimePayment)?.fecha}{' '}
                {formatearFechaYHora(reservation?.datetimePayment)?.hora}
              </Typography>
            </Grid>
          </Grid>

          {/* Cobro Total */}
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
            {t('reservationsTable.card.totalLabel')} {reservation?.amountTotal}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// **********************************************
// Componente Principal: ReservationsTable
// **********************************************
const ReservationsTable: React.FC<{
  handleBackToList: () => void;
  seeAllReservations?: boolean;
  handleReservationClick?: (reservation: any, onProcess: boolean) => void;
}> = ({ handleBackToList, seeAllReservations = false, handleReservationClick }) => {
  const { t } = useTranslation();

  const [visibleRowCount, setVisibleRowCount] = useState(ROWS_TO_LOAD);
  const [dateRange, setDateRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  // api
  const { data: ReservationsListUserAll, isLoading: loadingReservationsAll } = useGet2(
    'ReservationsListUserAll',
    `/Book/ReservationsListUser/ALL`,
    [],
    seeAllReservations
  );

  const { data: listingRentPublished } = useGet<any>('listingRentPublished', '/Host/ListingRent', {
    status: 'PUBLISH',
  });

  const { startDate, endDate } = dateRange[0];

  const buttonText =
    startDate && endDate
      ? `${format(startDate, 'dd MMM yyyy', { locale: es })} - ${format(endDate, 'dd MMM yyyy', { locale: es })}`
      : t('reservationsTable.buttons.selectDates');

  const [activeTab, setActiveTab] = useState<number>(0);
  const [openDownloadDialog, setOpenDownloadDialog] = useState<boolean>(false);
  const [openFilterModal, setOpenFilterModal] = useState<boolean>(false);
  const [filteredBookIds, setFilteredBookIds] = useState<number[] | null>(null);
  const [appliedDateRange, setAppliedDateRange] = useState<Range | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const isPopoverOpen = Boolean(anchorEl);
  const [hasDateFilter, setHasDateFilter] = useState<boolean>(false);

  // hooks
  const theme = useTheme();
  // Detecta móvil: sm breakpoint (600px)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleDateRangeSelect = (rangesByKey: RangeKeyDict) => {
    const range = rangesByKey.selection;
    setDateRange([range]);

    // if (range.endDate && range.startDate && range.endDate.getTime() !== range.startDate.getTime()) {
    //   handlePopoverClose();
    // }
  };

  const handleClearDateFilter = () => {
    const today = new Date();
    const newRange = {
      startDate: today,
      endDate: today,
      key: 'selection',
    };
    setDateRange([newRange]);
    setAppliedDateRange(null);
    setFilteredBookIds(null);
    setVisibleRowCount(ROWS_TO_LOAD);
    setHasDateFilter(false);
  };

  // const hasDateFilter = startDate && endDate && startDate.getTime() !== endDate.getTime();

  const getFilteredReservations = (): ReservationData[] => {
    const reservations = Array.isArray(ReservationsListUserAll?.data)
      ? ReservationsListUserAll.data
      : [];
    // console.log('Total reservas obtenidas:', reservations.length);
    // Inicializamos filteredList con todas las reservaciones
    let filteredList = [...reservations];

    // 1. Filtrar por inmuebles (desde FilterAdDialog)
    if (filteredBookIds !== null && filteredBookIds.length > 0) {
      const selectedNames = Array.isArray(listingRentPublished?.data)
        ? listingRentPublished.data
            .filter((item: any) => filteredBookIds.includes(item.listingRentId))
            .map((item: any) => item.listingRentId)
        : [];

      filteredList = filteredList.filter((res) => {
        const rentId = Number(res?.listingRent?.listingRentId || res?.listingRentId);
        const matchById = filteredBookIds.some((id) => Number(id) === rentId);
        const matchByName = Boolean(
          res?.listingRent?.listingRentId && selectedNames.includes(res.listingRent.listingRentId)
        );

        return matchById || matchByName;
      });
    }

    // 2. Filtrar por rango de fechas (solo cuando se aplique)
    const { startDate: appliedStart, endDate: appliedEnd } = appliedDateRange || {};
    if (appliedStart && appliedEnd && appliedStart.getTime() !== appliedEnd.getTime()) {
      const start = new Date(appliedStart);
      start.setHours(0, 0, 0, 0);
      const end = new Date(appliedEnd);
      end.setHours(23, 59, 59, 999);

      filteredList = filteredList.filter((res) => {
        if (!res?.checkin) return false;
        const checkinDate = new Date(res.checkin);
        const checkoutDate = new Date(res.checkout);
        return start <= checkinDate && checkoutDate <= end;
      });
    }

    // 3. Filtrar por estado según el tab activo
    switch (activeTab) {
      case 0: // Próximas
        return filteredList.filter(
          (res) => res?.bookStatus?.code == 'rented' && esMenorALaFechaActual(res?.checkin) == false
        );
      case 1: // Finalizadas
        return filteredList.filter((res) => res?.bookStatus?.code == 'completed');
      case 2: // Canceladas
        return filteredList.filter(
          (res) =>
            res?.bookStatus?.code == 'canceled' ||
            res?.bookStatus?.code == 're_expired' ||
            res?.bookStatus?.code == 'book_expired' ||
            res?.bookStatus?.code == 'non_approved' ||
            res?.bookStatus?.code == 'canceled_payed' ||
            res?.bookStatus?.code == 'canceled_assert'
        );
      case 3:
        return filteredList.filter((res) => res?.bookStatus?.code == 'review');
      case 4: // Todas
        return filteredList;
      default:
        return filteredList;
    }
  };

  const handleLoadMore = () => {
    setVisibleRowCount((prevCount) => prevCount + ROWS_TO_LOAD);
  };

  const filteredReservations = getFilteredReservations();
  const hasMoreReservations = visibleRowCount < filteredReservations.length;
  let reservationsToShow = filteredReservations.slice(0, visibleRowCount);

  // **********************************************
  // Función para obtener las propiedades del Chip (para reutilizar)
  // **********************************************
  const getChipTableProps = (code: string, checkin: any, checkout: any) => {
    return getChipProps(code, theme, checkin, checkout, t); // Reutilizamos la función de ayuda
  };

  // **********************************************
  // Renderizado de la Tabla (Desktop/Tablet)
  // **********************************************
  const renderTableView = () => (
    <React.Fragment>
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: 'none',
          border: '1px solid #e0e0e0',
          borderRadius: '16px',
          overflow: 'hidden',
          overflowX: 'auto',
        }}
      >
        <Table sx={{ minWidth: 900 }} aria-label="reservations table">
          <TableHead>
            <TableRow
              sx={{
                '& .MuiTableCell-root': {
                  backgroundColor: '#fafafa',
                  color: '#555',
                  fontWeight: 500,
                  borderBottom: '1px solid #e0e0e0',
                  fontFamily: theme.typography.paragraph1SMedium,
                },
              }}
            >
              <TableCell>{t('reservationsTable.table.status')}</TableCell>
              <TableCell>{t('reservationsTable.table.guest')}</TableCell>
              <TableCell>{t('reservationsTable.table.arrivalDeparture')}</TableCell>
              <TableCell>{t('reservationsTable.table.booked')}</TableCell>
              <TableCell>{t('reservationsTable.table.property')}</TableCell>
              <TableCell>{t('reservationsTable.table.confirmationCode')}</TableCell>
              <TableCell>{t('reservationsTable.table.totalAmount')}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservationsToShow.map((row: any) => (
              <TableRow key={row.bookId} hover sx={{ cursor: 'pointer' }}>
                <TableCell>
                  <Chip
                    size="small"
                    {...getChipTableProps(row?.bookStatus?.code, row?.checkin, row?.checkout)}
                  />
                </TableCell>
                <TableCell>
                  <Typography
                    variant="small1Medium"
                    component="div"
                    sx={{ fontWeight: 'bold', textDecoration: 'underline' }}
                  >
                    {row?.userIdRenterNavigation?.name} {row?.userIdRenterNavigation?.lastName}
                  </Typography>
                  <Typography variant="small1Regular" color="text.secondary">
                    {row?.gests} adulto
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="small1Regular" component="div">
                    {formatearFechaYHora(row?.checkin)?.fecha}
                  </Typography>
                  <Typography variant="small1Regular">
                    {formatearFechaYHora(row?.checkout)?.fecha}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="small1Regular" component="div">
                    {formatearFechaYHora(row?.datetimePayment)?.fecha}
                  </Typography>
                  <Typography variant="small1Regular">
                    {formatearFechaYHora(row?.datetimePayment)?.hora}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="small1Regular" component="div">
                    {row?.listingRent?.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="small1Regular" component="div">
                    {row?.paymentCode}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="small1Regular" component="div" sx={{ fontWeight: 700 }}>
                    {formatSemicolon(
                      row?.payPriceCalculations?.[0]?.priceCalculation?.hostResume?.amountToCollect
                    )}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="secondary"
                    onClick={() => handleReservationClick && handleReservationClick(row, true)}
                  >
                    {t('reservationsTable.buttons.details')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );

  // **********************************************
  // Renderizado de la Vista de Tarjetas (Mobile)
  // **********************************************
  const renderCardView = () => (
    <Box>
      {reservationsToShow.map((row) => (
        <>
          <ReservationCard
            key={row.bookId}
            reservation={row}
            handleReservationClick={handleReservationClick!}
          />
        </>
      ))}
    </Box>
  );

  const onApplyFilters = (selectedIds: number[]) => {
    const allItemsSelected = selectedIds.length === (listingRentPublished?.data?.length || 0);
    const newFilteredBookIds = allItemsSelected
      ? null
      : selectedIds.length > 0
        ? selectedIds
        : null;

    setFilteredBookIds(newFilteredBookIds);
    setOpenFilterModal(false);
    setVisibleRowCount(ROWS_TO_LOAD);
  };

  return (
    <React.Fragment>
      <Box sx={{ p: isMobile ? 2 : 3, minHeight: '100vh' }}>
        {/* Header Bar (Responsivo) */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 4,
            p: 2,
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <IconButton
            sx={{
              bgcolor: '#F5F5F5',
              '&:hover': { bgcolor: '#e0e0e0' },
              mb: { xs: 2, md: 0 },
            }}
          >
            <ArrowBackIcon onClick={handleBackToList} />
          </IconButton>

          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap',
              justifyContent: { xs: 'flex-start', md: 'flex-end' },
              width: { xs: '100%', md: 'auto' },
            }}
          >
            <Button
              variant="outlined"
              fullWidth={isMobile ? true : false}
              endIcon={<KeyboardArrowDownIcon />}
              sx={{
                textTransform: 'none',
                color: 'black',
                borderColor: '#e0e0e0',
                backgroundColor: 'white',
                '&:hover': {
                  borderColor: '#c0c0c0',
                  backgroundColor: '#f9f9f9',
                },
                fontFamily: theme.typography.paragraph1SRegular,
                borderRadius: '30px',
                minWidth: 150,
                mb: { xs: 1, sm: 0 },
              }}
              onClick={handleClick}
            >
              {buttonText}
            </Button>
            <Button
              id="all-ads-button"
              onClick={() => setOpenFilterModal(true)}
              variant="outlined"
              fullWidth={isMobile ? true : false}
              endIcon={<KeyboardArrowDownIcon />}
              sx={{
                textTransform: 'none',
                color: 'black',
                borderColor: '#e0e0e0',
                backgroundColor: 'white',
                '&:hover': {
                  borderColor: '#c0c0c0',
                  backgroundColor: '#f9f9f9',
                },
                fontFamily: theme.typography.paragraph1SRegular,
                borderRadius: '30px',
                mb: { xs: 1, sm: 0 },
              }}
            >
              {t('reservationsTable.buttons.allAds')}
            </Button>
            <Button
              fullWidth={isMobile ? true : false}
              variant="primary"
              endIcon={<KeyboardArrowDownIcon />}
              sx={{
                textTransform: 'none',
                fontFamily: theme.typography.paragraph1SRegular,
                borderRadius: '30px !important',
                mb: { xs: 1, sm: 0 },
              }}
              onClick={() => setOpenDownloadDialog(true)}
            >
              {t('reservationsTable.buttons.download')}
            </Button>
            {hasDateFilter && (
              <Button
                fullWidth={isMobile ? true : false}
                variant="outlined"
                sx={{
                  textTransform: 'none',
                  color: '#d32f2f',
                  borderColor: '#d32f2f',
                  backgroundColor: 'white',
                  '&:hover': {
                    borderColor: '#b71c1c',
                    backgroundColor: '#ffebee',
                  },
                  fontFamily: theme.typography.paragraph1SRegular,
                  borderRadius: '30px',
                  mb: { xs: 1, sm: 0 },
                }}
                onClick={handleClearDateFilter}
              >
                {t('reservationsTable.buttons.clearFilter')}
              </Button>
            )}
          </Box>
        </Box>

        {/* Popover para DateRangePicker (Responsivo) */}
        <Popover
          open={isPopoverOpen}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          disableAutoFocus={true}
          disableEnforceFocus={true}
          sx={{
            '& .MuiPopover-paper': {
              minWidth: isMobile ? 320 : 650,
              overflow: 'visible',
            },
          }}
        >
          <Box display={'flex'} flexDirection={'column'} onClick={(e) => e.stopPropagation()}>
            <Box display={'flex'} flexDirection={'row'} p={1}>
              <DateRange
                className="custom-date-range"
                ranges={dateRange}
                onChange={handleDateRangeSelect}
                months={isMobile ? 1 : 2}
                direction="horizontal"
                rangeColors={['#000']}
                showDateDisplay={false}
                editableDateInputs={false}
                moveRangeOnFirstSelection={false}
                locale={es}
              />
            </Box>
            <Box
              sx={{
                p: 2,
                borderTop: '1px solid #e0e0e0',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
              }}
            >
              <Button
                fullWidth={isMobile ? true : false}
                variant="outlined"
                onClick={handlePopoverClose}
                sx={{
                  textTransform: 'none',
                  color: 'black',
                  borderColor: '#e0e0e0',
                  fontFamily: theme.typography.paragraph1SRegular,
                  borderRadius: '8px',
                }}
              >
                {t('reservationsTable.buttons.cancel', { defaultValue: 'Cancelar' })}
              </Button>
              <Button
                fullWidth={isMobile ? true : false}
                variant="contained"
                onClick={() => {
                  setAppliedDateRange(dateRange[0]);
                  setHasDateFilter(
                    !!(startDate && endDate && startDate.getTime() !== endDate.getTime())
                  );
                  setVisibleRowCount(ROWS_TO_LOAD);
                  handlePopoverClose();
                }}
                sx={{
                  textTransform: 'none',
                  bgcolor: 'black',
                  color: 'white',
                  fontFamily: theme.typography.paragraph1SRegular,
                  borderRadius: '8px',
                  '&:hover': {
                    bgcolor: '#333',
                  },
                }}
              >
                {t('reservationsTable.buttons.apply', { defaultValue: 'Aplicar' })}
              </Button>
            </Box>
          </Box>
        </Popover>

        {/* Main Content */}
        <Box sx={{ backgroundColor: 'transparent', p: isMobile ? 2 : 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
            {t('reservationsTable.title')}
          </Typography>

          {/* Tabs for reservation status (Responsivo) */}
          <Paper
            sx={{
              mb: 3,
              p: 1,
              backgroundColor: '#f3f3f3',
              borderRadius: 20,
              display: 'inline-flex',
              boxShadow: 'none',
              maxWidth: '100%',
              overflowX: 'auto',
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="reservation status tabs"
              variant={isMobile ? 'scrollable' : 'standard'}
              scrollButtons="auto"
              TabIndicatorProps={{ style: { display: 'none' } }}
              sx={{
                minHeight: 'auto',
                '& .MuiButtonBase-root': {
                  textTransform: 'none',
                  minHeight: 'auto',
                  padding: '5px 20px',
                  borderRadius: '20px',
                  marginRight: '8px',
                  fontWeight: 'normal',
                  whiteSpace: 'nowrap',
                  '&:last-of-type': {
                    marginRight: 0,
                  },
                  fontFamily: theme.typography.paragraph1SRegular,
                },
                '& .Mui-selected': {
                  backgroundColor: 'white',
                },
              }}
            >
              <Tab
                label={t('reservationsTable.tabs.upcoming')}
                sx={{ transition: 'all 0.3s ease-in-out' }}
              />
              <Tab
                label={t('reservationsTable.tabs.finished')}
                sx={{ transition: 'all 0.3s ease-in-out' }}
              />
              <Tab
                label={t('reservationsTable.tabs.canceled')}
                sx={{ transition: 'all 0.3s ease-in-out' }}
              />
              <Tab
                label={t('reservationsTable.tabs.inReview')}
                sx={{ transition: 'all 0.3s ease-in-out' }}
              />
              <Tab
                label={t('reservationsTable.tabs.all')}
                sx={{ transition: 'all 0.3s ease-in-out' }}
              />
            </Tabs>
          </Paper>

          {/* Renderizado Condicional de la Vista */}
          {loadingReservationsAll ? (
            <ReservationsTableSkeleton />
          ) : (
            <React.Fragment>
              {isMobile ? renderCardView() : renderTableView()}

              {hasMoreReservations && (
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Link
                    component="button"
                    type="button"
                    onClick={handleLoadMore}
                    underline="none"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      color: '#5B57D8',
                      fontFamily: theme.typography.paragraph1SMedium,
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Ver todas las reservaciones
                    <OpenInNewIcon sx={{ fontSize: '1rem' }} />
                  </Link>
                </Box>
              )}
            </React.Fragment>
          )}
        </Box>
        <DownloadDialog
          open={openDownloadDialog}
          onClose={() => setOpenDownloadDialog(false)}
          pdfDocument={
            <ReservationsTablePDF reservations={reservationsToShow} dateRangeText={buttonText} />
          }
          fileName="Reporte_Reservaciones.pdf"
          data={reservationsToShow}
          dateRangeText={buttonText}
        />
      </Box>

      <FilterAdDialog
        open={openFilterModal}
        onClose={() => setOpenFilterModal(false)}
        itemsData={Array.isArray(listingRentPublished?.data) ? listingRentPublished.data : []}
        applyFilters={onApplyFilters}
        initialSelected={filteredBookIds}
      />
    </React.Fragment>
  );
};

export default ReservationsTable;
