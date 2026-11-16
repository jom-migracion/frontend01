import Box from '@mui/material/Box';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useMemo, useRef, useState } from 'react';
import { CountryPhones } from '@/common/util/countryPhones';

interface CountryPhoneAutocompleteProps {
  value: string;
  onChange: (phoneCode: string) => void;
  onBlur?: () => void;
  label?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: React.ReactNode;
  disabled?: boolean;
}

const CountryPhoneAutocomplete = ({
  value,
  onChange,
  onBlur,
  label = 'País',
  placeholder = 'Buscar país',
  error,
  helperText,
  disabled,
}: CountryPhoneAutocompleteProps) => {
  const [countrySearch, setCountrySearch] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredCountries = useMemo(() => {
    const query = countrySearch.trim().toLowerCase();
    if (!query) return CountryPhones;

    return CountryPhones.filter((country) => {
      return (
        country.name.toLowerCase().includes(query) ||
        country.iso2.toLowerCase().includes(query) ||
        country.phoneCode.includes(query.replace('+', ''))
      );
    });
  }, [countrySearch]);

  return (
    <TextField
      select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onBlur}
      label={label}
      error={error}
      helperText={helperText}
      autoComplete="off"
      disabled={disabled}
      InputLabelProps={{ shrink: true }}
      SelectProps={{
        displayEmpty: true,
        onOpen: () => {
          setTimeout(() => {
            searchInputRef.current?.focus();
          }, 0);
        },
        onClose: () => setCountrySearch(''),
        renderValue: (selected) => {
          const selectedValue = selected as string;
          const country = CountryPhones.find((item) => `+${item.phoneCode}` === selectedValue);

          if (!country) {
            return <Box component="span">Selecciona país</Box>;
          }

          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                component="img"
                src={`/flags/4x3/${country.iso2.toLowerCase()}.svg`}
                alt={`Bandera de ${country.name}`}
                sx={{ width: 20, height: 14, borderRadius: '3px', objectFit: 'cover' }}
              />
              <Box component="span">+{country.phoneCode}</Box>
            </Box>
          );
        },
        MenuProps: {
          autoFocus: false,
          disableAutoFocusItem: true,
          PaperProps: {
            sx: {
              maxHeight: 360,
            },
          },
          MenuListProps: {
            autoFocusItem: false,
          },
        },
      }}
    >
      <ListSubheader
        sx={{
          bgcolor: 'background.paper',
          position: 'sticky',
          top: 0,
          zIndex: 1,
        }}
      >
        <TextField
          size="small"
          autoFocus
          fullWidth
          inputRef={searchInputRef}
          placeholder={placeholder}
          value={countrySearch}
          onChange={(event) => setCountrySearch(event.target.value)}
          onClick={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
          onKeyDownCapture={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
          autoComplete="off"
        />
      </ListSubheader>

      {filteredCountries.map((country) => (
        <MenuItem key={country.iso2} value={`+${country.phoneCode}`}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              component="img"
              src={`/flags/4x3/${country.iso2.toLowerCase()}.svg`}
              alt={`Bandera de ${country.name}`}
              sx={{ width: 24, height: 18, borderRadius: '3px', objectFit: 'cover' }}
            />
            <Box component="span">
              {country.name} +{country.phoneCode}
            </Box>
          </Box>
        </MenuItem>
      ))}

      {filteredCountries.length === 0 && <MenuItem disabled>No se encontraron países</MenuItem>}
    </TextField>
  );
};

export default CountryPhoneAutocomplete;
