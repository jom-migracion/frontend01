import React, { useState } from 'react';
import {
  Box,
  Typography,
  // Button,
  Divider,
  Link,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

// Tipo para las opciones de tarifa
type TarifaOption = 'unica' | 'compartida';

const FeePerServiceTab: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [selectedTarifa, setSelectedTarifa] = useState<TarifaOption>('unica'); // Puedes establecer el valor por defecto

  const handleTarifaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTarifa(event.target.value as TarifaOption);
  };

  // const handleGuardar = () => {
  //   console.log(`Guardando tarifa seleccionada: ${selectedTarifa}`);
  //   // Aquí iría la lógica para enviar la configuración al backend
  // };

  // const handleCancelar = () => {
  //   console.log('Operación cancelada');
  //   // Aquí iría la lógica para descartar cambios (ej. recargar el estado inicial)
  // };

  const TarifaCard: React.FC<{ title: string; description: string; value: TarifaOption }> = ({
    title,
    description,
    value,
  }) => (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        mb: 2,
        borderColor: selectedTarifa === value ? 'black' : 'divider',
        borderWidth: selectedTarifa === value ? '2px' : '1px',
        cursor: 'pointer',
      }}
      onClick={() => setSelectedTarifa(value)}
    >
      <FormControlLabel
        value={value}
        control={<Radio size="small" />}
        label={
          <Box>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 'bold',
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.primary,
                mb: 1,
              }}
            >
              {description}
            </Typography>
          </Box>
        }
        checked={selectedTarifa === value}
        // onChange={handleTarifaChange}
        sx={{
          m: 0,
          alignItems: 'flex-start',
          // Ocultar el label del FormControlLabel si quieres que el Typography interno sea el principal
          '& .MuiFormControlLabel-label': { width: '100%', ml: 1 },
        }}
      />
    </Paper>
  );

  return (
    <Box>
      {/* Sección de Configuración */}
      <Typography
        sx={{
          fontFamily: theme.typography.h6,
          color: theme.palette.text.primary,
          mb: 1,
        }}
      >
        {t('accountSettings.payments.serviceFeeTab.title')}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: theme.palette.text.primary,
          mb: 1,
        }}
      >
        {t('accountSettings.payments.serviceFeeTab.subtitle')}
      </Typography>

      {/* Opciones de Tarifa */}
      <RadioGroup
        aria-label="opciones de tarifa"
        name="tarifa-selection-group"
        value={selectedTarifa}
        onChange={handleTarifaChange}
      >
        <TarifaCard
          title={t('accountSettings.payments.serviceFeeTab.options.fixed.title')}
          value="unica"
          description={t('accountSettings.payments.serviceFeeTab.options.fixed.description')}
        />

        {/* <TarifaCard
          title={t('accountSettings.payments.serviceFeeTab.options.shared.title')}
          value="compartida"
          description={t('accountSettings.payments.serviceFeeTab.options.shared.description')}
        /> */}
      </RadioGroup>

      {/* Botones de acción */}
      {/* <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
        <Button variant="primary" onClick={handleGuardar}>
          {t('accountSettings.payments.serviceFeeTab.save')}
        </Button>
        <Button variant="secondary" onClick={handleCancelar}>
          {t('accountSettings.payments.serviceFeeTab.cancel')}
        </Button>
      </Box> */}

      <Divider sx={{ my: 2 }} />

      {/* Sección "¿Necesitas ayuda?" (Reutilizada del tab de Cobros) */}
      <Typography
        sx={{
          fontFamily: theme.typography.h6,
          color: theme.palette.text.primary,
          mb: 1,
        }}
      >
        {t('accountSettings.payments.collectionsTab.titleHelp')}
      </Typography>

      <Box
        sx={{
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Link
          href="/help-center"
          underline="none"
          color="inherit"
          sx={{ '&:hover': { textDecoration: 'underline' } }}
        >
          {t('accountSettings.payments.collectionsTab.when')}
        </Link>

        <Link
          href="/help-center"
          underline="none"
          color="inherit"
          sx={{ '&:hover': { textDecoration: 'underline' } }}
        >
          {t('accountSettings.payments.collectionsTab.how')}
        </Link>

        <Link
          href="/help-center"
          underline="none"
          color="inherit"
          sx={{ '&:hover': { textDecoration: 'underline' } }}
        >
          {t('accountSettings.payments.collectionsTab.history')}
        </Link>
      </Box>
    </Box>
  );
};

export default FeePerServiceTab;
