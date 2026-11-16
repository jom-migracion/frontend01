import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  Avatar,
  Stack,
} from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { useNavigate } from 'react-router-dom';
import { AssertRoutes } from '@/common/enum/AssertRoutes';
import { listingRentPublishedStore } from '@/store/listingRentPropertyRegistration.store';
import { useTranslation } from 'react-i18next'; // <-- Importación agregada

const SuccessfulPublicationModal: React.FC<{ listingRentId: string | number; open: boolean; handleClose: () => void }> = ({ listingRentId, open, handleClose }) => {
  const navigate = useNavigate();

  // store
  const setListingRentId = listingRentPublishedStore((state: any) => state.setListingRentId);
  const setSeeProperties = listingRentPublishedStore((state: any) => state.setSeeProperties);

  // Hook de traducciones
  const { t } = useTranslation('translation', { keyPrefix: 'SuccessfulPublicationModal' });

  const handleSeeProperties = () => {
    setSeeProperties(true);
    navigate(AssertRoutes.ADMINPANEL);
  };

  const handleEditAnnouncement = () => {
    setListingRentId(listingRentId);
    // window.open(`${AssertRoutes.DETAIL_PROPERTY}/${listingRentId}`, '_blank');
    navigate(AssertRoutes.ADMINPANEL);
  }
  
  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      onClose={(_, reason) => {
        if (reason !== 'backdropClick') {
          handleClose();
        }
      }}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: '28px',
          padding: '20px',
          boxShadow: '0px 10px 40px rgba(0,0,0,0.1)'
        },
      }}
    >
      <DialogContent sx={{ textAlign: 'center' }}>
        <Stack spacing={4} alignItems="center">
          {/* Icono de Verificación */}
          <Avatar
            sx={{
              bgcolor: '#E6F0FF',
              color: '#1976D2', 
              width: 80, 
              height: 80,
            }}
          >
            <CheckRoundedIcon sx={{ fontSize: 48 }} />
          </Avatar>

          {/* Texto de Título */}
          <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
            {t('title', { defaultValue: '¡Tu anuncio ya está publicado!' })}
          </Typography>

          {/* Cuerpo de Texto */}
          <Typography variant="body1" color="text.secondary">
            {t('description', { defaultValue: 'Felicidades, tu propiedad ya es visible para miles de huéspedes en JOM. Pronto empezarás a recibir tus primeras reservas.' })}
          </Typography>

          {/* Botones */}
          <Stack spacing={2} width="100%">
            <Button
              variant="contained"
              onClick={handleEditAnnouncement}
              fullWidth
              size="large"
              sx={{
                backgroundColor: '#1976D2',
                textTransform: 'none',
                fontSize: '1rem',
                py: 1.5,
              }}
            >
              {t('editButton', { defaultValue: 'Editar mi anuncio' })}
            </Button>
            <Button
              variant="text"
              onClick={handleSeeProperties}
              fullWidth
              size="large"
              sx={{
                color: '#1976D2',
                textTransform: 'none',
                fontSize: '1rem',
              }}
            >
              {t('viewPropertiesButton', { defaultValue: 'Ver mis anuncios' })}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessfulPublicationModal;