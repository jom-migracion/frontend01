import {
  Box,
  Typography,
  Stack,
  Button,
  Link,
  Avatar,
  Divider,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

interface Paso {
  label: string;
  completed: boolean;
  date?: string;
}

interface PasosReservaProps {
  pasos: Paso[];
  reviewStart?: string;
  reviewEnd?: string;
  onEnviarReseña?: () => void;
  onContactarSoporte?: () => void;
}

const PasosReserva: React.FC<PasosReservaProps> = ({
  pasos,
  reviewStart,
  reviewEnd,
  onEnviarReseña,
  onContactarSoporte,
}) => {
  return (
    <Box sx={{ p: 3, borderRadius: 3, boxShadow: 2, bgcolor: '#fff' }}>
      <Stack spacing={3} position="relative">
        {pasos.map((paso, index) => (
          <Box key={index} sx={{ position: 'relative', pl: 4 }}>
            {/* Línea vertical */}
            {index < pasos.length - 1 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 32,
                  left: 15,
                  width: 2,
                  height: 'calc(100% - 32px)',
                  bgcolor: '#ccc',
                }}
              />
            )}

            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: paso.completed ? 'green' : '#e0e0e0',
                  color: paso.completed ? '#fff' : '#000',
                  width: 32,
                  height: 32,
                  fontSize: 16,
                }}
              >
                {paso.completed ? <CheckIcon fontSize="small" /> : index + 1}
              </Avatar>
              <Box>
                <Typography fontWeight={600}>{paso.label}</Typography>
                {paso.date && (
                  <Typography variant="body2" color="text.secondary">
                    {new Date(paso.date).toLocaleDateString('es-BO', {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long',
                    })}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Box>
        ))}

        <Divider />

        {/* Reseña */}
        {reviewStart && reviewEnd && (
          <Box textAlign="center">
            
            <Button
              variant="contained"
              sx={{ bgcolor: '#000', color: '#fff', borderRadius: 2, textTransform: 'none' }}
              onClick={onEnviarReseña}
            >
              Enviar reseña
            </Button>
          </Box>
        )}

        {/* Soporte */}
        <Box textAlign="center">
            <Link
            component="button"
            variant="body2"
            onClick={onContactarSoporte}
            sx={{ textAlign: 'left' }}
            >
            Contacta a soporte
            </Link>
        </Box>
      </Stack>
    </Box>
  );
};

export default PasosReserva;