import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Popover,
  Stack,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { addDays, endOfDay, format, startOfDay } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import { DateRangePicker, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { Controller, useForm } from 'react-hook-form';
import { useGet } from '@/hooks/api';
import SearchFormData from '@/models/interfaces/SearchFormData';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { BiUser } from 'react-icons/bi';
import { CiLocationArrow1 } from 'react-icons/ci';
import { IoCalendarOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router';
import { useSearchStore } from '../store/searchStore';
import CustomStyleSearch from './styles/CustomStyleSearch';

export interface City {
  cityId: number;
  name: string;
}

export interface County {
  countyId: number;
  name: string;
  cities: City[];
}

export interface State {
  stateId: number;
  name: string;
  counties: County[];
}

export interface Country {
  countryId: number;
  name: string;
  states: State[];
}

interface Location {
  id: string;
  name: string;
  description: string;
  type: number;
  typeDesc: string;
  entityId: number;
}
export interface ApiResponse2 {
  data: Location[];
  statusCode: string;
  hasError: boolean;
  resultError: any;
}

// const extractCities = (data: Country[]): City[] => {
//   const cities: City[] = [];

//   data.forEach((country) => {
//     country.states.forEach((state) => {
//       state.counties.forEach((county) => {
//         county.cities.forEach((city) => {
//           cities.push(city);
//         });
//       });
//     });
//   });

//   return cities;
// };

// interface DestinationOption {
//   id: number;
//   lat: number;
//   lng: number;
//   title: string;
//   description: string;
//   images: string[];
//   price: number;
//   oldPrice: number;
//   rating: number;
//   reviews: number;
// }

// --- Component Definition ---
const ShortAssertionSearch: React.FC = () => {
  // --- Form Hook ---
    const { control, handleSubmit, setValue, reset } = useForm<SearchFormData>({
      defaultValues: {
        CheckInDate: null,
        CheckOutDate: null,
        MinPrice: undefined,
        MaxPrice: undefined,
        Guests: { adults: 0, children: 0, infants: 0, pets: 0 },
        Bedrooms: undefined,
        Beds: undefined,
        PropertyTypeId: undefined,
        AmenityIds: [], 
        Latitude: undefined,
        Longitude: undefined,
        Radius: undefined,
        CityId: undefined,
        CountryId: undefined,
        Bathrooms: undefined,
        pageNumber: 1,
        pageSize: 10,
      },
    });

  // --- States ---
  const [dateRange, setDateRange] = useState([
    {
      startDate: null as Date | null,
      endDate: null as Date | null,
      key: 'selection',
    },
  ]);
  const [guestAnchorEl, setGuestAnchorEl] = useState<null | HTMLElement>(null);
  const [dateAnchorEl, setDateAnchorEl] = useState<null | HTMLElement>(null);
  const [activeTab, setActiveTab] = useState(1);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [focusedDateField, setFocusedDateField] = useState<'CheckInDate' | 'CheckOutDate' | null>(null);
  const [guests, setGuests] = useState({ adults: 0, children: 0, infants: 0, pets: 0 });
  const [selectedCityId, setSelectedCityId] = React.useState<number | undefined>(undefined);
  const [text, setText] = React.useState<string>('');

  // --- Refs ---
  const checkInRef = useRef<HTMLDivElement>(null);
  const checkOutRef = useRef<HTMLDivElement>(null);
  const whereContainerRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);

  // --- Hooks & Variables ---
  const theme = useTheme();
  const openGuestsPopover = Boolean(guestAnchorEl);
  const openDatePopover = Boolean(dateAnchorEl);
  const totalGuests = guests.adults + guests.children;

  useEffect(() => {
    setValue('CityId', selectedCityId);
    setValue('CheckInDate', dateRange[0].startDate);
    setValue('CheckOutDate', dateRange[0].endDate);
    setValue('Guests', guests);
    setValue('PropertyTypeId', activeTab);
  }, [selectedCityId, dateRange, guests, activeTab, setValue]);

  const setData = useSearchStore((state) => state.setData);
  const navigate = useNavigate();

  // --- Form Submission Handler ---
  const onSubmit = (data: SearchFormData) => {
    setData(data);
    navigate('/search-results');
    setSelectedCityId(undefined);
    setDateRange([{ startDate: null, endDate: null, key: 'selection' }]);
    setGuests({ adults: 0, children: 0, infants: 0, pets: 0 });
    // Reset form fields, preserving category
    reset({
        CheckInDate: undefined,
        CheckOutDate: undefined,
        MinPrice: undefined,
        MaxPrice: undefined,
        Guests: { adults: 0, children: 0, infants: 0, pets: 0 },
        Bedrooms: undefined,
        Beds: undefined,
        PropertyTypeId: undefined,
        AmenityIds: [], 
        Latitude: undefined,
        Longitude: undefined,
        Radius: undefined,
        CityId: undefined,
        CountryId: undefined,
        Bathrooms: undefined,
        pageNumber: 1,
        pageSize: 10,
    });
    // Close any open popovers
    setGuestAnchorEl(null);
    setDateAnchorEl(null);
    setIsDateRangeOpen(false);
    setActiveSection(null);
  };

  // --- Effect to Handle Focus Switching ---
  useEffect(() => {
    if (focusedDateField === 'CheckOutDate' && checkOutRef.current) {
      checkOutRef.current.focus();
      setActiveSection('CheckOutDate');
    } else if (focusedDateField === 'CheckInDate' && checkInRef.current) {
      checkInRef.current.focus();
      setActiveSection('CheckInDate');
    }
  }, [focusedDateField]);

  // --- Effect to Reset Date Range When Picker Opens ---
  useEffect(() => {
    if (isDateRangeOpen) {
      setDateRange([
        {
          startDate: null,
          endDate: null,
          key: 'selection',
        },
      ]);
    }
  }, [isDateRangeOpen]);

  // --- Event Handlers ---
  const handleGuestClick = () => {
    setGuestAnchorEl(guestsRef.current);
    setActiveSection('Guests');
    setIsDateRangeOpen(false);
    setDateAnchorEl(null);
  };

  const handleGuestClose = () => {
    setGuestAnchorEl(null);
    if (activeSection === 'Guests') setActiveSection(null);
  };

  const handleGuestChange = (key: keyof typeof guests, delta: number) => {
    setGuests((prev) => ({ ...prev, [key]: Math.max(0, prev[key] + delta) }));
  };

  // const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
  //   setActiveTab(newValue);
  // };

  const handleWhereFocus = () => {
    setActiveSection('CityId');
    setGuestAnchorEl(null);
    setIsDateRangeOpen(false);
    setDateAnchorEl(null);
  };

  const handleCheckInClick = () => {
    setIsDateRangeOpen(true);
    setActiveSection('CheckInDate');
    setFocusedDateField('CheckInDate');
    setGuestAnchorEl(null);
    setDateAnchorEl(checkInRef.current);
  };

  const handleCheckOutClick = () => {
    setIsDateRangeOpen(true);
    setActiveSection('CheckOutDate');
    setFocusedDateField('CheckOutDate');
    setGuestAnchorEl(null);
    setDateAnchorEl(checkOutRef.current);
  };

  const handleDateRangeSelect = (rangesByKey: RangeKeyDict) => {
    const range = rangesByKey.selection;
    setDateRange([
      {
        startDate: range.startDate || null,
        endDate: range.endDate || null,
        key: 'selection',
      },
    ]);
  };

  const handleDateRangeClear = () => {
    setDateRange([{ startDate: null, endDate: null, key: 'selection' }]);
    setFocusedDateField('CheckInDate');
  };

  const handleDateRangeClose = () => {
    setIsDateRangeOpen(false);
    setFocusedDateField(null);
    setDateAnchorEl(null);
    if (activeSection === 'CheckInDate' || activeSection === 'CheckOutDate') setActiveSection(null);
  };

const handleQuickSelect = (type: 'today' | 'tomorrow' | 'next7days') => {
    const today = new Date();
    let startDate: Date, endDate: Date;
  
    switch (type) {
      case 'today':
        startDate = startOfDay(today);
        endDate = endOfDay(today);
        break;
  
      case 'tomorrow':
        const tomorrow = addDays(today, 1);
        startDate = startOfDay(tomorrow);
        endDate = endOfDay(tomorrow);
        break;
  
      case 'next7days':
        startDate = startOfDay(today);
        endDate = endOfDay(addDays(today, 6)); 
        break;
  
      default:
        return;
    }


    setDateRange([
      {
        startDate,
        endDate,
        key: 'selection',
      },
    ]);
  };

  // --- Styles ---
  const dateTextFieldStyles = {
    cursor: 'pointer',
    '& .MuiInputBase-root': {
      paddingRight: 0,
      cursor: 'pointer',
      '&:hover:not(.Mui-disabled):before, &:before, &:after': { borderBottom: 'none' },
    },
    '& .MuiInputBase-input': {
      padding: '2px 0 2px 10px',
      cursor: 'pointer',
      color: theme.palette.text.secondary,
      fontSize: '0.800rem',
      minHeight: '1.2em',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
    },
  };

  // --- Format Date Display ---
  const formatDate = (date: Date | null) => {
    if (date) {
      return format(date, 'yyyy-MM-dd');
    }
    return '';
  };

 //const { data: category } = useGet<ApiResponse>('category', '/Parametrics/AccomodationTypes');


  const { data: cities2, isLoading } = useGet<Location[]>(
    [`location2`, text],
    text ? `/Parametrics/Locations/Suggest/${text}` : '/Parametrics/Locations/Suggest/...'
  );

  const cities: Location[] = cities2?.data ? cities2?.data : [];

  const selectedCity = cities.find((city) => city.entityId === selectedCityId) ?? null;
  // --- JSX ---
  return (
    <>
      <style>{CustomStyleSearch}</style>
      <Box sx={{ width: '100%', mx: 'auto', p: { xs: 0, md: 0 } }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Paper
            elevation={2}
            sx={{
              borderRadius: '15px',
              height: { xs: 'auto', md: '108px' },
              overflow: 'visible',
              maxWidth: { xs: '100%', md: '100%' },
              mx: 'auto',
              p: { xs: 1, md: 2 },
              px: { xs: 2, md: '2px 0' },
              border: '1px solid',
              borderColor: 'divider',
              position: 'relative',
              boxShadow: '0px 2px 5px gray',
              background:
                'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 60%, rgba(255,255,255,0.6) 100%)',
              padding: 0,
              margin: 0,
            }}
          >

            {/* Grid Container */}
            <Grid
              container
              spacing={0}
              sx={{
                alignItems: 'center',
                flexDirection: { xs: 'column', md: 'row' },
                //mt: 2,
              }}
            >
              {/* --- Sección "Where" con Autocomplete --- */}
              <Grid size={{ xs: 12, md: 3.5 }} sx={{ width: '100%', mb: { xs: 1, md: 0 } }}>
                <Box
                  ref={whereContainerRef}
                  onClick={handleWhereFocus}
                  sx={{
                    backgroundColor: '#ffffff',
                    borderRadius: '24px',
                    paddingTop: 2.5,
                    paddingLeft: 2.5,
                    display: 'flex',
                    gap: 2,
                    alignItems: 'flex-start',
                    minHeight: { xs: '60px', md: '90px' },
                    cursor: 'pointer',
                    '&:hover': { 
                      backgroundColor: 'action.hover',
                      '& .MuiOutlinedInput-root': { 
                        backgroundColor: 'transparent' 
                      },
                    },
                    ...(activeSection === 'Ubicación' && {
                      backgroundColor: 'action.selected',
                      boxShadow: '0 3px 5px rgba(0,0,0,0.1)',
                      '& .MuiOutlinedInput-root': { 
                        backgroundColor: 'transparent' 
                      },
                    }),
                  }}
                >
                  {/* Ícono */}
                  <CiLocationArrow1 size={24} style={{ marginTop: 2 }} />

                  {/* Contenido textual + Autocomplete */}
                  <Box sx={{ flex: 1, backgroundColor: 'transparent' }}>
                    <Typography variant="h6" fontWeight={theme.typography.fontWeightMedium}>
                      Ubicación
                    </Typography>

                    <Controller
                      name="CityId"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          fullWidth
                          size="small"
                          options={cities}
                          getOptionLabel={(option) => option.name}
                          isOptionEqualToValue={(option, value) => option.entityId === value.entityId}
                          value={selectedCity}
                          inputValue={text}
                          onInputChange={(_, newInputValue) => {
                            setText(newInputValue);
                          }}
                          onChange={(_, value) => {
                            setSelectedCityId(value?.entityId ?? undefined);
                            setText(value?.name ?? '');
                          }}
                          loading={isLoading}
                          filterOptions={(options, state) => {
                            const displayOptions = options.filter((option) =>
                              state.inputValue ? option.entityId !== 0 : true
                            );
                            return displayOptions.filter((o) =>
                              o.name.toLowerCase().includes(state.inputValue.toLowerCase())
                            );
                          }}
                          renderOption={(props, option) => {
                            const { key, ...rest } = props; // 🔥 EXTRAE la key del objeto props
                            return (
                              <ListItem
                                key={option.entityId} // 🔑 PASA la key directamente (opcionalmente podrías usar key aquí o usar la que viene en props)
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
                                    <Typography variant="body2" fontWeight="400" sx={{color: 'gray'}}>
                                      {option.description}
                                    </Typography>
                                  }
                                  sx={{ margin: 1 }}
                                />
                              </ListItem>
                            );
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="¿Dónde?"
                              variant="outlined"
                              onClick={handleWhereFocus}
                              onFocus={handleWhereFocus}
                              onBlur={() => {
                                if (activeSection === 'Ubicación') setActiveSection(null);
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': { border: 'none' },
                                  '&:hover fieldset': { border: 'none' },
                                  '&.Mui-focused fieldset': { border: 'none' },
                                  backgroundColor: 'transparent',
                                  fontSize: '0.875rem',
                                },
                              }}
                            />
                          )}
                          slotProps={{
                            popper: {
                              sx: {
                                '& .MuiPaper-root': {
                                  borderRadius: '20px',
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  mt: 1,
                                  boxShadow: 'rgba(0, 0, 0, 0.15) 0px 10px 30px 0px',
                                  width: { xs: '100%', md: '400px' },
                                },
                              },
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

              {/* Check-in */}
              <Grid size={{ xs: 12, md: 2.375 }} sx={{ width: '100%', mb: { xs: 1, md: 0 } }}>
                <Box
                  ref={checkInRef}
                  onClick={handleCheckInClick}
                  tabIndex={0}
                  sx={{
                    p: 1,
                    pt: 3,
                    borderRadius: '30px',
                    '&:hover': { backgroundColor: 'action.hover' },
                    cursor: 'pointer',
                    '&:focus': { outline: 'none' },
                    ...(activeSection === 'checkin' && {
                      backgroundColor: 'action.selected',
                      boxShadow: '0 3px 5px rgba(0,0,0,0.1)',
                    }),
                    minHeight: { xs: '60px', md: '90px' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 1 }}>
                    <IoCalendarOutline size={24} />
                    <Typography variant="h6" fontWeight={theme.typography.fontWeightMedium}>
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
                        value={formatDate(dateRange[0].startDate)}
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

              {/* Check-out */}
              <Grid size={{ xs: 12, md: 2.375 }} sx={{ width: '100%', mb: { xs: 1, md: 0 } }}>
                <Box
                  ref={checkOutRef}
                  onClick={handleCheckOutClick}
                  tabIndex={0}
                  sx={{
                    p: 1,
                    pt: 3,
                    borderRadius: '30px',
                    '&:hover': { backgroundColor: 'action.hover' },
                    cursor: 'pointer',
                    '&:focus': { outline: 'none' },
                    ...(activeSection === 'checkout' && {
                      backgroundColor: 'action.selected',
                      boxShadow: '0 3px 5px rgba(0,0,0,0.1)',
                    }),
                    minHeight: { xs: '60px', md: '90px' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 1 }}>
                    <IoCalendarOutline size={24} />
                    <Typography variant="h6" fontWeight={theme.typography.fontWeightMedium}>
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
                        value={formatDate(dateRange[0].endDate)}
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

              {/* Who */}
              <Grid size={{ xs: 12, md: 2.75 }} sx={{ width: '100%', mb: { xs: 1, md: 0 } }}>
                <Box
                  ref={guestsRef}
                  onClick={handleGuestClick}
                  sx={{
                    p: 1,
                    pt: 3,
                    pl: 2,
                    borderRadius: '30px',
                    '&:hover': { backgroundColor: 'action.hover' },
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
                    <Typography variant="h6" fontWeight={theme.typography.fontWeightMedium}>
                      Huéspedes
                    </Typography>
                  </Box>
                  <Controller
                    name="Guests"
                    control={control}
                    render={({ field }) => (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                        sx={{ maxWidth: '100%', pl: 4 }}
                      >
                        {totalGuests > 0
                          ? `${totalGuests} Huesped${totalGuests !== 1 ? 'es' : ''}${
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

              {/* Search Button */}
              <Grid
                size={{ xs: 12, md: 1 }}
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: { xs: 'center', md: 'flex-end' },
                  alignItems: 'center',
                  mt: { xs: 0, md: 0 },
                  pr: { md: 0 },
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    borderRadius: '50%',
                    minWidth: '54px',
                    height: '54px',
                    padding: 0,
                    width: { xs: '54px', md: '54px' },
                    boxShadow: 'none',
                    '&:hover': { boxShadow: 'none' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'black',
                    color: 'white',
                    transition: 'transform 0.2s ease-in-out',
                    '&:active': {
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <SearchIcon />
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </form>

        {/* Popover Huéspedes */}
        <Popover
          open={openGuestsPopover}
          anchorEl={guestAnchorEl}
          onClose={handleGuestClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          disableRestoreFocus
          sx={{
            mt: 1.5,
            '& .MuiPaper-root': {
              borderRadius: '20px',
              p: 3,
              width: { xs: '90vw', md: 350 },
              boxShadow: 'rgba(0, 0, 0, 0.15) 0px 10px 30px 0px',
            },
            zIndex: theme.zIndex.modal,
          }}
        >
          <Box onMouseLeave={handleGuestClose}>
            <Stack spacing={3}>
              {[
                { key: 'adults', label: 'Adultos', description: '13 años o más' },
                { key: 'children', label: 'Niños', description: 'De 2 a 12 años' },
                { key: 'infants', label: 'Bebés', description: 'Menos de 2' },
                { key: 'pets', label: 'Mascotas', description: '¿Traes a un animal de servicio?' },
              ].map((item) => (
                <Box
                  key={item.key}
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Box>
                    <Typography fontWeight="bold">{item.label}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      onClick={() => handleGuestChange(item.key as keyof typeof guests, -1)}
                      disabled={guests[item.key as keyof typeof guests] === 0}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        color:
                          guests[item.key as keyof typeof guests] === 0 ? 'action.disabled' : 'inherit',
                      }}
                      size="small"
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={{ width: 20, textAlign: 'center' }}>
                      {guests[item.key as keyof typeof guests]}
                    </Typography>
                    <IconButton
                      onClick={() => handleGuestChange(item.key as keyof typeof guests, 1)}
                      sx={{ border: '1px solid', borderColor: 'divider' }}
                      size="small"
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        </Popover>

        {/* Date Picker Popover */}
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
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Typography variant="body2" fontWeight="bold">
              {focusedDateField === 'CheckInDate'
                ? 'Selecciona la fecha de llegada'
                : 'Selecciona la fecha de salida'}
            </Typography>
          </Box>
          <DateRangePicker
            onChange={handleDateRangeSelect}
            moveRangeOnFirstSelection={false}
            months={2}
            ranges={[
              {
                startDate: dateRange[0].startDate || undefined,
                endDate: dateRange[0].endDate || undefined,
                key: dateRange[0].key,
              },
            ]}
            direction="horizontal"
            minDate={new Date()}
            showDateDisplay={false}
            showMonthAndYearPickers={false}
            weekdayDisplayFormat="EEEEE"
            rangeColors={['#e1dede']}
            showPreview={false}
          />
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleQuickSelect('today')}
                sx={{ textTransform: 'none', borderRadius: '20px' }}
              >
                Hoy
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleQuickSelect('tomorrow')}
                sx={{ textTransform: 'none', borderRadius: '20px' }}
              >
                Mañana
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleQuickSelect('next7days')}
                sx={{ textTransform: 'none', borderRadius: '20px' }}
              >
                Proximos 7 días
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={handleDateRangeClear}
                sx={{
                  textTransform: 'none',
                  borderRadius: '20px',
                  color: 'error.main',
                  borderColor: 'error.main',
                }}
              >
                Limpiar
              </Button>
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDateRangeClose}
              sx={{ borderRadius: '20px', textTransform: 'none' }}
            >
              Cerrar
            </Button>
          </Box>
        </Popover>
      </Box>
    </>
  );
};

export default ShortAssertionSearch;