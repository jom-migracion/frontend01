import { Box, Button, Card, CardContent, Stack, Typography, Divider } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useMemo, useState } from 'react';
import StepFormModal from './StepFormModal';
import { useGet2 } from '@/hooks/api';

interface ReviewCardProps {
  bookId: number;
  imageUrl: string;
  title: string;
  subtitle: string;
  // backgroundImageUrl?: string;
  dateRange?: string;
  durationLabel?: string;
}

export interface ReviewQuestion {
  reviewQuestionId: number;
  questionText: string;
  questionCode: string;
  isActive: boolean;
  creationDate: Date;
}

export interface QuestionApiResponse {
  data: ReviewQuestion[];
  statusCode: string;
  hasError: boolean;
  resultError: any;
}

export interface Review {
  user: string;
  dateTimeReview: Date;
  calification: number;
  comment: string;
  userProfilePhoto: string;
  isComplete: boolean;
  listingReviewId: number;
  userId: number;
  listingRentId: number;
  bookId: number;
  reviewQuestions?: ReviewQuestion[] | undefined;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  bookId,
  imageUrl,
  title,
  subtitle,
  // backgroundImageUrl,
  dateRange,
  durationLabel,
}) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);

  const {
    data: questionData,
    isLoading: isLoadingQuestions,
    isError: isErrorQuestions,
    error: questionError,
    refetch: refecthReview,
  } = useGet2<QuestionApiResponse>(['reviewQuestions'], '/Parametrics/ReviewQuestions');

  const {
    data: reviewData,
    isLoading: isLoadingReview,
    isError: isErrorReview,
    error: reviewError,
    refetch,
  } = useGet2<Review>(['review', bookId], `/Book/${bookId}/Review`, {
    enabled: !!bookId,
  });

  const questions = useMemo(
    () =>
      questionData?.data && Array.isArray(questionData.data) ? questionData.data.slice(0, 4) : [],
    [questionData]
  );

  useEffect(() => {
    if (reviewData) {
      setStep(reviewData?.data?.reviewQuestions?.length ?? 0);
    } else {
      setStep(0);
    }
  }, [reviewData, bookId]);

  const handleButtonClick = async () => {
    try {
      await refecthReview();
      await refetch();
      setOpen(true);
    } catch (err) {
      console.error('Error refetching review data:', err);
    }
  };
  return (
    <Card
      sx={{
        borderRadius: 4,
        width: '100%',
        // height: 154, // altura fija sugerida
        boxShadow: 3,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Grid container>
        {/* Columna izquierda: imagen */}
        <Grid size={{ xs: 12, md: 6 }}>
          {imageUrl && (
            <Box
              component="img"
              src={imageUrl}
              alt="background"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}
        </Grid>

        {/* Columna derecha: contenido */}
        <Grid size={{ xs: 12, md: 6 }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box>
                <Typography fontWeight={600}>{title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
                {dateRange && (
                  <Typography variant="body2" color="text.secondary">
                    {dateRange}
                  </Typography>
                )}
              </Box>
            </Stack>

            <Divider sx={{ mt: 2 }} />

            <Stack direction="row" spacing={2} mt={2}>
              {durationLabel && (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#FFD700',
                    color: '#000',
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                  }}
                >
                  {durationLabel}
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleButtonClick}
                disabled={isLoadingQuestions || isErrorQuestions || questions.length < 4}
                sx={{
                  backgroundColor: '#000',
                  color: '#fff',
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#111',
                  },
                }}
              >
                {(reviewData?.data?.reviewQuestions?.length ?? 0) > 0
                  ? 'Termina tu reseña'
                  : 'Reseña'}
              </Button>
            </Stack>

            <StepFormModal
              open={open}
              onClose={() => {
                setOpen(false);
                refetch;
              }}
              bookId={bookId}
              questions={questions}
              step={step}
            />
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ReviewCard;
