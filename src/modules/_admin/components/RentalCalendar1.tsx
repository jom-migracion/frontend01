import React, { useCallback, useEffect, useState, useRef } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import {
  Box,
  Button,
  Typography,
  Avatar,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  MenuList,
  FormControl,
  Select,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {
  format,
  subMonths,
  addMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  subWeeks,
  addWeeks,
  startOfWeek,
  subDays,
  addDays,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ListingsRentResponse1 } from '@/modules/_admin/hooks/useOwnerProperties1';
import ListingRentC from '@/models/interfaces/ListingRentCalendarInfo';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AssertModal from '@/components/AssertModal';
import EmptyState from '@/components/EmptyState';
import { AssertRoutes } from '@/common/enum/AssertRoutes';
import FormLockCalendar from '@/components/FormLockCalendar';
import { useTranslation } from 'react-i18next';
import { calculateDaysDifference, formatShortDate } from '@/common/util/dateFunctions';
import ReservationInfo from '@/components/ReservationInfo';
import ReservationInfoProps from '@/models/interfaces/ReservationInfoProps';
import DayBlockCalendar from '@/models/interfaces/calendar/DayBlockCalendar';
import Grid from '@mui/material/Grid2';
import { PropertyInfo } from '@/models/interfaces/calendar/PropertyInfo';
import { RestClient } from '@/services/RestClient';
import LoadingThreeDotsJumping from '@/components/LoadingThreeDotsJumping';
import { Helmet } from 'react-helmet-async';

interface PropertyProps {
  handldePropertySelected: (property: PropertyInfo) => void;
  onOpenMessaging?: () => void;
}

const RentalCalendar1: React.FC<PropertyProps> = ({ handldePropertySelected, onOpenMessaging }) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const scrollRef = useRef<HTMLDivElement>(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const borderColor = '#E5E7EB';
  const pageBg = '#F8FAFC';
  const selectedBg = '#5B4CA0';
  const selectedSoftBg = '#EDEAFE';
  const selectedSoftText = '#5B59CC';

  const [calendarDataInfo, setCalendarDataInfo] = useState<ListingsRentResponse1 | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true);

  const loadCalendar = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await RestClient.get('/Host/ListingRent/CalendarInfo');
      setCalendarDataInfo(response?.data);
    } catch (error) {
      setCalendarDataInfo(undefined);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCalendar();
  }, [loadCalendar]);

  useEffect(() => {
    if (!isLoading && Array.isArray(calendarDataInfo?.data) && calendarDataInfo.data.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const propertyParam = params.get('property');
      const nameParam = params.get('name');

      if (propertyParam && nameParam) {
        handldePropertySelected({
          id: propertyParam,
          name: nameParam,
        } as PropertyInfo);
        // Limpiar los parámetros de la URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [isLoading, calendarDataInfo, handldePropertySelected]);

  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedListingId, setSelectedListingId] = useState<number | null>(null);
  const [selectReservationInfo, setSelectReservationInfo] = useState<ReservationInfoProps>({
    arrivalDate: 'lun., 13 ene.',
    departureDate: 'mie., 15 ene.',
    guests: 0,
    totalCost: 0,
    currency: 'BOB',
    hostName: 'Audrey',
    hostLocation: 'Cochabamba, Bolivia',
    hostImage: 'https://example.com/audrey.jpg',
    indiceColor: 0,
    user: '',
    listingId: '',
    conversationId: '',
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [contextMenuData, setContextMenuData] = useState<{
    listingId: number;
    dateStr: string;
  } | null>(null);
  const [openAboutSpace, setOpenAboutSpace] = useState(false);
  const [openReservation, setOpenReservation] = useState(false);
  const [selectedDteBlock, setSelectedDteBlock] = useState<DayBlockCalendar[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const goToPreviousWeek = () => {
    const newWeek = subWeeks(currentWeek, 1);
    setCurrentWeek(newWeek);

    // Recalcular los días basándose en la nueva semana
    const weekStart = startOfWeek(newWeek, { weekStartsOn: 1 });
    const newDays = eachDayOfInterval({
      start: subDays(weekStart, 3),
      end: addDays(weekStart, 90),
    });
    setDays(newDays);
  };

  const goToNextWeek = () => {
    const newWeek = addWeeks(currentWeek, 1);
    setCurrentWeek(newWeek);

    // Recalcular los días basándose en la nueva semana
    const weekStart = startOfWeek(newWeek, { weekStartsOn: 1 });
    const newDays = eachDayOfInterval({
      start: subDays(weekStart, 3),
      end: addDays(weekStart, 90),
    });
    setDays(newDays);
  };

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  const [calendarBy, setCalendarBy] = useState<string>('week');

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const initialDays = eachDayOfInterval({
    start: subDays(weekStart, 3),
    end: addDays(weekStart, 90),
  });
  const [days, setDays] = useState(initialDays);
  const monthsList = eachMonthOfInterval({
    start: startOfYear(subMonths(new Date(), 12)),
    end: endOfYear(addMonths(new Date(), 12)),
  });
  const handleChangeMonth = (event: any) => {
    const selectedDate = new Date(event.target.value + 'T00:00:00');
    setCurrentMonth(selectedDate);

    const calendarStart = startOfMonth(selectedDate);
    const calendarEnd = endOfMonth(selectedDate);
    const newDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    setDays(newDays);
  };

  const filteredListings = Array.isArray(calendarDataInfo?.data)
    ? calendarDataInfo?.data?.filter((listing: ListingRentC) =>
        listing?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (
    !isLoading &&
    (!Array.isArray(calendarDataInfo?.data) || calendarDataInfo.data.length === 0)
  ) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 300,
          width: '100%',
        }}
      >
        <EmptyState
          icon={CalendarMonthIcon}
          title={t('calendar.no_properties_title')}
          description={t('calendar.no_properties_description')}
          buttonRoute={AssertRoutes.HOSTING}
          buttonLabel={t('calendar.no_properties_button')}
        />
      </Box>
    );
  }

  if (isSmallScreen) {
    return (
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          backgroundColor: '#F3F4F6',
          px: 1.5,
          pb: 2,
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: 56,
            px: 1,
            borderBottom: '1px solid #E5E7EB',
            backgroundColor: '#F3F4F6',
          }}
        >
          <Typography
            sx={{
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 0.5,
              color: '#1F2937',
              textTransform: 'uppercase',
            }}
          >
            ANUNCIO
          </Typography>
        </Box>

        <Box sx={{ py: 1.5, px: 0.5 }}>
          <TextField
            fullWidth
            size="small"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setSearchTerm(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setSearchTerm(filter);
              }
            }}
            placeholder="Buscar propiedad"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: '#F8FAFC',
                border: '1px solid #D1D5DB',
                '& fieldset': { borderColor: '#D1D5DB' },
                '&:hover fieldset': { borderColor: '#D1D5DB' },
                '&.Mui-focused fieldset': { borderColor: '#D1D5DB' },
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#9CA3AF', fontSize: 28 }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <Box sx={{ backgroundColor: '#F3F4F6' }}>
          {filteredListings.map((listing: any) => {
            const locationCity = listing?.property?.address?.city?.city || 'Santa Cruz de la Sierra';
            const locationCountry = listing?.property?.address?.city?.country || 'Bolivia';

            return (
              <Box
                key={listing.listingRentId}
                onClick={() =>
                  handldePropertySelected({
                    id: listing.listingRentId.toString(),
                    name: listing.name,
                  })
                }
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  minHeight: 120,
                  px: 1,
                  py: 1.2,
                  borderBottom: '1px solid #E5E7EB',
                  backgroundColor: '#F3F4F6',
                }}
              >
                <Avatar
                  src={listing.photos?.[0]?.photoLink || 'none'}
                  variant="rounded"
                  sx={{
                    width: 104,
                    height: 104,
                    borderRadius: 3,
                    border: '1px solid #E5E7EB',
                    flexShrink: 0,
                  }}
                />

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: 'clamp(1.15rem, 3vw, 2rem)',
                      fontWeight: 700,
                      lineHeight: 1.2,
                      color: '#1F2937',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {listing.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      color: '#6B7280',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {locationCity}, {locationCountry}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  }

  const handleDateSelection = (
    name: string,
    listingId: number,
    dateStr: string,
    isDisabled: boolean,
    isSelected: boolean,
    isRented: boolean
  ) => {
    if (isRented) return;

    if (selectedListingId !== listingId) {
      setSelectedListingId(listingId);
      setSelectedDates([dateStr]);
    } else {
      if (selectedDates.includes(dateStr)) {
        setSelectedDates((prev) => prev.filter((d) => d !== dateStr));
      } else {
        setSelectedDates((prev) => [...prev, dateStr].sort());
      }
    }

    const objDay: DayBlockCalendar = {
      date: dateStr,
      id: listingId,
      name: name,
      isBloquedManual: isDisabled,
    };

    if (!isSelected) {
      if (selectedDteBlock.some((obj) => obj.id === listingId && obj.date === dateStr)) {
        setSelectedDteBlock((prev: any) =>
          prev.filter((d: any) => d.id !== listingId || d.date !== dateStr)
        );
      }
    }

    if (selectedDteBlock.some((obj) => obj.id === listingId && obj.date === dateStr)) {
      const filerBlockCalendar = selectedDteBlock.filter(
        (d: DayBlockCalendar) => d.id !== listingId || d.date !== dateStr
      );
      setSelectedDteBlock(filerBlockCalendar);
    } else {
      if (selectedDteBlock[0]?.isBloquedManual == isDisabled) {
        let newSelected = selectedDteBlock;
        newSelected.push(objDay);
        setSelectedDteBlock(newSelected);
      } else {
        let newSelected: DayBlockCalendar[] = [];
        newSelected.push(objDay);
        setSelectedDteBlock(newSelected);
      }
    }
  };

  // --- Función para abrir el menú contextual con anclaje a un elemento ---
  const handleContextMenu = (
    event: ReactMouseEvent<HTMLDivElement>, // Usa el tipo correcto de MouseEvent de React
    listingId: number,
    dateStr: string,
    isSelected: boolean
  ) => {
    event.preventDefault(); // Evita el menú contextual por defecto del navegador

    if (isSelected) {
      setAnchorEl(event.currentTarget); // El currentTarget es el elemento <Box> sobre el que se hizo clic
      setContextMenuData({ listingId, dateStr });
    }
  };

  const goToViewCalendar = (option: string) => {
    setCalendarBy(option);
    if (option == 'month') {
      // Calcula los días del mes seleccionado
      const calendarStart = startOfMonth(currentMonth);
      const calendarEnd = endOfMonth(currentMonth);
      const newDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

      // Actualiza el estado de los días
      setDays(newDays);
    } else if (option == 'week') {
      const newDays = eachDayOfInterval({
        start: subDays(weekStart, 3),
        end: addDays(weekStart, 90),
      });

      // Actualiza el estado de los días
      setDays(newDays);
    }
  };

  // --- Función para cerrar el menú contextual ---
  const handleCloseContextMenu = () => {
    setAnchorEl(null);
    setContextMenuData(null);
  };

  // --- Función para manejar las acciones del menú ---
  const handleMenuItemClick = (action: string) => {
    if (contextMenuData) {
      if (action === 'Bloquear Fecha') {
        setOpenAboutSpace(true);
      } else if (action === 'Desbloquear Fecha') {
        alert(
          t('alerts.unlocking', { date: contextMenuData.dateStr, id: contextMenuData.listingId })
        );
      } else if (action === 'Editar Renta') {
        alert(
          t('alerts.editing', { date: contextMenuData.dateStr, id: contextMenuData.listingId })
        );
      }
    }
    handleCloseContextMenu();
  };

  const getTheHeaderForTheMonths = (): React.ReactNode => {
    let dayInitial = days[0];
    let monthInitial = dayInitial.getMonth();
    let withMonth = 0;
    let sectionComponent = [];
    days.map((day) => {
      const monthToDay = day.getMonth();
      if (monthInitial === monthToDay) {
        withMonth += 100;
      } else {
        sectionComponent.push({
          month: dayInitial.toLocaleString('us-US', { month: 'short' }).toLocaleLowerCase(),
          width: withMonth,
          year: dayInitial.getFullYear(),
        });
        monthInitial = day.getMonth();
        dayInitial = day;
        withMonth = 100;
      }
    });
    if (withMonth > 0) {
      sectionComponent.push({
        month: dayInitial.toLocaleString('us-US', { month: 'short' }).toLocaleLowerCase(),
        width: withMonth,
        year: dayInitial.getFullYear(),
      });
    }

    return sectionComponent ? (
      <Box
        display="flex"
        sx={{
          backgroundColor: '#fff',
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        {sectionComponent.map((monthDay: any, index) => (
          <Box
            key={`month-${index}`}
            sx={{
              minWidth: monthDay.width,
              minHeight: 54,
              px: 1.5,
              display: 'flex',
              alignItems: 'center',
              borderRight: `1px solid ${borderColor}`,
              color: '#64748B',
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            {t(`dates.${monthDay.month}`)} {t('dates.yearOf')} {monthDay.year}
          </Box>
        ))}
      </Box>
    ) : null;
  };

  const handleSave = async () => {
    setOpenAboutSpace(false);
    await loadCalendar();
    setSelectedDteBlock([]);
  };

  return (
    <>
      <Helmet>
        <title>Calendario</title>
        <meta name="calendario" content="Página del calendario de alquiler" />
      </Helmet>
      <Box p={2} position="relative" sx={{ backgroundColor: pageBg }}>
        {<LoadingThreeDotsJumping open={isLoading} modal={true} />}
        {!isSmallScreen && (
          <>
            <Box display={'flex'}>
              <Box
                sx={{
                  width: 300,
                  minWidth: 300,
                  position: 'sticky',
                  left: 0,
                  zIndex: 3,
                }}
              ></Box>

              <Box display={'flex'} sx={{ width: '100%' }}>
                <Grid container alignItems="center" spacing={2} sx={{ m: 0, p: 0, width: '100%' }}>
                  <Grid size={{ xs: 5 }}>
                    {calendarBy == 'month' && (
                      <FormControl variant="standard">
                        <Select
                          labelId="month-select-label"
                          id="month-select"
                          value={format(currentMonth, 'yyyy-MM-01')}
                          onChange={handleChangeMonth}
                          sx={{ minWidth: 200, fontSize: '1.2rem', fontWeight: 'bold' }}
                        >
                          {monthsList.map((date) => (
                            <MenuItem key={date.toString()} value={format(date, 'yyyy-MM-01')}>
                              {format(date, 'MMMM yyyy', { locale: es })}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </Grid>
                  <Grid size={{ xs: 7 }}>
                    <Box display="flex" justifyContent="end" alignItems="center" mb={2}>
                      <Box display="flex" gap={2}>
                        {calendarBy == 'week' ? (
                          <>
                            <Button variant="outlined" onClick={() => goToViewCalendar('month')}>
                              {t('calendar.view_month')}
                            </Button>
                            <Button variant="outlined" onClick={goToPreviousWeek}>
                              {t('calendar.prev_week')}
                            </Button>
                            <Button variant="outlined" onClick={goToNextWeek}>
                              {t('calendar.next_week')}
                            </Button>
                          </>
                        ) : (
                          <Button variant="outlined" onClick={() => goToViewCalendar('week')}>
                            {t('calendar.view_week')}
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            {/* Botones de desplazamiento */}
            <IconButton
              onClick={scrollLeft}
              sx={{
                position: 'absolute',
                left: 320,
                top: '45%',
                zIndex: 5,
                backgroundColor: 'white',
                boxShadow: 1,
                border: `1px solid ${borderColor}`,
                display: 'none',
              }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={scrollRight}
              sx={{
                position: 'absolute',
                right: 20,
                top: '45%',
                zIndex: 5,
                backgroundColor: 'white',
                boxShadow: 1,
                border: `1px solid ${borderColor}`,
                display: 'none',
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </>
        )}
        {/* --- Contenedor principal del calendario --- */}
        <Box
          ref={scrollRef}
          sx={{
            border: `1px solid ${borderColor}`,
            borderRadius: 3.5,
            backgroundColor: '#fff',
            maxHeight: isSmallScreen ? 'none' : 'calc(100vh - 230px)',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'thin',
          }}
        >
          {/* --- Fila de cabecera (sticky top) --- */}
          <Box
            display="flex"
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 40,
              backgroundColor: '#fff',
              minWidth: 'max-content',
            }}
          >
            {/* Esquina superior izquierda: sticky top + left */}
            <Box
              sx={{
                width: 300,
                minWidth: 300,
                position: 'sticky',
                left: 0,
                zIndex: 60,
                backgroundColor: '#fff',
                borderRight: `1px solid ${borderColor}`,
                borderBottom: `1px solid ${borderColor}`,
              }}
            >
              <Box
                sx={{
                  minHeight: 55,
                  display: 'flex',
                  alignItems: 'center',
                  px: 3,
                  borderBottom: `1px solid ${borderColor}`,
                  backgroundColor: '#fff',
                }}
              >
                <Typography
                  sx={{ fontSize: 16, fontWeight: 700, letterSpacing: 1.4, color: '#9CA3AF' }}
                >
                  {t('calendar.title')}
                </Typography>
              </Box>
              <Box
                px={2}
                display="flex"
                alignItems="center"
                gap={1.5}
                sx={{ minHeight: 84, backgroundColor: '#fff' }}
              >
                <TextField
                  size="small"
                  placeholder={t('calendar.search_placeholder')}
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value);
                    setSearchTerm(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setSearchTerm(filter);
                    }
                  }}
                  variant="outlined"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2.3,
                      backgroundColor: '#F8FAFC',
                      '& fieldset': { borderColor: '#CBD5E1' },
                    },
                  }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: '#9CA3AF' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Columna de fechas: se mueve con el scroll horizontal */}
            <Box
              sx={{
                flexShrink: 0,
                backgroundColor: '#fff',
                borderBottom: `1px solid ${borderColor}`,
              }}
            >
              {getTheHeaderForTheMonths() || null}
              <Box display="flex" sx={{ minHeight: 84 }}>
                {days.map((day, index) => {
                  const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const isDayPrevious = day.valueOf() < today.valueOf();
                  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
                  return (
                    <Box
                      key={day.toString()}
                      sx={{
                        minWidth: 100,
                        textAlign: 'center',
                        p: 1,
                        backgroundColor: isToday
                          ? selectedSoftBg
                          : isDayPrevious
                            ? '#EDEDED'
                            : 'white',
                        color: isToday ? selectedSoftText : isDayPrevious ? '#ABABAA' : 'inherit',
                        borderRight:
                          index === days.length - 1 ? 'none' : `1px solid ${borderColor}`,
                        borderBottom: `1px solid ${borderColor}`,
                        borderTop: `1px solid ${borderColor}`,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 12,
                          color: isToday ? selectedSoftText : '#9CA3AF',
                          fontWeight: 600,
                        }}
                      >
                        {capitalize(format(day, 'EEE', { locale: es }))}
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: isToday ? selectedSoftText : '#1F2937',
                          fontSize: 15,
                        }}
                      >
                        {format(day, 'dd')}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>

          {/* --- Filas de propiedades --- */}
          {filteredListings?.map((listing: any) => {
            let reservationsCurrent: any[] = [];
            if (listing?.reservations?.length > 0) {
              listing?.reservations?.map((reservation: any) => {
                if (reservation.calendarDays?.length > 0) {
                  const datesType2 = reservation.calendarDays
                    .filter((item: any) => item.blockType === 2)
                    .map((item: any) => new Date(item.date).getTime());

                  let fechaInicial = new Date(Math.min(...datesType2));
                  let fechaFin = new Date(Math.max(...datesType2));

                  if (days[days.length - 1] >= fechaInicial) {
                    const calendarStart = days[0];
                    reservationsCurrent.push({
                      x: 300 + calculateDaysDifference(calendarStart, fechaInicial) * 100 + 20,
                      y: 30,
                      width: (calculateDaysDifference(fechaInicial, fechaFin) + 1) * 100 - 40,
                      reservation: reservation,
                    });
                  }
                }
              });
            }

            return (
              <Box
                key={listing.listingRentId}
                display="flex"
                sx={{ minHeight: 110, position: 'relative', minWidth: 'max-content' }}
              >
                {/* Celda de propiedad: sticky left */}
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  p={1}
                  sx={{
                    width: 300,
                    minWidth: 300,
                    position: 'sticky',
                    left: 0,
                    zIndex: 20,
                    backgroundColor: '#fff',
                    borderRight: `1px solid ${borderColor}`,
                    borderBottom: `1px solid ${borderColor}`,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    ':hover': { backgroundColor: '#EEF2FF' },
                  }}
                  onClick={() =>
                    handldePropertySelected({
                      id: listing.listingRentId.toString(),
                      name: listing.name,
                    })
                  }
                >
                  <Avatar
                    src={listing.photos[0]?.photoLink || 'none'}
                    variant="rounded"
                    sx={{ width: 66, height: 66, borderRadius: 2 }}
                  />
                  <Box sx={{ overflow: 'hidden' }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      noWrap
                      sx={{ fontSize: '1rem', maxWidth: '200px', color: '#1F2937' }}
                    >
                      {listing.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                      sx={{ fontSize: '0.8rem', maxWidth: '200px', color: '#9CA3AF' }}
                    >
                      {listing.property.address.city.city},{' '}
                      {listing.property.address.city.country || 'Bolivia'}
                    </Typography>
                  </Box>
                </Box>
                {days.map((day, index) => {
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const dateEndWeek = day.getDay();
                  let bloquedDay = null;
                  let blockAvailable = false;
                  const dateString = format(day, 'yyyy-MM-dd') + 'T00:00:00';
                  let newPriceCustomizedDate = -1;

                  if (Array.isArray(listing?.calendarDays)) {
                    bloquedDay = listing?.calendarDays?.find(
                      (x: any) => x.date + '' === dateString
                    );
                    if (bloquedDay != null) {
                      newPriceCustomizedDate = bloquedDay.price || -1;
                    } else {
                      newPriceCustomizedDate = listing?.calendarDays?.find(
                        (x: any) => x.date + '' === dateString && x.blockType == null
                      )?.price;
                    }
                  }

                  //search availabilityWindowMonth_Date to check, para bloquear...
                  const dateCurrent = new Date(dateString);
                  if (listing?.availabilityWindowMonth_Date) {
                    const dateAvailabilityStart = new Date(
                      listing.availabilityWindowMonth_Date.replace('Z', '')
                    );
                    blockAvailable = dateAvailabilityStart >= dateCurrent;
                  }

                  const allCalendarDays = listing?.reservations?.flatMap(
                    (reservation: any) => reservation.calendarDays
                  );

                  const foundCalendarDay = allCalendarDays.find(
                    (x: any) => x.date + '' === dateString
                  );

                  const isBlockedOrRented = bloquedDay?.blockType > 0;
                  const isRented = foundCalendarDay?.blockType > 1;

                  const isSelected = selectedDteBlock.some(
                    (obj) => obj.id === listing.listingRentId && obj.date === dateStr
                  );

                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const isDayPrevious = day.valueOf() < today.valueOf();
                  const isTodayColumn =
                    format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                  const isUnavailable =
                    bloquedDay?.blockType > 0 || foundCalendarDay?.blockType > 1;

                  const bg = isSelected
                    ? selectedSoftBg
                    : isTodayColumn
                      ? selectedSoftBg
                      : isDayPrevious
                        ? '#EDEDED'
                        : 'transparent';

                  const color =
                    isSelected || isTodayColumn
                      ? selectedSoftText
                      : isDayPrevious
                        ? '#ABABAA'
                        : '#374151';
                  const basePrice =
                    newPriceCustomizedDate > -1
                      ? newPriceCustomizedDate
                      : dateEndWeek == 0 || dateEndWeek == 6
                        ? listing.price.weekendNightlyPrice || 0
                        : listing.price.priceNightly || 0;
                  const displayPrice = Number(basePrice).toFixed(1);
                  return (
                    <Box
                      key={dateStr}
                      sx={{
                        minWidth: 100,
                        textAlign: 'center',
                        p: 1,
                        borderRight:
                          index === days.length - 1 ? 'none' : `1px solid ${borderColor}`,
                        background: isUnavailable
                          ? 'repeating-linear-gradient(-45deg, #F8F8F8 0px, #F8F8F8 8px, #EFEFEF 8px, #EFEFEF 16px)'
                          : bg,
                        color,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        userSelect: 'none',
                        gap: 0.25,
                        borderBottom: `1px solid ${borderColor}`,
                      }}
                      onClick={(e) => {
                        if (!isDayPrevious && blockAvailable && !(bloquedDay?.blockType == 3 ||
                      foundCalendarDay?.blockType == 3 ||
                      bloquedDay?.blockType == 9 ||
                      foundCalendarDay?.blockType == 9)) {
                          if (e.button === 0) {
                            handleDateSelection(
                              listing.name,
                              listing.listingRentId,
                              dateStr,
                              isBlockedOrRented,
                              isSelected,
                              isRented
                            );
                          }
                        }
                      }}
                      onContextMenu={(ev) =>
                        handleContextMenu(ev, listing.listingRentId, dateStr, isSelected)
                      } // <--- Aquí se añade el evento onContextMenu wiii
                    >
                      {bloquedDay?.blockType == 3 ||
                      foundCalendarDay?.blockType == 3 
                      // bloquedDay?.blockType == 9 ||
                      // foundCalendarDay?.blockType == 9
                      ? (
                      // ( bloquedDay?.blockType == 9 ||
                      // foundCalendarDay?.blockType == 9 ?
                      //   <Box
                      //     component="img"
                      //     src="/images/cup.png"
                      //     alt="pending"
                      //     sx={{ width: 32, height: 32, objectFit: 'contain' }}
                      //   />
                      //   :
                        <Box
                          component="img"
                          src="/images/hourglass.png"
                          alt="pending"
                          sx={{ width: 32, height: 32, objectFit: 'contain' }}
                        />
                      ) : isUnavailable || !blockAvailable ? (
                        <>
                          <Typography
                            sx={{
                              fontSize: 17,
                              lineHeight: 1,
                              fontWeight: 700,
                              color: '#D1D5DB',
                            }}
                          >
                            {displayPrice}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 11,
                              lineHeight: 1,
                              fontWeight: 600,
                              color: isSelected || isTodayColumn ? '#8FA0FF' : '#9CA3AF',
                            }}
                          >
                            BOB
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography sx={{ fontSize: 17, lineHeight: 1, fontWeight: 700 }}>
                            {displayPrice}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 11,
                              lineHeight: 1,
                              fontWeight: 600,
                              color: isSelected || isTodayColumn ? '#8FA0FF' : '#9CA3AF',
                            }}
                          >
                            BOB
                          </Typography>
                        </>
                      )}
                    </Box>
                  );
                })}
                {reservationsCurrent.map((reservation: any, index: number) => {
                  const guestCount = reservation?.reservation?.gests || 0;
                  const totalAmount =
                    reservation?.reservation?.payPriceCalculations?.[0]?.priceCalculation
                      ?.payoutAmount || 0;
                  const reservationName = `${reservation?.reservation?.userIdRenterNavigation?.name || ''} ${reservation?.reservation?.userIdRenterNavigation?.lastName || ''}`;
                  const reservationPhoto =
                    reservation?.reservation?.userIdRenterNavigation?.photoLink?.replace(
                      'https://localhost:44317',
                      'http://assert-dev.runasp.net'
                    ) || '';
                  const nights = Math.max(
                    1,
                    calculateDaysDifference(
                      new Date(reservation?.reservation?.checkin),
                      new Date(reservation?.reservation?.checkout)
                    )
                  );

                  return (
                    <Tooltip
                      key={index}
                      placement="top-start"
                      title={
                        <Box sx={{ p: 0.5 }}>
                          <Typography sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.1 }}>
                            {`${reservation?.reservation?.userIdRenterNavigation?.name || ''} ${reservation?.reservation?.userIdRenterNavigation?.lastName || ''}`}
                          </Typography>
                          <Typography sx={{ fontSize: 13, fontWeight: 700, lineHeight: 1.4 }}>
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
                      <div
                        style={{
                          minWidth: `${reservation.width}px`,
                          minHeight: '30px',
                          position: 'absolute',
                          background: selectedBg,
                          top: '30px',
                          left: `${reservation.x || 0}px`,
                          color: 'white',
                          borderRadius: '10px',
                          boxShadow: '0 6px 14px rgba(91, 76, 160, 0.35)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '0 8px',
                          zIndex: 1,
                          overflow: 'hidden',
                        }}
                        onClick={() => {
                          setSelectReservationInfo({
                            arrivalDate: formatShortDate(new Date(reservation.reservation.checkin)),
                            departureDate: formatShortDate(
                              new Date(reservation.reservation.checkout)
                            ),
                            guests: reservation.reservation.gests || 0,
                            totalCost:
                              reservation.reservation.payPriceCalculations[0]?.priceCalculation
                                ?.payoutAmount || 0,
                            currency: 'BOB',
                            hostName: `${reservation.reservation.userIdRenterNavigation.name} ${reservation.reservation.userIdRenterNavigation.lastName}`,
                            hostLocation: 'Cochabamba, Bolivia',
                            hostImage:
                              reservation.reservation.userIdRenterNavigation.photoLink.replace(
                                'https://localhost:44317',
                                'http://assert-dev.runasp.net'
                              ),
                            indiceColor: 0,
                            user: reservation.reservation.userIdRenter,
                            listingId: reservation.reservation.listingRentId,
                            conversationId: reservation.reservation.conversationId,
                          });
                          setOpenReservation(true);
                        }}
                      >
                        <Avatar
                          src={reservationPhoto}
                          sx={{ width: 27, height: 27, fontSize: 10, flexShrink: 0, border: '2px solid #ffff', left: '-5px' }}
                        />
                        <Typography
                          sx={{
                            fontSize: 12,
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            color: 'white',
                          }}
                        >
                          {reservationName}
                        </Typography>
                      </div>
                    </Tooltip>
                  );
                })}
              </Box>
            );
          })}
        </Box>
        {/* --- Menú Contextual de Material-UI --- */}
        <Menu
          open={Boolean(anchorEl)} // El menú está abierto si anchorEl no es null :P
          onClose={handleCloseContextMenu}
          anchorEl={anchorEl}
        >
          {contextMenuData && ( // Renderiza los MenuItem solo si tenemos datos contextuales
            <MenuList>
              <MenuItem onClick={() => handleMenuItemClick('Bloquear Fecha')}>
                {t('calendar.modify')}
              </MenuItem>
            </MenuList>
          )}
        </Menu>
      </Box>
      <AssertModal
        title={t('calendar.modify')}
        content={
          <FormLockCalendar
            selectedDate={selectedDteBlock}
            onSave={handleSave}
            isAvailability={selectedDteBlock[0]?.isBloquedManual ? 'bloqueado' : 'disponible'}
          />
        }
        open={openAboutSpace}
        showCloseLeft={false}
        onClose={() => setOpenAboutSpace(false)}
        rightIcon={<CloseIcon />}
        showRightIcon={true}
      />
      <AssertModal
        title={t('calendar.reservation')}
        content={<ReservationInfo {...selectReservationInfo} onWriteMessage={onOpenMessaging} />}
        open={openReservation}
        showCloseLeft={false}
        onClose={() => setOpenReservation(false)}
        rightIcon={<CloseIcon />}
        showRightIcon={true}
      />
    </>
  );
};

export default RentalCalendar1;
