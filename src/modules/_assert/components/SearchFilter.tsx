
import { Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchFilterProps {
  value: string;
  onSearchChange: (value: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ value, onSearchChange }) => {

  return (
    <Box sx={{ mb: 4, maxWidth: { xs: '100%', sm: 400 } }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Ciudad"
        value={value}
        onChange={e => onSearchChange(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon sx={{ color: '#666' }} />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#fff',
            borderRadius: '4px',
            '& fieldset': {
              borderColor: '#e0e0e0',
            },
            '&:hover fieldset': {
              borderColor: '#ccc',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#000',
            },
          },
          '& .MuiInputBase-input': {
            padding: '12px 14px',
            fontSize: '14px',
            color: '#333',
            '&::placeholder': {
              color: '#999',
              opacity: 1,
            },
          },
        }}
      />
    </Box>
  );
}

export default SearchFilter;

