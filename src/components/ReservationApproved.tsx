import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Divider,
  Button,
  Card,
  CardMedia,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ReservationApproved: React.FC = () => {
  return (
    <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto' }}>
      {/* Encabezado estado */}
      <Typography
        variant="body1"
        sx={{
          mb: 2,
          fontWeight: 500,
        }}
      >
        Solicitud de reserva:{' '}
        <Box
          component="span"
          sx={{
            bgcolor: '#e8f5e9',
            color: '#2e7d32',
            px: 1.5,
            py: 0.5,
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          Aprobado
        </Box>
      </Typography>

      <Grid container spacing={4}>
        {/* Columna izquierda */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
            <CardMedia
              component="img"
              height="380"
              image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
              alt="room"
            />
          </Card>

          {/* Info alojamiento */}
          <Box mt={3}>
            <Typography variant="h5" fontWeight="bold">
              Kuti Hostal Isla del Sol Norte
            </Typography>

            <Box display="flex" alignItems="center" mt={2}>
              <Avatar
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Jorge"
                sx={{ mr: 2 }}
              />
              <Box>
                <Typography fontWeight="bold">Jorge</Typography>
                <Typography variant="body2" color="text.secondary">
                  Cochabamba, Bolivia
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Llegada y salida */}
          <Box
            mt={3}
            p={2}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary">
                Llegada
              </Typography>
              <Typography fontWeight="bold">sáb, 31 ago</Typography>
              <Typography variant="body2">3:00 pm</Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Salida
              </Typography>
              <Typography fontWeight="bold">dom, 1 sept</Typography>
              <Typography variant="body2">12:00 pm</Typography>
            </Box>
          </Box>

          {/* Mensaje anfitrión */}
          <Box mt={3}>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              📩 Envía un mensaje al anfitrión <strong>Jorge</strong>
            </Typography>
            <Typography
              variant="body2"
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}
            >
              🏠 Alojamiento <strong>Kuti Hostal Isla del Sol Norte</strong>
            </Typography>
          </Box>

          {/* Detalles de la reserva */}
          <Box mt={4}>
            <Divider />
            <Typography variant="h6" mt={2}>
              Detalles de la reservación
            </Typography>
            <Typography variant="subtitle2" mt={2}>
              ¿Quién te acompaña?
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              2 huéspedes
            </Typography>

            <Typography variant="subtitle2" mt={2}>
              Políticas de cancelación
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Tu solicitud de reserva aún no fue aprobada por el anfitrión. <br /> ¿Deseas
              cancelarla?
            </Typography>
            <Link href="#" underline="hover" sx={{ mt: 1, display: 'inline-block' }}>
              Sigue leyendo
            </Link>
          </Box>

          {/* Cómo llegar */}
          <Box mt={4}>
            <Divider />
            <Typography variant="h6" mt={2}>
              Cómo llegar
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Senkata Avanzal, Santa Cruz de la Sierra, Bolivia
            </Typography>
            <Box
              mt={2}
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                border: '1px solid #e0e0e0',
              }}
            >
              <img
                src="https://static-maps.yandex.ru/1.x/?ll=-63.1805,-17.7833&size=600,300&z=12&l=map&pt=-63.1805,-17.7833,pm2rdm"
                alt="Mapa"
                style={{ width: '100%', display: 'block' }}
              />
            </Box>
          </Box>

          {/* Reglas e instrucciones */}
          <Box mt={4}>
            <Divider />
            <Typography variant="h6" mt={2}>
              Reglas e instrucciones
            </Typography>
            <Typography variant="subtitle2" mt={2}>
              Reglas de la casa
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              2 huéspedes como máximo, no se admiten mascotas
            </Typography>
            <Link href="#" underline="hover" sx={{ mt: 1, display: 'inline-block' }}>
              Mostrar más
            </Link>
          </Box>

          {/* Anfitrión */}
          <Box mt={4}>
            <Divider />
            <Typography variant="h6" mt={2}>
              Anfitrión: Jorge
            </Typography>
            <Box display="flex" alignItems="center" mt={2}>
              <Avatar
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Jorge"
                sx={{ mr: 2 }}
              />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Acerca del anfitrión
                </Typography>
                <Typography variant="body2" mt={1}>
                  Me dedico a construcción y bienes raíces, viajo bastante por el trabajo y también
                  me gusta viajar con mi familia. Disfruto la vida, mientras Dios lo permita.
                </Typography>
                <Link href="#" underline="hover" sx={{ mt: 1, display: 'inline-block' }}>
                  Mostrar más
                </Link>
              </Box>
            </Box>
          </Box>

          {/* Precio */}
          <Box mt={4}>
            <Divider />
            <Typography variant="h6" mt={2}>
              Información de precio
            </Typography>
            <Typography variant="body2" mt={1}>
              Monto a pagar
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              BOB. 120
            </Typography>
            <Typography variant="body2" mt={1}>
              Debito recibo
            </Typography>
          </Box>

          {/* Asistencia */}
          <Box mt={4}>
            <Divider />
            <Typography variant="h6" mt={2}>
              Obtén asistencia en todo momento
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Si necesitas ayuda, estamos disponibles 24/7 desde cualquier parte del mundo.
            </Typography>
            <Link href="#" underline="hover" sx={{ mt: 1, display: 'inline-block' }}>
              Contactarme con el Servicio al cliente de JOM
            </Link>
          </Box>
        </Grid>

        {/* Columna derecha */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              p: 3,
              boxShadow: 2,
            }}
          >
            <List>
              <ListItem disableGutters>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: 'black' }} />
                </ListItemIcon>
                <ListItemText primary="Solicitud de reserva enviada" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: 'black' }} />
                </ListItemIcon>
                <ListItemText primary="Confirmación de solicitud (responde en 00:30 hs)" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: 'black' }} />
                </ListItemIcon>
                <ListItemText primary="Check-in sáb, 31 ago" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: 'black' }} />
                </ListItemIcon>
                <ListItemText primary="Check-out dom, 1 sept" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: 'black' }} />
                </ListItemIcon>
                <ListItemText primary="Reserva lun, 2 sept - sáb, 7 sept" />
              </ListItem>
            </List>

            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                bgcolor: 'black',
                color: 'white',
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': { bgcolor: '#333' },
              }}
            >
              Cancelar reserva
            </Button>
            <Button
              fullWidth
              variant="outlined"
              sx={{
                mt: 2,
                textTransform: 'none',
                borderRadius: 2,
              }}
            >
              Política de cancelación
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReservationApproved;
