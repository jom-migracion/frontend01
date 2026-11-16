import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import {
  IoMdHeart,
  IoMdHeartEmpty,
  IoIosArrowBack,
  IoIosArrowForward,
  IoIosStar,
} from 'react-icons/io';
import { useNavigate } from 'react-router';
import { CardItem } from './FavoriteListsModal';
import CardProps from '@/models/interfaces/CustomCardProps';
import { ApiService } from '@/services/ApiService';

interface CustomCardProps extends CardProps {
  onToggleFavorite?: (card: CardItem) => void;
  isFavorite?: boolean;
  setIsFavorite?: (isFav: boolean) => void;
}

const CustomCardSearch: React.FC<CustomCardProps> = ({
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
  labelNew = { see: false, label: '' },
}) => {
  if (!images || images.length === 0) return null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [animateHeart, setAnimateHeart] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const toggleFavorite = (e: React.MouseEvent, id: number | undefined) => {
    e.stopPropagation();
    if (isFavorite) {
      setIsFavorite && setIsFavorite(false);
      deleteFromFavorite(id);
    } else {
      onToggleFavorite &&
        onToggleFavorite({ id: refDetail.toString(), title: title ?? '', image: images[0] });
      setAnimateHeart(true);
      setTimeout(() => setAnimateHeart(false), 300);
      setIsFavorite && setIsFavorite(true);
      addToFavorite(id);
    }
  };

  const deleteFromFavorite = async (id: number | undefined) => {
    try {
      await ApiService.delete(`/ListingRent/Favorite/${id}`);
      // refetch(); // Uncomment if you need to refetch data
    } catch (error) {
      console.error(`Error al eliminar el favorito con ID: ${id}`, error);
    }
  };

  const addToFavorite = async (id: number | undefined) => {
    try {
      await ApiService.post(`/ListingRent/Favorite/${id}`);
      // refetch(); // Uncomment if you need to refetch data
    } catch (error) {
      console.error(`Error al añadir el favorito con ID: ${id}`, error);
    }
  };

  // Carrusel
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((idx) => (idx + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((idx) => (idx - 1 + images.length) % images.length);
  };

  const handleDotClick = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(idx);
  };

  const goDetail = () => {
    const params = new URLSearchParams();
    try {
      const stored = localStorage.getItem('search-form-storage');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.CheckInDate) params.set('checkIn', parsed.CheckInDate.split('T')[0]);
        if (parsed.CheckOutDate) params.set('checkOut', parsed.CheckOutDate.split('T')[0]);
        if (parsed.Guests?.adults) params.set('adults', String(parsed.Guests.adults));
        if (parsed.Guests?.children) params.set('children', String(parsed.Guests.children));
        if (parsed.Guests?.infants) params.set('infants', String(parsed.Guests.infants));
        if (parsed.Guests?.pets) params.set('pets', String(parsed.Guests.pets));
      }
    } catch {}
    const qs = params.toString();
    navigate(`/detail/${refDetail}${qs ? `?${qs}` : ''}`);
  };

  return (
    <Box sx={{ width: '100%', '&:hover': { transform: 'scale(1.02)', transition: '0.3s' } }}>
      <Card sx={{ position: 'relative', borderRadius: 3, boxShadow: 3, ...sx }}>
        <Box onClick={goDetail} sx={{ cursor: 'pointer' }}>
          <Box sx={{ position: 'relative', height: 350 }}>
            <img
              src={images[currentIndex]}
              alt="listing"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            <IconButton
              onClick={prevImage}
              sx={{
                position: 'absolute',
                top: '50%',
                left: 10,
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.6)',
                p: isMobile ? 0.5 : 1,
              }}
            >
              <IoIosArrowBack />
            </IconButton>
            <IconButton
              onClick={nextImage}
              sx={{
                position: 'absolute',
                top: '50%',
                right: 10,
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.6)',
                p: isMobile ? 0.5 : 1,
              }}
            >
              <IoIosArrowForward />
            </IconButton>

            {labelNew.see && (
              <Box
                position="absolute"
                top={15}
                right={25}
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
              {images.map((_, index) => (
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
          <Box
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(207, 205, 205, 0.2)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <Typography
              sx={{ fontFamily: theme.typography.paragraph1Medium }}
              color="text.secondary"
            >
              {location}, {country}
            </Typography>
            <Typography
              sx={{ fontFamily: theme.typography.paragraph1SMedium }}
              fontWeight="bold"
              noWrap
            >
              {title}
            </Typography>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0 }}
            >
              <Typography sx={{ fontFamily: theme.typography.paragraph1SMedium }}>
                {price}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IoIosStar color={theme.palette.warning.main} />
                <Typography sx={{ fontFamily: theme.typography.paragraph1SRegular }} ml={0.5}>
                  {rating}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <IconButton
          onClick={(e) => toggleFavorite(e, refDetail)}
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            p: isMobile ? 0.5 : 1,
            transition: 'transform 0.3s ease, color 0.3s ease',
            transform: animateHeart ? 'scale(1.3)' : 'scale(1)',
            backgroundColor: 'rgba(255,255,255,0)',
            '& svg': { fontSize: isMobile ? '1.5rem' : '2rem' },
          }}
        >
          {isFavorite ? (
            <IoMdHeart style={{ color: '#000' }} />
          ) : (
            <IoMdHeartEmpty style={{ color: '#fff' }} />
          )}
        </IconButton>
      </Card>
    </Box>
  );
};

export default CustomCardSearch;
