import assertEnv from '@/config/env';
import { useGet } from '@/hooks/api';
import { Add as AddIcon, Remove as RemoveIcon, Search as SearchIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Popover,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import { useLoadScript } from '@react-google-maps/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DateRange, Range, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { Controller, useForm } from 'react-hook-form';
import { BiUser } from 'react-icons/bi';
import { CiLocationArrow1 } from 'react-icons/ci';
import { IoCalendarOutline, IoClose, IoHomeOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router';
import SnackbarAlert from './SnackbarAlert';

type LocationData = {
  latitude: number;
  longitude: number;
  country?: string;
  state?: string;
  county?: string;
  city?: string;
  street?: string;
  postalCode?: string;
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
  Latitude?: number;
  Longitude?: number;
  CheckInDate?: Date | null;
  CheckOutDate?: Date | null;
  PropertyTypeId?: number;
  Guests: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  };
  pageNumber?: number;
  pageSize?: number;
}

const MobileAssertSearchWithGoogle = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState<number | false>(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [dateAnchorEl, setDateAnchorEl] = useState<null | HTMLElement>(null);
  const [guestAnchorEl, setGuestAnchorEl] = useState<null | HTMLElement>(null);
  const [categoryAnchorEl, setCategoryAnchorEl] = useState<null | HTMLElement>(null);
  const [focusedDateField, setFocusedDateField] = useState<'CheckInDate' | 'CheckOutDate' | null>(
    null
  );
  const [autoOpenDate, setAutoOpenDate] = useState(false);
  const [autoOpenGuests, setAutoOpenGuests] = useState(false);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [locationQuery, setLocationQuery] = useState('');

  const checkInRef = useRef<HTMLDivElement>(null);
  const checkOutRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);
  const guestPopoverRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const openGuestsPopover = Boolean(guestAnchorEl);
  const openDatePopover = Boolean(dateAnchorEl);
  const openCategoryPopover = Boolean(categoryAnchorEl);
  const locationInputRef = useRef<HTMLInputElement | null>(null);

  const [guests, setGuests] = useState<Guests>({ adults: 1, children: 0, infants: 0, pets: 0 });
  const totalGuests = guests.adults + guests.children;
  const [dateRange, setDateRange] = useState<Range[]>([
    {
      startDate: undefined,
      endDate: undefined,
      key: 'selection',
    },
  ]);

  const { control, handleSubmit, setValue, reset /*, watch*/ } = useForm<SearchFormData>({
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
      Guests: { adults: 1, children: 0, infants: 0, pets: 0 },
      pageNumber: 1,
      pageSize: 10,
    },
  });

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: assertEnv.VITE_KEY_SEARCH_GOOGLE,
    libraries: ['places'],
  });

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

  useEffect(() => {
    if (autoOpenDate && checkInRef.current) {
      setAutoOpenDate(false);
      setTimeout(() => {
        setActiveSection('CheckInDate');
        setFocusedDateField('CheckInDate');
        setGuestAnchorEl(null);
        setDateAnchorEl(checkInRef.current);
      }, 140);
    }
  }, [autoOpenDate]);

  useEffect(() => {
    if (autoOpenGuests && guestsRef.current) {
      setAutoOpenGuests(false);
      setActiveSection('guests');
      setGuestAnchorEl(guestsRef.current);
      setDateAnchorEl(null);
    }
  }, [autoOpenGuests]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        guestPopoverRef.current &&
        !guestPopoverRef.current.contains(event.target as Node) &&
        guestsRef.current &&
        !guestsRef.current.contains(event.target as Node)
      ) {
        handleGuestClose();
      }
    };

    if (openGuestsPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openGuestsPopover]);

  const { data: category } = useGet<PropertySubType[]>('category1', '/Parametrics/PropertyTypes');

  const handleGuestClick = () => {
    setGuestAnchorEl(guestsRef.current);
    setActiveSection('guests');
    setDateAnchorEl(null);
    setCategoryAnchorEl(null);
  };

  const handleGuestClose = () => {
    setGuestAnchorEl(null);
    if (activeSection === 'guests') setActiveSection(null);
  };

  const handleCategoryClick = () => {
    setCategoryAnchorEl(categoryRef.current);
    setActiveSection('category');
    setDateAnchorEl(null);
    setGuestAnchorEl(null);
  };

  const handleCategoryClose = () => {
    setCategoryAnchorEl(null);
    if (activeSection === 'category') setActiveSection(null);
  };

  const handleGuestChange = (key: keyof Guests, delta: number) => {
    setGuests((prev) => {
      const newValue = Math.max(0, prev[key] + delta);

      // Validación para asegurar al menos 1 adulto
      if (key === 'adults' && newValue === 0 && prev.adults === 1) {
        return prev;
      }

      return { ...prev, [key]: newValue };
    });
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setValue('PropertyTypeId', newValue);
    handleCategoryClose();
  };

  const handleLocationChange = useCallback(() => {
    if (!locationInputRef.current || !window.google) return;

    const autocomplete = new google.maps.places.Autocomplete(locationInputRef.current, {
      types: ['geocode'],
      componentRestrictions: { country: 'bo' }, // Restringir búsqueda solo a Bolivia
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

      setLocationData(location);
      setLocationQuery(place.formatted_address || '');
      localStorage.setItem('locationData', JSON.stringify(location));
      setTimeout(() => setAutoOpenDate(true), 120);
    });
  }, []);

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
    setDateRange([
      {
        startDate: range.startDate instanceof Date ? range.startDate : undefined,
        endDate: range.endDate instanceof Date ? range.endDate : undefined,
        key: 'selection',
      },
    ]);
    if (range.endDate && focusedDateField === 'CheckOutDate') {
      setDateAnchorEl(null);
      setTimeout(() => setAutoOpenGuests(true), 120);
    }
  };

  const handleDateRangeClear = () => {
    setDateRange([{ startDate: undefined, endDate: undefined, key: 'selection' }]);
    setFocusedDateField('CheckInDate');
  };

  const handleDateRangeClose = () => {
    setFocusedDateField(null);
    setDateAnchorEl(null);
    if (dateRange[0].endDate) {
      setTimeout(() => setAutoOpenGuests(true), 0);
    }
  };

  const dateTextFieldStyles = {
    cursor: 'pointer',
    '& .MuiInputBase-root': {
      color: '#000',
      paddingRight: 0,
      cursor: 'pointer',
      '&:hover:not(.Mui-disabled):before, &:before, &:after': {
        borderBottom: 'none',
      },
    },
    '& .MuiInputBase-input': {
      padding: '4px 0 4px 0',
      cursor: 'pointer',
      color: theme.palette.customColors.primary[7],
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      fontSize: '14px',
      '&::placeholder': {
        fontFamily: theme.typography.paragraph1Regular,
        color: theme.palette.customColors.primary[7],
        opacity: 1,
      },
    },
  };

  const onSubmit = (formData: SearchFormData) => {
    // Validar con locationData directamente en lugar de formData
    if (!locationData || (!locationData.city && !locationData.state && !locationData.country)) {
      setShowAlert(true);
      setAlertMessage('Por favor, selecciona una ubicación antes de buscar.');
      return;
    }

    // Usar locationData para asegurar que tenemos los datos correctos
    const params = new URLSearchParams();
    if (locationData.street) params.set('Street', locationData.street);
    if (locationData.city) params.set('City', locationData.city);
    if (locationData.county) params.set('County', locationData.county);
    if (locationData.state) params.set('State', locationData.state);
    if (locationData.country) params.set('Country', locationData.country);
    if (locationData.postalCode) params.set('PostalCode', locationData.postalCode);
    if (locationData.latitude) params.set('Latitude', locationData.latitude.toString());
    if (locationData.longitude) params.set('Longitude', locationData.longitude.toString());
    if (formData.PropertyTypeId) params.set('PropertyTypeId', formData.PropertyTypeId.toString());
    if (formData.CheckInDate) params.set('checkIn', formatDate(formData.CheckInDate, false));
    if (formData.CheckOutDate) params.set('checkOut', formatDate(formData.CheckOutDate, false));
    if (formData.Guests) {
      const totalGuests = formData.Guests.adults + formData.Guests.children;
      if (totalGuests > 0) params.set('guests', totalGuests.toString());
    }

    localStorage.setItem(
      'search-form-storage',
      JSON.stringify({
        Street: locationData.street,
        City: locationData.city,
        County: locationData.county,
        State: locationData.state,
        Country: locationData.country,
        PostalCode: locationData.postalCode,
        Latitude: locationData.latitude,
        Longitude: locationData.longitude,
        CheckInDate: formData.CheckInDate,
        CheckOutDate: formData.CheckOutDate,
        Guests: formData.Guests,
        PropertyTypeId: formData.PropertyTypeId,
        pageNumber: 1,
        pageSize: 10,
      })
    );

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
      Guests: { adults: 1, children: 0, infants: 0, pets: 0 },
      pageNumber: 1,
      pageSize: 10,
    });
    setLocationData(null);
    setLocationQuery('');
    setGuests({ adults: 1, children: 0, infants: 0, pets: 0 });
    setDateRange([{ startDate: undefined, endDate: undefined, key: 'selection' }]);
    setGuestAnchorEl(null);
    setDateAnchorEl(null);
    setCategoryAnchorEl(null);
    setActiveSection(null);
    localStorage.removeItem('locationData');

    navigate(`/search-results?${params.toString()}`);
  };

  useEffect(() => {
    if (!category?.data) return;
    if (Array.isArray(category.data) && category.data.length > 0) {
      const firstValidTab = category.data.find(
        (item: PropertySubType) => item.propertySubtypeId != null
      );
      if (firstValidTab) {
        setActiveTab(firstValidTab.propertySubtypeId);
        setValue('PropertyTypeId', firstValidTab.propertySubtypeId);
      } else if (category.data.length > 0) {
        const fallback = category.data[0].propertySubtypeId;
        setActiveTab(fallback);
        setValue('PropertyTypeId', fallback);
      }
    }
  }, [category, setValue]);

  // Efecto para cargar datos guardados
  useEffect(() => {
    const savedData = localStorage.getItem('search-form-storage');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (parsedData.Guests) {
        setGuests(parsedData.Guests);
      }
      if (parsedData.CheckInDate && parsedData.CheckOutDate) {
        setDateRange([
          {
            startDate: new Date(parsedData.CheckInDate),
            endDate: new Date(parsedData.CheckOutDate),
            key: 'selection',
          },
        ]);
      }
      if (parsedData.PropertyTypeId) {
        setActiveTab(parsedData.PropertyTypeId);
      }
    }

    const savedLocation = localStorage.getItem('locationData');
    if (savedLocation) {
      const location = JSON.parse(savedLocation);
      setLocationData(location);
      setLocationQuery(location.city || location.state || '');
    }
  }, []);

  const clearLocation = () => {
    setLocationData(null);
    setLocationQuery('');
    if (locationInputRef.current) {
      locationInputRef.current.value = '';
    }
  };

  const getCategoryLabel = () => {
    if (!category?.data || !activeTab) return 'Tipo de propiedad';
    const selectedCategory = category.data.find((cat) => cat.propertySubtypeId === activeTab);
    return selectedCategory ? selectedCategory.subType : 'Tipo de propiedad';
  };

  return (
    <>
      <Box sx={{ width: '100%', mx: 'auto', p: { xs: 1, md: 0 } }}>
        <SnackbarAlert
          open={showAlert}
          message={alertMessage}
          severity="error"
          variant="filled"
          duration={4000}
          onClose={() => setShowAlert(false)}
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Paper
            elevation={2}
            sx={{
              borderRadius: '12px',
              height: { xs: 'auto', md: '168px' },
              overflow: 'visible',
              maxWidth: { xs: '100%', md: '85%' },
              mx: 'auto',
              p: { xs: 2, md: 2 },
              px: { xs: 2, md: '4px 0px' },
              border: '1px solid',
              borderColor: 'divider',
              position: 'relative',
              boxShadow: '0px 2px 16px rgba(0, 0, 0, 0.12)',
              background: '#fff',
            }}
          >
            <Grid
              container
              spacing={0}
              sx={{
                alignItems: 'center',
                flexDirection: { xs: 'column', md: 'row' },
                gap: { xs: 1, md: 0 },
              }}
            >
              <Grid size={{ xs: 12, md: 3 }} sx={{ width: '100%', mb: { xs: 0, md: 0 } }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    minHeight: { xs: '56px', md: '90px' },
                    border: activeSection === 'location' ? '2px solid black' : '1px solid #ddd',
                    backgroundColor: activeSection === 'location' ? '#f7f7f7' : 'transparent',
                  }}
                  onClick={() => {
                    setActiveSection('location');
                    setDateAnchorEl(null);
                    setGuestAnchorEl(null);
                    setCategoryAnchorEl(null);
                    if (locationInputRef.current) {
                      locationInputRef.current.focus();
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CiLocationArrow1 />
                    <Typography
                      sx={{
                        fontFamily: theme.typography.paragraph1Medium,
                        fontSize: '12px',
                        color: '#717171',
                      }}
                    >
                      Ubicación
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      inputRef={locationInputRef}
                      onFocus={handleLocationChange}
                      variant="outlined"
                      size={'small'}
                      placeholder="¿A dónde vas?"
                      disabled={!isLoaded}
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      sx={{
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                          padding: '4px 8px',
                          '& fieldset': { border: 'none' },
                          '&:hover fieldset': { border: 'none' },
                          '&.Mui-focused fieldset': { border: 'none' },
                        },
                        '& .MuiInputBase-input': {
                          padding: '0',
                          fontSize: '14px',
                          '&::placeholder': {
                            color: '#000',
                            opacity: 1,
                          },
                        },
                      }}
                    />
                    {locationQuery && (
                      <IconButton size="small" onClick={clearLocation} sx={{ ml: 1 }}>
                        <IoClose size={16} />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </Grid>
              {/* Selector de categoría para móvil */}
              {isMobile && (
                <Grid size={{ xs: 12 }} sx={{ width: '100%', mb: { xs: 0, md: 0 } }}>
                  <Box
                    ref={categoryRef}
                    onClick={handleCategoryClick}
                    sx={{
                      p: 1,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      minHeight: '56px',
                      border: activeSection === 'category' ? '2px solid black' : '1px solid #ddd',
                      backgroundColor: activeSection === 'category' ? '#f7f7f7' : 'transparent',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IoHomeOutline size={18} />
                      <Typography
                        sx={{
                          fontFamily: theme.typography.paragraph1Medium,
                          fontSize: '12px',
                          color: '#717171',
                        }}
                      >
                        Categoría
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        padding: '2px 0 0 0',
                        fontSize: '14px',
                        maxWidth: '100%',
                      }}
                    >
                      {getCategoryLabel()}
                    </Typography>
                  </Box>
                </Grid>
              )}

              <Grid size={{ xs: 6, md: 2.5 }} sx={{ width: '100%', mb: { xs: 0, md: 0 } }}>
                <Box
                  ref={checkInRef}
                  onClick={() => {
                    setActiveSection('CheckInDate');
                    setFocusedDateField('CheckInDate');
                    setGuestAnchorEl(null);
                    setDateAnchorEl(checkInRef.current);
                    setCategoryAnchorEl(null);
                  }}
                  tabIndex={0}
                  sx={{
                    p: 1,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    minHeight: { xs: '56px', md: '90px' },
                    border: activeSection === 'CheckInDate' ? '2px solid black' : '1px solid #ddd',
                    backgroundColor: activeSection === 'CheckInDate' ? '#f7f7f7' : 'transparent',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IoCalendarOutline size={18} />
                    <Typography
                      sx={{
                        fontFamily: theme.typography.paragraph1Medium,
                        fontSize: '12px',
                        color: '#717171',
                      }}
                    >
                      Llegada
                    </Typography>
                  </Box>
                  <Controller
                    name="CheckInDate"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        variant="standard"
                        value={formatDate(dateRange[0].startDate, true)}
                        placeholder="Fecha de entrada"
                        fullWidth
                        sx={dateTextFieldStyles}
                        slotProps={{
                          input: { disableUnderline: true, readOnly: true },
                          inputLabel: { shrink: false },
                        }}
                      />
                    )}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 6, md: 2.5 }} sx={{ width: '100%', mb: { xs: 0, md: 0 } }}>
                <Box
                  ref={checkOutRef}
                  onClick={() => {
                    setActiveSection('CheckOutDate');
                    setFocusedDateField('CheckOutDate');
                    setGuestAnchorEl(null);
                    setDateAnchorEl(checkOutRef.current);
                    setCategoryAnchorEl(null);
                  }}
                  tabIndex={0}
                  sx={{
                    p: 1,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    minHeight: { xs: '56px', md: '90px' },
                    border: activeSection === 'CheckOutDate' ? '2px solid black' : '1px solid #ddd',
                    backgroundColor: activeSection === 'CheckOutDate' ? '#f7f7f7' : 'transparent',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IoCalendarOutline size={18} />
                    <Typography
                      sx={{
                        fontFamily: theme.typography.paragraph1Medium,
                        fontSize: '12px',
                        color: '#717171',
                      }}
                    >
                      Salida
                    </Typography>
                  </Box>
                  <Controller
                    name="CheckOutDate"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        variant="standard"
                        value={formatDate(dateRange[0].endDate, true)}
                        placeholder="Fecha de salida"
                        fullWidth
                        sx={dateTextFieldStyles}
                        slotProps={{
                          input: { disableUnderline: true, readOnly: true },
                          inputLabel: { shrink: false },
                        }}
                      />
                    )}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 9, md: 2.6 }} sx={{ width: '100%', mb: { xs: 0, md: 0 } }}>
                <Box
                  ref={guestsRef}
                  onClick={handleGuestClick}
                  sx={{
                    p: 1,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    minHeight: { xs: '56px', md: '90px' },
                    border: activeSection === 'guests' ? '2px solid black' : '1px solid #ddd',
                    backgroundColor: activeSection === 'guests' ? '#f7f7f7' : 'transparent',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BiUser size={18} />
                    <Typography
                      sx={{
                        fontFamily: theme.typography.paragraph1Medium,
                        fontSize: '12px',
                        color: '#717171',
                      }}
                    >
                      Huéspedes
                    </Typography>
                  </Box>
                  <Controller
                    name="Guests"
                    control={control}
                    render={() => (
                      <Typography
                        noWrap
                        sx={{
                          padding: '2px 0 0 0',
                          fontSize: '14px',
                          maxWidth: '100%',
                        }}
                      >
                        {totalGuests > 0
                          ? `${totalGuests} Huesped${totalGuests !== 1 ? 'es' : ''}${
                              guests.infants > 0
                                ? `, ${guests.infants} Infante${guests.infants !== 1 ? 's' : ''}`
                                : ''
                            }${
                              guests.pets > 0
                                ? `, ${guests.pets} Mascota${guests.pets !== 1 ? 's' : ''}`
                                : ''
                            }`
                          : '¿Cuántos?'}
                      </Typography>
                    )}
                  />
                </Box>
              </Grid>

              <Grid
                size={{ xs: 3, md: 1.4 }}
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: { xs: 'flex-end', md: 'flex-end' },
                  alignItems: 'center',
                  mb: { xs: 0, md: 0 },
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  size="small"
                  sx={{
                    borderRadius: isMobile ? '12px' : '50%',
                    minWidth: isMobile ? '100%' : '34px',
                    height: isMobile ? '56px' : '34px',
                    padding: 0,
                    width: isMobile ? '100%' : '34px',
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: 'none',
                      backgroundColor: '#202020',
                    },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.palette.customColors.primary[1],
                    color: 'white',
                    transition: 'transform 0.2s ease-in-out',
                    '&:active': { transform: 'scale(0.95)' },
                    fontSize: isMobile ? '24px' : 'inherit',
                  }}
                >
                  {isMobile ? (
                    <Box display={'flex'}>
                      <SearchIcon />
                      <Typography variant="subtitle2">Buscar</Typography>
                    </Box>
                  ) : (
                    <SearchIcon fontSize="small" />
                  )}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </form>

        {/* Popover para categorías (solo móvil) */}
        {isMobile && (
          <Popover
            open={openCategoryPopover}
            anchorEl={categoryAnchorEl}
            onClose={handleCategoryClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            sx={{
              mt: 1,
              '& .MuiPaper-root': {
                borderRadius: '12px',
                p: 2,
                width: '90vw',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                maxHeight: '60vh',
                overflowY: 'auto',
              },
              zIndex: theme.zIndex.modal,
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Tipo de propiedad
              </Typography>
              <Stack spacing={1}>
                {category?.data && Array.isArray(category.data) && category.data.length > 0 ? (
                  category.data
                    .filter((item: PropertySubType) => item.propertySubtypeId != null)
                    .map((categoryItem: PropertySubType) => (
                      <Box
                        key={categoryItem.propertySubtypeId}
                        onClick={(event) => handleTabChange(event, categoryItem.propertySubtypeId)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 2,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          backgroundColor:
                            activeTab === categoryItem.propertySubtypeId
                              ? '#f7f7f7'
                              : 'transparent',
                          '&:hover': {
                            backgroundColor: '#f7f7f7',
                          },
                        }}
                      >
                        <Typography sx={{ flex: 1 }}>{categoryItem.subType}</Typography>
                        {activeTab === categoryItem.propertySubtypeId && (
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              backgroundColor: 'black',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                            }}
                          >
                            ✓
                          </Box>
                        )}
                      </Box>
                    ))
                ) : (
                  <Typography>No hay categorías disponibles</Typography>
                )}
              </Stack>
            </Box>
          </Popover>
        )}

        {/* Popover para huéspedes */}
        <Popover
          open={openGuestsPopover}
          anchorEl={guestAnchorEl}
          onClose={handleGuestClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          disableRestoreFocus
          slotProps={{
            paper: { ref: guestPopoverRef },
          }}
          sx={{
            mt: 1,
            '& .MuiPaper-root': {
              borderRadius: '12px',
              p: 3,
              width: { xs: '90vw', md: 350 },
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            },
            zIndex: theme.zIndex.modal,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Huéspedes
            </Typography>
            <Stack spacing={2}>
              {[
                { id: 1, key: 'adults', label: 'Adultos', description: '13 años o más' },
                { id: 2, key: 'children', label: 'Niños', description: 'De 2 a 12 años' },
                { id: 3, key: 'infants', label: 'Bebés', description: 'Menos de 2' },
                {
                  id: 4,
                  key: 'pets',
                  label: 'Mascotas',
                  description: '¿Traes a un animal de servicio?',
                },
              ].map((item) => (
                <React.Fragment key={item.id}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 500, fontSize: '16px' }}>
                        {item.label}
                      </Typography>
                      <Typography
                        sx={{
                          color: '#717171',
                          fontSize: '14px',
                        }}
                      >
                        {item.description}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        onClick={() => handleGuestChange(item.key as keyof Guests, -1)}
                        disabled={
                          guests[item.key as keyof Guests] === 0 ||
                          (item.key === 'adults' && guests.adults === 1)
                        }
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          color:
                            guests[item.key as keyof Guests] === 0 ? 'action.disabled' : 'inherit',
                          width: 32,
                          height: 32,
                        }}
                        size="small"
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography sx={{ width: 20, textAlign: 'center', fontWeight: 500 }}>
                        {guests[item.key as keyof Guests]}
                      </Typography>
                      <IconButton
                        onClick={() => handleGuestChange(item.key as keyof Guests, 1)}
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          width: 32,
                          height: 32,
                        }}
                        size="small"
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  {item.id < 4 && <Divider />}
                </React.Fragment>
              ))}
            </Stack>
          </Box>
        </Popover>

        {/* Popover para fechas */}
        <Popover
          open={openDatePopover}
          anchorEl={dateAnchorEl}
          onClose={handleDateRangeClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{
            mt: 1,
            '& .MuiPaper-root': {
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              p: 0,
              width: { xs: '100%', md: 'auto' },
              overflow: 'hidden',
            },
            zIndex: theme.zIndex.modal + 1,
          }}
        >
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Selecciona fechas
            </Typography>
            <DateRange
              className="custom-date-range"
              ranges={dateRange}
              onChange={handleDateRangeSelect}
              months={isMobile ? 1 : 2}
              direction="horizontal"
              rangeColors={['#000']}
              showDateDisplay={false}
              locale={es}
              minDate={new Date()}
              editableDateInputs={false}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                mt: 2,
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              <Button
                variant="outlined"
                size="small"
                onClick={handleDateRangeClear}
                sx={{
                  textTransform: 'none',
                  borderRadius: '8px',
                  borderColor: '#ddd',
                  color: '#000',
                  '&:hover': {
                    borderColor: '#000',
                  },
                }}
              >
                Limpiar
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleDateRangeClose}
                sx={{
                  textTransform: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#000',
                  '&:hover': {
                    backgroundColor: '#333',
                  },
                }}
              >
                Aplicar
              </Button>
            </Box>
          </Box>
        </Popover>
      </Box>
    </>
  );
};

export default MobileAssertSearchWithGoogle;
