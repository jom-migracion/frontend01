import assertEnv from '@/config/env';
import { useSnackbar } from '@/context/SnackbarContext';
import { ApiService } from '@/services/ApiService';
import { Card, CardMedia, CardContent, Typography, Button, Box, Avatar, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface CardProperty {
  id: number;
  title: string;
  location: string;
  date: string;
  authorName: string;
  authorLocation: string;
  authorAvatarUrl: string;
  imageUrl: string;
  description?: string;
  listingStatusId: number; // <--- Usamos este ID
}

interface PropertyCardProps {
  property: CardProperty;
  onDetailClick: (property: CardProperty) => void;
  onRefresh?: () => void; //
}

const DetailedPropertyCard: React.FC<PropertyCardProps> = ({ property, onDetailClick, onRefresh }) => {
  const showSnackbar = useSnackbar();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  // --- BLOQUEAR ---
  const disableProperty = async () => {
    setLoading(true);
    try {
      console.log(`Bloqueando ID ${property.id}...`);
      await ApiService.put2("/ListingRent/Blocked", {}, {
        params: { listingRentId: property.id }
      });

      if (onRefresh) onRefresh();

      showSnackbar(t('detailedPropertyCard.alerts.blockSuccess'), 'success');
      setOpenModal(false);
    } catch (error: any) {
      console.error(error);
      showSnackbar(t('detailedPropertyCard.alerts.blockError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- DESBLOQUEAR ---
  const enableProperty = async () => {
    setLoading(true);
    try {
      console.log(`Desbloqueando ID ${property.id}...`);
      await ApiService.put2("/ListingRent/Unblocked", {}, {
        params: { listingRentId: property.id }
      });

      if (onRefresh) onRefresh();

      showSnackbar(t('detailedPropertyCard.alerts.unblockSuccess'), 'success');
    } catch (error: any) {
      console.error(error);
      showSnackbar(t('detailedPropertyCard.alerts.unblockError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  }

  const handleCloseModal = () => {
    setOpenModal(false);
  }

  // --- LÓGICA DE ESTADO ---
  // 6 = BLOQUEADO
  // 3 = ACTIVO
  const isBlocked = property.listingStatusId === 6;

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          borderRadius: '12px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          maxWidth: '100%',
          overflow: 'hidden',
          minHeight: { xs: '100%', sm: 140, md: 220 },
          height: '100%',
        }}
      >
        <CardMedia
          component="img"
          sx={{
            width: { xs: '100%', sm: 160, md: 180 },
            minWidth: { sm: 160, md: 180 },
            height: { xs: 180, sm: 'auto' },
            maxHeight: { sm: 180, md: 160 },
            objectFit: 'cover',
            flexShrink: 0,
          }}
          image={
            `${assertEnv.VITE_BASE_URL_PHOTOS_LISTING}${property.imageUrl}` ||
            'https://plus.unsplash.com/premium_photo-1661962841993-99a07c27c9f4?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          }
          alt={property.title}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            minWidth: 0,
            p: 1,
          }}
        >
          <CardContent sx={{ flex: '1 0 auto', minWidth: 0, p: 1 }}>
            <Typography
              component="div"
              variant="paragraph1SMedium"
              sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {property.title}
            </Typography>
            <Typography
              variant="paragraph1SRegular"
              color="text.secondary"
              component="div"
              sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {property.location}
            </Typography>
            <Typography variant="paragraph1SRegular" color="text.secondary">
              {property.date}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Avatar alt={property.authorName} src={property.authorAvatarUrl} sx={{ width: 30, height: 30, mr: 1 }} />
              <Box>
                <Typography component="div" variant="paragraph1SMedium" sx={{ fontWeight: 'bold' }}>
                  {property.authorName}
                </Typography>
                <Typography component="div" variant="paragraph1SRegular" color="text.secondary">
                  {property.authorLocation}
                </Typography>
              </Box>
            </Box>
          </CardContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1,
              justifyContent: { xs: 'center', sm: 'flex-start' },
              p: 2,
              mt: 'auto',
            }}
          >

            {/* LÓGICA DE BOTONES BASADA EN ID 6 */}
            {isBlocked ? (
              <Button
                variant="contained"
                size="small"
                onClick={enableProperty}
                disabled={loading}
                sx={{ backgroundColor: '#9e9c9c', color: '#fff', borderRadius: '20px', textTransform: 'none', px: 2, py: 1, width: { xs: '100%', sm: 'auto' }, '&:hover': { backgroundColor: '#757575' } }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : t('detailedPropertyCard.buttons.unblock')}
              </Button>
            ) : (
              <Button
                variant="contained"
                size="small"
                onClick={handleOpenModal}
                disabled={loading}
                sx={{ backgroundColor: '#FF0000', color: '#fff', borderRadius: '20px', textTransform: 'none', px: 2, py: 1, width: { xs: '100%', sm: 'auto' }, '&:hover': { backgroundColor: '#CC0000' } }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : t('detailedPropertyCard.buttons.block')}
              </Button>
            )}

            <Button
              variant="contained"
              size="small"
              onClick={() => onDetailClick(property)}
              sx={{
                backgroundColor: '#000',
                color: '#fff',
                borderRadius: '20px',
                textTransform: 'none',
                px: 2,
                py: 1,
                width: { xs: '100%', sm: 'auto' },
                '&:hover': {
                  backgroundColor: '#333',
                },
              }}
            >
              {t('detailedPropertyCard.buttons.details')}
            </Button>
          </Box>
        </Box>
      </Card>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>{t('detailedPropertyCard.modal.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('detailedPropertyCard.modal.content')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} disabled={loading} color="primary">
            {t('detailedPropertyCard.buttons.cancel')}
          </Button>
          <Button onClick={disableProperty} disabled={loading} color="error" variant="contained" autoFocus>
            {loading ? "..." : t('detailedPropertyCard.buttons.block')}
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
};

export default DetailedPropertyCard;