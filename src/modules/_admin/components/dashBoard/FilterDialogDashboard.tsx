import CustomDialog from '@/components/CustomDialog';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FilterDialogDashboardProps {
  open: boolean;
  onClose: () => void;
  onApply: (filterType: 'mensual' | 'anual', year: number, month?: number) => void;
  currentView?: 'mensual' | 'anual';
  currentYear?: number;
  currentMonth?: number;
}

const MONTH_NAMES_ES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const FilterDialogDashboard: React.FC<FilterDialogDashboardProps> = ({
  open,
  onClose,
  onApply,
  currentView = 'mensual',
  currentYear,
  currentMonth,
}) => {
  const now = new Date().getFullYear();
  const [filterType, setFilterType] = useState<'mensual' | 'anual'>(currentView);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear ?? now);
  const [selectedMonth, setSelectedMonth] = useState<number | ''>(currentMonth ?? '');

  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      setFilterType(currentView);
      setSelectedYear(currentYear ?? now);
      setSelectedMonth(currentMonth ?? '');
    }
  }, [open, currentView, currentYear, currentMonth]);

  // currentYear ± 5 → 11 year options
  const yearOptions = Array.from({ length: 11 }, (_, i) => now - 5 + i);

  const handleApply = () => {
    const month =
      filterType === 'mensual' && selectedMonth !== '' ? (selectedMonth as number) : undefined;
    onApply(filterType, selectedYear, month);
  };

  return (
    <>
      <CustomDialog
        isOpen={open}
        onClose={onClose}
        maxWidth="sm"
        title={t('filterDialogDashboard.title')}
      >
        <RadioGroup
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as 'mensual' | 'anual')}
        >
          <FormControlLabel
            value="anual"
            control={<Radio size="small" />}
            label={t('filterDialogDashboard.options.annual')}
          />
          <FormControlLabel
            value="mensual"
            control={<Radio size="small" />}
            label={t('filterDialogDashboard.options.monthly')}
          />
        </RadioGroup>

        {/* Year dropdown - always visible */}
        <Box mt={2}>
          <FormControl fullWidth size="small">
            <InputLabel>{t('filterDialogDashboard.labels.year')}</InputLabel>
            <Select
              value={selectedYear}
              label={t('filterDialogDashboard.labels.year')}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              sx={{ borderRadius: 1 }}
            >
              {yearOptions.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Month dropdown - only for mensual, optional */}
        {filterType === 'mensual' && (
          <Box mt={2}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('filterDialogDashboard.labels.month')}</InputLabel>
              <Select
                value={selectedMonth}
                label={t('filterDialogDashboard.labels.month')}
                onChange={(e) => setSelectedMonth(e.target.value as number | '')}
                sx={{ borderRadius: 1 }}
              >
                <MenuItem value="">
                  <em>{t('filterDialogDashboard.placeholders.allMonths')}</em>
                </MenuItem>
                {MONTH_NAMES_ES.map((name, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
        <Box display={'flex'} justifyContent="flex-end" mt={2} mb={2}>
          <Button fullWidth variant="primary" onClick={handleApply}>
            {t('filterDialogDashboard.applyButton')}
          </Button>
        </Box>
      </CustomDialog>
    </>
  );
};

export default FilterDialogDashboard;
