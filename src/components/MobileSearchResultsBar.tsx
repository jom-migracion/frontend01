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
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEffect, useRef, useState } from 'react';
import { DateRange, Range, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import assertEnv from '@/config/env';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { normalizeDate } from '@/utilities/dateUtils';
import { useLoadScript } from '@react-google-maps/api';
import { useTranslation } from 'react-i18next';

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
  CheckInDate?: string | null;
  CheckOutDate?: string | null;
  Guests: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  };
  PropertyTypeId?: number | null;
  pageNumber?: number;
  pageSize?: number;
}

type DialogStep = 'location' | 'dates' | 'guests' | null;

interface MobileSearchResultsBarProps {
  onSearch: (data: SearchFormData) => void;
  initialData?: SearchFormData | null;
  isLoaded: boolean;
  onDialogStateChange?: (isOpen: boolean) => void;
}

const MobileSearchResultsBar: React.FC<MobileSearchResultsBarProps> = ({
  onSearch,
  initialData,
  onDialogStateChange,
}) => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState<DialogStep>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [locationInput, setLocationInput] = useState('');
  const searchBarRef = useRef<HTMLDivElement | null>(null);
  const locationInputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isInputReady, setIsInputReady] = useState(false);
  const { t } = useTranslation();
  const [showStickySearch, setShowStickySearch] = useState(false);
  const [guests, setGuests] = useState<Guests>({ adults: 0, children: 0, infants: 0, pets: 0 });
  const totalGuests = (guests.adults || 0) + (guests.children || 0);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [dateRange, setDateRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const isDateRangeValid =
    dateRange[0].startDate &&
    dateRange[0].endDate &&
    normalizeDate(dateRange[0].startDate) !== normalizeDate(dateRange[0].endDate);

  // Initialize with initialData (same logic as SearchResultsBar)
  useEffect(() => {
    if (initialData) {
      // Update dates
      const startDate = initialData.CheckInDate ? parseISO(initialData.CheckInDate) : undefined;
      const endDate = initialData.CheckOutDate ? parseISO(initialData.CheckOutDate) : undefined;

      // console.log('📅 Parsed dates:', {
      //   CheckInDate: initialData.CheckInDate,
      //   CheckOutDate: initialData.CheckOutDate,
      //   startDate,
      //   endDate,
      // });

      setDateRange([
        {
          startDate: startDate && !isNaN(startDate.getTime()) ? startDate : new Date(),
          endDate: endDate && !isNaN(endDate.getTime()) ? endDate : new Date(),
          key: 'selection',
        },
      ]);

      // Establecer hasUserInteracted si hay fechas válidas
      if (startDate && endDate && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        setHasUserInteracted(true);
      }

      // Update guests
      //setGuests(initialData.Guests || { adults: 0, children: 0, infants: 0, pets: 0 });
      const stored = localStorage.getItem('search-form-storage');
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as SearchFormData;
          setGuests(
            initialData.Guests
              ? {
                  adults: parsed.Guests?.adults || initialData.Guests.adults || 0,
                  children: initialData.Guests.children || 0,
                  infants: initialData.Guests.infants || 0,
                  pets: initialData.Guests.pets || 0,
                }
              : { adults: 0, children: 0, infants: 0, pets: 0 }
          );
        } catch {
          localStorage.removeItem('search-form-storage');
        }
      }

      // Update location
      const newLocationData = {
        latitude: initialData.Latitude || 0,
        longitude: initialData.Longitude || 0,
        premise: initialData.AnotherLocation,
        street: initialData.Street,
        city: initialData.City,
        county: initialData.County,
        state: initialData.State,
        country: initialData.Country,
        postalCode: initialData.PostalCode,
        formattedAddress: initialData.FormattedAddress,
      };
      setLocationData(newLocationData);

      // Use FormattedAddress if available, otherwise build from components
      const displayText = initialData.FormattedAddress
        ? initialData.FormattedAddress
        : initialData.Street
          ? initialData.Street
          : initialData.City
            ? `${initialData.City}${initialData.State ? ', ' + initialData.State : ''}${initialData.Country ? ', ' + initialData.Country : ''}`
            : initialData.State
              ? `${initialData.State}${initialData.Country ? ', ' + initialData.Country : ''}`
              : initialData.Country || '';
      setLocationInput(displayText);
    }
  }, [initialData]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: assertEnv.VITE_KEY_SEARCH_GOOGLE,
    libraries: ['places'],
    language: 'es',
  });

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

  // Google Places Autocomplete
  useEffect(() => {
    if (!isLoaded) {
      // console.log('⏳ Google Maps not loaded yet');
      return;
    }

    if (!isInputReady) {
      // console.log('⏳ Input element not ready yet');
      return;
    }

    if (!openDialog || currentStep !== 'location') {
      console.log('ℹ️ Dialog not open or not on location step');
      return;
    }

    console.log('🔧 Preparing to initialize autocomplete...');

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

        console.log('🔧 Autocomplete instance created:', autocomplete);

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
  }, [isLoaded, isInputReady, openDialog, currentStep]);

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

  const handleOpenDialog = (step: DialogStep) => {
    setCurrentStep(step);
    setOpenDialog(true);
    setIsInputReady(false);
    onDialogStateChange?.(true);
  };

  const handleCloseDialog = () => {
    localStorage.removeItem('search-form-storage');
    localStorage.removeItem('searchFilters');
    localStorage.removeItem('last-search-key');
    localStorage.removeItem('last-city');
    localStorage.removeItem('locationData');
    setOpenDialog(false);
    setCurrentStep(null);
    setIsInputReady(false);
    onDialogStateChange?.(false);
  };

  const handleSubmit = () => {
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
      CheckInDate: dateRange[0].startDate ? normalizeDate(dateRange[0].startDate) : null,
      CheckOutDate: dateRange[0].endDate ? normalizeDate(dateRange[0].endDate) : null,
      Guests: guests,
      PropertyTypeId: initialData?.PropertyTypeId, // Mantener el PropertyTypeId existente
      pageNumber: 1,
      pageSize: 10,
    };

    localStorage.setItem('search-form-storage', JSON.stringify(formData));
    localStorage.setItem('locationData', JSON.stringify(locationData));

    setCurrentStep(null);
    setOpenDialog(false);
    onDialogStateChange?.(false);

    onSearch(formData);
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

  return (
    <>
      {/* Compact Search Bar */}
      {/* <Box sx={{ width: '100%', px: 2, py: 2, position: 'fixed' }}> */}
      <Box
        sx={{
          position: 'fixed',
          top: 135, // { xs: 'calc(56px + 12px)', sm: 'calc(64px + 12px)' },
          left: 0,
          right: 0,
          zIndex: 1099,
          bgcolor: '#fff',
          width: '100%',
          mt: 1,
          px: { xs: 1, sm: 2 },
          py: 2,
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
            //boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
            bgcolor: '#f8f9fc',
            border: '1px solid #f1f1f1',
          }}
        >
          <SearchIcon sx={{ color: '#717171', mr: 2 }} />
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontFamily: theme.typography.paragraph1Regular,
                color: '#222',
                width: { xs: '220px', sm: 'auto' },
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                display: 'block',
              }}
            >
              {locationInput || t('searchMenu.textLocation')}
            </Typography>
            <Typography
              sx={{
                fontFamily: theme.typography.small1Regular,
                color: '#717171',
              }}
            >
              {dateRange[0].startDate && dateRange[0].endDate
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
        sx={{
          zIndex: 1300,
          '& .MuiDialog-paper': {
            bgcolor: '#fff',
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

              {!isLoaded && (
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
                id="location-input-container"
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
                    isLoaded ? t('mobileSearch.searchDestinations') : t('mobileSearch.loading')
                  }
                  disabled={!isLoaded}
                  autoComplete="off"
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '16px',
                    color: isLoaded ? '#222' : '#999',
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
                  minDate={new Date()}
                  rangeColors={['#000']}
                  showPreview={false}
                />
              </Box>
              <Box sx={{ p: 3, borderTop: '1px solid #f0f0f0' }}>
                <Stack direction="row" spacing={2} justifyContent="space-between">
                  {hasUserInteracted && (dateRange[0].startDate || dateRange[0].endDate) && (
                    <Typography
                      onClick={() => {
                        setDateRange([
                          { startDate: new Date(), endDate: new Date(), key: 'selection' },
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
                        fontSize: theme.typography.paragraph1Medium,
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
                      disabled={guests.adults === 0}
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
                        fontSize: theme.typography.paragraph1Medium,
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
                        //color: theme.palette.customColors.primary[1],
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
                        fontSize: theme.typography.paragraph1Medium,
                        color: '#000000',
                      }}
                    >
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

                {/* Pets */}
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
                        fontSize: theme.typography.paragraph1Medium,
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
              onClick={handleSubmit}
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
                else if (currentStep === 'dates') setCurrentStep('guests');
              }}
              disabled={
                (currentStep === 'location' && !locationData) ||
                (currentStep === 'dates' && !isDateRangeValid) ||
                (currentStep === 'dates' && !dateRange[0].startDate && !dateRange[0].endDate)
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

export default MobileSearchResultsBar;
