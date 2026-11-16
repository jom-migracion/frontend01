import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';

interface CardWithoutReviewSkeletonProps {
  count?: number;
}

const CardWithoutReviewSkeleton: React.FC<CardWithoutReviewSkeletonProps> = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Box py={2}>
          <Card
            key={index}
            sx={{
              width: '100%',
              height: '100%',
              p: 3,
              borderRadius: 4,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Imagen skeleton en la parte superior */}
            <Box
              sx={{
                width: '100%',
                height: '200px',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <Skeleton variant="rectangular" width="100%" height="100%" />
            </Box>

            {/* Contenido de texto skeleton */}
            <Box
              sx={{
                pt: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                flex: 1,
              }}
            >
              {/* Título */}
              <Box>
                <Skeleton variant="text" width="80%" height={24} />
              </Box>

              {/* Ubicación */}
              <Box>
                <Skeleton variant="text" width="60%" height={20} />
              </Box>

              {/* Fecha y chip de noches en la misma fila */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 1,
                }}
              >
                <Skeleton variant="text" width="50%" height={20} />
                <Skeleton variant="rounded" width={80} height={32} sx={{ borderRadius: 4 }} />
              </Box>

              {/* Botón */}
              <Box mt={2}>
                <Skeleton variant="rounded" width="100%" height={40} sx={{ borderRadius: 2 }} />
              </Box>
            </Box>
          </Card>
        </Box>
      ))}
    </>
  );
};

export default CardWithoutReviewSkeleton;
