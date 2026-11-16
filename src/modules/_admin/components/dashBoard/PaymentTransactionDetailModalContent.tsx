import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider, Paper, Avatar, Link, IconButton, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

interface Tarifas {
  estado: 'pagado' | 'cancelado';
  porNoche?: number;
  noches?: number;
  limpieza?: number;
  servicio?: number;
  Total: number;
}

interface Book {
  Photo: string;
  Huespes: string;
  fechas: string;
  descripcion: string;
  tarifas: Tarifas;
}

interface PaymentDetail {
  montoTotal: number;
  fechaDepositos: string;
  cuentaBancaria: {
    titular: string;
    numero: string;
    moneda: string;
  };
  Books: Book[];
  TransferStatus: {
    estado: string;
    fechaEnvio: string;
    fechaEstimadaLlegada: string;
    monto: number;
    moneda: string;
    mensaje: string;
  };
}

interface Props {
  idUsuario: string;
  fecha: string;
  onClose: () => void;
}

const PaymentTransactionDetailModalContent: React.FC<Props> = ({ idUsuario, fecha, onClose }) => {
  const [view, setView] = useState<'detalle' | 'transferencia'>('detalle');
  const [data, setData] = useState<PaymentDetail | null>(null);

  useEffect(() => {
    const mockData: PaymentDetail = {
      montoTotal: 625.16,
      fechaDepositos: '2025-10-04',
      cuentaBancaria: {
        titular: 'Analia Eliana Solis Inchausty',
        numero: '2345',
        moneda: 'BOB',
      },
      Books: [
        {
          Photo: '',
          Huespes: 'Melissa',
          fechas: '3-4 nov. 2024',
          descripcion: 'Amplio depto - Stratto piso 3',
          tarifas: {
            estado: 'pagado',
            porNoche: 28,
            noches: 2,
            limpieza: 8,
            servicio: -1.92,
            Total: 62.08,
          },
        },
        {
          Photo: '',
          Huespes: 'Carlos',
          fechas: '5-6 nov. 2024',
          descripcion: 'Cabaña en los Andes',
          tarifas: {
            estado: 'pagado',
            porNoche: 30,
            noches: 3,
            limpieza: 10,
            servicio: -2.5,
            Total: 97.5,
          },
        },
        {
          Photo: '',
          Huespes: 'Lucía',
          fechas: '7-8 nov. 2024',
          descripcion: 'Apartamento moderno en el centro',
          tarifas: {
            estado: 'cancelado',
            Total: 500,
          },
        },
      ],
      TransferStatus: {
        estado: 'Enviado',
        fechaEnvio: '2025-10-05',
        fechaEstimadaLlegada: '2025-11-18',
        monto: 300,
        moneda: 'BOB',
        mensaje:
          'Esta información está actualizada. No dudes en contactarte con tu institución bancaria si tienes alguna pregunta al respecto. Conoce más también en el centro de ayuda.',
      },
    };

    setData(mockData);
  }, [idUsuario, fecha]);

  if (!data) return <Typography>Cargando...</Typography>;

  return (
    <Box>
      {view === 'detalle' ? (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" fontWeight="bold">
              {`${data.montoTotal.toFixed(2)} ${data.cuentaBancaria.moneda}`}
            </Typography>
            <IconButton onClick={onClose}>
              <Typography variant="h6">X</Typography>
            </IconButton>
          </Box>

          <Typography variant="body2">
            Se depositará el {data.fechaDepositos}.{' '}
            <Link onClick={() => setView('transferencia')} sx={{ cursor: 'pointer' }}>
              Detalles
            </Link>
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle2">Cuenta Bancaria</Typography>
            <Typography variant="body2">
              {data.cuentaBancaria.titular}, {data.cuentaBancaria.numero} (
              {data.cuentaBancaria.moneda})
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2">ID de cobro</Typography>
            <Typography variant="body2">G-WZJAPPLTE6BE</Typography>
          </Paper>

          {data.Books.map((book, index) => (
            <Paper key={index} sx={{ p: 2, mt: 2, borderRadius: 2 }}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid>
                  <Avatar src={book.Photo}>{book.Huespes[0]}</Avatar>
                </Grid>
                <Grid>
                  <Link sx={{ cursor: 'pointer' }}>JAJFSD</Link>
                </Grid>
              </Grid>

              <Typography variant="body1" mt={1}>
                {book.Huespes}
              </Typography>
              <Typography variant="body2">{book.fechas}</Typography>
              <Typography variant="body2">{book.descripcion}</Typography>

              <Divider sx={{ my: 2 }} />

              {book.tarifas.estado === 'pagado' ? (
                <>
                  <Grid container justifyContent="space-between">
                    <Typography variant="body2">
                      BOB {book.tarifas.porNoche} × {book.tarifas.noches} noches
                    </Typography>
                    <Typography variant="body2">
                      BOB {(book.tarifas.porNoche! * book.tarifas.noches!).toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid container justifyContent="space-between">
                    <Typography variant="body2">Tarifa de limpieza</Typography>
                    <Typography variant="body2">BOB {book.tarifas.limpieza?.toFixed(2)}</Typography>
                  </Grid>
                  <Grid container justifyContent="space-between">
                    <Typography variant="body2">Tarifa por servicio</Typography>
                    <Typography variant="body2">BOB {book.tarifas.servicio?.toFixed(2)}</Typography>
                  </Grid>
                </>
              ) : (
                <Typography variant="body2">Esta reservación se canceló</Typography>
              )}

              <Divider sx={{ my: 2 }} />

              <Grid container justifyContent="space-between">
                <Typography variant="body1" fontWeight="bold">
                  Total final
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  BOB {book.tarifas.Total.toFixed(2)}
                </Typography>
              </Grid>
            </Paper>
          ))}
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
              <Typography variant="body1">{data.TransferStatus.estado}</Typography>
              <Typography variant="body2">{data.TransferStatus.fechaEnvio}</Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2} alignItems="center" mt={2}>
            <Grid>
              <CalendarMonthIcon color="primary" />
            </Grid>
            <Grid>
              <Typography variant="body1">Fecha de llegada estimada</Typography>
              <Typography variant="body2">{data.TransferStatus.fechaEstimadaLlegada}</Typography>
            </Grid>
          </Grid>

          <Typography variant="body2" mt={2}>
            Enviamos BOB {data.TransferStatus.monto.toFixed(2)} el 18 de octubre de 2025.
          </Typography>

          <Typography variant="body2" mt={2}>
            {data.TransferStatus.mensaje}
          </Typography>

          <Button variant="outlined" sx={{ mt: 2 }}>
            Más información
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PaymentTransactionDetailModalContent;
