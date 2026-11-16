import React, { useMemo, useRef, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { fetchProperties, Property } from '@/models/interfaces/calendarService';
import Grid from '@mui/material/Grid2';

interface Props {
  propiedadId: string;
  diasSeleccionados: string[];
  onSeleccionarDias: (dias: string[]) => void;
  onChangePropiedad: (id: string) => void;
  vista: "mensual" | "anual";
  onChangeVista: (v: "mensual" | "anual") => void;
}

const formatDate = (date: Date) => date.toISOString().split("T")[0];

const getMonthDays = (year: number, month: number): Date[] => {
  const days: Date[] = [];
  // const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  return days;
};

const CalendarioMensual: React.FC<Props> = ({
  propiedadId,
  diasSeleccionados,
  onSeleccionarDias,
  onChangePropiedad,
  vista,
  onChangeVista,
}) => {
  const today = new Date();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const containerRef = useRef<HTMLDivElement | null>(null);
  const currentMonthRef = useRef<HTMLDivElement | null>(null);

  const [reservas, setReservas] = useState<Record<string, number>>({});
  const [propiedades, setPropiedades] = useState<Property[]>([]);

  const monthsToRender = useMemo(() => {
    const list: { year: number; month: number }[] = [];
    for (let offset = -12; offset <= 12; offset++) {
      const d = new Date(today.getFullYear(), today.getMonth() + offset);
      list.push({ year: d.getFullYear(), month: d.getMonth() });
    }
    return list;
  }, [today]);

  const toggleDia = (fecha: string) => {
    if (diasSeleccionados.includes(fecha)) {
      onSeleccionarDias(diasSeleccionados.filter((d) => d !== fecha));
    } else {
      onSeleccionarDias([...diasSeleccionados, fecha]);
    }
  };

  useEffect(() => {
    fetchProperties().then((props) => {
      setPropiedades(props);
      const prop = props.find((p) => p.id === propiedadId) || props[0];
      if (prop) {
        onChangePropiedad(prop.id);
        const precios: Record<string, number> = {};
        prop.reservations.forEach((r) => {
          precios[r.date] = r.amount;
        });
        setReservas(precios);
      }
    });
  }, [propiedadId, onChangePropiedad]);

  useEffect(() => {
    if (currentMonthRef.current && containerRef.current) {
      const top = currentMonthRef.current.offsetTop;
      containerRef.current.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  return (
    <Box>
      
      <Box sx={{ maxHeight: "70vh", overflowY: "auto", pr: 1 }} ref={containerRef}>
        {monthsToRender.map(({ year, month }) => {
          const dias = getMonthDays(year, month);
          const monthName = new Intl.DateTimeFormat("es-ES", { month: "long" }).format(
            new Date(year, month)
          );
          const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

          return (
            <Box
              key={`${year}-${month}`}
              mb={4}
              ref={isCurrentMonth ? currentMonthRef : null}
            >
              <Typography
                variant="h6"
                textTransform="capitalize"
                gutterBottom
                sx={{ position: "sticky", top: 0, bgcolor: "white", zIndex: 1, py: 1 }}
              >
                {monthName} {year}
              </Typography>

              <Grid container columns={7} spacing={0}>
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day, i) => (
                  <Grid size={{xs: 1}} key={i}>
                    <Typography align="center" fontWeight="bold">
                      {day}
                    </Typography>
                  </Grid>
                ))}

                {Array(dias[0].getDay())
                  .fill(0)
                  .map((_, i) => (
                    <Grid size={{xs: 1}} key={`empty-${i}`} />
                  ))}

                {dias.map((dia) => {
                  const fechaStr = formatDate(dia);
                  const esPasado = dia < new Date(today.toDateString());
                  const seleccionado = diasSeleccionados.includes(fechaStr);
                  const precio = reservas[fechaStr] ?? null;

                  return (
                    <Grid size={{xs: 1}} key={fechaStr}>
                      <Paper
                        onClick={() => {
                          if (!esPasado) toggleDia(fechaStr);
                        }}
                        sx={{
                          height: isMobile ? 60 : 80,
                          bgcolor: seleccionado
                            ? "black"
                            : esPasado
                            ? "#f0f0f0"
                            : "white",
                          color: seleccionado ? "white" : "inherit",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: esPasado ? "not-allowed" : "pointer",
                          border: "1px solid #ddd",
                          borderRadius: 0,
                          p: 0.5,
                          m: 0,
                        }}
                      >
                        <Typography variant="body2">{dia.getDate()}</Typography>
                        {precio !== null && (
                          <Typography variant="caption" fontSize={11}>
                            ${precio}
                          </Typography>
                        )}
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default CalendarioMensual