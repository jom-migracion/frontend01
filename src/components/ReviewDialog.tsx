import { ApiService } from '@/services/ApiService';
import theme from '@/themes/theme';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Rating,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import CustomDialog from './CustomDialog';
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

const ReviewDialog: React.FC<ReviewDialogProps> = ({
  open,
  onClose,
  step,
  bookId,
  questions: propQuestions,
  onSaved,
}) => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const navigate = useNavigate();

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
        setError(t('reviewDialog.errors.rateBoth'));
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
        setError(t('reviewDialog.errors.saveRatings'));
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (activeStep === 2) {
      if (!comment.trim()) {
        setError(t('reviewDialog.errors.writeComment'));
        return;
      }
      setIsSubmitting(true);
      try {
        await ApiService.post(`/Book/${bookId}/Review`, { comment: comment.trim() });
        await queryClient.invalidateQueries({ queryKey: ['review', bookId] });
        await queryClient.refetchQueries({ queryKey: ['review', bookId] });
        await queryClient.invalidateQueries({ queryKey: ['booksWithoutReview'] });

        onClose();

        Swal.fire({
          icon: 'success',
          title: t('reviewDialog.successAlert.title'),
          text: t('reviewDialog.successAlert.text'),
          confirmButtonText: t('reviewDialog.buttons.finish'),
          confirmButtonColor: theme.palette.customColors.primary[1],
          iconColor: '#4caf50',
          customClass: {
            popup: 'swal-rounded-popup',
            icon: 'swal-success-icon',
            confirmButton: 'swal-confirm-button',
          },
          didOpen: () => {
            const popup = document.querySelector('.swal-rounded-popup') as HTMLElement;
            if (popup) {
              popup.style.borderRadius = '20px';
            }
            const icon = document.querySelector('.swal2-icon.swal2-success') as HTMLElement;
            if (icon) {
              const iconBorder = icon.querySelector('.swal2-success-ring') as HTMLElement;
              if (iconBorder) {
                iconBorder.style.borderColor = '#4caf50';
              }
              // Hacer el icono de relleno
              icon.style.borderColor = '#4caf50';
              icon.style.backgroundColor = '#4caf50';
            }
            const confirmButton = document.querySelector('.swal-confirm-button') as HTMLElement;
            if (confirmButton) {
              confirmButton.style.fontWeight = '600';
              confirmButton.style.borderRadius = '12px';
              confirmButton.style.minWidth = '120px';
            }
            // Reducir tamaño de textos
            const title = document.querySelector('.swal2-title') as HTMLElement;
            if (title) {
              title.style.fontSize = '1.4rem';
            }
            const content = document.querySelector('.swal2-html-container') as HTMLElement;
            if (content) {
              content.style.fontSize = '0.95rem';
            }
          },
        }).then(() => {
          onClose();
          //  navigate('/reservation/finished/' + bookId);
          navigate('/reservation/' + bookId);
        });
      } catch (e) {
        console.error(e);
        Swal.fire({
          icon: 'error',
          title: t('reviewDialog.errorAlert.title'),
          text: t('reviewDialog.errors.sendComment'),
          confirmButtonText: t('reviewDialog.buttons.finish'),
          confirmButtonColor: theme.palette.customColors.primary[1],
          iconColor: '#f44336',
          customClass: {
            popup: 'swal-rounded-popup-error',
            icon: 'swal-error-icon',
            confirmButton: 'swal-confirm-button-error',
          },
          didOpen: () => {
            const popup = document.querySelector('.swal-rounded-popup-error') as HTMLElement;
            if (popup) {
              popup.style.borderRadius = '20px';
            }
            const icon = document.querySelector('.swal2-icon.swal2-error') as HTMLElement;
            if (icon) {
              icon.style.borderColor = '#f44336';
              icon.style.color = '#f44336';
            }
            const confirmButton = document.querySelector(
              '.swal-confirm-button-error'
            ) as HTMLElement;
            if (confirmButton) {
              confirmButton.style.fontWeight = '600';
              confirmButton.style.borderRadius = '12px';
              confirmButton.style.minWidth = '120px';
            }
            // Reducir tamaño de textos
            const title = document.querySelector('.swal2-title') as HTMLElement;
            if (title) {
              title.style.fontSize = '1.4rem';
            }
            const content = document.querySelector('.swal2-html-container') as HTMLElement;
            if (content) {
              content.style.fontSize = '0.95rem';
            }
          },
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const renderStep = () => {
    if (activeStep === 2) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'stretch' }}>
          <Typography variant="h3" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            {t('reviewDialog.commentStep.title')}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
          >
            {t('reviewDialog.commentStep.description')}
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={4}
            maxRows={12}
            variant="outlined"
            placeholder={t('reviewDialog.commentStep.placeholder')}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            inputProps={{
              maxLength: 1000,
              style: {
                padding: '16.5px 14px',
                fontSize: isMobile ? '0.875rem' : '1rem',
                lineHeight: '1.5',
              },
            }}
            helperText={`${1000 - comment.length} ${t('reviewDialog.commentStep.charsAvailable')}`}
            sx={{
              '& .MuiOutlinedInput-root': {
                padding: 0,
                alignItems: 'flex-start',
                height: 'auto',
                '& fieldset': {
                  top: 0,
                  height: '90%',
                },
                '& textarea': {
                  padding: '16.5px 14px',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  lineHeight: 1.5,
                  boxSizing: 'border-box',
                  overflow: 'auto !important',
                },
              },
              '& .MuiInputBase-input': {
                padding: '16.5px 14px !important',
              },
              '& .MuiFormHelperText-root': {
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
              },
            }}
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
            <Typography variant="body1">{q.questionText}</Typography>
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
    <>
      <CustomDialog
        isOpen={open}
        onClose={onClose}
        title="Deja tu reseñas"
        maxWidth={isMobile ? 'xs' : 'sm'}
      >
        <Box sx={{ mt: 2 }}>
          {renderStep()}
          {error && (
            <Typography color="error" variant="body2" align="center" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          {activeStep < 3 && (
            <Box mt={3} display="flex" justifyContent="center">
              <Paper elevation={0} sx={{ width: '100%', pt: 2 }}>
                <Button fullWidth variant="primary" onClick={handleNext} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : activeStep === 2 ? (
                    t('reviewDialog.buttons.send')
                  ) : (
                    t('reviewDialog.buttons.next')
                  )}
                </Button>
              </Paper>
            </Box>
          )}
        </Box>
      </CustomDialog>
    </>
  );
};

export default ReviewDialog;
