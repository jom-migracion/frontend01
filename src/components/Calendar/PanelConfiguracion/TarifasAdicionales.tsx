import React/*, { useEffect }*/ from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Paper,
  Fade,
  Box,
  Stack,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';

interface Props {
  modoEdicion: string | null;
  cleaningFeeAmount: number;
  petFeeAmount: number;
  extraGuestFeeAmount: number;
  handleEditar: (id: string, valor?: number) => void;
}

const TarifasAdicionales: React.FC<Props> = ({ modoEdicion, handleEditar, cleaningFeeAmount, petFeeAmount, extraGuestFeeAmount}) => {

  const { t } = useTranslation();

  return (
    <Accordion disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">{t('additionalFees.title')}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Fade in>
          <Box display="flex" flexDirection="column" gap={2}>
            {/* Tarifa de limpieza */}
            <Paper
              elevation={0}
              onClick={() => handleEditar('tarifaLimpieza', cleaningFeeAmount)}
              sx={{ p: 2, borderRadius: 2, border: '1px solid #ccc', cursor: 'pointer' }}
            >
              <Typography variant="subtitle2" fontWeight={600}>
                {t('additionalFees.cleaningFee')}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h6" fontWeight={600}>
                  {/* Muestra el monto real, o $0 si no existe */}
                  {cleaningFeeAmount.toFixed(2)} {t('additionalFees.currency')}
                </Typography>
              </Stack>
            </Paper>

            {/* Tarifa por mascotas */}
            <Paper
              elevation={0}
              onClick={() => handleEditar('tarifaMascotas', petFeeAmount)}
              sx={{ p: 2, borderRadius: 2, border: '1px solid #ccc', cursor: 'pointer' }}
            >
              <Typography variant="subtitle2" fontWeight={600}>
                {t('additionalFees.petFee')}
              </Typography>
              <Typography variant="body2">{t('additionalFees.perStay')}</Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h6" fontWeight={600}>
                   {/* Muestra el monto real, o $0 si no existe */}
                  {petFeeAmount.toFixed(2)} {t('additionalFees.currency')}
                </Typography>
              </Stack>
              <Typography variant="caption" display="block" mt={1}>
                {t('additionalFees.serviceAnimalsInfo')}
              </Typography>
            </Paper>

            {/* Tarifa por huésped adicional */}
            <Paper
              elevation={0}
              onClick={() => handleEditar('tarifaHuespedExtra', extraGuestFeeAmount)}
              sx={{ p: 2, borderRadius: 2, border: '1px solid #ccc', cursor: 'pointer' }}
            >
              <Typography variant="subtitle2" fontWeight={600}>
                {t('additionalFees.extraGuestFee')}
              </Typography>
              <Typography variant="body2">{t('additionalFees.perExtraGuestNight')}</Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h6" fontWeight={600}>
                  {/* Muestra el monto real, o $0 si no existe */}
                  {extraGuestFeeAmount.toFixed(2)} {t('additionalFees.currency')}
                </Typography>
              </Stack>
            </Paper>
          </Box>
        </Fade>
      </AccordionDetails>
    </Accordion>
  );
};

export default TarifasAdicionales;
