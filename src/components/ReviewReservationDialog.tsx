import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Button,
  Rating,
  TextField,
  Paper,
  Divider,
  CircularProgress,
  // useMediaQuery,
  // useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useQueryClient } from '@tanstack/react-query';
import { ApiService } from '@/services/ApiService';
// import Swal from 'sweetalert2';
import theme from '@/themes/theme';
import { useNavigate } from 'react-router';

export interface ReviewQuestion {
  reviewQuestionId: number;
  questionText: string;
  questionCode: string;
  isActive: boolean;
  creationDate: string;
}

interface ReviewDialogProps {
  open: boolean;
  onClose: () => void;
  step: number;
  bookId: number;
  questions: ReviewQuestion[];
  onSaved?: () => Promise<void>;
}

const ReviewReservationDialog: React.FC<ReviewDialogProps> = ({
  open,
  onClose,
  step,
  bookId,
  questions: propQuestions,
  onSaved,
}) => {
  // const muiTheme = useTheme();
  // const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const [activeStep, setActiveStep] = useState(0);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const questions = useMemo(
    () => (Array.isArray(propQuestions) ? propQuestions.slice(0, 4) : []),
    [propQuestions]
  );

  const pairs = useMemo(() => [questions.slice(0, 2), questions.slice(2, 4)], [questions]);

  const totalFlowSteps = 3;

  useEffect(() => {
    if (open) {
      setActiveStep(Math.min(step, totalFlowSteps));
      setRatings({});
      setComment('');
      setError(null);
    }
  }, [open, step]);

  const handleRating = (questionId: number, value: number | null) => {
    if (value === null) return;
    setRatings((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = async () => {
    setError(null);

    if (activeStep < 2) {
      const qs = pairs[activeStep];
      const payload = qs.map((q) => ({
        reviewQuestionId: q.reviewQuestionId,
        rating: ratings[q.reviewQuestionId] ?? 0,
      }));

      if (payload.some((p) => p.rating === 0)) {
        setError(t('reviewReservationDialog.errorRateAll'));
        return;
      }

      setIsSubmitting(true);
      try {
        await ApiService.post(`/Book/${bookId}/Review`, { reviewQuestions: payload });
        await queryClient.invalidateQueries({ queryKey: ['review', bookId] });
        await queryClient.refetchQueries({ queryKey: ['review', bookId] });
        await onSaved?.();
        setActiveStep((s) => s + 1);
      } catch (e) {
        console.error(e);
        setError(t('reviewReservationDialog.errorSavingRatings'));
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (activeStep === 2) {
      if (!comment.trim()) {
        setError(t('reviewReservationDialog.errorWriteComment'));
        return;
      }
      setIsSubmitting(true);
      try {
        await ApiService.post(`/Book/${bookId}/Review`, { comment: comment.trim() });
        await queryClient.invalidateQueries({ queryKey: ['review', bookId] });
        await queryClient.refetchQueries({ queryKey: ['review', bookId] });
        await queryClient.invalidateQueries({ queryKey: ['booksWithoutReview'] });

        navigate(`/ReservationDetailViewCompleted/${bookId}`);
        onClose();
      } catch (e) {
        console.error(e);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const renderStep = () => {
    if (activeStep === 2) {
      return (
        <Box>
          <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            {t('reviewReservationDialog.publicReviewTitle')}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            mb={2}
            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
          >
            {t('reviewReservationDialog.publicReviewDescription')}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder={t('reviewReservationDialog.commentPlaceholder')}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            inputProps={{ maxLength: 1000 }}
            helperText={t('reviewReservationDialog.charsAvailable', {
              count: 1000 - comment.length,
            })}
          />
        </Box>
      );
    }

    const qs = pairs[activeStep];
    if (!qs) return null;

    return (
      <Box>
        {qs.map((q) => (
          <React.Fragment key={q.reviewQuestionId}>
            <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              {q.questionText}
            </Typography>
            <Rating
              sx={{ mb: 2, color: theme.palette.customColors.primary[1], fontSize: '48px' }}
              value={ratings[q.reviewQuestionId] || 0}
              onChange={(_, v) => handleRating(q.reviewQuestionId, v)}
            />
            <Divider sx={{ my: 2 }} />
          </React.Fragment>
        ))}
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 6,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
          {t('reviewReservationDialog.title')}
        </Typography>
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
        {renderStep()}
        {error && (
          <Typography color="error" variant="body2" align="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        {activeStep < 3 && (
          <Box mt={3} display="flex" justifyContent="center">
            <Paper elevation={0} sx={{ width: '100%', p: 2 }}>
              <Button
                fullWidth
                variant="contained"
                sx={{ backgroundColor: theme.palette.customColors.primary[1], color: 'white' }}
                onClick={handleNext}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : activeStep === 2 ? (
                  t('reviewReservationDialog.submitReview')
                ) : (
                  t('reviewReservationDialog.next')
                )}
              </Button>
            </Paper>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReviewReservationDialog;
