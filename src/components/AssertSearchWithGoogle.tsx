import { useGet } from '@/hooks/api';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { DateRange, Range, RangeKeyDict } from 'react-date-range';
import { Controller, useForm } from 'react-hook-form';
import { BiUser } from 'react-icons/bi';
import { IoCalendarOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router';
import { useTheme } from '@mui/material/styles';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import SnackbarAlert from './SnackbarAlert';
import { useLoadScript } from '@react-google-maps/api';
import assertEnv from '@/config/env';
import { CiLocationArrow1 } from 'react-icons/ci';

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

const AssertSearchWithGoogle = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<number | false>(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [dateAnchorEl, setDateAnchorEl] = useState<null | HTMLElement>(null);
  const [guestAnchorEl, setGuestAnchorEl] = useState<null | HTMLElement>(null);
  const [focusedDateField, setFocusedDateField] = useState<'CheckInDate' | 'CheckOutDate' | null>(
    null
  );
  const [autoOpenDate, setAutoOpenDate] = useState(false);
  const [autoOpenGuests, setAutoOpenGuests] = useState(false);
  const [locationData, setLocationData] = useState<LocationData | null>(null);

  const checkInRef = useRef<HTMLDivElement>(null);
  const checkOutRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);
  const guestPopoverRef = useRef<HTMLDivElement>(null);
  const openGuestsPopover = Boolean(guestAnchorEl);
  const openDatePopover = Boolean(dateAnchorEl);
  const locationInputRef = useRef<HTMLInputElement | null>(null);

  const [guests, setGuests] = useState<Guests>({ adults: 0, children: 0, infants: 0, pets: 0 });
  const totalGuests = guests.adults + guests.children;
  const [dateRange, setDateRange] = useState<Range[]>([
    {
      startDate: undefined,
      endDate: undefined,
      key: 'selection',
    },
  ]);
  const theme = useTheme();

  const { control, handleSubmit, setValue, reset } = useForm<SearchFormData>({
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
  };

  const handleGuestClose = () => {
    setGuestAnchorEl(null);
    if (activeSection === 'guests') setActiveSection(null);
  };

  const handleGuestChange = (key: keyof Guests, delta: number) => {
    setGuests((prev) => ({ ...prev, [key]: Math.max(0, prev[key] + delta) }));
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setValue('PropertyTypeId', newValue);
  };

  const handleLocationChange = useCallback(() => {
    if (!locationInputRef.current || !window.google) return;

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
      localStorage.setItem('locationData', JSON.stringify(location));
      setTimeout(() => setAutoOpenDate(true), 120);
    });
  }, []);

  const formatDate = (date: Date | null | undefined, forDisplay: boolean = false) => {
    if (!date) return '';
    if (typeof date === 'string') {
      return forDisplay
        ? format(new Date(date), 'dd MMM yyyy', { locale: es })
        : new Date(date).toISOString().split('T')[0];
    }
    if (date instanceof Date && !isNaN(date.getTime())) {
      return forDisplay ? format(date, 'dd MMM yyyy', { locale: es }) : format(date, 'yyyy-MM-dd');
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

  const onSubmit = (formData: SearchFormData) => {
    if (!formData.City && !formData.State && !formData.Country) {
      // setShowAlert(true);
      //  setAlertMessage('Por favor, selecciona una ubicación antes de buscar.');
      return;
    }

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

    localStorage.setItem(
      'search-form-storage',
      JSON.stringify({
        Street: formData.Street,
        City: formData.City,
        County: formData.County,
        State: formData.State,
        Country: formData.Country,
        PostalCode: formData.PostalCode,
        Latitude: formData.Latitude,
        Longitude: formData.Longitude,
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
      Guests: { adults: 0, children: 0, infants: 0, pets: 0 },
      pageNumber: 1,
      pageSize: 10,
    });
    setLocationData(null);
    setGuests({ adults: 0, children: 0, infants: 0, pets: 0 });
    setDateRange([{ startDate: undefined, endDate: undefined, key: 'selection' }]);
    setGuestAnchorEl(null);
    setDateAnchorEl(null);
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
              height: { xs: 'auto', md: '168px' },
              overflow: 'visible',
              maxWidth: { xs: '100%', md: '90%' },
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
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                  fontFamily: theme.typography.paragraph1Medium,
                  color: theme.palette.customColors.lights[4],
                  minHeight: 'auto',
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'primary.main',
                    height: '3px',
                  },
                  '& .MuiTab-root': {
                    fontFamily: theme.typography.paragraph1Medium,
                    color: theme.palette.customColors.primary[3],
                    minHeight: 'auto',
                    minWidth: 'auto',
                    textTransform: 'none',
                    borderRadius: '8px',
                    '&.Mui-selected': {
                      color: theme.palette.customColors.primary[3],
                    },
                  },
                }}
              >
                {category?.data && Array.isArray(category.data) && category.data.length > 0 ? (
                  category.data
                    .filter((item: PropertySubType) => item.propertySubtypeId != null)
                    .map((category: PropertySubType, index: number) => (
                      <Tab
                        key={category.propertySubtypeId ?? `tab-${index}`}
                        label={category.subType}
                        value={category.propertySubtypeId}
                      />
                    ))
                ) : (
                  <Tab key="no-data" label="No categories available" value={0} disabled />
                )}
              </Tabs>
            </Box>

            <Grid
              container
              spacing={0}
              sx={{ alignItems: 'center', flexDirection: { xs: 'column', md: 'row' } }}
            >
              <Grid size={{ xs: 12, md: 3 }} sx={{ width: '100%', mb: { xs: 1, md: 0 } }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: '30px',
                    cursor: 'pointer',
                    minHeight: { xs: '60px', md: '90px' },
                  }}
                >
                  {/* <LocationOnIcon fontSize="medium" /> */}
                  <Box sx={{ flex: 1, backgroundColor: 'transparent', display: 'flex' }}>
                    <CiLocationArrow1 size={24} style={{ marginTop: 0 }} />
                    <Typography
                      sx={{ fontFamily: theme.typography.paragraph1Medium, marginLeft: '16px' }}
                    >
                      Ubicación
                    </Typography>
                  </Box>
                  <TextField
                    inputRef={locationInputRef}
                    onFocus={handleLocationChange}
                    variant="outlined"
                    size={'small'}
                    placeholder="¿Dónde?"
                    disabled={!isLoaded}
                    sx={{
                      pt: '0px',
                      ml: '20px',
                      '& .MuiOutlinedInput-root.MuiInputBase-sizeSmall': {
                        paddingTop: '0px',
                        paddingBottom: '0px',
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
                      boxShadow: '0 3px 5px rgba(255, 255, 255, 0.1)',
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
                    '&:hover': { backgroundColor: 'action.hover' },
                    cursor: 'pointer',
                    '&:focus': { outline: 'none' },
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
                  onClick={handleGuestClick}
                  sx={{
                    p: 1,
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
          onClose={handleGuestClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          disableRestoreFocus
          slotProps={{
            paper: { ref: guestPopoverRef },
          }}
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
              p: 0,
              width: { xs: '100%', md: 'auto' },
            },
            zIndex: theme.zIndex.modal + 1,
          }}
        >
          <Box sx={{ p: 2, maxWidth: '100%', display: 'flex', flexDirection: 'column' }}>
            <DateRange
              className="custom-date-range"
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
                  variant="outlined"
                  size="small"
                  onClick={handleDateRangeClear}
                  color="secondary"
                  sx={{
                    textTransform: 'none',
                    minWidth: 120,
                    borderColor: (theme) => theme.palette.secondary.main,
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

export default AssertSearchWithGoogle;
