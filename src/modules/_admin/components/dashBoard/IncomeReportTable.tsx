import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Paper,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FinancialSummaryDashboard from './FinancialSummaryDashboard';

interface IncomeReport {
  fecha: string;
  ingresosBrutos: number;
  ajustes: number;
  tarifaServicio: number;
  total: number;
}

interface IncomeReportTableProps {
  idUsuario: string;
}

const IncomeReportTable: React.FC<IncomeReportTableProps> = ({ idUsuario }) => {
  const [reports, setReports] = useState<IncomeReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);

      // Simulación de datos del servicio
      const mockData: IncomeReport[] = [
        {
          fecha: '2023-09-30',
          ingresosBrutos: 2004.0,
          ajustes: 0.0,
          tarifaServicio: 576.0,
          total: 1428.0,
        },
        {
          fecha: '2025-08',
          ingresosBrutos: 1305.0,
          ajustes: 0.0,
          tarifaServicio: 456.0,
          total: 849.0,
        },
        {
          fecha: '2025-07',
          ingresosBrutos: 2984.0,
          ajustes: 0.0,
          tarifaServicio: 847.0,
          total: 2137.0,
        },
      ];

      setTimeout(() => {
        setReports(mockData);
        setLoading(false);
      }, 1000);
    };

    fetchReports();
  }, [idUsuario]);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h6">Cargando informe de ingresos...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h6" gutterBottom>
        Informe de ingresos
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Ingresos brutos</TableCell>
              <TableCell>Ajustes</TableCell>
              <TableCell>Tarifa por servicio</TableCell>
              <TableCell>Total (BOB)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report, index) => (
              <TableRow key={index}>
                <TableCell>{report.fecha}</TableCell>
                <TableCell>{`BOB ${report.ingresosBrutos.toLocaleString()}`}</TableCell>
                <TableCell>{`BOB ${report.ajustes.toLocaleString()}`}</TableCell>
                <TableCell>{`BOB ${report.tarifaServicio.toLocaleString()}`}</TableCell>
                <TableCell>
                  <Typography fontWeight="bold">{`BOB ${report.total.toLocaleString()}`}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button variant="contained" onClick={() => setOpenModal(true)}>
          Ver más
        </Button>
      </Box>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: '90%', md: '80%' },
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 2,
            borderRadius: 2,
            overflowY: 'auto',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={() => setOpenModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="h6">Detalle adicional</Typography>
          {/* Aquí se renderizará el componente adicional en el futuro */}
          <FinancialSummaryDashboard idUser={'42'} />
        </Box>
      </Modal>
    </Container>
  );
};

export default IncomeReportTable;
