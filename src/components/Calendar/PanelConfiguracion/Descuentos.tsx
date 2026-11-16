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
// import EditIcon from '@mui/icons-material/Edit';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useTranslation } from 'react-i18next';

interface Props {
  isMobile: boolean;
  modoEdicion: string | null;
  percentageWeek: number;
  percentageMonth: number;
  handleEditar: (id: string, valor?: number) => void;
}

const Descuentos: React.FC<Props> = ({
  isMobile,
  modoEdicion,
  handleEditar,
  percentageWeek,
  percentageMonth,
}) => {

  const { t } = useTranslation();

  return (
    <Accordion defaultExpanded={!isMobile} disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">{t('discountsConfig.title')}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box mb={2}>
          <Fade in>
            <Paper
              elevation={0}
              onClick={() => handleEditar('descuentoSemanal', 10)}
              sx={{ p: 2, borderRadius: 2, border: '1px solid #ccc', cursor: 'pointer' }}
            >
              <Typography variant="caption">{t('discountsConfig.weeklyCaption')}</Typography>
              <Typography variant="body2" fontSize={12}>
                {t('discountsConfig.weeklyDescription')}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h5" fontWeight={600}>
                  {percentageWeek}%
                </Typography>
                {/* {modoEdicion !== "descuentoSemanal" && <EditIcon fontSize="small" color="action" />} */}
              </Stack>
            </Paper>
          </Fade>
        </Box>

        <Box mb={2}>
          <Fade in>
            <Paper
              elevation={0}
              onClick={() => handleEditar('descuentoMensual', 25)}
              sx={{ p: 2, borderRadius: 2, border: '1px solid #ccc', cursor: 'pointer' }}
            >
              <Typography variant="caption">{t('discountsConfig.monthlyCaption')}</Typography>
              <Typography variant="body2" fontSize={12}>
                {t('discountsConfig.monthlyDescription')}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h5" fontWeight={600}>
                  {percentageMonth}%
                </Typography>
                {/* {modoEdicion !== 'descuentoMensual' && <EditIcon fontSize="small" color="action" />} */}
              </Stack>
            </Paper>
          </Fade>
        </Box>

        {/* <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            border: '1px solid #ccc',
            mt: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
        >
          <Typography variant="body2">{t('discountsConfig.moreDiscounts')}</Typography>
          <ArrowForwardIosIcon fontSize="small" />
        </Paper> */}
      </AccordionDetails>
    </Accordion>
  );
};

export default Descuentos;
