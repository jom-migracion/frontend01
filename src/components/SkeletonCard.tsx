import { Box, Skeleton, useTheme } from '@mui/material';

const SkeletonCard = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '100%',
        height: 400,
        borderRadius: theme.shape.borderRadius * 2,
        overflow: 'hidden',
        boxShadow: theme.shadows[2],
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        [theme.breakpoints.down('sm')]: {
          maxWidth: '100%',
        },
      }}
    >
      {/* Imagen fake + icono favorito */}
      <Box sx={{ height: '88%', position: 'relative' }}>
        <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
        <Box
          sx={{
            position: 'absolute',
            top: 20,
            left: 16,
            zIndex: 2,
            bgcolor: 'background.paper',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: theme.shadows[1],
          }}
        >
          <Skeleton variant="circular" width={24} height={24} animation="wave" />
        </Box>
      </Box>

      {/* Contenido del card */}
      <Box sx={{ flex: 1, px: 2, pt: 1.5, pb: 1.5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {/* Línea de ciudad/país */}
        <Skeleton width="50%" height={18} animation="wave" />

        {/* Título principal */}
        <Skeleton width="80%" height={22} sx={{ mt: 1 }} animation="wave" />

        {/* Precio y rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Skeleton width={60} height={18} animation="wave" />
          <Box sx={{ flex: 1 }} />
          <Skeleton variant="circular" width={20} height={20} animation="wave" />
          <Skeleton width={28} height={18} sx={{ ml: 1 }} animation="wave" />
        </Box>
      </Box>
    </Box>
  );
};

export default SkeletonCard;
