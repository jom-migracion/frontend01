import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { Box, Typography, Paper, useTheme, useMediaQuery, Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { format } from 'date-fns';
import CloseIcon from '@mui/icons-material/Close';
import AssertModal from '@/components/AssertModal';
import ReservationInfo from '@/components/ReservationInfo';
import ReservationInfoProps from '@/models/interfaces/ReservationInfoProps';
import { SelectedDay } from '@/models/interfaces/SelectedDay';
import { calculateDaysDifference, formatShortDate } from '@/common/util/dateFunctions';
import { useTranslation } from 'react-i18next';

interface Props {
  propiedadId: string;
  diasSeleccionados: SelectedDay[];
  onSeleccionarDias: (dias: SelectedDay[]) => void;
  vista: 'mensual' | 'anual';
  onChangeVista: (v: 'mensual' | 'anual') => void;
  propertyInfo: any;
  isMobile?: boolean;
  eventos?: CalendarEvent[];
  preparationEvents?: any[];
  onOpenMessaging?: () => void;
}

interface ReservationInfo {
  guestName: string;
  booid: string;
  isStart: boolean;
  isEnd: boolean;
  isMiddle: boolean;
  indiceColor: number;
}

interface CalendarEvent {
  id: string;
  title: string;
  startDate: string; // formato 'YYYY-MM-DD'
  endDate: string; // formato 'YYYY-MM-DD'
  color?: string;
  backgroundColor?: string;
  guests: number;
  checkin: string; // formato 'YYYY-MM-DD'
  checkout: string; // formato 'YYYY-MM-DD'
  totalAmount: number;
}

interface EventBar {
  event: CalendarEvent;
  startCol: number;
  endCol: number;
  row: number;
  width: number;
  left: number;
}

const verdesSuaves = [
  '#abb1acff', // Verde blanquecino
  '#dee4deff', // Té verde pálido
  '#abb1acff', // Verde suave estándar
  '#dee4deff', // Verde menta muy claro
  '#abb1acff', // Verde agua suave
  '#dee4deff', // Verde salvia claro
  '#abb1acff', // Verde bruma
  '#dee4deff', // Verde lima pastel
  '#abb1acff', // Crema de menta
  '#dee4deff', // Verde éxito (soft)
];
const formatDate = (date: Date) => date.toISOString().split('T')[0];

const getReservationInfo = (date: Date, reservations: any[]): ReservationInfo | null => {
  if (!Array.isArray(reservations)) return null;

  const targetDateString = format(date, 'yyyy-MM-dd') + 'T00:00:00';

  // Buscar si existe una reserva que incluya esta fecha
  let indiceReservation = 0;
  for (const reservation of reservations) {
    if (!Array.isArray(reservation.calendarDays)) continue;

    // Buscar en los calendarDays de esta reserva
    const foundDay = reservation.calendarDays.find((day: any) => day.date === targetDateString);

    if (foundDay) {
      const guestName =
        reservation.userIdRenterNavigation?.name +
          ' ' +
          reservation.userIdRenterNavigation?.lastName || 'Huésped';

      // Determinar si es inicio, fin o medio de la reserva
      const sortedDays = reservation.calendarDays.map((d: any) => d.date).sort();
      const isStart = sortedDays[0] === targetDateString;
      const isEnd = sortedDays[sortedDays.length - 1] === targetDateString;
      const isMiddle = !isStart && !isEnd;

      return {
        guestName,
        booid: reservation.booid || reservation.id,
        isStart,
        isEnd,
        isMiddle,
        indiceColor: Math.abs(indiceReservation) % 10,
      };
    }
    indiceReservation++;
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

// Función para calcular las barras de eventos para un mes específico
const calculateEventBars = (eventos: CalendarEvent[], year: number, month: number): EventBar[] => {
  // const monthDays = getMonthDays(year, month);
  const firstDay = new Date(year, month, 1);
  let emptyDays = firstDay.getDay() - 1; // Lunes = 0
  if (emptyDays === -1) emptyDays = 6; // Domingo

  const eventBars: EventBar[] = [];

  eventos.forEach((evento) => {
    const startDate = new Date(evento.startDate + 'T00:00:00');
    const endDate = new Date(evento.endDate + 'T00:00:00');

    // Solo procesar eventos que intersecten con este mes
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);

    if (endDate < monthStart || startDate > monthEnd) return;

    // Calcular el día de inicio y fin dentro del mes
    const startDay = Math.max(
      1,
      startDate.getMonth() === month && startDate.getFullYear() === year ? startDate.getDate() : 1
    );
    const endDay = Math.min(
      monthEnd.getDate(),
      endDate.getMonth() === month && endDate.getFullYear() === year
        ? endDate.getDate()
        : monthEnd.getDate()
    );

    // Crear un set de días para este evento
    const eventDays = new Set();
    for (let day = startDay; day <= endDay; day++) {
      eventDays.add(day);
    }

    // Procesar por semanas
    const processedDays = new Set();

    for (let day = startDay; day <= endDay; day++) {
      if (processedDays.has(day)) continue;

      const currentDate = new Date(year, month, day);
      const dayOfWeek = currentDate.getDay();
      const adjustedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Lunes = 0, Domingo = 6

      // Calcular la semana (fila) - considerando los días vacíos al inicio
      const totalDayIndex = day + emptyDays - 1;
      const weekNumber = Math.floor(totalDayIndex / 7);

      const startCol = adjustedDayOfWeek;
      let endCol = adjustedDayOfWeek;

      // Calcular cuántos días consecutivos en esta semana pertenecen al evento
      let currentDay = day;
      while (currentDay <= endDay && endCol < 6) {
        const nextDay = currentDay + 1;
        const nextDate = new Date(year, month, nextDay);
        const nextDayOfWeek = nextDate.getDay();
        const nextAdjustedDayOfWeek = nextDayOfWeek === 0 ? 6 : nextDayOfWeek - 1;

        if (nextAdjustedDayOfWeek === endCol + 1 && eventDays.has(nextDay)) {
          endCol = nextAdjustedDayOfWeek;
          processedDays.add(nextDay);
          currentDay = nextDay;
        } else {
          break;
        }
      }

      processedDays.add(day);

      // Calcular width y left con mejor precisión
      const columnCount = endCol - startCol + 1;
      const width = columnCount * 14.28 - 1.85; // Ancho basado en número de columnas
      const left = startCol * 14.28 + 1.65; // Posición izquierda con offset mínimo

      eventBars.push({
        event: evento,
        startCol,
        endCol,
        row: weekNumber,
        width,
        left,
      });
    }
  });

  return eventBars;
};

const DiaCelda = React.memo(
  ({
    dia,
    seleccionado,
    esPasado,
    precio,
    isMobile,
    isVerySmallMobile,
    toggleDia,
    currentDay,
    bloquearDia,
    preparationDay,
    reservaInfo,
    onReservaClick,
  }: {
    dia: Date;
    seleccionado: boolean;
    esPasado: boolean;
    precio: number | null;
    isMobile: boolean;
    isVerySmallMobile: boolean;
    toggleDia: (fecha: string, price: number) => void;
    currentDay: boolean;
    bloquearDia: boolean;
    preparationDay: boolean;
    reservaInfo?: ReservationInfo | null;
    onReservaClick?: (dia: Date) => void;
  }) => {
    const fechaStr = formatDate(dia);
    const dayNumberColor = esPasado ? '#b6b8bf' : '#5f636f';
    const metaTextColor = esPasado ? '#c8cbd3' : '#a2a7b3';
    const selectedBackground = '#f2f4f8';

    return (
      <Grid size={{ xs: 1 }} key={fechaStr} sx={{ padding: 0, margin: 0, minWidth: 0 }}>
        <Paper
          data-calendar-date={fechaStr}
          elevation={0}
          onClick={() => {
            if (!preparationDay) {
              if (reservaInfo && onReservaClick) {
                onReservaClick(dia);
              } else if (!esPasado) {
                toggleDia(fechaStr, precio !== null ? precio : 0);
              }
            }
          }}
          sx={{
            height: isVerySmallMobile ? 42 : isMobile ? 58 : 96,
            bgcolor: reservaInfo
              ? preparationDay
                ? '#f2f4f8'
                : verdesSuaves[reservaInfo.indiceColor]
              : bloquearDia
                ? '#f7f8fa'
                : seleccionado
                  ? selectedBackground
                  : esPasado
                    ? '#fafbfc'
                    : preparationDay
                      ? '#f2f4f8'
                      : 'white',
            color: seleccionado ? '#1c2230' : 'inherit',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            cursor: reservaInfo ? 'pointer' : esPasado ? 'not-allowed' : 'pointer',
            border: currentDay ? '1px solid #5B4CA0' : '1px solid #eceff4',
            borderRadius: 0,
            p: isVerySmallMobile ? 0.35 : isMobile ? 0.5 : 1,
            m: 0,
            position: 'relative',
            width: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
            <Typography
              variant="body2"
              sx={{
                textDecoration: bloquearDia ? 'line-through' : 'none',
                fontSize: isVerySmallMobile ? 9 : isMobile ? 12 : 18,
                fontWeight: seleccionado || currentDay ? 700 : 600,
                lineHeight: 1,
                margin: 0,
                padding: 0,
                width: isVerySmallMobile ? 18 : isMobile ? 22 : 30,
                height: isVerySmallMobile ? 18 : isMobile ? 22 : 30,
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: seleccionado || currentDay ? 'white' : dayNumberColor,
                backgroundColor: seleccionado || currentDay ? '#5B4CA0' : 'transparent',
              }}
            >
              {dia.getDate()}
            </Typography>
          </Box>
          {
          preparationDay ? (
            <Box
              component="img"
              src="/images/hourglass.png"
              alt="Día de preparación"
              sx={{
                width: isVerySmallMobile ? 14 : isMobile ? 24 : 46,
                height: isVerySmallMobile ? 14 : isMobile ? 24 : 46,
                position: 'absolute',
                top: isVerySmallMobile ? '12pt' : isMobile ? '12pt' : '20pt',
                alignSelf: 'center',
                mb: isVerySmallMobile ? 0.2 : 0.5,
              }}
            />
          ) : (
            precio !== null && (
              <Box sx={{ width: '100%', overflow: 'hidden' }}>
                <Typography
                  variant="caption"
                  fontSize={isVerySmallMobile ? 8 : isMobile ? 10 : 12}
                  sx={{
                    lineHeight: 1,
                    margin: 0,
                    padding: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontWeight: 700,
                    color: esPasado ? '#b5b9c3' : '#586071',
                  }}
                >
                  {precio}
                </Typography>
                <Typography
                  variant="caption"
                  fontSize={isVerySmallMobile ? 7 : isMobile ? 8 : 10}
                  sx={{
                    display: 'block',
                    lineHeight: 1,
                    marginTop: '2px',
                    letterSpacing: '0.02em',
                    color: metaTextColor,
                  }}
                >
                  BOB
                </Typography>
              </Box>
            )
          )}
        </Paper>
      </Grid>
    );
  }
);

// Componente para mostrar la barra del evento
const EventBarComponent: React.FC<{
  eventBar: EventBar;
  isMobile: boolean;
  isVerySmallMobile: boolean;
  containerPadding: number;
  onReservaClick: (dia: Date) => void;
}> = ({ eventBar, isMobile, isVerySmallMobile, onReservaClick, containerPadding = 8 }) => {
  // Calcular dimensiones basadas en el tipo de pantalla
  const cellHeight = isVerySmallMobile ? 35 : isMobile ? 50 : 120;
  const headerRowHeight = isVerySmallMobile ? 20 : isMobile ? 25 : 35;
  const cellMargin = isVerySmallMobile ? 1 : isMobile ? 0.8 : 4;

  // Posición vertical: header + (fila * altura de celda) + offset para centrar
  const topPosition =
    headerRowHeight +
    eventBar.row * (cellHeight + cellMargin * (isVerySmallMobile ? 2 : isMobile ? 1.6 : 1.2)) +
    containerPadding +
    cellHeight * (isVerySmallMobile ? 1.8 : isMobile ? 1.6 : 1.2) -
    (eventBar.row === 0 ? (isVerySmallMobile ? 9 : isMobile ? 20 : 58) : 0) -
    (eventBar.row == 1 ? (isVerySmallMobile ? 3 : isMobile ? 10 : 88) : 0) -
    (eventBar.row == 2 ? (isVerySmallMobile ? -6 : isMobile ? 0 : 118) : 0) -
    (eventBar.row == 3 ? (isVerySmallMobile ? -14 : isMobile ? -11 : 148) : 0) -
    (eventBar.row == 4 ? (isVerySmallMobile ? -22 : isMobile ? -20 : 176) : 0) -
    (eventBar.row == 5 ? (isVerySmallMobile ? -32 : isMobile ? -30 : -188) : 0);

  const guestCount = eventBar?.event?.guests || 0;
  const totalAmount =
    eventBar?.event?.totalAmount || 0;
  const nights = Math.max(
    1,
    calculateDaysDifference(
      new Date(eventBar?.event?.checkin),
      new Date(eventBar?.event?.checkout)
    )
  );

  return (
    <Tooltip
      key={eventBar.event.id}
      placement="top-start"
      title={
        <Box sx={{ p: 0.5 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.1 }}>
            {eventBar.event.title}
          </Typography>
          <Typography sx={{ fontSize: 13, fontWeight: 400, lineHeight: 1.4 }}>
            Huesped
          </Typography>
          <Typography sx={{ fontSize: 13, fontWeight: 400, lineHeight: 1.4 }}>
            {`${guestCount} huesped${guestCount === 1 ? '' : 'es'}  ${nights} noche${nights === 1 ? '' : 's'}`}
          </Typography>
          <Typography sx={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4 }}>
            {`${totalAmount} BOB`}
          </Typography>
        </Box>
      }
      slotProps={{
        tooltip: {
          sx: {
            backgroundColor: '#fff',
            color: '#202020',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.18)',
            p: 1.25,
            maxWidth: 'none',
          },
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: `${topPosition}px`,
          left: `${eventBar.left}%`,
          width: `${eventBar.width - (isVerySmallMobile ? 2.4 : isMobile ? 1.2 : 0.4)}%`,
          height: isVerySmallMobile ? '12px' : isMobile ? '16px' : '20px',
          backgroundColor: eventBar.event.backgroundColor || '#5b4ca0',
          color: eventBar.event.color || 'white',
          borderRadius: isVerySmallMobile ? '6px' : '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingLeft: isVerySmallMobile ? '6px' : '8px',
          paddingRight: isVerySmallMobile ? '6px' : '8px',
          paddingTop: isVerySmallMobile ? '2px' : '4px',
          paddingBottom: isVerySmallMobile ? '2px' : '4px',
          zIndex: 2,
          cursor: 'pointer',
          fontSize: isVerySmallMobile ? '9px' : isMobile ? '11px' : '14px',
          fontWeight: 'bold',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          '&:hover': {
            opacity: 0.8,
            transform: 'translateY(-1px)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          },
        }}
        onClick={() => {
          onReservaClick(new Date(eventBar.event.startDate + 'T00:00:00'));
        }}
        title={eventBar.event.title}
      >
        <Typography
          variant="caption"
          sx={{
            fontSize: 'inherit',
            fontWeight: 'inherit',
            color: 'inherit',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {eventBar.event.title}
        </Typography>
      </Box>
    </Tooltip>
  );
};

const CalendarioMensual2: React.FC<Props> = ({
  propiedadId,
  diasSeleccionados,
  onSeleccionarDias,
  propertyInfo,
  isMobile: isMobileProp,
  eventos = [],
  preparationEvents = [],
  onOpenMessaging,
}) => {
  const today = useMemo(() => new Date(), []); // Solo se crea una vez al montar
  const theme = useTheme();
  const { t } = useTranslation();
  // Llamar todos los hooks siempre, en el mismo orden
  const isMobileQuery = useMediaQuery(theme.breakpoints.down('sm'));
  const isVerySmallMobile = useMediaQuery('(max-width:450px)');

  // Determinar el estado final de isMobile
  const isMobile = isMobileProp || isMobileQuery;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const currentMonthRef = useRef<HTMLDivElement | null>(null);
  const [openReservation, setOpenReservation] = useState(false);
  const [selectReservationInfo, setSelectReservationInfo] = useState<ReservationInfoProps>({
    arrivalDate: '',
    departureDate: '',
    guests: 0,
    totalCost: 0,
    currency: 'BOB',
    hostName: '',
    hostLocation: '',
    hostImage: '',
    indiceColor: 0,
  });

  const targetDate = useMemo(() => {
    const toValidDate = (value?: string): Date | null => {
      if (!value) return null;
      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    };

    const selectedDates = diasSeleccionados
      .map((d) => toValidDate(d.date))
      .filter((d): d is Date => d !== null)
      .sort((a, b) => a.getTime() - b.getTime());

    if (selectedDates.length > 0) return selectedDates[0];

    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const reservationDates = (propertyInfo?.reservations || [])
      .map((reservation: any) =>
        toValidDate(reservation?.checkin || reservation?.calendarDays?.[0]?.date)
      )
      .filter((d: Date | null): d is Date => d !== null)
      .sort((a: Date, b: Date) => a.getTime() - b.getTime());

    const upcoming = reservationDates.find((d: Date) => d.getTime() >= todayStart.getTime());
    return upcoming || reservationDates[0] || today;
  }, [diasSeleccionados, propertyInfo, today]);

  const targetDateString = useMemo(() => format(targetDate, 'yyyy-MM-dd'), [targetDate]);

  const monthsToRender = useMemo(() => {
    const list: { year: number; month: number }[] = [];
    for (let offset = -12; offset <= 12; offset++) {
      const d = new Date(targetDate.getFullYear(), targetDate.getMonth() + offset);
      list.push({ year: d.getFullYear(), month: d.getMonth() });
    }
    return list;
  }, [targetDate]);

  // Función auxiliar para obtener el precio de un día específico
  const getDayPrice = useCallback(
    (fecha: string): number => {
      const dateString = fecha + 'T00:00:00';
      const dateObj = new Date(fecha);
      const dateEndWeek = dateObj.getDay();
      if (Array.isArray(propertyInfo?.calendarDays)) {
        const customDay = propertyInfo.calendarDays.find(
          (x: any) => x.date + '' === dateString && x.blockType == null
        );
        if (customDay?.price != null && customDay.price >= 0) return customDay.price;
      }
      return dateEndWeek === 0 || dateEndWeek === 6
        ? propertyInfo?.price?.weekendNightlyPrice || 0
        : propertyInfo?.price?.priceNightly || 0;
    },
    [propertyInfo]
  );

  // Función auxiliar para determinar si un día está bloqueado
  const isDayBlocked = useCallback(
    (fecha: string) => {
      const dateString = fecha + 'T00:00:00';
      if (Array.isArray(propertyInfo?.calendarDays)) {
        const bloquedDay = propertyInfo.calendarDays.find(
          (x: any) => x.date + '' === dateString && x.blockType == 1
        );
        return !!bloquedDay;
      }
      return false;
    },
    [propertyInfo]
  );

  const toggleDia = useCallback(
    (fecha: string, price: number) => {
      if (diasSeleccionados.some((d) => d.date === fecha)) {
        // Si ya está seleccionado, permitir deseleccionarlo
        onSeleccionarDias(diasSeleccionados.filter((d) => d.date !== fecha));
      } else {
        const nuevoItem: SelectedDay = { date: fecha, price: price };
        // Si hay días ya seleccionados, verificar que sean del mismo tipo
        if (diasSeleccionados.length > 0) {
          const primerDiaBloqueado = isDayBlocked(diasSeleccionados[0].date);
          const nuevoDiaBloqueado = isDayBlocked(fecha);

          // Solo permitir seleccionar si es del mismo tipo
          if (primerDiaBloqueado === nuevoDiaBloqueado) {
            onSeleccionarDias([...diasSeleccionados, nuevoItem]);
          }
          // Si son de diferentes tipos, no hacer nada (no seleccionar)
        } else {
          // Si no hay días seleccionados, permitir seleccionar cualquier día
          onSeleccionarDias([...diasSeleccionados, nuevoItem]);
        }
      }
    },
    [diasSeleccionados, onSeleccionarDias, isDayBlocked, getDayPrice]
  );

  const handleReservaClick = useCallback(
    (dia: Date) => {
      // Encontrar la reserva completa del propertyInfo
      const reservaCompleta = propertyInfo?.reservations?.find((reservation: any) =>
        reservation.calendarDays?.some(
          (day: any) => day.date === format(dia, 'yyyy-MM-dd') + 'T00:00:00'
        )
      );

      if (reservaCompleta) {
        setSelectReservationInfo({
          arrivalDate: formatShortDate(new Date(reservaCompleta.checkin)),
          departureDate: formatShortDate(new Date(reservaCompleta.checkout)),
          guests: reservaCompleta.gests || 0,
          totalCost: reservaCompleta.payPriceCalculations[0]?.priceCalculation?.payoutAmount || 0, //.amountTotal || 0,
          currency: 'BOB',
          hostName: `${reservaCompleta.userIdRenterNavigation?.name || ''} ${reservaCompleta.userIdRenterNavigation?.lastName || ''}`,
          hostLocation: 'Cochabamba, Bolivia',
          hostImage: reservaCompleta.userIdRenterNavigation?.photoLink || '',
          indiceColor: 0,
          user: reservaCompleta.userIdRenter,
          listingId: reservaCompleta.listingRentId,
        });
        setOpenReservation(true);
      }
    },
    [propertyInfo]
  );

  useEffect(() => {
    // Posicionar en el mes objetivo y luego centrar el día objetivo si existe en la vista.
    const scrollToTargetDate = () => {
      if (currentMonthRef.current && containerRef.current) {
        const top = currentMonthRef.current.offsetTop;
        containerRef.current.scrollTo({
          top: top - 20,
          behavior: 'smooth',
        });

        const targetDayElement = containerRef.current.querySelector(
          `[data-calendar-date="${targetDateString}"]`
        );

        if (targetDayElement instanceof HTMLElement) {
          targetDayElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }
    };

    const timeoutId = setTimeout(scrollToTargetDate, 100);

    return () => clearTimeout(timeoutId);
  }, [monthsToRender, propiedadId, targetDateString]);

  return (
    <Box
      sx={{
        width: '100%',
        overflow: 'hidden',
        maxWidth: '100vw',
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          // maxHeight: '70vh',
          overflowY: isMobile ? 'visible' : 'auto',
          overflowX: 'hidden',
          pr: isVerySmallMobile ? 0 : isMobile ? 0 : 1,
          pl: 0,
          width: '100%',
          boxSizing: 'border-box',
          backgroundColor: '#ffffff',
        }}
        ref={containerRef}
      >
        {monthsToRender.map(({ year, month }) => {
          const dias = getMonthDays(year, month);
          const monthName = new Intl.DateTimeFormat('es-ES', {
            month: 'long',
          }).format(new Date(year, month));
          const isCurrentMonth =
            year === targetDate.getFullYear() && month === targetDate.getMonth();

          // Calcular espacios vacíos al inicio (Lunes = 0, Domingo = 6)
          let emptyDays = dias[0].getDay() - 1; // Restar 1 para que Lunes sea 0
          if (emptyDays === -1) emptyDays = 6; // Si es Domingo, son 6 espacios vacíos

          // Calcular las barras de eventos para este mes
          const eventBars = calculateEventBars(eventos, year, month);

          return (
            <Box
              key={`${year}-${month}`}
              mb={4}
              ref={isCurrentMonth ? currentMonthRef : null}
              sx={{ position: 'relative' }}
            >
              <Typography
                variant="h6"
                textTransform="capitalize"
                gutterBottom
                align="center"
                sx={{
                  position: 'sticky',
                  top: 0,
                  bgcolor: 'white',
                  zIndex: 3,
                  py: 1,
                  fontWeight: 700,
                  fontSize: isVerySmallMobile ? '0.9rem' : '1rem',
                  color: '#4e5565',
                }}
              >
                {monthName} {year}
              </Typography>

              <Grid
                container
                columns={7}
                spacing={0}
                sx={{
                  width: '100%',
                  margin: 0,
                  padding: 0,
                  gap: 0,
                  display: 'flex',
                  flexWrap: 'wrap',
                  '& .MuiGrid2-root': {
                    padding: '0 !important',
                    margin: '0 !important',
                    minWidth: 0,
                    flex: '1 1 14.28%', // Exactamente 1/7 del ancho
                    maxWidth: '14.28%',
                    width: '14.28%',
                    boxSizing: 'border-box',
                  },
                }}
              >
                {['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'].map((day, i) => {
                  return (
                    <Grid size={{ xs: 1 }} key={i} sx={{ padding: 0, margin: 0 }}>
                      <Typography
                        align="center"
                        borderBottom={'1px solid #eceff4'}
                        fontSize={isVerySmallMobile ? 9 : isMobile ? 11 : 18}
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          padding: isVerySmallMobile ? '5px 0' : '8px 2px',
                          margin: 0,
                          width: '100%',
                          boxSizing: 'border-box',
                          color: '#6a707f',
                          fontWeight: 700,
                        }}
                      >
                        {isVerySmallMobile ? day.substring(0, 1) : day}
                      </Typography>
                    </Grid>
                  );
                })}

                {Array(emptyDays)
                  .fill(0)
                  .map((_, i) => (
                    <Grid size={{ xs: 1 }} key={`empty-${i}`} />
                  ))}

                {dias.map((dia) => {
                  const fechaStr = formatDate(dia);
                  const esPasado = dia < new Date(today.toDateString());
                  const seleccionado = diasSeleccionados.some((d) => d.date === fechaStr);
                  const currentDay = formatDate(today) === fechaStr;
                  const dateEndWeek = dia.getDay();
                  let bloquedDay = null;
                  let blockDay = false;
                  let prerarationDayObj = null;
                  let preparationDay = false;
                  const dateString = format(dia, 'yyyy-MM-dd') + 'T00:00:00';
                  let newPriceCustomizedDate = -1;

                  // Obtener información de reserva para esta fecha
                  const reservaInfo = getReservationInfo(dia, propertyInfo?.reservations || []);

                  if (Array.isArray(propertyInfo?.calendarDays)) {
                    bloquedDay = propertyInfo?.calendarDays?.find(
                      (x: any) => x.date + '' === dateString && x.blockType == 1
                    );
                    if (bloquedDay) {
                      blockDay = true;
                      newPriceCustomizedDate = bloquedDay.price || -1;
                    } else {
                      newPriceCustomizedDate =
                        propertyInfo?.calendarDays?.find(
                          (x: any) => x.date + '' === dateString && x.blockType == null
                        )?.price || -1;
                    }
                  }

                  //verificamos si existe una preparacion del dia
                  prerarationDayObj = preparationEvents?.find((x: any) => x + '' == dateString);
                  if (prerarationDayObj) {
                    preparationDay = true;
                  }

                  //validar si existe disponibilidad mensual
                  let blockAvailability = false;
                  if (propertyInfo?.availabilityWindowMonth_Date) {
                    const currentDate = new Date(fechaStr + 'T00:00:00');
                    const availabilityDate = new Date(propertyInfo?.availabilityWindowMonth_Date);
                    blockAvailability = availabilityDate >= currentDate;
                  }

                  return (
                    <DiaCelda
                      key={fechaStr}
                      dia={dia}
                      seleccionado={seleccionado}
                      esPasado={esPasado || !blockAvailability}
                      precio={
                        newPriceCustomizedDate > -1
                          ? newPriceCustomizedDate
                          : dateEndWeek == 0 || dateEndWeek == 6
                            ? propertyInfo?.price?.weekendNightlyPrice || 0
                            : propertyInfo?.price?.priceNightly || 0
                      }
                      isMobile={isMobile}
                      isVerySmallMobile={isVerySmallMobile}
                      toggleDia={toggleDia}
                      currentDay={currentDay}
                      bloquearDia={blockDay}
                      preparationDay={preparationDay}
                      reservaInfo={reservaInfo}
                      onReservaClick={handleReservaClick}
                    />
                  );
                })}
              </Grid>

              {/* Renderizar las barras de eventos sobre el calendario */}
              {eventBars.map((eventBar, index) => (
                <EventBarComponent
                  key={`${eventBar.event.id}-${eventBar.row}-${index}`}
                  eventBar={eventBar}
                  isMobile={isMobile}
                  isVerySmallMobile={isVerySmallMobile}
                  containerPadding={8} // padding del Grid container
                  onReservaClick={handleReservaClick}
                />
              ))}
            </Box>
          );
        })}
      </Box>

      <AssertModal
        title={t('reservationInfo.title')}
        content={<ReservationInfo {...selectReservationInfo} onWriteMessage={onOpenMessaging} />}
        open={openReservation}
        showCloseLeft={false}
        onClose={() => setOpenReservation(false)}
        rightIcon={<CloseIcon />}
        showRightIcon={true}
      />
    </Box>
  );
};

export default CalendarioMensual2;
