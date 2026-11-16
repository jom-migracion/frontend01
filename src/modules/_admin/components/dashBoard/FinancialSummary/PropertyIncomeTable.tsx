// components/PropertyIncomeTable.tsx
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
  Button,
  Avatar,
  Stack,
} from '@mui/material';
import { PropertyIncome } from '@/models/typesFinancial';
import { fetchPropertyIncome } from '@/hooks/mockServiceFinancial';


interface Props {
  idUser: string;
}

const PropertyIncomeTable: React.FC<Props> = ({ idUser }) => {
  const [data, setData] = useState<PropertyIncome[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setData(fetchPropertyIncome(idUser));
  }, [idUser]);

  const visibleRows = showAll ? data : data.slice(0, 3);

  return (
    <Box mb={4}>
      <Typography variant="h6" mb={2}>
        Ingresos por inmueble
      </Typography>
      <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Inmueble</TableCell>
              <TableCell>Fecha ingreso bruto</TableCell>
              <TableCell>Ingreso bruto</TableCell>
              <TableCell>Ajustes</TableCell>
              <TableCell>Tarifa por servicio</TableCell>
              <TableCell>Total (BOB)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar src={row.propertyImagen} />
                    <Typography>{row.propertyName}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{row.incomeDate}</TableCell>
                <TableCell>{row.grossIncome.toFixed(2)}</TableCell>
                <TableCell>{row.adjustments.toFixed(2)}</TableCell>
                <TableCell>{row.serviceFee.toFixed(2)}</TableCell>
                <TableCell>{row.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      {data.length > 3 && (
        <Box mt={2} textAlign="center">
          <Button variant="text" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Ver menos' : 'Ver más'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PropertyIncomeTable;