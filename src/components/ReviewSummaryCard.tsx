import React from 'react';
import { useGet2 } from '@/hooks/api';
import { Box, Typography, Card, CardContent, Rating, LinearProgress, Stack } from '@mui/material';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LoginIcon from '@mui/icons-material/Login';
import Grid from '@mui/material/Grid2';

export interface ListingSummary {
  listingRentId: number;
  name: string;
  avgReviews: number;
  totalReviews: number;
}

export interface QuestionAverage {
  questionId: number;
  questionText: string;
  questionCode: string;
  averageRating: number;
  totalAnswers: number;
}

export interface ReviewSummaryData {
  listing: ListingSummary;
  avgByQuestion: QuestionAverage[];
}

// interface CategoryRating {
//   label: string;
//   value: number;
//   icon: React.ReactNode;
// }

interface ReviewSummaryCardProps {
  listingRentId?: number;
}

const ReviewSummaryCard: React.FC<ReviewSummaryCardProps> = ({ listingRentId }) => {
  const {
    data: detailReview,
    isLoading: isLoadingReview,
    isError: isErrorReview,
    error: errorReview,
    // refetch: refetchReview,
  } = useGet2<ReviewSummaryData>(
    ['propertyRent', listingRentId],
    `/ListingRent/${listingRentId}/ReviewResume`
  );

  const resumeReview = detailReview?.data;
  if (isLoadingReview) {
    return <Typography>Cargando reseñas...</Typography>;
  }

  if (isErrorReview) {
    return (
      <Typography>
        Error: {errorReview?.message || 'No se pudo cargar el resumen de reseñas'}
      </Typography>
    );
  }

  if (!resumeReview) {
    return <Typography>Sin reseñas.</Typography>;
  }
  const listing = resumeReview.listing;
  const avgReviews = listing.avgReviews;

  const avgByQuestion = resumeReview.avgByQuestion;
  const averageLimpieza = avgByQuestion[0]?.averageRating || 0;

  const averageUbicacion = avgByQuestion[1]?.averageRating || 0;
  const averagePrecio = avgByQuestion[2]?.averageRating || 0;
  const averageCheckIn = avgByQuestion[3]?.averageRating || 0;

  return (
    <Card
      sx={{
        width: '100%',
        height: 200, // altura fija para distribución en 3 columnas
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <CardContent>
        <Grid container spacing={2}>
          {/* Columna 1: Promedio general */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box textAlign="center">
              <Typography variant="h3" fontWeight={600}>
                {avgReviews.toFixed(1)}
              </Typography>
              <Rating value={avgReviews} precision={0.1} readOnly size="small" />
            </Box>
          </Grid>

          {/* Columna 2: Limpieza y Ubicación */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <Stack spacing={2}>
              <Box key={1}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CleaningServicesIcon />
                    <Typography variant="body2">Limpieza</Typography>
                  </Box>
                  <Typography variant="body2">{averageLimpieza.toFixed(1)}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(averageLimpieza / 5) * 100}
                  sx={{ height: 8, borderRadius: 5 }}
                />
              </Box>
              <Box key={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <LocationOnIcon />
                    <Typography variant="body2">Ubicacion</Typography>
                  </Box>
                  <Typography variant="body2">{averageUbicacion.toFixed(1)}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(averageUbicacion / 5) * 100}
                  sx={{ height: 8, borderRadius: 5 }}
                />
              </Box>
            </Stack>
          </Grid>

          {/* Columna 3: Precio y Check-in */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <Stack spacing={2}>
              <Box key={1}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <AttachMoneyIcon />
                    <Typography variant="body2">Precio</Typography>
                  </Box>
                  <Typography variant="body2">{averagePrecio.toFixed(1)}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(averagePrecio / 5) * 100}
                  sx={{ height: 8, borderRadius: 5 }}
                />
              </Box>
              <Box key={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <LoginIcon />
                    <Typography variant="body2">Check-In</Typography>
                  </Box>
                  <Typography variant="body2">{averageCheckIn.toFixed(1)}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(averageCheckIn / 5) * 100}
                  sx={{ height: 8, borderRadius: 5 }}
                />
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ReviewSummaryCard;
