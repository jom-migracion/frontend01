// TransferStatusCard.tsx

import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

export interface TransferData {
  amount: string; // ej: "BOB 300"
  sentDate: string; // ISO string
  arrivalDate: string; // ISO string
}

interface TransferStatusCardProps {
  open?: boolean;
  onClose?: () => void;
  data?: TransferData;
}

interface StepItemProps {
  index: number;
  label: string;
  secondary?: string;
  done?: boolean;
  active?: boolean;
  isLast?: boolean;
  theme: any;
}

const StepItem: React.FC<StepItemProps> = ({
  index,
  label,
  secondary,
  done,
  active,
  isLast,
  theme,
}) => {
  const primary = theme.palette.customColors.primary[1];
  return (
    <Box display="flex" alignItems="flex-start" gap={2} mb={isLast ? 0 : 0} position="relative">
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: done || active ? theme.palette.customColors.primary[7] : 'transparent',
            border: active
              ? `2px solid ${theme.palette.customColors.primary[1]}`
              : done
                ? `none`
                : `2px solid #d0d0d0`,
            color: active
              ? theme.palette.customColors.primary[1]
              : done
                ? theme.palette.customColors.primary[1]
                : '#757575',
            fontWeight: 700,
            fontSize: 10,
            lineHeight: 1,
            zIndex: 1,
          }}
        >
          {done ? <CheckIcon sx={{ fontSize: 14 }} /> : index}
        </Box>
        {!isLast && (
          <Box
            sx={{
              width: 2,
              height: 30,
              bgcolor: '#e0e0e0',
              mt: 0,
              mb: 2,
            }}
          />
        )}
      </Box>
      <Box flex={1} pt={0.5}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1f1f1f' }}>{label}</Typography>
        {secondary && (
          <Typography
            sx={{
              fontSize: 12,
              color: active ? primary : 'text.secondary',
              fontWeight: active ? 600 : 400,
            }}
          >
            {secondary}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

const TransferStatusCard: React.FC<TransferStatusCardProps> = ({ open = false, onClose, data }) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const currentLocale = i18n.language.startsWith('es') ? es : enUS;

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      // Formato: 5 de oct de 2025
      return format(date, "d 'de' MMM 'de' yyyy", { locale: currentLocale });
    } catch {
      return dateString || '';
    }
  };

  const displayData = data || {
    amount: 'BOB 300',
    sentDate: new Date().toISOString(), // Fecha de hoy
    arrivalDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), // Hoy + 2 días
  };

  const formattedSentDate = formatDate(displayData.sentDate);
  const formattedArrivalDate = formatDate(displayData.arrivalDate);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 6,
            maxWidth: 450,
          },
        },
      }}
    >
      <DialogContent sx={{ p: 3 }}>
        {/* 1. Icono de retroceso con acción de cerrar */}
        <IconButton aria-label="back" sx={{ p: 0, mb: 2 }} onClick={onClose}>
          <ArrowBackIcon />
        </IconButton>

        {/* 2. Título */}
        <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
          {t('transferStatusCard.title')}
        </Typography>

        {/* 3. Línea de Tiempo */}
        <Box sx={{ my: 3 }}>
          <StepItem
            index={1}
            label={t('transferStatusCard.timeline.sent')}
            secondary={formattedSentDate}
            done
            theme={theme}
          />
          <StepItem
            index={2}
            label={t('transferStatusCard.timeline.estimatedArrival')}
            secondary={formattedArrivalDate}
            done
            isLast
            theme={theme}
          />
        </Box>

        {/* 4. Texto de Cuerpo */}
        <Typography variant="body1" sx={{ mb: 2 }}>
          {/* Enviamos BOB 300 el 18 de octubre de 2025. Ya deberías haberlo recibido. */}
          {t('transferStatusCard.body.mainInfo', {
            amount: displayData.amount,
            date: formattedSentDate,
          })}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          {t('transferStatusCard.body.disclaimer')}
        </Typography>

        {/* 5. Botón de Acción */}
        <Button
          variant="secondary"
          fullWidth
          onClick={() => navigate('/host/info-profile/payments')}
        >
          {t('transferStatusCard.button')}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default TransferStatusCard;
