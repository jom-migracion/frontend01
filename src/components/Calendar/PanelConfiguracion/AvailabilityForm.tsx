import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Switch,
  Alert,
  Stack,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SelectedDay } from '@/models/interfaces/SelectedDay';
import { formatDateDdMmYyyy } from '@/common/util/dateFunctions';

interface AvailabilityFormProps {
  onSave: (available: boolean) => void;
  diasSeleccionados: SelectedDay[];
  areDatesBlocked?: boolean;
}

const AvailabilityForm: React.FC<AvailabilityFormProps> = ({
  onSave,
  diasSeleccionados,
  areDatesBlocked = false,
}) => {
  const { t } = useTranslation();
  
  const [isAvailable, setIsAvailable] = useState<boolean>(!areDatesBlocked);
  // Actualizar el estado cuando cambian las fechas seleccionadas
  useEffect(() => {
    setIsAvailable(!areDatesBlocked);
  }, [areDatesBlocked]);

  const handleAvailabilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setIsAvailable(newValue);
    onSave(newValue);
  };

  const formatDatesRange = (dates: SelectedDay[]) => (
    <Box component="ul" sx={{ m: 0, pl: 0, listStyleType: 'none' }}>
      {[...dates].sort((a, b) => a.date.localeCompare(b.date)).map((item) => (
        <li key={item.date}>
          <Typography variant="body2">
            {formatDateDdMmYyyy(new Date(item.date + 'T00:00:00'))} — {item.price} BOB
          </Typography>
        </li>
      ))}
    </Box>
  );

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, mb: 3 }}>
        <Typography variant="body1" fontWeight={500} mb={2}>
          {t('panelCalendarConfig.selectedDates')}:
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }} icon={false}>
          {formatDatesRange(diasSeleccionados)}
        </Alert>
        <Box component="form">
          <Stack 
            direction="row" 
            justifyContent="space-between" 
            alignItems="center" 
            sx={{ 
              p: 2.5, 
              border: '1px solid #e0e0e0', 
              borderRadius: 2, 
              mb: 3,
              backgroundColor: '#fafafa'
            }}
          >
            <Typography variant="body1" fontWeight={500}>
              {t('panelCalendarConfig.availability')}
            </Typography>
            
            <Switch
              checked={isAvailable}
              onChange={handleAvailabilityChange}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#fff',
                  '& + .MuiSwitch-track': {
                    backgroundColor: '#4CAF50',
                    opacity: 1,
                  },
                },
                '& .MuiSwitch-switchBase.Mui-disabled': {
                  color: '#bdbdbd',
                },
                '& .MuiSwitch-switchBase': {
                  color: '#fff',
                  '&:not(.Mui-checked)': {
                    color: '#fafafa',
                  },
                },
                '& .MuiSwitch-track': {
                  backgroundColor: isAvailable ? '#4CAF50' : '#bdbdbd',
                  opacity: 1,
                },
                '& .MuiSwitch-thumb': {
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  backgroundColor: isAvailable ? '#fff' : '#e0e0e0',
                },
              }}
              size="medium"
            />
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default AvailabilityForm;