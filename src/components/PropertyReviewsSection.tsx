import ReviewModal from '@/components/ReviewModal';
import { alpha, Avatar, Box, Button, Rating, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const brandColor = '#6366f1';

interface Review {
  user: string | null;
  dateTimeReview: string;
  calification: number;
  comment: string;
  userProfilePhoto: string | null;
}

interface PropertyReviewsSectionProps {
  reviews: Review[];
  rating: number;
  hostingTime: string;
}

const PropertyReviewsSection: React.FC<PropertyReviewsSectionProps> = ({
  reviews,
  rating,
  hostingTime,
}) => {
  const [openReview, setOpenReview] = useState(false);
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box component="section" sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
        {t('bookingCard.reviews')}
      </Typography>
      {reviews.length > 0 ? (
        <>
          <Box
            sx={{
              mt: 5,
              position: 'relative',
              overflow: 'hidden',
              bgcolor: '#fff',
              borderRadius: 0,
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar
                    src={reviews[0].userProfilePhoto as string | undefined}
                    alt={reviews[0].user as string | undefined}
                    sx={{
                      width: 52,
                      height: 52,
                      border: '2px solid #fff',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    }}
                  />
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: '1.05rem',
                        color: '#1e293b',
                        lineHeight: 1.2,
                      }}
                    >
                      {reviews[0].user}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: '0.875rem',
                        color: '#64748b',
                        mt: 0.3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      Cochabamba, Bolivia
                    </Typography>
                    <Rating
                      value={reviews[0].calification}
                      readOnly
                      size="small"
                      sx={{
                        fontSize: '1rem',
                        color: theme.palette.primary.main,
                        mt: 0.3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
              <Typography
                sx={{
                  color: '#475569',
                  fontSize: '1.05rem',
                  mb: 2,
                }}
              >
                {reviews[0].comment}
              </Typography>

              <Box display="flex" alignItems="center" justifyContent="flex-start">
                <Typography
                  sx={{
                    fontSize: '0.85rem',
                    color: theme.palette.primary.main,
                    fontWeight: 700,
                    bgcolor: alpha(brandColor, 0.05),
                    px: 2,
                    py: 0.8,
                    borderRadius: '20px',
                  }}
                >
                  {t('detailProperty.oneNightStay')}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="flex-end">
                <Button variant="secondary" onClick={() => setOpenReview(true)}>
                  {t('bookingCard.buttonReviews')}
                </Button>
              </Box>
            </Box>
          </Box>
          <ReviewModal
            open={openReview}
            onClose={() => setOpenReview(false)}
            reviews={reviews}
            rating={rating}
            hostingTime={hostingTime}
          />
        </>
      ) : reviews.length === 0 ? (
        <Typography sx={{ fontFamily: theme.typography.paragraph1Regular }} textAlign="justify">
          {t('detailProperty.noReviews')}
        </Typography>
      ) : (
        ''
      )}
    </Box>
  );
};

export default PropertyReviewsSection;
