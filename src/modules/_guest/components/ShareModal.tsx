import React from 'react';
import { Modal, Box, Typography, Button, TextField, IconButton, Stack } from '@mui/material';
import { Share, WhatsApp, Facebook, ContentCopy, Close } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 6,
  boxShadow: 24,
  p: '20px 50px 80px 50px',
};

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcementUrl: string;
  announcementTitle: string;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  announcementUrl,
  announcementTitle,
}) => {
  const { t } = useTranslation();

  // --- 1. Funciones de Compartición ---

  const shareOnWhatsApp = () => {
    const message = t('shareModal.whatsappMessage', { title: announcementTitle });
    const text = encodeURIComponent(`${message}\n${announcementUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    onClose();
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(announcementUrl)}`;
    window.open(facebookUrl, 'facebook-share-dialog', 'width=626,height=436');
    onClose();
  };

  const copyLink = () => {
    navigator.clipboard.writeText(announcementUrl);
    alert(t('shareModal.copyAlert')); // Mejorar con un Snackbar de MUI, tal vez??? :P
    onClose();
  };

  // --- 2. Renderizado del Componente ---
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="share-modal-title"
      aria-describedby="share-modal-description"
    >
      <Box sx={style}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'grey.500',
            bgcolor: 'grey.100',
            width: 32,
            height: 32,
            '&:hover': {
              bgcolor: 'grey.200',
              color: 'grey.700',
            },
          }}
          aria-label={t('shareModal.closeAria')}
        >
          <Close fontSize="small" />
        </IconButton>
        <Typography id="share-modal-title" variant="h5" component="h2" sx={{ mb: 2 }}>
          <Share sx={{ verticalAlign: 'middle', mr: 1 }} /> {t('shareModal.title')}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label={t('shareModal.inputLabel')}
            value={announcementUrl}
            InputProps={{
              readOnly: true,
            }}
            size="small"
          />
          <IconButton color="primary" onClick={copyLink} aria-label={t('shareModal.copyAria')}>
            <ContentCopy />
          </IconButton>
        </Stack>

        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          {t('shareModal.socialSubtitle')}
        </Typography>

        {/* Botones de Compartir en Redes Sociales */}
        <Stack direction="row" spacing={2} justifyContent="center">
          {/* WhatsApp */}
          <Button
            variant="contained"
            startIcon={<WhatsApp />}
            sx={{ bgcolor: '#25D366', '&:hover': { bgcolor: '#1DA851' } }}
            onClick={shareOnWhatsApp}
          >
            {t('shareModal.whatsappBtn')}
          </Button>

          {/* Facebook */}
          <Button
            variant="contained"
            startIcon={<Facebook />}
            sx={{ bgcolor: '#1877F2', '&:hover': { bgcolor: '#145CBF' } }}
            onClick={shareOnFacebook}
          >
            {t('shareModal.facebookBtn')}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ShareModal;
