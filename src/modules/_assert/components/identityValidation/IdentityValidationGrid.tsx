// src/modules/_assert/components/identityValidation/IdentityValidationGrid.tsx

import React, { useState, useRef } from 'react';
import {
    Box,
    Button,
    //Dialog,
    //DialogActions,
    //DialogContent,
    //DialogTitle,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    //IconButton,
    useTheme,
    useMediaQuery,
    Pagination,
    CircularProgress,
    Tabs,
    Tab,
    //Slide,
    //alpha,
    Stack,
} from '@mui/material';
//import CheckCircleIcon from '@mui/icons-material/CheckCircle';
//import CancelIcon from '@mui/icons-material/Cancel';
//import CloseIcon from '@mui/icons-material/Close';
//import VisibilityIcon from '@mui/icons-material/Visibility';
import CircleIcon from '@mui/icons-material/Circle';
//import FactCheckIcon from '@mui/icons-material/FactCheck';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

// --- HOOKS ---
import { useGet, useCustomMutationByUrl } from '@/hooks/api';
//import { TransitionProps } from '@mui/material/transitions';
import { useNotification } from '@/context/NotificationContext';
import CustomDialog from '@/components/CustomDialog';

// ----------------------------------------------------------------------
// 0. TRANSICIÓN ANIMADA
// ----------------------------------------------------------------------
/* const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
}); */

// ----------------------------------------------------------------------
// 1. Interfaces
// ----------------------------------------------------------------------
interface BackendDoc {
    userVerifyDocId: number;
    userVerifyDocTypeName: string; // "Cedula de Identidad"
    docLink: string;               // URL de la imagen
    description: string;
    status: string;
}

interface BackendVerificationItem {
    userVerifyId: number;
    userId: number;
    userName: string;
    userFullName: string;
    estadoCodigo: string; // "PEN", "APR", "REJ"
    fechaSolicitud: string;
    numero: string;
    documents: BackendDoc[];
}

/* interface BackendDetailData {
    userId: number;
    documents: BackendDoc[];
} */

interface BackendDetailResponse {
    userVerifyId: number;
    userId: number;
    userVerifyStatusCode: string;
    documents: BackendDoc[];
}

// Colores visuales
const STATUS_COLORS = {
    PENDIENTE: '#ff9800', // Naranja
    VALIDADO: '#4caf50',  // Verde
    RECHAZADO: '#f44336', // Rojo
};

const IdentityValidationGrid: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const tableRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();
    const showNotification = useNotification();

    // --- VARIABLES DE ESTILO ---
    //const brandColor = theme.palette.customColors.primary[1] || theme.palette.primary.main;

    // --- ESTADOS ---
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10; // Tamaño de página

    // Estado para el filtro: '' (Todos), 'PEN', 'APR', 'REJ'
    const [filterStatus, setFilterStatus] = useState<string>('PEN'); // Default: Pendientes

    const [openModal, setOpenModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<BackendVerificationItem | null>(null);

    // ----------------------------------------------------------------------
    // 2. LECTURA DE DATOS (useGet)
    // ----------------------------------------------------------------------
    const { data: response, isLoading } = useGet<BackendVerificationItem[]>(
        ['identityPending', currentPage, filterStatus],        // Key única para caché
        '/GetPendingVerifications', // Endpoint
        {
            pageNumber: currentPage,
            pageSize: pageSize,
            statusFilter: filterStatus
        }
    );

    const rows = response?.data || [];
    const pagination = response?.pagination;

    // ----------------------------------------------------------------------
    // 3. LECTURA DE DETALLE (Documentos en el Modal)
    // ----------------------------------------------------------------------
    const targetUserId = selectedUser?.userId;

    const { data: detailResponse, isLoading: loadingDetail } = useGet<BackendDetailResponse>(
        ['identityDetail', targetUserId],
        `/GetUserVerificationWithDocs/${targetUserId}`, // El servicio que pediste
        {},
        !!targetUserId && openModal // Solo se ejecuta si el modal está abierto y hay usuario
    );

    // Helper para obtener la imagen segura desde el detalle
    /* const getDetailImage = () => {
        const data = detailResponse?.data || detailResponse;
        const item = Array.isArray(data) ? data[0] : data;

        if (item && item.documents && item.documents.length > 0) {
            return item.documents[0].docLink;
        }
        return null;
    }; */

    // --- HELPER ACTUALIZADO: Devuelve el ARRAY de documentos, no solo uno ---
    const getDetailDocs = (): BackendDoc[] => {
        const data = detailResponse?.data || detailResponse;
        const item = Array.isArray(data) ? data[0] : data;

        if (item && item.documents && Array.isArray(item.documents)) {
            return item.documents;
        }
        return [];
    };

    const documentsToShow = getDetailDocs();

    // ----------------------------------------------------------------------
    // 4. ESCRITURA DE DATOS (Aprobar/Rechazar)
    // ----------------------------------------------------------------------
    // invalidateKey: ['identityPending'] hará que useGet se ejecute de nuevo automáticamente
    /* const { mutate: updateStatus, isPending: isUpdating } = usePost2(
        '/ApproveRejectUserVerification/{userVerifyId}?action=APR|REJ',
        ['identityPending']
    ); */

    const { mutate: executeDecision, isPending: isUpdating } = useCustomMutationByUrl(
        'put', // Método PUT
        () => {
            handleCloseModal();
        }
    );

    // ----------------------------------------------------------------------
    // 5. HANDLERS
    // ----------------------------------------------------------------------
    const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
        // Scroll suave al inicio de la tabla
        tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleFilterChange = (event: React.SyntheticEvent, newValue: string) => {
        setFilterStatus(newValue);
        setCurrentPage(1); // IMPORTANTE: Resetear a página 1 al cambiar filtros
    };

    const handleOpenValidate = (user: BackendVerificationItem) => {
        setSelectedUser(user);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedUser(null);
    };

    const handleDecision = (decision: 'VALIDADO' | 'RECHAZADO') => {
        if (!selectedUser) return;

        const actionCode = decision === 'VALIDADO' ? 'APR' : 'REJ';
        const comments = decision === 'VALIDADO'
            ? 'Validado correctamente'
            : 'Documentación inconsistente';

        // URL dinámica
        const finalUrl = `/ApproveRejectUserVerification/${selectedUser.userVerifyId}?action=${actionCode}&comments=${encodeURIComponent(comments)}`;

        // Ejecutar mutación
        executeDecision(
            {
                url: finalUrl,
                data: {} // Body vacío, los datos van en la URL
            },
            {
                onSuccess: () => {
                    showNotification('success', t('identityValidation.modal.title'), decision === 'VALIDADO' ? 'Usuario validado con éxito' : 'Usuario rechazado');
                    handleCloseModal();
                },
                onError: (error: any) => {
                    // Intentamos obtener 'resultError' (tu estructura) o 'message', o fallback
                    const errorMessage = error?.response?.data?.resultError 
                                      || error?.response?.data?.message 
                                      || error?.message 
                                      || 'Ocurrió un error al procesar la solicitud';

                    showNotification('error', t('identityValidation.modal.title'), errorMessage);
                }
            }
        );
        /* {
            onSuccess: () => {
                handleCloseModal();
            },
            onError: (err) => {
                console.error(err);
                alert("Ocurrió un error al actualizar el estado.");
            }
        }
    ); */
    };

    // --- HELPERS DE VISUALIZACIÓN ---

    // Mapear códigos de backend a claves de traducción y colores
    const getStatusConfig = (codigo: string) => {
        const code = codigo || 'PEN';
        if (code === 'APR') return { key: 'validated', color: STATUS_COLORS.VALIDADO, text: 'VALIDADO' };
        if (code === 'REJ' || code === 'CAN') return { key: 'rejected', color: STATUS_COLORS.RECHAZADO, text: 'RECHAZADO' };
        return { key: 'pending', color: STATUS_COLORS.PENDIENTE, text: 'PENDIENTE' };
    };

    const getMainDoc = (user: BackendVerificationItem | null) => {
        if (user && user.documents && user.documents.length > 0) {
            return user.documents[0];
        }
        return { userVerifyDocTypeName: 'N/A', docLink: '', description: '---' };
    };

    const getStatusTranslation = (statusKey: string) => {
        return t(`identityValidation.status.${statusKey}`);
    };

    return (
        <Box ref={tableRef}>
            {/* --- SECCIÓN DE FILTROS (TABS) --- */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs
                    value={filterStatus}
                    onChange={handleFilterChange}
                    aria-label="identity status tabs"
                    textColor="primary"
                    indicatorColor="primary"
                >
                    {/* <Tab label={t('identityValidation.status.all') || "Todos"} value="" /> */}
                    <Tab label={t('identityValidation.status.pending') || "Pendientes"} value="PEN" />
                    <Tab label={t('identityValidation.status.validated') || "Aprobados"} value="APR" />
                    <Tab label={t('identityValidation.status.rejected') || "Rechazados"} value="REJ" />
                </Tabs>
            </Box>

            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                    borderRadius: '16px',
                    border: '1px solid #e0e0e0',
                    minHeight: 300
                }}
            >
                <Table sx={{ minWidth: 650 }} aria-label="identity validation table">
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('identityValidation.table.status')}</TableCell>
                            <TableCell>{t('identityValidation.table.requestDate')}</TableCell>
                            <TableCell>{t('identityValidation.table.documentType')}</TableCell>
                            <TableCell>{t('identityValidation.table.documentNumber')}</TableCell>
                            <TableCell>{t('identityValidation.table.fullName')}</TableCell>
                            <TableCell>{t('identityValidation.table.action')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    <Typography color="text.secondary">{t('identityValidation.table.message')}</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row) => {
                                const statusInfo = getStatusConfig(row.estadoCodigo);
                                const docInfo = getMainDoc(row);
                                const displayDate = row.fechaSolicitud ? format(new Date(row.fechaSolicitud), 'dd/MM/yyyy') : '';

                                return (
                                    <TableRow
                                        key={row.userVerifyId}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <CircleIcon sx={{ fontSize: 10, color: statusInfo.color, mr: 1 }} />
                                                <Typography variant="body2" sx={{ fontFamily: theme.typography.body2 }}>
                                                    {getStatusTranslation(statusInfo.key)}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ color: 'text.secondary' }}>{displayDate}</TableCell>
                                        <TableCell>{docInfo.userVerifyDocTypeName}</TableCell>
                                        <TableCell sx={{ color: 'text.secondary' }}>{row.numero || '---'}</TableCell>
                                        <TableCell>{row.userFullName}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="primary"
                                                //size="small"
                                                //startIcon={row.estadoCodigo === 'PEN' ? <FactCheckIcon /> : <VisibilityIcon />}
                                                /* sx={{
                                                    textTransform: 'none',
                                                    fontWeight: 700,
                                                    borderRadius: '16px',
                                                    px: 2,
                                                    fontSize: '0.85rem',
                                                    color: 'white',
                                                    bgcolor: brandColor,
                                                    borderColor: alpha(brandColor, 0.5),
                                                    '&:hover': {
                                                        bgcolor: alpha(brandColor, 0.9),
                                                        transform: 'translateY(-1px)',
                                                        boxShadow: `0 4px 8px ${alpha(brandColor, 0.15)}`
                                                    },
                                                }} */
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenValidate(row);
                                                }}
                                            >
                                                {/* Lógica del Texto: Si es Pendiente "Validar", si no "Ver" */}
                                                {row.estadoCodigo === 'PEN'
                                                    ? t('identityValidation.actions.validate')
                                                    : (t('identityValidation.actions.view') || 'Ver')
                                                }
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* SECCIÓN DE PAGINACIÓN */}
            {pagination && pagination.totalPageCount >= 1 && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        my: 4,
                        width: '100%',
                    }}
                >
                    <Pagination
                        count={pagination.totalPageCount}
                        page={currentPage}
                        onChange={handlePageChange}
                        size={isMobile ? 'medium' : 'large'}
                        showFirstButton
                        showLastButton
                        siblingCount={0}
                        boundaryCount={1}
                        color="primary"
                        variant="text"
                        disabled={isLoading}
                    />
                </Box>
            )}

            {/* EMERGENTE (Modal de Validación) */}

            <CustomDialog
                isOpen={openModal}
                onClose={!isUpdating ? handleCloseModal : () => { }}
                title={t('identityValidation.modal.title')}
                maxWidth="lg"
            >
                <Box sx={{ minHeight: '400px', display: 'flex', flexDirection: 'column', gap: 2, position: 'relative' }}>

                    {/* Loader superpuesto */}
                    {isUpdating && (
                        <Box sx={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            bgcolor: 'rgba(255,255,255,0.8)', zIndex: 10,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {selectedUser && (
                        <>
                            {/* INFO DE USUARIO - REGLA DE TIPOGRAFIA */}
                            <Box sx={{ mb: 2, mt: 1 }}>
                                <Typography sx={{ mb: 0.5, fontFamily: theme.typography.body1, color: theme.palette.text.primary }}>
                                    <Box component="span" sx={{ fontWeight: 'bold' }}>
                                        {t('identityValidation.modal.userLabel')}:
                                    </Box>{' '}
                                    <Box component="span" sx={{ fontStyle: 'italic', color: theme.palette.text.secondary }}>
                                        {selectedUser.userFullName}
                                    </Box>
                                </Typography>

                                <Typography sx={{ fontFamily: theme.typography.body1, color: theme.palette.text.primary }}>
                                    <Box component="span" sx={{ fontWeight: 'bold' }}>
                                        {t('identityValidation.modal.documentLabel')}:
                                    </Box>{' '}
                                    <Box component="span" sx={{ fontStyle: 'italic', color: theme.palette.text.secondary }}>
                                        {getMainDoc(selectedUser).userVerifyDocTypeName}
                                    </Box>
                                </Typography>
                            </Box>

                            {/* CONTENEDOR DE IMÁGENES */}
                            <Box sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 2,
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                                width: '100%',
                                border: '1px solid #e0e0e0',
                                borderRadius: 2,
                                p: 2,
                                minHeight: 300,
                                bgcolor: '#fafafa'
                            }}>
                                {loadingDetail ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', height: 300 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : documentsToShow.length > 0 ? (
                                    documentsToShow.map((doc, index) => {
                                        // LOGICA: 0 -> Anverso, 1 -> Reverso
                                        const sideLabel = index === 0
                                            ? t('identityValidation.sides.front') || 'Anverso'
                                            : t('identityValidation.sides.back') || 'Reverso';

                                        return (
                                            <Box key={doc.userVerifyDocId || index} sx={{ textAlign: 'center', maxWidth: { xs: '100%', sm: '45%' }, width: '100%' }}>
                                                <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                                    {sideLabel}
                                                </Typography>

                                                <Box
                                                    component="img"
                                                    src={doc.docLink}
                                                    alt={`${sideLabel} - ${doc.userVerifyDocTypeName}`}
                                                    sx={{
                                                        maxWidth: '100%',
                                                        maxHeight: '400px',
                                                        objectFit: 'contain',
                                                        boxShadow: 2,
                                                        borderRadius: 1,
                                                        bgcolor: 'white'
                                                    }}
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.onerror = null;
                                                        target.src = "/images/logoBlack.png"; // Fallback
                                                    }}
                                                />
                                                <Box mt={1}>
                                                    <Button
                                                        variant="secondary"
                                                        //size="small"
                                                        href={doc.docLink}
                                                        target="_blank"
                                                    >
                                                        {t('identityValidation.modal.linkImage') || "Ver imagen"}
                                                    </Button>
                                                </Box>
                                            </Box>
                                        );
                                    })
                                ) : (
                                    <Box sx={{ display: 'flex', alignItems: 'center', height: 300 }}>
                                        <Typography color="text.secondary">{t('identityValidation.modal.messageModal')}</Typography>
                                    </Box>
                                )}
                            </Box>
                        </>
                    )}

                    {/* ACTIONS / FOOTER */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column-reverse', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2
                    }}
                    >
                        {/* Botón Cerrar (Secondary) a la izquierda */}
                        <Button
                            onClick={handleCloseModal}
                            variant="secondary"
                            disabled={isUpdating}
                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                        >
                            {t('identityValidation.actions.close')}
                        </Button>

                        {/* Botones de acción a la derecha */}
                        {selectedUser?.estadoCodigo === 'PEN' && (
                            <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
                                <Stack direction="row" spacing={2}>
                                    <Button
                                        onClick={() => handleDecision('RECHAZADO')}
                                        variant="error"
                                        disabled={isUpdating || loadingDetail}
                                        fullWidth
                                    >
                                        {t('identityValidation.actions.reject')}
                                    </Button>
                                    <Button
                                        onClick={() => handleDecision('VALIDADO')}
                                        variant="primary"
                                        disabled={isUpdating || loadingDetail}
                                        fullWidth
                                    >
                                        {t('identityValidation.actions.approve')}
                                    </Button>
                                </Stack>
                            </Box>
                        )}
                    </Box>
                </Box>
            </CustomDialog>

            {/* <Dialog
                open={openModal}
                onClose={!isUpdating ? handleCloseModal : undefined}
                maxWidth="lg"
                fullWidth
                scroll="paper"
                slots={{ transition: Transition }}
                slotProps={{
                    backdrop: {
                        sx: {
                            backdropFilter: 'blur(12px)', // Efecto Blur estilo premium
                            backgroundColor: 'rgba(25, 30, 45, 0.6)',
                        },
                    },
                }}
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: { xs: 0, sm: '24px' }, // Bordes redondeados
                        margin: { xs: 0, sm: 4 },
                        maxHeight: { xs: '100%', sm: '85vh' },
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // Sombra suave
                        overflow: 'hidden',
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        px: 3, py: 2.5,
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: theme.typography.h6Medium,
                            fontWeight: 700,
                            fontSize: '1.1rem',
                        }}
                    >
                        {t('identityValidation.modal.title')}
                    </Typography>
                    <IconButton
                        onClick={handleCloseModal}
                        disabled={isUpdating}
                        sx={{
                            position: 'absolute',
                            right: 12,
                            top: 12,
                            color: theme.palette.grey[400],
                            zIndex: 10,
                            transition: 'all 0.2s',
                            '&:hover': {
                                color: theme.palette.grey[700],
                                backgroundColor: alpha(theme.palette.grey[200], 0.5),
                                transform: 'rotate(90deg)',
                            },
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>

                <DialogContent
                    sx={{
                        px: 3,
                        py: 4,
                        bgcolor: '#ffffff',
                        minHeight: '400px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        position: 'relative',
                        // Scrollbar personalizado
                        '&::-webkit-scrollbar': { width: '5px' },
                        '&::-webkit-scrollbar-thumb': { bgcolor: alpha(brandColor, 0.2), borderRadius: 10 },
                    }}
                > */}
            {/* Loader superpuesto al guardar */}
            {/* {isUpdating && (
                        <Box sx={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            bgcolor: 'rgba(255,255,255,0.8)', zIndex: 10,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {selectedUser && (
                        <>
                            <Box sx={{ mb: 2, my: 2 }}>
                                <Typography variant="body1" sx={{ mb: 0.5 }}>
                                    <Box component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                        {t('identityValidation.modal.userLabel')}:
                                    </Box>{' '}
                                    <Box component="span" sx={{ fontStyle: 'italic', color: 'text.primary' }}>
                                        {selectedUser.userFullName}
                                    </Box>
                                </Typography>

                                <Typography variant="body2" gutterBottom>
                                    <Box component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                        {t('identityValidation.modal.documentLabel')}:
                                    </Box>{' '}
                                    <Box component="span" sx={{ fontStyle: 'italic', color: 'text.primary' }}>
                                        {getMainDoc(selectedUser).userVerifyDocTypeName}
                                    </Box>
                                </Typography>
                            </Box> */}

            {/* CONTENEDOR DE IMÁGENES (Soporta múltiples) */}
            {/* <Box sx={{
                                display: 'flex',
                                flexWrap: 'wrap', // bajan si no caben
                                gap: 2,
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                                width: '100%',
                                border: `1px solid ${alpha(brandColor, 0.1)}`,
                                borderRadius: '16px',
                                p: 2,
                                minHeight: 300,
                                bgcolor: alpha(brandColor, 0.02)
                            }}>
                                {loadingDetail ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', height: 300 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : documentsToShow.length > 0 ? (
                                    // MAPEO DE DOCUMENTOS
                                    documentsToShow.map((doc, index) => {
                                        // LOGICA: 0 -> Anverso, 1 -> Reverso
                                        const sideLabel = index === 0
                                            ? t('identityValidation.sides.front') || 'Anverso'
                                            : t('identityValidation.sides.back') || 'Reverso';

                                        return (
                                            <Box key={doc.userVerifyDocId || index} sx={{ textAlign: 'center', maxWidth: '45%' }}>
                                                <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                                                    <Box component="span" sx={{ color: brandColor, fontWeight: 'bold', textTransform: 'uppercase' }}>
                                                        {sideLabel}
                                                    </Box>
                                                </Typography>

                                                <Box
                                                    component="img"
                                                    src={doc.docLink}
                                                    alt={`${sideLabel} - ${doc.userVerifyDocTypeName}`}
                                                    sx={{
                                                        maxWidth: '100%',
                                                        maxHeight: '400px',
                                                        objectFit: 'contain',
                                                        boxShadow: 2,
                                                        borderRadius: '6px',
                                                        bgcolor: 'white'
                                                    }}
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;

                                                        // Evitamos un bucle infinito por si el logo tampoco cargara
                                                        target.onerror = null;

                                                        // Reemplazamos la fuente por tu imagen local
                                                        target.src = "/images/logoBlack.png";
                                                    }}
                                                />
                                                <Button href={doc.docLink} target="_blank"
                                                    sx={{
                                                        mt: 1.5,
                                                        textTransform: 'none',
                                                        color: brandColor,
                                                        fontWeight: 600,
                                                        borderRadius: '8px',
                                                        '&:hover': { bgcolor: alpha(brandColor, 0.05) }
                                                    }}
                                                >
                                                    {t('identityValidation.modal.linkImage')}
                                                </Button>
                                            </Box>
                                        );
                                    })
                                ) : (
                                    <Box sx={{ display: 'flex', alignItems: 'center', height: 300 }}>
                                        <Typography color="text.secondary">{t('identityValidation.modal.messageModal')}</Typography>
                                    </Box>
                                )}
                            </Box>
                        </>
                    )}
                </DialogContent>

                <DialogActions
                    sx={{
                        p: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                        borderTop: `1px solid ${alpha(brandColor, 0.08)}`,
                        bgcolor: 'white',
                    }}
                >
                    <Button
                        onClick={handleCloseModal}
                        //color="inherit" 
                        variant="secondary"
                        disabled={isUpdating}
                    >
                        {t('identityValidation.actions.close')}
                    </Button> */}

            {/* Botones de acción solo si es PENDIENTE */}
            {/* {selectedUser?.estadoCodigo === 'PEN' && (
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                width: { xs: '100%', sm: '60%', md: '50%' },
                                justifyContent: 'flex-end'
                            }}
                        >
                            <Button
                                onClick={() => handleDecision('RECHAZADO')}
                                variant="secondary"
                                //color="error"
                                //startIcon={<CancelIcon />}
                                disabled={isUpdating || loadingDetail}
                            >
                                {t('identityValidation.actions.reject')}
                            </Button>
                            <Button
                                onClick={() => handleDecision('VALIDADO')}
                                variant="primary"
                                //color="success"
                                //startIcon={<CheckCircleIcon />}
                                disabled={isUpdating || loadingDetail}
                            >
                                {t('identityValidation.actions.approve')}
                            </Button>
                        </Box>
                    )}
                </DialogActions>
            </Dialog> */}

        </Box>
    );
};

export default IdentityValidationGrid;