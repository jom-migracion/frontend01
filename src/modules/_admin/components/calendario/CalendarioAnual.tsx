
// 📁 components/CalendarioAnual.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { fetchProperties, Property } from '@/models/interfaces/calendarService';

interface Props {
  propiedadId: string;
  diasSeleccionados: string[];
  onSeleccionarDias: (dias: string[]) => void;
  scrollRef: React.RefObject<HTMLDivElement>;
  currentMonthRef: React.RefObject<HTMLDivElement>;
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

const CalendarioAnual: React.FC<Props> = ({ propiedadId, diasSeleccionados, onSeleccionarDias, scrollRef, currentMonthRef }) => {
  const year = new Date().getFullYear();
  const today = new Date();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleDia = (fecha: string) => {
    if (diasSeleccionados.includes(fecha)) {
      onSeleccionarDias(diasSeleccionados.filter((d) => d !== fecha));
    } else {
      onSeleccionarDias([...diasSeleccionados, fecha]);
    }
  };

  const [reservas, setReservas] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchProperties().then((props) => {
      const prop = props.find((p) => p.id === propiedadId);
      if (prop) {
        const precios: Record<string, number> = {};
        prop.reservations.forEach((r) => {
          precios[r.date] = r.amount;
        });
        setReservas(precios);
      }
    });
  }, [propiedadId]);

  return (
    <Box sx={{ maxHeight: "70vh", overflowY: "auto", pr: 1 }} ref={scrollRef}>
      {Array.from({ length: 6 }, (_, fila) => (
        <Grid container spacing={2} key={fila} mb={2}>
          {[0, 1].map((col) => {
            const mesIndex = fila * 2 + col;
            const dias = getMonthDays(year, mesIndex);
            const monthName = new Intl.DateTimeFormat("es-ES", { month: "long" }).format(
              new Date(year, mesIndex)
            );
            const isCurrentMonth = mesIndex === today.getMonth();

            return (
              <Grid item xs={12} md={6} key={mesIndex}>
                <Box ref={isCurrentMonth ? currentMonthRef : null}>
                  <Typography
                    variant="h6"
                    textTransform="capitalize"
                    gutterBottom
                    sx={{ position: "sticky", top: 0, bgcolor: "white", zIndex: 1, py: 1 }}
                  >
                    {monthName} {year}
                  </Typography>

                  <Grid container columns={7} spacing={0}>
                    {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day, idx) => (
                      <Grid item xs={1} key={idx}>
                        <Typography align="center" fontWeight="bold">
                          {day}
                        </Typography>
                      </Grid>
                    ))}

                    {Array(dias[0].getDay())
                      .fill(0)
                      .map((_, idx) => (
                        <Grid item xs={1} key={`empty-${idx}`} />
                      ))}

                    {dias.map((dia) => {
                      const fechaStr = formatDate(dia);
                      const esPasado = dia < new Date(today.toDateString());
                      const seleccionado = diasSeleccionados.includes(fechaStr);
                      const precio = reservas[fechaStr] ?? null;

                      return (
                        <Grid item xs={1} key={fechaStr}>
                          <Paper
                            onClick={() => {
                              if (!esPasado) toggleDia(fechaStr);
                            }}
                            sx={{
                              height: isMobile ? 50 : 60,
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
              </Grid>
            );
          })}
        </Grid>
      ))}
    </Box>
  );
};

export default CalendarioAnual;
