// components/FinancialSummary.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Paper,
  Grid,
} from '@mui/material';
import { FinancialSummary, ReservationStats } from '@/models/typesFinancial';
import { fetchFinancialSummary, fetchReservationStats } from '@/hooks/mockServiceFinancial';

interface Props {
  idUser: string;
  startDate: string;
  endDate: string;
}

const FinancialSummaryComponent: React.FC<Props> = ({ idUser, startDate, endDate }) => {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [stats, setStats] = useState<ReservationStats | null>(null);

  useEffect(() => {
    // Emulación de servicios
    setSummary(fetchFinancialSummary(idUser));
    setStats(fetchReservationStats(idUser));
  }, [idUser]);

  return (
    <Box mb={4}>
      <Typography variant="h5" align="center">
        {startDate} – {endDate}
      </Typography>
      <Typography variant="h6" align="center" color="primary" sx={{ mb: 2 }}>
        Ganaste BOB {summary?.total.toFixed(2)}
      </Typography>

      <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Resumen</TableCell>
              <TableCell>Ingreso bruto</TableCell>
              <TableCell>Ajustes</TableCell>
              <TableCell>Tarifa por servicio</TableCell>
              <TableCell>Total (BOB)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Ingresos</TableCell>
              <TableCell>{summary?.grossIncome.toFixed(2)}</TableCell>
              <TableCell>{summary?.adjustments.toFixed(2)}</TableCell>
              <TableCell>{summary?.serviceFee.toFixed(2)}</TableCell>
              <TableCell>{summary?.total.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>

      <Grid container spacing={2} mt={2}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="subtitle1">Reservas Confirmadas</Typography>
            <Typography variant="h5">{stats?.confirmedBookings}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="subtitle1">Noches Reservadas</Typography>
            <Typography variant="h5">{stats?.reservedNights}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="subtitle1">Promedio de noches por reserva</Typography>
            <Typography variant="h5">{stats?.avgNightsPerBooking}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FinancialSummaryComponent;