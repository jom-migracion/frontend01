import React, { useEffect, useState } from 'react';
import {
  Box,
  Chip,
  Container,
  Icon,
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
} from '@mui/material';
import PaymentTransactionModalContent from '../dashBoard/PaymentTransactionModalContent';
//import ModalTest from '../dashBoard/ModalTest';

interface PaymentData {
  estado: 'Pendiente' | 'Pagado';
  fecha: string;
  propiedad: string;
  monto: number;
  metodoPago: string;
  bookId: string;
  propiedadId: string;
  nombreHuesped: string;
}

interface UpcomingPaymentsTableProps {
  idUsuario: string;
}

const UpcomingPaymentsTable: React.FC<UpcomingPaymentsTableProps> = ({ idUsuario }) => {
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentData | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);

      const mockData: PaymentData[] = [
        {
          estado: 'Pendiente',
          fecha: '2024-08-15',
          propiedad: 'Casa de playa',
          monto: 2500,
          metodoPago: 'Transferencia bancaria',
          bookId: 'B001',
          propiedadId: 'P001',
          nombreHuesped: 'Juan Pérez',
        },
        {
          estado: 'Pendiente',
          fecha: '2024-08-15',
          propiedad: 'Apartamento en la ciudad',
          monto: 2000,
          metodoPago: 'Transferencia bancaria',
          bookId: 'B002',
          propiedadId: 'P002',
          nombreHuesped: 'María López',
        },
        {
          estado: 'Pendiente',
          fecha: '2024-08-15',
          propiedad: 'Cabaña de montaña',
          monto: 1750,
          metodoPago: 'Transferencia bancaria',
          bookId: 'B003',
          propiedadId: 'P003',
          nombreHuesped: 'Carlos Gómez',
        },
      ];

      setTimeout(() => {
        setPayments(mockData);
        setLoading(false);
      }, 1000);
    };

    fetchPayments();
  }, [idUsuario]);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Pendiente':
        return 'warning';
      case 'Pagado':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleRowDoubleClick = (pago: PaymentData) => {
    console.log('Pago seleccionado:', pago);
    setSelectedPayment(pago);
    setOpenModal(true);
    console.log('Modal debería abrirse');
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h6">Cargando pagos...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h6" gutterBottom>
        Próximos pagos
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Propiedad</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>Método de pago</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((pago) => (
              <TableRow
                key={pago.bookId}
                onClick={() => handleRowDoubleClick(pago)}
                sx={{
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                <TableCell>
                  <Chip label={pago.estado} color={getEstadoColor(pago.estado)} />
                </TableCell>
                <TableCell>{pago.fecha}</TableCell>
                <TableCell>{pago.propiedad}</TableCell>
                <TableCell>{`BOB ${pago.monto.toLocaleString()}`}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Icon>account_balance</Icon>
                    {pago.metodoPago}
                  </Box>
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
            width: '80%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          {selectedPayment ? (
            <PaymentTransactionModalContent
              idUsuario={idUsuario}
              bookingId={selectedPayment.bookId}
              transferenciaId={selectedPayment.propiedadId}
            />
          ) : (
            <Typography variant="h6">Detalle adicional</Typography>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default UpcomingPaymentsTable;
