import React, { useState } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Modal,
  Box,
  Paper,
} from '@mui/material';

const ModalTest: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  const handleDoubleClick = (value: string) => {
    console.log('Doble clic en:', value);
    setSelectedRow(value);
    setOpenModal(true);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h6" gutterBottom>
        Prueba de Modal
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {['Juan', 'María', 'Carlos'].map((nombre) => (
              <TableRow
                key={nombre}
                onDoubleClick={() => handleDoubleClick(nombre)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                <TableCell>{nombre}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6">Modal abierto</Typography>
          <Typography variant="body1">Seleccionado: {selectedRow}</Typography>
        </Box>
      </Modal>
    </Container>
  );
};

export default ModalTest;