import React, { useState } from 'react';
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
  Button,
  Link,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { formatearFechaYHora } from '@/common/util/dateFunctions';
import { ReservationsTableSkeleton } from './ReservationSkeletons';
import { estadoColorReserva } from '@/common/util/statusFunctios';
import { useTranslation } from 'react-i18next';
import { formatSemicolon } from '@/common/util/numbersFuntios';

const ROWS_TO_LOAD = 3;

const ScheduledReservationsList: React.FC<{
  ReservationsList?: any;
  handleReservationClick?: (reservation: any, onProcess: boolean) => void;
  isLoading?: boolean;
  filterNext?: boolean;
  filterCodes?: string[];
}> = ({
  ReservationsList,
  handleReservationClick,
  isLoading = false,
  filterNext = false,
  filterCodes = [],
}) => {
  // Estado para controlar cuántas filas se muestran. Inicialmente 3.
  const [visibleRowCount, setVisibleRowCount] = useState(ROWS_TO_LOAD);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { t } = useTranslation();

  const columns = [
    t('scheduledReservations.columns.status'),
    t('scheduledReservations.columns.guest'),
    t('scheduledReservations.columns.dates'),
    t('scheduledReservations.columns.booked'),
    t('scheduledReservations.columns.property'),
    t('scheduledReservations.columns.confirmCode'),
    t('scheduledReservations.columns.total'),
    '', // Columna vacía para el botón de acciones
  ];

  const StatusChip: React.FC<{ status: string; sx?: any; checkin: any; checkout: any }> = ({
    status,
    sx,
    checkin,
    checkout,
  }) => {
    const estadoResult = estadoColorReserva(status, checkin, checkout, 'estado');
    const estadoText = typeof estadoResult === 'string' ? estadoResult : estadoResult?.estado || '';

    return (
      <Box
        component="div"
        sx={{
          borderRadius: '50px',
          padding: '0px',
          fontFamily: typography.small1Medium,
          ...sx,
          width: 'fit-content',
        }}
      >
        {estadoText}
      </Box>
    );
  };

  // hooks
  const { typography } = theme;

  const handleLoadMore = () => {
    // Incrementa el contador de filas visibles por el número de filas a cargar
    setVisibleRowCount((prevCount) => prevCount + ROWS_TO_LOAD);
  };

  // Determina si todavía hay más reservas para cargar
  const hasMoreReservations = visibleRowCount < ReservationsList?.data.length;

  // Filtra las reservas que se van a mostrar
  const reservationsToShow = ReservationsList?.data.slice(0, visibleRowCount);

  return (
    <Box
      sx={{
        p: '0px 2px',
        width: '100%',
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: '1rem', md: '1.125rem' },
          fontWeight: 600,
          color: 'text.primary',
          mb: { xs: 2, md: 3 },
          width: '100%',
          //  maxWidth: 1400,
          mx: 'auto',
        }}
      >
        {t('scheduledReservations.title')}
      </Typography>

      {isLoading ? (
        <ReservationsTableSkeleton />
      ) : (
        <>
          {isMobile ? (
            <Stack spacing={1.25}>
              {Array.isArray(reservationsToShow) &&
                reservationsToShow.map((reservation: any) => {
                  const estadoResult: any = estadoColorReserva(
                    reservation?.bookStatus?.code,
                    reservation?.checkin,
                    reservation?.checkout
                  );

                  if (!filterNext || (filterCodes && filterCodes.includes(estadoResult?.code))) {
                    return (
                      <Card
                        key={reservation?.bookId}
                        elevation={0}
                        sx={{
                          borderRadius: 2.5,
                          border: '1px solid',
                          borderColor: '#dfe3ea',
                          backgroundColor: '#ffffff',
                        }}
                      >
                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <StatusChip
                              status={reservation?.bookStatus?.code ?? ''}
                              sx={{
                                bgcolor: estadoColorReserva(
                                  reservation?.bookStatus?.code ?? '',
                                  reservation?.checkin,
                                  reservation?.checkout,
                                  'bg'
                                ),
                                color:
                                  estadoColorReserva(
                                    reservation?.bookStatus?.code ?? '',
                                    reservation?.checkin,
                                    reservation?.checkout,
                                    'color'
                                  ) || '#6e7785',
                                py: '3px',
                                px: '12px',
                                fontSize: '0.8rem',
                              }}
                              checkin={reservation?.checkin}
                              checkout={reservation?.checkout}
                            />

                            <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                              {'BOB. '}
                              {reservation?.amountTotal}
                            </Typography>
                          </Box>

                          <Typography
                            component="div"
                            sx={{
                              mt: 1.25,
                              fontSize: '0.9rem',
                              fontWeight: 600,
                              color: '#0d2240',
                            }}
                          >
                            {reservation?.userIdRenterNavigation?.name}{' '}
                            {reservation?.userIdRenterNavigation?.lastName}
                          </Typography>

                          <Typography
                            sx={{
                              color: '#667085',
                              mt: 0.1,
                              fontFamily: typography.small1Regular,
                              fontSize: '0.85rem',
                            }}
                          >
                            {reservation?.gests} {t('scheduledReservations.adult')}
                          </Typography>

                          <Box
                            sx={{
                              mt: 1.25,
                              display: 'grid',
                              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                              rowGap: 1.15,
                              columnGap: 1.15,
                            }}
                          >
                            <Box>
                              <Typography
                                sx={{
                                  fontFamily: typography.small1Medium,
                                  fontSize: '0.72rem',
                                  color: '#667085',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.02em',
                                  mb: 0.15,
                                }}
                              >
                                {t('scheduledReservations.columns.dates')}
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: typography.small1Regular,
                                  color: '#1d2939',
                                  fontSize: '0.82rem',
                                }}
                              >
                                {formatearFechaYHora(reservation?.checkin)?.fecha}
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: typography.small1Regular,
                                  color: '#475467',
                                  fontSize: '0.82rem',
                                }}
                              >
                                {formatearFechaYHora(reservation?.checkout)?.fecha}
                              </Typography>
                            </Box>

                            <Box>
                              <Typography
                                sx={{
                                  fontFamily: typography.small1Medium,
                                  fontSize: '0.72rem',
                                  color: '#667085',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.02em',
                                  mb: 0.15,
                                }}
                              >
                                {t('scheduledReservations.columns.booked')}
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: typography.small1Regular,
                                  color: '#1d2939',
                                  fontSize: '0.82rem',
                                }}
                              >
                                {formatearFechaYHora(reservation?.datetimePayment)?.fecha}
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: typography.small1Regular,
                                  color: '#475467',
                                  fontSize: '0.82rem',
                                }}
                              >
                                {formatearFechaYHora(reservation?.datetimePayment)?.hora}
                              </Typography>
                            </Box>

                            <Box>
                              <Typography
                                sx={{
                                  fontFamily: typography.small1Medium,
                                  fontSize: '0.72rem',
                                  color: '#667085',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.02em',
                                  mb: 0.15,
                                }}
                              >
                                {t('scheduledReservations.columns.property')}
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: typography.small1Regular,
                                  fontSize: '0.82rem',
                                  color: '#1d2939',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {reservation?.listingRent?.name}
                              </Typography>
                            </Box>

                            <Box>
                              <Typography
                                sx={{
                                  fontFamily: typography.small1Medium,
                                  fontSize: '0.72rem',
                                  color: '#667085',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.02em',
                                  mb: 0.15,
                                }}
                              >
                                {t('scheduledReservations.columns.confirmCode')}
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: typography.small1Regular,
                                  color: '#1d2939',
                                  fontSize: '0.82rem',
                                }}
                              >
                                {reservation?.paymentCode}
                              </Typography>
                            </Box>
                          </Box>

                          <Button
                            fullWidth
                            variant="outlined"
                            sx={{
                              mt: 1.25,
                              height: 38,
                              borderColor: '#d1d5db',
                              color: '#0d2240',
                              borderRadius: 2,
                              textTransform: 'none',
                              fontFamily: typography.paragraph1SMedium,
                              fontSize: '0.85rem',
                            }}
                            onClick={() =>
                              handleReservationClick && handleReservationClick(reservation, true)
                            }
                          >
                            {t('scheduledReservations.actions.details')}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  }
                })}
            </Stack>
          ) : (
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                borderRadius: 4,
                border: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
                width: '100%',

                // maxWidth: 1600,
                mx: 'auto',
                overflowX: 'auto',
              }}
            >
              <Table sx={{ minWidth: 1000 }} aria-label="lista de reservaciones programadas">
                <TableHead sx={{ bgcolor: '#f8f9fc', p: 0 }}>
                  <TableRow sx={{ p: 0, m: 0 }}>
                    {columns.map((column, index) => (
                      <TableCell
                        key={index}
                        sx={{
                          borderBottom: '1px solid #e0e0e0',
                          padding: '20px 26px',
                          fontFamily: typography.paragraph1SMedium,
                        }}
                      >
                        {column}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {Array.isArray(reservationsToShow) &&
                    reservationsToShow.map((reservation: any) => {
                      const estadoResult: any = estadoColorReserva(
                        reservation?.bookStatus?.code,
                        reservation?.checkin,
                        reservation?.checkout
                      );
                      if (
                        !filterNext ||
                        (filterCodes && filterCodes.includes(estadoResult?.code))
                      ) {
                        return (
                          <TableRow
                            key={reservation?.bookId}
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                              borderBottom: '1px solid #f0f0f0',
                            }}
                          >
                            <TableCell>
                              <StatusChip
                                status={reservation?.bookStatus?.code ?? ''}
                                sx={{
                                  p: '4px 12px',
                                  bgcolor: estadoColorReserva(
                                    reservation?.bookStatus?.code ?? '',
                                    reservation?.checkin,
                                    reservation?.checkout,
                                    'bg'
                                  ),
                                }}
                                checkin={reservation?.checkin}
                                checkout={reservation?.checkout}
                              />
                            </TableCell>

                            <TableCell>
                              <Typography
                                variant="small1Medium"
                                fontWeight="bold"
                                component="div"
                                sx={{ textDecoration: 'underline' }}
                              >
                                {reservation?.userIdRenterNavigation?.name}{' '}
                                {reservation?.userIdRenterNavigation?.lastName}
                              </Typography>
                              <Typography variant="small1Regular" color="text.secondary">
                                {reservation?.gests} {t('scheduledReservations.adult')}
                              </Typography>
                            </TableCell>

                            <TableCell>
                              <Typography variant="small1Regular" component="div">
                                {formatearFechaYHora(reservation?.checkin)?.fecha}
                              </Typography>
                              <Typography variant="small1Regular">
                                {formatearFechaYHora(reservation?.checkout)?.fecha}
                              </Typography>
                            </TableCell>

                            <TableCell>
                              <Typography variant="small1Regular" component="div">
                                {formatearFechaYHora(reservation?.datetimePayment)?.fecha}
                              </Typography>
                              <Typography variant="small1Regular" color="text.secondary">
                                {formatearFechaYHora(reservation?.datetimePayment)?.hora}
                              </Typography>
                            </TableCell>

                            <TableCell>
                              <Typography variant="small1Regular">
                                {reservation?.listingRent?.name}
                              </Typography>
                              {reservation.propertyFloor && (
                                <Typography variant="small1Regular" color="text.secondary">
                                  {reservation.propertyFloor}
                                </Typography>
                              )}
                            </TableCell>

                            <TableCell>
                              <Typography variant="small1Regular">
                                {reservation?.paymentCode}
                              </Typography>
                            </TableCell>

                            <TableCell>
                              <Typography variant="small1Regular">
                                {formatSemicolon(
                                  reservation?.payPriceCalculations?.[0]?.priceCalculation
                                    ?.hostResume?.amountToCollect
                                )}
                              </Typography>
                            </TableCell>

                            <TableCell align="right">
                              <Button
                                variant="secondary"
                                onClick={() =>
                                  handleReservationClick &&
                                  handleReservationClick(reservation, true)
                                }
                              >
                                {t('scheduledReservations.actions.details')}
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      }
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Botón "Ver más" condicional */}
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
                  fontFamily: typography.paragraph1SMedium,
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
        </>
      )}
    </Box>
  );
};

export default ScheduledReservationsList;
