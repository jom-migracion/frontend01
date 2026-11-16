import { useGet } from '@/hooks/api';
import { Add as AddIcon, Remove as RemoveIcon, Search as SearchIcon } from '@mui/icons-material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Popover,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import { format, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DateRange, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { Controller, useForm } from 'react-hook-form';
import { BiUser } from 'react-icons/bi';
import { CiLocationArrow1 } from 'react-icons/ci';
import { IoCalendarOutline } from 'react-icons/io5';
import { useNavigate, useSearchParams } from 'react-router';
import SnackbarAlert from './SnackbarAlert';

// ------------- INTERFACES -------------
interface Location {
  id: string;
  name: string;
  description: string;
  type: number;
  typeDesc: string;
  entityId: number;
  latitude: number;
  longitude: number;
}

interface Guests {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

interface SearchFormData {
  CheckInDate?: Date | null;
  CheckOutDate?: Date | null;
  Guests: Guests;
  CityName?: string;
  typeDesc?: string;
  CityId?: number;
  StateId?: number;
  Longitude?: number;
  Latitude?: number;
  CountryId?: number;
  CountyId?: number;
  PropertyTypeId?: number;
  pageNumber?: number;
  pageSize?: number;
}

// Normalizar fecha para evitar problemas de zona horaria
const normalizeDate = (date: string | Date | null | undefined): Date | null => {
  if (!date) return null;
  if (typeof date === 'string') {
    const [year, month, day] = date.split('-').map(Number);
    return startOfDay(new Date(year, month - 1, day));
  }
  if (date instanceof Date && !isNaN(date.getTime())) {
    return startOfDay(date);
  }
  return null;
};

// Formatear fecha para URL y visualización
const formatDate = (date: Date | null | undefined, forDisplay: boolean = false) => {
  if (!date) return '';
  if (typeof date === 'string') {
    const normalized = normalizeDate(date);
    if (!normalized) return '';
    return forDisplay
      ? format(normalized, 'dd MMM yyyy', { locale: es })
      : format(normalized, 'yyyy-MM-dd');
  }
  if (date instanceof Date && !isNaN(date.getTime())) {
    const normalized = normalizeDate(date);
    if (!normalized) return '';
    return forDisplay
      ? format(normalized, 'dd MMM yyyy', { locale: es })
      : format(normalized, 'yyyy-MM-dd');
  }
  return '';
};

// Prop types for MiniAssertSearch
interface MiniAssertSearchProps {
  onSearch?: (data: SearchFormData) => void;
}

// ------------- COMPONENTE PRINCIPAL -------------
const MiniAssertSearch: React.FC<MiniAssertSearchProps> = ({ onSearch }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Carga inicial desde localStorage
  const initialFormData = useMemo(() => {
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
    return null;
  }, []);

  const [selectedCityObject, setSelectedCityObject] = useState<Location | null>(() => {
    if (initialFormData?.CityName) {
      return {
        id: initialFormData.CityName,
        name: initialFormData.CityName,
        description: initialFormData.typeDesc || '',
        type:
          initialFormData.typeDesc === 'city'
            ? 1
            : initialFormData.typeDesc === 'state'
              ? 2
              : initialFormData.typeDesc === 'country'
                ? 3
                : 4,
        typeDesc: initialFormData.typeDesc || '',
        entityId:
          initialFormData.CityId ||
          initialFormData.StateId ||
          initialFormData.CountryId ||
          initialFormData.CountyId ||
          0,
        longitude: 0,
        latitude: 0,
      };
    }
    const lastCity = localStorage.getItem('last-city');
    if (lastCity) {
      try {
        return JSON.parse(lastCity);
      } catch {
        localStorage.removeItem('last-city');
      }
    }
    return null;
  });
  const [text, setText] = useState<string>(selectedCityObject?.name || '');
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
  const whereContainerRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);

  const openGuestsPopover = Boolean(guestAnchorEl);
  const openDatePopover = Boolean(dateAnchorEl);

  const [guests, setGuests] = useState<Guests>(
    initialFormData?.Guests || { adults: 0, children: 0, infants: 0, pets: 0 }
  );
  // const totalGuests = guests.adults + guests.children + guests.infants + guests.pets;
  const totalGuests = guests.adults + guests.children;
  const [dateRange, setDateRange] = useState<
    { startDate: Date | null; endDate: Date | null; key: string }[]
  >([
    {
      startDate: initialFormData?.CheckInDate ? normalizeDate(initialFormData.CheckInDate) : null,
      endDate: initialFormData?.CheckOutDate ? normalizeDate(initialFormData.CheckOutDate) : null,
      key: 'selection',
    },
  ]);

  const { control, handleSubmit, setValue } = useForm<SearchFormData>({
    defaultValues: {
      CheckInDate: initialFormData?.CheckInDate ? normalizeDate(initialFormData.CheckInDate) : null,
      CheckOutDate: initialFormData?.CheckOutDate
        ? normalizeDate(initialFormData.CheckOutDate)
        : null,
      Guests: initialFormData?.Guests || { adults: 0, children: 0, infants: 0, pets: 0 },
      CityName: initialFormData?.CityName,
      CityId: initialFormData?.CityId,
      StateId: initialFormData?.StateId,
      CountryId: initialFormData?.CountryId,
      CountyId: initialFormData?.CountyId,
      typeDesc: initialFormData?.typeDesc,
      Longitude: initialFormData?.Longitude,
      Latitude: initialFormData?.Latitude,
      PropertyTypeId: initialFormData?.PropertyTypeId,
      pageNumber: 1,
      pageSize: 10,
    },
  });

  // Sincronizar estado con parámetros de la URL
  useEffect(() => {
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guestsParam = searchParams.get('guests');
    const cityId = searchParams.get('CityId');
    const stateId = searchParams.get('StateId');
    const countryId = searchParams.get('CountryId');
    const countyId = searchParams.get('CountyId');
    const longitude = searchParams.get('Longitude');
    const latitude = searchParams.get('Latitude');
    const PropertyTypeId = searchParams.get('PropertyTypeId');

    if (
      checkIn ||
      checkOut ||
      guestsParam ||
      cityId ||
      stateId ||
      countryId ||
      countyId ||
      longitude ||
      latitude ||
      PropertyTypeId
    ) {
      setDateRange((prev) => {
        const newRange = [
          {
            startDate: checkIn ? normalizeDate(checkIn) : prev[0].startDate,
            endDate: checkOut ? normalizeDate(checkOut) : prev[0].endDate,
            key: 'selection',
          },
        ];
        setValue('CheckInDate', newRange[0].startDate, { shouldValidate: true, shouldDirty: true });
        setValue('CheckOutDate', newRange[0].endDate, { shouldValidate: true, shouldDirty: true });
        return newRange;
      });

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

      if (cityId || stateId || countryId || countyId) {
        const stored = localStorage.getItem('last-city');
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as Location;
            setSelectedCityObject(parsed);
            setText(parsed.name);
            setValue('CityName', parsed.name, { shouldValidate: true, shouldDirty: true });
            setValue('typeDesc', parsed.typeDesc, { shouldValidate: true, shouldDirty: true });
            setValue('CityId', parsed.typeDesc === 'city' ? parsed.entityId : undefined, {
              shouldValidate: true,
              shouldDirty: true,
            });
            setValue('StateId', parsed.typeDesc === 'state' ? parsed.entityId : undefined, {
              shouldValidate: true,
              shouldDirty: true,
            });
            setValue('CountryId', parsed.typeDesc === 'country' ? parsed.entityId : undefined, {
              shouldValidate: true,
              shouldDirty: true,
            });
            setValue('CountyId', parsed.typeDesc === 'county' ? parsed.entityId : undefined, {
              shouldValidate: true,
              shouldDirty: true,
            });
            setValue('Longitude', parsed.longitude);
            setValue('Latitude', parsed.latitude);
          } catch {
            localStorage.removeItem('last-city');
          }
        }
      }
    }
  }, [searchParams, setValue]);

  const { data: cities2, isLoading } = useGet<Location[]>(
    [`location`, text],
    text ? `/Parametrics/Locations/Suggest/${text}` : '/Parametrics/Locations/Suggest/...',
    { enabled: !!text }
  );
  const cities: Location[] = cities2?.data ?? [];
  const cityOptions = useMemo(() => {
    if (
      selectedCityObject &&
      !cities.some((city) => city.entityId === selectedCityObject.entityId)
    ) {
      return [selectedCityObject, ...cities];
    }
    return cities;
  }, [cities, selectedCityObject]);

  const handleCityChange = (_: any, value: Location | null) => {
    setSelectedCityObject(value);
    setText(value?.name ?? '');
    if (value) {
      localStorage.setItem('last-city', JSON.stringify(value));
      setValue('CityName', value.name, { shouldValidate: true, shouldDirty: true });
      setValue('typeDesc', value.typeDesc, { shouldValidate: true, shouldDirty: true });
      setValue('CityId', value.typeDesc === 'city' ? value.entityId : undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue('StateId', value.typeDesc === 'state' ? value.entityId : undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue('CountryId', value.typeDesc === 'country' ? value.entityId : undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue('CountyId', value.typeDesc === 'county' ? value.entityId : undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setTimeout(() => setAutoOpenDate(true), 120);
    } else {
      localStorage.removeItem('last-city');
      setValue('CityName', undefined, { shouldValidate: true, shouldDirty: true });
      setValue('typeDesc', undefined, { shouldValidate: true, shouldDirty: true });
      setValue('CityId', undefined, { shouldValidate: true, shouldDirty: true });
      setValue('StateId', undefined, { shouldValidate: true, shouldDirty: true });
      setValue('CountryId', undefined, { shouldValidate: true, shouldDirty: true });
      setValue('CountyId', undefined, { shouldValidate: true, shouldDirty: true });
    }
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
    setDateRange((_) => {
      const newRange = [
        {
          startDate: range.startDate instanceof Date ? normalizeDate(range.startDate) : null,
          endDate: range.endDate instanceof Date ? normalizeDate(range.endDate) : null,
          key: 'selection',
        },
      ];
      setValue('CheckInDate', newRange[0].startDate, { shouldValidate: true, shouldDirty: true });
      setValue('CheckOutDate', newRange[0].endDate, { shouldValidate: true, shouldDirty: true });
      return newRange;
    });
    if (range.endDate && focusedDateField === 'CheckOutDate') {
      setDateAnchorEl(null);
      setActiveSection(null);
      setTimeout(() => setAutoOpenGuests(true), 120);
    }
  };

  const handleDateRangeClear = () => {
    setDateRange([{ startDate: null, endDate: null, key: 'selection' }]);
    setValue('CheckInDate', null, { shouldValidate: true, shouldDirty: true });
    setValue('CheckOutDate', null, { shouldValidate: true, shouldDirty: true });
    setFocusedDateField('CheckInDate');
  };

  const handleDateRangeClose = () => {
    setDateAnchorEl(null);
    setFocusedDateField(null);
    setActiveSection(null);
    if (dateRange[0].endDate) {
      setTimeout(() => setAutoOpenGuests(true), 120);
    }
  };

  // const handleQuickSelect = (type: 'today' | 'tomorrow' | 'next7days') => {
  //   const today = startOfDay(new Date());
  //   let startDate: Date, endDate: Date;
  //   switch (type) {
  //     case 'today':
  //       startDate = today;
  //       endDate = endOfDay(today);
  //       break;
  //     case 'tomorrow':
  //       const tomorrow = addDays(today, 1);
  //       startDate = tomorrow;
  //       endDate = endOfDay(tomorrow);
  //       break;
  //     case 'next7days':
  //       startDate = today;
  //       endDate = endOfDay(addDays(today, 6));
  //       break;
  //     default:
  //       return;
  //   }
  //   setDateRange((prev) => {
  //     const newRange = [{ startDate, endDate, key: 'selection' }];
  //     setValue('CheckInDate', newRange[0].startDate, { shouldValidate: true, shouldDirty: true });
  //     setValue('CheckOutDate', newRange[0].endDate, { shouldValidate: true, shouldDirty: true });
  //     return newRange;
  //   });
  //   setDateAnchorEl(null);
  //   setActiveSection(null);
  //   setTimeout(() => setAutoOpenGuests(true), 120);
  // };

  const onSubmit = (data: SearchFormData) => {
    try {
      if (!data.CityId && !data.StateId && !data.CountryId && !data.CountyId) {
        setShowAlert(true);
        setAlertMessage('Por favor, selecciona una ubicación antes de buscar.');
        return;
      }

      const params = new URLSearchParams();
      if (data.CityId) params.set('CityId', data.CityId.toString());
      if (data.StateId) params.set('StateId', data.StateId.toString());
      if (data.CountryId) params.set('CountryId', data.CountryId.toString());
      if (data.CountyId) params.set('CountyId', data.CountyId.toString());
      if (data.PropertyTypeId) params.set('PropertyTypeId', data.PropertyTypeId.toString());
      if (data.CheckInDate) params.set('checkIn', formatDate(data.CheckInDate, false));
      if (data.CheckOutDate) params.set('checkOut', formatDate(data.CheckOutDate, false));
      if (selectedCityObject?.latitude) params.set('Latitude', selectedCityObject.latitude.toString());
      if (selectedCityObject?.longitude) params.set('Longitude', selectedCityObject.longitude.toString());
      if (totalGuests > 0) params.set('guests', totalGuests.toString());
      params.set('page', '1'); 
      
      // Guardar en localStorage
      const searchData = {
        CheckInDate: data.CheckInDate ? normalizeDate(data.CheckInDate) : null,
        CheckOutDate: data.CheckOutDate ? normalizeDate(data.CheckOutDate) : null,
        Guests: data.Guests,
        CityName: data.CityName,
        typeDesc: data.typeDesc,
        CityId: data.CityId,
        StateId: data.StateId,
        CountryId: data.CountryId,
        CountyId: data.CountyId,
        Latitude: data.Latitude,
        Longitude: data.Longitude,
        PropertyTypeId: data.PropertyTypeId,
        pageNumber: 1,
        pageSize: 10,
      };
      localStorage.setItem('search-form-storage', JSON.stringify(searchData));

      // Llamar al callback onSearch si está definido (para comunicación directa con el padre)
      if (onSearch) {
        onSearch(searchData);
      }

      // Actualizar URL y navegar
      setSearchParams(params);
      navigate(`/search-results?${params.toString()}`, { replace: true });
    } catch (error) {
      console.error('Error in onSubmit:', error);
    }
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
      padding: '4px 0 4px 40px',
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
              sx={{ alignItems: 'center', flexDirection: { xs: 'column', md: 'row' } }}
            >
              {/* Ubicación */}
              <Grid size={{ xs: 12, md: 3 }} sx={{ width: '100%', mb: { xs: 1, md: 0 } }}>
                <Box
                  ref={whereContainerRef}
                  onClick={() => setActiveSection('CityId')}
                  sx={{
                    backgroundColor: '#ffffff',
                    borderRadius: '24px',
                    p: 1,
                    display: 'flex',
                    alignItems: 'flex-start',
                    minHeight: { xs: '60px', md: '90px' },
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      '& .MuiOutlinedInput-root': { backgroundColor: 'transparent' },
                    },
                    ...(activeSection === 'CityId' && {
                      backgroundColor: 'action.selected',
                      boxShadow: '0 3px 5px rgba(0,0,0,0.1)',
                      '& .MuiOutlinedInput-root': { backgroundColor: 'transparent' },
                    }),
                  }}
                >
                  <CiLocationArrow1 size={24} style={{ marginTop: 2 }} />
                  <Box sx={{ flex: 1, backgroundColor: 'transparent' }}>
                    <Typography
                      sx={{ fontFamily: theme.typography.paragraph1Medium, marginLeft: '16px' }}
                    >
                      Ubicación
                    </Typography>
                    <Controller
                      name="CityId"
                      control={control}
                      render={(_) => (
                        <Autocomplete
                          autoSelect
                          fullWidth
                          size="small"
                          options={cityOptions}
                          getOptionLabel={(option) => option.name}
                          isOptionEqualToValue={(option, value) =>
                            option.entityId === value.entityId
                          }
                          value={selectedCityObject}
                          inputValue={text}
                          onInputChange={(_, newInputValue, reason) => {
                            if (reason === 'input' || reason === 'clear') setText(newInputValue);
                          }}
                          onChange={handleCityChange}
                          loading={isLoading}
                          filterOptions={(options, state) =>
                            options.filter((o) =>
                              o.name.toLowerCase().includes(state.inputValue.toLowerCase())
                            )
                          }
                          renderOption={(props, option) => {
                            const { key, ...rest } = props;
                            return (
                              <ListItem
                                key={option.entityId}
                                {...rest}
                                dense
                                component="li"
                                sx={{ paddingTop: 0, paddingBottom: 0 }}
                              >
                                <ListItemIcon sx={{ minWidth: 32, color: 'text.secondary' }}>
                                  <LocationOnIcon fontSize="medium" />
                                </ListItemIcon>
                                <ListItemText
                                  primary={
                                    <Typography variant="body2" fontWeight="400">
                                      {option.name}
                                    </Typography>
                                  }
                                  secondary={
                                    <Typography
                                      variant="body2"
                                      fontWeight="400"
                                      sx={{ color: 'gray' }}
                                    >
                                      {option.description}
                                    </Typography>
                                  }
                                />
                              </ListItem>
                            );
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="¿Dónde?"
                              variant="outlined"
                              onClick={() => setActiveSection('CityId')}
                              onFocus={() => setActiveSection('CityId')}
                              onBlur={() => activeSection === 'CityId' && setActiveSection(null)}
                              onKeyDown={(event) => event.key === 'Enter' && event.preventDefault()}
                              sx={{
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
                          )}
                          slotProps={{
                            popper: {
                              sx: {
                                '& .MuiPaper-root': {
                                  borderRadius: '6px',
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  boxShadow: 'rgba(0, 0, 0, 0.15) 0px 10px 30px 0px',
                                  width: { xs: '100%', md: '330px' },
                                  marginLeft: '-40px',
                                },
                              },
                              modifiers: [{ name: 'offset', options: { offset: [-8, 4] } }],
                              placement: 'bottom-start',
                            },
                            listbox: {
                              sx: { maxHeight: '40vh', paddingTop: '8px', paddingBottom: '8px' },
                            },
                          }}
                        />
                      )}
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 1 }}>
                    <IoCalendarOutline size={24} />
                    <Typography sx={{ fontFamily: theme.typography.paragraph1Medium }}>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 1 }}>
                    <IoCalendarOutline size={24} />
                    <Typography sx={{ fontFamily: theme.typography.paragraph1Medium }}>
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
              <Grid size={{ xs: 12, md: 2.6 }} sx={{ width: '100%', mb: { xs: 1, md: 0 } }}>
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
                    <Typography sx={{ fontFamily: theme.typography.paragraph1Medium }}>
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
                          padding: '2px 0 4px 32px',
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
              </Grid>
              <Grid
                size={{ xs: 12, md: 1.4 }}
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: { xs: 'center', md: 'flex-end' },
                  alignItems: 'center',
                  mb: { xs: 1, md: 3 },
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
                <>
                  <Box
                    key={item.key}
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
                </>
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
              ranges={[
                {
                  startDate: dateRange[0].startDate || undefined,
                  endDate: dateRange[0].endDate || undefined,
                  key: dateRange[0].key,
                },
              ]}
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

export default MiniAssertSearch;
