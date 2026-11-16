// ProfileModal.tsx
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useGet } from '@/hooks/api';

type Props = {
  open: boolean;
  onClose: () => void;
  userId: string;
  propertyId: string;
};

const ProfileModal: React.FC<Props> = ({ open, onClose, userId }) => {

  const [reviews, setReviews] = useState<any[]>([]);

  // api
  const { data: ProfileReviews, refetch: refetchProfileReviews } = useGet('ProfileReviews', `/ListingRent/Reviews/Host/${userId}`, [], false);
  const { data: ProfileInfo, refetch: refetchProfileInfo } = useGet<any>('ProfileInfo', `/GetProfileByUserId/${userId}`, [], false);
        

 useEffect(() => {
    if (open) {      
        refetchProfileReviews();   
        refetchProfileInfo();
    }
    }, [open, refetchProfileInfo, refetchProfileReviews]);  

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ maxWidth: 900, margin: 'auto', mt: 5, bgcolor: 'background.paper', p: 3, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Modal Perfil</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>

        {/* Sección 1: Perfil de Assert con tres columnas iguales */}
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        {/* Columna 1: Card de perfil */}
        <Box sx={{ flex: 1 }}>
            <Card>
            <CardContent sx={{ display: 'flex', gap: 2 }}>
                {/* Columna izquierda del Card */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40%' }}>
                <Avatar  src={ProfileInfo?.data?.avatar?.replace("https://localhost:44317","http://assert-dev.runasp.net")} sx={{ width: 80, height: 80, mb: 1 }} />
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{ProfileInfo?.data?.name}</Typography>
                </Box>

                {/* Columna derecha del Card */}
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '60%' }}>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{ProfileInfo?.data?.guestReviews?.lenght ??0}</Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.65rem' }}>reseñas</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{ProfileInfo?.data?.guestReviewCalification??0}</Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.65rem' }}>calificación</Typography>
                </Box>
                <Box>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{ProfileInfo?.data?.timeInAssert??0}</Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.65rem' }}>tiempo como anfitrión</Typography>
                </Box>
                </Box>
            </CardContent>
            </Card>
        </Box>

        {/* Columna 2: Acerca de Assert */}
        <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '0.85rem', mb: 1 }}>
            {`Acerca de ${ProfileInfo?.data?.name??''} ${ProfileInfo?.data?.lastName??''}`}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Estudios: {ProfileInfo?.data?.about?.education}</Typography>
            <Typography variant="caption" component="div" sx={{ fontSize: '0.7rem' }}>Ocupación: {ProfileInfo?.data?.about?.occupation}</Typography>
            <Typography variant="caption" component="div" sx={{ fontSize: '0.7rem' }}>Identidad verificada: {ProfileInfo?.data?.isDocumentVerified ? 'Sí' : 'No'}</Typography>
        </Box>

        {/* Columna 3: Vacía */}
        <Box sx={{ flex: 1 }} />
        </Box>
 
 
        {/* Sección 2: Reseñas de Ismael */}
        {/* <Typography variant="h6" sx={{ mt: 4, fontSize: '0.9rem' }}>{`Reseñas de ${ProfileInfo?.data?.name??'Jom'}` }</Typography> */}
        <Box sx={{ display: 'flex', overflowX: 'auto', py: 2 }}>
        { Array.isArray(ProfileReviews?.data) && ProfileReviews.data.map((review, index) => (
            <Card
            key={index}
            sx={{
                minWidth: 220,
                maxWidth: 220,
                flexShrink: 0,
                fontSize: '0.75rem',
                borderRadius: 0,
                boxShadow: 'none',
                borderRight: index !== reviews.length - 1 ? '1px solid #ccc' : 'none'
            }}
            >
            <CardContent sx={{ p: 1 }}>
                {/* Fila 1: Imagen + Nombre/Ubicación */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar src={review?.listingRent?.owner?.photoLink.replace("https://localhost:44317","http://assert-dev.runasp.net")} sx={{ width: 40, height: 40, mr: 1 }} />
                <Box>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{review?.listingRent?.owner?.owner??''} {review?.listingRent?.owner?.lastName??''}</Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>{review?.listingRent?.property?.stateName}</Typography>
                </Box>
                </Box>

                {/* Fila 2: Estrellas */}
                <Box sx={{ mb: 1 }}>
                <Rating value={review?.calification} readOnly size="small" />
                </Box>

                {/* Fila 3: Comentario */}
                <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                {review.comment}
                </Typography>
            </CardContent>
            </Card>
        ))}
        </Box>
      
        {/* Sección 3: Anuncios de Assert */}
        {/* <Typography variant="h6" sx={{ mt: 4, fontSize: '0.9rem' }}>Anuncios de Assert</Typography> *
        <Box sx={{ display: 'flex', overflowX: 'auto', py: 2 }}>
        {ads.map((ad, index) => (
            <Card
            key={index}
            sx={{
                minWidth: 220,
                maxWidth: 220,
                flexShrink: 0,
                borderRadius: 2,
                boxShadow: 1,
                overflow: 'hidden',
                position: 'relative',
                mr: index !== ads.length - 1 ? 2 : 0
            }}
            >
            <Box
                component="img"
                src={ad.image}
                alt="Anuncio"
                sx={{
                width: '100%',
                height: 220,
                objectFit: 'cover'
                }}
            />

            <Box
                sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                p: 1
                }}
            >
                <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.primary' }}>
                {ad.location}
                </Typography>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.primary' }}>
                {ad.description}
                </Typography>
            </Box>
            </Card>
        ))}
        </Box>*/}

      </Box>
    </Modal>
  );
};

export default ProfileModal;
