import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Paper,
  Divider,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'; // Icono para la vista contraída
import { useTranslation } from 'react-i18next';

interface Opcion {
  label: string;
  value: string;
}

const opcionesAnticipacion: Opcion[] = [
  { label: '06:00', value: '06:00:00' },
  { label: '07:00', value: '07:00:00' },
  { label: '08:00', value: '08:00:00' },
  { label: '09:00', value: '09:00:00' },
  { label: '10:00', value: '10:00:00' },
  { label: '11:00', value: '11:00:00' },
  { label: '12:00', value: '12:00:00' },
  { label: '13:00', value: '13:00:00' },
  { label: '14:00', value: '14:00:00' },
  { label: '15:00', value: '15:00:00' },
  { label: '16:00', value: '16:00:00' },
  { label: '17:00', value: '17:00:00' },
  { label: '18:00', value: '18:00:00' },
  { label: '19:00', value: '19:00:00' },
  { label: '20:00', value: '20:00:00' },
  { label: '21:00', value: '21:00:00' },
  { label: '22:00', value: '22:00:00' },
  { label: '23:00', value: '23:00:00' },
  { label: '00:00', value: '00:00:00' },
];

interface Props {
  // propiedadId: string;
  minimumNoticeHour: string;
  handleSave: (newValue: string) => void;
}

const SameDayNoticeHours: React.FC<Props> = ({minimumNoticeHour, handleSave}) => {
  
  const { t } = useTranslation();
  // 1. Estado para controlar si el menú está abierto o cerrado
  const [isExpanded, setIsExpanded] = useState(false);
  // 2. Estado para la opción de anticipación seleccionada
  const [selectedOption, setSelectedOption] = useState('06:00:00');

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSelectOption = (value: string) => {
    setSelectedOption(value);
  };

  const handleGuardar = () => {
    setIsExpanded(false);
    handleSave(selectedOption);
  };

  useEffect(() => {
    setSelectedOption(minimumNoticeHour);
  }, [minimumNoticeHour]);

  return (
    <Paper elevation={isExpanded ? 0 : 0} sx={{ maxWidth: 400, borderRadius: 2, border: '1px solid #ccc' }}>
      <Box
        onClick={toggleExpansion}
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          borderBottom: isExpanded ? '1px solid #e0e0e0' : 'none', // Línea si está abierto
        }}
      >
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            {t('sameDayNotice.title')}
          </Typography>
          {!isExpanded && (
            <Typography variant="body2" color="text.secondary">
              {opcionesAnticipacion.find((op) => op.value === selectedOption)?.label || '06:00'}
            </Typography>
          )}
        </Box>
        {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </Box>

      {isExpanded && (
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('sameDayNotice.question')}
          </Typography>

          {/* Lista de Opciones (El mismo día, 1 día, 2 días...) */}
          <List
            disablePadding
            sx={{
              maxHeight: 200,
              overflowY: 'auto',
            }}
          >
            {opcionesAnticipacion.map((opcion) => (
              <ListItem
                key={opcion.value}
                onClick={() => handleSelectOption(opcion.value)}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 1,
                  '&:hover': { backgroundColor: 'action.hover' },
                }}
                secondaryAction={selectedOption === opcion.value && <CheckIcon color="primary" />}
              >
                <ListItemText
                  primary={<Typography sx={{ fontWeight: 'bold' }}>{opcion.label}</Typography>}
                />
              </ListItem>
            ))}
          </List>

          {/* Botón Guardar */}
          <Divider sx={{ mt: 2, mb: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="primary"
              onClick={handleGuardar}
              fullWidth
            >
              {t('sameDayNotice.save')}
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default SameDayNoticeHours;
