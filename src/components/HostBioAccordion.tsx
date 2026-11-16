import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Collapse,
  Avatar,
  Stack,
} from '@mui/material';

interface HostProfileCardProps {
  hostName: string;
  hostId: string | number;
  hostingTime: string;
  hostDescription: string;
  hostPhotoUrl: string;
}

const HostBioAccordion: React.FC<HostProfileCardProps> = ({
  hostName,
  hostId,
  hostingTime,
  hostDescription,
  hostPhotoUrl,
}) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded(prev => !prev);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Título */}
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Anfitrión: {hostName}
      </Typography>

      {/* Tarjeta con imagen, datos y descripción */}
      <Card>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={hostPhotoUrl}
              alt={hostName}
              sx={{ width: 64, height: 64 }}
            />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Anfitrión {hostingTime} anfitrionando
              </Typography>
              <Typography variant="h6">{hostName}</Typography>
            </Box>
          </Stack>

          {/* Descripción con acordeón */}
          <Collapse in={expanded} sx={{ mt: 2 }}>
            <Typography variant="body2">{hostDescription}</Typography>
          </Collapse>
          <Box sx={{ mt: 2 }}>
            <Button variant="text" color="primary" onClick={toggleExpanded}>
              {expanded ? 'Mostrar menos' : 'Mostrar más'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default HostBioAccordion;
