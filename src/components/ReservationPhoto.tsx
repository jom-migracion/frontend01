import React from 'react';
import { Card, CardMedia } from '@mui/material';

interface ReservationPhotoProps {
  photoUrl?: string | null;
  alt?: string;
}

const ReservationPhoto: React.FC<ReservationPhotoProps> = ({ photoUrl, alt = 'room' }) => {
  if (!photoUrl) return null;

  return (
    <Card elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <CardMedia
        component="img"
        sx={{ height: { xs: 300, sm: 400, md: 580 } }}
        image={photoUrl}
        alt={alt}
      />
    </Card>
  );
};

export default ReservationPhoto;
