import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  TextField,
  Button,
  Fade,
  Slide,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  IconButton,
  Stack,
  InputAdornment,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import EditIcon from "@mui/icons-material/Edit";

import PanelDisponibilidad from "./PanelDisponibilidad";

interface Props {
  diasSeleccionados: string[];
}

const PanelConfiguracion: React.FC<Props> = ({ diasSeleccionados }) => {
  const [tab, setTab] = useState("precios");
  const [precioNoche, setPrecioNoche] = useState(120);
  const [precioFinSemana, setPrecioFinSemana] = useState(150);
  const [descuentoSemanal, setDescuentoSemanal] = useState(10);
  const [descuentoMensual, setDescuentoMensual] = useState(25);
  const [_, setPromoAplicada] = useState(false);

  const [modoEdicion, setModoEdicion] = useState<null | string>(null);
  const [tempValor, setTempValor] = useState<number>(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleGuardar = () => {
    if (modoEdicion === "precioNoche") setPrecioNoche(tempValor);
    if (modoEdicion === "precioFinSemana") setPrecioFinSemana(tempValor);
    if (modoEdicion === "descuentoSemanal") setDescuentoSemanal(tempValor);
    if (modoEdicion === "descuentoMensual") setDescuentoMensual(tempValor);
    if (modoEdicion === "promocion") setPromoAplicada(true);
    setModoEdicion(null);
  };

  const handleEditar = (id: string, valor?: number) => {
    setModoEdicion(id);
    setTempValor(valor ?? 0);
  };

  const renderEditor = (titulo: string, esPromocion = false) => (
    <Slide direction="right" in={!!modoEdicion} mountOnEnter unmountOnExit>
      <Box>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <IconButton size="small" onClick={() => setModoEdicion(null)}>
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
        </Box>
        <Typography variant="subtitle2" mb={1}>{titulo}</Typography>

        {esPromocion ? (
          <Box>
            <Typography variant="h4" fontWeight={600}>20 % de descuento</Typography>
            <Typography variant="body2" gutterBottom>
              para las próximas 3 reservaciones
            </Typography>
          </Box>
        ) : (
          <TextField
            type="number"
            fullWidth
            value={tempValor}
            onChange={(e) => setTempValor(Number(e.target.value))}
            variant="standard"
            onClick={(e) => e.stopPropagation()}
            InputProps={{
              disableUnderline: true,
              endAdornment: (
                <InputAdornment position="end">
                  <EditIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 1 }}
          />
        )}

        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          onClick={handleGuardar}
          sx={{ mt: 2 }}
        >
          Guardar
        </Button>
      </Box>
    </Slide>
  );

  const renderEditableBox = (label: string, valor: number, id: string) => (
    <Box mb={2}>
      <Fade in>
        <Paper
          onClick={() => handleEditar(id, valor)}
          sx={{ p: 2, borderRadius: 2, border: "1px solid #ccc", cursor: "pointer" }}
        >
          <Typography variant="subtitle2">{label}</Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6" fontWeight={600}>${valor}</Typography>
            {modoEdicion !== id && <EditIcon fontSize="small" color="action" />}
          </Stack>
        </Paper>
      </Fade>
    </Box>
  );

  // const renderDescuentoBox = (tipo: "semanal" | "mensual", porcentaje: number, id: string) => {
  //   const label = tipo === "semanal" ? "SEMANAL" : "MENSUAL";
  //   const subtitulo = tipo === "semanal" ? "por 7 noches o más" : "por 28 noches o más";

  //   return (
  //     <Box mb={2}>
  //       <Fade in>
  //         <Paper
  //           onClick={() => handleEditar(id, porcentaje)}
  //           sx={{ p: 2, borderRadius: 2, border: "1px solid #ccc", cursor: "pointer" }}
  //         >
  //           <Typography variant="caption">{label}</Typography>
  //           <Typography variant="body2" fontSize={12}>{subtitulo}</Typography>
  //           <Stack direction="row" alignItems="center" spacing={1}>
  //             <Typography variant="h5" fontWeight={600}>{porcentaje}%</Typography>
  //             {modoEdicion !== id && <EditIcon fontSize="small" color="action" />}
  //           </Stack>
  //         </Paper>
  //       </Fade>
  //     </Box>
  //   );
  // };

  const renderPromocion = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Promociones</Typography>
      <Typography variant="body2" gutterBottom>
        Establece descuentos para estadías de corta duración para obtener nuevas reservaciones.
      </Typography>

      <Fade in>
        <Paper
          sx={{
            p: 2,
            borderRadius: 2,
            border: "1px solid #ccc",
            mt: 2,
            cursor: "pointer",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          onClick={() => handleEditar("promocion")}
        >
          <Typography variant="subtitle2" fontWeight={600}>
            Promoción para anuncio nuevo. Atrae a tus primeros huéspedes
          </Typography>
          <ArrowForwardIosIcon fontSize="small" />
        </Paper>
      </Fade>
    </Box>
  );

  return (
    <Box>
      <Tabs
        value={tab}
        onChange={(_, val) => setTab(val)}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Precios" value="precios" sx={{ fontWeight: tab === "precios" ? 600 : 400 }} />
        <Tab label="Disponibilidad" value="disponibilidad" sx={{ fontWeight: tab === "disponibilidad" ? 600 : 400 }} />
      </Tabs>

      {tab === "precios" && (
        <Box mt={2}>
          <Slide direction="left" in={!modoEdicion} mountOnEnter unmountOnExit>
            <Box>
              <Accordion defaultExpanded={!isMobile} disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">Precio base</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {renderEditableBox("Precio por noche", precioNoche, "precioNoche")}
                  {renderEditableBox("Precio personalizado por fin de semana", precioFinSemana, "precioFinSemana")}
                </AccordionDetails>
              </Accordion>

              {/* <Accordion defaultExpanded={!isMobile} disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">Descuentos</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {renderDescuentoBox("semanal", descuentoSemanal, "descuentoSemanal")}
                  {renderDescuentoBox("mensual", descuentoMensual, "descuentoMensual")}
                  <Paper sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid #ccc",
                    mt: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}>
                    <Typography variant="body2">Más descuentos</Typography>
                    <ArrowForwardIosIcon fontSize="small" />
                  </Paper>
                </AccordionDetails>
              </Accordion> */}

              <Accordion defaultExpanded={!isMobile} disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">Promociones</Typography>
                </AccordionSummary>
                <AccordionDetails>{renderPromocion()}</AccordionDetails>
              </Accordion>
            </Box>
          </Slide>

          {modoEdicion === "precioNoche" && renderEditor("Precio por noche")}
          {modoEdicion === "precioFinSemana" && renderEditor("Precio personalizado por fin de semana")}
          {modoEdicion === "descuentoSemanal" && renderEditor("Descuento semanal (%)")}
          {modoEdicion === "descuentoMensual" && renderEditor("Descuento mensual (%)")}
          {modoEdicion === "promocion" && renderEditor("Promoción para anuncio nuevo", true)}
        </Box>
      )}

      {tab === "disponibilidad" && (
        <Box mt={2}>
          <PanelDisponibilidad />
        </Box>
      )}
    </Box>
  );
};

export default PanelConfiguracion;
