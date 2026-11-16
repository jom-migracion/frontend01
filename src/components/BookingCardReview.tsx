import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useTheme from '@mui/material/styles/useTheme';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';

interface BookingCardProps {
  title: string;
  imageUrl?: string;
  address?: string;
  country?: string;
  checkIn?: string;
  checkOut?: string;
  nights?: number;
  buttonText: string;
  onButtonClick: () => void;
  isLoading?: boolean;
}

const BookingCardReview: React.FC<BookingCardProps> = ({
  title,
  imageUrl,
  address,
  country,
  checkIn,
  checkOut,
  nights = 0,
  buttonText,
  onButtonClick,
  isLoading = false,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const defaultImage =
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1174&auto=format&fit=crop';

  if (isLoading) {
    return (
      <Card
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: '12px',
          border: '1px solid #E0E0E0',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
          '@media (min-width: 600px)': {
            padding: 2,
          },
        }}
      >
        <Skeleton variant="rectangular" height={180} sx={{ borderRadius: '12px', mb: 1.5 }} />
        <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
        <Box sx={{ height: '1px', width: '100%', bgcolor: 'rgba(0,0,0,0.06)', mb: 2 }} />
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Skeleton variant="text" width="40%" height={20} />
          <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
        </Stack>
        <Skeleton variant="rectangular" height={42} sx={{ borderRadius: '8px' }} />
      </Card>
    );
  }

  return (
    <Card
      elevation={0}
      sx={{
        width: '100%',
        height: '100%',
        borderRadius: '12px',
        border: '1px solid #E0E0E0',
        display: 'flex',
        flexDirection: 'column',
        padding: '12px',
        backgroundColor: '#FFFFFF',
        overflow: 'visible',
        '@media (min-width: 600px)': {
          padding: 2,
        },
      }}
    >
      {/* Imagen */}
      <CardMedia
        component="img"
        image={imageUrl || defaultImage}
        alt={title}
        sx={{
          height: 180,
          width: '100%',
          objectFit: 'cover',
          borderRadius: '12px',
          '@media (min-width: 600px)': {
            height: 200,
          },
        }}
      />

      {/* Contenedor de información */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '12px 0 0 0',
          flex: 1,
          gap: 1,
        }}
      >
        {/* Título */}
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            fontSize: { xs: '14px', sm: '16px' },
            color: '#111827',
            lineHeight: 1.4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </Typography>

        {/* Ubicación */}
        <Stack direction="row" alignItems="center" spacing={0.8} sx={{ color: '#6B7280' }}>
          <LocationOnOutlinedIcon
            sx={{ fontSize: { xs: 14, sm: 16 }, color: theme.palette.primary.main }}
          />
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontSize: { xs: '12px', sm: '13px' },
              color: '#6B7280',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {address && country
              ? `${address}, ${country}`
              : t('bookingCardReview.locationNotAvailable')}
          </Typography>
        </Stack>

        <DividerLight />

        {/* Fecha y Chip en la misma línea */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 0.5 }}>
          <Stack direction="row" alignItems="center" spacing={0.8} sx={{ color: '#6B7280' }}>
            <CalendarTodayOutlinedIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontSize: { xs: '12px', sm: '13px' },
                color: '#6B7280',
                fontWeight: 500,
              }}
            >
              {checkIn && checkOut ? `${checkIn} - ${checkOut}` : t('bookingCardReview.noDate')}
            </Typography>
          </Stack>

          <Chip
            sx={{
              backgroundColor: 'rgba(91, 76, 160, 0.1)',
              color: theme.palette.primary.main,
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              height: { xs: 24, sm: 28 },
              fontWeight: 600,
            }}
            label={
              nights > 0
                ? `${nights} ${nights === 1 ? t('bookingCardReview.night') : t('bookingCardReview.nights')}`
                : t('bookingCardReview.noNights')
            }
          />
        </Stack>

        {/* Botón */}
        <Button
          fullWidth
          variant="primary"
          onClick={onButtonClick}
          sx={{
            mt: 2,
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: { xs: '13px', sm: '14px' },
            padding: { xs: '10px', sm: '12px' },
          }}
        >
          {buttonText}
        </Button>
      </Box>
    </Card>
  );
};

const DividerLight = () => (
  <Box sx={{ height: '1px', width: '100%', bgcolor: 'rgba(0,0,0,0.06)' }} />
);

export default BookingCardReview;
