import { useSnackbar } from '@/context/SnackbarContext';
import theme from '@/themes/theme';
import { normalizeDate } from '@/utilities/dateUtils';
import { Add as AddIcon, Remove as RemoveIcon, Search as SearchIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Popover,
  Typography,
  useMediaQuery,
} from '@mui/material';
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

const SearchResultsBarJom: React.FC<SearchResultsBarProps> = ({
  onSearch,
  initialData,
  isLoaded,
}) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [dateAnchorEl, setDateAnchorEl] = useState<null | HTMLElement>(null);
  const [guestAnchorEl, setGuestAnchorEl] = useState<null | HTMLElement>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const isMobile = useMediaQuery(theme.breakpoints.up('lg'));
  const [locationInput, setLocationInput] = useState('');
  const guestsPopoverRef = useRef<HTMLDivElement>(null);

  const locationRef = useRef<HTMLDivElement>(null);
  const checkInRef = useRef<HTMLDivElement>(null);
  const checkOutRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);
  const locationInputRef = useRef<HTMLInputElement | null>(null);

  const openGuestsPopover = Boolean(guestAnchorEl);
  const openDatePopover = Boolean(dateAnchorEl);

  const showSnackbar = useSnackbar();
  const { t } = useTranslation();

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

      // console.log('📅 Parsed dates:', {
      //   CheckInDate: initialFormData.CheckInDate,
      //   CheckOutDate: initialFormData.CheckOutDate,
      //   startDate,
      //   endDate,
      //   startDateValid: startDate && !isNaN(startDate.getTime()),
      //   endDateValid: endDate && !isNaN(endDate.getTime()),
      // });

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
                  adults: parsed.Guests.adults, //initialFormData.Guests.adults,
                  children: initialFormData.Guests.children,
                  infants: initialFormData.Guests.infants,
                  pets: initialFormData.Guests.pets,
                }
              : { adults: 0, children: 0, infants: 0, pets: 0 }
          );
        } catch {
          localStorage.removeItem('search-form-storage');
        }
      }

      // Update guests
      //  setGuests(initialFormData.Guests || { adults: 0, children: 0, infants: 0, pets: 0 });
      // setGuests(
      //   initialFormData.Guests
      //     ? {
      //         adults: stored.Guests.adults, //initialFormData.Guests.adults,
      //         children: initialFormData.Guests.children,
      //         infants: initialFormData.Guests.infants,
      //         pets: initialFormData.Guests.pets,
      //       }
      //     : { adults: 0, children: 0, infants: 0, pets: 0 }
      // );

      // Update location
      const newLocationData = {
        latitude: initialFormData.Latitude || 0,
        longitude: initialFormData.Longitude || 0,
        street: initialFormData.Street,
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
        width: 300px !important;
        min-width: 300px !important;
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
      .location-input::placeholder {
        color: #6B7280 !important;
        opacity: 1 !important;
        font-size: 14px !important;
      }

      /* Estilos para react-date-range - Airbnb Style */
      .airbnb-calendar {
        --airbnb-text: #222222;
        --airbnb-muted: #6a6a6a;
        --airbnb-range: #d6d6d6;
        --airbnb-selected: #222222;
      }

      .airbnb-calendar .rdrDateRangeWrapper,
      .airbnb-calendar .rdrCalendarWrapper,
      .airbnb-calendar .rdrMonth {
        background: #ffffff !important;
        color: var(--airbnb-text) !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
      }

      .airbnb-calendar .rdrMonths {
        display: 'flex !important';
        justify-content: 'center !important';
        gap: 44px !important;
      }

      .airbnb-calendar .rdrMonth {
        width: 348px !important;
        padding: 0 !important;
      }

      .airbnb-calendar .rdrMonthAndYearWrapper {
        height: auto !important;
        padding: 8px 0 18px !important;
      }

      .airbnb-calendar .rdrMonthAndYearPickers {
        justify-content: center !important;
      }

      .airbnb-calendar .rdrMonthPicker,
      .airbnb-calendar .rdrYearPicker {
        flex: 0 0 auto !important;
      }

      .airbnb-calendar .rdrMonthAndYearPickers select {
        padding: 0 !important;
        border: 0 !important;
        background: transparent !important;
        color: var(--airbnb-text) !important;
        font-size: 16px !important;
        font-weight: 600 !important;
        text-align: center !important;
        appearance: none !important;
        pointer-events: none !important;
      }

      .airbnb-calendar .rdrNextPrevButton {
        width: 32px !important;
        height: 32px !important;
        margin: 0 !important;
        border: none !important;
        border-radius: 999px !important;
        background: transparent !important;
        box-shadow: none !important;
      }

      .airbnb-calendar .rdrNextPrevButton:hover {
        background: #f7f7f7 !important;
      }

      .airbnb-calendar .rdrPprevButton i {
        border-width: 5px 7px 5px 0 !important;
        border-color: transparent var(--airbnb-text) transparent transparent !important;
      }

      .airbnb-calendar .rdrNextButton i {
        border-width: 5px 0 5px 7px !important;
        border-color: transparent transparent transparent var(--airbnb-text) !important;
      }

      .airbnb-calendar .rdrDayNames {
        padding: 0 !important;
        margin-bottom: 10px !important;
      }

      .airbnb-calendar .rdrDayName {
        height: 28px !important;
        color: var(--airbnb-muted) !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        letter-spacing: 0 !important;
        text-transform: uppercase !important;
      }

      .airbnb-calendar .rdrWeeks {
        padding: 0 !important;
      }

      .airbnb-calendar .rdrWeek {
        gap: 0 !important;
      }

      .airbnb-calendar .rdrDay {
        height: 60px !important;
      }

      .airbnb-calendar .rdrDayNumber {
        top: 9px !important;
        bottom: 9px !important;
        left: 0 !important;
        right: 0 !important;
        font-size: 14px !important;
        font-weight: 500 !important;
      }

      .airbnb-calendar .rdrDayNumber span {
        color: var(--airbnb-text) !important;
        position: relative !important;
        z-index: 3 !important;
      }

      .airbnb-calendar .rdrDayToday .rdrDayNumber span:after {
        display: none !important;
      }

      .airbnb-calendar .rdrInRange,
      .airbnb-calendar .rdrStartEdge,
      .airbnb-calendar .rdrEndEdge,
      .airbnb-calendar .rdrSelected {
        top: 9px !important;
        bottom: 9px !important;
      }

      .airbnb-calendar .rdrInRange {
        background: var(--airbnb-range) !important;
        left: 0 !important;
        right: 0 !important;
      }

      .airbnb-calendar .rdrDayStartOfMonth .rdrInRange,
      .airbnb-calendar .rdrDayStartOfWeek .rdrInRange,
      .airbnb-calendar .rdrDayStartOfMonth .rdrEndEdge,
      .airbnb-calendar .rdrDayStartOfWeek .rdrEndEdge {
        left: 10px !important;
        border-top-left-radius: 999px !important;
        border-bottom-left-radius: 999px !important;
      }

      .airbnb-calendar .rdrDayEndOfMonth .rdrInRange,
      .airbnb-calendar .rdrDayEndOfWeek .rdrInRange,
      .airbnb-calendar .rdrDayEndOfMonth .rdrStartEdge,
      .airbnb-calendar .rdrDayEndOfWeek .rdrStartEdge {
        right: 10px !important;
        border-top-right-radius: 999px !important;
        border-bottom-right-radius: 999px !important;
      }

      .airbnb-calendar .rdrStartEdge,
      .airbnb-calendar .rdrEndEdge,
      .airbnb-calendar .rdrSelected {
        background: var(--airbnb-selected) !important;
        width: 42px !important;
        height: 42px !important;
        top: 50% !important;
        bottom: auto !important;
        left: 50% !important;
        right: auto !important;
        transform: translate(-50%, -50%) !important;
        border-radius: 50% !important;
        z-index: 2 !important;
      }

      .airbnb-calendar .rdrStartEdge::after,
      .airbnb-calendar .rdrEndEdge::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        background: var(--airbnb-range);
        z-index: -1;
      }

      .airbnb-calendar .rdrStartEdge::after {
        left: calc(50% - 1px);
        right: -10px;
      }

      .airbnb-calendar .rdrEndEdge::before {
        left: -10px;
        right: calc(50% - 1px);
      }

      .airbnb-calendar .rdrDayEndOfMonth .rdrStartEdge::after,
      .airbnb-calendar .rdrDayEndOfWeek .rdrStartEdge::after {
        right: 0;
        border-top-right-radius: 999px;
        border-bottom-right-radius: 999px;
      }

      .airbnb-calendar .rdrDayStartOfMonth .rdrEndEdge::before,
      .airbnb-calendar .rdrDayStartOfWeek .rdrEndEdge::before {
        left: 0;
        border-top-left-radius: 999px;
        border-bottom-left-radius: 999px;
      }

      .airbnb-calendar .rdrSelected::before,
      .airbnb-calendar .rdrSelected::after {
        display: none !important;
      }

      .airbnb-calendar .rdrDay:not(.rdrDayPassive) .rdrStartEdge ~ .rdrDayNumber span,
      .airbnb-calendar .rdrDay:not(.rdrDayPassive) .rdrEndEdge ~ .rdrDayNumber span,
      .airbnb-calendar .rdrDay:not(.rdrDayPassive) .rdrSelected ~ .rdrDayNumber span {
        color: #ffffff !important;
      }

      .airbnb-calendar .rdrDayPassive .rdrDayNumber span {
        color: #d0d0d0 !important;
      }

      .airbnb-calendar .rdrDayPassive,
      .airbnb-calendar .rdrDayDisabled {
        opacity: 1 !important;
      }

      .airbnb-calendar .rdrDayPassive .rdrInRange,
      .airbnb-calendar .rdrDayPassive .rdrStartEdge,
      .airbnb-calendar .rdrDayPassive .rdrEndEdge,
      .airbnb-calendar .rdrDayDisabled .rdrInRange,
      .airbnb-calendar .rdrDayDisabled .rdrStartEdge,
      .airbnb-calendar .rdrDayDisabled .rdrEndEdge {
        display: none !important;
      }

      .airbnb-calendar .rdrCalendarSeparator {
        width: 0 !important;
        opacity: 0 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const formatDateDisplay = (date: Date | null | undefined) => {
    console.log(
      '🎨 formatDateDisplay called with:',
      date,
      'isDate:',
      date instanceof Date,
      'isValid:',
      date instanceof Date && !isNaN(date.getTime())
    );
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
    // Use startOfDay to normalize dates (same as MiniAssertSearchWithGoogle)
    const startDate =
      range.startDate instanceof Date && !isNaN(range.startDate.getTime())
        ? startOfDay(range.startDate)
        : undefined;
    const endDate =
      range.endDate instanceof Date && !isNaN(range.endDate.getTime())
        ? startOfDay(range.endDate)
        : undefined;
    setDateRange([{ startDate, endDate, key: 'selection' }]);
    setHasUserInteractedDates(true);
  };

  const handleCloseDate = () => {
    setDateAnchorEl(null);
    setActiveSection(null);
  };

  const handleGuestChange = (key: keyof Guests, count: number) => {
    console.log(guests);
    setGuests((prev) => {
      const newValue = Math.max(0, prev[key] + count);
      let updated = { ...prev, [key]: newValue };
      // Si la suma de adultos + niños es 0, infants y pets deben ser 0
      if ((key === 'adults' || key === 'children') && updated.adults + updated.children === 0) {
        updated.infants = 0;
        updated.pets = 0;
      }
      console.log('Valor original:', prev[key]); // Valor original antes de la modificación
      console.log('Nuevo valor:', newValue); // Nuevo valor después de la modificación
      return updated;
    });
  };

  const handleCloseGuests = () => {
    setGuestAnchorEl(null);
    setActiveSection(null);
  };

  const handleSearch = () => {
    if (locationData === null) {
      showSnackbar('Debe seleccionar una ubicación', 'error');
      return;
    }
    if (guests.adults == 0 && guests.children == 0) {
      showSnackbar('Debe seleccionar por lo menos un huésped adulto', 'error');
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
      console.log('Saved to localStorage:', searchData);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }

    onSearch(searchData);
    setActiveSection(null);
    setDateAnchorEl(null);
    setGuestAnchorEl(null);
  };

  console.log(
    '🔄 SearchResultsBar RENDER - dateRange:',
    dateRange,
    'startDate:',
    dateRange[0]?.startDate,
    'endDate:',
    dateRange[0]?.endDate
  );

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
        {isMobile && (
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
        )}
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
        {isMobile && (
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
        )}
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
        </Box>
      </Box>

      <Divider
        orientation="vertical"
        flexItem
        sx={{ my: 0, borderColor: '#E5E7EB', borderWidth: '1px' }}
      />

      {/* Check-out */}
      <Box
        ref={checkOutRef}
        onClick={() => {
          setActiveSection('checkOut');
          setDateAnchorEl(checkOutRef.current);
        }}
        sx={{
          flex: 1,
          height: '48px',
          px: '24px',
          cursor: 'pointer',
          borderRadius: '999px',
          backgroundColor: activeSection === 'checkOut' ? '#F8F9FC' : 'transparent',
          transition: 'background-color 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          '&:hover': {
            backgroundColor: '#F8F9FC',
          },
        }}
      >
        {isMobile && (
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
                color: activeSection === 'checkOut' ? '#5B55C8' : '#6B7280',
              }}
            />
          </Box>
        )}
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: activeSection === 'checkOut' ? '#5B55C8' : '#6B7280',
              lineHeight: 1,
              mb: '2px',
            }}
          >
            {t('searchMenu.departure')}
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              color: dateRange[0].endDate ? '#1F2937' : '#6B7280',
            }}
          >
            {dateRange[0].endDate
              ? formatDateDisplay(dateRange[0].endDate)
              : `${t('searchMenu.textDeparture')}`}
          </Typography>
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
        onMouseEnter={() => setActiveSection('guests')}
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
        {isMobile && (
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
        )}
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
            {totalGuests > 0
              ? `${totalGuests} Adt${totalGuests !== 1 ? '' : ''}${
                  guests.infants > 0
                    ? `, ${guests.infants} Bb${guests.infants !== 1 ? '' : ''}`
                    : ''
                }${guests.pets > 0 ? `, ${guests.pets} Masc${guests.pets !== 1 ? '' : ''}` : ''}`
              : `${t('searchMenu.guests')}`}
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
          {/* <DateRange
            ranges={dateRange}
            onChange={handleDateRangeSelect}
            months={2}
            direction="horizontal"
            showDateDisplay={false}
            locale={es}
            minDate={new Date()}
            rangeColors={['#000']}
            showPreview={false}
          /> */}
          <Box
            className={dateRange[0].startDate && dateRange[0].endDate ? 'dates-selected' : ''}
            sx={{
              '& .rdrCalendarWrapper': {
                fontFamily: 'inherit',
                color: '#222222',
              },
              '& .rdrMonths': {
                display: 'flex !important',
                gap: '20px !important', // Espacio entre los dos meses (ajústalo según necesites)
              },

              '& .rdrMonth': {
                width: '386px !important',
                padding: '0 !important',
              },

              '& .rdrMonthName': {
                color: '#222222',
                fontWeight: 600,
                fontSize: '16px',
                textAlign: 'center',
              },
              '& .rdrWeekDay': {
                color: '#717171',
                fontWeight: 600,
                fontSize: '12px',
                textTransform: 'uppercase',
              },
              '& .rdrDay': {
                height: '52px',
              },
              '& .rdrDayNumber': {
                top: '-1px',
                right: '-3px',
                bottom: '4px',
                left: '-1px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 500,
                fontSize: '14px',
                color: '#222222',
                position: 'relative',
                zIndex: 3,
              },
              '& .rdrDayNumber span': {
                color: '#222222 !important',
              },
              '& .rdrDayPassive .rdrDayNumber span': {
                color: '#D4D4D4 !important',
              },
              '& .rdrInRange': {
                top: '1px !important',
                bottom: '1px !important',
                left: '-20px !important',
                right: '-20px !important',
                background: '#C8C8C8 !important',
                color: '#C8C8C8 !important',
              },
              '& .rdrDayStartOfMonth .rdrInRange, & .rdrDayStartOfWeek .rdrInRange': {
                left: '0px !important',
                borderTopLeftRadius: '999px',
                borderBottomLeftRadius: '999px',
              },
              '& .rdrDayEndOfMonth .rdrInRange, & .rdrDayEndOfWeek .rdrInRange': {
                right: '0px !important',
                borderTopRightRadius: '999px',
                borderBottomRightRadius: '999px',
              },
              '& .rdrStartEdge, & .rdrEndEdge': {
                top: '1px !important',
                bottom: '1px !important',
                left: '0px !important',
                right: '0px !important',
                background: '#222222 !important',
                border: 'none !important',
                borderRadius: '50% !important',
                zIndex: '1 !important',
                width: 'auto !important',
                height: 'auto !important',
                transform: 'none !important',
              },
              '& .rdrDay:not(.rdrDayPassive) .rdrStartEdge ~ .rdrDayNumber span, & .rdrDay:not(.rdrDayPassive) .rdrEndEdge ~ .rdrDayNumber span':
                {
                  color: '#ffffff !important',
                },
              '& .rdrDayHovered': {
                border: 'none !important',
                backgroundColor: 'transparent !important',
              },
              '& .rdrDayStartPreview': {
                background: 'transparent !important',
                border: 'none !important',
              },
              '& .rdrDayInPreview': {
                top: '1px !important',
                bottom: '1px !important',
                left: '-20px !important',
                right: '-20px !important',
                background: '#C8C8C8 !important',
                border: 'none !important',
              },
              '& .rdrDayEndPreview': {
                top: '1px !important',
                bottom: '1px !important',
                left: '0px !important',
                right: '0px !important',
                background: '#222222 !important',
                border: 'none !important',
                borderRadius: '50% !important',
                zIndex: '1 !important',
              },
              '& .rdrDay:not(.rdrDayPassive) .rdrDayEndPreview ~ .rdrDayNumber span': {
                color: '#ffffff !important',
              },
              '& .rdrDayStartOfMonth .rdrDayInPreview, & .rdrDayStartOfWeek .rdrDayInPreview': {
                left: '0px !important',
                borderTopLeftRadius: '999px',
                borderBottomLeftRadius: '999px',
              },
              '& .rdrDayEndOfMonth .rdrDayInPreview, & .rdrDayEndOfWeek .rdrDayInPreview': {
                right: '0px !important',
                borderTopRightRadius: '999px',
                borderBottomRightRadius: '999px',
              },
            }}
          >
            <DateRange
              ranges={dateRange}
              onChange={handleDateRangeSelect}
              months={2}
              direction="horizontal"
              showDateDisplay={false}
              locale={es}
              minDate={new Date()}
              rangeColors={['#C8C8C8']}
              showPreview={true}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 2,
              pt: 2,
              borderTop: '1px solid #f0f0f0',
            }}
          >
            {/* Botón Limpiar */}
            {hasUserInteractedDates && (dateRange[0].startDate || dateRange[0].endDate) && (
              <Typography
                onClick={() => {
                  //setDateRange([{ startDate: undefined, endDate: undefined, key: 'selection' }]);
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
                onClick={() => {
                  setDateAnchorEl(null);
                  setTimeout(() => {
                    setActiveSection('guests');
                    setGuestAnchorEl(guestsRef.current);
                  }, 100);
                }}
              >
                {t('searchMenu.buttonDate')}
                {/* <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                </Typography> */}
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
          </Box>
        </div>
      </Popover>
    </Paper>
  );
};

export default SearchResultsBarJom;
