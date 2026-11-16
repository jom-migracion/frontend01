import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useNavigate } from 'react-router';
import CardProps from '@/models/interfaces/CustomCardProps';

interface ListingCardProps extends CardProps {
  status: 'publicado' | 'proceso';
  onShowDetail?: () => void;
}

const CustomCardAllTrip: React.FC<ListingCardProps> = ({
  images,
  location,
  country,
  title,
  // price,
  // rating,
  refDetail,
  sx = {},
  status,
  onShowDetail,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const changeImage = (step: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + step + images.length) % images.length);
  };

  const handleDotClick = (idx: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(idx);
  };

  const goToDetail = () => {
    if (onShowDetail) onShowDetail();
    else navigate(`/detail/${refDetail}`);
  };

  const isPublished = status === 'publicado';

  if (!images?.length) return null;

  return (
    <Box sx={{ width: '100%', '&:hover': { transform: 'scale(1.02)', transition: '0.3s' } }}>
      <Card
        onClick={goToDetail}
        sx={{
          position: 'relative',
          borderRadius: 3,
          boxShadow: 3,
          overflow: 'hidden',
          height: 350,
          cursor: 'pointer',
          ...sx,
        }}
      >
        <Box
          component="img"
          src={images[currentIndex]?.photoLink || images[currentIndex]}
          alt={title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />

        <IconButton onClick={changeImage(-1)} sx={arrowStyle('left', isMobile)}>
          <IoIosArrowBack />
        </IconButton>
        <IconButton onClick={changeImage(1)} sx={arrowStyle('right', isMobile)}>
          <IoIosArrowForward />
        </IconButton>

        <Stack direction="row" justifyContent="center" spacing={0.5} sx={dotStyle}>
          {images.map((_, index) => (
            <Box
              key={index}
              onClick={handleDotClick(index)}
              sx={dotBoxStyle(currentIndex === index, isMobile)}
            />
          ))}
        </Stack>

        <Box sx={statusBoxStyle(isPublished)}>
          <Box sx={statusDotStyle(isPublished)} />
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, color: 'text.primary', textTransform: 'capitalize' }}
          >
            {status}
          </Typography>
        </Box>

        <Box sx={infoBoxStyle}>
          <Typography variant="body2" sx={{ fontFamily: theme.typography.paragraph1SemiBold }}>
            {location} {country}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 'bold', fontFamily: theme.typography.paragraph1SSemiBold, mb: 0.5 }}
          >
            {title}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

const arrowStyle = (side: 'left' | 'right', isMobile: boolean) => ({
  position: 'absolute',
  top: '50%',
  [side]: 10,
  transform: 'translateY(-50%)',
  background: 'rgba(255,255,255,0.6)',
  p: isMobile ? 0.5 : 1,
  zIndex: 2,
});

const dotStyle = {
  position: 'absolute',
  bottom: 50,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 2,
};

const dotBoxStyle = (active: boolean, isMobile: boolean) => ({
  width: isMobile ? 6 : 8,
  height: isMobile ? 6 : 8,
  borderRadius: '50%',
  backgroundColor: active ? 'white' : 'grey.400',
  cursor: 'pointer',
});

const statusBoxStyle = (published: boolean) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  backgroundColor: published ? 'white' : 'white',
  borderRadius: 2,
  px: 2,
  py: 0.5,
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  boxShadow: 2,
  zIndex: 3,
});

const statusDotStyle = (published: boolean) => ({
  width: 10,
  height: 10,
  borderRadius: '50%',
  backgroundColor: published ? 'green' : 'red',
});

const infoBoxStyle = {
  position: 'absolute',
  bottom: 0,
  width: '100%',
  p: 2,
  backgroundColor: 'rgba(255,255,255,0.5)',
  color: 'black',
  zIndex: 2,
};

export default CustomCardAllTrip;
