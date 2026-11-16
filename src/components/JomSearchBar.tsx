import assertEnv from '@/config/env';
import { useNotification } from '@/context/NotificationContext';
import theme from '@/themes/theme';
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
import { useLoadScript } from '@react-google-maps/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEffect, useRef, useState } from 'react';
import { DateRange, Range, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { IoCalendarOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';

type LocationData = {
  latitude: number;
  longitude: number;
  country?: string;
  state?: string;
  county?: string;
  city?: string;
  street?: string;
  postalCode?: string;
  formattedAddress?: string;
};

interface Guests {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

interface SearchFormData {
  Street?: string;
  City?: string;
  County?: string;
  State?: string;
  Country?: string;
  PostalCode?: string;
  Latitude?: number;
  Longitude?: number;
  FormattedAddress?: string;
  CheckInDate?: Date | null;
  CheckOutDate?: Date | null;
  PropertyTypeId?: number | null;
  Guests: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  };
  pageNumber?: number;
  pageSize?: number;
}

const JomSearchBar = () => {
  const navigate = useNavigate();
  const showNotification = useNotification();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [dateAnchorEl, setDateAnchorEl] = useState<null | HTMLElement>(null);
  const [guestAnchorEl, setGuestAnchorEl] = useState<null | HTMLElement>(null);
  const [categoryAnchorEl, setCategoryAnchorEl] = useState<null | HTMLElement>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [locationInput, setLocationInput] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const checkInRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);
  const guestsAreaRef = useRef<HTMLDivElement | null>(null);
  const guestsPopoverRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const locationInputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const openGuestsPopover = Boolean(guestAnchorEl);
  const openDatePopover = Boolean(dateAnchorEl);
  const openCategoryPopover = Boolean(categoryAnchorEl);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [guests, setGuests] = useState<Guests>({ adults: 0, children: 0, infants: 0, pets: 0 });
  const totalGuests = guests.adults + guests.children;
  //const isMobile = useMediaQuery(theme.breakpoints.up('lg'));
  const [dateRange, setDateRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const { setValue, reset } = useForm<SearchFormData>({
    defaultValues: {
      Street: undefined,
      City: undefined,
      County: undefined,
      State: undefined,
      Country: undefined,
      PostalCode: undefined,
      Latitude: undefined,
      Longitude: undefined,
      CheckInDate: null,
      CheckOutDate: null,
      Guests: { adults: 0, children: 0, infants: 0, pets: 0 },
      pageNumber: 1,
      pageSize: 10,
    },
  });

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: assertEnv.VITE_KEY_SEARCH_GOOGLE,
    libraries: ['places'],
    language: 'es',
  });

  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    if (!locationInputRef.current) return;

    const timer = setTimeout(() => {
      locationInputRef.current?.focus();
    }, 0);

    return () => clearTimeout(timer);
  }, [isLoaded]);

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

  useEffect(() => {
    setValue('Street', locationData?.street);
    setValue('City', locationData?.city);
    setValue('County', locationData?.county);
    setValue('State', locationData?.state);
    setValue('Country', locationData?.country);
    setValue('PostalCode', locationData?.postalCode);
    setValue('Latitude', locationData?.latitude);
    setValue('Longitude', locationData?.longitude);
    setValue('CheckInDate', dateRange[0].startDate);
    setValue('CheckOutDate', dateRange[0].endDate);
    setValue('Guests', guests);
  }, [locationData, dateRange, guests, setValue]);

  // Inicializar Google Places Autocomplete
  useEffect(() => {
    if (!isLoaded || !locationInputRef.current || autocompleteRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(locationInputRef.current, {
      componentRestrictions: { country: 'bo' }, // Restringir búsqueda solo a Bolivia
      types: ['geocode'], // Opcional: solo direcciones geográficas
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
      localStorage.setItem('locationData', JSON.stringify(location));

      setActiveSection('checkin');
      setTimeout(() => {
        setDateAnchorEl(checkInRef.current);
      }, 100);
    });

    autocompleteRef.current = autocomplete;
  }, [isLoaded]);

  const formatDate = (date: Date | null | undefined, forDisplay: boolean = false) => {
    if (!date) return '';
    if (typeof date === 'string') {
      return forDisplay
        ? format(new Date(date), 'dd MMM', { locale: es })
        : new Date(date).toISOString().split('T')[0];
    }
    if (date instanceof Date && !isNaN(date.getTime())) {
      return forDisplay ? format(date, 'dd MMM', { locale: es }) : format(date, 'yyyy-MM-dd');
    }
    return '';
  };

  const handleDateRangeSelect = (rangesByKey: RangeKeyDict) => {
    const range = rangesByKey.selection;
    const newDateRange = [
      {
        startDate: range.startDate instanceof Date ? range.startDate : undefined,
        endDate: range.endDate instanceof Date ? range.endDate : undefined,
        key: 'selection',
      },
    ];
    setDateRange(newDateRange);
    setHasUserInteracted(true);
  };

  const handleGuestChange = (key: keyof Guests, count: number) => {
    // console.log(guests);
    setGuests((prev) => {
      const newValue = Math.max(0, prev[key] + count);
      let updated = { ...prev, [key]: newValue };
      if ((key === 'adults' || key === 'children') && updated.adults + updated.children === 0) {
        updated.infants = 0;
        updated.pets = 0;
      }
      // console.log('Valor original:', prev[key]);
      // console.log('Nuevo valor:', newValue);
      return updated;
    });
  };

  const onSubmit = () => {
    if (locationData === null) {
      showNotification(
        'error',
        t('searchMenu.searchNotification'),
        t('searchMenu.locationRequired')
      );
      return;
    }
    if (guests.adults == 0 && guests.children == 0) {
      showNotification('error', t('searchMenu.searchNotification'), t('searchMenu.guestRequired'));
      return;
    }

    const formData: SearchFormData = {
      Street: locationData?.street,
      City: locationData?.city,
      County: locationData?.county,
      State: locationData?.state,
      Country: locationData?.country,
      PostalCode: locationData?.postalCode,
      Latitude: locationData?.latitude,
      Longitude: locationData?.longitude,
      FormattedAddress: locationData?.formattedAddress,
      CheckInDate: dateRange[0].startDate,
      CheckOutDate: dateRange[0].endDate,
      Guests: guests,
      pageNumber: 1,
      pageSize: 10,
    };

    const params = new URLSearchParams();
    if (formData.Street) params.set('Street', formData.Street);
    if (formData.City) params.set('City', formData.City);
    if (formData.County) params.set('County', formData.County);
    if (formData.State) params.set('State', formData.State);
    if (formData.Country) params.set('Country', formData.Country);
    if (formData.PostalCode) params.set('PostalCode', formData.PostalCode);
    if (formData.Latitude) params.set('Latitude', formData.Latitude.toString());
    if (formData.Longitude) params.set('Longitude', formData.Longitude.toString());
    if (formData.PropertyTypeId) params.set('PropertyTypeId', formData.PropertyTypeId.toString());
    if (formData.CheckInDate) params.set('checkIn', formatDate(formData.CheckInDate, false));
    if (formData.CheckOutDate) params.set('checkOut', formatDate(formData.CheckOutDate, false));
    if (formData.Guests) {
      const totalGuests = formData.Guests.adults + formData.Guests.children;
      if (totalGuests > 0) params.set('guests', totalGuests.toString());
    }

    localStorage.setItem('search-form-storage', JSON.stringify(formData));

    reset({
      Street: undefined,
      City: undefined,
      County: undefined,
      State: undefined,
      Country: undefined,
      PostalCode: undefined,
      Latitude: undefined,
      Longitude: undefined,
      CheckInDate: null,
      CheckOutDate: null,
      Guests: { adults: 0, children: 0, infants: 0, pets: 0 },
      pageNumber: 1,
      pageSize: 10,
    });
    setLocationData(null);
    setLocationInput('');
    setGuests({ adults: 0, children: 0, infants: 0, pets: 0 });
    setDateRange([{ startDate: new Date(), endDate: new Date(), key: 'selection' }]);
    setHasUserInteracted(false);
    setGuestAnchorEl(null);
    setCategoryAnchorEl(null);
    setDateAnchorEl(null);
    setActiveSection(null);
    localStorage.removeItem('locationData');

    navigate(`/search-results?${params.toString()}`);
  };

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (!guestsAreaRef.current) return;

      const rect = guestsAreaRef.current.getBoundingClientRect();
      const { clientX, clientY } = e;

      const isOutside =
        clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom;

      if (isOutside && openGuestsPopover) {
        setGuestAnchorEl(null);
        setActiveSection(null);
      }
    };

    if (openGuestsPopover) {
      document.addEventListener('mousemove', handleMouseLeave);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseLeave);
    };
  }, [openGuestsPopover]);

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          justifyContent: 'center',
          width: '100%',
          pt: 0,
          pb: 0,
        }}
      >
        <Box
          sx={{
            width: '100%',
            borderRadius: '26px',
            padding: '20px 40px 20px 40px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            ref={searchBarRef}
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: '999px',
              border: '1px solid #E5E7EB',
              bgcolor: '#FFFFFF',
              overflow: 'hidden',
              maxWidth: '900px',
              width: '100%',
              height: '64px',
              padding: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition:
                'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <Box
              ref={locationRef}
              onClick={() => setActiveSection('location')}
              sx={{
                flex: 1,
                height: '48px',
                px: '24px',
                cursor: 'pointer',
                borderRadius: '999px',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                '&:hover': {
                  bgcolor: '#F8F9FC',
                },
                ...(activeSection === 'location' && {
                  bgcolor: '#F8F9FC',
                }),
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
                <FmdGoodOutlinedIcon
                  style={{
                    fontSize: '20px',
                    color: activeSection === 'location' ? '#5B55C8' : '#6B7280',
                  }}
                />
              </Box>

              <Box sx={{ flex: 1, textAlign: 'left' }}>
                <Typography
                  sx={{
                    fontSize: '10px',
                    fontWeight: 700,
                    textAlign: 'left',
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
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder={t('searchMenu.textLocation')}
                  disabled={!isLoaded}
                  className="location-input"
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#1F2937',
                    backgroundColor: 'transparent',
                    width: '100%',
                    fontFamily: 'inherit',
                    textAlign: 'left',
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
                setActiveSection('checkin');
                setDateAnchorEl(checkInRef.current);
              }}
              sx={{
                flex: 1,
                height: '48px',
                px: '24px',
                cursor: 'pointer',
                borderRadius: '999px',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                '&:hover': {
                  bgcolor: '#F8F9FC',
                },
                ...(activeSection === 'checkin' && {
                  bgcolor: '#F8F9FC',
                }),
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
                    color: activeSection === 'checkin' ? '#5B55C8' : '#6B7280',
                  }}
                />
              </Box>
              <Box sx={{ flex: 1, textAlign: 'left' }}>
                <Typography
                  sx={{
                    fontSize: '10px',
                    fontWeight: 700,
                    mb: '2px',
                    textAlign: 'left',
                    textTransform: 'uppercase',
                    color: activeSection === 'checkin' ? '#5B55C8' : '#6B7280',
                    lineHeight: 1,
                  }}
                >
                  {t('searchMenu.arrive')}
                </Typography>
                <Box display={'flex'}>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: hasUserInteracted && dateRange[0].startDate ? '#1F2937' : '#6B7280',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      textAlign: 'left',
                    }}
                  >
                    {hasUserInteracted && dateRange[0].startDate
                      ? `${formatDate(dateRange[0].startDate, true)},`
                      : `${t('searchMenu.textArrive')}`}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: hasUserInteracted && dateRange[0].endDate ? '#1F2937' : '#6B7280',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      textAlign: 'left',
                      ml: 1,
                    }}
                  >
                    {hasUserInteracted && dateRange[0].endDate
                      ? ` ${formatDate(dateRange[0].endDate, true)}`
                      : ''}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* <Divider
              orientation="vertical"
              flexItem
              sx={{ my: 0, borderColor: '#E5E7EB', borderWidth: '1px' }}
            /> */}

            {/* Check-out */}

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
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                '&:hover': {
                  bgcolor: '#F8F9FC',
                },
                ...(activeSection === 'guests' && {
                  bgcolor: '#F8F9FC',
                }),
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
                <PeopleAltOutlinedIcon
                  style={{
                    fontSize: '20px',
                    color: activeSection === 'guests' ? '#5B55C8' : '#6B7280',
                  }}
                />
              </Box>
              <Box sx={{ flex: 1, textAlign: 'left' }}>
                <Typography
                  sx={{
                    fontSize: '10px',
                    fontWeight: 700,
                    mb: '2px',
                    textAlign: 'left',
                    textTransform: 'uppercase',
                    color: activeSection === 'guests' ? '#5B55C8' : '#6B7280',
                    lineHeight: 1,
                  }}
                >
                  {t('searchMenu.guests')}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: totalGuests > 0 ? '#1F2937' : '#6B7280',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    textAlign: 'left',
                  }}
                >
                  {totalGuests > 0
                    ? `${totalGuests} Adt${totalGuests !== 1 ? '' : ''}${
                        guests.infants > 0
                          ? `, ${guests.infants} Bb${guests.infants !== 1 ? '' : ''}`
                          : ''
                      }${guests.pets > 0 ? `, ${guests.pets} Masc${guests.pets !== 1 ? '' : ''}` : ''}`
                    : `${t('searchMenu.textGuests')}`}
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
                ref={searchButtonRef}
                onClick={(e) => {
                  e.stopPropagation();
                  onSubmit();
                }}
                tabIndex={0}
                aria-label="Buscar alojamientos"
                sx={{
                  backgroundColor: '#5B55C8',
                  color: 'white',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  '&:hover': {
                    backgroundColor: '#4A45B0',
                  },
                  '&:focus-visible': {
                    outline: '2px solid #5B55C8',
                    outlineOffset: '2px',
                  },
                }}
              >
                <SearchIcon sx={{ fontSize: '24px' }} />
              </IconButton>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Date Picker Popover */}
      <Popover
        open={openDatePopover}
        anchorEl={dateAnchorEl}
        onClose={() => {
          setDateAnchorEl(null);
          setActiveSection(null);
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{
          mt: 2,
          '& .MuiPopover-paper': {
            borderRadius: '32px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.14)',
            maxWidth: '860px',
            width: '860px',
            overflow: 'hidden',
          },
        }}
      >
        <Box sx={{ px: 3.5, pt: 3, pb: 3 }}>
          <Box
            className={dateRange[0].startDate && dateRange[0].endDate ? 'dates-selected' : ''}
            sx={{
              '& .rdrCalendarWrapper': {
                fontFamily: 'inherit',
                color: '#222222',
              },
              '& .rdrMonths': {
                display: 'flex !important',
                gap: '40px !important', // Espacio entre los dos meses (ajústalo según necesites)
              },

              '& .rdrMonth': {
                width: '386px !important',
                padding: '0 !important', // Quitar padding interno si existe
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
                backgroundColor: '#C8C8C8 !important',
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
                backgroundColor: '#222222 !important',
                border: 'none !important',
                borderRadius: '50% !important',
                zIndex: '3 !important',
              },
              '& .rdrDay:not(.rdrDayPassive) .rdrStartEdge ~ .rdrDayNumber span, & .rdrDay:not(.rdrDayPassive) .rdrEndEdge ~ .rdrDayNumber span':
                {
                  color: '#ffffff !important',
                  zIndex: '9999 !important',
                },
              '& .rdrDayHovered': {
                border: 'none !important',
                backgroundColor: 'transparent !important',
              },
              '& .rdrDayStartPreview': {
                backgroundColor: 'transparent !important',
                border: 'none !important',
              },
              '& .rdrDayInPreview': {
                top: '1px !important',
                bottom: '1px !important',
                left: '-20px !important',
                right: '-20px !important',
                backgroundColor: '#C8C8C8 !important',
                border: 'none !important',
              },
              '& .rdrDayEndPreview': {
                top: '1px !important',
                bottom: '1px !important',
                left: '0px !important',
                right: '0px !important',
                backgroundColor: '#222222 !important',
                border: 'none !important',
                borderRadius: '50% !important',
                zIndex: '1 !important',
              },
              '& .rdrDay:not(.rdrDayPassive) .rdrDayEndPreview ~ .rdrDayNumber span': {
                color: '#ffffff !important',
                zIndex: '2 !important',
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
              editableDateInputs={false}
              onChange={handleDateRangeSelect}
              moveRangeOnFirstSelection={false}
              ranges={dateRange}
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
            {hasUserInteracted && (dateRange[0].startDate || dateRange[0].endDate) && (
              <Typography
                onClick={() => {
                  setDateRange([{ startDate: new Date(), endDate: new Date(), key: 'selection' }]);
                  setHasUserInteracted(false);
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
            {hasUserInteracted && dateRange[0].startDate && dateRange[0].endDate && (
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
                <Typography
                  sx={{
                    color: 'white',
                  }}
                >
                  {t('searchMenu.buttonDate')}
                </Typography>
              </Button>
            )}
          </Box>
        </Box>
      </Popover>

      {/* Guests Popover */}
      <Popover
        open={openGuestsPopover}
        anchorEl={guestAnchorEl}
        onClose={() => {
          setGuestAnchorEl(null);
          setActiveSection(null);
          searchButtonRef.current?.focus();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
          }
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
            overflow: 'visible',
          },
        }}
      >
        <div
          ref={guestsPopoverRef}
          onMouseEnter={() => {
            if (guestAnchorEl) {
              setGuestAnchorEl(guestsRef.current);
            }
          }}
          onMouseLeave={() => {
            setGuestAnchorEl(null);
            setActiveSection(null);
            searchButtonRef.current?.focus();
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

      {/* Category Popover */}
      <Popover
        open={openCategoryPopover}
        anchorEl={categoryAnchorEl}
        onClose={() => {
          setCategoryAnchorEl(null);
          setActiveSection(null);
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{
          mt: 2,
          '& .MuiPopover-paper': {
            borderRadius: 3,
            boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
            maxWidth: 400,
            width: '100%',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#222', mb: 2 }}>
            {t('searchMenu.textHosting')}
          </Typography>
        </Box>
      </Popover>
    </Box>
  );
};

export default JomSearchBar;
