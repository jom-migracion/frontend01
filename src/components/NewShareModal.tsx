import React from 'react';
import { Typography, Box, Button, Divider, Stack } from '@mui/material';
import Grid from '@mui/material/Grid2';
import ContentCopyOutlined from '@mui/icons-material/ContentCopyOutlined';
import WhatsApp from '@mui/icons-material/WhatsApp';
import FacebookOutlined from '@mui/icons-material/FacebookOutlined';
import Telegram from '@mui/icons-material/Telegram';
import CustomDialog from './CustomDialog';
import { useNotification } from '@/context/NotificationContext';
import { useTranslation } from 'react-i18next';

interface ShareModalProps {
  propertyId?: number;
  open: boolean;
  onClose: () => void;
  shareUrl: string;
  title: string;
  propertyImage?: string;
  propertyType?: string;
  rating?: number;
  address?: string;
  bedrooms?: number;
}

interface ShareOption {
  name: string;
  icon: React.ReactElement;
  action: () => void | Promise<void>;
}

const NewShareModal: React.FC<ShareModalProps> = ({
  propertyId,
  open,
  onClose,
  shareUrl,
  title,
  propertyImage = 'https://via.placeholder.com/80',
  propertyType = 'Alojamiento',
  rating,
  address,
  bedrooms,
}) => {
  const { t } = useTranslation();
  const showNotification = useNotification();

  const apiBase = (import.meta.env.VITE_BASE_URL ?? '').replace(/\/+$/, '');

  const previewShareUrl =
    propertyId != null && apiBase ? `${apiBase}/ListingRent/${propertyId}/SharePreview` : shareUrl;

  const handleCopyLink = async (): Promise<void> => {
    try {
      const urlToCopy = previewShareUrl;

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(urlToCopy);
      } else {
        const textArea = document.createElement('textarea');

        textArea.value = urlToCopy;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        textArea.style.pointerEvents = 'none';

        document.body.appendChild(textArea);
        textArea.select();

        const copied = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (!copied) {
          throw new Error('El navegador no pudo copiar el enlace.');
        }
      }

      showNotification('success', '', t('newShareModal.notifications.copySuccess'));
    } catch (error) {
      console.error('Error al copiar el enlace:', error);
      showNotification('error', '', t('newShareModal.notifications.copyError'));
    }
  };

  // const handleFacebookShare = async (): Promise<void> => {
  //   const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
  //     previewShareUrl
  //   )}`;

  //   if (typeof navigator.share === 'function') {
  //     try {
  //       await navigator.share({
  //         title,
  //         text: title,
  //         url: previewShareUrl,
  //       });

  //       return;
  //     } catch (error) {
  //       if (error instanceof Error && error.name === 'AbortError') {
  //         return;
  //       }

  //       console.error('Error con el menú nativo de compartir:', error);
  //       window.location.assign(facebookUrl);
  //       return;
  //     }
  //   }

  //   const newWindow = window.open(facebookUrl, '_blank', 'noopener,noreferrer');

  //   if (!newWindow) {
  //     window.location.assign(facebookUrl);
  //   }
  // };

  const handleFacebookShare = async (): Promise<void> => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      previewShareUrl
    )}`;

    // 1. Detectar si estamos en un dispositivo móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    // 2. Si es celular y soporta compartir nativo -> Usar menú nativo
    if (isMobile && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title,
          text: title,
          url: previewShareUrl,
        });
        return;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        console.error('Error con el menú nativo de compartir:', error);
        window.location.assign(facebookUrl);
        return;
      }
    }

    // 3. Si es PC (Escritorio) -> Abrir la ventana flotante web de Facebook una sola vez
    window.open(facebookUrl, '_blank', 'noopener,noreferrer,width=600,height=600');
  };

  const handleWhatsAppShare = (): void => {
    const message = `${title} ${shareUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTelegramShare = (): void => {
    const telegramUrl =
      `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}` +
      `&text=${encodeURIComponent(title)}`;

    window.open(telegramUrl, '_blank', 'noopener,noreferrer');
  };

  const shareOptions: ShareOption[] = [
    {
      name: t('newShareModal.options.copyLink'),
      icon: <ContentCopyOutlined />,
      action: handleCopyLink,
    },
    {
      name: t('newShareModal.options.whatsapp'),
      icon: <WhatsApp />,
      action: handleWhatsAppShare,
    },
    {
      name: t('newShareModal.options.facebook'),
      icon: <FacebookOutlined />,
      action: handleFacebookShare,
    },
    {
      name: t('newShareModal.options.telegram'),
      icon: <Telegram />,
      action: handleTelegramShare,
    },
  ];

  const propertyInfo = [
    propertyType,
    rating != null ? `★${rating.toFixed(2)}` : null,
    bedrooms != null
      ? t('newShareModal.propertyInfo.bedroom', {
          count: bedrooms,
        })
      : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <CustomDialog isOpen={open} onClose={onClose}>
      <Box sx={{ mb: 3, minWidth: 0 }}>
        <Stack direction="row" spacing={{ xs: 1.5, sm: 2 }} alignItems="flex-start">
          <Box
            component="img"
            src={propertyImage}
            alt={title}
            loading="lazy"
            sx={{
              width: { xs: 72, sm: 88 },
              height: { xs: 72, sm: 88 },
              borderRadius: 2,
              objectFit: 'cover',
              border: '1px solid',
              borderColor: 'divider',
              flexShrink: 0,
            }}
          />

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                lineHeight: 1.6,
                mb: 0.5,
                fontWeight: 500,
                overflowWrap: 'anywhere',
              }}
            >
              {propertyInfo}
            </Typography>

            <Typography
              variant="subtitle1"
              component="p"
              sx={{
                fontWeight: 600,
                lineHeight: 1.4,
                overflowWrap: 'anywhere',
              }}
            >
              {title}
            </Typography>

            {address && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: 'block',
                  mt: 0.5,
                  lineHeight: 1.5,
                  overflowWrap: 'anywhere',
                }}
              >
                {address}
              </Typography>
            )}
          </Box>
        </Stack>
      </Box>

      <Divider sx={{ mb: 3, borderColor: 'divider' }} />

      <Grid container spacing={1.5}>
        {shareOptions.map((option) => (
          <Grid size={{ xs: 12, sm: 6 }} key={option.name}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={option.icon}
              onClick={() => {
                void option.action();
              }}
              sx={{
                justifyContent: 'flex-start',
                textAlign: 'left',
                textTransform: 'none',
                color: 'text.primary',
                borderColor: 'divider',
                borderRadius: 2,
                minHeight: 52,
                py: 1.5,
                px: 2,
                fontWeight: 500,
                fontSize: '0.9375rem',
                overflowWrap: 'anywhere',
                '&:hover': {
                  borderColor: 'text.primary',
                  backgroundColor: 'action.hover',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                },
                '& .MuiButton-startIcon': {
                  mr: 1.5,
                  flexShrink: 0,
                  '& svg': {
                    fontSize: '1.25rem',
                  },
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {option.name}
            </Button>
          </Grid>
        ))}
      </Grid>
    </CustomDialog>
  );
};

export default NewShareModal;
