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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useTranslation } from 'react-i18next';

interface Opcion {
  label: string;
  value: number;
}

const opcionesAnticipacion: Opcion[] = [
  { label: 'El mismo día', value: 0 },
  { label: '1 día', value: 1 },
  { label: '2 días', value: 2 },
  { label: '3 días', value: 3 },
  { label: '4 días', value: 4 },
  { label: '5 días', value: 5 },
  { label: '6 días', value: 6 },
  { label: 'mas de7 días', value: 7 },
  // ... más opciones
];
interface Props {
  minimumNotice: number;
  handleSave: (newValue: number) => void;
}

const SelectorAnticipacionCompleto: React.FC<Props> = ({ minimumNotice, handleSave }) => {
  // states
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState(0);
  
  // hooks
  useEffect(() => {
    setSelectedOption(minimumNotice);
  }, [minimumNotice]);

  // handles and Función para abrir/cerrar el menú
  // Mapa de traducción para convertir las etiquetas originales en claves de i18n
  const translationMap: Record<string, string> = {
    'El mismo día': 'sameDay',
    '1 día': 'oneDay',
    '2 días': 'twoDays',
    '3 días': 'threeDays',
    '4 días': 'fourDays',
    '5 días': 'fiveDays',
    '6 días': 'sixDays',
    'mas de7 días': 'moreThan7', // Coincide con el texto exacto de tu variable original
  };
  const getTranslatedLabel = (originalLabel: string) => {
    const key = translationMap[originalLabel];
    return key ? t(`advanceNoticeSelector.options.${key}`) : originalLabel;
  };
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
    <Paper elevation={isExpanded ? 0 : 0} sx={{ maxWidth: 400, borderRadius: 2, border: '1px solid #ccc' }}>
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
            {t('advanceNoticeSelector.title')}
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
            {t('advanceNoticeSelector.question')}
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
                  primary={<Typography sx={{ fontWeight: 'bold' }}>
                    {getTranslatedLabel(opcion.label)}
                  </Typography>}
                />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ mt: 2, mb: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              fullWidth
              variant="primary"
              onClick={handleGuardar}
            >
              {t('advanceNoticeSelector.save')}
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default SelectorAnticipacionCompleto;
