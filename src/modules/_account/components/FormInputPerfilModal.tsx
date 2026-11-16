import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
  Box,
  Divider,
  IconButton,
  TextField,
  InputAdornment,
  List,
  ListItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ReviewModalProps {
  //   reviews: ReviewsProps[];
  //   rating: number;
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  placeholder: string;
  inputLanguage: boolean;
}

// interface LanguageSelectorProps {}

const ALL_LANGUAGES: string[] = [
  'Español',
  'Lengua de señas',
  'Maratí',
  'Albanés',
  'Alemán',
  'Armenio',
  'Azerbaijano',
  'Bengalí',
  'Bielorruso',
  'Birmao',
  'Bosnio',
  'Búlgaro',
  // Add more languages as needed based on your full list
];
const LOCAL_STORAGE_KEY = 'selectedLanguages';

const FormInputPerfilModal: React.FC<ReviewModalProps> = ({
  open,
  onClose,
  title,
  description,
  placeholder,
  inputLanguage,
}) => {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(() => {
    // Initialize state from localStorage
    const storedLanguages = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedLanguages ? JSON.parse(storedLanguages) : [];
  });
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Effect to save selectedLanguages to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(selectedLanguages));
  }, [selectedLanguages]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguages((prevSelectedLanguages) => {
      if (prevSelectedLanguages.includes(language)) {
        return prevSelectedLanguages.filter((lang) => lang !== language);
      } else {
        return [...prevSelectedLanguages, language];
      }
    });
  };

  const filteredLanguages = ALL_LANGUAGES.filter((language) =>
    language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slots={{
        transition: Transition,
      }}
      slotProps={{
        paper: {
          // Apuntamos al slot 'paper'
          sx: {
            borderRadius: '20px', // Ajusta este valor a tu gusto
          },
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography sx={{ flexGrow: 1, textAlign: 'center' }}></Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
      </DialogTitle>

      <DialogContent>
        {!inputLanguage ? (
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 12 }}>
              <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
                {' '}
                {/* Scrollable reviews container */}
                <Typography variant="h6">{title}</Typography>
                <Typography variant="body1">{description}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
              <TextField
                fullWidth
                variant="outlined" // Puedes probar "filled" o "standard" también
                placeholder={placeholder}
                // value={firstName} // Vincula el valor del input al estado
                // onChange={(e) => setFirstName(e.target.value)} // Actualiza el estado cuando el input cambia
                sx={{
                  '& .MuiOutlinedInput-root': {
                    // Estilos específicos para el input si necesitas ajustarlos
                    borderRadius: '4px', // Por si quieres ajustar el borde
                  },
                  '& .MuiInputBase-input::placeholder': {
                    // Estilo para el placeholder
                    color: 'text.secondary', // Color más grisáceo para el placeholder
                    opacity: 1, // Asegura que el placeholder no esté transparente
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 12 }} display={'flex'} justifyContent={'flex-end'}>
              <Typography variant="body2">20 caracteres disponibles</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 12 }} display={'flex'} justifyContent={'flex-end'}>
              <Button variant="contained">Guardar</Button>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 12 }}>
              <Box sx={{ maxHeight: '200px', overflowY: 'auto' }}>
                {' '}
                {/* Scrollable reviews container */}
                <Typography variant="h6">{title}</Typography>
                <Typography variant="body1">{description}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Busca un idioma"
                value={searchTerm}
                onChange={handleSearchChange}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
              <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {filteredLanguages.map((language) => (
                  <ListItem key={language} disablePadding>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedLanguages.includes(language)}
                          onChange={() => handleLanguageChange(language)}
                        />
                      }
                      label={language}
                      sx={{ width: '100%' }} // Make the label area clickable
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid size={{ xs: 12, md: 12 }} display={'flex'} justifyContent={'flex-end'}>
              <Button variant="contained">Guardar</Button>
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FormInputPerfilModal;
