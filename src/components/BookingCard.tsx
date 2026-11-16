import { AssertRoutes } from '@/common/enum/AssertRoutes';
import useHandleRouteLink from '@/hooks/useHandleRouteLink';
import {
  priceCalculationCardStore,
  userPriceInformationStore,
} from '@/store/priceInformation.store';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RemoveIcon from '@mui/icons-material/Remove';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { alpha } from '@mui/material';
import useTheme from '@mui/material/styles/useTheme';
import { format, eachDayOfInterval } from 'date-fns'; // Import eachDayOfInterval
import { es } from 'date-fns/locale';
import { useEffect, useRef, useState } from 'react';
import { DateRange, Range, RangeKeyDict } from 'react-date-range';
import { Controller, useForm } from 'react-hook-form';
import { BiUser } from 'react-icons/bi';
import { IoCalendarOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import StarIcon from '@mui/icons-material/Star';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '@/context/SnackbarContext';

interface Guests {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

interface SearchFormStorage {
  CityName?: string;
  typeDesc?: string;
  CityId?: number;
  CountyId?: number;
  StateId?: number;
  CountryId?: number;
  CheckInDate?: string;
  CheckOutDate?: string;
  Guests?: Guests;
  pageNumber?: number;
  pageSize?: number;
}

interface SearchFormData {
  CityName?: string;
  CityId?: number;
  StateId?: number;
  CountryId?: number;
  CountyId?: number;
  typeDesc?: string;
  CheckInDate?: Date | null;
  CheckOutDate?: Date | null;
  Guests: Guests;
}

interface BookingCardProps {
  listingRentId?: number | undefined;
  pricePerNight: number;
  changeDisponibility: (value: boolean) => void;
  rating: number;
  countReviews: number;
  guests: Guests;
  discountedPrice?: number;
  selectionRange: Range;
  onSelect: (ranges: RangeKeyDict) => void;
  onClear: () => void;
  disabledDates: Date[];
  fromMessaging?: boolean;
  seeButtonReserve?: boolean;
  avatarUrl?: string;
  maxGuests: number;
  maxPets?: string | null;
}

const BookingCard: React.FC<BookingCardProps> = ({
  listingRentId,
  pricePerNight,
  changeDisponibility,
  rating,
  countReviews: _countReviews,
  guests: initialGuests,
  selectionRange,
  onSelect,
  onClear,
  disabledDates,
  fromMessaging = false,
  seeButtonReserve = true,
  avatarUrl,
  maxGuests,
  maxPets = null,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const calculatePrice = userPriceInformationStore((state) => state.calculatePrice);
  const handleRouteLink = useHandleRouteLink();
  const dataCalcPriceCard = priceCalculationCardStore((state) => state.dataCalcPriceCard);

  const breakdownArray = JSON.parse(dataCalcPriceCard?.breakdownInfo || '[]');
  const arrayDataCalcPriceCard = Object.values(
    breakdownArray.reduce((acumulador: Record<string, any>, item: any) => {
      if (item.Type === 'PLATFORM_HOST_FEE') return acumulador;
      // Creamos la clave única
      const clave = `${item.Type}|${item.Description}`;

      if (!acumulador[clave]) {
        // Si es la primera vez que vemos este grupo, lo guardamos
        acumulador[clave] = { ...item, subItems: [item] };
      } else {
        // Si ya existe, solo sumamos el monto y acumulamos sub-items
        acumulador[clave].Amount += item.Amount;
        acumulador[clave].subItems.push(item);
      }

      return acumulador;
    }, {})
  );

  const [guestAnchorEl, setGuestAnchorEl] = useState<null | HTMLElement>(null);
  const [dateAnchorEl, setDateAnchorEl] = useState<null | HTMLElement>(null);
  const [autoOpenDate, setAutoOpenDate] = useState(false);
  const [autoOpenGuests, setAutoOpenGuests] = useState(false);
  const [guests, setGuests] = useState<Guests>(initialGuests);
  const [_, setEnabledDaysCount] = useState(0); // New state for enabled days count
  const [isExpanded, setIsExpanded] = useState(false);
  const [openBreakdownIndex, setOpenBreakdownIndex] = useState<number | null>(null);
  const showSnackbar = useSnackbar();
  const checkInRef = useRef<HTMLDivElement>(null);
  const checkOutRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);
  const guestPopoverRef = useRef<HTMLDivElement>(null);

  const openGuestsPopover = Boolean(guestAnchorEl);
  const openDatePopover = Boolean(dateAnchorEl);

  const today = new Date();
  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(today.getDate() + 6);

  const { t } = useTranslation();

  const { control, handleSubmit, setValue } = useForm<SearchFormData>({
    defaultValues: {
      CityName: '',
      CityId: undefined,
      StateId: undefined,
      CountryId: undefined,
      CountyId: undefined,
      typeDesc: '',
      CheckInDate: selectionRange.startDate || today,
      CheckOutDate: selectionRange.endDate || sevenDaysFromNow,
      Guests: initialGuests,
    },
  });

  // Function to calculate enabled days
  const calculateEnabledDays = () => {
    if (!selectionRange.startDate || !selectionRange.endDate) {
      setEnabledDaysCount(0);
      return;
    }

    const days = eachDayOfInterval({
      start: selectionRange.startDate,
      end: selectionRange.endDate,
    });

    const enabledDays = days.filter((day) => {
      return !disabledDates.some(
        (disabledDate) =>
          day.getFullYear() === disabledDate.getFullYear() &&
          day.getMonth() === disabledDate.getMonth() &&
          day.getDate() === disabledDate.getDate()
      );
    });

    setEnabledDaysCount(enabledDays.length);
  };

  useEffect(() => {
    calculateEnabledDays();
  }, [selectionRange, disabledDates]);

  useEffect(() => {
    const storedData = localStorage.getItem('search-form-storage');
    if (storedData) {
      try {
        const parsed: SearchFormStorage = JSON.parse(storedData);
        setGuests(parsed.Guests || initialGuests);
        setValue('CityName', parsed.CityName || '');
        setValue('typeDesc', parsed.typeDesc || '');
        setValue('CityId', parsed.typeDesc === 'city' ? parsed.CityId : undefined);
        setValue('StateId', parsed.typeDesc === 'state' ? parsed.StateId : undefined);
        setValue('CountryId', parsed.typeDesc === 'country' ? parsed.CountryId : undefined);
        setValue('CountyId', parsed.typeDesc === 'county' ? parsed.CountyId : undefined);
        setValue(
          'CheckInDate',
          parsed.CheckInDate ? new Date(parsed.CheckInDate) : selectionRange.startDate || today
        );
        setValue(
          'CheckOutDate',
          parsed.CheckOutDate
            ? new Date(parsed.CheckOutDate)
            : selectionRange.endDate || sevenDaysFromNow
        );
        setValue('Guests', parsed.Guests || initialGuests);
      } catch (error) {
        console.error('Error parsing search-form-storage:', error);
      }
    }
  }, [setValue, initialGuests, selectionRange.startDate, selectionRange.endDate]);

  const updateLocalStorage = (data: SearchFormData) => {
    const storageData: SearchFormStorage = {
      CityName: data.CityName,
      typeDesc: data.typeDesc,
      CityId: data.typeDesc === 'city' ? data.CityId : undefined,
      StateId: data.typeDesc === 'state' ? data.StateId : undefined,
      CountryId: data.typeDesc === 'country' ? data.CountryId : undefined,
      CountyId: data.typeDesc === 'county' ? data.CountyId : undefined,
      CheckInDate: data.CheckInDate?.toISOString(),
      CheckOutDate: data.CheckOutDate?.toISOString(),
      Guests: data.Guests,
      pageNumber: 1,
      pageSize: 10,
    };
    localStorage.setItem('search-form-storage', JSON.stringify(storageData));
  };

  // Manejo de cambios en huéspedes y fechas
  useEffect(() => {
    setValue('Guests', guests);
    setValue('CheckInDate', selectionRange.startDate);
    setValue('CheckOutDate', selectionRange.endDate);
  }, [guests, selectionRange, setValue]);

  // Lógica de enfoque encadenado
  useEffect(() => {
    if (autoOpenDate && checkInRef.current) {
      setAutoOpenDate(false);
      setTimeout(() => {
        setGuestAnchorEl(null);
        setDateAnchorEl(checkInRef.current);
      }, 140);
    }
  }, [autoOpenDate]);

  useEffect(() => {
    if (autoOpenGuests && guestsRef.current) {
      setAutoOpenGuests(false);
      setGuestAnchorEl(guestsRef.current);
      setDateAnchorEl(null);
    }
  }, [autoOpenGuests]);

  // Cerrar popover de huéspedes al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        guestPopoverRef.current &&
        !guestPopoverRef.current.contains(event.target as Node) &&
        guestsRef.current &&
        !guestsRef.current.contains(event.target as Node)
      ) {
        setGuestAnchorEl(null);
      }
    };

    if (openGuestsPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openGuestsPopover]);

  // Handlers
  const handleGuestClick = () => {
    setGuestAnchorEl(guestsRef.current);
    setDateAnchorEl(null);
    changeDisponibility(false);
  };

  const handleGuestChange = (key: keyof Guests, count: number) => {
    setGuests((prev) => {
      // Bloquear incremento de adultos o niños si ya se alcanzó maxGuests
      if (
        (key === 'adults' || key === 'children') &&
        count > 0 &&
        prev.adults + prev.children >= maxGuests
      ) {
        showSnackbar(t('bookingCard.maxGuestsError', { count: maxGuests }), 'warning');
        return prev;
      }
      // Bloquear incremento de mascotas si ya se alcanzó maxPets
      if (key === 'pets' && count > 0 && maxPets !== null && prev.pets >= parseInt(maxPets)) {
        showSnackbar(t('bookingCard.maxPetsError', { count: parseInt(maxPets) }), 'warning');
        return prev;
      }
      const newValue = Math.max(0, prev[key] + count);
      let updated = { ...prev, [key]: newValue };
      // Si la suma de adultos + niños es 0, infants y pets deben ser 0
      if ((key === 'adults' || key === 'children') && updated.adults + updated.children === 0) {
        updated.infants = 0;
        updated.pets = 0;
      }
      return updated;
    });
  };

  const formatDate = (date: Date | null | undefined, forDisplay: boolean = false) => {
    if (!date || isNaN(date.getTime())) return '';
    return forDisplay ? format(date, 'dd MMM yyyy', { locale: es }) : format(date, 'yyyy-MM-dd');
  };

  const handleDateRangeClose = () => {
    setDateAnchorEl(null);
    if (selectionRange.endDate) {
      changeDisponibility(false);
      setTimeout(() => setAutoOpenGuests(true), 0);
    }
  };

  const onSubmit = (formData: SearchFormData) => {
    if (!formData.CityId && !formData.StateId && !formData.CountryId && !formData.CountyId) {
      console.error(t('bookingCard.locationRequired'));
      return;
    }

    const params = new URLSearchParams();
    if (formData.CityId) params.set('CityId', formData.CityId.toString());
    if (formData.StateId) params.set('StateId', formData.StateId.toString());
    if (formData.CountryId) params.set('CountryId', formData.CountryId.toString());
    if (formData.CountyId) params.set('CountyId', formData.CountyId.toString());
    if (formData.CheckInDate) params.set('checkIn', formatDate(formData.CheckInDate, false));
    if (formData.CheckOutDate) params.set('checkOut', formatDate(formData.CheckOutDate, false));
    const totalGuests = formData.Guests.adults + formData.Guests.children;
    if (totalGuests > 0) params.set('guests', totalGuests.toString());

    updateLocalStorage(formData);
    calculatePrice(formData.CheckInDate || today, formData.CheckOutDate || sevenDaysFromNow);
    navigate(`${AssertRoutes.BOOK}/${listingRentId}?${params.toString()}`);
  };

  const totalGuests = guests.adults + guests.children;

  // Colores de estilo modernos
  const brandColor = theme.palette.primary.main;
  const subtleBorderColor = alpha(brandColor, 0.25);
  const hoverBgColor = alpha(brandColor, 0.04);

  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      position={{ xs: 'fixed', md: 'sticky' }}
      bottom={{ xs: 0, md: 'auto' }}
      top={{ xs: 'auto', md: 70 }}
      left={{ xs: 0, md: 'auto' }}
      right={{ xs: 0, md: 'auto' }}
      width={{ xs: '100%', md: 'auto' }}
      sx={{
        zIndex: { xs: 1200, md: 10 },
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <Card
        elevation={0}
        sx={{
          p: { xs: isExpanded ? 3 : 1.5, md: 4 },
          borderRadius: { xs: isExpanded ? '16px 16px 0 0' : '16px 16px 0 0', md: '24px' },
          border: { xs: 'none', md: `1px solid ${alpha(brandColor, 0.15)}` },
          boxShadow: {
            xs: '0px -4px 16px rgba(0, 0, 0, 0.1)',
            md: '0px 8px 24px rgba(0, 0, 0, 0.08)',
          },
          width: { xs: '100%', md: '95%' },
          maxHeight: { xs: isExpanded ? '80vh' : 'auto', md: 'auto' },
          overflow: { xs: isExpanded ? 'auto' : 'visible', md: 'visible' },
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
            {/* Vista compacta para móvil (colapsado) */}
            {!isExpanded && isMobile && (
              <Box
                onClick={() => setIsExpanded(true)}
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Avatar src={avatarUrl} alt={''} sx={{ width: 44, height: 44 }} />
                  <Box>
                    <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: 700 }}>
                      {dataCalcPriceCard?.currencyCode ? (
                        <span>{`${pricePerNight} ${dataCalcPriceCard.currencyCode}/noche`}</span>
                      ) : (
                        <span>{`${pricePerNight} BOB/noche`}</span>
                      )}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <StarIcon sx={{ color: theme.palette.primary.main, fontSize: '16px' }} />
                      <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        {rating}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <ExpandMoreIcon
                  sx={{ fontSize: 28, color: 'text.secondary', transform: 'rotate(180deg)' }}
                />
              </Box>
            )}

            {/* Vista completa (desktop siempre, móvil solo cuando expandido) */}
            <Box sx={{ display: { xs: isExpanded ? 'block' : 'none', md: 'block' } }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" flexDirection="column" gap={0.5}>
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      {dataCalcPriceCard?.currencyCode ? (
                        <span>{`${pricePerNight} ${dataCalcPriceCard.currencyCode}/noche`}</span>
                      ) : (
                        <>
                          <span
                            style={{ fontSize: '1.5rem', fontWeight: 700 }}
                          >{`${pricePerNight} `}</span>
                          <span style={{ fontSize: '1rem', color: '#64748b' }}>{`BOB/noche`}</span>
                        </>
                      )}
                    </Typography>
                  </Box>
                  <Box display={'flex'} flexDirection={'row'}>
                    <StarIcon sx={{ color: theme.palette.primary.main, fontSize: '20px' }} />
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                      {rating}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={1.5}>
                  <Avatar
                    src={avatarUrl}
                    alt={''}
                    sx={{
                      width: 52,
                      height: 52,
                      border: `2px solid ${alpha(brandColor, 0.2)}`,
                    }}
                  />
                  {isMobile && isExpanded && (
                    <ExpandMoreIcon
                      onClick={() => setIsExpanded(false)}
                      sx={{
                        fontSize: 28,
                        color: 'text.secondary',
                        cursor: 'pointer',
                      }}
                    />
                  )}
                </Box>
              </Box>

              {/* --- INPUTS UNIDOS (Los 3 rectángulos) --- */}
              <Box
                sx={{
                  border: `1px solid ${subtleBorderColor}`,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  mb: 3,
                }}
              >
                {/* Fila Superior: Fechas */}
                <Box display="flex" sx={{ height: '100%' }}>
                  {/* CHECK-IN */}
                  <Box
                    ref={checkInRef}
                    onClick={() => {
                      setGuestAnchorEl(null);
                      setDateAnchorEl(checkInRef.current);
                    }}
                    sx={{
                      flex: 1,
                      p: 1.5,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      transition: 'background-color 0.2s',
                      '&:hover': { bgcolor: hoverBgColor },
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      <IoCalendarOutline size={16} color={'#64748b'} style={{ opacity: 0.7 }} />
                      <Typography
                        sx={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#64748b',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {t('searchMenu.arrive')}
                      </Typography>
                    </Box>
                    <Controller
                      name="CheckInDate"
                      control={control}
                      render={({ field }) => (
                        <Typography
                          sx={{
                            fontWeight: 600,
                            color: '#1e293b',
                            fontSize: '0.9rem',
                            pl: '24px',
                            textAlign: 'left',
                          }}
                        >
                          {field.value ? formatDate(selectionRange.startDate, true) : 'Seleccionar'}
                        </Typography>
                      )}
                    />
                  </Box>

                  {/* Divisor Vertical */}
                  <Box sx={{ width: '1px', bgcolor: subtleBorderColor }} />

                  {/* CHECK-OUT */}
                  <Box
                    ref={checkOutRef}
                    onClick={() => {
                      setGuestAnchorEl(null);
                      setDateAnchorEl(checkOutRef.current);
                    }}
                    sx={{
                      flex: 1,
                      p: 1.5,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      transition: 'background-color 0.2s',
                      '&:hover': { bgcolor: hoverBgColor },
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      <IoCalendarOutline size={16} color={'#64748b'} style={{ opacity: 0.7 }} />
                      <Typography
                        sx={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#64748b',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {t('searchMenu.departure')}
                      </Typography>
                    </Box>
                    <Controller
                      name="CheckOutDate"
                      control={control}
                      render={({ field }) => (
                        <Typography
                          sx={{
                            fontWeight: 600,
                            color: '#1e293b',
                            fontSize: '0.9rem',
                            pl: '24px',
                            textAlign: 'left',
                          }}
                        >
                          {field.value ? formatDate(selectionRange.endDate, true) : 'Seleccionar'}
                        </Typography>
                      )}
                    />
                  </Box>
                </Box>

                {/* Divisor Horizontal */}
                <Divider sx={{ borderColor: subtleBorderColor }} />

                {/* Fila Inferior: Huéspedes */}
                <Box
                  ref={guestsRef}
                  onClick={handleGuestClick}
                  sx={{
                    p: 1.5,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'background-color 0.2s',
                    '&:hover': { bgcolor: hoverBgColor },
                  }}
                >
                  <Box>
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      <BiUser size={16} color={'#64748b'} style={{ opacity: 0.7 }} />
                      <Typography
                        sx={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#64748b',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {t('searchMenu.guests')}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem', pl: '24px' }}
                    >
                      {(() => {
                        const summary =
                          totalGuests > 0
                            ? `${totalGuests} ${t('bookingCard.guest', { count: totalGuests })}` +
                              (guests.infants > 0
                                ? `, ${guests.infants} ${t('bookingCard.baby', { count: guests.infants })}`
                                : '') +
                              (guests.pets > 0
                                ? `, ${guests.pets} ${t('bookingCard.pet', { count: guests.pets })}`
                                : '')
                            : t('searchMenu.textGuests');
                        return summary;
                      })()}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* --- DETALLES DE PRECIO --- */}
              {dataCalcPriceCard?.guestResume && (
                <Box sx={{ mb: 3, p: 2, bgcolor: '#f8fafc', borderRadius: 3 }}>
                  {/* ── Accommodation ── */}
                  <Typography
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      mb: 1.5,
                      display: 'block',
                    }}
                  >
                    {t('bookingCard.accommodation')}
                  </Typography>

                  {(() => {
                    const acc = dataCalcPriceCard.guestResume.accommodation;
                    const weekendNights = acc?.weekend_NightsCount ?? 0;
                    const weekdayNights = (acc?.nightsCount ?? 0) - weekendNights;

                    const itemsWithDates = (arrayDataCalcPriceCard as any[]).filter((item: any) =>
                      item.subItems?.some((s: any) => !!s?.Date)
                    );
                    const weekdayAccItem: any = itemsWithDates[0] ?? null;
                    const weekendAccItem: any = itemsWithDates[1] ?? null;

                    const renderAccRow = (
                      label: string,
                      amount: number | undefined,
                      breakdownItem: any,
                      rowKey: number
                    ) => {
                      const count = breakdownItem?.subItems?.length ?? 0;
                      const showTooltip = count > 1;

                      const labelNode = (
                        <Typography
                          component="span"
                          variant="body2"
                          color="#64748b"
                          sx={
                            showTooltip
                              ? { cursor: 'help', textDecoration: 'underline dotted' }
                              : {}
                          }
                        >
                          {label}
                        </Typography>
                      );

                      const mobilePanel = showTooltip && (
                        <Box
                          sx={{
                            mt: 1,
                            mb: 0.5,
                            bgcolor: '#1e293b',
                            borderRadius: '10px',
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              px: 2,
                              py: 0.75,
                              bgcolor: 'rgba(255,255,255,0.06)',
                              borderBottom: '1px solid rgba(255,255,255,0.1)',
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                color: '#94a3b8',
                                textTransform: 'uppercase',
                                letterSpacing: '0.6px',
                              }}
                            >
                              {breakdownItem?.Description ?? ''}
                            </Typography>
                          </Box>
                          <Box sx={{ px: 2, py: 1 }}>
                            {breakdownItem?.subItems.map((sub: any, i: number) => (
                              <Box
                                key={i}
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                gap={2}
                                sx={{
                                  py: 0.5,
                                  borderBottom:
                                    i < breakdownItem.subItems.length - 1
                                      ? '1px solid rgba(255,255,255,0.06)'
                                      : 'none',
                                }}
                              >
                                <Typography sx={{ fontSize: '0.78rem', color: '#cbd5e1', flex: 1 }}>
                                  {sub?.Date
                                    ? sub.Date.split('T')[0].split('-').reverse().join('-')
                                    : (sub?.Description ?? '')}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    color: '#f1f5f9',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {sub?.Amount?.toFixed(2)} {dataCalcPriceCard?.currencyCode}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      );

                      return (
                        <Box key={rowKey} mb={1.5}>
                          <Box display="flex" justifyContent="space-between">
                            {showTooltip ? (
                              isMobile ? (
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="#64748b"
                                  sx={{ cursor: 'pointer', textDecoration: 'underline dotted' }}
                                  onClick={() =>
                                    setOpenBreakdownIndex(
                                      openBreakdownIndex === rowKey ? null : rowKey
                                    )
                                  }
                                >
                                  {label}
                                </Typography>
                              ) : (
                                <Tooltip
                                  placement="left"
                                  arrow
                                  slotProps={{
                                    tooltip: {
                                      sx: {
                                        bgcolor: '#1e293b',
                                        color: '#f8fafc',
                                        borderRadius: '12px',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                                        p: 0,
                                        minWidth: 220,
                                        maxWidth: 280,
                                        overflow: 'hidden',
                                      },
                                    },
                                    arrow: { sx: { color: '#1e293b' } },
                                  }}
                                  title={
                                    <Box>
                                      <Box
                                        sx={{
                                          px: 2,
                                          py: 1,
                                          bgcolor: 'rgba(255,255,255,0.06)',
                                          borderBottom: '1px solid rgba(255,255,255,0.1)',
                                        }}
                                      >
                                        <Typography
                                          sx={{
                                            fontSize: '0.7rem',
                                            fontWeight: 700,
                                            color: '#94a3b8',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.6px',
                                          }}
                                        >
                                          {breakdownItem?.Description ?? ''}
                                        </Typography>
                                      </Box>
                                      <Box sx={{ px: 2, py: 1.5 }}>
                                        {breakdownItem?.subItems.map((sub: any, i: number) => (
                                          <Box
                                            key={i}
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            gap={3}
                                            sx={{
                                              py: 0.5,
                                              borderBottom:
                                                i < breakdownItem.subItems.length - 1
                                                  ? '1px solid rgba(255,255,255,0.06)'
                                                  : 'none',
                                            }}
                                          >
                                            <Typography
                                              sx={{ fontSize: '0.8rem', color: '#cbd5e1', flex: 1 }}
                                            >
                                              {sub?.Date
                                                ? sub.Date.split('T')[0]
                                                    .split('-')
                                                    .reverse()
                                                    .join('-')
                                                : (sub?.Description ?? '')}
                                            </Typography>
                                            <Typography
                                              sx={{
                                                fontSize: '0.8rem',
                                                fontWeight: 700,
                                                color: '#f1f5f9',
                                                whiteSpace: 'nowrap',
                                              }}
                                            >
                                              {sub?.Amount?.toFixed(2)}{' '}
                                              {dataCalcPriceCard?.currencyCode}
                                            </Typography>
                                          </Box>
                                        ))}
                                      </Box>
                                    </Box>
                                  }
                                >
                                  {labelNode}
                                </Tooltip>
                              )
                            ) : (
                              labelNode
                            )}
                            <Typography variant="body2" fontWeight={600} color="#334155">
                              {amount?.toFixed(2)} {dataCalcPriceCard.guestResume.currencyCode}
                            </Typography>
                          </Box>
                          {isMobile && openBreakdownIndex === rowKey && mobilePanel}
                        </Box>
                      );
                    };

                    return (
                      <>
                        {renderAccRow(
                          t('bookingCard.nightlyPrice', { count: weekdayNights }),
                          acc?.baseAmount,
                          weekdayAccItem,
                          0
                        )}

                        {weekendNights > 0 &&
                          renderAccRow(
                            t('bookingCard.weekendPrice', { count: weekendNights }),
                            acc?.weekend_BaseAmount,
                            weekendAccItem,
                            1
                          )}

                        {(acc?.appliedDiscount ?? 0) > 0 && (
                          <Box display="flex" justifyContent="space-between" mb={1.5}>
                            <Typography variant="body2" color="#64748b">
                              {t('bookingCard.discountApplied')}
                            </Typography>
                            <Typography variant="body2" fontWeight={600} color="#334155">
                              -{acc?.appliedDiscount?.toFixed(2)}{' '}
                              {dataCalcPriceCard.guestResume.currencyCode}
                            </Typography>
                          </Box>
                        )}

                        <Box display="flex" justifyContent="space-between" mb={1.5}>
                          <Typography variant="body2" color="#64748b">
                            {(acc?.appliedDiscount ?? 0) > 0
                              ? t('bookingCard.accommodationWithDiscount')
                              : t('bookingCard.accommodationTotal')}
                          </Typography>
                          <Typography variant="body2" fontWeight={600} color="#334155">
                            {acc?.discountedAmount?.toFixed(2)}{' '}
                            {dataCalcPriceCard.guestResume.currencyCode}
                          </Typography>
                        </Box>
                      </>
                    );
                  })()}

                  {/* ── Cargos adicionales ── */}
                  {((dataCalcPriceCard.guestResume.additionalCharges?.extraGuestFee ?? 0) > 0 ||
                    (dataCalcPriceCard.guestResume.additionalCharges?.petFee ?? 0) > 0 ||
                    (dataCalcPriceCard.guestResume.additionalCharges?.cleaningFee ?? 0) > 0 ||
                    (dataCalcPriceCard.guestResume.additionalCharges?.otherFees ?? 0) > 0) && (
                    <>
                      <Typography
                        sx={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#64748b',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          mt: 2,
                          mb: 1.5,
                          display: 'block',
                        }}
                      >
                        {t('bookingCard.additionalCharges')}
                      </Typography>

                      {(dataCalcPriceCard.guestResume.additionalCharges?.extraGuestFee ?? 0) >
                        0 && (
                        <Box display="flex" justifyContent="space-between" mb={1.5}>
                          <Typography variant="body2" color="#64748b">
                            {t('bookingCard.extraGuests')}
                          </Typography>
                          <Typography variant="body2" fontWeight={600} color="#334155">
                            {dataCalcPriceCard.guestResume.additionalCharges?.extraGuestFee?.toFixed(
                              2
                            )}{' '}
                            {dataCalcPriceCard.guestResume.currencyCode}
                          </Typography>
                        </Box>
                      )}

                      {(dataCalcPriceCard.guestResume.additionalCharges?.petFee ?? 0) > 0 && (
                        <Box display="flex" justifyContent="space-between" mb={1.5}>
                          <Typography variant="body2" color="#64748b">
                            {t('bookingCard.petFee')}
                          </Typography>
                          <Typography variant="body2" fontWeight={600} color="#334155">
                            {dataCalcPriceCard.guestResume.additionalCharges?.petFee?.toFixed(2)}{' '}
                            {dataCalcPriceCard.guestResume.currencyCode}
                          </Typography>
                        </Box>
                      )}

                      {(dataCalcPriceCard.guestResume.additionalCharges?.cleaningFee ?? 0) > 0 && (
                        <Box display="flex" justifyContent="space-between" mb={1.5}>
                          <Typography variant="body2" color="#64748b">
                            {t('bookingCard.cleaningFee')}
                          </Typography>
                          <Typography variant="body2" fontWeight={600} color="#334155">
                            {dataCalcPriceCard.guestResume.additionalCharges?.cleaningFee?.toFixed(
                              2
                            )}{' '}
                            {dataCalcPriceCard.guestResume.currencyCode}
                          </Typography>
                        </Box>
                      )}

                      {(dataCalcPriceCard.guestResume.additionalCharges?.otherFees ?? 0) > 0 && (
                        <Box display="flex" justifyContent="space-between" mb={1.5}>
                          <Typography variant="body2" color="#64748b">
                            {t('bookingCard.otherFees')}
                          </Typography>
                          <Typography variant="body2" fontWeight={600} color="#334155">
                            {dataCalcPriceCard.guestResume.additionalCharges?.otherFees?.toFixed(2)}{' '}
                            {dataCalcPriceCard.guestResume.currencyCode}
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}

                  {/* ── Contenedor: Subtotal + Comisión + Total ── */}
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: alpha(brandColor, 0.06),
                      borderRadius: 2,
                      border: `1px solid ${alpha(brandColor, 0.15)}`,
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="#475569">
                        {t('bookingCard.subtotal')}:
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color="#334155">
                        {dataCalcPriceCard.guestResume.subtotal?.toFixed(2)}{' '}
                        {dataCalcPriceCard.guestResume.currencyCode}
                      </Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between" mb={1.5}>
                      <Typography variant="body2" color="#475569">
                        {`${t('bookingCard.hostCommission')} ${dataCalcPriceCard.guestResume.guestCommissionPercent ?? 15}%:`}
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color="#334155">
                        {dataCalcPriceCard.guestResume.guestCommission?.toFixed(2)}{' '}
                        {dataCalcPriceCard.guestResume.currencyCode}
                      </Typography>
                    </Box>

                    <Divider sx={{ borderColor: alpha(brandColor, 0.2), mb: 1.5 }} />

                    <Box display="flex" justifyContent="space-between">
                      <Typography fontWeight={800} color="#0f172a">
                        {t('bookingCard.total')}:
                      </Typography>
                      <Typography fontWeight={800} color="#0f172a">
                        {dataCalcPriceCard.guestResume.total?.toFixed(2)}{' '}
                        {dataCalcPriceCard.guestResume.currencyCode}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
              {seeButtonReserve ? (
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() =>
                    fromMessaging
                      ? handleRouteLink(`${AssertRoutes.BOOK}/${listingRentId}`)
                      : handleRouteLink(`/messages/host/${listingRentId}/false`)
                  }
                >
                  {t('bookingCard.reserveNow')}
                </Button>
              ) : (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box>
                    <Typography variant="paragraph1Medium" component="div">
                      {t('bookingCard.freeCancellationTitle')}
                    </Typography>
                    <Typography variant="paragraph1SRegular" component="div">
                      {t('bookingCard.freeCancellationText')}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </CardContent>
        </form>

        {/* Guests Popover */}
        <Popover
          open={openGuestsPopover}
          anchorEl={guestAnchorEl}
          onClose={() => {
            setGuestAnchorEl(null);
            // setActiveSection(null);
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          sx={{
            mt: 2,
            '& .MuiPopover-paper': {
              borderRadius: 3,
              boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
              width: 400,
            },
          }}
        >
          <Box sx={{ p: 3 }}>
            {/* Adults */}
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
            >
              <Box width={'100%'}>
                <Typography sx={{ fontSize: theme.typography.paragraph1Medium, color: '#000000' }}>
                  {t('searchMenu.adults')}
                </Typography>
                <Typography
                  sx={{
                    fontSize: theme.typography.paragraph1SRegular,
                    color: 'gray',
                  }}
                >
                  {t('searchMenu.ageAdults')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                  onClick={() => handleGuestChange('adults', -1)}
                  disabled={guests.adults === 0}
                  sx={{
                    border: '1px solid #b0b0b0',
                    width: 32,
                    height: 32,
                    '&:disabled': {
                      border: '1px solid #ebebeb',
                      opacity: 0.3,
                    },
                  }}
                >
                  <RemoveIcon sx={{ fontSize: 16 }} />
                </IconButton>
                <Typography
                  sx={{
                    minWidth: 24,
                    textAlign: 'center',
                    fontFamily: theme.typography.h5Bold,
                    color: theme.palette.customColors.primary[1],
                  }}
                >
                  {guests.adults}
                </Typography>
                <IconButton
                  onClick={() => handleGuestChange('adults', 1)}
                  // disabled={guests.adults + guests.children >= 18}
                  disabled={guests.adults + guests.children >= maxGuests}
                  sx={{
                    border: '1px solid #b0b0b0',
                    width: 32,
                    height: 32,
                    '&:disabled': {
                      border: '1px solid #ebebeb',
                      opacity: 0.3,
                    },
                  }}
                >
                  <AddIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Children */}
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
            >
              <Box>
                <Typography sx={{ fontSize: theme.typography.paragraph1Medium, color: '#000000' }}>
                  {t('searchMenu.children')}
                </Typography>
                <Typography
                  sx={{
                    fontSize: theme.typography.paragraph1SRegular,
                    color: 'gray',
                  }}
                >
                  {t('searchMenu.ageChildren')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                  onClick={() => handleGuestChange('children', -1)}
                  disabled={guests.children === 0}
                  sx={{
                    border: '1px solid #b0b0b0',
                    width: 32,
                    height: 32,
                    '&:disabled': {
                      border: '1px solid #ebebeb',
                      opacity: 0.3,
                    },
                  }}
                >
                  <RemoveIcon sx={{ fontSize: 16 }} />
                </IconButton>
                <Typography
                  sx={{
                    minWidth: 24,
                    textAlign: 'center',
                    fontFamily: theme.typography.h5Bold,
                    color: theme.palette.customColors.primary[1],
                  }}
                >
                  {guests.children}
                </Typography>
                <IconButton
                  onClick={() => handleGuestChange('children', 1)}
                  //  disabled={guests.adults + guests.children >= 18}
                  disabled={guests.adults + guests.children >= maxGuests}
                  sx={{
                    border: '1px solid #b0b0b0',
                    width: 32,
                    height: 32,
                    '&:disabled': {
                      border: '1px solid #ebebeb',
                      opacity: 0.3,
                    },
                  }}
                >
                  <AddIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Infants */}
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
            >
              <Box>
                <Typography sx={{ fontSize: theme.typography.paragraph1Medium, color: '#000000' }}>
                  {t('searchMenu.babies')}
                </Typography>
                <Typography
                  sx={{
                    fontSize: theme.typography.paragraph1SRegular,
                    color: 'gray',
                  }}
                >
                  {t('searchMenu.ageBaby')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                  onClick={() => handleGuestChange('infants', -1)}
                  disabled={guests.infants === 0}
                  sx={{
                    border: '1px solid #b0b0b0',
                    width: 32,
                    height: 32,
                    '&:disabled': {
                      border: '1px solid #ebebeb',
                      opacity: 0.3,
                    },
                  }}
                >
                  <RemoveIcon sx={{ fontSize: 16 }} />
                </IconButton>
                <Typography
                  sx={{
                    minWidth: 24,
                    textAlign: 'center',
                    fontFamily: theme.typography.h5Bold,
                    color: theme.palette.customColors.primary[1],
                  }}
                >
                  {guests.infants}
                </Typography>
                <IconButton
                  onClick={() => handleGuestChange('infants', 1)}
                  disabled={guests.adults + guests.children < 1}
                  sx={
                    guests.adults + guests.children < 1
                      ? {
                          border: '1px solid #ebebeb',
                          width: 32,
                          height: 32,
                          opacity: 0.3,
                        }
                      : {
                          border: '1px solid #b0b0b0',
                          width: 32,
                          height: 32,
                        }
                  }
                >
                  <AddIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Pets */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography sx={{ fontSize: theme.typography.paragraph1Medium, color: '#000000' }}>
                  {t('searchMenu.pets')}
                </Typography>
                <Typography
                  sx={{
                    fontSize: theme.typography.paragraph1SRegular,
                    color: 'gray',
                  }}
                >
                  {t('bookingCard.petsPrompt')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                  onClick={() => handleGuestChange('pets', -1)}
                  disabled={guests.pets === 0}
                  sx={{
                    border: '1px solid #b0b0b0',
                    width: 32,
                    height: 32,
                    '&:disabled': {
                      border: '1px solid #ebebeb',
                      opacity: 0.3,
                    },
                  }}
                >
                  <RemoveIcon sx={{ fontSize: 16 }} />
                </IconButton>
                <Typography
                  sx={{
                    minWidth: 24,
                    textAlign: 'center',
                    fontFamily: theme.typography.h5Bold,
                    color: theme.palette.customColors.primary[1],
                  }}
                >
                  {guests.pets}
                </Typography>
                <IconButton
                  onClick={() => handleGuestChange('pets', 1)}
                  disabled={
                    guests.adults + guests.children < 1 ||
                    (maxPets !== null && guests.pets >= parseInt(maxPets))
                  }
                  sx={
                    guests.adults + guests.children < 1 ||
                    (maxPets !== null && guests.pets >= parseInt(maxPets))
                      ? {
                          border: '1px solid #ebebeb',
                          width: 32,
                          height: 32,
                          opacity: 0.3,
                        }
                      : {
                          border: '1px solid #b0b0b0',
                          width: 32,
                          height: 32,
                        }
                  }
                >
                  <AddIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Popover>

        <Popover
          open={openDatePopover}
          anchorEl={dateAnchorEl}
          onClose={handleDateRangeClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          sx={{
            mt: 1,
            '& .MuiPaper-root': {
              borderRadius: '16px',
              boxShadow: 'rgba(0, 0, 0, 0.15) 0px 10px 30px 0px',
              p: 2,
              width: { xs: '100%', md: 'auto' },
            },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <DateRange
              className="custom-date-range"
              ranges={[selectionRange]}
              onChange={onSelect}
              months={2}
              direction={isMobile ? 'vertical' : 'horizontal'}
              rangeColors={[theme.palette.customColors.primary[1]]}
              showDateDisplay={false}
              locale={es}
              minDate={new Date()}
              editableDateInputs={false}
              disabledDay={(date) =>
                disabledDates.some(
                  (d: Date) =>
                    date.getFullYear() === d.getFullYear() &&
                    date.getMonth() === d.getMonth() &&
                    date.getDate() === d.getDate()
                )
              }
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 2,
                px: 2,
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  onClick={onClear}
                  sx={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#222',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    '&:hover': {
                      color: '#000',
                    },
                  }}
                >
                  {t('searchMenu.clearDate')}
                </Typography>
              </Box>
              <Box>
                <Button
                  variant="primary"
                  onClick={handleDateRangeClose}
                  sx={{ textTransform: 'none', minWidth: 120 }}
                >
                  Cerrar
                </Button>
              </Box>
            </Box>
          </Box>
        </Popover>
      </Card>
    </Box>
  );
};

export default BookingCard;
