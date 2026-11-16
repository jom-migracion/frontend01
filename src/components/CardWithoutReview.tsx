import { useGet2 } from '@/hooks/api';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { useEffect, useMemo, useState } from 'react';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import ReviewDialog from './ReviewDialog';
import BookingCardReview from './BookingCardReview';
import { useTranslation } from 'react-i18next';

interface ReviewCardProps {
  bookId: number;
  imageUrl: string;
  title: string;
  subtitle?: string;
  backgroundImageUrl?: string;
  checkInDate?: string | Date;
  checkOutDate?: string | Date;
  address?: string;
  country?: string;
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

const CardWithoutReview: React.FC<ReviewCardProps> = ({
  bookId,
  imageUrl,
  title,
  checkInDate,
  checkOutDate,
  address,
  country,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const nights = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 0;
    const start = typeof checkInDate === 'string' ? new Date(checkInDate) : checkInDate;
    const end = typeof checkOutDate === 'string' ? new Date(checkOutDate) : checkOutDate;
    return differenceInDays(end, start);
  }, [checkInDate, checkOutDate]);

  const formattedCheckIn = useMemo(() => {
    if (!checkInDate) return '';
    const date = typeof checkInDate === 'string' ? new Date(checkInDate) : checkInDate;
    return format(date, 'd MMM', { locale: es });
  }, [checkInDate]);

  const formattedCheckOut = useMemo(() => {
    if (!checkOutDate) return '';
    const date = typeof checkOutDate === 'string' ? new Date(checkOutDate) : checkOutDate;
    return format(date, 'd MMM yyyy', { locale: es });
  }, [checkOutDate]);

  const {
    data: questionData,
    isLoading: isLoadingQuestions,
    isError: isErrorQuestions,
    error: questionError,
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
      const length = reviewData?.data?.reviewQuestions?.length ?? 0;
      setStep(length > 0 ? length / 2 : 0);
    } else {
      setStep(0);
    }
  }, [reviewData, bookId]);

  const handleButtonClick = async () => {
    try {
      await refetch();
      setOpen(true);
    } catch (err) {
      console.error('Error refetching review data:', err);
    }
  };

  const refreshCard = async () => {
    await refetch();
  };

  if (isLoadingQuestions || isLoadingReview) {
    return (
      <Card
        elevation={0}
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: '12px',
          border: '1px solid #E0E0E0',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
        }}
      >
        {/* Imagen */}
        <Skeleton variant="rectangular" height={180} sx={{ borderRadius: '12px', mb: 1.5 }} />

        {/* Título */}
        <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />

        {/* Ubicación */}
        <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />

        {/* Divider */}
        <Box sx={{ height: '1px', width: '100%', bgcolor: 'rgba(0,0,0,0.06)', mb: 2 }} />

        {/* Fecha y chip */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Skeleton variant="text" width="40%" height={20} />
          <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
        </Stack>

        {/* Botón */}
        <Skeleton variant="rectangular" height={42} sx={{ borderRadius: '8px' }} />
      </Card>
    );
  }
  if (isErrorQuestions || isErrorReview) {
    return <div>{t('cardWithoutReview.errorLoading')}</div>;
  }
  if (questionError || reviewError) {
    return <div>{t('cardWithoutReview.noData')}</div>;
  }
  return (
    <>
      <BookingCardReview
        title={title}
        imageUrl={imageUrl}
        address={
          address && country
            ? `${address}, ${country}`
            : t('cardWithoutReview.locationNotAvailable')
        }
        country={country}
        checkIn={formattedCheckIn}
        checkOut={formattedCheckOut}
        nights={nights}
        buttonText={
          (reviewData?.data?.reviewQuestions?.length ?? 0) > 0
            ? t('cardWithoutReview.finishReview')
            : t('cardWithoutReview.leaveReview')
        }
        onButtonClick={handleButtonClick}
      />
      <ReviewDialog
        open={open}
        onClose={() => setOpen(false)}
        bookId={bookId}
        questions={questions}
        step={step}
        onSaved={refreshCard}
      />
    </>
  );
};

export default CardWithoutReview;
