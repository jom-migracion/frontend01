import Jom from '@/assets/LogoJOM-BLANCO.svg';
import React from 'react';
import { Avatar, Box, Card, Chip, Divider, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

interface HostCardProps {
  hostId: string | number;
  ownerUserId?: string;
  listingRentId: string | number;
  photo: string;
  name: string;
  lastName: string;
  registerDateMonths: number | string;
  rating?: number;
  countReviews?: number;
  isDocumentVerified?: boolean;
  handleRouteLink?: (path: string) => void;
}

const ProfileHostInfo: React.FC<HostCardProps> = ({
  hostId,
  listingRentId,
  photo,
  name,
  lastName,
  registerDateMonths,
  rating,
  countReviews,
  handleRouteLink,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const location = useLocation();
  const isHostRoute = location.pathname.includes('/host/');

  return (
    <Card
      elevation={0}
      onClick={() => hostId && handleRouteLink?.(`/show-profile/${hostId}/${listingRentId}`)}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        backgroundColor: '#ffffff',
        borderRadius: 6,
        p: { xs: 2.5, sm: 3, md: 5 },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.08)',
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

      {/* Layout: avatar+nombre centrado a la izquierda, stats a la derecha */}
      <Box display="flex" height="100%" justifyContent="center">
        {/* Sección Izquierda: Avatar, Nombre y Chip */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{ position: 'relative', zIndex: 1 }}
        >
          <Box
            sx={{
              position: 'relative',
              width: { xs: 130, md: 170 },
              height: { xs: 130, md: 170 },
              mb: 1.5,
            }}
          >
            <Avatar
              alt={`${name} ${lastName}`}
              src={photo}
              sx={{
                width: '100%',
                height: '100%',
                border: '6px solid rgba(255,255,255,0.1)',
                boxShadow: '0 0 20px rgba(0,0,0,0.2)',
              }}
            />
            {
              <div
                style={{
                  position: 'absolute',
                  bottom: 4,
                  right: -4,
                  width: 48,
                  height: 58,
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
                >
                  <path
                    d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z"
                    fill="white"
                  />
                  <path
                    d="M12 2.5L5 6V11C5 15.52 8.02 19.69 12 20.93C15.98 19.69 19 15.52 19 11V6L12 2.5Z"
                    fill="#5B55C8"
                  />
                  <path
                    d="M10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.59L10 14.17Z"
                    fill="white"
                  />
                </svg>
              </div>
            }
          </Box>
          <Typography
            sx={{
              fontWeight: 600,
              textAlign: 'center',
              letterSpacing: '-0.02em',
              fontSize: { xs: '0.9rem', md: '1.05rem' },
              lineHeight: 1.2,
              color: theme.palette.text.primary,
              mb: 0.5,
            }}
          >
            {name} {lastName}
          </Typography>
          <Chip
            //label="Anfitrión"
            label={isHostRoute ? 'Huésped' : 'Anfitrión'}
            size="medium"
            sx={{
              mt: 1,
              backgroundColor: '#EFEEFF',
              color: theme.palette.primary.main,
              fontWeight: 500,
              fontSize: { xs: '0.72rem', md: '0.85rem' },
              borderRadius: '20px',
              height: 'auto',
              px: 0.5,
              '& .MuiChip-label': { px: 1.5, py: 0.4 },
            }}
          />
        </Box>
        {/* Sección Derecha: Estadísticas */}
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="flex-start"
          width="45%"
          pl={4.5}
          sx={{ position: 'relative', zIndex: 1 }}
        >
          <StatItem value={countReviews ?? '—'} label={t('hostInfoCard.review')} />
          <StatItem
            value={rating !== undefined ? `${rating} ★` : '—'}
            label={t('hostInfoCard.score')}
          />
          <StatItem
            value={registerDateMonths ?? '—'}
            label={t('hostInfoCard.monthsOnPlatform')}
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
  isLast = false,
}: {
  value: string | number;
  label: string;
  isLast?: boolean;
}) => {
  const theme = useTheme();
  return (
    <Box sx={{ mb: isLast ? 0 : { xs: 1.5, sm: 2.5 } }}>
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: { xs: '1.2rem', sm: '1.6rem', md: '1.8rem' },
          lineHeight: 1,
          color: theme.palette.text.primary,
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: '0.6rem', sm: '0.7rem' },
          // textTransform: 'uppercase',
          mt: 0.5,
          fontWeight: 600,
          opacity: 0.7,
          color: theme.palette.text.primary,
        }}
      >
        {label}
      </Typography>
      {!isLast && (
        <Divider
          sx={{
            mt: { xs: 1, sm: 1.2 },
            width: { xs: '100px', sm: '100px' },
            borderColor: theme.palette.divider,
            borderWidth: '1.5px',
          }}
        />
      )}
    </Box>
  );
};

export default ProfileHostInfo;
