import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
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
import { useAuthContext } from '@/modules/_auth/context';
import SignInForm from './SignInForm';

interface CustomCardProps extends CardProps {
  onToggleFavorite?: (card: CardItem) => void;
  isFavorite?: boolean;
  setIsFavorite?: (isFav: boolean) => void;
  isTogglingFavorite?: boolean;
}

const CustomCardMisViajes: React.FC<CustomCardProps> = ({
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
  goDetailOnclick = true,
}) => {
  if (!images || images.length === 0) return null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [animateHeart, setAnimateHeart] = useState(false);
  const [isModalLogin, setIsModalLogin] = useState(false);
  const [loginType, setLoginType] = useState<'registration' | 'login'>('login');
  const { isGuestAuthenticated } = useAuthContext();
  const theme = useTheme();
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
          onToggleFavorite({ id: refDetail.toString(), title: title ?? '', image: images[0] });
        setAnimateHeart(true);
        setTimeout(() => setAnimateHeart(false), 300);
      }
    }
  };

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

  const goDetail = () => goDetailOnclick && navigate(`/detail/${refDetail}`);

  const handleCloseModal = () => {
    setIsModalLogin(false);
  };

  return (
    <Box sx={{ width: '390px', '&:hover': { transform: 'scale(1.02)', transition: '0.3s' } }}>
      <Card
        onClick={goDetail}
        sx={{
          position: 'relative',
          borderRadius: 4,
          boxShadow: 4,
          ...sx,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Imagen cuadrada/rectangular fija */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            aspectRatio: '4 / 3', // cambia a '1/1' si quieres cuadrado perfecto
            overflow: 'hidden',
          }}
        >
          <img
            src={images[currentIndex]}
            alt="Sin imagen"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Botones navegación */}
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

          {/* Botón favorito */}
          <IconButton
            onClick={toggleFavorite}
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
            {isTogglingFavorite ? (
              <CircularProgress size={isMobile ? 24 : 32} sx={{ color: '#fff' }} />
            ) : isFavorite ? (
              <IoMdHeart style={{ color: '#000' }} />
            ) : (
              <IoMdHeartEmpty style={{ color: '#fff' }} />
            )}
          </IconButton>

          {/* Label "New" */}
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

        {/* Texto debajo */}
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
          <Typography sx={{ fontFamily: theme.typography.paragraph1Medium }} color="text.secondary">
            {location}, {country}
          </Typography>

          <Typography
            sx={{
              fontFamily: theme.typography.paragraph1SMedium,
              fontWeight: 'bold',
              width: '100%', // asegura ancho fijo
              display: '-webkit-box',
              WebkitLineClamp: 2, // máximo 2 líneas
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'normal', // importante: permite varias líneas
            }}
          >
            {title}
          </Typography>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0 }}
          >
            <Typography sx={{ fontFamily: theme.typography.paragraph1SMedium }}>{price}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IoIosStar color={theme.palette.warning.main} />
              <Typography sx={{ fontFamily: theme.typography.paragraph1SRegular }} ml={0.5}>
                {rating}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Card>
      <SignInForm open={isModalLogin} onClose={handleCloseModal} typeLogin={loginType} />
    </Box>
  );
};

export default CustomCardMisViajes;
