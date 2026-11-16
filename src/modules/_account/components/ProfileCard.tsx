import React from 'react';
import { Card, Avatar, Typography, Button, Box, Divider } from '@mui/material';

interface ProfileCardProps {
  name: string;
  role: string;
  hostings: number;
  reviews: number;
  avatarSrc: string;
  timeInAssert: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  role,
  hostings,
  reviews,
  timeInAssert,
  avatarSrc,
}) => {
  return (
    <Card sx={{ maxWidth: 350, p: 2, borderRadius: '16px', boxShadow: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
          Información sobre mí
        </Typography>
        <Button variant="outlined" size="small" sx={{ borderRadius: '20px' }}>
          Editar
        </Button>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, mb: 3 }}>
        <Avatar
          src={avatarSrc}
          alt={name}
          sx={{ width: 120, height: 120, mr: 3, border: '2px solid #ccc' }}
        />
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
            <Typography variant="h4" component="span" sx={{ fontWeight: 'bold', mr: 1 }}>
              {hostings}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Hospedajes
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
            <Typography variant="h4" component="span" sx={{ fontWeight: 'bold', mr: 1 }}>
              {reviews}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Reseña
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ mt: 2 }}>
        <Typography variant="h5" component="p" sx={{ fontWeight: 'bold' }}>
          {name}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          {role}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {timeInAssert} Tiempo en Assert
        </Typography>
      </Box>
    </Card>
  );
};

export default ProfileCard;
