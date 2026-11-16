import React from 'react';
import { Card, Box, Avatar, Typography, Button, Divider } from '@mui/material';
import Grid from '@mui/material/Grid2';

interface DetailUserProps {
  name?: string;
  lastName?: string;
  photoLink?: string;
}

const DetailedUserCard: React.FC<DetailUserProps> = ({ photoLink }) => {

  return (
    <Card sx={{
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      borderRadius: '12px',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      maxWidth: '100%',
      overflow: 'hidden',
      minHeight: { xs: '100%', sm: 140, md: 220 },
      pb:2      
    }}>
      <Grid container spacing={12} alignItems="center">
        {/* Columna Izquierda: Imagen y Datos del Usuario */}
        <Grid size={{ xs: 12, sm: 6, md: 6 }} >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', ml: 2 }}>
            <Avatar
              alt="Assert"
              src={photoLink}
              sx={{ width: 150, height: 150, mb: 2, border: '4px solid #fff' }}
            />
            <Typography variant="h3Medium" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
              Assert
            </Typography>
            <Typography variant="paragraph1SRegular" color="text.secondary" sx={{ mb: 0.5 }}>
              Huésped / Anfitrión
            </Typography>
            <Typography variant="small1Regular" color="text.secondary">
              Santa Cruz - Bolivia
            </Typography>
          </Box>
        </Grid>

        {/* Columna Derecha: Botones */}
        <Grid size={{ xs: 12, sm: 6, md: 6 }} >
          <Box sx={{ display: 'flex', flexDirection: 'column',  gap: 1, width: '90%', mt: 2 }}>
            <Button
              variant="contained"
              size='small'
              sx={{
                backgroundColor: '#FF0000',
                color: '#fff',
                borderRadius: '50px',
                textTransform: 'none',
                px: 2,
                py: 1.5,
                width: { xs: '100%', sm: 'auto' },
                '&:hover': {
                  backgroundColor: '#CC0000',
                },
              }}
            >
              Bloquear
            </Button>
            <Divider
              sx={{
                my: { xs: 0.5, md: 1 },
              }}
            />

            <Button
              variant="contained"
              size='small'
              sx={{
                backgroundColor: '#000',
                color: '#fff',
                borderRadius: '20px',
                textTransform: 'none',
                px: 2,
                py: 1.5,
                width: { xs: '100%', sm: 'auto' },
                '&:hover': {
                  backgroundColor: '#333',
                },
              }}
            >
              Propiedades
            </Button>
            <Divider
              sx={{
                my: { xs: 0.5, md: 1 },
              }}
            />
            <Button
              variant="contained"
              size='small'
              sx={{
                backgroundColor: '#000',
                color: '#fff',
                borderRadius: '20px',
                textTransform: 'none',
                px: 2,
                py: 1.5,
                width: { xs: '100%', sm: 'auto' },
                '&:hover': {
                  backgroundColor: '#333',
                },
              }}
            >
              Reservas
            </Button>
            <Divider
              sx={{
                my: { xs: 0.5, md: 1 },
              }}
            />
          </Box>

          <Box sx={{ mt: 3, textAlign: 'left' }}>
            <Typography component='div' variant="small1SRegular" color="text.secondary">
              Correo: Correo@gmail.com
            </Typography>
            <Typography component='div' variant="small1SRegular" color="text.secondary">
              Celular: 591- 72234722
            </Typography>
            <Typography component='div' variant="small1SRegular" color="text.secondary">
              Fecha Registro: 04-06-2020
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

export default DetailedUserCard;