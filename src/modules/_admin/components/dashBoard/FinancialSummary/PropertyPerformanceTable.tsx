// components/PropertyPerformanceTable.tsx
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
import { PropertyPerformance } from '@/models/typesFinancial';
import { fetchPropertyPerformance } from '@/hooks/mockServiceFinancial';

interface Props {
  idUser: string;
}

const PropertyPerformanceTable: React.FC<Props> = ({ idUser }) => {
  const [data, setData] = useState<PropertyPerformance[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setData(fetchPropertyPerformance(idUser));
  }, [idUser]);

  const visibleRows = showAll ? data : data.slice(0, 3);

  return (
    <Box mb={4}>
      <Typography variant="h6" mb={2}>
        Rendimiento por inmueble
      </Typography>
      <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Inmueble</TableCell>
              <TableCell>Noches reservadas</TableCell>
              <TableCell>Promedio de noches por estadía</TableCell>
              <TableCell>Porcentaje de ocupación</TableCell>
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
                <TableCell>{row.nightsBooked}</TableCell>
                <TableCell>{row.averageNightsPerStay}</TableCell>
                <TableCell>{row.occupancyRate}%</TableCell>
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

export default PropertyPerformanceTable;
