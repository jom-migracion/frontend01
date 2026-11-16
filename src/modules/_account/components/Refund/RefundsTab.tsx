import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  TextField,
  CircularProgress,
  useTheme,
  Link,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import RefundDetailModal from './RefundDetailModal';
import { ApiService } from '@/services/ApiService';
import { Link as RouterLink, useSearchParams, useLocation } from 'react-router';

// --- INTERFACES ---
export interface PayoutAccount {
  numberAccount?: string;
  formOfPayment?: string;
  provider?: string;
}

export interface RefundDates {
  creationDate?: string | null;
  confirmationData?: string | null;
}

export interface RefundBreakdown {
  nigthsAffecteds?: number;
  platformFee?: number;
  note?: string;
}

export interface RefundTransaction {
  refundId?: string;
  bookId?: string;
  payoutAccount?: PayoutAccount | null;
  typeOfOperation?: string;
  reasonOfOperation?: string;
  amount?: number;
  boookingAmount?: number;
  bookingNights?: number;
  affectedNights?: number;
  bookingCurrency?: string;
  refundStatus?: string;
  payoutStatusId?: number;
  dates?: RefundDates | null;
  breakdown?: RefundBreakdown | null;
  propertyName?: string;
}

export interface RefundReportData {
  userId?: string;
  userRole?: string;
  totalRefunded?: number | null;
  totalPending?: number | null;
  transactions?: RefundTransaction[];
}
// ---------------------------------------------

interface RefundsTabProps {
  userRole: 'HOST' | 'GUEST';
}

const RefundsTab: React.FC<RefundsTabProps> = ({ userRole }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [selectedRefund, setSelectedRefund] = useState<RefundTransaction | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const location = useLocation();
  const autoOpenHandled = useRef(false);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [refundsData, setRefundsData] = useState<RefundTransaction[]>([]);
  const [loading, setLoading] = useState(false);

  const [totalEnProceso, setTotalEnProceso] = useState<number | null>(null);
  const [totalDevuelto, setTotalDevuelto] = useState<number | null>(null);

  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const formatDateLocal = (date: Date) => {
      const year = date.getFullYear();

      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    };

    setStartDate(formatDateLocal(thirtyDaysAgo));
    setEndDate(formatDateLocal(today));
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchRefunds();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, userRole]);

  // Auto-open modal when navigating from /reservation/ with a bookId param
  useEffect(() => {
    if (autoOpenHandled.current) return;
    const bookId = searchParams.get('bookId');
    const fromReservation = location.state?.fromReservation === true;
    if (bookId && fromReservation && refundsData.length > 0) {
      const match = refundsData.find((r) => String(r.bookId) === bookId);
      if (match) {
        setSelectedRefund(match);
        setModalOpen(true);
        autoOpenHandled.current = true;
      }
    }
  }, [refundsData, searchParams, location.state]);

  const fetchRefunds = async () => {
    setLoading(true);
    try {
      const response = await ApiService.get<any>('/Refund/Report', {
        start: startDate,
        end: endDate,
        role: userRole,
      });

      if (response && !response.hasError && response.statusCode === '200') {
        // Mapeo
        const data: RefundReportData = response.data || {};
        setRefundsData(data.transactions || []);
        setTotalDevuelto(data.totalRefunded ?? null);
        setTotalEnProceso(data.totalPending ?? null);
      } else {
        console.error('El servidor devolvió un error:', response?.resultError);
      }
    } catch (error) {
      console.error('Error de red al obtener los reembolsos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = (refund: RefundTransaction) => {
    setSelectedRefund(refund);
    setModalOpen(true);
  };

  // Formatear moneda
  const formatCurrency = (currency?: string | null, amount?: number | null) => {
    if (amount == null) return 'null';
    const symbol = currency === 'BOB' ? 'Bs.' : currency === 'USD' ? '$' : currency || '';
    return `${symbol} ${amount.toFixed(2)}`;
  };

  // Función auxiliar para determinar la configuración visual según el estado
  const getStatusConfig = (status?: string | null) => {
    switch (status) {
      case 'PENDING':
        return {
          label: t('accountSettings.refundsAndPenalties.refunds.table.pending', {
            defaultValue: 'Pendiente',
          }),
          chipBg: theme.palette.customColors.warning[4],
          chipColor: theme.palette.customColors.warning[7],
          btnText: t('accountSettings.refundsAndPenalties.refunds.table.detail', {
            defaultValue: 'Detalle',
          }),
          btnVariant: 'secondary' as const,
        };
      case 'SCHEDULED':
        return {
          label: t('accountSettings.refundsAndPenalties.refunds.table.scheduled', {
            defaultValue: 'Programado',
          }),
          chipBg: theme.palette.customColors.secondary[4],
          chipColor: theme.palette.customColors.primary[1],
          btnText: t('accountSettings.refundsAndPenalties.refunds.table.detail', {
            defaultValue: 'Detalle',
          }),
          btnVariant: 'secondary' as const,
        };
      case 'AUTHORIZED':
        return {
          label: t('accountSettings.refundsAndPenalties.refunds.table.authorized', {
            defaultValue: 'Autorizado',
          }),
          chipBg: theme.palette.customColors.success[4],
          chipColor: theme.palette.customColors.success[7],
          btnText: 'Voucher',
          btnVariant: 'primary' as const,
        };
      default:
        return {
          label:
            status ||
            t('accountSettings.refundsAndPenalties.refunds.table.unknown', {
              defaultValue: 'Desconocido',
            }),
          chipBg: theme.palette.customColors.lights[2],
          chipColor: theme.palette.customColors.lights[7],
          btnText: 'Detalle',
          btnVariant: 'secondary' as const,
        };
    }
  };

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      {/* Filtros */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 4,
          alignItems: { xs: 'stretch', sm: 'center' },
        }}
      >
        <TextField
          label={t('accountSettings.refundsAndPenalties.refunds.filters.start', {
            defaultValue: 'Fecha Inicio',
          })}
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          size="small"
          fullWidth
          sx={{ minWidth: { sm: 150 } }}
        />
        <TextField
          label={t('accountSettings.refundsAndPenalties.refunds.filters.end', {
            defaultValue: 'Fecha Fin',
          })}
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          size="small"
          fullWidth
          sx={{ minWidth: { sm: 150 } }}
        />
        <Button
          variant="primary"
          onClick={fetchRefunds}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
          fullWidth
          sx={{
            mt: '-15px',
            height: '44px',
          }}
        >
          {t('accountSettings.refundsAndPenalties.refunds.filters.search', {
            defaultValue: 'Buscar',
          })}
        </Button>
      </Box>

      {/* Tarjetas Resumen */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
          mb: 4,
        }}
      >
        {/* Tarjeta: Total Devuelto */}
        <Paper
          sx={{
            p: 3,
            bgcolor: theme.palette.customColors.primary[7],
            borderRadius: 1,
            boxShadow: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography
            variant="small1Medium"
            sx={{ color: theme.palette.customColors.primary[2] }}
            gutterBottom
          >
            {t('accountSettings.refundsAndPenalties.refunds.text.textLeft', {
              defaultValue: 'Total Devuelto (Periodo)',
            })}
          </Typography>
          <Typography variant="h4Bold" sx={{ color: theme.palette.customColors.primary[1] }}>
            {totalDevuelto !== null ? formatCurrency('BOB', totalDevuelto) : 'null'}
          </Typography>
        </Paper>

        {/* Tarjeta: En Proceso */}
        <Paper
          sx={{
            p: 3,
            bgcolor: theme.palette.customColors.primary[1],
            borderRadius: 1,
            boxShadow: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography
            variant="small1Medium"
            sx={{ color: theme.palette.customColors.primary[7] }}
            gutterBottom
          >
            {t('accountSettings.refundsAndPenalties.refunds.text.textRight', {
              defaultValue: 'En Proceso Bancario (Tránsito)',
            })}
          </Typography>
          <Typography variant="h4Bold" sx={{ color: theme.palette.customColors.primary[7] }}>
            {totalEnProceso !== null ? formatCurrency('BOB', totalEnProceso) : 'null'}
          </Typography>
        </Paper>
      </Box>

      {/* Tabla */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.neutralBorder || theme.palette.customColors.lights[2]}`,
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: theme.palette.customColors.primary[1] }}>
            <TableRow>
              {[
                t('accountSettings.refundsAndPenalties.refunds.table.refundId', {
                  defaultValue: 'ID Reembolso',
                }),

                t('accountSettings.refundsAndPenalties.refunds.table.bookId', {
                  defaultValue: 'ID Reserva',
                }),

                t('accountSettings.refundsAndPenalties.refunds.table.property', {
                  defaultValue: 'Propiedad',
                }),
                t('accountSettings.refundsAndPenalties.refunds.table.date', {
                  defaultValue: 'Fecha',
                }),
                t('accountSettings.refundsAndPenalties.refunds.table.reason', {
                  defaultValue: 'Motivo / Concepto',
                }),
                t('accountSettings.refundsAndPenalties.refunds.table.amount', {
                  defaultValue: 'Monto',
                }),
                t('accountSettings.refundsAndPenalties.refunds.table.account', {
                  defaultValue: 'Cuenta',
                }),
                t('accountSettings.refundsAndPenalties.refunds.table.status', {
                  defaultValue: 'Estado',
                }),
                t('accountSettings.refundsAndPenalties.refunds.table.action', {
                  defaultValue: 'Acción',
                }),
              ].map((header, i) => (
                <TableCell
                  key={i}
                  sx={{
                    color: theme.palette.customColors.lights[4],
                    ...theme.typography.paragraph1Bold,
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {refundsData.length === 0 && !loading && (
              <TableRow>
                <TableCell
                  colSpan={9}
                  align="center"
                  sx={{ py: 3, ...theme.typography.paragraph1Regular }}
                >
                  {t('accountSettings.refundsAndPenalties.refunds.table.alert', {
                    defaultValue: 'No se encontraron reembolsos.',
                  })}
                </TableCell>
              </TableRow>
            )}
            {refundsData.map((row) => {
              const uiConfig = getStatusConfig(row.refundStatus);

              const montoSeguro = row.boookingAmount ?? null;

              return (
                <TableRow
                  key={row.refundId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" sx={{ ...theme.typography.paragraph1Bold }}>
                    {row.refundId}
                  </TableCell>

                  {/* <TableCell component="th" scope="row" sx={{ ...theme.typography.paragraph1Bold }}>
                                        {row.bookId}
                                    </TableCell> */}

                  <TableCell component="th" scope="row" sx={{ ...theme.typography.paragraph1Bold }}>
                    <Link
                      component={RouterLink}
                      to={`/reservation/${row.bookId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                      color="primary"
                    >
                      {row.bookId}
                    </Link>
                  </TableCell>

                  <TableCell sx={{ ...theme.typography.paragraph1Regular }}>
                    {row.propertyName}
                  </TableCell>
                  <TableCell sx={{ ...theme.typography.paragraph1Regular }}>
                    {row.dates?.creationDate
                      ? new Date(row.dates.creationDate).toLocaleDateString()
                      : 'Pendiente'}
                  </TableCell>
                  <TableCell
                    sx={{
                      ...theme.typography.paragraph1Regular,
                      color: theme.palette.text.secondary,
                      minWidth: 250,
                    }}
                  >
                    {row.reasonOfOperation}
                  </TableCell>
                  <TableCell sx={{ ...theme.typography.paragraph1Bold }}>
                    {formatCurrency(row.bookingCurrency, montoSeguro)}
                  </TableCell>
                  <TableCell sx={{ ...theme.typography.paragraph1Regular }}>
                    {row.payoutAccount?.numberAccount || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={uiConfig.label}
                      size="small"
                      sx={{
                        bgcolor: uiConfig.chipBg,
                        color: uiConfig.chipColor,
                        ...theme.typography.small1Bold,
                        borderRadius: '4px',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={uiConfig.btnVariant}
                      onClick={() => handleOpenDetail(row)}
                      size="small"
                    >
                      {uiConfig.btnText}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Nota al pie */}
      <Typography
        variant="small1Regular"
        sx={{ mt: 4, color: theme.palette.text.secondary, fontStyle: 'italic' }}
      >
        *{' '}
        {t('accountSettings.refundsAndPenalties.refunds.text.textDown', {
          defaultValue:
            'Nota de Pasarela: Los reembolsos descuentan automáticamente el costo bancario original de la pasarela de pagos (FC11).',
        })}
      </Typography>

      <RefundDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        refundData={selectedRefund}
      />
    </Box>
  );
};

export default RefundsTab;
