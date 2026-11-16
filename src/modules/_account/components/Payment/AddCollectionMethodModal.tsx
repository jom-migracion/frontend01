import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  Radio,
} from '@mui/material';
import { RestClient } from '@/services/RestClient';
import { useTranslation } from 'react-i18next';

// Definición de las props
interface AgregarMetodoDeCobroModalProps {
  open: boolean;
  onClose: () => void;
}

// Tipo para las opciones de pago
type MetodoPago = 'transferencia' | 'qr' | 'efectivo' | null;

const AddCollectionMethodModal: React.FC<AgregarMetodoDeCobroModalProps> = ({ open, onClose }) => {
  const [selectedMetodo, setSelectedMetodo] = useState<MetodoPago>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>(''); // Estado para el país/región
  const [selectedPayForms, setSelectedPayForms] = useState<any[]>([]);

  const { t } = useTranslation();

  const handleConfirmar = () => {
    if (selectedMetodo && selectedCountry) {
      console.log(`Método de cobro confirmado: ${selectedMetodo} para el país: ${selectedCountry}`);
      // Aquí iría la lógica de envío de datos y cierre de modal
      onClose();
    } else {
      console.log('Por favor, selecciona país y método de cobro.');
    }
  };

  const loadPayForms = (countryId: string) => {
    if (countryId != '') {
      RestClient.get(`/Payout/GetEnableGetEnablePayoutForms?countryId=${countryId}`).then(
        (x: any) => {
          console.log('servicio listin rent: ', x.data.data);

          // if (x?.data?.statusCode == '200') {
          //   setPropertyActive(x.data.data);
          // }
          setSelectedPayForms(x.data.data);
        }
      );
    }
  };

  const MetodoPagoCard: React.FC<{ title: string; subtitle: string; value: MetodoPago }> = ({
    title,
    subtitle,
    value,
  }) => (
    <Box
      sx={{
        border: 1,
        borderColor: selectedMetodo === value ? 'black' : '#e0e0e0',
        borderRadius: 1,
        p: 2,
        mb: 2,
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'border-color 0.2s',
      }}
      onClick={() => setSelectedMetodo(value)}
    >
      <Radio
        checked={selectedMetodo === value}
        onChange={() => setSelectedMetodo(value)}
        value={value}
        name="metodo-pago-radio"
        size="small"
        sx={{ p: 0, mr: 2 }}
      />
      <Box flexGrow={1}>
        <Typography
          variant="body1"
          sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}
        >
          {/* Aquí podrías añadir un icono (ej. CreditCardIcon, QrCodeIcon) */}
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      // Estilos para simular el borde y el fondo de la modal de la imagen
      PaperProps={{ sx: { borderRadius: '6px' } }}
    >
      <DialogContent sx={{ p: 4 }}>
        {/* Título y subtítulo */}
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'normal', mb: 1 }}>
          {t('accountSettings.payments.addCollectionMethodModal.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {t('accountSettings.payments.addCollectionMethodModal.subtitle')}
        </Typography>

        {/* Campo de País/Región */}
        <FormControl fullWidth variant="outlined" sx={{ mb: 4 }}>
          <Select
            value={selectedCountry}
            onChange={(e) => {
              setSelectedCountry(e.target.value as string);
              loadPayForms(e.target.value as string);
            }}
            displayEmpty
            inputProps={{ 'aria-label': t('accountSettings.payments.addCollectionMethodModal.countryLabel') }}
          >
            <MenuItem value="" disabled>
              {t('accountSettings.payments.addCollectionMethodModal.countryLabel')}
            </MenuItem>
            {/* Lista de países de ejemplo */}
            <MenuItem value={'2'}>Bolivia</MenuItem>
          </Select>
        </FormControl>

        {/* Sección de Métodos de Pago */}
        <Typography variant="subtitle1" component="h3" align="center" sx={{ mb: 2 }}>
          {t('accountSettings.payments.addCollectionMethodModal.methodQuestion')}
        </Typography>
        {selectedPayForms.map((payForm) => (
          <MetodoPagoCard
            key={payForm.formOfPaymentId}
            title={payForm.displayName}
            subtitle={''}
            value={payForm.formOfPaymentId}
          />
        ))}
      </DialogContent>

      {/* Botones de Acción */}
      <DialogActions sx={{ p: 3, bgcolor: '#ffffff', borderTop: '1px solid #e0e0e0' }}>
        <Button
          onClick={onClose}
          variant="primary"
        >
          {t('accountSettings.payments.addCollectionMethodModal.cancel')}
        </Button>
        <Button
          onClick={handleConfirmar}
          variant="primary"
          disabled={!selectedMetodo || !selectedCountry}
        >
          {t('accountSettings.payments.addCollectionMethodModal.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCollectionMethodModal;
