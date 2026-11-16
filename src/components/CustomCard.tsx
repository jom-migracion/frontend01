import CardProps from '@/models/interfaces/CustomCardProps';
import { useAuthContext } from '@/modules/_auth/context';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { CardItem } from './FavoriteListsModal';
import SignInForm from './SignInForm';
import { t } from 'i18next';

interface CustomCardProps extends CardProps {
  onToggleFavorite?: (card: CardItem) => void;
  isFavorite?: boolean;
  setIsFavorite?: (isFav: boolean) => void;
  isTogglingFavorite?: boolean;
  compact?: boolean;
}

const CustomCard: React.FC<CustomCardProps> = ({
  images,
  location,
  country,
  title,
  price,
  rating,
  sx = {},
  refDetail,
  onToggleFavorite,
  isFavorite,
  setIsFavorite,
  isTogglingFavorite = false,
  labelNew = { see: false, label: '' },
  compact = false,
}) => {
  if (!images || images.length === 0) return null;

  const displayImages = images.slice(0, 5);

  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalLogin, setIsModalLogin] = useState(false);
  const [loginType, setLoginType] = useState<'registration' | 'login'>('login');
  const [isHovered, setIsHovered] = useState(false);
  const { isGuestAuthenticated } = useAuthContext();
  const locationRoad = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isGuestAuthenticated) {
      setIsModalLogin(true);
      setLoginType('login');
    } else {
      if (isFavorite) {
        setIsFavorite && setIsFavorite(false); // Trigger removal in parent
      } else {
        onToggleFavorite &&
          onToggleFavorite({
            id: refDetail.toString(),
            title: title ?? '',
            image: displayImages[0],
          });
      }
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((idx) => (idx + 1) % displayImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((idx) => (idx - 1 + displayImages.length) % displayImages.length);
  };

  const handleDotClick = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(idx);
  };

  const goDetail = () => {
    if (!refDetail) return;

    const isSearch = locationRoad.pathname.includes('search-results');
    const baseUrl = `/detail/${refDetail}`;

    if (isSearch) {
      // Mantener todos los parámetros de búsqueda actuales
      const currentSearchParams = new URLSearchParams(locationRoad.search);

      // Opcional: Agregar un parámetro para indicar que viene de búsqueda
      currentSearchParams.set('fromSearch', 'true');

      const finalUrl = `${baseUrl}?${currentSearchParams.toString()}`;

      // Abrir en nueva pestaña (como tenías antes)
      window.open(finalUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Comportamiento normal (navegación interna)
      navigate(baseUrl);
    }
  };

  const handleCloseModal = () => {
    setIsModalLogin(false);
  };

  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: { xs: 3, sm: 6 },
        overflow: 'hidden',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        sx={{
          position: 'relative',
          borderRadius: { xs: 3, sm: 6 },
          boxShadow: { xs: 2, sm: 4 },
          m: 0,
          ...sx,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Imagen cuadrada/rectangular fija */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            aspectRatio: compact ? { xs: '3 / 2', sm: '4 / 3' } : { xs: '1 / 1', sm: '4 / 3' },
            overflow: 'hidden',
            borderRadius: { xs: '12px 12px 0 0', sm: '24px 24px 0 0' },
          }}
        >
          <img
            src={displayImages[currentIndex]}
            alt="Sin imagen"
            style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
            onClick={goDetail}
          />

          {/* Navigation Arrows */}
          {displayImages.length > 1 && isHovered && (
            <>
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  left: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  color: '#222',
                  padding: '6px',
                  borderRadius: '50%',
                  width: 28,
                  height: 28,
                  minWidth: 'unset',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 1)',
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage(e);
                }}
              >
                ‹
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  color: '#222',
                  padding: '6px',
                  borderRadius: '50%',
                  width: 28,
                  height: 28,
                  minWidth: 'unset',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 1)',
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage(e);
                }}
              >
                ›
              </IconButton>
            </>
          )}

          {/* Botón favorito */}
          <IconButton
            size="small"
            onClick={toggleFavorite}
            disabled={isTogglingFavorite}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: '32px',
              height: '32px',
              bgcolor: '#FFFFFF',
              borderRadius: '50%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              padding: 0,
              '&:hover': {
                bgcolor: '#FFFFFF',
                '& .favorite-icon': {
                  color: isFavorite ? '#4A45B0' : '#6B7280',
                },
              },
            }}
          >
            {isTogglingFavorite ? (
              <CircularProgress
                size={20}
                sx={{
                  color: '#5B55C8',
                }}
              />
            ) : isFavorite ? (
              <Favorite
                className="favorite-icon"
                sx={{
                  color: '#5B55C8',
                  fontSize: '20px',
                }}
              />
            ) : (
              <FavoriteBorder
                className="favorite-icon"
                sx={{
                  fontSize: '20px',
                  color: '#6B7280',
                }}
              />
            )}
          </IconButton>

          {/* Label "New" */}
          {labelNew.see && (
            <Box
              position="absolute"
              top={16}
              right={15}
              px={2.5}
              py={0.5}
              borderRadius={4}
              bgcolor="black"
              width={'80px'}
            >
              <Typography variant="caption" color="white">
                {labelNew.label}
              </Typography>
            </Box>
          )}

          {/* Dots navegación */}
          <Stack
            direction="row"
            justifyContent="center"
            spacing={0.5}
            sx={{
              position: 'absolute',
              bottom: 10,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            {displayImages.map((_, index) => (
              <Box
                key={index}
                onClick={(e) => handleDotClick(index, e)}
                sx={{
                  width: isMobile ? 6 : 8,
                  height: isMobile ? 6 : 8,
                  borderRadius: '50%',
                  backgroundColor: currentIndex === index ? 'white' : 'grey.400',
                  cursor: 'pointer',
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Card Info */}
        <Box
          sx={{
            p: compact ? 1 : { xs: 1, sm: 1.5 },
            cursor: 'pointer',
            borderRadius: { xs: 3, sm: 6 },
            mr: 0.5,
            ml: 0.5,
          }}
          onClick={goDetail}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#1F2937',
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {location}, {country}
            </Typography>
            {rating !== undefined && rating > -1 && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  px: '8px',
                  py: '2px',
                  borderRadius: '8px',
                  backgroundColor: '#EFEEFF',
                }}
              >
                <StarIcon sx={{ fontSize: '12px', color: '#5B55C8' }} />
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#5B55C8',
                  }}
                >
                  {rating.toFixed(1)}
                </Typography>
              </Box>
            )}
          </Box>

          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 400,
              color: '#6B7280',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '4px', mt: '4px' }}>
            <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#1F2937' }}>
              {price}
            </Typography>
            <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#6B7280' }}>
              {t('recentlyViewed.price')}
            </Typography>
          </Box>
        </Box>
      </Card>
      <SignInForm open={isModalLogin} onClose={handleCloseModal} typeLogin={loginType} />
    </Box>
  );
};

export default CustomCard;
