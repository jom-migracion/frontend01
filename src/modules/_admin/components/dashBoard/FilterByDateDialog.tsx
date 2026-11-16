import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Box,
  Typography,
  Link,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { DateRange } from 'react-date-range';
import { es } from 'date-fns/locale';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

interface FilterByDateDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: (startDate: string, endDate: string) => void;
}

const FilterByDateDialog: React.FC<FilterByDateDialogProps> = ({ open, onClose, onApply }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [selectedValue, setSelectedValue] = useState('all');
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue((event.target as HTMLInputElement).value);
  };

  const handleSelect = (ranges: any) => {
    setSelectionRange(ranges.selection);
  };

  const formatDateToYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleApply = () => {
    let startDate = '';
    let endDate = '';

    if (selectedValue === 'custom') {
      startDate = formatDateToYYYYMMDD(selectionRange.startDate);
      endDate = formatDateToYYYYMMDD(selectionRange.endDate);
    } else if (selectedValue === 'next30') {
      startDate = formatDateToYYYYMMDD(new Date());
      const end = new Date();
      end.setDate(end.getDate() + 30);
      endDate = formatDateToYYYYMMDD(end);
    } else if (selectedValue === 'next60') {
      startDate = formatDateToYYYYMMDD(new Date());
      const end = new Date();
      end.setDate(end.getDate() + 60);
      endDate = formatDateToYYYYMMDD(end);
    } else if (selectedValue === 'next90') {
      startDate = formatDateToYYYYMMDD(new Date());
      const end = new Date();
      end.setDate(end.getDate() + 90);
      endDate = formatDateToYYYYMMDD(end);
    }

    onApply(startDate, endDate);
    onClose();
  };

  const handleReset = () => {
    setSelectedValue('all');
    setSelectionRange({
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    });
    onApply('', '');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 6, // Bordes redondeados
            boxShadow: 3,
            width: 340, // Ancho aproximado
            margin: 2,
          },
        },
      }}
    >
      {/* --- Cabecera con Título y Botón de Cerrar --- */}
      <DialogTitle sx={{ p: 2, pb: 1.5 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            {t('filterByDateDialog.title')}
          </Typography>
          <IconButton aria-label="close" onClick={onClose} sx={{ color: 'black' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider sx={{ mx: 2, borderColor: theme.palette.customColors.primary[1] }} />

      {/* --- Contenido con Opciones --- */}
      <DialogContent sx={{ p: 2, pt: 1, borderTop: '1px solid #e0e0e0' }}>
        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <RadioGroup name="filter-by-date-group" value={selectedValue} onChange={handleChange}>
            {/* Estilos comunes para los radio buttons */}
            <FormControlLabel
              value="all"
              control={
                <Radio sx={{ '&.Mui-checked': { color: theme.palette.customColors.primary[1] } }} />
              }
              label={t('filterByDateDialog.options.all')}
              sx={{ '.MuiTypography-root': { fontWeight: 500 } }}
            />
            <FormControlLabel
              value="custom"
              control={
                <Radio sx={{ '&.Mui-checked': { color: theme.palette.customColors.primary[1] } }} />
              }
              label={t('filterByDateDialog.options.custom')}
              sx={{ '.MuiTypography-root': { fontWeight: 500 } }}
            />
            {selectedValue === 'custom' && (
              <Box sx={{ mt: 2, mb: 2 }}>
                <DateRange
                  ranges={[selectionRange]}
                  onChange={handleSelect}
                  months={2}
                  direction={isMobile ? 'vertical' : 'horizontal'}
                  rangeColors={[theme.palette.customColors.primary[1]]}
                  showDateDisplay={false}
                  locale={es}
                  minDate={new Date()}
                />
              </Box>
            )}
            <FormControlLabel
              value="next30"
              control={
                <Radio sx={{ '&.Mui-checked': { color: theme.palette.customColors.primary[1] } }} />
              }
              label={t('filterByDateDialog.options.next30')}
              sx={{ '.MuiTypography-root': { fontWeight: 500 } }}
            />
            <FormControlLabel
              value="next60"
              control={
                <Radio sx={{ '&.Mui-checked': { color: theme.palette.customColors.primary[1] } }} />
              }
              label={t('filterByDateDialog.options.next60')}
              sx={{ '.MuiTypography-root': { fontWeight: 500 } }}
            />
            <FormControlLabel
              value="next90"
              control={
                <Radio sx={{ '&.Mui-checked': { color: theme.palette.customColors.primary[1] } }} />
              }
              label={t('filterByDateDialog.options.next90')}
              sx={{ '.MuiTypography-root': { fontWeight: 500 } }}
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>

      {/* --- Acciones (Botones) --- */}
      <DialogActions sx={{ p: 2, justifyContent: 'space-between', alignItems: 'center' }}>
        <Link
          component="button"
          variant="body1"
          onClick={handleReset}
          sx={{
            color: theme.palette.customColors.primary[4],
            textDecoration: 'underline',
            fontWeight: 'medium',
            cursor: 'pointer',
          }}
        >
          {t('filterByDateDialog.actions.reset')}
        </Link>
        <Button
          onClick={handleApply}
          variant="contained"
          sx={{
            backgroundColor: theme.palette.customColors.primary[2],
            color: 'white',
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 'bold',
            borderRadius: 2,
            px: 4,
            '&:hover': {
              backgroundColor: theme.palette.customColors.primary[3],
            },
          }}
        >
          {t('filterByDateDialog.actions.apply')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterByDateDialog;
