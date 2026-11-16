import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Paper,
  Box,
  Select,
  MenuItem,
  Button,
  Popover
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useTranslation } from "react-i18next";

const PanelDisponibilidad: React.FC = () => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [campoActivo, setCampoActivo] = useState<string | null>(null);

  const [preaviso, setPreaviso] = useState("El mismo día");
  const [preavisoHora, setPreavisoHora] = useState("9:00 a.m.");
  const [tiempoPreparacion, setTiempoPreparacion] = useState("1 noche antes y después");
  const [ventanaDisponibilidad, setVentanaDisponibilidad] = useState("12 meses de anticipación");

  // Mapa para traducir los valores visualmente sin cambiar el estado interno
  const translationMap: Record<string, string> = {
    'El mismo día': 'sameDay',
    '1 día': 'oneDay',
    '2 días': 'twoDays',
    '9:00 a.m.': '9am',
    '12:00 p.m.': '12pm',
    '3:00 p.m.': '3pm',
    '1 noche antes y después': 'oneNightPrep',
    '2 noches': 'twoNightsPrep',
    'Sin preparación': 'noPrep',
    '12 meses de anticipación': '12months',
    '6 meses': '6months',
    '3 meses': '3months'
  };

  // Helper para traducir valores
  const getTranslatedOption = (value: string) => {
    const key = translationMap[value];
    // Usamos la llave con comillas simples en la lógica
    return key ? t(`availabilityPanel.options.${key}`) : value;
  };
  
  const handleOpen = (event: React.MouseEvent<HTMLElement>, campo: string) => {
    setAnchorEl(event.currentTarget);
    setCampoActivo(campo);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCampoActivo(null);
  };

  const handleGuardar = () => {
    console.log(`Guardando ${campoActivo}`);
    handleClose();
  };

  const open = Boolean(anchorEl);

  const renderPopoverContent = () => {
    switch (campoActivo) {
      case "preaviso":
        return (
          <>
            <Typography variant="body2" gutterBottom>
              {t('availabilityPanel.preaviso.question')}
            </Typography>
            <Select
              fullWidth
              value={preaviso}
              onChange={(e) => setPreaviso(e.target.value)}
              variant="standard"
            >
              <MenuItem value="El mismo día">{t('availabilityPanel.options.sameDay')}</MenuItem>
              <MenuItem value="1 día">{t('availabilityPanel.options.oneDay')}</MenuItem>
              <MenuItem value="2 días">{t('availabilityPanel.options.twoDays')}</MenuItem>
            </Select>
            <Button variant="outlined" sx={{ mt: 2 }} onClick={handleGuardar}>
              {t('availabilityPanel.save')}
            </Button>
          </>
        );
      case "preavisoHora":
        return (
          <>
            <Typography variant="body2" gutterBottom>
              {t('availabilityPanel.cutoffTime.question')}
            </Typography>
            <Select
              fullWidth
              value={preavisoHora}
              onChange={(e) => setPreavisoHora(e.target.value)}
              variant="standard"
            >
              <MenuItem value="9:00 a.m.">{t('availabilityPanel.options.9am')}</MenuItem>
              <MenuItem value="12:00 p.m.">{t('availabilityPanel.options.12pm')}</MenuItem>
              <MenuItem value="3:00 p.m.">{t('availabilityPanel.options.3pm')}</MenuItem>
            </Select>
            <Button variant="outlined" sx={{ mt: 2 }} onClick={handleGuardar}>
              {t('availabilityPanel.save')}
            </Button>
          </>
        );
      case "tiempoPreparacion":
        return (
          <>
            <Typography variant="body2" gutterBottom>
              {t('availabilityPanel.prepTime.question')}
            </Typography>
            <Select
              fullWidth
              value={tiempoPreparacion}
              onChange={(e) => setTiempoPreparacion(e.target.value)}
              variant="standard"
            >
              <MenuItem value="1 noche antes y después">{t('availabilityPanel.options.oneNightPrep')}</MenuItem>
              <MenuItem value="2 noches">{t('availabilityPanel.options.twoNightsPrep')}</MenuItem>
              <MenuItem value="Sin preparación">{t('availabilityPanel.options.noPrep')}</MenuItem>
            </Select>
            <Button variant="outlined" sx={{ mt: 2 }} onClick={handleGuardar}>
              {t('availabilityPanel.save')}
            </Button>
          </>
        );
      case "ventanaDisponibilidad":
        return (
          <>
            <Typography variant="body2" gutterBottom>
              {t('availabilityPanel.window.question')}
            </Typography>
            <Select
              fullWidth
              value={ventanaDisponibilidad}
              onChange={(e) => setVentanaDisponibilidad(e.target.value)}
              variant="standard"
            >
              <MenuItem value="12 meses de anticipación">{t('availabilityPanel.options.12months')}</MenuItem>
              <MenuItem value="6 meses">{t('availabilityPanel.options.6months')}</MenuItem>
              <MenuItem value="3 meses">{t('availabilityPanel.options.3months')}</MenuItem>
            </Select>
            <Button variant="outlined" sx={{ mt: 2 }} onClick={handleGuardar}>
              {t('availabilityPanel.save')}
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Accordion defaultExpanded disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">
          {t('availabilityPanel.title')}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" gap={3}>
          {/* Preaviso */}
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid #ccc",
              cursor: "pointer",
              position: "relative"
            }}
            onClick={(e) => handleOpen(e, "preaviso")}
          >
            <Box sx={{ position: "absolute", top: 8, right: 8 }}>
              <KeyboardArrowDownIcon fontSize="small" color="action" />
            </Box>
            <Typography variant="subtitle2" fontWeight={600}>
              {t('availabilityPanel.preaviso.label')}
            </Typography>
            <Typography variant="body2">
              {getTranslatedOption(preaviso)}
            </Typography>
          </Paper>

          {/* Preaviso para el mismo día (condicional) */}
          {preaviso === "El mismo día" && (
            <Paper
              sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid #ccc",
                cursor: "pointer",
                position: "relative"
              }}
              onClick={(e) => handleOpen(e, "preavisoHora")}
            >
              <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                <KeyboardArrowDownIcon fontSize="small" color="action" />
              </Box>
              <Typography variant="subtitle2" fontWeight={600}>
                {t('availabilityPanel.preaviso.sameDayLabel')}
              </Typography>
              <Typography variant="body2">
                {getTranslatedOption(preavisoHora)}
              </Typography>
            </Paper>
          )}

          {/* Tiempo de preparación */}
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid #ccc",
              cursor: "pointer",
              position: "relative"
            }}
            onClick={(e) => handleOpen(e, "tiempoPreparacion")}
          >
            <Box sx={{ position: "absolute", top: 8, right: 8 }}>
              <KeyboardArrowDownIcon fontSize="small" color="action" />
            </Box>
            <Typography variant="subtitle2" fontWeight={600}>
              {t('availabilityPanel.prepTime.label')}
            </Typography>
            <Typography variant="body2">
              {getTranslatedOption(tiempoPreparacion)}
            </Typography>
          </Paper>

          {/* Ventana de disponibilidad */}
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid #ccc",
              cursor: "pointer",
              position: "relative"
            }}
            onClick={(e) => handleOpen(e, "ventanaDisponibilidad")}
          >
            <Box sx={{ position: "absolute", top: 8, right: 8 }}>
              <KeyboardArrowDownIcon fontSize="small" color="action" />
            </Box>
            <Typography variant="subtitle2" fontWeight={600}>
              {t('availabilityPanel.window.label')}
            </Typography>
            <Typography variant="body2">
              {getTranslatedOption(ventanaDisponibilidad)}
            </Typography>
          </Paper>

          {/* Más opciones */}
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid #ccc",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer"
            }}
          >
            <Typography variant="body2">
              {t('availabilityPanel.moreOptions')}
              <br />
              {t('availabilityPanel.restrictedDays')}
            </Typography>
            <ArrowForwardIosIcon fontSize="small" />
          </Paper>

          {/* Popover desplegable */}
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          >
            <Box p={2} minWidth={300}>
              {renderPopoverContent()}
            </Box>
          </Popover>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default PanelDisponibilidad;