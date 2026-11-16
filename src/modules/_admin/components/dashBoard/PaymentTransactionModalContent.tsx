import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider, Paper, Avatar, Link, IconButton, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';

interface PaymentDetail {
  montoTotal: number;
  fechaDeposito: string;
  cuentaBancaria: {
    titular: string;
    numero: string;
    moneda: string;
  };
  huesped: string;
  alojamiento: {
    fechas: string;
    descripcion: string;
  };
  tarifas: {
    porNoche: number;
    noches: number;
    limpieza: number;
    servicio: number;
  };
}

interface TransferStatus {
  estado: string;
  fechaEnvio: string;
  fechaEstimadaLlegada: string;
  monto: number;
  moneda: string;
  mensaje: string;
}

interface Props {
  idUsuario: string;
  bookingId: string;
  transferenciaId: string;
}

const PaymentTransactionModalContent: React.FC<Props> = ({
  idUsuario,
  bookingId,
  transferenciaId,
}) => {
  const [view, setView] = useState<'detalle' | 'transferencia'>('detalle');
  const [paymentDetail, setPaymentDetail] = useState<PaymentDetail | null>(null);
  const [transferStatus, setTransferStatus] = useState<TransferStatus | null>(null);

  useEffect(() => {
    // Simulación de datos
    const mockPaymentDetail: PaymentDetail = {
      montoTotal: 62.08,
      fechaDeposito: '2025-10-04',
      cuentaBancaria: {
        titular: 'Analia Eliana Solis Inchausty',
        numero: '2345',
        moneda: 'BOB',
      },
      huesped: 'Melissa',
      alojamiento: {
        fechas: '3-4 nov. 2024',
        descripcion: 'Amplio depto - Stratto piso 3',
      },
      tarifas: {
        porNoche: 28,
        noches: 2,
        limpieza: 8,
        servicio: -1.92,
      },
    };

    const mockTransferStatus: TransferStatus = {
      estado: 'Enviado',
      fechaEnvio: '2025-10-05',
      fechaEstimadaLlegada: '2025-11-18',
      monto: 300,
      moneda: 'BOB',
      mensaje:
        'Esta información está actualizada. No dudes en contactarte con tu institución bancaria si tienes alguna pregunta al respecto. Conoce más también en el centro de ayuda.',
    };

    setPaymentDetail(mockPaymentDetail);
    setTransferStatus(mockTransferStatus);
  }, [idUsuario, bookingId, transferenciaId]);

  if (!paymentDetail || !transferStatus) return null;

  return (
    <Box>
      {view === 'detalle' ? (
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {`${paymentDetail.montoTotal.toFixed(2)} ${paymentDetail.cuentaBancaria.moneda}`}
          </Typography>
          <Typography variant="body2">
            Se depositará el {paymentDetail.fechaDeposito}.{' '}
            <Link onClick={() => setView('transferencia')} sx={{ cursor: 'pointer' }}>
              Detalles
            </Link>
          </Typography>

          <Paper sx={{ p: 2, mt: 2, borderRadius: 2 }}>
            <Typography variant="subtitle2">Cuenta bancaria</Typography>
            <Typography variant="body2">
              {paymentDetail.cuentaBancaria.titular}, {paymentDetail.cuentaBancaria.numero} (
              {paymentDetail.cuentaBancaria.moneda})
            </Typography>
          </Paper>

          <Paper sx={{ p: 2, mt: 2, borderRadius: 2 }}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid>
                <Avatar>{paymentDetail.huesped[0]}</Avatar>
              </Grid>
              <Grid>
                <Link sx={{ cursor: 'pointer' }}>JAJFSD</Link>
              </Grid>
            </Grid>

            <Typography variant="body1" mt={1}>
              {paymentDetail.huesped}
            </Typography>
            <Typography variant="body2">{paymentDetail.alojamiento.fechas}</Typography>
            <Typography variant="body2">{paymentDetail.alojamiento.descripcion}</Typography>

            <Divider sx={{ my: 2 }} />

            <Grid container justifyContent="space-between">
              <Typography variant="body2">
                BOB {paymentDetail.tarifas.porNoche} × {paymentDetail.tarifas.noches} noches
              </Typography>
              <Typography variant="body2">
                BOB {(paymentDetail.tarifas.porNoche * paymentDetail.tarifas.noches).toFixed(2)}
              </Typography>
            </Grid>

            <Grid container justifyContent="space-between">
              <Typography variant="body2">Tarifa de limpieza</Typography>
              <Typography variant="body2">
                BOB {paymentDetail.tarifas.limpieza.toFixed(2)}
              </Typography>
            </Grid>

            <Grid container justifyContent="space-between">
              <Typography variant="body2">Tarifa por servicio</Typography>
              <Typography variant="body2">
                BOB {paymentDetail.tarifas.servicio.toFixed(2)}
              </Typography>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Grid container justifyContent="space-between">
              <Typography variant="body1" fontWeight="bold">
                Total final
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                BOB {paymentDetail.montoTotal.toFixed(2)}
              </Typography>
            </Grid>
          </Paper>
        </Box>
      ) : (
        <Box>
          <IconButton onClick={() => setView('detalle')}>
            <ArrowBackIcon />
          </IconButton>

          <Typography variant="h6" gutterBottom>
            Tu dinero está en camino
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid>
              <CheckCircleIcon color="success" />
            </Grid>
            <Grid>
              <Typography variant="body1">{transferStatus.estado}</Typography>
              <Typography variant="body2">{transferStatus.fechaEnvio}</Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2} alignItems="center" mt={2}>
            <Grid>
              <LooksTwoIcon color="primary" />
            </Grid>
            <Grid>
              <Typography variant="body1">Fecha de llegada estimada</Typography>
              <Typography variant="body2">{transferStatus.fechaEstimadaLlegada}</Typography>
            </Grid>
          </Grid>

          <Typography variant="body2" mt={2}>
            Enviaremos BOB {transferStatus.monto.toFixed(2)} el 18 de octubre de 2025.
          </Typography>

          <Typography variant="body2" mt={2}>
            {transferStatus.mensaje}
          </Typography>

          <Button variant="outlined" sx={{ mt: 2 }}>
            Más información
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PaymentTransactionModalContent;
