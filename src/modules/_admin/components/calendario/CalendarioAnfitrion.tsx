// 📁 components/CalendarioAnfitrion.tsx
import { useRef, useState, useEffect } from "react";
import { Box, Select, MenuItem, Button } from "@mui/material";
import CalendarioMensual from "./CalendarioMensual";
import CalendarioAnual from "./CalendarioAnual";
import PanelConfiguracion from "./PanelConfiguracion";
import { fetchProperties, Property } from '@/models/interfaces/calendarService';
import Grid from '@mui/material/Grid2';

const CalendarioAnfitrion = () => {
  const [vista, setVista] = useState<"mensual" | "anual">("mensual");
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState<string>("");
  const [diasSeleccionados, setDiasSeleccionados] = useState<string[]>([]);
  const [propiedades, setPropiedades] = useState<Property[]>([]);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const currentMonthRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchProperties().then((data) => {
      setPropiedades(data);
      if (!propiedadSeleccionada && data.length > 0) {
        setPropiedadSeleccionada(data[0].id);
      }
    });
  }, []);

  const handleIrAlMesActual = () => {
    if (currentMonthRef.current && scrollRef.current) {
      const top = currentMonthRef.current.offsetTop;
      scrollRef.current.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <Box p={2}>
      <Grid container spacing={2}>
        <Grid size={{xs: 12, md: 9}}>
          {/* Controles superiores */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} gap={2}>
            <Box display="flex" gap={1}>
              <Select
                size="small"
                value={propiedadSeleccionada}
                onChange={(e) => setPropiedadSeleccionada(e.target.value)}
              >
                {propiedades.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>

              <Select
                size="small"
                value={vista}
                onChange={(e) => setVista(e.target.value as any)}
              >
                <MenuItem value="mensual">Mensual</MenuItem>
                <MenuItem value="anual">Anual</MenuItem>
              </Select>
            </Box>

            <Button size="small" variant="outlined" onClick={handleIrAlMesActual}>
              Ir al mes actual 
            </Button>
          </Box>

          {vista === "mensual" ? (
            <CalendarioMensual
              propiedadId={propiedadSeleccionada}
              diasSeleccionados={diasSeleccionados}
              onSeleccionarDias={setDiasSeleccionados}
              onChangePropiedad={setPropiedadSeleccionada}
              vista={vista}
              onChangeVista={setVista}
              scrollRef={scrollRef}
              currentMonthRef={currentMonthRef}
            />
          ) : (
            <CalendarioAnual
              propiedadId={propiedadSeleccionada}
              diasSeleccionados={diasSeleccionados}
              onSeleccionarDias={setDiasSeleccionados}
              scrollRef={scrollRef}
              currentMonthRef={currentMonthRef}
            />
          )}
        </Grid>

        <Grid size={{xs: 12, md: 3}}>
          <PanelConfiguracion diasSeleccionados={diasSeleccionados} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CalendarioAnfitrion;
