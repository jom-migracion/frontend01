import {
  Avatar,
  Box,
  Divider,
  MenuItem,
  Rating,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useRef, useState } from 'react';
import StarIcon from '@mui/icons-material/Star';
import SearchIcon from '@mui/icons-material/Search';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import VerifiedIcon from '@mui/icons-material/Verified';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CustomDialog from './CustomDialog';

interface Review {
  user: string | null;
  dateTimeReview: string;
  calification: number;
  comment: string;
  userProfilePhoto: string | null;
}

interface ReviewModalProps {
  reviews: Review[];
  rating: number;
  hostingTime: string;
  open: boolean;
  onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  reviews,
  rating,
  hostingTime,
  open,
  onClose,
}) => {
  const [sortOption, setSortOption] = useState('Mejores');
  const [searchText, setSearchText] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();

  // Autofocus en el buscador cuando se abre el modal
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // Calcular distribución de estrellas
  const starCounts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => Math.round(r.calification) === star).length
  );
  const maxCount = Math.max(...starCounts, 1);

  // Filtrado por búsqueda
  const filteredBySearch = reviews.filter((r) =>
    searchText ? r.comment?.toLowerCase().includes(searchText.toLowerCase()) : true
  );

  // Filtrado y ordenamiento por opción seleccionada
  const sortedReviews = [...filteredBySearch]
    .filter((r) => {
      if (sortOption === 'Mejores') return r.calification >= 3;
      if (sortOption === 'Peores') return r.calification <= 2;
      return true; // Más recientes incluye todas
    })
    .sort((a, b) => {
      // Siempre ordenar por fecha de más reciente a más antigua
      return new Date(b.dateTimeReview).getTime() - new Date(a.dateTimeReview).getTime();
    });

  // Categorías con iconos de Material UI
  const categories = [
    { label: 'Limpieza', icon: CleaningServicesIcon, value: rating },
    { label: 'Exactitud', icon: VerifiedIcon, value: rating },
    { label: 'Check-in', icon: VpnKeyIcon, value: rating },
    { label: 'Comunicación', icon: ChatBubbleOutlineIcon, value: rating },
    { label: 'Ubicación', icon: LocationOnIcon, value: rating },
    { label: 'Precio', icon: AttachMoneyIcon, value: rating },
  ];

  return (
    <CustomDialog isOpen={open} onClose={onClose} title="" maxWidth="md">
      {/* Encabezado con rating y selector */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} mt={1}>
        <Box display="flex" alignItems="center" gap={1}>
          <StarIcon sx={{ fontSize: '2rem', color: theme.palette.primary.main }} />
          <Typography variant="h5" fontWeight="bold">
            {isNaN(rating) ? '0.0' : rating.toFixed(2)}
          </Typography>
          <Typography variant="h6" sx={{ ml: 2 }}>
            · {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}
          </Typography>
        </Box>
        <Select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          size="small"
          sx={{ minWidth: 180, borderRadius: '12px' }}
        >
          <MenuItem value="Mejores">Mejores</MenuItem>
          <MenuItem value="Peores">Peores</MenuItem>
          <MenuItem value="Más recientes">Más recientes</MenuItem>
        </Select>
      </Box>

      <Grid container spacing={4}>
        {/* Panel Izquierdo */}
        <Grid size={{ xs: 12, md: 5 }}>
          {/* Valoración general */}
          <Typography variant="h6" fontWeight="600" mb={2}>
            Valoración general
          </Typography>
          <Box mb={3}>
            {[5, 4, 3, 2, 1].map((star, index) => (
              <Box key={star} display="flex" alignItems="center" gap={1} mb={0.5}>
                <Typography variant="body2" sx={{ minWidth: 12 }}>
                  {star}
                </Typography>
                <Box sx={{ flexGrow: 1, position: 'relative', height: 8 }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      bgcolor: '#e0e0e0',
                      borderRadius: 1,
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      width: `${(starCounts[index] / maxCount) * 100}%`,
                      height: '100%',
                      bgcolor: theme.palette.primary.main,
                      borderRadius: 1,
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Categorías */}
          <Box>
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <React.Fragment key={category.label}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" py={2}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <IconComponent sx={{ fontSize: '1.5rem', color: 'text.secondary' }} />
                      <Typography variant="body2">{category.label}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="500">
                      {category.value.toFixed(1)}
                    </Typography>
                  </Box>
                  {index < categories.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </Box>
        </Grid>

        {/* Panel Derecho */}
        <Grid size={{ xs: 12, md: 7 }}>
          {/* Campo de búsqueda */}
          <TextField
            fullWidth
            placeholder="Busca todas las reseñas"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            inputRef={searchInputRef}
            sx={{ mb: 3 }}
            slotProps={{
              input: {
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
              },
            }}
          />

          {/* Lista de reseñas */}
          <Box sx={{ maxHeight: 500, overflowY: 'auto' }}>
            {sortedReviews.map((review, i) => (
              <Box key={i} mb={3}>
                <Box display="flex" alignItems="flex-start" gap={2}>
                  <Avatar
                    src={review.userProfilePhoto as string | undefined}
                    alt={review.user as string | undefined}
                    sx={{ width: 48, height: 48 }}
                  />
                  <Box flexGrow={1}>
                    <Typography
                      sx={{
                        fontFamily: theme.typography.paragraph1Medium,
                        fontWeight: 600,
                      }}
                    >
                      {review.user || 'Usuario anónimo'}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: '0.875rem',
                      }}
                    >
                      {hostingTime}
                    </Typography>
                  </Box>
                </Box>

                <Box mt={2}>
                  <Stack direction="row" spacing={1} alignItems="center" mb={1} flexWrap="wrap">
                    <Rating
                      value={review.calification}
                      readOnly
                      size="small"
                      sx={{ color: theme.palette.primary.main }}
                    />
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      ·{' '}
                      {new Date(review.dateTimeReview).toLocaleDateString('es-ES', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      · Estadía de más de una semana
                    </Typography>
                  </Stack>

                  <Typography
                    sx={{
                      fontFamily: theme.typography.paragraph1Regular,
                      lineHeight: 1.6,
                      mb: 1,
                    }}
                  >
                    {review.comment}
                  </Typography>
                </Box>

                {i < sortedReviews.length - 1 && <Divider sx={{ mt: 3 }} />}
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </CustomDialog>
  );
};

export default ReviewModal;
