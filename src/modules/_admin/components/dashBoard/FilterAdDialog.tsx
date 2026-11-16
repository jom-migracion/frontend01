// 
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Box,
  Button,
  Checkbox,
  Avatar,
  Divider,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';


interface FilterByAdDialogProps {
  open: boolean;
  onClose: () => void;
  itemsData: any[];
  applyFilters?: (selectedIds: number[]) => void;
  initialSelected?: number[] | null;
}


const FilterAdDialog: React.FC<FilterByAdDialogProps> = ({ open, onClose, itemsData = [], applyFilters, initialSelected }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    if (open) {
      if (initialSelected && initialSelected.length > 0) {
        setSelected(initialSelected);
      } else {
        setSelected(itemsData.map((item: any) => item.listingRentId));
      }
    }
  }, [open, itemsData, initialSelected]);

  const handleToggle = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleToggleAll = () => {
    if (selected.length === itemsData.length) {
      // Si todos están seleccionados → desmarca todo
      setSelected([]);
    } else {
      // Si no están todos seleccionados → marca todo
      setSelected(itemsData.map((item:any) => item.listingRentId));
    }
  };
  const brandColor = '#6366f1';
  const secondaryColor = '#818cf8';
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 6,
          p: 1,
        },
      }}
    >
      {/* ---------- Header ---------- */}
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          pb: 1,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {t('filterByAd.title')}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'text.secondary',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider sx={{ mx: 2, borderColor: theme.palette.customColors.primary[1] }} />

      {/* ---------- Content ---------- */}
      <DialogContent sx={{ pt: 2 }}>
        {/* Info selección */}
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
            {selected.length === itemsData.length ? t('filterByAd.deselectAll')
              : t('filterByAd.selectAll')}
          </Button>
        </Box>

        {/* Lista de elementos */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }} key={itemsData.length}>
          {itemsData.map((item:any) => (
            <Box
              key={item?.listingRentId}
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
                  src={item?.photos?.[0]?.photoLink}
                  variant="rounded"
                  sx={{ width: 64, height: 64, borderRadius: 2 }}
                />
                <Box>
                  <Typography fontWeight={600} sx={{ fontSize: '0.95rem' }}>
                    {item?.name}
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                    {`${item?.property?.stateName??''} - ${item?.property?.countryName??''}`  || 'Sin dirección'}
                  </Typography>
                </Box>
              </Box>

              <Checkbox
                checked={selected.includes(item.listingRentId)}
                onChange={() => handleToggle(item.listingRentId)}
                sx={{
                  '& .MuiSvgIcon-root': {
                    fontSize: 26,
                  },
                }}
              />
            </Box>
          ))}
        </Box>
      </DialogContent>

      {/* ---------- Footer ---------- */}
      <DialogActions sx={{ justifyContent: 'center', pb: 2, px: 3 }}>
        <Button
          variant="contained"
          fullWidth
          disabled={selected.length === 0} // Deshabilitar si no hay elementos seleccionados
          sx={{
            background:  `linear-gradient(90deg, ${brandColor} 0%, ${secondaryColor} 100%)`,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '1rem',
            py: 1.2,
            '&:hover': {
              backgroundColor: '#222',
            },
            '&:disabled': {
              backgroundColor: '#e0e0e0',
              color: '#999',
            },
          }}
          onClick={() => applyFilters && applyFilters(selected)}
        >
          {t('filterByAd.apply')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterAdDialog;
