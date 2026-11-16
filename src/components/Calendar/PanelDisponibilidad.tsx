// 📁 components/PanelDisponibilidad.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Slide,
} from "@mui/material";
import PreavisoConfig from "./PreavisoConfig";

const PanelDisponibilidad: React.FC = () => {
  const [minNoches, setMinNoches] = useState(2);
  const [maxNoches, setMaxNoches] = useState(10);
  const [modoEdicion, setModoEdicion] = useState<"min" | "max" | "preaviso" | null>(null);
  const [valorPreaviso, setValorPreaviso] = useState("El mismo día");

  const abrirEdicion = (tipo: "min" | "max" | "preaviso") => {
    setModoEdicion(tipo);
  };

  const guardarPreaviso = (nuevoValor: string) => {
    setValorPreaviso(nuevoValor);
    setModoEdicion(null);
  };

  const cancelar = () => setModoEdicion(null);

  const renderFormularioNoches = (titulo: string, tipo: "min" | "max", valor: number, setValor: (n: number) => void) => (
    <Slide direction="right" in={!!modoEdicion} mountOnEnter unmountOnExit>
      <Box>
        <Typography variant="h6">{titulo}</Typography>
        {/* Aquí podrías reusar la lógica con TextField como en otros formularios */}
      </Box>
    </Slide>
  );

  return (
    <Box>
      <Slide direction="left" in={!modoEdicion} mountOnEnter unmountOnExit>
        <Box>
          <Paper sx={{ p: 2, borderRadius: 2, border: "1px solid #ccc", mb: 2 }}>
            <Box onClick={() => abrirEdicion("min")} sx={{ mb: 2, cursor: "pointer" }}>
              <Typography variant="caption">Número mínimo de noches</Typography>
              <Typography variant="h4" fontWeight={600}>{minNoches}</Typography>
            </Box>

            <Box onClick={() => abrirEdicion("max")} sx={{ cursor: "pointer" }}>
              <Typography variant="caption">Número máximo de noches</Typography>
              <Typography variant="h4" fontWeight={600}>{maxNoches}</Typography>
            </Box>
          </Paper>

          <Paper
            sx={{ p: 2, borderRadius: 2, border: "1px solid #ccc", cursor: "pointer" }}
            onClick={() => abrirEdicion("preaviso")}
          >
            <Typography variant="subtitle2">Preaviso</Typography>
            <Typography variant="body1" fontWeight={500}>{valorPreaviso}</Typography>
          </Paper>
        </Box>
      </Slide>

      {modoEdicion === "min" && renderFormularioNoches("Número mínimo de noches", "min", minNoches, setMinNoches)}
      {modoEdicion === "max" && renderFormularioNoches("Número máximo de noches", "max", maxNoches, setMaxNoches)}
      {modoEdicion === "preaviso" && (
        <PreavisoConfig
          valorActual={valorPreaviso}
          onCancelar={cancelar}
          onGuardar={guardarPreaviso}
        />
      )}
    </Box>
  );
};

export default PanelDisponibilidad;
