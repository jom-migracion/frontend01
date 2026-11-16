import CustomDialog from '@/components/CustomDialog';
import { Avatar, Box, Button, Checkbox, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Item {
  id: number;
  title: string;
  location: string;
  image: string;
}

interface FilterByAdDialogProps {
  open: boolean;
  onClose: () => void;
  listings?: any[];
  onApply?: (selectedIds: string[]) => void;
}

const FilterByAdDialog: React.FC<FilterByAdDialogProps> = ({
  open,
  onClose,
  listings = [],
  onApply,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  // Convertir listings a formato Item
  const itemsData: Item[] = listings.map((listing) => ({
    id: listing.listingRentId || listing.id,
    title: listing.name || listing.title || 'Sin título',
    location: listing.property?.address?.city?.city || 'Sin ubicación',
    image:
      listing.photos?.[0]?.photoLink ||
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
  }));

  const [selected, setSelected] = useState<number[]>(itemsData.map((item) => item.id));

  const handleToggle = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleToggleAll = () => {
    if (selected.length === itemsData.length) {
      // Si todos están seleccionados → desmarca todo
      setSelected([]);
    } else {
      // Si no están todos seleccionados → marca todo
      setSelected(itemsData.map((item) => item.id));
    }
  };

  const handleApply = () => {
    if (onApply) {
      onApply(selected.map(String));
    }
    onClose();
  };

  const handleReset = () => {
    setSelected([]);
    if (onApply) {
      onApply([]);
    }
    onClose();
  };

  return (
    <>
      {/* <CustomDialog isOpen={open} onClose={onClose} maxWidth="sm" title={t('filterByAd.title')}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="body1" fontWeight={500}>
            {selected.length}/{itemsData.length} {t('filterByAd.selectedCount')}
          </Typography>

          <Button
            variant="outlined"
            size="small"
            onClick={handleToggleAll}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              color: '#000',
              borderColor: '#e0e0e0',
              backgroundColor: '#f7f7f7',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#efefef',
              },
            }}
          >
            {selected.length === itemsData.length
              ? t('filterByAd.deselectAll')
              : t('filterByAd.selectAll')}
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {itemsData.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 2,
                p: 1,
                pr: 2,
                '&:hover': { backgroundColor: '#fafafa' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={item.image}
                  variant="rounded"
                  sx={{ width: 64, height: 64, borderRadius: 2 }}
                />
                <Box>
                  <Typography fontWeight={600} sx={{ fontSize: '0.95rem' }}>
                    {item.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                    {item.location}
                  </Typography>
                </Box>
              </Box>

              <Checkbox
                checked={selected.includes(item.id)}
                onChange={() => handleToggle(item.id)}
                sx={{
                  '& .MuiSvgIcon-root': {
                    fontSize: 26,
                  },
                }}
              />
            </Box>
          ))}
        </Box>
        <Box display={'flex'} justifyContent={'space-between'} mt={4}>
          <Button
            variant="text"
            onClick={handleReset}
            sx={{
              textTransform: 'none',
              color: theme.palette.customColors?.primary?.[4] || '#666',
              fontWeight: 500,
              textDecoration: 'underline',
            }}
          >
            {t('filterByAd.reset')}
          </Button>
          <Button
            variant="contained"
            //  disabled={selected.length === 0}
            sx={{
              backgroundColor: theme.palette.customColors?.primary?.[2] || '#000',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '1rem',
              px: 4,
              py: 1.2,
              '&:hover': {
                backgroundColor: theme.palette.customColors?.primary?.[3] || '#222',
              },
              '&:disabled': {
                backgroundColor: '#e0e0e0',
                color: '#999',
              },
            }}
            onClick={handleApply}
          >
            {t('filterByAd.apply')}
          </Button>
        </Box>
      </CustomDialog> */}

      {/* <CustomDialog isOpen={open} onClose={onClose} maxWidth="sm" title={t('filterByAd.title')}>
     
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%', // importante
              maxHeight: '70vh', // ajusta según tu necesidad
            }}
          >

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
                flexShrink: 0, // no se comprime
              }}
            >
              <Typography variant="body1" fontWeight={500}>
                {selected.length}/{itemsData.length} {t('filterByAd.selectedCount')}
              </Typography>

              <Button
                variant="outlined"
                size="small"
                onClick={handleToggleAll}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  color: '#000',
                  borderColor: '#e0e0e0',
                  backgroundColor: '#f7f7f7',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: '#efefef',
                  },
                }}
              >
                {selected.length === itemsData.length
                  ? t('filterByAd.deselectAll')
                  : t('filterByAd.selectAll')}
              </Button>
            </Box>
            <Box
              sx={{
                flex: 1, // ocupa todo el espacio disponible
                overflowY: 'auto', // aquí ocurre el scroll
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                pr: 0.5, // pequeño padding para el scrollbar
              }}
            >
              {itemsData.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: 2,
                    p: 1,
                    pr: 2,
                    '&:hover': { backgroundColor: '#fafafa' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={item.image}
                      variant="rounded"
                      sx={{ width: 64, height: 64, borderRadius: 2 }}
                    />
                    <Box>
                      <Typography fontWeight={600} sx={{ fontSize: '0.95rem' }}>
                        {item.title}
                      </Typography>
                      <Typography color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                        {item.location}
                      </Typography>
                    </Box>
                  </Box>

                  <Checkbox
                    checked={selected.includes(item.id)}
                    onChange={() => handleToggle(item.id)}
                    sx={{
                      '& .MuiSvgIcon-root': {
                        fontSize: 26,
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 3,
                pt: 2,
                borderTop: '1px solid',
                borderColor: 'divider', 
                flexShrink: 0, 
                backgroundColor: 'background.paper', 
              }}
            >
              <Button
                variant="text"
                onClick={handleReset}
                sx={{
                  textTransform: 'none',
                  color: theme.palette.customColors?.primary?.[4] || '#666',
                  fontWeight: 500,
                  textDecoration: 'underline',
                }}
              >
                {t('filterByAd.reset')}
              </Button>

              <Button
                variant="contained"
                sx={{
                  backgroundColor: theme.palette.customColors?.primary?.[2] || '#000',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '1rem',
                  px: 4,
                  py: 1.2,
                  '&:hover': {
                    backgroundColor: theme.palette.customColors?.primary?.[3] || '#222',
                  },
                  '&:disabled': {
                    backgroundColor: '#e0e0e0',
                    color: '#999',
                  },
                }}
                onClick={handleApply}
              >
                {t('filterByAd.apply')}
              </Button>
            </Box>
          </Box>
        </CustomDialog> */}
      <CustomDialog isOpen={open} onClose={onClose} maxWidth="sm" title={t('filterByAd.title')}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            // Altura máxima adaptativa
            maxHeight: {
              xs: '78vh', // móviles
              sm: '72vh', // tablets
              md: '68vh', // desktop
            },
          }}
        >
          {/* Header (contador + Select All) */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: { xs: 1.5, sm: 2 },
              flexShrink: 0,
              gap: 1,
            }}
          >
            <Typography
              variant="body1"
              fontWeight={500}
              sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
            >
              {selected.length}/{itemsData.length} {t('filterByAd.selectedCount')}
            </Typography>

            <Button
              variant="outlined"
              size="small"
              onClick={handleToggleAll}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                color: '#000',
                borderColor: '#e0e0e0',
                backgroundColor: '#f7f7f7',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                px: { xs: 1.5, sm: 2 },
                '&:hover': {
                  backgroundColor: '#efefef',
                },
              }}
            >
              {selected.length === itemsData.length
                ? t('filterByAd.deselectAll')
                : t('filterByAd.selectAll')}
            </Button>
          </Box>

          {/* Lista scrolleable */}
          <Box
            sx={{
              flex: 1,
              minHeight: 0, // ← muy importante para que el scroll funcione bien en flex
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              pr: 0.5,
              // Suaviza el scroll en móviles
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {itemsData.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: 2,
                  p: { xs: 0.75, sm: 1 },
                  pr: { xs: 1, sm: 2 },
                  '&:hover': { backgroundColor: '#fafafa' },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 1.5, sm: 2 },
                    minWidth: 0,
                  }}
                >
                  <Avatar
                    src={item.image}
                    variant="rounded"
                    sx={{
                      width: { xs: 52, sm: 64 },
                      height: { xs: 52, sm: 64 },
                      borderRadius: 2,
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      fontWeight={600}
                      sx={{
                        fontSize: { xs: '0.875rem', sm: '0.95rem' },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{
                        fontSize: { xs: '0.8rem', sm: '0.85rem' },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.location}
                    </Typography>
                  </Box>
                </Box>

                <Checkbox
                  checked={selected.includes(item.id)}
                  onChange={() => handleToggle(item.id)}
                  sx={{
                    ml: 1,
                    '& .MuiSvgIcon-root': {
                      fontSize: { xs: 24, sm: 26 },
                    },
                  }}
                />
              </Box>
            ))}
          </Box>

          {/* Botones anclados (footer fijo) */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: { xs: 2, sm: 3 },
              pt: { xs: 1.5, sm: 2 },
              borderTop: '1px solid',
              borderColor: 'divider',
              flexShrink: 0,
              backgroundColor: 'background.paper',
              gap: 2,
            }}
          >
            <Button
              variant="text"
              onClick={handleReset}
              sx={{
                textTransform: 'none',
                color: theme.palette.customColors?.primary?.[4] || '#666',
                fontWeight: 500,
                textDecoration: 'underline',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                px: { xs: 1, sm: 2 },
              }}
            >
              {t('filterByAd.reset')}
            </Button>

            <Button
              variant="contained"
              sx={{
                backgroundColor: theme.palette.customColors?.primary?.[2] || '#000',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                fontSize: { xs: '0.95rem', sm: '1rem' },
                px: { xs: 3, sm: 4 },
                py: { xs: 1, sm: 1.2 },
                minWidth: { xs: 110, sm: 130 },
                '&:hover': {
                  backgroundColor: theme.palette.customColors?.primary?.[3] || '#222',
                },
                '&:disabled': {
                  backgroundColor: '#e0e0e0',
                  color: '#999',
                },
              }}
              onClick={handleApply}
            >
              {t('filterByAd.apply')}
            </Button>
          </Box>
        </Box>
      </CustomDialog>
    </>
  );
};

export default FilterByAdDialog;
