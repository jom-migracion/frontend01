import { useGet } from '@/hooks/api';
import AmenityTypes from '@/models/interfaces/AmenityTypes';
import ModalFilterProps from '@/models/interfaces/ModalFilterProps';
import theme from '@/themes/theme';
// import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, IconButton, Stack, TextField, Typography, alpha } from '@mui/material';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CustomDialog from './CustomDialog';

const ModalFilter: React.FC<ModalFilterProps> = ({ open, onClose, onSubmit }) => {
  const [min, setMin] = React.useState<string | undefined>(undefined);
  const [max, setMax] = React.useState<string | undefined>(undefined);
  const [priceError, setPriceError] = React.useState<string | undefined>(undefined);
  const [category, setCategory] = React.useState<number | null>(null);
  const [roomCounts, setRoomCounts] = React.useState<{
    habitaciones: number;
    banos: number;
    camas: number;
  }>({
    habitaciones: 0,
    banos: 0,
    camas: 0,
  });

  const { t } = useTranslation();
  const [selectedServices, setSelectedServices] = React.useState<number[]>([]);
  const { data: servicesData } = useGet<AmenityTypes[]>('services', '/Parametrics/AmenityTypes');

  const handleServiceChange = (amenitiesTypeId: number) => {
    setSelectedServices((prev) =>
      prev.includes(amenitiesTypeId)
        ? prev.filter((s) => s !== amenitiesTypeId)
        : [...prev, amenitiesTypeId]
    );
  };

  const handleRoomChange = (type: 'habitaciones' | 'banos' | 'camas', increment: boolean) => {
    setRoomCounts((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + (increment ? 1 : -1)),
    }));
  };

  const handlePriceChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: 'min' | 'max'
  ) => {
    const val = event.target.value.replace(/[^0-9]/g, '');
    const newMin = type === 'min' ? val : min;
    const newMax = type === 'max' ? val : max;
    if (type === 'min') setMin(val);
    if (type === 'max') setMax(val);
    if (newMin && newMax && Number(newMin) >= Number(newMax)) {
      setPriceError(t('filter.priceError'));
    } else {
      setPriceError(undefined);
    }
  };

  const handleSubmit = () => {
    if (min && max && Number(min) >= Number(max)) {
      setPriceError(t('filter.priceError'));
      return;
    }
    const filterData = {
      category: (category !== null ? category : false) as number | undefined | false,
      minPrice: Number(min) || undefined,
      maxPrice: Number(max) || undefined,
      roomCounts,
      services: Array.isArray(selectedServices) ? selectedServices.map(Number) : [],
    };

    // Guardar filtros en localStorage
    localStorage.setItem('searchFilters', JSON.stringify(filterData));

    onSubmit(filterData);
    onClose(); // Cierra el modal
  };

  const handleClear = () => {
    setMin('');
    setMax('');
    setPriceError(undefined);
    setRoomCounts({ habitaciones: 0, banos: 0, camas: 0 });
    setSelectedServices([]);

    // Limpiar filtros de localStorage
    localStorage.removeItem('searchFilters');

    onSubmit({
      category: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      roomCounts: { habitaciones: 0, banos: 0, camas: 0 },
      services: [],
    });
    onClose();
  };

  useEffect(() => {
    if (open) {
      // Cargar categoría desde search-form-storage
      const storedSearchData = localStorage.getItem('search-form-storage');
      if (storedSearchData) {
        try {
          const parsedData = JSON.parse(storedSearchData);
          if (
            parsedData.PropertyTypeId !== undefined &&
            !isNaN(Number(parsedData.PropertyTypeId))
          ) {
            setCategory(Number(parsedData.PropertyTypeId));
          }
        } catch (error) {
          console.error('Error parsing search-form-storage:', error);
        }
      }

      // Cargar filtros guardados desde searchFilters
      const storedFilters = localStorage.getItem('searchFilters');
      if (storedFilters) {
        try {
          const parsedFilters = JSON.parse(storedFilters);

          if (parsedFilters.minPrice !== undefined) {
            setMin(parsedFilters.minPrice.toString());
          }
          if (parsedFilters.maxPrice !== undefined) {
            setMax(parsedFilters.maxPrice.toString());
          }
          if (parsedFilters.roomCounts) {
            setRoomCounts(parsedFilters.roomCounts);
          }
          if (parsedFilters.services && Array.isArray(parsedFilters.services)) {
            setSelectedServices(parsedFilters.services);
          }
        } catch (error) {
          console.error('Error parsing searchFilters:', error);
        }
      }
    }
  }, [open]);

  const brandColor = theme.palette.primary.main;

  return (
    <CustomDialog maxWidth="sm" isOpen={open} onClose={() => onClose()} title={t('filter.title')}>
      <Box sx={{ mb: 5 }}>
        <Stack direction="row" alignItems="center" gap={1.5} mb={2.5}>
          <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: '1.1rem' }}>
            {t('filter.price')}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2}>
          {[
            { label: t('filter.min'), val: min, id: 'min' as const },
            { label: t('filter.max'), val: max, id: 'max' as const },
          ].map((input) => (
            <Box key={input.id} flex={1}>
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, color: '#64748b', ml: 1, mb: 0.5, display: 'block' }}
              >
                {input.label}
              </Typography>
              <TextField
                fullWidth
                value={input.val ?? ''}
                onChange={(e) => handlePriceChange(e, input.id)}
                placeholder="0"
                error={!!priceError}
                slotProps={{
                  input: {
                    startAdornment: (
                      <Typography sx={{ mr: 1, fontWeight: 700, fontSize: '0.85rem' }}>
                        BOB
                      </Typography>
                    ),
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    '& fieldset': { borderColor: alpha(brandColor, 0.1) },
                    '&:hover fieldset': { borderColor: brandColor },
                    '&.Mui-focused fieldset': { borderColor: brandColor, borderWidth: '2px' },
                  },
                }}
              />
            </Box>
          ))}
        </Stack>
        {priceError && (
          <Typography variant="caption" sx={{ color: 'error.main', mt: 0, display: 'block' }}>
            {priceError}
          </Typography>
        )}
      </Box>
      <Box>
        <Stack direction="row" alignItems="center" gap={1.5} mb={2.5}>
          <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: '1.1rem' }}>
            {t('filter.roomsAndBeds')}
          </Typography>
        </Stack>
      </Box>
      <Box
        sx={{
          mb: 5,
          p: 3,
          bgcolor: '#f8f9fc',
          borderRadius: '24px',
          border: `1px solid ${alpha(brandColor, 0.05)}`,
        }}
      >
        <Stack spacing={3}>
          {[
            { id: 'habitaciones' as const, label: t('filter.bedrooms') },
            { id: 'camas' as const, label: t('filter.beds') },
            { id: 'banos' as const, label: t('filter.bathrooms') },
          ].map((item) => (
            <Box key={item.id} display="flex" justifyContent="space-between" alignItems="center">
              <Typography sx={{ fontWeight: 600, color: '#55606e' }}>{item.label}</Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton
                  onClick={() => handleRoomChange(item.id, false)}
                  disabled={roomCounts[item.id] === 0}
                  sx={{
                    width: 38,
                    height: 38,
                    border: `1px solid ${alpha(brandColor, 0.2)}`,
                    color: brandColor,
                    transition: '0.2s',
                    '&:hover': { bgcolor: theme.palette.secondary.main, color: 'white' },
                  }}
                >
                  <Typography fontSize={20} fontWeight={400}>
                    −
                  </Typography>
                </IconButton>
                <Typography
                  sx={{
                    minWidth: 25,
                    textAlign: 'center',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    color: '#1e293b',
                  }}
                >
                  {roomCounts[item.id]}
                </Typography>
                <IconButton
                  onClick={() => handleRoomChange(item.id, true)}
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: brandColor,
                    color: 'white',
                    '&:hover': { bgcolor: theme.palette.primary.dark },
                  }}
                >
                  <Typography fontSize={20} fontWeight={400} sx={{ color: 'white' }}>
                    +
                  </Typography>
                </IconButton>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* SERVICIOS ESTILO "CHIPS" */}
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" alignItems="center" gap={1.5} mb={2.5}>
          <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: '1.1rem' }}>
            {t('filter.services')}
          </Typography>
        </Stack>

        <Box display="flex" flexWrap="wrap" gap={1.5}>
          {(servicesData?.data || []).map((service) => {
            const isSelected = selectedServices.includes(service.amenitiesTypeId);
            return (
              <Button
                key={service.amenitiesTypeId}
                onClick={() => handleServiceChange(service.amenitiesTypeId)}
                sx={{
                  borderRadius: '12px',
                  px: 2,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: isSelected ? 800 : 500,
                  bgcolor: isSelected ? brandColor : 'white',
                  color: isSelected ? 'white' : '#64748b',
                  border: `1px solid ${isSelected ? brandColor : alpha('#64748b', 0.2)}`,
                  boxShadow: isSelected ? `0 4px 12px ${alpha(brandColor, 0.3)}` : 'none',
                  '&:hover': {
                    bgcolor: isSelected ? brandColor : alpha(brandColor, 0.05),
                    borderColor: brandColor,
                  },
                }}
              >
                {service.valueString}
              </Button>
            );
          })}
        </Box>
      </Box>
      <Box
        sx={{
          pt: 3,
          display: 'flex',
          gap: 2,
          borderTop: `1px solid ${theme.palette.divider})}`,
          bgcolor: 'white',
        }}
      >
        <Button fullWidth variant="secondary" onClick={handleClear}>
          {t('filter.clearFilters')}
        </Button>
        <Button fullWidth variant="primary" onClick={handleSubmit}>
          {t('filter.search')}
        </Button>
      </Box>
    </CustomDialog>
  );
};

export default ModalFilter;
