import React from 'react';
import {
  Typography,
  Paper,
  Box,
  Stack,
  Divider,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
  modoEdicion: string | null;
  minStay: number;
  maxStay: number;
  handleEditar: (id: string, valor?: number) => void;
  defaultExpanded?: boolean;
}

const DuracionDelViaje: React.FC<Props> = ({ modoEdicion, handleEditar, minStay, maxStay }) => {

  const { t } = useTranslation();

  return (
    <Box sx={{p:1}}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        {t('tripLength.title')}
      </Typography>
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        sx={{ pt: 2, pb: 2, borderRadius: 4, border: '1px solid #ccc' }}
      >
        <Paper
          elevation={0}
          onClick={() => handleEditar('minimoNoches', 1)}
          sx={{ pl: 2, cursor: 'pointer', boxShadow: 'none' }}
        >
          <Typography variant="subtitle2">
            {t('tripLength.minNights')}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h4" fontWeight={600}>
              {minStay}
            </Typography>
            {modoEdicion !== 'minimoNoches' && null}
          </Stack>
        </Paper>
        <Divider />
        <Paper
          onClick={() => handleEditar('maximoNoches', 365)}
          elevation={0}
          sx={{ pl: 2, cursor: 'pointer', boxShadow: 'none' }}
        >
          <Typography variant="subtitle2">
            {t('tripLength.maxNights')}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h4" fontWeight={600}>
              {maxStay}
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default DuracionDelViaje;
