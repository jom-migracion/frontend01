// 📁 components/PreavisoConfig.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  Button,
  Slide,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const opciones = [
  "El mismo día",
  "1 día",
  "2 días",
  "3 días",
  "4 días",
  "5 días",
];

interface Props {
  valorActual: string;
  onCancelar: () => void;
  onGuardar: (nuevoValor: string) => void;
}

const PreavisoConfig: React.FC<Props> = ({ valorActual, onCancelar, onGuardar }) => {
  const [valor, setValor] = useState(valorActual);
  const [cambio, setCambio] = useState(false);

  useEffect(() => {
    setCambio(valor !== valorActual);
  }, [valor, valorActual]);

  return (
    <Slide direction="right" in mountOnEnter unmountOnExit>
      <Box>
        <Box display="flex" alignItems="center" mb={2}>
          <IconButton size="small" onClick={onCancelar}>
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
        </Box>

        <Typography variant="subtitle1" mb={2}>Preaviso</Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <Select
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            variant="standard"
            disableUnderline
          >
            {opciones.map((op) => (
              <MenuItem key={op} value={op}>{op}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          fullWidth
          variant="contained"
          disabled={!cambio}
          onClick={() => onGuardar(valor)}
        >
          Guardar
        </Button>
      </Box>
    </Slide>
  );
};

export default PreavisoConfig;
