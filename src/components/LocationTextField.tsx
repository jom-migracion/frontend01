import React, { useState, ChangeEvent } from 'react';
import { TextField, InputAdornment, TextFieldProps } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Definir las props del componente (opcional, si quieres que acepte props personalizadas)
interface LocationTextFieldProps extends Omit<TextFieldProps, 'onChange'> {
  onChange?: (value: string) => void;
}
const LocationTextField: React.FC<LocationTextFieldProps> = ({ onChange, ...textFieldProps }) => {
  const [location, setLocation] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setLocation(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <TextField
      label="Ubicación"
      placeholder="¿Dónde?"
      variant="outlined"
      fullWidth
      value={location}
      onChange={handleChange}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <LocationOnIcon sx={{ color: 'grey' }} />
            </InputAdornment>
          ),
        },
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
        },
        '& .MuiInputLabel-root': {
          fontWeight: 'bold',
        },
      }}
      {...textFieldProps} // Pasa las props adicionales al TextField
    />
  );
};

export default LocationTextField;
