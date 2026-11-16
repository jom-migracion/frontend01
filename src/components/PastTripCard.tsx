import React from 'react';
import {
  Box,
  Card,
  CardMedia,
  Chip,
  Skeleton,
  Stack,
  Typography /*, useTheme*/,
} from '@mui/material';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { useTranslation } from 'react-i18next';
import { estadoColorReserva } from '@/common/util/statusFunctios';

/* --------------  TYPES  -------------- */
interface Photo {
  photoLink: string;
  isPrincipal: boolean;
  name: string;
  description: string;
  position: number;
  spaceType?: string | null;
  spaceTypeCode?: string | null;
  spaceTypeId?: number | null;
  listingPhotoId: number;
}

interface PastTripCardProps {
  status?: string;
  imageUrl: Photo[];
  name?: string;
  location?: string;
  date: string;
  onClick?: () => void;
  isLoading?: boolean;
}

/* --------------  COMPONENT  -------------- */
const PastTripCard: React.FC<PastTripCardProps> = ({
  imageUrl,
  location,
  name,
  date,
  onClick,
  status,
  isLoading = false,
}) => {
  // const theme = useTheme();
  const { t } = useTranslation();

  // pick image
  const primaryPhoto = Array.isArray(imageUrl)
    ? imageUrl.find((img) => img.isPrincipal) || imageUrl[0]
    : null;
  const imageToShow = primaryPhoto?.photoLink || 'https://via.placeholder.com/400x300';

  // helpers — 'rented' en viajes pasados equivale a 'completed'
  const effectiveStatus =
    status === 'rented' ? 'completed' : status === 'review' ? 'review' : (status ?? '');
  const statusResult = estadoColorReserva(effectiveStatus, '', '');
  const estadoInfo = typeof statusResult !== 'string' ? statusResult : null;

  /* --------------  LOADING SKELETON  -------------- */
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
        {/* Imagen */}
        <Skeleton variant="rectangular" height={180} sx={{ borderRadius: '12px', mb: 1.5 }} />

        {/* Título */}
        <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />

        {/* Ubicación */}
        <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />

        {/* Divider */}
        <Box sx={{ height: '1px', width: '100%', bgcolor: 'rgba(0,0,0,0.06)', mb: 2 }} />

        {/* Fecha */}
        <Skeleton variant="text" width="40%" height={20} />
      </Card>
    );
  }

  /* --------------  REAL CARD  -------------- */
  return (
    <Card
      elevation={0}
      onClick={onClick}
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
        cursor: onClick ? 'pointer' : 'default',
        '@media (min-width: 600px)': {
          padding: 2,
        },
      }}
    >
      {/* IMAGE + CHIP */}
      <Box sx={{ position: 'relative', mb: 1.5 }}>
        <CardMedia
          component="img"
          image={imageToShow}
          alt={name || t('PastTripCard.fallbacks.imageAlt')}
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

        {/* Chip de estado */}
        {estadoInfo && (
          <Chip
            label={estadoInfo.estado}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: estadoInfo.bg,
              color: estadoInfo.color,
              fontWeight: 600,
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              height: { xs: 26, sm: 30 },
              '& .MuiChip-label': { px: 1.25 },
              width: 'auto',
            }}
          />
        )}
      </Box>
      {/* CONTENT */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
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
          {name}
        </Typography>

        {/* Ubicación */}
        <Stack direction="row" alignItems="center" spacing={0.8} sx={{ color: '#6B7280' }}>
          <LocationOnOutlinedIcon sx={{ fontSize: { xs: 20, sm: 20 } }} />
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
            {location || t('PastTripCard.fallbacks.location')}
          </Typography>
        </Stack>

        <DividerLight />

        {/* Fecha */}
        <Stack direction="row" alignItems="center" spacing={0.8} sx={{ color: '#6B7280', mt: 0.5 }}>
          <CalendarTodayOutlinedIcon sx={{ fontSize: { xs: 20, sm: 20 } }} />
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontSize: { xs: '12px', sm: '13px' },
              color: '#6B7280',
              fontWeight: 500,
            }}
          >
            {date}
          </Typography>
        </Stack>
      </Box>
    </Card>
  );
};

/* --------------  SMALL UTILS  -------------- */
const DividerLight = () => (
  <Box sx={{ height: '1px', width: '100%', bgcolor: 'rgba(0,0,0,0.06)' }} />
);

export default PastTripCard;
