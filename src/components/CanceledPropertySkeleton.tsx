import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid2';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import React from 'react';

const CanceledPropertySkeleton: React.FC = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Container maxWidth={matches ? 'xl' : 'lg'} sx={{ padding: '0px 40px !important' }}>
      {/* Encabezado estado */}
      <Box sx={{ mb: 2 }}>
        <Skeleton variant="text" width="40%" />
        <Box
          sx={{
            display: 'inline-block',
            bgcolor: '#fdecea',
            px: 1.5,
            py: 0.5,
            borderRadius: '8px',
            mt: 0.5,
          }}
        >
          <Skeleton variant="text" width={60} height={20} />
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Izquierda */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
            <Skeleton variant="rectangular" height={380} width="100%" />
          </Card>

          {/* Info alojamiento */}
          <Box mt={3}>
            <Skeleton variant="text" width="80%" sx={{ fontFamily: theme.typography.h3Medium }} />

            <Box display="flex" alignItems="center" mt={2}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
              <Box>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </Box>
            </Box>

            <Box mt={2}>
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="100%" sx={{ mt: 1 }} />
            </Box>
          </Box>

          {/* Detalles de la reserva */}
          <Box mt={4}>
            <Divider />
            <Skeleton variant="text" width="30%" sx={{ mt: 2 }} />
            <Skeleton variant="text" width="40%" sx={{ mt: 2 }} />
            <Skeleton variant="text" width="90%" sx={{ mt: 1 }} />
            <Skeleton variant="text" width="20%" sx={{ mt: 1 }} />
          </Box>

          {/* Precio */}
          <Box mt={4}>
            <Divider />
            <Skeleton variant="text" width="35%" sx={{ mt: 2 }} />
            <Skeleton variant="text" width="50%" sx={{ mt: 1 }} />
            <Skeleton variant="text" width="30%" />
          </Box>

          {/* Asistencia */}
          <Box mt={4}>
            <Divider />
            <Skeleton variant="text" width="45%" sx={{ mt: 2 }} />
            <Skeleton variant="text" width="95%" sx={{ mt: 1 }} />
            <Skeleton variant="text" width="40%" sx={{ mt: 1 }} />
          </Box>
        </Grid>

        {/* Derecha */}
        <Grid size={{ xs: 12, md: 5 }}>
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
                  <Skeleton variant="circular" width={24} height={24} sx={{ color: 'black' }} />
                </ListItemIcon>
                <ListItemText primary={<Skeleton variant="text" width="100%" />} />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon>
                  <Skeleton variant="circular" width={24} height={24} sx={{ color: 'black' }} />
                </ListItemIcon>
                <ListItemText primary={<Skeleton variant="text" width="100%" />} />
              </ListItem>
            </List>

            <Skeleton variant="rectangular" height={48} sx={{ mt: 2, borderRadius: 2 }} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CanceledPropertySkeleton;
