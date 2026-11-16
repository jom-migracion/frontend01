import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
  Rating,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useMemo, useState, useEffect } from 'react';
import theme from '@/themes/theme';
import { ApiService } from '@/services/ApiService';
import { useQueryClient } from '@tanstack/react-query';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  step: number;
  bookId: number;
  open: boolean;
  onClose: () => void;
  questions: ReviewQuestion[];
}

export interface ReviewQuestion {
  reviewQuestionId: number;
  questionText: string;
  questionCode: string;
  isActive: boolean;
  creationDate: string;
}

const StepFormModal: React.FC<Props> = ({
  step,
  bookId,
  open,
  onClose,
  questions: propQuestions,
}) => {
  const [activeStep, setActiveStep] = useState(step);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [finalComment, setFinalComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const questions = useMemo(
    () => (Array.isArray(propQuestions) ? propQuestions.slice(0, 4) : []),
    [propQuestions]
  );

  const totalSteps = questions.length + 1;

  useEffect(() => {
    if (open) {
      setActiveStep(step);
      setAnswers({});
      setFinalComment('');
      setError(null);
    }
  }, [open, step]);

  const handleNext = async () => {
    const isQuestionStep = activeStep < questions.length;
    const isCommentStep = activeStep === questions.length;

    try {
      if (isQuestionStep) {
        const questionId = questions[activeStep]?.reviewQuestionId;
        const rating = answers[questionId];
        if (questionId !== undefined && rating !== undefined) {
          await ApiService.post(`/Book/${bookId}/Review`, {
            reviewQuestions: [{ reviewQuestionId: questionId, rating }],
          });
          // Invalidate both booksWithoutReview and review queries
          await queryClient.invalidateQueries({ queryKey: ['booksWithoutReview'] });
          await queryClient.invalidateQueries({ queryKey: ['review', bookId] });
          await queryClient.refetchQueries({ queryKey: ['review', bookId] });
          setActiveStep((prev) => prev + 1);
        }
      } else if (isCommentStep && finalComment.trim() !== '') {
        // Submit final comment
        await ApiService.post(`/Book/${bookId}/Review`, {
          comment: finalComment,
        });
        // Invalidate and refetch both queries
        await queryClient.invalidateQueries({ queryKey: ['booksWithoutReview'] });
        await queryClient.refetchQueries({ queryKey: ['booksWithoutReview'] });
        await queryClient.invalidateQueries({ queryKey: ['review', bookId] });
        await queryClient.refetchQueries({ queryKey: ['review', bookId] });
        // console.log(`Invalidated and refetched ['review', ${bookId}] and booksWithoutReview`);
        onClose();
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Error al enviar la reseña. Por favor, intenta de nuevo.');
    }
  };

  const handleChange = (value: number | null) => {
    const questionId = questions[activeStep]?.reviewQuestionId;
    if (questionId !== undefined && value !== null) {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFinalComment(event.target.value);
  };

  const isCommentStep = activeStep === questions.length;
  const currentQuestion = isCommentStep ? null : questions[activeStep];
  const currentAnswer = currentQuestion ? answers[currentQuestion.reviewQuestionId] : undefined;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      slots={{
        transition: Transition,
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <Typography sx={{ fontFamily: theme.typography.h4Medium }}>
          Responde las preguntas
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
        {error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}
        {!isCommentStep ? (
          <>
            <Typography fontWeight={600} mb={1}>
              {`Pregunta ${activeStep + 1} de ${totalSteps}`}
            </Typography>
            <Typography variant="subtitle1" mb={4} sx={{ textAlign: 'center' }}>
              {currentQuestion?.questionText}
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <Rating
                name="question-rating"
                value={currentAnswer || 0}
                onChange={(_, newValue) => handleChange(newValue)}
                sx={{
                  '& .MuiRating-iconFilled': {
                    color: '#ffca00',
                  },
                  '& .MuiRating-iconHover': {
                    color: '#ffca00',
                  },
                  '& .MuiSvgIcon-root': {
                    fontSize: '2em',
                  },
                }}
              />
            </div>
          </>
        ) : (
          <>
            <Typography fontWeight={600} mb={1}>
              {`Paso ${activeStep + 1} de ${totalSteps}`}
            </Typography>
            <Typography variant="subtitle1" mb={4} sx={{ textAlign: 'center' }}>
              Déjanos un comentario final
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <TextField
                label="Escribe tu comentario"
                value={finalComment}
                onChange={handleTextChange}
                multiline
                rows={4}
                fullWidth
                sx={{ maxWidth: '500px' }}
              />
            </div>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ pr: 3, pb: 2 }}>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={
            isCommentStep
              ? finalComment.trim() === ''
              : currentAnswer === undefined || currentAnswer === 0
          }
        >
          {isCommentStep ? 'Finalizar' : 'Siguiente'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StepFormModal;
