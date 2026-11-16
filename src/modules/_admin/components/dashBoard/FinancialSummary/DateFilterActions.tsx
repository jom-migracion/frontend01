// components/DateFilterActions.tsx
import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

interface Props {
  startDate: Date;
  endDate: Date;
  onDateChange: (start: Date, end: Date) => void;
  onSelectAll: () => void;
  onDownload: () => void;
}

const DateFilterActions: React.FC<Props> = ({
  startDate,
  endDate,
  onDateChange,
  onSelectAll,
  onDownload,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box mb={2}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems="center"
          flexWrap="wrap"
        >
          <DatePicker
            label="Desde"
            value={startDate}
            onChange={(newValue) => newValue && onDateChange(newValue, endDate)}
            slotProps={{ textField: { fullWidth: false } }}
          />
          <DatePicker
            label="Hasta"
            value={endDate}
            onChange={(newValue) => newValue && onDateChange(startDate, newValue)}
            slotProps={{ textField: { fullWidth: false } }}
          />
          <Button variant="outlined" onClick={onSelectAll}>
            Seleccionar todos los anuncios
          </Button>
          <Button variant="contained" color="primary" onClick={onDownload}>
            Descargar información
          </Button>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
};

export default DateFilterActions;