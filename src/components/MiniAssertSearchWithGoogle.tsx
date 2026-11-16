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
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import { format, startOfDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DateRange, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { Controller, useForm } from 'react-hook-form';
import { BiUser } from 'react-icons/bi';
import { IoCalendarOutline } from 'react-icons/io5';
import { useSearchParams } from 'react-router-dom';
import SnackbarAlert from './SnackbarAlert';
import { CiLocationArrow1 } from 'react-icons/ci';
//import { normalizeDate } from '@/utilities/dateUtils';
import { formatDate, normalizeDate } from '@/utilities/dateUtils';

interface LocationData {
  latitude: number;
  longitude: number;
  country?: string;
  state?: string;
  county?: string;
  city?: string;
  street?: string;
  postalCode?: string;
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
  Longitude?: number;
  Latitude?: number;
  PropertyTypeId?: number | null;
  pageNumber?: number;
  pageSize?: number;
}

interface MiniAssertSearchProps {
  onSearch: (data: SearchFormData) => void;
  initialData?: SearchFormData | null;
  isLoaded: boolean;
}

const MiniAssertSearchWithGoogle: React.FC<MiniAssertSearchProps> = ({
  onSearch,
  initialData,
  isLoaded,
}) => {
  const theme = useTheme();
  const [searchParams] = useSearchParams();

  // Initialize form with initialData
  const initialFormData = useMemo(() => {
    if (initialData) {
      return {
        ...initialData,
        CheckInDate: initialData.CheckInDate ? normalizeDate(initialData.CheckInDate) : null,
        CheckOutDate: initialData.CheckOutDate ? normalizeDate(initialData.CheckOutDate) : null,
      };
    }
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
  }, [initialData]);

  const [, setLocationData] = useState<LocationData | null>(() => {
    if (initialFormData) {
      return {
        latitude: initialFormData.Latitude || 0,
        longitude: initialFormData.Longitude || 0,
        street: initialFormData.Street,
        city: initialFormData.City,
        county: initialFormData.County,
        state: initialFormData.State,
        country: initialFormData.Country,
        postalCode: initialFormData.PostalCode,
      };
    }
    const lastCity = localStorage.getItem('last-city');
    if (lastCity) {
      try {
        const parsed = JSON.parse(lastCity) as LocationData;
        return parsed;
      } catch {
        localStorage.removeItem('last-city');
      }
    }
    return null;
  });

  const [text, setText] = useState<string>(
    initialFormData?.City || initialFormData?.State || initialFormData?.Country || ''
  );
  const [guestAnchorEl, setGuestAnchorEl] = useState<null | HTMLElement>(null);
  const [dateAnchorEl, setDateAnchorEl] = useState<null | HTMLElement>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [focusedDateField, setFocusedDateField] = useState<'CheckInDate' | 'CheckOutDate' | null>(
    null
  );
  const [autoOpenDate, setAutoOpenDate] = useState(false);
  const [autoOpenGuests, setAutoOpenGuests] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const checkInRef = useRef<HTMLDivElement>(null);
  const checkOutRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);

  const openGuestsPopover = Boolean(guestAnchorEl);
  const openDatePopover = Boolean(dateAnchorEl);
  const locationInputRef = useRef<HTMLInputElement>(null);

  const [guests, setGuests] = useState<Guests>(
    initialFormData?.Guests || { adults: 0, children: 0, infants: 0, pets: 0 }
  );
  const totalGuests = guests.adults + guests.children;
  const [dateRange, setDateRange] = useState<
    { startDate: Date | undefined; endDate: Date | undefined; key: string }[]
  >([
    {
      startDate: initialFormData?.CheckInDate ? parseISO(initialFormData.CheckInDate) : undefined,
      endDate: initialFormData?.CheckOutDate ? parseISO(initialFormData.CheckOutDate) : undefined,
      key: 'selection',
    },
  ]);

  // Validate dateRange to ensure no invalid dates
  useEffect(() => {
    setDateRange((prev) => {
      const startDate =
        prev[0].startDate && !isNaN(prev[0].startDate.getTime()) ? prev[0].startDate : undefined;
      const endDate =
        prev[0].endDate && !isNaN(prev[0].endDate.getTime()) ? prev[0].endDate : undefined;
      return [{ startDate, endDate, key: 'selection' }];
    });
  }, []);

  const { control, handleSubmit, setValue, reset } = useForm<SearchFormData>({
    defaultValues: {
      CheckInDate: initialFormData?.CheckInDate,
      CheckOutDate: initialFormData?.CheckOutDate,
      Guests: initialFormData?.Guests || { adults: 0, children: 0, infants: 0, pets: 0 },
      Street: initialFormData?.Street,
      City: initialFormData?.City,
      County: initialFormData?.County,
      State: initialFormData?.State,
      Country: initialFormData?.Country,
      PostalCode: initialFormData?.PostalCode,
      Longitude: initialFormData?.Longitude,
      Latitude: initialFormData?.Latitude,
      PropertyTypeId: initialFormData?.PropertyTypeId,
      pageNumber: 1,
      pageSize: 10,
    },
  });

  // Synchronize form with initialData when it changes
  useEffect(() => {
    if (initialData) {
      const checkIn = normalizeDate(initialData.CheckInDate);
      const checkOut = normalizeDate(initialData.CheckOutDate);
      setValue('CheckInDate', checkIn);
      setValue('CheckOutDate', checkOut);
      setValue('Guests', initialData.Guests || { adults: 0, children: 0, infants: 0, pets: 0 });
      setValue('Street', initialData.Street);
      setValue('City', initialData.City);
      setValue('County', initialData.County);
      setValue('State', initialData.State);
      setValue('Country', initialData.Country);
      setValue('PostalCode', initialData.PostalCode);
      setValue('Longitude', initialData.Longitude);
      setValue('Latitude', initialData.Latitude);
      setValue('PropertyTypeId', initialData.PropertyTypeId);

      setDateRange([
        {
          startDate: checkIn ? parseISO(checkIn) : undefined,
          endDate: checkOut ? parseISO(checkOut) : undefined,
          key: 'selection',
        },
      ]);
      setGuests(initialData.Guests || { adults: 0, children: 0, infants: 0, pets: 0 });
      setLocationData({
        latitude: initialData.Latitude || 0,
        longitude: initialData.Longitude || 0,
        street: initialData.Street,
        city: initialData.City,
        county: initialData.County,
        state: initialData.State,
        country: initialData.Country,
        postalCode: initialData.PostalCode,
      });
      setText(initialData.City || initialData.State || initialData.Country || '');
    }
  }, [initialData, setValue]);

  // Synchronize with URL parameters
  useEffect(() => {
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guestsParam = searchParams.get('guests');
    const longitude = searchParams.get('Longitude');
    const latitude = searchParams.get('Latitude');
    const propertyTypeId = searchParams.get('PropertyTypeId');
    const street = searchParams.get('Street');
    const city = searchParams.get('City');
    const county = searchParams.get('County');
    const state = searchParams.get('State');
    const country = searchParams.get('Country');
    const postalCode = searchParams.get('PostalCode');

    if (checkIn || checkOut) {
      const normalizedCheckIn = normalizeDate(checkIn);
      const normalizedCheckOut = normalizeDate(checkOut);
      setDateRange([
        {
          startDate: normalizedCheckIn ? parseISO(normalizedCheckIn) : undefined,
          endDate: normalizedCheckOut ? parseISO(normalizedCheckOut) : undefined,
          key: 'selection',
        },
      ]);
      setValue('CheckInDate', normalizedCheckIn, { shouldValidate: true, shouldDirty: true });
      setValue('CheckOutDate', normalizedCheckOut, { shouldValidate: true, shouldDirty: true });
    }

    if (guestsParam) {
      const total = Number(guestsParam);
      setGuests((prev) => {
        const newGuests = {
          ...prev,
          adults:
            total > prev.children + prev.infants + prev.pets
              ? total - (prev.children + prev.infants + prev.pets)
              : prev.adults,
        };
        setValue('Guests', newGuests, { shouldValidate: true, shouldDirty: true });
        return newGuests;
      });
    }

    if (longitude || latitude || street || city || county || state || country || postalCode) {
      const newLocationData: LocationData = {
        latitude: Number(latitude) || 0,
        longitude: Number(longitude) || 0,
        street: street || undefined,
        city: city || undefined,
        county: county || undefined,
        state: state || undefined,
        country: country || undefined,
        postalCode: postalCode || undefined,
      };
      setLocationData(newLocationData);
      setText(city || state || country || '');
      setValue('Longitude', newLocationData.longitude);
      setValue('Latitude', newLocationData.latitude);
      setValue('Street', newLocationData.street);
      setValue('City', newLocationData.city);
      setValue('County', newLocationData.county);
      setValue('State', newLocationData.state);
      setValue('Country', newLocationData.country);
      setValue('PostalCode', newLocationData.postalCode);
    }

    if (propertyTypeId) {
      setValue('PropertyTypeId', Number(propertyTypeId));
    }
  }, [searchParams, setValue]);

  const handleLocationChange = () => {
    if (!isLoaded || !locationInputRef.current || !window.google) return;

    const autocomplete = new google.maps.places.Autocomplete(locationInputRef.current);
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
      localStorage.setItem('last-city', JSON.stringify(location));
      setText(location.city || location.state || location.country || '');
      setValue('Longitude', location.longitude);
      setValue('Latitude', location.latitude);
      setValue('Street', location.street);
      setValue('City', location.city);
      setValue('County', location.county);
      setValue('State', location.state);
      setValue('Country', location.country);
      setValue('PostalCode', location.postalCode);
      setTimeout(() => setAutoOpenDate(true), 120);
    });
  };

  const handleGuestChange = (key: keyof Guests, delta: number) => {
    setGuests((prev) => {
      const newGuests = { ...prev, [key]: Math.max(0, prev[key] + delta) };
      setValue('Guests', newGuests, { shouldValidate: true, shouldDirty: true });
      return newGuests;
    });
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
    setDateRange([{ startDate, endDate, key: 'selection' }]);
    setValue('CheckInDate', startDate ? format(startDate, 'yyyy-MM-dd') : null, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue('CheckOutDate', endDate ? format(endDate, 'yyyy-MM-dd') : null, {
      shouldValidate: true,
      shouldDirty: true,
    });
    if (endDate && !isNaN(endDate.getTime()) && focusedDateField === 'CheckOutDate') {
      setDateAnchorEl(null);
      setActiveSection(null);
      setTimeout(() => setAutoOpenGuests(true), 120);
    }
  };

  const handleDateRangeClear = () => {
    setDateRange([{ startDate: undefined, endDate: undefined, key: 'selection' }]);
    setValue('CheckInDate', null, { shouldValidate: true, shouldDirty: true });
    setValue('CheckOutDate', null, { shouldValidate: true, shouldDirty: true });
    setFocusedDateField('CheckInDate');
  };

  const handleDateRangeClose = () => {
    setDateAnchorEl(null);
    setFocusedDateField(null);
    setActiveSection(null);
    if (dateRange[0].endDate && !isNaN(dateRange[0].endDate.getTime())) {
      setTimeout(() => setAutoOpenGuests(true), 120);
    }
  };

  const onSubmit = (data: SearchFormData) => {
    if (!data.City && !data.State && !data.Country && !data.County && !data.Street) {
      setShowAlert(true);
      setAlertMessage('Por favor, selecciona una ubicación antes de buscar.');
      return;
    }

    const searchData: SearchFormData = {
      CheckInDate: normalizeDate(data.CheckInDate),
      CheckOutDate: normalizeDate(data.CheckOutDate),
      Guests: data.Guests,
      Street: data.Street,
      City: data.City,
      County: data.County,
      State: data.State,
      Country: data.Country,
      PostalCode: data.PostalCode,
      Latitude: data.Latitude,
      Longitude: data.Longitude,
      PropertyTypeId: data.PropertyTypeId || initialData?.PropertyTypeId,
      pageNumber: 1,
      pageSize: 10,
    };

    try {
      localStorage.setItem('search-form-storage', JSON.stringify(searchData));
      console.log('Saved to localStorage:', searchData);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      setShowAlert(true);
      setAlertMessage('Error al guardar los datos de búsqueda.');
      return;
    }

    onSearch(searchData);

    // Reset form to submitted values
    reset({
      CheckInDate: searchData.CheckInDate,
      CheckOutDate: searchData.CheckOutDate,
      Guests: searchData.Guests,
      Street: searchData.Street,
      City: searchData.City,
      County: searchData.County,
      State: searchData.State,
      Country: searchData.Country,
      PostalCode: searchData.PostalCode,
      Longitude: searchData.Longitude,
      Latitude: searchData.Latitude,
      PropertyTypeId: searchData.PropertyTypeId,
      pageNumber: 1,
      pageSize: 10,
    });
  };

  useEffect(() => {
    if (autoOpenDate && checkInRef.current) {
      setAutoOpenDate(false);
      setActiveSection('CheckInDate');
      setFocusedDateField('CheckInDate');
      setGuestAnchorEl(null);
      setDateAnchorEl(checkInRef.current);
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

  // Estilos para los campos de fecha
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
      padding: '8px 0px 4px 10px',
      cursor: 'pointer',
      color: theme.palette.customColors.primary[7],
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      '&::placeholder': {
        fontFamily: theme.typography.paragraph1Regular,
        color: theme.palette.customColors.primary[7],
        opacity: 1,
      },
    },
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
              borderRadius: '9px',
              height: { xs: 'auto', md: '120px' },
              overflow: 'visible',
              maxWidth: { xs: '100%', md: '100%' },
              mx: 'auto',
              p: { xs: 1, md: 2 },
              px: { xs: 2, md: '4px 0px' },
              border: '1px solid',
              borderColor: 'divider',
              position: 'relative',
              boxShadow: '0px 2px 5px gray',
              background:
                'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 60%, rgba(255,255,255,0.6) 100%)',
            }}
          >
            <Grid
              container
              spacing={0}
              sx={{ alignItems: 'center', mt: 2, flexDirection: { xs: 'column', md: 'row' } }}
            >
              <Grid size={{ xs: 12, md: 3.5 }} sx={{ width: '100%', mb: { xs: 1, md: 0 } }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: '30px',
                    cursor: 'pointer',
                    minHeight: { xs: '60px', md: '90px' },
                  }}
                >
                  <Box sx={{ flex: 1, backgroundColor: 'transparent', display: 'flex' }}>
                    <CiLocationArrow1 size={40} style={{ marginTop: 0 }} />
                    {/* <Typography
                      sx={{ fontFamily: theme.typography.paragraph1Medium, marginLeft: '16px' }}
                    >
                      Ubicación
                    </Typography> */}
                    <TextField
                      inputRef={locationInputRef}
                      onFocus={handleLocationChange}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      variant="outlined"
                      size={'small'}
                      placeholder="¿Dónde?"
                      disabled={!isLoaded}
                      sx={{
                        pt: '0px',
                        ml: '0px',
                        '& .MuiOutlinedInput-root.MuiInputBase-sizeSmall': {
                          paddingTop: '0px',
                          paddingBottom: '6px',
                          paddingLeft: '6px',
                        },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { border: 'none' },
                          '&:hover fieldset': { border: 'none' },
                          '&.Mui-focused fieldset': { border: 'none' },
                        },
                        '& .MuiInputBase-input::placeholder': {
                          fontFamily: theme.typography.paragraph1Regular,
                          color: '#000',
                          opacity: 1,
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 2.5 }} sx={{ width: '100%', mb: { xs: 1, md: 0 } }}>
                <Box
                  ref={checkInRef}
                  onClick={() => {
                    setActiveSection('CheckInDate');
                    setFocusedDateField('CheckInDate');
                    setGuestAnchorEl(null);
                    setDateAnchorEl(checkInRef.current);
                  }}
                  tabIndex={0}
                  sx={{
                    p: 1,
                    borderRadius: '30px',
                    cursor: 'pointer',
                    ...(activeSection === 'CheckInDate' && {
                      backgroundColor: 'action.selected',
                      boxShadow: '0 3px 5px rgba(0,0,0,0.1)',
                    }),
                    minHeight: { xs: '60px', md: '90px' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 0 }}>
                    <IoCalendarOutline size={24} />
                    {/* <Typography sx={{ fontFamily: theme.typography.paragraph1Medium }}>
                      Llegada
                    </Typography> */}
                    <Controller
                      name="CheckInDate"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          variant="standard"
                          value={formatDate(field.value, true)}
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
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 2.5 }} sx={{ width: '100%', mb: { xs: 1, md: 0 } }}>
                <Box
                  ref={checkOutRef}
                  onClick={() => {
                    setActiveSection('CheckOutDate');
                    setFocusedDateField('CheckOutDate');
                    setGuestAnchorEl(null);
                    setDateAnchorEl(checkOutRef.current);
                  }}
                  tabIndex={0}
                  sx={{
                    p: 1,
                    borderRadius: '30px',
                    cursor: 'pointer',
                    ...(activeSection === 'CheckOutDate' && {
                      backgroundColor: 'action.selected',
                      boxShadow: '0 3px 5px rgba(0,0,0,0.1)',
                    }),
                    minHeight: { xs: '60px', md: '90px' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 0 }}>
                    <IoCalendarOutline size={24} />
                    {/* <Typography sx={{ fontFamily: theme.typography.paragraph1Medium }}>
                      Salida
                    </Typography> */}
                    <Controller
                      name="CheckOutDate"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          variant="standard"
                          value={formatDate(field.value, true)}
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
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 2 }} sx={{ width: '100%', mb: { xs: 1, md: 0 } }}>
                <Box
                  ref={guestsRef}
                  onClick={() => {
                    setActiveSection('guests');
                    setGuestAnchorEl(guestsRef.current);
                    setDateAnchorEl(null);
                  }}
                  sx={{
                    p: 1,
                    pl: 2,
                    borderRadius: '30px',
                    cursor: 'pointer',
                    ...(activeSection === 'guests' && {
                      backgroundColor: 'action.selected',
                      boxShadow: '0 3px 5px rgba(0,0,0,0.1)',
                    }),
                    minHeight: { xs: '60px', md: '90px' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BiUser size={24} />
                    {/* <Typography sx={{ fontFamily: theme.typography.paragraph1Medium }}>
                      Huéspedes
                    </Typography> */}
                    <Controller
                      name="Guests"
                      control={control}
                      render={() => (
                        <Typography
                          noWrap
                          sx={{
                            padding: '6px 0 4px 5px',
                            '& input::placeholder': {
                              fontFamily: theme.typography.paragraph1SRegular,
                            },
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
                            : 'Cantidad de huéspedes'}
                        </Typography>
                      )}
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid
                size={{ xs: 12, md: 1.4 }}
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: { xs: 'center', md: 'flex-end' },
                  alignItems: 'center',
                  mb: { xs: 1, md: 6 },
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    borderRadius: '50%',
                    minWidth: '34px',
                    height: '34px',
                    padding: 0,
                    width: { xs: '34px', md: '34px' },
                    boxShadow: 'none',
                    '&:hover': { boxShadow: 'none' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'black',
                    color: 'white',
                    transition: 'transform 0.2s ease-in-out',
                    '&:active': { transform: 'scale(1.1)' },
                  }}
                >
                  <SearchIcon fontSize="small" />
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </form>

        <Popover
          open={openGuestsPopover}
          anchorEl={guestAnchorEl}
          onClose={() => {
            setGuestAnchorEl(null);
            setActiveSection(null);
          }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          disableRestoreFocus
          sx={{
            mt: 1.5,
            '& .MuiPaper-root': {
              borderRadius: '6px',
              pl: 3,
              pr: 3,
              pt: 3,
              width: { xs: '90vw', md: 350 },
              boxShadow: 'rgba(0, 0, 0, 0.15) 0px 10px 30px 0px',
            },
            zIndex: theme.zIndex.modal,
          }}
        >
          <Box>
            <Stack spacing={2}>
              {[
                { key: 'adults', label: 'Adultos', description: '13 años o más' },
                { key: 'children', label: 'Niños', description: 'De 2 a 12 años' },
                { key: 'infants', label: 'Bebés', description: 'Menos de 2' },
                { key: 'pets', label: 'Mascotas', description: '¿Traes a un animal de servicio?' },
              ].map((item) => (
                <React.Fragment key={item.key}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Box>
                      <Typography sx={{ fontFamily: theme.typography.paragraph1Medium }}>
                        {item.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: theme.typography.paragraph1SRegular,
                          color: theme.palette.customColors.primary[3],
                        }}
                      >
                        {item.description}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        onClick={() => handleGuestChange(item.key as keyof Guests, -1)}
                        disabled={guests[item.key as keyof Guests] === 0}
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          color:
                            guests[item.key as keyof Guests] === 0 ? 'action.disabled' : 'inherit',
                        }}
                        size="small"
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography sx={{ width: 20, textAlign: 'center' }}>
                        {guests[item.key as keyof Guests]}
                      </Typography>
                      <IconButton
                        onClick={() => handleGuestChange(item.key as keyof Guests, 1)}
                        sx={{ border: '1px solid', borderColor: 'divider' }}
                        size="small"
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Divider />
                </React.Fragment>
              ))}
            </Stack>
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
            zIndex: theme.zIndex.modal + 1,
          }}
        >
          <Box sx={{ p: 2, maxWidth: '100%', display: 'flex', flexDirection: 'column' }}>
            <DateRange
              ranges={dateRange}
              onChange={handleDateRangeSelect}
              months={2}
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
                px: 2,
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleDateRangeClear}
                  color="secondary"
                  sx={{
                    textTransform: 'none',
                    minWidth: 120,
                    borderColor: (theme) => theme.palette.error.main,
                  }}
                >
                  Limpiar
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={handleDateRangeClose}
                  sx={{
                    textTransform: 'none',
                    minWidth: 120,
                  }}
                >
                  Cerrar
                </Button>
              </Stack>
            </Box>
          </Box>
        </Popover>
      </Box>
    </>
  );
};

export default MiniAssertSearchWithGoogle;
