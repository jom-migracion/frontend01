import React from 'react';
import { Chip, Stack, Typography, Box } from '@mui/material';
import { EstadoReserva } from '@/common/util/statusFunctios';

interface ReservationStatusChipProps {
  estadoResult: EstadoReserva;
}

const ReservationStatusChip: React.FC<ReservationStatusChipProps> = ({ estadoResult }) => {
  const IconComponent = estadoResult.icon;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
      <Chip
        icon={IconComponent ? <IconComponent color={estadoResult.iconColor} /> : undefined}
        label={
          <Stack direction="row" gap="5px" sx={{ fontSize: '12px', color: estadoResult.color }}>
            <Typography fontWeight="bold" fontSize="12px" sx={{ color: estadoResult.color }}>
              {estadoResult.title}
            </Typography>
            {' - '}
            {estadoResult.estado}
          </Stack>
        }
        style={{
          width: 'auto',
          backgroundColor: estadoResult.bg,
          marginBottom: '4px',
        }}
      />
    </Box>
  );
};

export default ReservationStatusChip;
