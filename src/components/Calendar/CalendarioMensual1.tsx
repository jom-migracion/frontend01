import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { Box, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { fetchProperties, Property } from './calendarService';
import { format } from 'date-fns';

interface Props {
  propiedadId: string;
  diasSeleccionados: string[];
  onSeleccionarDias: (dias: string[]) => void;
  vista: 'mensual' | 'anual';
  onChangeVista: (v: 'mensual' | 'anual') => void;
  propertyInfo: any;
}

interface ReservationInfo {
  guestName: string;
  booid: string;
  isStart: boolean;
  isEnd: boolean;
  isMiddle: boolean;
}

const formatDate = (date: Date) => date.toISOString().split('T')[0];

const getReservationInfo = (date: Date, reservations: any[]): ReservationInfo | null => {
  if (!Array.isArray(reservations)) return null;
  
  const targetDateString = format(date, 'yyyy-MM-dd') + 'T00:00:00';
  
  // Buscar si existe una reserva que incluya esta fecha
  for (const reservation of reservations) {
    if (!Array.isArray(reservation.calendarDays)) continue;
    
    // Buscar en los calendarDays de esta reserva
    const foundDay = reservation.calendarDays.find((day: any) => day.date === targetDateString);
    
    if (foundDay) {
      const guestName = reservation.userIdRenterNavigation?.firstName || 
                       reservation.userIdRenterNavigation?.name || 
                       'Huésped';
      
      // Determinar si es inicio, fin o medio de la reserva
      const sortedDays = reservation.calendarDays
        .map((d: any) => d.date)
        .sort();
      const isStart = sortedDays[0] === targetDateString;
      const isEnd = sortedDays[sortedDays.length - 1] === targetDateString;
      const isMiddle = !isStart && !isEnd;
      
      return {
        guestName,
        booid: reservation.booid || reservation.id,
        isStart,
        isEnd,
        isMiddle,
      };
    }
  }
  
  return null;
};

const getMonthDays = (year: number, month: number): Date[] => {
  const days: Date[] = [];
  const lastDay = new Date(year, month + 1, 0);
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  return days;
};

const DiaCelda = React.memo(
  ({
    dia,
    seleccionado,
    esPasado,
    precio,
    isMobile,
    toggleDia,
    currentDay,
    bloquearDia,
    reservaInfo,
  }: {
    dia: Date;
    seleccionado: boolean;
    esPasado: boolean;
    precio: number | null;
    isMobile: boolean;
    toggleDia: (fecha: string) => void;
    currentDay: boolean;
    bloquearDia: boolean;
    reservaInfo?: ReservationInfo | null;
  }) => {
    const fechaStr = formatDate(dia);

    return (
      <Grid size={{ xs: 1 }} key={fechaStr}>
        <Paper
          elevation={0}
          onClick={() => {
            if (!esPasado && !reservaInfo) toggleDia(fechaStr);
          }}
          sx={{
            height: isMobile ? 60 : 120,
            bgcolor: reservaInfo 
              ? '#4CAF50' 
              : bloquearDia 
              ? '#bbb' 
              : (seleccionado ? '#5B4CA0' : esPasado ? '#f0f0f0' : 'white'),
            color: reservaInfo || seleccionado ? 'white' : 'inherit',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: esPasado || reservaInfo ? 'not-allowed' : 'pointer',
            border: currentDay ? '4px solid #5B4CA0' : '1px solid #393064',
            borderRadius: 5,
            p: 0.5,
            m: 1,
            position: 'relative',
          }}
        >
          <Typography variant="body2">{dia.getDate()}</Typography>
          
          {reservaInfo ? (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: '#4CAF50',
                color: 'white',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: isMobile ? 10 : 12,
                fontWeight: 'bold',
                textAlign: 'center',
                minWidth: '80%',
                zIndex: 2,
              }}
            >
              <Typography variant="caption" sx={{ fontSize: isMobile ? 8 : 10 }}>
                {reservaInfo.guestName}
              </Typography>
            </Box>
          ) : bloquearDia ? (
            <Typography variant="caption" fontSize={11}>
              $0
            </Typography>
          ) : (
            precio !== null && (
              <Typography variant="caption" fontSize={11}>
                ${precio}
              </Typography>
            )
          )}
        </Paper>
      </Grid>
    );
  }
);

const CalendarioMensual1: React.FC<Props> = ({
  propiedadId,
  diasSeleccionados,
  onSeleccionarDias,
  propertyInfo,
}) => {
  const today = new Date();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const containerRef = useRef<HTMLDivElement | null>(null);
  const currentMonthRef = useRef<HTMLDivElement | null>(null);
  console.log('CALENDAR MONTHLY');
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

  const toggleDia = useCallback(
    (fecha: string) => {
      if (diasSeleccionados.includes(fecha)) {
        onSeleccionarDias(diasSeleccionados.filter((d) => d !== fecha));
      } else {
        onSeleccionarDias([...diasSeleccionados, fecha]);
      }
    },
    [diasSeleccionados, onSeleccionarDias]
  );

  useEffect(() => {
    fetchProperties().then((props) => {
      setPropiedades(props);
      const prop = props.find((p) => p.id === propiedadId) || props[0];
      if (prop) {
        const precios: Record<string, number> = {};
        prop.reservations.forEach((r) => {
          precios[r.date] = r.amount;
        });
        setReservas(precios);
      }
    });
  }, [propiedadId]);

  useEffect(() => {
    // Esperar a que el DOM se renderice completamente
    const scrollToCurrentMonth = () => {
      if (currentMonthRef.current && containerRef.current) {
        console.log('📅 Posicionando en el mes actual...');
        const top = currentMonthRef.current.offsetTop;
        containerRef.current.scrollTo({
          top: top - 100, // Offset para mejor visualización
          behavior: 'smooth',
        });
      }
    };

    // Usar timeout para asegurar que el renderizado esté completo
    const timeoutId = setTimeout(scrollToCurrentMonth, 100);

    return () => clearTimeout(timeoutId);
  }, [monthsToRender]); // Ejecutar cuando cambie la lista de meses

  return (
    <Box>
      <Box sx={{ maxHeight: '70vh', overflowY: 'auto', pr: 1 }} ref={containerRef}>
        {monthsToRender.map(({ year, month }) => {
          const dias = getMonthDays(year, month);
          const monthName = new Intl.DateTimeFormat('es-ES', {
            month: 'long',
          }).format(new Date(year, month));
          const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

          // Calcular espacios vacíos al inicio (Lunes = 0, Domingo = 6)
          let emptyDays = dias[0].getDay() - 1; // Restar 1 para que Lunes sea 0
          if (emptyDays === -1) emptyDays = 6; // Si es Domingo, son 6 espacios vacíos

          return (
            <Box key={`${year}-${month}`} mb={4} ref={isCurrentMonth ? currentMonthRef : null}>
              <Typography
                variant="h6"
                textTransform="capitalize"
                gutterBottom
                align="center"
                sx={{ position: 'sticky', top: 0, bgcolor: 'white', zIndex: 1, py: 1 }}
              >
                {monthName} {year}
              </Typography>

              <Grid container columns={7} spacing={0}>
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(
                  (day, i) => (
                    <Grid size={{ xs: 1 }} key={i}>
                      <Typography align="center" borderBottom={'1px solid #000'} ml={1} mr={1}>
                        {day}
                      </Typography>
                    </Grid>
                  )
                )}

                {Array(emptyDays)
                  .fill(0)
                  .map((_, i) => (
                    <Grid size={{ xs: 1 }} key={`empty-${i}`} />
                  ))}

                {dias.map((dia) => {
                  const fechaStr = formatDate(dia);
                  const esPasado = dia < new Date(today.toDateString());
                  const seleccionado = diasSeleccionados.includes(fechaStr);
                  // const precio = reservas[fechaStr] ?? null;
                  const currentDay = formatDate(today) === fechaStr;
                  const dateEndWeek = dia.getDay();
                  let bloquedDay = null;
                  let blockDay = false;

                  const dateString = format(dia, 'yyyy-MM-dd') + 'T00:00:00';
                  let newPriceCustomizedDate = -1;

                  // Obtener información de reserva para esta fecha
                  const reservaInfo = getReservationInfo(dia, propertyInfo?.reservations || []);

                  // console.log('Fecha: ', dateString);

                  if (Array.isArray(propertyInfo?.calendarDays)) {
                    bloquedDay = propertyInfo?.calendarDays?.find(
                      (x: any) => x.date + '' === dateString && x.blockType == 1
                    );
                    console.log('Día bloqueado: ', bloquedDay);
                    if(bloquedDay){
                      blockDay = true;
                    }
                    newPriceCustomizedDate =
                      propertyInfo?.calendarDays?.find(
                        (x: any) => x.date + '' === dateString && x.blockType == null
                      )?.price || -1;
                    // console.log(
                    //   'Precio personalizado para la fecha ',
                    //   dateString,
                    //   ': ',
                    //   newPriceCustomizedDate
                    // );
                  }

                  return (
                    <DiaCelda
                      key={fechaStr}
                      dia={dia}
                      seleccionado={seleccionado}
                      esPasado={esPasado}
                      precio={
                        reservaInfo ? null : // No mostrar precio si hay reserva
                        newPriceCustomizedDate > -1
                          ? newPriceCustomizedDate
                          : dateEndWeek == 0 || dateEndWeek == 6
                            ? propertyInfo?.price?.weekendNightlyPrice || 0
                            : propertyInfo?.price?.priceNightly || 0
                      }
                      isMobile={isMobile}
                      toggleDia={toggleDia}
                      currentDay={currentDay}
                      bloquearDia={blockDay}
                      reservaInfo={reservaInfo}
                    />
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

export default CalendarioMensual1;
