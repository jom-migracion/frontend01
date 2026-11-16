import Jom from '@/assets/LogoJOM-BLANCO.svg';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, Avatar, Typography, Divider, useTheme } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

interface HostCardProps {
  hostId: string | number;
  listingRentId?: string | number;
  photo?: string;
  name?: string;
  lastName?: string;
  registerDateMonths?: number | string;
  rating?: number;
  countReviews?: number;
}

const HostProfileInfo: React.FC<HostCardProps> = ({
  hostId,
  listingRentId,
  photo,
  name,
  lastName,
  registerDateMonths,
  rating,
  countReviews,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClick = () => {
    if (hostId) {
      navigate(`/show-profile/${hostId}/${listingRentId}`);
    }
  };

  return (
    <Card
      elevation={0}
      onClick={handleClick}
      sx={{
        cursor: 'pointer',
        backgroundColor: theme.palette.background.default,
        p: { xs: 3, md: 5 },
        borderRadius: 6,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        transition: 'box-shadow 0.2s',
        '&:hover': {
          boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
        },
      }}
    >
      {/* Logo de fondo sutil */}
      <Box
        component="img"
        src={Jom}
        sx={{
          position: 'absolute',
          right: -20,
          bottom: -20,
          width: 150,
          opacity: 0.1,
          filter: 'grayscale(1)',
          pointerEvents: 'none',
        }}
      />

      <Box display="flex" alignItems="center" height="100%">
        {/* Sección Izquierda: Avatar y Nombre */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width="55%"
          sx={{ position: 'relative', zIndex: 1 }}
        >
          <Avatar
            alt={`${name} ${lastName}`}
            src={photo}
            sx={{
              width: { xs: 90, sm: 130, md: 170 },
              height: { xs: 90, sm: 130, md: 170 },
              border: '6px solid rgba(255,255,255,0.1)',
              boxShadow: '0 0 20px rgba(0,0,0,0.2)',
              mb: 2.5,
            }}
          />
          <Typography
            sx={{
              fontWeight: 600,
              textAlign: 'center',
              letterSpacing: '-0.02em',
              fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.35rem' },
              lineHeight: 1.2,
              color: theme.palette.text.primary,
            }}
          >
            {name} {lastName}
          </Typography>
        </Box>

        {/* Sección Derecha: Estadísticas */}
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="flex-start"
          width="45%"
          pl={{ xs: 1.5, sm: 2.5 }}
          sx={{ position: 'relative', zIndex: 1 }}
        >
          <StatItem value={countReviews ?? '—'} label={t('hostInfoCard.review')} theme={theme} />
          <StatItem
            value={rating !== undefined ? `${rating} ★` : '—'}
            label={t('hostInfoCard.score')}
            theme={theme}
          />
          <StatItem
            value={registerDateMonths ?? '—'}
            label={t('hostInfoCard.monthsOnPlatform')}
            theme={theme}
            isLast
          />
        </Box>
      </Box>
    </Card>
  );
};

const StatItem = ({
  value,
  label,
  theme,
  isLast = false,
}: {
  value: string | number;
  label: string;
  theme: Theme;
  isLast?: boolean;
}) => (
  <Box sx={{ mb: isLast ? 0 : 2.5 }}>
    <Typography
      sx={{
        fontWeight: 900,
        fontSize: { xs: '1.3rem', sm: '1.6rem', md: '1.8rem' },
        lineHeight: 1,
        color: theme.palette.text.primary,
      }}
    >
      {value}
    </Typography>
    <Typography
      sx={{
        fontSize: { xs: '0.65rem', sm: '0.75rem' },
        opacity: 0.85,
        textTransform: 'uppercase',
        mt: 0.7,
        fontWeight: 600,
        color: theme.palette.text.primary,
      }}
    >
      {label}
    </Typography>
    {!isLast && (
      <Divider
        sx={{
          mt: 1.2,
          width: '50px',
          borderColor: 'rgba(255,255,255,0.3)',
          borderWidth: '1.5px',
        }}
      />
    )}
  </Box>
);

export default HostProfileInfo;
