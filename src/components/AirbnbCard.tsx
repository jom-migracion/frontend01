import { jomPurple } from '@/assets';
import { useSnackbar } from '@/context/SnackbarContext';
import { useAuthContext } from '@/modules/_auth/context';
import { RestClient } from '@/services/RestClient';
import {
  useListingRentContinueStore,
  usePropertyRegistration,
} from '@/store/listingRentPropertyRegistration.store';
import theme from '@/themes/theme';
import DeleteIcon from '@mui/icons-material/Delete';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useRef, useState } from 'react';
import { MdKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import AssertModal from './AssertModal';
import { pushToDataLayer } from '@/utilities/analytics';

const SignInForm = React.lazy(() => import('./SignInForm'));

interface AirbnbCardProps {
  listingRentId: string;
  images: string[];
  location: string;
  country: string;
  title: string;
  price: string;
  rating?: number;
  bedrooms: number;
  bathrooms: number;
  beds: number;
  isFavorite?: boolean;
  isTogglingFavorite?: boolean;
  onToggleFavorite?: () => void;
  setIsFavorite?: (isFav: boolean) => void;
  status?: 'publicado' | 'pendiente' | 'no publicado';
  onShowDetail?: () => void;
  onDeleteProperty?: () => void;
  priority?: boolean;
}

const statusBoxStyle = () => ({
  position: 'absolute',
  top: 16,
  right: 6,
  backgroundColor: 'white',
  borderRadius: 2,
  px: 2,
  py: 0.5,
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  boxShadow: 2,
  zIndex: 3,
});

const statusDotStyle = (status: 'publicado' | 'pendiente' | 'no publicado' | undefined) => ({
  width: 10,
  height: 10,
  borderRadius: '50%',
  backgroundColor:
    status === 'publicado' ? '#76C811' : status === 'pendiente' ? '#FFA000' : '#FF0000',
});

const AirbnbCard: React.FC<AirbnbCardProps> = ({
  listingRentId,
  images,
  location,
  country,
  title,
  price,
  rating,
  isFavorite = false,
  isTogglingFavorite = false,
  onToggleFavorite,
  setIsFavorite,
  status,
  onShowDetail,
  onDeleteProperty,
  priority = false,
}) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalLogin, setIsModalLogin] = useState(false);
  const { isGuestAuthenticated } = useAuthContext();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [hasError, setHasError] = useState(false);
  const [openDeleteReservation, setOpenDeleteReservation] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const locationRoad = useLocation();
  const showSnackbar = useSnackbar();
  const { t } = useTranslation();

  const setDataListingRent = usePropertyRegistration((state) => state.setData);
  const setContinueStepPublishing = usePropertyRegistration(
    (state) => state.setContinueStepPublishing
  );
  const setListingRentIdContinue = useListingRentContinueStore(
    (state) => state.setListingRentIdContinue
  );

  const displayImages = images.slice(0, 5);
  const imageSrc = displayImages.length > 0 ? displayImages[currentImageIndex] : jomPurple;
  const finalSrc = hasError ? jomPurple : imageSrc.includes('data:image') ? jomPurple : imageSrc;

  const handleCardClick = async () => {
    if (status === 'pendiente') {
      const responseContinue = await RestClient.get(
        `/Host/ListingRent/${listingRentId}/ProcessData/Continue`
      );
      const responseProcessData = await responseContinue.data;

      if (responseProcessData.statusCode === '200' && responseProcessData.data) {
        setDataListingRent(responseProcessData.data);
        setContinueStepPublishing(responseProcessData.data.listingData.nextViewCode);
        setListingRentIdContinue(responseProcessData.data.listingData.listingRentId);
        navigate(`/host/register`);
      } else {
        showSnackbar(responseProcessData?.resultError?.message, 'error');
      }
      return;
    }

    pushToDataLayer('view_property', {
      view_property_id: listingRentId,
    });

    // Navegación a detalle con parámetros de búsqueda
    if (onShowDetail) {
      onShowDetail();
      return;
    }

    const isRoot = locationRoad.pathname === '/';
    const isSearch = locationRoad.pathname.includes('search-results');
    const baseUrl = `/detail/${listingRentId}`;

    if (isRoot || isSearch) {
      const currentSearchParams = new URLSearchParams(locationRoad.search);
      currentSearchParams.set('fromSearch', 'true'); // Para que sepas en el detalle de dónde vino

      const finalUrl = `${baseUrl}?${currentSearchParams.toString()}`;
      window.open(finalUrl, '_blank', 'noopener,noreferrer');
    } else {
      navigate(baseUrl);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isFavorite) {
      if (!isGuestAuthenticated) {
        setIsModalLogin(true);
        return;
      }
      onToggleFavorite && onToggleFavorite();
    } else {
      setIsFavorite && setIsFavorite(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalLogin(false);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      e.preventDefault();
      e.stopPropagation();

      if (swipeDistance > 0) {
        // Swipe left - next image
        setCurrentImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
      } else {
        // Swipe right - previous image
        setCurrentImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
      }
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const handleDeleteProperty = async () => {
    try {
      const response = await RestClient.delete(`/Host/ListingRent/${listingRentId}`);
      const responseData = await response.data;

      if (responseData.statusCode === '200') {
        showSnackbar('Publicación eliminada exitosamente', 'success');
        setOpenDeleteReservation(false);
        if (onDeleteProperty) {
          onDeleteProperty();
        }
      } else {
        showSnackbar(
          responseData?.resultError?.message || 'Error al eliminar la publicación',
          'error'
        );
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      showSnackbar('Error al eliminar la publicación', 'error');
    }
  };

  return (
    <Box
      className="tarjeta-propiedad"
      sx={{
        cursor: 'pointer',
        width: '100%',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        background: 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container - aspect ratio 4:3 */}
      <Box
        onClick={handleCardClick}
        //onClick={() => console.log('Card clicked')}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4/3',
          borderRadius: '16px',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
      >
        <Box
          className="card-image"
          component="img"
          fetchPriority={priority ? 'high' : 'auto'}
          loading={priority ? 'eager' : 'lazy'}
          //decoding={priority ? 'sync' : 'async'}
          decoding="async"
          width={400}
          height={300}
          src={finalSrc}
          alt={title}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: hasError ? 'contain' : 'cover',
            padding: hasError ? '20px' : 0,
            transition: 'transform 500ms ease',
            '&:hover': {
              transform: hasError ? 'none' : 'scale(1.05)',
            },
          }}
          onError={() => {
            if (!hasError) {
              setHasError(true);
            }
          }}
        />
        {status == 'no publicado' && (
          <IconButton
            size="small"
            aria-label={`Eliminar publicación de ${title}`}
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: 'white',
              borderRadius: 2,
              padding: 1,
              boxShadow: 2,
              zIndex: 3,
              '&:hover': {
                backgroundColor: '#f5f5f5',
                transform: 'scale(1.05)',
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpenDeleteReservation(true);
            }}
          >
            <DeleteIcon fontSize="small" sx={{ color: '#FF0000' }} />
          </IconButton>
        )}
        {status ? (
          <Box sx={statusBoxStyle}>
            <Box sx={statusDotStyle(status)} />
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: 'text.primary', textTransform: 'capitalize' }}
            >
              {status}
            </Typography>
          </Box>
        ) : (
          <IconButton
            size="small"
            aria-label={
              isFavorite ? `Quitar ${title} de favoritos` : `Agregar ${title} a favoritos`
            }
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
            onClick={handleFavoriteClick}
            disabled={isTogglingFavorite}
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
        )}

        {/* Navigation Arrows */}
        {displayImages.length > 1 && (isHovered || isMobile) && (
          <>
            <IconButton
              size="small"
              aria-label={`Ver imagen anterior de ${title}`}
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                color: 'gray',
                padding: 0,
                borderRadius: '50%',
                width: { xs: 36, sm: 28 },
                height: { xs: 36, sm: 28 },
                minWidth: 'unset',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 1)',
                },
              }}
              onClick={handlePrevImage}
              onTouchEnd={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handlePrevImage(e as any);
              }}
            >
              <MdKeyboardArrowLeft size={isMobile ? 24 : 20} />
            </IconButton>
            <IconButton
              size="small"
              aria-label={`Ver siguiente imagen de ${title}`}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                color: 'gray',
                padding: 0,
                borderRadius: '50%',
                width: { xs: 36, sm: 28 },
                height: { xs: 36, sm: 28 },
                minWidth: 'unset',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 1)',
                },
              }}
              onClick={handleNextImage}
              onTouchEnd={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleNextImage(e as any);
              }}
            >
              <MdOutlineKeyboardArrowRight size={isMobile ? 24 : 20} />
            </IconButton>
          </>
        )}

        {/* Image Indicators */}
        {displayImages.length > 1 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 0.5,
            }}
          >
            {displayImages.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: index === currentImageIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  transition: 'background-color 0.3s',
                }}
              />
            ))}
          </Box>
        )}
      </Box>
      {/* Card Info */}
      <Box
        onClick={handleCardClick}
        sx={{
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
            width: '100%',
          }}
        >
          <Tooltip title={`${location}, ${country}`} placement="top" arrow>
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
              {location} {country ? `, ${country}` : ''}
            </Typography>
          </Tooltip>
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

        <Tooltip title={title} placement="top" arrow>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 400,
              color: '#6B7280',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '100%',
              display: 'block',
            }}
          >
            {title}
          </Typography>
        </Tooltip>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '4px', mt: '4px' }}>
          <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#1F2937' }}>
            {price} BOB
          </Typography>
          <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#6B7280' }}>
            {t('recentlyViewed.price')}
          </Typography>
        </Box>
      </Box>
      {isModalLogin && (
        <React.Suspense fallback={null}>
          <SignInForm open={isModalLogin} onClose={handleCloseModal} typeLogin={'login'} />
        </React.Suspense>
      )}
      <AssertModal
        title={t('cardProperty.msgTitleDelete')}
        content={t('cardProperty.msgDelete')}
        open={openDeleteReservation}
        showCloseLeft={true}
        onClose={() => setOpenDeleteReservation(false)}
        showFooterButtons
        onLeftButtonClick={() => setOpenDeleteReservation(false)}
        onRightButtonClick={() => handleDeleteProperty()}
        textLeftButton={t('cardProperty.buttonCancel')}
        textRightButton={t('cardProperty.buttonDelete')}
        maxWidthA="sm"
        primaryRightButton={true}
        textContentJustify={true}
      />
    </Box>
  );
};

export default React.memo(AirbnbCard);
