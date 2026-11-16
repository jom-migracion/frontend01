import React from 'react';
import {
  Card,
  CardMedia,
  Box,
  IconButton,
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
interface Photo {
  photoLink: string;
  isPrincipal: boolean;
  name: string;
  description: string;
  position: number;
  spaceType: string | null;
  spaceTypeCode: string | null;
  spaceTypeId: number | null;
  listingPhotoId: number;
}
interface ImageCarouselCardProps {
  images: Photo[];
}



const ImageCarouselCard: React.FC<ImageCarouselCardProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (images.length === 0) return null;


  return (
    <Card sx={{ position: 'relative', width: '100%', height: 400, overflow: 'hidden' }}>
      <CardMedia
        component="img"
        image={
          images[currentIndex].photoLink.includes('https://localhost:44317/')
            ? images[currentIndex].photoLink.replace('https://localhost:44317/', 'https://assert-dev.runasp.net/')
            : images[currentIndex].photoLink
        }
        alt={`Image ${currentIndex + 1}`}
        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: 0,
          transform: 'translateY(-50%)',
          zIndex: 1,
        }}
      >
        <IconButton onClick={handlePrev} sx={{ color: 'white' }}>
          <ArrowBackIos />
        </IconButton>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          right: 0,
          transform: 'translateY(-50%)',
          zIndex: 1,
        }}
      >
        <IconButton onClick={handleNext} sx={{ color: 'white' }}>
          <ArrowForwardIos />
        </IconButton>
      </Box>
    </Card>
  );
};

export default ImageCarouselCard;
