import { useNotification } from '@/context/NotificationContext';
import { useSnackbar } from '@/context/SnackbarContext';
import theme from '@/themes/theme';
import { normalizeDate } from '@/utilities/dateUtils';
import { Add as AddIcon, Remove as RemoveIcon, Search as SearchIcon } from '@mui/icons-material';
import { Box, Button, Divider, IconButton, Paper, Popover, Typography } from '@mui/material';
import { format, parseISO, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DateRange, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useTranslation } from 'react-i18next';
import { FaRegMap } from 'react-icons/fa';
import { IoCalendarOutline } from 'react-icons/io5';
import { PiUsersThree } from 'react-icons/pi';

interface LocationData {
  latitude: number;
  longitude: number;
  premise?: string;
  country?: string;
  state?: string;
  county?: string;
  city?: string;
  street?: string;
  postalCode?: string;
  formattedAddress?: string;
}

interface Guests {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

interface SearchFormData {
  CheckInDate?: string | null;
  CheckOutDate?: string | null;
  Guests: Guests;
  AdtCount?: number | undefined;
  ChdCount?: number | undefined;
  InfCount?: number | undefined;
  PetsCount?: number | undefined;
  AnotherLocation?: string;
  Street?: string;
  City?: string;
  County?: string;
  State?: string;
  Country?: string;
  PostalCode?: string;
  FormattedAddress?: string;
  Longitude?: number;
  Latitude?: number;
  PropertyTypeId?: number | null;
  pageNumber?: number;
  pageSize?: number;
}

interface SearchResultsBarProps {
  onSearch: (data: SearchFormData) => void;
  initialData?: SearchFormData | null;
  isLoaded: boolean;
}

const SearchResultsBar: React.FC<SearchResultsBarProps> = ({ onSearch, initialData, isLoaded }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [dateAnchorEl, setDateAnchorEl] = useState<null | HTMLElement>(null);
  const [guestAnchorEl, setGuestAnchorEl] = useState<null | HTMLElement>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [locationInput, setLocationInput] = useState('');
  const guestsPopoverRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const checkInRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);
  const locationInputRef = useRef<HTMLInputElement | null>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const openGuestsPopover = Boolean(guestAnchorEl);
  const openDatePopover = Boolean(dateAnchorEl);
  const showSnackbar = useSnackbar();
  const { t } = useTranslation();
  const showNotification = useNotification();
  const [isSelectingCheckout, setIsSelectingCheckout] = useState(false);

  // Initialize form with initialData (same logic as MiniAssertSearchWithGoogle)
  const initialFormData = useMemo(() => {
    // Primero intentar con initialData si existe
    if (initialData) {
      return {
        ...initialData,
        CheckInDate: initialData.CheckInDate ? normalizeDate(initialData.CheckInDate) : null,
        CheckOutDate: initialData.CheckOutDate ? normalizeDate(initialData.CheckOutDate) : null,
      };
    }
    // Luego intentar leer del localStorage
    const stored = localStorage.getItem('search-form-storage');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as SearchFormData;
        return {
          ...parsed,
          CheckInDate: parsed.CheckInDate ? normalizeDate(parsed.CheckInDate) : null,
          CheckOutDate: parsed.CheckOutDate ? normalizeDate(parsed.CheckOutDate) : null,
        };
      } catch {
        localStorage.removeItem('search-form-storage');
      }
    }
    return {
      CheckInDate: null,
      CheckOutDate: null,
      Guests: { adults: 0, children: 0, infants: 0, pets: 0 },
      AdtCount: 0,
      ChdCount: 0,
      InfCount: 0,
      PetsCount: 0,
      pageNumber: 1,
      pageSize: 10,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData?.CheckInDate, initialData?.CheckOutDate, initialData?.Guests?.adults]); // Dependencias específicas

  const [guests, setGuests] = useState<Guests>({ adults: 0, children: 0, infants: 0, pets: 0 });
  const totalGuests = guests.adults + guests.children;
  const [dateRange, setDateRange] = useState<
    { startDate: Date | undefined; endDate: Date | undefined; key: string }[]
  >([{ startDate: undefined, endDate: undefined, key: 'selection' }]);
  const [hasUserInteractedDates, setHasUserInteractedDates] = useState(false);

  // Synchronize state with initialFormData when it changes (same as MiniAssertSearchWithGoogle)
  useEffect(() => {
    if (initialFormData) {
      // Update dates
      const startDate = initialFormData.CheckInDate
        ? parseISO(initialFormData.CheckInDate)
        : undefined;
      const endDate = initialFormData.CheckOutDate
        ? parseISO(initialFormData.CheckOutDate)
        : undefined;

      setDateRange([
        {
          startDate: startDate && !isNaN(startDate.getTime()) ? startDate : undefined,
          endDate: endDate && !isNaN(endDate.getTime()) ? endDate : undefined,
          key: 'selection',
        },
      ]);

      const stored = localStorage.getItem('search-form-storage');
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as SearchFormData;
          setGuests(
            initialFormData.Guests
              ? {
                  adults: parsed.Guests.adults,
                  children: parsed.Guests.children,
                  infants: parsed.Guests.infants,
                  pets: parsed.Guests.pets,
                }
              : { adults: 0, children: 0, infants: 0, pets: 0 }
          );
        } catch {
          localStorage.removeItem('search-form-storage');
        }
      }
      // Update location
      const newLocationData = {
        latitude: initialFormData.Latitude || 0,
        longitude: initialFormData.Longitude || 0,
        street: initialFormData.Street,
        premise: initialFormData.AnotherLocation,
        city: initialFormData.City,
        county: initialFormData.County,
        state: initialFormData.State,
        country: initialFormData.Country,
        postalCode: initialFormData.PostalCode,
        formattedAddress: initialFormData.FormattedAddress,
      };
      setLocationData(newLocationData);

      // Use FormattedAddress if available, otherwise build from components
      const displayText = initialFormData.FormattedAddress
        ? initialFormData.FormattedAddress
        : initialFormData.Street
          ? initialFormData.Street
          : initialFormData.City
            ? `${initialFormData.City}${initialFormData.State ? ', ' + initialFormData.State : ''}${initialFormData.Country ? ', ' + initialFormData.Country : ''}`
            : initialFormData.State
              ? `${initialFormData.State}${initialFormData.Country ? ', ' + initialFormData.Country : ''}`
              : initialFormData.Country || '';

      setLocationInput(displayText);
    }
  }, [initialFormData]);

  // Google Places Autocomplete
  const handleLocationChange = useCallback(() => {
    if (!locationInputRef.current || !window.google) return;

    const autocomplete = new google.maps.places.Autocomplete(locationInputRef.current, {
      componentRestrictions: { country: 'bo' },
      types: ['geocode'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry?.location) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const location: LocationData = { latitude: lat, longitude: lng };

      for (const component of place.address_components || []) {
        const type = component.types[0];
        switch (type) {
          case 'street_number':
            location.street =
              (location.street || '') + (component.long_name ? ` ${component.long_name}` : '');
            break;
          case 'route':
            location.street =
              (location.street || '') + (component.long_name ? ` ${component.long_name}` : '');
            break;
          case 'locality':
            location.city = component.long_name;
            break;
          case 'administrative_area_level_2':
            location.county = component.long_name;
            break;
          case 'administrative_area_level_1':
            location.state = component.long_name;
            break;
          case 'country':
            location.country = component.long_name;
            break;
          case 'postal_code':
            location.postalCode = component.long_name;
            break;
          case 'premise':
            location.premise = component.long_name;
            break;
        }
      }

      location.formattedAddress = place.formatted_address || '';
      setLocationData(location);
      setLocationInput(place.formatted_address || '');

      // Auto-saltar a fechas
      setActiveSection('checkIn');
      setTimeout(() => {
        setDateAnchorEl(checkInRef.current);
      }, 100);
    });
  }, []);

  const isDateRangeValid =
    dateRange[0].startDate &&
    dateRange[0].endDate &&
    normalizeDate(dateRange[0].startDate) !== normalizeDate(dateRange[0].endDate);

  useEffect(() => {
    if (isLoaded && locationInputRef.current) {
      handleLocationChange();
    }
  }, [isLoaded, handleLocationChange]);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .pac-container {
        border-radius: 16px !important;
        box-shadow: 0 2px 16px rgba(0,0,0,0.12) !important;
        border: 1px solid #ddd !important;
        margin-top: 8px !important;
        width: 400px !important;
        min-width: 400px !important;
      }
      .pac-item {
        padding: 12px 16px !important;
        cursor: pointer !important;
        border-top: 1px solid #f0f0f0 !important;
      }
      .pac-item:first-child {
        border-top: none !important;
      }
      .pac-item:hover {
        background-color: #f7f7f7 !important;
      }
      .pac-item-query {
        font-size: 14px !important;
        color: #222 !important;
      }
      .pac-matched {
        font-weight: 600 !important;
      }
      .pac-icon {
        margin-top: 2px !important;
      }

      /* Estilos para placeholder del input */
      input::placeholder {
        color: #6B7280 !important;
        opacity: 1 !important;
        font-size: 14px !important;
      }

      /* Estilos para react-date-range */
      /* Fondo por defecto */
      .rdrCalendarWrapper {
        background: #ffffff !important;
      }

      /* Números siempre visibles en negro */
      .rdrDayNumber span {
        color: #000000 !important;
        position: relative;
        z-index: 2;
      }

      /* Días pasados (deshabilitados) en color plomo */
      .rdrDayDisabled .rdrDayNumber span {
        color: #b0b0b0 !important;
      }
      .rdrDayDisabled {
        background-color: transparent !important;
      }

      /* Días de meses adyacentes (no seleccionables) en color plomo */
      .rdrDayPassive .rdrDayNumber span {
        color: #b0b0b0 !important;
      }
      .rdrDayPassive {
        pointer-events: none !important;
      }

      /* Eliminar el indicador de la fecha actual */
      .rdrDay.rdrDayToday .rdrDayNumber span:after {
        display: none !important;
      }

      /* Permitir ver la selección normalmente */
      .rdrDay .rdrInRange,
      .rdrDay .rdrStartEdge,
      .rdrDay .rdrEndEdge,
      .rdrDay .rdrSelected {
        background: #5B4CA0 !important;
      }

      /* Números blancos cuando hay fondo negro */
      .rdrDay:not(.rdrDayPassive) .rdrInRange ~ .rdrDayNumber span,
      .rdrDay:not(.rdrDayPassive) .rdrStartEdge ~ .rdrDayNumber span,
      .rdrDay:not(.rdrDayPassive) .rdrEndEdge ~ .rdrDayNumber span,
      .rdrDay:not(.rdrDayPassive) .rdrSelected ~ .rdrDayNumber span {
        color: whitesmoke !important;
      }

      /* Animación de brillo de izquierda a derecha */
      @keyframes shine {
        0% {
          background-position: -200% center;
        }
        100% {
          background-position: 200% center;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const formatDateDisplay = (date: Date | null | undefined) => {
    if (!date) return '';
    if (typeof date === 'string') {
      return format(new Date(date), 'dd MMM', { locale: es });
    }
    if (date instanceof Date && !isNaN(date.getTime())) {
      return format(date, 'dd MMM', { locale: es });
    }
    return '';
  };

  const handleDateRangeSelect = (rangesByKey: RangeKeyDict) => {
    const range = rangesByKey.selection;

    const startDate =
      range.startDate instanceof Date && !isNaN(range.startDate.getTime())
        ? startOfDay(range.startDate)
        : undefined;

    const endDate =
      range.endDate instanceof Date && !isNaN(range.endDate.getTime())
        ? startOfDay(range.endDate)
        : undefined;

    // Primer clic (Check-In)
    if (!isSelectingCheckout) {
      setDateRange([
        {
          startDate,
          endDate,
          key: 'selection',
        },
      ]);
      setHasUserInteracted(true);

      setHasUserInteractedDates(true);
      setIsSelectingCheckout(true);
      return;
    }

    // Segundo clic (Check-Out)
    if (startDate && endDate && startDate.getTime() === endDate.getTime()) {
      showNotification(
        'error',
        t('searchMenu.searchNotification'),
        'Debes seleccionar al menos una noche.'
      );

      // Seguimos esperando el checkout
      return;
    }

    setDateRange([
      {
        startDate,
        endDate,
        key: 'selection',
      },
    ]);

    setHasUserInteractedDates(true);
    setIsSelectingCheckout(false);
  };

  const handleCloseDate = () => {
    if (!isDateRangeValid) {
      return;
    }
    setDateAnchorEl(null);
    setActiveSection(null);
  };

  const handleGuestChange = (key: keyof Guests, delta: number) => {
    setGuests((prev) => {
      let updated = { ...prev };
      const newValue = Math.max(0, prev[key] + delta);
      updated[key] = newValue;

      const hasDependents = updated.children > 0 || updated.infants > 0 || updated.pets > 0;

      // Lógica Airbnb principal
      if (hasDependents && updated.adults === 0) {
        updated.adults = 1;
      }

      // Si no hay adultos ni niños, resetear bebés y mascotas
      if (updated.adults + updated.children === 0) {
        updated.infants = 0;
        updated.pets = 0;
      }

      return updated;
    });
  };

  const totalHuespedes = guests.adults + guests.children;
  const hasDependents = guests.children > 0 || guests.infants > 0 || guests.pets > 0;

  const handleCloseGuests = () => {
    setGuestAnchorEl(null);
    setActiveSection(null);
  };

  const handleSearch = () => {
    if (locationData === null) {
      showSnackbar('Debe seleccionar una ubicación', 'error');
      return;
    }
    const totalHuespedes = guests.adults + guests.children;

    if (!hasUserInteracted || !dateRange[0].startDate || !dateRange[0].endDate) {
      showNotification(
        'error',
        t('searchMenu.searchNotification'),
        t('searchMenu.dateRequired') || 'Debes seleccionar una fecha de llegada y salida'
      );

      setActiveSection('checkin');
      setDateAnchorEl(checkInRef.current);
      return;
    }

    const checkIn = normalizeDate(dateRange[0].startDate);
    const checkOut = normalizeDate(dateRange[0].endDate);

    if (checkIn === checkOut) {
      showNotification(
        'error',
        t('searchMenu.searchNotification'),
        'Debes seleccionar al menos una noche de estadía.'
      );

      setActiveSection('checkin');
      setDateAnchorEl(checkInRef.current);
      return;
    }
    if (totalHuespedes === 0) {
      showSnackbar('Debe seleccionar por lo menos un huésped adulto', 'error');
      return;
    }
    if (!hasUserInteracted || !dateRange[0].startDate || !dateRange[0].endDate) {
      showNotification(
        'error',
        t('searchMenu.searchNotification'),
        t('searchMenu.dateRequired') || 'Debes seleccionar una fecha de llegada y salida'
      );

      setActiveSection('checkin');
      setDateAnchorEl(checkInRef.current);
      return;
    }

    // Format dates using startOfDay and format to 'yyyy-MM-dd' (same as MiniAssertSearchWithGoogle)
    const searchData: SearchFormData = {
      CheckInDate:
        dateRange[0].startDate && !isNaN(dateRange[0].startDate.getTime())
          ? format(startOfDay(dateRange[0].startDate), 'yyyy-MM-dd')
          : null,
      CheckOutDate:
        dateRange[0].endDate && !isNaN(dateRange[0].endDate.getTime())
          ? format(startOfDay(dateRange[0].endDate), 'yyyy-MM-dd')
          : null,
      Guests: guests,
      AdtCount: guests.adults > 0 ? guests.adults : undefined,
      ChdCount: guests.children > 0 ? guests.children : undefined,
      InfCount: guests.infants > 0 ? guests.infants : undefined,
      PetsCount: guests.pets > 0 ? guests.pets : undefined,
      Street: locationData?.street,
      City: locationData?.city,
      County: locationData?.county,
      State: locationData?.state,
      Country: locationData?.country,
      PostalCode: locationData?.postalCode,
      FormattedAddress: locationData?.formattedAddress,
      Latitude: locationData?.latitude,
      Longitude: locationData?.longitude,
      pageNumber: 1,
      pageSize: 10,
    };

    // Save to localStorage (same as MiniAssertSearchWithGoogle)
    try {
      localStorage.setItem('search-form-storage', JSON.stringify(searchData));
      // console.log('Saved to localStorage:', searchData);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }

    onSearch(searchData);
    setActiveSection(null);
    setDateAnchorEl(null);
    setGuestAnchorEl(null);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        alignItems: 'center',
        borderRadius: '999px',
        overflow: 'hidden',
        border: '1px solid #E5E7EB',
        backgroundColor: '#FFFFFF',
        height: '64px',
        padding: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.2s ease',
      }}
    >
      {/* Location */}
      <Box
        ref={locationRef}
        onClick={() => {
          setActiveSection('location');
          locationInputRef.current?.focus();
        }}
        sx={{
          flex: 1,
          height: '48px',
          px: '24px',
          cursor: 'pointer',
          borderRadius: '999px',
          backgroundColor: activeSection === 'location' ? '#F8F9FC' : 'transparent',
          transition: 'background-color 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          '&:hover': {
            backgroundColor: '#F8F9FC',
          },
        }}
      >
        <Box
          sx={{
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <FaRegMap
            style={{
              fontSize: '20px',
              color: activeSection === 'location' ? '#5B55C8' : '#6B7280',
            }}
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: activeSection === 'location' ? '#5B55C8' : '#6B7280',
              lineHeight: 1,
              mb: '2px',
            }}
          >
            {t('searchMenu.location')}
          </Typography>
          <input
            ref={locationInputRef}
            type="text"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            onFocus={handleLocationChange}
            placeholder={t('searchMenu.textLocation')}
            disabled={!isLoaded}
            style={{
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              fontWeight: 500,
              color: '#1F2937',
              width: '100%',
              background: 'transparent',
              fontFamily: 'inherit',
            }}
          />
        </Box>
      </Box>

      <Divider
        orientation="vertical"
        flexItem
        sx={{ my: 0, borderColor: '#E5E7EB', borderWidth: '1px' }}
      />

      {/* Check-in */}
      <Box
        ref={checkInRef}
        onClick={() => {
          setActiveSection('checkIn');
          setDateAnchorEl(checkInRef.current);
        }}
        sx={{
          flex: 1,
          height: '48px',
          px: '24px',
          cursor: 'pointer',
          borderRadius: '999px',
          backgroundColor: activeSection === 'checkIn' ? '#F8F9FC' : 'transparent',
          transition: 'background-color 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          '&:hover': {
            backgroundColor: '#F8F9FC',
          },
        }}
      >
        <Box
          sx={{
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <IoCalendarOutline
            style={{
              fontSize: '20px',
              color: activeSection === 'checkIn' ? '#5B55C8' : '#6B7280',
            }}
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: activeSection === 'checkIn' ? '#5B55C8' : '#6B7280',
              lineHeight: 1,
              mb: '2px',
            }}
          >
            {t('searchMenu.arrive')}
          </Typography>
          <Box display={'flex'}>
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 500,
                color: dateRange[0].startDate ? '#1F2937' : '#6B7280',
              }}
            >
              {dateRange[0].startDate
                ? formatDateDisplay(dateRange[0].startDate)
                : `${t('searchMenu.textArrive')}`}
            </Typography>
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 500,
                color: dateRange[0].endDate ? '#1F2937' : '#6B7280',
                ml: 1,
              }}
            >
              {dateRange[0].endDate
                ? formatDateDisplay(dateRange[0].endDate)
                : `${t('searchMenu.textDeparture')}`}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider
        orientation="vertical"
        flexItem
        sx={{ my: 0, borderColor: '#E5E7EB', borderWidth: '1px' }}
      />
      {/* Guests */}
      <Box
        ref={guestsRef}
        onClick={() => {
          setActiveSection('guests');
          setGuestAnchorEl(guestsRef.current);
        }}
        //  onMouseEnter={() => setActiveSection('guests')}
        sx={{
          flex: 1,
          height: '48px',
          px: '24px',
          cursor: 'pointer',
          borderRadius: '999px',
          backgroundColor: activeSection === 'guests' ? '#F8F9FC' : 'transparent',
          transition: 'background-color 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          '&:hover': {
            backgroundColor: '#F8F9FC',
          },
        }}
      >
        <Box
          sx={{
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <PiUsersThree
            style={{
              fontSize: '20px',
              color: activeSection === 'guests' ? '#5B55C8' : '#6B7280',
            }}
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: activeSection === 'guests' ? '#5B55C8' : '#6B7280',
              lineHeight: 1,
              mb: '2px',
            }}
          >
            {t('searchMenu.guests')}
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              color: totalGuests > 0 ? '#1F2937' : '#6B7280',
            }}
          >
            {totalHuespedes > 0
              ? `${totalHuespedes} Hp${totalHuespedes !== 1 ? 's' : ''}` +
                (guests.infants > 0
                  ? `, ${guests.infants} Bb${guests.infants !== 1 ? 's' : ''}`
                  : '') +
                (guests.pets > 0 ? `, ${guests.pets} Masc${guests.pets !== 1 ? 's' : ''}` : '')
              : t('searchMenu.guests')}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          px: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handleSearch();
          }}
          sx={{
            backgroundColor: '#5B55C8',
            color: 'white',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            '&:hover': {
              backgroundColor: '#4A45B0',
            },
          }}
        >
          <SearchIcon sx={{ fontSize: '24px' }} />
        </IconButton>
      </Box>

      {/* Date Popover */}
      <Popover
        open={openDatePopover}
        anchorEl={dateAnchorEl}
        onClose={handleCloseDate}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          '& .MuiPopover-paper': {
            marginTop: 1,
            borderRadius: '12px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
            maxWidth: 'none',
          },
        }}
      >
        <Box sx={{ p: 2, pt: 1 }}>
          <DateRange
            ranges={dateRange}
            onChange={handleDateRangeSelect}
            months={2}
            direction="horizontal"
            showDateDisplay={false}
            locale={es}
            minDate={new Date()}
            rangeColors={['#000']}
            showPreview={false}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 2,
              pt: 2,
              mr: 2,
              ml: 2,
              borderTop: '1px solid #f0f0f0',
            }}
          >
            {/* Botón Limpiar */}
            {hasUserInteractedDates && (dateRange[0].startDate || dateRange[0].endDate) && (
              <Typography
                onClick={() => {
                  setDateRange([{ startDate: new Date(), endDate: new Date(), key: 'selection' }]);
                  setHasUserInteractedDates(false);
                }}
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
            )}

            {/* Botón Continuar */}
            {hasUserInteractedDates && dateRange[0].startDate && dateRange[0].endDate && (
              <Button
                variant="primary"
                disabled={!isDateRangeValid}
                onClick={() => {
                  setDateAnchorEl(null);
                  setTimeout(() => {
                    setActiveSection('guests');
                    setGuestAnchorEl(guestsRef.current);
                  }, 100);
                }}
                sx={{
                  opacity: isDateRangeValid ? 1 : 0.5,
                  pointerEvents: isDateRangeValid ? 'auto' : 'none',
                }}
              >
                {t('searchMenu.buttonDate')}
              </Button>
            )}
          </Box>
        </Box>
      </Popover>

      {/* Guests Popover */}
      <Popover
        open={openGuestsPopover}
        anchorEl={guestAnchorEl}
        onClose={handleCloseGuests}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiPopover-paper': {
            marginTop: 1,
            borderRadius: '12px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
            width: '400px',
            overflow: 'visible',
          },
        }}
      >
        <div
          ref={guestsPopoverRef}
          onMouseEnter={() => {
            // Al entrar al popover, mantenemos abierto
            if (guestAnchorEl) {
              setGuestAnchorEl(guestsRef.current);
            }
          }}
          onMouseLeave={() => {
            // Al salir del popover, cerramos
            setGuestAnchorEl(null);
            setActiveSection(null);
          }}
        >
          <Box sx={{ p: 3 }}>
            {/* Adultos */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: '16px' }}>
                  {t('searchMenu.adults')}
                </Typography>
                <Typography sx={{ fontSize: '14px', color: '#717171' }}>
                  {t('searchMenu.ageAdults')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                  onClick={() => handleGuestChange('adults', -1)}
                  //disabled={guests.adults === 0}
                  disabled={guests.adults === 0 || (guests.adults === 1 && hasDependents)}
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
                    minWidth: '20px',
                    textAlign: 'center',
                    fontFamily: theme.typography.h5Bold,
                    color: theme.palette.customColors.primary[1],
                  }}
                >
                  {guests.adults}
                </Typography>
                <IconButton
                  onClick={() => handleGuestChange('adults', 1)}
                  disabled={guests.adults + guests.children >= 18}
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

            <Divider sx={{ my: 2 }} />

            {/* Niños */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: '16px' }}>
                  {t('searchMenu.children')}
                </Typography>
                <Typography sx={{ fontSize: '14px', color: '#717171' }}>
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
                    minWidth: '20px',
                    textAlign: 'center',
                    fontFamily: theme.typography.h5Bold,
                    color: theme.palette.customColors.primary[1],
                  }}
                >
                  {guests.children}
                </Typography>
                <IconButton
                  onClick={() => handleGuestChange('children', 1)}
                  disabled={guests.adults + guests.children >= 18}
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

            <Divider sx={{ my: 2 }} />

            {/* Bebés */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: '16px' }}>
                  {t('searchMenu.babies')}
                </Typography>
                <Typography sx={{ fontSize: '14px', color: '#717171' }}>
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
                    minWidth: '20px',
                    textAlign: 'center',
                    fontFamily: theme.typography.h5Bold,
                    color: theme.palette.customColors.primary[1],
                  }}
                >
                  {guests.infants}
                </Typography>
                <IconButton
                  onClick={() => handleGuestChange('infants', 1)}
                  // disabled={guests.adults + guests.children < 1}
                  disabled={false}
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

            <Divider sx={{ my: 2 }} />

            {/* Mascotas */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: '16px' }}>
                  {t('searchMenu.pets')}
                </Typography>
                <Typography sx={{ fontSize: '14px', color: '#717171' }}>
                  {t('searchMenu.textPets')}
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
                    minWidth: '20px',
                    textAlign: 'center',
                    fontFamily: theme.typography.h5Bold,
                    color: theme.palette.customColors.primary[1],
                  }}
                >
                  {guests.pets}
                </Typography>
                <IconButton
                  onClick={() => handleGuestChange('pets', 1)}
                  // disabled={guests.adults + guests.children < 1}
                  disabled={false}
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
          </Box>
        </div>
      </Popover>
    </Paper>
  );
};

export default SearchResultsBar;
