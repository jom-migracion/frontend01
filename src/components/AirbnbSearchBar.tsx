import assertEnv from '@/config/env';
import { useNotification } from '@/context/NotificationContext';
import theme from '@/themes/theme';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useGoogleMapsScript } from '@/hooks/useGoogleMapsScript';
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
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { pushToDataLayer } from '@/utilities/analytics';

type LocationData = {
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
  AnotherLocation?: string;
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
  AdtCount?: number;
  ChdCount?: number;
  InfCount?: number;
  PetsCount?: number;
  pageNumber?: number;
  pageSize?: number;
}

const AirbnbSearchBar = () => {
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
  const [shouldLoadMaps, setShouldLoadMaps] = useState(false);
  const [guests, setGuests] = useState<Guests>({ adults: 0, children: 0, infants: 0, pets: 0 });
  const totalGuests = guests.adults + guests.children;
  const [isSelectingCheckout, setIsSelectingCheckout] = useState(false);
  const normalizeDate = (date: Date | string): Date => {
    const d = typeof date === 'string' ? new Date(date) : new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  const [dateRange, setDateRange] = useState<Range[]>([
    {
      startDate: normalizeDate(new Date()),
      endDate: normalizeDate(new Date()),
      key: 'selection',
    },
  ]);

  const isDateRangeValid =
    dateRange[0].startDate &&
    dateRange[0].endDate &&
    normalizeDate(dateRange[0].startDate).getTime() !==
      normalizeDate(dateRange[0].endDate).getTime();

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

  const { isLoaded } = useGoogleMapsScript({
    googleMapsApiKey: assertEnv.VITE_KEY_SEARCH_GOOGLE,
    libraries: ['places'],
    language: 'es',
    skip: !shouldLoadMaps,
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
      .location-input::placeholder {
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
    let mounted = true;

    const initAutocomplete = async () => {
      if (!locationInputRef.current) return;

      try {
        // Carga dinámica de la librería Places (forma moderna y recomendada)
        const { Autocomplete } = (await google.maps.importLibrary(
          'places'
        )) as google.maps.PlacesLibrary;

        const autocomplete = new Autocomplete(locationInputRef.current, {
          componentRestrictions: { country: 'bo' },
          types: ['geocode'],
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          // console.log('Place selected:', place);
          if (!place.geometry?.location) return;

          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          const location: LocationData = {
            latitude: lat,
            longitude: lng,
          };

          // Procesar address components
          for (const component of place.address_components || []) {
            const type = component.types[0];
            switch (type) {
              case 'street_number':
              case 'route':
                location.street = (location.street || '') + ` ${component.long_name}`;
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
          localStorage.setItem('locationData', JSON.stringify(location));

          setActiveSection('checkin');
          setTimeout(() => {
            setDateAnchorEl(checkInRef.current);
          }, 100);
        });

        if (mounted) {
          autocompleteRef.current = autocomplete;
        }
      } catch (err) {
        console.error('Error cargando Google Places Autocomplete:', err);
      }
    };

    if (isLoaded) {
      initAutocomplete();
    }

    // Cleanup
    return () => {
      mounted = false;
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, [isLoaded]);

  const formatDate = (
    date: Date | string | null | undefined,
    forDisplay: boolean = false
  ): string => {
    if (!date) return '';

    let dateObj: Date;

    if (typeof date === 'string') {
      const datePart = date.split('T')[0];
      const [year, month, day] = datePart.split('-').map(Number);
      dateObj = new Date(year, month - 1, day);
    } else {
      // Normalizar a medianoche local
      dateObj = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    if (isNaN(dateObj.getTime())) return '';

    return forDisplay ? format(dateObj, 'dd MMM', { locale: es }) : format(dateObj, 'yyyy-MM-dd');
  };

  const handleDateRangeSelect = (rangesByKey: RangeKeyDict) => {
    const range = rangesByKey.selection;

    const startDate = normalizeDate(range.startDate!);
    const endDate = normalizeDate(range.endDate!);

    setDateRange([
      {
        startDate,
        endDate,
        key: 'selection',
      },
    ]);

    setHasUserInteracted(true);

    // Primer clic (Check-In)
    if (!isSelectingCheckout) {
      setIsSelectingCheckout(true);
      return;
    }

    // Segundo clic (Check-Out)
    setIsSelectingCheckout(false);

    if (startDate.getTime() === endDate.getTime()) {
      showNotification(
        'error',
        t('searchMenu.searchNotification'),
        'Debes seleccionar al menos una noche.'
      );
    }
  };

  const handleGuestChange = (key: keyof Guests, delta: number) => {
    setGuests((prev) => {
      let updated = { ...prev };

      // Calcular nuevo valor
      const newValue = Math.max(0, prev[key] + delta);
      updated[key] = newValue;

      const hasDependents = updated.children > 0 || updated.infants > 0 || updated.pets > 0;

      if (hasDependents && updated.adults === 0) {
        // Regla 2: Si hay dependientes → forzar mínimo 1 adulto
        updated.adults = 1;
      }

      // Regla 3: Si quitamos el último dependiente, no forzamos nada más

      return updated;
    });
  };

  const hasDependents = guests.children > 0 || guests.infants > 0 || guests.pets > 0;

  const onSubmit = () => {
    if (locationData === null) {
      showNotification(
        'error',
        t('searchMenu.searchNotification'),
        t('searchMenu.locationRequired')
      );
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

    const checkIn = normalizeDate(dateRange[0].startDate);
    const checkOut = normalizeDate(dateRange[0].endDate);

    if (checkIn.getTime() === checkOut.getTime()) {
      showNotification(
        'error',
        t('searchMenu.searchNotification'),
        'Debes seleccionar al menos una noche de estadía.'
      );

      setActiveSection('checkin');
      setDateAnchorEl(checkInRef.current);
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
      AnotherLocation: locationData?.premise,
      Country: locationData?.country,
      PostalCode: locationData?.postalCode,
      Latitude: locationData?.latitude,
      Longitude: locationData?.longitude,
      FormattedAddress: locationData?.formattedAddress,
      CheckInDate: dateRange[0].startDate,
      CheckOutDate: dateRange[0].endDate,
      Guests: guests,
      AdtCount: guests.adults,
      ChdCount: guests.children,
      InfCount: guests.infants,
      PetsCount: guests.pets,
      pageNumber: 1,
      pageSize: 10,
    };

    const params = new URLSearchParams();
    if (formData.Street) params.set('Street', formData.Street);
    if (formData.City) params.set('City', formData.City);
    if (formData.County) params.set('County', formData.County);
    if (formData.State) params.set('State', formData.State);
    if (formData.Country) params.set('Country', formData.Country);
    if (formData.AnotherLocation) params.set('AnotherLocation', formData.AnotherLocation);
    if (formData.PostalCode) params.set('PostalCode', formData.PostalCode);
    if (formData.Latitude) params.set('Latitude', formData.Latitude.toString());
    if (formData.Longitude) params.set('Longitude', formData.Longitude.toString());
    if (formData.PropertyTypeId) params.set('PropertyTypeId', formData.PropertyTypeId.toString());
    if (formData.CheckInDate) params.set('checkIn', formatDate(formData.CheckInDate, false));
    if (formData.CheckOutDate) params.set('checkOut', formatDate(formData.CheckOutDate, false));
    if (formData.AdtCount) params.set('adtCount', formData.AdtCount.toString());
    if (formData.ChdCount) params.set('chdCount', formData.ChdCount.toString());
    if (formData.InfCount) params.set('infCount', formData.InfCount.toString());
    if (formData.PetsCount) params.set('petsCount', formData.PetsCount.toString());
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
      AdtCount: 0,
      ChdCount: 0,
      InfCount: 0,
      PetsCount: 0,
      pageNumber: 1,
      pageSize: 10,
    });
    setLocationData(null);
    setLocationInput('');
    setGuests({ adults: 0, children: 0, infants: 0, pets: 0 });
    //setDateRange([{ startDate: new Date(), endDate: new Date(), key: 'selection' }]);
    setDateRange([
      {
        startDate: normalizeDate(new Date()),
        endDate: normalizeDate(new Date()),
        key: 'selection',
      },
    ]);
    setHasUserInteracted(false);
    setGuestAnchorEl(null);
    setCategoryAnchorEl(null);
    setDateAnchorEl(null);
    setActiveSection(null);
    localStorage.removeItem('locationData');
    pushToDataLayer('search', {
      search_location: locationData.city,
      search_checkin: dateRange[0].startDate
        ? format(dateRange[0].startDate, 'yyyy-MM-dd')
        : undefined,
      search_checkout: dateRange[0].endDate
        ? format(dateRange[0].endDate, 'yyyy-MM-dd')
        : undefined,
      search_clients: Number(guests.adults + guests.children),
    });
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
            onMouseEnter={() => setShouldLoadMaps(true)}
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
              {/* {isMobile && ( */}
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
              {/* )} */}
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
              {/* {isMobile && ( */}
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
              {/* )} */}
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
                      ? `${formatDate(dateRange[0].startDate, true)},          `
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
                      ? formatDate(dateRange[0].endDate, true)
                      : ''}
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
              {/* {isMobile && ( */}
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
              {/* )} */}
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
                  {/* {totalGuests > 0
                    ? `${totalGuests} Adt${totalGuests !== 1 ? '' : ''}${
                        guests.infants > 0
                          ? `, ${guests.infants} Bb${guests.infants !== 1 ? '' : ''}`
                          : ''
                      }${guests.pets > 0 ? `, ${guests.pets} Masc${guests.pets !== 1 ? '' : ''}` : ''}`
                    : `${t('searchMenu.textGuests')}`} */}
                  {(() => {
                    const summary =
                      totalGuests > 0
                        ? `${totalGuests} huésped${totalGuests !== 1 ? 'es' : ''}` +
                          (guests.infants > 0
                            ? `, ${guests.infants} bebé${guests.infants !== 1 ? 's' : ''}`
                            : '') +
                          (guests.pets > 0
                            ? `, ${guests.pets} mascota${guests.pets !== 1 ? 's' : ''}`
                            : '')
                        : t('searchMenu.textGuests');
                    return summary;
                  })()}
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
          if (!isDateRangeValid) {
            return;
          }
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
            borderRadius: 3,
            boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box className={dateRange[0].startDate && dateRange[0].endDate ? 'dates-selected' : ''}>
            <DateRange
              editableDateInputs={false}
              onChange={handleDateRangeSelect}
              moveRangeOnFirstSelection={false}
              ranges={dateRange}
              months={2}
              direction="horizontal"
              showDateDisplay={false}
              locale={es}
              // minDate={new Date()}
              minDate={normalizeDate(new Date())}
              rangeColors={['#000']}
              showPreview={false}
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
                // onClick={() => {
                //   setDateRange([{ startDate: new Date(), endDate: new Date(), key: 'selection' }]);
                //   setHasUserInteracted(false);
                onClick={() => {
                  setDateRange([
                    {
                      startDate: normalizeDate(new Date()),
                      endDate: normalizeDate(new Date()),
                      key: 'selection',
                    },
                  ]);
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

      {/* Huespedes */}
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
                  disabled={guests.adults === 0 || (guests.adults === 1 && hasDependents)}
                  // disabled={guests.adults === 0}
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
                  // disabled={guests.children === 0}
                  //disabled={guests.adults + guests.children === 0}
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
                  // disabled={guests.infants === 0}
                  // disabled={guests.adults + guests.infants === 0}
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
                  // disabled={guests.pets === 0}
                  // disabled={guests.adults + guests.pets === 0}
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

export default AirbnbSearchBar;
