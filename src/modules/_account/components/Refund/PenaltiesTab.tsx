import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, Button, TextField, CircularProgress,
    Link
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import PenaltyDetailModal from './PenaltyDetailModal';
import { ApiService } from '@/services/ApiService';
import { useTranslation } from 'react-i18next';
//import { Link as RouterLink } from 'react-router';

import { useNavigate } from 'react-router-dom';
import { useViewReservationStore } from '@/store/message.store';
import { useAuthContext } from '@/modules/_auth/context/AuthContext';
import { useSnackbar } from '@/context/SnackbarContext';

// --- INTERFACES ---
export interface PenaltyTransaction {
    penaltyId?: string;
    bookId?: string;
    propertyName?: string;
    ruleApplied?: string;
    supportCode?: string | null;
    concept?: string;
    baseAmount?: number;
    penaltyAmount?: number;
    remainingAmount?: number;
    calculationNote?: string;
    penaltyStatusId?: number;
    penaltyStatus?: string;
    createAt?: string;
    mechanism?: string;
    bookingCurrency?: string;
}

export interface PenaltyReportData {
    userId?: string;
    userRole?: string;
    totalPenalization?: number | null;
    totalPending?: number | null;
    transactions?: PenaltyTransaction[];
}
// ---------------------------------------------

interface PenaltiesTabProps {
    userRole: 'HOST' | 'GUEST';
}

const PenaltiesTab: React.FC<PenaltiesTabProps> = ({ userRole }) => {
    const { t } = useTranslation();
    const theme = useTheme();

    const [selectedPenalty, setSelectedPenalty] = useState<PenaltyTransaction | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [penaltiesData, setPenaltiesData] = useState<PenaltyTransaction[]>([]);
    const [loading, setLoading] = useState(false);

    const [totalPenalization, setTotalPenalization] = useState<number | null>(null);
    const [totalPending, setTotalPending] = useState<number | null>(null);

    // --- NUEVOS HOOKS ---
    const setViewReservation = useViewReservationStore((state: any) => state.setViewReservation);
    const { isHostAuthenticated, changeRole } = useAuthContext();
    const navigate = useNavigate();
    const showSnackbar = useSnackbar();

    // Estado para saber si estamos cargando el detalle de una reserva específica
    const [loadingBookId, setLoadingBookId] = useState<string | null>(null);

    // --- EFECTO NUEVO ---
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const penaltyBookId = queryParams.get('penaltyBookId');

        if (penaltyBookId && penaltiesData.length > 0) {
            // Busca la penalidad dentro de los datos que ya cargó la tabla
            const foundPenalty = penaltiesData.find(p => p.bookId === penaltyBookId);

            if (foundPenalty) {
                setSelectedPenalty(foundPenalty);
                setModalOpen(true);

                // Limpia la URL
                queryParams.delete('penaltyBookId');
                navigate({ search: queryParams.toString() }, { replace: true });
            } else {
                // Si la penalidad no está en la página actual de la tabla (ej. es muy vieja),
                // hará una llamada al reporte ampliando las fechas
                const fetchOldPenalty = async () => {
                    try {
                        const response = await ApiService.get<any>('/Penalty/Report', {
                            start: '2025-01-01', // Una fecha antigua segura
                            end: endDate,
                            role: userRole,
                        });

                        if (response && !response.hasError && response.statusCode === "200") {
                            const allTransactions = response.data?.transactions || [];
                            const oldPenalty = allTransactions.find((p: any) => p.bookId === penaltyBookId);

                            if (oldPenalty) {
                                setSelectedPenalty(oldPenalty);
                                setModalOpen(true);
                            }

                            queryParams.delete('penaltyBookId');
                            navigate({ search: queryParams.toString() }, { replace: true });
                        }
                    } catch (error) {
                        console.error("Error buscando penalidad antigua", error);
                    }
                };
                fetchOldPenalty();
            }
        }
    }, [location.search, navigate, penaltiesData, endDate, userRole]);

    // Inicializar fechas
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
            fetchPenalties();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate, userRole]);

    const fetchPenalties = async () => {
        setLoading(true);
        try {
            const response = await ApiService.get<any>('/Penalty/Report', {
                start: startDate,
                end: endDate,
                role: userRole,
            });

            if (response && !response.hasError && response.statusCode === "200") {
                const data: PenaltyReportData = response.data || {};
                setPenaltiesData(data.transactions || []);
                setTotalPenalization(data.totalPenalization ?? null);
                setTotalPending(data.totalPending ?? null);
            } else {
                console.error("El servidor devolvió un error:", response?.resultError);
            }
        } catch (error) {
            console.error("Error de red al obtener las penalizaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDetail = (penalty: PenaltyTransaction) => {
        setSelectedPenalty(penalty);
        setModalOpen(true);
    };

    const formatCurrency = (currency?: string | null, amount?: number | null) => {
        if (amount == null) return 'null';
        const symbol = currency === 'BOB' ? 'Bs.' : currency === 'USD' ? '$' : (currency || '');
        return `${symbol} ${amount.toFixed(2)}`;
    };

    // Función auxiliar para estados
    const getPenaltyStatusConfig = (status?: string | null) => {
        switch (status) {
            case 'PENDING':
                return {
                    label: t('accountSettings.refundsAndPenalties.penalties.table.pending', { defaultValue: 'Pendiente de ejecución' }),
                    chipBg: theme.palette.customColors.warning[4],
                    chipColor: theme.palette.customColors.warning[7],
                    btnText: t('accountSettings.refundsAndPenalties.penalties.table.detail', { defaultValue: 'Detalle' }),
                    btnVariant: 'secondary' as const
                };
            case 'PARTIAL':
                return {
                    label: t('accountSettings.refundsAndPenalties.penalties.table.partial', { defaultValue: 'Parcialmente aplicado' }),
                    chipBg: theme.palette.customColors.secondary[4],
                    chipColor: theme.palette.customColors.primary[1],
                    btnText: t('accountSettings.refundsAndPenalties.penalties.table.detail', { defaultValue: 'Detalle' }),
                    btnVariant: 'secondary' as const
                };
            case 'COMPLETED':
                return {
                    label: t('accountSettings.refundsAndPenalties.penalties.table.completed', { defaultValue: 'Aplicado (Cobrado)' }),
                    chipBg: theme.palette.customColors.success[4],
                    chipColor: theme.palette.customColors.success[7],
                    btnText: 'Voucher',
                    btnVariant: 'primary' as const
                };
            case 'CANCELLED':
                return {
                    label: t('accountSettings.refundsAndPenalties.penalties.table.cancelled', { defaultValue: 'Cancelado' }),
                    chipBg: theme.palette.customColors.success[4],
                    chipColor: theme.palette.customColors.success[7],
                    btnText: 'Voucher',
                    btnVariant: 'primary' as const
                };
            default:
                return {
                    label: status || t('accountSettings.refundsAndPenalties.penalties.table.unknown', { defaultValue: 'Desconocido' }),
                    chipBg: theme.palette.customColors.lights[2],
                    chipColor: theme.palette.customColors.lights[7],
                    btnText: 'Detalle',
                    btnVariant: 'secondary' as const
                };
        }
    };

    const handleVerReserva = async (e: React.MouseEvent, bookId?: string) => {
        e.preventDefault();
        if (!bookId) return;

        setLoadingBookId(bookId);

        try {
            // Endpoint para obtener la reserva
            const response = await ApiService.get<any>(`/Book/${bookId}`);

            if (response && !response.hasError && response.statusCode === "200") {
                const fullBookingData = response.data; // La data de la reserva

                // Se inyecta la data completa en Zustand para que el DetailPanel la lea
                setViewReservation(fullBookingData);

                // Asegura de estar en modo anfitrión
                if (!isHostAuthenticated) {
                    changeRole('host');
                }

                // Navega al panel principal del anfitrión
                navigate('/host');
            } else {
                showSnackbar(response?.resultError?.message || 'Error al obtener la reserva', 'error');
            }
        } catch (error) {
            console.error("Error al obtener el detalle de la reserva:", error);
            showSnackbar('Error de red al intentar abrir la reserva', 'error');
        } finally {
            setLoadingBookId(null);
        }
    };

    return (
        <Box sx={{ width: '100%', mt: 2 }}>
            {/* Barra de Filtros */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    mb: 4,
                    alignItems: { xs: 'stretch', sm: 'center' }
                }}
            >
                <TextField
                    label={t('accountSettings.refundsAndPenalties.penalties.filters.start', { defaultValue: 'Fecha Inicio' })}
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    slotProps={{ inputLabel: { shrink: true } }}
                    size="small"
                    fullWidth
                    sx={{ minWidth: { sm: 150 } }}
                />
                <TextField
                    label={t('accountSettings.refundsAndPenalties.penalties.filters.end', { defaultValue: 'Fecha Fin' })}
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
                    onClick={fetchPenalties}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                    fullWidth
                    sx={{
                        mt: '-15px',
                        height: '44px'
                    }}
                >
                    {t('accountSettings.refundsAndPenalties.penalties.filters.search', { defaultValue: 'Buscar' })}
                </Button>
            </Box>

            {/* Tarjetas Resumen */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: 3,
                    mb: 4
                }}
            >
                {/* Total Penalizaciones Registradas */}
                <Paper
                    sx={{
                        p: 3,
                        bgcolor: theme.palette.customColors.primary[7],
                        borderRadius: 1,
                        boxShadow: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1
                    }}
                >
                    <Typography variant="small1Medium" sx={{ color: theme.palette.customColors.primary[2] }} gutterBottom>
                        {t('accountSettings.refundsAndPenalties.refunds.text.textLeft', { defaultValue: 'Total Penalizaciones Registradas' })}
                    </Typography>
                    <Typography variant="h4Bold" sx={{ color: theme.palette.customColors.primary[1] }}>
                        {totalPenalization !== null ? formatCurrency('BOB', totalPenalization) : 'null'}
                    </Typography>
                </Paper>

                {/* Pendientes de Descuento */}
                <Paper
                    sx={{
                        p: 3,
                        bgcolor: theme.palette.customColors.primary[1],
                        borderRadius: 1,
                        boxShadow: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1
                    }}
                >
                    <Typography variant="small1Medium" sx={{ color: theme.palette.customColors.primary[7] }} gutterBottom>
                        {t('accountSettings.refundsAndPenalties.penalties.text.textRight', { defaultValue: 'Pendientes de Descuento (Saldo Deudor FC25)' })}
                    </Typography>
                    <Typography variant="h4Bold" sx={{ color: theme.palette.customColors.primary[7] }}>
                        {totalPending !== null ? formatCurrency('BOB', totalPending) : 'null'}
                    </Typography>
                </Paper>
            </Box>

            {/* Tabla de Penalizaciones */}
            <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.neutralBorder || theme.palette.customColors.lights[2]}` }}>
                <Table sx={{ minWidth: 650 }}>
                    {/* Encabezado */}
                    <TableHead sx={{ bgcolor: theme.palette.customColors.primary[1] }}>
                        <TableRow>
                            {[
                                t('accountSettings.refundsAndPenalties.penalties.table.idPenalty', { defaultValue: 'ID Penalización' }),
                                t('accountSettings.refundsAndPenalties.penalties.table.bookId', { defaultValue: 'ID Reserva' }),
                                t('accountSettings.refundsAndPenalties.penalties.table.property', { defaultValue: 'Propiedad afectada' }),
                                t('accountSettings.refundsAndPenalties.penalties.table.date', { defaultValue: 'Fecha de registro' }),
                                t('accountSettings.refundsAndPenalties.penalties.table.concept', { defaultValue: 'Concepto / Regla' }),
                                t('accountSettings.refundsAndPenalties.penalties.table.amount', { defaultValue: 'Monto' }),
                                t('accountSettings.refundsAndPenalties.penalties.table.status', { defaultValue: 'Estado' }),
                                t('accountSettings.refundsAndPenalties.penalties.table.action', { defaultValue: 'Acción' })
                            ].map((header, i) => (
                                <TableCell
                                    key={i}
                                    sx={{
                                        color: theme.palette.customColors.lights[4],
                                        ...theme.typography.paragraph1Bold
                                    }}
                                >
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {penaltiesData.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 3, ...theme.typography.paragraph1Regular }}>
                                    {t('accountSettings.refundsAndPenalties.penalties.table.alert', { defaultValue: 'No se encontraron penalizaciones.' })}
                                </TableCell>
                            </TableRow>
                        )}
                        {penaltiesData.map((row) => {
                            const uiConfig = getPenaltyStatusConfig(row.penaltyStatus);

                            return (
                                <TableRow key={row.penaltyId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row" sx={{ ...theme.typography.paragraph1Bold }}>
                                        {row.penaltyId ?? 'null'}
                                    </TableCell>

                                    {/* <TableCell component="th" scope="row" sx={{ ...theme.typography.paragraph1Bold }}>
                                        {row.bookId}
                                    </TableCell> */}

                                    <TableCell component="th" scope="row" sx={{ ...theme.typography.paragraph1Bold }}>
                                        <Link
                                            href="#"
                                            onClick={(e) => handleVerReserva(e, row.bookId)}
                                            underline="hover"
                                            color="primary"
                                            sx={{
                                                cursor: loadingBookId === row.bookId ? 'wait' : 'pointer',
                                                opacity: loadingBookId === row.bookId ? 0.6 : 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1
                                            }}
                                        >
                                            {row.bookId}
                                            {/* Indicador visual de carga si el usuario hizo clic */}
                                            {loadingBookId === row.bookId && <CircularProgress size={12} color="inherit" />}
                                        </Link>
                                    </TableCell>

                                    <TableCell sx={{ ...theme.typography.paragraph1Regular }}>
                                        {row.propertyName ?? 'null'}
                                    </TableCell>
                                    <TableCell sx={{ ...theme.typography.paragraph1Regular }}>
                                        {row.createAt ? new Date(row.createAt).toLocaleDateString() : 'null'}
                                    </TableCell>
                                    <TableCell sx={{
                                        ...theme.typography.paragraph1Regular,
                                        color: theme.palette.text.secondary,
                                        minWidth: 250
                                    }}>
                                        {row.ruleApplied ? `${row.concept} (${row.ruleApplied})` : (row.concept ?? 'null')}
                                    </TableCell>
                                    <TableCell sx={{ ...theme.typography.paragraph1Bold }}>
                                        {formatCurrency(row.bookingCurrency, row.penaltyAmount)}
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
                                            size="small"
                                            onClick={() => handleOpenDetail(row)}
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
            <Typography variant="small1Regular" sx={{ mt: 4, color: theme.palette.text.secondary, fontStyle: 'italic' }}>
                * {t('accountSettings.refundsAndPenalties.penalties.text.textDown', { defaultValue: 'Nota de Regla FC25: Las penalizaciones pendientes se cargan automáticamente como un saldo deudor contra el siguiente desembolso del infractor.' })}
            </Typography>

            {/* Modal */}
            <PenaltyDetailModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                penaltyData={selectedPenalty}
            />
        </Box>
    );
};

export default PenaltiesTab;