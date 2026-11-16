import { useGet } from '@/hooks/api';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useEffect, useRef, useState } from 'react';
import { DateRange, Range, RangeKeyDict } from 'react-date-range';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import assertEnv from '@/config/env';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useGoogleMapsScript } from '@/hooks/useGoogleMapsScript';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { useTranslation } from 'react-i18next';
import { pushToDataLayer } from '@/utilities/analytics';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

interface PropertySubType {
  subTypeCode: string;
  subType: string;
  subTypeIcon: string;
  type: string | null;
  typeCode: string | null;
  typeIcon: string | null;
  propertySubtypeId: number;
}

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
  AnotherLocation?: string;
  Latitude?: number;
  Longitude?: number;
  FormattedAddress?: string;
  CheckInDate?: Date | null;
  CheckOutDate?: Date | null;
  PropertyTypeId?: number;
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

type DialogStep = 'location' | 'category' | 'dates' | 'guests' | null;

const MobileAirbnbSearchBar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState<DialogStep>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [locationInput, setLocationInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PropertySubType | null>(null);
  const locationInputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [isInputReady, setIsInputReady] = useState(false);
  const [shouldLoadMaps, setShouldLoadMaps] = useState(false);

  const [guests, setGuests] = useState<Guests>({ adults: 0, children: 0, infants: 0, pets: 0 });
  const totalGuests = (guests.adults || 0) + (guests.children || 0);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [showStickySearch, setShowStickySearch] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(60);
  const searchBarRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();
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
      AnotherLocation: undefined,
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

  // Check if Google Maps is already loaded
  useEffect(() => {
    if (!shouldLoadMaps) return;

    const checkGoogleMaps = () => {
      // First check if Google Maps is already fully loaded
      if (window.google && window.google.maps && window.google.maps.places && isLoaded) {
        //if (isLoaded) {
        setIsGoogleLoaded(true);
        return;
      }

      // Check if script already exists in the DOM
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com/maps/api"]`);

      if (existingScript) {
        // Script exists, wait for it to load
        const checkInterval = setInterval(() => {
          if (window.google && window.google.maps && window.google.maps.places) {
            setIsGoogleLoaded(true);
            clearInterval(checkInterval);
          }
        }, 100);

        // Timeout after 10 seconds instead of 5
        setTimeout(() => {
          clearInterval(checkInterval);
          if (!window.google || !window.google.maps || !window.google.maps.places) {
            console.error('❌ Google Maps failed to load after 10 seconds');
          }
        }, 10000);
        return;
      }

      // Only load script if it doesn't exist at all
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${assertEnv.VITE_KEY_SEARCH_GOOGLE}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        // Additional check to ensure places library is ready
        const placesCheck = setInterval(() => {
          if (window.google && window.google.maps && window.google.maps.places) {
            setIsGoogleLoaded(true);
            clearInterval(placesCheck);
          }
        }, 100);
        setTimeout(() => clearInterval(placesCheck), 3000);
      };
      script.onerror = () => {
        console.error('❌ Failed to load Google Maps script');
      };
      document.head.appendChild(script);
    };

    checkGoogleMaps();
  }, [shouldLoadMaps]);

  const { data: category } = useGet<PropertySubType[]>('category1', '/Parametrics/PropertyTypes');

  // Custom styles for autocomplete and date range
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .pac-container {
        border-radius: 12px !important;
        box-shadow: 0 4px 16px rgba(0,0,0,0.15) !important;
        border: 1px solid #ddd !important;
        margin-top: 0px !important;
        z-index: 9999 !important;
        font-family: inherit !important;
        background-color: white !important;
      }
      .pac-item {
        padding: 12px 16px !important;
        cursor: pointer !important;
        border-top: 1px solid #f0f0f0 !important;
      }
      .pac-item:first-child {
        border-top: none !important;
        border-radius: 12px 12px 0 0 !important;
      }
      .pac-item:last-child {
        border-radius: 0 0 12px 12px !important;
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
      
      /* Date range styles */
      .rdrCalendarWrapper {
        background: #ffffff !important;
      }
      .rdrDayNumber span {
        color: #5B4CA0 !important;
        position: relative;
        z-index: 2;
      }
      .rdrDay.rdrDayToday .rdrDayNumber span:after {
        display: none !important;
      }
      .rdrDay .rdrInRange,
      .rdrDay .rdrStartEdge,
      .rdrDay .rdrEndEdge,
      .rdrDay .rdrSelected {
        background: #5B4CA0 !important;
      }
      .rdrDay:not(.rdrDayPassive) .rdrInRange ~ .rdrDayNumber span,
      .rdrDay:not(.rdrDayPassive) .rdrStartEdge ~ .rdrDayNumber span,
      .rdrDay:not(.rdrDayPassive) .rdrEndEdge ~ .rdrDayNumber span,
      .rdrDay:not(.rdrDayPassive) .rdrSelected ~ .rdrDayNumber span {
        color: whitesmoke !important;
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
    setValue('AnotherLocation', locationData?.premise);
    setValue('Latitude', locationData?.latitude);
    setValue('Longitude', locationData?.longitude);
    setValue('CheckInDate', dateRange[0].startDate);
    setValue('CheckOutDate', dateRange[0].endDate);
    setValue('Guests', guests);
  }, [locationData, dateRange, guests, setValue]);

  // Google Places Autocomplete
  useEffect(() => {
    // Limpiar autocomplete anterior si existe
    if (autocompleteRef.current) {
      google.maps.event.clearInstanceListeners(autocompleteRef.current);
      autocompleteRef.current = null;
    }

    // Esperar a que el DOM esté completamente listo
    const timer = setTimeout(() => {
      if (!locationInputRef.current) {
        console.error('❌ Input ref not available after timeout - DOM may not be ready');
        return;
      }

      try {
        // Verificar que Places API esté disponible
        if (!google.maps.places || !google.maps.places.Autocomplete) {
          console.error('❌ Google Maps Places API not available');
          return;
        }

        console.log('🔧 Initializing autocomplete...');

        const autocomplete = new google.maps.places.Autocomplete(locationInputRef.current, {
          componentRestrictions: { country: 'bo' },
          types: ['geocode'],
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          // console.log('📍 Place selected:', place);

          if (!place.geometry?.location) {
            console.warn('⚠️ No geometry in selected place');
            return;
          }

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
          localStorage.setItem('locationData', JSON.stringify(location));

          console.log('✅ Location data saved:', location);
        });

        autocompleteRef.current = autocomplete;
        console.log('✅ Autocomplete initialized successfully');

        // Auto focus input
        setTimeout(() => {
          locationInputRef.current?.focus();
        }, 100);
      } catch (error) {
        console.error('❌ Error initializing autocomplete:', error);
      }
    }, 300); // Aumentado de 200ms a 300ms para dar más tiempo al Dialog

    return () => {
      clearTimeout(timer);
    };
  }, [isGoogleLoaded, isInputReady, openDialog, currentStep]);

  // Medir la altura real del navbar
  useEffect(() => {
    const measureNavbar = () => {
      const appBar = document.querySelector('header.MuiAppBar-root') as HTMLElement | null;
      if (appBar) {
        setNavbarHeight(appBar.offsetHeight);
      }
    };
    measureNavbar();
    window.addEventListener('resize', measureNavbar);
    return () => window.removeEventListener('resize', measureNavbar);
  }, []);

  // Scroll listener for sticky search bar
  useEffect(() => {
    const handleScroll = () => {
      if (searchBarRef.current) {
        const searchBarBottom = searchBarRef.current.offsetTop + searchBarRef.current.offsetHeight;
        const currentScroll = window.pageYOffset;

        if (currentScroll > searchBarBottom) {
          setShowStickySearch(true);
        } else {
          setShowStickySearch(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

    // Normalizar a medianoche local para evitar problemas de zona horaria
    const normalizeToMidnight = (date: Date | undefined): Date | undefined => {
      if (!date) return undefined;
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    const newDateRange = [
      {
        startDate: normalizeToMidnight(range.startDate),
        endDate: normalizeToMidnight(range.endDate),
        key: 'selection',
      },
    ];

    setDateRange(newDateRange as Range[]);
    setHasUserInteracted(true);
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
      // (ya se maneja con el mínimo natural de adultos)

      return updated;
    });
  };

  const hasDependents = guests.children > 0 || guests.infants > 0 || guests.pets > 0;

  const handleOpenDialog = (step: DialogStep) => {
    setShouldLoadMaps(true);
    setCurrentStep(step);
    setOpenDialog(true);
    setIsInputReady(false);
  };

  const handleCloseDialog = () => {
    localStorage.removeItem('search-form-storage');
    localStorage.removeItem('searchFilters');
    localStorage.removeItem('last-search-key');
    localStorage.removeItem('last-city');
    localStorage.removeItem('locationData');
    setOpenDialog(false);
    setCurrentStep(null);
    setIsInputReady(false); // Reset cuando se cierra el dialog
  };

  const onSubmit = () => {
    const formData: SearchFormData = {
      Street: locationData?.street,
      City: locationData?.city,
      County: locationData?.county,
      State: locationData?.state,
      Country: locationData?.country,
      PostalCode: locationData?.postalCode,
      AnotherLocation: locationData?.premise,
      Latitude: locationData?.latitude,
      Longitude: locationData?.longitude,
      FormattedAddress: locationData?.formattedAddress,
      CheckInDate: dateRange[0].startDate,
      CheckOutDate: dateRange[0].endDate,
      Guests: guests,
      PropertyTypeId: selectedCategory?.propertySubtypeId || category?.data?.[0]?.propertySubtypeId,
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
    if (formData.AnotherLocation) params.set('AnotherLocation', formData.AnotherLocation);
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
      AnotherLocation: undefined,
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
    setSelectedCategory(null);
    setGuests({ adults: 0, children: 0, infants: 0, pets: 0 });
    setDateRange([
      {
        startDate: normalizeDate(new Date()),
        endDate: normalizeDate(new Date()),
        key: 'selection',
      },
    ]);
    setHasUserInteracted(false);
    setCurrentStep(null);
    setOpenDialog(false);
    localStorage.removeItem('locationData');
    pushToDataLayer('search', {
      search_location: locationData?.city,
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

  const getStepTitle = () => {
    switch (currentStep) {
      case 'location':
        return t('searchMenu.textLocation');
      case 'dates':
        return t('mobileSearch.whenTravel');
      case 'guests':
        return t('mobileSearch.whoTravels');
      default:
        return '';
    }
  };

  return (
    <>
      {/* Normal Search Bar (in document flow) */}
      <Box
        ref={searchBarRef}
        sx={{
          width: '100%',
          px: { xs: 1, sm: 2 },
          pt: { xs: 2, sm: 3 },
          pb: 1.5,
          bgcolor: 'transparent',
        }}
      >
        <Paper
          elevation={0}
          onClick={() => handleOpenDialog('location')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '40px',
            overflow: 'hidden',
            width: '100%',
            height: '56px',
            px: 2,
            cursor: 'pointer',
            boxShadow: '0 10px 15px rgba(0, 0, 0, 0.12)',
            border: '1px solid #f1f1f1',
          }}
        >
          <SearchIcon sx={{ color: '#717171', mr: 2 }} />
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontFamily: theme.typography.paragraph1Regular,
                width: { xs: '220px', sm: 'auto' },
                color: '#222',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                display: 'block',
                textAlign: 'left',
              }}
            >
              {locationInput || t('searchMenu.textLocation')}
            </Typography>
            <Typography
              sx={{
                fontFamily: theme.typography.small1Regular,
                color: '#717171',
                textAlign: 'left',
              }}
            >
              {hasUserInteracted && dateRange[0].startDate && dateRange[0].endDate
                ? `${formatDate(dateRange[0].startDate, true)} - ${formatDate(dateRange[0].endDate, true)}`
                : t('mobileSearch.anyWeek')}
              {' • '}
              {(() => {
                const summary =
                  totalGuests > 0
                    ? `${totalGuests} ${t('mobileSearch.guest', { count: totalGuests })}` +
                      (guests.infants > 0
                        ? `, ${guests.infants} ${t('mobileSearch.infant', { count: guests.infants })}`
                        : '') +
                      (guests.pets > 0
                        ? `, ${guests.pets} ${t('mobileSearch.pet', { count: guests.pets })}`
                        : '')
                    : t('searchMenu.textGuests');
                return summary;
              })()}
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Sticky Search Bar (fixed, appears on scroll) */}
      <Box
        sx={{
          position: 'fixed',
          top: `${navbarHeight}px`,
          left: 0,
          right: 0,
          zIndex: 1099,
          bgcolor: '#fff',
          width: '100%',
          px: { xs: 1, sm: 2 },
          py: 1,
          // pt: { xs: 4, sm: 2 },
          borderBottom: '1px solid #f0f0f0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)',
          transform: showStickySearch ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Paper
          elevation={0}
          onClick={() => handleOpenDialog('location')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '40px',
            overflow: 'hidden',
            width: '100%',
            height: '56px',
            px: 2,
            cursor: 'pointer',
            bgcolor: '#f8f9fc',
            border: '1px solid #f1f1f1',
          }}
        >
          <SearchIcon sx={{ color: '#717171', mr: 2 }} />
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontFamily: theme.typography.paragraph1Regular,
                width: { xs: '220px', sm: 'auto' },
                color: '#222',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                display: 'block',
                textAlign: 'left',
              }}
            >
              {locationInput || t('searchMenu.textLocation')}
            </Typography>
            <Typography
              sx={{
                fontFamily: theme.typography.small1Regular,
                color: '#717171',
                textAlign: 'left',
              }}
            >
              {hasUserInteracted && dateRange[0].startDate && dateRange[0].endDate
                ? `${formatDate(dateRange[0].startDate, true)} - ${formatDate(dateRange[0].endDate, true)}`
                : t('mobileSearch.anyWeek')}
              {' • '}
              {(() => {
                const summary =
                  totalGuests > 0
                    ? `${totalGuests} ${t('mobileSearch.guest', { count: totalGuests })}` +
                      (guests.infants > 0
                        ? `, ${guests.infants} ${t('mobileSearch.infant', { count: guests.infants })}`
                        : '') +
                      (guests.pets > 0
                        ? `, ${guests.pets} ${t('mobileSearch.pet', { count: guests.pets })}`
                        : '')
                    : t('searchMenu.textGuests');
                return summary;
              })()}
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Full Screen Dialog */}
      <Dialog
        fullScreen
        open={openDialog}
        onClose={handleCloseDialog}
        slots={{
          transition: Transition,
        }}
        sx={{
          '& .MuiDialog-paper': {
            bgcolor: '#fff',
            zIndex: 1300,
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1201,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: '1px solid #f0f0f0',
            bgcolor: '#fff',
          }}
        >
          <Box sx={{ width: 40 }} />
          <Typography sx={{ fontFamily: theme.typography.h5SMedium, color: '#222' }}>
            {getStepTitle()}
          </Typography>
          <IconButton onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent
          sx={{
            p: 0,
            overflow: currentStep === 'location' ? 'visible' : 'auto',
          }}
        >
          {/* Location Step */}
          {currentStep === 'location' && (
            <Box sx={{ p: 3 }}>
              <Typography sx={{ fontFamily: theme.typography.h3Bold, color: '#222', mb: 2 }}>
                {t('searchMenu.textLocation')}
              </Typography>

              {!isGoogleLoaded && (
                <Box
                  sx={{
                    mb: 2,
                    p: 2,
                    bgcolor: '#FFF4E5',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Typography sx={{ fontSize: '14px', color: '#663C00' }}>
                    {t('mobileSearch.loadingMap')}
                  </Typography>
                </Box>
              )}

              <Box
                sx={{
                  border: '1px solid #ddd',
                  borderRadius: '12px',
                  p: 2,
                  position: 'relative',
                  zIndex: 1,
                  bgcolor: '#fff',
                  '&:focus-within': {
                    borderColor: '#222',
                    boxShadow: '0 0 0 2px rgba(34,34,34,0.1)',
                  },
                }}
              >
                <input
                  id="mobile-location-input"
                  ref={(el) => {
                    locationInputRef.current = el;
                    if (el && !isInputReady) {
                      console.log('✅ Input ref set - element mounted');
                      setIsInputReady(true);
                    }
                  }}
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder={
                    isGoogleLoaded
                      ? t('mobileSearch.searchDestinations')
                      : t('mobileSearch.loading')
                  }
                  disabled={!isGoogleLoaded}
                  autoComplete="off"
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '16px',
                    color: isGoogleLoaded ? '#222' : '#999',
                    backgroundColor: 'transparent',
                    width: '100%',
                    fontFamily: 'inherit',
                  }}
                />
              </Box>
            </Box>
          )}

          {/* Dates Step */}
          {currentStep === 'dates' && (
            <Box>
              <Box sx={{ px: 3, py: 2 }}>
                <Typography sx={{ fontFamily: theme.typography.h3Bold, color: '#222', mb: 2 }}>
                  {t('mobileSearch.whenTravel')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <DateRange
                  editableDateInputs={false}
                  onChange={handleDateRangeSelect}
                  moveRangeOnFirstSelection={false}
                  ranges={dateRange}
                  months={2}
                  direction="vertical"
                  showDateDisplay={false}
                  locale={es}
                  //minDate={new Date()}
                  minDate={normalizeDate(new Date())}
                  rangeColors={['#000']}
                  showPreview={false}
                />
              </Box>
              <Box sx={{ p: 3, borderTop: '1px solid #f0f0f0' }}>
                <Stack direction="row" spacing={2} justifyContent="space-between">
                  {hasUserInteracted && (dateRange[0].startDate || dateRange[0].endDate) && (
                    <Typography
                      // onClick={() => {
                      //   setDateRange([
                      //     { startDate: new Date(), endDate: new Date(), key: 'selection' },
                      //   ]);
                      //   setHasUserInteracted(false);
                      // }}
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
                </Stack>
              </Box>
            </Box>
          )}

          {/* Guests Step */}
          {currentStep === 'guests' && (
            <Box sx={{ p: 3 }}>
              <Typography sx={{ fontFamily: theme.typography.h3Bold, color: '#222', mb: 3 }}>
                {t('searchMenu.guests')}
              </Typography>

              <Stack spacing={3}>
                {/* Adults */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pb: 2,
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: theme.typography.paragraph1Medium,
                        color: '#000000',
                      }}
                    >
                      {t('searchMenu.adults')}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: theme.typography.paragraph1SRegular,
                        color: 'gray',
                      }}
                    >
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
                        width: 36,
                        height: 36,
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
                        minWidth: 32,
                        textAlign: 'center',
                        fontFamily: theme.typography.h4Bold,
                        // color: theme.palette.customColors.primary[1],
                      }}
                    >
                      {guests.adults}
                    </Typography>
                    <IconButton
                      onClick={() => handleGuestChange('adults', 1)}
                      disabled={guests.adults + guests.children >= 18}
                      sx={{
                        border: '1px solid #b0b0b0',
                        width: 36,
                        height: 36,
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

                {/* Children */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pb: 2,
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: theme.typography.paragraph1Medium,
                        color: '#000000',
                      }}
                    >
                      {t('searchMenu.children')}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: theme.typography.paragraph1SRegular,
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
                        width: 36,
                        height: 36,
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
                        minWidth: 32,
                        textAlign: 'center',
                        fontFamily: theme.typography.h4Bold,
                        // color: theme.palette.customColors.primary[1],
                      }}
                    >
                      {guests.children}
                    </Typography>
                    <IconButton
                      onClick={() => handleGuestChange('children', 1)}
                      disabled={guests.adults + guests.children >= 18}
                      sx={{
                        border: '1px solid #b0b0b0',
                        width: 36,
                        height: 36,
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

                {/* Infants */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pb: 2,
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: theme.typography.paragraph1Medium,
                        color: '#000000',
                      }}
                    >
                      {t('searchMenu.babies')}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: theme.typography.paragraph1SRegular,
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
                        width: 36,
                        height: 36,
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
                        minWidth: 32,
                        textAlign: 'center',
                        fontFamily: theme.typography.h4Bold,
                        //color: theme.palette.customColors.primary[1],
                      }}
                    >
                      {guests.infants}
                    </Typography>
                    <IconButton
                      onClick={() => handleGuestChange('infants', 1)}
                      //disabled={guests.adults + guests.children < 1}
                      // sx={
                      //   guests.adults + guests.children < 1
                      //     ? {
                      //         border: '1px solid #ebebeb',
                      //         width: 32,
                      //         height: 32,
                      //         opacity: 0.3,
                      //       }
                      //     : {
                      //         border: '1px solid #b0b0b0',
                      //         width: 32,
                      //         height: 32,
                      //       }
                      // }
                      sx={{
                        border: '1px solid #b0b0b0',
                        width: 36,
                        height: 36,
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

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: theme.typography.paragraph1Medium,
                        color: '#000000',
                      }}
                    >
                      {t('searchMenu.pets')}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: theme.typography.paragraph1SRegular,
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
                        width: 36,
                        height: 36,
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
                        minWidth: 32,
                        textAlign: 'center',
                        fontFamily: theme.typography.h4Bold,
                        // color: theme.palette.customColors.primary[1],
                      }}
                    >
                      {guests.pets}
                    </Typography>
                    <IconButton
                      onClick={() => handleGuestChange('pets', 1)}
                      //disabled={guests.adults + guests.children < 1}
                      // sx={
                      //   guests.adults + guests.children < 1
                      //     ? {
                      //         border: '1px solid #ebebeb',
                      //         width: 32,
                      //         height: 32,
                      //         opacity: 0.3,
                      //       }
                      //     : {
                      //         border: '1px solid #b0b0b0',
                      //         width: 32,
                      //         height: 32,
                      //       }
                      // }
                      sx={{
                        border: '1px solid #b0b0b0',
                        width: 36,
                        height: 36,
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
              </Stack>
            </Box>
          )}
        </DialogContent>

        {/* Footer with Next/Search Button */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            bgcolor: '#fff',
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={handleCloseDialog}
            sx={{
              flex: 1,
              textTransform: 'none',
              borderColor: '#222',
              color: '#222',
              '&:hover': {
                borderColor: '#000',
                bgcolor: '#f7f7f7',
              },
            }}
          >
            {t('mobileSearch.cancel')}
          </Button>
          {currentStep === 'guests' ? (
            <Button
              variant="contained"
              onClick={onSubmit}
              // disabled={!locationData}
              disabled={guests.adults + guests.children < 1}
              sx={{
                flex: 2,
                textTransform: 'none',
                bgcolor: theme.palette.customColors.primary[1],
                '&:hover': {
                  bgcolor: theme.palette.customColors.primary[2],
                },
                '&:disabled': {
                  bgcolor: '#f0f0f0',
                  color: '#b0b0b0',
                },
              }}
            >
              <SearchIcon sx={{ mr: 1 }} />
              {t('mobileSearch.search')}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => {
                if (currentStep === 'location') setCurrentStep('dates');
                // else if (currentStep === 'category') setCurrentStep('dates');
                else if (currentStep === 'dates') setCurrentStep('guests');
              }}
              //disabled={!isDateRangeValid}
              disabled={
                (currentStep === 'location' && !locationData) ||
                (currentStep === 'dates' && !isDateRangeValid) ||
                //  (currentStep === 'category' && !selectedCategory) ||
                (currentStep === 'dates' &&
                  (!hasUserInteracted ||
                    !dateRange[0].startDate ||
                    !dateRange[0].endDate ||
                    dateRange[0].startDate === dateRange[0].endDate))
              }
              sx={{
                flex: 2,
                textTransform: 'none',
                bgcolor: theme.palette.customColors.primary[1],
                '&:hover': {
                  bgcolor: theme.palette.customColors.primary[2],
                },
                '&:disabled': {
                  bgcolor: '#f0f0f0',
                  color: '#b0b0b0',
                },
              }}
            >
              {t('mobileSearch.next')}
            </Button>
          )}
        </Box>
      </Dialog>
    </>
  );
};

export default MobileAirbnbSearchBar;
