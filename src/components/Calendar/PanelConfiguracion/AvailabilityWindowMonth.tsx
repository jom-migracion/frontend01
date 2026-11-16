import React, { useEffect, useMemo, useState } from 'react';
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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useTranslation } from 'react-i18next';

interface Opcion {
  label: string;
  value: number;
}

interface Props {
  availabilityWindowMonth: number;
  handleSave: (newValue: number) => void;
}

const AvailabilityWindowMonth: React.FC<Props> = ({
  availabilityWindowMonth,
  handleSave,
}) => {
  const { t } = useTranslation();

  // useState
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState(0);

  // Definir opciones dinámicamente con useMemo para que se traduzcan
  const opcionesAnticipacion: Opcion[] = useMemo(() => [
    { label: t('availabilityWindowMonth.options.24'), value: 24 },
    { label: t('availabilityWindowMonth.options.12'), value: 12 },
    { label: t('availabilityWindowMonth.options.9'), value: 9 },
    { label: t('availabilityWindowMonth.options.6'), value: 6 },
    { label: t('availabilityWindowMonth.options.3'), value: 3 },
  ], [t]);

  //hooks
  useEffect(() => {
    setSelectedOption(availabilityWindowMonth);
  }, [availabilityWindowMonth]);

  //event handlers or functions
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSelectOption = (value: number) => {
    setSelectedOption(value);
  };

  const handleGuardar = () => {
    setIsExpanded(false);
    handleSave(selectedOption);
  };

  // --- RENDERING ---
  return (
    <Paper
      elevation={isExpanded ? 0 : 0}
      sx={{ maxWidth: 400, borderRadius: 2, border: '1px solid #ccc' }}
    >
      <Box
        onClick={toggleExpansion}
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          borderBottom: isExpanded ? '1px solid #e0e0e0' : 'none',
        }}
      >
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            {t('availabilityWindowMonth.title')}
          </Typography>
          {!isExpanded && (
            <Typography variant="body2" color="text.secondary">
              {opcionesAnticipacion.find((opcion) => opcion.value === selectedOption)?.label || ''}
            </Typography>
          )}
        </Box>
        {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </Box>
      {isExpanded && (
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('availabilityWindowMonth.description')}
          </Typography>
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
          <Divider sx={{ mt: 2, mb: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button fullWidth variant="primary" onClick={handleGuardar}>
              {t('availabilityWindowMonth.save')}
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default AvailabilityWindowMonth;
