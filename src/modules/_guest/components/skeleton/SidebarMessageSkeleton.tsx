import { Box, Divider, Stack, Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Skeleton from '@mui/material/Skeleton';
import React from 'react';

export const SidebarMessageSkeleton = () => {
  return (
    <Stack spacing={0} sx={{ p: 0 }}>
      {[...Array(7)].map((_, index) => (
        <Card
          key={index}
          sx={{
            position: 'relative',
            border: 'none',
            boxShadow: 'none',
            display: 'flex',
            alignItems: 'center',
            p: 1,
            mb: 1,
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <Box
            sx={{
              position: 'relative',
              mr: { xs: 0, sm: 2 },
              mb: { xs: 2, sm: 0 },
            }}
          >
            <Skeleton 
              variant="rectangular" 
              sx={{ 
                width: { xs: 280, sm: 100 },
                height: { xs: 120, sm: 80 },
                borderRadius: 2 
              }} 
            />
            <Skeleton
              variant="circular"
              sx={{
                width: { xs: 60, sm: 40 },
                height: { xs: 60, sm: 40 },
                position: 'absolute',
                bottom: { xs: -20, sm: -10 },
                right: { xs: 'calc(50% - 30px)', sm: -10 },
                border: '2px solid white',
              }}
            />
          </Box>
          <CardContent
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              py: 1,
              px: { xs: 2, sm: 0 },
              width: '100%',
            }}
          >
            <Skeleton variant="text" sx={{ fontSize: '1rem', width: '60%', mb: 0.5 }} />
            <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '90%', mb: 0.5 }} />
            <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '70%' }} />
          </CardContent>
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            <Skeleton variant="text" sx={{ fontSize: '0.75rem', width: 50 }} />
          </Box>
        </Card>
      ))}
    </Stack>
  );
};

export const ReservationSkeleton: React.FC<{ isGuest: boolean }> = ({ isGuest = true }) => {
  return (
    <Box sx={{ p: 2, height: 'calc(100vh - 65px)', overflowY: 'auto' }}>
      <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '60%', mb: 2 }} />

      {isGuest && (
        <Box sx={{ position: 'relative', mb: 3 }}>
          <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2 }} />
        </Box>
      )}

      <Stack spacing={1.5} sx={{ mb: 3 }}>
        <Skeleton variant="text" sx={{ fontSize: '1.25rem', width: '80%' }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem', width: '100%' }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem', width: '95%' }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem', width: '70%' }} />

        <Box sx={{ pt: 1, pb: 1 }}>
          <Skeleton variant="rectangular" height={45} width="100%" sx={{ borderRadius: 1 }} />
        </Box>
      </Stack>

      <Divider sx={{ my: 3 }} />

      <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '50%', mb: 2 }} />

      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Skeleton variant="text" sx={{ fontSize: '1.1rem', width: '90%' }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem', width: '100%' }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem', width: '85%' }} />
      </Stack>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 6 }}>
          <Skeleton variant="text" sx={{ fontSize: '1rem', width: '70%' }} />
          <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '90%' }} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Skeleton variant="text" sx={{ fontSize: '1rem', width: '70%' }} />
          <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '90%' }} />
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={1}>
        <Skeleton variant="text" sx={{ fontSize: '1rem', width: '80%' }} />
        <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '60%' }} />
        <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '50%' }} />
      </Stack>
    </Box>
  );
};

// Skeleton para el área de chat
export const ChatAreaSkeleton = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 85px)',
      }}
    >
      {/* Header Skeleton */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 'none',
            display: 'flex',
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            width: '100%',
          }}
        >
          <Box sx={{ position: 'relative', mr: { xs: 0, sm: 2 }, mb: { xs: 2, sm: 0 } }}>
            <Skeleton variant="rectangular" sx={{ width: { xs: '100%', sm: 120 }, height: { xs: 120, sm: 100 }, borderRadius: 2 }} />
            <Skeleton
              variant="circular"
              sx={{
                width: { xs: 60, sm: 40 },
                height: { xs: 60, sm: 40 },
                position: 'absolute',
                bottom: { xs: -20, sm: -5 },
                right: { xs: 'calc(50% - 30px)', sm: -10 },
                border: '2px solid white',
              }}
            />
          </Box>
          <CardContent sx={{ flexGrow: 1, p: 0 }}>
            <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '60%' }} />
          </CardContent>
        </Card>
      </Box>

      {/* Messages Skeleton */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        <Stack spacing={2}>
          {/* Message from other user */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: 100, mb: 0.5 }} />
            <Skeleton variant="rectangular" sx={{ width: { xs: '80%', sm: '60%' }, height: 60, borderRadius: '10px 10px 10px 0' }} />
          </Box>

          {/* Message from current user */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Skeleton variant="rectangular" sx={{ width: { xs: '75%', sm: '55%' }, height: 50, borderRadius: '10px 10px 0 10px' }} />
            <Skeleton variant="text" sx={{ fontSize: '0.75rem', width: 80, mt: 0.5 }} />
          </Box>

          {/* Info message */}
          <Box sx={{ textAlign: 'center', my: 2 }}>
            <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: 150, mx: 'auto', mb: 0.5 }} />
            <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: 200, mx: 'auto' }} />
          </Box>

          {/* Another message from other user */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: 100, mb: 0.5 }} />
            <Skeleton variant="rectangular" sx={{ width: { xs: '85%', sm: '65%' }, height: 70, borderRadius: '10px 10px 10px 0' }} />
          </Box>
        </Stack>
      </Box>

      {/* Input Skeleton */}
      <Box sx={{ p: 2 }}>
        <Skeleton variant="rectangular" height={56} sx={{ borderRadius: '20px' }} />
      </Box>
    </Box>
  );
};

// Skeleton para cuando no hay conversación seleccionada
export const EmptyChatSkeleton = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 85px)',
        px: 2,
      }}
    >
      <Skeleton variant="circular" sx={{ width: 120, height: 120, mb: 3 }} />
      <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: 250, mb: 1 }} />
      <Skeleton variant="text" sx={{ fontSize: '1rem', width: 300, mb: 0.5 }} />
      <Skeleton variant="text" sx={{ fontSize: '1rem', width: 280 }} />
    </Box>
  );
};