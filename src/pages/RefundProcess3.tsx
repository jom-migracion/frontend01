import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid2';

const RefundProcess3 = () => {
  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Tus pagos para [nombre del anuncio]
              </Typography>

              <Typography sx={{ mt: 2, fontWeight: 600 }}>Completado</Typography>
              <Typography sx={{ mt: 2, color: 'text.secondary' }}>2024</Typography>

              {/* Payment item - Refund */}
              <Grid container alignItems="center" spacing={2} sx={{ mt: 2 }}>
                <Grid>
                  <Card sx={{ display: 'flex', boxShadow: 0 }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 120, borderRadius: 1 }}
                      image="https://picsum.photos/200/120"
                      alt="propiedad"
                    />
                  </Card>
                </Grid>
                <Grid>
                  <Typography sx={{ fontWeight: 700 }}>Reembolsado 20 sept</Typography>
                  <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Visa 0511</Typography>
                  <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                    Santa Cruz de la Sierra 22 sept - 25 sept
                  </Typography>
                </Grid>
                <Grid>
                  <Typography sx={{ fontWeight: 700, color: '#000' }}>- 300 BOB</Typography>
                </Grid>
              </Grid>

              <Grid container alignItems="center" spacing={2} sx={{ mt: 3 }}>
                <Grid>
                  <Card sx={{ display: 'flex', boxShadow: 0 }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 120, borderRadius: 1 }}
                      image="https://picsum.photos/200/120"
                      alt="propiedad"
                    />
                  </Card>
                </Grid>
                <Grid>
                  <Typography sx={{ fontWeight: 700 }}>Pagado 9 sept</Typography>
                  <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Visa 0511</Typography>
                  <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                    Santa Cruz de la Sierra 22 sept - 25 sept
                  </Typography>
                </Grid>
                <Grid>
                  <Typography sx={{ fontWeight: 700, color: '#000' }}>300 BOB</Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Paper sx={{ p: 3, borderRadius: 2 }} style={{ boxShadow: ' 0 0 10px #c9c6c6' }}>
              <Typography sx={{ fontWeight: 700, mb: 2 }}>¿Necesitas ayuda?</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link href="#" underline="hover">
                  ¿Cómo funcionan los planes de pago?
                </Link>
                <Link href="#" underline="hover">
                  ¿Cómo se paga una reservación de larga duración?
                </Link>
                <Link href="#" underline="hover">
                  ¿Dónde puedo consultar mi pago?
                </Link>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default RefundProcess3;
