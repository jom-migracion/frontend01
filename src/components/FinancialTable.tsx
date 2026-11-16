import React, { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';

// --- 1. Definición de Tipos y Datos de Ejemplo ---

interface RowData {
  id: string;
  estado: string;
  detalleEstado: string;
  fecha: string;
  propiedad: string;
  detallePropiedad: string;
  monto: string;
  metodo: string;
}

const mockData: RowData[] = [
  {
    id: '1',
    estado: 'Pendiente',
    detalleEstado: 'Método de cobro n...',
    fecha: '2024-08-15',
    propiedad: 'Casa de playa',
    detallePropiedad: '',
    monto: 'BOB 2.500',
    metodo: 'Transferencia bancaria',
  },
  {
    id: '2',
    estado: 'Pendiente',
    detalleEstado: 'Tu dinero esta en...',
    fecha: '2024-08-15',
    propiedad: 'Apartamento en la ciudad',
    detallePropiedad: '',
    monto: 'BOB 2.000',
    metodo: 'Transferencia bancaria',
  },
  {
    id: '3',
    estado: 'Pendiente',
    detalleEstado: 'Tu dinero esta en...',
    fecha: '2024-08-15',
    propiedad: 'Cabaña de montaña',
    detallePropiedad: '',
    monto: 'BOB 1.750',
    metodo: 'Transferencia bancaria',
  },
];

// --- 2. Estilos Comunes ---

const footerButtonStyle = {
  backgroundColor: '#222',
  color: 'white',
  borderRadius: '8px',
  textTransform: 'none',
  px: 3,
  '&:hover': {
    backgroundColor: '#444',
  },
};

const filterChipStyle = {
  borderRadius: '20px',
  borderColor: '#ccc',
  color: '#333',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#f0f0f0',
    borderColor: '#bbb',
  },
};

// ==================================================================
// --- 3. VISTA DEL PANEL DERECHO 1: "Agrega un método de cobro" ---
// ==================================================================

interface AddMethodViewProps {
  onBack: () => void;
}

const AddMethodView: React.FC<AddMethodViewProps> = ({ onBack }) => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* --- Encabezado --- */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <IconButton onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>
      </Box>

      {/* --- Contenido --- */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3, pt: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: '600', mb: 2 }}>
          Agrega un método de cobro
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Parece que hay un problema con tu método de cobro. Puedes eliminarlo e intentar
          configurarlo otra vez, o agregar uno nuevo.
        </Typography>
        <Button variant="primary" sx={footerButtonStyle} fullWidth>
          Ir a configuración
        </Button>
      </Box>
    </Box>
  );
};

// ==================================================================
// --- 4. VISTA DEL PANEL DERECHO 2: "Detalles del Pago" (Melissa) ---
// ==================================================================

interface PaymentDetailsViewProps {
  onClose: () => void;
  onNavigateToAddMethod: () => void;
  data: RowData;
}

const PaymentDetailsView: React.FC<PaymentDetailsViewProps> = ({
  onClose,
  onNavigateToAddMethod,
  data,
}) => {
  // Extrae el valor numérico del monto para el footer
  const totalAmount = data.monto.replace('BOB ', '').replace('.', '');

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* --- Encabezado de Detalles (Solo la X) --- */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'flex-end',
          flexShrink: 0,
        }}
      >
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* --- Contenido de Detalles (Scrollable) --- */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3, pt: 0 }}>
        <Typography variant="h5" sx={{ fontWeight: '600' }}>
          {data.monto}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#d9534f',
            }}
          />
          <Typography variant="body2" color="text.secondary">
            Se depositará el 18 de nov de 2025.
          </Typography>
          {/* --- ¡AQUÍ ESTÁ EL TRIGGER! --- */}
          <Link
            component="button"
            variant="body2"
            underline="hover"
            onClick={onNavigateToAddMethod}
            sx={{ cursor: 'pointer' }}
          >
            Detalles.
          </Link>
        </Box>

        {/* Card: Cuenta bancaria */}
        <Paper
          variant="outlined"
          sx={{ p: 2, borderRadius: '12px', mt: 3, borderColor: '#e0e0e0' }}
        >
          <Typography variant="body2" sx={{ fontWeight: '600', mb: 0.5 }}>
            Cuenta bancaria
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Analía Eliana Solis Inchausty, 2345 (BOB)
          </Typography>
        </Paper>

        {/* Card: Usuario (Melissa) */}
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: '12px',
            mt: 2,
            borderColor: '#e0e0e0',
            position: 'relative',
          }}
        >
          <Chip
            label="JAJFSDLSFSE"
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              backgroundColor: '#f0f0f0',
              color: '#555',
              fontWeight: 500,
              fontSize: '0.7rem',
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src="https://via.placeholder.com/40" /> {/* Placeholder de avatar */}
            <Box>
              <Typography variant="body1" sx={{ fontWeight: '600' }}>
                Melissa
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                Alojamiento 3-4 nov. 2024
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                Amplio depto - Strotta piso 3
              </Typography>
            </Box>
            <Divider />
            <Typography variant="body2" sx={{ mt: 3, color: '#555' }}>
              Esta reservación se canceló.
            </Typography>
          </Box>
        </Paper>

        <Typography variant="body2" sx={{ mt: 3, color: '#555' }}>
          Esta reservación se canceló.
        </Typography>
      </Box>

      {/* --- Footer de Detalles --- */}
      <Box sx={{ p: 3, borderTop: '1px solid #eee', flexShrink: 0 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Total (BOB)
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: '600' }}>
            {totalAmount}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

// ==================================================================
// --- 5. COMPONENTE PRINCIPAL DE LA PÁGINA ---
// ==================================================================

type RightPanelView = 'details' | 'addMethod';

const FinancialTable: React.FC = () => {
  // Estado para la fila seleccionada (controla si el panel se muestra)
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  // Estado para la vista DENTRO del panel derecho
  const [rightPanelView, setRightPanelView] = useState<RightPanelView>('details');

  // --- Handlers ---
  const handleRowClick = (row: RowData) => {
    setSelectedRow(row);
    setRightPanelView('details');
  };

  const handleCloseDetails = () => {
    setSelectedRow(null);
  };

  // --- Navegación del panel derecho ---
  const navigateToDetails = () => setRightPanelView('details');
  const navigateToAddMethod = () => setRightPanelView('addMethod');

  return (
    <>
      <CssBaseline />
      <Grid container sx={{ height: '100vh', overflow: 'hidden' }}>
        {/* =======================
            COLUMNA IZQUIERDA (TABLA)
        ======================== */}
        <Grid
          size={{ xs: selectedRow ? 8 : 12 }}
          sx={{
            transition: 'all 300ms ease-in-out',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#fff',
          }}
        >
          {/* --- Encabezado de la Tabla --- */}
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              borderBottom: '1px solid #eee',
              flexShrink: 0,
            }}
          >
            <IconButton size="small">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: '600', ml: 1 }}>
              Próximo
            </Typography>
          </Box>

          {/* --- Barra de Filtros --- */}
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              borderBottom: '1px solid #eee',
              flexShrink: 0,
            }}
          >
            <TextField
              variant="outlined"
              size="small"
              placeholder="Busca cobros pendientes"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '25px',
                  backgroundColor: '#f5f5f5',
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: '1px solid #ddd',
                  },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button variant="outlined" endIcon={<KeyboardArrowDownIcon />} sx={filterChipStyle}>
              Todas las fechas
            </Button>
            <Button variant="outlined" endIcon={<KeyboardArrowDownIcon />} sx={filterChipStyle}>
              Todos los anuncios
            </Button>
          </Box>

          {/* --- Contenido Principal (Tabla) --- */}
          <Box
            sx={{
              flexGrow: 1,
              overflow: 'auto',
              p: 3,
              backgroundColor: '#fcfcfc',
            }}
          >
            <Paper
              variant="outlined"
              sx={{
                borderRadius: '16px',
                overflow: 'hidden',
                borderColor: '#e0e0e0',
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{
                        '& .MuiTableCell-root': {
                          backgroundColor: '#fafafa',
                          color: '#555',
                          fontWeight: 500,
                        },
                      }}
                    >
                      <TableCell>Estado</TableCell>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Propiedad</TableCell>
                      <TableCell>Monto</TableCell>
                      <TableCell>Método</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockData.map((row) => (
                      <TableRow
                        key={row.id}
                        onClick={() => handleRowClick(row)}
                        hover
                        sx={{
                          cursor: 'pointer',
                          backgroundColor: selectedRow?.id === row.id ? '#f0f8ff' : 'inherit',
                        }}
                      >
                        <TableCell>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: '#d9534f',
                              }}
                            />
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {row.estado}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {row.detalleEstado}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{row.fecha}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {row.propiedad}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {row.monto}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{row.metodo}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>

          {/* --- Footer de la Tabla --- */}
          <Box
            sx={{
              p: 2,
              borderTop: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              BOB 500.00
            </Typography>
            <Button variant="contained" sx={footerButtonStyle}>
              Exportar reporte
            </Button>
          </Box>
        </Grid>

        {/* =======================
            COLUMNA DERECHA (DINÁMICA)
        ======================== */}
        {selectedRow && (
          <Grid
            size={{ xs: 4 }}
            sx={{
              height: '100vh',
              borderLeft: '1px solid #e0e0e0',
              backgroundColor: '#fff',
            }}
          >
            {/* --- Renderizado Condicional de la Vista --- */}
            {rightPanelView === 'details' ? (
              <PaymentDetailsView
                onClose={handleCloseDetails}
                onNavigateToAddMethod={navigateToAddMethod}
                data={selectedRow}
              />
            ) : (
              <AddMethodView onBack={navigateToDetails} />
            )}
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default FinancialTable;
