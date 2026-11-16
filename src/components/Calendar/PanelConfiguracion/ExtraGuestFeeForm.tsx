import React, { useMemo, useState } from 'react';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface ExtraGuestFeeFormProps {
  initialPrice: number;
  onSave: (newPrice: number, countGuest: number) => void;
  onCancel: () => void;
  label?: string;
  initialGuestThreshold?: number;
  maxGuest: number;
}

const ExtraGuestFeeForm: React.FC<ExtraGuestFeeFormProps> = ({
  initialPrice,
  onSave,
  onCancel,
  label = 'Tarifa de huesped adicional por noche',
  initialGuestThreshold,
  maxGuest,
}) => {
  const MIN_PRICE = 1;
  const MAX_PRICE = 1000;
  const maxGuestLimit = Math.max(1, maxGuest || 1);
  const [price, setPrice] = useState<number>(Math.min(MAX_PRICE, Math.max(MIN_PRICE, initialPrice)));
  const [guestThreshold, setGuestThreshold] = useState<number>(
    Math.min(maxGuestLimit, Math.max(1, initialGuestThreshold || 1))
  );

  const canSave = useMemo(
    () =>
      price >= MIN_PRICE &&
      (price !== initialPrice || guestThreshold !== (initialGuestThreshold || 1)),
    [price, initialPrice, guestThreshold, initialGuestThreshold]
  );

  const incrementPrice = () => {
    setPrice((prev) => Math.min(MAX_PRICE, prev + 1));
  };

  const decrementPrice = () => {
    setPrice((prev) => Math.max(MIN_PRICE, prev - 1));
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;

    if (nextValue === '') {
      setPrice(0);
      return;
    }

    const parsedValue = Number(nextValue);

    if (Number.isNaN(parsedValue)) {
      return;
    }

    setPrice(Math.min(MAX_PRICE, Math.max(0, parsedValue)));
  };

  const incrementGuests = () => {
    setGuestThreshold((prev) => Math.min(maxGuestLimit, prev + 1));
  };

  const decrementGuests = () => {
    setGuestThreshold((prev) => Math.max(1, prev - 1));
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        p: 2,
        bgcolor: 'white',
      }}
    >
      <IconButton edge="start" sx={{ mb: 3 }} onClick={onCancel} aria-label="volver">
        <ArrowBackIosIcon fontSize="small" />
      </IconButton>

      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1.5 }}>
        {label}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
        <TextField
          variant="standard"
          value={price}
          onChange={handlePriceChange}
          type="text"
          fullWidth
          placeholder="0"
          InputProps={{
            disableUnderline: true,
            sx: {
              fontSize: '2rem',
              fontWeight: 700,
            },
            inputProps: {
              min: MIN_PRICE,
              max: MAX_PRICE,
              style: { textAlign: 'left' },
            },
          }}
          sx={{
            flexGrow: 1,
            '& .MuiInputBase-root': {
              paddingTop: 0,
            },
            '& .MuiInput-root:before, & .MuiInput-root:after': {
              display: 'none',
            },
            '& input': {
              textAlign: 'center',
              fontSize: '2rem',
              fontWeight: 700,
              padding: 0,
            },
          }}
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <IconButton
            size="small"
            onClick={incrementPrice}
            disabled={price >= MAX_PRICE}
            sx={{
              padding: '2px',
              backgroundColor: 'rgba(94, 77, 178, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(94, 77, 178, 0.2)',
              },
              '&.Mui-disabled': {
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
              },
              mb: 0.5,
            }}
          >
            <KeyboardArrowUpIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={decrementPrice}
            disabled={price <= MIN_PRICE}
            sx={{
              padding: '2px',
              backgroundColor: 'rgba(94, 77, 178, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(94, 77, 178, 0.2)',
              },
              '&.Mui-disabled': {
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
              },
              mb: 0.5,
            }}
          >
            <KeyboardArrowDownIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Typography sx={{ color: '#8e95a3', fontSize: '1.2rem', mb: 1.25 }}>
        Por cada huesped superior a
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3.5 }}>
        <IconButton
          onClick={decrementGuests}
          disabled={guestThreshold <= 1}
          sx={{
            width: 52,
            height: 52,
            border: '1px solid #d3d5da',
            borderRadius: 2,
            backgroundColor: '#fff',
            '&:hover': { backgroundColor: '#f7f7f9' },
            '&.Mui-disabled': { borderColor: '#e1e3e8' },
          }}
        >
          <RemoveIcon />
        </IconButton>

        <Typography sx={{ fontSize: '2rem', fontWeight: 500, minWidth: 42, textAlign: 'center' }}>
          {guestThreshold}
        </Typography>

        <IconButton
          onClick={incrementGuests}
          disabled={guestThreshold >= maxGuestLimit}
          sx={{
            width: 52,
            height: 52,
            border: '1px solid #d3d5da',
            borderRadius: 2,
            backgroundColor: '#fff',
            '&:hover': { backgroundColor: '#f7f7f9' },
            '&.Mui-disabled': { borderColor: '#e1e3e8' },
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      <Button fullWidth variant="primary" onClick={() => onSave(price, guestThreshold)} disabled={!canSave}>
        Guardar
      </Button>
    </Box>
  );
};

export default ExtraGuestFeeForm;
