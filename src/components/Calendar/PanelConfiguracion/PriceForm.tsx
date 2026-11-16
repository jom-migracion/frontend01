import React, { useState, useCallback, ChangeEvent } from 'react';
import { Box, TextField, Button, Typography, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// --- Props Interface ---
interface PriceFormProps {
  initialPrice: number;
  onSave: (newPrice: number) => void;
  onCancel: () => void;
  label?: string;
  unit?: string;
  isPercentage?: boolean;
  maxLimit?: number;
  isTarifa?: boolean;
}

/**
 * Un componente de formulario para visualizar y editar un precio.
 * @param {PriceFormProps} props - Las propiedades del componente.
 */
const PriceForm: React.FC<PriceFormProps> = ({
  initialPrice,
  onSave,
  onCancel,
  label = 'Precio por noche',
  unit = '',
  isTarifa = false,
  isPercentage = false, // Valor por defecto
  maxLimit, // Límite máximo opcional
}) => {
  // Estado local para el valor del precio como string (para permitir edición libre)
  const [priceInput, setPriceInput] = useState<string>(initialPrice.toString());
  // Estado para el valor numérico validado
  const [price, setPrice] = useState<number>(initialPrice);

  // Determina la unidad a usar ('%' si es porcentaje, 'unit' si es precio)
  const displayUnit = isPercentage ? '%' : unit;

  // Determina el límite máximo: usa la prop si está disponible, sino el comportamiento por defecto
  const effectiveMaxLimit = maxLimit ?? (isPercentage ? 100 : Number.MAX_SAFE_INTEGER);
  const minimumAllowedValue = isPercentage ? 0 : 90;
  const hasMinimumError = (!isTarifa || !isPercentage) && price < minimumAllowedValue;

  // Maneja el cambio en el campo de texto con validación de límite.
  const handlePriceChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;

      // Permitir string vacío para que el usuario pueda borrar todo
      if (inputValue === '') {
        setPriceInput('');
        setPrice(0);
        return;
      }

      // Eliminar ceros a la izquierda y validar que solo contenga números
      const cleanValue = inputValue.replace(/^0+/, '') || '0';

      // Validar que solo contenga números
      const numericRegex = /^\d+$/;
      if (!numericRegex.test(cleanValue)) {
        return; // No actualizar si contiene caracteres no numéricos
      }

      // Convertir a número para validación
      const numericValue = parseInt(cleanValue, 10);

      // Validación de límites
      if (numericValue > effectiveMaxLimit) {
        return; // No permitir valores mayores al límite máximo
      }

      // Actualizar ambos estados con el valor limpio (sin ceros a la izquierda)
      setPriceInput(cleanValue);
      setPrice(numericValue);
    },
    [isPercentage]
  );

  // Maneja el guardado del nuevo valor.
  const handleSave = useCallback(() => {
    // Solo guarda si el valor es diferente al inicial y está dentro de los límites.
    if (isTarifa) {
      if(price !== initialPrice) { // && !hasMinimumError) {
        onSave(price);
      }
    } else {
      if (price !== initialPrice && price >= minimumAllowedValue && price <= effectiveMaxLimit) {
        onSave(price);
      }
    }
  }, [price, initialPrice, onSave, effectiveMaxLimit, minimumAllowedValue]);

  // Maneja cuando el campo pierde el foco para limpiar formato
  const handleBlur = useCallback(() => {
    // Si el campo está vacío, restablecer al valor inicial
    if (priceInput === '') {
      setPriceInput(initialPrice.toString());
      setPrice(initialPrice);
      return;
    }

    // Limpiar cualquier cero a la izquierda que pueda haber quedado
    const cleanValue = priceInput.replace(/^0+/, '') || '0';
    if (cleanValue !== priceInput) {
      setPriceInput(cleanValue);
      setPrice(parseInt(cleanValue, 10));
    }
  }, [priceInput, initialPrice]);

  // Incrementa el valor en 1
  const handleIncrement = useCallback(() => {
    const newValue = price + 1;
    if (newValue <= effectiveMaxLimit) {
      setPriceInput(newValue.toString());
      setPrice(newValue);
    }
  }, [price, effectiveMaxLimit]);

  // Decrementa el valor en 1
  const handleDecrement = useCallback(() => {
    const newValue = Math.max(0, price - 1);
    setPriceInput(newValue.toString());
    setPrice(newValue);
  }, [price]);

  return (
    <Box
      component="div"
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

      <Box display="flex" alignItems="center" sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" position="relative" sx={{ flexGrow: 1 }}>
          <TextField
            variant="standard"
            type="text"
            value={priceInput}
            onChange={handlePriceChange}
            onBlur={handleBlur}
            placeholder="0"
            error={!isTarifa && hasMinimumError}
            helperText={!isTarifa && hasMinimumError ? 'No puede ser menor a 90' : ''}
            InputProps={{
              disableUnderline: true,
              sx: {
                fontSize: '1.5rem',
                fontWeight: 'bold',
                p: 0,
              },
            }}
            sx={{
              flexGrow: 1,
            }}
          />
          {displayUnit && (
            <Typography
              variant="body1"
              sx={{
                ml: 1,
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'text.secondary',
              }}
            >
              {displayUnit}
            </Typography>
          )}
        </Box>

        {/* Botones de incremento/decremento */}
        <Box display="flex" flexDirection="column" ml={2}>
          <IconButton
            size="small"
            onClick={handleIncrement}
            disabled={price >= effectiveMaxLimit}
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
            onClick={handleDecrement}
            disabled={price <= 0}
            sx={{
              padding: '2px',
              backgroundColor: 'rgba(94, 77, 178, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(94, 77, 178, 0.2)',
              },
              '&.Mui-disabled': {
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
              },
            }}
          >
            <KeyboardArrowDownIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      <Button
        fullWidth
        variant="primary"
        onClick={handleSave}
        disabled={
          isTarifa ? price === initialPrice || false : price === initialPrice || hasMinimumError
        }
      >
        Guardar
      </Button>
    </Box>
  );
};

export default PriceForm;
