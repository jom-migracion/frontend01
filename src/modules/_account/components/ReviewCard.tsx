import React from 'react';
import { Typography, Box, Rating, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface ReviewCardProps {
  reviewerName: string;
  reviewerLocation: string;
  reviewDateName?: string;
  rating: number;
  reviewText: string;
  avatar?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  reviewerName,
  reviewerLocation,
  reviewDateName,
  rating,
  reviewText,
  avatar,
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 5 }}>
      <Box display="flex" alignItems="center" gap={1.5} mt={4} mb={2}>
        <Avatar
          src={avatar}
          alt={reviewerName}
          sx={{
            width: 44,
            height: 44,
            borderColor: theme.palette.divider,
            borderWidth: 2,
            borderStyle: 'solid',
          }}
        />
        <Box>
          <Typography variant="body1" fontWeight="bold">
            {reviewerName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {reviewerLocation}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Box>
          <Rating
            value={rating}
            readOnly
            size="medium"
            sx={{ color: theme.palette.primary.main }}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.5 }}>
            {reviewDateName}
          </Typography>
        </Box>
      </Box>
      <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.5 }}>{reviewText}</Typography>
    </Box>
  );
};

export default ReviewCard;
