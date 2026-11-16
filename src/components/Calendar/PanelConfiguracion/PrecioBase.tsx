import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Paper,
  Box,
  Fade,
  Stack,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import { SelectedDay } from '@/models/interfaces/SelectedDay';
// import EditIcon from '@mui/icons-material/Edit';

interface Props {
  isMobile: boolean;
  modoEdicion: string | null;
  handleEditar: (id: string, valor?: number) => void;
  priceNightly: number | null;
  weekendNightlyPrice: number | null;
  diasSeleccionados: SelectedDay[] | null;
}

const PrecioBase: React.FC<Props> = ({
  isMobile,
  modoEdicion,
  handleEditar,
  priceNightly,
  weekendNightlyPrice,
  diasSeleccionados,
}) => {

  const { t } = useTranslation();
  const prices = diasSeleccionados?.map(item => item.price) || [];
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return (
    <Accordion defaultExpanded={!isMobile} disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">{t('basePriceConfig.title')}</Typography>
      </AccordionSummary>
      {Array.isArray(diasSeleccionados) && diasSeleccionados.length > 0 ? (
        <AccordionDetails>
          <Box mb={2}>
            <Fade in>
              <Paper
                elevation={0}
                onClick={() => handleEditar('precioRangoNoche', priceNightly || 0)}
                sx={{ p: 2, borderRadius: 2, border: '1px solid #ccc', cursor: 'pointer' }}
              >
                <Typography variant="subtitle2">{t('basePriceConfig.rangeConfig')}</Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="h6" fontWeight={600}>
                    {minPrice || 0} {' '}
                    {diasSeleccionados.length > 1 ? ` - ${maxPrice || 0}` : ''}
                  </Typography>
                </Stack>
              </Paper>
            </Fade>
          </Box>
        </AccordionDetails>
      ) : (
        <AccordionDetails>
          <Box mb={2}>
            <Fade in>
              <Paper
                elevation={0}
                onClick={() => handleEditar('precioNoche', priceNightly || 0)}
                sx={{ p: 2, borderRadius: 2, border: '1px solid #ccc', cursor: 'pointer' }}
              >
                <Typography variant="subtitle2">{t('basePriceConfig.pricePerNight')}</Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="h6" fontWeight={600}>
                    {priceNightly || 0}
                  </Typography>
                </Stack>
              </Paper>
            </Fade>
          </Box>

          <Box mb={2}>
            <Fade in>
              <Paper
                elevation={0}
                onClick={() => handleEditar('precioFinSemana', weekendNightlyPrice || 0)}
                sx={{ p: 2, borderRadius: 2, border: '1px solid #ccc', cursor: 'pointer' }}
              >
                <Typography variant="subtitle2">{t('basePriceConfig.customWeekend')}</Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="h6" fontWeight={600}>
                    {weekendNightlyPrice || 0}
                  </Typography>
                </Stack>
              </Paper>
            </Fade>
          </Box>
        </AccordionDetails>
      )}
    </Accordion>
  );
};

export default PrecioBase;
