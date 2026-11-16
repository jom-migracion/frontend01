import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';

// Skeleton para ReservationRequestCard
export const ReservationRequestCardSkeleton: React.FC = () => (
  <Card sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #e0e0e0', width: 300, mb: 2 }}>
    <CardContent sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Skeleton variant="text" width={60} height={20} />
        <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: '15px' }} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <Skeleton variant="circular" width={60} height={60} sx={{ mr: 2 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Skeleton variant="text" width="80%" height={20} />
          <Skeleton variant="text" width="60%" height={16} />
          <Skeleton variant="text" width="90%" height={14} />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// Skeleton para filas de tabla
export const TableRowSkeleton: React.FC = () => (
  <TableRow>
    <TableCell>
      <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: '50px' }} />
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width="80%" height={20} />
      <Skeleton variant="text" width="60%" height={16} />
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width="70%" height={16} />
      <Skeleton variant="text" width="70%" height={16} />
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width="70%" height={16} />
      <Skeleton variant="text" width="50%" height={16} />
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width="90%" height={16} />
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width="80%" height={16} />
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width="60%" height={16} />
    </TableCell>
    <TableCell align="right">
      <Skeleton variant="rectangular" width={70} height={32} sx={{ borderRadius: '9px' }} />
    </TableCell>
  </TableRow>
);

// Skeleton para tabla completa
export const ReservationsTableSkeleton: React.FC = () => {
  const columns = [
    'Estado',
    'Huésped',
    'Llegada/salida',
    'Reservado',
    'Inmueble',
    'Código de confirmación',
    'Cobro total',
    '',
  ];

  return (
    <Box sx={{ p: 2, width: '100%' }}>
      <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ borderRadius: '8px', border: '1px solid #e0e0e0' }}
      >
        <Table sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow>
              {columns.map((_, index) => (
                <TableCell
                  key={index}
                  sx={{ borderBottom: '1px solid #e0e0e0', padding: '10px 16px' }}
                >
                  <Skeleton variant="text" width="80%" height={20} />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 3 }).map((_, index) => (
              <TableRowSkeleton key={index} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Skeleton para el detalle de reservación
export const ReservationDetailSkeleton: React.FC<{ showSteps?: boolean }> = ({
  showSteps = false,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isSmallScreen ? 'column' : 'row',
        width: '100%',
        gap: 3,
        alignItems: 'flex-start',
      }}
    >
      {/* Columna izquierda – Detalles */}
      <Box
        sx={{
          flex: isSmallScreen ? '1 1 100%' : '1 1 70%',
          width: isSmallScreen ? '100%' : undefined,
          bgcolor: 'white',
          border: isSmallScreen ? 'none' : '1px solid #E5E7EB',
          borderRadius: isSmallScreen ? 0 : '16px',
          p: isSmallScreen ? 1 : 4,
        }}
      >
        {/* Status chip */}
        <Skeleton
          variant="rectangular"
          width={160}
          height={32}
          sx={{ borderRadius: '20px', mb: 2 }}
        />

        {/* Título */}
        <Skeleton variant="text" width="65%" height={isSmallScreen ? 34 : 44} sx={{ mb: 4 }} />

        {/* Booking summary card */}
        <Box
          sx={{
            border: '1px solid #E5E7EB',
            borderRadius: '16px',
            p: 3,
            mb: 3,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2,
          }}
        >
          <Skeleton variant="circular" width={64} height={64} sx={{ flexShrink: 0 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton variant="text" width="50%" height={22} />
            <Skeleton variant="text" width="75%" height={18} />
            <Skeleton variant="text" width="60%" height={18} />
            <Skeleton variant="text" width="45%" height={18} />
          </Box>
        </Box>

        {/* Info banner – próximo paso */}
        <Box
          sx={{
            bgcolor: '#F9FAFB',
            borderRadius: '16px',
            border: '1px solid #E5E7EB',
            px: 3,
            py: 3,
            mb: 6,
            display: 'flex',
            gap: 2,
          }}
        >
          <Skeleton variant="circular" width={24} height={24} sx={{ flexShrink: 0 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton variant="text" width="85%" height={18} />
            <Skeleton variant="text" width="55%" height={18} />
          </Box>
        </Box>

        {/* Mensaje al huésped */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 6 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box>
            <Skeleton variant="text" width={190} height={22} />
            <Skeleton variant="text" width={130} height={18} />
          </Box>
        </Box>

        {/* Botones aceptar / rechazar */}
        <Box sx={{ mb: 4, maxWidth: 420 }}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={48}
            sx={{ borderRadius: 2, mb: 2 }}
          />
          <Skeleton
            variant="rectangular"
            width="100%"
            height={48}
            sx={{ borderRadius: 2, mb: 2 }}
          />
          <Skeleton variant="text" width="75%" height={16} />
        </Box>

        {/* Sobre el huésped */}
        <Box sx={{ borderTop: '1px solid #E5E7EB', py: isSmallScreen ? 4 : 6 }}>
          <Skeleton variant="text" width={220} height={26} sx={{ mb: 3 }} />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: isSmallScreen ? '1fr' : '1fr 1fr',
              gap: 3,
            }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Skeleton variant="circular" width={40} height={40} sx={{ flexShrink: 0 }} />
                <Box>
                  <Skeleton variant="text" width={110} height={22} />
                  <Skeleton variant="text" width={85} height={18} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Detalles de la reserva */}
        <Box sx={{ borderTop: '1px solid #E5E7EB', py: isSmallScreen ? 4 : 6 }}>
          <Skeleton variant="text" width={180} height={26} sx={{ mb: 3 }} />
          {Array.from({ length: 3 }).map((_, i) => (
            <Box key={i} sx={{ py: 0.5, mb: 2 }}>
              <Skeleton variant="text" width={120} height={22} />
              <Skeleton variant="text" width={190} height={18} />
            </Box>
          ))}
          <Skeleton variant="text" width={140} height={18} sx={{ mt: 1 }} />
        </Box>

        {/* Ganancias potenciales */}
        <Box sx={{ borderTop: '1px solid #E5E7EB', py: isSmallScreen ? 4 : 6 }}>
          <Skeleton variant="text" width={200} height={26} sx={{ mb: 3 }} />
          {Array.from({ length: 2 }).map((_, i) => (
            <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Skeleton variant="text" width={120} height={18} />
              <Skeleton variant="text" width={80} height={18} />
            </Box>
          ))}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pt: 2,
              borderTop: '1px dashed #E5E7EB',
            }}
          >
            <Skeleton variant="text" width={100} height={isSmallScreen ? 22 : 26} />
            <Skeleton variant="text" width={110} height={isSmallScreen ? 26 : 34} />
          </Box>
        </Box>
      </Box>

      {/* Columna derecha – Steps skeleton */}
      {showSteps && !isSmallScreen && (
        <Box
          sx={{
            flex: '0 0 36%',
            position: 'sticky',
            top: 0,
            alignSelf: 'flex-start',
            border: '1px solid #E5E7EB',
            borderRadius: 3,
            p: 3,
            bgcolor: 'white',
          }}
        >
          <Skeleton variant="text" width={160} height={26} sx={{ mb: 3 }} />
          {Array.from({ length: 6 }).map((_, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Skeleton variant="circular" width={32} height={32} />
                {i < 5 && <Box sx={{ width: 2, height: 36, bgcolor: '#E5E7EB', my: 0.5 }} />}
              </Box>
              <Box sx={{ pt: 0.5, flexGrow: 1, pb: i < 5 ? 0 : 2 }}>
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="80%" height={16} />
              </Box>
            </Box>
          ))}
          <Skeleton
            variant="rectangular"
            width="100%"
            height={44}
            sx={{ borderRadius: 2, mt: 3 }}
          />
        </Box>
      )}
    </Box>
  );
};

// Skeleton para sidebar de solicitudes
export const SidebarSkeleton: React.FC = () => (
  <Box
    sx={{
      width: '40%',
      minWidth: '350px',
      bgcolor: 'white',
      border: '1px solid #E5E7EB',
      borderRadius: '16px',
      alignSelf: 'flex-start',
    }}
  >
    {/* Header */}
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mx: 4,
        mt: 2,
        mb: 2,
      }}
    >
      <Skeleton variant="text" width={140} height={28} />
      <Skeleton variant="circular" width={36} height={36} />
    </Box>

    {/* Reservation cards */}
    {Array.from({ length: 3 }).map((_, index) => (
      <Box
        key={index}
        sx={{
          px: 2,
          py: 1.5,
          borderLeft: '4px solid transparent',
          mb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <Skeleton variant="circular" width={40} height={40} sx={{ flexShrink: 0 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Skeleton variant="text" width={120} height={18} />
              <Skeleton variant="text" width={60} height={14} />
            </Box>
            <Skeleton variant="text" width={100} height={16} />
          </Box>
        </Box>
        <Box sx={{ pl: '52px', mb: 0.5 }}>
          <Skeleton variant="text" width="80%" height={16} />
        </Box>
        <Box sx={{ pl: '52px' }}>
          <Skeleton variant="rectangular" width={140} height={24} sx={{ borderRadius: '15px' }} />
        </Box>
      </Box>
    ))}
  </Box>
);
