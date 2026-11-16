import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  Box,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router';
import { pdf } from '@react-pdf/renderer';
import PropertyDetailReportPDF from './PropertyDetailReportPDF';

// Define las interfaces para los datos
interface Reservation {
  huesped: string;
  checkIn: string;
  checkOut: string;
  estadoPago: 'Pagado' | 'Próximo' | 'Cancelado';
  montoPagado: number;
  comisionAssert: number;
  pagoNeto: number;
}

interface PerformanceSummary {
  ingresos: number;
  nReservas: number;
  nNochesReservadas: number;
  ocupacion: number;
  comisionAssert: number;
}

// Datos simulados (como en la imagen)
const summaryData: PerformanceSummary = {
  ingresos: 1000,
  nReservas: 10,
  nNochesReservadas: 20,
  ocupacion: 80,
  comisionAssert: 300,
};

const reservations: Reservation[] = [
  {
    huesped: 'Carlos Lopez',
    checkIn: '2024-07-20',
    checkOut: '2024-07-24',
    estadoPago: 'Pagado',
    montoPagado: 500,
    comisionAssert: 30,
    pagoNeto: 470,
  },
  {
    huesped: 'Sofia Martinez',
    checkIn: '2024-08-01',
    checkOut: '2024-08-05',
    estadoPago: 'Próximo',
    montoPagado: 450,
    comisionAssert: 27,
    pagoNeto: 423,
  },
  {
    huesped: 'Javier Torres',
    checkIn: '2024-08-15',
    checkOut: '2024-08-20',
    estadoPago: 'Cancelado',
    montoPagado: 0,
    comisionAssert: 0,
    pagoNeto: 0,
  },
];

// Helper para el estilo del Chip según el estado de pago
const getChipStyle = (estado: Reservation['estadoPago']) => {
  switch (estado) {
    case 'Pagado':
      return {
        label: estado,
        color: 'success' as const,
        variant: 'filled' as const,
        style: { backgroundColor: '#eee', color: '#000' },
      };
    case 'Próximo':
      return {
        label: estado,
        color: 'warning' as const,
        variant: 'filled' as const,
        style: { backgroundColor: '#eee', color: '#000' },
      };
    case 'Cancelado':
      return {
        label: estado,
        color: 'error' as const,
        variant: 'filled' as const,
        style: { backgroundColor: '#eee', color: '#000' },
      };
    default:
      return {
        label: estado,
        color: 'default' as const,
        variant: 'filled' as const,
      };
  }
};

const PropertyDetailReport: React.FC = () => {
  const navigation = useNavigate();

  const handleGoBack = () => {
    navigation('/host/dashboard/ranking_property');
  };

  // Función para generar y descargar el PDF
  const handleExportPDF = async () => {
    try {
      const blob = await pdf(
        <PropertyDetailReportPDF
          propertyName="Apartamento en el centro"
          dateRange="1 sep. - 27 sep. 2025"
          summaryData={summaryData}
          reservations={reservations}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte-propiedad-${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF. Por favor, inténtalo de nuevo.');
    }
  };
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Encabezado */}
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton size="small" sx={{ mr: 1 }} onClick={() => handleGoBack()}>
          <ArrowBackIosIcon fontSize="small" />
        </IconButton>
        <Typography variant="h6" fontWeight="bold">
          Detalle de Propiedad
        </Typography>
      </Box>

      {/* Título de la propiedad y Rango de Fechas */}
      <Grid container spacing={2} mb={4}>
        <Grid
          size={{ xs: 3, sm: 2 }}
          display="flex"
          justifyContent="center"
          alignItems="flex-start"
        >
          <Paper
            elevation={0}
            sx={{
              width: '100px',
              height: '100px',
              overflow: 'hidden',
              borderRadius: 4,
            }}
          >
            {/* Imagen simulada: Usa un componente Image real o un 'div' con background-image */}
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=100&q=60"
              alt="Apartamento en el centro"
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/*  */}
          </Paper>
        </Grid>
        <Grid size={{ xs: 9, sm: 10 }}>
          <Typography variant="h5">Apartamento en el centro</Typography>
          <Typography variant="subtitle2" color="text.secondary" mb={1}>
            Análisis detallado de rendimiento
          </Typography>
          <Chip
            label="1 sep. - 27 sep. 2025"
            sx={{
              backgroundColor: '#f5f5f5', // Gris claro para el chip de fecha
              color: 'text.primary',
              fontWeight: 'medium',
            }}
          />
        </Grid>
      </Grid>

      {/* Resumen de Rendimiento (Cards) */}
      <Grid container spacing={2} mb={4}>
        {/* Ingresos */}
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography variant="caption" color="text.secondary" noWrap>
                Ingresos
              </Typography>
              <Typography variant="h6" color="text.primary">
                {summaryData.ingresos} BOB
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* N° reservas */}
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography variant="caption" color="text.secondary" noWrap>
                N° reservas
              </Typography>
              <Typography variant="h6" color="text.primary">
                {summaryData.nReservas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* N° noches reservadas */}
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography variant="caption" color="text.secondary" noWrap>
                N° noches reservadas
              </Typography>
              <Typography variant="h6" color="text.primary">
                {summaryData.nNochesReservadas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Ocupación % */}
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography variant="caption" color="text.secondary" noWrap>
                Ocupación %
              </Typography>
              <Typography variant="h6" color="text.primary">
                {summaryData.ocupacion}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Comisión Assert */}
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography variant="caption" color="text.secondary" noWrap>
                Comisión Assert
              </Typography>
              <Typography variant="h6" color="text.primary">
                {summaryData.comisionAssert} BOB
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de Reservas */}
      <TableContainer component={Paper} elevation={0} sx={{ overflowX: 'auto', mb: 8 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Huésped</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Check-in</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Check-out</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Estado de pago</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                Monto pagado
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                Comisión Assert
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                Pago neto
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((row, index) => {
              const chipProps = getChipStyle(row.estadoPago);
              return (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {row.huesped}
                  </TableCell>
                  <TableCell>{row.checkIn}</TableCell>
                  <TableCell>{row.checkOut}</TableCell>
                  <TableCell>
                    <Chip
                      label={chipProps.label}
                      size="small"
                      variant={chipProps.variant}
                      sx={{
                        ...chipProps.style,
                        borderRadius: 6,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">${row.montoPagado}</TableCell>
                  <TableCell align="right">${row.comisionAssert}</TableCell>
                  <TableCell align="right">${row.pagoNeto}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Botón Exportar Reporte */}
      <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{
            backgroundColor: 'black',
            color: 'white',
            '&:hover': {
              backgroundColor: '#333',
            },
            textTransform: 'none',
            fontWeight: 'bold',
            px: 3,
            py: 1,
          }}
          onClick={handleExportPDF}
        >
          Exportar reporte
        </Button>
      </Box>
    </Box>
  );
};

export default PropertyDetailReport;
