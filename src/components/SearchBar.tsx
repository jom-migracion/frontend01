import React from 'react';
import { Box, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
  onClick?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onClick }) => {
  return (
    <Box onClick={onClick} sx={{ mt: 2, mb: 5, width: '100%' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar..."
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
            sx: {
              borderRadius: '25px',
              boxShadow: '2px 2px 10px gray',
              color: 'black',
              backgroundColor: 'rgba(255, 251, 251, 0.5)',
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
            },
          },
        }}
      />
    </Box>
  );
};

export default SearchBar;
