import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import React from 'react';
import assertEnv from '@/config/env';
import Logo from '../assets/LogoJOM-MORADO.svg';
import { useTranslation } from 'react-i18next';

interface FavoriteListCardProps {
  favoriteGroupListingId: number;
  favoriteGroupName: string;
  totalRegisters: number;
  tlListingFavorites: Array<{
    listingRent: {
      photos: Array<{
        name: string;
        isPrincipal: boolean;
      }>;
    };
  }>;
  onCardClick: (id: string) => void;
  onDeleteClick: (id: number, e: React.MouseEvent) => void;
}

const FavoriteListCard: React.FC<FavoriteListCardProps> = ({
  favoriteGroupListingId,
  favoriteGroupName,
  totalRegisters,
  tlListingFavorites,
  onCardClick,
  onDeleteClick,
}) => {
  const { t } = useTranslation();

  const getMultipleImages = () => {
    const images: string[] = [];

    if (!tlListingFavorites || tlListingFavorites.length === 0) {
      return [Logo];
    }

    const recentFavorites = tlListingFavorites.slice(0, 4);

    for (const favorite of recentFavorites) {
      const photos = favorite?.listingRent?.photos;

      if (photos && photos.length > 0) {
        const principalPhoto = photos.find((photo) => photo.isPrincipal) ?? photos[0];
        const photoUrl =
          (principalPhoto as any)?.photoLink ||
          (principalPhoto?.name
            ? `${assertEnv.VITE_BASE_URL_PHOTOS_LISTING}${principalPhoto.name}`
            : null);

        if (photoUrl) {
          images.push(photoUrl);
        }
      }
    }

    while (images.length < 4) {
      images.push(Logo);
    }

    return images;
  };

  const getPrincipalImage = () => {
    if (!tlListingFavorites || tlListingFavorites.length === 0) {
      return Logo;
    }

    const lastFavorite = tlListingFavorites[tlListingFavorites.length - 1];

    if (!lastFavorite?.listingRent?.photos || lastFavorite.listingRent.photos.length === 0) {
      return Logo;
    }

    const principalPhoto = lastFavorite.listingRent.photos.find((photo) => photo.isPrincipal);
    const photoName = principalPhoto?.name || lastFavorite.listingRent.photos[0]?.name;
    return photoName ? `${assertEnv.VITE_BASE_URL_PHOTOS_LISTING}${photoName}` : Logo;
  };

  const isShowingLogo = () => {
    const image = getPrincipalImage();
    return image === Logo;
  };

  return (
    <Box
      sx={{
        cursor: 'pointer',
        '&:hover .card-image': {
          transform: 'scale(1.05)',
        },
      }}
      onClick={() => onCardClick(favoriteGroupListingId.toString())}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4/3',
          borderRadius: 6,
          overflow: 'hidden',
          mb: 1,
          boxShadow: { xs: '0 2px 8px rgba(0, 0, 0, 0.1)', md: '0 4px 16px rgba(0, 0, 0, 0.15)' },
        }}
      >
        {favoriteGroupListingId === -1 ? (
          // Mostrar grid de 4 imágenes para "Vistos recientemente"
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gridTemplateRows: 'repeat(2, 1fr)',
              gap: '2px',
              padding: '0px',
            }}
          >
            {getMultipleImages().map((image, index) => (
              <Box
                key={index}
                sx={{
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  borderRadius: '0px',
                  bgcolor: '#f5f5f5',
                }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: image === Logo ? 'contain' : 'cover',
                    padding: image === Logo ? '20%' : 0,
                  }}
                  image={image}
                  alt={`${favoriteGroupName} ${index + 1}`}
                />
              </Box>
            ))}
          </Box>
        ) : (
          // Mostrar imagen única para listas normales
          <CardMedia
            component="img"
            className="card-image"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '100%',
              objectFit: isShowingLogo() ? 'contain' : 'cover',
              transition: 'transform 0.3s ease-in-out',
              padding: isShowingLogo() ? '20px' : 0,
            }}
            image={getPrincipalImage()}
            alt={favoriteGroupName}
          />
        )}
        {favoriteGroupListingId !== -1 && (
          <IconButton
            size="small"
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: 'red',
              bgcolor: 'rgba(160, 76, 76, 0.1)',
              padding: 0,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick(favoriteGroupListingId, e);
            }}
            aria-label="Eliminar lista"
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DeleteIcon
                sx={{
                  fontSize: { xs: 24, sm: 20 },
                  stroke: '#6B7280',
                  strokeWidth: 1.5,
                  color: '#ffffff',
                }}
              />
            </Box>
          </IconButton>
        )}
      </Box>
      <Box>
        <Typography
          variant="body1"
          fontWeight={600}
          noWrap
          sx={{
            color: '#222',
            fontSize: '15px',
            lineHeight: '20px',
          }}
        >
          {favoriteGroupName}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#717171',
            fontSize: '14px',
            lineHeight: '18px',
            mt: 0.25,
          }}
        >
          {totalRegisters === 1
            ? `1 ${t('favorites.saved')}`
            : `${totalRegisters} ${t('favorites.saved')}`}
        </Typography>
      </Box>
    </Box>
  );
};

export default FavoriteListCard;
