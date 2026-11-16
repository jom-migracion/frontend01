import { useCallback, useRef, useReducer } from 'react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import assertEnv from '@/config/env';
import ClearIcon from '@mui/icons-material/Clear';
import { PropsInitialStateSearch } from '@/models/interfaces/PropsInitialStateSearch';
// import { Library } from '@googlemaps/js-api-loader';
import { useTranslation } from 'react-i18next';

const initialState: PropsInitialStateSearch = {
  latitude: null,
  longitude: null,
  country: '',
  state: '',
  county: '',
  city: '',
  street: '',
  postalCode: '',
  formatted_address: '',
};

// Reducer para manejar el estado
const locationReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'UPDATE_LOCATION':
      return { ...state, ...action.payload };
    case 'RESET_LOCATION':
      return initialState;
    default:
      throw new Error(`Acción no soportada: ${action.type}`);
  }
};

interface GoogleSearchProps {
  value?: string;
  label?: string;
  placeholder?: string;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  handleDataGoogleSearch?: (valuesFind: PropsInitialStateSearch) => void;
  onChange?: (value: string) => void;
}

// const LIBRARIES: Library[] = ['places'];

const GoogleSearch = ({
  value = '',
  label = '',
  placeholder = '',
  size = 'small',
  fullWidth = false,
  handleDataGoogleSearch,
  onChange,
}: GoogleSearchProps) => {
  const [location, dispatch] = useReducer(locationReducer, initialState);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: assertEnv.VITE_KEY_SEARCH_GOOGLE,
    libraries: ['places'],
    language: 'es',
  });

  const handlePlaceChanged = useCallback(() => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();
    if (!place?.geometry?.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    let newLocation: PropsInitialStateSearch = {
      latitude: lat,
      longitude: lng,
      street: '',
      country: '',
      state: '',
      county: '',
      city: '',
      postalCode: '',
      formatted_address: '',
    };

    for (const component of place.address_components || []) {
      const type = component.types[0];
      switch (type) {
        case 'street_number':
          newLocation.street = `${component.long_name} ${newLocation.street}`.trim();
          break;
        case 'route':
          newLocation.street = `${newLocation.street} ${component.long_name}`.trim();
          break;
        case 'locality':
          newLocation.city = component.long_name;
          break;
        case 'administrative_area_level_2':
          newLocation.county = component.long_name;
          break;
        case 'administrative_area_level_1':
          newLocation.state = component.long_name;
          break;
        case 'country':
          newLocation.country = component.long_name;
          break;
        case 'postal_code':
          newLocation.postalCode = component.long_name;
          break;
      }
    }

    newLocation.street = newLocation.street.trim();
    newLocation.formatted_address = place.formatted_address || '';
    dispatch({ type: 'UPDATE_LOCATION', payload: newLocation });
    handleDataGoogleSearch && handleDataGoogleSearch(newLocation);
  }, [handleDataGoogleSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(e.target.value);
  };

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET_LOCATION' });
    handleDataGoogleSearch && handleDataGoogleSearch(initialState);
    if (onChange) onChange('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [handleDataGoogleSearch, onChange]);

  const { t: tcommon } = useTranslation('translation', { keyPrefix: 'commonNames' });

  return (
    <Box sx={{ position: 'relative' }}>
      {isLoaded && (
        <Autocomplete
          onLoad={(autocomplete) => {
            autocompleteRef.current = autocomplete;
            // Restringir búsquedas solo a Bolivia
            autocomplete.setComponentRestrictions({ country: 'bo' });
            autocomplete.setTypes(['geocode']); // Solo direcciones geográficas
          }}
          onPlaceChanged={handlePlaceChanged}
        >
          <TextField
            label={label}
            value={value}
            onChange={handleInputChange}
            inputRef={inputRef}
            variant="outlined"
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: 2,
              },
            }}
            size={size}
            fullWidth={fullWidth}
            placeholder={placeholder.length == 0 ? tcommon('placeholderGoogleSearch') : placeholder}
            disabled={!isLoaded}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {location.latitude && (
                    <IconButton onClick={handleReset} size="small" edge="end">
                      <ClearIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Autocomplete>
      )}
    </Box>
  );
};

export default GoogleSearch;
