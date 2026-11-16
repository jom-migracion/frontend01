import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Avatar, Paper } from '@mui/material';
import theme from '@/themes/theme';
import { jomWhite } from '@/assets';
import { useTranslation } from 'react-i18next';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface ReservationRequestCardProps {
  remainingHours: any;
  userName?: string; // Opcional, si quieres mostrar el nombre en el futuro
  userAvatarUrl: string;
  reservationDates: string;
  listingName: string;
}

const ReservationRequestCard: React.FC<ReservationRequestCardProps> = ({
  remainingHours,
  userAvatarUrl,
  reservationDates,
  listingName,
}) => {
  // hooks
  const { t } = useTranslation();

  const parseRemainingTimeToSeconds = (value?: string | null): number => {
    if (!value) return 0;

    const normalized = String(value).trim();
    const timeMatch = normalized.match(/(\d{1,2}):(\d{1,2}):(\d{1,2})/);

    if (!timeMatch) return 0;

    const hours = Number(timeMatch[1]);
    const minutes = Number(timeMatch[2]);
    const seconds = Number(timeMatch[3]);

    if ([hours, minutes, seconds].some((part) => Number.isNaN(part))) return 0;

    return Math.max(0, hours * 3600 + minutes * 60 + seconds);
  };

  const formatSecondsToHHMMSS = (totalSeconds: number): string => {
    const safeSeconds = Math.max(0, totalSeconds);
    const hours = Math.floor(safeSeconds / 3600)
      .toString()
      .padStart(2, '0');
    const minutes = Math.floor((safeSeconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const seconds = Math.floor(safeSeconds % 60)
      .toString()
      .padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  };

  const initialSeconds = useMemo(
    () => parseRemainingTimeToSeconds(remainingHours ?? null),
    [remainingHours]
  );
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const intervalId = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [secondsLeft]);

  const liveRemainingTime = formatSecondsToHHMMSS(secondsLeft);

  return (
    <Paper
      elevation={0}
      sx={{
        width: { xs: '100%', sm: 300, md: 300 },
        minWidth: { sm: 300, md: 300 },
        maxWidth: '100%',
        height: '100%', 
        minHeight: 340,
        padding: 4,
        borderRadius: 4,
        border: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            bgcolor: '#FFEDCC',
            color: '#CC8A00',
            padding: '6px 14px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            borderRadius: '20px',
          }}
        >
          <AccessTimeIcon sx={{ fontSize: 22, color: '#CC8A00' }} />
          <Box display={'flex'} flexDirection={'column'} lineHeight={1}>
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#CC8A00' }}>
                {t('reservationCard.timeLeft')} {liveRemainingTime}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Avatar
        src={userAvatarUrl || jomWhite}
        alt={t('reservationCard.userAvatarAlt')}
        sx={{
          width: { xs: 80, md: 80 },
          height: { xs: 80, md: 80 },
          mb: 2,
          border: '3px solid white',
          boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
          bgcolor: theme.palette.customColors.primary[1],
        }}
      />
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flexGrow: 1, 
          justifyContent: 'space-between', 
          width: '100%' 
        }}
      >
        <Box>
      <Typography sx={{ fontSize: '1rem', fontWeight: '800', mb: 0.5 }}>
        {t('reservationCard.requestTitle')}
      </Typography>
      <Typography
        color="text.secondary"
        sx={{ fontSize: '0.9rem', fontWeight: '400', mb: 1, lineHeight: 1.2 }}
      >
        {reservationDates}
      </Typography>
      </Box>
      <Typography
        color={theme.palette.text.secondary}
          sx={{ 
            fontSize: '0.9rem', 
            fontWeight: '400', 
            lineHeight: 1.2,
            mt: 'auto'
          }}
      >
        {listingName}
      </Typography>
      </Box>
    </Paper>
  );
};

export default ReservationRequestCard;
