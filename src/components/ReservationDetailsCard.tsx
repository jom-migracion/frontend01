import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Collapse,
  Button,
  Divider,
} from '@mui/material';

interface ReservationDetailsCardProps {
  guests: number;
  cancelationPolicy: string;
}

const ReservationDetailsCard: React.FC<ReservationDetailsCardProps> = ({ guests, cancelationPolicy }) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded(prev => !prev);

  return (
    <Card sx={{ width: '100%' }}>
      <CardContent>
        {/* Título principal */}
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Detalles de la reservación
        </Typography>

        {/* Sección: ¿Quién te acompaña? */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            ¿Quién te acompaña?
          </Typography>
          <Typography variant="body1">{guests} huésped{guests !== 1 ? 'es' : ''}</Typography>
        </Box>

        <Divider />

        {/* Sección: Políticas de cancelación */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Políticas de cancelación
          </Typography>

          <Collapse in={expanded} timeout="auto">
            <Typography variant="body2" sx={{ mt: 1 }}>
              {cancelationPolicy}
            </Typography>
          </Collapse>

          <Button
            variant="text"
            onClick={toggleExpanded}
            sx={{ mt: 1 }}
            aria-expanded={expanded}
            aria-controls="cancelation-policy"
          >
            {expanded ? 'Ver menos detalles' : 'Ver más detalles'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReservationDetailsCard;
