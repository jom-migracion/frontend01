import React, { useState } from 'react';
import { DateRange, Range, RangeKeyDict } from 'react-date-range';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { es } from 'date-fns/locale';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

interface Props {
  onChange?: (range: Range) => void;
}

const CustomDateRangePicker: React.FC<Props> = ({ onChange }) => {
  const today = new Date();
  const [selectionRange, setSelectionRange] = useState<Range>({
    startDate: today,
    endDate: today,
    key: 'selection',
  });

  const handleSelect = (ranges: RangeKeyDict) => {
    const newRange = ranges.selection;
    if (newRange.startDate && newRange.endDate) {
      setSelectionRange(newRange);
      if (onChange) onChange(newRange);
    }
  };

  const handleClear = () => {
    const cleared = { startDate: new Date(), endDate: new Date(), key: 'selection' };
    setSelectionRange(cleared);
    if (onChange) onChange(cleared);
  };

  return (
    <Box sx={{ pb: 2, maxWidth: '660px', display: 'flex', flexDirection: 'column' }}>
      <DateRange
        ranges={[selectionRange]}
        onChange={handleSelect}
        months={2}
        direction="horizontal"
        rangeColors={
          selectionRange.startDate && selectionRange.endDate ? ['#000'] : ['transparent']
        } // Color solo cuando hay selección
        showDateDisplay={false}
        locale={es}
        minDate={new Date()}
        editableDateInputs={false}
      />

      <Button
        variant="outlined"
        onClick={handleClear}
        sx={{ mt: 2, textTransform: 'none', width: '140px' }}
        disabled={!selectionRange.startDate && !selectionRange.endDate}
      >
        Borrar fechas
      </Button>
    </Box>
  );
};

export default CustomDateRangePicker;
