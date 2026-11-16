import React from 'react';
import {
  Box,
  Container,
  Paper,
  Divider,
  Stack,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  // Avatar,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import Skeleton from '@mui/material/Skeleton';

const RefundProcessSkeleton: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Left column */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper sx={{ p: 6, borderRadius: 2, boxShadow: 0 }}>
              <Stack spacing={4}>
                {/* Avatar y monto */}
                <Box sx={{ textAlign: 'center' }}>
                  <Skeleton
                    variant="text"
                    width="40%"
                    sx={{ fontSize: '2.125rem', fontWeight: 800, mx: 'auto', mt: 2, mb: 0.5 }}
                  />
                  <Skeleton variant="text" width="25%" sx={{ mx: 'auto', mb: 3 }} />

                  <Skeleton variant="text" width="90%" sx={{ mx: 'auto', mb: 0.5 }} />
                  <Skeleton variant="text" width="85%" sx={{ mx: 'auto', mb: 0.5 }} />
                  <Skeleton variant="text" width="75%" sx={{ mx: 'auto', mb: 2 }} />

                  <Skeleton
                    variant="rectangular"
                    width="80%"
                    height={42}
                    sx={{ mx: 'auto', borderRadius: 1, mt: 2 }}
                  />
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Detalles */}
                <Box>
                  <Skeleton
                    variant="text"
                    width="25%"
                    sx={{ fontSize: '1.25rem', fontWeight: 700, mb: 2 }}
                  />

                  <Grid container>
                    <Grid size={{ xs: 8 }}>
                      <Skeleton variant="text" width="70%" />
                    </Grid>
                    <Grid size={{ xs: 4 }} sx={{ textAlign: 'right' }}>
                      <Skeleton variant="text" width="80%" sx={{ ml: 'auto' }} />
                    </Grid>

                    <Grid size={{ xs: 8 }} sx={{ mt: 1 }}>
                      <Skeleton variant="text" width="60%" />
                    </Grid>
                    <Grid size={{ xs: 4 }} sx={{ mt: 1, textAlign: 'right' }}>
                      <Skeleton variant="text" width="70%" sx={{ ml: 'auto' }} />
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Timeline */}
                <List>
                  {[1, 2, 3].map((item) => (
                    <ListItem key={item}>
                      <ListItemAvatar>
                        <Skeleton variant="circular" width={36} height={36} />
                      </ListItemAvatar>
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="60%" sx={{ fontWeight: 700, mb: 0.5 }} />
                        <Skeleton variant="text" width="35%" />
                      </Box>
                    </ListItem>
                  ))}
                </List>

                {/* Botón */}
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={48}
                  sx={{ borderRadius: 1, mt: 2 }}
                />
              </Stack>
            </Paper>
          </Grid>

          {/* Right column */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={{ borderRadius: 2, boxShadow: 4 }}>
              <Box sx={{ p: 2 }}>
                <Grid container>
                  <Grid size={{ xs: 5 }}>
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={120}
                      sx={{ borderRadius: 0 }}
                    />
                  </Grid>
                  <Grid size={{ xs: 7 }}>
                    <CardContent>
                      <Skeleton variant="rounded" width="35%" height={22} sx={{ mb: 1 }} />
                      <Skeleton variant="text" width="90%" sx={{ fontWeight: 700, mb: 0.5 }} />
                      <Skeleton variant="text" width="85%" sx={{ fontSize: '0.75rem', mt: 1 }} />
                    </CardContent>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default RefundProcessSkeleton;
