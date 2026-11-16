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
import PaymentTransactionDetailModalContent from '../dashBoard/PaymentTransactionDetailModalContent';

interface CompletedPayment {
  estado: string;
  fecha: string;
  totalPagado: number;
  metodoCobro: string;
  transacciones: number;
  listendRentId: number;
}

interface CompletedPaymentsTableProps {
  idUsuario: string;
}

const CompletedPaymentsTable: React.FC<CompletedPaymentsTableProps> = ({ idUsuario }) => {
  const [payments, setPayments] = useState<CompletedPayment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<CompletedPayment | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);

      const mockData: CompletedPayment[] = [
        {
          estado: 'Enviado',
          fecha: '2025-10-04',
          totalPagado: 2500.0,
          metodoCobro: 'Visa, María Teresa Inchausey, (BOB)',
          transacciones: 4,
          listendRentId: 543,
        },
        {
          estado: 'Enviado',
          fecha: '2025-10-04',
          totalPagado: 2100.0,
          metodoCobro: 'Visa, María Teresa Inchausey, (BOB)',
          transacciones: 2,
          listendRentId: 544,
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
      case 'Enviado':
        return 'info';
      default:
        return 'default';
    }
  };

  const handleRowClick = (pago: CompletedPayment) => {
    setSelectedPayment(pago);
    setOpenModal(true);
  };

  const handleVerMasClick = () => {
    // Si no hay selección previa, tomamos el primero como ejemplo
    const defaultPayment = payments[0];
    setSelectedPayment(defaultPayment);
    setOpenModal(true);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h6">Cargando pagos realizados...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h6" gutterBottom>
        Pagos realizados
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Total pagado</TableCell>
              <TableCell>Método de cobro</TableCell>
              <TableCell>Transacciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((pago) => (
              <TableRow
                key={pago.listendRentId}
                onClick={() => handleRowClick(pago)}
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
                <TableCell>{`BOB ${pago.totalPagado.toLocaleString()}`}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Icon>credit_card</Icon>
                    {pago.metodoCobro}
                  </Box>
                </TableCell>
                <TableCell>{pago.transacciones}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button variant="contained" onClick={handleVerMasClick}>
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
            <PaymentTransactionDetailModalContent
              idUsuario={idUsuario}
              fecha={selectedPayment.fecha}
              onClose={() => setOpenModal(false)}
            />
          ) : (
            <Typography variant="h6">Detalle adicional</Typography>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default CompletedPaymentsTable;
